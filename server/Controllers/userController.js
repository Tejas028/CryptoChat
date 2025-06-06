import validator from 'validator'
import bcrypt, { genSalt } from 'bcryptjs'
import userModel from '../Models/userModel.js'
import { v2 as cloudinary } from 'cloudinary'
import { generateToken } from '../config/utils.js'
import nodemailer from 'nodemailer'

const verificationCodes = {}

const registerUser = async (req, res) => {

  const { name, email, password } = req.body

  try {

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details!" })
    }

    const user = await userModel.findOne({ email })

    if (user) {
      return res.json({ success: false, message: "Account already exists!" })
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email!" })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const userData = await userModel.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    const token = generateToken(userData._id)

    res.json({ success: true, userData: userData, token, message: "Account created successfully" })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email.toLowerCase() }); // ✅ normalize email

    if (!user) {
      return res.json({ success: false, message: "Invalid email or password" }); // ✅ better message
    }

    const isMatch = await bcrypt.compare(password, user.password); // ✅ added await

    if (isMatch) {
      const token = generateToken(user._id);
      res.json({ success: true, userData: user, token, message: "Login Successful" });
    } else {
      res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const setSecretKey = async (req, res) => {
  try {
    const { secretKey, email } = req.body;

    if (!secretKey || !email) {
      return res.status(400).json({ success: false, message: "Secret key and email are required." });
    }

    const user = await userModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    await userModel.updateOne(
      { email: email.toLowerCase() },
      { $set: { secretKey: secretKey } }
    );

    res.status(200).json({ success: true, message: "Secret key updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

export const setUserGuideSeen = async (req, res) => {
  try {
    const { email } = req.body

    await userModel.updateOne(
      { email: email.toLowerCase() },
      { $set: { hasSeenUserGuide: true } }
    );

    res.json({ success: true, message: 'User guide status updated' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// route: POST /api/auth/send-code
export const sendVerificationCode = async (req, res) => {
  const { email, bool, code } = req.body;

  if (!email || !validator.isEmail(email)) {
    return res.json({ success: false, message: "Invalid email" });
  }

  const existingUser = await userModel.findOne({ email: email.toLowerCase() });
  if (existingUser && bool) {
    return res.json({ success: false, message: "Account already exists" });
  }

  const EXPIRY_MINUTES = 10;
  verificationCodes[email.toLowerCase()] = {
    code,
    verified: false,
    isTemporary: !bool,
    expiresAt: Date.now() + EXPIRY_MINUTES * 60 * 1000, // ✅ FIXED
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const emailContent = getUnifiedEmailContent(code, bool);

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: bool ? "Welcome! Please verify your email address" : "🔐 Your Chat Verification Code",
      html: emailContent.html,
      text: emailContent.text,
    });

    return res.json({
      success: true,
      message: "Verification code sent",
    });
  } catch (error) {
    console.error("Error sending email:", error.message);
    return res.status(500).json({ success: false, message: "Failed to send email." });
  }
};

// Unified email content generator
const getUnifiedEmailContent = (code, isWelcome = false) => {
  const subject = isWelcome
    ? "Welcome! Please verify your email address"
    : "🔐 Your Chat Access Code";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      background-color: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .title {
      color: #2c3e50;
      font-size: 28px;
      margin-bottom: 10px;
    }
    .code-box {
      background-color: #3498db;
      color: white;
      font-size: 32px;
      font-weight: bold;
      padding: 15px 30px;
      border-radius: 8px;
      text-align: center;
      margin: 25px 0;
      letter-spacing: 3px;
    }
    .instructions {
      background-color: #ecf0f1;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      font-size: 14px;
      color: #7f8c8d;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="title">${isWelcome ? "Welcome to CryptoChat! 🎉" : "🔐 Your Chat Access Code"}</h1>
      <p>${isWelcome
      ? "Thank you for registering with us. We're excited to have you on board!"
      : "Here's your secure code to access the chat system."}</p>
    </div>
    <div class="content">
      <p>${isWelcome
      ? "To complete your registration, please use the code below to verify your email address:"
      : "Use the following access code to proceed:"}</p>

      <div class="code-box">
        ${code}
      </div>

      <div class="instructions">
        <h3>📋 Instructions:</h3>
        <ul>
          <li>Enter this 6-digit code on the website</li>
          <li>This code is valid until it is manually verified</li>
          <li>If you didn’t request this code, please ignore this email</li>
        </ul>
      </div>
    </div>
    <div class="footer">
      <p>This is an automated message. Please do not reply to this email.</p>
      <p>© 2025 CryptoChat. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

  const text = `
${isWelcome ? "Welcome to CryptoChat!" : "🔐 Your Chat Access Code"}

CODE: ${code}

Instructions:
- Enter this 6-digit code on the website
- Valid until manually verified
- If you didn’t request this code, ignore this email

© 2025 CryptoChat - Automated Message
`;

  return { html, text, subject };
};

// route: POST /api/auth/verify-code
export const verifyCode = async (req, res) => {
  const { email, code } = req.body;
  const record = verificationCodes[email?.toLowerCase()];

  if (!record) return res.json({ success: false, message: "No code sent" });

  if (record.expiresAt < Date.now()) {
    return res.json({ success: false, message: "Code expired" });
  }

  if (record.code !== code) {
    return res.json({ success: false, message: "Invalid code" });
  }

  verificationCodes[email.toLowerCase()].verified = true;
  return res.json({ success: true, message: "Email verified" });
};

const checkAuth = async (req, res) => {
  res.json({ success: true, user: req.user })
}

const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select('-password'); // ✅ fixed usage
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const updateProfile = async (req, res) => {
  try {
    const { image, name, phone, bio, password, secretKey } = req.body;
    const userId = req.user._id;
    let updateUser;

    if (!image) {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updateUser = await userModel.findByIdAndUpdate(userId, { name, phone, bio, password: hashedPassword, secretKey }, { new: true });
      } else {
        updateUser = await userModel.findByIdAndUpdate(userId, { name, phone, bio, secretKey }, { new: true });
      }
    } else {
      const imageUpload = await cloudinary.uploader.upload(image, { resource_type: 'image' }); // ✅ base64 supported
      const imageURL = imageUpload.secure_url;
      updateUser = await userModel.findByIdAndUpdate(userId, { image: imageURL, name, phone, bio }, { new: true });
    }

    const token = req.headers.token;
    res.json({ success: true, message: "Profile Updated!", user: updateUser, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



export { registerUser, loginUser, getProfile, updateProfile, checkAuth, setSecretKey }