// src/admin/pages/AdminInbox.js
import React, { useState } from 'react';
import { Mail, Clock, User, Trash2, CheckCircle, Reply, Archive, Search, Filter } from 'lucide-react';
import '../styles/AdminPortal.css';

const AdminInbox = () => {
  const [messages, setMessages] = useState([
    {
      id: 'M001',
      senderName: 'Sarah Johnson',
      senderEmail: 'sarah.johnson@university.edu',
      subject: 'Account Verification Issue',
      message: 'Hi, I\'m having trouble verifying my account. I uploaded my student ID but it\'s still pending. Can you help me understand what might be wrong?',
      timestamp: '2025-01-15 09:15',
      priority: 'High',
      status: 'Unread',
      category: 'Account Issues'
    },
    {
      id: 'M002',
      senderName: 'Mike Chen',
      senderEmail: 'mike.chen@alumni.edu',
      subject: 'Feature Request - Dark Mode',
      message: 'Would it be possible to add a dark mode to the platform? Many users have been asking for this feature and it would really improve the user experience.',
      timestamp: '2025-01-14 16:30',
      priority: 'Medium',
      status: 'Read',
      category: 'Feature Request'
    },
    {
      id: 'M003',
      senderName: 'Emma Wilson',
      senderEmail: 'emma.wilson@university.edu',
      subject: 'Bug Report - Chat Loading Issues',
      message: 'I found a bug in the chat system. Messages are not loading properly when I scroll up to see older messages. This happens in both Chrome and Firefox.',
      timestamp: '2025-01-14 14:45',
      priority: 'High',
      status: 'Replied',
      category: 'Bug Report'
    },
    {
      id: 'M004',
      senderName: 'Alex Thompson',
      senderEmail: 'alex.thompson@mentor.edu',
      subject: 'Profile Update Help',
      message: 'How can I update my mentor profile information? I can\'t find the edit option in my profile settings. I need to add my new certification.',
      timestamp: '2025-01-13 11:20',
      priority: 'Low',
      status: 'Read',
      category: 'General Support'
    },
    {
      id: 'M005',
      senderName: 'Lisa Martinez',
      senderEmail: 'lisa.martinez@university.edu',
      subject: 'Event Creation Permission',
      message: 'I\'m trying to create an event for our study group but I don\'t seem to have the right permissions. Could you please help me with this?',
      timestamp: '2025-01-13 08:45',
      priority: 'Medium',
      status: 'Archived',
      category: 'Permissions'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

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

  const handleArchive = (messageId) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, status: 'Archived' } : msg
    ));
  };

  const handleDelete = (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setMessages(messages.filter(msg => msg.id !== messageId));
    }
  };

  const getPriorityBadgeClass = (priority) => {
    const classes = {
      'High': 'badge-red',
      'Medium': 'badge-yellow',
      'Low': 'badge-green'
    };
    return classes[priority] || 'badge-gray';
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      'Unread': 'badge-blue',
      'Read': 'badge-gray',
      'Replied': 'badge-green',
      'Archived': 'badge-purple'
    };
    return classes[status] || 'badge-gray';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Account Issues': 'var(--accent-danger)',
      'Feature Request': 'var(--accent-blue)',
      'Bug Report': 'var(--accent-warning)',
      'General Support': 'var(--accent-success)',
      'Permissions': '#8b5cf6'
    };
    return colors[category] || 'var(--text-secondary)';
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || msg.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || msg.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const messageStats = {
    total: messages.length,
    unread: messages.filter(msg => msg.status === 'Unread').length,
    highPriority: messages.filter(msg => msg.priority === 'High').length,
    replied: messages.filter(msg => msg.status === 'Replied').length
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title flex items-center gap-2">
            <Mail size={24} />
            Admin Inbox
          </h2>
          <p className="card-subtitle">
            Manage contact messages and user inquiries
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">Total Messages</p>
              <p className="text-2xl font-bold text-primary">{messageStats.total}</p>
            </div>
            <div className="p-3 rounded-lg" style={{backgroundColor: 'var(--accent-blue)', opacity: 0.1}}>
              <Mail size={24} style={{color: 'var(--accent-blue)'}} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">Unread</p>
              <p className="text-2xl font-bold" style={{color: 'var(--accent-warning)'}}>{messageStats.unread}</p>
            </div>
            <div className="p-3 rounded-lg" style={{backgroundColor: 'var(--accent-warning)', opacity: 0.1}}>
              <CheckCircle size={24} style={{color: 'var(--accent-warning)'}} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">High Priority</p>
              <p className="text-2xl font-bold" style={{color: 'var(--accent-danger)'}}>{messageStats.highPriority}</p>
            </div>
            <div className="p-3 rounded-lg" style={{backgroundColor: 'var(--accent-danger)', opacity: 0.1}}>
              <Clock size={24} style={{color: 'var(--accent-danger)'}} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">Replied</p>
              <p className="text-2xl font-bold" style={{color: 'var(--accent-success)'}}>{messageStats.replied}</p>
            </div>
            <div className="p-3 rounded-lg" style={{backgroundColor: 'var(--accent-success)', opacity: 0.1}}>
              <Reply size={24} style={{color: 'var(--accent-success)'}} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={20} />
              <input
                type="text"
                placeholder="Search messages..."
                className="form-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3">
              <select 
                className="form-input"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Unread">Unread</option>
                <option value="Read">Read</option>
                <option value="Replied">Replied</option>
                <option value="Archived">Archived</option>
              </select>
              
              <select 
                className="form-input"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="All">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Contact Messages</h3>
          <p className="card-subtitle">
            Showing {filteredMessages.length} of {messages.length} messages
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Sender & Subject</th>
                <th>Message Preview</th>
                <th>Category & Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map((message) => (
                <tr key={message.id} className={message.status === 'Unread' ? 'unread-row' : ''}>
                  <td>
                    <div className="flex items-start gap-3">
                      <div className="user-avatar">
                        <User size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-primary">{message.senderName}</div>
                        <div className="text-sm text-secondary">{message.senderEmail}</div>
                        <div className="text-sm font-medium text-primary mt-1">{message.subject}</div>
                        <div className="flex items-center gap-1 text-xs text-muted mt-1">
                          <Clock size={12} />
                          {message.timestamp}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="max-w-xs">
                      <p className="text-sm text-secondary line-clamp-3">
                        {message.message}
                      </p>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col gap-2">
                      <div 
                        className="text-xs font-medium px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: `${getCategoryColor(message.category)}15`,
                          color: getCategoryColor(message.category)
                        }}
                      >
                        {message.category}
                      </div>
                      <span className={`badge ${getPriorityBadgeClass(message.priority)}`}>
                        {message.priority}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(message.status)}`}>
                      {message.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-col gap-1">
                      {message.status === 'Unread' && (
                        <button
                          onClick={() => handleMarkAsRead(message.id)}
                          className="btn btn-ghost btn-sm"
                        >
                          <CheckCircle size={14} />
                          <span className="text-xs">Mark Read</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleReply(message.id)}
                        className="btn btn-success btn-sm"
                      >
                        <Reply size={14} />
                        <span className="text-xs">Reply</span>
                      </button>
                      <button
                        onClick={() => handleArchive(message.id)}
                        className="btn btn-ghost btn-sm"
                      >
                        <Archive size={14} />
                        <span className="text-xs">Archive</span>
                      </button>
                      <button
                        onClick={() => handleDelete(message.id)}
                        className="btn btn-danger btn-sm"
                      >
                        <Trash2 size={14} />
                        <span className="text-xs">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredMessages.length === 0 && (
          <div className="text-center py-8">
            <Mail size={48} className="text-muted mx-auto mb-3" />
            <p className="text-primary font-medium">No messages found</p>
            <p className="text-secondary">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInbox;