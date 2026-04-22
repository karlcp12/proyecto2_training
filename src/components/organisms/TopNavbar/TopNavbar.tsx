import { useState, useEffect, useRef } from "react";
import { FaSearch, FaUserCircle, FaBars, FaBell, FaSignOutAlt, FaCamera } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./TopNavbar.css";

interface TopNavbarProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onToggleSidebar }) => {
  const [notifCount, setNotifCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userKey = currentUser.id_usuario || currentUser.email || 'guest';

  useEffect(() => {
    // Load profile pic from localStorage using a unique key per user
    const savedPic = localStorage.getItem(`profile_pic_${userKey}`);
    setProfilePic(savedPic || null);

    // Fetch notifications count
    fetch('http://localhost:3001/stats/alertas')
      .then(r => r.json())
      .then(data => setNotifCount(data.length))
      .catch(() => { });

    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userKey]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setProfilePic(null); // Clear local state
    navigate("/");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfilePic(base64);
        localStorage.setItem(`profile_pic_${userKey}`, base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <header className="top-navbar">
      <button className="sidebar-toggle-btn" onClick={onToggleSidebar}>
        <FaBars />
      </button>

      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Search" className="search-input" />
      </div>

      <div className="top-navbar-right">
        <Link to="/app/notificaciones" className="nav-notification-link">
          <FaBell className="notification-icon" />
          {notifCount > 0 && (
            <span className="notification-badge">{notifCount}</span>
          )}
        </Link>

        <div className="user-profile-container" ref={menuRef}>
          <div className="user-profile" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <div className="user-avatar">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="avatar-img" />
              ) : (
                <FaUserCircle className="avatar-icon" />
              )}
            </div>
            <div className="user-info-text">
              <span className="user-name">{currentUser.nombre || 'Usuario'}</span>
              <span className="user-role">{currentUser.rol || 'Sin Rol'}</span>
            </div>
          </div>

          {isMenuOpen && (
            <div className="user-dropdown-menu">
              <div className="dropdown-header">
                <div className="dropdown-avatar-large">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile Large" className="avatar-img-large" />
                  ) : (
                    <FaUserCircle size={50} />
                  )}
                  <button
                    className="change-photo-btn"
                    title="Cambiar foto"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FaCamera />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                <h4>{currentUser.nombre}</h4>
                <p>{currentUser.email}</p>
              </div>

              <div className="dropdown-divider"></div>

              <button className="dropdown-item logout" onClick={handleLogout}>
                <FaSignOutAlt className="dropdown-icon" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
