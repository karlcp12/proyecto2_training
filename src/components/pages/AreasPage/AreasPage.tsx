import React, { useState, useEffect } from 'react';
import { Modal } from '../../molecules/Modal/Modal';
import { FaMapMarkedAlt, FaPlus, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './AreasPage.css';
import '../MaterialesPage/MaterialesPage.css'; // Keep shared form styles

const API_URL = 'http://localhost:3000/centros';

interface Area {
  id_area?: number;
  nombre_area: string;
}

const AreaForm: React.FC<{
  initial?: Area;
  isEditing: boolean;
  onSubmit: (data: Area) => void;
}> = ({ initial, isEditing, onSubmit }) => {
  const [form, setForm] = useState<Area>(initial || { nombre_area: '' });

  useEffect(() => {
    setForm(initial || { nombre_area: '' });
  }, [initial]);

  return (
    <form className="crud-form" onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
      <h3 className="crud-form-title">{isEditing ? 'EDITAR ÁREA' : 'AÑADIR ÁREA'}</h3>
      <div className="crud-form-grid">
        <div className="crud-form-group">
          <label>Nombre del área</label>
          <input
            name="nombre_area"
            value={form.nombre_area}
            onChange={e => setForm({ ...form, nombre_area: e.target.value })}
            placeholder="Ej: Bodega de Sistemas, Taller de Soldadura"
            required
          />
        </div>
      </div>
      <div className="crud-form-actions">
        <button type="submit" className="btn-pill btn-pill-submit">Aceptar</button>
      </div>
    </form>
  );
};

export const AreasPage: React.FC = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Area | null>(null);
  const navigate = useNavigate();

  useEffect(() => { fetchAreas(); }, []);

  const fetchAreas = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setAreas(Array.isArray(data) ? data : []);
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
    (a.nombre_area || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="areas-page-container redesign">
      <div className="crud-header-actions">
        <h2>ÁREAS / SEDES</h2>
        <div className="crud-header-right">
          <div className="crud-search-bar">
            <span><FaSearch /></span>
            <input
              type="text" placeholder="Buscar área..." className="crud-search-input"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-pill btn-pill-add" onClick={() => { setEditing(null); setIsModalOpen(true); }}>
            <FaPlus /> añadir área
          </button>
        </div>
      </div>

      <div className="areas-grid">
        {filtered.map(a => (
          <div 
            className="area-card" 
            key={a.id_area} 
            onClick={() => navigate(`/app/areas/${a.id_area}/bodega`)}
            style={{ cursor: 'pointer' }}
          >
            <div className="area-icon-wrapper">
              <FaMapMarkedAlt />
            </div>
            <h3 className="area-name">{a.nombre_area}</h3>
            <span className="area-id-badge">ID: {a.id_area}</span>
            <div className="area-card-actions" onClick={e => e.stopPropagation()}>
              <button className="btn-pill btn-pill-edit" onClick={() => { setEditing(a); setIsModalOpen(true); }}>
                Editar
              </button>
              <button className="btn-pill btn-pill-delete" onClick={() => handleDelete(a)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AreaForm initial={editing || undefined} isEditing={editing !== null} onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
};
