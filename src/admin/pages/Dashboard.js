// src/admin/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { 
  Users, AlertTriangle, UserCheck, Activity, Database, 
  Server, Wifi, Mail, TrendingUp, Eye, Trash2, BarChart3,
  Clock, CheckCircle, XCircle, MessageSquare, FileText, Calendar
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import '../styles/AdminPortal.css';

const Dashboard = () => {
  // Real-time state management
  const [realTimeData, setRealTimeData] = useState({
    totalUsers: 0,
    onlineUsers: 0,
    activeToday: 0,
    accountRequests: 0,
    pendingReports: 0,
    systemHealth: {
      server: 'operational',
      database: 'operational',
      chatService: 'operational',
      fileStorage: 'warning',
      emailService: 'operational'
    },
    userGrowth: [],
    onlineUsersChart: [],
    recentActivity: []
  });

  const [loading, setLoading] = useState(true);

  // Simulate real-time data fetching
  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        // Simulate API calls - replace with your actual API endpoints
        const [
          usersResponse,
          onlineResponse,
          requestsResponse,
          reportsResponse,
          systemResponse,
          activityResponse
        ] = await Promise.all([
          // Replace these with your actual API calls
          simulateAPICall('/api/admin/users/total'),
          simulateAPICall('/api/admin/users/online'),
          simulateAPICall('/api/admin/requests/pending'),
          simulateAPICall('/api/admin/reports/pending'),
          simulateAPICall('/api/admin/system/health'),
          simulateAPICall('/api/admin/activity/recent')
        ]);

        setRealTimeData({
          totalUsers: usersResponse.total,
          onlineUsers: onlineResponse.count,
          activeToday: onlineResponse.activeToday,
          accountRequests: requestsResponse.pending,
          pendingReports: reportsResponse.count,
          systemHealth: systemResponse.services,
          userGrowth: generateUserGrowthData(),
          onlineUsersChart: generateOnlineUsersData(),
          recentActivity: generateRecentActivity()
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRealTimeData();

    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchRealTimeData, 30000);

    return () => clearInterval(interval);
  }, []);

  // Simulate API calls - replace with your actual API functions
  const simulateAPICall = async (endpoint) => {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
    
    switch (endpoint) {
      case '/api/admin/users/total':
        return { total: Math.floor(Math.random() * 1000) + 2500 };
      case '/api/admin/users/online':
        return { 
          count: Math.floor(Math.random() * 200) + 100,
          activeToday: Math.floor(Math.random() * 500) + 1000
        };
      case '/api/admin/requests/pending':
        return { pending: Math.floor(Math.random() * 15) + 5 };
      case '/api/admin/reports/pending':
        return { count: Math.floor(Math.random() * 25) + 10 };
      case '/api/admin/system/health':
        return {
          services: {
            server: Math.random() > 0.1 ? 'operational' : 'warning',
            database: Math.random() > 0.05 ? 'operational' : 'error'
          }
        };
      default:
        return {};
    }
  };

  const generateUserGrowthData = () => {
    const data = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        users: Math.floor(Math.random() * 100) + 50,
        growth: Math.floor(Math.random() * 20) - 10
      });
    }
    return data;
  };

  const generateOnlineUsersData = () => {
    const data = [];
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now);
      hour.setHours(hour.getHours() - i);
      data.push({
        time: hour.getHours() + ':00',
        online: Math.floor(Math.random() * 150) + 50
      });
    }
    return data;
  };

  const generateRecentActivity = () => {
    const activities = [
      { type: 'user_join', message: 'New user registration', user: 'sarah.martinez@university.edu', time: '2 minutes ago' },
      { type: 'report', message: 'Content reported in General Chat', user: 'Content Moderator', time: '5 minutes ago' },
      { type: 'verification', message: 'Document verified', user: 'alex.chen@university.edu', time: '8 minutes ago' },
      { type: 'event', message: 'Event approved: Tech Workshop', user: 'Event Team', time: '12 minutes ago' },
      { type: 'user_join', message: 'New mentor application', user: 'dr.wilson@university.edu', time: '15 minutes ago' }
    ];
    return activities;
  };

  const getSystemStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'var(--accent-success)';
      case 'warning': return 'var(--accent-warning)';
      case 'error': return 'var(--accent-danger)';
      default: return 'var(--text-muted)';
    }
  };

  const getSystemStatusText = (status) => {
    switch (status) {
      case 'operational': return 'Operational';
      case 'warning': return 'Warning';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_join': return Users;
      case 'report': return AlertTriangle;
      case 'verification': return CheckCircle;
      case 'event': return Calendar;
      default: return Activity;
    }
  };

  const getGrowthPercentage = () => {
    if (realTimeData.userGrowth.length < 2) return 0;
    const recent = realTimeData.userGrowth.slice(-7);
    const older = realTimeData.userGrowth.slice(-14, -7);
    const recentAvg = recent.reduce((sum, day) => sum + day.users, 0) / recent.length;
    const olderAvg = older.reduce((sum, day) => sum + day.users, 0) / older.length;
    return ((recentAvg - olderAvg) / olderAvg * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="loading-spinner"></div>
        <span className="ml-3 text-primary">Loading dashboard data...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title flex items-center gap-2">
            <BarChart3 size={24} />
            Admin Dashboard
          </h2>
          <p className="card-subtitle">
            Real-time overview of your Unichat platform • Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="card hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">Total Users</p>
              <p className="text-3xl font-bold text-primary">{realTimeData.totalUsers.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-sm text-success mt-1">
                <TrendingUp size={14} />
                <span>+{getGrowthPercentage()}% this week</span>
              </div>
            </div>
            <div className="p-4 rounded-xl" style={{backgroundColor: 'var(--accent-blue)', opacity: 0.1}}>
              <Users size={28} style={{color: 'var(--accent-blue)'}} />
            </div>
          </div>
        </div>

        {/* Online Users */}
        <div className="card hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">Currently Online</p>
              <p className="text-3xl font-bold" style={{color: 'var(--accent-success)'}}>{realTimeData.onlineUsers}</p>
              <div className="flex items-center gap-1 text-sm text-secondary mt-1">
                <div className="status-dot online"></div>
                <span>Live count</span>
              </div>
            </div>
            <div className="p-4 rounded-xl" style={{backgroundColor: 'var(--accent-success)', opacity: 0.1}}>
              <Activity size={28} style={{color: 'var(--accent-success)'}} />
            </div>
          </div>
        </div>

        {/* Account Requests */}
        <div className="card hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">Account Requests</p>
              <p className="text-3xl font-bold" style={{color: 'var(--accent-warning)'}}>{realTimeData.accountRequests}</p>
              <div className="text-sm text-secondary mt-1">Pending approval</div>
            </div>
            <div className="p-4 rounded-xl" style={{backgroundColor: 'var(--accent-warning)', opacity: 0.1}}>
              <UserCheck size={28} style={{color: 'var(--accent-warning)'}} />
            </div>
          </div>
        </div>

        {/* Pending Reports */}
        <div className="card hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">Pending Reports</p>
              <p className="text-3xl font-bold" style={{color: 'var(--accent-danger)'}}>{realTimeData.pendingReports}</p>
              <div className="text-sm text-secondary mt-1">Require review</div>
            </div>
            <div className="p-4 rounded-xl" style={{backgroundColor: 'var(--accent-danger)', opacity: 0.1}}>
              <AlertTriangle size={28} style={{color: 'var(--accent-danger)'}} />
            </div>
          </div>
        </div>
      </div>

      {/* Active Today Card */}
      <div className="card">
        <div className="flex items-center justify-between p-6">
          <div>
            <p className="text-lg text-secondary mb-2">Active Today</p>
            <p className="text-4xl font-bold text-primary">{realTimeData.activeToday.toLocaleString()}</p>
            <div className="flex items-center gap-2 text-sm text-success mt-2">
              <TrendingUp size={16} />
              <span>+8% from yesterday</span>
            </div>
          </div>
          <div className="flex-1 max-w-md">
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={realTimeData.onlineUsersChart.slice(-12)}>
                <Line 
                  type="monotone" 
                  dataKey="online" 
                  stroke="var(--accent-blue)" 
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">User Growth (Last 30 Days)</h3>
              <p className="card-subtitle">Daily new user registrations</p>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={realTimeData.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).getDate().toString()}
                  stroke="var(--text-secondary)"
                />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="var(--accent-blue)" 
                  strokeWidth={2}
                  dot={{fill: 'var(--accent-blue)', strokeWidth: 2, r: 4}}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health */}
        <div>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title flex items-center gap-2">
                <Server size={20} />
                System Health
              </h3>
              <p className="card-subtitle">Real-time service status</p>
            </div>
            
            <div className="space-y-4">
              {Object.entries(realTimeData.systemHealth).map(([service, status]) => (
                <div key={service} className="flex items-center justify-between p-3 rounded-lg" style={{backgroundColor: 'var(--bg-secondary)'}}>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{backgroundColor: getSystemStatusColor(status)}}
                    ></div>
                    <span className="font-medium text-primary capitalize">
                      {service.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                  <span 
                    className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: getSystemStatusColor(status),
                      color: 'white'
                    }}
                  >
                    {getSystemStatusText(status)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t" style={{borderColor: 'var(--border-color)'}}>
              <button className="btn btn-primary w-full">
                <Eye size={16} />
                View Detailed Logs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
            <p className="card-subtitle">Common administrative tasks</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="btn btn-ghost p-6 h-auto flex-col items-center gap-3 hover-lift">
              <Users size={24} />
              <div className="text-center">
                <div className="font-medium">Manage Users</div>
                <div className="text-xs text-secondary">View & delete accounts</div>
              </div>
            </button>
            <button className="btn btn-ghost p-6 h-auto flex-col items-center gap-3 hover-lift">
              <AlertTriangle size={24} />
              <div className="text-center">
                <div className="font-medium">Review Reports</div>
                <div className="text-xs text-secondary">{realTimeData.pendingReports} pending</div>
              </div>
            </button>
            <button className="btn btn-ghost p-6 h-auto flex-col items-center gap-3 hover-lift">
              <UserCheck size={24} />
              <div className="text-center">
                <div className="font-medium">Account Requests</div>
                <div className="text-xs text-secondary">{realTimeData.accountRequests} waiting</div>
              </div>
            </button>
            <button className="btn btn-ghost p-6 h-auto flex-col items-center gap-3 hover-lift">
              <Mail size={24} />
              <div className="text-center">
                <div className="font-medium">Admin Inbox</div>
                <div className="text-xs text-secondary">Check messages</div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
            <p className="card-subtitle">Latest platform events</p>
          </div>
          
          <div className="space-y-3">
            {realTimeData.recentActivity.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary transition-colors">
                  <div className="p-2 rounded-lg flex-shrink-0" style={{backgroundColor: 'var(--accent-blue)', opacity: 0.1}}>
                    <Icon size={16} style={{color: 'var(--accent-blue)'}} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-primary font-medium">
                      {activity.message}
                    </p>
                    <p className="text-xs text-secondary mt-1">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t" style={{borderColor: 'var(--border-color)'}}>
            <button className="btn btn-ghost w-full">
              View All Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;