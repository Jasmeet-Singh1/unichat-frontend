import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown, LogOut, User, Settings, MessageCircle, Home } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

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
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/login';
    }
    setShowDropdown(false);
  };

  const handleProfile = () => {
    console.log('Navigate to profile');
    setShowDropdown(false);
  };

  const handleSettings = () => {
    window.location.href = '/admin/settings';
    setShowDropdown(false);
  };

  const handleGoToChat = () => {
    window.location.href = '/chat';
    setShowDropdown(false);
  };

  const handleGoHome = () => {
    window.location.href = '/';
    setShowDropdown(false);
  };

  return (
    <header className="theme-bg-dropdown px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium theme-text-subtitle">UNICHAT</span>
            <span className="text-sm theme-text-subtitle">|</span>
            <h1 className="text-xl font-semibold theme-text-header">{getPageTitle()}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Quick Chat Button */}
          <button
            onClick={handleGoToChat}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Chat</span>
          </button>

          {/* Admin Portal Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg theme-text-header hover:bg-gray-100 transition-colors duration-200"
            >
              <span className="text-sm font-medium">Admin Portal</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 theme-bg-dropdown rounded-lg shadow-lg py-1 z-50">
                <div className="px-4 py-2">
                  <p className="text-sm font-medium theme-text-header">Admin User</p>
                  <p className="text-xs theme-text-subtitle">devadmin@unichat.ca</p>
                </div>
                
                <button
                  onClick={handleGoHome}
                  className="w-full px-4 py-2 text-left text-sm theme-text-header hover:bg-gray-100 flex items-center transition-colors duration-200"
                >
                  <Home className="w-4 h-4 mr-3" />
                  Home
                </button>

                <button
                  onClick={handleGoToChat}
                  className="w-full px-4 py-2 text-left text-sm theme-text-header hover:bg-gray-100 flex items-center transition-colors duration-200"
                >
                  <MessageCircle className="w-4 h-4 mr-3" />
                  Go to Chat
                </button>
                
                <button
                  onClick={handleProfile}
                  className="w-full px-4 py-2 text-left text-sm theme-text-header hover:bg-gray-100 flex items-center transition-colors duration-200"
                >
                  <User className="w-4 h-4 mr-3" />
                  Profile
                </button>
                
                <button
                  onClick={handleSettings}
                  className="w-full px-4 py-2 text-left text-sm theme-text-header hover:bg-gray-100 flex items-center transition-colors duration-200"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;

