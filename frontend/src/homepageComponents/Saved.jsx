import { useEffect, useState } from 'react';
import './css/Saved.css'
import { API_BASE_URL } from '../env';
import axios from 'axios';
import Tweet from '../components/Tweet';

const Saved = () => {
    let [savedTweets, setsavedTweets] = useState([])

    const admin = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    useEffect(() => {
        function getSavedTweets() {
            axios.get(`${API_BASE_URL}/api/user/savedposts`, { headers: { 'Authorization': `Bearer ${token}` } })
                .then((res) => {
                    setsavedTweets(res.data.savedTweets)
                })
                .catch(() => {

                })
        }
        getSavedTweets()
    }, [])


    return (
        <>
            <div id="savedPostsPage">
                <h2 className='mb-5'>Saved Posts</h2>
                <div className="savedPostsSection">
                    {savedTweets ? savedTweets.map((tweet) => {
                        return (
                            <div key={tweet._id}>

                                <Tweet post={tweet} />
                            </div>
                        )
                    }) : null}
                {savedTweets[0] == null ? <p className=' text-white-50'>No saved posts</p>: null}
                </div>

            </div>
        </>
    )
}

export default Saved;