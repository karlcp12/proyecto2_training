import React, { useState, useEffect } from 'react';
import { Modal } from '../../molecules/Modal/Modal';
import { FaSyncAlt } from 'react-icons/fa';
import '../MaterialesPage/MaterialesPage.css';

const API_URL = 'http://localhost:3000/bodega';

interface Material {
  codigo_material: number;
  nombre: string;
  cantidad: number;
  tipo: string;
}

const StockForm: React.FC<{
  material: Material;
  onSubmit: (id: number, nuevaCantidad: number) => void;
}> = ({ material, onSubmit }) => {
  const [cantidad, setCantidad] = useState(material.cantidad);

  return (
    <form className="crud-form redesign" onSubmit={e => { e.preventDefault(); onSubmit(material.codigo_material, cantidad); }}>
      <h3 className="crud-form-title">ACTUALIZAR STOCK</h3>
      <div className="crud-form-grid">
        <div className="crud-form-group">
          <label>Código</label>
          <input value={material.codigo_material} disabled style={{ opacity: 0.6 }} />
        </div>
        <div className="crud-form-group">
          <label>Nombre</label>
          <input value={material.nombre} disabled style={{ opacity: 0.6 }} />
        </div>
        <div className="crud-form-group">
          <label>Bodega actual (Clasificación)</label>
          <input value={material.tipo} disabled style={{ opacity: 0.6 }} />
        </div>
        <div className="crud-form-group">
          <label>Nueva Cantidad</label>
          <input
            type="number"
            min="0"
            value={cantidad}
            onChange={e => setCantidad(Number(e.target.value))}
            required
          />
        </div>
        <button type="submit" className="btn-pill btn-pill-submit" style={{ gridColumn: 'span 2' }}>Guardar</button>
      </div>
    </form>
  );
};

export const ActualizarStockPage: React.FC = () => {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  const fetchMateriales = async () => {
    try {
      const res = await fetch(API_URL);
      setMateriales(await res.json());
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchMateriales(); }, []);

  const handleUpdateStock = async (id: number, nuevaCantidad: number) => {
    const mat = materiales.find(m => m.codigo_material === id);
    if (!mat) return;
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...mat, cantidad: nuevaCantidad }),
      });
      await fetchMateriales();
      setIsModalOpen(false);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="crud-page-container redesign">
      <div className="crud-header-actions">
        <h2>ACTUALIZAR STOCK</h2>
        <button className="btn-pill btn-pill-add" onClick={fetchMateriales}>
          <FaSyncAlt /> Actualizar
        </button>
      </div>

      <div className="crud-table-wrapper">
        <table className="crud-table redesign">
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
            {materiales.map(m => (
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
                  <button
                    className="btn-pill btn-pill-edit"
                    onClick={() => { setSelectedMaterial(m); setIsModalOpen(true); }}
                  >
                    Actualizar Stock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedMaterial && (
          <StockForm material={selectedMaterial} onSubmit={handleUpdateStock} />
        )}
      </Modal>
    </div>
  );
};
