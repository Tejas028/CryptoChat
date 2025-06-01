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
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Chat App Backend API',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      status: '/api/status',
      auth: '/api/auth',
      messages: '/api/messages'
    }
  })
})

app.get('/api/status', (req, res) => {
  console.log('📊 Health check requested')
  res.json({
    status: '✅ API Working',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())} seconds`,
    environment: process.env.NODE_ENV || 'development'
  })
})

app.use('/api/auth', userRouter)
app.use('/api/messages', messageRouter)

// Connect to DB and Cloudinary
try {
  await connectDB()
  console.log('✅ Database connected successfully')
} catch (error) {
  console.error('❌ Database connection failed:', error.message)
  // Continue without DB - let the app start anyway
}

try {
  await connectCloudinary()
  console.log('✅ Cloudinary connected successfully')
} catch (error) {
  console.error('❌ Cloudinary connection failed:', error.message)
  // Continue without Cloudinary - let the app start anyway
}

// Start the server
const PORT = process.env.PORT || 5000
console.log('🔧 Environment:', process.env.NODE_ENV || 'development')
console.log('🌐 Frontend URL:', process.env.FRONTEND_URL || 'Not set (using *)')
console.log('📡 Starting server on port:', PORT)

server.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.error('❌ Failed to start server:', err)
    process.exit(1)
  }
  console.log(`🚀 Server running successfully on port ${PORT}`)
  console.log(`🌍 Server accessible at: http://0.0.0.0:${PORT}`)
})

export default server