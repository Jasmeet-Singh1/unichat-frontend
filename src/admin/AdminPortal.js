// src/admin/AdminPortal.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AdminLogin from './components/AdminLogin';

// Import your existing pages
import Dashboard from './pages/Dashboard';
import ManageUsers from './pages/ManageUsers';
import ApprovalManagement from './pages/ApprovalManagement'; // New page
import ViewUploads from './pages/ViewUploads';
import FlaggedContent from './pages/FlaggedContent';
import EventManagement from './pages/EventManagement';
import AdminInbox from './pages/AdminInbox';
import Settings from './pages/Settings';

import './styles/AdminPortal.css';

// Theme Context
export const ThemeContext = React.createContext();

const AdminPortal = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  
  // Add debug logging
  const location = useLocation();
  
  console.log('AdminPortal - Current path:', location.pathname);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const savedTheme = localStorage.getItem('adminTheme');
    
    if (adminToken) {
      setIsAuthenticated(true);
    }
    if (savedTheme === 'dark') {
      setIsDark(true);
    }
    setIsLoading(false);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('adminTheme', newTheme ? 'dark' : 'light');
  };

  if (isLoading) {
    return (
      <div className={`loading-container ${isDark ? 'dark' : 'light'}`}>
        <div className="loading-spinner"></div>
        <p>Loading Admin Portal...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeContext.Provider value={{ isDark, toggleTheme }}>
        <AdminLogin onLogin={() => setIsAuthenticated(true)} />
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className={`admin-portal ${isDark ? 'dark' : 'light'}`}>
        <Layout>
          <Routes>
            {/* Only redirect root admin path to dashboard */}
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            
            {/* All specific routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/approvals" element={<ApprovalManagement />} />
            <Route path="/view-uploads" element={<ViewUploads />} />
            <Route path="/flagged-content" element={<FlaggedContent />} />
            <Route path="/event-management" element={<EventManagement />} />
            <Route path="/admin-inbox" element={<AdminInbox />} />
            <Route path="/settings" element={<Settings />} />
            
            {/* Debug route for unmatched paths */}
            <Route path="*" element={
              <div style={{ padding: '20px' }}>
                <h2>Debug: Route Not Found</h2>
                <p><strong>Current path:</strong> {location.pathname}</p>
                <p><strong>Available routes:</strong></p>
                <ul>
                  <li>/admin/dashboard</li>
                  <li>/admin/manage-users</li>
                  <li>/admin/approvals</li>
                  <li>/admin/view-uploads</li>
                  <li>/admin/flagged-content</li>
                  <li>/admin/event-management</li>
                  <li>/admin/admin-inbox</li>
                  <li>/admin/settings</li>
                </ul>
                <button onClick={() => window.location.href = '/admin/dashboard'}>
                  Go to Dashboard
                </button>
              </div>
            } />
          </Routes>
        </Layout>
      </div>
    </ThemeContext.Provider>
  );
};

export default AdminPortal;