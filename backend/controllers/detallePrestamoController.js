import { pool } from '../db.js';

export const crearDetallePrestamo = async (req, res) => {
    const { id_prestamo, id_material, cantidad_prestada, estado_material } = req.body;
    const query = 'INSERT INTO DETALLE_PRESTAMO (ID_PRESTAMO, ID_MATERIAL, CANTIDAD_PRESTADA, ESTADO_MATERIAL) VALUES (?, ?, ?, ?)';
    try {
        const [result] = await pool.execute(query, [id_prestamo, id_material, cantidad_prestada, estado_material]);
        res.status(201).json({ id_detalle_prestamo: result.insertId, ...req.body, mensaje: 'Detalle de prestamo creado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerDetallesPrestamo = async (req, res) => {
    const query = 'SELECT * FROM DETALLE_PRESTAMO';
    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerDetallePrestamoPorId = async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM DETALLE_PRESTAMO WHERE ID_DETALLE_PRESTAMO = ?';
    try {
        const [rows] = await pool.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Detalle de prestamo no encontrado' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarDetallePrestamo = async (req, res) => {
    const { id } = req.params;
    const { id_prestamo, id_material, cantidad_prestada, estado_material } = req.body;
    const query = 'UPDATE DETALLE_PRESTAMO SET ID_PRESTAMO = ?, ID_MATERIAL = ?, CANTIDAD_PRESTADA = ?, ESTADO_MATERIAL = ? WHERE ID_DETALLE_PRESTAMO = ?';
    try {
        const [result] = await pool.execute(query, [id_prestamo, id_material, cantidad_prestada, estado_material, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Detalle de prestamo no encontrado' });
        }
        res.status(200).json({ id_detalle_prestamo: id, ...req.body, mensaje: 'Detalle de prestamo actualizado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarDetallePrestamo = async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM DETALLE_PRESTAMO WHERE ID_DETALLE_PRESTAMO = ?';
    try {
        const [result] = await pool.execute(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Detalle de prestamo no encontrado' });
        }
        res.status(200).json({ mensaje: 'Detalle de prestamo eliminado con éxito', id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};