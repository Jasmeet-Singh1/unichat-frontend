import React, { useState, useEffect } from 'react';
import Chat from '../components/Chat'; // Your teammate's comprehensive chat

const ChatPage = ({ role }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage (your existing auth system)
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    
    // You might need to add these to your login process if they don't exist:
    let userId = localStorage.getItem('userId');
    let userEmail = localStorage.getItem('userEmail');
    let firstName = localStorage.getItem('firstName');
    let lastName = localStorage.getItem('lastName');

    // If you don't store these separately, you might store user object:
    const userDataString = localStorage.getItem('user');
    let userData = null;
    
    if (userDataString) {
      try {
        userData = JSON.parse(userDataString);
        userId = userId || userData.id;
        userEmail = userEmail || userData.email;
        firstName = firstName || userData.firstName;
        lastName = lastName || userData.lastName;
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    console.log('Chat Page - Auth data:', {
      token: token ? 'EXISTS' : 'MISSING',
      role: userRole,
      userId,
      firstName,
      lastName,
      email: userEmail
    });

    if (token && userRole) {
      setCurrentUser({
        id: userId,
        token: token,
        role: userRole,
        email: userEmail,
        firstName: firstName || 'User',
        lastName: lastName || '',
        name: firstName && lastName ? `${firstName} ${lastName}` : 'User',
        avatar: null, // You don't have avatars
        fullName: firstName && lastName ? `${firstName} ${lastName}` : 'User'
      });
    } else {
      console.error('Missing auth data for chat');
    }
    
    setLoading(false);
  }, []);

  // Show loading spinner while getting user data
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  // Show error if no user data
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Authentication Required</h3>
          <p className="text-gray-600 mb-4">Please log in to access the chat.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Login
          </button>
          
          {/* Debug info */}
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-gray-500">Debug Info</summary>
            <pre className="text-xs bg-gray-100 p-2 rounded mt-2">
              {JSON.stringify({
                token: localStorage.getItem('token') ? 'EXISTS' : 'MISSING',
                role: localStorage.getItem('role'),
                userId: localStorage.getItem('userId'),
                user: localStorage.getItem('user') ? 'EXISTS' : 'MISSING'
              }, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    );
  }

  // Render the actual chat component
  return (
    <div className="h-full w-full">
      <Chat 
        currentUser={currentUser}
        apiBaseUrl="http://localhost:3001"
        socketUrl="http://localhost:3001"
        onError={(error) => {
          console.error('Chat error:', error);
          // You could show a toast notification here
        }}
        onConnectionChange={(connected) => {
          console.log('Chat connection status:', connected);
          // You could show connection status in your navbar
        }}
      />
    </div>
  );
};

export default ChatPage;