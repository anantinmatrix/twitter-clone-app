import { useEffect, useState } from "react";
import "./css/Register.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios'
import { showNotification } from "../redux/slices/notificationSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import { API_BASE_URL } from "../env";

function CreateUsername() {
    const dispatch = useDispatch()
    const [username, setusername] = useState("")
    let [formData, setformData] = useState({})
    const navigate = useNavigate()
    const selector = useSelector((state) => state.registerFormData)
    const [success, setsuccess] = useState(false)
    const [loading, setloading] = useState(false)


    function handleRegister(e) {
        e.preventDefault();
        setloading(true)
        try {
            axios.post(`${API_BASE_URL}/api/user/register`, formData)
                .then((res) => {
                    console.log(res);
                    dispatch(showNotification({ type: 'success', content: res.data.message }))
                    setsuccess(true)
                    setloading(false)
                }).then(() => {
                    setloading(false)
                    setusername('');
                    setformData({});
                    navigate('/login');
                    setsuccess(false)
                })
        } catch (error) {
            dispatch(showNotification({ type: 'failed', content: error.response.data.message }))
            console.log(error);

        }

    }

    useEffect(() => {
        setformData(selector.formData)
    }, [selector])


    return (
        <div className="registerPage container-fluid p-4 px-5">
            <div className="registerBody row">
                <div className="imgSection col-md-6 position-relative">
                    <div className="registerImage">
                        <img
                            src="/register_page.jpg"
                            alt="register_img"
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
                        <h3 className="registerFormHead mb-2">Create your account</h3>
                        <p className="registerFormPara mb-3">
                            Your privacy matters to us. We use advanced encryption to keep
                            your data safe and give you full control over who sees your
                            content.
                        </p>
                        <button className="registerGoogleBtn mt-3 mb-3">
                            <span>
                                <img src="/google_login_icon.png" alt="google_icon" height={'26px'} />
                            </span>
                            <span>Login with Google</span>
                        </button>
                        <h6 className="registerTxtOr">Or</h6>
                        <div className="formBody">

                            <form onSubmit={handleRegister}>
                                <div className="form-group mb-3">
                                    <label htmlFor="username">Username</label>
                                    <input type="text" name="username" id="username" placeholder="Enter username" value={username} onChange={(e) => { setusername(e.target.value); setformData({ ...formData, username: e.target.value }) }} />
                                </div>
                                <button type="submit" className="signUpBtn">
                                    {loading ? <LoadingSpinner /> : "Sign Up"}
                                </button>
                            </form>
                            <p className="mt-3 text-start">
                                Already have an account? <Link to={'/login'}>Log In</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateUsername;
