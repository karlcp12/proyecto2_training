import React, { useState, useEffect } from 'react';
import { FaHistory, FaUser, FaClock, FaTag, FaFilePdf, FaTrash } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './AuditPage.css';

interface Log {
  id_audit: number;
  usuario: string;
  accion: string;
  modulo: string;
  detalles: string;
  fecha: string;
}

export const AuditPage: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/audit')
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('REPORTE DE AUDITORÍA - LOGIMAT', 14, 20);
    doc.setFontSize(10);
    doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, 28);

    autoTable(doc, {
      startY: 35,
      head: [['Fecha', 'Usuario', 'Acción', 'Módulo', 'Detalles']],
      body: logs.map(log => [
        new Date(log.fecha).toLocaleString(),
        log.usuario,
        log.accion,
        log.modulo,
        log.detalles
      ]),
      headStyles: { fillColor: [46, 125, 50] },
      styles: { fontSize: 8 }
    });

    doc.save(`Auditoria_Logimat_${new Date().toLocaleDateString()}.pdf`);
  };

  const clearHistory = async () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar todo el historial de auditoría? Esta acción no se puede deshacer.')) {
        try {
            await fetch('http://localhost:3001/audit', { method: 'DELETE' });
            setLogs([]);
        } catch (err) {
            console.error(err);
        }
    }
  };
 
   return (
    <div className="audit-page-container">
      <div className="audit-header">
        <div className="audit-header-content">
            <FaHistory className="audit-title-icon" />
            <div className="audit-title-text">
                <h2>Auditoría de Actividad</h2>
                <p>Historial de cambios realizados por los usuarios en el sistema.</p>
            </div>
        </div>
        <div className="audit-header-buttons">
            <button className="btn-clear-audit" onClick={clearHistory} disabled={logs.length === 0}>
                <FaTrash /> Vaciar Historial
            </button>
            <button className="btn-export-pdf" onClick={exportToPDF} disabled={logs.length === 0}>
                <FaFilePdf /> Exportar PDF
            </button>
        </div>
      </div>

      <div className="audit-timeline">
        {loading ? (
            <div className="audit-loading">Cargando historial...</div>
        ) : logs.length > 0 ? (
          logs.map(log => (
            <div key={log.id_audit} className="audit-card">
              <div className="audit-card-side">
                <FaClock className="side-icon" />
                <span className="audit-time">{new Date(log.fecha).toLocaleTimeString()}</span>
                <span className="audit-date">{new Date(log.fecha).toLocaleDateString()}</span>
              </div>
              <div className="audit-card-main">
                <div className="audit-top">
                  <span className={`audit-badge badge-${log.accion.toLowerCase()}`}>
                    {log.accion}
                  </span>
                  <span className="audit-modulo">Módulo: {log.modulo}</span>
                </div>
                <div className="audit-user">
                  <FaUser className="user-icon" />
                  <strong>{log.usuario}</strong>
                </div>
                <div className="audit-details">
                  <FaTag className="details-icon" />
                  {log.detalles}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="audit-empty">No hay registros de actividad aún.</div>
        )}
      </div>
    </div>
  );
};
