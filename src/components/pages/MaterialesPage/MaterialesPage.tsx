import React, { useState, useEffect } from 'react';
import { Modal } from '../../molecules/Modal/Modal';
import { FaPlus, FaSearch } from 'react-icons/fa';
import './MaterialesPage.css';

const API_URL = 'http://localhost:3000/bodega';
const AREAS_URL = 'http://localhost:3000/centros';

interface Material {
  codigo_material?: number;
  nombre: string;
  cantidad: number | string;
  tipo: string;
  responsable?: string;
  ubicacion?: string;
  uso?: string;
  tiene_caducidad?: string;
  fecha_vencimiento?: string;
  categoria?: string;
  id_area?: number;
  ente_sena?: string;
}

const MaterialForm: React.FC<{
  initial?: Material;
  isEditing: boolean;
  onSubmit: (data: Material) => void;
}> = ({ initial, isEditing, onSubmit }) => {
  const [form, setForm] = useState<Material>(
    initial || { 
      nombre: '', cantidad: '', tipo: 'General', responsable: '',
      ubicacion: '', uso: '', tiene_caducidad: 'No',
      fecha_vencimiento: '', categoria: '', ente_sena: ''
    }
  );
  const [areas, setAreas] = useState<any[]>([]);

  useEffect(() => {
    fetchAreas();
    setForm(initial || { 
      nombre: '', cantidad: '', tipo: 'General', responsable: '',
      ubicacion: '', uso: '', tiene_caducidad: 'No',
      fecha_vencimiento: '', categoria: '', ente_sena: ''
    });
  }, [initial]);

  const fetchAreas = async () => {
    try {
      const res = await fetch(AREAS_URL);
      setAreas(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form className="crud-form redesign" onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
      <h3 className="crud-form-title">{isEditing ? 'EDITAR MATERIAL' : 'AÑADIR MATERIAL'}</h3>
      <div className="crud-form-grid">
        {/* Row 1 */}
        <div className="crud-form-group">
          <label>Nombre</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej: Computadores PC" required />
        </div>
        <div className="crud-form-group">
          <label>Responsable</label>
          <input name="responsable" value={form.responsable} onChange={handleChange} placeholder="Nombre del responsable" />
        </div>
        <div className="crud-form-group">
          <label>Código</label>
          <input name="codigo_material" value={form.codigo_material || ''} onChange={handleChange} placeholder="4848" readOnly={isEditing} />
        </div>

        {/* Row 2 */}
        <div className="crud-form-group">
          <label>Lugar de almacenamiento</label>
          <input name="ubicacion" value={form.ubicacion} onChange={handleChange} placeholder="Ej: Bodega TICs" />
        </div>
        <div className="crud-form-group">
          <label>{isEditing ? 'Uso' : 'Área'}</label>
          {isEditing ? (
            <input name="uso" value={form.uso || ''} onChange={handleChange} placeholder="Ej: TIC" />
          ) : (
            <select name="id_area" value={form.id_area || ''} onChange={handleChange}>
              <option value="">-- Seleccione Área --</option>
              {areas.map(a => (
                <option key={a.id_area} value={a.id_area}>{a.nombre_area}</option>
              ))}
            </select>
          )}
        </div>
        <div className="crud-form-group">
          <label>Cantidad</label>
          <input type="number" name="cantidad" value={form.cantidad} onChange={handleChange} placeholder="0" required min="0" />
        </div>

        {/* Row 3 */}
        <div className="crud-form-group">
          <label>Categoría</label>
          <select name="categoria" value={form.categoria} onChange={handleChange} required>
            <option value="">-- Elige categoría --</option>
            <option value="Consumible">Consumible</option>
            <option value="No consumible">No consumible</option>
            <option value="Herramienta">Herramienta</option>
            <option value="Equipos">Equipos</option>
          </select>
        </div>
        <div className="crud-form-group">
          <label>¿Tiene fecha de caducidad?</label>
          <select name="tiene_caducidad" value={form.tiene_caducidad} onChange={handleChange}>
            <option value="No">No</option>
            <option value="Sí">Sí</option>
          </select>
        </div>
        {form.tiene_caducidad === 'Sí' ? (
          <div className="crud-form-group">
            <label>Fecha de vencimiento</label>
            <input type="date" name="fecha_vencimiento" value={form.fecha_vencimiento} onChange={handleChange} />
          </div>
        ) : (
          <div className="crud-form-group">
             <label>Ente Sena</label>
             <input name="ente_sena" value={form.ente_sena || ''} onChange={handleChange} placeholder="Sena" />
          </div>
        )}

        {/* Row 4 */}
        {form.tiene_caducidad === 'Sí' && (
          <div className="crud-form-group">
            <label>Ente Sena</label>
            <input name="ente_sena" value={form.ente_sena || ''} onChange={handleChange} placeholder="Sena" />
          </div>
        )}
        
        <button type="submit" className="btn-pill btn-pill-submit" style={{ gridColumn: 'span 2' }}>Aceptar</button>
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
    (m.categoria || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="crud-page-container redesign">
      <div className="crud-header-actions">
        <h2>MATERIALES</h2>
        <div className="crud-header-right">
          <div className="crud-search-bar">
            <span><FaSearch /></span>
            <input
              type="text" placeholder="Buscar material o código..." className="crud-search-input"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-pill btn-pill-add" onClick={() => { setEditing(null); setIsModalOpen(true); }}>
            <FaPlus /> añadir material
          </button>
        </div>
      </div>

      <div className="crud-table-wrapper">
        <table className="crud-table redesign">
          <thead>
            <tr>
              <th>Código</th>
              <th>Elemento</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Área</th>
              <th>Ubicación</th>
              <th>Responsable</th>
              <th>Ente Sena</th>
              <th>Vencimiento</th>
              <th>Estado</th>
              <th style={{ textAlign: 'center' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.codigo_material}>
                <td className="bold-text">{m.codigo_material}</td>
                <td className="material-name-col">{m.nombre}</td>
                <td>{m.categoria || 'N/A'}</td>
                <td>
                  <span className="badge-stock">
                    {m.cantidad}
                  </span>
                </td>
                <td>{m.id_area || 'TIC'}</td>
                <td>{m.ubicacion || 'Bodega TICs'}</td>
                <td>{m.responsable || 'Wilson'}</td>
                <td>{m.ente_sena || 'Sena'}</td>
                <td>{m.fecha_vencimiento ? new Date(m.fecha_vencimiento).toLocaleDateString() : 'No aplica'}</td>
                <td>
                  <span className={`badge-status ${Number(m.cantidad) > 0 ? 'active' : 'inactive'}`}>
                    {Number(m.cantidad) > 0 ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <div className="action-pill-group">
                    <button className="btn-pill btn-pill-edit" onClick={() => { setEditing(m); setIsModalOpen(true); }}>Editar</button>
                    <button className="btn-pill btn-pill-delete" onClick={() => handleDelete(m)}>Eliminar</button>
                  </div>
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
