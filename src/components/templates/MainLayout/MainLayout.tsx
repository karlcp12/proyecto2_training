import { Outlet } from "react-router-dom";
import { Sidebar } from "../../organisms/Sidebar/Sidebar";
import { TopNavbar } from "../../organisms/TopNavbar/TopNavbar";
import "./MainLayout.css";

export const MainLayout = () => {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-content-wrapper">
        <TopNavbar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
