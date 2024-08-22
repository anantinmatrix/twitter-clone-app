import express from 'express';
import mongoose from 'mongoose';

const notificationModel = new mongoose.Schema({
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'usermodel'},
    message: {type: String, required: true} ,
    createdAt : {type: Date, default: Date.now}
})

const Notification = new mongoose.model('notificationmodel', notificationModel)
export default Notification;