import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    image: { type: String, default: "" },
    bio: { type: String, default: "Hey there! I am using CryptoChat" },
    phone: { type: String, default: '0000000000' },
    verificationCode: { type: String },
    verificationCodeExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },
    secretKey: { type: String },
    hasSeenUserGuide: { type: Boolean, default: false }
}, { timestamps: true })

const userModel = mongoose.models.user || new mongoose.model('user', userSchema)

export default userModel