import { pool } from '../db.js';

export const crearDevolucion = async (req, res) => {
    const { id_prestamo, id_usuario, fecha_devolucion, estado_materiales } = req.body;
    const query = 'INSERT INTO DEVOLUCIONES (ID_PRESTAMO, ID_USUARIO, FECHA_DEVOLUCION, ESTADO_MATERIALES) VALUES (?, ?, ?, ?)';
    try {
        const [result] = await pool.execute(query, [id_prestamo, id_usuario, fecha_devolucion, estado_materiales]);
        res.status(201).json({ id_devolucion: result.insertId, ...req.body, mensaje: 'Devolucion creada con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerDevoluciones = async (req, res) => {
    const query = 'SELECT * FROM DEVOLUCIONES';
    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerDevolucionPorId = async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM DEVOLUCIONES WHERE ID_DEVOLUCION = ?';
    try {
        const [rows] = await pool.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Devolucion no encontrada' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarDevolucion = async (req, res) => {
    const { id } = req.params;
    const { id_prestamo, id_usuario, fecha_devolucion, estado_materiales } = req.body;
    const query = 'UPDATE DEVOLUCIONES SET ID_PRESTAMO = ?, ID_USUARIO = ?, FECHA_DEVOLUCION = ?, ESTADO_MATERIALES = ? WHERE ID_DEVOLUCION = ?';
    try {
        const [result] = await pool.execute(query, [id_prestamo, id_usuario, fecha_devolucion, estado_materiales, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Devolucion no encontrada' });
        }
        res.status(200).json({ id_devolucion: id, ...req.body, mensaje: 'Devolucion actualizada con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarDevolucion = async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM DEVOLUCIONES WHERE ID_DEVOLUCION = ?';
    try {
        const [result] = await pool.execute(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Devolucion no encontrada' });
        }
        res.status(200).json({ mensaje: 'Devolucion eliminado con éxito', id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};