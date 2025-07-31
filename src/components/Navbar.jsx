import React, { useState, useEffect } from "react";

const Navbar = ({ role }) => {
  const safeRole = (role || "mentor").toLowerCase();
  const isStudent = safeRole === "student";
  const isMentor = safeRole === "mentor";

  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "maroon" : "light"));
  };

  return (
    <>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap');

        body.light {
          background-color: #fefefe;
          color: #222;
        }

        body.maroon {
          background-color: #3e1e26;
          color: #fefefe;
        }

        .navbar-wrapper {
          font-family: 'Nunito', sans-serif;
          animation: fadeIn 1s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dashboard-header {
          background: linear-gradient(to right, #4c0519, #800000);
          color: white;
          padding: 24px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
          transition: background 0.5s ease;
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
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
          transition: transform 0.3s ease;
        }

        .logo-img:hover {
          transform: scale(1.1) rotate(2deg);
        }

        .header-title {
          margin: 0;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .header-subtitle {
          margin-top: 4px;
          font-size: 13px;
          color: #ffc2d1;
        }

        .notification-icon {
          font-size: 24px;
          text-decoration: none;
          color: white;
          animation: bell-shake 2s infinite;
        }

        @keyframes bell-shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(10deg); }
          75% { transform: rotate(-10deg); }
        }

        .navbar {
          background: var(--nav-bg, #fff);
          color: var(--nav-color, #800000);
          display: flex;
          justify-content: center;
          gap: 28px;
          padding: 14px 0;
          font-weight: 700;
          flex-wrap: wrap;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          transition: background 0.4s ease;
        }

        body.light .navbar {
          --nav-bg: #fff;
          --nav-color: #800000;
        }

        body.maroon .navbar {
          --nav-bg: #2d0a12;
          --nav-color: #ffc2d1;
        }

        .navbar a {
          text-decoration: none;
          color: inherit;
          transition: color 0.3s ease, transform 0.2s ease;
          position: relative;
        }

        .navbar a::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -4px;
          width: 100%;
          height: 2px;
          background-color: currentColor;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s ease;
        }

        .navbar a:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }

        .navbar a:hover {
          transform: translateY(-2px);
          color: #c084fc;
        }

        .dropdown {
          position: relative;
        }

        .dropdown-content {
          display: none;
          position: absolute;
          background: white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          border-radius: 6px;
          top: 100%;
          left: 0;
          z-index: 10;
          min-width: 160px;
          overflow: hidden;
        }

        .dropdown-content a {
          display: block;
          padding: 10px;
          color: #333;
          background: #f7f2f9;
          text-decoration: none;
          transition: background 0.3s;
        }

        .dropdown-content a:hover {
          background-color: #e8def8;
        }

        .dropdown:hover .dropdown-content {
          display: block;
        }

        .theme-toggle {
          background-color: #fff;
          color: #800000;
          border: 1px solid #800000;
          border-radius: 20px;
          padding: 6px 14px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.3s ease;
        }

        .theme-toggle:hover {
          background-color: #800000;
          color: #fff;
        }

        body.maroon .theme-toggle {
          background-color: #3e1e26;
          color: #ffc2d1;
          border-color: #ffc2d1;
        }

        body.maroon .theme-toggle:hover {
          background-color: #ffc2d1;
          color: #3e1e26;
        }
      `}
      </style>

      <div className="navbar-wrapper">
        <header className="dashboard-header">
          <div className="header-content">
            <div className="logo-section">
              <img src="/logo.jpeg" alt="UniChat Logo" className="logo-img" />
              <div>
                <h1 className="header-title">UniChat for {role}s</h1>
                <p className="header-subtitle">
                  Your Campus, Your Voice, Your Community
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {isStudent && (
                <a
                  href="/notifications"
                  className="notification-icon"
                  title="View Notifications"
                >
                  🔔
                </a>
              )}
              <button onClick={toggleTheme} className="theme-toggle">
                {theme === "light" ? "🌙 Maroon Mode" : "☀️ Light Mode"}
              </button>
            </div>
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
