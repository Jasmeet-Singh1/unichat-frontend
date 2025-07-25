import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Smile, MoreVertical, Phone, Video } from 'lucide-react';
import MessageList from './MessageList';
import UserList from './UserList';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';

const ChatContainer = ({ 
  currentUser, 
  selectedChat, 
  onSendMessage, 
  onJoinRoom, 
  onLeaveRoom,
  socket 
}) => {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket event listeners
  useEffect(() => {
    if (!socket || !selectedChat) return;

    // Join the selected chat room
    socket.emit('join-room', selectedChat.id);
    if (onJoinRoom) onJoinRoom(selectedChat.id);

    // Listen for new messages
    const handleNewMessage = (message) => {
      setMessages(prev => [...prev, message]);
    };

    // Listen for typing indicators
    const handleUserTyping = (data) => {
      if (data.userId !== currentUser.id) {
        setTypingUsers(prev => [...prev.filter(id => id !== data.userId), data.userId]);
        setTimeout(() => {
          setTypingUsers(prev => prev.filter(id => id !== data.userId));
        }, 3000);
      }
    };

    // Listen for online users
    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    socket.on('new-message', handleNewMessage);
    socket.on('user-typing', handleUserTyping);
    socket.on('online-users', handleOnlineUsers);

    // Cleanup
    return () => {
      socket.off('new-message', handleNewMessage);
      socket.off('user-typing', handleUserTyping);
      socket.off('online-users', handleOnlineUsers);
      
      if (selectedChat) {
        socket.emit('leave-room', selectedChat.id);
        if (onLeaveRoom) onLeaveRoom(selectedChat.id);
      }
    };
  }, [socket, selectedChat, currentUser.id, onJoinRoom, onLeaveRoom]);

  // Load messages for selected chat
  useEffect(() => {
    if (selectedChat) {
      // In a real app, you would fetch messages from your API
      loadMessages(selectedChat.id);
    }
  }, [selectedChat]);

  const loadMessages = async (chatId) => {
    try {
      // Mock API call - replace with your actual API
      const response = await fetch(`/api/chats/${chatId}/messages`);
      if (response.ok) {
        const chatMessages = await response.json();
        setMessages(chatMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      // For demo purposes, load mock messages
      setMessages(getMockMessages(chatId));
    }
  };

  const handleSendMessage = async (messageData) => {
    const newMessage = {
      id: Date.now(),
      text: messageData.text,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      timestamp: new Date().toISOString(),
      chatId: selectedChat.id,
      type: messageData.type || 'text',
      attachments: messageData.attachments || []
    };

    // Optimistically add message to UI
    setMessages(prev => [...prev, newMessage]);

    // Emit to socket
    if (socket) {
      socket.emit('send-message', newMessage);
    }

    // Call parent handler
    if (onSendMessage) {
      onSendMessage(newMessage);
    }

    try {
      // Send to API
      await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessage),
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = () => {
    if (socket && selectedChat) {
      socket.emit('typing', {
        userId: currentUser.id,
        userName: currentUser.name,
        chatId: selectedChat.id
      });
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Welcome to Unichat</h3>
          <p className="text-gray-500">Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Header */}
      <ChatHeader 
        chat={selectedChat}
        onlineUsers={onlineUsers}
        currentUser={currentUser}
      />

      {/* Messages Area */}
      <div className="flex-1 flex">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages List */}
          <MessageList 
            messages={messages}
            currentUser={currentUser}
            typingUsers={typingUsers}
            onlineUsers={onlineUsers}
          />
          <div ref={messagesEndRef} />

          {/* Message Input */}
          <MessageInput 
            onSendMessage={handleSendMessage}
            onTyping={handleTyping}
            currentUser={currentUser}
          />
        </div>

        {/* User List Sidebar (for group chats) */}
        {selectedChat.type === 'group' && (
          <UserList 
            users={selectedChat.members || []}
            onlineUsers={onlineUsers}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
};

// Mock messages for demo
const getMockMessages = (chatId) => {
  return [
    {
      id: 1,
      text: "Hey everyone! Welcome to the study group 📚",
      senderId: "user1",
      senderName: "Alice Johnson",
      senderAvatar: "/avatars/alice.jpg",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      chatId: chatId,
      type: "text"
    },
    {
      id: 2,
      text: "Thanks for setting this up! Looking forward to collaborating",
      senderId: "user2", 
      senderName: "Bob Smith",
      senderAvatar: "/avatars/bob.jpg",
      timestamp: new Date(Date.now() - 3000000).toISOString(),
      chatId: chatId,
      type: "text"
    },
    {
      id: 3,
      text: "I've uploaded the study materials to our shared folder",
      senderId: "user3",
      senderName: "Carol Davis",
      senderAvatar: "/avatars/carol.jpg", 
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      chatId: chatId,
      type: "text"
    }
  ];
};

export default ChatContainer;

