import React from 'react'

const Register = () => {
  const handleRegister = async () => {
    const response = await fetch('http://localhost:8000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: '',
        password: '',
        name: '',
      }),
    });
  }
  return (
    <div>
      <h1>Register</h1>
      <div className="register-container">
        <form>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
          <button onClick={handleRegister}>Register</button>
        </form>
      </div>
    </div>
  )
}

export default Register
