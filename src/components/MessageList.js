import React from 'react';
import { Check, CheckCheck, Download, Play } from 'lucide-react';

const MessageList = ({ messages, currentUser, typingUsers, onlineUsers }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const date = formatDate(message.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const isConsecutiveMessage = (currentMsg, prevMsg) => {
    if (!prevMsg) return false;
    return (
      currentMsg.senderId === prevMsg.senderId &&
      new Date(currentMsg.timestamp) - new Date(prevMsg.timestamp) < 300000 // 5 minutes
    );
  };

  const renderAttachment = (attachment) => {
    const { type, url, name, size } = attachment;

    switch (type) {
      case 'image':
        return (
          <div className="mt-2">
            <img 
              src={url} 
              alt={name}
              className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(url, '_blank')}
            />
          </div>
        );
      
      case 'video':
        return (
          <div className="mt-2 relative">
            <video 
              src={url}
              className="max-w-xs rounded-lg"
              controls
              preload="metadata"
            />
          </div>
        );
      
      case 'audio':
        return (
          <div className="mt-2">
            <audio src={url} controls className="max-w-xs" />
          </div>
        );
      
      case 'file':
      default:
        return (
          <div className="mt-2 flex items-center p-3 bg-gray-100 rounded-lg max-w-xs cursor-pointer hover:bg-gray-200 transition-colors">
            <Download className="w-5 h-5 text-gray-600 mr-3" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(size)}</p>
            </div>
          </div>
        );
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderMessage = (message, index, messages) => {
    const isOwn = message.senderId === currentUser.id;
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const isConsecutive = isConsecutiveMessage(message, prevMessage);
    const isOnline = onlineUsers.includes(message.senderId);

    return (
      <div
        key={message.id}
        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${
          isConsecutive ? 'mt-1' : 'mt-4'
        }`}
      >
        <div className={`flex ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end max-w-xs lg:max-w-md`}>
          {/* Avatar */}
          {!isOwn && !isConsecutive && (
            <div className="relative mr-2">
              <img
                src={message.senderAvatar || '/default-avatar.png'}
                alt={message.senderName}
                className="w-8 h-8 rounded-full"
              />
              {isOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
          )}
          
          {!isOwn && isConsecutive && <div className="w-10"></div>}

          {/* Message Bubble */}
          <div
            className={`relative px-4 py-2 rounded-2xl ${
              isOwn
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-900'
            } ${
              isConsecutive
                ? isOwn
                  ? 'rounded-br-md'
                  : 'rounded-bl-md'
                : ''
            }`}
          >
            {/* Sender name for group chats */}
            {!isOwn && !isConsecutive && (
              <p className="text-xs font-semibold text-gray-600 mb-1">
                {message.senderName}
              </p>
            )}

            {/* Message content */}
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.text}
            </p>

            {/* Attachments */}
            {message.attachments && message.attachments.map((attachment, idx) => (
              <div key={idx}>
                {renderAttachment(attachment)}
              </div>
            ))}

            {/* Message time and status */}
            <div className={`flex items-center justify-end mt-1 space-x-1`}>
              <span className={`text-xs ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                {formatTime(message.timestamp)}
              </span>
              
              {isOwn && (
                <div className="flex">
                  {message.status === 'sent' && (
                    <Check className="w-3 h-3 text-blue-100" />
                  )}
                  {message.status === 'delivered' && (
                    <CheckCheck className="w-3 h-3 text-blue-100" />
                  )}
                  {message.status === 'read' && (
                    <CheckCheck className="w-3 h-3 text-green-300" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTypingIndicator = () => {
    if (typingUsers.length === 0) return null;

    return (
      <div className="flex justify-start mt-4">
        <div className="flex items-end max-w-xs">
          <div className="w-8 h-8 mr-2"></div>
          <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-md">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {Object.entries(messageGroups).map(([date, dateMessages]) => (
        <div key={date}>
          {/* Date separator */}
          <div className="flex justify-center my-4">
            <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
              {date}
            </span>
          </div>

          {/* Messages for this date */}
          <div>
            {dateMessages.map((message, index) => 
              renderMessage(message, index, dateMessages)
            )}
          </div>
        </div>
      ))}

      {/* Typing indicator */}
      {renderTypingIndicator()}
    </div>
  );
};

export default MessageList;

