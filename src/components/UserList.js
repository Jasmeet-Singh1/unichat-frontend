import React, { useState } from 'react';
import { Crown, Shield, MoreVertical, UserPlus, UserMinus, MessageCircle } from 'lucide-react';

const UserList = ({ users, onlineUsers, currentUser, onUserAction, isAdmin = false }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  const getUserRole = (user) => {
    if (user.role === 'admin') return 'Admin';
    if (user.role === 'moderator') return 'Moderator';
    if (user.role === 'mentor') return 'Mentor';
    if (user.role === 'alumni') return 'Alumni';
    return 'Student';
  };

  const getRoleIcon = (user) => {
    if (user.role === 'admin') return <Crown className="w-3 h-3 text-yellow-500" />;
    if (user.role === 'moderator') return <Shield className="w-3 h-3 text-blue-500" />;
    return null;
  };

  const getRoleColor = (user) => {
    switch (user.role) {
      case 'admin': return 'text-yellow-600 bg-yellow-100';
      case 'moderator': return 'text-blue-600 bg-blue-100';
      case 'mentor': return 'text-purple-600 bg-purple-100';
      case 'alumni': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  const handleUserClick = (user) => {
    if (selectedUser?.id === user.id) {
      setSelectedUser(null);
    } else {
      setSelectedUser(user);
    }
  };

  const handleDirectMessage = (user) => {
    if (onUserAction) {
      onUserAction('message', user);
    }
    setSelectedUser(null);
  };

  const handlePromoteUser = (user) => {
    if (onUserAction) {
      onUserAction('promote', user);
    }
    setSelectedUser(null);
  };

  const handleRemoveUser = (user) => {
    if (window.confirm(`Are you sure you want to remove ${user.name} from this group?`)) {
      if (onUserAction) {
        onUserAction('remove', user);
      }
    }
    setSelectedUser(null);
  };

  const sortedUsers = [...users].sort((a, b) => {
    // Sort by online status first, then by role, then by name
    const aOnline = isUserOnline(a.id);
    const bOnline = isUserOnline(b.id);
    
    if (aOnline !== bOnline) {
      return bOnline - aOnline; // Online users first
    }
    
    const roleOrder = { admin: 0, moderator: 1, mentor: 2, alumni: 3, student: 4 };
    const aRoleOrder = roleOrder[a.role] || 4;
    const bRoleOrder = roleOrder[b.role] || 4;
    
    if (aRoleOrder !== bRoleOrder) {
      return aRoleOrder - bRoleOrder;
    }
    
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="w-64 bg-gray-50 border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Members ({users.length})
        </h3>
        <p className="text-sm text-gray-500">
          {onlineUsers.length} online
        </p>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        {sortedUsers.map((user) => (
          <div key={user.id} className="relative">
            <div
              onClick={() => handleUserClick(user)}
              className={`p-3 hover:bg-gray-100 cursor-pointer transition-colors ${
                selectedUser?.id === user.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                {/* Avatar with online indicator */}
                <div className="relative">
                  <img
                    src={user.avatar || '/default-avatar.png'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                    isUserOnline(user.id) ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                      {user.id === currentUser.id && (
                        <span className="text-xs text-gray-500 ml-1">(You)</span>
                      )}
                    </p>
                    {getRoleIcon(user)}
                  </div>
                  
                  {/* Role Badge */}
                  <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getRoleColor(user)}`}>
                    {getUserRole(user)}
                  </span>
                  
                  {/* Status */}
                  <p className="text-xs text-gray-500 mt-1">
                    {isUserOnline(user.id) ? 'Online' : 'Offline'}
                  </p>
                </div>

                {/* More Options */}
                {user.id !== currentUser.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUserClick(user);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* User Actions Dropdown */}
            {selectedUser?.id === user.id && user.id !== currentUser.id && (
              <div className="absolute right-2 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={() => handleDirectMessage(user)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <MessageCircle className="w-4 h-4 mr-3" />
                  Send Message
                </button>

                {isAdmin && user.role !== 'admin' && (
                  <>
                    <button
                      onClick={() => handlePromoteUser(user)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <UserPlus className="w-4 h-4 mr-3" />
                      Promote to Moderator
                    </button>

                    <hr className="my-1" />

                    <button
                      onClick={() => handleRemoveUser(user)}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <UserMinus className="w-4 h-4 mr-3" />
                      Remove from Group
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Member Button (for admins) */}
      {isAdmin && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              if (onUserAction) {
                onUserAction('add', null);
              }
            }}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Member
          </button>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setSelectedUser(null)}
        ></div>
      )}
    </div>
  );
};

export default UserList;

