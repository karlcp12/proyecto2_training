import React, { useState, useEffect } from 'react';
import { Modal } from '../../molecules/Modal/Modal';
import { UsuarioForm } from '../../organisms/UsuarioForm/UsuarioForm';
import type { UsuarioData } from '../../organisms/UsuarioForm/UsuarioForm';
import { FaSearch, FaPlus } from 'react-icons/fa';
import './UsuariosPage.css';

const API_URL = 'http://localhost:3001/usuarios';

interface UsuarioConId extends UsuarioData {
  id_usuario?: number;
}

export const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<UsuarioConId[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<UsuarioConId | null>(null);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleOpenAdd = () => {
    setEditingUsuario(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (usuario: UsuarioConId) => {
    setEditingUsuario(usuario);
    setIsModalOpen(true);
  };

  const handleDelete = async (usuario: UsuarioConId) => {
    if (window.confirm("¿Está seguro que desea eliminar este usuario?")) {
      try {
        await fetch(`${API_URL}/${usuario.id_usuario}`, { method: 'DELETE' });
        await fetchUsuarios();
      } catch (err) {
        console.error('Error al eliminar usuario:', err);
      }
    }
  };

  const handleSubmitForm = async (data: UsuarioData) => {
    try {
      if (editingUsuario?.id_usuario) {
        await fetch(`${API_URL}/${editingUsuario.id_usuario}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }
      await fetchUsuarios();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error al guardar usuario:', err);
    }
  };

  const filteredUsuarios = usuarios.filter(u =>
    (u.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.documento || '').includes(searchTerm)
  );

  return (
    <div className="usuarios-page-container redesign">
      <div className="crud-header-actions">
        <h2>USUARIOS</h2>
        <div className="crud-header-right">
          <div className="crud-search-bar">
            <span><FaSearch /></span>
            <input
              type="text"
              placeholder="Buscar usuario..."
              className="crud-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-pill btn-pill-add" onClick={handleOpenAdd}>
            <FaPlus /> añadir usuario
          </button>
        </div>
      </div>

      <div className="usuarios-table-wrapper">
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Rol</th>
              <th>N. de Telefono</th>
              <th>Email</th>
              <th>Numero de documento</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsuarios.map((usuario) => (
              <tr key={usuario.id_usuario}>
                <td className="bold-text">{usuario.nombre}</td>
                <td>{usuario.rol}</td>
                <td>{usuario.telefono}</td>
                <td>{usuario.email}</td>
                <td>{usuario.documento}</td>
                <td>
                  <span className={`badge-estado ${(usuario.estado || '').toLowerCase()}`}>
                    {usuario.estado}
                  </span>
                </td>
                <td>
                  <div className="action-pill-group">
                    <button className="btn-pill btn-pill-edit" onClick={() => handleOpenEdit(usuario)}>Editar</button>
                    <button className="btn-pill btn-pill-delete" onClick={() => handleDelete(usuario)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Integración del Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <UsuarioForm
          isEditing={editingUsuario !== null}
          initialData={editingUsuario || undefined}
          onSubmit={handleSubmitForm}
        />
      </Modal>
    </div>
  );
};
