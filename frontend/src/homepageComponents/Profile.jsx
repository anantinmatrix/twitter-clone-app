import axios from 'axios';
import Tweet from '../components/Tweet';
import './css/Profile.css'
import { API_BASE_URL } from '../env';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import EditProfileImagesModal from '../components/EditProfileImagesModal';
import EditCoverImagesModal from '../components/EditCoverImagesModal';
import { showNotification } from '../redux/slices/notificationSlice';
import { login } from '../redux/slices/loginSlice';
import User from './User';

const Profile = () => {
    let [userPosts, setuserPosts] = useState([])
    let [userInfo, setuserInfo] = useState({})
    let [profileBody, setprofileBody] = useState('Posts')
    let [loading, setloading] = useState(false)
    let [profileImg, setprofileImg] = useState(null)
    let [coverImg, setcoverImg] = useState(null)
    // Open edit modals
    let [showProfileImageModal, setshowProfileImageModal] = useState(false)
    let [showCoverImageModal, setshowCoverImageModal] = useState(false)



    const loginSelector = useSelector((state) => state.loginSlice)
    const admin = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // Function to fetch user's posts
    const getUserPosts = () => {
        axios.get(`${API_BASE_URL}/api/user/userposts/${admin._id}`)
            .then((res) => {
                setuserPosts(res.data.tweets)
                setuserInfo(res.data.user)
                dispatch(login({user: res.data.user, token: token}))
                setloading(false)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function getUserInfo(){
        axios.get(`${API_BASE_URL}/api/user/userinfo/${admin._id}`)
        .then((res)=>{
            setuserInfo(res.data.user)
        })
        .catch((err)=>{})
    }

    // Functions to edit user
    function editProfileImage() {
        let formData = new FormData();
        formData.append('profileImg', profileImg)
        axios.put(`${API_BASE_URL}/api/user/updateimg`, formData, { headers: { "Authorization": `Bearer ${token}` } })
            .then((res) => {
                console.log(res.data)
                dispatch(showNotification({ type: 'success', content: res.data.message }))
            })
            .then(() => {
                getUserPosts()
            })
            .catch((err) => {
                console.log(err)
            })
    }
    function editCoverImage() {
        let formData = new FormData();
        formData.append('coverImg', coverImg)
        axios.put(`${API_BASE_URL}/api/user/updateimg`, formData, { headers: { 'Authorization': `Bearer ${token}` } })
            .then((res) => {
                console.log(res.data)
                dispatch(showNotification({ type: 'success', content: 'Updated cover image' }))
            })
        console.log('cover image uploaded')
    }

    function getProfileImage(image) {
        setprofileImg(image)
        return image
    }
    function getCoverImage(image) {
        setcoverImg(image)
        return image
    }

    const userSection = (e) => {
        setprofileBody(e.target.textContent)
    }

    // Functions to open modals
    function openEditProfileModal() {
        setshowProfileImageModal(!showProfileImageModal)
    }
    function openEditCoverModal() {
        setshowCoverImageModal(!showCoverImageModal)
    }
    // 

    useEffect(() => {
        getUserInfo()
        getUserPosts()
        setloading(true)
        document.body.style.overflowY = 'scroll'
    }, [])

    useEffect(() => {
        if (showProfileImageModal) {
            document.body.style.overflowY = 'hidden'
        } else {
            document.body.style.overflowY = 'scroll'
        }
    }, [showProfileImageModal, setshowProfileImageModal])





    // 
    // HTML Return starts from here
    // 
    if (!userPosts[0]) {
        return <div className="profileLoader">
            <LoadingSpinner />
            <p>Loading...</p>
        </div>
    } else {
        return (
            <>
                <div id="profile">
                    {/* Navigate back and username and post shown here on the first section */}
                    <div id="profileTopSection" className='mb-3 d-flex gap-4'>
                        <div onClick={() => navigate(-1)} className="backBtn">
                            <i className="fa-solid fa-arrow-left"></i>
                        </div>
                        <div className="nameSection">
                            <h5 className='m-0'>{userInfo.name}</h5>
                            <p className='m-0'>{userPosts.length > 1 ? `${userPosts.length} Posts` : `${userPosts.length} Post`}</p>
                        </div>
                    </div>
                    {/* Profile images Section */}
                    <div id="profileImgSection" className='mb-0'>
                        <div className="coverImg">
                            <img src={userInfo.userDetails ? userInfo.userDetails.coverImg : ""} alt="user's_cover_img" />
                            <div className="username">
                                <h4>{userInfo.name}</h4>
                            </div>
                            <button onClick={openEditCoverModal} className="editCoverImageBtn">
                                <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button onClick={() => { navigate('/app/editprofile') }} className="editUserProfile">
                                Edit
                            </button>
                        </div>
                        <div className="profileImg">
                            <img src={userInfo.userDetails ? userInfo.userDetails.profileImg : ""} alt="user's_profile_img" />
                            <button onClick={openEditProfileModal} type='button' className="editProfileImageBtn">
                                <i className='fa-solid fa-pen-to-square' />
                            </button>
                        </div>
                    </div>
                    {/* User's sections and bio will be shown here */}
                    <div id="userProfileSections" className='mb-3'>
                        <span onClick={(e) => userSection(e)} className="userProfileSection">Posts</span>
                        <span onClick={(e) => userSection(e)} className="userProfileSection">About</span>
                        <span onClick={(e) => userSection(e)} className="userProfileSection">Followers</span>
                        <span onClick={(e) => userSection(e)} className="userProfileSection">Followings</span>
                    </div>
                    {/* User's profile body section starts from here */}
                    <div id="userProfileBody">
                        {profileBody === 'Posts' ? <div id="userPosts">
                            {userPosts.map((post) => {
                                return (
                                    <Tweet
                                        key={post._id}
                                        post={post}
                                        updatePosts={getUserPosts}
                                    />
                                )
                            })}
                        </div> : null}
                        {profileBody === "About" ? <div id='userAbout'>
                            <p>Age : {userInfo.userDetails.age} years old</p>
                            <p>Phone no. : {userInfo.userDetails.phoneNo}</p>
                            <p>Location : {userInfo.userDetails.location}</p>
                            <p>Bio : <span className='text-white-50'>{userInfo.userDetails.bio || 'Add bio'}</span></p>

                        </div> : null}
                        {profileBody === "Followers" ? <div id='userFollowers'>
                            {userInfo.followers.map((follower) => {
                                return (
                                    <div key={follower._id} className='d-flex align-items-center justify-content-between mb-2'>
                                        <span className='d-flex align-items-center gap-2'>
                                            <img src={follower.userDetails.profileImg} alt="" style={{ height: '50px', width: '50px', objectFit: 'cover', borderRadius: '200px' }} />
                                            {follower.name}
                                        </span>
                                        <button className='btn btn-primary p-1'>Remove</button>
                                    </div>
                                )
                            })}
                        </div> : null}
                        {profileBody === "Followings" ? <div id='userFollowings'>
                            {userInfo.following.map((following) => {
                                return (
                                    <div key={following._id} className='d-flex align-items-center justify-content-between'>
                                        <span className='d-flex align-items-center gap-2'>
                                            <img src={following.userDetails.profileImg} alt="" style={{ height: '50px', width: '50px', objectFit: 'cover', borderRadius: '200px' }} />
                                            {following.name}
                                        </span>
                                        <button className='btn btn-primary p-1'>Unfollow</button>
                                    </div>
                                )
                            })}
                        </div> : null}
                    </div>
                </div>
                <EditProfileImagesModal
                    show={showProfileImageModal}
                    closeFunction={() => setshowProfileImageModal(false)}
                    sendImage={getProfileImage}
                    editImageFunction={editProfileImage}
                />
                <EditCoverImagesModal
                    show={showCoverImageModal}
                    closeFunction={() => setshowCoverImageModal(false)}
                    sendImage={getCoverImage}
                    editImageFunction={editCoverImage}
                />
            </>
        )
    }
}

export default Profile;