import React from "react";

const Navbar = ({ role }) => {
  const safeRole = (role || "mentor").toLowerCase();
  const isStudent = safeRole === "student";
  const isMentor = safeRole === "mentor";

  return (
    <>
      <style>
        {`
        .navbar-wrapper {
          display: flex;
          flex-direction: column;
        }

        .dashboard-header {
          background: linear-gradient(to right, #4c51bf, #6b46c1);
          color: white;
          padding: 24px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .logo-img {
          height: 48px;
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .header-title {
          margin: 0;
          font-size: 20px;
          font-weight: bold;
        }

        .header-subtitle {
          margin: 4px 0 0;
          font-size: 13px;
          color: #e0d3ff;
        }

        .notification-icon {
          font-size: 24px;
          text-decoration: none;
          color: white;
          transition: transform 0.3s;
        }

        .notification-icon:hover {
          transform: scale(1.1);
        }

        .navbar {
          background-color: #e9d8fd;
          color: #5e2ca5;
          display: flex;
          justify-content: center;
          gap: 24px;
          padding: 12px 0;
          font-weight: 600;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          flex-wrap: wrap;
        }

        .navbar a {
          text-decoration: none;
          color: inherit;
          transition: color 0.3s ease;
        }

        .navbar a:hover {
          color: #7e57c2;
        }

        .dropdown {
          position: relative;
        }

        .dropdown-content {
          display: none;
          position: absolute;
          background: white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          border-radius: 6px;
          top: 100%;
          left: 0;
          z-index: 10;
          min-width: 160px;
        }

        .dropdown-content a {
          display: block;
          padding: 10px;
          color: #333;
          text-decoration: none;
        }

        .dropdown-content a:hover {
          background-color: #ede7f6;
        }

        .dropdown:hover .dropdown-content {
          display: block;
        }
      `}
      </style>

      <div className="navbar-wrapper">
        <header className="dashboard-header">
          <div className="header-content">
            <div className="logo-section">
              <img src="/Signup.png" alt="UniChat Logo" className="logo-img" />
              <div>
                <h1 className="header-title">UniChat for {role}s</h1>
                <p className="header-subtitle">
                  Your Campus, Your Voice, Your Community
                </p>
              </div>
            </div>

            {isStudent && (
              <a
                href="/notifications"
                className="notification-icon"
                title="View Notifications"
              >
                🔔
              </a>
            )}
          </div>
        </header>

        <nav className="navbar">
          <a href="/">🏠 Dashboard</a>
          <a href="/browse">🔍 Browse</a>
          <a href="/chat">💬 Chats</a>
          <a href="/forums">📢 Forums</a>

          {isMentor && <a href="/mentor-request">📩 Mentor Requests</a>}

          <div className="dropdown">
            <a href="#">👤 Profile ▾</a>
            <div className="dropdown-content">
              <a href="/profile">View/Edit Profile</a>
              <a href="/feedback">🍋 Feedback</a>
              <a href="/logout">🚪 Logout</a>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
