import { pool } from '../db.js';

export const crearSolicitud = async (req, res) => {
    const { id_aprendiz, codigo_material, id_ficha, cantidad, fecha, estado } = req.body;
    const query = 'INSERT INTO solicitudes (ID_Aprendiz, Codigo_Material, ID_Ficha, Cantidad, Fecha_Solicitud, Estado) VALUES (?,?,?,?,?,?)';
    try {
        const [result] = await pool.execute(query, [id_aprendiz, codigo_material, id_ficha, cantidad, fecha || new Date().toISOString().split('T')[0], estado || 'Pendiente']);
        res.status(201).json({ id_solicitud: result.insertId, ...req.body, mensaje: 'Solicitud creada con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerSolicitudes = async (req, res) => {
    const query = `SELECT s.ID_Solicitud as id_solicitud, s.ID_Aprendiz as id_aprendiz,
        s.Codigo_Material as codigo_material, m.Nombre_Material as nombre_material,
        s.ID_Ficha as id_ficha, s.Cantidad as cantidad,
        s.Fecha_Solicitud as fecha, s.Estado as estado
        FROM solicitudes s
        LEFT JOIN materiales m ON s.Codigo_Material = m.ID_Material`;
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
        const [rows] = await pool.query('SELECT ID_Solicitud as id_solicitud, ID_Aprendiz as id_aprendiz, Codigo_Material as codigo_material, ID_Ficha as id_ficha, Cantidad as cantidad, Fecha_Solicitud as fecha, Estado as estado FROM solicitudes WHERE ID_Solicitud = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarSolicitud = async (req, res) => {
    const { id } = req.params;
    const { id_aprendiz, codigo_material, id_ficha, cantidad, fecha, estado } = req.body;
    const query = 'UPDATE solicitudes SET ID_Aprendiz=?, Codigo_Material=?, ID_Ficha=?, Cantidad=?, Fecha_Solicitud=?, Estado=? WHERE ID_Solicitud=?';
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
        const [result] = await pool.execute('DELETE FROM solicitudes WHERE ID_Solicitud=?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
        res.status(200).json({ mensaje: 'Solicitud eliminada con éxito', id_solicitud: id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};