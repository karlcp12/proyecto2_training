import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Logo } from "../../atoms/Logo/Logo";
import {
  FaTools,
  FaDoorOpen,
  FaMapMarkedAlt,
  FaGraduationCap,
  FaUser,
  FaChartLine,
  FaBell,
  FaWarehouse,
  FaFileAlt,
  FaUserCheck,
} from "react-icons/fa";
import "./Sidebar.css";

export const Sidebar = () => {
  const [isGestionOpen, setIsGestionOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Logo width={180} />
      </div>

      <nav className="sidebar-nav">
        {/* Gestión Dropdown */}
        <div className="nav-group">
          <button
            className={`nav-item gestion-btn ${isGestionOpen ? "active" : ""}`}
            onClick={() => setIsGestionOpen(!isGestionOpen)}
          >
            <FaTools className="nav-icon" />
            <span>GESTIÓN</span>
          </button>
          
          <div className={`submenu ${isGestionOpen ? "open" : ""}`}>
            <NavLink to="/app/materiales" className="submenu-item">
              <FaDoorOpen className="submenu-icon" /> Materiales
            </NavLink>
            <NavLink to="/app/areas" className="submenu-item">
              <FaMapMarkedAlt className="submenu-icon" /> Areas
            </NavLink>
            <NavLink to="/app/fichas" className="submenu-item">
              <FaGraduationCap className="submenu-icon" /> Fichas
            </NavLink>
          </div>
        </div>

        {/* Other Links */}
        <NavLink to="/app/usuarios" className="nav-item flat-link">
          <FaUser className="nav-icon" /> USUARIOS
        </NavLink>
        <NavLink to="/app/reportes" className="nav-item flat-link">
          <FaChartLine className="nav-icon" /> REPORTES
        </NavLink>
        <NavLink to="/app/notificaciones" className="nav-item flat-link">
          <FaBell className="nav-icon" /> NOTIFICACIONES
        </NavLink>
        <NavLink to="/app/actualizar-stock" className="nav-item flat-link">
          <FaWarehouse className="nav-icon" /> ACTUALIZAR STOCK
        </NavLink>
        <NavLink to="/app/solicitudes" className="nav-item flat-link">
          <FaFileAlt className="nav-icon" /> SOLICITUDES
        </NavLink>
        <NavLink to="/app/verificacion" className="nav-item flat-link">
          <FaUserCheck className="nav-icon" /> VERIFICACION DE MATERIALES
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};
