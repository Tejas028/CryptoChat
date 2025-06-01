import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import toast from 'react-hot-toast';

const Home = () => {
    const navigate = useNavigate();

    const [profileDrop, setProfileDrop] = useState(false);
    const [addDrop, setAddDrop] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [msgInput, setMsgInput] = useState('');
    const bottomRef = useRef(null);
    const [isUnlocked, setIsUnlocked] = useState(false)

    const { logout, onlineUsers, authUser, sendVerificationCode, passCode, darkMode, setDarkMode } = useContext(AuthContext);
    const { messages, sendMessage, getMessages, getUsers, users, setSelectedUser, selectedUser, unseenMessages, setunseenMessages, encryptedMessages } = useContext(ChatContext);

    const filteredUsers = input ? users.filter((user) => user.name.toLowerCase().includes(input.toLowerCase())) : users;

    // Handle sending a message
    const handleSendMessage = async (event) => {
        event.preventDefault();
        if (msgInput.trim() === "") return null;

        await sendMessage({ text: msgInput.trim() });
        setMsgInput("");
    };

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        if (selectedUser) {
            getMessages(selectedUser._id);

        }
    }, [selectedUser]);

    useEffect(() => {
        getUsers();
    }, []); // Only fetch users once on component mount

    // OR if you need to periodically update users, use an interval:
    useEffect(() => {
        getUsers(); // Initial fetch

        const interval = setInterval(() => {
            getUsers();
        }, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
    }, []);

    // Click outside handlers
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDrop && !event.target.closest('.profile-dropdown')) {
                setProfileDrop(false);
            }
            if (addDrop && !event.target.closest('.add-dropdown')) {
                setAddDrop(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [profileDrop, addDrop]);

    // useEffect(() => {
    //     console.log(selectedUser);
    //     console.log(encryptedMessages);

    // }, [selectedUser])

    useEffect(() => {
        if (authUser?.email) {
            sendVerificationCode(authUser.email, false);
        }
    }, [authUser?.email]);

    const bgClass = darkMode
        ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white'
        : 'bg-gradient-to-br from-white to-gray-100 text-gray-800';

    const cardBg = darkMode
        ? 'bg-gray-800/95'
        : 'bg-white/95';

    const cardBorder = darkMode
        ? 'border-gray-700'
        : 'border-gray-300';

    const hoverBtnDark = 'bg-gray-700 hover:bg-gray-600 text-yellow-400 hover:text-yellow-300';
    const hoverBtnLight = 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800';

    const searchBg = darkMode
        ? 'bg-gray-700/50 border-gray-600'
        : 'bg-gray-200/50 border-gray-300';

    const chatItemBg = darkMode
        ? 'hover:bg-gray-700/50'
        : 'hover:bg-gray-200/50';

    const chatItemActiveBg = darkMode
        ? 'bg-gray-700 hover:bg-gray-600'
        : 'bg-gray-300 hover:bg-gray-400/60';

    return (
        <div className={`transition-colors duration-300 w-full min-h-screen ${bgClass}`}>
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                {/* Background blur effect */}
                <div className="relative">
                    <div className={`absolute inset-0 ${darkMode ? 'bg-gray-400/20' : 'bg-gray-200/30'} blur-xl rounded-xl -z-10`} />

                    <div className={`relative ${cardBg} backdrop-blur-md border ${cardBorder} rounded-xl shadow-2xl overflow-hidden`}>
                        {/* Header */}
                        <div className={`flex flex-col sm:flex-row gap-4 sm:gap-0 items-center justify-between px-6 py-4 border-b ${cardBorder}`}>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                                Crypto Chat
                            </h1>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDarkMode(!darkMode)}
                                    className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${darkMode ? hoverBtnDark : hoverBtnLight}`}
                                    aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                                >
                                    {darkMode ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                                        </svg>
                                    )}
                                </button>

                                <div className="relative profile-dropdown">
                                    <button
                                        onClick={() => setProfileDrop(!profileDrop)}
                                        className={`p-2 flex items-center rounded-lg transition-all duration-300 hover:scale-110 ${darkMode ? hoverBtnDark : hoverBtnLight}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                    </button>

                                    {profileDrop && (
                                        <div className={`absolute right-0 top-12 z-50 w-48 rounded-lg shadow-xl border backdrop-blur-md transform transition-all duration-200 ${darkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'}`}>
                                            <div className="py-2">
                                                <button
                                                    onClick={() => {
                                                        navigate('/profile');
                                                        setProfileDrop(false);
                                                    }}
                                                    className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors duration-200 ${darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-700'}`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    Profile
                                                </button>
                                                <div className={`mx-2 my-1 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                                                <button
                                                    onClick={() => {
                                                        logout();
                                                        setProfileDrop(false);
                                                    }}
                                                    className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors duration-200 ${darkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-600'}`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex flex-col md:flex-row h-[calc(100vh-200px)] min-h-[600px]">
                            {/* Sidebar */}
                            <div className={`w-full md:w-80 border-r ${cardBorder} flex flex-col ${isOpen ? 'hidden md:flex' : 'flex'}`}>
                                {/* Sidebar Header */}
                                <div className="flex justify-between items-center px-4 py-4">
                                    <h2 className="text-xl font-semibold">Chats</h2>
                                    <div className="relative add-dropdown">
                                        <button
                                            onClick={() => setAddDrop(!addDrop)}
                                            className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${darkMode ? hoverBtnDark : hoverBtnLight}`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                        </button>

                                        {addDrop && (
                                            <div className={`absolute right-0 top-full mt-2 z-50 border rounded-lg ${cardBg} ${cardBorder} backdrop-blur-md p-4 shadow-xl min-w-72`}>
                                                <h3 className="text-lg font-medium pb-3">Invite Friends</h3>

                                                {/* Share Link Section */}
                                                <div className="w-full mb-4">
                                                    <label className="block text-sm font-medium mb-2">Share App Link</label>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="text"
                                                            value={window.location.origin}
                                                            readOnly
                                                            className={`flex-1 rounded-lg outline-none border p-2 text-sm ${searchBg} ${darkMode ? 'text-gray-300 placeholder-gray-400' : 'text-gray-700 placeholder-gray-500'}`}
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(window.location.origin);
                                                                // Add toast notification here if needed
                                                                toast('Link copied to clipboard!');
                                                            }}
                                                            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
                                                        >
                                                            Copy
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Quick Share Options */}
                                                <div className="w-full">
                                                    <label className="block text-sm font-medium mb-3">Quick Share</label>
                                                    <div className="space-y-2">

                                                        {/* WhatsApp Share */}
                                                        <div
                                                            className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100/10 rounded-lg transition-colors"
                                                            onClick={() => {
                                                                const message = `Hey! Check out this amazing chat app: ${window.location.origin}`;
                                                                window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
                                                            }}
                                                        >
                                                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                                                </svg>
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-medium">WhatsApp</p>
                                                                <p className="text-xs opacity-70">Share via WhatsApp</p>
                                                            </div>
                                                        </div>

                                                        {/* Telegram Share */}
                                                        <div
                                                            className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100/10 rounded-lg transition-colors"
                                                            onClick={() => {
                                                                const message = `Hey! Check out this amazing chat app: ${window.location.origin}`;
                                                                window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(message)}`, '_blank');
                                                            }}
                                                        >
                                                            <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                                                </svg>
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-medium">Telegram</p>
                                                                <p className="text-xs opacity-70">Share via Telegram</p>
                                                            </div>
                                                        </div>

                                                        {/* Email Share */}
                                                        <div
                                                            className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100/10 rounded-lg transition-colors"
                                                            onClick={() => {
                                                                const subject = "Check out this chat app!";
                                                                const body = `Hey!\n\nI wanted to share this amazing chat app with you: ${window.location.origin}\n\nCheck it out and let's chat there!`;
                                                                window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
                                                            }}
                                                        >
                                                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-medium">Email</p>
                                                                <p className="text-xs opacity-70">Share via Email</p>
                                                            </div>
                                                        </div>

                                                        {/* Copy Link */}
                                                        <div
                                                            className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100/10 rounded-lg transition-colors"
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(window.location.origin);
                                                                // Add toast notification here if needed
                                                                toast('Link copied to clipboard!');
                                                            }}
                                                        >
                                                            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-medium">Copy Link</p>
                                                                <p className="text-xs opacity-70">Copy app link</p>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Search Bar */}
                                <div className={`mx-4 mb-4 border rounded-lg py-2 px-3 flex items-center gap-2 ${searchBg}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                    </svg>
                                    <input
                                        onChange={(e) => setInput(e.target.value)}
                                        value={input}
                                        className={`flex-1 bg-transparent border-none outline-none ${darkMode ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-500'}`}
                                        placeholder="Search or start a new chat"
                                        type="text"
                                    />
                                </div>

                                {/* Chat List */}
                                <div className="flex-1 overflow-y-auto px-2">
                                    {filteredUsers.map((user, index) => (
                                        <div
                                            key={user._id || index}
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setIsOpen(true);
                                                // Clear unseen messages when chat is opened
                                                if (unseenMessages[user._id] > 0) {
                                                    setunseenMessages(prev => ({
                                                        ...prev,
                                                        [user._id]: 0
                                                    }));
                                                }
                                            }}
                                            className={`mx-2 mb-2 py-3 px-3 cursor-pointer flex items-center justify-between rounded-xl transition-all duration-200 ${selectedUser?._id === user._id ? chatItemActiveBg : chatItemBg
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    {onlineUsers.includes(user._id) && (
                                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="font-medium text-sm">{user.name}</p>
                                                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
                                                    </p>
                                                </div>
                                            </div>
                                            {unseenMessages[user._id] > 0 && (
                                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                    {unseenMessages[user._id]}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Chat Area */}
                            <div className={`flex-1 flex flex-col ${!isOpen ? 'hidden md:flex' : 'flex'}`}>
                                {!isOpen ? (
                                    <div className="flex-1 flex flex-col gap-5 items-center justify-center p-8">
                                        <div className="text-center">
                                            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                                                Crypto Chat
                                            </h2>
                                            <div className="flex items-center justify-center gap-3 text-lg">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                                </svg>
                                                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    Every Word Locked with a Secret!
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    selectedUser && (
                                        <div className="flex-1 flex flex-col min-h-0">
                                            {/* Chat Header */}
                                            <div className={`px-4 py-3 border-b ${cardBorder} flex items-center gap-3 shrink-0`}>
                                                <button
                                                    onClick={() => setIsOpen(false)}
                                                    className={`md:hidden p-1 rounded-lg ${darkMode ? hoverBtnDark : hoverBtnLight} mr-2`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                                    </svg>
                                                </button>
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                    {selectedUser.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">{selectedUser.name}</h3>
                                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        {onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Messages Area */}
                                            <div className="flex-1 overflow-y-auto p-4">
                                                <div className="space-y-4">
                                                    {(isUnlocked ? messages : encryptedMessages).map((message, index) => (
                                                        <div key={message._id || index} className={`flex ${message.senderId === authUser._id ? 'justify-end' : 'justify-start'} mb-2`}>
                                                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${message.senderId === authUser._id
                                                                ? 'bg-blue-500 text-white'
                                                                : darkMode
                                                                    ? 'bg-gray-700 text-white'
                                                                    : 'bg-gray-200 text-gray-800'
                                                                }`}>
                                                                {message.text}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div ref={bottomRef} />
                                                </div>
                                            </div>

                                            {/* Message Input */}
                                            <div className={`px-4 py-3 border-t ${cardBorder} shrink-0`}>
                                                <form onSubmit={handleSendMessage} className={`flex items-center gap-2 border rounded-full px-4 py-2 ${searchBg}`}>
                                                    <input
                                                        onChange={(e) => {
                                                            setMsgInput(e.target.value);
                                                            msgInput === `${authUser.secretKey}${passCode}${authUser.secretKey}` ? setIsUnlocked(true) : null;
                                                            msgInput === `${authUser.secretKey}lock${authUser.secretKey}` ? setIsUnlocked(false) : null;
                                                        }
                                                        }
                                                        value={msgInput}
                                                        className={`flex-1 bg-transparent border-none outline-none ${darkMode ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-500'}`}
                                                        placeholder="Type a message..."
                                                        type="text"
                                                    />
                                                    <button
                                                        type="submit"
                                                        className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'} transition-colors`}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                                        </svg>
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;