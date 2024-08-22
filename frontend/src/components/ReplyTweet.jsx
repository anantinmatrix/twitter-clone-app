import './css/ReplyTweet.css'
import { useRef, useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import axios from 'axios';
import { API_BASE_URL } from '../env';
import { useDispatch } from 'react-redux';
import { showNotification } from '../redux/slices/notificationSlice';

function ReplyTweet({ show,post, updateReplyFunction}) {
    let [content, setcontent] = useState('')
    let [file, setfile] = useState('')
    let [previewFileURL, setpreviewFileURL] = useState('')
    let [loading, setloading] = useState(false)
    const [toggleShow, settoggleShow] = useState(show)
    const replyModalRef = useRef()
    const dispatch = useDispatch()

    // Show and hide modal functions
    const handleClickOutside = (event) => {
        if (replyModalRef.current && !replyModalRef.current.contains(event.target)) {
            settoggleShow(false);
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [])
    // 

    // It will be visible when show prop is true
    useEffect(() => {
        settoggleShow(show)
    }, [show])
    // 

    const textAreaFunction = (e) => {
        e.target.style.height = '50px';
        let textHeight = e.target.scrollHeight;
        e.target.style.height = textHeight + 'px';
    }

    const handleFileChange = (e) => {
        let file = e.target.files[0]
        setfile(file)
        const url = URL.createObjectURL(file)
        setpreviewFileURL(url)
    }
    const handleContentChange = (e) => {
        setcontent(e.target.value)

    }

    const handleReply = (e) => {
        e.preventDefault();
        setloading(true)
        const formData = new FormData()
        formData.append('content', content)
        if(file !== ""){
            formData.append('media',file)
        }
        console.log(formData)
        axios.post(`${API_BASE_URL}/api/tweet/reply/${post._id}`,formData,{headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`,'Content-Type': 'multipart/form-data'}})
        .then((res)=>{
            console.log(res)
            setcontent('')
            setfile('')
            setpreviewFileURL('')
            setloading(false)
            settoggleShow(false)
        })
        .then(()=>{
            updateReplyFunction()
        })
        .catch((err)=>{
            dispatch(showNotification({type: 'failed', content: err.response.data.message}))
            setloading(false)
        })
    }

    return (
        <div ref={replyModalRef} id='replyModal' style={{ display: toggleShow ? "block" : "none" }}>
            <div className="replyModalHeader mb-3">
            <h5 >Reply</h5>
            <button onClick={()=>{settoggleShow(false); setcontent(''); setfile(''), setpreviewFileURL('');setloading(false)}} className='replyModalCloseBtn'><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className='mb-3'>Replying to @{post.author.username}</div>
            <form onSubmit={handleReply}>
                <textarea maxLength={100} value={content} onChange={(e) => { handleContentChange(e); textAreaFunction(e) }} name="replyInput" id="replyInput" placeholder='Write your reply'></textarea>
                <div className="ReplyingElements row mt-3">
                    <div className="col-6 d-flex gap-4 ">
                        <span><input type='file' id='replyInputImage' accept='image/*' onChange={(e) => handleFileChange(e)} style={{ display: 'none' }} /><label htmlFor='replyInputImage' className='btn p-0'><img src="/newPostIcons/Button_Iconadd_image.svg" alt="" /></label></span>
                        <span><input type='file' id='replyInputVideo' accept='video/*' onChange={(e) => handleFileChange(e)} style={{ display: 'none' }} /><label htmlFor='replyInputVideo' className='btn p-0'><img src="/newPostIcons/Frame_add_video.svg" alt="" /></label></span>
                        <span><input type='file' id='replyInputGif' accept='image/gif' onChange={(e) => handleFileChange(e)} style={{ display: 'none' }} /><label htmlFor='replyInputGif' className='btn p-0'><img src="/newPostIcons/Frame_add_gif.svg" alt="" /></label></span>
                    </div>
                    <div className='col-6 d-flex justify-content-end'>
                        {loading ? <LoadingSpinner />
                            : <button className='replyBtn bg-white d-flex align-items-center justify-content-center'>
                                <img src="/newPostIcons/Button_Icon_post.svg" alt="post_btn_img" />
                                Reply
                            </button>}
                    </div>
                </div>
            </form>
            {file !== "" ? <div className='replyFormMediaPreview'>{file.type.includes("image") ? <img src={previewFileURL} style={{ height: '150px', objectFit: 'cover', borderRadius: '8px', marginTop: '5px' }} /> : <p>{file.name}</p>}</div> : null}
        </div>
    )
}

export default ReplyTweet;