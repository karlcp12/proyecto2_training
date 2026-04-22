import React, { useState, useEffect, useMemo } from 'react';
import { FaFilePdf, FaHistory, FaBoxOpen, FaShoppingCart } from 'react-icons/fa';
import { BarChartComponent } from '../../organisms/Charts/BarChartComponent';
import { LineChartComponent } from '../../organisms/Charts/LineChartComponent';
import { PieChartComponent } from '../../organisms/Charts/PieChartComponent';
import { generateMaterialsPDF, generateSingleMaterialPDF } from '../../../utils/PdfGenerator';
import '../../organisms/Charts/Charts.css';
import './ReportesPage.css';

interface Reporte {
  numero: string;
  fecha: string;
  area: string;
  responsable: string;
  estado: string;
}

interface Movimiento {
  id: number;
  material: string;
  tipo: 'Entrada' | 'Salida';
  cantidad: number;
  fecha: string;
  motivo: string;
  usuario: string;
}

interface Material {
    codigo_material: number;
    nombre: string;
    cantidad: number;
    tipo: string;
    selected?: boolean;
}

const API_BASE = 'http://localhost:3001';

type Vista = 'inicio' | 'tabla' | 'detalle' | 'graficas' | 'movimientos';
type TipoReporte = 'valuo' | 'compras';

const mockDetalleReporte = {
  articulosPrestados: [
    { nombre: 'Martillo', cantidad: 2, estado: 'En uso', fecha: '2026-04-10' },
    { nombre: 'Destornillador', cantidad: 5, estado: 'Disponible', fecha: '2026-04-12' }
  ],
  resumenBodega: [
    { categoria: 'Herramientas', total: 50, disponibles: 45, enUso: 5 },
    { categoria: 'Electrónico', total: 20, disponibles: 18, enUso: 2 }
  ]
};

