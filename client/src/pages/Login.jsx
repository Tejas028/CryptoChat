import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import validator from 'validator'

const Login = () => {
  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [code, setCode] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)
  const [dispCode, setDispCode] = useState(false)
  const [verified, setVerified] = useState(false)
  const [dispValidation, setDispValidation] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword]=useState(false)

  const { login, sendVerificationCode, verifyCode, darkMode, setDarkMode } = useContext(AuthContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!email || !password || (state === 'Sign Up' && (!name || !confirmPassword))) {
      toast.error("Missing Details");
      return;
    }

    if (state === 'Sign Up' && password !== confirmPassword) {
      toast.error("Password and Confirmed Password are different!");
      return;
    }

    const isValid = validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    });

    if (!isValid) {
      toast.error("Enter a strong password!")
      setDispValidation(true)
      return;
    }

    if (state === 'Login') {
      login('login', { email, password });
      return;
    }

    const sent = await sendVerificationCode(email, true);
    if (sent) {
      setDispCode(true);
    }
  };

  const verificationHandler = async (event) => {
    event.preventDefault();

    if (!code) {
      toast.error("Please enter the verification code!");
      return;
    }

    const result = await verifyCode(email, code);
    setVerified(result);

    if (result) {
      if (!isDataSubmitted) {
        setIsDataSubmitted(true);
      }

      login('signup', { name, email, password, secretKey });
    } else {
      toast.error("Verification failed! Try again.");
    }
  };

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

  const linkStyle = darkMode
    ? 'text-yellow-400 hover:text-yellow-300'
    : 'text-blue-600 hover:text-blue-700';

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


          </div>

          {/* Login form content */}
          <form onSubmit={dispCode ? verificationHandler : onSubmitHandler}>
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="w-full max-w-md">

                {/* Form header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                    <h2 className="text-2xl sm:text-3xl font-bold">
                      {state === 'Sign Up' ? 'Create Account' : 'Welcome Back'}
                    </h2>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {state === 'Sign Up'
                      ? 'Join the secure conversation'
                      : 'Sign in to continue chatting securely'
                    }
                  </p>
                </div>

                {/* Form inputs */}
                <div className="space-y-4">
                  {
                    !dispCode
                      ? <div className="space-y-4">
                        {state === 'Sign Up' && (
                          <div>
                            <input onChange={(e) => setName(e.target.value)} value={name}
                              type="text"
                              placeholder="Full Name"
                              className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:ring-2 focus:outline-none backdrop-blur-sm ${inputStyle}`}
                            />
                          </div>
                        )}
                        <div>
                          <input onChange={(e) => setEmail(e.target.value)} value={email}
                            type="email"
                            placeholder="Email Address"
                            className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:ring-2 focus:outline-none backdrop-blur-sm ${inputStyle}`}
                          />
                        </div>
                        <div>
                          <div className="relative w-full">
                            <input
                              onChange={(e) => setPassword(e.target.value)}
                              value={password}
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Password"
                              className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-300 focus:ring-2 focus:outline-none backdrop-blur-sm ${inputStyle}`}
                            />

                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              title={showPassword ? 'Hide Password' : 'Show Password'}
                            >
                              {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                  strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 
          16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 
          2.863-.395M6.228 6.228A10.451 10.451 0 0 1 
          12 4.5c4.756 0 8.773 3.162 10.065 
          7.498a10.522 10.522 0 0 1-4.293 
          5.774M6.228 6.228 3 3m3.228 3.228 
          3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 
          0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                  strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 
          7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 
          9.963 7.178.07.207.07.431 0 
          .639C20.577 16.49 16.64 19.5 12 
          19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                  <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                              )}
                            </button>
                          </div>

                          {
                            dispValidation
                              ? <p className=' text-sm font-light text-red-500'>
                                * The password must be greater than 8 letters, have atleast 1 uppercase, 1 lowercase letter, 1 number and 1 symbol
                              </p>
                              : null
                          }
                        </div>
                        {state === 'Sign Up' && (
                          <div className="relative w-full">
                            <input
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              value={confirmPassword}
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="Confirm Password"
                              className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-300 focus:ring-2 focus:outline-none backdrop-blur-sm ${inputStyle}`}
                            />

                            <button
                              type="button"
                              title={!showConfirmPassword ? 'Show Confirm Password' : 'Hide Confirm Password'}
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showConfirmPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                  strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 
          16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 
          2.863-.395M6.228 6.228A10.451 10.451 0 0 1 
          12 4.5c4.756 0 8.773 3.162 10.065 
          7.498a10.522 10.522 0 0 1-4.293 
          5.774M6.228 6.228 3 3m3.228 3.228 
          3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 
          0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                  strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 
          7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 
          9.963 7.178.07.207.07.431 0 
          .639C20.577 16.49 16.64 19.5 12 
          19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                  <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                              )}
                            </button>
                          </div>

                        )}
                        {state === 'Sign Up' && (
                          <div>
                            <input onChange={(e) => setSecretKey(e.target.value)} value={secretKey}
                              type="text"
                              placeholder="Enter secret key"
                              className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:ring-2 focus:outline-none backdrop-blur-sm ${inputStyle}`}
                            />
                          </div>
                        )}
                      </div>
                      : null
                  }

                  {
                    dispCode
                      ? <div>
                        <input onChange={(e) => setCode(e.target.value)} value={code}
                          type="text"
                          placeholder="Enter Verification Code"
                          className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:ring-2 focus:outline-none backdrop-blur-sm ${inputStyle}`}
                        />
                        <p className=' pt-3'>Didn't recieve the Code? <span className=' text-blue-700 cursor-pointer' onClick={() => sendVerificationCode(email, true)}>Resend Code</span> </p>
                      </div>
                      : null
                  }

                  {/* Submit button */}
                  {
                    dispCode
                      ? <button type='submit'
                        className={`w-full px-6 py-3 mt-6 rounded-lg font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${buttonStyle}`}
                      >
                        Verify Code
                      </button>
                      : <button type='submit'
                        className={`w-full px-6 py-3 mt-6 rounded-lg font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${buttonStyle}`}
                      >
                        {state === 'Sign Up' ? 'Create Account' : 'Sign In'}
                      </button>
                  }
                </div>

                {/* Toggle between login/signup */}
                <div className="text-center mt-6">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {state === 'Sign Up'
                      ? <>Already have an account?{' '}
                        <span
                          className={`cursor-pointer font-medium transition-colors duration-200 ${linkStyle}`}
                          onClick={() => setState('Login')}
                        >
                          Sign in here
                        </span>
                      </>
                      : <>Don't have an account?{' '}
                        <span
                          className={`cursor-pointer font-medium transition-colors duration-200 ${linkStyle}`}
                          onClick={() => setState('Sign Up')}
                        >
                          Create one here
                        </span>
                      </>
                    }
                  </p>
                </div>

                {/* Security message */}
                <div className={`mt-8 p-4 rounded-lg border ${cardBorder} ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'}`}>
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mt-0.5 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                    </svg>
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        End-to-End Encryption
                      </p>
                      <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Your messages are secured with advanced cryptography. Only you and your contacts can read them.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;