import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Admin Portal Components
import AdminLayout from './admin/components/layout/Layout';
import Dashboard from './admin/pages/Dashboard';
import ManageUsers from './admin/pages/ManageUsers';
import ViewUploads from './admin/pages/ViewUploads';
import FlaggedContent from './admin/pages/FlaggedContent';
import EventManagement from './admin/pages/EventManagement';
import AdminInbox from './admin/pages/AdminInbox';
import Settings from './admin/pages/Settings';

// Chat Components
import Chat from './components/chat/Chat';

// Import the purple theme CSS
import './Admin.css';
import './index.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('unichat_token');
      const userData = localStorage.getItem('unichat_user');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          setCurrentUser({
            ...user,
            token: token,
            avatar: user.avatar || '/assets/unichat/logo.png'
          });
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('unichat_token');
          localStorage.removeItem('unichat_user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (userData, token) => {
    const user = {
      id: userData.id || userData._id,
      name: userData.fullName || `${userData.firstName} ${userData.lastName}` || userData.username || userData.email,
      email: userData.email,
      avatar: userData.avatar || '/assets/unichat/logo.png',
      role: userData.role || 'admin',
      token: token
    };
    
    setCurrentUser(user);
    localStorage.setItem('unichat_token', token);
    localStorage.setItem('unichat_user', JSON.stringify(userData));
  };

  /**const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('unichat_token');
    localStorage.removeItem('unichat_user');
  };**/

  if (isLoading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 25%, #ddd6fe 50%, #f3e8ff 75%, #faf5ff 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(139, 92, 246, 0.3)',
            borderTop: '4px solid #8b5cf6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#7c3aed', fontWeight: '500' }}>Loading UniChat...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={
            currentUser ? (
              currentUser.role === 'admin' ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Navigate to="/chat" replace />
              )
            ) : (
              <LandingPage />
            )
          } />

          {/* Admin Login */}
          <Route path="/admin-login" element={
            currentUser && currentUser.role === 'admin' ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <AdminLogin onLogin={handleLogin} />
            )
          } />
          
          {/* Admin Portal Routes */}
          <Route path="/admin/*" element={
            currentUser && currentUser.role === 'admin' ? (
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/manage-users" element={<ManageUsers />} />
                  <Route path="/view-uploads" element={<ViewUploads />} />
                  <Route path="/flagged-content" element={<FlaggedContent />} />
                  <Route path="/event-management" element={<EventManagement />} />
                  <Route path="/admin-inbox" element={<AdminInbox />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </AdminLayout>
            ) : (
              <Navigate to="/admin-login" replace />
            )
          } />

          {/* Chat Route */}
          <Route path="/chat" element={
            currentUser ? (
              <div style={{ 
                height: '100vh', 
                background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 25%, #ddd6fe 50%, #f3e8ff 75%, #faf5ff 100%)' 
              }}>
                <Chat 
                  currentUser={currentUser}
                  apiBaseUrl="http://localhost:3001"
                  socketUrl="http://localhost:3001"
                  onError={(error) => console.error('Chat error:', error)}
                  onConnectionChange={(connected) => console.log('Connected:', connected)}
                />
              </div>
            ) : (
              <Navigate to="/admin-login" replace />
            )
          } />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

// Landing Page Component
const LandingPage = () => {
  const gradientBg = {
    background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 25%, #ddd6fe 50%, #f3e8ff 75%, #faf5ff 100%)',
    minHeight: '100vh',
  };

  return (
    <div style={gradientBg}>
      {/* Navigation */}
      <nav style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
              }}>
                <svg style={{ width: '20px', height: '20px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>UniChat</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <a href="/admin-login" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: '500' }}>
                Admin Portal
              </a>
              <a href="/admin-login" style={{
                background: 'linear-gradient(90deg, #7c3aed 0%, #ec4899 100%)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '25px',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.3s ease',
              }}>
                Sign In
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '4rem', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Welcome to UniChat
          </h1>
          <p style={{ 
            fontSize: '20px', 
            color: '#6b7280', 
            marginBottom: '32px', 
            maxWidth: '600px', 
            margin: '0 auto 32px auto' 
          }}>
            The modern communication platform designed for universities. Connect students, mentors, and alumni in a seamless, professional environment.
          </p>
          
          <a
            href="/admin-login"
            style={{
              background: 'linear-gradient(90deg, #7c3aed 0%, #ec4899 100%)',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '25px',
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: '600',
              display: 'inline-block',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
            }}
          >
            Access Admin Portal
          </a>
        </div>
      </div>
    </div>
  );
};

// Admin Login Component
const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Demo mode - bypass for testing
    if (email === 'devteam.unichat@gmail.com' && password === 'admin123') {
      const mockAdmin = {
        id: 'admin1',
        email: 'devteam.unichat@gmail.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      };
      onLogin(mockAdmin, 'mock-token-123');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase(), password })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user && data.user.role === 'admin') {
          onLogin(data.user, data.token);
        } else {
          setError('❌ Access denied. Admin privileges required.');
        }
      } else {
        setError(`🔐 Login failed: ${data.error || data.message || 'Invalid credentials'}`);
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('🌐 Cannot connect to backend server. Try demo login: devteam.unichat@gmail.com / admin123');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 25%, #ddd6fe 50%, #f3e8ff 75%, #faf5ff 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
            }}>
              <svg style={{ width: '28px', height: '28px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>Admin Portal</h2>
            <p style={{ color: '#6b7280' }}>Sign in to access the administration panel</p>
          </div>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {error && (
              <div style={{ 
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
                color: 'white', 
                padding: '16px', 
                borderRadius: '12px', 
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                textAlign: 'center'
              }}>
                ⚠️ {error}
              </div>
            )}
            
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '8px',
                  color: '#1f2937',
                  fontSize: '16px',
                  outline: 'none'
                }}
                placeholder="admin@university.edu"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '8px',
                  color: '#1f2937',
                  fontSize: '16px',
                  outline: 'none'
                }}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                background: 'linear-gradient(90deg, #7c3aed 0%, #ec4899 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <a href="/" style={{ color: '#8b5cf6', textDecoration: 'none', fontSize: '14px' }}>
              ← Back to homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// 404 Page
const NotFoundPage = () => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 25%, #ddd6fe 50%, #f3e8ff 75%, #faf5ff 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center', color: '#1f2937' }}>
        <h1 style={{ 
          fontSize: '96px', 
          fontWeight: 'bold', 
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          404
        </h1>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>Page Not Found</h2>
        <p style={{ color: '#6b7280', marginBottom: '32px' }}>The page you're looking for doesn't exist.</p>
        <a
          href="/"
          style={{
            background: 'linear-gradient(90deg, #7c3aed 0%, #ec4899 100%)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '25px',
            textDecoration: 'none',
            fontWeight: '600',
          }}
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

export default App;