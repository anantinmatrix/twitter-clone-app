import axios from 'axios';
import './css/Login.css'
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../env';
import { useDispatch, useSelector } from 'react-redux';
import { showNotification } from '../redux/slices/notificationSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import { login } from '../redux/slices/loginSlice';
import ErrorPage from './ErrorPage';


function Login() {
    const [seePassword, setseePassword] = useState(false);
    const [formData, setformData] = useState({})
    const dispatch = useDispatch()
    const loginSelector = useSelector((state) => state.loginSlice)
    let [loading, setloading] = useState(false)
    const navigate = useNavigate()

    function toggleSeePassword() {
        setseePassword(!seePassword);
    }

    const handleInputChange = (e) => {
        setformData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    const handleLogin = (e) => {
        e.preventDefault();
        setloading(true)
        axios.post(`${API_BASE_URL}/api/user/login`, formData)
            .then((res) => {
                if (res.status === 200 || res.status === 201) {
                    dispatch(showNotification({ type: 'success', content: res.data.message }))
                    dispatch(login({ token: res.data.token, user: res.data.user }))
                    setloading(false)
                }
                navigate('/app')
            })
            .catch((err) => {
                dispatch(showNotification({ type: 'failed', content: err.response.data.message }))
                setloading(false)
            })
        setloading(false)
    }
    useEffect(() => {
        if (loginSelector.isLogin === true) {
            dispatch(showNotification({ type: 'failed', content: 'wrong path' }))
            const loginTimeout = setTimeout(() => {
                navigate('/app')
            }, 3000)

            return () => {
                clearTimeout(loginTimeout)
            }
        }
    }, [])

    if (loginSelector.isLogin === false) {
        return (
            <div className="loginPage container-fluid p-4 px-5">
                <div className="loginBody row">
                    <div className="loginImgSection col-md-6 position-relative">
                        <div className="loginImage">
                            <img
                                src="/register_page.jpg"
                                alt="login_img"
                                style={{ width: "100%", objectFit: "cover" }}
                            />
                        </div>
                        <p className="position-absolute">
                            Track your activity and engagement with detailed insights.
                        </p>
                    </div>
                    <div className="formSection col-md-6 d-flex align-items-center justify-content-center">
                        <div className="formSectionBox d-flex flex-column align-items-center text-center py-1">
                            <img className="mt-5 mb-4" src="/Logo.png" alt="logo" />
                            <h3 className="loginFormHead mb-2">Create your account</h3>
                            <p className="loginFormPara mb-3">
                                Your privacy matters to us. We use advanced encryption to keep
                                your data safe and give you full control over who sees your
                                content.
                            </p>
{/*                             <button className="loginGoogleBtn mt-3 mb-3">
                                <span>
                                    <img src="/google_login_icon.png" alt="google_icon" height={'26px'} />
                                </span>
                                <span>Login with Google</span>
                            </button>
                            <h6 className="loginTxtOr">Or</h6> */}
                            <div className="formBody">
                                <form onSubmit={handleLogin}>
                                    <div className="form-group mb-3">
                                        <label htmlFor="email">Email</label>
                                        <input
                                            type="text"
                                            id="email"
                                            placeholder="Enter your email"
                                            onChange={(e) => handleInputChange(e)}
                                        />
                                    </div>

                                    <div className="form-group mb-3">
                                        <label htmlFor="password">Password</label>
                                        <span className="inputPasswordSpan position-relative w-100">
                                            <input
                                                type={seePassword ? "text" : "password"}
                                                id="password"
                                                placeholder="Enter your password"
                                                onChange={(e) => handleInputChange(e)}
                                            />
                                            <button
                                                type="button"
                                                onClick={toggleSeePassword}
                                                className="seePasswordBtn"
                                                style={{ backgroundColor: "transparent", border: "none" }}
                                            >
                                                <img
                                                    src={seePassword ? "/see_password_active.svg" : "/see_password.svg"}
                                                    alt="see_password_icon"
                                                />
                                            </button>
                                        </span>
                                    </div>
                                    <p className="downPara">I agree to all Term, Privacy Policy</p>
                                    <button className="signUpBtn" type="submit">
                                        {loading ? <LoadingSpinner /> : 'Login'}
                                    </button>
                                </form>
                                <p className="mt-3 text-start">
                                    Don't have an account? <Link className='text-decoration-none' to={'/register'}>Sign Up</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <ErrorPage/>
        )
    }
}

export default Login
