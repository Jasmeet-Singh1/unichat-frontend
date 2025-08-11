import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { 
  getTotalUnreadCount, 
  updateTabTitle, 
  updateFavicon, 
  handleNewMessageNotification, 
  isAppVisible, 
  formatGroupData, 
  createTempChat 
} from './chat-utils.js';
import ChatHeader from './ChatHeader';
import ChatSidebar from './ChatSidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import GroupModal from './groupModal';
import GroupDetailsModal from './groupDetailsModal';
import { useGroupOperations } from './useGroupOperations'; // Import the hook

import './chat-styles.css';

console.log('🚀 LOADING WORKING CHAT COMPONENT FROM /components/Chat.jsx');

const Chat = ({ 
  currentUser, 
  apiBaseUrl = 'http://localhost:3001',
  socketUrl = 'http://localhost:3001',
  onError,
  onConnectionChange 
}) => {
  console.log('🎯 Chat component rendering with currentUser:', currentUser);

  // Initialize the useGroupOperations hook
  const {
    loading: groupOperationsLoading,
    error: groupOperationsError,
    setError: setGroupOperationsError,
    removeMember,
    leaveGroup,
    getGroupDetails
  } = useGroupOperations(apiBaseUrl);

  // Main state
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

  // Group-related state
  const [groups, setGroups] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupForm, setGroupForm] = useState({
    name: '',
    description: '',
    isPrivate: true,
    memberSearch: '',
    searchResults: [],
    selectedMembers: []
  });
  const [groupLoading, setGroupLoading] = useState(false);
  const [groupError, setGroupError] = useState(null);
  const [showGroupDetails, setShowGroupDetails] = useState(false);
  const [groupDetails, setGroupDetails] = useState(null);

  // Handle group operations errors
  useEffect(() => {
    if (groupOperationsError) {
      console.error('Group operation error:', groupOperationsError);
      alert(groupOperationsError);
      setGroupOperationsError(''); // Clear the error after showing it
    }
  }, [groupOperationsError, setGroupOperationsError]);

  // API Functions - Remove React.useCallback to avoid dependency issues
  const loadConversations = async () => {
    if (!currentUser) return;
    
    console.log('📞 Loading conversations for user:', currentUser.id);
    
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
        console.log('📞 Loaded conversations:', conversations);
        setChats(conversations);
      } else {
        const errorText = await response.text();
        console.error('📞 API Error Response:', errorText);
        throw new Error(`Failed to load conversations: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Error loading conversations:', error);
      setChats([]);
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  const loadGroups = async () => {
    if (!currentUser) return;
    
    try {
      const response = await fetch(`${apiBaseUrl}/api/groups`, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userGroups = await response.json();
        console.log('📦 Loaded groups:', userGroups);
        setGroups(userGroups);
      } else {
        console.error('Failed to load groups');
      }
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  };

  const loadMessages = async (chatId, chatType = 'direct') => {
    if (!currentUser) return;
    
    console.log('📨 Loading messages for chat:', chatId, 'type:', chatType);
    
    try {
      let url;
      if (chatType === 'group') {
        url = `${apiBaseUrl}/api/groups/${chatId}/messages`;
      } else {
        url = `${apiBaseUrl}/api/chat/messages/${chatId}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const chatMessages = await response.json();
        console.log('📨 Loaded messages:', chatMessages.length);
        setMessages(chatMessages);
      } else {
        throw new Error(`Failed to load messages: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error loading messages:', error);
      setMessages([]);
      if (onError) onError(error);
    }
  };

  const markMessagesAsRead = async (chatId, chatType) => {
    if (!currentUser || !chatId) return;

    try {
      const response = await fetch(`${apiBaseUrl}/api/chat/chats/${chatId}/read?chatType=${chatType || 'direct'}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('✅ Messages marked as read');
        
        // Update the unread count in the chat list
        setChats(prevChats => 
          prevChats.map(chat => 
            chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
          )
        );
        
        setGroups(prevGroups => 
          prevGroups.map(group => 
            group.id === chatId ? { ...group, unreadCount: 0 } : group
          )
        );
      }
    } catch (error) {
      console.error('❌ Error marking messages as read:', error);
    }
  };

  // Create notification entry for new messages
  const createChatNotification = async (message, chat) => {
    if (!currentUser || message.senderId === currentUser.id) return;

    try {
      await fetch(`${apiBaseUrl}/api/notifications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
  userId: currentUser.id,
  type: 'message',
  title: 'New Message',  // ← Add this line
  message: `${message.senderName} sent you a message${chat.type === 'group' ? ` in ${chat.name}` : ''}`,
  metadata: {
    chatId: chat.id,
    messageId: message.id,
    chatType: chat.type,
    chatName: chat.name
  }
})
      });
    } catch (error) {
      console.error('❌ Error creating chat notification:', error);
    }
  };

  // Update tab title and favicon when unread count changes
  useEffect(() => {
    const totalUnread = getTotalUnreadCount(chats, groups);
    updateTabTitle(totalUnread);
    updateFavicon(totalUnread > 0);
  }, [chats, groups]);

  // Setup Socket.IO for real-time updates
  useEffect(() => {
    if (!currentUser) return;

    const socketInstance = io(socketUrl, {
      auth: {
        token: currentUser.token,
        userId: currentUser.id
      }
    });

    socketInstance.on('connect', () => {
      console.log('🔌 Connected to chat socket');
      setIsConnected(true);
      if (onConnectionChange) onConnectionChange(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('🔌 Disconnected from chat socket');
      setIsConnected(false);
      if (onConnectionChange) onConnectionChange(false);
    });

    // Listen for new messages
    socketInstance.on('new_message', (message) => {
      console.log('📨 New message received via socket:', message);
      
      // Update messages if it's for the current chat
      if (selectedChat && message.chatId === selectedChat.id) {
        setMessages(prev => [...prev, message]);
      } else {
        // Update unread count for the chat
        setChats(prevChats => 
          prevChats.map(chat => 
            chat.id === message.chatId 
              ? { ...chat, unreadCount: (chat.unreadCount || 0) + 1, lastMessage: message }
              : chat
          )
        );
        
        setGroups(prevGroups => 
          prevGroups.map(group => 
            group.id === message.chatId 
              ? { ...group, unreadCount: (group.unreadCount || 0) + 1, lastMessage: message }
              : group
          )
        );

        // Show notification if app is not visible
        const chat = [...chats, ...groups].find(c => c.id === message.chatId);
        if (chat) {
          handleNewMessageNotification(message, chat, currentUser, isAppVisible());
        }

        // Create a notification entry
        createChatNotification(message, chat);
      }
    });

    // Listen for online users
    socketInstance.on('users_online', (users) => {
      setOnlineUsers(users);
    });

    // Listen for typing indicators
    socketInstance.on('user_typing', (data) => {
      setTypingUsers(prev => 
        prev.includes(data.userId) ? prev : [...prev, data.userId]
      );
    });

    socketInstance.on('user_stopped_typing', (data) => {
      setTypingUsers(prev => prev.filter(id => id !== data.userId));
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [currentUser?.id, socketUrl]); // Only depend on user ID, not the whole object

  const sendMessage = async () => {
    console.log('📤 Send message called:', {
      messageLength: message.length,
      hasSelectedChat: !!selectedChat,
      selectedChatId: selectedChat?.id,
      chatType: selectedChat?.type,
      currentUserId: currentUser?.id
    });

    if (!message.trim() || !selectedChat) {
      console.warn('⚠️ Cannot send message: missing text or chat');
      return;
    }

    try {
      console.log('📤 Sending message to API');
      
      let url, payload;
      if (selectedChat.type === 'group') {
        url = `${apiBaseUrl}/api/groups/${selectedChat.id}/messages`;
        payload = { text: message.trim() };
      } else {
        url = `${apiBaseUrl}/api/chat/messages`;
        payload = {
          chatId: selectedChat.id,
          text: message.trim(),
          type: 'text'
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const savedMessage = await response.json();
        console.log('✅ Message saved successfully:', savedMessage);
        
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

  // Group Functions
  const createGroup = async () => {
    if (!currentUser) return;
    
    if (!groupForm.name.trim()) {
      setGroupError('Group name is required');
      return;
    }

    try {
      setGroupLoading(true);
      setGroupError(null);

      const memberIds = groupForm.selectedMembers.map(member => member._id);

      const response = await fetch(`${apiBaseUrl}/api/groups`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: groupForm.name.trim(),
          description: groupForm.description.trim(),
          isPrivate: groupForm.isPrivate,
          memberIds: memberIds
        })
      });

      if (response.ok) {
        const newGroup = await response.json();
        console.log('✅ Group created successfully:', newGroup);
        
        const formattedGroup = formatGroupData(newGroup);
        setGroups(prev => [formattedGroup, ...prev]);
        
        // Reset form and close modal
        setGroupForm({ 
          name: '', 
          description: '', 
          isPrivate: true,
          memberSearch: '',
          searchResults: [],
          selectedMembers: []
        });
        setShowGroupModal(false);
        
        setActiveTab('groups');
        setSelectedChat(formattedGroup);
        
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create group');
      }
    } catch (err) {
      console.error('❌ Error creating group:', err);
      setGroupError(err.message);
    } finally {
      setGroupLoading(false);
    }
  };

  const handleGroupFormChange = (field, value) => {
    setGroupForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Trigger user search when typing in memberSearch
    if (field === 'memberSearch') {
      searchUsers(value);
    }
    
    if (groupError) setGroupError(null);
  };

  const searchUsers = async (query) => {
    if (!query || query.length < 2) {
      handleGroupFormChange('searchResults', []);
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/groups/search/users?query=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const users = await response.json();
        const filteredUsers = users.filter(user => 
          user._id !== currentUser.id && 
          !groupForm.selectedMembers.some(member => member._id === user._id)
        );
        handleGroupFormChange('searchResults', filteredUsers);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const addMemberToGroup = (user) => {
    const updatedMembers = [...(groupForm.selectedMembers || []), user];
    handleGroupFormChange('selectedMembers', updatedMembers);
    handleGroupFormChange('searchResults', []);
    handleGroupFormChange('memberSearch', '');
  };

  const removeMemberFromGroup = (userId) => {
    const updatedMembers = groupForm.selectedMembers.filter(member => member._id !== userId);
    handleGroupFormChange('selectedMembers', updatedMembers);
  };

  // Updated function using the hook
  const loadGroupDetails = async (groupId) => {
    try {
      console.log('Loading group details for group:', groupId);
      const result = await getGroupDetails(groupId);
      if (result.success) {
        setGroupDetails(result.group);
        setShowGroupDetails(true);
      }
    } catch (error) {
      console.error('Error loading group details:', error);
      alert('Failed to load group details: ' + error.message);
    }
  };

  // Updated function using the hook
  const removeMemberFromExistingGroup = async (groupId, userId) => {
    try {
      console.log('Removing member from group. GroupId:', groupId, 'UserId:', userId);
      // Use the groupId passed directly from the modal
      const result = await removeMember(groupId, userId);
      if (result.success) {
        // Refresh group details and groups list
        await loadGroupDetails(groupId);
        await loadGroups();
        console.log('✅ Member removed successfully');
      }
    } catch (error) {
      // Error is already handled by the hook and displayed via useEffect
      console.error('Error removing member:', error);
    }
  };

  // Updated function using the hook
  const leaveExistingGroup = async (groupId) => {
    if (!window.confirm('Are you sure you want to leave this group?')) return;

    try {
      const result = await leaveGroup(groupId);
      if (result.success) {
        setShowGroupDetails(false);
        setSelectedChat(null);
        await loadGroups();
        console.log('✅ Left group successfully');
      }
    } catch (error) {
      // Error is already handled by the hook and displayed via useEffect
      console.error('Error leaving group:', error);
    }
  };

  // Add member operation callbacks for GroupDetailsModal
  const handleUpdateGroup = (updatedGroup) => {
    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === updatedGroup.id ? { ...group, ...updatedGroup } : group
      )
    );
    setGroupDetails(updatedGroup);
  };

  const handleDeleteGroup = (deletedGroupId) => {
    setGroups(prevGroups => prevGroups.filter(group => group.id !== deletedGroupId));
    setShowGroupDetails(false);
    if (selectedChat?.id === deletedGroupId) {
      setSelectedChat(null);
    }
  };

  const handleAddMembers = (updatedGroup) => {
    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === updatedGroup.id ? { ...group, ...updatedGroup } : group
      )
    );
    setGroupDetails(updatedGroup);
  };

  // Load conversations and groups on mount - FIXED DEPENDENCIES
  useEffect(() => {
    if (currentUser) {
      loadConversations();
      loadGroups();
    }
  }, [currentUser?.id]); // Only depend on user ID

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
        try {
          const targetUser = JSON.parse(newChatTarget);
          const tempChat = createTempChat(currentUser, targetUser, selectedChatId);
          console.log('🎯 Creating temporary chat for new conversation:', tempChat);
          setSelectedChat(tempChat);
          sessionStorage.removeItem('selectedChatId');
          sessionStorage.removeItem('newChatTarget');
        } catch (e) {
          console.error('❌ Error parsing new chat target:', e);
        }
      }
    }
  }, [chats, currentUser?.id]); // Only depend on user ID

  // Load messages when chat is selected - FIXED DEPENDENCIES
  useEffect(() => {
    if (selectedChat && currentUser) {
      loadMessages(selectedChat.id, selectedChat.type);
    }
  }, [selectedChat?.id, selectedChat?.type, currentUser?.id]); // Only depend on specific properties

  // Mark messages as read
  useEffect(() => {
    if (selectedChat && messages.length > 0) {
      const timeout = setTimeout(() => {
        markMessagesAsRead(selectedChat.id, selectedChat.type);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [selectedChat?.id, messages.length]); // Only depend on specific properties

  // Early return if no user
  if (!currentUser) {
    return (
      <div className="error-screen">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h3 className="error-title">No User Found</h3>
          <p className="error-message">Please log in to access the chat</p>
        </div>
      </div>
    );
  }

  // Loading screen
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-title">Loading chats...</div>
          <div>Please wait...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <ChatSidebar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        chats={chats}
        groups={groups}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        setShowGroupModal={setShowGroupModal}
      />

      {/* Group Creation Modal */}
      <GroupModal
        showGroupModal={showGroupModal}
        setShowGroupModal={setShowGroupModal}
        groupForm={groupForm}
        handleGroupFormChange={handleGroupFormChange}
        groupError={groupError}
        setGroupError={setGroupError}
        groupLoading={groupLoading}
        createGroup={createGroup}
        addMemberToGroup={addMemberToGroup}
        removeMemberFromGroup={removeMemberFromGroup}
      />

      {/* Group Details Modal */}
      <GroupDetailsModal
        isOpen={showGroupDetails}
        onClose={() => setShowGroupDetails(false)}
        group={groupDetails}
        currentUser={currentUser}
        onUpdateGroup={handleUpdateGroup}
        onDeleteGroup={handleDeleteGroup}
        onRemoveMember={removeMemberFromExistingGroup}
        onAddMembers={handleAddMembers}
        apiBaseUrl={apiBaseUrl}
      />

      {/* Main Chat Area */}
      <div className="main-chat-area">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <ChatHeader 
              chat={selectedChat}
              onlineUsers={onlineUsers}
              currentUser={currentUser}
              onVideoCall={(chat) => console.log('📹 Video call clicked for:', chat)}
              onVoiceCall={(chat) => console.log('📞 Voice call clicked for:', chat)}
              onSearchToggle={() => console.log('🔍 Search toggled')}
              onChatInfo={() => {
                if (selectedChat?.type === 'group') {
                  const groupId = selectedChat._id || selectedChat.id;
                  console.log('Selected chat object:', selectedChat);
                  console.log('Opening group details for groupId:', groupId);
                  if (groupId && groupId !== 'undefined') {
                    loadGroupDetails(groupId);
                  } else {
                    console.error('Invalid group ID:', groupId);
                    alert('Invalid group ID. Cannot load group details.');
                  }
                }
              }}
              onManageMembers={() => {
                if (selectedChat?.type === 'group') {
                  const groupId = selectedChat._id || selectedChat.id;
                  console.log('Managing members for groupId:', groupId);
                  if (groupId && groupId !== 'undefined') {
                    loadGroupDetails(groupId);
                  } else {
                    console.error('Invalid group ID:', groupId);
                    alert('Invalid group ID. Cannot manage members.');
                  }
                }
              }}
              onLeaveGroup={() => {
                if (selectedChat?.type === 'group') {
                  const groupId = selectedChat._id || selectedChat.id;
                  console.log('Leaving group with groupId:', groupId);
                  if (groupId && groupId !== 'undefined') {
                    leaveExistingGroup(groupId);
                  } else {
                    console.error('Invalid group ID:', groupId);
                    alert('Invalid group ID. Cannot leave group.');
                  }
                }
              }}
            />

            {/* Messages */}
            <MessageList
              messages={messages}
              currentUser={currentUser}
              selectedChat={selectedChat}
            />

            {/* Message Input */}
            <MessageInput
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
              showEmojiPicker={showEmojiPicker}
              setShowEmojiPicker={setShowEmojiPicker}
              disabled={groupOperationsLoading}
            />
          </>
        ) : (
          /* Welcome Screen */
          <div className="welcome-screen">
            <div className="welcome-content">
              <div className="welcome-icon">💬</div>
              <h3 className="welcome-title">
                Welcome to UniChat ✨
              </h3>
              <p className="welcome-subtitle">
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