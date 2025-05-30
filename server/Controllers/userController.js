import validator from 'validator'
import bcrypt, { genSalt } from 'bcryptjs'
import userModel from '../Models/userModel.js'
import { v2 as cloudinary } from 'cloudinary'
import { generateToken } from '../config/utils.js'
import nodemailer from 'nodemailer'

const verificationCodes = {}

const registerUser = async (req, res) => {

    const { name, email, password, secretKey } = req.body

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

        const isValid = validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        });

        if (!isValid) {
            return res.json({ success: false, message: "Enter a strong password!" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = await userModel.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            secretKey
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
        const { email, password } = req.body
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist!" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = generateToken(user._id)
            res.json({ success: true, userData: user, token, message: "Login Successful" })
        } else {
            res.json({ success: false, message: "Invalid Password!" })
        }


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// route: POST /api/auth/send-code
export const sendVerificationCode = async (req, res) => {
    const { email, bool, code } = req.body;

    if (!email || !validator.isEmail(email)) {
        return res.json({ success: false, message: "Invalid email" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser && bool) {
        return res.json({ success: false, message: "Account already exists" });
    }

    // Store verification code with temporary flag
    verificationCodes[email.toLowerCase()] = { 
        code, 
        verified: false,
        isTemporary: !bool
    };

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });

    // Choose email content based on bool value
    const emailContent = bool ? getPermanentEmailContent(code) : getTemporaryEmailContent(code);

    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: bool ? "Welcome! Please verify your email address" : "🔐 Your Temporary Chat Access Code",
            html: emailContent.html,
            text: emailContent.text
        });

        // Set up auto-cleanup for temporary codes (when bool is false)
        if (!bool) {
            setTimeout(() => {
                if (verificationCodes[email.toLowerCase()] && !verificationCodes[email.toLowerCase()].verified) {
                    delete verificationCodes[email.toLowerCase()];
                    console.log(`Auto-deleted temporary code for: ${email}`);
                }
            }, 30 * 60 * 1000); // 30 minutes cleanup
        }

        return res.json({ 
            success: true, 
            message: bool ? "Verification code sent" : "Temporary chat access code sent",
            isTemporary: !bool
        });
    } catch (error) {
        console.error("Error sending email:", error.message);
        return res.status(500).json({ success: false, message: "Failed to send email." });
    }
};

