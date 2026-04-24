import React, { useState, useEffect } from 'react';
import { Modal } from '../../molecules/Modal/Modal';
import '../MaterialesPage/MaterialesPage.css';

const API_URL = 'http://localhost:3001/areas';

interface Area {
  id_area?: number;
  nombre_area: string;
  programas?: string; // Lista de programas concatenada desde el backend
  nombre_programa?: string; // Para el formulario de creación
}

const AreaForm: React.FC<{
  initial?: Area;
  isEditing: boolean;
  onSubmit: (data: Area) => void;
}> = ({ initial, isEditing, onSubmit }) => {
  const [form, setForm] = useState<Area>(initial || { nombre_area: '', nombre_programa: '' });

  useEffect(() => {
    setForm(initial || { nombre_area: '', nombre_programa: '' });
  }, [initial]);

  return (
    <form className="crud-form" onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
      <h3 className="crud-form-title">{isEditing ? 'EDITAR ÁREA' : 'AÑADIR ÁREA'}</h3>
      <div className="crud-form-grid">
        <div className="crud-form-group">
          <label>Nombre del Área</label>
          <input
            name="nombre_area"
            value={form.nombre_area}
            onChange={e => setForm({ ...form, nombre_area: e.target.value })}
            placeholder="Ej: Tic, Agropecuaria"
            required
          />
        </div>
        {!isEditing && (
          <div className="crud-form-group">
            <label>Programa Inicial (Opcional)</label>
            <input
              name="nombre_programa"
              value={form.nombre_programa}
              onChange={e => setForm({ ...form, nombre_programa: e.target.value })}
              placeholder="Ej: Análisis en software"
            />
          </div>
        )}
      </div>
      <div className="crud-form-actions">
        <button type="submit" className="btn-submit-crud">Aceptar</button>
      </div>
    </form>
  );
};

export const AreasPage: React.FC = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Area | null>(null);

  useEffect(() => { fetchAreas(); }, []);

  const fetchAreas = async () => {
    try {
      const res = await fetch(API_URL);
      setAreas(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (data: Area) => {
    try {
      if (editing?.id_area) {
        await fetch(`${API_URL}/${editing.id_area}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
        });
      } else {
        await fetch(API_URL, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
        });
      }
      await fetchAreas();
      setIsModalOpen(false);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (a: Area) => {
    if (window.confirm('¿Eliminar esta área?')) {
      await fetch(`${API_URL}/${a.id_area}`, { method: 'DELETE' });
      await fetchAreas();
    }
  };

  const filtered = areas.filter(a =>
    (a.nombre_area || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.programas || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="crud-page-container">
      <div className="crud-header-actions">
        <h2>ÁREAS Y PROGRAMAS</h2>
        <div className="crud-actions-right">
          <div className="crud-search-bar">
            <span>🔍</span>
            <input
              type="text" placeholder="Buscar área o programa" className="crud-search-input"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-add-crud" onClick={() => { setEditing(null); setIsModalOpen(true); }}>
            Añadir Área
          </button>
        </div>
      </div>

      <div className="crud-table-wrapper">
        <table className="crud-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del Área</th>
              <th>Programas de Formación</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map(a => (
                <tr key={a.id_area}>
                  <td className="bold-text">{a.id_area}</td>
                  <td>{a.nombre_area}</td>
                  <td style={{ fontStyle: a.programas ? 'normal' : 'italic', color: a.programas ? 'inherit' : '#999' }}>
                    {a.programas || 'Sin programas asignados'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button className="btn-action-edit" onClick={() => { setEditing(a); setIsModalOpen(true); }}>Editar</button>
                    <button className="btn-action-delete" onClick={() => handleDelete(a)}>Eliminar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>No se encontraron registros</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AreaForm initial={editing || undefined} isEditing={editing !== null} onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
};
