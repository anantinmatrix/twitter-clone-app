import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import upload from '../multer/multer.js';
import { v2 as cloudinary } from 'cloudinary'


const userRouter = express.Router();

import User from '../models/userModel.js';
import Tweet from '../models/tweetModel.js'
import authentication from '../auth/authentication.js';
import { populate } from 'dotenv';
// Register api
userRouter.post('/register', async (req, res) => {
    try {
        const { name, email, password, username } = req.body;
        if (!name || !email || !password || !username) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        const userExists = await User.findOne({ $or: [{ 'email': email }, { 'username': username }] })
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await new User({
            name: name,
            email: email,
            username: username,
            password: hashedPassword,
            userDetails: {
                profileImg: `${process.env.BACKEND_URL}/assets/default_user.jpg`,
                coverImg: `${process.env.BACKEND_URL}/assets/defualt_cover_img.jpg`
            }
        })
        newUser.save()
        res.status(200).json({ message: "Registration Successfull" })
    }
    catch (err) {
        res.status(500).json({ error: "Server Error" })
    }
})

// Login api
userRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const { JWT_KEY } = process.env;
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        const user = await User.findOne({ 'email': email })
        if (!user) {
            return res.status(404).json({ message: 'Invalid credentials' })
        }
        const comparePassword = await bcrypt.compare(password, user.password)
        if (!comparePassword) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }
        user.password = undefined;
        const token = jwt.sign({ _id: user._id }, JWT_KEY)
        res.status(200).json({ message: "Login Successful", user: user, token: token })
    }
    catch (err) {
        res.status(500).json({ error: err })
    }
})

// Get user's info
userRouter.get('/userinfo/:userid', async (req, res) => {
    try {
        const { userid } = req.params;
        const user = await User.findOne({ '_id': userid }).select({ password: 0 })
        res.status(200).json({ user })
    }
    catch (err) {
        res.status(500).json({ message: 'Server Error' })
    }
})

// Edit user api
userRouter.put('/edit', authentication, async (req, res) => {
    try {
        const user = req.user;
        let { age, phoneNo, location } = req.body;
        const updatedUser = await User.findOne({ _id: user._id }).select({password : 0})
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' })
        }
        if (age) {
            updatedUser.userDetails.age = age;
        }
        if (phoneNo) {
            updatedUser.userDetails.phoneNo = phoneNo;
        }

        if (location) {
            updatedUser.userDetails.location = location;
        }
        
        await updatedUser.save()
        res.status(200).json({ message: 'User updated successfully', user: updatedUser })
    } catch (error) {
        return res.status(500).json({ message: 'Some error occured', error: error })
    }
})

// Update user's bio
userRouter.put('/updatebio', authentication, async (req, res) => {
    try {
        const user = req.user;
        let { bio } = req.body;
        const updatedUser = await User.findOne({ _id: user._id }).select({password: 0})
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' })
        }
        updatedUser.userDetails.bio = bio;
        await updatedUser.save()
        res.status(200).json({ message: 'Bio updated successfully', user: updatedUser })
    } catch (error) {
        return res.status(500).json({ error: error })
    }
})

// Update user's profile picture
userRouter.put('/updateimg', authentication, upload.fields([{ name: 'profileImg', maxCount: 1 }, { name: 'coverImg', maxCount: 1 }]), async (req, res) => {
    try {
        const user = req.user;
        let images = req.files;

        const updatedUser = await User.findOne({ _id: user._id }).select({password: 0})
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' })
        }
        if (images.profileImg) {
            const profileImg = await cloudinary.uploader.upload(images.profileImg[0].path, {
                folder: 'profile-img',
                resource_type: 'auto',
                public_id: `profile_img-${Date.now()}-${images.profileImg[0].originalName}`
            })
            updatedUser.userDetails.profileImg = profileImg.secure_url;
        }
        if (images.coverImg) {
            const coverImg = await cloudinary.uploader.upload(images.coverImg[0].path, {
                folder: 'cover-img',
                resource_type: 'auto',
                public_id: `cover_img-${Date.now()}-${images.coverImg[0].originalname}`
            })
            updatedUser.userDetails.coverImg = coverImg.secure_url;

        }
        await updatedUser.save()
        res.status(200).json({ message: 'Profile image updated successfully', user: updatedUser })
    } catch (error) {
        return res.status(500).json({ error: error })
    }
})

