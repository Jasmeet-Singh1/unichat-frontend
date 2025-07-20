// useSocket.js - Custom hook for Socket.IO integration
import { useEffect, useRef, useState } from 'react';

// Note: You'll need to install socket.io-client
// npm install socket.io-client

const useSocket = (serverUrl, userId) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!serverUrl || !userId) return;

    // Import socket.io-client dynamically to avoid SSR issues
    import('socket.io-client').then(({ io }) => {
      // Create socket connection
      const newSocket = io(serverUrl, {
        auth: {
          userId: userId
        },
        transports: ['websocket', 'polling']
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      // Connection event handlers
      newSocket.on('connect', () => {
        console.log('Connected to server');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
      });

      // Online users tracking
      newSocket.on('users_online', (users) => {
        setOnlineUsers(users);
      });

      newSocket.on('user_joined', (user) => {
        setOnlineUsers(prev => [...prev.filter(u => u.id !== user.id), user]);
      });

      newSocket.on('user_left', (userId) => {
        setOnlineUsers(prev => prev.filter(u => u.id !== userId));
      });

      // Error handling
      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        setIsConnected(false);
      });
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, [serverUrl, userId]);

  // Socket methods
  const joinConversation = (conversationId) => {
    if (socket) {
      socket.emit('join_conversation', conversationId);
    }
  };

  const leaveConversation = (conversationId) => {
    if (socket) {
      socket.emit('leave_conversation', conversationId);
    }
  };

  const sendMessage = (conversationId, message) => {
    if (socket) {
      socket.emit('send_message', {
        conversationId,
        message
      });
    }
  };

  const sendTyping = (conversationId, isTyping) => {
    if (socket) {
      socket.emit('typing', {
        conversationId,
        isTyping
      });
    }
  };

  const markMessageAsRead = (messageId) => {
    if (socket) {
      socket.emit('mark_read', messageId);
    }
  };

  return {
    socket,
    isConnected,
    onlineUsers,
    joinConversation,
    leaveConversation,
    sendMessage,
    sendTyping,
    markMessageAsRead
  };
};

export default useSocket;

