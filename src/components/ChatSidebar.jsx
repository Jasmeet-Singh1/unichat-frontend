import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Users, MessageCircle, Archive, Settings } from 'lucide-react';

const ChatSidebar = ({ 
  chats, 
  selectedChat, 
  onChatSelect, 
  onNewChat, 
  currentUser, 
  onlineUsers,
  searchQuery,
  onSearchChange 
}) => {
  const [filteredChats, setFilteredChats] = useState(chats);
  const [activeTab, setActiveTab] = useState('all'); // all, direct, groups, archived
  const [showNewChatMenu, setShowNewChatMenu] = useState(false);

  useEffect(() => {
    let filtered = chats;

    // Filter by tab
    if (activeTab === 'direct') {
      filtered = filtered.filter(chat => chat.type === 'direct');
    } else if (activeTab === 'groups') {
      filtered = filtered.filter(chat => chat.type === 'group');
    } else if (activeTab === 'archived') {
      filtered = filtered.filter(chat => chat.archived);
    } else {
      filtered = filtered.filter(chat => !chat.archived);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(chat => {
        const chatName = getChatName(chat).toLowerCase();
        const lastMessage = chat.lastMessage?.text?.toLowerCase() || '';
        return chatName.includes(searchQuery.toLowerCase()) || 
               lastMessage.includes(searchQuery.toLowerCase());
      });
    }

    // Sort by last message time
    filtered.sort((a, b) => {
      const aTime = new Date(a.lastMessage?.timestamp || a.updatedAt || 0);
      const bTime = new Date(b.lastMessage?.timestamp || b.updatedAt || 0);
      return bTime - aTime;
    });

    setFilteredChats(filtered);
  }, [chats, searchQuery, activeTab]);

  const getChatName = (chat) => {
    if (chat.type === 'direct') {
      const otherUser = chat.members?.find(member => member.id !== currentUser.id);
      return otherUser?.name || 'Unknown User';
    }
    return chat.name || 'Group Chat';
  };

  const getChatAvatar = (chat) => {
    if (chat.type === 'direct') {
      const otherUser = chat.members?.find(member => member.id !== currentUser.id);
      return otherUser?.avatar || '/default-avatar.png';
    }
    return chat.avatar || '/default-group-avatar.png';
  };

  const getLastMessagePreview = (chat) => {
    if (!chat.lastMessage) return 'No messages yet';
    
    const { text, senderId, type } = chat.lastMessage;
    const sender = chat.members?.find(member => member.id === senderId);
    const senderName = sender?.id === currentUser.id ? 'You' : sender?.name?.split(' ')[0];
    
    if (type === 'image') return `${senderName}: 📷 Photo`;
    if (type === 'video') return `${senderName}: 🎥 Video`;
    if (type === 'audio') return `${senderName}: 🎵 Audio`;
    if (type === 'file') return `${senderName}: 📎 File`;
    
    return `${senderName}: ${text}`;
  };

  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;
    
    return date.toLocaleDateString();
  };

  const getUnreadCount = (chat) => {
    return chat.unreadCount || 0;
  };

  const isUserOnline = (chat) => {
    if (chat.type === 'direct') {
      const otherUser = chat.members?.find(member => member.id !== currentUser.id);
      return onlineUsers.includes(otherUser?.id);
    }
    return false;
  };

  const handleNewDirectChat = () => {
    if (onNewChat) {
      onNewChat('direct');
    }
    setShowNewChatMenu(false);
  };

  const handleNewGroupChat = () => {
    if (onNewChat) {
      onNewChat('group');
    }
    setShowNewChatMenu(false);
  };

  const tabs = [
    { id: 'all', label: 'All', icon: MessageCircle },
    { id: 'direct', label: 'Direct', icon: Users },
    { id: 'groups', label: 'Groups', icon: Users },
    { id: 'archived', label: 'Archived', icon: Archive }
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Chats</h2>
          
          {/* New Chat Button */}
          <div className="relative">
            <button
              onClick={() => setShowNewChatMenu(!showNewChatMenu)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>

            {/* New Chat Menu */}
            {showNewChatMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={handleNewDirectChat}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <MessageCircle className="w-4 h-4 mr-3" />
                  New Direct Chat
                </button>
                <button
                  onClick={handleNewGroupChat}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <Users className="w-4 h-4 mr-3" />
                  New Group Chat
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
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
        {filteredChats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchQuery ? 'No chats found' : 'No chats yet'}
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat)}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 ${
                selectedChat?.id === chat.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={getChatAvatar(chat)}
                    alt={getChatName(chat)}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {chat.type === 'direct' && isUserOnline(chat) && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                  {chat.type === 'group' && (
                    <div className="absolute -bottom-1 -right-1 bg-gray-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {chat.members?.length || 0}
                    </div>
                  )}
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {getChatName(chat)}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatLastMessageTime(chat.lastMessage?.timestamp)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 truncate">
                      {getLastMessagePreview(chat)}
                    </p>
                    
                    {/* Unread Badge */}
                    {getUnreadCount(chat) > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {getUnreadCount(chat) > 99 ? '99+' : getUnreadCount(chat)}
                      </span>
                    )}
                  </div>

                  {/* Chat Status Indicators */}
                  <div className="flex items-center mt-1 space-x-2">
                    {chat.muted && (
                      <span className="text-xs text-gray-400">🔇</span>
                    )}
                    {chat.pinned && (
                      <span className="text-xs text-gray-400">📌</span>
                    )}
                    {chat.type === 'group' && (
                      <span className="text-xs text-gray-400">👥</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Click outside to close new chat menu */}
      {showNewChatMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNewChatMenu(false)}
        ></div>
      )}
    </div>
  );
};

export default ChatSidebar;

