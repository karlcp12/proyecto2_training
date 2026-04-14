import { FaSearch, FaUserCircle, FaBars } from "react-icons/fa";
import "./TopNavbar.css";

interface TopNavbarProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onToggleSidebar }) => {
  return (
    <header className="top-navbar">
      <button className="sidebar-toggle-btn" onClick={onToggleSidebar}>
        <FaBars />
      </button>

      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Search" className="search-input" />
      </div>

      <div className="user-profile">
        <div className="user-avatar">
          <FaUserCircle className="avatar-icon" />
        </div>
        <span className="user-role">Administrador</span>
      </div>
    </header>
  );
};
