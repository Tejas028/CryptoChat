import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Profile = () => {

  const { authUser, updateProfile, darkMode, setDarkMode } = useContext(AuthContext)

  const navigate = useNavigate()
  const [isEdit, setIsEdit] = useState(false);
  const email = useState(authUser.email)
  const [name, setName] = useState(authUser.name)
  const [password, setPassword] = useState('')
  const [bio, setBio] = useState(authUser.bio)
  const [phone, setPhone] = useState(authUser.phone)
  const [secretKey, setsecretKey] = useState('')


  const handleSubmit = async (e) => {
    e.preventDefault()
    await updateProfile({ name, phone, password, bio, secretKey })
    return
  }

  const bgClass = darkMode
    ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white'
    : 'bg-gradient-to-br from-white to-gray-100 text-gray-800';

  const cardBg = darkMode
    ? 'bg-blue-950/90'
    : 'bg-white';

  const cardBorder = darkMode
    ? 'border-gray-700'
    : 'border-gray-300';

  const inputStyle = darkMode
    ? 'bg-gray-800/80 text-white placeholder-gray-400 border-gray-700 focus:border-yellow-400 focus:ring-yellow-400/30'
    : 'bg-gray-50/80 text-gray-800 placeholder-gray-500 border-gray-300 focus:border-blue-500 focus:ring-blue-500/30';

  const buttonStyle = darkMode
    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-300 hover:to-yellow-400 shadow-lg'
    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg';

  const hoverBtnDark = 'bg-gray-800 hover:bg-gray-700 text-yellow-400 hover:text-yellow-300';
  const hoverBtnLight = 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800';

  return (
    <div className={`transition-colors w-full min-h-screen ${bgClass}`}>
      <div className="relative group px-4 sm:px-8 md:px-16 lg:px-40 pt-8 sm:pt-12">
        {/* Background blur effect */}
        <div className={`absolute top-12 left-4 right-4 sm:left-8 sm:right-8 md:left-16 md:right-16 lg:left-40 lg:right-40 blur-lg -inset-1 ${darkMode ? 'bg-gray-400' : 'bg-gray-200'} opacity-75 group-hover:opacity-100 transition duration-1000 rounded-lg min-h-[86vh] z-0`} />

        {/* Main container */}
        <div className={`relative ${cardBg} z-10 rounded-lg min-h-[86vh] shadow-lg backdrop-blur-md border ${cardBorder} flex flex-col`}>

          {/* Header with theme toggle */}
          <div className={`flex items-center justify-between px-4 py-4 border-b ${cardBorder}`}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Crypto Chat</h1>

            <div className=' flex flex-row gap-4'>
              <div title='User Guide' className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${darkMode ? hoverBtnDark : hoverBtnLight}`} onClick={() => navigate('/user-guide', { state: { from: 'profile' } })}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>

              </div>

              <div className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${darkMode ? hoverBtnDark : hoverBtnLight}`} onClick={() => navigate('/')}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              </div>
            </div>

          </div>

          {/* Profile content */}
          <div className="flex-1 p-6 sm:p-8 md:p-12">
            <div className="max-w-2xl mx-auto">

              {/* Profile header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  <h2 className="text-2xl sm:text-3xl font-bold">My Profile</h2>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Manage your account information and preferences
                </p>
              </div>

              {/* Profile picture */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    JD
                  </div>
                  {isEdit && (
                    <button className={`absolute -bottom-2 -right-2 p-2 rounded-full ${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-blue-500 text-white'} shadow-lg hover:scale-110 transition-transform`}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 cursor-pointer">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Profile form */}
              <div className="space-y-6">
                {/* Name field */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Full Name
                  </label>
                  {isEdit ? (
                    <input onChange={(e) => setName(e.target.value)} value={name}
                      type="text"
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:ring-2 focus:outline-none ${inputStyle}`}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-lg py-2">{name}</p>
                  )}
                </div>

                {/* Email field */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email Address
                  </label>
                  <p className="text-lg py-2"> {email} </p>
                </div>

                {/* Phone field */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Phone Number
                  </label>
                  {isEdit ? (
                    <input onChange={(e) => setPhone(e.target.value)} value={phone}
                      type="tel"
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:ring-2 focus:outline-none ${inputStyle}`}
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="text-lg py-2"> {phone} </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  {isEdit ? (
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Password
                      </label>
                      <input onChange={(e) => setPassword(e.target.value)} value={password}
                        type="password"
                        className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:ring-2 focus:outline-none ${inputStyle}`}
                        placeholder="Enter new password"
                      />
                    </div>
                  ) : ''}
                </div>

                {/* Secret Key */}
                <div>
                  {isEdit ? (
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Secret Key
                      </label>
                      <input onChange={(e) => setsecretKey(e.target.value)} value={secretKey}
                        type="text"
                        className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:ring-2 focus:outline-none ${inputStyle}`}
                        placeholder="Enter new secret key"
                      />
                    </div>
                  ) : ''}
                </div>

                {/* Bio field */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Bio
                  </label>
                  {isEdit ? (
                    <textarea onChange={(e) => setBio(e.target.value)} value={bio}
                      rows={4}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:ring-2 focus:outline-none resize-none ${inputStyle}`}
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-lg py-2 leading-relaxed">
                      Software developer passionate about secure communications and cryptography. Always excited to learn new technologies and connect with like-minded people.
                    </p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-4 pt-6">

                  {
                    isEdit
                      ? <button type='submit'
                        onClick={(e) => { setIsEdit(!isEdit); handleSubmit(e); }}
                        className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${buttonStyle}`}
                      >
                        Save Changes
                      </button>
                      : <button
                        onClick={() => setIsEdit(!isEdit)}
                        className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${buttonStyle}`}
                      >
                        Edit Profile
                      </button>
                  }

                  {isEdit && (
                    <button
                      onClick={() => setIsEdit(false)}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* Privacy section */}
              <div className={`mt-8 p-4 rounded-lg border ${cardBorder} ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'}`}>
                <div className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mt-0.5 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Privacy & Security
                    </p>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Your profile information is encrypted and only visible to your contacts. We never share your data with third parties.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;