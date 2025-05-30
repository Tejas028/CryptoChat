import express from 'express'
import authUser from '../Middlewares/authUser.js'
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from '../Controllers/messageController.js'

const messageRouter=express.Router()

messageRouter.get('/users', authUser, getUsersForSidebar)
messageRouter.get('/:id',authUser,getMessages)
messageRouter.put('/mark/:id',authUser,markMessageAsSeen)
messageRouter.post('/send/:id',authUser,sendMessage)

export default messageRouter