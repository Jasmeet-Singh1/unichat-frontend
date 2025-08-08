// Chat Utility Functions

// Emoji categories
export const emojiCategories = {
  smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳'],
  people: ['👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👵', '🧓', '👴', '👲', '👳‍♀️', '👳‍♂️', '🧕', '👮‍♀️', '👮‍♂️', '👷‍♀️', '👷‍♂️', '💂‍♀️', '💂‍♂️', '🕵️‍♀️', '🕵️‍♂️', '👩‍⚕️', '👨‍⚕️', '👩‍🌾', '👨‍🌾'],
  nature: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇'],
  food: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐'],
  activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️'],
  objects: ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️']
};

// Popular emojis for quick access
export const popularEmojis = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '🔥', '💯', '👏', '🙏', '💪', '🚀', '✨', '💖', '😍'];

// Time formatting functions
export const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatLastMessageTime = (timestamp) => {
  const now = new Date();
  const diff = now - new Date(timestamp);
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
  return `${Math.floor(minutes / 1440)}d`;
};

// Notification functions
export const requestNotificationPermission = () => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      console.log('Notification permission:', permission);
    });
  }
};

export const showNotification = (title, body, icon = '💬') => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body: body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'chat-message',
      requireInteraction: false,
      silent: false
    });

    // Auto close after 5 seconds
    setTimeout(() => notification.close(), 5000);

    // Click to focus window
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
};

export const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.log('Could not play notification sound:', error);
  }
};

// Chat filtering and sorting
export const filterConversations = (conversations, activeTab, searchQuery) => {
  let filtered = [...conversations];
  
  // Filter by tab
  if (activeTab === 'direct') {
    filtered = filtered.filter(conv => conv.type === 'direct');
  } else if (activeTab === 'groups') {
    filtered = filtered.filter(conv => conv.type === 'group');
  }
  
  // Apply search filter
  if (searchQuery.trim()) {
    filtered = filtered.filter(conv => 
      conv.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  return filtered;
};

// Create temporary chat object for new conversations
export const createTempChat = (currentUser, targetUser, chatId) => {
  return {
    id: chatId,
    name: targetUser.name,
    type: 'direct',
    members: [
      { 
        id: currentUser.id,
        name: currentUser.name,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email
      },
      targetUser
    ],
    avatar: null,
    lastMessage: null,
    updatedAt: new Date(),
    unreadCount: 0,
    pinned: false,
    muted: false,
    archived: false
  };
};

// Format group data from API response
export const formatGroupData = (group) => {
  return {
    id: group._id,
    name: group.name,
    type: 'group',
    description: group.description,
    avatar: null,
    members: group.members,
    createdBy: group.createdBy,
    isPrivate: group.isPrivate,
    lastMessage: null,
    updatedAt: group.createdAt,
    unreadCount: 0,
    pinned: false,
    muted: false,
    archived: false
  };
};

// Get total unread count across all chats
export const getTotalUnreadCount = (chats) => {
  if (!Array.isArray(chats)) return 0;
  return chats.reduce((total, chat) => {
    return total + (chat.unreadCount || 0);
  }, 0);
};

// Update browser tab title with unread count
export const updateTabTitle = (unreadCount) => {
  const baseTitle = 'UniChat';
  if (unreadCount > 0) {
    document.title = `(${unreadCount}) ${baseTitle}`;
  } else {
    document.title = baseTitle;
  }
};

// Update favicon to show notification dot
export const updateFavicon = (hasUnread) => {
  const favicon = document.querySelector('link[rel="icon"]');
  if (favicon) {
    if (hasUnread) {
      // You can replace this with a favicon with a red dot
      favicon.href = '/favicon-unread.ico';
    } else {
      favicon.href = '/favicon.ico';
    }
  }
};

// Handle new message notifications
export const handleNewMessageNotification = (message, currentChatId, isAppVisible = true) => {
  // Only show notification if not currently viewing this chat
  if (message.chatId !== currentChatId || !isAppVisible) {
    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`New message from ${message.senderName}`, {
        body: message.content,
        icon: '/favicon.ico'
      });
    }
    
    // Play notification sound
    const audio = new Audio('/notification.mp3');
    audio.play().catch(e => console.log('Could not play notification sound:', e));
  }
};

// Check if app is currently visible/focused
export const isAppVisible = () => {
  return !document.hidden && document.hasFocus();
};