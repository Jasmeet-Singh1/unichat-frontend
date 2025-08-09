// src/admin/AdminPortal.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AdminLogin from './components/AdminLogin';

// Import your existing pages
import Dashboard from './pages/Dashboard';
import ManageUsers from './pages/ManageUsers';
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
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/view-uploads" element={<ViewUploads />} />
            <Route path="/flagged-content" element={<FlaggedContent />} />
            <Route path="/event-management" element={<EventManagement />} />
            <Route path="/admin-inbox" element={<AdminInbox />} />
            <Route path="/settings" element={<Settings />} />
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </Layout>
      </div>
    </ThemeContext.Provider>
  );
};

export default AdminPortal;