import React, { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  BarChart3, Users, FileText, AlertTriangle, Calendar, Mail, 
  Settings, Sun, Moon, ChevronDown, User, LogOut, Home, Menu, X 
} from 'lucide-react';
import { ThemeContext } from '../../AdminPortal';
import '../../styles/Layout.css';

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();

  const navigationItems = [
    { 
      title: 'Overview',
      items: [
        { id: 'dashboard', name: 'Dashboard', path: '/admin/dashboard', icon: BarChart3 }
      ]
    },
    {
      title: 'Management',
      items: [
        { id: 'users', name: 'Manage Users', path: '/admin/manage-users', icon: Users },
        { id: 'uploads', name: 'View Uploads', path: '/admin/view-uploads', icon: FileText },
        { id: 'events', name: 'Event Management', path: '/admin/event-management', icon: Calendar }
      ]
    },
    {
      title: 'Moderation',
      items: [
        { id: 'flagged', name: 'Flagged Content', path: '/admin/flagged-content', icon: AlertTriangle },
        { id: 'inbox', name: 'Admin Inbox', path: '/admin/admin-inbox', icon: Mail }
      ]
    },
    {
      title: 'System',
      items: [
        { id: 'settings', name: 'Settings', path: '/admin/settings', icon: Settings }
      ]
    }
  ];

  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      '/admin/dashboard': 'Dashboard',
      '/admin/manage-users': 'Manage Users',
      '/admin/view-uploads': 'View Uploads',
      '/admin/flagged-content': 'Flagged Content',
      '/admin/event-management': 'Event Management',
      '/admin/admin-inbox': 'Admin Inbox',
      '/admin/settings': 'Settings'
    };
    return titles[path] || 'Dashboard';
  };

  const isActive = (path) => {
    return location.pathname === path || 
           (path === '/admin/dashboard' && location.pathname === '/admin/');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      localStorage.removeItem('authToken');
      window.location.href = '/';
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="admin-layout">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="sidebar-overlay" onClick={closeMobileMenu} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <a href="/admin/dashboard" className="sidebar-brand">
            <div className="brand-icon">
              <BarChart3 size={20} color="white" />
            </div>
            <span className="brand-text">UNICHAT</span>
          </a>
        </div>

        <nav className="sidebar-nav">
          {navigationItems.map((section) => (
            <div key={section.title} className="nav-section">
              <div className="nav-section-title">{section.title}</div>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.id}
                    href={item.path}
                    className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    <Icon className="nav-icon" size={20} />
                    {item.name}
                  </a>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p className="sidebar-footer-text">Unichat Admin Portal</p>
          <p className="sidebar-version">v1.0.0</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="admin-header">
          <div className="header-left">
            <button 
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <div className="header-breadcrumb">
              <span className="text-sm font-medium text-muted">UNICHAT</span>
              <span className="breadcrumb-separator">|</span>
              <h1 className="header-title">{getPageTitle()}</h1>
            </div>
          </div>

          <div className="header-right">
            <div className="header-actions">
              <button className="theme-toggle-btn" onClick={toggleTheme}>
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <div className={`user-menu ${isUserMenuOpen ? 'open' : ''}`}>
                <button
                  className="user-menu-trigger"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <div className="user-avatar">
                    <User size={14} />
                  </div>
                  <span>Admin Portal</span>
                  <ChevronDown className="chevron-icon" size={16} />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div className="dropdown-overlay" onClick={() => setIsUserMenuOpen(false)} />
                    <div className="user-dropdown">
                      <div className="dropdown-header">
                        <p className="dropdown-user-name">Admin User</p>
                        <p className="dropdown-user-email">admin@unichat.com</p>
                      </div>
                      
                      <div className="dropdown-menu">
                        <a href="/" className="dropdown-item">
                          <Home size={18} />
                          Go to Main Site
                        </a>
                        
                        <div className="dropdown-divider" />
                        
                        <button onClick={handleLogout} className="dropdown-item danger">
                          <LogOut size={18} />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;