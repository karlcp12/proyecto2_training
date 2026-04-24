import React, { useState, useEffect, useRef } from 'react';
import { FaCamera, FaSave, FaUser, FaEnvelope, FaIdCard, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';
import './ProfilePage.css';

export const ProfilePage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [coverPic, setCoverPic] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: currentUser.nombre || '',
    email: currentUser.email || '',
    rol: currentUser.rol || '',
    telefono: currentUser.telefono || '300 123 4567',
    ubicacion: 'Pitalito, Huila',
    bio: 'Instructor apasionado por la tecnología y la gestión de materiales.'
  });

  const profileInputRef = useRef<HTMLInputElement>(null);
  const userKey = currentUser.id_usuario || currentUser.email || 'guest';

  useEffect(() => {
    const savedProfilePic = localStorage.getItem(`profile_pic_${userKey}`);
    const savedCoverPic = localStorage.getItem(`cover_pic_${userKey}`);
    const savedInfo = localStorage.getItem(`profile_info_${userKey}`);
    
    if (savedProfilePic) setProfilePic(savedProfilePic);
    if (savedCoverPic) setCoverPic(savedCoverPic);
    if (savedInfo) setFormData(JSON.parse(savedInfo));
  }, [userKey]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSave = () => {
    localStorage.setItem(`profile_info_${userKey}`, JSON.stringify(formData));
    // Update local storage user object as well
    const updatedUser = { ...currentUser, nombre: formData.nombre, email: formData.email, rol: formData.rol };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    setIsEditing(false);
    alert('Perfil actualizado con éxito');
  };

  return (
    <div className="profile-page-container">
      <div className="profile-header-card centered">
        {/* Profile Info Bar Section */}
        <div className="profile-info-bar centered">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar-container">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="profile-avatar-img" />
              ) : (
                <div className="profile-avatar-placeholder"><FaUser size={60} /></div>
              )}
              <button className="change-profile-btn" onClick={() => profileInputRef.current?.click()}>
                <FaCamera />
              </button>
              <input 
                type="file" 
                ref={profileInputRef} 
                hidden 
                accept="image/*" 
                onChange={handleImageChange} 
              />
            </div>
          </div>

          <div className="profile-main-text">
            <h1>{formData.nombre}</h1>
            <p>{formData.rol}</p>
          </div>

          <div className="profile-actions">
            {!isEditing ? (
              <button className="btn-edit-profile" onClick={() => setIsEditing(true)}>
                Editar Perfil
              </button>
            ) : (
              <button className="btn-save-profile" onClick={handleSave}>
                <FaSave /> Guardar Cambios
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Details Content */}
      <div className="profile-content-grid">
        {/* Left Column: Intro */}
        <div className="profile-column-intro">
          <div className="content-card">
            <h3>Presentación</h3>
            <div className="intro-list">
              <div className="intro-item">
                <FaBriefcase /> <span>{formData.rol} en <strong>Logimat</strong></span>
              </div>
              <div className="intro-item">
                <FaIdCard /> <span>CC: {currentUser.id_usuario || '12345678'}</span>
              </div>
              <div className="intro-item">
                <FaMapMarkerAlt /> <span>Vive en <strong>{formData.ubicacion}</strong></span>
              </div>
              <div className="intro-item">
                <FaEnvelope /> <span>{formData.email}</span>
              </div>
            </div>
            <p className="profile-bio-text">"{formData.bio}"</p>
          </div>
        </div>

        {/* Right Column: Edit Form or Stats */}
        <div className="profile-column-main">
          <div className="content-card">
            <h3>{isEditing ? 'Información Detallada' : 'Actividad Reciente'}</h3>
            
            {isEditing ? (
              <div className="profile-edit-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nombre Completo</label>
                    <input 
                      type="text" 
                      value={formData.nombre} 
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Correo Electrónico</label>
                    <input 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Teléfono</label>
                    <input 
                      type="text" 
                      value={formData.telefono} 
                      onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Ubicación</label>
                    <input 
                      type="text" 
                      value={formData.ubicacion} 
                      onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>Biografía</label>
                  <textarea 
                    rows={4}
                    value={formData.bio} 
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  />
                </div>
              </div>
            ) : (
              <div className="activity-placeholder">
                <div className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-text">Has actualizado tu foto de perfil hoy.</div>
                </div>
                <div className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-text">Realizaste una verificación de materiales ayer.</div>
                </div>
                <div className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-text">Bienvenido de nuevo al sistema Logimat.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
