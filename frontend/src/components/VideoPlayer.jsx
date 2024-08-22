import { Link } from 'react-router-dom';
import './css/VideoPlayer.css';
import { useEffect, useRef } from 'react';
import Hls from 'hls.js'
import ReactPlayer from 'react-player';

const VideoPlayer = ({ link }) => {
    const videoRef = useRef()
    const defaultOptions = {}


    return (
        <div id="videoPlayer">
            <ReactPlayer
                url={link}
                controls={true}
                height={'100%'}
                width={'100%'}
            />
        </div>
    )
}

export default VideoPlayer;

