import { useState } from 'react';
import './css/Chatroom.css';
import ChatUser from '../components/ChatUser';
import axios from 'axios';
import { API_BASE_URL } from '../env';
import debounce from 'lodash/debounce'
import LoadingSpinner from '../components/LoadingSpinner';

const Chatroom = () => {
    let [chatroomSearch, setchatroomSearch] = useState('')
    let [userList, setuserList] = useState([])
    let [loading, setloading] = useState(false)


    const admin = JSON.parse(localStorage.getItem('user'))
    const token = localStorage.getItem('token')

    function loadConversations() {
        setloading(true)
        try {
            axios.get(`${API_BASE_URL}/api/conversation`, { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => {
                    setloading(false)
                    let a = res.data;
                    a.map((conv) => {
                        let mem = conv.members
                        mem.map((ids) => {
                            if (ids._id !== admin._id) {
                                setuserList((prev) => [...prev, ids])
                                setloading(false)
                            }
                        })
                    })

                })
        } catch (error) {
            setloading(false)
        }
    }
    // function findUser(user){
    //     axios.get(`${API_BASE_URL}/api/user/userinfo/user`)
    //     .then((res)=>{
    //         console.log(res.data)
    //         let a = res.data
    //         console.log(a)
    //     })
    // }

    const handleSearch = debounce(async (name) => {
        axios.post(`${API_BASE_URL}/api/user/searchuser`, { name: name })
            .then((res) => {
                // console.log(res.data.user)
                let responseArray = res.data.user
                let filteredArray = responseArray.filter((user) => user._id !== admin._id)
                setuserList(filteredArray)
                setloading(false)
            })
            .catch((err) => {
                setloading(false)
            })
    }, 500)

    function handleChange(value) {
        setchatroomSearch(value)
        handleSearch(value)
    }

    useState(() => {
        loadConversations()
    }, [])

    console.log(userList)


    return (
        <>
            <div id="chatroom">
                <div className="chatroomHeader">
                    <h4>Messages</h4>
                </div>
                <div className="chatroomSearchbox mt-4 mb-4">
                    <input className='chatroomSearchInput' type="text" name='chatroomSearch' id='chatroomSearch' placeholder='Search chats' onChange={(e) => handleChange(e.target.value)} />
                </div>
                {loading ? <div className='chatroomLoader'><LoadingSpinner /> Loading</div> :
                    <div className="chatsList">
                        {
                            userList.map((user) => {
                                const roomId = [user._id, admin._id].sort().join('-')
                                return (
                                    <div key={user._id}>
                                        <ChatUser
                                            chatId={user._id}
                                            user={user}
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                }
            </div >
        </>
    )
}

export default Chatroom;