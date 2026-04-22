import React, { useState, useEffect } from "react";
import "./UsuarioForm.css";

export interface UsuarioData {
  nombre: string;
  apellidos: string;
  rol: string;
  telefono: string;
  documento: string;
  email: string;
  password?: string;
  estado: "Activo" | "Inactivo";
}

interface UsuarioFormProps {
  initialData?: UsuarioData;
  onSubmit: (data: UsuarioData) => void;
  isEditing: boolean;
}

export const UsuarioForm: React.FC<UsuarioFormProps> = ({
  initialData,
  onSubmit,
  isEditing,
}) => {
  const [formData, setFormData] = useState<UsuarioData>({
    nombre: "",
    apellidos: "",
    rol: "Vocero",
    telefono: "",
    documento: "",
    email: "",
    password: "",
    estado: "Activo",
  });

  useEffect(() => {
    if (initialData) {
      // Intenta separar nombres y apellidos si vienen unidos en el mock original
      let nombre = initialData.nombre;
      let apellidos = initialData.apellidos || "";
      
      if (!initialData.apellidos && initialData.nombre.includes(" ")) {
        const parts = initialData.nombre.split(" ");
        nombre = parts[0];
        apellidos = parts.slice(1).join(" ");
      }

      setFormData({
        ...initialData,
        nombre,
        apellidos,
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="usuario-form-container" onSubmit={handleSubmit}>
      <div className="usuario-form-header">
        <h3>{isEditing ? "EDITAR USUARIO" : "AÑADIR USUARIO"}</h3>
      </div>

      <div className="usuario-form-grid">
        <div className="usario-form-group">
          <label>Nombres</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            placeholder="Nombres"
          />
        </div>
        <div className="usario-form-group">
          <label>Apellidos</label>
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            required
            placeholder="Apellidos"
          />
        </div>
        <div className="usario-form-group">
          <label>Rol</label>
          <select name="rol" value={formData.rol} onChange={handleChange}>
            <option value="Administrador">Administrador</option>
            <option value="Instructor">Instructor</option>
            <option value="Vocero">Vocero</option>
          </select>
        </div>
        <div className="usario-form-group">
          <label>Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            placeholder="Teléfono"
          />
        </div>
        <div className="usario-form-group">
          <label>Numero Documento</label>
          <input
            type="text"
            name="documento"
            value={formData.documento}
            onChange={handleChange}
            required
            placeholder="Documento"
          />
        </div>
        <div className="usario-form-group">
          <label>Gmail</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Correo"
          />
        </div>

        {/* Status Dropdown useful for editing directly */}
        {isEditing && (
           <div className="usario-form-group">
            <label>Estado</label>
            <select name="estado" value={formData.estado} onChange={handleChange}>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        )}
        
        {/* Mock password field as seen on design */}
        <div className={`usario-form-group ${!isEditing ? "full-width" : ""}`}>
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password || ""}
            onChange={handleChange}
            placeholder={isEditing ? "Dejar en blanco para mantener" : "Contraseña"}
          />
        </div>

      </div>

      <div className="usuario-form-actions">
        <button type="submit" className="btn-submit-usuario">
          Aceptar
        </button>
      </div>
    </form>
  );
};
