import { pool } from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'mi-clave-super-secreta-123'; // Hardcoded temporal

export const loginUsuario = async (req, res) => {
    const { usuario, contrasena } = req.body;
    
    // Buscar por Correo (campo de login en basena)
    const query = 'SELECT * FROM usuarios WHERE Correo = ?';
    console.log("Login intent for:", usuario);
    try {
        const [rows] = await pool.execute(query, [usuario]);
        console.log("Found rows:", rows.length);
        
        if (rows.length === 0) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }
        
        const user = rows[0];
        
        // Verificar la contraseña (usando bcryptjs)
        const isMatch = await bcrypt.compare(contrasena, user.Contrasena);
        
        if (!isMatch) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }
        
        if (user.Estado !== 'Activo') {
            return res.status(403).json({ mensaje: 'El usuario se encuentra inactivo' });
        }
        
        // Crear Token
        const token = jwt.sign(
            { id: user.ID_Usuario, rol: user.ID_Rol }, 
            JWT_SECRET, 
            { expiresIn: '8h' }
        );
        
        res.status(200).json({ 
            mensaje: 'Autenticación exitosa', 
            token, 
            user: {
                id_usuarios: user.ID_Usuario,
                nombre: user.Nombre,
                apellidos: user.Apellidos,
                email: user.Correo,
                rol: user.ID_Rol
            }
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const crearUsuario = async (req, res) => {
    const { nombre, apellidos, email, telefono, documento, rol, estado } = req.body;
    const query = 'INSERT INTO usuarios (Nombre, Apellidos, Correo, Estado, ID_Rol) VALUES (?, ?, ?, ?, ?)';
    try {
        const [result] = await pool.execute(query, [nombre, apellidos, email, estado || 'Activo', rol]);
        res.status(201).json({ id_usuarios: result.insertId, ...req.body, mensaje: 'Usuario creado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerUsuarios = async (req, res) => {
    const query = 'SELECT ID_Usuario as id_usuarios, Nombre as nombre, Apellidos as apellidos, Correo as email, Estado as estado, ID_Rol as rol FROM usuarios';
    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerUsuarioPorId = async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT ID_Usuario as id_usuarios, Nombre as nombre, Apellidos as apellidos, Correo as email, Estado as estado, ID_Rol as rol FROM usuarios WHERE ID_Usuario = ?';
    try {
        const [rows] = await pool.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellidos, email, rol, estado } = req.body;
    
    try {
        // Proteger al administrador
        const [rows] = await pool.query('SELECT Correo FROM usuarios WHERE ID_Usuario = ?', [id]);
        if (rows.length > 0 && rows[0].Correo === 'admin') {
            // Si es el admin, no permitir cambiar el correo ni el estado a inactivo
            if (email !== 'admin' || estado !== 'Activo') {
                 return res.status(403).json({ mensaje: 'No se puede cambiar el correo o desactivar al administrador predeterminado' });
            }
        }

        const query = 'UPDATE usuarios SET Nombre = ?, Apellidos = ?, Correo = ?, ID_Rol = ?, Estado = ? WHERE ID_Usuario = ?';
        const [result] = await pool.execute(query, [nombre, apellidos, email, rol, estado, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.status(200).json({ id_usuarios: id, ...req.body, mensaje: 'Usuario actualizado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarUsuario = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Proteger al administrador predeterminado
        const [rows] = await pool.query('SELECT Correo FROM usuarios WHERE ID_Usuario = ?', [id]);
        if (rows.length > 0 && rows[0].Correo === 'admin') {
            return res.status(403).json({ mensaje: 'No se puede eliminar el usuario administrador predeterminado' });
        }

        const query = 'DELETE FROM usuarios WHERE ID_Usuario = ?';
        const [result] = await pool.execute(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.status(200).json({ mensaje: 'Usuario eliminado con éxito', id_usuarios: id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};