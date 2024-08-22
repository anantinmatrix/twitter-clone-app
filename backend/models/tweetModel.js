import mongoose from 'mongoose'

const tweetModel = new mongoose.Schema({
    content: { type: String, required: true },
    media: { type: String, },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'usermodel' },
    likes: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'usermodel' }
    ],
    replies: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'tweetmodel' }
    ],
    retweets: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'tweetmodel'}
    ],
    replyingTo: { type: mongoose.Schema.Types.ObjectId, ref: 'tweetmodel' },
    originalTweet: {type: mongoose.Schema.Types.ObjectId, ref: 'tweetmodel'}
}, { timestamps: true })

const Tweet = new mongoose.model('tweetmodel', tweetModel)
export default Tweet;