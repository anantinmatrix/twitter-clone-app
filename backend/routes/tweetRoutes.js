import express from 'express'
import authentication from '../auth/authentication.js';
import Tweet from '../models/tweetModel.js';
import User from '../models/userModel.js'
import upload from '../multer/multer.js';
import { v2 as cloudinary, v2 } from 'cloudinary'
import { configDotenv, populate } from 'dotenv';


configDotenv()


cloudinary.config({
    cloud_name: 'dy9o2uqcb',
    api_key: '971376831615478',
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const tweetRouter = express.Router();

// Create a new tweet
tweetRouter.post('/createtweet', authentication, upload.single('media'), async (req, res) => {
    try {
        const author = req.user;
        const { content } = req.body;
        const media = req.file;
        let result;
        if (!content) {
            return res.status(400).json({ message: 'Content is required' })
        }

        const newTweet = await Tweet({
            content: content,
            author: author._id,
            media: media ? media.path : null
        })
        //   uploading media to cloudinary
        if (!media || !media.path) {

        } else {

            if (media.path.includes('mp4')) {
                result = await cloudinary.uploader.upload(media.path, {
                    resource_type: 'auto',
                    chunk_size: 6000000,
                    public_id: `${Date.now()}-${media.originalname}`
                })
            } else if (media.path.includes('mpeg' || 'mkv')) {
                result = await cloudinary.uploader.upload(media.path, {
                    resource_type: 'auto',
                    chunk_size: 6000000,
                    public_id: `${Date.now()}-${media.originalname}`
                })
            } else {
                result = await cloudinary.uploader.upload(media.path, {
                    resource_type: 'auto',
                    public_id: `${Date.now()}-${media.originalname}`
                })
            }
            newTweet.media = result.secure_url;
        }
        await newTweet.save()
        res.json({ message: 'Tweet created', tweet: newTweet, cloudinary: result })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Getting all tweets
tweetRouter.get('/tweets', async (req, res) => {
    try {
        const tweets = await Tweet.find({}).populate({path: 'author', select: {password: 0}}).populate({path: 'replyingTo', populate: {path: 'author', select: {password: 0}}}).populate({path: 'originalTweet', populate:{path: 'author', select: {password: 0}}}).sort({createdAt: -1})
        res.status(200).json({ tweets })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})
// Like a tweet
tweetRouter.put('/like/:id', authentication, async (req, res) => {
    try {
        const { id } = req.params;
        const likedTweet = await Tweet.findOne({ '_id': id })
        if (!likedTweet) {
            return res.status(404).json({ message: 'Tweet not found' }).populate('author')
        }
        const likerId = req.user._id;
        if (likedTweet.likes.includes(likerId)) {
            likedTweet.likes.pull(likerId)
            await likedTweet.save()
            res.status(200).json({ message: 'Unliked a post', tweet: likedTweet, likes: likedTweet.likes.length, userLike: false })
        } else {
            likedTweet.likes.push(likerId)
            await likedTweet.save();
            res.status(201).json({ message: 'Liked a post', tweet: likedTweet, likes: likedTweet.likes.length, userLike: true })
        }


    } catch (error) {
        return res.status(500).json({ error: error, message: "Internal Server Error in Like Tweet Route" })
    }
})

// Delete a tweet
tweetRouter.delete('/deletepost/:postid', authentication, async (req, res) => {
    try {
        const { postid } = req.params;
        let tweet = await Tweet.findByIdAndDelete(postid)
        if (tweet.replyingTo) {
            const parentTweet = await Tweet.findOne({ '_id': tweet.replyingTo })
            if (parentTweet) {
                await parentTweet.replies.pull(tweet._id)
                await parentTweet.save()
            }
        }
        // to delete the post from the user's saved post
        const users = await User.find({ 'savedTweets': { $in: [tweet._id] } })
        if (users) {
            for (const user of users) {
                user.savedTweets.pull(tweet._id);
                await user.save();
            }
        }

        // To delete tweet from the original post if it is a retweet
        if (tweet.origianlTweet) {
            const originalTweet = await Tweet.findById(tweet.origianlTweet)
            originalTweet.retweets.pull(tweet._id)
            await originalTweet.save()
        }
        res.status(200).json({ message: 'Tweet deleted' })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error in delete tweet route' })
    }
})

// Get only one post on the basis of post _id
tweetRouter.get('/singlepost/:postid', async (req, res) => {
    try {
        let repliesArray;
        const { postid } = req.params;
        const post = await Tweet.findOne({ '_id': postid }).populate({path: 'author', select:{password: 0}}).populate({path: 'originalTweet', populate: {path: 'author', select: {password: 0}}}).populate({path: 'replyingTo', populate: {path: 'author', select: {password: 0}}})
        if (!post) {
            return res.status(404).json({ message: 'Post not found' })
        }
        const replies = await Tweet.find({'replyingTo': postid}).populate({path: 'author', select: {password: 0}}).populate({path: 'replyingTo', populate: {path:'author', select: {password: 0}}})
        if(!replies){
            repliesArray = []
        }
        repliesArray = replies
        res.status(200).json({ message: "Found the post", tweet: post, replies: repliesArray })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error in get single post route' })
    }
})

// Reply on a post as a new tweet
tweetRouter.post('/reply/:postid', authentication, upload.single('media'), async (req, res) => {
    try {
        const { postid } = req.params;
        const { content } = req.body;
        const media = req.file;
        let result;
        if (!content) {
            return res.status(404).json({ message: 'Content is required' })
        }
        const post = await Tweet.findOne({ '_id': postid })
        if (!post) {
            return res.status(404).json({ message: 'Post not found' })
        }
        const reply = await Tweet({
            content: content,
            author: req.user._id,
            replyingTo: post
        })
        if (media) {
            if (media.path.includes('mp4')) {
                result = await cloudinary.uploader.upload(media.path, {
                    resource_type: 'auto',
                    chunk_size: 6000000,
                    public_id: `${Date.now()}-${media.originalname}`
                })
            } else if (media.path.includes('mpeg' || 'mkv')) {
                result = await cloudinary.uploader.upload(media.path, {
                    resource_type: 'auto',
                    chunk_size: 6000000,
                    public_id: `${Date.now()}-${media.originalname}`
                })
            } else {
                result = await cloudinary.uploader.upload(media.path, {
                    resource_type: 'auto',
                    public_id: `${Date.now()}-${media.originalname}`
                })
            }
            reply.media = result.secure_url;
        }
        await reply.save();
        await post.replies.push(reply);
        await post.save();
        console.log('working till here')
        res.status(200).json({ message: 'Replies to a post' })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error in reply a tweet route' })
    }
})

// Retweet a post

tweetRouter.post('/retweet/:postid', authentication, async (req, res) => {
    try {
        const { postid } = req.params;
        const { content } = req.body;
        const admin = req.user;
        const post = await Tweet.findById(postid).populate({ path: 'author', select: { passowrd: 0 } }).populate('retweets')
        if (!post) {
            return res.status(404).json({ message: 'Post not found' })
        }

        const retweet = await Tweet({
            content: content || ' ',
            author: admin._id,
            originalTweet: post._id
        })
        const alreadyRetweeted = await Tweet.findOne({ author: admin._id, originalTweet: post._id })
        if (alreadyRetweeted) {
            post.retweets.pull(alreadyRetweeted)
            await post.save()
            await alreadyRetweeted.deleteOne()
            return res.status(200).json({ message: 'Undo Retweet' })
        }
        await retweet.save();
        post.retweets.push(retweet);
        await post.save();
        res.status(200).json({ message: 'Retweeted successfully', retweet: retweet })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error in retweet a tweet route' })
    }
})







export default tweetRouter;