import React, { useState, useEffect } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import '../MaterialesPage/MaterialesPage.css';
import './NotificacionesPage.css';

const API_URL = 'http://localhost:3000';

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
    fetch(`${API_URL}/solicitudes`)
      .then(r => r.json())
      .then(solicitudes => {
        // Convertir solicitudes en notificaciones visuales
        const notifs: Alerta[] = solicitudes.map((s: any, i: number) => ({
          id_alerta: s.id_solicitud,
          tipo_alerta: s.estado === 'Pendiente' ? 'Solicitud Pendiente' : `Solicitud ${s.estado}`,
          descripcion: s.nombre_material
            ? `Material: ${s.nombre_material} — Ficha #${s.id_ficha}`
            : `Solicitud #${s.id_solicitud} — Ficha #${s.id_ficha}`,
          fecha: s.fecha ? new Date(s.fecha).toLocaleDateString('es-CO') : '—',
        }));
        setAlertas(notifs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const mockFijos: Alerta[] = [
    { id_alerta: 9001, tipo_alerta: 'Stock Bajo', descripcion: 'Hay materiales con stock por debajo del mínimo', fecha: new Date().toLocaleDateString('es-CO') },
    { id_alerta: 9002, tipo_alerta: 'Devolución Pendiente', descripcion: 'Existen préstamos con devolución vencida', fecha: new Date().toLocaleDateString('es-CO') },
    { id_alerta: 9003, tipo_alerta: 'Verificación de Materiales', descripcion: 'Quedan materiales sin verificar este mes', fecha: new Date().toLocaleDateString('es-CO') },
  ];

  const todas = [...mockFijos, ...alertas];

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
