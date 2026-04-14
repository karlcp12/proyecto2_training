import { pool } from '../db.js';

export const crearPrestamo = async (req, res) => {
    const { id_solicitud, fecha_prestamo, fecha_devolucion_esperada, fecha_devolucion_real, entregado_por, id_recibido_por, estado } = req.body;
    const query = 'INSERT INTO PRESTAMOS (ID_SOLICITUD, FECHA_PRESTAMO, FECHA_DEVOLUCION_ESPERADA, FECHA_DEVOLUCION_REAL, ENTREGADO_POR, ID_RECIBIDO_POR, ESTADO) VALUES (?, ?, ?, ?, ?, ?, ?)';
    try {
        const [result] = await pool.execute(query, [id_solicitud, fecha_prestamo, fecha_devolucion_esperada, fecha_devolucion_real, entregado_por, id_recibido_por, estado || 'activo']);
        res.status(201).json({ id_prestamo: result.insertId, ...req.body, mensaje: 'Prestamo creado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerPrestamos = async (req, res) => {
    const query = `
        SELECT p.ID_PRESTAMO as id_prestamo, p.ID_SOLICITUD as id_solicitud, 
               p.FECHA_PRESTAMO as fecha_prestamo, p.FECHA_DEVOLUCION_ESPERADA as fecha_devolucion_esperada, 
               p.FECHA_DEVOLUCION_REAL as fecha_devolucion_real, p.ENTREGADO_POR as entregado_por, 
               p.ESTADO as estado, m.NOMBRE as nombre_material, 
               CONCAT(u.NOMBRE, ' ', u.APELLIDOS) as recibido_por
        FROM PRESTAMOS p
        LEFT JOIN SOLICITUDES s ON p.ID_SOLICITUD = s.ID_SOLICITUD
        LEFT JOIN MATERIALES m ON s.CODIGO_MATERIAL = m.CODIGO_MATERIAL
        LEFT JOIN USUARIOS u ON p.ID_RECIBIDO_POR = u.ID_USUARIO`;
    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerPrestamoPorId = async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM PRESTAMOS WHERE ID_PRESTAMO = ?';
    try {
        const [rows] = await pool.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Prestamo no encontrado' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarPrestamo = async (req, res) => {
    const { id } = req.params;
    const { id_solicitud, fecha_prestamo, fecha_devolucion_esperada, fecha_devolucion_real, entregado_por, id_recibido_por, estado } = req.body;
    const query = 'UPDATE PRESTAMOS SET ID_SOLICITUD = ?, FECHA_PRESTAMO = ?, FECHA_DEVOLUCION_ESPERADA = ?, FECHA_DEVOLUCION_REAL = ?, ENTREGADO_POR = ?, ID_RECIBIDO_POR = ?, ESTADO = ? WHERE ID_PRESTAMO = ?';
    try {
        const [result] = await pool.execute(query, [id_solicitud, fecha_prestamo, fecha_devolucion_esperada, fecha_devolucion_real, entregado_por, id_recibido_por, estado, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Prestamo no encontrado' });
        }
        res.status(200).json({ id_prestamo: id, ...req.body, mensaje: 'Prestamo actualizado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarPrestamo = async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM PRESTAMOS WHERE ID_PRESTAMO = ?';
    try {
        const [result] = await pool.execute(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Prestamo no encontrado' });
        }
        res.status(200).json({ mensaje: 'Prestamo eliminado con éxito', id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};