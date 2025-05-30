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


// Initialize socket.io
export const io = new Server(server, {
  cors: { origin: "*" }
})

// store online users
export const userSocketMap = {}; //{userId:socketId}

// Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId
  console.log("User connected", userId);

  if (userId) userSocketMap[userId] = socket.id

  // Emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap))
  // console.log(5);

  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);
    delete userSocketMap[userId]
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

  })

})

app.use(express.json({ limit: "4mb" }))
app.use(cors())

app.get('/api/status', (req, res) => {
  res.send('API Working')
})
app.use('/api/auth', userRouter)
app.use('/api/messages', messageRouter)

await connectDB()
await connectCloudinary()

if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 5000
  server.listen(port, () => console.log("Server Started", port))
}

// Export server for vercel
export default server