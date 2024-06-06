import { db } from "../db/connection.js";
import collections from "../db/collections.js";
import { ObjectId } from "mongodb";

export default {
    newResponse: (prompt, { openai }, userId, responseTime) => {
        return new Promise(async (resolve, reject) => {
            let chatId = new ObjectId().toHexString()
            let res = null
            try {
                await db.collection(collections.CHAT).createIndex({ user: 1 }, { unique: true })
                res = await db.collection(collections.CHAT).insertOne({
                    user: userId.toString(),
                    data: [{
                        chatId,
                        chats: [{
                            prompt,
                            content: openai,
                            responseTime
                        }]
                    }]
                })
            } catch (err) {
                if (err?.code === 11000) {
                    res = await db.collection(collections.CHAT).updateOne({
                        user: userId.toString(),
                    }, {
                        $push: {
                            data: {
                                chatId,
                                chats: [{
                                    prompt,
                                    content: openai
                                }]
                            }
                        }
                    }).catch((err) => {
                        reject(err)
                    })
                } else {
                    reject(err)
                }
            } finally {
                if (res) {
                    res.chatId = chatId
                    resolve(res)
                } else {
                    reject({ text: "DB gets something wrong" })
                }
            }
        })
    },
    updateChat: (chatId, prompt, { openai }, userId, responseTime) => {
        return new Promise(async (resolve, reject) => {
            let res = await db.collection(collections.CHAT).updateOne({
                user: userId.toString(),
                'data.chatId': chatId
            }, {
                $push: {
                    'data.$.chats': {
                        prompt,
                        content: openai,
                        responseTime
                    }
                }
            }).catch((err) => {
                reject(err)
            })

            if (res) {
                resolve(res)
            } else {
                reject({ text: "DB gets something wrong" })
            }
        })
    },
    getChat: (userId, chatId) => {
        return new Promise(async (resolve, reject) => {
            let res = await db.collection(collections.CHAT).aggregate([
                {
                    $match: {
                        user: userId.toString()
                    }
                }, {
                    $unwind: '$data'
                }, {
                    $match: {
                        'data.chatId': chatId
                    }
                }, {
                    $project: {
                        _id: 0,
                        chat: '$data.chats'
                    }
                }
            ]).toArray().catch((err) => [
                reject(err)
            ])

            if (res && Array.isArray(res) && res[0]?.chat) {
                resolve(res[0].chat)
            } else {
                reject({ status: 404 })
            }
        })
    },
    getHistory: (userId) => {
        return new Promise(async (resolve, reject) => {
            let res = await db.collection(collections.CHAT).aggregate([
                {
                    $match: {
                        user: userId.toString()
                    }
                }, {
                    $unwind: '$data'
                }, {
                    $project: {
                        _id: 0,
                        chatId: '$data.chatId',
                        prompt: {
                            $arrayElemAt: ['$data.chats.prompt', 0]
                        }
                    }
                }, {
                    $limit: 10
                }, {
                    $sort: {
                        chatId: -1
                    }
                }
            ]).toArray().catch((err) => {
                reject(err)
            })

            if (Array.isArray(res)) {
                resolve(res)
            } else {
                reject({ text: "DB Getting Some Error" })
            }
        })
    },
    deleteAllChat: (userId) => {
        return new Promise((resolve, reject) => {
            db.collection(collections.CHAT).deleteOne({
                user: userId.toString()
            }).then((res) => {
                if (res?.deletedCount > 0) {
                    resolve(res)
                } else {
                    reject({ text: 'DB Getting Some Error' })
                }
            }).catch((err) => {
                reject(err)
            })
        })
    },
    getStats: () => {
        return new Promise(async (resolve, reject) => {
            try {
                const users = await db.collection(collections.CHAT).find().toArray();
                const stats = {};
    
                // Get Total Chats
                const totalChats = users.reduce((acc, user) => acc + user.data.reduce((sum, chatData) => sum + chatData.chats.length, 0), 0);
                stats.totalChats = totalChats;
    
                // Get Total Users
                stats.totalUsers = users.length;
    
                // Get Top Users
                const topUserIds = users
                    .map(user => ({
                        userId: user.user,
                        totalChats: user.data.reduce((sum, chatData) => sum + chatData.chats.length, 0)
                    }))
                    .sort((a, b) => b.totalChats - a.totalChats)
                    .slice(0, 5)
                    .map(user => new ObjectId(user.userId));
    
                const topUsers = await db.collection(collections.USER).find({ _id: { $in: topUserIds } }, { projection: { _id:0, email: 1, fName: 1, lName: 1 } }).toArray();
                stats.topUsers = topUsers;
    
                // Get Daily Chat Volume
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

                const dailyChatVolume = [];
                users.forEach(user => {
                    user.data.forEach(chatData => {
                        chatData.chats.forEach(chat => {
                            const chatDate = new Date(user._id.getTimestamp());
                            if (chatDate >= sevenDaysAgo) {
                                const date = chatDate.toISOString().split('T')[0];
                                const existing = dailyChatVolume.find(entry => entry._id === date);
                                if (existing) {
                                    existing.count++;
                                } else {
                                    dailyChatVolume.push({ _id: date, count: 1 });
                                }
                            }
                        });
                    });
                });
                dailyChatVolume.sort((a, b) => new Date(a._id) - new Date(b._id));
                stats.dailyChatVolume = dailyChatVolume;

    
                // Get Message Distribution
                const prompts = users.reduce((acc, user) => acc + user.data.reduce((sum, chatData) => sum + chatData.chats.filter(chat => chat.prompt).length, 0), 0);
                const contents = users.reduce((acc, user) => acc + user.data.reduce((sum, chatData) => sum + chatData.chats.filter(chat => chat.content).length, 0), 0);
                stats.messageDistribution = { prompts, contents };
    
                // Get Average Response Time
                let totalResponseTime = 0;
                let responseCount = 0;
                users.forEach(user => {
                    user.data.forEach(chatData => {
                        const chats = chatData.chats;
                        
                        for (const chat of chats) {
                            if (chat.responseTime) {
                                totalResponseTime += chat.responseTime;
                                responseCount++;
                            }
                        }
                    });
                });
                const averageResponseTime = responseCount > 0 ? totalResponseTime / responseCount : 0; // in milliseconds
                stats.averageResponseTime = Math.round((averageResponseTime / 1000) * 100) / 100; // in seconds 
                resolve(stats);
            } catch (err) {
                reject(err);
            }
        });
    }
}