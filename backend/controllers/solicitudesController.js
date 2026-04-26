import { pool } from '../db.js';
import { logAction } from './auditController.js';

export const crearSolicitud = async (req, res) => {
    const { id_usuario, codigo_material, id_ficha, cantidad, fecha, estado, id_instructor } = req.body;
    const query = 'INSERT INTO SOLICITUDES (ID_USUARIO, CODIGO_MATERIAL, ID_FICHA, CANTIDAD, FECHA, ESTADO, ID_INSTRUCTOR) VALUES (?,?,?,?,?,?,?)';
    try {
        const [result] = await pool.execute(query, [id_usuario, codigo_material, id_ficha, cantidad, fecha || new Date().toISOString().split('T')[0], estado || 'Pendiente', id_instructor || null]);
        res.status(201).json({ id_solicitud: result.insertId, ...req.body, mensaje: 'Solicitud creada con éxito' });
        
        // Log to Audit
        const user = req.headers['x-user-action'] || 'Desconocido';
        await logAction(user, 'Crear', 'Solicitudes', `Nueva solicitud ID: ${result.insertId}`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerSolicitudes = async (req, res) => {
    const query = `
        SELECT s.ID_SOLICITUD as id_solicitud, s.ID_USUARIO as id_usuario,
               CONCAT(u.NOMBRE, ' ', u.APELLIDOS) as nombre_usuario,
               s.CODIGO_MATERIAL as codigo_material, m.NOMBRE as nombre_material,
               s.ID_FICHA as id_ficha, f.NUMERO_FICHA as numero_ficha,
               s.CANTIDAD as cantidad, s.FECHA as fecha, s.ESTADO as estado,
               CONCAT(inst.NOMBRE, ' ', inst.APELLIDOS) as nombre_instructor
        FROM SOLICITUDES s
        LEFT JOIN MATERIALES m ON s.CODIGO_MATERIAL = m.CODIGO_MATERIAL
        LEFT JOIN USUARIOS u ON s.ID_USUARIO = u.ID_USUARIO
        LEFT JOIN FICHAS f ON s.ID_FICHA = f.ID_FICHA
        LEFT JOIN USUARIOS inst ON s.ID_INSTRUCTOR = inst.ID_USUARIO`;
    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerSolicitudPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM SOLICITUDES WHERE ID_SOLICITUD = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarSolicitud = async (req, res) => {
    const { id } = req.params;
    const { id_usuario, codigo_material, id_ficha, cantidad, fecha, estado, id_instructor } = req.body;
    
    // Formatear fecha para MySQL (YYYY-MM-DD)
    const cleanFecha = (fecha ? new Date(fecha) : new Date()).toISOString().split('T')[0];

    const query = 'UPDATE SOLICITUDES SET ID_USUARIO=?, CODIGO_MATERIAL=?, ID_FICHA=?, CANTIDAD=?, FECHA=?, ESTADO=?, ID_INSTRUCTOR=? WHERE ID_SOLICITUD=?';
    try {
        const [result] = await pool.execute(query, [id_usuario, codigo_material, id_ficha, cantidad, cleanFecha, estado, id_instructor, id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
        res.status(200).json({ id_solicitud: id, ...req.body, mensaje: 'Solicitud actualizada con éxito' });
        
        // Log to Audit
        const user = req.headers['x-user-action'] || 'Desconocido';
        await logAction(user, 'Editar', 'Solicitudes', `Solicitud ID: ${id} - Nuevo estado: ${estado}`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerSolicitudesPorUsuario = async (req, res) => {
    const { id_usuario } = req.params;
    const query = `
        SELECT s.ID_SOLICITUD as id_solicitud, s.ESTADO as estado, m.NOMBRE as nombre_material, s.FECHA as fecha
        FROM SOLICITUDES s
        LEFT JOIN MATERIALES m ON s.CODIGO_MATERIAL = m.CODIGO_MATERIAL
        WHERE s.ID_USUARIO = ?
        ORDER BY s.ID_SOLICITUD DESC`;
    try {
        const [rows] = await pool.query(query, [id_usuario]);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarSolicitud = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.execute('DELETE FROM SOLICITUDES WHERE ID_SOLICITUD=?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
        res.status(200).json({ mensaje: 'Solicitud eliminada con éxito', id_solicitud: id });
        
        // Log to Audit
        const user = req.headers['x-user-action'] || 'Desconocido';
        await logAction(user, 'Eliminar', 'Solicitudes', `Solicitud ID: ${id}`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};