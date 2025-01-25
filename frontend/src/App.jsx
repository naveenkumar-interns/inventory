import React from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgetPassword from './pages/ForgetPassword'
import './App.css'

const HomePage = () => {
  const navigate = useNavigate()

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f2f5',
    padding: '20px'
  }

  const contentStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center'
  }

  const titleStyle = {
    color: '#1a73e8',
    marginBottom: '20px',
    fontSize: '24px'
  }

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  }

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={titleStyle}>Inventory Management System</h1>
        
        <button 
          style={{
            ...buttonStyle,
            backgroundColor: '#1a73e8',
            color: 'white'
          }}
          onClick={() => navigate('/login')}
        >
          Login
        </button>
        
        <button 
          style={{
            ...buttonStyle,
            backgroundColor: '#34a853',
            color: 'white'
          }}
          onClick={() => navigate('/register')}
        >
          Register
        </button>
      </div>
    </div>
  )
}

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
      </Routes>
    </Router>
  )
}

export default App
