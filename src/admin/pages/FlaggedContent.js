
// src/admin/pages/FlaggedContent.js
import React, { useState } from 'react';
import { AlertTriangle, Eye, Trash2, CheckCircle, MessageSquare, User, Clock, Flag } from 'lucide-react';
import '../styles/AdminPortal.css';

const FlaggedContent = () => {
  const [reports, setReports] = useState([
    {
      id: 'R001',
      reportedUser: 'Amit Dev',
      reportedBy: 'Sarah Johnson',
      message: 'You\'re just dumb, stop asking stupid questions.',
      reason: 'Bullying / Harassment',
      timestamp: '2025-01-15 14:25',
      status: 'Pending',
      priority: 'High',
      chatroom: 'General Discussion'
    },
    {
      id: 'R002',
      reportedUser: 'Lena Huang',
      reportedBy: 'Mike Chen',
      message: 'Check out this amazing deal: bit.ly/suspicious-link',
      reason: 'Spam / Phishing',
      timestamp: '2025-01-15 13:47',
      status: 'Pending',
      priority: 'High',
      chatroom: 'Career Advice'
    },
    {
      id: 'R003',
      reportedUser: 'Alex Thompson',
      reportedBy: 'Emma Wilson',
      message: 'This platform is terrible, everyone should just leave and find something better.',
      reason: 'Inappropriate Content',
      timestamp: '2025-01-14 16:30',
      status: 'Reviewed',
      priority: 'Medium',
      chatroom: 'General Discussion'
    },
    {
      id: 'R004',
      reportedUser: 'John Smith',
      reportedBy: 'Lisa Chen',
      message: 'Can you help me with calculus homework?',
      reason: 'False Report',
      timestamp: '2025-01-14 10:15',
      status: 'Dismissed',
      priority: 'Low',
      chatroom: 'Study Groups'
    }
  ]);

  const handleViewUser = (userId) => {
    alert(`Viewing user profile: ${userId}`);
  };

  const handleViewMessage = (reportId) => {
    alert(`Viewing full message context for report: ${reportId}`);
  };

  const handleDeleteMessage = (reportId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setReports(reports.map(report => 
        report.id === reportId ? { ...report, status: 'Message Deleted' } : report
      ));
    }
  };

  const handleMarkReviewed = (reportId) => {
    setReports(reports.map(report => 
      report.id === reportId ? { ...report, status: 'Reviewed' } : report
    ));
  };

  const handleDismiss = (reportId) => {
    setReports(reports.map(report => 
      report.id === reportId ? { ...report, status: 'Dismissed' } : report
    ));
  };

  const getReasonBadgeClass = (reason) => {
    const classes = {
      'Bullying / Harassment': 'badge-red',
      'Spam / Phishing': 'badge-orange',
      'Inappropriate Content': 'badge-purple',
      'False Report': 'badge-gray'
    };
    return classes[reason] || 'badge-gray';
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      'Pending': 'badge-yellow',
      'Reviewed': 'badge-green',
      'Message Deleted': 'badge-red',
      'Dismissed': 'badge-gray'
    };
    return classes[status] || 'badge-gray';
  };

  const getPriorityBadgeClass = (priority) => {
    const classes = {
      'High': 'badge-red',
      'Medium': 'badge-yellow',
      'Low': 'badge-green'
    };
    return classes[priority] || 'badge-gray';
  };

  const statusCounts = {
    total: reports.length,
    pending: reports.filter(report => report.status === 'Pending').length,
    reviewed: reports.filter(report => report.status === 'Reviewed').length,
    deleted: reports.filter(report => report.status === 'Message Deleted').length,
    dismissed: reports.filter(report => report.status === 'Dismissed').length
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title flex items-center gap-2">
            <AlertTriangle size={24} />
            Content Moderation
          </h2>
          <p className="card-subtitle">
            Review reported messages and take appropriate moderation actions
          </p>
        </div>
      </div>

     {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">Total Reports</p>
              <p className="text-2xl font-bold text-primary">{statusCounts.total}</p>
            </div>
            <div className="p-3 rounded-lg" style={{backgroundColor: 'var(--accent-blue)', opacity: 0.1}}>
              <Flag size={24} style={{color: 'var(--accent-blue)'}} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">Pending Review</p>
              <p className="text-2xl font-bold" style={{color: 'var(--accent-warning)'}}>{statusCounts.pending}</p>
            </div>
            <div className="p-3 rounded-lg" style={{backgroundColor: 'var(--accent-warning)', opacity: 0.1}}>
              <Clock size={24} style={{color: 'var(--accent-warning)'}} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">Reviewed</p>
              <p className="text-2xl font-bold" style={{color: 'var(--accent-success)'}}>{statusCounts.reviewed}</p>
            </div>
            <div className="p-3 rounded-lg" style={{backgroundColor: 'var(--accent-success)', opacity: 0.1}}>
              <CheckCircle size={24} style={{color: 'var(--accent-success)'}} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">Actions Taken</p>
              <p className="text-2xl font-bold" style={{color: 'var(--accent-danger)'}}>{statusCounts.deleted}</p>
            </div>
            <div className="p-3 rounded-lg" style={{backgroundColor: 'var(--accent-danger)', opacity: 0.1}}>
              <Trash2 size={24} style={{color: 'var(--accent-danger)'}} />
            </div>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Reported Messages</h3>
          <p className="card-subtitle">
            {statusCounts.pending} reports require immediate attention
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Report Details</th>
                <th>Reported Message</th>
                <th>Reason & Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <div className="flex items-start gap-3">
                      <div className="user-avatar">
                        <User size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-primary">{report.reportedUser}</div>
                        <div className="text-sm text-secondary">
                          Reported by: {report.reportedBy}
                        </div>
                        <div className="text-xs text-muted">
                          in {report.chatroom}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted mt-1">
                          <Clock size={12} />
                          {report.timestamp}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="max-w-xs">
                      <div className="text-sm text-primary mb-2 p-3 rounded-lg" style={{backgroundColor: 'var(--bg-tertiary)'}}>
                        <MessageSquare size={14} className="inline mr-1" />
                        "{report.message}"
                      </div>
                      <button 
                        onClick={() => handleViewMessage(report.id)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View full context
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col gap-2">
                      <span className={`badge ${getReasonBadgeClass(report.reason)}`}>
                        {report.reason}
                      </span>
                      <span className={`badge ${getPriorityBadgeClass(report.priority)}`}>
                        {report.priority} Priority
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleViewUser(report.reportedUser)}
                        className="btn btn-ghost btn-sm"
                        title="View user profile"
                      >
                        <Eye size={16} />
                        <span className="text-xs">View User</span>
                      </button>
                      
                      {report.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleDeleteMessage(report.id)}
                            className="btn btn-danger btn-sm"
                            title="Delete message"
                          >
                            <Trash2 size={16} />
                            <span className="text-xs">Delete</span>
                          </button>
                          <button
                            onClick={() => handleMarkReviewed(report.id)}
                            className="btn btn-success btn-sm"
                            title="Mark as reviewed"
                          >
                            <CheckCircle size={16} />
                            <span className="text-xs">Approve</span>
                          </button>
                          <button
                            onClick={() => handleDismiss(report.id)}
                            className="btn btn-ghost btn-sm"
                            title="Dismiss report"
                          >
                            <span className="text-xs">Dismiss</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Moderation Guidelines */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Moderation Guidelines</h3>
          <p className="card-subtitle">Quick reference for content review</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg" style={{backgroundColor: 'var(--bg-secondary)'}}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'var(--accent-danger)'}}></div>
              <span className="font-medium text-primary">High Priority</span>
            </div>
            <ul className="text-sm text-secondary space-y-1">
              <li>• Harassment or bullying</li>
              <li>• Spam or phishing attempts</li>
              <li>• Hate speech or discrimination</li>
              <li>• Threats or violence</li>
            </ul>
          </div>
          
          <div className="p-4 rounded-lg" style={{backgroundColor: 'var(--bg-secondary)'}}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'var(--accent-warning)'}}></div>
              <span className="font-medium text-primary">Medium Priority</span>
            </div>
            <ul className="text-sm text-secondary space-y-1">
              <li>• Inappropriate content</li>
              <li>• Off-topic discussions</li>
              <li>• Excessive self-promotion</li>
              <li>• Minor policy violations</li>
            </ul>
          </div>
          
          <div className="p-4 rounded-lg" style={{backgroundColor: 'var(--bg-secondary)'}}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'var(--accent-success)'}}></div>
              <span className="font-medium text-primary">Low Priority</span>
            </div>
            <ul className="text-sm text-secondary space-y-1">
              <li>• False reports</li>
              <li>• Minor disagreements</li>
              <li>• Formatting issues</li>
              <li>• Duplicate content</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlaggedContent;
        