import React, { useState } from 'react';
import { Settings as SettingsIcon, Lock, Users, ChevronDown, ChevronUp, Save } from 'lucide-react';

const Settings = () => {
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [permissions, setPermissions] = useState({
    manageUsers: true,
    moderateContent: true,
    manageEvents: false,
    viewReports: true,
    systemSettings: false
  });

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handlePermissionChange = (permission) => {
    setPermissions({
      ...permissions,
      [permission]: !permissions[permission]
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    alert('Password updated successfully!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordSection(false);
  };

  const handlePermissionsSubmit = (e) => {
    e.preventDefault();
    alert('Permissions updated successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="theme-bg-dropdown rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold theme-text-header mb-2">⚙️ Settings</h2>
        <p className="theme-text-subtitle">Manage your admin account settings and permissions</p>
      </div>

      {/* Change Password Section */}
      <div className="theme-bg-dropdown rounded-lg shadow p-6">
        <button
          onClick={() => setShowPasswordSection(!showPasswordSection)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center">
            <Lock className="w-5 h-5 theme-text-primary mr-3" />
            <h3 className="text-lg font-semibold theme-text-header">Change Password</h3>
          </div>
          {showPasswordSection ? (
            <ChevronUp className="w-5 h-5 theme-text-subtitle" />
          ) : (
            <ChevronDown className="w-5 h-5 theme-text-subtitle" />
          )}
        </button>

        {showPasswordSection && (
          <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium theme-text-header mb-1">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 theme-bg-dropdown"
                required
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium theme-text-header mb-1">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 theme-bg-dropdown"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium theme-text-header mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 theme-bg-dropdown"
                required
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white theme-bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <Save className="w-4 h-4 mr-2" />
                Update Password
              </button>
              <button
                type="button"
                onClick={() => setShowPasswordSection(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md theme-text-header theme-bg-dropdown hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* User Permissions Section */}
      <div className="theme-bg-dropdown rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <Users className="w-5 h-5 theme-text-primary mr-3" />
          <h3 className="text-lg font-semibold theme-text-header">User Permissions</h3>
        </div>

        <form onSubmit={handlePermissionsSubmit} className="space-y-4">
          <div className="space-y-3">
            {Object.entries(permissions).map(([permission, enabled]) => (
              <div key={permission} className="flex items-center justify-between p-3 theme-bg-dropdown-hover rounded-lg">
                <div>
                  <div className="text-sm font-medium theme-text-header">
                    {permission.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div className="text-sm theme-text-subtitle">
                    {getPermissionDescription(permission)}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => handlePermissionChange(permission)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white theme-bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Permissions
            </button>
          </div>
        </form>
      </div>

      {/* Account Information */}
      <div className="theme-bg-dropdown rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <SettingsIcon className="w-5 h-5 theme-text-primary mr-3" />
          <h3 className="text-lg font-semibold theme-text-header">Account Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium theme-text-subtitle mb-1">Admin ID</label>
            <div className="text-sm theme-text-header">ADMIN_001</div>
          </div>
          <div>
            <label className="block text-sm font-medium theme-text-subtitle mb-1">Role</label>
            <div className="text-sm theme-text-header">Super Administrator</div>
          </div>
          <div>
            <label className="block text-sm font-medium theme-text-subtitle mb-1">Last Login</label>
            <div className="text-sm theme-text-header">2025-06-22 09:30 AM</div>
          </div>
          <div>
            <label className="block text-sm font-medium theme-text-subtitle mb-1">Account Status</label>
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const getPermissionDescription = (permission) => {
  const descriptions = {
    manageUsers: 'Add, edit, and delete user accounts',
    moderateContent: 'Review and moderate flagged content',
    manageEvents: 'Approve and manage user-created events',
    viewReports: 'Access analytics and reporting features',
    systemSettings: 'Modify system-wide configuration settings'
  };
  return descriptions[permission] || 'Permission description';
};

export default Settings;

