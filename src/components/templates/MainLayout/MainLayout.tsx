import { Outlet } from "react-router-dom";
import { Sidebar } from "../../organisms/Sidebar/Sidebar";
import { TopNavbar } from "../../organisms/TopNavbar/TopNavbar";
import { FaWhatsapp } from "react-icons/fa";
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
      <a 
        href="https://api.whatsapp.com/send?phone=573001234567&text=Hola,%20necesito%20Soporte%20en%20el%20sistema" 
        className="whatsapp-assistant-btn"
        target="_blank"
        rel="noopener noreferrer"
        title="Asistente WhatsApp"
      >
        <FaWhatsapp size={32} />
      </a>
    </div>
  );
};
