import axios from 'axios';
import Tweet from '../components/Tweet';
import './css/Home.css'
import { API_BASE_URL } from '../env';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showNotification } from '../redux/slices/notificationSlice';
import LoadingSpinner from '../components/LoadingSpinner';

const HomepageForYouFeed = () => {
    let [content, setcontent] = useState('')
    let [file, setfile] = useState('')
    let [previewFileURL, setpreviewFileURL] = useState('')
    let [fetchedPosts, setfetchedPosts] = useState([])
    let [loading, setloading] = useState(false)


    const loginSelector = useSelector((state) => state.loginSlice)
    const dispatch = useDispatch()
    const token = loginSelector.token;
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate()



    // Tweet posting functions
    const handleFileChange = (e) => {
        let file = e.target.files[0]
        setfile(file)
        const url = URL.createObjectURL(file)
        setpreviewFileURL(url)
    }
    const handleContentChange = (e) => {
        setcontent(e.target.value)
    }

    const handleCreatePost = (e) => {
        e.preventDefault();
        setloading(true)
        const formData = new FormData()
        formData.append('content', content)
        formData.append('media', file)
        axios.post(`${API_BASE_URL}/api/tweet/createtweet`, formData, { headers: { 'Authorization': `Bearer ${token}` } })
            .then((res) => {
                setloading(false)
                setcontent('')
                setfile('')
                dispatch(showNotification({ type: 'success', content: res.data.message }))
                getPosts()
            })
            .catch((err) => {
                console.log(err)
                setloading(false)
                dispatch(showNotification({ type: 'failed', content: err.response.data.message }))
            })
    }
    // 
    // Getting all the tweets from the server
    const getPosts = () => {
        axios.get(`${API_BASE_URL}/api/tweet/tweets`)
            .then((res) => {
                setfetchedPosts(res.data.tweets)
            })
            .catch((err) => {
                dispatch(showNotification({ type: 'failed', content: err.response.data.message }))
            })
    }

    const textAreaFunction = (e) => {
        e.target.style.height = '50px';
        let textHeight = e.target.scrollHeight;
        e.target.style.height = textHeight + 'px';
    }



    useEffect(() => {
        getPosts()
    }, [])

    return (
        <>
            <div id='home' className=' p-0'>
                <div id="homefeeds">
                    <div id="homefeedPages">
                        <div className="forYouSection">
                            <h6>For You</h6>
                        </div>
                        <div className="communitiesSection">
                            <h6>Communities</h6>
                        </div>
                    </div>
                </div>
                <div id="addThoughtForm" className='mb-3'>
                    <div className="image">
                        <img
                            src={`${loggedInUser.userDetails.profileImg}`}
                            alt="user_img"
                        />
                    </div>
                    <div className='pt-1'>
                        <p className='feedUsername mb-4 ms-2'>@{loggedInUser.username}</p>
                        <form onSubmit={handleCreatePost}>
                            <textarea value={content} onChange={(e) => handleContentChange(e)} onKeyUp={(e) => textAreaFunction(e)} className='addThoughtInput' type="text" placeholder='What is happening?' />
                            <div className="postingElements row mt-3">
                                <div className="col-6 d-flex gap-4 ">
                                    <span><input type='file' id='inputImage' accept='image/*' onChange={(e) => handleFileChange(e)} style={{ display: 'none' }} /><label htmlFor='inputImage' className='btn p-0'><img src="/newPostIcons/Button_Iconadd_image.svg" alt="" /></label></span>
                                    <span><input type='file' id='inputVideo' accept='video/*' onChange={(e) => handleFileChange(e)} style={{ display: 'none' }} /><label htmlFor='inputVideo' className='btn p-0'><img src="/newPostIcons/Frame_add_video.svg" alt="" /></label></span>
                                    <span><input type='file' id='inputGif' accept='image/gif' onChange={(e) => handleFileChange(e)} style={{ display: 'none' }} /><label htmlFor='inputGif' className='btn p-0'><img src="/newPostIcons/Frame_add_gif.svg" alt="" /></label></span>

                                </div>
                                <div className="col-6 d-flex justify-content-end">
                                    {loading ? <LoadingSpinner />
                                        : <button className='postBtn bg-white d-flex align-items-center justify-content-center'>
                                            <img src="/newPostIcons/Button_Icon_post.svg" alt="post_btn_img" />
                                            Post
                                        </button>}
                                </div>
                            </div>
                            {file !== "" ? <div>{file.type.includes("image") ? <img src={previewFileURL} style={{ height: '150px', objectFit: 'cover', borderRadius: '8px', marginTop: '5px' }} /> : <p>{file.name}</p>}</div> : null}
                        </form>
                    </div>
                </div>
                <div className="tweets container p-0">
                    {fetchedPosts.map((post, index) => {
                        return (

                            <div key={post._id}>
                                <Tweet post={post} updatePosts={getPosts} />
                            </div>

                        )
                    })}

                </div>
            </div>
        </>
    )
}

export default HomepageForYouFeed;