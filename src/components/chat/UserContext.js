// UserContext.js - Put this in the frontend app
// This manages the logged-in user state across the entire app

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const UserContext = createContext();

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Provider component that wraps your app
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in when app starts
  useEffect(() => {
    const savedToken = localStorage.getItem('unichat_token');
    const savedUser = localStorage.getItem('unichat_user');
    
    if (savedToken && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        // Clear invalid data
        localStorage.removeItem('unichat_token');
        localStorage.removeItem('unichat_user');
      }
    }
    setLoading(false);
  }, []);

  // Login function - call this after successful login
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    
    // Save to localStorage so user stays logged in on page refresh
    localStorage.setItem('unichat_token', authToken);
    localStorage.setItem('unichat_user', JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    
    // Clear from localStorage
    localStorage.removeItem('unichat_token');
    localStorage.removeItem('unichat_user');
  };

  // Update user info (for profile updates)
  const updateUser = (newUserData) => {
    const updatedUser = { ...user, ...newUserData };
    setUser(updatedUser);
    localStorage.setItem('unichat_user', JSON.stringify(updatedUser));
  };

  // Check if user is logged in
  const isLoggedIn = () => {
    return !!(user && token);
  };

  // Get user with token (what your Chat component needs)
  const getCurrentUser = () => {
    if (!user || !token) return null;
    
    return {
      ...user,
      token: token,
      name: user.fullName || `${user.firstName} ${user.lastName}` || user.username,
      avatar: user.avatar || './assets/UniChatLogo.png',  
      role: user.role || 'student'
    };
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isLoggedIn,
    getCurrentUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};