import AppNotifications from '../homepageComponents/AppNotifications';
import Home from '../homepageComponents/Home';
import User from '../homepageComponents/User';
import Profile from '../homepageComponents/Profile';
import './css/Homepage.css'
import { Routes, Route, Link,useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/loginSlice.js';
import Saved from '../homepageComponents/Saved.jsx';
import SingleTweetPage from '../homepageComponents/SingleTweetPage.jsx';
import EditProfile from '../homepageComponents/EditProfile.jsx';
import Chatroom from '../homepageComponents/Chatroom.jsx';
import ChatBox from '../homepageComponents/ChatBox.jsx';
import FollowingSection from '../homepageComponents/FollowingSection.jsx';



const Homepage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const logOut = ()=>{
        dispatch(logout())
        navigate('/login')
    }

    return (
        <>
            <div id="homepage">
                <div id="navigationBar" className='position-fixed'>
                    <div className="logo mt-2">
                        <img src="/Logo.png" alt="logo_img" />
                    </div>
                    <div id="iconList">
                        <ul>
                            <Link to={'/app/home'} className='text-decoration-none text-white'><li><img src="/navigationIcons/homepage.png" alt="" /> <p>Home</p></li></Link>
                            <Link to={'/app/profile'} className='text-decoration-none text-white'><li><img src="/navigationIcons/user.png" alt="" /> <p>Profile</p></li></Link>
                            <Link to={'/app/chatroom'} className='text-decoration-none text-white'><li><img src="/navigationIcons/messages.png" alt="" /> <p>Messages</p></li></Link>
                            <Link to={'/app/notifications'} className='text-decoration-none text-white'><li><img src="/navigationIcons/notifications.png" alt="" /> <p>Notifications</p></li></Link>
                            <Link to={'/app/savedposts'} className='text-decoration-none text-white'><li><img src="/navigationIcons/saved.png" alt="" /> <p>Saved</p></li></Link>
                        </ul>
                    </div>
                    <div id="navigationUtility">
                        <ul>
                            <Link onClick={logOut} to={'/'} className='text-decoration-none text-white'><li><img src="/navigationIcons/logout.png" alt="" /> <p>Logout</p></li></Link>
                        </ul>
                    </div>
                </div>
                <div id="mobileNavigationBar">
                    <div id="iconList">
                    <ul>
                            <Link to={'/app/home'} className='text-decoration-none text-white'><li><img src="/navigationIcons/homepage.png" alt="" /> <p>Home</p></li></Link>
                            <Link to={'/app/profile'} className='text-decoration-none text-white'><li><img src="/navigationIcons/user.png" alt="" /> <p>Profile</p></li></Link>
                            <Link to={'/app/chatroom'} className='text-decoration-none text-white'><li><img src="/navigationIcons/messages.png" alt="" /> <p>Messages</p></li></Link>
                            <Link to={'/app/notifications'} className='text-decoration-none text-white'><li><img src="/navigationIcons/notifications.png" alt="" /> <p>Notifications</p></li></Link>
                            <Link to={'/app/savedposts'} className='text-decoration-none text-white'><li><img src="/navigationIcons/saved.png" alt="" /> <p>Saved</p></li></Link>
                        </ul>
                    </div>
                </div>

                <div id="homepageData">
                    <Routes path='/*'>
                        <Route path='/' element={<Home />} />
                        <Route path={'/home'} element={<Home />} />
                        <Route path='/followingtweets' element={<Home/>}/>
                        <Route path='/notifications' element={<AppNotifications />} />
                        <Route path={`/users/:id`} element={<User/>}/>
                        <Route path='/profile' element={<Profile/>}/>
                        <Route path='/savedposts' element={<Saved/>}/>
                        <Route path='/singlepost/:postId' element={<SingleTweetPage/>}/>
                        <Route path='/editprofile' element={<EditProfile/>}/>
                        <Route path={'/chatroom'} element={<Chatroom />}/>
                        <Route path={'/chatroom/chat/:userId'} element={<ChatBox />}/>

                    </Routes>
                </div>

            </div>
        </>
    )
}

export default Homepage;