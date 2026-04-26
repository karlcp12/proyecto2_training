import React, { useState, useEffect } from 'react';
import { Modal } from '../../molecules/Modal/Modal';
import '../MaterialesPage/MaterialesPage.css';

const API_URL = 'http://localhost:3001/fichas';

interface Ficha {
  id_ficha?: number;
  numero_ficha: string;
  id_programa: string | number;
  id_area: string | number;
  nombre_programa?: string;
  nombre_area?: string;
  instructor_lider: string;
  ambiente: string;
  jornada: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
}

const emptyFicha: Ficha = {
  numero_ficha: '', id_programa: '', id_area: '', instructor_lider: '',
  ambiente: '', jornada: 'Mañana', fecha_inicio: '', fecha_fin: '', estado: 'Activo',
};

interface Area { id_area: number; nombre_area: string; }
interface Programa { id_programa: number; nombre_programa: string; id_area: number; }

const FichaForm: React.FC<{
  initial?: Ficha;
  isEditing: boolean;
  onSubmit: (data: Ficha) => void;
  areas: Area[];
  programas: Programa[];
}> = ({ initial, isEditing, onSubmit, areas, programas }) => {
  const [form, setForm] = useState<Ficha>(initial || emptyFicha);

  useEffect(() => {
    setForm(initial || emptyFicha);
  }, [initial]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Filtrar programas si hay un área seleccionada
  const filteredProgramas = form.id_area 
    ? programas.filter(p => Number(p.id_area) === Number(form.id_area))
    : [];

  return (
    <form className="crud-form" onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
      <h3 className="crud-form-title">{isEditing ? 'EDITAR FICHA' : 'AÑADIR FICHA'}</h3>
      <div className="crud-form-grid">
        <div className="crud-form-group">
          <label>Área</label>
          <select name="id_area" value={form.id_area} onChange={handleChange} required>
            <option value="">Seleccione un área...</option>
            {areas.map(a => <option key={a.id_area} value={a.id_area}>{a.nombre_area}</option>)}
          </select>
        </div>
        <div className="crud-form-group">
          <label>Programa</label>
          <select name="id_programa" value={form.id_programa} onChange={handleChange} required disabled={!form.id_area}>
            <option value="">{form.id_area ? 'Seleccione un programa...' : 'Primero elija un área'}</option>
            {filteredProgramas.map(p => <option key={p.id_programa} value={p.id_programa}>{p.nombre_programa}</option>)}
          </select>
        </div>
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
  const [areas, setAreas] = useState<Area[]>([]);
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Ficha | null>(null);

  useEffect(() => { 
    if (isModalOpen) {
      fetchCatalogos();
      fetchFichas();
    }
  }, [isModalOpen]);

  useEffect(() => { 
    fetchFichas(); 
    fetchCatalogos();
  }, []);

  const fetchCatalogos = async () => {
    try {
      const [resAreas, resProgs] = await Promise.all([
        fetch('http://localhost:3001/areas'),
        fetch('http://localhost:3001/programas')
      ]);
      setAreas(await resAreas.json());
      setProgramas(await resProgs.json());
    } catch (err) { console.error("Error cargando catálogos:", err); }
  };

  const fetchFichas = async () => {
    try {
      const res = await fetch(API_URL);
      setFichas(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (data: Ficha) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userName = currentUser.nombre || currentUser.NOMBRE || currentUser.usuario || 'Desconocido';
    const method = editing?.id_ficha ? 'PUT' : 'POST';
    const url = editing?.id_ficha 
        ? `${API_URL}/${editing.id_ficha}?user=${encodeURIComponent(userName)}` 
        : `${API_URL}?user=${encodeURIComponent(userName)}`;

    try {
      await fetch(url, {
        method, 
        headers: { 'Content-Type': 'application/json', 'X-User-Action': userName }, 
        body: JSON.stringify(data),
      });
      await fetchFichas();
      setIsModalOpen(false);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (f: Ficha) => {
    if (window.confirm('¿Eliminar esta ficha?')) {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userName = currentUser.nombre || currentUser.NOMBRE || currentUser.usuario || 'Desconocido';
      await fetch(`${API_URL}/${f.id_ficha}?user=${encodeURIComponent(userName)}`, { 
        method: 'DELETE',
        headers: { 'X-User-Action': userName }
      });
      await fetchFichas();
    }
  };

  const filtered = sortedFichas(fichas).filter(f =>
    (f.numero_ficha || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.instructor_lider || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.nombre_area || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.nombre_programa || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  function sortedFichas(arr: Ficha[]) {
    return [...arr].sort((a, b) => (b.id_ficha || 0) - (a.id_ficha || 0));
  }

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
          <button className="btn-add-crud" onClick={() => { 
            if (areas.length === 0) {
              alert("Primero debes crear un Área en el módulo de Áreas");
              return;
            }
            setEditing(null); 
            setIsModalOpen(true); 
          }}>
            Añadir Ficha
          </button>
        </div>
      </div>

      <div className="crud-table-wrapper">
        <table className="crud-table">
          <thead>
            <tr>
              <th>N° Ficha</th>
              <th>Área</th>
              <th>Programa</th>
              <th>Instructor</th>
              <th>Ambiente</th>
              <th>Jornada</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Estado</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map(f => (
                <tr key={f.id_ficha}>
                  <td className="bold-text">{f.numero_ficha}</td>
                  <td>{f.nombre_area || 'Desconocida'}</td>
                  <td>{f.nombre_programa || 'N/A'}</td>
                  <td>{f.instructor_lider}</td>
                  <td>{f.ambiente}</td>
                  <td>{f.jornada}</td>
                  <td>{fmtFecha(f.fecha_inicio)}</td>
                  <td>{fmtFecha(f.fecha_fin)}</td>
                  <td>
                    <span className={`badge-estado ${(f.estado || '').toLowerCase()}`}>{f.estado}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button className="btn-action-edit" onClick={() => { setEditing(f); setIsModalOpen(true); }}>Edit</button>
                    <button className="btn-action-delete" onClick={() => handleDelete(f)}>Del</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} style={{textAlign: 'center', padding: '20px'}}>No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <FichaForm 
          initial={editing || undefined} 
          isEditing={editing !== null} 
          onSubmit={handleSubmit} 
          areas={areas}
          programas={programas}
        />
      </Modal>
    </div>
  );
};
