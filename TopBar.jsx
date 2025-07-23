const TopBar = () => {
  const topBarStyle = {
    height: "60px",
    backgroundColor: "#2C3E50",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 20px",
    borderBottom: "1px solid #ddd",
    position: "sticky",
    top: "0",
    zIndex: 900,
    textAlign: "center",
  };

  const headingStyle = {
    margin: 0,
    color: "#fff",
    fontSize: "18px",
    fontWeight: "500",
  };

  return (
    <div style={topBarStyle}>
      <h3 style={headingStyle}>Welcome to UniChat Dashboard</h3>
    </div>
  );
};

export default TopBar;
