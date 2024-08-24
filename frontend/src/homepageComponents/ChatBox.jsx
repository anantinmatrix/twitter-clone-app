import { useNavigate, useParams, Link } from 'react-router-dom';
import './css/ChatBox.css';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { API_BASE_URL } from '../env';
import ScrollableFeed from 'react-scrollable-feed'

const ChatBox = () => {
    let [chatUser, setchatUser] = useState({})
    let [messages, setmessages] = useState([])
    let [inputVal, setinputVal] = useState('')


    const user = useParams()
    const navigate = useNavigate()
    const chatBoxRef = useRef(null)
    const admin = JSON.parse(localStorage.getItem('user'))
    const socket = io(`${API_BASE_URL}`)
    const senderId = admin._id;
    const receiverId = chatUser._id;
    const today = new Date;
    const time = today.getHours() > 12 ? `${today.getHours() - 12} : ${today.getMinutes()}: ${today.getSeconds()} PM` : `${today.getHours()}:${today.getMinutes()}: ${today.getSeconds()} AM`

    useEffect(() => {
        socket.emit('joinroom', { senderId, receiverId })
        socket.on('receiveMessage', (newMessage) => {
            if (newMessage.senderId !== admin._id) {
                setmessages((prevMessages) => [...prevMessages, newMessage])
            }
        })

        return () => {
            socket.off('receiveMessage')
        }
    }, [senderId, receiverId])

    useEffect(() => {
        function getUserData() {
            axios.get(`${API_BASE_URL}/api/user/userinfo/${user.userId}`)
                .then((res) => {
                    setchatUser(res.data.user)
                })
                .catch((err) => { })
        }
        getUserData()
    }, [])
    useEffect(() => {
        function getChat() {
            axios.get(`${API_BASE_URL}/api/messages/getmessages?senderId=${[senderId]}&receiverId=${[receiverId]}`)
                .then((res) => {
                    setmessages(res.data.message)
                })
                .catch((err) => {
                    console.log(err)
                })
        }

        getChat()
    }, [senderId, receiverId])

    function sendMessage() {
        const newMessage = { senderId, receiverId, content: inputVal }
        if (newMessage.content !== "") {
            socket.emit('sendMessage', newMessage);
            setmessages((prevMessages) => [...prevMessages, newMessage])
        }
        setinputVal('')
    }






    return (
        <>
            <div ref={chatBoxRef} id="chatBox">
                <div className="chatBoxHeader mb-3">
                    <span onClick={() => navigate(-1)}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </span>
                    <span className='d-flex align-items-center gap-3'>
                    <Link className='text-decoration-none' to={`/app/users/${chatUser._id}`}><img src={chatUser.userDetails && chatUser.userDetails.profileImg} height={'40px'} width={'40px'} style={{ borderRadius: '100%', objectFit: 'cover' }} alt="" /></Link>
                        <h4><Link className='text-decoration-none' to={`/app/users/${chatUser._id}`}>{chatUser.name || ' '}</Link></h4>
                    </span>
                </div>
                <div className="chatBoxChat">
                    <ScrollableFeed className='scrollChat'>

                        <div id='chat' >
                            {messages.map((chat, index) => {
                                return (
                                    <div key={index} className="chatParent" style={chat.senderId === admin._id ? { justifyContent: 'end' } : { justifyContent: 'start' }}>
                                        <div key={index} className={chat.senderId === admin._id ? 'my_message' : 'message'} >
                                            <p className='text-start mb-2'>{chat.content}</p>
                                            <p className='text-end '>{chat.time || time}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </ScrollableFeed>
                    <div className="chatInput">
                        <input
                            type="text"
                            name='chatInput'
                            value={inputVal}
                            id='chatInput'
                            placeholder='Write a message'
                            onChange={(e) => setinputVal(e.target.value)}
                        />
                        <button onClick={sendMessage}><i className="fa-solid fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>
        </>
    )


}

export default ChatBox;




// let chats = [
//     {
//         key: 1,
//         sender: user,
//         reciever: 'someone',
//         message: 'Hello, this is Anant Singh Tomar, and i am the creator of this platform.',
//         time: `12:23 pm`,
//     },
//     {
//         key: 2,
//         sender: 'someone',
//         reciever: user,
//         message: 'Hi',
//         time: `12:25 pm`,
//     }
// ]