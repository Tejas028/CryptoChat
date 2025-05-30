import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext()

export const ChatProvider = ({ children }) => {

    const asciiKeyString = import.meta.env.VITE_REACT_APP_ASCII_KEY || '';
    const asciiKeyArray = asciiKeyString.split(',').map(Number);

    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [unseenMessages, setunseenMessages] = useState({})
    const [encryptedMessages, setEncryptedMessages] = useState([])

    const { socket, axios } = useContext(AuthContext)

    // Function to get all users for sidebar
    const getUsers = async () => {
        try {
            const { data } = await axios.get('/api/messages/users')
            if (data.success) {
                setUsers(data.users)
                setunseenMessages(data.unseenMessages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Function to get messages for selected users
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`)
            if (data.success) {
                setMessages(data.messages)
                encryptMessages(data.messages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Function to send message to selected user
    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData)
            if (data.success) {
                // Add the new message to messages
                setMessages((prevMessages) => {
                    const newMessages = [...prevMessages, data.newMessage];
                    // Update encryptedMessages based on the new messages
                    encryptMessages(newMessages);
                    return newMessages;
                });
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    const encryptMessages = (normalMessages) => {
        const encrypted = normalMessages.map((message) => {
            const msg = message.text;
            const msgLen = msg.length;
            let encryptedText = "";

            for (let j = 0; j < msgLen; j++) {
                // Get the ASCII code of the current character
                const asciiCode = msg.charCodeAt(j);
                // console.log(asciiCode);

                // Find the index in asciiKeyArray by shifting j by msgLen
                // Use modulo to avoid overflow if needed
                const keyIndex = (msg.charCodeAt(j) + msgLen) % asciiKeyArray.length;

                // Map the character's ASCII code to a new character using asciiKeyArray
                // For example: you could XOR asciiCode with asciiKeyArray[keyIndex] or just
                // replace the ascii code with asciiKeyArray[keyIndex]
                // Here, I'll replace with the asciiKeyArray value directly as a new char:
                const encryptedChar = String.fromCharCode(asciiKeyArray[keyIndex]);

                encryptedText += encryptedChar;
            }

            // Return a new message object with encrypted text but same other props
            return {
                ...message,
                text: encryptedText,
            };
        });

        setEncryptedMessages(encrypted);
    };


    // Function to subscribe to messages for selected user
    const subscribeToMessages = async () => {
        if (!socket) return

        socket.on("newMessage", (newMessage) => {
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true
                setMessages((prevMessages) => [...prevMessages, newMessage])
                axios.put(`/api/messages/mark/${newMessage._id}`)
            } else {
                setunseenMessages((prevUnseenMessages) => (
                    {
                        ...prevUnseenMessages, [newMessage.senderId]:
                            prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                    }
                ))
            }
        })
    }

    // Function to unsubscribe from messages
    const unsubscribeFromMessages = async () => {
        if (socket) socket.off("newMessage")
    }

    useEffect(() => {
        subscribeToMessages()
        return () => unsubscribeFromMessages
    }, [socket, selectedUser])

    const value = {
        messages, users,
        selectedUser,
        getUsers, getMessages,
        sendMessage, setSelectedUser,
        unseenMessages, setunseenMessages,
        encryptedMessages
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
} 