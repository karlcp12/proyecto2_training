import { FaSearch, FaUserCircle, FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./TopNavbar.css";

export const TopNavbar = () => {
  return (
    <header className="top-navbar">
      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Search" className="search-input" />
      </div>

      <div className="navbar-actions">
        <Link to="/app/notificaciones" className="notification-bell">
          <FaBell />
        </Link>
        <div className="user-profile">
          <div className="user-avatar">
            <FaUserCircle className="avatar-icon" />
          </div>
          <span className="user-role">Administrador</span>
        </div>
      </div>
    </header>
  );
};
