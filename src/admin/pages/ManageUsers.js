// src/admin/pages/ManageUsers.js
import React, { useState, useEffect } from 'react';
import { Users, Trash2, Eye, Search, Filter, UserPlus, X, Mail, Calendar, MapPin, Phone, Building } from 'lucide-react';
import '../styles/AdminPortal.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    students: 0,
    mentors: 0,
    alumni: 0,
    verified: 0,
    pending: 0
  });

  // Get API URL from environment
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  // Fetch users from backend
  useEffect(() => {
    fetchUsers();
  }, [searchTerm, filterRole, filterStatus]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      if (filterRole !== 'All') params.append('role', filterRole);
      if (filterStatus !== 'All') params.append('status', filterStatus);
      params.append('limit', '100');
      
      // Get admin token
      const adminToken = localStorage.getItem('adminToken');
      
      // Fetch users from your backend using environment variable
      const response = await fetch(`${apiUrl}/api/admin/users?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle response format (adjust based on your API response)
      const usersData = data.users || data; // Some APIs return { users: [...] }, others return [...]
      setUsers(Array.isArray(usersData) ? usersData : []);
      
      // Update stats
      if (data.pagination) {
        setStats(prevStats => ({
          ...prevStats,
          total: data.pagination.totalUsers
        }));
      }
      
      console.log(`Loaded ${usersData.length} users from backend`);
      
    } catch (error) {
      console.error('Error fetching users:', error);
      
      // If it's a 404 or connection error, show helpful message
      if (error.message.includes('404') || error.message.includes('Failed to fetch')) {
        setUsers([]);
        console.log('Backend not available, showing empty state');
      } else {
        alert('Error loading users: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to permanently delete ${userName}'s account? This action cannot be undone and will remove all their data from the database.`)) {
      try {
        const adminToken = localStorage.getItem('adminToken');
        
        const response = await fetch(`${apiUrl}/api/admin/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          
          // Remove user from local state
          setUsers(users.filter(user => user.id !== userId));
          
          // Update stats
          setStats(prevStats => ({
            ...prevStats,
            total: prevStats.total - 1
          }));
          
          alert(`${userName}'s account has been successfully deleted from the database.`);
          console.log('User deleted:', result);
        } else {
          const error = await response.json();
          throw new Error(error.message || 'Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user: ' + error.message);
      }
    }
  };

  const handleViewUser = async (user) => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      
      // Fetch detailed user profile
      const response = await fetch(`${apiUrl}/api/admin/users/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const detailedUser = await response.json();
        setSelectedUser(detailedUser);
        setShowUserModal(true);
      } else {
        // Fallback to basic user data if detailed fetch fails
        setSelectedUser(user);
        setShowUserModal(true);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      // Fallback to basic user data
      setSelectedUser(user);
      setShowUserModal(true);
    } finally {
      setLoading(false);
    }
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  const getRoleBadgeClass = (role) => {
    const classes = {
      'Student': 'badge-blue',
      'Mentor': 'badge-purple', 
      'Alumni': 'badge-orange'
    };
    return classes[role] || 'badge-gray';
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      'Verified': 'badge-green',
      'Pending': 'badge-yellow',
      'Suspended': 'badge-red'
    };
    return classes[status] || 'badge-gray';
  };

  // Calculate stats from loaded users
  const userCounts = {
    total: users.length,
    students: users.filter(user => user.role === 'Student').length,
    mentors: users.filter(user => user.role === 'Mentor').length,
    alumni: users.filter(user => user.role === 'Alumni').length,
    verified: users.filter(user => user.status === 'Verified').length,
    pending: users.filter(user => user.status === 'Pending').length
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="loading-spinner"></div>
        <span className="ml-3 text-primary">Loading users from database...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title flex items-center gap-2">
            <Users size={24} />
            Manage Users
          </h2>
          <p className="card-subtitle">
            View, manage, and delete user accounts from the database
          </p>
        </div>
      </div>

     {/* Users Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Database Users</h3>
          <p className="card-subtitle">
            Showing {users.length} users from database
          </p>
        </div>
        
        {loading && (
          <div className="text-center py-4">
            <div className="loading-spinner"></div>
            <span className="ml-3 text-secondary">Updating user list...</span>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>User Profile</th>
                <th>Role & Status</th>
                <th>Activity</th>
                <th>Join Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="user-avatar">
                        {user.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
                      </div>
                      <div>
                        <div className="font-medium text-primary">{user.name || `${user.firstName} ${user.lastName}`}</div>
                        <div className="text-sm text-secondary">{user.email}</div>
                        <div className="text-xs text-muted">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col gap-1">
                      <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                        {user.role}
                      </span>
                      <span className={`badge ${getStatusBadgeClass(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm">
                      <div className="text-primary">Last: {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'N/A'}</div>
                      <div className="text-secondary">{user.totalMessages || 0} messages</div>
                      <div className="text-muted">{user.eventsAttended || user.eventsHosted || 0} events</div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-primary">
                      {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="btn btn-ghost btn-sm"
                        title="View full profile details"
                      >
                        <Eye size={16} />
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id, user.name || `${user.firstName} ${user.lastName}`)}
                        className="btn btn-danger btn-sm"
                        title="Permanently delete from database"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {users.length === 0 && !loading && (
          <div className="text-center py-8">
            <Users size={48} className="text-muted mx-auto mb-3" />
            <p className="text-primary font-medium">No users found</p>
            <p className="text-secondary">
              {searchTerm || filterRole !== 'All' || filterStatus !== 'All' 
                ? 'Try adjusting your search or filter criteria'
                : 'Connect your backend API to load user data'
              }
            </p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{backgroundColor: 'var(--bg-primary)'}}>
            <div className="p-6 border-b" style={{borderColor: 'var(--border-color)'}}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-primary">User Profile Details</h3>
                <button
                  onClick={closeUserModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  style={{backgroundColor: 'var(--bg-secondary)'}}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Profile Header */}
              <div className="flex items-start gap-4">
                <div className="user-avatar text-lg" style={{width: '80px', height: '80px'}}>
                  {(selectedUser.name || `${selectedUser.firstName} ${selectedUser.lastName}`).split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-primary">
                    {selectedUser.name || `${selectedUser.firstName} ${selectedUser.lastName}`}
                  </h4>
                  <p className="text-secondary">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`badge ${getRoleBadgeClass(selectedUser.role)}`}>
                      {selectedUser.role}
                    </span>
                    <span className={`badge ${getStatusBadgeClass(selectedUser.status)}`}>
                      {selectedUser.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h5 className="text-lg font-semibold text-primary mb-3">Contact Information</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-muted" />
                    <span className="text-sm text-secondary">{selectedUser.email}</span>
                  </div>
                  {selectedUser.phone && (
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-muted" />
                      <span className="text-sm text-secondary">{selectedUser.phone}</span>
                    </div>
                  )}
                  {selectedUser.location && (
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-muted" />
                      <span className="text-sm text-secondary">{selectedUser.location}</span>
                    </div>
                  )}
                  {selectedUser.program && (
                    <div className="flex items-center gap-3">
                      <Building size={16} className="text-muted" />
                      <span className="text-sm text-secondary">{selectedUser.program}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Role-Specific Information */}
              <div>
                <h5 className="text-lg font-semibold text-primary mb-3">
                  {selectedUser.role} Information
                </h5>
                <div className="space-y-2">
                  {selectedUser.role === 'Student' && (
                    <>
                      {selectedUser.expectedGradDate && (
                        <div className="text-sm text-secondary">
                          <strong>Expected Graduation:</strong> {new Date(selectedUser.expectedGradDate).toLocaleDateString()}
                        </div>
                      )}
                      {selectedUser.studentClubs && selectedUser.studentClubs.length > 0 && (
                        <div className="text-sm text-secondary">
                          <strong>Student Clubs:</strong> {selectedUser.studentClubs.join(', ')}
                        </div>
                      )}
                    </>
                  )}
                  {selectedUser.role === 'Mentor' && (
                    <>
                      {selectedUser.courseExpertise && selectedUser.courseExpertise.length > 0 && (
                        <div className="text-sm text-secondary">
                          <strong>Course Expertise:</strong> {selectedUser.courseExpertise.map(ce => `${ce.course} (${ce.grade})`).join(', ')}
                        </div>
                      )}
                      {selectedUser.availability && selectedUser.availability.length > 0 && (
                        <div className="text-sm text-secondary">
                          <strong>Availability:</strong> {selectedUser.availability.join(', ')}
                        </div>
                      )}
                      {selectedUser.overallGPA && (
                        <div className="text-sm text-secondary">
                          <strong>Overall GPA:</strong> {selectedUser.overallGPA}
                        </div>
                      )}
                    </>
                  )}
                  {selectedUser.role === 'Alumni' && (
                    <>
                      {selectedUser.gradDate && (
                        <div className="text-sm text-secondary">
                          <strong>Graduation Date:</strong> {new Date(selectedUser.gradDate).toLocaleDateString()}
                        </div>
                      )}
                      {selectedUser.currentJob && (
                        <div className="text-sm text-secondary">
                          <strong>Current Position:</strong> {selectedUser.currentJob}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Bio */}
              {selectedUser.bio && (
                <div>
                  <h5 className="text-lg font-semibold text-primary mb-3">Bio</h5>
                  <p className="text-sm text-secondary">{selectedUser.bio}</p>
                </div>
              )}

              {/* Activity Stats */}
              <div>
                <h5 className="text-lg font-semibold text-primary mb-3">Activity Statistics</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg" style={{backgroundColor: 'var(--bg-secondary)'}}>
                    <div className="text-xl font-bold text-primary">{selectedUser.totalMessages || 0}</div>
                    <div className="text-sm text-secondary">Messages</div>
                  </div>
                  <div className="text-center p-4 rounded-lg" style={{backgroundColor: 'var(--bg-secondary)'}}>
                    <div className="text-xl font-bold text-primary">
                      {selectedUser.eventsAttended || selectedUser.eventsHosted || 0}
                    </div>
                    <div className="text-sm text-secondary">
                      {selectedUser.role === 'Mentor' ? 'Events Hosted' : 'Events Attended'}
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-lg" style={{backgroundColor: 'var(--bg-secondary)'}}>
                    <div className="text-xl font-bold text-primary">
                      {selectedUser.lastActive ? new Date(selectedUser.lastActive).toLocaleDateString() : 'N/A'}
                    </div>
                    <div className="text-sm text-secondary">Last Active</div>
                  </div>
                  <div className="text-center p-4 rounded-lg" style={{backgroundColor: 'var(--bg-secondary)'}}>
                    <div className="text-xl font-bold text-primary">
                      {selectedUser.accountCreated ? new Date(selectedUser.accountCreated).toLocaleDateString() : 'N/A'}
                    </div>
                    <div className="text-sm text-secondary">Member Since</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t" style={{borderColor: 'var(--border-color)'}}>
                <button
                  onClick={() => {
                    closeUserModal();
                    handleDeleteUser(selectedUser.id, selectedUser.name || `${selectedUser.firstName} ${selectedUser.lastName}`);
                  }}
                  className="btn btn-danger"
                >
                  <Trash2 size={16} />
                  Delete Account
                </button>
                <button
                  onClick={closeUserModal}
                  className="btn btn-ghost"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;