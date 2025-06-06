import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "userModel", required: true },
    recieverId: { type: mongoose.Schema.Types.ObjectId, ref: "userModel", required: true },
    text: { type: String, },
    image: { type: String, },
    seen: { type: Boolean, default: false },
    deleteForSender: { type: Boolean, default: false },
    deleteForReceiver: { type: Boolean, default: false }
}, { timestamps: true })

const messageModel = mongoose.models.message || new mongoose.model('message', messageSchema)

export default messageModel