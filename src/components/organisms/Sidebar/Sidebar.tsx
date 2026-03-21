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
  FaBars,
} from "react-icons/fa";
import "./Sidebar.css";

export const Sidebar = () => {
  const [isGestionOpen, setIsGestionOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        {!isCollapsed && (
          <div className="sidebar-logo">
            <Logo width={180} />
          </div>
        )}
        <button className="hamburger-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
      </div>

      <nav className="sidebar-nav">
        {/* Gestión Dropdown */}
        <div className="nav-group">
          <button
            className={`nav-item gestion-btn ${isGestionOpen ? "active" : ""}`}
            onClick={() => setIsGestionOpen(!isGestionOpen)}
          >
            <FaTools className="nav-icon" />
            <span className="nav-text">GESTIÓN</span>
          </button>
          
          <div className={`submenu ${isGestionOpen ? "open" : ""}`}>
            <NavLink to="/app/materiales" className="submenu-item">
              <FaDoorOpen className="submenu-icon" /> <span className="submenu-text">Materiales</span>
            </NavLink>
            <NavLink to="/app/areas" className="submenu-item">
              <FaMapMarkedAlt className="submenu-icon" /> <span className="submenu-text">Areas</span>
            </NavLink>
            <NavLink to="/app/fichas" className="submenu-item">
              <FaGraduationCap className="submenu-icon" /> <span className="submenu-text">Fichas</span>
            </NavLink>
          </div>
        </div>

        {/* Other Links */}
        <NavLink to="/app/usuarios" className="nav-item flat-link">
          <FaUser className="nav-icon" /> <span className="nav-text">USUARIOS</span>
        </NavLink>
        <NavLink to="/app/reportes" className="nav-item flat-link">
          <FaChartLine className="nav-icon" /> <span className="nav-text">REPORTES</span>
        </NavLink>
        <NavLink to="/app/notificaciones" className="nav-item flat-link">
          <FaBell className="nav-icon" /> <span className="nav-text">NOTIFICACIONES</span>
        </NavLink>
        <NavLink to="/app/actualizar-stock" className="nav-item flat-link">
          <FaWarehouse className="nav-icon" /> <span className="nav-text">ACTUALIZAR STOCK</span>
        </NavLink>
        <NavLink to="/app/solicitudes" className="nav-item flat-link">
          <FaFileAlt className="nav-icon" /> <span className="nav-text">SOLICITUDES</span>
        </NavLink>
        <NavLink to="/app/verificacion" className="nav-item flat-link">
          <FaUserCheck className="nav-icon" /> <span className="nav-text">VERIFICACION DE MATERIALES</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="btn-pill btn-pill-delete logout-btn" onClick={handleLogout} style={{ width: '100%', padding: '12px' }}>
          <span className="logout-text">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};
