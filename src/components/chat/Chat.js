import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ChatSidebar from './ChatSidebar';
import ChatContainer from './ChatContainer';

const Chat = ({ 
  currentUser, 
  apiBaseUrl = 'http://localhost:3001',
  socketUrl = 'http://localhost:3001',
  onError,
  onConnectionChange 
}) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(socketUrl, {
      auth: {
        userId: currentUser.id,
        userName: currentUser.name
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
      setIsConnected(true);
      if (onConnectionChange) onConnectionChange(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from chat server');
      setIsConnected(false);
      if (onConnectionChange) onConnectionChange(false);
    });

    newSocket.on('online-users', (users) => {
      setOnlineUsers(users);
    });

    newSocket.on('chat-updated', (updatedChat) => {
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === updatedChat.id ? updatedChat : chat
        )
      );
    });

    newSocket.on('new-chat', (newChat) => {
      setChats(prevChats => [newChat, ...prevChats]);
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
      if (onError) onError(error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [currentUser.id, currentUser.name, socketUrl, onConnectionChange, onError]);

  // Load initial chats
  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/api/chats`, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userChats = await response.json();
        setChats(userChats);
      } else {
        throw new Error('Failed to load chats');
      }
    } catch (error) {
      console.error('Error loading chats:', error);
      if (onError) onError(error);
      
      // Load mock data for demo
      setChats(getMockChats());
    } finally {
      setLoading(false);
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    
    // Mark chat as read
    if (chat.unreadCount > 0) {
      markChatAsRead(chat.id);
    }
  };

  const handleSendMessage = async (messageData) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...messageData,
          chatId: selectedChat.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Update chat's last message
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === selectedChat.id
            ? {
                ...chat,
                lastMessage: {
                  text: messageData.text,
                  timestamp: new Date().toISOString(),
                  senderId: currentUser.id,
                  type: messageData.type
                },
                updatedAt: new Date().toISOString()
              }
            : chat
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      if (onError) onError(error);
    }
  };

  const handleNewChat = async (type) => {
    try {
      if (type === 'direct') {
        // Open user selection modal/component
        // For now, we'll just show an alert
        alert('Direct chat creation would open a user selection dialog');
      } else if (type === 'group') {
        // Open group creation modal/component
        alert('Group chat creation would open a group creation dialog');
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
      if (onError) onError(error);
    }
  };

  const markChatAsRead = async (chatId) => {
    try {
      await fetch(`${apiBaseUrl}/api/chats/${chatId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        }
      });

      // Update local state
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
        )
      );
    } catch (error) {
      console.error('Error marking chat as read:', error);
    }
  };

  const handleJoinRoom = (roomId) => {
    if (socket) {
      socket.emit('join-room', roomId);
    }
  };

  const handleLeaveRoom = (roomId) => {
    if (socket) {
      socket.emit('leave-room', roomId);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Connection Status */}
      {!isConnected && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-center py-2 z-50">
          Disconnected from chat server. Trying to reconnect...
        </div>
      )}

      {/* Chat Sidebar */}
      <ChatSidebar
        chats={chats}
        selectedChat={selectedChat}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
        currentUser={currentUser}
        onlineUsers={onlineUsers}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Chat Area */}
      <ChatContainer
        currentUser={currentUser}
        selectedChat={selectedChat}
        onSendMessage={handleSendMessage}
        onJoinRoom={handleJoinRoom}
        onLeaveRoom={handleLeaveRoom}
        socket={socket}
      />
    </div>
  );
};

// Mock data for demo purposes
const getMockChats = () => {
  return [
    {
      id: 'chat1',
      type: 'group',
      name: 'Computer Science Study Group',
      avatar: '/group-avatars/cs-study.jpg',
      members: [
        { id: 'user1', name: 'Alice Johnson', avatar: '/avatars/alice.jpg', role: 'student' },
        { id: 'user2', name: 'Bob Smith', avatar: '/avatars/bob.jpg', role: 'mentor' },
        { id: 'user3', name: 'Carol Davis', avatar: '/avatars/carol.jpg', role: 'alumni' }
      ],
      lastMessage: {
        text: 'Thanks for sharing the study materials!',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        senderId: 'user3',
        type: 'text'
      },
      unreadCount: 2,
      updatedAt: new Date(Date.now() - 300000).toISOString()
    },
    {
      id: 'chat2',
      type: 'direct',
      members: [
        { id: 'current-user', name: 'You', avatar: '/avatars/you.jpg', role: 'student' },
        { id: 'user4', name: 'Dr. Emily Wilson', avatar: '/avatars/emily.jpg', role: 'mentor' }
      ],
      lastMessage: {
        text: 'I\'ll review your project proposal by tomorrow',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        senderId: 'user4',
        type: 'text'
      },
      unreadCount: 1,
      updatedAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'chat3',
      type: 'group',
      name: 'Alumni Network',
      avatar: '/group-avatars/alumni.jpg',
      members: [
        { id: 'user5', name: 'Michael Brown', avatar: '/avatars/michael.jpg', role: 'alumni' },
        { id: 'user6', name: 'Sarah Lee', avatar: '/avatars/sarah.jpg', role: 'alumni' },
        { id: 'user7', name: 'David Kim', avatar: '/avatars/david.jpg', role: 'alumni' }
      ],
      lastMessage: {
        text: 'Great networking event last week!',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        senderId: 'user5',
        type: 'text'
      },
      unreadCount: 0,
      updatedAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];
};

export default Chat;

