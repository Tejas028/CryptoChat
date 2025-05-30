import jwt from 'jsonwebtoken';
import userModel from '../Models/userModel.js';

const authUser = async (req, res, next) => {
    try {
        const {token}=req.headers;
        if(!token){
            return res.json({success:false, message:"Login Unauthorized"});
        }
        const decoded_token=jwt.verify(token,process.env.JWT_SECRET);
        
        const user=await userModel.findById(decoded_token.userId).select('-password')

        if(!user) return res.json({success:false, message:"User not found!"})

        req.user=user
        next()
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export default authUser