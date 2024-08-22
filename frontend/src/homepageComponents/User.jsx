import axios from 'axios';
import Tweet from '../components/Tweet';
import './css/Profile.css'
import './css/User.css'
import { API_BASE_URL } from '../env';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { showNotification } from '../redux/slices/notificationSlice';
import LoadingSpinner from '../components/LoadingSpinner';


function User() {
  let [userPosts, setuserPosts] = useState([])
  let [userInfo, setuserInfo] = useState({})
  let [profileBody, setprofileBody] = useState('Posts')
  let [isFollowing, setisFollowing] = useState(false)
  let [loading, setloading] = useState(false)


  const loginSelector = useSelector((state) => state.loginSlice)
  const admin = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')
  const id = useParams();
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const userSection = (e) => {
    setprofileBody(e.target.textContent)
    console.log(e.target.textContent)
  }

  // Function to fetch user's posts
  const getUserPosts = () => {
    axios.get(`${API_BASE_URL}/api/user/userposts/${id.id}`)
      .then((res) => {
        setuserPosts(res.data.tweets)
        setuserInfo(res.data.user)

      })
      .catch((err) => {
        console.log(err)
      })
  }

  // Function to follow or unfollow user
  function toggleFollowUser() {
    axios.put(`${API_BASE_URL}/api/user/follow/${id.id}`, {}, { headers: { 'Authorization': `Bearer ${token}` } })
      .then((res) => {
        dispatch(showNotification({ type: 'success', content: res.data.message }))
        if (res.data.message.includes('nfollow')) {
          setisFollowing(false)
        } else {
          setisFollowing(true)
        }
      }).then(() => {
        getUserPosts()
        setloading(false)
      })
      .catch((err) => {

      })
  }


  useEffect(() => {
    getUserPosts()
    setloading(true)
  }, [])

  useEffect(() => {
    if (userInfo.followers) {
      let user = userInfo.followers.find(user => user._id === admin._id)
      if (userInfo.followers.includes(user)) {
        setisFollowing(true)
      }
    } else {
      setisFollowing(false)
    }
  }, [userInfo, setuserInfo])

  if (!userPosts[0]) {
    return <div className="profileLoader">
      <LoadingSpinner />
      <p>Loading...</p>
    </div>
  } else {
    return (
      <div>
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
            <div className="followBtn">
              <button onClick={() => { toggleFollowUser(); }} className='btn'>{isFollowing ? 'Unfollow' : 'Follow'}</button>
            </div>
          </div>
          <div className="profileImg">
            <img src={userInfo.userDetails ? userInfo.userDetails.profileImg : ""} alt="user's_profile_img" />
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
                  updatePostFunction={getUserPosts}
                />
              )
            })}
          </div> : null}
          {profileBody === "About" ? <div id='userAbout'>
            <p>Age : {userInfo.userDetails.age} years old</p>
            <p>Phone no. : {userInfo.userDetails.phoneNo}</p>
            <p>Location : {userInfo.userDetails.location}</p>
            <p>Bio : <span className='text-primary'>{userInfo.userDetails.bio}</span></p>
          </div> : null}
          {profileBody === "Followers" ? <div id='userFollowers'>
            {userInfo.followers.map((follower) => {
              return (
                <div key={follower._id} className='d-flex align-items-center justify-content-between'>
                  <span className='d-flex align-items-center gap-2'>
                    <img src={follower.userDetails.profileImg} alt="" style={{ height: '50px', width: '50px', objectFit: 'cover', borderRadius: '200px' }} />
                    {follower.name}
                  </span>
                  <button className='btn btn-primary p-1'>{userInfo.followers.includes(follower._id) ? 'unfollow' : 'follow'}</button>
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
    )
  }
}

export default User;