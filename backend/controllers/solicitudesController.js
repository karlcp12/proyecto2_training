import { pool } from '../db.js';

export const crearSolicitud = async (req, res) => {
    const { id_aprendiz, codigo_material, id_ficha, cantidad, fecha, estado } = req.body;
    const query = 'INSERT INTO SOLICITUDES (ID_APRENDIZ, CODIGO_MATERIAL, ID_FICHA, CANTIDAD, FECHA, ESTADO) VALUES (?,?,?,?,?,?)';
    try {
        const [result] = await pool.execute(query, [id_aprendiz, codigo_material, id_ficha, cantidad, fecha || new Date().toISOString().split('T')[0], estado || 'Pendiente']);
        res.status(201).json({ id_solicitud: result.insertId, ...req.body, mensaje: 'Solicitud creada con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerSolicitudes = async (req, res) => {
    const query = `
        SELECT s.ID_SOLICITUD as id_solicitud, s.ID_APRENDIZ as id_aprendiz,
               CONCAT(a.NOMBRE, ' ', a.APELLIDO) as nombre_aprendiz,
               s.CODIGO_MATERIAL as codigo_material, m.NOMBRE as nombre_material,
               s.ID_FICHA as id_ficha, f.NUMERO_FICHA as numero_ficha,
               s.CANTIDAD as cantidad, s.FECHA as fecha, s.ESTADO as estado
        FROM SOLICITUDES s
        LEFT JOIN MATERIALES m ON s.CODIGO_MATERIAL = m.CODIGO_MATERIAL
        LEFT JOIN APRENDICES a ON s.ID_APRENDIZ = a.ID_APRENDIZ
        LEFT JOIN FICHAS f ON s.ID_FICHA = f.ID_FICHA`;
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
    const { id_aprendiz, codigo_material, id_ficha, cantidad, fecha, estado } = req.body;
    const query = 'UPDATE SOLICITUDES SET ID_APRENDIZ=?, CODIGO_MATERIAL=?, ID_FICHA=?, CANTIDAD=?, FECHA=?, ESTADO=? WHERE ID_SOLICITUD=?';
    try {
        const [result] = await pool.execute(query, [id_aprendiz, codigo_material, id_ficha, cantidad, fecha, estado, id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
        res.status(200).json({ id_solicitud: id, ...req.body, mensaje: 'Solicitud actualizada con éxito' });
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
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};