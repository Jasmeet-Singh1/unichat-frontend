import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const layoutStyle = {
    marginLeft: "250px",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#FAFAFA",
  };

  const contentStyle = {
    flex: 1,
    padding: "20px",
  };

  return (
    <>
      <Sidebar />
      <div style={layoutStyle}>
        <TopBar />
        <main style={contentStyle}>
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Layout;
