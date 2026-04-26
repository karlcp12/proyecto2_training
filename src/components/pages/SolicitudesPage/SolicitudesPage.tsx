import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '../../molecules/Modal/Modal';
import { FaFileAlt, FaClock, FaCheckCircle, FaTimesCircle, FaPlus } from 'react-icons/fa';
import '../MaterialesPage/MaterialesPage.css';
import './SolicitudesPage.css';

const API_URL = 'http://localhost:3001/solicitudes';
const MAT_URL = 'http://localhost:3001/bodega';
const FICHAS_URL = 'http://localhost:3001/fichas';

interface Solicitud {
  id_solicitud?: number;
  id_usuario: string | number;
  nombre_usuario?: string;
  codigo_material: string | number;
  nombre_material?: string;
  id_ficha: string | number;
  numero_ficha?: string;
  cantidad: string | number;
  fecha?: string;
  estado: string;
  id_instructor?: string | number;
  nombre_instructor?: string;
}

interface Material { codigo_material: number; nombre: string; }
interface Ficha { id_ficha: number; numero_ficha: string; }
interface Usuario { id_usuario: number; nombre: string; apellidos: string; rol: string; }

const SolicitudForm: React.FC<{
  initial?: Solicitud;
  isEditing: boolean;
  materiales: Material[];
  fichas: Ficha[];
  usuarios: Usuario[];
  onSubmit: (data: Solicitud) => void;
  currentUser: any;
}> = ({ initial, isEditing, materiales, fichas, usuarios, onSubmit, currentUser }) => {
  const empty: Solicitud = { 
    id_usuario: currentUser?.id || '', 
    codigo_material: '', 
    id_ficha: '', 
    cantidad: 1, 
    estado: 'Pendiente' 
  };
  const [form, setForm] = useState<Solicitud>(initial || empty);

  useEffect(() => { setForm(initial || empty); }, [initial]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form className="crud-form" onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
      <h3 className="crud-form-title">{isEditing ? 'EDITAR SOLICITUD' : 'DETALLES DE SOLICITUD'}</h3>

      <div className="sol-section-label">Materiales Elegidos</div>
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
      </div>

      <div className="sol-section-label">Elija el ID de ficha</div>
      <div className="crud-form-grid">
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
          <label>Solicitante (Vocero)</label>
          <select 
            name="id_usuario" 
            value={form.id_usuario} 
            onChange={handleChange} 
            required 
            disabled={currentUser?.rol === 'Vocero'}
          >
            <option value="">— Seleccionar Vocero —</option>
            {usuarios.filter(u => u.rol === 'Vocero').map(u => (
              <option key={u.id_usuario} value={u.id_usuario}>{u.nombre} {u.apellidos}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="sol-section-label">Autorización (Instructor)</div>
      <div className="crud-form-grid">
        <div className="crud-form-group">
          <label>Instructor Responsable</label>
          <select 
            name="id_instructor" 
            value={form.id_instructor || ''} 
            onChange={handleChange}
            required={currentUser?.rol === 'Vocero'}
            disabled={currentUser?.rol === 'Instructor' && !isEditing}
          >
            <option value="">— Seleccionar Instructor —</option>
            {usuarios.filter(u => u.rol === 'Instructor').map(u => (
              <option key={u.id_usuario} value={u.id_usuario}>{u.nombre} {u.apellidos}</option>
            ))}
          </select>
        </div>
      </div>

      {isEditing && (
        <>
          <div className="sol-section-label">Estado</div>
          <div className="crud-form-grid">
            <div className="crud-form-group">
              <label>Estado de Solicitud</label>
              <select name="estado" value={form.estado} onChange={handleChange}>
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobada">Aprobada</option>
                <option value="Rechazada">Rechazada</option>
              </select>
            </div>
          </div>
        </>
      )}

      <div className="crud-form-actions">
        <button type="submit" className="btn-submit-crud">Aceptar</button>
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
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Solicitud | null>(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchSolicitudes();
    fetch(MAT_URL).then(r => r.json()).then(setMateriales).catch(() => {});
    fetch(FICHAS_URL).then(r => r.json()).then(setFichas).catch(() => {});
    fetch('http://localhost:3001/usuarios').then(r => r.json()).then(setUsuarios).catch(() => {});
  }, []);

  const stats = useMemo(() => {
    return {
        total: solicitudes.length,
        pendientes: solicitudes.filter(s => s.estado === 'Pendiente').length,
        aprobadas: solicitudes.filter(s => s.estado === 'Aprobada').length,
        rechazadas: solicitudes.filter(s => s.estado === 'Rechazada').length
    };
  }, [solicitudes]);

  const fetchSolicitudes = async () => {
    try { setSolicitudes(await (await fetch(API_URL)).json()); }
    catch (err) { console.error(err); }
  };

  const handleSubmit = async (data: Solicitud) => {
    try {
      const userName = currentUser.nombre || currentUser.NOMBRE || currentUser.usuario || 'Desconocido';
      const url = editing?.id_solicitud 
        ? `${API_URL}/${editing.id_solicitud}?user=${encodeURIComponent(userName)}` 
        : `${API_URL}?user=${encodeURIComponent(userName)}`;
      const method = editing?.id_solicitud ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method, 
        headers: { 
          'Content-Type': 'application/json',
          'X-User-Action': `${currentUser.nombre} ${currentUser.apellidos || ''}`.trim() || 'Desconocido'
        }, 
        body: JSON.stringify(data),
      });

      if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Error en la petición');
      }

      await fetchSolicitudes();
      setIsModalOpen(false);
      alert(editing ? 'Solicitud actualizada' : 'Solicitud creada con éxito');
    } catch (err: any) { 
        console.error(err);
        alert(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (s: Solicitud) => {
    if (window.confirm('¿Eliminar esta solicitud?')) {
      const userName = currentUser.nombre || currentUser.NOMBRE || currentUser.usuario || 'Desconocido';
      await fetch(`${API_URL}/${s.id_solicitud}?user=${encodeURIComponent(userName)}`, { 
        method: 'DELETE',
        headers: { 'X-User-Action': userName }
      });
      await fetchSolicitudes();
    }
  };

  const filtered = useMemo(() => solicitudes.filter(s => {
    const matchesSearch = String(s.id_solicitud || '').includes(searchTerm) ||
        (s.nombre_material || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.nombre_usuario || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'Todas' || s.estado === filterStatus;
    
    return matchesSearch && matchesStatus;
  }), [solicitudes, searchTerm, filterStatus]);

  const fmtFecha = (d?: string) => d ? new Date(d).toLocaleDateString('es-CO') : '—';

  return (
    <div className="solicitudes-page-container">
      <div className="solicitudes-header">
        <h1>GESTIÓN DE SOLICITUDES</h1>
        <p>Monitorea y aprueba las peticiones de materiales de los aprendices</p>
      </div>

      {/* Stats Section */}
      <div className="sol-stats-grid">
        <div className="sol-stat-card total">
            <div className="stat-icon"><FaFileAlt /></div>
            <div className="stat-info">
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">Total Solicitudes</span>
            </div>
        </div>
        <div className="sol-stat-card pendiente">
            <div className="stat-icon"><FaClock /></div>
            <div className="stat-info">
                <span className="stat-value">{stats.pendientes}</span>
                <span className="stat-label">Pendientes</span>
            </div>
        </div>
        <div className="sol-stat-card aprobada">
            <div className="stat-icon"><FaCheckCircle /></div>
            <div className="stat-info">
                <span className="stat-value">{stats.aprobadas}</span>
                <span className="stat-label">Aprobadas</span>
            </div>
        </div>
        <div className="sol-stat-card rechazada">
            <div className="stat-icon"><FaTimesCircle /></div>
            <div className="stat-info">
                <span className="stat-value">{stats.rechazadas}</span>
                <span className="stat-label">Rechazadas</span>
            </div>
        </div>
      </div>

      <div className="sol-content-card">
        <div className="sol-toolbar">
            <div className="sol-filters">
                {['Todas', 'Pendiente', 'Aprobada', 'Rechazada'].map(status => (
                    <button 
                        key={status}
                        className={`filter-tab ${filterStatus === status ? 'active' : ''}`}
                        onClick={() => setFilterStatus(status)}
                    >
                        {status}
                    </button>
                ))}
            </div>
            <div className="sol-actions">
                <div className="sol-search">
                    <input 
                        type="text" 
                        placeholder="Buscar por ID, material o aprendiz..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="btn-new-sol" onClick={() => { setEditing(null); setIsModalOpen(true); }}>
                    <FaPlus /> Nueva Solicitud
                </button>
            </div>
        </div>

        <div className="sol-table-wrapper">
            <table className="sol-table">
                <thead>
                    <tr>
                        <th># ID</th>
                        <th>Material</th>
                        <th>Ficha</th>
                        <th>Solicitante</th>
                        <th>Instructor</th>
                        <th>Cant.</th>
                        <th>Fecha</th>
                        <th style={{ textAlign: 'center' }}>Estado</th>
                        <th style={{ textAlign: 'center' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(s => (
                        <tr key={s.id_solicitud}>
                            <td className="bold-id">#{s.id_solicitud}</td>
                            <td>
                                <div className="cell-material">
                                    <span className="mat-name">{s.nombre_material || 'Material Desconocido'}</span>
                                    <span className="mat-code">Cód: {s.codigo_material}</span>
                                </div>
                            </td>
                            <td><span className="ficha-tag">#{s.numero_ficha || s.id_ficha}</span></td>
                            <td>{s.nombre_usuario || `User ID: ${s.id_usuario}`}</td>
                            <td><span className="inst-name">{s.nombre_instructor || 'Pendiente'}</span></td>
                            <td><span className="qty-val">{s.cantidad}</span></td>
                            <td>{fmtFecha(s.fecha)}</td>
                            <td style={{ textAlign: 'center' }}>
                                <span className={estadoBadgeClass(s.estado)}>{s.estado}</span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                <div className="table-actions">
                                    <button className="btn-edit-sol" onClick={() => { setEditing(s); setIsModalOpen(true); }}>Editar</button>
                                    <button className="btn-delete-sol" onClick={() => handleDelete(s)}>Eliminar</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filtered.length === 0 && (
                        <tr>
                            <td colSpan={8} className="no-data">No se encontraron solicitudes</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <SolicitudForm
          initial={editing || undefined}
          isEditing={editing !== null}
          materiales={materiales}
          fichas={fichas}
          usuarios={usuarios}
          onSubmit={handleSubmit}
          currentUser={currentUser}
        />
      </Modal>
    </div>
  );
};
