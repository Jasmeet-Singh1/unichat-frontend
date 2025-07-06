import React from 'react';
import './Signup.css';

function Signup() {
  return (
    <div className="signup-container">
      <img src="/Signup.png" className="logo" alt="UniChat Logo" />
      <h2>Create Your Account</h2>
      <form id="signupForm">
        <div className="input-group">
          <img src="/profile.png" alt="User Icon" />
          <input type="text" placeholder="First Name" required />
        </div>
        <div className="input-group">
          <img src="/profile.png" alt="User Icon" />
          <input type="text" placeholder="Last Name" required />
        </div>
        <div className="input-group">
          <img src="/profile.png" alt="User Icon" />
          <input type="text" placeholder="Username" required />
        </div>
        <div className="input-group">
          <img src="/email.png" alt="Email Icon" />
          <input type="email" placeholder="Email" required />
        </div>
        <div className="input-group">
          <img src="/lock.png" alt="Password Icon" />
          <input type="password" placeholder="Password" required />
        </div>
        <div className="input-group">
          <img src="/lock.png" alt="Confirm Password Icon" />
          <input type="password" placeholder="Confirm Password" required />
        </div>
        <div className="input-group">
          <img src="/Discussion forums.png" alt="Role Icon" />
          <select required defaultValue="">
            <option value="" disabled>Select Your Role</option>
            <option value="student">Student</option>
            <option value="mentor">Mentor</option>
            <option value="alumni">Alumni</option>
          </select>
        </div>
        <button type="submit" className="signup-btn">Sign Up</button>
      </form>
      <p className="login-link">
        Already have an account? <a href="login.html">Log in</a>
      </p>
    </div>
  );
}

export default Signup;
