import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, // New icon for approval management
  Upload, 
  Flag, 
  Calendar, 
  Inbox, 
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navigationItems = [
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Users', path: '/admin/manage-users', icon: Users },
    { name: 'Approval Management', path: '/admin/approvals', icon: UserCheck }, // New item
    { name: 'View Uploads', path: '/admin/view-uploads', icon: Upload },
    { name: 'Flagged Content Review', path: '/admin/flagged-content', icon: Flag },
    { name: 'Event Management', path: '/admin/event-management', icon: Calendar },
    { name: 'Admin Inbox', path: '/admin/admin-inbox', icon: Inbox },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path) => {
    return location.pathname === path || (path === '/admin/dashboard' && location.pathname === '/admin/');
  };

  const sidebarStyles = {
    container: {
      background: 'linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%)',
      width: '280px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '4px 0 20px rgba(139, 92, 246, 0.3)',
    },
    logo: {
      padding: '24px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
    },
    logoIcon: {
      width: '40px',
      height: '40px',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoText: {
      color: 'white',
      fontSize: '20px',
      fontWeight: 'bold',
    },
    nav: {
      flex: 1,
      padding: '16px 0',
    },
    navItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 24px',
      color: 'rgba(255, 255, 255, 0.8)',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      borderRight: '4px solid transparent',
    },
    navItemActive: {
      background: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      borderRight: '4px solid white',
    },
    navItemHover: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
    },
    footer: {
      padding: '16px',
      borderTop: '1px solid rgba(255, 255, 255, 0.2)',
      textAlign: 'center',
    }
  };

  return (
    <div style={sidebarStyles.container}>
      {/* Logo Section */}
      <div style={sidebarStyles.logo}>
        <div style={sidebarStyles.logoContainer}>
          <div style={sidebarStyles.logoIcon}>
            <svg style={{ width: '20px', height: '20px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <span style={sidebarStyles.logoText}>UNICHAT</span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={sidebarStyles.nav}>
        <div>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...sidebarStyles.navItem,
                  ...(active ? sidebarStyles.navItemActive : {}),
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    Object.assign(e.target.style, sidebarStyles.navItemHover);
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                  }
                }}
              >
                <Icon style={{ width: '20px', height: '20px', marginRight: '12px' }} />
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer Info */}
      <div style={sidebarStyles.footer}>
        <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 4px 0' }}>
          Unichat Admin Portal
        </p>
        <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', margin: '0' }}>
          v1.0.0
        </p>
      </div>
    </div>
  );
};

export default Sidebar;