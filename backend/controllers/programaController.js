import { pool } from '../db.js';

export const crearPrograma = async (req, res) => {
    const { codigo, nombre_programa, id_centro, estado } = req.body;
    const query = 'INSERT INTO programas (codigo, nombre_programa, id_centro, estado) VALUES (?, ?, ?, ?)';
    try {
        const [result] = await pool.execute(query, [codigo, nombre_programa, id_centro, estado || 'activo']);
        res.status(201).json({ id_programa: result.insertId, ...req.body, mensaje: 'Programa creado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerProgramas = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM programas');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerProgramaPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM programas WHERE id_programa = ?', [id]);
        if (!rows.length) return res.status(404).json({ mensaje: 'Programa no encontrado' });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarPrograma = async (req, res) => {
    const { id } = req.params;
    const { codigo, nombre_programa, id_centro, estado } = req.body;
    const query = 'UPDATE programas SET codigo=?, nombre_programa=?, id_centro=?, estado=? WHERE id_programa=?';
    try {
        const [result] = await pool.execute(query, [codigo, nombre_programa, id_centro, estado, id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Programa no encontrado' });
        res.status(200).json({ id_programa: id, ...req.body, mensaje: 'Programa actualizado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarPrograma = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.execute('DELETE FROM programas WHERE id_programa=?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Programa no encontrado' });
        res.status(200).json({ mensaje: 'Programa eliminado con éxito', id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};