// Follow or unfollow a user
userRouter.put('/follow/:id', authentication, async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const userToFollow = await User.findOne({ '_id': id })
        const loggedInUser = await User.findOne({ '_id': user._id })
        if (!userToFollow && !loggedInUser) {
            return res.status(404).json({ message: 'Users not found' })
        }
        if (userToFollow.followers.includes(user._id)) {
            userToFollow.followers.pull(user._id);
            loggedInUser.following.pull(userToFollow._id)
            await userToFollow.save()
            await loggedInUser.save()
            return res.status(200).json({ message: 'User unfollowed', userToFollow: userToFollow, loggedInUser: loggedInUser })
        } else {
            userToFollow.followers.push(user._id);
            loggedInUser.following.push(userToFollow._id)
            await userToFollow.save()
            await loggedInUser.save()
            return res.status(201).json({ message: 'User followed', userToFollow: userToFollow, loggedInUser: loggedInUser })
        }
    } catch (error) {
        return res.status(500).json({ error: error })

    }
})

// Get request to show user's all posts
userRouter.get('/userposts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ '_id': id }).populate({ path: 'following', select: { password: 0 } }).populate({ path: 'followers', select: { password: 0 } }).select({ password: 0 });
        const posts = await Tweet.find({ 'author': id }).populate({ path: 'author', select: { password: 0 } }).populate({ path: 'replyingTo', populate: { path: 'author', select: { password: 0 } } }).sort({ createdAt: -1 }).select({ password: 0 }).populate({ path: 'originalTweet', populate: { path: 'author', select: { password: 0 } } });
        if (!posts) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json({ message: `Successfully fetched user's posts`, tweets: posts, user: user })
    } catch (error) {
        return res.status(500).json({ message: `Internal Server Error in get user's posts`, error: error })
    }
})

// Saving a post to user's saved posts
userRouter.put('/savepost/:postid', authentication, async (req, res) => {
    try {
        const { postid } = req.params;
        const userId = req.user._id;
        const post = await Tweet.findOne({ '_id': postid })
        const user = await User.findOne({ '_id': userId }).select({ password: 0 })
        if (user.savedTweets.includes(post._id)) {
            user.savedTweets.pull(postid);
            await user.save();
            return res.status(200).json({ message: 'Unsaved a post', user })
        } else {
            user.savedTweets.push(post);
            await user.save();
            return res.json({ message: 'Saved a post', user })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' })
    }
})

// Fetching user's saved posts
userRouter.get('/savedposts', authentication, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findOne({ '_id': userId }).select({ password: 0 })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        const savedTweets = await Tweet.find({ _id: { $in: user.savedTweets } }).populate({ path: 'author', select: { password: 0 } }).populate({ path: 'replyingTo', populate: 'author' }).sort({ createdAt: -1 }).populate({ path: 'originalTweet', populate: { path: 'author', select: { password: 0 } } })
        if (!savedTweets) {
            return res.status(404).json({ message: 'No saved tweets found' })
        }

        res.json({ savedTweets })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' })
    }
})

userRouter.post('/searchUser', async(req,res)=>{
    try{
        const {name} = req.body;
        let regex = new RegExp(`^${name}`, 'i')
        const foundUser = await User.find({name: {$regex : name}})
        if(!foundUser){
            return res.status(404).json({message: 'User not found'})
        }
        res.status(200).json({message: 'User found', user: foundUser})
    }
    catch(err){
        console.log(err)
    }
})






export default userRouter;
