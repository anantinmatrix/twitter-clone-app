import mongoose, { mongo } from "mongoose";
// const date = new Date();
// const time = `${date.getHours()}:${date.getMinutes()}`;

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usermodel',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usermodel',
        required: true,

    },
    members: {
        type: Array
    },
    content: {
        type: String,
        required: true
    },
    time: {
        type: String,
        default: () => {
            const date = new Date();
            return date.toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            })
        }
    }

}, { timestamps: true })

const Messages = new mongoose.model('messagemodel', messageSchema)
export default Messages;