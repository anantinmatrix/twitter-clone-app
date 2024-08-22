import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    userDetails: {
        age: { type: Number },
        phoneNo: { type: Number },
        profileImg: { type: String, default: '/assets/default_user.jpg' },
        coverImg: { type: String, default: '/assets/default_cover_img.jpg' },
        location: { type: String },
        bio: { type: String },

    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'usermodel'
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'usermodel'
        }
    ],
    savedTweets: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tweetmodels'
        }
    ]
}, { timestamps: true })
const User = new mongoose.model('usermodel', userSchema)
export default User;