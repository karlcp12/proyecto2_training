import React, { useState, useEffect } from 'react';
import { Modal } from '../../molecules/Modal/Modal';
import { UsuarioForm } from '../../organisms/UsuarioForm/UsuarioForm';
import type { UsuarioData } from '../../organisms/UsuarioForm/UsuarioForm';
import './UsuariosPage.css';

const API_URL = 'http://localhost:3001/usuarios';

// Extender UsuarioData para llevar el id del backend
interface UsuarioConId extends UsuarioData {
  id_usuarios?: number;
}

export const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<UsuarioConId[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<UsuarioConId | null>(null);

  // Cargar usuarios desde el backend al montar el componente
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    }
  };

  // Handlers
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
        await fetch(`${API_URL}/${usuario.id_usuarios}`, { method: 'DELETE' });
        await fetchUsuarios();
      } catch (err) {
        console.error('Error al eliminar usuario:', err);
      }
    }
  };

  const handleSubmitForm = async (data: UsuarioData) => {
    try {
      if (editingUsuario?.id_usuarios) {
        // Editar
        await fetch(`${API_URL}/${editingUsuario.id_usuarios}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } else {
        // Crear nuevo
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
    <div className="usuarios-page-container">
      <div className="usuarios-header-actions">
        <h2>USUARIOS</h2>
        <div className="usuarios-actions-right">
          <div className="search-bar">
            <i className="search-icon">🔍</i>
            <input
              type="text"
              placeholder="Search"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-add-user" onClick={handleOpenAdd}>Añadir Usuario</button>
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
              <tr key={usuario.id_usuarios}>
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
                  <button className="btn-action-edit" onClick={() => handleOpenEdit(usuario)}>Editar</button>
                  <button className="btn-action-delete" onClick={() => handleDelete(usuario)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Integration */}
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
