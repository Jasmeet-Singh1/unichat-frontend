import React from 'react';
import './TypingIndicator.css';

const TypingIndicator = ({ users = [] }) => {
  if (!users || users.length === 0) {
    return null;
  }

  const formatTypingText = () => {
    if (users.length === 1) {
      return `${users[0].name} is typing`;
    } else if (users.length === 2) {
      return `${users[0].name} and ${users[1].name} are typing`;
    } else {
      return `${users[0].name} and ${users.length - 1} others are typing`;
    }
  };

  return (
    <div className="typing-indicator">
      <div className="typing-avatar">
        {users[0].avatar ? (
          <img src={users[0].avatar} alt={users[0].name} />
        ) : (
          <div className="avatar-placeholder">
            {users[0].name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      
      <div className="typing-content">
        <div className="typing-bubble">
          <div className="typing-text">
            {formatTypingText()}
          </div>
          
          <div className="typing-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;

