import React, { useState, useEffect } from 'react';
import { Modal } from '../../molecules/Modal/Modal';
import { SummaryCard } from '../../organisms/Charts/SummaryCard';
import { BarChartComponent } from '../../organisms/Charts/BarChartComponent';
import { GaugeChartComponent } from '../../organisms/Charts/GaugeChartComponent';
import { FaBox, FaExclamationTriangle, FaHistory, FaQrcode } from 'react-icons/fa';
import { QRModal } from '../../organisms/QRModal/QRModal';
import { useSettings } from '../../../context/SettingsContext';
import { toast } from 'react-hot-toast';
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
  suggestions?: Material[];
}> = ({ initial, isEditing, onSubmit, suggestions = [] }) => {
  const [form, setForm] = useState<Material>(
    initial || { nombre: '', cantidad: '', tipo: '' }
  );

  useEffect(() => {
    setForm(initial || { nombre: '', cantidad: '', tipo: '' });
  }, [initial]);

  const existingMatch = suggestions.find(m => 
    m.nombre.trim().toLowerCase() === form.nombre.trim().toLowerCase() && 
    !isEditing && (!initial || initial.nombre !== form.nombre)
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'nombre' && !isEditing) {
        const match = suggestions.find(m => m.nombre.trim().toLowerCase() === value.trim().toLowerCase());
        if (match) {
            setForm(prev => ({ ...prev, nombre: value, tipo: match.tipo }));
            return;
        }
    }
    
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form className="crud-form" onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
      <h3 className="crud-form-title">{isEditing ? 'EDITAR MATERIAL' : 'AÑADIR MATERIAL'}</h3>
      <div className="crud-form-grid">
        <div className="crud-form-group">
          <label>Nombre</label>
          <input 
            name="nombre" 
            list="material-suggestions"
            value={form.nombre} 
            onChange={handleChange} 
            placeholder="Escribe el nombre del material..." 
            required 
          />
          <datalist id="material-suggestions">
            {suggestions.map((m, i) => (
              <option key={i} value={m.nombre}>{m.tipo}</option>
            ))}
          </datalist>
          {existingMatch && (
            <div style={{ color: '#d32f2f', fontSize: '0.8rem', marginTop: '4px', fontWeight: 'bold' }}>
              ⚠️ Este material ya existe en "{existingMatch.tipo}". Se sumará al stock actual.
            </div>
          )}
        </div>
        <div className="crud-form-group">
          <label>Cantidad a {isEditing ? 'establecer' : 'añadir'}</label>
          <input type="number" name="cantidad" value={form.cantidad} onChange={handleChange} placeholder="Cantidad" required min="1" />
        </div>
        <div className="crud-form-group">
          <label>Tipo / Categoría</label>
          <input 
            name="tipo" 
            value={form.tipo} 
            onChange={handleChange} 
            placeholder="Ej: Electrónico, Mobiliario" 
            required 
            disabled={!!existingMatch}
            style={{ opacity: existingMatch ? 0.6 : 1 }}
          />
        </div>
      </div>
      <div className="crud-form-actions">
        <button type="submit" className="btn-submit-crud">
            {existingMatch ? 'Sumar al Stock' : 'Aceptar'}
        </button>
      </div>
    </form>
  );
};

