import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const asciiKeyString = import.meta.env.VITE_REACT_APP_ASCII_KEY || '';
    const asciiKeyArray = asciiKeyString.split(',').map(Number);

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setunseenMessages] = useState({});
    const [encryptedMessages, setEncryptedMessages] = useState([]);

    const { socket, axios } = useContext(AuthContext);

    // Get all users
    const getUsers = async () => {
        try {
            const { data } = await axios.get('/api/messages/users');
            if (data.success) {
                setUsers(data.users);
                setunseenMessages(data.unseenMessages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Get messages for selected user
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success) {
                setMessages(data.messages);
                encryptMessages(data.messages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Send a message to selected user
    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if (data.success) {
                setMessages((prevMessages) => {
                    const newMessages = [...prevMessages, data.newMessage];
                    encryptMessages(newMessages);
                    return newMessages;
                });
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Encrypt messages
    const encryptMessages = (normalMessages) => {
        const encrypted = normalMessages.map((message) => {
            const msg = message.text;
            const msgLen = msg.length;
            let encryptedText = "";

            for (let j = 0; j < msgLen; j++) {
                const asciiCode = msg.charCodeAt(j);
                const keyIndex = (asciiCode + msgLen) % asciiKeyArray.length;
                const encryptedChar = String.fromCharCode(asciiKeyArray[keyIndex]);
                encryptedText += encryptedChar;
            }

            return { ...message, text: encryptedText };
        });

        setEncryptedMessages(encrypted);
    };

    // Handle incoming messages via socket
    const subscribeToMessages = () => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true;

                setunseenMessages((prev) => ({
                    ...prev,
                    [selectedUser._id]: 0
                }));

                setMessages((prevMessages) => {
                    const alreadyExists = prevMessages.some(msg => msg._id === newMessage._id);
                    if (alreadyExists) return prevMessages;

                    const updatedMessages = [...prevMessages, newMessage];
                    encryptMessages(updatedMessages);
                    return updatedMessages;
                });

                axios.put(`/api/messages/mark/${newMessage._id}`);
            } else {
                setunseenMessages((prev) => ({
                    ...prev,
                    [newMessage.senderId]: prev[newMessage.senderId]
                        ? prev[newMessage.senderId] + 1
                        : 1
                }));
            }
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage); // ✅ cleanup
        };
    };

    useEffect(() => {
        const unsubscribe = subscribeToMessages();
        return () => {
            if (unsubscribe) unsubscribe(); // ✅ FIXED: actually call cleanup
        };
    }, [socket, selectedUser]);

    const value = {
        messages,
        users,
        selectedUser,
        getUsers,
        getMessages,
        sendMessage,
        setSelectedUser,
        unseenMessages,
        setunseenMessages,
        encryptedMessages
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};
