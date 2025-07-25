import React, { useState } from 'react';
import { Phone, Video, MoreVertical, Search, Info, Users, Settings } from 'lucide-react';

const ChatHeader = ({ chat, onlineUsers, currentUser, onVideoCall, onVoiceCall, onSearchToggle }) => {
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
      return otherUser?.name || 'Unknown User';
    }
    return chat.name || 'Group Chat';
  };

  const getChatAvatar = () => {
    if (chat.type === 'direct') {
      const otherUser = chat.members?.find(member => member.id !== currentUser.id);
      return otherUser?.avatar || '/default-avatar.png';
    }
    return chat.avatar || '/default-group-avatar.png';
  };

  const getLastSeen = () => {
    if (chat.type === 'direct') {
      const otherUser = chat.members?.find(member => member.id !== currentUser.id);
      if (onlineUsers.includes(otherUser?.id)) {
        return 'Online';
      } else if (otherUser?.lastSeen) {
        const lastSeen = new Date(otherUser.lastSeen);
        const now = new Date();
        const diffInMinutes = Math.floor((now - lastSeen) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return lastSeen.toLocaleDateString();
      }
      return 'Offline';
    }
    return getOnlineCount();
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

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Chat Info */}
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="relative">
            <img
              src={getChatAvatar()}
              alt={getChatTitle()}
              className="w-10 h-10 rounded-full object-cover"
            />
            {chat.type === 'direct' && (
              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                onlineUsers.includes(chat.members?.find(m => m.id !== currentUser.id)?.id)
                  ? 'bg-green-500'
                  : 'bg-gray-400'
              }`}></div>
            )}
          </div>

          {/* Chat Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {getChatTitle()}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              {getLastSeen()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Voice Call */}
          <button
            onClick={handleVoiceCall}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            title="Voice call"
          >
            <Phone className="w-5 h-5" />
          </button>

          {/* Video Call */}
          <button
            onClick={handleVideoCall}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            title="Video call"
          >
            <Video className="w-5 h-5" />
          </button>

          {/* Search */}
          <button
            onClick={handleSearchToggle}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            title="Search messages"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* More Options */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              title="More options"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={() => {
                    // Handle chat info
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <Info className="w-4 h-4 mr-3" />
                  Chat Info
                </button>

                {chat.type === 'group' && (
                  <button
                    onClick={() => {
                      // Handle manage members
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Users className="w-4 h-4 mr-3" />
                    Manage Members
                  </button>
                )}

                <button
                  onClick={() => {
                    // Handle chat settings
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Chat Settings
                </button>

                <hr className="my-1" />

                <button
                  onClick={() => {
                    // Handle mute notifications
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  {chat.muted ? 'Unmute Notifications' : 'Mute Notifications'}
                </button>

                <button
                  onClick={() => {
                    // Handle clear chat
                    if (window.confirm('Are you sure you want to clear this chat?')) {
                      // Clear chat logic
                    }
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Clear Chat
                </button>

                {chat.type === 'group' && (
                  <button
                    onClick={() => {
                      // Handle leave group
                      if (window.confirm('Are you sure you want to leave this group?')) {
                        // Leave group logic
                      }
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    Leave Group
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
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
    </div>
  );
};

export default ChatHeader;

