import React, { useState, useEffect } from 'react';
import { Modal } from '../../molecules/Modal/Modal';
import '../MaterialesPage/MaterialesPage.css';
import './VerificacionMaterialesPage.css';

const API_URL = 'http://localhost:3001/bodega';
const SOL_URL = 'http://localhost:3001/solicitudes';

interface Material {
  codigo_material: number;
  nombre: string;
  cantidad: number;
  tipo: string;
  enUso?: number;
}

type VistaVerif = 'tabla' | 'lista';

export const VerificacionMaterialesPage: React.FC = () => {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [vista, setVista] = useState<VistaVerif>('tabla');
  const [materialDetalle, setMaterialDetalle] = useState<Material | null>(null);

  useEffect(() => {
    fetch(API_URL).then(r => r.json()).then(setMateriales).catch(() => {});
    fetch(SOL_URL).then(r => r.json()).then(setSolicitudes).catch(() => {});
  }, []);

  // Calcular cuántas unidades están en uso por material (solicitudes aprobadas)
  const getEnUso = (codigoMaterial: number) => {
    return solicitudes
      .filter(s => s.codigo_material == codigoMaterial && (s.estado || '').toLowerCase() === 'aprobada')
      .reduce((sum: number, s: any) => sum + (Number(s.cantidad) || 0), 0);
  };

  const materialesConUso: Material[] = materiales.map(m => ({
    ...m,
    enUso: getEnUso(m.codigo_material),
  }));

  const filtered = materialesConUso.filter(m =>
    (m.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.tipo || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stockStatus = (m: Material) => {
    const disponible = m.cantidad - (m.enUso || 0);
    if (disponible <= 0) return 'bajo';
    if (disponible < 5) return 'medio';
    return 'alto';
  };

  if (vista === 'lista' && materialDetalle) {
    const enUso = materialDetalle.enUso || 0;
    const disponible = materialDetalle.cantidad - enUso;
    const enEntrega = solicitudes.filter(
      s => s.codigo_material == materialDetalle.codigo_material && s.estado?.toLowerCase() === 'pendiente'
    ).length;

    return (
      <div className="crud-page-container">
        <div className="crud-header-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn-back" onClick={() => setVista('tabla')}>&#8592;</button>
            <h2>LISTA DE UNIDADES — {materialDetalle.nombre}</h2>
          </div>
        </div>

        <div className="verif-detalle-card">
          <div className="crud-table-wrapper" style={{ marginBottom: 24 }}>
            <table className="crud-table">
              <thead>
                <tr>
                  <th>Código</th><th>Nombre</th><th>Tipo</th><th>Total</th><th>En Uso</th><th>Disponibles</th><th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="bold-text">{materialDetalle.codigo_material}</td>
                  <td>{materialDetalle.nombre}</td>
                  <td>{materialDetalle.tipo}</td>
                  <td>{materialDetalle.cantidad}</td>
                  <td style={{ color: '#e65100', fontWeight: 600 }}>{enUso}</td>
                  <td style={{ color: '#2e7d32', fontWeight: 600 }}>{disponible}</td>
                  <td>
                    <span className={`badge-cantidad ${stockStatus(materialDetalle)}`}>
                      {stockStatus(materialDetalle) === 'alto' ? 'OK' : stockStatus(materialDetalle) === 'medio' ? 'Bajo' : 'Agotado'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="verif-leyenda">
            <div className="verif-legend-item">
              <span className="verif-dot verde"></span>
              <span>Material integrado para desempeño ({disponible} unidades)</span>
            </div>
            <div className="verif-legend-item">
              <span className="verif-dot amarillo"></span>
              <span>Material integrado y sin un estado ({enEntrega} en proceso)</span>
            </div>
            <div className="verif-legend-item">
              <span className="verif-dot rojo"></span>
              <span>Material no entregado ({enUso} en uso)</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
            <button className="btn-submit-crud" onClick={() => setVista('tabla')}>Volver</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="crud-page-container">
      <div className="crud-header-actions">
        <h2>VERIFICACIÓN DE MATERIALES</h2>
        <div className="crud-actions-right">
          <div className="crud-search-bar">
            <span>🔍</span>
            <input type="text" placeholder="Search" className="crud-search-input"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="crud-table-wrapper">
        <table className="crud-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Cantidad Total</th>
              <th style={{ textAlign: 'center' }}>Stock</th>
              <th style={{ textAlign: 'center' }}>Verificar</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.codigo_material}>
                <td className="bold-text">{m.codigo_material}</td>
                <td>{m.nombre}</td>
                <td>{m.tipo}</td>
                <td>{m.cantidad}</td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`badge-cantidad ${stockStatus(m)}`}>
                    {m.cantidad - (m.enUso || 0)} disp.
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    className="btn-add-crud"
                    style={{ padding: '5px 14px', fontSize: '0.82rem' }}
                    onClick={() => { setMaterialDetalle(m); setVista('lista'); }}
                  >
                    Ver lista
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
