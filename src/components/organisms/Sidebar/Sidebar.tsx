import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Logo } from "../../atoms/Logo/Logo";
import {
  FaHome,
  FaTools,
  FaDoorOpen,
  FaMapMarkedAlt,
  FaGraduationCap,
  FaUser,
  FaChartLine,
  FaWarehouse,
  FaFileAlt,
  FaUserCheck,
} from "react-icons/fa";
import "./Sidebar.css";

interface SidebarProps {
  isCollapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const [isGestionOpen, setIsGestionOpen] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = currentUser.rol === 'Administrador';
  const isInstructor = currentUser.rol === 'Instructor';

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo">
        <Logo width={isCollapsed ? 40 : 180} />
      </div>

      <nav className="sidebar-nav">
        {/* INICIO */}
        <NavLink to="/app" end className="nav-item flat-link">
          <FaHome className="nav-icon" /> INICIO
        </NavLink>

        {/* Gestión Dropdown - Hidden for Vocero */}
        {(isAdmin || isInstructor) && (
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
        )}

        {/* Links for Admin/Instructor */}
        {(isAdmin || isInstructor) && (
          <>
            <NavLink to="/app/usuarios" className="nav-item flat-link">
              <FaUser className="nav-icon" /> USUARIOS
            </NavLink>
            <NavLink to="/app/reportes" className="nav-item flat-link">
              <FaChartLine className="nav-icon" /> REPORTES
            </NavLink>
            <NavLink to="/app/actualizar-stock" className="nav-item flat-link">
              <FaWarehouse className="nav-icon" /> ACTUALIZAR STOCK
            </NavLink>
          </>
        )}

        {/* Links for Everyone (including Vocero) */}
        <NavLink to="/app/solicitudes" className="nav-item flat-link">
          <FaFileAlt className="nav-icon" /> SOLICITUDES
        </NavLink>

        {/* Verification - Hidden for Vocero */}
        {(isAdmin || isInstructor) && (
          <NavLink to="/app/verificacion" className="nav-item flat-link">
            <FaUserCheck className="nav-icon" /> 
            <span style={{ lineHeight: '1.1' }}>VERIFICACIÓN DE<br />MATERIALES</span>
          </NavLink>
        )}
      </nav>
    </aside>
  );
};
