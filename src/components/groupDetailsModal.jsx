import React from 'react';

const GroupDetailsModal = ({
  showGroupDetails,
  setShowGroupDetails,
  groupDetails,
  currentUser,
  removeMemberFromExistingGroup,
  leaveExistingGroup
}) => {
  if (!showGroupDetails || !groupDetails) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">Group Details</h3>
          <button
            className="modal-close-btn"
            onClick={() => setShowGroupDetails(false)}
          >
            ✕
          </button>
        </div>

        {/* Group Info */}
        <div className="group-details-content">
          <div className="group-details-avatar">
            👥
          </div>
          <h2 className="group-details-name">{groupDetails.name}</h2>
          <p className="group-details-description">
            {groupDetails.description || 'No description'}
          </p>
          <div className={`group-privacy-badge ${groupDetails.isPrivate ? 'private' : 'public'}`}>
            {groupDetails.isPrivate ? 'Private Group' : 'Public Group'}
          </div>
        </div>

        {/* Members Section */}
        <div className="members-section">
          <h4 className="members-title">
            Members ({groupDetails.members?.length || 0})
          </h4>
          <div className="members-list">
            {groupDetails.members?.map(member => (
              <div key={member._id} className="member-item">
                <div className="member-avatar">
                  {member.firstName?.charAt(0)}{member.lastName?.charAt(0)}
                </div>
                <div className="member-info">
                  <div className="member-name">
                    {member.firstName} {member.lastName}
                    {member._id === groupDetails.createdBy._id && (
                      <span className="member-admin-badge">
                        (Admin)
                      </span>
                    )}
                  </div>
                  <div className="member-email">
                    {member.email}
                  </div>
                </div>
                {/* Only show remove button if current user is admin and target is not admin */}
                {currentUser.id === groupDetails.createdBy._id && 
                 member._id !== groupDetails.createdBy._id && (
                  <button
                    className="member-remove-btn"
                    onClick={() => removeMemberFromExistingGroup(groupDetails._id, member._id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Group Actions */}
        <div className="group-actions">
          {currentUser.id === groupDetails.createdBy._id ? (
            <>
              <button
                className="btn-success"
                onClick={() => {
                  // TODO: Implement add member functionality
                  console.log('Add member clicked');
                }}
              >
                Add Members
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  // TODO: Implement edit group functionality
                  console.log('Edit group clicked');
                }}
              >
                Edit Group
              </button>
            </>
          ) : (
            <button
              className="btn-danger"
              onClick={() => leaveExistingGroup(groupDetails._id)}
            >
              Leave Group
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupDetailsModal;