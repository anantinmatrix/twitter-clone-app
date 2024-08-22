import axios from 'axios'
import Tweet from '../components/Tweet'
import './css/SingleTweetPage.css'
import { API_BASE_URL } from '../env'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

const SingleTweetPage = () => {
    const { postId } = useParams();
    let [post, setpost] = useState({})
    let [replies, setreplies] = useState([])

    function getPost() {
        axios.get(`${API_BASE_URL}/api/tweet/singlepost/${postId}`)
            .then((res) => {
                setpost(res.data.tweet)
                setreplies(res.data.replies)
            })
            .catch((err) => {
                console.log('error fetching the tweet')
            })
    }


    useEffect(() => {
        getPost()
    }, [])



    return (
        <>
            <div id="singleTweetPage">
                <h3>Post</h3>
                <div className="singlePostContainer">
                    {post._id ? <Tweet post={post} /> : null}
                </div>
                <h6>Replies</h6>
                <div className="singlePostReplies">
                    {replies.map((reply)=>{
                        if(reply._id){
                            return <Tweet post={reply} key={reply._id}/>
                        }else{
                            return <p>No replies yet</p>
                        }
                    })}
                </div>
            </div>
        </>
    )
}

export default SingleTweetPage;