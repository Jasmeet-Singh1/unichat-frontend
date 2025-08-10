import React, { useState, useEffect } from 'react';
import { Users, Edit, UserPlus, X, Search, Settings, Trash2 } from 'lucide-react';

const GroupDetailsModal = ({ 
  isOpen, 
  onClose, 
  group, 
  currentUser, 
  onUpdateGroup,
  onDeleteGroup,
  onRemoveMember,
  onAddMembers,
  apiBaseUrl = 'http://localhost:3001' // Add apiBaseUrl prop with default
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    isPrivate: true
  });
  const [memberSearch, setMemberSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize edit form when group changes
  useEffect(() => {
    if (group) {
      setEditForm({
        name: group.name || '',
        description: group.description || '',
        isPrivate: group.isPrivate !== undefined ? group.isPrivate : true
      });
    }
  }, [group]);

  // Search users for adding to group
  const searchUsers = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiBaseUrl}/api/groups/search/users?query=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const users = await response.json();
        // Filter out users who are already members
        const currentMemberIds = group.members.map(m => m._id);
        const filteredUsers = users.filter(user => !currentMemberIds.includes(user._id));
        setSearchResults(filteredUsers);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  // Handle member search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(memberSearch);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [memberSearch]);

  // Add member to selected list
  const handleSelectMember = (user) => {
    if (!selectedMembers.find(m => m._id === user._id)) {
      setSelectedMembers([...selectedMembers, user]);
      setMemberSearch('');
      setSearchResults([]);
    }
  };

  // Remove member from selected list
  const handleDeselectMember = (userId) => {
    setSelectedMembers(selectedMembers.filter(m => m._id !== userId));
  };

  // Handle edit group submission
  const handleEditSubmit = async () => {
    if (!editForm.name.trim()) {
      setError('Group name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const groupId = group._id || group.id; // Handle both _id and id
      console.log('Updating group with ID:', groupId, 'Data:', editForm);
      
      const response = await fetch(`${apiBaseUrl}/api/groups/${groupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Update response:', result);
        onUpdateGroup(result.group || result);
        setShowEditModal(false);
        setError('');
      } else {
        const errorText = await response.text();
        console.error('Update error response:', errorText);
        try {
          const errorData = JSON.parse(errorText);
          setError(errorData.error || errorData.message || 'Failed to update group');
        } catch {
          setError(`Failed to update group: ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      setError('Failed to update group');
      console.error('Error updating group:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle add members submission
  const handleAddMembersSubmit = async () => {
    if (selectedMembers.length === 0) {
      setError('Please select at least one member to add');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const groupId = group._id || group.id; // Handle both _id and id
      const userIds = selectedMembers.map(m => m._id);
      console.log('Adding members to group:', groupId, 'Users:', userIds);
      
      const response = await fetch(`${apiBaseUrl}/api/groups/${groupId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userIds })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Add members response:', result);
        onAddMembers(result.group || result);
        setShowAddMemberModal(false);
        setSelectedMembers([]);
        setMemberSearch('');
        setError('');
      } else {
        const errorText = await response.text();
        console.error('Add members error response:', errorText);
        try {
          const errorData = JSON.parse(errorText);
          setError(errorData.error || errorData.message || 'Failed to add members');
        } catch {
          setError(`Failed to add members: ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      setError('Failed to add members');
      console.error('Error adding members:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete group
  const handleDeleteGroup = async () => {
    if (!window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const groupId = group._id || group.id; // Handle both _id and id
      console.log('Deleting group with ID:', groupId);
      
      const response = await fetch(`${apiBaseUrl}/api/groups/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        console.log('Group deleted successfully');
        onDeleteGroup(groupId);
        onClose();
      } else {
        const errorText = await response.text();
        console.error('Delete error response:', errorText);
        try {
          const errorData = JSON.parse(errorText);
          setError(errorData.error || errorData.message || 'Failed to delete group');
        } catch {
          setError(`Failed to delete group: ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      setError('Failed to delete group');
      console.error('Error deleting group:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !group) return null;

  // Debug logging
  console.log('GroupDetailsModal rendering with group:', group);
  console.log('Group ID:', group._id || group.id);

  const isCreator = group.createdBy && group.createdBy._id === currentUser.id;

  return (
    <>
      {/* Main Group Details Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Group Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Group Info */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{group.name}</h3>
            <p className="text-gray-600 text-sm">{group.description || 'No description'}</p>
            {group.isPrivate && (
              <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mt-2">
                Private Group
              </span>
            )}
          </div>

          {/* Action Buttons */}
          {isCreator && (
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setShowEditModal(true)}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
              >
                <Edit size={16} />
                Edit Group
              </button>
              <button
                onClick={() => setShowAddMemberModal(true)}
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
              >
                <UserPlus size={16} />
                Add Member
              </button>
            </div>
          )}

          {/* Members List */}
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Members ({group.members?.length || 0})</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {group.members?.map((member) => (
                <div key={member._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {member.firstName?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        {member.firstName} {member.lastName}
                        {member._id === group.createdBy?._id && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Admin</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{member.email}</div>
                    </div>
                  </div>
                  {isCreator && member._id !== group.createdBy?._id && (
                    <button
                      onClick={() => {
                        const groupId = group._id || group.id;
                        console.log('Remove button clicked. GroupId:', groupId, 'MemberId:', member._id);
                        onRemoveMember(groupId, member._id);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Delete Group (Creator only) */}
          {isCreator && (
            <div className="mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  const groupId = group._id || group.id;
                  console.log('Delete button clicked. GroupId:', groupId);
                  handleDeleteGroup();
                }}
                disabled={loading}
                className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Trash2 size={16} />
                {loading ? 'Deleting...' : 'Delete Group'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Group Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Edit Group</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter group name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Enter group description (optional)"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={editForm.isPrivate}
                  onChange={(e) => setEditForm({ ...editForm, isPrivate: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isPrivate" className="text-sm text-gray-700">
                  Private Group (requires invitation to join)
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Add Members</h2>
              <button onClick={() => setShowAddMemberModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                  type="text"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search users by name or email..."
                />
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                  {searchResults.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => handleSelectMember(user)}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {user.firstName?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                      <button className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected Members */}
              {selectedMembers.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Selected Members:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMembers.map((member) => (
                      <div key={member._id} className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        <span>{member.firstName} {member.lastName}</span>
                        <button
                          onClick={() => handleDeselectMember(member._id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMembersSubmit}
                disabled={loading || selectedMembers.length === 0}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? 'Adding...' : `Add ${selectedMembers.length} Member${selectedMembers.length !== 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupDetailsModal;