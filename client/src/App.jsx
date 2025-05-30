import React, { useContext } from 'react'
import Home from './pages/Home'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Profile from './pages/Profile'
import { Toaster } from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext'

const App = () => {
  const { authUser } = useContext(AuthContext)
  return (
    <div >
      <Toaster />
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to={'/login'}/>}></Route>
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to={'/'}/>}></Route>
        <Route path='/profile' element={authUser ? <Profile /> : <Navigate to={'/login'}/>}></Route>
      </Routes>
    </div>
  )
}

export default App
