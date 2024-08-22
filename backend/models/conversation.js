import mongoose, { mongo } from "mongoose";

const conversationSchema = new mongoose.Schema({
    members:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usermodel'
    }]
},{timestamps: true})

const Conversation = new mongoose.model('conversationmodel', conversationSchema)
export default Conversation;