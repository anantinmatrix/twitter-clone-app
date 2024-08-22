import ReactPlayer from 'react-player';
import './css/RetweetModal.css'
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../env';

const RetweetModal = ({ show, post, closeModalFunction, updateFunction }) => {
    const [mimetype, setmimetype] = useState(null);
    const [content, setcontent] = useState('')


    const retweetModalRef = useRef()
    const admin = JSON.parse(localStorage.getItem('user'))
    const token = localStorage.getItem('token')


    function handleOutsideClick(e) {
        if (retweetModalRef.current && !retweetModalRef.current.contains(e.target)) {
            closeModalFunction()
            console.log('retweet modal closed')
        }
    }

    // Function to call api for retweet on a tweet
    function handleRetweet(e) {
        e.preventDefault()
        console.log('retweet button clicked')
        axios.post(`${API_BASE_URL}/api/tweet/retweet/${post._id}`, {content : content},{headers: {'Authorization': `Bearer ${token}`}})
        .then((res)=>{
            console.log(res.data)
            closeModalFunction()
            updateFunction()
        })
        .catch(()=>{
            console.log('Error in retweeting tweet')
        })
    }
    useEffect(() => {
        if (show) {
            document.addEventListener('mousedown', handleOutsideClick)
        }
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
        }
    }, [show, handleOutsideClick])



    function textAreaFunction(e) {
        e.target.style.height = '35px'
        let textHeight = e.target.scrollHeight;
        e.target.style.height = textHeight + 'px';
        setcontent(e.target.value)
    }

    function mimetypeChecker() {
        if (post.media) {
            setmimetype(post.media.split('.').pop())
        }
    }

    useEffect(() => {
        mimetypeChecker()
    }, [])

    return (
        <>
            <div id="retweetModal" style={show ? { display: 'block' } : { display: 'none' }}>
                <div className="retweetModalBody" ref={retweetModalRef}>
                    <h5>Retweet</h5>
                    <hr />
                    <div>
                        <p>Retweeting this post</p>
                        <div className='originalTweetBody rounded-3 p-2 mb-3'>
                            <div className='d-flex gap-2 '>
                                <img src={post.author.userDetails.profileImg} height={40} width={40} style={{ borderRadius: '100px' }} alt="" />
                                <div className="originalTweetRight d-flex flex-column">
                                    <p className='mb-2 mt-2'>{post.author.username}</p>
                                    <p>{post.content}</p>
                                    {post.media ?  <div>{mimetype === 'mp4' || mimetype === 'mpeg' ? <ReactPlayer url={post.media} controls={true} height={'350px'} width={'100%'}/> : <img src={post.media} height={350} width={'100%'} style={{borderRadius:"8px", objectFit: "cover"}}/>}</div>: null}
                                </div>
                            </div>
                            
                        </div>
                        <div className="retweetQuote">
                            <p>Quote on this tweet</p>
                            <form onSubmit={(e)=> handleRetweet(e)}>
                                <textarea className='mb-3' onChange={(e) => textAreaFunction(e)} placeholder='Your quote' />
                                <div className='d-flex align-items-center gap-2 justify-content-end'>
                                    <button type='button' onClick={closeModalFunction} className='btn btn-light'>Close</button>
                                    <button type='submit' className='btn btn-primary'>Retweet</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RetweetModal;