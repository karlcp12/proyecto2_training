import React, { useState, useEffect } from 'react';
import { Modal } from '../../molecules/Modal/Modal';
import { FaSearch, FaPlus, FaGraduationCap } from 'react-icons/fa';
import '../MaterialesPage/MaterialesPage.css';

const API_URL = 'http://localhost:3001/aprendices';
const FICHAS_URL = 'http://localhost:3001/fichas';

interface Aprendiz {
  id_aprendiz?: number;
  nombre: string;
  apellido: string;
  documento: string;
  correo: string;
  direccion: string;
  telefono: string;
  id_ficha: number | string;
}

interface Ficha {
  id_ficha: number;
  numero_ficha: string;
}

const emptyAprendiz: Aprendiz = {
  nombre: '',
  apellido: '',
  documento: '',
  correo: '',
  direccion: '',
  telefono: '',
  id_ficha: ''
};

const AprendizForm: React.FC<{
  initial?: Aprendiz;
  isEditing: boolean;
  fichas: Ficha[];
  onSubmit: (data: Aprendiz) => void;
}> = ({ initial, isEditing, fichas, onSubmit }) => {
  const [form, setForm] = useState<Aprendiz>(initial || emptyAprendiz);

  useEffect(() => {
    setForm(initial || emptyAprendiz);
  }, [initial]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form className="crud-form redesign" onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
      <h3 className="crud-form-title">{isEditing ? 'EDITAR APRENDIZ' : 'REGISTRAR APRENDIZ'}</h3>

      <div className="crud-form-grid">
        <div className="crud-form-group">
          <label>Nombre</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombres" required />
        </div>
        <div className="crud-form-group">
          <label>Apellido</label>
          <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellidos" required />
        </div>
        <div className="crud-form-group">
          <label>Documento</label>
          <input name="documento" value={form.documento} onChange={handleChange} placeholder="Documento de identidad" required />
        </div>
        <div className="crud-form-group">
          <label>Correo Electrónico</label>
          <input type="email" name="correo" value={form.correo} onChange={handleChange} placeholder="correo@ejemplo.com" required />
        </div>
        <div className="crud-form-group">
          <label>Ficha</label>
          <select name="id_ficha" value={form.id_ficha} onChange={handleChange} required>
            <option value="">— Seleccionar Ficha —</option>
            {fichas.map(f => (
              <option key={f.id_ficha} value={f.id_ficha}>#{f.numero_ficha}</option>
            ))}
          </select>
        </div>
        <div className="crud-form-group">
          <label>Teléfono</label>
          <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Número de contacto" />
        </div>
        <div className="crud-form-group span-2">
          <label>Dirección</label>
          <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección de residencia" />
        </div>

        <button type="submit" className="btn-pill btn-pill-submit" style={{ gridColumn: 'span 2', marginTop: '10px' }}>
          {isEditing ? 'Guardar Cambios' : 'Registrar Aprendiz'}
        </button>
      </div>
    </form>
  );
};

export const AprendicesPage: React.FC = () => {
  const [aprendices, setAprendices] = useState<Aprendiz[]>([]);
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Aprendiz | null>(null);

  const fetchAprendices = async () => {
    try {
      const res = await fetch(API_URL);
      setAprendices(await res.json());
    } catch (err) {
      console.error("Error al cargar aprendices:", err);
    }
  };

  const fetchFichas = async () => {
    try {
      const res = await fetch(FICHAS_URL);
      setFichas(await res.json());
    } catch (err) {
      console.error("Error al cargar fichas:", err);
    }
  };

  useEffect(() => {
    fetchAprendices();
    fetchFichas();
  }, []);

  const handleSubmit = async (data: Aprendiz) => {
    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `${API_URL}/${editing.id_aprendiz}` : API_URL;

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      await fetchAprendices();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error al guardar aprendiz:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Eliminar este aprendiz?')) {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        await fetchAprendices();
      } catch (err) {
        console.error("Error al eliminar aprendiz:", err);
      }
    }
  };

  const filtered = aprendices.filter(a =>
    `${a.nombre} ${a.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.documento.includes(searchTerm) ||
    a.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="crud-page-container redesign">
      <div className="crud-header-actions">
        <h2>APRENDICES</h2>
        <div className="crud-header-right">
          <div className="crud-search-bar">
            <span><FaSearch /></span>
            <input
              type="text" placeholder="Buscar por nombre, documento o correo..." className="crud-search-input"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-pill btn-pill-add" onClick={() => { setEditing(null); setIsModalOpen(true); }}>
            <FaPlus /> añadir aprendiz
          </button>
        </div>
      </div>

      <div className="crud-table-wrapper">
        <table className="crud-table redesign">
          <thead>
            <tr>
              <th>Documento</th>
              <th>Nombre Completo</th>
              <th>Ficha</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                  No se encontraron aprendices.
                </td>
              </tr>
            ) : (
              filtered.map(a => (
                <tr key={a.id_aprendiz}>
                  <td className="bold-text">{a.documento}</td>
                  <td>{a.nombre} {a.apellido}</td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <FaGraduationCap style={{ color: '#4f46e5' }} /> #{a.id_ficha}
                    </span>
                  </td>
                  <td>{a.correo}</td>
                  <td>{a.telefono || '—'}</td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="action-pill-group">
                      <button className="btn-pill btn-pill-edit" onClick={() => { setEditing(a); setIsModalOpen(true); }}>Editar</button>
                      <button className="btn-pill btn-pill-delete" onClick={() => a.id_aprendiz && handleDelete(a.id_aprendiz)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AprendizForm
          initial={editing || undefined}
          isEditing={editing !== null}
          fichas={fichas}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
};
