import React, { useReducer, useState } from 'react'
import { GptIcon } from '../../assets'
import { Link, useNavigate } from 'react-router-dom'
import FormFeild from './FormFeild'
import { useDispatch } from 'react-redux'
import { insertUser } from '../../redux/user'
import instance from '../../config/instance'
import './style.scss'



const reducer = (state, { type, status }) => {
    switch (type) {
        case 'filled':
            return { filled: status }
        case 'error':
            return { error: status, filled: state.filled }
        default: return state
    }
}

const AdminComponent = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [state, stateAction] = useReducer(reducer, {
        filled: false,
        error: false
    })

    const [formData, setFormData] = useState({
        email: '',
        pass: '',
        manual: true
    })

    const handleInput = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const formHandle = async (e) => {
        e?.preventDefault()
        let res = null
        try {
            res = await instance.get('/api/user/login', {
                params: formData
            })
        } catch (err) {
            console.log(err)
            if (err?.response?.data?.status === 422) {
                stateAction({ type: 'error', status: true })
            }
        } finally {
            if (res?.data) {
                stateAction({ type: 'error', status: false })
                dispatch(insertUser(res.data.data))
                navigate('/admin/dashboard')
            }
        }
    }

    return (
        <div className='Contain'>
            <div className='icon'>
                <GptIcon />
            </div>

            <div>
                {!state.filled ? <h1>Welcome back admin</h1>
                        : <h1>Enter admin password</h1>}
            </div>
            {
                !state.filled ? (
                    <div className='options'>
                        <form className="manual" onSubmit={(e) => {
                            e.preventDefault()
                            if (formData.email === import.meta.env.VITE_ADMIN_ID){
                                stateAction({ type: 'filled', status: true })
                                stateAction({ type: 'error', status: false })
                            }
                            else {
                                stateAction({ type: 'filled', status: false })
                                stateAction({ type: 'error', status: true })
                            }
                            
                        }}>
                            <div>

                                <FormFeild
                                    value={formData.email}
                                    name={'email'}
                                    label={"Email address"}
                                    type={"email"}
                                    handleInput={handleInput}
                                />
                            </div>

                            <div>
                                {state?.error && <div className='error'><div>!</div> Enter admin email address</div>}
                            </div>

                            <div>
                                <button type='submit' >Continue</button>
                            </div>
                        </form>

                        <div data-for="acc-sign-up-login">
                            <span>Don't have an account?</span>
                            <Link to={'/signup'}>Sign up</Link>
                        </div>
                    </div>
                ) : (
                    <form className='Form' onSubmit={formHandle}>
                        <div>
                            <div className="email">
                                <button type='button' onClick={() => {
                                    stateAction({ type: 'filled', status: false })
                                }} >Edit</button>

                                <FormFeild
                                    value={formData.email}
                                    name={'email'}
                                    type={"email"}
                                    isDisabled />

                            </div>

                            <div className="password">

                                <FormFeild
                                    value={formData.pass}
                                    name={'pass'}
                                    label={"Password"}
                                    type={"password"}
                                    handleInput={handleInput}
                                    error={state?.error}
                                />

                            </div>

                            <div>
                                {state?.error && <div className='error'><div>!</div> Email or password wrong.</div>}
                            </div>

                            <button type='submit'>Continue</button>
                        </div>
                        <div data-for="acc-sign-up-login">
                            <span>Don't have an account?</span>
                            <Link to={'/signup'}>Sign up</Link>
                        </div>
                    </form>
                )
            }
        </div >
    )
}

export default AdminComponent

