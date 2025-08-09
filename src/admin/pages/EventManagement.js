// src/admin/pages/EventManagement.js
import React, { useState } from 'react';
import { Calendar, Users, CheckCircle, XCircle, Trash2, Clock, MapPin, Eye } from 'lucide-react';
import '../styles/AdminPortal.css';

const EventManagement = () => {
  const [events, setEvents] = useState([
    {
      id: 'E101',
      name: 'Virtual Job Fair 2025',
      description: 'Connect with top employers and explore career opportunities across various industries',
      date: '2025-02-28',
      time: '10:00 AM',
      attendees: 45,
      maxAttendees: 100,
      organizer: 'Career Services',
      organizerEmail: 'careers@university.edu',
      status: 'Pending',
      category: 'Career',
      location: 'Virtual Event',
      submittedDate: '2025-01-10'
    },
    {
      id: 'E102',
      name: 'Alumni Networking Night',
      description: 'Monthly networking event for mentors, alumni, and current students',
      date: '2025-02-15',
      time: '6:00 PM',
      attendees: 28,
      maxAttendees: 50,
      organizer: 'Alumni Association',
      organizerEmail: 'alumni@university.edu',
      status: 'Approved',
      category: 'Networking',
      location: 'University Hall',
      submittedDate: '2025-01-05'
    },
    {
      id: 'E103',
      name: 'Tech Innovation Summit',
      description: 'Annual summit showcasing latest technology trends and student projects',
      date: '2025-03-22',
      time: '9:00 AM',
      attendees: 67,
      maxAttendees: 150,
      organizer: 'Student Council',
      organizerEmail: 'council@university.edu',
      status: 'Pending',
      category: 'Technology',
      location: 'Main Auditorium',
      submittedDate: '2025-01-12'
    },
    {
      id: 'E104',
      name: 'Web Development Workshop',
      description: 'Hands-on workshop covering modern web development frameworks and best practices',
      date: '2025-02-08',
      time: '2:00 PM',
      attendees: 15,
      maxAttendees: 30,
      organizer: 'Tech Club',
      organizerEmail: 'tech@university.edu',
      status: 'Rejected',
      category: 'Workshop',
      location: 'Computer Lab A',
      submittedDate: '2025-01-08'
    },
    {
      id: 'E105',
      name: 'Entrepreneurship Panel',
      description: 'Panel discussion with successful entrepreneurs sharing their journey and insights',
      date: '2025-03-05',
      time: '4:00 PM',
      attendees: 82,
      maxAttendees: 120,
      organizer: 'Business School',
      organizerEmail: 'business@university.edu',
      status: 'Approved',
      category: 'Business',
      location: 'Conference Center',
      submittedDate: '2025-01-15'
    }
  ]);

  const handleApprove = (eventId) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, status: 'Approved' } : event
    ));
  };

  const handleReject = (eventId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      setEvents(events.map(event => 
        event.id === eventId ? { ...event, status: 'Rejected', rejectionReason: reason } : event
      ));
    }
  };

  const handleDelete = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  const handleViewDetails = (eventId) => {
    alert(`View full event details for ${eventId}`);
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      'Approved': 'badge-green',
      'Pending': 'badge-yellow',
      'Rejected': 'badge-red'
    };
    return classes[status] || 'badge-gray';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Career': 'var(--accent-blue)',
      'Networking': 'var(--accent-success)',
      'Technology': '#8b5cf6',
      'Workshop': 'var(--accent-warning)',
      'Business': 'var(--accent-danger)'
    };
    return colors[category] || 'var(--text-secondary)';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getAttendanceStatus = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return { color: 'var(--accent-danger)', status: 'Nearly Full' };
    if (percentage >= 70) return { color: 'var(--accent-warning)', status: 'Filling Up' };
    return { color: 'var(--accent-success)', status: 'Available' };
  };

  const eventStats = {
    total: events.length,
    pending: events.filter(event => event.status === 'Pending').length,
    approved: events.filter(event => event.status === 'Approved').length,
    rejected: events.filter(event => event.status === 'Rejected').length,
    totalAttendees: events.reduce((sum, event) => sum + event.attendees, 0)
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title flex items-center gap-2">
            <Calendar size={24} />
            Event Management
          </h2>
          <p className="card-subtitle">
            Review and manage user-submitted events for approval
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">Total Events</p>
              <p className="text-2xl font-bold text-primary">{eventStats.total}</p>
            </div>
            <div className="p-3 rounded-lg" style={{backgroundColor: 'var(--accent-blue)', opacity: 0.1}}>
              <Calendar size={24} style={{color: 'var(--accent-blue)'}} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">Pending Review</p>
              <p className="text-2xl font-bold" style={{color: 'var(--accent-warning)'}}>{eventStats.pending}</p>
            </div>
            <div className="p-3 rounded-lg" style={{backgroundColor: 'var(--accent-warning)', opacity: 0.1}}>
              <Clock size={24} style={{color: 'var(--accent-warning)'}} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">Approved</p>
              <p className="text-2xl font-bold" style={{color: 'var(--accent-success)'}}>{eventStats.approved}</p>
            </div>
            <div className="p-3 rounded-lg" style={{backgroundColor: 'var(--accent-success)', opacity: 0.1}}>
              <CheckCircle size={24} style={{color: 'var(--accent-success)'}} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">Total Attendees</p>
              <p className="text-2xl font-bold text-primary">{eventStats.totalAttendees}</p>
            </div>
            <div className="p-3 rounded-lg" style={{backgroundColor: 'var(--accent-blue)', opacity: 0.1}}>
              <Users size={24} style={{color: 'var(--accent-blue)'}} />
            </div>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Submitted Events</h3>
          <p className="card-subtitle">
            {eventStats.pending} events awaiting your approval
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Event Details</th>
                <th>Date & Location</th>
                <th>Organizer</th>
                <th>Attendance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => {
                const attendanceStatus = getAttendanceStatus(event.attendees, event.maxAttendees);
                return (
                  <tr key={event.id}>
                    <td>
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-3 h-3 rounded-full mt-2 flex-shrink-0"
                          style={{ backgroundColor: getCategoryColor(event.category) }}
                        ></div>
                        <div>
                          <div className="font-medium text-primary">{event.name}</div>
                          <div className="text-sm text-secondary mb-2 max-w-md">
                            {event.description}
                          </div>
                          <div 
                            className="text-xs font-medium px-2 py-1 rounded-full inline-block"
                            style={{
                              backgroundColor: `${getCategoryColor(event.category)}15`,
                              color: getCategoryColor(event.category)
                            }}
                          >
                            {event.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-muted" />
                          <span className="text-sm font-medium text-primary">
                            {formatDate(event.date)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-muted" />
                          <span className="text-sm text-secondary">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-muted" />
                          <span className="text-sm text-secondary">{event.location}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="font-medium text-primary">{event.organizer}</div>
                        <div className="text-sm text-secondary">{event.organizerEmail}</div>
                        <div className="text-xs text-muted mt-1">
                          Submitted: {event.submittedDate}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-muted" />
                          <span className="text-sm font-medium text-primary">
                            {event.attendees} / {event.maxAttendees}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${(event.attendees / event.maxAttendees) * 100}%`,
                              backgroundColor: attendanceStatus.color
                            }}
                          ></div>
                        </div>
                        <span 
                          className="text-xs font-medium"
                          style={{ color: attendanceStatus.color }}
                        >
                          {attendanceStatus.status}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(event.status)}`}>
                        {event.status}
                      </span>
                      {event.rejectionReason && (
                        <div className="text-xs text-red-600 mt-1 max-w-32">
                          Reason: {event.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleViewDetails(event.id)}
                          className="btn btn-ghost btn-sm"
                          title="View event details"
                        >
                          <Eye size={14} />
                          <span className="text-xs">View</span>
                        </button>
                        
                        {event.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(event.id)}
                              className="btn btn-success btn-sm"
                              title="Approve event"
                            >
                              <CheckCircle size={14} />
                              <span className="text-xs">Approve</span>
                            </button>
                            <button
                              onClick={() => handleReject(event.id)}
                              className="btn btn-warning btn-sm"
                              title="Reject event"
                            >
                              <XCircle size={14} />
                              <span className="text-xs">Reject</span>
                            </button>
                          </>
                        )}
                        
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="btn btn-danger btn-sm"
                          title="Delete event"
                        >
                          <Trash2 size={14} />
                          <span className="text-xs">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Categories Overview */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Event Categories</h3>
          <p className="card-subtitle">Distribution of events by category</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {['Career', 'Networking', 'Technology', 'Workshop', 'Business'].map((category) => {
            const categoryEvents = events.filter(event => event.category === category);
            const categoryColor = getCategoryColor(category);
            
            return (
              <div key={category} className="text-center p-4 rounded-lg" style={{backgroundColor: 'var(--bg-secondary)'}}>
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{backgroundColor: `${categoryColor}15`}}
                >
                  <Calendar size={20} style={{color: categoryColor}} />
                </div>
                <div className="font-medium text-primary">{category}</div>
                <div className="text-2xl font-bold mt-1" style={{color: categoryColor}}>
                  {categoryEvents.length}
                </div>
                <div className="text-xs text-secondary">
                  {categoryEvents.reduce((sum, event) => sum + event.attendees, 0)} attendees
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventManagement;