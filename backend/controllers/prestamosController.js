import { pool } from '../db.js';

export const crearPrestamo = async (req, res) => {
    const { id_solicitud, fecha_prestamo, fecha_devolucion_esperada, fecha_devolucion_real, entregado_por, id_recibido_por, estado } = req.body;
    const query = 'INSERT INTO prestamos (id_solicitud, fecha_prestamo, fecha_devolucion_esperada, fecha_devolucion_real, entregado_por, id_recibido_por, estado) VALUES (?, ?, ?, ?, ?, ?, ?)';
    try {
        const [result] = await pool.execute(query, [id_solicitud, fecha_prestamo, fecha_devolucion_esperada, fecha_devolucion_real || null, entregado_por, id_recibido_por, estado || 'activo']);
        res.status(201).json({ id_prestamo: result.insertId, ...req.body, mensaje: 'Prestamo creado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerPrestamos = async (req, res) => {
    const query = 'SELECT * FROM prestamos';
    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerPrestamoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM prestamos WHERE id_prestamo = ?', [id]);
        if (!rows.length) return res.status(404).json({ mensaje: 'Prestamo no encontrado' });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarPrestamo = async (req, res) => {
    const { id } = req.params;
    const { id_solicitud, fecha_prestamo, fecha_devolucion_esperada, fecha_devolucion_real, entregado_por, id_recibido_por, estado } = req.body;
    const query = 'UPDATE prestamos SET id_solicitud=?, fecha_prestamo=?, fecha_devolucion_esperada=?, fecha_devolucion_real=?, entregado_por=?, id_recibido_por=?, estado=? WHERE id_prestamo=?';
    try {
        const [result] = await pool.execute(query, [id_solicitud, fecha_prestamo, fecha_devolucion_esperada, fecha_devolucion_real || null, entregado_por, id_recibido_por, estado, id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Prestamo no encontrado' });
        res.status(200).json({ id_prestamo: id, ...req.body, mensaje: 'Prestamo actualizado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarPrestamo = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.execute('DELETE FROM prestamos WHERE id_prestamo=?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Prestamo no encontrado' });
        res.status(200).json({ mensaje: 'Prestamo eliminado con éxito', id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};