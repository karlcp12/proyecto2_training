import React, { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';
import './ReportesPage.css';

interface Reporte {
  numero: string;
  fecha: string;
  area: string;
  responsable: string;
  seleccionado: boolean;
}

const mockReportesValuo: Reporte[] = [
  { numero: '00001', fecha: '08/08/2025', area: 'TICS', responsable: 'Katherine', seleccionado: true },
  { numero: '00002', fecha: '11/08/2025', area: 'PAE', responsable: 'Jhan Breyner', seleccionado: false },
];

const mockReportesCompras: Reporte[] = [
  { numero: '00001', fecha: '05/09/2025', area: 'Compras', responsable: 'Carlos Ruiz', seleccionado: true },
  { numero: '00002', fecha: '15/09/2025', area: 'Logística', responsable: 'Ana Mora', seleccionado: false },
];

// Mock data for the detail view
const mockDetalleReporte = {
  infoGeneral: [
    { campo: 'Número de reporte', valor: '00001' },
    { campo: 'Fecha de generación', valor: '08/08/2025' },
    { campo: 'Área responsable', valor: 'TICS' },
    { campo: 'Responsable', valor: 'Katherine' },
    { campo: 'Estado', valor: 'Activo' },
  ],
  articulosPrestados: [
    { nombre: 'Laptop HP', cantidad: 2, estado: 'En uso', fecha: '01/08/2025' },
    { nombre: 'Monitor', cantidad: 1, estado: 'En uso', fecha: '01/08/2025' },
    { nombre: 'Teclado', cantidad: 3, estado: 'Disponible', fecha: '05/08/2025' },
  ],
  resumenBodega: [
    { categoria: 'Electrónicos', total: 40, disponibles: 25, enUso: 15 },
    { categoria: 'Mobiliario', total: 20, disponibles: 12, enUso: 8 },
    { categoria: 'Herramientas', total: 30, disponibles: 20, enUso: 10 },
  ],
};

type Vista = 'inicio' | 'tabla' | 'detalle';
type TipoReporte = 'valuo' | 'compras';

export const ReportesPage: React.FC = () => {
  const [vista, setVista] = useState<Vista>('inicio');
  const [tipoActivo, setTipoActivo] = useState<TipoReporte>('valuo');
  const [reporteDetalle, setReporteDetalle] = useState<Reporte | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const reportesActuales = tipoActivo === 'valuo' ? mockReportesValuo : mockReportesCompras;

  const filteredReportes = reportesActuales.filter((r) =>
    r.numero.includes(searchTerm) ||
    r.responsable.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAbrirTipo = (tipo: TipoReporte) => {
    setTipoActivo(tipo);
    setVista('tabla');
    setSearchTerm('');
  };

  const handleVerDetalle = (reporte: Reporte) => {
    setReporteDetalle(reporte);
    setVista('detalle');
  };

  const handleVolver = () => {
    if (vista === 'detalle') setVista('tabla');
    else setVista('inicio');
  };

  // ─── VISTA INICIO ───────────────────────────────────────────────────────────
  if (vista === 'inicio') {
    return (
      <div className="reportes-page-container">
        <div className="reportes-header-inicio">
          <h2>REPORTES</h2>
        </div>
        <div className="reportes-inicio-cards">
          <button className="reporte-card-btn" onClick={() => handleAbrirTipo('valuo')}>
            <div className="reporte-card-icon">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="70" height="70">
                <rect x="8" y="4" width="40" height="52" rx="4" fill="#e8f5e9" stroke="#4caf50" strokeWidth="3"/>
                <line x1="16" y1="20" x2="40" y2="20" stroke="#4caf50" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="16" y1="28" x2="36" y2="28" stroke="#4caf50" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="16" y1="36" x2="32" y2="36" stroke="#4caf50" strokeWidth="2.5" strokeLinecap="round"/>
                <rect x="36" y="38" width="20" height="20" rx="3" fill="#4caf50"/>
                <path d="M41 48l4 4 8-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="reporte-card-label">Reporte de<br/>VALUÓ</span>
          </button>

          <button className="reporte-card-btn" onClick={() => handleAbrirTipo('compras')}>
            <div className="reporte-card-icon">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="70" height="70">
                <rect x="8" y="4" width="40" height="52" rx="4" fill="#e8f5e9" stroke="#4caf50" strokeWidth="3"/>
                <line x1="16" y1="20" x2="40" y2="20" stroke="#4caf50" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="16" y1="28" x2="36" y2="28" stroke="#4caf50" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="16" y1="36" x2="32" y2="36" stroke="#4caf50" strokeWidth="2.5" strokeLinecap="round"/>
                <g transform="translate(34, 36)">
                  <path d="M4 0 L16 0 L14 10 L2 10 Z" fill="#4caf50"/>
                  <path d="M2 3 L0 3" stroke="#4caf50" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="5" cy="12" r="2" fill="#4caf50"/>
                  <circle cx="11" cy="12" r="2" fill="#4caf50"/>
                </g>
              </svg>
            </div>
            <span className="reporte-card-label">Reporte de<br/>COMPRAS</span>
          </button>
        </div>
      </div>
    );
  }

  // ─── VISTA TABLA ─────────────────────────────────────────────────────────────
  if (vista === 'tabla') {
    return (
      <div className="reportes-page-container">
        <div className="reportes-header-actions">
          <div className="reportes-titulo-con-back">
            <button className="btn-back" onClick={handleVolver} title="Volver">&#8592;</button>
            <h2>REPORTES DE LOS USUARIOS</h2>
          </div>
          <div className="reportes-actions-right">
            <div className="reportes-search-bar">
              <i className="reportes-search-icon">🔍</i>
              <input
                type="text"
                placeholder="Search"
                className="reportes-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn-print-report" onClick={() => window.print()}>Imprimir Reporte</button>
          </div>
        </div>

        <div className="reportes-table-wrapper">
          <table className="reportes-table">
            <thead>
              <tr>
                <th>Numero de reporte</th>
                <th>Fecha de generacion</th>
                <th>Area</th>
                <th>Responsable</th>
                <th style={{ textAlign: 'center' }}>Seleccionar</th>
                <th style={{ textAlign: 'center' }}>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {filteredReportes.map((reporte, index) => (
                <tr key={index}>
                  <td className="bold-text">{reporte.numero}</td>
                  <td>{reporte.fecha}</td>
                  <td>{reporte.area}</td>
                  <td>{reporte.responsable}</td>
                  <td style={{ textAlign: 'center' }}>
                    {reporte.seleccionado ? (
                      <button className="icon-button icon-check" title="Seleccionado">
                        <FaCheckCircle />
                      </button>
                    ) : (
                      <button className="icon-button icon-cross" title="No Seleccionado">
                        <FaTimesCircle />
                      </button>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="icon-button icon-info"
                      title="Ver detalles"
                      onClick={() => handleVerDetalle(reporte)}
                    >
                      <FaInfoCircle />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ─── VISTA DETALLE ───────────────────────────────────────────────────────────
  return (
    <div className="reportes-page-container">
      <div className="reportes-header-actions">
        <div className="reportes-titulo-con-back">
          <button className="btn-back" onClick={handleVolver} title="Volver">&#8592;</button>
          <h2>DETALLE DEL REPORTE — #{reporteDetalle?.numero}</h2>
        </div>
        <button className="btn-print-report" onClick={() => window.print()}>Imprimir Reporte</button>
      </div>

      {/* Info General */}
      <div className="detalle-seccion">
        <h3 className="detalle-seccion-titulo">Información General</h3>
        <table className="detalle-tabla">
          <tbody>
            {mockDetalleReporte.infoGeneral.map((fila, i) => (
              <tr key={i}>
                <td className="detalle-campo">{fila.campo}</td>
                <td className="detalle-valor">{fila.valor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Artículos Prestados */}
      <div className="detalle-seccion">
        <h3 className="detalle-seccion-titulo">Artículos Prestados</h3>
        <div className="reportes-table-wrapper">
          <table className="reportes-table">
            <thead>
              <tr>
                <th>Artículo</th>
                <th>Cantidad</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {mockDetalleReporte.articulosPrestados.map((art, i) => (
                <tr key={i}>
                  <td className="bold-text">{art.nombre}</td>
                  <td>{art.cantidad}</td>
                  <td>
                    <span className={`badge-estado-reporte ${art.estado === 'En uso' ? 'en-uso' : 'disponible'}`}>
                      {art.estado}
                    </span>
                  </td>
                  <td>{art.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resumen Bodega */}
      <div className="detalle-seccion">
        <h3 className="detalle-seccion-titulo">Resumen de Bodega</h3>
        <div className="reportes-table-wrapper">
          <table className="reportes-table">
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Total</th>
                <th>Disponibles</th>
                <th>En Uso</th>
              </tr>
            </thead>
            <tbody>
              {mockDetalleReporte.resumenBodega.map((fila, i) => (
                <tr key={i}>
                  <td className="bold-text">{fila.categoria}</td>
                  <td>{fila.total}</td>
                  <td style={{ color: '#2e9f1a', fontWeight: 600 }}>{fila.disponibles}</td>
                  <td style={{ color: '#ee6055', fontWeight: 600 }}>{fila.enUso}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
