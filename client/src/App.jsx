import React, { useContext } from 'react'
import Home from './pages/Home'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Profile from './pages/Profile'
import { Toaster } from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext'
import UserGuide from './pages/UserGuide'
import { useEffect } from 'react'

const App = () => {
  const { authUser, state } = useContext(AuthContext)

  // useEffect(()=>{
  //   console.log(authUser.hasSeenUserGuide);
    
  // },[authUser])
  return (
    <div >
      <Toaster />
      <Routes>
        <Route path='/user-guide' element={<UserGuide/>}></Route>
        <Route
          path="/"
          element={
            authUser ? (
              state === 'Sign Up' && authUser.hasSeenUserGuide !== true
                ? <UserGuide />
                : <Home />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to={'/'} />}></Route>
        <Route path='/profile' element={authUser ? <Profile /> : <Navigate to={'/login'} />}></Route>
      </Routes>
    </div>
  )
}

export default App