export const ReportesPage: React.FC = () => {
  const [vista, setVista] = useState<Vista>('inicio');
  const [tipoActivo, setTipoActivo] = useState<TipoReporte>('valuo');
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [reporteDetalle] = useState<Reporte | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [charts, setCharts] = useState<any>(null);
  
  // Filter states
  const [filterFechaInicio, setFilterFechaInicio] = useState('');
  const [filterFechaFin, setFilterFechaFin] = useState('');
  const [filterTipoMaterial, setFilterTipoMaterial] = useState('Todos');
  const [filterArea, setFilterArea] = useState('Todas');

  useEffect(() => {
    if (vista === 'tabla') {
       fetch(`${API_BASE}/stats/reportes`)
         .then(r => r.json())
         .catch(() => {});
       
       fetch(`${API_BASE}/bodega`)
         .then(r => r.json())
         .then(data => setMateriales(data.map((m: any) => ({ ...m, selected: false }))));
    }
    if (vista === 'movimientos') {
        fetch(`${API_BASE}/stats/movimientos`)
          .then(r => r.json())
          .then(data => {
             setMovimientos(data);
          })
          .catch(() => {});
    }
    if (vista === 'graficas') {
       fetch(`${API_BASE}/stats/dashboard`)
         .then(r => r.json())
         .then(data => setCharts(data.charts));
    }
  }, [vista]);

  const filteredMateriales = useMemo(() => materiales.filter((m) =>
    m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  ), [materiales, searchTerm]);

  const filteredMovimientos = useMemo(() => movimientos.filter((m) =>
    m.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.motivo.toLowerCase().includes(searchTerm.toLowerCase())
  ), [movimientos, searchTerm]);

  const handleAbrirTipo = (tipo: TipoReporte) => {
    setTipoActivo(tipo);
    setVista('tabla');
    setSearchTerm('');
  };

  const handleVolver = () => {
    if (vista === 'detalle') setVista('tabla');
    else setVista('inicio');
  };

  const toggleSelectMaterial = (codigo: number) => {
    setMateriales(prev => prev.map(m => 
      m.codigo_material === codigo ? { ...m, selected: !m.selected } : m
    ));
  };

  const handleExportSelected = () => {
    const selected = materiales.filter(m => m.selected);
    if (selected.length === 0) {
        alert('Por favor selecciona al menos un material');
        return;
    }
    try {
        const mapped = selected.map(m => ({
            codigo: m.codigo_material,
            nombre: m.nombre || 'Sin nombre',
            cantidad: Number(m.cantidad) || 0,
            tipo: m.tipo || 'Sin categoría'
        }));
        generateMaterialsPDF(mapped, `Reporte de ${selected.length} Materiales Seleccionados`);
    } catch (err) {
        console.error("Error generating PDF:", err);
        alert("Ocurrió un error al generar el PDF.");
    }
  };

  const handleExportAll = () => {
    if (materiales.length === 0) {
        alert('No hay materiales cargados para exportar');
        return;
    }
    try {
        const mapped = materiales.map(m => ({
            codigo: m.codigo_material,
            nombre: m.nombre || 'Sin nombre',
            cantidad: Number(m.cantidad) || 0,
            tipo: m.tipo || 'Sin categoría'
        }));
        generateMaterialsPDF(mapped, 'Reporte Completo de Inventario');
    } catch (err) {
        console.error("Error generating PDF:", err);
        alert("Ocurrió un error al generar el PDF.");
    }
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
            <div className="reporte-card-icon valuo-icon">
              <FaBoxOpen size={50} />
            </div>
            <span className="reporte-card-label">Reporte de<br/>VALUÓ / STOCK</span>
          </button>

          <button className="reporte-card-btn" onClick={() => handleAbrirTipo('compras')}>
            <div className="reporte-card-icon compras-icon">
              <FaShoppingCart size={50} />
            </div>
            <span className="reporte-card-label">Reporte de<br/>COMPRAS / ENTRADAS</span>
          </button>

          <button className="reporte-card-btn" onClick={() => setVista('movimientos')}>
            <div className="reporte-card-icon history-icon">
              <FaHistory size={50} />
            </div>
            <span className="reporte-card-label">Historial de<br/>MOVIMIENTOS</span>
          </button>

          <button className="reporte-card-btn" onClick={() => setVista('graficas')}>
            <div className="reporte-card-icon stats-icon">
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

  // ─── VISTA MOVIMIENTOS ──────────────────────────────────────────────────────
  if (vista === 'movimientos') {
    return (
      <div className="reportes-page-container">
        <div className="reportes-header-actions">
          <div className="reportes-titulo-con-back">
            <button className="btn-back" onClick={handleVolver}>&#8592;</button>
            <h2>HISTORIAL DE ENTRADAS Y SALIDAS</h2>
          </div>
          <div className="reportes-search-bar">
            <input
                type="text"
                placeholder="Buscar movimiento..."
                className="reportes-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="reportes-table-wrapper">
          <table className="reportes-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Material</th>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Motivo</th>
                <th>Usuario</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovimientos.map((m) => (
                <tr key={m.id}>
                  <td>{new Date(m.fecha).toLocaleString()}</td>
                  <td className="bold-text">{m.material}</td>
                  <td>
                    <span className={`badge-tipo ${m.tipo.toLowerCase()}`}>
                        {m.tipo}
                    </span>
                  </td>
                  <td>{m.cantidad}</td>
                  <td>{m.motivo}</td>
                  <td>{m.usuario || 'Sistema'}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
          {charts && (
            <>
              <div className="dashboard-card" style={{ gridColumn: 'span 2' }}>
                <div className="dashboard-card-title">Materiales más utilizados</div>
                <BarChartComponent data={charts.topMaterials} xKey="name" yKey="quantity" />
              </div>

              <div className="dashboard-card">
                <div className="dashboard-card-title">Distribución de Solicitudes</div>
                <PieChartComponent data={charts.statusDistribution} />
              </div>

              <div className="dashboard-card" style={{ gridColumn: 'span 3' }}>
                <div className="dashboard-card-title">Movimientos (Entradas/Salidas) por fecha</div>
                <LineChartComponent data={charts.movementHistory} xKey="date" yKey="count" />
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (vista === 'tabla') {
    return (
      <div className="reportes-page-container">
        <div className="reportes-header-actions">
          <div className="reportes-titulo-con-back">
            <button className="btn-back" onClick={handleVolver}>&#8592;</button>
            <h2>{tipoActivo === 'valuo' ? 'REPORTE DE INVENTARIO (VALUÓ)' : 'REPORTE DE ENTRADAS (COMPRAS)'}</h2>
          </div>
          <div className="reportes-actions-right">
            <div className="reportes-search-bar">
              <input
                type="text"
                placeholder="Search..."
                className="reportes-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn-export-excel" onClick={handleExportSelected}>Exportar Seleccionados</button>
            <button className="btn-print-report" onClick={handleExportAll}>Exportar Todo (PDF)</button>
          </div>
        </div>

        <div className="reportes-table-wrapper">
          <table className="reportes-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>Código</th>
                <th>Material</th>
                <th>Categoría</th>
                <th>Stock Actual</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredMateriales.map((m) => (
                <tr key={m.codigo_material}>
                  <td>
                    <input 
                        type="checkbox" 
                        checked={m.selected} 
                        onChange={() => toggleSelectMaterial(m.codigo_material)} 
                    />
                  </td>
                  <td className="bold-text">{m.codigo_material}</td>
                  <td>{m.nombre}</td>
                  <td>{m.tipo}</td>
                  <td>
                    <span className={`stock-badge ${m.cantidad < 5 ? 'low' : 'ok'}`}>
                        {m.cantidad}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="icon-button pdf-btn"
                      title="Generar Ficha PDF"
                      onClick={() => generateSingleMaterialPDF({
                          codigo: m.codigo_material,
                          nombre: m.nombre,
                          cantidad: m.cantidad,
                          tipo: m.tipo
                      })}
                    >
                      <FaFilePdf />
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
            <tr><td className="detalle-campo">Número de reporte</td><td className="detalle-valor">{reporteDetalle?.numero}</td></tr>
            <tr><td className="detalle-campo">Fecha de generación</td><td className="detalle-valor">{reporteDetalle?.fecha ? new Date(reporteDetalle.fecha).toLocaleDateString() : '—'}</td></tr>
            <tr><td className="detalle-campo">Área responsable</td><td className="detalle-valor">{reporteDetalle?.area}</td></tr>
            <tr><td className="detalle-campo">Responsable</td><td className="detalle-valor">{reporteDetalle?.responsable}</td></tr>
            <tr><td className="detalle-campo">Estado</td><td className="detalle-valor">{reporteDetalle?.estado}</td></tr>
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
              {mockDetalleReporte.articulosPrestados.map((art: any, i: number) => (
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
              {mockDetalleReporte.resumenBodega.map((fila: any, i: number) => (
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
