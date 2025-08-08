import React from 'react';
import { filterConversations, formatLastMessageTime } from './chat-utils';

const ChatSidebar = ({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  chats,
  groups,
  selectedChat,
  setSelectedChat,
  setShowGroupModal
}) => {
  const allConversations = [...chats, ...groups];
  const filteredConversations = filterConversations(allConversations, activeTab, searchQuery);

  return (
    <div className="chat-sidebar">
      {/* Header */}
      <div className="chat-header">
        <h1 className="chat-title">
          UniChat ✨
        </h1>
        
        <input
          type="text"
          className="search-input"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="chat-tabs">
        {[
          { id: 'all', label: 'All' },
          { id: 'direct', label: 'Direct' },
          { id: 'groups', label: 'Groups' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`chat-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
        {activeTab === 'groups' && (
          <button
            className="create-group-btn"
            onClick={() => setShowGroupModal(true)}
            title="Create Group"
          >
            +
          </button>
        )}
      </div>

      {/* Chat List */}
      <div className="chat-list">
        {filteredConversations.length === 0 ? (
          <div className="empty-chat-list">
            <div className="empty-chat-icon">💬</div>
            <div className="empty-chat-title">
              No conversations yet
            </div>
            <div className="empty-chat-subtitle">
              Start a new chat to begin messaging
            </div>
          </div>
        ) : (
          filteredConversations.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${selectedChat?.id === chat.id ? 'selected' : ''} ${chat.unreadCount > 0 ? 'has-unread' : ''}`}
              onClick={() => {
                console.log('🎯 Selecting chat:', chat);
                setSelectedChat(chat);
              }}
            >
              <div className="chat-item-content">
                {/* Avatar */}
                <div className={`chat-avatar ${chat.type}`}>
                  {chat.type === 'group' ? '👥' : (chat.name?.charAt(0)?.toUpperCase() || 'U')}
                </div>

                {/* Chat Info */}
                <div className="chat-info">
                  <div className="chat-info-header">
                    <h4 className="chat-name">
                      {chat.name}
                    </h4>
                    <div className="chat-header-right">
                      <span className="chat-time">
                        {chat.lastMessage ? formatLastMessageTime(chat.lastMessage.timestamp) : ''}
                      </span>
                      {chat.unreadCount > 0 && (
                        <div className="unread-badge">
                          {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="chat-last-message">
                    {chat.lastMessage ? chat.lastMessage.text : 'No messages yet'}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;