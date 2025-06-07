import { createContext, useEffect, useState } from "react"
import axios from 'axios'
import toast from "react-hot-toast"
import { io } from 'socket.io-client'

const backendUrl = import.meta.env.VITE_BACKEND_URL
axios.defaults.baseURL = backendUrl

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem('token'))
    const [authUser, setAuthUser] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [socket, setSocket] = useState(null)
    const [passCode, setPassCode] = useState('')
    const [state, setState] = useState('Sign Up');
    const [darkMode, setDarkMode] = useState(false);

    // Check if the user is authenticated and if so, set the user data and connect the socket
    const checkAuth = async () => {
        try {
            const { data } = await axios.get('/api/auth/check')
            if (data.success) {
                setAuthUser(data.user)
                connectSocket(data.user)
            }
        } catch (error) {
            // console.log(5);

            toast.error(error.message)
        }
    }

    // Login function to handle user authentication and socket connection
    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials)
            if (data.success) {
                setAuthUser(data.userData)
                connectSocket(data.userData)
                axios.defaults.headers.common["token"] = data.token
                setToken(data.token)
                localStorage.setItem("token", data.token)
                toast.success(data.message)
                return true
            } else {
                toast.error(data.message)
                return false
            }
        } catch (error) {
            toast.error(error.message)
            return false
        }
    }

    const setUserGuideSeen = async (email) => {
        try {
            const { data } = await axios.post('/api/auth/set-user-guide-seen', { email });

            if (data.success) {
                console.log('User guide status updated successfully');
                return true;
            } else {
                toast.error(data.message || 'Failed to update user guide status');
                return false;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Something went wrong');
            return false;
        }
    };


    // Send Mail function
    const sendVerificationCode = async (email, bool) => {
        try {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            setPassCode(code);

            const { data } = await axios.post('/api/auth/send-code', { email, bool, code });

            if (data.success) {
                if (bool) toast.success("Verification code sent to your email!");
                return true;
            } else {
                toast.error(data.message || "Failed to send code.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Unexpected error.");
        }
    };

    // Function to verify code
    const verifyCode = async (email, code) => {
        try {
            const { data } = await axios.post('/api/auth/verify-code', { email, code })
            if (data.success) {
                toast.success("Verification Successful")
                return true
            } else {
                toast.error(data.message)
                return false
            }
        } catch (error) {
            toast.error(error.message)
            return false
        }
    }

    // Logout function to handle user logout and socket disconnection
    const logout = async () => {
        localStorage.removeItem("token")
        setToken(null)
        setAuthUser(null)
        setOnlineUsers([])
        axios.defaults.headers.common["token"] = null
        toast.success("Logged Out Successfully!")
        socket.disconnect()
        setState('Login')
    }

    // Update profile function to handle user profile updates
    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put('/api/auth/update-profile', body)
            if (data.success) {
                setAuthUser(data.user)
                toast.success("Profile Updated Successfully")
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Connect socket function to handle socket connection and online user updates
    const connectSocket = async (userData) => {
        if (!userData || socket?.connected) return

        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id
            }
        })

        newSocket.connect()
        setSocket(newSocket)

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds)
        })
    }

    const setSecretKey = async (secretKey, email) => {
        try {
            const { data } = await axios.post('/api/auth/set-secret-key', {
                secretKey,
                email,
            })

            if (data.success) {
                setAuthUser(prev => ({
                    ...prev,
                    secretKey,
                }));
                toast.success("Secret key set successfully!")
            } else {
                toast.error(data.message || "Failed to set secret key.")
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || error.message || "Something went wrong."
            )
        }
    }

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["token"] = token;
            checkAuth();
        }
    }, [token]); // re-run whenever token changes

    const markUserGuideAsSeen = () => {
        setAuthUser(prev => ({
            ...prev,
            hasSeenUserGuide: true,
        }));
    };

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
        sendVerificationCode,
        verifyCode, passCode,
        darkMode, setDarkMode,
        state, setState,
        setSecretKey,
        setUserGuideSeen
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}