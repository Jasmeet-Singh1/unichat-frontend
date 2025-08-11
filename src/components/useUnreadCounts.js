import { useState, useEffect, useCallback } from 'react';
import { getTotalUnreadCount } from './notification-utils';

// Custom hook to manage unread counts for both chat and notifications
export const useUnreadCounts = () => {
  const [chatUnreadCount, setChatUnreadCount] = useState(0);
  const [notificationUnreadCount, setNotificationUnreadCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  // Get current user from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userDataString = localStorage.getItem('user');
    
    let userData = null;
    if (userDataString) {
      try {
        userData = JSON.parse(userDataString);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    let finalUserId = userId || 
                     localStorage.getItem('user_id') || 
                     localStorage.getItem('id') ||
                     (userData && userData.id) ||
                     (userData && userData._id);

    let finalToken = token || localStorage.getItem('authToken') || localStorage.getItem('accessToken');

    if (finalToken && finalUserId) {
      setCurrentUser({
        id: finalUserId,
        token: finalToken,
        ...userData
      });
    }
  }, []);

  // Load chat unread counts
  const loadChatUnreadCounts = useCallback(async () => {
    if (!currentUser) return;

    try {
      // Load conversations
      const chatsResponse = await fetch(`http://localhost:3001/api/chat/conversations`, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        }
      });

      // Load groups
      const groupsResponse = await fetch(`http://localhost:3001/api/groups`, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (chatsResponse.ok && groupsResponse.ok) {
        const chats = await chatsResponse.json();
        const groups = await groupsResponse.json();
        
        const totalUnread = getTotalUnreadCount(chats, groups);
        setChatUnreadCount(totalUnread);
        
        console.log('📊 Chat unread count updated:', totalUnread);
      }
    } catch (error) {
      console.error('Error loading chat unread counts:', error);
    }
  }, [currentUser]);

  // Load notification unread count
  const loadNotificationUnreadCount = useCallback(async () => {
    if (!currentUser) return;

    try {
      const response = await fetch(`http://localhost:3001/api/notifications/${currentUser.id}`, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const notifications = await response.json();
        const unreadCount = notifications.filter(n => !n.isRead).length;
        setNotificationUnreadCount(unreadCount);
        
        console.log('📊 Notification unread count updated:', unreadCount);
      }
    } catch (error) {
      console.error('Error loading notification unread count:', error);
    }
  }, [currentUser]);

  // Load counts on mount and set up periodic refresh
  useEffect(() => {
    if (currentUser) {
      loadChatUnreadCounts();
      loadNotificationUnreadCount();
      
      // Refresh every 30 seconds
      const interval = setInterval(() => {
        loadChatUnreadCounts();
        loadNotificationUnreadCount();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [currentUser, loadChatUnreadCounts, loadNotificationUnreadCount]);

  return {
    chatUnreadCount,
    notificationUnreadCount,
    refreshChatUnreadCount: loadChatUnreadCounts,
    refreshNotificationUnreadCount: loadNotificationUnreadCount,
    currentUser
  };
};