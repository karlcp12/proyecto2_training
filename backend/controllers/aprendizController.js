import { pool } from '../db.js'


export const crearAprendiz = async (req, res) => {
    const { nombre, apellido, documento, email, direccion, telefono, id_ficha } = req.body;
    const query = 'INSERT INTO aprendices (nombre, apellido, documento, correo, direccion, telefono, id_ficha) VALUES (?, ?, ?, ?, ?, ?, ?)';
    try {
        const [result] = await pool.execute(query, [nombre, apellido, documento, email, direccion, telefono, id_ficha]);
        res.status(201).json({ id: result.insertId, ...req.body, mensaje: 'Aprendiz creado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const obtenerAprendices = async (req, res) => {
    const query = 'SELECT * FROM aprendices';
    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const obtenerAprendizPorId = async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM aprendices WHERE id_aprendiz = ?';
    try {
        const [rows] = await pool.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Aprendiz no encontrado' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const actualizarAprendiz = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, documento, email, direccion, telefono, id_ficha } = req.body;
    const query = 'UPDATE aprendices SET nombre = ?, apellido = ?, documento = ?, correo = ?, direccion = ?, telefono = ?, id_ficha = ? WHERE id_aprendiz = ?';
    try {
        const [result] = await pool.execute(query, [nombre, apellido, documento, email, direccion, telefono, id_ficha, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Aprendiz no encontrado' });
        }
        res.status(200).json({ id, ...req.body, mensaje: 'Aprendiz actualizado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const eliminarAprendiz = async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM aprendices WHERE id_aprendiz = ?';
    try {
        const [result] = await pool.execute(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Aprendiz no encontrado' });
        }
        res.status(200).json({ mensaje: 'Aprendiz eliminado con éxito', id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};