import React, { useState, useEffect, useCallback } from 'react';
import ChatWindow from './ChatWindow';
import useSocket from './useSocket';

const ChatContainer = ({ 
  currentUser, 
  conversationId, 
  chatPartner,
  serverUrl = 'http://localhost:3001' // Your Socket.IO server URL
}) => {
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize socket connection
  const {
    socket,
    isConnected,
    onlineUsers,
    joinConversation,
    leaveConversation,
    sendMessage: socketSendMessage,
    sendTyping,
    markMessageAsRead
  } = useSocket(serverUrl, currentUser?.id);

  // Join conversation when component mounts or conversationId changes
  useEffect(() => {
    if (conversationId && isConnected) {
      joinConversation(conversationId);
      loadMessages(); // Load initial messages from API
    }

    return () => {
      if (conversationId && isConnected) {
        leaveConversation(conversationId);
      }
    };
  }, [conversationId, isConnected]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Listen for new messages
    const handleNewMessage = (message) => {
      setMessages(prev => [...prev, {
        ...message,
        timestamp: new Date(message.timestamp)
      }]);

      // Mark message as read if it's not from current user
      if (message.sender.id !== currentUser.id) {
        markMessageAsRead(message.id);
      }
    };

    // Listen for typing indicators
    const handleTyping = ({ userId, userName, isTyping }) => {
      if (userId === currentUser.id) return; // Don't show own typing

      setTypingUsers(prev => {
        if (isTyping) {
          // Add user to typing list if not already there
          const userExists = prev.some(user => user.id === userId);
          if (!userExists) {
            return [...prev, { id: userId, name: userName }];
          }
          return prev;
        } else {
          // Remove user from typing list
          return prev.filter(user => user.id !== userId);
        }
      });
    };

    // Listen for message status updates
    const handleMessageStatus = ({ messageId, status }) => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status } : msg
      ));
    };

    // Listen for message read receipts
    const handleMessageRead = ({ messageId, readBy }) => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status: 'seen', readBy } : msg
      ));
    };

    // Attach event listeners
    socket.on('new_message', handleNewMessage);
    socket.on('typing', handleTyping);
    socket.on('message_status', handleMessageStatus);
    socket.on('message_read', handleMessageRead);

    // Cleanup listeners
    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('typing', handleTyping);
      socket.off('message_status', handleMessageStatus);
      socket.off('message_read', handleMessageRead);
    };
  }, [socket, currentUser.id, markMessageAsRead]);

  // Load initial messages from API
  const loadMessages = async () => {
    try {
      setLoading(true);
      // Replace with your actual API call
      const response = await fetch(`/api/conversations/${conversationId}/messages`);
      const data = await response.json();
      
      setMessages(data.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Send message handler
  const handleSendMessage = useCallback(async (messageText) => {
    if (!messageText.trim() || !conversationId) return;

    const tempMessage = {
      id: `temp-${Date.now()}`,
      text: messageText,
      sender: currentUser,
      timestamp: new Date(),
      status: 'sending',
      isTemporary: true
    };

    // Add temporary message to UI immediately
    setMessages(prev => [...prev, tempMessage]);

    try {
      // Send via Socket.IO for real-time delivery
      socketSendMessage(conversationId, {
        text: messageText,
        type: 'text'
      });

      // Also send via API for persistence (optional, depends on your backend setup)
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add your auth headers here
        },
        body: JSON.stringify({
          text: messageText,
          type: 'text'
        })
      });

      if (response.ok) {
        const savedMessage = await response.json();
        // Replace temporary message with saved message
        setMessages(prev => prev.map(msg => 
          msg.id === tempMessage.id 
            ? { ...savedMessage, timestamp: new Date(savedMessage.timestamp) }
            : msg
        ));
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Update temporary message to show error
      setMessages(prev => prev.map(msg => 
        msg.id === tempMessage.id 
          ? { ...msg, status: 'failed' }
          : msg
      ));
    }
  }, [conversationId, currentUser, socketSendMessage]);

  // Typing handler
  const handleTyping = useCallback((isTyping) => {
    if (conversationId) {
      sendTyping(conversationId, isTyping);
    }
  }, [conversationId, sendTyping]);

  // Update chat partner online status
  const updatedChatPartner = {
    ...chatPartner,
    online: onlineUsers.some(user => user.id === chatPartner?.id)
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        color: '#6b7280'
      }}>
        Loading conversation...
      </div>
    );
  }

  return (
    <ChatWindow
      messages={messages}
      currentUser={currentUser}
      onSendMessage={handleSendMessage}
      typingUsers={typingUsers}
      onTyping={handleTyping}
      chatPartner={updatedChatPartner}
    />
  );
};

export default ChatContainer;

