import express from 'express'
import { checkAuth, getProfile, loginUser, registerUser, sendVerificationCode, setSecretKey, updateProfile, verifyCode } from '../Controllers/userController.js'
import authUser from '../Middlewares/authUser.js'

const userRouter = express.Router()

userRouter.post('/signup', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/send-code',sendVerificationCode)
userRouter.post('/verify-code',verifyCode)

userRouter.get('/check', authUser, checkAuth)
userRouter.put('/update-profile', authUser, updateProfile)
userRouter.post('/set-secret-key', setSecretKey)

export default userRouter