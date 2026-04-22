import React, { useState, useEffect } from 'react';
import { Modal } from '../../molecules/Modal/Modal';
import { SummaryCard } from '../../organisms/Charts/SummaryCard';
import { BarChartComponent } from '../../organisms/Charts/BarChartComponent';
import { GaugeChartComponent } from '../../organisms/Charts/GaugeChartComponent';
import { FaBox, FaExclamationTriangle, FaHistory } from 'react-icons/fa';
import '../../organisms/Charts/Charts.css';
import './MaterialesPage.css';

const API_URL = 'http://localhost:3001/bodega';

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

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isVocero = currentUser.rol === 'Vocero';

  useEffect(() => { fetchMateriales(); }, []);

  const fetchMateriales = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (Array.isArray(data)) {
        setMateriales(data);
      } else {
        console.warn("La API no devolvió un array:", data);
        setMateriales([]);
      }
    } catch (err) { 
      console.error("Error cargando materiales:", err); 
      setMateriales([]);
    }
  };

  const handleSubmit = async (data: Material) => {
    try {
      const options = editing?.codigo_material 
        ? { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }
        : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
      
      const url = editing?.codigo_material ? `${API_URL}/${editing.codigo_material}` : API_URL;
      
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Error en la operación");
      
      await fetchMateriales();
      setIsModalOpen(false);
    } catch (err) { 
      console.error("Error al guardar material:", err);
      alert("No se pudo guardar el material. Verifica la conexión.");
    }
  };

  const handleDelete = async (m: Material) => {
    if (window.confirm('¿Eliminar este material?')) {
      try {
        await fetch(`${API_URL}/${m.codigo_material}`, { method: 'DELETE' });
        await fetchMateriales();
      } catch (err) {
        console.error("Error al eliminar:", err);
      }
    }
  };

  const filtered = Array.isArray(materiales) 
    ? materiales.filter((m: Material) =>
        (m.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.tipo || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Stats calculation
  const totalMateriales = materiales.length;
  const materialesCriticos = materiales.filter((m: Material) => Number(m.cantidad) < 10).length;
  const stockData = materiales.slice(0, 8).map((m: Material) => ({
    name: m.nombre,
    stock: Number(m.cantidad)
  }));
  const totalStock = materiales.reduce((acc: number, curr: Material) => acc + Number(curr.cantidad), 0);
  const capacity = 1000; // Mock capacity for gauge
  const occupancy = Math.min(Math.round((totalStock / capacity) * 100), 100);

  return (
    <div className="crud-page-container">
      {/* Resumen Visual */}
      <div className="dashboard-grid" style={{ marginBottom: '20px', padding: 0 }}>
        <SummaryCard 
          title="Total Materiales" 
          value={totalMateriales} 
          icon={<FaBox />} 
          color="#2196f3" 
        />
        <SummaryCard 
          title="Materiales Críticos" 
          value={materialesCriticos} 
          icon={<FaExclamationTriangle />} 
          color="#f44336" 
          subtitle="Stock menor a 10"
        />
        <SummaryCard 
          title="Últimos Movimientos" 
          value={12} 
          icon={<FaHistory />} 
          color="#4caf50" 
          subtitle="Hoy"
        />

        <div className="dashboard-card" style={{ gridColumn: 'span 2' }}>
          <div className="dashboard-card-title">Stock por Material</div>
          <BarChartComponent data={stockData} xKey="name" yKey="stock" horizontal={true} />
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-title">Ocupación de Inventario</div>
          <GaugeChartComponent value={occupancy} label="Capacidad Total" />
        </div>
      </div>

      <div className="crud-header-actions">
        <h2>TABLA DE MATERIALES</h2>
        <div className="crud-actions-right">
          <div className="crud-search-bar">
            <span>🔍</span>
            <input
              type="text" placeholder="Search" className="crud-search-input"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          {!isVocero && (
            <button className="btn-add-crud" onClick={() => { setEditing(null); setIsModalOpen(true); }}>
                Añadir Material
            </button>
          )}
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
            {filtered.length > 0 ? (
              filtered.map(m => (
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
                    {!isVocero ? (
                      <>
                        <button className="btn-action-edit" onClick={() => { setEditing(m); setIsModalOpen(true); }}>Editar</button>
                        <button className="btn-action-delete" onClick={() => handleDelete(m)}>Eliminar</button>
                      </>
                    ) : (
                      <span className="no-actions">Sin permisos</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                  No se encontraron materiales.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <MaterialForm initial={editing || undefined} isEditing={editing !== null} onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
};
