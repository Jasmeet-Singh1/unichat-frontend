import React, { useState } from 'react';
import { AlertTriangle, Eye, Trash2, CheckCircle } from 'lucide-react';

const FlaggedContent = () => {
  const [reports, setReports] = useState([
    {
      id: 'R001',
      reportedUser: 'Amit Dev',
      reportedBy: 'Sarah Johnson',
      message: '"You\'re just dumb, stop asking."',
      reason: 'Bullying / Harassment',
      timestamp: '2025-06-22 14:25',
      status: 'Pending'
    },
    {
      id: 'R002',
      reportedUser: 'Lena Huang',
      reportedBy: 'Mike Chen',
      message: '"Here\'s a shady link: bit.ly/fakeapp"',
      reason: 'Spam / Phishing',
      timestamp: '2025-06-22 13:47',
      status: 'Pending'
    },
    {
      id: 'R003',
      reportedUser: 'Alex Thompson',
      reportedBy: 'Emma Wilson',
      message: '"This platform is terrible, everyone should leave"',
      reason: 'Inappropriate Content',
      timestamp: '2025-06-21 16:30',
      status: 'Reviewed'
    }
  ]);

  const handleViewUser = (userId) => {
    alert(`Viewing user profile: ${userId}`);
  };

  const handleDeleteMessage = (reportId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setReports(reports.map(report => 
        report.id === reportId ? { ...report, status: 'Deleted' } : report
      ));
    }
  };

  const handleMarkReviewed = (reportId) => {
    setReports(reports.map(report => 
      report.id === reportId ? { ...report, status: 'Reviewed' } : report
    ));
  };

  const getReasonBadgeColor = (reason) => {
    switch (reason) {
      case 'Bullying / Harassment':
        return 'bg-red-100 text-red-800';
      case 'Spam / Phishing':
        return 'bg-orange-100 text-orange-800';
      case 'Inappropriate Content':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Reviewed':
        return 'bg-green-100 text-green-800';
      case 'Deleted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusCounts = {
    pending: reports.filter(report => report.status === 'Pending').length,
    reviewed: reports.filter(report => report.status === 'Reviewed').length,
    deleted: reports.filter(report => report.status === 'Deleted').length
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="theme-bg-dropdown rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold theme-text-header mb-2">🚨 Flagged Content Review</h2>
        <p className="theme-text-subtitle">Moderate reported posts and take action if necessary.</p>
      </div>

      {/* Reported Messages Section */}
      <div className="theme-bg-dropdown rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold theme-text-header mb-4">Reported Messages</h3>
        <p className="text-sm theme-text-subtitle mb-6">Total reports: {reports.length}</p>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="theme-bg-footer">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium theme-text-subtitle uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium theme-text-subtitle uppercase tracking-wider">
                  Reported Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium theme-text-subtitle uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium theme-text-subtitle uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium theme-text-subtitle uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="theme-bg-dropdown divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="theme-bg-dropdown-hover transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium theme-text-header">{report.reportedUser}</div>
                      <div className="text-sm theme-text-subtitle">Reported by: {report.reportedBy}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <div className="text-sm theme-text-header mb-1">{report.message}</div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getReasonBadgeColor(report.reason)}`}>
                      {report.reason}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm theme-text-subtitle">
                    {report.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {report.status === 'Pending' ? (
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={() => handleViewUser(report.reportedUser)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-white theme-bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View User
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(report.id)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-white theme-bg-report-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete Message
                        </button>
                        <button
                          onClick={() => handleMarkReviewed(report.id)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Mark Reviewed
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleViewUser(report.reportedUser)}
                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-white theme-bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View User
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="theme-bg-dropdown rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-2">{statusCounts.pending}</div>
          <div className="text-sm font-medium theme-text-subtitle">Pending Review</div>
        </div>
        <div className="theme-bg-dropdown rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{statusCounts.reviewed}</div>
          <div className="text-sm font-medium theme-text-subtitle">Reviewed</div>
        </div>
        <div className="theme-bg-dropdown rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">{statusCounts.deleted}</div>
          <div className="text-sm font-medium theme-text-subtitle">Deleted</div>
        </div>
      </div>
    </div>
  );
};

export default FlaggedContent;

