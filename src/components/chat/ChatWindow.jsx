import React, { useState, useEffect, useRef } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import './ChatWindow.css';

const ChatWindow = ({ 
  messages = [], 
  currentUser, 
  onSendMessage, 
  typingUsers = [], 
  onTyping,
  chatPartner 
}) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (messageText) => {
    if (messageText.trim() && onSendMessage) {
      onSendMessage({
        id: Date.now(), // You'll replace this with proper ID from backend
        text: messageText,
        sender: currentUser,
        timestamp: new Date(),
        status: 'sent' // sent, delivered, seen
      });
    }
  };

  const handleTyping = (isTyping) => {
    if (onTyping) {
      onTyping(isTyping);
    }
  };

  return (
    <div className="chat-window">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-partner-info">
          <div className="avatar">
            {chatPartner?.name?.charAt(0) || 'U'}
          </div>
          <div className="partner-details">
            <h3>{chatPartner?.name || 'Chat'}</h3>
            <span className="status">
              {chatPartner?.online ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="messages-container">
        <MessageList 
          messages={messages} 
          currentUser={currentUser}
        />
        
        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <TypingIndicator users={typingUsers} />
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput 
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        placeholder="Type a message..."
      />
    </div>
  );
};

export default ChatWindow;
