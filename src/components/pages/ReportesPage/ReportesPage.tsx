import React, { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';
import { BarChartComponent } from '../../organisms/Charts/BarChartComponent';
import { LineChartComponent } from '../../organisms/Charts/LineChartComponent';
import { PieChartComponent } from '../../organisms/Charts/PieChartComponent';
import '../../organisms/Charts/Charts.css';
import './ReportesPage.css';

interface Reporte {
  numero: string;
  fecha: string;
  area: string;
  responsable: string;
  seleccionado: boolean;
}

const mockReportesValuo: Reporte[] = [
  { numero: '00001', fecha: '2025-08-08', area: 'TICS', responsable: 'Katherine', seleccionado: true },
  { numero: '00002', fecha: '2025-08-11', area: 'PAE', responsable: 'Jhan Breyner', seleccionado: false },
];

const mockReportesCompras: Reporte[] = [
  { numero: '00001', fecha: '2025-09-05', area: 'Compras', responsable: 'Carlos Ruiz', seleccionado: true },
  { numero: '00002', fecha: '2025-09-15', area: 'Logística', responsable: 'Ana Mora', seleccionado: false },
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

// Mock data for charts
const mockChartData = {
  materialesMasUsados: [
    { name: 'Laptop HP', quantity: 45 },
    { name: 'Monitor 24', quantity: 30 },
    { name: 'Silla Ergonómica', quantity: 25 },
    { name: 'Teclado', quantity: 20 },
    { name: 'Mouse', quantity: 15 },
  ],
  movimientosPorFecha: [
    { date: '2026-04-07', count: 10 },
    { date: '2026-04-08', count: 15 },
    { date: '2026-04-09', count: 8 },
    { date: '2026-04-10', count: 20 },
    { date: '2026-04-11', count: 25 },
    { date: '2026-04-12', count: 18 },
    { date: '2026-04-13', count: 22 },
  ],
  distribucionSolicitudes: [
    { name: 'Aprobado', value: 60 },
    { name: 'Pendiente', value: 30 },
    { name: 'Rechazado', value: 10 },
  ]
};

type Vista = 'inicio' | 'tabla' | 'detalle' | 'graficas';
type TipoReporte = 'valuo' | 'compras';

export const ReportesPage: React.FC = () => {
  const [vista, setVista] = useState<Vista>('inicio');
  const [tipoActivo, setTipoActivo] = useState<TipoReporte>('valuo');
  const [reporteDetalle, setReporteDetalle] = useState<Reporte | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter states
  const [filterFechaInicio, setFilterFechaInicio] = useState('');
  const [filterFechaFin, setFilterFechaFin] = useState('');
  const [filterTipoMaterial, setFilterTipoMaterial] = useState('Todos');
  const [filterArea, setFilterArea] = useState('Todas');

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
    else if (vista === 'graficas') setVista('inicio');
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

          <button className="reporte-card-btn" onClick={() => setVista('graficas')}>
            <div className="reporte-card-icon">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="70" height="70">
                <rect x="8" y="12" width="48" height="40" rx="4" fill="#e3f2fd" stroke="#2196f3" strokeWidth="3"/>
                <path d="M16 44 L28 32 L40 38 L52 24" stroke="#2196f3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="16" cy="44" r="3" fill="#2196f3"/>
                <circle cx="28" cy="32" r="3" fill="#2196f3"/>
                <circle cx="40" cy="38" r="3" fill="#2196f3"/>
                <circle cx="52" cy="24" r="3" fill="#2196f3"/>
              </svg>
            </div>
            <span className="reporte-card-label">Estadísticas y<br/>GRÁFICAS</span>
          </button>
        </div>
      </div>
    );
  }

  // ─── VISTA GRAFICAS ──────────────────────────────────────────────────────────
  if (vista === 'graficas') {
    return (
      <div className="reportes-page-container">
        <div className="reportes-header-actions">
          <div className="reportes-titulo-con-back">
            <button className="btn-back" onClick={handleVolver} title="Volver">&#8592;</button>
            <h2>ESTADÍSTICAS Y GRÁFICAS</h2>
          </div>
          <button className="btn-print-report" onClick={() => window.print()}>Exportar PDF</button>
        </div>

        {/* Filtros */}
        <div className="dashboard-card" style={{ marginBottom: '20px' }}>
          <div className="dashboard-card-title">Filtros de Reporte</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div className="crud-form-group">
              <label>Fecha Inicio</label>
              <input type="date" value={filterFechaInicio} onChange={(e) => setFilterFechaInicio(e.target.value)} />
            </div>
            <div className="crud-form-group">
              <label>Fecha Fin</label>
              <input type="date" value={filterFechaFin} onChange={(e) => setFilterFechaFin(e.target.value)} />
            </div>
            <div className="crud-form-group">
              <label>Tipo de Material</label>
              <select value={filterTipoMaterial} onChange={(e) => setFilterTipoMaterial(e.target.value)}>
                <option>Todos</option>
                <option>Electrónico</option>
                <option>Mobiliario</option>
                <option>Herramientas</option>
              </select>
            </div>
            <div className="crud-form-group">
              <label>Área</label>
              <select value={filterArea} onChange={(e) => setFilterArea(e.target.value)}>
                <option>Todas</option>
                <option>TICS</option>
                <option>PAE</option>
                <option>Logística</option>
              </select>
            </div>
          </div>
        </div>

        {/* Gráficas en Grid */}
        <div className="dashboard-grid" style={{ padding: 0 }}>
          <div className="dashboard-card" style={{ gridColumn: 'span 2' }}>
            <div className="dashboard-card-title">Materiales más utilizados</div>
            <BarChartComponent data={mockChartData.materialesMasUsados} xKey="name" yKey="quantity" />
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-title">Distribución de Solicitudes</div>
            <PieChartComponent data={mockChartData.distribucionSolicitudes} />
          </div>

          <div className="dashboard-card" style={{ gridColumn: 'span 3' }}>
            <div className="dashboard-card-title">Movimientos (Entradas/Salidas) por fecha</div>
            <LineChartComponent data={mockChartData.movimientosPorFecha} xKey="date" yKey="count" />
          </div>
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
