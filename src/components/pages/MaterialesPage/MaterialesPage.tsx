import React, { useState, useEffect } from 'react';
import { Modal } from '../../molecules/Modal/Modal';
import './MaterialesPage.css';

const API_URL = 'http://localhost:3000/bodega';

interface Material {
  codigo_material?: number;
  nombre: string;
  cantidad: number | string;
  tipo: string;
}

const MaterialForm: React.FC<{
  initial?: Material;
  isEditing: boolean;
  onSubmit: (data: Material) => void;
}> = ({ initial, isEditing, onSubmit }) => {
  const [form, setForm] = useState<Material>(
    initial || { nombre: '', cantidad: '', tipo: '' }
  );

  useEffect(() => {
    setForm(initial || { nombre: '', cantidad: '', tipo: '' });
  }, [initial]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form className="crud-form" onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
      <h3 className="crud-form-title">{isEditing ? 'EDITAR MATERIAL' : 'AÑADIR MATERIAL'}</h3>
      <div className="crud-form-grid">
        <div className="crud-form-group">
          <label>Nombre</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre del material" required />
        </div>
        <div className="crud-form-group">
          <label>Cantidad</label>
          <input type="number" name="cantidad" value={form.cantidad} onChange={handleChange} placeholder="Cantidad" required min="0" />
        </div>
        <div className="crud-form-group">
          <label>Tipo / Categoría</label>
          <input name="tipo" value={form.tipo} onChange={handleChange} placeholder="Ej: Electrónico, Mobiliario" required />
        </div>
      </div>
      <div className="crud-form-actions">
        <button type="submit" className="btn-submit-crud">Aceptar</button>
      </div>
    </form>
  );
};

export const MaterialesPage: React.FC = () => {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Material | null>(null);

  useEffect(() => { fetchMateriales(); }, []);

  const fetchMateriales = async () => {
    try {
      const res = await fetch(API_URL);
      setMateriales(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (data: Material) => {
    try {
      if (editing?.codigo_material) {
        await fetch(`${API_URL}/${editing.codigo_material}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
        });
      } else {
        await fetch(API_URL, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
        });
      }
      await fetchMateriales();
      setIsModalOpen(false);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (m: Material) => {
    if (window.confirm('¿Eliminar este material?')) {
      await fetch(`${API_URL}/${m.codigo_material}`, { method: 'DELETE' });
      await fetchMateriales();
    }
  };

  const filtered = materiales.filter(m =>
    (m.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.tipo || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="crud-page-container">
      <div className="crud-header-actions">
        <h2>MATERIALES</h2>
        <div className="crud-actions-right">
          <div className="crud-search-bar">
            <span>🔍</span>
            <input
              type="text" placeholder="Search" className="crud-search-input"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-add-crud" onClick={() => { setEditing(null); setIsModalOpen(true); }}>
            Añadir Material
          </button>
        </div>
      </div>

      <div className="crud-table-wrapper">
        <table className="crud-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Tipo</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.codigo_material}>
                <td className="bold-text">{m.codigo_material}</td>
                <td>{m.nombre}</td>
                <td>
                  <span className={`badge-cantidad ${Number(m.cantidad) > 10 ? 'alto' : Number(m.cantidad) > 0 ? 'medio' : 'bajo'}`}>
                    {m.cantidad}
                  </span>
                </td>
                <td>{m.tipo}</td>
                <td style={{ textAlign: 'center' }}>
                  <button className="btn-action-edit" onClick={() => { setEditing(m); setIsModalOpen(true); }}>Editar</button>
                  <button className="btn-action-delete" onClick={() => handleDelete(m)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <MaterialForm initial={editing || undefined} isEditing={editing !== null} onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
};
