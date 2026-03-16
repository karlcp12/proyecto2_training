import { pool } from '../db.js';

export const crearArea = async (req, res) => {
    const { nombre_area } = req.body;
    const query = 'INSERT INTO AREA (NOMBRE_AREA) VALUES (?)';
    try {
        const [result] = await pool.execute(query, [nombre_area]);
        res.status(201).json({ id_area: result.insertId, nombre_area, mensaje: 'Área creada con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerAreas = async (req, res) => {
    const query = 'SELECT ID_AREA as id_area, NOMBRE_AREA as nombre_area FROM AREA';
    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerAreaPorId = async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT ID_AREA as id_area, NOMBRE_AREA as nombre_area FROM AREA WHERE ID_AREA = ?';
    try {
        const [rows] = await pool.query(query, [id]);
        if (rows.length === 0) return res.status(404).json({ mensaje: 'Área no encontrada' });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarArea = async (req, res) => {
    const { id } = req.params;
    const { nombre_area } = req.body;
    const query = 'UPDATE AREA SET NOMBRE_AREA = ? WHERE ID_AREA = ?';
    try {
        const [result] = await pool.execute(query, [nombre_area, id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Área no encontrada' });
        res.status(200).json({ id_area: id, nombre_area, mensaje: 'Área actualizada con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarArea = async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM AREA WHERE ID_AREA = ?';
    try {
        const [result] = await pool.execute(query, [id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Área no encontrada' });
        res.status(200).json({ mensaje: 'Área eliminada con éxito', id_area: id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};