
# Crypto Chat

Crypto Chat is a secure real-time messaging app with a dynamic modern user interface, live online status, and encrypted chats. It was developed using the MERN stack.  With the help of Vercel and Socket.IO, it guarantees quick and confidential device connection.

## Features

- 🔐 End-to-end encrypted chat 
- 💬 Real-time messaging using Socket.IO
- 👤 User authentication (JWT-based)
- 🧑‍🤝‍🧑 One-to-one messaging support
- ✅ Online/offline status indicators
- 📱 Responsive and mobile-friendly UI
- 🌙 Dark mode support


## Tech Stack

**Frontend:** React+Vite, TailwindCSS

**Backend:** Node, Express

**Database:** MongoDB + Mongoose

**Deployment:** Vercel (Frontend), Render (Backend)


## Installation

Prerequisites Node.js (v18+)  
MongoDB Atlas account (or local MongoDB)  
Vite (for React frontend)

**Clone the Repository**
```bash
  git clone https://github.com/<your-username>/crypto-chat.git
  cd crypto-chat
```

**Setup**

Backend :-
```bash
  cd server
  npm install
```
Create a .env file:
```bash
  PORT=5000
  MONGO_URI=<your-mongodb-uri>
  JWT_SECRET=<your-secret>
  CLOUDINARY_CLOUD_NAME=<cloudinary-name>
  CLOUDINARY_API_KEY=<cloudinary-key>
  CLOUDINARY_API_SECRET=<cloudinary-secret>
```
Run the backend:
```bash
  node server.js
```

Frontend:-
```bash
  cd client
  npm install
```
Create a .env file in client/:
```bash
  VITE_REACT_APP_BACKEND_URL=http://localhost:5000
  VITE_REACT_APP_ASCII_KEY=3,1,4,1,5  # example ASCII key
```
Run the frontend:
```bash
  npm run dev
```
## Contributing

Contributions are always welcomed!

1. Fork the repo  
2. Create your feature branch: git checkout -b feature/FeatureName  
3. Commit your changes: git commit -m 'Add FeatureName'  
4. Push to the branch: git push origin feature/FeatureName  
5. Open a pull request


