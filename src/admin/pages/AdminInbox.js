import React, { useState } from 'react';
import { Mail, Clock, User, Trash2, CheckCircle } from 'lucide-react';

const AdminInbox = () => {
  const [messages, setMessages] = useState([
    {
      id: 'M001',
      senderName: 'Sarah Johnson',
      senderEmail: 'sarah.johnson@university.edu',
      subject: 'Account Verification Issue',
      message: 'Hi, I\'m having trouble verifying my account. I uploaded my student ID but it\'s still pending. Can you help?',
      timestamp: '2025-06-22 09:15',
      priority: 'High',
      status: 'Unread'
    },
    {
      id: 'M002',
      senderName: 'Mike Chen',
      senderEmail: 'mike.chen@alumni.edu',
      subject: 'Feature Request',
      message: 'Would it be possible to add a dark mode to the platform? Many users have been asking for this feature.',
      timestamp: '2025-06-21 16:30',
      priority: 'Medium',
      status: 'Read'
    },
    {
      id: 'M003',
      senderName: 'Emma Wilson',
      senderEmail: 'emma.wilson@university.edu',
      subject: 'Bug Report',
      message: 'I found a bug in the chat system. Messages are not loading properly when I scroll up to see older messages.',
      timestamp: '2025-06-21 14:45',
      priority: 'High',
      status: 'Replied'
    },
    {
      id: 'M004',
      senderName: 'Alex Thompson',
      senderEmail: 'alex.thompson@mentor.edu',
      subject: 'General Inquiry',
      message: 'How can I update my mentor profile information? I can\'t find the edit option in my profile settings.',
      timestamp: '2025-06-20 11:20',
      priority: 'Low',
      status: 'Read'
    }
  ]);

  const handleMarkAsRead = (messageId) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, status: 'Read' } : msg
    ));
  };

  const handleReply = (messageId) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, status: 'Replied' } : msg
    ));
    alert('Reply functionality would open email client or internal messaging system');
  };

  const handleDelete = (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setMessages(messages.filter(msg => msg.id !== messageId));
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Unread':
        return 'bg-blue-100 text-blue-800';
      case 'Read':
        return 'bg-gray-100 text-gray-800';
      case 'Replied':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const messageStats = {
    total: messages.length,
    unread: messages.filter(msg => msg.status === 'Unread').length,
    highPriority: messages.filter(msg => msg.priority === 'High').length
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="theme-bg-dropdown rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold theme-text-header mb-2">📧 Admin Inbox</h2>
        <p className="theme-text-subtitle">Manage contact messages and user inquiries</p>
      </div>

      {/* Messages Section */}
      <div className="theme-bg-dropdown rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold theme-text-header mb-4">Contact Messages</h3>
        <p className="text-sm theme-text-subtitle mb-6">Total messages: {messages.length}</p>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="theme-bg-footer">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium theme-text-subtitle uppercase tracking-wider">
                  Sender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium theme-text-subtitle uppercase tracking-wider">
                  Subject & Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium theme-text-subtitle uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium theme-text-subtitle uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium theme-text-subtitle uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="theme-bg-dropdown divide-y divide-gray-200">
              {messages.map((message) => (
                <tr key={message.id} className={`theme-bg-dropdown-hover transition-colors duration-200 ${
                  message.status === 'Unread' ? 'bg-blue-50' : ''
                }`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-4 h-4 theme-text-primary mr-2" />
                      <div>
                        <div className="text-sm font-medium theme-text-header">{message.senderName}</div>
                        <div className="text-sm theme-text-subtitle">{message.senderEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <div className="text-sm font-medium theme-text-header mb-1">{message.subject}</div>
                      <div className="text-sm theme-text-subtitle mb-2 line-clamp-2">{message.message}</div>
                      <div className="flex items-center text-xs theme-text-subtitle">
                        <Clock className="w-3 h-3 mr-1" />
                        {message.timestamp}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadgeColor(message.priority)}`}>
                      {message.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(message.status)}`}>
                      {message.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col space-y-1">
                      {message.status === 'Unread' && (
                        <button
                          onClick={() => handleMarkAsRead(message.id)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-white theme-bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                          <Mail className="w-3 h-3 mr-1" />
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => handleReply(message.id)}
                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Reply
                      </button>
                      <button
                        onClick={() => handleDelete(message.id)}
                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-white theme-bg-report-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </button>
                    </div>
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
          <div className="text-3xl font-bold theme-text-primary mb-2">{messageStats.total}</div>
          <div className="text-sm font-medium theme-text-subtitle">Total Messages</div>
        </div>
        <div className="theme-bg-dropdown rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{messageStats.unread}</div>
          <div className="text-sm font-medium theme-text-subtitle">Unread</div>
        </div>
        <div className="theme-bg-dropdown rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">{messageStats.highPriority}</div>
          <div className="text-sm font-medium theme-text-subtitle">High Priority</div>
        </div>
      </div>
    </div>
  );
};

export default AdminInbox;

