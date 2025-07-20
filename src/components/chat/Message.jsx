import React from 'react';
import './Message.css';

const Message = ({ message, isOwn, showAvatar, currentUser }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'seen':
        return '✓✓';
      default:
        return '';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'seen':
        return 'status-seen';
      case 'delivered':
        return 'status-delivered';
      case 'sent':
        return 'status-sent';
      default:
        return '';
    }
  };

  return (
    <div className={`message ${isOwn ? 'message-own' : 'message-other'}`}>
      {/* Avatar for other users */}
      {!isOwn && showAvatar && (
        <div className="message-avatar">
          {message.sender.avatar ? (
            <img src={message.sender.avatar} alt={message.sender.name} />
          ) : (
            <div className="avatar-placeholder">
              {message.sender.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}
      
      {/* Message Content */}
      <div className="message-content">
        {/* Sender name for other users */}
        {!isOwn && showAvatar && (
          <div className="message-sender">
            {message.sender.name}
          </div>
        )}
        
        {/* Message bubble */}
        <div className={`message-bubble ${isOwn ? 'bubble-own' : 'bubble-other'}`}>
          <div className="message-text">
            {message.text}
          </div>
          
          {/* Message metadata */}
          <div className="message-meta">
            <span className="message-time">
              {formatTime(message.timestamp)}
            </span>
            
            {/* Status indicators for own messages */}
            {isOwn && message.status && (
              <span className={`message-status ${getStatusClass(message.status)}`}>
                {getStatusIcon(message.status)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;

