import React from 'react';

const GroupModal = ({
  showGroupModal,
  setShowGroupModal,
  groupForm,
  handleGroupFormChange,
  groupError,
  setGroupError,
  groupLoading,
  createGroup,
  addMemberToGroup,
  removeMemberFromGroup
}) => {
  if (!showGroupModal) return null;

  const resetForm = () => {
    handleGroupFormChange('name', '');
    handleGroupFormChange('description', '');
    handleGroupFormChange('isPrivate', true);
    handleGroupFormChange('memberSearch', '');
    handleGroupFormChange('searchResults', []);
    handleGroupFormChange('selectedMembers', []);
    setGroupError(null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Create New Group</h3>
          <button
            className="modal-close-btn"
            onClick={() => {
              setShowGroupModal(false);
              resetForm();
            }}
          >
            ✕
          </button>
        </div>
        
        {groupError && (
          <div className="error-message-form">
            {groupError}
          </div>
        )}

        {/* Group Name */}
        <div className="form-group">
          <label className="form-label">
            Group Name *
          </label>
          <input
            type="text"
            className="form-input"
            value={groupForm.name}
            onChange={(e) => handleGroupFormChange('name', e.target.value)}
            placeholder="Enter group name"
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">
            Description
          </label>
          <textarea
            className="form-textarea"
            value={groupForm.description}
            onChange={(e) => handleGroupFormChange('description', e.target.value)}
            placeholder="Enter group description (optional)"
            rows={3}
          />
        </div>

        {/* Add Members Section */}
        <div className="form-group">
          <label className="form-label">
            Add Members
          </label>
          <input
            type="text"
            className="form-input"
            value={groupForm.memberSearch || ''}
            onChange={(e) => handleGroupFormChange('memberSearch', e.target.value)}
            placeholder="Search users by name or email..."
          />
          
          {/* Search Results */}
          {groupForm.searchResults && groupForm.searchResults.length > 0 && (
            <div className="search-results">
              {groupForm.searchResults.map(user => (
                <div
                  key={user._id}
                  className="search-result-item"
                  onClick={() => addMemberToGroup(user)}
                >
                  <div className="search-result-info">
                    <div className="search-result-name">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="search-result-email">
                      {user.email}
                    </div>
                  </div>
                  <button className="add-btn">
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Selected Members */}
          {groupForm.selectedMembers && groupForm.selectedMembers.length > 0 && (
            <div className="selected-members">
              <div className="selected-members-label">
                Selected Members:
              </div>
              <div className="selected-members-list">
                {groupForm.selectedMembers.map(member => (
                  <div key={member._id} className="member-tag">
                    <span>{member.firstName} {member.lastName}</span>
                    <button
                      className="member-remove-btn"
                      onClick={() => removeMemberFromGroup(member._id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Private Group Checkbox */}
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={groupForm.isPrivate}
              onChange={(e) => handleGroupFormChange('isPrivate', e.target.checked)}
            />
            <span>Private Group</span>
          </label>
          <div className="checkbox-description">
            Private groups require invitation to join
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="modal-buttons">
          <button
            className="btn-secondary"
            onClick={() => {
              setShowGroupModal(false);
              resetForm();
            }}
          >
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={createGroup}
            disabled={groupLoading || !groupForm.name.trim()}
          >
            {groupLoading ? 'Creating...' : 'Create Group'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupModal;