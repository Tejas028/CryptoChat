import messageModel from "../Models/messageModel.js"
import userModel from "../Models/userModel.js"
import { v2 as cloudinary } from 'cloudinary'
import { io, userSocketMap } from '../server.js'
import nodemailer from 'nodemailer';

// Get all users except logged in user
export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id
        const filterUsers = await userModel.find({ _id: { $ne: userId } }).select('-password')

        const unseenMessages = {}
        const promises = filterUsers.map(async (user) => {
            const messages = await messageModel.find({ senderId: user._id, recieverId: userId, seen: false })
            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }

        })
        await Promise.all(promises)
        res.json({ success: true, users: filterUsers, unseenMessages })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Get all messages for selected user
export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params
        const myId = req.user._id

        const messages = await messageModel.find({
            $or: [
                { senderId: myId, recieverId: selectedUserId },
                { recieverId: myId, senderId: selectedUserId }
            ]
        })

        await messageModel.updateMany({ senderId: selectedUserId, recieverId: myId }, { seen: true })

        res.json({ success: true, messages })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// API to mark message as seen using message id
export const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params
        await messageModel.findByIdAndUpdate(id, { seen: true })
        res.json({ success: true })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Send message to selected user
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body
        const recieverId = req.params.id
        const senderId = req.user._id

        let imageUrl
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = await messageModel.create({
            senderId,
            recieverId,
            text,
            image: imageUrl
        })

        const recieverSocketId = userSocketMap[recieverId]
        if (recieverSocketId) {
            io.to(recieverSocketId).emit("newMessage", newMessage)
        }
        // console.log(newMessage);

        res.json({ success: true, newMessage })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

