import mongoose from "mongoose";
import express from 'express'
import Messages from "../models/message.js";
const messageRouter = express.Router();

messageRouter.get('/getmessages', async (req, res) => {
    const { senderId, receiverId } = req.query;
    console.log(senderId, receiverId)
    if (senderId && receiverId) {
        const messages = await Messages.find({'members': {$all: [senderId, receiverId]}})
        if (!messages) {
            return res.status(404).json({ message: 'No messages found' })
        }
        return res.status(200).json({ message: messages })
    }
})

export default messageRouter;