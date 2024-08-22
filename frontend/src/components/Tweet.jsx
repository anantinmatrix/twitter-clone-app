import { useEffect, useRef, useState } from 'react';
import './css/NewTweet.css'
import axios from 'axios';
import { API_BASE_URL } from '../env';
import ReactPlayer from 'react-player';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showNotification } from '../redux/slices/notificationSlice';
import ReplyTweet from './ReplyTweet';
import DeleteModal from './DeleteModal';
import RetweetModal from './RetweetModal';



const Tweet = ({ post, updatePosts }) => {
    let [tweet, settweet] = useState(post)
    let [mimetype, setmimetype] = useState('')
    let [showOptions, setshowOptions] = useState(false);
    let [replyModal, setreplyModal] = useState(false);
    let [showRetweetModal, setshowRetweetModal] = useState(false)
    let [showDeleteModal, setshowDeleteModal] = useState(false);
    let [userInfo, setuserInfo] = useState(null)
    let [isTweetSaved, setisTweetSaved] = useState(false)
    let [postLike, setpostLike] = useState(false)
    let [likeCounts, setlikeCounts] = useState(post.likes && post.likes.length)
    let [repliesCount, setrepliesCount] = useState(post.replies && post.replies.length || 0)
    let [retweetCount, setretweetCount] = useState(post.retweets && post.retweets.length || 0)


    const dropdownRef = useRef()
    const dispatch = useDispatch()
    const token = localStorage.getItem('token');
    const admin = JSON.parse(localStorage.getItem('user'))
    const location = useLocation()
    const navigate = useNavigate()
    const tweetRef = useRef()





    // Function to navigate to the single page route
    function navigateSinglePost(e) {
        if (!location.pathname.includes('singlepost')) {
            navigate(`/app/singlepost/${tweet._id}`)

        }
    }
    function propagation(e) {
        e.stopPropagation()

    }



    // Function to toggle show or hide the tweet's dropdown options
    function toggleOptions(e) {
        // e.propagation()
        setshowOptions(!showOptions)
    }
    // Function to close the option dropdown when the user clicks somewhere else than the dropdown
    useEffect(() => {
        function handleOutsideClick(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setshowOptions(false)
            }
        }
        if (showOptions) {
            document.addEventListener('click', (e) => {
                handleOutsideClick(e)
            })
        }
        return () => {
            document.removeEventListener('click', handleOutsideClick)
        }
    }, [dropdownRef, showOptions])
    // 

    // Functions for tweet functionality such as like, reply, retweet, and saving post
    function likeTweet(e) {
        // e.propagation()
        setpostLike(!postLike)
        if (postLike) {
            setlikeCounts((prev)=> prev - 1)
        } else {
            setlikeCounts((prev)=> prev + 1)
        }
        try {
            axios.put(`${API_BASE_URL}/api/tweet/like/${tweet._id}`, {}, { headers: { 'Authorization': `Bearer ${token}` } })
                .then((res) => {
                    dispatch(showNotification({ type: 'success', content: res.data.message }))
                    settweet({ ...tweet, author: tweet.author, replyingTo: tweet.replyingTo })
                    if (res.data.message.includes('nlike')) {
                        setpostLike(false)
                        setlikeCounts(likeCounts - 1)
                    } else {
                        setpostLike(true)
                        setlikeCounts(likeCounts + 1)
                    }
                })
        } catch (error) {
        }
    }

    // Function to open reply modal
    function openReplyModal(e) {
        // e.propagation()
        setreplyModal(!replyModal)
    }

    // Function to save tweet
    function saveTweet(e) {
        // e.propagation()
        try {
            setisTweetSaved(!isTweetSaved)
            axios.put(`${API_BASE_URL}/api/user/savepost/${tweet._id}`, {}, { headers: { 'Authorization': `Bearer ${token}` } })
                .then((res) => {
                    if (res.data.message.includes('nsaved')) {
                        dispatch(showNotification({ type: 'success', content: res.data.message }))
                        setisTweetSaved(false);
                    } else {
                        setisTweetSaved(true);
                        dispatch(showNotification({ type: 'success', content: res.data.message }))
                    }
                })
                .then(() => {
                    if (updatePosts) { updatePosts() }
                })
        } catch (error) {
            dispatch(showNotification({ type: 'failed', content: `Couldn't reply this tweet` }))
        }
    }

    // Function to open delete modal
    function openDeleteModal() {
        setshowDeleteModal(true)
    }

    // Function to delete a tweet
    function deleteTweet(e) {
        // e.propagation()
        try {
            axios.delete(`${API_BASE_URL}/api/tweet/deletepost/${tweet._id}`, { headers: { 'Authorization': `Bearer ${token}` } })
                .then((res) => {
                    dispatch(showNotification({ type: 'success', content: res.data.message }))
                    updatePosts()
                })
        } catch (error) {
            dispatch(showNotification({ type: 'failed', content: `Couldn't delete this tweet` }))
        }
    }
    // 



    // Functions to execute when the page is re-rendered
    useEffect(() => {
        // function to fetch tweet's user information when the component is re-rendered
        function getUserInfo() {
            axios.get(`${API_BASE_URL}/api/user/userinfo/${admin._id}`)
                .then((res) => {
                    setuserInfo(res.data.user)
                })
                .catch((err) => {

                })
        }

        // Function to check if the tweet's media an image or video
        function mimetypeChecker() {
            if (tweet.media) {
                let type = tweet.media.split('.').pop();
                if (type === 'mp4') {
                    setmimetype('video/mp4')
                } else if (type === 'mpeg') {
                    setmimetype('video/mpeg')
                } else {
                    setmimetype('image/*')
                }
            }
        }
        // Executing above functions orderly
        getUserInfo()
        mimetypeChecker()
    }, [])

    // Functions to execute after fetched tweet's user info
    useEffect(() => {
        // Function to check if the user has saved this post or not
        function checkPostSaveStatus() {
            if (userInfo) {
                if (userInfo.savedTweets.includes(tweet._id)) {
                    setisTweetSaved(true)
                } else {
                    setisTweetSaved(false)
                }
            } else {
                setisTweetSaved(false)
            }
        }

        // Function to check if user has liked the post or not
        function checkPostLikeStatus() {
            if (tweet.likes.includes(admin._id)) {
                setpostLike(true)
            }
        }
        // Executing above functions
        checkPostSaveStatus()
        checkPostLikeStatus()
    }, [userInfo])


    // Component's return area starts from here 
    // 
    // 
    return (
        <>
            <div id="newTweet" className='mb-3'>
                <div onClick={(e) => { navigateSinglePost(e) }} ref={tweetRef} className="tweetContainer">
                    <div onClick={propagation} className="tweetProfileImg">
                        <img className='profileImg' src={tweet.author ? tweet.author.userDetails.profileImg : null} alt="" />
                    </div>
                    <div className="tweetBody">
                        <div className="upperSection mt-1 mb-3">
                            <p onClick={propagation} className='m-0'><Link className='text-decoration-none text-white' to={tweet.author._id === admin._id ? `/app/profile` : `/app/users/${tweet.author._id}`}>{tweet.originalTweet ? <span>Retweeted by @{tweet.author.username}</span> : `@${tweet.author.username}`}</Link></p>
                            <div className="optionsDropdown">
                                <button ref={dropdownRef} id='tweetOptions' onClick={(e) => { toggleOptions(); propagation(e) }}><img src="/options.svg" alt="" /></button>
                                <div className={showOptions ? `dropdownMenu` : 'hide'}>
                                    <ul onClick={propagation}>
                                        <li>Report</li>
                                        {tweet.author._id === admin._id ? <li onClick={openDeleteModal}>Delete</li> : null}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {tweet.replyingTo ? <p onClick={propagation} className='replyingToText'>replying to @<Link to={tweet.replyingTo.author._id === admin._id ? `/app/profile` : `/app/users/${tweet.replyingTo.author._id}`}>{tweet.replyingTo.author.username}</Link></p> : null}
                        <div className="postSection mb-3">
                            {tweet.originalTweet ? <div onClick={propagation} className='originalTweetBody rounded-3 p-2 mb-3'>
                                <div className='d-flex gap-2 '>
                                    <img src={tweet.originalTweet.author.userDetails.profileImg} height={40} width={40} style={{ borderRadius: '100px', objectFit: 'cover' }} alt="" />
                                    <div className="originalTweetRight d-flex flex-column">
                                        <p className='mb-2 mt-2'>{tweet.originalTweet.author.username}</p>
                                        <p>{tweet.originalTweet.content}</p>
                                        {post.media ? <div>{mimetype === 'mp4' || mimetype === 'mpeg' ? <ReactPlayer url={post.media} controls={true} /> : <img src={post.media} />}</div> : null}
                                    </div>
                                </div>

                            </div> : null}
                            <div className="postContent">
                                <p className='m-0'>{tweet.content}</p>
                            </div>
                            <div onClick={propagation} className="postMedia">
                                {tweet.media ? <div>
                                    {mimetype.includes('video') ? <ReactPlayer
                                        url={tweet.media}
                                        controls={true}
                                        height={'100%'}
                                        width={'100%'}
                                    /> : <img src={tweet.media} alt='post_media' />}
                                </div> : null}

                            </div>
                        </div>
                        <div className="postFunctions">
                            <div className="functions-1">
                                <span className={`${postLike ? 'liked' : 'like'} d-flex gap-1 align-items-center`} onClick={(e) => { likeTweet(); propagation(e) }}><i className={`${postLike ? 'fa-solid liked' : 'fa-regular'} fa-heart`}></i> <p className='m-0'>{likeCounts}</p></span>
                                <span className='retweet d-flex gap-1 align-items-center' onClick={(e) => { propagation(e); setshowRetweetModal(true) }}><i className="fa-solid fa-retweet"></i> <p className='m-0'>{retweetCount}</p></span>
                                <span className='replies d-flex gap-1 align-items-center' onClick={(e) => { openReplyModal(); propagation(e) }}><i className="fa-regular fa-comment"></i> <p className='m-0'>{repliesCount}</p></span>
                            </div>
                            <div className="functions-2">
                                <span onClick={(e) => { saveTweet(); propagation(e) }}><i className={`${isTweetSaved ? 'fa-solid' : 'fa-regular'} fa-bookmark retweet`}></i></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reply modal is set here */}
            <ReplyTweet show={replyModal}
                post={tweet}
                updateReplyFunction={() => { updatePosts(); setrepliesCount(repliesCount + 1) }}
            />
            <DeleteModal show={showDeleteModal}
                closeFunc={() => setshowDeleteModal(false)}
                deleteFunc={deleteTweet}
            />
            <RetweetModal
                show={showRetweetModal}
                post={tweet}
                closeModalFunction={() => setshowRetweetModal(false)}
                updateFunction={() => { updatePosts(); setretweetCount(retweetCount + 1) }}
            />
        </>
    )
}

export default Tweet;