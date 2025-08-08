import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import io from 'socket.io-client';

const Notification = ({ role }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, message, new user, admin announcement, etc.
  const [socket, setSocket] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Get current user from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userDataString = localStorage.getItem('user');
    
    // Check all possible localStorage keys
    console.log('🔍 Debug ALL localStorage data:', {
      token: token ? 'EXISTS' : 'MISSING',
      userId: userId,
      userData: userDataString ? 'EXISTS' : 'MISSING',
      allLocalStorageKeys: Object.keys(localStorage),
      allLocalStorageData: Object.keys(localStorage).reduce((acc, key) => {
        acc[key] = localStorage.getItem(key);
        return acc;
      }, {})
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

    // Try different possible userId keys
    let finalUserId = userId || 
                     localStorage.getItem('user_id') || 
                     localStorage.getItem('id') ||
                     (userData && userData.id) ||
                     (userData && userData._id);

    let finalToken = token || localStorage.getItem('authToken') || localStorage.getItem('accessToken');

    console.log('🎯 Final auth data:', {
      finalUserId,
      finalToken: finalToken ? 'EXISTS' : 'MISSING'
    });

    if (finalToken && finalUserId) {
      setCurrentUser({
        id: finalUserId,
        token: finalToken,
        ...userData
      });
    } else {
      console.error('❌ Missing auth data:', {
        userId: finalUserId,
        token: finalToken ? 'EXISTS' : 'MISSING'
      });
    }
  }, []);

  // Load notifications from API with cache-busting
  const loadNotifications = async () => {
    if (!currentUser) return;

    console.log('🔄 Loading notifications for user:', currentUser.id);

    try {
      setLoading(true);
      
      // Add cache-busting parameters
      const timestamp = Date.now();
      const response = await fetch(`http://localhost:3001/api/notifications/${currentUser.id}?t=${timestamp}&nocache=1`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      console.log('📡 API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📦 Received notifications:', data);
        setNotifications(data);
        setError(null); // Clear any previous errors
      } else {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
    } catch (err) {
      console.error('❌ Error loading notifications:', err);
      setError(err.message);
      // Fallback to mock data if API fails
      setNotifications([
        {
          _id: 1,
          type: "message",
          message: "Emily Watson sent you a message in Data Structures course",
          createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 mins ago
          seen: false,
        },
        {
          _id: 2,
          type: "new user",
          message: "John Carter joined your course: Web Development",
          createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 mins ago
          seen: false,
        },
        {
          _id: 3,
          type: "liked forum",
          message: "Sarah Lee liked your post in Machine Learning forum",
          createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
          seen: true,
        },
        {
          _id: 4,
          type: "admin announcement",
          message: "New course materials available for Database Systems",
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          seen: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as seen
  const markAsSeen = async (notificationId) => {
    if (!currentUser) return;

    try {
      const response = await fetch(`http://localhost:3001/api/notifications/seen/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => 
            n._id === notificationId ? { ...n, seen: true } : n
          )
        );
      }
    } catch (err) {
      console.error('Error marking notification as seen:', err);
    }
  };

  // Mark all as seen
  const markAllAsSeen = async () => {
    if (!currentUser) return;

    try {
      const response = await fetch(`http://localhost:3001/api/notifications/seen-all/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, seen: true })));
      }
    } catch (err) {
      console.error('Error marking all notifications as seen:', err);
    }
  };

  // Create a test notification (for debugging)
  const createTestNotification = async () => {
    if (!currentUser) return;

    try {
      const response = await fetch('http://localhost:3001/api/notifications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: currentUser.id,
          type: 'message',
          message: `Test notification created at ${new Date().toLocaleTimeString()}`
        })
      });

      if (response.ok) {
        const newNotification = await response.json();
        console.log('✅ Test notification created:', newNotification);
        // Reload notifications to see the new one
        loadNotifications();
      } else {
        console.error('❌ Failed to create test notification');
      }
    } catch (err) {
      console.error('❌ Error creating test notification:', err);
    }
  };

  // Setup Socket.IO for real-time notifications
  useEffect(() => {
    if (!currentUser) return;

    const socketInstance = io('http://localhost:3001', {
      auth: {
        token: currentUser.token,
        userId: currentUser.id
      }
    });

    socketInstance.on('connect', () => {
      console.log('Connected to notification socket');
    });

    // Listen for new notifications
    socketInstance.on('new_notification', (notification) => {
      console.log('New notification received:', notification);
      setNotifications(prev => [notification, ...prev]);
      
      // Show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('New Notification', {
          body: notification.message,
          icon: '/favicon.ico'
        });
      }
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
  }, [currentUser]);

  // Format time helper
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

  // Get emoji for notification type
  const getNotificationEmoji = (type) => {
    switch (type) {
      case 'message': return '💬';
      case 'new user': return '🎉';
      case 'admin announcement': return '📢';
      case 'liked forum': return '👍';
      case 'request': return '📝';
      case 'added to group': return '👥';
      default: return '🔔';
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => 
    filter === 'all' || notification.type === filter
  );

  const unreadCount = notifications.filter(n => !n.seen).length;

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

        .test-btn {
          padding: 8px 16px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }

        .test-btn:hover {
          background: #218838;
        }

        .notification {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 16px;
          border-bottom: 1px solid #eee;
          cursor: pointer;
          transition: background 0.2s;
          border-left: 4px solid transparent;
        }

        .notification:hover {
          background-color: #f8f9fa;
        }

        .notification.unread {
          background-color: #f0f8ff;
          border-left-color: #3A86FF;
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

        .error-state {
          text-align: center;
          padding: 40px;
          color: #d32f2f;
          background: #ffebee;
          border-radius: 8px;
          margin: 20px 0;
        }

        .debug-info {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 16px;
          margin: 20px 0;
          font-family: monospace;
          font-size: 12px;
        }

        .footer {
          text-align: center;
          padding: 20px;
          background-color: #ECECEC;
          color: #777;
          font-size: 13px;
          margin-top: 40px;
          border-radius: 0 0 12px 12px;
        }
      `}
      </style>

      <motion.div
        className="notification-page"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="notification-header">
          <h2>
            🔔 Notifications
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
          </h2>
          
          <div className="notification-controls">
            <select 
              className="filter-dropdown"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="message">Messages</option>
              <option value="new user">New Users</option>
              <option value="admin announcement">Announcements</option>
              <option value="liked forum">Forum Likes</option>
              <option value="request">Requests</option>
              <option value="added to group">Group Invites</option>
            </select>
            
            <button 
              className="test-btn"
              onClick={createTestNotification}
              disabled={!currentUser}
            >
              Create Test
            </button>
            
            <button 
              className="mark-all-btn"
              onClick={markAllAsSeen}
              disabled={unreadCount === 0}
            >
              Mark All Read
            </button>
          </div>
        </div>

        {/* Debug Information */}
        {process.env.NODE_ENV === 'development' && (
          <div className="debug-info">
            <strong>Debug Info:</strong><br/>
            User ID: {currentUser?.id || 'Not set'}<br/>
            Token: {currentUser?.token ? 'Present' : 'Missing'}<br/>
            Notifications Count: {notifications.length}<br/>
            Loading: {loading ? 'Yes' : 'No'}<br/>
            Error: {error || 'None'}<br/>
          </div>
        )}

        {error && (
          <div className="error-state">
            <strong>Error loading notifications:</strong> {error}
            <br />
            <small>Showing mock data instead. Check console for details.</small>
          </div>
        )}

        {loading ? (
          <motion.div
            className="loading-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div style={{ fontSize: '24px', marginBottom: '16px' }}>⏳</div>
            Loading notifications...
          </motion.div>
        ) : filteredNotifications.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="empty-state-emoji">📭</div>
            <h3>No notifications yet</h3>
            <p>You'll see notifications here when you receive messages, course updates, and more.</p>
            <p><small>Try clicking "Create Test" to add a test notification.</small></p>
          </motion.div>
        ) : (
          filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification._id}
              className={`notification ${!notification.seen ? 'unread' : ''}`}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => !notification.seen && markAsSeen(notification._id)}
            >
              <div className="notification-content">
                <div className="notification-emoji">
                  {getNotificationEmoji(notification.type)}
                </div>
                <div className={`notification-text ${!notification.seen ? 'unread' : ''}`}>
                  {notification.message}
                </div>
              </div>
              <div className="notification-time">
                {formatTime(notification.createdAt)}
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </>
  );
};

export default Notification;