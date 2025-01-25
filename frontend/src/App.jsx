import React from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgetPassword from './pages/ForgetPassword'
import AdminDashboard from './pages/dashboards/AdminDashboard'
import ManagerDashboard from './pages/dashboards/ManagerDashboard'
import EmployeeDashboard from './pages/dashboards/EmployeeDashboard'
import './App.css'

const HomePage = () => {
  const navigate = useNavigate()

  const containerStyle = {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: '20px'
  }

  const contentStyle = {
    width: '100%',
    maxWidth: '400px',
    padding: '32px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  }

  const titleStyle = {
    color: '#333333',
    marginBottom: '32px',
    fontSize: '24px',
    fontWeight: '600',
    textAlign: 'center'
  }

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    margin: '8px 0',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={titleStyle}>Inventory Management System</h1>
        
        <button 
          style={{
            ...buttonStyle,
            backgroundColor: '#2196f3',
            color: 'white'
          }}
          onClick={() => navigate('/login')}
        >
          Sign In
        </button>
        
        <button 
          style={{
            ...buttonStyle,
            backgroundColor: '#4caf50',
            color: 'white'
          }}
          onClick={() => navigate('/register')}
        >
          Create Account
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
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
