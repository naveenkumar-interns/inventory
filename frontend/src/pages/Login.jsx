import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [data, setData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      const result = await response.json()

      console.log(result)
      
      if (response.ok) {
        if (result.data) {
          localStorage.setItem('token', result.token)
          localStorage.setItem('userRole', result.data.role)
          localStorage.setItem('userData', JSON.stringify(result.data))
          
          // Redirect based on role
          switch(result.data.role) {
            case 'admin':
              navigate('/admin-dashboard')
              break
            case 'manager':
              navigate('/manager-dashboard')
              break
            case 'employee':
              navigate('/employee-dashboard')
              break
            default:
              setError('Invalid role')
          }
        }
      } else {
        setError(result.message || 'Login failed')
      }
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Please Loginto continue</p>
        </div>
        
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
            />
          </div>

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="auth-button">
            Login
          </button>

          <div className="auth-footer">
            <Link to="/forget-password" className="auth-link">
              Forgot Password?
            </Link>
            <p style={{ margin: '10px 0' }}>
              Don't have an account? {' '}
              <Link to="/register" className="auth-link">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login