// Notification Badge Utilities
import { showNotification, playNotificationSound } from './chat-utils';

// Calculate total unread messages across all chats
export const getTotalUnreadCount = (chats, groups) => {
  const chatUnread = chats.reduce((total, chat) => total + (chat.unreadCount || 0), 0);
  const groupUnread = groups.reduce((total, group) => total + (group.unreadCount || 0), 0);
  return chatUnread + groupUnread;
};

// Update browser tab title with unread count
export const updateTabTitle = (unreadCount) => {
  const baseTitle = 'UniChat';
  if (unreadCount > 0) {
    document.title = `(${unreadCount > 99 ? '99+' : unreadCount}) ${baseTitle}`;
  } else {
    document.title = baseTitle;
  }
};

// Update favicon with unread indicator (optional advanced feature)
export const updateFavicon = (hasUnread) => {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Draw base icon (simple chat bubble)
    ctx.fillStyle = '#0066cc';
    ctx.fillRect(4, 8, 20, 16);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(6, 10, 16, 12);
    
    // Add red dot for unread messages
    if (hasUnread) {
      ctx.fillStyle = '#ff4444';
      ctx.beginPath();
      ctx.arc(24, 8, 6, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    // Update favicon
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = canvas.toDataURL();
    document.getElementsByTagName('head')[0].appendChild(link);
  } catch (error) {
    console.log('Could not update favicon:', error);
  }
};

// Handle new message notification
export const handleNewMessageNotification = (message, chat, currentUser, isAppVisible = true) => {
  // Don't notify for own messages
  if (message.senderId === currentUser.id) return;
  
  // Show browser notification if app is not visible
  if (!isAppVisible) {
    const title = chat.type === 'group' ? 
      `${message.senderName} in ${chat.name}` : 
      message.senderName;
    
    showNotification(title, message.text);
    playNotificationSound();
  }
};

// Check if app is currently visible/focused
export const isAppVisible = () => {
  return !document.hidden && document.hasFocus();
};