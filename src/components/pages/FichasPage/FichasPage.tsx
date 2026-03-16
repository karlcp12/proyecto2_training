import React, { useState, useEffect } from 'react';
import { Modal } from '../../molecules/Modal/Modal';
import '../MaterialesPage/MaterialesPage.css';

const API_URL = 'http://localhost:3000/fichas';

interface Ficha {
  id_ficha?: number;
  numero_ficha: string;
  id_programa: string | number;
  instructor_lider: string;
  ambiente: string;
  jornada: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
}

const emptyFicha: Ficha = {
  numero_ficha: '', id_programa: '', instructor_lider: '',
  ambiente: '', jornada: 'Mañana', fecha_inicio: '', fecha_fin: '', estado: 'Activo',
};

const FichaForm: React.FC<{
  initial?: Ficha;
  isEditing: boolean;
  onSubmit: (data: Ficha) => void;
}> = ({ initial, isEditing, onSubmit }) => {
  const [form, setForm] = useState<Ficha>(initial || emptyFicha);

  useEffect(() => {
    setForm(initial || emptyFicha);
  }, [initial]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form className="crud-form" onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
      <h3 className="crud-form-title">{isEditing ? 'EDITAR FICHA' : 'AÑADIR FICHA'}</h3>
      <div className="crud-form-grid">
        <div className="crud-form-group">
          <label>Número de Ficha</label>
          <input name="numero_ficha" value={form.numero_ficha} onChange={handleChange} placeholder="Ej: F001" required />
        </div>
        <div className="crud-form-group">
          <label>Instructor Líder</label>
          <input name="instructor_lider" value={form.instructor_lider} onChange={handleChange} placeholder="Nombre del instructor" required />
        </div>
        <div className="crud-form-group">
          <label>Ambiente</label>
          <input name="ambiente" value={form.ambiente} onChange={handleChange} placeholder="Ej: Aula 301" required />
        </div>
        <div className="crud-form-group">
          <label>Jornada</label>
          <select name="jornada" value={form.jornada} onChange={handleChange}>
            <option value="Mañana">Mañana</option>
            <option value="Tarde">Tarde</option>
            <option value="Noche">Noche</option>
            <option value="Madrugada">Madrugada</option>
          </select>
        </div>
        <div className="crud-form-group">
          <label>Fecha de Inicio</label>
          <input type="date" name="fecha_inicio" value={form.fecha_inicio} onChange={handleChange} required />
        </div>
        <div className="crud-form-group">
          <label>Fecha de Fin</label>
          <input type="date" name="fecha_fin" value={form.fecha_fin} onChange={handleChange} required />
        </div>
        {isEditing && (
          <div className="crud-form-group">
            <label>Estado</label>
            <select name="estado" value={form.estado} onChange={handleChange}>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        )}
      </div>
      <div className="crud-form-actions">
        <button type="submit" className="btn-submit-crud">Aceptar</button>
      </div>
    </form>
  );
};

export const FichasPage: React.FC = () => {
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Ficha | null>(null);

  useEffect(() => { fetchFichas(); }, []);

  const fetchFichas = async () => {
    try {
      const res = await fetch(API_URL);
      setFichas(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (data: Ficha) => {
    try {
      if (editing?.id_ficha) {
        await fetch(`${API_URL}/${editing.id_ficha}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
        });
      } else {
        await fetch(API_URL, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
        });
      }
      await fetchFichas();
      setIsModalOpen(false);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (f: Ficha) => {
    if (window.confirm('¿Eliminar esta ficha?')) {
      await fetch(`${API_URL}/${f.id_ficha}`, { method: 'DELETE' });
      await fetchFichas();
    }
  };

  const filtered = fichas.filter(f =>
    (f.numero_ficha || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.instructor_lider || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.ambiente || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fmtFecha = (d: string) => d ? new Date(d).toLocaleDateString('es-CO') : '—';

  return (
    <div className="crud-page-container">
      <div className="crud-header-actions">
        <h2>FICHAS</h2>
        <div className="crud-actions-right">
          <div className="crud-search-bar">
            <span>🔍</span>
            <input
              type="text" placeholder="Search" className="crud-search-input"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-add-crud" onClick={() => { setEditing(null); setIsModalOpen(true); }}>
            Añadir Ficha
          </button>
        </div>
      </div>

      <div className="crud-table-wrapper">
        <table className="crud-table">
          <thead>
            <tr>
              <th>N° Ficha</th>
              <th>Instructor Líder</th>
              <th>Ambiente</th>
              <th>Jornada</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Estado</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(f => (
              <tr key={f.id_ficha}>
                <td className="bold-text">{f.numero_ficha}</td>
                <td>{f.instructor_lider}</td>
                <td>{f.ambiente}</td>
                <td>{f.jornada}</td>
                <td>{fmtFecha(f.fecha_inicio)}</td>
                <td>{fmtFecha(f.fecha_fin)}</td>
                <td>
                  <span className={`badge-estado ${(f.estado || '').toLowerCase()}`}>{f.estado}</span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button className="btn-action-edit" onClick={() => { setEditing(f); setIsModalOpen(true); }}>Editar</button>
                  <button className="btn-action-delete" onClick={() => handleDelete(f)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <FichaForm initial={editing || undefined} isEditing={editing !== null} onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
};
