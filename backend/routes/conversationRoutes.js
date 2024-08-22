import express from 'express'
import Conversation from '../models/conversation.js';
import authentication from '../auth/authentication.js';

const ConversationRouter = express.Router();

ConversationRouter.get('/',authentication, async(req, res)=>{
    const admin = req.user;
    const conversations = await Conversation.find({'members': {$in: [admin._id]}}).populate({path: 'members', select: {password: 0}})
    if(!conversations){
        return res.status(404).json({message: 'No conversations found'})
    }
    res.status(200).json(conversations)
})




export default ConversationRouter;