import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Sidebar = () => {
  const location = useLocation();

  const navStyle = {
    width: "250px",
    height: "100vh",
    backgroundColor: "#2C3E50",
    color: "#fff",
    position: "fixed",
    top: "0",
    left: "0",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
    zIndex: 1000,
  };

  const logoSection = {
    display: "flex",
    alignItems: "center",
    padding: "15px 20px",
    borderBottom: "1px solid #1a252f",
  };

  const logoImg = {
    height: "40px",
    marginRight: "10px",
  };

  const logoText = {
    fontSize: "18px",
    fontWeight: "bold",
  };

  const listStyle = {
    listStyle: "none",
    padding: "0",
    margin: "0",
    flexGrow: 1,
  };

  const itemStyle = {
    padding: "15px 25px",
    borderBottom: "1px solid #1a252f",
    fontSize: "16px",
    color: "#fff",
    textDecoration: "none",
    display: "block",
    transition: "background 0.2s",
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

  return (
    <motion.nav
      style={navStyle}
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 70 }}
    >
      <div style={logoSection}>
        <img src="/Signup.png" alt="UniChat Logo" style={logoImg} />
        <span style={logoText}>UniChat</span>
      </div>

      <ul style={listStyle}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={item.name}>
              <Link
                to={item.path}
                style={{
                  ...itemStyle,
                  backgroundColor: isActive ? "#3A86FF" : "transparent",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#34495E")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = isActive
                    ? "#3A86FF"
                    : "transparent")
                }
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
};

export default Sidebar;
