import React from 'react';
import { useSettings } from '../../../context/SettingsContext';
import { FaCog, FaBell, FaDatabase, FaShieldAlt } from 'react-icons/fa';
import './SettingsPage.css';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="settings-page-container">
      <div className="settings-header">
        <FaCog className="settings-title-icon" />
        <h2>Configuración del Sistema</h2>
      </div>

      <div className="settings-grid">
        {/* Notificaciones */}
        <div className="settings-card">
          <div className="settings-card-header">
            <FaBell className="card-icon" />
            <h3>Notificaciones y Alertas</h3>
          </div>
          <div className="settings-card-body">
            <div className="setting-item">
              <div className="setting-info">
                <label>Umbral de Stock Bajo</label>
                <p>Define la cantidad mínima antes de generar una alerta roja.</p>
              </div>
              <input 
                type="number" 
                value={settings.lowStockThreshold} 
                onChange={(e) => updateSettings({ lowStockThreshold: parseInt(e.target.value) || 0 })}
                min="0"
                className="setting-input"
              />
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Activar Notificaciones Toasts</label>
                <p>Mostrar alertas emergentes en tiempo real.</p>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={settings.enableToasts}
                  onChange={(e) => updateSettings({ enableToasts: e.target.checked })}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Datos y Sistema */}
        <div className="settings-card">
          <div className="settings-card-header">
            <FaDatabase className="card-icon" />
            <h3>Rendimiento y Datos</h3>
          </div>
          <div className="settings-card-body">
            <div className="setting-item">
              <div className="setting-info">
                <label>Intervalo de Actualización (seg)</label>
                <p>Tiempo entre peticiones automáticas al servidor.</p>
              </div>
              <select 
                value={settings.refreshInterval}
                onChange={(e) => updateSettings({ refreshInterval: parseInt(e.target.value) })}
                className="setting-select"
              >
                <option value={10}>Cada 10 segundos</option>
                <option value={30}>Cada 30 segundos</option>
                <option value={60}>Cada minuto</option>
                <option value={300}>Cada 5 minutos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Seguridad */}
        <div className="settings-card">
          <div className="settings-card-header">
            <FaShieldAlt className="card-icon" />
            <h3>Seguridad</h3>
          </div>
          <div className="settings-card-body">
             <div className="setting-item">
                <div className="setting-info">
                  <label>Auditoría de Acciones</label>
                  <p>Estado del registro de actividad (Solo lectura).</p>
                </div>
                <span className="status-badge active">Activo</span>
             </div>
          </div>
        </div>
      </div>

      <div className="settings-footer">
        <p>Los cambios se guardan automáticamente en este navegador.</p>
      </div>
    </div>
  );
};
