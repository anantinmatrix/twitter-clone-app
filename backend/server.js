// importing all the depenencies
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { configDotenv } from 'dotenv';
import userRouter from './routes/userRoutes.js';
import tweetRouter from './routes/tweetRoutes.js';
import http from 'http'
import { Server } from 'socket.io';
import Messages from './models/message.js';
import messageRouter from './routes/messageRoutes.js';
import Conversation from './models/conversation.js';
import ConversationRouter from './routes/conversationRoutes.js';


// configuring .env 
configDotenv()

const app = express();
const server = http.createServer(app)

//middleware configuration
app.use(express.json())
app.use('/assets', express.static('assets'))
app.use(cors())


// Function to connect to database
const connectToDb = () => {
    try {
        mongoose.connect(process.env.MONGOOSE_URL)
        mongoose.connection.on('connected', () => {
            console.log('Connected to Mongoose')
        })
        mongoose.connection.on('error', () => {
            console.log('some error occured while connecting to Mongoose')
        })
    }
    catch (error) {
        console.log(`Error connecting to Mongoose: ${error}`)
    }
}
connectToDb()

// Socket.io connection
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {
    console.log('Socket connected ', socket.id)

    socket.on('joinroom', ({ senderId, receiverId }) => {
        const roomId = [senderId, receiverId].sort().join('-')
        socket.join(roomId)
        console.log(`User has joined a room : ${roomId}`)
    })

    socket.on('sendMessage', async ({ senderId, receiverId, content }) => {

        // save the message to database and broadcast it to the receiver's room
        if (!senderId || !receiverId || !content) {
            console.log('something is missing')
            return;
        }
        else {
            let date = new Date();
            let today = date.toLocaleString("en-IN",{
                hour12: true,
                minute: "2-digit",
                hour: "2-digit",

            })
            const message = await Messages({
                senderId: senderId,
                receiverId: receiverId,
                members: [senderId, receiverId],
                content: content,
                // time: today
            })
            console.log(message)
            const alreadyConversation = await Conversation.find({'members': {$all : [senderId, receiverId]}})
            if(alreadyConversation.length === 0){
                console.log('no coversation creating a new one')
                const newConversation = await Conversation({
                    members: [senderId, receiverId],
                })
                await newConversation.save()
            }
            await message.save();
            const roomId = [senderId, receiverId].sort().join('-');
            io.to(roomId).emit('receiveMessage', message)
        }

    })

    socket.on('disconnect', () => {
        console.log('Disconnected socket ', socket.id)
    })
})




// Connecting the routes
app.use('/api/user', userRouter)
app.use('/api/tweet', tweetRouter)
app.use('/api/messages', messageRouter)
app.use('/api/conversation', ConversationRouter)



server.listen(5000, () => {
    console.log('The server is running on Port: 5000')
})