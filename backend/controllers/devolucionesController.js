import { pool } from '../config/db.js';

export const crearDevolucion = async (req, res) => {
    const { id_prestamo, id_usuario, fecha_devolucion, estado_materiales } = req.body;
    const query = 'INSERT INTO devoluciones (id_prestamo, id_usuario, fecha_devolucion, estado_materiales) VALUES (?, ?, ?, ?)';
    try {
        const [result] = await pool.execute(query, [id_prestamo, id_usuario, fecha_devolucion || new Date().toISOString().split('T')[0], estado_materiales]);
        res.status(201).json({ id_devolucion: result.insertId, ...req.body, mensaje: 'Devolución registrada con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerDevoluciones = async (req, res) => {
    const query = 'SELECT * FROM devoluciones';
    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerDevolucionPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM devoluciones WHERE id_devolucion = ?', [id]);
        if (!rows.length) return res.status(404).json({ mensaje: 'Devolución no encontrada' });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarDevolucion = async (req, res) => {
    const { id } = req.params;
    const { id_prestamo, id_usuario, fecha_devolucion, estado_materiales } = req.body;
    const query = 'UPDATE devoluciones SET id_prestamo=?, id_usuario=?, fecha_devolucion=?, estado_materiales=? WHERE id_devolucion=?';
    try {
        const [result] = await pool.execute(query, [id_prestamo, id_usuario, fecha_devolucion, estado_materiales, id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Devolución no encontrada' });
        res.status(200).json({ id_devolucion: id, ...req.body, mensaje: 'Devolución actualizada con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarDevolucion = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.execute('DELETE FROM devoluciones WHERE id_devolucion=?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Devolución no encontrada' });
        res.status(200).json({ mensaje: 'Devolución eliminada con éxito', id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};