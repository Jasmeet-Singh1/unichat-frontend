import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, User, Settings, MessageCircle, Home } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  // Add CSS keyframes for dropdown animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes dropdownFadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/admin/dashboard':
      case '/admin/':
        return 'Admin Dashboard';
      case '/admin/manage-users':
        return 'Manage Users';
      case '/admin/view-uploads':
        return 'View Uploads';
      case '/admin/flagged-content':
        return 'Flagged Content Review';
      case '/admin/event-management':
        return 'Event Management';
      case '/admin/admin-inbox':
        return 'Admin Inbox';
      case '/admin/settings':
        return 'Settings';
      default:
        return 'Admin Dashboard';
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('unichat_token');
      localStorage.removeItem('unichat_user');
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/';
    }
    setShowDropdown(false);
  };

  const handleProfile = () => {
    console.log('Navigate to profile');
    setShowDropdown(false);
  };

  const handleSettings = () => {
    navigate('/admin/settings');
    setShowDropdown(false);
  };

  const handleGoToChat = () => {
    navigate('/chat');
    setShowDropdown(false);
  };

  const handleGoHome = () => {
    navigate('/');
    setShowDropdown(false);
  };

  const headerStyles = {
    container: {
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(20px)',
      padding: '16px 32px',
      borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
    },
    title: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#1f2937',
      margin: 0,
    },
    subtitle: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#6b7280',
    },
    dropdownButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      borderRadius: '8px',
      background: 'transparent',
      color: '#1f2937',
      border: '1px solid rgba(139, 92, 246, 0.2)',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.3s ease',
    },
    dropdown: {
      position: 'fixed',
      top: '60px',
      right: '20px',
      width: '250px',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
      border: '2px solid rgba(139, 92, 246, 0.3)',
      padding: '0',
      zIndex: 99999,
      overflow: 'hidden',
      animation: 'dropdownFadeIn 0.2s ease-out',
    },
    dropdownItem: {
      width: '100%',
      padding: '16px 20px',
      textAlign: 'left',
      fontSize: '15px',
      color: '#1f2937',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      transition: 'background-color 0.2s ease',
      fontWeight: '500',
    },
    userInfo: {
      padding: '20px',
      background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
      color: 'white',
    }
  };

  return (
    <header style={headerStyles.container}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={headerStyles.subtitle}>UNICHAT</span>
            <span style={headerStyles.subtitle}>|</span>
            <h1 style={headerStyles.title}>{getPageTitle()}</h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Admin Portal Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                ...headerStyles.dropdownButton,
                background: showDropdown ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!showDropdown) {
                  e.target.style.background = 'rgba(139, 92, 246, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!showDropdown) {
                  e.target.style.background = 'transparent';
                }
              }}
            >
              <span>Admin Portal</span>
              <ChevronDown 
                style={{ 
                  width: '16px', 
                  height: '16px',
                  transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }} 
              />
            </button>

            {showDropdown && (
              <div style={headerStyles.dropdown}>
                <div style={headerStyles.userInfo}>
                  <p style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '700' }}>
                    Admin User
                  </p>
                  <p style={{ margin: '0', fontSize: '14px', opacity: '0.9' }}>
                    devteam.unichat@gmail.com
                  </p>
                </div>
                
                <div style={{ padding: '8px 0' }}>
                  <button
                    onClick={handleProfile}
                    style={headerStyles.dropdownItem}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(139, 92, 246, 0.1)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    <User style={{ width: '20px', height: '20px', color: '#8b5cf6' }} />
                    Profile
                  </button>

                  <button
                    onClick={handleGoToChat}
                    style={headerStyles.dropdownItem}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(139, 92, 246, 0.1)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    <MessageCircle style={{ width: '20px', height: '20px', color: '#8b5cf6' }} />
                    Go to Chat
                  </button>
                  
                  <button
                    onClick={handleGoHome}
                    style={headerStyles.dropdownItem}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(139, 92, 246, 0.1)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    <Home style={{ width: '20px', height: '20px', color: '#8b5cf6' }} />
                    Home
                  </button>
                  
                  <button
                    onClick={handleSettings}
                    style={headerStyles.dropdownItem}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(139, 92, 246, 0.1)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    <Settings style={{ width: '20px', height: '20px', color: '#8b5cf6' }} />
                    Settings
                  </button>
                  
                  <div style={{ height: '1px', background: 'rgba(139, 92, 246, 0.2)', margin: '8px 20px' }} />
                  
                  <button
                    onClick={handleLogout}
                    style={{
                      ...headerStyles.dropdownItem,
                      color: '#ef4444',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                    }}
                  >
                    <LogOut style={{ width: '20px', height: '20px', color: '#ef4444' }} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDropdown && (
        <div
          style={{
            position: 'fixed',
            inset: '0',
            zIndex: 99998,
            background: 'rgba(0, 0, 0, 0.1)',
          }}
          onClick={() => setShowDropdown(false)}
        />
      )}
    </header>
  );
};

export default Header;