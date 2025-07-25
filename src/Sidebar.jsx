import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const currentTheme = document.body.className || "light";
    setTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "maroon" : "light";
    document.body.className = newTheme;
    setTheme(newTheme);
  };

  const navItems = [
    { name: "🏠 Dashboard", path: "/" },
    { name: "📄 View Events", path: "/events" },
    { name: "💬 Forums", path: "/forums" },
    { name: "🎓 Mentor Students", path: "/mentor" },
    { name: "✉️ Messages", path: "/messages" },
    { name: "⚙️ Settings", path: "/settings" },
    { name: "🚪 Logout", path: "/logout" },
  ];

  const activeBg = theme === "light" ? "#3A86FF" : "#f72585";
  const hoverBg = theme === "light" ? "#e0e7ff" : "#4a0d24";

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap');

          .sidebar {
            width: 250px;
            height: 100vh;
            position: fixed;
            top: 0;
            left: 0;
            font-family: 'Nunito', sans-serif;
            display: flex;
            flex-direction: column;
            z-index: 1000;
            box-shadow: 2px 0 10px rgba(0,0,0,0.2);
            backdrop-filter: blur(12px);
            transition: background 0.4s;
          }

          body.light .sidebar {
            background: rgba(255, 255, 255, 0.8);
            color: #222;
          }

          body.maroon .sidebar {
            background: rgba(40, 10, 20, 0.85);
            color: #ffc2d1;
          }

          .logo-section {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px;
            border-bottom: 1px solid rgba(0,0,0,0.1);
          }

          .logo-section img {
            height: 42px;
            margin-right: 12px;
            border-radius: 6px;
          }

          .logo-section span {
            font-weight: 700;
            font-size: 18px;
            letter-spacing: 0.5px;
          }

          .theme-toggle {
            background-color: transparent;
            border: 1px solid currentColor;
            color: inherit;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 13px;
            cursor: pointer;
            transition: background 0.3s ease;
          }

          .sidebar ul {
            list-style: none;
            padding: 0;
            margin: 0;
            flex-grow: 1;
          }

          .sidebar li a {
            display: block;
            padding: 14px 26px;
            font-size: 15.5px;
            color: inherit;
            text-decoration: none;
            transition: all 0.3s ease;
            position: relative;
          }

          .sidebar li a:hover {
            background-color: var(--hover-bg);
            transform: translateX(3px);
            border-left: 4px solid #c084fc;
          }

          .sidebar li a.active {
            background-color: var(--active-bg);
            color: #fff;
            border-left: 5px solid #fff;
            font-weight: bold;
          }
        `}
      </style>

      <motion.nav
        className="sidebar"
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 70 }}
        style={{
          "--active-bg": activeBg,
          "--hover-bg": hoverBg,
        }}
      >
        <div className="logo-section">
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src="/logo.jpeg" alt="UniChat Logo" />
            <span>UniChat</span>
          </div>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>

        <ul>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={isActive ? "active" : ""}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </motion.nav>
    </>
  );
};

export default Sidebar;
