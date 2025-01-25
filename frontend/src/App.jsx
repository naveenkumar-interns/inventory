import React from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/Register'
import './App.css'

const HomePage = () => {
  const navigate = useNavigate()
  return (
    <div className="container">
      <h1>Inventory management System</h1>
      
      <div className="button-container">
        <button 
          className="auth-button"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
        
        <button 
          className="auth-button"
          onClick={() => navigate('/Register')}
        >
          Register
        </button>
      
      </div>
    </div>
  )
}

const App = () => {
  return (
    <div>
      <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
    </Router>
    </div>
  )
}

export default App
