import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  const [chatOpen, setChatOpen] = useState(false);

  // Add purple theme styles
  const layoutStyles = {
    container: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 25%, #ddd6fe 50%, #f3e8ff 75%, #faf5ff 100%)',
      minHeight: '100vh',
    },
    chatOverlay: {
      position: 'fixed',
      top: '0',
      right: chatOpen ? '0' : '-400px',
      width: '400px',
      height: '100vh',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderLeft: '1px solid rgba(139, 92, 246, 0.2)',
      transition: 'right 0.3s ease',
      zIndex: 1000,
      boxShadow: '-4px 0 20px rgba(139, 92, 246, 0.3)',
      display: 'flex',
      flexDirection: 'column',
    },
    chatToggle: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
      color: 'white',
      border: 'none',
      padding: '16px 20px',
      borderRadius: '50px',
      cursor: 'pointer',
      fontWeight: '600',
      boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)',
      zIndex: 1001,
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '16px',
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.2)',
      zIndex: 999,
      display: chatOpen ? 'block' : 'none',
    }
  };

  return (
    <div className="flex h-screen" style={layoutStyles.container}>
      {/* Chat Toggle Button */}
      <button
        style={layoutStyles.chatToggle}
        onClick={() => setChatOpen(!chatOpen)}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.4)';
        }}
      >
        💬 {chatOpen ? 'Close Chat' : 'Open Chat'}
      </button>

      {/* Background Overlay */}
      <div
        style={layoutStyles.overlay}
        onClick={() => setChatOpen(false)}
      />

      {/* Chat Sidebar */}
      <div style={layoutStyles.chatOverlay}>
        {/* Chat Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
          color: 'white',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '600' }}>UniChat</h3>
              <p style={{ margin: '0', fontSize: '14px', opacity: '0.9' }}>Admin Chat Portal</p>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Chat Content */}
        <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
          <div style={{ textAlign: 'center', color: '#6b7280', marginTop: '100px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Chat Coming Soon!</h3>
            <p style={{ fontSize: '14px', opacity: '0.8' }}>Connect with users in real-time</p>
            <p style={{ fontSize: '12px', marginTop: '16px', opacity: '0.6' }}>
              Chat component will be integrated here
            </p>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6" style={{
          background: 'transparent'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;