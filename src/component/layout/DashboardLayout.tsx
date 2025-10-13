import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../layout/sidebar";
import { Header } from "../layout/Header";
import "../layout/global.css";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)};

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className="main-content">
        <Header
          onMenuToggle={toggleSidebar}
          // {() => setSidebarOpen(!sidebarOpen)}
          title="Sistem Keuangan"
        />
        <div className="page-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
