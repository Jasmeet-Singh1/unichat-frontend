import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Smile, Phone, Video, Search, MoreVertical, Users, MessageCircle, Plus, Settings, Mic, CheckCheck, Star } from 'lucide-react';
import io from 'socket.io-client';

console.log('🚀 LOADING WORKING CHAT COMPONENT FROM /components/Chat.jsx');

// Enhanced Chat Interface connected to real backend
const Chat = ({ 
  currentUser, 
  apiBaseUrl = 'http://localhost:3001',
  socketUrl = 'http://localhost:3001',
  onError,
  onConnectionChange 
}) => {
  console.log('🎯 Chat component rendering with currentUser:', currentUser);

  // ALL HOOKS MUST BE AT THE TOP
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  // Emoji categories
  const emojiCategories = {
    smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳'],
    people: ['👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👵', '🧓', '👴', '👲', '👳‍♀️', '👳‍♂️', '🧕', '👮‍♀️', '👮‍♂️', '👷‍♀️', '👷‍♂️', '💂‍♀️', '💂‍♂️', '🕵️‍♀️', '🕵️‍♂️', '👩‍⚕️', '👨‍⚕️', '👩‍🌾', '👨‍🌾'],
    nature: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇'],
    food: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐'],
    activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️'],
    objects: ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️']
  };

  // Popular emojis for quick access
  const popularEmojis = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '🔥', '💯', '👏', '🙏', '💪', '🚀', '✨', '💖', '😍'];

  // Request notification permission on component mount
  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  }, []);

  // Function to show notification
  const showNotification = (title, body, icon = '💬') => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body: body,
        icon: '/favicon.ico', // You can use your app icon here
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

  // Play notification sound
  const playNotificationSound = () => {
    // Create a simple notification sound using Web Audio API
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
  const loadConversations = React.useCallback(async () => {
    if (!currentUser) return;
    
    console.log('📞 Loading conversations for user:', currentUser.id);
    console.log('📞 Using token:', currentUser.token ? 'EXISTS' : 'MISSING');
    console.log('📞 API URL:', `${apiBaseUrl}/api/chat/conversations`);
    
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/api/chat/conversations`, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📞 Conversations response status:', response.status);
      console.log('📞 Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const conversations = await response.json();
        console.log('📞 Loaded conversations:', conversations);
        setChats(conversations);
      } else {
        const errorText = await response.text();
        console.error('📞 API Error Response:', errorText);
        throw new Error(`Failed to load conversations: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Error loading conversations:', error);
      // Set empty array so UI shows "no conversations" instead of loading forever
      setChats([]);
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl, currentUser, onError]);

  // Load messages for selected chat
  const loadMessages = React.useCallback(async (chatId) => {
    if (!currentUser) return;
    
    console.log('📨 Loading messages for chat:', chatId);
    
    try {
      const response = await fetch(`${apiBaseUrl}/api/chat/messages/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📨 Messages response status:', response.status);

      if (response.ok) {
        const chatMessages = await response.json();
        console.log('📨 Loaded messages:', chatMessages.length);
        setMessages(chatMessages);
      } else {
        throw new Error(`Failed to load messages: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error loading messages:', error);
      if (onError) onError(error);
    }
  }, [apiBaseUrl, currentUser, onError]);

  // Load conversations on mount
  useEffect(() => {
    if (currentUser) {
      loadConversations();
    }
  }, [currentUser, loadConversations]);

  // Auto-select chat when coming from browse page
  useEffect(() => {
    if (!currentUser) return;
    
    const selectedChatId = sessionStorage.getItem('selectedChatId');
    const newChatTarget = sessionStorage.getItem('newChatTarget');
    
    if (selectedChatId && chats.length > 0) {
      const chatToSelect = chats.find(chat => chat.id === selectedChatId);
      if (chatToSelect) {
        console.log('🎯 Auto-selecting chat from sessionStorage:', chatToSelect);
        setSelectedChat(chatToSelect);
        sessionStorage.removeItem('selectedChatId');
        sessionStorage.removeItem('newChatTarget');
      } else if (newChatTarget) {
        // Create a temporary chat object for the new conversation
        try {
          const targetUser = JSON.parse(newChatTarget);
          const tempChat = {
            id: selectedChatId,
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
          console.log('🎯 Creating temporary chat for new conversation:', tempChat);
          setSelectedChat(tempChat);
          sessionStorage.removeItem('selectedChatId');
          sessionStorage.removeItem('newChatTarget');
        } catch (e) {
          console.error('❌ Error parsing new chat target:', e);
        }
      }
    }
  }, [chats, currentUser]);

  // Load messages when chat is selected
  useEffect(() => {
    if (selectedChat && currentUser) {
      loadMessages(selectedChat.id);
    }
  }, [selectedChat, currentUser, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Early return AFTER all hooks
  if (!currentUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No User Found</h3>
          <p className="text-gray-500">Please log in to access the chat</p>
        </div>
      </div>
    );
  }

  const sendMessage = async () => {
    console.log('📤 Send message called:', {
      messageLength: message.length,
      hasSelectedChat: !!selectedChat,
      selectedChatId: selectedChat?.id,
      currentUserId: currentUser?.id
    });

    if (!message.trim() || !selectedChat) {
      console.warn('⚠️ Cannot send message: missing text or chat');
      return;
    }

    const newMessage = {
      chatId: selectedChat.id,
      text: message.trim(),
      type: 'text'
    };

    try {
      console.log('📤 Sending message to API:', newMessage);
      
      // Send to backend
      const response = await fetch(`${apiBaseUrl}/api/chat/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMessage)
      });

      console.log('📤 API response status:', response.status);

      if (response.ok) {
        const savedMessage = await response.json();
        console.log('✅ Message saved successfully:', savedMessage);
        
        // Add to local state immediately
        setMessages(prev => [...prev, savedMessage]);
        setMessage('');
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to send message:', errorText);
        throw new Error(`Failed to send message: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error sending message:', error);
      alert(`Failed to send message: ${error.message}`);
      if (onError) onError(error);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatLastMessageTime = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
    return `${Math.floor(minutes / 1440)}d`;
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        height: '100vh', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        fontSize: '18px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center', color: '#333' }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>Loading chats...</div>
          <div>Please wait...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Sidebar */}
      <div style={{ 
        width: '400px', 
        backgroundColor: '#ffffff', 
        borderRight: '1px solid #ddd',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ 
          padding: '20px', 
          borderBottom: '1px solid #eee',
          backgroundColor: '#fff'
        }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#333',
            margin: '0 0 20px 0'
          }}>
            UniChat ✨
          </h1>
          
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              backgroundColor: '#f9f9f9'
            }}
          />
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #eee',
          backgroundColor: '#f9f9f9'
        }}>
          {[
            { id: 'all', label: 'All' },
            { id: 'direct', label: 'Direct' },
            { id: 'groups', label: 'Groups' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '16px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? '#fff' : 'transparent',
                color: activeTab === tab.id ? '#0066cc' : '#666',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                cursor: 'pointer',
                borderBottom: activeTab === tab.id ? '2px solid #0066cc' : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Chat List */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto',
          backgroundColor: '#fff'
        }}>
          {chats.length === 0 ? (
            <div style={{ 
              padding: '40px 20px', 
              textAlign: 'center', 
              color: '#666'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                No conversations yet
              </div>
              <div style={{ fontSize: '14px' }}>
                Start a new chat to begin messaging
              </div>
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => {
                  console.log('🎯 Selecting chat:', chat);
                  setSelectedChat(chat);
                }}
                style={{
                  padding: '20px',
                  borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer',
                  backgroundColor: selectedChat?.id === chat.id ? '#e3f2fd' : '#fff'
                }}
                onMouseEnter={(e) => {
                  if (selectedChat?.id !== chat.id) {
                    e.target.style.backgroundColor = '#f5f5f5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedChat?.id !== chat.id) {
                    e.target.style.backgroundColor = '#fff';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Avatar */}
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    backgroundColor: '#0066cc', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 'bold'
                  }}>
                    {chat.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Chat Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ 
                        fontSize: '16px', 
                        fontWeight: 'bold', 
                        color: '#333',
                        margin: 0
                      }}>
                        {chat.name}
                      </h4>
                      <span style={{ fontSize: '12px', color: '#999' }}>
                        {chat.lastMessage ? formatLastMessageTime(chat.lastMessage.timestamp) : ''}
                      </span>
                    </div>
                    
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#666', 
                      margin: '4px 0 0 0',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {chat.lastMessage ? chat.lastMessage.text : 'No messages yet'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: '#fff'
      }}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div style={{ 
              backgroundColor: '#fff', 
              borderBottom: '1px solid #ddd', 
              padding: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    backgroundColor: '#0066cc', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}>
                    {selectedChat.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ 
                      fontSize: '20px', 
                      fontWeight: 'bold', 
                      color: '#333',
                      margin: 0
                    }}>
                      {selectedChat.name}
                    </h3>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#666',
                      margin: '4px 0 0 0'
                    }}>
                      Online
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => console.log('📞 Voice call clicked')}
                    style={{
                      padding: '12px',
                      border: 'none',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      color: '#666'
                    }}
                  >
                    📞
                  </button>
                  <button 
                    onClick={() => console.log('📹 Video call clicked')}
                    style={{
                      padding: '12px',
                      border: 'none',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      color: '#666'
                    }}
                  >
                    📹
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ 
              flex: 1, 
              overflowY: 'auto', 
              padding: '20px',
              backgroundColor: '#f9f9f9'
            }}>
              {messages.length === 0 ? (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '100%'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>💭</div>
                    <h3 style={{ fontSize: '20px', color: '#333', margin: '0 0 8px 0' }}>
                      No messages yet
                    </h3>
                    <p style={{ color: '#666', margin: 0 }}>
                      Start the conversation by sending a message
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isOwn = msg.senderId === currentUser.id;
                  
                  return (
                    <div
                      key={msg.id || index}
                      style={{
                        display: 'flex',
                        justifyContent: isOwn ? 'flex-end' : 'flex-start',
                        marginBottom: '16px'
                      }}
                    >
                      <div style={{
                        maxWidth: '70%',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        backgroundColor: isOwn ? '#0066cc' : '#fff',
                        color: isOwn ? '#fff' : '#333',
                        border: isOwn ? 'none' : '1px solid #ddd'
                      }}>
                        <p style={{ margin: 0, fontSize: '16px', lineHeight: '1.4' }}>
                          {msg.text}
                        </p>
                        <div style={{ 
                          marginTop: '4px', 
                          fontSize: '12px', 
                          color: isOwn ? 'rgba(255,255,255,0.7)' : '#999'
                        }}>
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div style={{ 
              backgroundColor: '#fff', 
              borderTop: '1px solid #ddd', 
              padding: '20px'
            }}>
              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div style={{
                  position: 'absolute',
                  bottom: '100px',
                  right: '20px',
                  width: '400px',
                  height: '300px',
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  overflow: 'hidden'
                }}>
                  {/* Emoji Picker Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderBottom: '1px solid #eee',
                    backgroundColor: '#f9f9f9'
                  }}>
                    <h4 style={{ margin: 0, fontSize: '16px', color: '#333' }}>Choose Emoji</h4>
                    <button
                      onClick={() => setShowEmojiPicker(false)}
                      style={{
                        border: 'none',
                        backgroundColor: 'transparent',
                        fontSize: '18px',
                        cursor: 'pointer',
                        color: '#666'
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Popular Emojis */}
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px', fontWeight: 'bold' }}>
                      Popular
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {popularEmojis.map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => {
                            setMessage(prev => prev + emoji);
                            setShowEmojiPicker(false);
                          }}
                          style={{
                            border: 'none',
                            backgroundColor: 'transparent',
                            fontSize: '20px',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* All Emojis */}
                  <div style={{ 
                    height: '180px', 
                    overflowY: 'auto', 
                    padding: '12px 16px'
                  }}>
                    {Object.entries(emojiCategories).map(([category, emojis]) => (
                      <div key={category} style={{ marginBottom: '16px' }}>
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#666', 
                          marginBottom: '8px', 
                          fontWeight: 'bold',
                          textTransform: 'capitalize'
                        }}>
                          {category}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
                          {emojis.map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => {
                                setMessage(prev => prev + emoji);
                                setShowEmojiPicker(false);
                              }}
                              style={{
                                border: 'none',
                                backgroundColor: 'transparent',
                                fontSize: '18px',
                                cursor: 'pointer',
                                padding: '4px',
                                borderRadius: '4px'
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {/* Emoji Button */}
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  style={{
                    padding: '12px',
                    border: 'none',
                    backgroundColor: showEmojiPicker ? '#e3f2fd' : '#f0f0f0',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#666'
                  }}
                  title="Add emoji"
                >
                  😀
                </button>

                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => {
                      console.log('📝 Message input changed:', e.target.value);
                      setMessage(e.target.value);
                    }}
                    onKeyPress={(e) => {
                      console.log('⌨️ Key pressed:', e.key);
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Type a message..."
                    style={{
                      width: '100%',
                      padding: '16px',
                      border: '1px solid #ddd',
                      borderRadius: '24px',
                      fontSize: '16px',
                      backgroundColor: '#f9f9f9',
                      outline: 'none'
                    }}
                  />
                </div>

                <button
                  onClick={() => {
                    console.log('📤 Send button clicked');
                    sendMessage();
                  }}
                  disabled={!message.trim()}
                  style={{
                    padding: '16px',
                    backgroundColor: message.trim() ? '#0066cc' : '#ccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    cursor: message.trim() ? 'pointer' : 'not-allowed',
                    fontSize: '16px'
                  }}
                >
                  ➤
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Welcome Screen */
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#f9f9f9'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '80px', marginBottom: '24px' }}>💬</div>
              <h3 style={{ 
                fontSize: '28px', 
                color: '#333', 
                margin: '0 0 16px 0',
                fontWeight: 'bold'
              }}>
                Welcome to UniChat ✨
              </h3>
              <p style={{ fontSize: '18px', color: '#666', margin: 0 }}>
                Select a conversation to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;