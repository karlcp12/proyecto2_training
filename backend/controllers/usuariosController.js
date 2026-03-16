import { pool } from '../db.js';

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