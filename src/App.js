import React from 'react';
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

// Main Navigation Component
import MainNavigation from './MainNavigation';

import './index.css';

function App() {
  // Mock current user - replace with your actual user data
  const currentUser = {
    id: 'user123',
    name: 'John Doe',
    avatar: '/avatars/john.jpg',
    role: 'admin', // admin, student, mentor, alumni
    token: localStorage.getItem('authToken') || 'mock-token'
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Main Navigation Route */}
          <Route path="/" element={<MainNavigation currentUser={currentUser} />} />
          
          {/* Chat Routes */}
          <Route path="/chat" element={
            <Chat 
              currentUser={currentUser}
              apiBaseUrl="http://localhost:3001"
              socketUrl="http://localhost:3001"
              onError={(error) => console.error('Chat error:', error)}
              onConnectionChange={(connected) => console.log('Connected:', connected)}
            />
          } />
          
          {/* Admin Portal Routes */}
          <Route path="/admin/*" element={
            currentUser.role === 'admin' ? (
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
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
                  <p className="text-gray-600 mb-4">You don't have permission to access the admin portal.</p>
                  <button 
                    onClick={() => window.location.href = '/chat'}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Go to Chat
                  </button>
                </div>
              </div>
            )
          } />

          {/* Redirect old admin routes to new structure */}
          <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/manage-users" element={<Navigate to="/admin/manage-users" replace />} />
          <Route path="/view-uploads" element={<Navigate to="/admin/view-uploads" replace />} />
          <Route path="/flagged-content" element={<Navigate to="/admin/flagged-content" replace />} />
          <Route path="/event-management" element={<Navigate to="/admin/event-management" replace />} />
          <Route path="/admin-inbox" element={<Navigate to="/admin/admin-inbox" replace />} />
          <Route path="/settings" element={<Navigate to="/admin/settings" replace />} />

          {/* 404 Route */}
          <Route path="*" element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h1>
                <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
                <div className="space-x-4">
                  <button 
                    onClick={() => window.location.href = '/chat'}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Go to Chat
                  </button>
                  {currentUser.role === 'admin' && (
                    <button 
                      onClick={() => window.location.href = '/admin'}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      Go to Admin
                    </button>
                  )}
                </div>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

