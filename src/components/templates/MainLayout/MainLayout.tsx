import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../../organisms/Sidebar/Sidebar";
import { TopNavbar } from "../../organisms/TopNavbar/TopNavbar";
import "./MainLayout.css";

export const MainLayout = () => {
  // Inicializar estado desde localStorage o por defecto false (abierto)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', newState.toString());
  };

  return (
    <div className={`main-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className="main-content-wrapper">
        <TopNavbar onToggleSidebar={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
