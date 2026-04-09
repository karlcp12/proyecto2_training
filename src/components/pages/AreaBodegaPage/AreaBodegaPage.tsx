import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal } from '../../molecules/Modal/Modal';
import { FaArrowLeft, FaPlus, FaSearch } from 'react-icons/fa';
import './AreaBodegaPage.css';

interface MaterialArea {
  id_area_material: number;
  codigo_material: number;
  nombre: string;
  cantidad: number;
  tipo: string;
}

interface MaterialGeneral {
  codigo_material: number;
  nombre: string;
  tipo: string;
}

export const AreaBodegaPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [areaName, setAreaName] = useState('');
  const [materialesArea, setMaterialesArea] = useState<MaterialArea[]>([]);
  const [catalogo, setCatalogo] = useState<MaterialGeneral[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<number | string>('');
  const [cantidad, setCantidad] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAreaInfo = async () => {
    try {
      const res = await fetch(`http://localhost:3000/centros/${id}`);
      const data = await res.json();
      setAreaName(data.nombre_area);
    } catch (err) { console.error(err); }
  };

  const fetchMaterialesArea = async () => {
    try {
      const res = await fetch(`http://localhost:3000/centros/${id}/materiales`);
      setMaterialesArea(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchCatalogoGeneral = async () => {
    try {
      const res = await fetch('http://localhost:3000/bodega');
      setCatalogo(await res.json());
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchAreaInfo();
    fetchMaterialesArea();
    fetchCatalogoGeneral();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterial) return;

    try {
      await fetch(`http://localhost:3000/centros/${id}/materiales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo_material: Number(selectedMaterial), cantidad }),
      });
      fetchMaterialesArea();
      setIsModalOpen(false);
      setSelectedMaterial('');
      setCantidad(1);
    } catch (err) { console.error(err); }
  };

  const handleRemove = async (matId: number) => {
    if (!window.confirm('¿Remover este material del área?')) return;
    try {
      await fetch(`http://localhost:3000/centros/${id}/materiales/${matId}`, {
        method: 'DELETE',
      });
      fetchMaterialesArea();
    } catch (err) { console.error(err); }
  };

  const filtered = materialesArea.filter(m => 
    (m.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.codigo_material.toString().includes(searchTerm) ||
    (m.tipo || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="crud-page-container redesign">
      <div className="crud-header-actions">
        <div className="area-bodega-title-group" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button className="btn-pill btn-pill-back" onClick={() => navigate('/app/areas')}>
            <FaArrowLeft />
          </button>
          <div className="area-bodega-title">
            <h2 style={{ margin: 0 }}>BODEGA: {areaName || `ÁREA ${id}`}</h2>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Gestión de materiales asignados a esta sede</p>
          </div>
        </div>
        
        <div className="crud-header-right">
          <div className="crud-search-bar">
            <span><FaSearch /></span>
            <input 
              type="text" placeholder="Buscar material en área..." className="crud-search-input"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-pill btn-pill-add" onClick={() => setIsModalOpen(true)}>
            <FaPlus /> asignar material
          </button>
        </div>
      </div>

      <div className="crud-table-wrapper">
        {filtered.length === 0 ? (
          <div className="empty-state" style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
            {searchTerm ? 'No se encontraron materiales para esta búsqueda.' : 'No hay materiales asignados a esta área todavía.'}
          </div>
        ) : (
          <table className="crud-table redesign">
            <thead>
              <tr>
                <th>Código</th>
                <th>Material</th>
                <th>Tipo</th>
                <th>Cantidad en Área</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id_area_material}>
                  <td>{m.codigo_material}</td>
                  <td className="bold-text">{m.nombre}</td>
                  <td>{m.tipo}</td>
                  <td>
                    <span className="badge-status active" style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}>
                      {m.cantidad}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button className="btn-pill btn-pill-delete" onClick={() => handleRemove(m.codigo_material)}>
                      remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form className="crud-form redesign" onSubmit={handleAssign}>
          <h3 className="crud-form-title">ASIGNAR MATERIAL</h3>
          <div className="crud-form-grid">
            <div className="crud-form-group span-2">
              <label>Seleccionar Material</label>
              <select 
                value={selectedMaterial} 
                onChange={e => setSelectedMaterial(e.target.value)}
                required
              >
                <option value="">-- Seleccione un material --</option>
                {catalogo.map(c => (
                  <option key={c.codigo_material} value={c.codigo_material}>
                    {c.nombre} ({c.tipo})
                  </option>
                ))}
              </select>
            </div>
            <div className="crud-form-group">
              <label>Cantidad</label>
              <input 
                type="number" 
                value={cantidad} 
                onChange={e => setCantidad(Number(e.target.value))}
                min="1"
                required
              />
            </div>
            <div className="crud-form-group" style={{ visibility: 'hidden' }}></div>
            <button type="submit" className="btn-pill btn-pill-submit" style={{ gridColumn: 'span 2' }}>Asignar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
