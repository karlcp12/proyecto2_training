import React, { useState, useEffect } from 'react';
import { Modal } from '../../molecules/Modal/Modal';
import { FaSearch, FaPlus } from 'react-icons/fa';
import '../MaterialesPage/MaterialesPage.css';
import './SolicitudesPage.css';

const API_URL = 'http://localhost:3000/solicitudes';
const MAT_URL = 'http://localhost:3000/bodega';
const FICHAS_URL = 'http://localhost:3000/fichas';

interface Solicitud {
  id_solicitud?: number;
  id_aprendiz: string | number;
  codigo_material: string | number;
  nombre_material?: string;
  id_ficha: string | number;
  cantidad: string | number;
  fecha?: string;
  estado: string;
}

interface Material { codigo_material: number; nombre: string; }
interface Ficha { id_ficha: number; numero_ficha: string; }

const SolicitudForm: React.FC<{
  initial?: Solicitud;
  isEditing: boolean;
  materiales: Material[];
  fichas: Ficha[];
  onSubmit: (data: Solicitud) => void;
}> = ({ initial, isEditing, materiales, fichas, onSubmit }) => {
  const empty: Solicitud = { id_aprendiz: '', codigo_material: '', id_ficha: '', cantidad: 1, estado: 'Pendiente' };
  const [form, setForm] = useState<Solicitud>(initial || empty);

  useEffect(() => { setForm(initial || empty); }, [initial]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form className="crud-form redesign" onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
      <h3 className="crud-form-title">{isEditing ? 'EDITAR SOLICITUD' : 'DETALLES DE SOLICITUD'}</h3>

      <div className="crud-form-grid">
        <div className="crud-form-group">
          <label>Material</label>
          <select name="codigo_material" value={form.codigo_material} onChange={handleChange} required>
            <option value="">— Seleccionar —</option>
            {materiales.map(m => (
              <option key={m.codigo_material} value={m.codigo_material}>{m.nombre}</option>
            ))}
          </select>
        </div>
        <div className="crud-form-group">
          <label>Cantidad</label>
          <input type="number" name="cantidad" value={form.cantidad} onChange={handleChange} min="1" required />
        </div>
        <div className="crud-form-group">
          <label>Ficha</label>
          <select name="id_ficha" value={form.id_ficha} onChange={handleChange} required>
            <option value="">— Seleccionar —</option>
            {fichas.map(f => (
              <option key={f.id_ficha} value={f.id_ficha}>#{f.numero_ficha}</option>
            ))}
          </select>
        </div>

        <div className="crud-form-group">
          <label>ID Aprendiz</label>
          <input name="id_aprendiz" value={form.id_aprendiz} onChange={handleChange} placeholder="ID del aprendiz" required />
        </div>

        {isEditing ? (
          <div className="crud-form-group">
            <label>Estado de Solicitud</label>
            <select name="estado" value={form.estado} onChange={handleChange}>
              <option value="Pendiente">Pendiente</option>
              <option value="Aprobada">Aprobada</option>
              <option value="Rechazada">Rechazada</option>
            </select>
          </div>
        ) : (
          <button type="submit" className="btn-pill btn-pill-submit" style={{ gridColumn: 'span 2' }}>Aceptar</button>
        )}

        {isEditing && (
          <button type="submit" className="btn-pill btn-pill-submit" style={{ gridColumn: 'span 1' }}>Aceptar</button>
        )}
      </div>
    </form>
  );
};

const estadoBadgeClass = (estado: string) => {
  const e = (estado || '').toLowerCase();
  if (e === 'aprobada') return 'sol-badge aprobada';
  if (e === 'rechazada') return 'sol-badge rechazada';
  return 'sol-badge pendiente';
};

export const SolicitudesPage: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Solicitud | null>(null);

  useEffect(() => {
    fetchSolicitudes();
    fetch(MAT_URL).then(r => r.json()).then(setMateriales).catch(() => {});
    fetch(FICHAS_URL).then(r => r.json()).then(setFichas).catch(() => {});
  }, []);

  const fetchSolicitudes = async () => {
    try { setSolicitudes(await (await fetch(API_URL)).json()); }
    catch (err) { console.error(err); }
  };

  const handleSubmit = async (data: Solicitud) => {
    try {
      if (editing?.id_solicitud) {
        await fetch(`${API_URL}/${editing.id_solicitud}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
        });
      } else {
        await fetch(API_URL, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
        });
      }
      await fetchSolicitudes();
      setIsModalOpen(false);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (s: Solicitud) => {
    if (window.confirm('¿Eliminar esta solicitud?')) {
      await fetch(`${API_URL}/${s.id_solicitud}`, { method: 'DELETE' });
      await fetchSolicitudes();
    }
  };

  const filtered = solicitudes.filter(s =>
    String(s.id_solicitud || '').includes(searchTerm) ||
    (s.nombre_material || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.estado || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fmtFecha = (d?: string) => d ? new Date(d).toLocaleDateString('es-CO') : '—';

  return (
    <div className="crud-page-container redesign">
      <div className="crud-header-actions">
        <h2>SOLICITUDES</h2>
        <div className="crud-header-right">
          <div className="crud-search-bar">
            <span><FaSearch /></span>
            <input
              type="text" placeholder="Buscar solicitud..." className="crud-search-input"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-pill btn-pill-add" onClick={() => { setEditing(null); setIsModalOpen(true); }}>
            <FaPlus /> añadir solicitud
          </button>
        </div>
      </div>

      <div className="sol-section-label" style={{ marginBottom: '12px' }}>Solicitudes de los Users</div>

      <div className="crud-table-wrapper">
        <table className="crud-table redesign">
          <thead>
            <tr>
              <th>#</th>
              <th>Material</th>
              <th>Ficha</th>
              <th>Aprendiz</th>
              <th>Cantidad</th>
              <th>Fecha</th>
              <th style={{ textAlign: 'center' }}>Estado</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id_solicitud}>
                <td className="bold-text">{s.id_solicitud}</td>
                <td>{s.nombre_material || `Cód. ${s.codigo_material}`}</td>
                <td>#{s.id_ficha}</td>
                <td>#{s.id_aprendiz}</td>
                <td>{s.cantidad}</td>
                <td>{fmtFecha(s.fecha)}</td>
                <td style={{ textAlign: 'center' }}>
                  <span className={estadoBadgeClass(s.estado)}>{s.estado}</span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <div className="action-pill-group">
                    <button className="btn-pill btn-pill-edit" onClick={() => { setEditing(s); setIsModalOpen(true); }}>Editar</button>
                    <button className="btn-pill btn-pill-delete" onClick={() => handleDelete(s)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <SolicitudForm
          initial={editing || undefined}
          isEditing={editing !== null}
          materiales={materiales}
          fichas={fichas}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
};
