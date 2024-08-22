import { useState ,useEffect} from "react";
import "./css/Register.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import { setFormData } from "../redux/slices/registerFormSlice";
import { showNotification } from "../redux/slices/notificationSlice";
import ErrorPage from "./ErrorPage";
function Register() {
  const [seePassword, setseePassword] = useState(false);
  const [preSignUp, setpreSignUp] = useState(false);
  const [formData, setformData] = useState({})
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const loginSelector = useSelector((state) => state.loginSlice)

  function toggleSeePassword() {
    setseePassword(!seePassword);
  }
  const handleInputChange = (e) => {
    setformData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }
  function handleNextBtn(e) {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill all the fields")
      return
    }
    dispatch(setFormData(formData))
    setpreSignUp(true)
    navigate('/createusername')

  }

  useEffect(() => {
    if (loginSelector.isLogin === true) {
      console.log('hitting register fail condition')
        dispatch(showNotification({ type: 'failed', content: 'wrong path' }))
        const loginTimeout = setTimeout(() => {
            navigate('/home')
        }, 3000)

        return () => {
            clearTimeout(loginTimeout)
        }
    }
}, [])

if(loginSelector.isLogin === false){
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
            <p className="position-absolute">
              Track your activity and engagement with detailed insights.
            </p>
          </div>
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
              <form onSubmit={handleNextBtn}>
                <div className="form-group mb-3">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" placeholder="Enter your name" onChange={(e) => handleInputChange(e)} />
                </div>
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
                <button className="nextBtn" type="submit">
                  Next
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
  );}else{
    return(
      <ErrorPage/>
    )
  }
}

export default Register;
