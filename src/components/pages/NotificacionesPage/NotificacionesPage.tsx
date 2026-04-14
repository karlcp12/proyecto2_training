import React, { useState, useEffect } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import '../MaterialesPage/MaterialesPage.css';
import './NotificacionesPage.css';

const API_URL = 'http://localhost:3001';

interface Alerta {
  id_alerta: number;
  tipo_alerta: string;
  descripcion: string;
  fecha: string;
}

export const NotificacionesPage: React.FC = () => {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/stats/alertas`)
      .then(r => r.json())
      .then(data => {
        setAlertas(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const todas = alertas;

  return (
    <div className="crud-page-container">
      <div className="crud-header-actions">
        <h2>NOTIFICACIONES</h2>
      </div>

      <div className="notif-card">
        <h3 className="notif-section-title">Mensajes activos</h3>
        <ul className="notif-list">
          {loading && <li className="notif-item"><span className="notif-text">Cargando...</span></li>}
          {todas.map(a => (
            <li key={a.id_alerta} className="notif-item">
              <span className="notif-dot"></span>
              <div className="notif-content">
                <span className="notif-title">{a.tipo_alerta}</span>
                <span className="notif-desc">{a.descripcion}</span>
              </div>
              <span className="notif-fecha">{a.fecha}</span>
              <button className="icon-button icon-info" title="Ver detalles">
                <FaInfoCircle />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
