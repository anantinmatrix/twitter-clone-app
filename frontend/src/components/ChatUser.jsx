import { useNavigate } from 'react-router-dom';
import './css/ChatUser.css';

const ChatUser = ({user, chatId,roomId, lastMessage}) => {
    

    // Constants are defined here
    const navigate = useNavigate()


    return (
        <>
            <div className='mb-2' onClick={()=> navigate(`chat/${chatId}`)}>
                <div id="chatUser">
                    <img className='chatUserImg' src={user.userDetails.profileImg} alt="chat_user" />
                    <p className='chatUserName'>{user.name}</p>
                </div>
            </div>
        </>
    )
}

export default ChatUser;
