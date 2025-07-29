import React from 'react';

const MainNavigation = ({ currentUser }) => {
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('authToken');
      window.location.href = '/';
    }
  };

  const getRoleDisplayName = (role) => {
    switch(role?.toLowerCase()) {
      case 'student': return 'Student';
      case 'mentor': return 'Mentor'; 
      case 'alumni': return 'Alumni';
      case 'admin': return 'Administrator';
      default: return 'User';
    }
  };

  const canAccessAdmin = currentUser?.role === 'admin';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          margin: 0
        }}>
          UniChat
        </h1>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <span>{currentUser?.name} ({getRoleDisplayName(currentUser?.role)})</span>
          <button 
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '42px',
          fontWeight: 'bold',
          marginBottom: '20px'
        }}>
          Welcome to UniChat
        </h2>
        
        <p style={{
          fontSize: '18px',
          marginBottom: '60px',
          opacity: 0.8
        }}>
          Connect, collaborate, and build your academic network
        </p>

        {/* Cards Container */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          maxWidth: '800px',
          margin: '0 auto',
          flexWrap: 'wrap'
        }}>
          {/* Chat Portal Card */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '15px',
            padding: '40px',
            width: '300px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          onClick={() => window.location.href = '/chat'}
          >
            <div style={{
              fontSize: '48px',
              marginBottom: '20px'
            }}>
              💬
            </div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '15px'
            }}>
              Chat Portal
            </h3>
            <p style={{
              fontSize: '16px',
              marginBottom: '25px',
              opacity: 0.9
            }}>
              Connect with students, mentors, and alumni. Join conversations and build your network.
            </p>
            <button style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%'
            }}>
              Enter Chat Portal
            </button>
          </div>

          {/* Admin Portal Card - Only show for admins */}
          {canAccessAdmin && (
            <div style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: '15px',
              padding: '40px',
              width: '300px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            onClick={() => window.location.href = '/admin'}
            >
              <div style={{
                fontSize: '48px',
                marginBottom: '20px'
              }}>
                🛡️
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '15px'
              }}>
                Admin Portal
              </h3>
              <p style={{
                fontSize: '16px',
                marginBottom: '25px',
                opacity: 0.9
              }}>
                Manage users, moderate content, and oversee platform operations.
              </p>
              <button style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%'
              }}>
                Enter Admin Portal
              </button>
            </div>
          )}

          {/* Coming Soon Card - Show if not admin */}
          {!canAccessAdmin && (
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '15px',
              padding: '40px',
              width: '300px',
              opacity: 0.7
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '20px'
              }}>
                🔒
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '15px'
              }}>
                Coming Soon
              </h3>
              <p style={{
                fontSize: '16px',
                opacity: 0.8
              }}>
                Additional portals will be available soon!
              </p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div style={{
          marginTop: '60px',
          padding: '20px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '10px',
          display: 'inline-block'
        }}>
          <p>
            Logged in as: <strong>{currentUser?.name}</strong> • 
            Role: <strong>{getRoleDisplayName(currentUser?.role)}</strong> • 
            Status: <span style={{color: '#4ade80'}}>Online</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainNavigation;