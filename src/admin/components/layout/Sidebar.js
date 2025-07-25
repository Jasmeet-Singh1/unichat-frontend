import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Upload, 
  Flag, 
  Calendar, 
  Inbox, 
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navigationItems = [
    { name: 'Admin Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Manage Users', path: '/manage-users', icon: Users },
    { name: 'View Uploads', path: '/view-uploads', icon: Upload },
    { name: 'Flagged Content Review', path: '/flagged-content', icon: Flag },
    { name: 'Event Management', path: '/event-management', icon: Calendar },
    { name: 'Admin Inbox', path: '/admin-inbox', icon: Inbox },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const isActive = (path) => {
    return location.pathname === path || (path === '/dashboard' && location.pathname === '/');
  };

  return (
    <div className="theme-bg-navbar text-white w-64 min-h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="bg-white text-gray-800 p-2 rounded-lg font-bold text-xl">
            UNICHAT
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'theme-bg-primary text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer Info */}
      <div className="p-4">
        <div className="text-center">
          <p className="text-xs text-gray-400">Unichat Admin Portal</p>
          <p className="text-xs text-gray-500">v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

