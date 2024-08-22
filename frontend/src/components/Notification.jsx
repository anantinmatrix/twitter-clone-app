import { useEffect, useState } from 'react';
import './css/Notification.css';
import { useDispatch, useSelector } from 'react-redux';
import { hideNotification } from '../redux/slices/notificationSlice';

const Notification = () => {
    const dispatch = useDispatch()
    let notificationSelector = useSelector((state) => state.notificationSlice)
    let [notificationQuality, setnotificationQuality] = useState(notificationSelector)

    const getColor = ()=>{
        if(notificationQuality.type === "success"){
            return '#01660a88'
        }else if(notificationQuality.type === "failed"){
            return '#66010188'
        }
    }

    let notificationStyle = {
        backgroundColor: getColor(),
        animation: notificationQuality.show ? 'show forwards .3s ease-out' : 'hide forwards .7s ease',
    }

    useEffect(() => {
        setnotificationQuality(notificationSelector)
        notificationStyle = {...notificationStyle, display: 'block', opacity: 1, visibility: 'visible'}
    }, [notificationSelector])

    useEffect(()=>{
        const notificationTimeout = setTimeout(() =>{
            dispatch(hideNotification())
            notificationStyle = {...notificationStyle, display: 'none', opacity: 0, visibility: 'hidden'}
        },3000)

        return ()=>{
            clearTimeout(notificationTimeout)
        }
    },[notificationQuality])



    return (
        <>
            <div style={notificationStyle} id="notificationBox">
                <p>{notificationQuality.content}</p>
            </div>
        </>
    )
}

export default Notification;