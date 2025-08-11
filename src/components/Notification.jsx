import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import io from 'socket.io-client';

const Notification = ({ role }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [socket, setSocket] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Format time helper
  const formatTime = useCallback((timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} mins ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} hours ago`;
    return `${Math.floor(minutes / 1440)} days ago`;
  }, []);

  // Updated to include course_peer notification type
  const getNotificationEmoji = useCallback((type) => {
    switch (type) {
      case 'message':
        return '💬';
      case 'new user':
        return '🎉';
      case 'course_peer':
        return '🎓';
      case 'admin announcement':
        return '📢';
      case 'liked forum':
        return '👍';
      case 'request':
        return '📝';
      case 'added to group':
        return '👥';
      default:
        return '🔔';
    }
  }, []);

  // Get current user from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userDataString = localStorage.getItem('user');

    console.log('🔍 Debug ALL localStorage data:', {
      token: token ? 'EXISTS' : 'MISSING',
      userId: userId,
      userData: userDataString ? 'EXISTS' : 'MISSING',
      allLocalStorageKeys: Object.keys(localStorage),
      allLocalStorageData: Object.keys(localStorage).reduce((acc, key) => {
        acc[key] = localStorage.getItem(key);
        return acc;
      }, {}),
    });

    let userData = null;
    if (userDataString) {
      try {
        userData = JSON.parse(userDataString);
        console.log('📦 Parsed user data:', userData);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    let finalUserId =
      userId ||
      localStorage.getItem('user_id') ||
      localStorage.getItem('id') ||
      (userData && userData.id) ||
      (userData && userData._id);

    let finalToken = token || localStorage.getItem('authToken') || localStorage.getItem('accessToken');

    console.log('🎯 Final auth data:', {
      finalUserId,
      finalToken: finalToken ? 'EXISTS' : 'MISSING',
    });

    if (finalToken && finalUserId) {
      setCurrentUser({
        id: finalUserId,
        token: finalToken,
        ...userData,
      });
    } else {
      console.error('❌ Missing auth data:', {
        userId: finalUserId,
        token: finalToken ? 'EXISTS' : 'MISSING',
      });
    }
  }, []);

  // Load notifications from API with cache-busting
  const loadNotifications = useCallback(async () => {
    if (!currentUser) return;

    console.log('🔄 Loading notifications for user:', currentUser.id);

    try {
      setLoading(true);

      const timestamp = Date.now();
      const response = await fetch(
        `http://localhost:3001/api/notifications/${currentUser.id}?t=${timestamp}&nocache=1`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
        }
      );

      console.log('📡 API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📦 Received notifications:', data);
        setNotifications(data);
        setError(null);
      } else {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
    } catch (err) {
      console.error('❌ Error loading notifications:', err);
      setError(err.message);
      // Updated fallback data to use isRead
      setNotifications([
        {
          _id: 1,
          type: 'message',
          message: 'Emily Watson sent you a message in Data Structures course',
          createdAt: new Date(Date.now() - 2 * 60 * 1000),
          isRead: false, // ✅ Use isRead instead of seen
          metadata: {
            chatId: 'chat_123',
            chatType: 'direct',
            chatName: 'Emily Watson',
          },
        },
        {
          _id: 2,
          type: 'course_peer',
          title: 'New Course Mate!',
          message: 'Sarah Johnson (Student) has joined your CPSC 1420 class for Fall 2025.',
          createdAt: new Date(Date.now() - 3 * 60 * 1000),
          isRead: false, // ✅ Use isRead instead of seen
          metadata: {
            newUserName: 'Sarah Johnson',
            newUserRole: 'Student',
            course: 'CPSC 1420',
            semester: 'Fall',
            year: 2025,
            instructor: 'Dr. Smith',
          },
        },
        {
          _id: 3,
          type: 'message',
          message: 'John Carter sent a message in Web Development group',
          createdAt: new Date(Date.now() - 5 * 60 * 1000),
          isRead: false, // ✅ Use isRead instead of seen
          metadata: {
            chatId: 'group_456',
            chatType: 'group',
            chatName: 'Web Development Study Group',
          },
        },
        {
          _id: 4,
          type: 'new user',
          message: 'Sarah Lee joined your course: Web Development',
          createdAt: new Date(Date.now() - 10 * 60 * 1000),
          isRead: false, // ✅ Use isRead instead of seen
        },
        {
          _id: 5,
          type: 'liked forum',
          message: 'Mike Johnson liked your post in Machine Learning forum',
          createdAt: new Date(Date.now() - 60 * 60 * 1000),
          isRead: true, // ✅ Use isRead instead of seen
        },
        {
          _id: 6,
          type: 'admin announcement',
          message: 'New course materials available for Database Systems',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isRead: true, // ✅ Use isRead instead of seen
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Mark notification as read - Updated to use isRead
  const markAsSeen = useCallback(
    async (notificationId) => {
      if (!currentUser) return;

      try {
        console.log('🔄 Marking notification as read:', notificationId);

        const response = await fetch(`http://localhost:3001/api/notifications/seen/${notificationId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setNotifications((prev) =>
            prev.map(
              (n) => (n._id === notificationId ? { ...n, isRead: true } : n) // ✅ Use isRead
            )
          );

          // 🆕 Trigger navbar badge update
          window.dispatchEvent(new CustomEvent('notificationsUpdated'));
          console.log('✅ Notification marked as read and event dispatched');
        }
      } catch (err) {
        console.error('Error marking notification as read:', err);
      }
    },
    [currentUser]
  );

  // Mark all as read - Updated to use isRead
  const markAllAsSeen = useCallback(async () => {
    if (!currentUser) return;

    console.log('🔄 Starting markAllAsRead for user:', currentUser.id);

    try {
      const response = await fetch(`http://localhost:3001/api/notifications/seen-all/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 API Response for markAllAsRead:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('✅ API Success Response:', responseData);

        setNotifications((prev) => {
          const updated = prev.map((n) => ({ ...n, isRead: true })); // ✅ Use isRead
          console.log(
            '🔄 Updated notifications state:',
            updated.map((n) => ({ id: n._id, isRead: n.isRead }))
          );
          return updated;
        });

        // 🆕 Trigger navbar badge update
        window.dispatchEvent(new CustomEvent('notificationsUpdated'));
        console.log('✅ All notifications marked as read and event dispatched');
      } else {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
      }
    } catch (err) {
      console.error('❌ Error in markAllAsRead:', err);
    }
  }, [currentUser]);

  // Enhanced to handle course peer notifications
  const handleNotificationClick = useCallback(
    (notification) => {
      // Handle chat notifications
      if (notification.type === 'message' && notification.metadata?.chatId) {
        // Store chat info for auto-selection
        sessionStorage.setItem('selectedChatId', notification.metadata.chatId);
        if (notification.metadata.chatType) {
          sessionStorage.setItem('selectedChatType', notification.metadata.chatType);
        }
        if (notification.metadata.chatName) {
          sessionStorage.setItem('selectedChatName', notification.metadata.chatName);
        }

        // Navigate to chat page
        window.location.href = '/chat';

        // Mark as read
        markAsSeen(notification._id);
      }
      // Handle course peer notifications
      else if (notification.type === 'course_peer') {
        console.log('Course peer notification clicked:', notification);

        // Mark as read
        if (!notification.isRead) {
          // ✅ Use isRead
          markAsSeen(notification._id);
        }
      }
      // Handle other notification types
      else {
        if (!notification.isRead) {
          // ✅ Use isRead
          markAsSeen(notification._id);
        }
      }
    },
    [markAsSeen]
  );

  // Enhanced Socket.IO setup to handle new-notification event
  useEffect(() => {
    if (!currentUser) return;

    const socketInstance = io('http://localhost:3001', {
      auth: {
        token: currentUser.token,
        userId: currentUser.id,
      },
    });

    socketInstance.on('connect', () => {
      console.log('✅ Connected to notification socket');
      // Join user-specific room for notifications
      socketInstance.emit('user-join', {
        userId: currentUser.id,
        userName: currentUser.firstName || 'User',
        token: currentUser.token,
      });
    });

    // Listen for the new-notification event from our backend
    socketInstance.on('new-notification', (data) => {
      console.log('🔔 New notification received via socket:', data);

      // Check if notification is for this user
      if (data.userId === currentUser.id) {
        setNotifications((prev) => [data.notification, ...prev]);

        // Show browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(data.notification.title || 'New Notification', {
            body: data.notification.message,
            icon: '/favicon.ico',
          });
        }

        // 🆕 Trigger navbar badge update
        window.dispatchEvent(new CustomEvent('notificationsUpdated'));
      }
    });

    // Keep the old event for backward compatibility
    socketInstance.on('new_notification', (notification) => {
      console.log('🔔 Legacy notification received:', notification);
      setNotifications((prev) => [notification, ...prev]);

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('New Notification', {
          body: notification.message,
          icon: '/favicon.ico',
        });
      }

      // 🆕 Trigger navbar badge update
      window.dispatchEvent(new CustomEvent('notificationsUpdated'));
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [currentUser]);

  // Load notifications on component mount
  useEffect(() => {
    if (currentUser) {
      console.log('🚀 Component mounted, loading notifications...');
      loadNotifications();
    }
  }, [currentUser, loadNotifications]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        console.log('🔔 Browser notification permission:', permission);
      });
    }
  }, []);

  // Filter notifications and calculate unread count
  const filteredNotifications = notifications.filter(
    (notification) => filter === 'all' || notification.type === filter
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length; // ✅ Use isRead

  return (
    <>
      <style>
        {`
        body {
          font-family: 'Segoe UI', sans-serif;
          background-color: #F5F7FA;
          margin: 0;
        }

        .notification-page {
          max-width: 900px;
          margin: 40px auto;
          padding: 20px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.05);
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f0f0f0;
        }

        .notification-page h2 {
          margin: 0;
          color: #3A86FF;
          font-size: 1.8rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .unread-badge {
          background: #ff4444;
          color: white;
          border-radius: 12px;
          padding: 4px 8px;
          font-size: 12px;
          font-weight: bold;
        }

        .notification-controls {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .filter-dropdown {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          background: white;
          cursor: pointer;
        }

        .mark-all-btn {
          padding: 8px 16px;
          background: #3A86FF;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }

        .mark-all-btn:hover {
          background: #2a75e6;
        }

        .mark-all-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .notification {
            position: relative;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 16px;
          border-bottom: 1px solid #eee;
          cursor: pointer;
          transition: background 0.2s;
          border-left: 4px solid transparent;
          right: -30px;
        }

        .notification:hover {
          background-color: #f8f9fa;
        }

        .notification.unread {
          background-color: #f0f8ff;
          border-left-color: #3A86FF;
        }

        .notification.chat-notification {
          border-left-color: #28a745;
        }

        .notification.chat-notification.unread {
          background-color: #f0fff4;
        }

        .notification.course-peer-notification {
          border-left-color: #ffc107;
        }

        .notification.course-peer-notification.unread {
          background-color: #fffbf0;
        }

        .notification-content {
          flex: 1;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .notification-emoji {
          font-size: 20px;
          flex-shrink: 0;
        }

        .notification-text {
          font-size: 15px;
          color: #222;
          line-height: 1.4;
        }

        .notification-text.unread {
          font-weight: 600;
        }

        .chat-notification-meta, .course-notification-meta {
          color: #666;
          font-size: 12px;
          display: block;
          margin-top: 4px;
        }

        .course-notification-meta {
          background: #f8f9fa;
          padding: 4px 8px;
          border-radius: 4px;
          margin-top: 8px;
        }

        .notification-time {
          font-size: 13px;
          color: #777;
          flex-shrink: 0;
          margin-left: 12px;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }

        .empty-state-emoji {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .loading-state {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .notification-page {
  display: flex;
  flex-direction: column;
  height: 70vh;          
  max-height: 70vh;     
}

/* The scrolling area under the header */
.notification-body {
  flex: 1;
  min-height: 0;         
  display: flex;
  flex-direction: column;
}

/* Only the list scrolls; empty/loading stay centered without huge page growth */
.notification-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;   
  overscroll-behavior: contain;
}

/* Optional: keep empty/loading nicely centered within the body height */
.empty-state, .loading-state {
  margin-top: auto;
  margin-bottom: auto;
}

        .error-state {
          text-align: center;
          padding: 40px;
          color: #d32f2f;
          background: #ffebee;
          border-radius: 8px;
          margin: 20px 0;
        }
          
      `}
      </style>

      <motion.div
        className='notification-page'
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className='notification-header'>
          <h2>
            🔔 Notifications
            {unreadCount > 0 && <span className='unread-badge'>{unreadCount}</span>}
          </h2>

          <div className='notification-controls'>
            <select className='filter-dropdown' value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value='all'>All Types</option>
              <option value='message'>Messages</option>
              <option value='course_peer'>Course Mates</option>
              <option value='admin announcement'>Announcements</option>
              <option value='liked forum'>Forum Likes</option>
              <option value='request'>Requests</option>
              <option value='added to group'>Group Invites</option>
            </select>

            <button className='mark-all-btn' onClick={markAllAsSeen} disabled={unreadCount === 0}>
              Mark All Read
            </button>
          </div>
        </div>

        {error && (
          <div className='error-state'>
            <strong>Error loading notifications:</strong> {error}
            <br />
            <small>Showing mock data instead. Check console for details.</small>
          </div>
        )}

        <div className='notification-body'>
          {loading ? (
            <motion.div
              className='loading-state'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div style={{ fontSize: '24px', marginBottom: '16px' }}>⏳</div>
              Loading notifications...
            </motion.div>
          ) : filteredNotifications.length === 0 ? (
            <motion.div
              className='empty-state'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className='empty-state-emoji'>📭</div>
              <h3>No notifications yet</h3>
              <p>You'll see notifications here when you receive messages, course updates, and more.</p>
            </motion.div>
          ) : (
            <div className='notification-list'>
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification._id}
                  className={`notification ${!notification.isRead ? 'unread' : ''} ${
                    notification.type === 'message' ? 'chat-notification' : ''
                  } ${notification.type === 'course_peer' ? 'course-peer-notification' : ''}`}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className='notification-content'>
                    <div className='notification-emoji'>{getNotificationEmoji(notification.type)}</div>
                    <div className={`notification-text ${!notification.isRead ? 'unread' : ''}`}>
                      {notification.message}

                      {notification.type === 'message' && notification.metadata?.chatType === 'group' && (
                        <span className='chat-notification-meta'>Group: {notification.metadata.chatName}</span>
                      )}
                      {notification.type === 'message' && notification.metadata?.chatType === 'direct' && (
                        <span className='chat-notification-meta'>Direct message</span>
                      )}

                      {notification.type === 'course_peer' && notification.metadata && (
                        <div className='course-notification-meta'>
                          📚 {notification.metadata.course} • {notification.metadata.semester}{' '}
                          {notification.metadata.year}
                          {notification.metadata.instructor && <span> • {notification.metadata.instructor}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='notification-time'>{formatTime(notification.createdAt)}</div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Notification;
