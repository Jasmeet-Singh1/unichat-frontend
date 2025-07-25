import React from 'react';
import { MessageCircle, Shield, Users, Calendar } from 'lucide-react';

const MainNavigation = ({ currentUser }) => {
  const handleChatClick = () => {
    window.location.href = '/chat';
  };

  const handleAdminClick = () => {
    if (currentUser.role === 'admin') {
      window.location.href = '/admin';
    } else {
      alert('You need admin privileges to access the admin portal.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white p-4 rounded-2xl shadow-lg">
              <h1 className="text-4xl font-bold text-gray-800">UNICHAT</h1>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Welcome, {currentUser.name}!
          </h2>
          <p className="text-gray-600 text-lg">
            Choose your destination to get started
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Chat Portal Card */}
          <div 
            onClick={handleChatClick}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 p-8"
          >
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Chat Portal</h3>
              <p className="text-gray-600 mb-6">
                Connect with students, alumni, and mentors. Join conversations and build your network.
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>Group Chats</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  <span>Direct Messages</span>
                </div>
              </div>
              <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                Enter Chat
              </button>
            </div>
          </div>

          {/* Admin Portal Card */}
          <div 
            onClick={handleAdminClick}
            className={`bg-white rounded-2xl shadow-lg transition-all duration-300 p-8 ${
              currentUser.role === 'admin' 
                ? 'hover:shadow-xl cursor-pointer transform hover:-translate-y-2' 
                : 'opacity-60 cursor-not-allowed'
            }`}
          >
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                currentUser.role === 'admin' ? 'bg-purple-100' : 'bg-gray-100'
              }`}>
                <Shield className={`w-8 h-8 ${
                  currentUser.role === 'admin' ? 'text-purple-600' : 'text-gray-400'
                }`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Admin Portal</h3>
              <p className="text-gray-600 mb-6">
                Manage users, moderate content, and oversee platform operations.
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>User Management</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Events</span>
                </div>
              </div>
              {currentUser.role === 'admin' ? (
                <button className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition-colors font-medium">
                  Enter Admin Portal
                </button>
              ) : (
                <button className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg cursor-not-allowed font-medium">
                  Admin Access Required
                </button>
              )}
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-lg shadow-md p-4 inline-block">
            <p className="text-sm text-gray-600">
              Logged in as: <span className="font-medium text-gray-800">{currentUser.name}</span>
              <span className="mx-2">•</span>
              Role: <span className="font-medium text-blue-600 capitalize">{currentUser.role}</span>
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-center mt-8">
          <div className="space-x-6">
            <button 
              onClick={() => window.location.href = '/chat'}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Quick Chat Access
            </button>
            {currentUser.role === 'admin' && (
              <>
                <span className="text-gray-400">•</span>
                <button 
                  onClick={() => window.location.href = '/admin'}
                  className="text-purple-600 hover:text-purple-800 font-medium"
                >
                  Quick Admin Access
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNavigation;