export const MaterialesPage: React.FC = () => {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Material | null>(null);
  const [selectedQR, setSelectedQR] = useState<Material | null>(null);
  const { settings } = useSettings();

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isVocero = currentUser.rol === 'Vocero';

  const fetchMateriales = async (showToasts = false) => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (Array.isArray(data)) {
        setMateriales(data);
        if (showToasts && settings.enableToasts) {
          const criticals = data.filter((m: any) => Number(m.cantidad) < settings.lowStockThreshold);
          if (criticals.length > 0) {
            toast.error(`Atención: Hay ${criticals.length} materiales con stock bajo`, {
              duration: 5000,
              icon: '⚠️'
            });
          }
        }
      } else {
        setMateriales([]);
      }
    } catch (err) { 
      setMateriales([]);
    }
  };

  useEffect(() => { 
    console.log("Settings for toasts:", settings);
    fetchMateriales(true); 
  }, [settings.lowStockThreshold, settings.enableToasts]);

  const handleSubmit = async (data: Material) => {
    try {
      const userName = currentUser.nombre || currentUser.NOMBRE || currentUser.usuario || 'Desconocido';
      const options = editing?.codigo_material 
        ? { method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-User-Action': userName }, body: JSON.stringify(data) }
        : { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-User-Action': userName }, body: JSON.stringify(data) };
      
      const url = editing?.codigo_material 
        ? `${API_URL}/${editing.codigo_material}?user=${encodeURIComponent(userName)}` 
        : `${API_URL}?user=${encodeURIComponent(userName)}`;
      
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Error en la operación");
      
      setIsModalOpen(false);
      
      if (Number(data.cantidad) < settings.lowStockThreshold && settings.enableToasts) {
          toast(`¡Alerta! ${data.nombre} quedó con stock bajo (${data.cantidad})`, {
              icon: '🚨',
              style: { borderRadius: '10px', background: '#333', color: '#fff' }
          });
      } else {
          toast.success(editing ? 'Material actualizado' : 'Material añadido');
      }

      fetchMateriales();
    } catch (err) { 
      console.error("Error al guardar material:", err);
      alert("No se pudo guardar el material. Verifica la conexión.");
    }
  };

  const handleDelete = async (m: Material) => {
    if (window.confirm('¿Eliminar este material?')) {
      try {
      const userName = currentUser.nombre || currentUser.NOMBRE || currentUser.usuario || 'Desconocido';
        await fetch(`${API_URL}/${m.codigo_material}?user=${encodeURIComponent(userName)}`, { 
            method: 'DELETE',
            headers: { 'X-User-Action': userName }
        });
        await fetchMateriales();
      } catch (err) {
        console.error("Error al eliminar:", err);
      }
    }
  };

  const filtered = React.useMemo(() => {
    return Array.isArray(materiales) 
      ? materiales.filter((m: Material) =>
          (m.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (m.tipo || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];
  }, [materiales, searchTerm]);

  // Stats calculation memoized
  const stats = React.useMemo(() => {
    const totalMateriales = materiales.length;
    const materialesCriticos = materiales.filter((m: Material) => Number(m.cantidad) < settings.lowStockThreshold).length;
    const stockData = materiales.slice(0, 8).map((m: Material) => ({
      name: m.nombre,
      stock: Number(m.cantidad)
    }));
    const totalStock = materiales.reduce((acc: number, curr: Material) => acc + Number(curr.cantidad), 0);
    const capacity = 1000;
    const occupancy = Math.min(Math.round((totalStock / capacity) * 100), 100);

    return { totalMateriales, materialesCriticos, stockData, occupancy };
  }, [materiales, settings.lowStockThreshold]);

  return (
    <div className="crud-page-container">
      {/* Resumen Visual */}
      <div className="dashboard-grid" style={{ marginBottom: '20px', padding: 0 }}>
        <SummaryCard 
          title="Total Materiales" 
          value={stats.totalMateriales} 
          icon={<FaBox />} 
          color="#2196f3" 
        />
        <SummaryCard 
          title="Materiales Críticos" 
          value={stats.materialesCriticos} 
          icon={<FaExclamationTriangle />} 
          color="#f44336" 
          subtitle={`Stock menor a ${settings.lowStockThreshold}`}
        />
        <SummaryCard 
          title="Últimos Movimientos" 
          value={12} 
          icon={<FaHistory />} 
          color="#4caf50" 
          subtitle="Hoy"
        />

        <div className="dashboard-card" style={{ gridColumn: 'span 2' }}>
          <div className="dashboard-card-title">Stock por Material (Clic para filtrar)</div>
          <BarChartComponent 
            data={stats.stockData} 
            xKey="name" 
            yKey="stock" 
            horizontal={true} 
            onBarClick={(p) => setSearchTerm(p.name)}
          />
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-title">Ocupación de Inventario</div>
          <GaugeChartComponent value={stats.occupancy} label="Capacidad Total" />
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
                    <span className={`badge-cantidad ${Number(m.cantidad) > settings.lowStockThreshold * 2 ? 'alto' : Number(m.cantidad) > settings.lowStockThreshold ? 'medio' : 'bajo'}`}>
                      {m.cantidad}
                    </span>
                  </td>
                  <td>{m.tipo}</td>
                  <td style={{ textAlign: 'center' }}>
                    {!isVocero ? (
                      <>
                        <button className="btn-action-qr" title="Generar QR" onClick={() => setSelectedQR(m)}>
                            <FaQrcode />
                        </button>
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
        <MaterialForm 
          initial={editing || undefined} 
          isEditing={editing !== null} 
          onSubmit={handleSubmit} 
          suggestions={materiales}
        />
      </Modal>

      {selectedQR && (
          <QRModal 
            isOpen={!!selectedQR} 
            onClose={() => setSelectedQR(null)} 
            material={{
                codigo_material: selectedQR.codigo_material!,
                nombre: selectedQR.nombre,
                tipo: selectedQR.tipo
            }}
          />
      )}
    </div>
  );
};
