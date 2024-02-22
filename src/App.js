import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import UserDetails from './pages/UserDetails';
import AdminSingle from './pages/AdminSingle';

const App = () => {
  return (
    <Router>
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/home' element={<Home />} />
      <Route path='/admin' element={<AdminSingle />} />
      <Route path='/admin/:userId' element={<UserDetails />} />
    </Routes>
    </Router>
  )
}

export default App