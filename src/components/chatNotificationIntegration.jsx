import React, { useEffect, useState } from 'react';
import { getTotalUnreadCount } from './notification-utils';

// Component to show unread message count in your app's header/navigation
const UnreadMessageBadge = ({ chats, groups }) => {
  const unreadCount = getTotalUnreadCount(chats, groups);

  if (unreadCount === 0) return null;

  return (
    <span className="unread-message-badge">
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  );
};

// Hook to integrate chat notifications with your existing notification system
export const useChatNotificationIntegration = (currentUser, apiBaseUrl) => {
  const [chatNotifications, setChatNotifications] = useState([]);

  // Fetch chat-specific notifications from your notification API
  const loadChatNotifications = async () => {
    if (!currentUser) return;

    try {
      const response = await fetch(`${apiBaseUrl}/api/notifications/${currentUser.id}?type=message`, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const notifications = await response.json();
        // Filter for message-type notifications
        const messageNotifications = notifications.filter(n => n.type === 'message');
        setChatNotifications(messageNotifications);
      }
    } catch (error) {
      console.error('Error loading chat notifications:', error);
    }
  };

  // Mark chat notification as seen when user opens the chat
  const markChatNotificationAsSeen = async (chatId) => {
    if (!currentUser) return;

    try {
      // Find notifications for this chat and mark them as seen
      const chatNotificationsToMark = chatNotifications
        .filter(n => n.metadata?.chatId === chatId && !n.seen)
        .map(n => n._id);

      for (const notificationId of chatNotificationsToMark) {
        await fetch(`${apiBaseUrl}/api/notifications/seen/${notificationId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      // Update local state
      setChatNotifications(prev =>
        prev.map(n =>
          chatNotificationsToMark.includes(n._id) ? { ...n, seen: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking chat notifications as seen:', error);
    }
  };

  useEffect(() => {
    loadChatNotifications();
  }, [currentUser]);

  return {
    chatNotifications,
    loadChatNotifications,
    markChatNotificationAsSeen
  };
};

// Enhanced notification item component for chat messages
export const ChatNotificationItem = ({ notification, onOpenChat }) => {
  const handleClick = () => {
    if (notification.metadata?.chatId) {
      // Store chat info in sessionStorage for auto-selection
      sessionStorage.setItem('selectedChatId', notification.metadata.chatId);
      if (notification.metadata.chatName) {
        sessionStorage.setItem('selectedChatName', notification.metadata.chatName);
      }
      
      // Navigate to chat page or open chat
      if (onOpenChat) {
        onOpenChat(notification.metadata);
      }
    }
  };

  return (
    <div
      className={`notification ${!notification.seen ? 'unread' : ''}`}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="notification-content">
        <div className="notification-emoji">💬</div>
        <div className={`notification-text ${!notification.seen ? 'unread' : ''}`}>
          {notification.message}
          {notification.metadata?.chatType === 'group' && (
            <span style={{ color: '#666', fontSize: '12px', display: 'block' }}>
              Group: {notification.metadata.chatName}
            </span>
          )}
        </div>
      </div>
      <div className="notification-time">
        {formatTime(notification.createdAt)}
      </div>
    </div>
  );
};

// Utility function to create chat notifications
export const createChatNotificationAPI = async (currentUser, apiBaseUrl, messageData, chatData) => {
  if (!currentUser || messageData.senderId === currentUser.id) return;

  try {
    const response = await fetch(`${apiBaseUrl}/api/notifications`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${currentUser.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: currentUser.id,
        type: 'message',
        message: `${messageData.senderName} sent you a message${chatData.type === 'group' ? ` in ${chatData.name}` : ''}`,
        metadata: {
          chatId: chatData.id,
          messageId: messageData.id,
          chatType: chatData.type,
          chatName: chatData.name,
          senderId: messageData.senderId,
          senderName: messageData.senderName
        }
      })
    });

    if (response.ok) {
      const notification = await response.json();
      console.log('✅ Chat notification created:', notification);
      return notification;
    }
  } catch (error) {
    console.error('❌ Error creating chat notification:', error);
  }
};

const formatTime = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diff = now - time;
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} mins ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)} hours ago`;
  return `${Math.floor(minutes / 1440)} days ago`;
};

export default UnreadMessageBadge;