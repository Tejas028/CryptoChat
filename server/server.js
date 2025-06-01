import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import http from 'http'
import userRouter from './Routes/userRoutes.js'
import messageRouter from './Routes/messageRoutes.js'
import { Server } from 'socket.io'

dotenv.config()

const app = express()
const server = http.createServer(app)

// Setup socket.io
export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

// Store online users
export const userSocketMap = {} // { userId: socketId }

// Handle socket connections
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId
  console.log('🔌 User connected:', userId)

  if (userId) {
    userSocketMap[userId] = socket.id
  }

  io.emit('getOnlineUsers', Object.keys(userSocketMap))

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', userId)
    delete userSocketMap[userId]
    io.emit('getOnlineUsers', Object.keys(userSocketMap))
  })
})

// Middleware
app.use(express.json({ limit: '4mb' }))
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}))

// Routes
app.get('/api/status', (req, res) => {
  res.send('✅ API Working')
})
app.use('/api/auth', userRouter)
app.use('/api/messages', messageRouter)

// Connect to DB and Cloudinary
try {
  await connectDB()
  console.log('✅ Database connected')
} catch (error) {
  console.error('❌ Database connection failed:', error)
}

try {
  await connectCloudinary()
  console.log('✅ Cloudinary connected')
} catch (error) {
  console.error('❌ Cloudinary connection failed:', error)
}

// Start the server
const PORT = process.env.PORT || 5000
server.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.error('❌ Failed to start server:', err)
    process.exit(1)
  }
  console.log(`🚀 Server running on port ${PORT}`)
})

export default server
