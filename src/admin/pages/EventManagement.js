import React, { useState } from 'react';
import { Calendar, Users, CheckCircle, XCircle, Trash2 } from 'lucide-react';

const EventManagement = () => {
  const [events, setEvents] = useState([
    {
      id: 'E101',
      name: 'Virtual Job Fair',
      description: 'Connect with top employers and explore career opportunities',
      date: 'Jun 28, 2025',
      attendees: 45,
      organizer: 'Career Services',
      status: 'Pending'
    },
    {
      id: 'E102',
      name: 'Mentor Meetup',
      description: 'Monthly networking event for mentors and mentees',
      date: 'Jul 10, 2025',
      attendees: 28,
      organizer: 'Alumni Association',
      status: 'Approved'
    },
    {
      id: 'E103',
      name: 'Alumni Networking',
      description: 'Annual alumni networking and reunion event',
      date: 'Jul 22, 2025',
      attendees: 67,
      organizer: 'Student Council',
      status: 'Pending'
    },
    {
      id: 'E104',
      name: 'Tech Workshop',
      description: 'Hands-on workshop on latest web technologies',
      date: 'Aug 5, 2025',
      attendees: 15,
      organizer: 'Tech Club',
      status: 'Rejected'
    }
  ]);

  const handleApprove = (eventId) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, status: 'Approved' } : event
    ));
  };

  const handleReject = (eventId) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, status: 'Rejected' } : event
    ));
  };

  const handleDelete = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const eventStats = {
    total: events.length,
    pending: events.filter(event => event.status === 'Pending').length,
    approved: events.filter(event => event.status === 'Approved').length,
    totalAttendees: events.reduce((sum, event) => sum + event.attendees, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="theme-bg-dropdown rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold theme-text-header mb-2">📅 Upcoming Events</h2>
        <p className="theme-text-subtitle">Approve or delete user-created events</p>
      </div>

      {/* Events Management Section */}
      <div className="theme-bg-dropdown rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold theme-text-header mb-4">Events Management</h3>
        <p className="text-sm theme-text-subtitle mb-6">Total events: {events.length}</p>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="theme-bg-footer">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium theme-text-subtitle uppercase tracking-wider">
                  Event ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium theme-text-subtitle uppercase tracking-wider">
                  Event Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium theme-text-subtitle uppercase tracking-wider">
                  Date
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
              {events.map((event) => (
                <tr key={event.id} className="theme-bg-dropdown-hover transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium theme-text-header">
                    {event.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <div className="text-sm font-medium theme-text-header">{event.name}</div>
                      <div className="text-sm theme-text-subtitle mb-2">{event.description}</div>
                      <div className="flex items-center text-xs theme-text-subtitle">
                        <Users className="w-3 h-3 mr-1" />
                        {event.attendees} attendees • by {event.organizer}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 theme-text-primary mr-2" />
                      <span className="text-sm theme-text-header">{event.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(event.status)}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {event.status === 'Pending' ? (
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={() => handleApprove(event.id)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(event.id)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Reject
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-white theme-bg-report-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-white theme-bg-report-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="theme-bg-dropdown rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold theme-text-primary mb-2">{eventStats.total}</div>
          <div className="text-sm font-medium theme-text-subtitle">Total Events</div>
        </div>
        <div className="theme-bg-dropdown rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-2">{eventStats.pending}</div>
          <div className="text-sm font-medium theme-text-subtitle">Pending</div>
        </div>
        <div className="theme-bg-dropdown rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{eventStats.approved}</div>
          <div className="text-sm font-medium theme-text-subtitle">Approved</div>
        </div>
        <div className="theme-bg-dropdown rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold theme-text-primary mb-2">{eventStats.totalAttendees}</div>
          <div className="text-sm font-medium theme-text-subtitle">Total Attendees</div>
        </div>
      </div>
    </div>
  );
};

export default EventManagement;