// Email content for permanent registration (bool = true)
const getPermanentEmailContent = (code) => ({
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
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
    .welcome-title {
      color: #2c3e50;
      font-size: 28px;
      margin-bottom: 10px;
    }
    .verification-code {
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
    .highlight {
      color: #e74c3c;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="welcome-title">Welcome to CryptoChat! 🎉</h1>
      <p>Thank you for registering with us. We're excited to have you on board!</p>
    </div>
    
    <div class="content">
      <h2>Verify Your Email Address</h2>
      <p>To complete your registration and secure your account, please use the verification code below:</p>
      
      <div class="verification-code">
        ${code}
      </div>
      
      <div class="instructions">
        <h3>📋 Instructions:</h3>
        <ul>
          <li>Enter this 6-digit code in the verification field on our website</li>
          <li>This code is valid until it is manually verified</li>
          <li>If you didn't request this verification, please ignore this email</li>
        </ul>
      </div>
      
      <p>Once verified, you'll have full access to all our features and services.</p>
      
      <p>If you're having trouble with verification, feel free to contact our support team.</p>
    </div>
    
    <div class="footer">
      <p>This is an automated message, please do not reply to this email.</p>
      <p>© 2025 CryptoChat. All rights reserved.</p>
      <p>If you didn't create an account with us, please ignore this email.</p>
    </div>
  </div>
</body>
</html>`,
    text: `
Welcome to CryptoChat!

Thank you for registering with us. We're excited to have you on board!

VERIFICATION CODE: ${code}

Please enter this 6-digit code to verify your email address and complete your registration.

Important:
- This code is valid until it is manually verified
- Enter the code in the verification field on our website
- If you didn't request this, please ignore this email

Once verified, you'll have full access to all our features.

If you need help, contact our support team.

© 2025 CryptoChat
This is an automated message - please do not reply.
    `
});

// Email content for temporary chat access (bool = false) - with self-destructing content
const getTemporaryEmailContent = (code) => ({
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Temporary Chat Access</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .container {
      background-color: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      border: 3px solid #f39c12;
    }
    .header {
      text-align: center;
      margin-bottom: 25px;
    }
    .temp-title {
      color: #e74c3c;
      font-size: 26px;
      margin-bottom: 10px;
      font-weight: bold;
    }
    .passkey-code {
      background: linear-gradient(45deg, #e74c3c, #f39c12);
      color: white;
      font-size: 36px;
      font-weight: bold;
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      margin: 25px 0;
      letter-spacing: 4px;
      box-shadow: 0 5px 15px rgba(231, 76, 60, 0.3);
    }
    .warning-box {
      background-color: #fff3cd;
      border: 2px solid #ffc107;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .auto-delete-notice {
      background-color: #f8d7da;
      border: 2px solid #dc3545;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: center;
    }
    .timer {
      font-weight: bold;
      color: #dc3545;
      font-size: 18px;
    }
    .footer {
      margin-top: 25px;
      padding-top: 15px;
      border-top: 2px solid #eee;
      font-size: 13px;
      color: #6c757d;
      text-align: center;
    }
    .highlight {
      color: #dc3545;
      font-weight: bold;
    }
    .temp-badge {
      display: inline-block;
      background-color: #dc3545;
      color: white;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      margin-bottom: 15px;
    }
    .expired {
      text-align: center;
      padding: 50px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container" id="emailContent">
    <div class="header">
      <div class="temp-badge">⏰ TEMPORARY ACCESS</div>
      <h1 class="temp-title">🔐 Chat Unlock Code</h1>
      <p>Your temporary passkey for secure chat access</p>
    </div>
    
    <div class="content">
      <h2>Your Chat Passkey</h2>
      <p>Use this 6-digit code to unlock and access the chat:</p>
      
      <div class="passkey-code" id="codeDisplay">
        ${code}
      </div>
      
      <div class="warning-box">
        <h3>⚡ Quick Access Instructions:</h3>
        <ul>
          <li>Enter this code to <strong>unlock the chat</strong></li>
          <li>This is for <strong>temporary access only</strong></li>
          <li>No account registration required</li>
        </ul>
      </div>
      
      <div class="auto-delete-notice">
        <strong>🗑️ AUTO-DELETE NOTICE</strong><br>
        This email content will self-destruct in <span class="timer" id="countdown">30:00</span> for security purposes.
      </div>
      
      <p><strong>Note:</strong> This is a one-time access code for temporary chat usage. For permanent access and full features, please create a registered account.</p>
    </div>
    
    <div class="footer">
      <p><strong>⚠️ Security Notice:</strong> This email contains sensitive access information</p>
      <p>© 2025 CryptoChat - Temporary Access Service</p>
      <p>This message will self-destruct for your security</p>
    </div>
  </div>

  <script>
    // Self-destruct timer
    let timeLeft = 30 * 60; // 30 minutes in seconds
    
    const countdown = setInterval(() => {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      
      document.getElementById('countdown').textContent = 
        minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
      
      timeLeft--;
      
      if (timeLeft < 0) {
        clearInterval(countdown);
        document.getElementById('emailContent').innerHTML = \`
          <div class="expired">
            <h2>🔒 This message has expired</h2>
            <p>This temporary access code has been automatically cleared for security.</p>
            <p>Please request a new code if you still need access.</p>
          </div>
        \`;
      }
    }, 1000);
  </script>
</body>
</html>`,
    text: `
🔐 TEMPORARY CHAT ACCESS CODE

Your Chat Passkey: ${code}

QUICK ACCESS:
- Enter this 6-digit code to unlock the chat
- For temporary access only
- No registration required

⚠️ AUTO-DELETE NOTICE:
This email content will self-destruct in 30 minutes for security.

SECURITY NOTE: This is a one-time access code for temporary chat usage.
For permanent access, please create a registered account.

© 2025 CryptoChat - Temporary Access Service
This message will self-destruct for your security.
    `
});


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

    // Mark as verified
    verificationCodes[email.toLowerCase()].verified = true;

    return res.json({ success: true, message: "Email verified" });
};


const checkAuth = async (req, res) => {
    res.json({ success: true, user: req.user })
}

const getProfile = async (req, res) => {
    try {

        const { userId } = req.body
        const userData = await userModel.findById({ userId }).select('-password')

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { image, name, phone, bio } = req.body;
        const userId = req.user._id;
        let updateUser;

        if (!image) {
            updateUser = await userModel.findByIdAndUpdate(userId, { name, phone, bio }, { new: true });
        } else {
            const imageUpload = await cloudinary.uploader.upload(image.path, { resource_type: 'image' });
            const imageURL = imageUpload.secure_url;
            updateUser = await userModel.findByIdAndUpdate(userId, { image: imageURL, name, phone, bio }, { new: true });
        }

        // Return the existing token if no changes in payload
        const token = req.headers.token; // the one user already has

        res.json({ success: true, message: "Profile Updated!", user: updateUser, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


export { registerUser, loginUser, getProfile, updateProfile, checkAuth }