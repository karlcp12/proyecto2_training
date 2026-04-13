import { pool } from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'mi-clave-super-secreta-123'; // Hardcoded temporal

export const loginUsuario = async (req, res) => {
    const { usuario, contrasena } = req.body;
    
    // Asumiremos que el usuario puede ingresar usando DOCUMENTO o EMAIL
    const query = 'SELECT * FROM USUARIOS WHERE DOCUMENTO = ? OR EMAIL = ?';
    console.log("Login intent for:", usuario);
    try {
        const [rows] = await pool.execute(query, [usuario, usuario]);
        console.log("Found rows:", rows.length);
        
        if (rows.length === 0) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }
        
        const user = rows[0];
        
        // Verificar la contraseña (usando bcryptjs)
        const isMatch = await bcrypt.compare(contrasena, user.CONTRASENA);
        
        if (!isMatch) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }
        
        if (user.ESTADO !== 'Activo') {
            return res.status(403).json({ mensaje: 'El usuario se encuentra inactivo' });
        }
        
        // Crear Token
        const token = jwt.sign(
            { id: user.ID_USUARIO, rol: user.ROL }, 
            JWT_SECRET, 
            { expiresIn: '8h' }
        );
        
        res.status(200).json({ 
            mensaje: 'Autenticación exitosa', 
            token, 
            user: {
                id_usuarios: user.ID_USUARIO,
                nombre: user.NOMBRE,
                apellidos: user.APELLIDOS,
                email: user.EMAIL,
                rol: user.ROL
            }
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const crearUsuario = async (req, res) => {
    const { nombre, apellidos, email, telefono, documento, rol, estado } = req.body;
    const query = 'INSERT INTO USUARIOS (NOMBRE, APELLIDOS, EMAIL, TELEFONO, DOCUMENTO, ROL, ESTADO) VALUES (?, ?, ?, ?, ?, ?, ?)';
    try {
        const [result] = await pool.execute(query, [nombre, apellidos, email, telefono, documento, rol, estado]);
        res.status(201).json({ id_usuarios: result.insertId, ...req.body, mensaje: 'Usuario creado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerUsuarios = async (req, res) => {
    const query = 'SELECT ID_USUARIO as id_usuarios, NOMBRE as nombre, APELLIDOS as apellidos, DOCUMENTO as documento, EMAIL as email, TELEFONO as telefono, ROL as rol, ESTADO as estado FROM USUARIOS';
    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerUsuarioPorId = async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT ID_USUARIO as id_usuarios, NOMBRE as nombre, APELLIDOS as apellidos, DOCUMENTO as documento, EMAIL as email, TELEFONO as telefono, ROL as rol, ESTADO as estado FROM USUARIOS WHERE ID_USUARIO = ?';
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
    const { nombre, apellidos, email, telefono, documento, rol, estado } = req.body;
    const query = 'UPDATE USUARIOS SET NOMBRE = ?, APELLIDOS = ?, EMAIL = ?, TELEFONO = ?, DOCUMENTO = ?, ROL = ?, ESTADO = ? WHERE ID_USUARIO = ?';
    try {
        const [result] = await pool.execute(query, [nombre, apellidos, email, telefono, documento, rol, estado, id]);
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
    const query = 'DELETE FROM USUARIOS WHERE ID_USUARIO = ?';
    try {
        const [result] = await pool.execute(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.status(200).json({ mensaje: 'Usuario eliminado con éxito', id_usuarios: id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};