import React from 'react';
import Message from './Message';
import './MessageList.css';

const MessageList = ({ messages, currentUser }) => {
  const formatMessages = () => {
    const formattedMessages = [];
    
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      const prevMessage = messages[i - 1];
      
      // Check if we need to show date separator
      const showDateSeparator = !prevMessage || 
        !isSameDay(new Date(message.timestamp), new Date(prevMessage.timestamp));
      
      if (showDateSeparator) {
        formattedMessages.push({
          type: 'date-separator',
          id: `date-${message.timestamp}`,
          date: new Date(message.timestamp)
        });
      }
      
      formattedMessages.push({
        ...message,
        type: 'message',
        isOwn: message.sender.id === currentUser.id,
        showAvatar: shouldShowAvatar(message, messages[i + 1], currentUser)
      });
    }
    
    return formattedMessages;
  };

  const shouldShowAvatar = (currentMsg, nextMsg, currentUser) => {
    // Show avatar if it's the last message from this sender
    // or if the next message is from a different sender
    if (currentMsg.sender.id === currentUser.id) return false; // Don't show avatar for own messages
    
    return !nextMsg || 
           nextMsg.sender.id !== currentMsg.sender.id ||
           !isSameMinute(new Date(currentMsg.timestamp), new Date(nextMsg.timestamp));
  };

  const isSameDay = (date1, date2) => {
    return date1.toDateString() === date2.toDateString();
  };

  const isSameMinute = (date1, date2) => {
    return Math.abs(date1.getTime() - date2.getTime()) < 60000; // 1 minute
  };

  const formatDateSeparator = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (isSameDay(date, today)) {
      return 'Today';
    } else if (isSameDay(date, yesterday)) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  const formattedMessages = formatMessages();

  return (
    <div className="message-list">
      {formattedMessages.map((item) => {
        if (item.type === 'date-separator') {
          return (
            <div key={item.id} className="date-separator">
              <span>{formatDateSeparator(item.date)}</span>
            </div>
          );
        }
        
        return (
          <Message
            key={item.id}
            message={item}
            isOwn={item.isOwn}
            showAvatar={item.showAvatar}
            currentUser={currentUser}
          />
        );
      })}
    </div>
  );
};

export default MessageList;

