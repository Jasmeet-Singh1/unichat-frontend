import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Smile, Phone, Video, Search, MoreVertical, Users, MessageCircle, Plus, Settings, Mic, CheckCheck, Star } from 'lucide-react';
import io from 'socket.io-client';

// Enhanced Chat Interface connected to real backend
const Chat = ({ 
  currentUser, 
  apiBaseUrl = 'http://localhost:3001',
  socketUrl = 'http://localhost:3001',
  onError,
  onConnectionChange 
}) => {
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
  //const [isTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);

  // Load conversations from backend
  const loadConversations = React.useCallback(async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/api/chat/conversations`, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const conversations = await response.json();
        setChats(conversations);
      } else {
        throw new Error('Failed to load conversations');
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl, currentUser, onError]);

  // Load messages for selected chat
  const loadMessages = React.useCallback(async (chatId) => {
    if (!currentUser) return;
    
    try {
      const response = await fetch(`${apiBaseUrl}/api/chat/messages/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const chatMessages = await response.json();
        setMessages(chatMessages);
      } else {
        throw new Error('Failed to load messages');
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      if (onError) onError(error);
    }
  }, [apiBaseUrl, currentUser, onError]);

  // Initialize socket connection
  useEffect(() => {
    if (!currentUser) return;

    const newSocket = io(socketUrl, {
      auth: {
        userId: currentUser.id,
        userName: currentUser.name,
        token: currentUser.token
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
      setIsConnected(true);
      if (onConnectionChange) onConnectionChange(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from chat server');
      setIsConnected(false);
      if (onConnectionChange) onConnectionChange(false);
    });

    newSocket.on('online-users', (users) => {
      setOnlineUsers(users);
    });

    newSocket.on('new-message', (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
      // Update last message in chat list
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === newMessage.chatId ? {
            ...chat,
            lastMessage: {
              text: newMessage.text,
              timestamp: newMessage.timestamp,
              senderId: newMessage.senderId,
              senderName: newMessage.senderName
            }
          } : chat
        )
      );
    });

    newSocket.on('user-typing', (data) => {
      if (data.userId !== currentUser.id) {
        setTypingUsers(prev => [...prev.filter(id => id !== data.userId), data.userId]);
        setTimeout(() => {
          setTypingUsers(prev => prev.filter(id => id !== data.userId));
        }, 3000);
      }
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
      if (onError) onError(error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [currentUser, socketUrl, onConnectionChange, onError]);

  // Load conversations on mount
  useEffect(() => {
    if (currentUser) {
      loadConversations();
    }
  }, [currentUser, loadConversations]);

  // Load messages when chat is selected
  useEffect(() => {
    if (selectedChat && currentUser) {
      loadMessages(selectedChat.id);
      // Join room
      if (socket) {
        socket.emit('join-room', selectedChat.id);
      }
    }
  }, [selectedChat, currentUser, loadMessages, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Debug logs and early return AFTER all hooks
  console.log('Chat currentUser:', currentUser);
  
  // Early return if no user (after all hooks)
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
    if (!message.trim() || !selectedChat) return;

    const newMessage = {
      chatId: selectedChat.id,
      text: message.trim(),
      type: 'text'
    };

    try {
      // Send to backend
      const response = await fetch(`${apiBaseUrl}/api/chat/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMessage)
      });

      if (response.ok) {
        const savedMessage = await response.json();
        
        // Emit to socket for real-time delivery
        if (socket) {
          socket.emit('send-message', {
            ...savedMessage,
            chatId: selectedChat.id
          });
        }

        // Add to local state immediately
        setMessages(prev => [...prev, savedMessage]);
        setMessage('');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      if (onError) onError(error);
    }
  };

  const handleTyping = () => {
    if (socket && selectedChat) {
      socket.emit('typing', {
        userId: currentUser.id,
        userName: currentUser.name,
        chatId: selectedChat.id
      });
    }
  };

  const addReaction = async (messageId, emoji) => {
    // This would be implemented when you add reactions to your backend
    console.log('Add reaction:', messageId, emoji);
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

  const quickEmojis = ['👍', '❤️', '😂', '😮', '😢', '🎉', '🔥', '💯'];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Connection Status */}
      {!isConnected && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-center py-2 z-50">
          Disconnected from chat server. Trying to reconnect...
        </div>
      )}

      {/* Sidebar */}
      <div className="w-96 bg-white/90 backdrop-blur-lg border-r border-white/20 shadow-xl">
        {/* Header */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              UniChat ✨
            </h1>
            <div className="flex space-x-2">
              <button 
                onClick={() => {
                  // Create new chat functionality
                  console.log('Create new chat');
                }}
                className="p-2 hover:bg-blue-100 rounded-full transition-all duration-200 transform hover:scale-110"
              >
                <Plus className="w-5 h-5 text-blue-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 transform hover:scale-110">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          {[
            { id: 'all', label: 'All', icon: MessageCircle },
            { id: 'direct', label: 'Direct', icon: Users },
            { id: 'groups', label: 'Groups', icon: Users }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-4 text-base font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
              >
                <Icon className="w-4 h-4 mx-auto mb-1" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-4">💬</div>
              <p>No conversations yet</p>
              <p className="text-sm mt-2">Start a new chat to begin messaging</p>
            </div>
          ) : (
            chats
              .filter(chat => {
                if (activeTab === 'direct') return chat.type === 'direct';
                if (activeTab === 'groups') return chat.type === 'group';
                return true;
              })
              .filter(chat => {
                if (!searchQuery) return true;
                return chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       chat.lastMessage?.text?.toLowerCase().includes(searchQuery.toLowerCase());
              })
              .map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-5 hover:bg-white/60 cursor-pointer transition-all duration-200 border-b border-gray-50 group ${
                    selectedChat?.id === chat.id ? 'bg-blue-50 border-blue-100' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-semibold transform group-hover:scale-105 transition-transform duration-200">
                        {chat.avatar || chat.name.charAt(0).toUpperCase()}
                      </div>
                      {chat.type === 'direct' && onlineUsers.includes(chat.members?.find(m => m.id !== currentUser.id)?.id) && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                      )}
                      {chat.unreadCount > 0 && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
                          {chat.unreadCount}
                        </div>
                      )}
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-semibold text-gray-900 truncate flex items-center">
                          {chat.name}
                          {chat.pinned && <Star className="w-4 h-4 text-yellow-500 ml-2" />}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {chat.lastMessage ? formatLastMessageTime(chat.lastMessage.timestamp) : ''}
                        </span>
                      </div>
                      
                      <p className="text-base text-gray-600 truncate mt-2">
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
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white/90 backdrop-blur-lg border-b border-white/20 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {selectedChat.avatar || selectedChat.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedChat.name}</h3>
                    <p className="text-base text-gray-500">
                      {selectedChat.type === 'group' 
                        ? `${selectedChat.members?.length || 0} members • ${onlineUsers.filter(id => selectedChat.members?.some(m => m.id === id)).length} online`
                        : onlineUsers.includes(selectedChat.members?.find(m => m.id !== currentUser.id)?.id) ? 'Online' : 'Offline'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 transform hover:scale-110">
                    <Phone className="w-6 h-6" />
                  </button>
                  <button className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 transform hover:scale-110">
                    <Video className="w-6 h-6" />
                  </button>
                  <button className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-all duration-200 transform hover:scale-110">
                    <Search className="w-6 h-6" />
                  </button>
                  <button className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-all duration-200 transform hover:scale-110">
                    <MoreVertical className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-transparent to-blue-50/30">
              {messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">💭</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No messages yet</h3>
                    <p className="text-gray-500">Start the conversation by sending a message</p>
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isOwn = msg.senderId === currentUser.id;
                  const showAvatar = index === 0 || messages[index - 1].senderId !== msg.senderId;
                  
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}
                    >
                      <div className={`flex ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end max-w-md lg:max-w-lg xl:max-w-2xl`}>
                        {!isOwn && showAvatar && (
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-base mr-3 transform transition-transform duration-200 group-hover:scale-110">
                            {msg.senderAvatar || msg.senderName?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        
                        {!isOwn && !showAvatar && <div className="w-13"></div>}

                        <div className="relative">
                          <div
                            className={`px-5 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                              isOwn
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                : 'bg-white text-gray-900 border border-gray-100'
                            }`}
                          >
                            {!isOwn && showAvatar && (
                              <p className="text-sm font-semibold text-gray-600 mb-2">
                                {msg.senderName}
                              </p>
                            )}
                            
                            <p className="text-base whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                            
                            <div className="flex items-center justify-between mt-2">
                              <span className={`text-sm ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                                {formatTime(msg.timestamp)}
                              </span>
                              
                              {isOwn && (
                                <CheckCheck className="w-4 h-4 text-blue-100" />
                              )}
                            </div>
                          </div>

                          {/* Reactions (if implemented) */}
                          {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {Object.entries(msg.reactions).map(([emoji, count]) => (
                                <button
                                  key={emoji}
                                  onClick={() => addReaction(msg.id, emoji)}
                                  className="flex items-center space-x-1 bg-white border border-gray-200 rounded-full px-3 py-2 text-sm hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                                >
                                  <span>{emoji}</span>
                                  <span className="text-gray-600">{count}</span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Quick reactions on hover */}
                          <div className="absolute -top-10 left-0 hidden group-hover:flex space-x-2 bg-white border border-gray-200 rounded-full px-3 py-2 shadow-lg">
                            {quickEmojis.slice(0, 4).map(emoji => (
                              <button
                                key={emoji}
                                onClick={() => addReaction(msg.id, emoji)}
                                className="hover:bg-gray-100 rounded p-2 transition-all duration-200 transform hover:scale-125 text-lg"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Typing indicator */}
              {typingUsers.length > 0 && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">Someone is typing...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white/90 backdrop-blur-lg border-t border-white/20 p-6">
              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200 shadow-lg">
                  <div className="grid grid-cols-8 gap-3">
                    {['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🎉', '😢', '😮', '😡', '🙏', '🔥', '💯', '✨', '🚀'].map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => {
                          setMessage(message + emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="text-2xl hover:bg-gray-100 rounded p-3 transition-all duration-200 transform hover:scale-125"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-4">
                <button className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 transform hover:scale-110">
                  <Paperclip className="w-6 h-6" />
                </button>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      handleTyping();
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                  />
                </div>

                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-3 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition-all duration-200 transform hover:scale-110"
                >
                  <Smile className="w-6 h-6" />
                </button>

                <button className="p-3 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-all duration-200 transform hover:scale-110">
                  <Mic className="w-6 h-6" />
                </button>

                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Welcome Screen */
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="text-center">
              <div className="text-8xl mb-6 animate-bounce">💬</div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Welcome to UniChat ✨
              </h3>
              <p className="text-gray-500 text-lg">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;