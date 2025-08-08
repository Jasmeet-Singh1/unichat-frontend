import React, { useRef, useEffect } from 'react';
import { formatTime } from './chat-utils';

const MessageList = ({ messages, currentUser, selectedChat }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="messages-container">
        <div className="empty-messages">
          <div className="empty-messages-content">
            <div className="empty-messages-icon">💭</div>
            <h3 className="empty-messages-title">
              No messages yet
            </h3>
            <p className="empty-messages-subtitle">
              Start the conversation by sending a message
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-container">
      {messages.map((msg, index) => {
        const isOwn = msg.senderId === currentUser.id;
        
        if (isOwn) {
          console.log('📋 Message data:', {
            id: msg.id,
            text: msg.text.substring(0, 20) + '...',
            readBy: msg.readBy,
            readByLength: msg.readBy?.length || 0,
            hasReadBy: !!msg.readBy
          });
        }

        return (
          <div
            key={msg.id || index}
            className={`message-item ${isOwn ? 'own' : ''}`}
          >
            <div className={`message-bubble ${isOwn ? 'own' : 'other'}`}>
              <p className="message-text">
                {msg.text}
              </p>
              <div className={`message-meta ${isOwn ? 'own' : 'other'}`}>
                <span>{formatTime(msg.timestamp)}</span>
                {isOwn && (
                  <span className={`message-status ${
                    msg.readBy && msg.readBy.length > 0 ? 'read' : 'unread'
                  }`}>
                    {msg.readBy && msg.readBy.length > 0 ? (
                      selectedChat.type === 'group' ? (
                        msg.readBy.length === (selectedChat.members?.length - 1) ? 
                          <span title={`Read by all ${msg.readBy.length} members`}>✓✓</span> : 
                          <span title={`Read by ${msg.readBy.length} of ${selectedChat.members?.length - 1} members`}>✓</span>
                      ) : (
                        <span title="Read">✓✓</span>
                      )
                    ) : (
                      <span title="Sent">✓</span>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;