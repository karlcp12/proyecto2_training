import { pool } from '../db.js';

export const crearUsuario = async (req, res) => {
    const { nombre, apellidos, email, telefono, documento, rol, password, estado } = req.body;
    // Map role names to IDs based on the database_schema.sql initial data
    const roleMap = { 'Administrador': 1, 'Instructor': 2, 'Aprendiz': 3, 'Personal': 4 };
    const id_rol = roleMap[rol] || 4; // Default to Personal
    const query = 'INSERT INTO USUARIOS (NOMBRE, APELLIDOS, EMAIL, TELEFONO, DOCUMENTO, ID_ROL, PASSWORD, ESTADO) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    try {
        const [result] = await pool.execute(query, [nombre, apellidos, email, telefono, documento, id_rol, password || 'Admin123', estado || 'Activo']);
        res.status(201).json({ id_usuarios: result.insertId, ...req.body, mensaje: 'Usuario creado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerUsuarios = async (req, res) => {
    const query = `
        SELECT u.ID_USUARIO as id_usuarios, u.NOMBRE as nombre, u.APELLIDOS as apellidos, 
               u.DOCUMENTO as documento, u.EMAIL as email, u.TELEFONO as telefono, 
               r.NOMBRE_ROL as rol, u.ESTADO as estado 
        FROM USUARIOS u
        LEFT JOIN ROLES r ON u.ID_ROL = r.ID_ROL`;
    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerUsuarioPorId = async (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT u.ID_USUARIO as id_usuarios, u.NOMBRE as nombre, u.APELLIDOS as apellidos, 
               u.DOCUMENTO as documento, u.EMAIL as email, u.TELEFONO as telefono, 
               r.NOMBRE_ROL as rol, u.ESTADO as estado 
        FROM USUARIOS u
        LEFT JOIN ROLES r ON u.ID_ROL = r.ID_ROL
        WHERE u.ID_USUARIO = ?`;
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
    const { nombre, apellidos, email, telefono, documento, rol, password, estado } = req.body;
    const roleMap = { 'Administrador': 1, 'Instructor': 2, 'Aprendiz': 3, 'Personal': 4 };
    const id_rol = roleMap[rol] || 4;
    
    let query = 'UPDATE USUARIOS SET NOMBRE = ?, APELLIDOS = ?, EMAIL = ?, TELEFONO = ?, DOCUMENTO = ?, ID_ROL = ?, ESTADO = ?';
    const params = [nombre, apellidos, email, telefono, documento, id_rol, estado];
    
    if (password) {
        query += ', PASSWORD = ?';
        params.push(password);
    }
    
    query += ' WHERE ID_USUARIO = ?';
    params.push(id);

    try {
        const [result] = await pool.execute(query, params);
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