import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Style from "../Dashboard/Style/UserHome.module.scss";
import Header from "../Dashboard/Header.jsx";
import Sidebar from "../Dashboard/Sidebar.jsx";

const UserdHome = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={Style.dashboardLayout}>
      <div className={Style.dashboardLayoutLeft}>
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
        />
      </div>

      <div className={Style.rightContent}>
        <Header toggleSidebar={toggleSidebar} />
        <div className={Style.pageContent}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserdHome;
