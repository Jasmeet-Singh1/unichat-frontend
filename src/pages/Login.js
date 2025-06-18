import React from 'react';
import './Login.css';   // Import the CSS created
import logo from '../assets/Logo.png';
import topLogo from "../assets/Unichat-logo.png";

const Login = () => {
  const handleLogin = () => {
  const emailInput = document.querySelector('input[type="email"]');
  const passwordInput = document.querySelector('input[type="password"]');
  const errorBox = document.getElementById('errorBox');

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    errorBox.textContent = 'Both email and password are required.';
    errorBox.style.display = 'block';
  } else if (!email.endsWith('@student.kpu.ca')) {
    errorBox.textContent = 'Please enter a valid KPU email address.';
    errorBox.style.display = 'block';
  } else {
    errorBox.style.display = 'none';
    alert('Login successful!'); // Temporary for now
  }
};

 return (
    <div className="login-container">
      <div className="background-logo" />
      <img src={topLogo} alt="UniChat Logo" className="top-logo" />
      <div className="error-box" id="errorBox" style={{ display: 'none' }}></div>

      <div className="input-wrapper">
                <input
                type="email"
                placeholder="Enter your KPU Email"
                className="input-field"
            />
            <input
                type="password"
                placeholder="Enter your Password"
                className="input-field"
            />
            </div>
            
        <button className="login-button" onClick={handleLogin}>Login</button>
        <p className="signup-text">
  Don't have an account?{' '}
  <a href="/signup" className="signup-link">Sign up</a>
</p>

    </div>
    
  );
};
export default Login;




