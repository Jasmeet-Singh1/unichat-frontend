import {
  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Browse from "./pages/Browse";
import Chat from "./pages/Chat";
import Notification from "./pages/Notification";
import MentorRequest from "./pages/MentorRequest";
import AlumniDashboard from "./pages/AlumniDashboard";
import Forums from "./pages/Forums";
import Profile from "./pages/Profile";
import Feedback from "./pages/Feedback";
import AlumniForums from "./pages/AlumniFourms";
import AlumniMessages from "./pages/AlumniMessages";
import AlumniMentorStudent from "./pages/AlumniMentorStudents";
import AlumniSetting from "./pages/AlumniSetting";
import AlumniViewEvents from "./pages/AlumniViewEvents";
import Layout from "./pages/Layout";
import AlumniCreateForums from "./pages/AlumniCreateForums";


const WithNavbar = ({ children, role }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
    }}
  >
    <Navbar role={role} />
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        backgroundColor: "#F5F7FA",
        padding: "1rem",
      }}
    >
      {children}
    </div>
    <Footer />
  </div>
);

function App() {
 const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
    } else {
      navigate('/login');
    }
    console.log("Role retrieved from localStorage:", storedRole);
  }, [navigate]);

  return (
    <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />

        {/* Alumni */}
        {role === "Alumni" ? (
          <>
            <Route element={<Layout />}>
              <Route path="/" element={<AlumniDashboard />} />
              <Route path="/forums" element={<AlumniForums />} />
              <Route path="/createforums" element={<AlumniCreateForums />} />
              <Route path="/messages" element={<AlumniMessages />} />
              <Route path="/mentor" element={<AlumniMentorStudent />} />
              <Route path="/settings" element={<AlumniSetting />} />
              <Route path="/events" element={<AlumniViewEvents />} />
            </Route>
          </>
        ) : (
          <>
            {/* Student or Mentor */}
            <Route
              path="/"
              element={
                <WithNavbar role={role}>
                  <Dashboard role={role} />
                </WithNavbar>
              }
            />
            <Route
              path="/forums"
              element={
                <WithNavbar role={role}>
                  <Forums role={role} />
                </WithNavbar>
              }
            />

            <Route
              path="/browse"
              element={
                <WithNavbar role={role}>
                  <Browse role={role} />
                </WithNavbar>
              }
            />
            <Route
              path="/chat"
              element={
                <WithNavbar role={role}>
                  <Chat role={role} />
                </WithNavbar>
              }
            />
            <Route
              path="/profile"
              element={
                <WithNavbar role={role}>
                  <Profile role={role} />
                </WithNavbar>
              }
            />
            <Route
              path="/feedback"
              element={
                <WithNavbar role={role}>
                  <Feedback role={role} />
                </WithNavbar>
              }
            />

            {/* Mentor-specific */}
            {role === "Mentor" && (
              <Route
                path="/mentor-request"
                element={
                  <WithNavbar role={role}>
                    <MentorRequest />
                  </WithNavbar>
                }
              />
            )}

            {/* Student-specific */}
            {role === "Student" && (
              <Route
                path="/notifications"
                element={
                  <WithNavbar role={role}>
                    <Notification role={role} />
                  </WithNavbar>
                }
              />
            )}
          </>
        )}

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
}

export default App;
