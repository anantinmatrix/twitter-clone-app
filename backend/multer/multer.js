import multer from 'multer'
import path from 'path'
import fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'

const imageMaxSize = 20 * 1024 * 1024;
const videoMaxSize = 200 * 1024 * 1024;




const storage = multer.diskStorage({
    // destination: (req, file, cb) => {
    //     cb(null, 'uploads/')
    // },
    filename: (req, file, cb) => {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename)
    },
})

// const storage = multer.memoryStorage({
//     __filename: (req,file,cb)=>{
//         const filename = `${Date.now()}-${file.originalname}`
//         cb(null, filename)
//     }
// })

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        if (file.size > imageMaxSize) {
            return cb(new Error('Image size exceeds the limit of 20MB'), false);
        }
        return cb(null, true)
    } else if (file.mimetype.match(/^video\/(mp4|webm|mkv|quicktime|x-msvideo)$/)) {
        if (file.size > videoMaxSize) {
            return cb(new Error('Video size exceeds the limit of 200MB'), false);
        }
        return cb(null, true);
    } else {
        return cb(new Error('Invalid file type. Only images and videos are allowed'), false);
    }
}

const upload = multer({
    storage, fileFilter, limits: {
        fileSize: (req, file) => {
            if (file.mimetype.startsWith('image/')) {
                return imageMaxSize;
            } else {
                return videoMaxSize;
            }
        }
    }
});

export default upload;