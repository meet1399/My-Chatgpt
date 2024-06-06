import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { setLoading } from "../redux/loading";
import instance from "../config/instance";
import { Container, Grid, Paper, Typography, CircularProgress } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import "./style.scss";

const Dashboard = () => {
    const { user } = useSelector((state) => state);

    const [auth, setAuth] = useState(false);
    const [loading, setLoadingState] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);

    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
    if (user) {
        if (location?.pathname === "/admin/dashboard" ) {
            setAuth(true);
            fetchDashboardData();
        } else {
            setAuth(false);
            setLoadingState(false);
        }
        }
    }, [location]);

    const fetchDashboardData = async () => {
        try {
            const response = await instance.get("/api/chat/dashboard");
            if (response.data.status === 200) {
                setDashboardData(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoadingState(false);
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="main">
            <div className="contentArea">
            <Typography variant="h4" className="dashboard-text" gutterBottom>Admin Dashboard</Typography>
            {dashboardData && (
                <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <Paper className="dashboard-paper">
                        <Typography variant="h6" gutterBottom>Total Chats: {dashboardData.totalChats}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper className="dashboard-paper">
                        <Typography variant="h6" gutterBottom>Total Users: {dashboardData.totalUsers}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper className="dashboard-paper">
                        <Typography variant="h6" gutterBottom>Top Users</Typography>
                        {dashboardData.topUsers.map((user, index) => (
                            <Typography key={index}>{user.fName} {user.lName} ({user.email})</Typography>
                        ))}
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper className="dashboard-paper">
                        <Typography variant="h6" gutterBottom>Average Response Time: {dashboardData.averageResponseTime} seconds</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper className="dashboard-paper dashboard-chart-container">
                        <Typography variant="h6" gutterBottom>Daily Chat Volume</Typography>
                    <BarChart width={window.innerWidth < 600 ? 300 : 400} height={window.innerWidth < 600 ? 300 : 400} data={dashboardData.dailyChatVolume}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="_id" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper className="dashboard-paper dashboard-chart-container">
                    <Typography variant="h6" gutterBottom>Message Distribution</Typography>
                    <PieChart width={window.innerWidth < 600 ? 300 : 400} height={window.innerWidth < 600 ? 300 : 400}>
                        <Pie
                        data={[
                            { name: "Prompts", value: dashboardData.messageDistribution.prompts },
                            { name: "Contents", value: dashboardData.messageDistribution.contents }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={window.innerWidth < 600 ? 80 : 100}
                        fill="#8884d8"
                        label
                        >
                        <Cell key="prompts" fill="#8884d8" />
                        <Cell key="contents" fill="#82ca9d" />
                        </Pie>
                        <Tooltip />
                    </PieChart>
                    </Paper>
                </Grid>
                </Grid>
            )}
            </div>
        </div>
    );
};

export default Dashboard;
