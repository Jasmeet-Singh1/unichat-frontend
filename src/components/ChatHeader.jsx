import React, { useState } from 'react';

const ChatHeader = ({ 
  chat, 
  onlineUsers = [], 
  currentUser, 
  onVideoCall, 
  onVoiceCall, 
  onSearchToggle,
  onChatInfo,
  onManageMembers,
  onLeaveGroup 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const getOnlineCount = () => {
    if (chat.type === 'direct') {
      const otherUser = chat.members?.find(member => member.id !== currentUser.id);
      return onlineUsers.includes(otherUser?.id) ? 'Online' : 'Offline';
    } else {
      const onlineCount = chat.members?.filter(member => 
        onlineUsers.includes(member.id)
      ).length || 0;
      return `${onlineCount} online`;
    }
  };

  const getChatTitle = () => {
    if (chat.type === 'direct') {
      const otherUser = chat.members?.find(member => member.id !== currentUser.id);
      return otherUser?.name || `${otherUser?.firstName || ''} ${otherUser?.lastName || ''}`.trim() || 'Unknown User';
    }
    return chat.name || 'Group Chat';
  };

  const getChatAvatar = () => {
    if (chat.type === 'direct') {
      const otherUser = chat.members?.find(member => member.id !== currentUser.id);
      return otherUser?.avatar;
    }
    return chat.avatar;
  };

  const getAvatarFallback = () => {
    if (chat.type === 'direct') {
      const otherUser = chat.members?.find(member => member.id !== currentUser.id);
      const firstName = otherUser?.firstName || otherUser?.name || 'U';
      return firstName.charAt(0).toUpperCase();
    }
    return chat.name?.charAt(0).toUpperCase() || 'G';
  };

  const getSubtitle = () => {
    if (chat.type === 'direct') {
      return getOnlineCount();
    } else {
      const memberCount = chat.members?.length || 0;
      const onlineCount = chat.members?.filter(member => 
        onlineUsers.includes(member.id)
      ).length || 0;
      return `${memberCount} members${onlineCount > 0 ? `, ${onlineCount} online` : ''}`;
    }
  };

  const handleVideoCall = () => {
    if (onVideoCall) {
      onVideoCall(chat);
    }
    setShowDropdown(false);
  };

  const handleVoiceCall = () => {
    if (onVoiceCall) {
      onVoiceCall(chat);
    }
    setShowDropdown(false);
  };

  const handleSearchToggle = () => {
    if (onSearchToggle) {
      onSearchToggle();
    }
    setShowDropdown(false);
  };

  const handleChatInfo = () => {
    if (onChatInfo) {
      onChatInfo();
    }
    setShowDropdown(false);
  };

  const handleManageMembers = () => {
    if (onManageMembers) {
      onManageMembers();
    }
    setShowDropdown(false);
  };

  const handleLeaveGroup = () => {
    if (onLeaveGroup) {
      if (window.confirm('Are you sure you want to leave this group?')) {
        onLeaveGroup();
      }
    }
    setShowDropdown(false);
  };

  return (
    <div style={{ 
      backgroundColor: '#fff', 
      borderBottom: '1px solid #ddd', 
      padding: '20px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Chat Info - Make clickable for groups */}
        <div 
          style={{
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            cursor: chat.type === 'group' ? 'pointer' : 'default',
            padding: chat.type === 'group' ? '8px' : '0',
            borderRadius: chat.type === 'group' ? '8px' : '0',
            transition: 'background-color 0.2s'
          }}
          onClick={chat.type === 'group' ? handleChatInfo : undefined}
          onMouseEnter={(e) => {
            if (chat.type === 'group') {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
            }
          }}
          onMouseLeave={(e) => {
            if (chat.type === 'group') {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          {/* Avatar */}
          <div style={{ position: 'relative' }}>
            {getChatAvatar() ? (
              <img
                src={getChatAvatar()}
                alt={getChatTitle()}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
                backgroundColor: chat.type === 'group' ? '#28a745' : '#0066cc'
              }}>
                {getAvatarFallback()}
              </div>
            )}
            
            {/* Online indicator for direct chats */}
            {chat.type === 'direct' && (
              <div style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: '2px solid white',
                backgroundColor: onlineUsers.includes(chat.members?.find(m => m.id !== currentUser.id)?.id) ? '#28a745' : '#6c757d'
              }}></div>
            )}
          </div>

          {/* Chat Details */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#333',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {getChatTitle()}
              </h3>
              {chat.type === 'group' && (
                <span style={{
                  fontSize: '12px',
                  backgroundColor: chat.isPrivate ? '#fff3cd' : '#d1edff',
                  color: chat.isPrivate ? '#856404' : '#0c63e4',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  border: `1px solid ${chat.isPrivate ? '#ffeaa7' : '#a6c8ff'}`
                }}>
                  {chat.isPrivate ? 'Private' : 'Public'}
                </span>
              )}
            </div>
            <p style={{ 
              fontSize: '14px', 
              color: '#666',
              margin: '4px 0 0 0',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {getSubtitle()}
              {chat.type === 'group' && (
                <span style={{ color: '#0066cc', fontWeight: 'bold' }}> • Click for details</span>
              )}
            </p>
          </div>
        </div>
        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          
          {/* Search */}
          <button
            onClick={handleSearchToggle}
            style={{
              padding: '12px',
              border: 'none',
              backgroundColor: '#f0f0f0',
              borderRadius: '50%',
              cursor: 'pointer',
              color: '#666',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#e0e0e0'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#f0f0f0'}
            title="Search messages"
          >
            🔍
          </button>

          {/* More Options */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                padding: '12px',
                border: 'none',
                backgroundColor: showDropdown ? '#e0e0e0' : '#f0f0f0',
                borderRadius: '50%',
                cursor: 'pointer',
                color: '#666',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!showDropdown) e.target.style.backgroundColor = '#e0e0e0';
              }}
              onMouseLeave={(e) => {
                if (!showDropdown) e.target.style.backgroundColor = '#f0f0f0';
              }}
              title="More options"
            >
              ⋮
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div style={{
                position: 'absolute',
                right: '0',
                top: '100%',
                marginTop: '4px',
                width: '200px',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                border: '1px solid #e0e0e0',
                padding: '8px 0',
                zIndex: 50
              }}>
                <button
                  onClick={handleChatInfo}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    textAlign: 'left',
                    fontSize: '14px',
                    color: '#333',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  ℹ️ {chat.type === 'group' ? 'Group Info' : 'Chat Info'}
                </button>

                {chat.type === 'group' && (
                  <button
                    onClick={handleManageMembers}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      textAlign: 'left',
                      fontSize: '14px',
                      color: '#333',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    👥 Manage Members
                  </button>
                )}

                <button
                  onClick={() => {
                    console.log('Chat settings clicked');
                    setShowDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    textAlign: 'left',
                    fontSize: '14px',
                    color: '#333',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  ⚙️ Chat Settings
                </button>

                <div style={{ 
                  height: '1px', 
                  backgroundColor: '#e0e0e0', 
                  margin: '8px 0' 
                }}></div>

                <button
                  onClick={() => {
                    console.log('Mute notifications clicked');
                    setShowDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    textAlign: 'left',
                    fontSize: '14px',
                    color: '#333',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  {chat.muted ? '🔊 Unmute' : '🔇 Mute'} Notifications
                </button>

                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear this chat?')) {
                      console.log('Clear chat clicked');
                    }
                    setShowDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    textAlign: 'left',
                    fontSize: '14px',
                    color: '#dc3545',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#ffeaea'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  🗑️ Clear Chat
                </button>

                {chat.type === 'group' && (
                  <button
                    onClick={handleLeaveGroup}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      textAlign: 'left',
                      fontSize: '14px',
                      color: '#dc3545',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#ffeaea'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    🚪 Leave Group
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 40
          }}
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
    </div>
  );
};

export default ChatHeader;