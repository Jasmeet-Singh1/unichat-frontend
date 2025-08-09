// src/admin/components/AdminLogin.js
import React, { useState, useContext } from 'react';
import { Lock, Mail, Eye, EyeOff, Settings, Sun, Moon, AlertCircle } from 'lucide-react';
import { ThemeContext } from '../AdminPortal';
import '../styles/AdminLogin.css';

const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { isDark, toggleTheme } = useContext(ThemeContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/adminauth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const responseData = await response.json();

      if (response.ok && responseData.success && responseData.token) {
        // Store the JWT token and user data
        localStorage.setItem('adminToken', responseData.token);
        localStorage.setItem('adminUser', JSON.stringify(responseData.user));
        onLogin();
      } else {
        setError(responseData.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`login-container ${isDark ? 'dark' : 'light'}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <Settings size={28} color="white" />
          </div>
          <h1 className="login-title">Admin Portal</h1>
          <p className="login-subtitle">
            Sign in to access Unichat admin dashboard
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <div className="input-group">
              <Mail className="input-icon" size={20} />
              <input
                id="email"
                type="email"
                className="form-input"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                placeholder="Enter admin email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="input-group">
              <Lock className="input-icon" size={20} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="login-loading">
                Signing in
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="login-info">
          <p>Use your admin credentials to access the dashboard</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;