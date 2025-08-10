import { Routes, Route, useNavigate, Navigate, Outlet, useLocation } from 'react-router-dom';
import ChatPage from './pages/Chat';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Logout from './pages/Logout';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Browse from './pages/Browse';
import Notification from './components/Notification';
import MentorRequest from './pages/MentorRequest';
import AlumniDashboard from './pages/AlumniDashboard';
import Forums from './pages/Forums';
import Profile from './pages/Profile';
import Feedback from './pages/Feedback';
import AlumniForums from './pages/AlumniFourms';
import AlumniMessages from './pages/AlumniMessages';
import AlumniMentorStudent from './pages/AlumniMentorStudents';
import AlumniSetting from './pages/AlumniSetting';
import AlumniViewEvents from './pages/AlumniViewEvents';
import Layout from './pages/Layout';
import AlumniCreateForums from './pages/AlumniCreateForums';

// Import Admin Portal
import AdminPortal from './admin/AdminPortal';

const WithNavbar = ({ children, role }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
    }}
  >
    <Navbar role={role} />
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        backgroundColor: '#F5F7FA',
        padding: '1rem',
      }}
    >
      {children}
    </div>
    <Footer />
  </div>
);

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(null);

  const ProtectedRoute = ({ children }) => {
    const storedRole = localStorage.getItem('role');
    if (!storedRole) {
      return <Navigate to='/login' replace />;
    }
    return children ? children : <Outlet />;
  };

  // Check if current path is admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    const allowedPublicRoutes = ['/login', '/signup', '/logout'];
    if (storedRole) {
      setRole(storedRole);
    } else if (!allowedPublicRoutes.includes(location.pathname)) {
      navigate('/login');
    }
    
    console.log('Role retrieved from localStorage:', storedRole);
    console.log('Current path:', location.pathname);
    console.log('Is admin route:', isAdminRoute);
  }, [navigate, location.pathname, isAdminRoute]);

  return (
    <Routes>
      {/* Admin Routes - Must come FIRST to avoid conflicts */}
      <Route path='/admin/*' element={<AdminPortal />} />

      {/* Public Routes */}
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/logout' element={<Logout />} />
      
      {/* Protected User Routes - Only render when NOT admin route */}
      {!isAdminRoute && (
        <Route element={<ProtectedRoute />}>
          {/* Alumni */}
          {role === 'Alumni' ? (
            <>
              <Route element={<Layout />}>
                <Route path='/' element={<AlumniDashboard />} />
                <Route path='/forums' element={<AlumniForums />} />
                <Route path='/createforums' element={<AlumniCreateForums />} />
                <Route path='/messages' element={<AlumniMessages />} />
                <Route path='/mentor' element={<AlumniMentorStudent />} />
                <Route path='/settings' element={<AlumniSetting />} />
                <Route path='/events' element={<AlumniViewEvents />} />
                <Route
                  path='/notifications'
                  element={<Notification role={role} />}
                />
              </Route>
            </>
          ) : (
            <>
              {/* Student or Mentor */}
              <Route
                path='/'
                element={
                  <WithNavbar role={role}>
                    <Dashboard role={role} />
                  </WithNavbar>
                }
              />
              <Route
                path='/forums'
                element={
                  <WithNavbar role={role}>
                    <Forums role={role} />
                  </WithNavbar>
                }
              />
              <Route
                path='/browse'
                element={
                  <WithNavbar role={role}>
                    <Browse role={role} />
                  </WithNavbar>
                }
              />
              <Route
                path='/chat'
                element={<ChatPage role={role} />}
              />
              <Route
                path='/profile'
                element={
                  <WithNavbar role={role}>
                    <Profile role={role} />
                  </WithNavbar>
                }
              />
              <Route
                path='/feedback'
                element={
                  <WithNavbar role={role}>
                    <Feedback role={role} />
                  </WithNavbar>
                }
              />
              {/* Mentor-specific */}
              {role === 'Mentor' && (
                <Route
                  path='/mentor-request'
                  element={
                    <WithNavbar role={role}>
                      <MentorRequest />
                    </WithNavbar>
                  }
                />
              )}
              {/* Notifications for both Student and Mentor */}
              {(role === 'Student' || role === 'Mentor') && (
                <Route
                  path='/notifications'
                  element={
                    <WithNavbar role={role}>
                      <Notification role={role} />
                    </WithNavbar>
                  }
                />
              )}
            </>
          )}
        </Route>
      )}
      
      {/* 404 - Only for non-admin routes */}
      {!isAdminRoute && <Route path='*' element={<NotFound />} />}
    </Routes>
  );
}

export default App;