import React, { useState } from 'react';
import { Trash2, Users } from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([
    {
      id: 'U001',
      name: 'Alice Johnson',
      email: 'alice.johnson@university.edu',
      role: 'Student',
      status: 'Verified',
      joinDate: '2024-09-15'
    },
    {
      id: 'U002',
      name: 'Dr. Robert Smith',
      email: 'robert.smith@university.edu',
      role: 'Mentor',
      status: 'Verified',
      joinDate: '2024-08-20'
    },
    {
      id: 'U003',
      name: 'Sarah Davis',
      email: 'sarah.davis@alumni.edu',
      role: 'Alumni',
      status: 'Pending',
      joinDate: '2024-10-01'
    },
    {
      id: 'U004',
      name: 'Michael Chen',
      email: 'michael.chen@university.edu',
      role: 'Student',
      status: 'Verified',
      joinDate: '2024-09-10'
    },
    {
      id: 'U005',
      name: 'Prof. Emily Wilson',
      email: 'emily.wilson@university.edu',
      role: 'Mentor',
      status: 'Verified',
      joinDate: '2024-07-15'
    },
    {
      id: 'U006',
      name: 'David Brown',
      email: 'david.brown@alumni.edu',
      role: 'Alumni',
      status: 'Verified',
      joinDate: '2024-09-25'
    }
  ]);

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Student':
        return 'bg-blue-100 text-blue-800';
      case 'Mentor':
        return 'bg-purple-100 text-purple-800';
      case 'Alumni':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const userCounts = {
    students: users.filter(user => user.role === 'Student').length,
    mentors: users.filter(user => user.role === 'Mentor').length,
    alumni: users.filter(user => user.role === 'Alumni').length,
    total: users.length
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="theme-bg-dropdown rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold theme-text-header mb-2">👥 Manage Users</h2>
        <p className="theme-text-subtitle">View and manage all registered users in the Unichat platform.</p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="theme-bg-dropdown rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="theme-bg-primary p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium theme-text-subtitle">Total Users</p>
              <p className="text-2xl font-bold theme-text-header">{userCounts.total}</p>
            </div>
          </div>
        </div>
        <div className="theme-bg-dropdown rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="theme-bg-primary p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium theme-text-subtitle">Students</p>
              <p className="text-2xl font-bold theme-text-header">{userCounts.students}</p>
            </div>
          </div>
        </div>
        <div className="theme-bg-dropdown rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium theme-text-subtitle">Mentors</p>
              <p className="text-2xl font-bold theme-text-header">{userCounts.mentors}</p>
            </div>
          </div>
        </div>
        <div className="theme-bg-dropdown rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-orange-500 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium theme-text-subtitle">Alumni</p>
              <p className="text-2xl font-bold theme-text-header">{userCounts.alumni}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="theme-bg-dropdown rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold theme-text-header">All Users</h3>
          <p className="text-sm theme-text-subtitle">Total users: {users.length}</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="theme-bg-footer">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium theme-text-subtitle uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium theme-text-subtitle uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium theme-text-subtitle uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium theme-text-subtitle uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium theme-text-subtitle uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium theme-text-subtitle uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="theme-bg-dropdown divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="theme-bg-dropdown-hover transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium theme-text-header">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium theme-text-header">{user.name}</div>
                      <div className="text-sm theme-text-subtitle">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm theme-text-subtitle">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white theme-bg-report-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;

