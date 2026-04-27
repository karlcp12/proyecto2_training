import { pool } from '../config/db.js';

export const crearDetallePrestamo = async (req, res) => {
    const { id_prestamo, id_material, cantidad_prestada, estado_material } = req.body;
    const query = 'INSERT INTO detalle_prestamo (id_prestamo, codigo_material, cantidad_prestada, estado_material) VALUES (?, ?, ?, ?)';
    try {
        const [result] = await pool.execute(query, [id_prestamo, id_material, cantidad_prestada, estado_material]);
        res.status(201).json({ id_detalle_prestamo: result.insertId, ...req.body, mensaje: 'Detalle de prestamo creado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerDetallesPrestamo = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id_detalle_prestamo, id_prestamo, codigo_material, cantidad_prestada, estado_material FROM detalle_prestamo');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerDetallePrestamoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT id_detalle_prestamo, id_prestamo, codigo_material, cantidad_prestada, estado_material FROM detalle_prestamo WHERE id_detalle_prestamo = ?', [id]);
        if (!rows.length) return res.status(404).json({ mensaje: 'Detalle de prestamo no encontrado' });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarDetallePrestamo = async (req, res) => {
    const { id } = req.params;
    const { id_prestamo, id_material, cantidad_prestada, estado_material } = req.body;
    const query = 'UPDATE detalle_prestamo SET id_prestamo=?, codigo_material=?, cantidad_prestada=?, estado_material=? WHERE id_detalle_prestamo=?';
    try {
        const [result] = await pool.execute(query, [id_prestamo, id_material, cantidad_prestada, estado_material, id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Detalle de prestamo no encontrado' });
        res.status(200).json({ id_detalle_prestamo: id, ...req.body, mensaje: 'Detalle de prestamo actualizado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarDetallePrestamo = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.execute('DELETE FROM detalle_prestamo WHERE id_detalle_prestamo=?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Detalle de prestamo no encontrado' });
        res.status(200).json({ mensaje: 'Detalle de prestamo eliminado con éxito', id_detalle_prestamo: id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};