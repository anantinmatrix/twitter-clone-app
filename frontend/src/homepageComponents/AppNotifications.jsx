import './css/AppNotifications.css'

const AppNotifications = () => {
    const notifications = [
        {
            id: 1,
            title: 'New Follower Request',
            content: 'John Doe has requested to follow you',
            type: 'success',
            time: '12:00 PM',
            date: '23-07-2024',
            seen: false,
            request: "follow"
        },
        {
            id: 2,
            title: 'New Like',
            content: 'John Doe has liked your post',
            type: 'success',
            time: '12:15 PM',
            date: '23-07-2024',
            seen: false
        },
        {
            id: 3,
            title: 'New Follower Request',
            content: 'Adam Doe has requested to follow you',
            type: 'success',
            time: '1:00 PM',
            date: '23-07-2024',
            seen: false,
            request: "follow"
        },

    ]

    return (
        <>
            <div id="appNotifications">
                <h3 className='mb-5'>Notifications</h3>
                <div className="notificationBox">
                    {notifications.map((note) => {
                        return (
                            <div key={note.id}className='notification'>
                                <div className="notificationArea">

                                    <div className="profileimg">
                                        {/* <img src="" alt="user_image" /> */}
                                    </div>
                                    <div className="title">
                                        <p>{note.title}</p>
                                        <h6>{note.content} <p>{note.time}</p></h6> 
                                    </div>
                                </div>
                                {
                                    note.request === "follow" ?
                                    <div className="notificationAction">
                                    <button className='btn btn-primary'>Follow Back</button>
                                </div> : null
                                }
                                
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default AppNotifications;