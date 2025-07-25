import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, MessageSquare, AlertTriangle, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  // Mock data for charts
  const dailyActiveUsers = [
    { day: 'Mon', users: 120 },
    { day: 'Tue', users: 150 },
    { day: 'Wed', users: 180 },
    { day: 'Thu', users: 165 },
    { day: 'Fri', users: 200 },
    { day: 'Sat', users: 140 },
    { day: 'Sun', users: 110 }
  ];

  const usersByRole = [
    { role: 'Students', count: 450 },
    { role: 'Alumni', count: 180 },
    { role: 'Mentors', count: 75 }
  ];

  const timeOnPlatform = [
    { month: 'Jan', time: 25 },
    { month: 'Feb', time: 30 },
    { month: 'Mar', time: 35 },
    { month: 'Apr', time: 40 },
    { month: 'May', time: 38 },
    { month: 'Jun', time: 42 }
  ];

  const topChatrooms = [
    { name: 'General Discussion', value: 35, color: '#3A86FF' },
    { name: 'Career Advice', value: 25, color: '#82ca9d' },
    { name: 'Tech Talk', value: 20, color: '#ffc658' },
    { name: 'Alumni Network', value: 15, color: '#FF595E' },
    { name: 'Study Groups', value: 5, color: '#8dd1e1' }
  ];

  const quickStats = [
    { title: 'Daily Active Users', value: '1,234', icon: Users, color: 'theme-bg-primary' },
    { title: 'Monthly Active Users', value: '12,456', icon: Users, color: 'bg-green-500' },
    { title: 'Messages sent today', value: '3,456', icon: MessageSquare, color: 'bg-purple-500' },
    { title: 'Reports in last 24h', value: '12', icon: AlertTriangle, color: 'theme-bg-report-red' }
  ];

  const recentReports = [
    { id: 1, user: 'John Doe', reason: 'Spam', time: '2 hours ago', status: 'pending' },
    { id: 2, user: 'Jane Smith', reason: 'Harassment', time: '4 hours ago', status: 'reviewed' },
    { id: 3, user: 'Mike Johnson', reason: 'Inappropriate Content', time: '6 hours ago', status: 'pending' }
  ];

  const announcements = [
    { id: 1, title: 'New Feature: Video Calls', date: '2025-01-20', priority: 'high' },
    { id: 2, title: 'Maintenance Scheduled', date: '2025-01-22', priority: 'medium' },
    { id: 3, title: 'Community Guidelines Update', date: '2025-01-18', priority: 'low' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="theme-bg-dropdown rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold theme-text-header mb-2">📊 Dashboard Overview</h2>
        <p className="theme-text-subtitle">Welcome to the Unichat Admin Portal. Here's your platform overview.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="theme-bg-dropdown rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium theme-text-subtitle">{stat.title}</p>
                  <p className="text-2xl font-bold theme-text-header">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Active Users */}
        <div className="theme-bg-dropdown rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold theme-text-header mb-4">Daily Active Users</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyActiveUsers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#3A86FF" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Users by Role */}
        <div className="theme-bg-dropdown rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold theme-text-header mb-4">Users by Role</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={usersByRole}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="role" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3A86FF" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Average Time on Platform */}
        <div className="theme-bg-dropdown rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold theme-text-header mb-4">Average Time on Platform (minutes)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeOnPlatform}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="time" stroke="#3A86FF" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Chatrooms */}
        <div className="theme-bg-dropdown rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold theme-text-header mb-4">Top Chatrooms</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topChatrooms}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {topChatrooms.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Reports and Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <div className="theme-bg-dropdown rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold theme-text-header mb-4">Recent Reports</h3>
          <div className="space-y-3">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 theme-bg-dropdown-hover rounded-lg">
                <div>
                  <p className="font-medium theme-text-header">{report.user}</p>
                  <p className="text-sm theme-text-subtitle">{report.reason} • {report.time}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {report.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="theme-bg-dropdown rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold theme-text-header mb-4">Announcements</h3>
          <div className="space-y-3">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="flex items-center justify-between p-3 theme-bg-dropdown-hover rounded-lg">
                <div>
                  <p className="font-medium theme-text-header">{announcement.title}</p>
                  <p className="text-sm theme-text-subtitle">{announcement.date}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  announcement.priority === 'high' ? 'bg-red-100 text-red-800' :
                  announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {announcement.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

