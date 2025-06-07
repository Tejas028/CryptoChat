import React, { useContext, useState } from 'react'
import { Shield, Key, Lock, ArrowRight, ArrowLeft, MessageCircle, Eye, EyeOff } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const UserGuide = () => {
    const navigate = useNavigate()
    const [page, setPage] = useState(1)
    const { setState, setSecretKey, authUser, setUserGuideSeen, darkMode } = useContext(AuthContext)
    const [secretKey, setsecretKey] = useState('')
    const location = useLocation()
    const from = location.state?.from

    const nextPage = () => {
        if (page < 3) setPage(page + 1)
    }

    const prevPage = () => {
        if (page > 1) setPage(page - 1)
    }

    // Theme classes matching Login component
    const bgClass = darkMode
        ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white'
        : 'bg-gradient-to-br from-white to-gray-100 text-gray-800';

    const cardBg = darkMode
        ? 'bg-blue-950/90'
        : 'bg-white';

    const cardBorder = darkMode
        ? 'border-gray-700'
        : 'border-gray-300';

    const buttonStyle = darkMode
        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-300 hover:to-yellow-400 shadow-lg'
        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg';

    const linkStyle = darkMode
        ? 'text-yellow-400 hover:text-yellow-300'
        : 'text-blue-600 hover:text-blue-700';

    const inputStyle = darkMode
        ? 'bg-gray-800/80 text-white placeholder-gray-400 border-gray-700 focus:border-yellow-400 focus:ring-yellow-400/30'
        : 'bg-gray-50/80 text-gray-800 placeholder-gray-500 border-gray-300 focus:border-blue-500 focus:ring-blue-500/30';

    const iconColor = darkMode ? 'text-yellow-400' : 'text-blue-600';

    const renderIcon = () => {
        switch (page) {
            case 1:
                return <MessageCircle className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${iconColor}`} />
            case 2:
                return <Shield className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${iconColor}`} />
            case 3:
                return <Key className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${iconColor}`} />
            default:
                return null
        }
    }

    const renderContent = () => {
        switch (page) {
            case 1:
                return (
                    <div className="text-center">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4 sm:mb-6">
                            {renderIcon()}
                            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-center'>Welcome to Crypto Chat</h1>
                        </div>
                        <div className={`p-4 sm:p-6 rounded-lg border ${cardBorder} ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'}`}>
                            <p className={`text-base sm:text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Crypto Chat is a secure messaging app that protects your privacy using encryption.
                                Messages are encrypted before being sent and can only be unlocked using a secret key.
                                This guide will walk you through how it works so you can start chatting securely.
                            </p>

                            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
                                <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border ${cardBorder} ${darkMode ? 'bg-gray-800/30' : 'bg-white/50'}`}>
                                    <Lock className={`w-4 h-4 ${iconColor} flex-shrink-0`} />
                                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>End-to-End Encrypted</span>
                                </div>
                                <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border ${cardBorder} ${darkMode ? 'bg-gray-800/30' : 'bg-white/50'}`}>
                                    <Shield className={`w-4 h-4 ${iconColor} flex-shrink-0`} />
                                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Privacy First</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className="text-center">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4 sm:mb-6">
                            {renderIcon()}
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center">Why You Need a Secret Key</h1>
                        </div>

                        <div className={`p-4 sm:p-6 rounded-lg border ${cardBorder} ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'}`}>
                            <p className={`text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                In Crypto Chat, every message is protected using a custom encryption method. To <b>view decrypted messages</b>, you must include your secret key in the input field.
                                <br /><br />
                                To <b>decrypt a message</b>, type:<br />
                                <code className={`font-mono ${inputStyle} px-2 py-1 rounded text-xs sm:text-sm break-all`}>YOUR_SECRET_KEY[Code]YOUR_SECRET_KEY</code><br /><br />
                                To <b>encrypt a message</b>, type:<br />
                                <code className={`font-mono ${inputStyle} px-2 py-1 rounded text-xs sm:text-sm break-all`}>YOUR_SECRET_KEYlockYOUR_SECRET_KEY</code><br /><br />
                                You will receive your personal code when you first log in. Only messages encrypted and decrypted with this key & code will be readable to you.
                            </p>

                            <div className={`p-3 sm:p-4 rounded-lg border ${cardBorder} ${darkMode ? 'bg-gray-700/50' : 'bg-blue-50/50'}`}>
                                <div className="flex items-start gap-3">

                                    <div className="flex-1 min-w-0">
                                        <div className=' flex flex-row items-center justify-center gap-2'>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColor}`}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                                                />
                                            </svg>
                                            <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                Security Guarantee
                                            </p>
                                        </div>
                                        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Your messages are end-to-end encrypted. Without the correct secret key, the content remains unreadable—ensuring complete privacy from unauthorized users.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case 3:
                return (
                    <div className="text-center w-full max-w-2xl mx-auto">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
                            {renderIcon()}
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Set the Secret Key</h1>
                        </div>

                        <p className={`mb-6 text-base sm:text-lg leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Enter your secret key to unlock your messages. This key must be kept confidential.
                        </p>

                        <div className={`w-full max-w-lg mx-auto p-6 sm:p-8 rounded-xl shadow-lg border ${cardBorder} ${darkMode ? 'bg-gray-800/60' : 'bg-white/70'} backdrop-blur-sm`}>
                            <div className="space-y-4">
                                <div className="text-left">
                                    <label
                                        htmlFor="secretKey"
                                        className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                                    >
                                        Secret Key
                                    </label>
                                    <input
                                        id="secretKey"
                                        type="text"
                                        value={secretKey}
                                        onChange={(e) => setsecretKey(e.target.value)}
                                        placeholder="Enter your secret key"
                                        className={`w-full px-4 py-3 rounded-lg border shadow-sm focus:ring-2 focus:outline-none transition-all duration-300 backdrop-blur-sm ${inputStyle}`}
                                    />
                                </div>

                                <div className={`p-4 rounded-lg border-l-4 ${darkMode ? 'bg-red-900/20 border-red-500/50' : 'bg-red-50 border-red-400'}`}>
                                    <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-700'} leading-relaxed`}>
                                        <span className="font-semibold">Important:</span> The secret key must be entered every time you want to unlock messages. Choose something memorable but secure!
                                    </p>
                                </div>

                                {/* <button
                                    onClick={() => setSecretKey(secretKey, authUser.email)}
                                    className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:outline-none ${buttonStyle}`}
                                >
                                    Save Secret Key
                                </button> */}
                            </div>
                        </div>
                    </div>
                )


            default:
                return null
        }
    }

    return (
        <div className={`transition-colors w-full min-h-screen ${bgClass}`}>
            <div className="relative group px-3 sm:px-4 md:px-8 lg:px-16 xl:px-40 pt-4 sm:pt-8 md:pt-12">
                {/* Background blur effect - matching Login component */}
                <div className={`absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 md:top-8 md:left-8 md:right-8 lg:top-12 lg:left-16 lg:right-16 xl:left-40 xl:right-40 blur-lg -inset-1 ${darkMode ? 'bg-gray-400' : 'bg-gray-200'} opacity-75 group-hover:opacity-100 transition duration-1000 rounded-lg min-h-[90vh] sm:min-h-[86vh] z-0`} />

                {/* Main container */}
                <div className={`relative ${cardBg} z-10 rounded-lg min-h-[90vh] sm:min-h-[86vh] shadow-lg backdrop-blur-md border ${cardBorder} flex flex-col`}>

                    {/* Header */}
                    <div className={`flex items-center justify-center px-3 sm:px-4 py-3 sm:py-4 border-b ${cardBorder}`}>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-center">User Guide</h1>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex items-center justify-center p-3 sm:p-6 lg:p-8">
                        <div className="w-full max-w-4xl">

                            {/* Progress indicator */}
                            <div className="flex justify-center mb-6 sm:mb-8">
                                <div className="flex items-center space-x-2 sm:space-x-4">
                                    {(from ? [1, 2] : [1, 2, 3]).map((step, index, arr) => (
                                        <React.Fragment key={step}>
                                            <div
                                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${page === step
                                                    ? buttonStyle.replace('shadow-lg', '') + ' scale-110'
                                                    : page > step
                                                        ? `${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-blue-500 text-white'}`
                                                        : `${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'}`
                                                    }`}
                                            >
                                                {page > step ? '✓' : step}
                                            </div>
                                            {index < arr.length - 1 && (
                                                <div
                                                    className={`w-8 sm:w-12 h-1 rounded transition-all duration-300 ${page > step
                                                        ? `${darkMode ? 'bg-yellow-400' : 'bg-blue-500'}`
                                                        : `${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`
                                                        }`}
                                                ></div>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>

                            {/* Page content */}
                            <div className="min-h-[300px] sm:min-h-[400px] flex items-center">
                                {renderContent()}
                            </div>

                            {/* Navigation */}
                            <div className='mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0'>
                                <button
                                    onClick={prevPage}
                                    disabled={page === 1}
                                    className={`w-full sm:w-auto px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 ${page === 1
                                        ? `${darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`
                                        : `${darkMode ? 'bg-gray-800/80 text-yellow-400 hover:bg-gray-700 border border-gray-600' : 'bg-gray-100 text-blue-600 hover:bg-gray-200 border border-gray-300'}`
                                        }`}
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Previous</span>
                                </button>

                                <div className={`px-3 sm:px-4 py-2 rounded-lg border ${cardBorder} ${darkMode ? 'bg-gray-800/50 text-gray-300' : 'bg-gray-50/50 text-gray-700'} order-first sm:order-none`}>
                                    <span className='font-semibold text-sm sm:text-base'>Page {page} of {from ? 2 : 3}</span>
                                </div>

                                <button
                                    onClick={async () => {
                                        if (from) {
                                            // Only show two pages when 'from' is present
                                            if (page === 2) {
                                                setState('Done')
                                                navigate('/')  // or wherever 'from' is intended to go
                                            } else {
                                                nextPage()
                                            }
                                        } else {
                                            // Normal 3-page flow
                                            if (page === 3) {
                                                if (!secretKey) {
                                                    toast.error("Secret Key cannot be empty!")
                                                } else {
                                                    await setSecretKey(secretKey, authUser.email)
                                                    await setUserGuideSeen(authUser.email)
                                                    setState('Done')
                                                    navigate('/')
                                                }
                                            }
                                            else {
                                                nextPage()
                                            }
                                        }
                                    }}
                                    className={`w-full sm:w-auto px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 ${page === 3
                                        ? `${darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'}`
                                        : buttonStyle
                                        }`}
                                >
                                    <span>
                                        {
                                            from
                                                ? page === 2 ? 'Finish' : 'Next'
                                                : page === 3 ? 'Finish & Set Secret Key' : 'Next'
                                        }
                                    </span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserGuide