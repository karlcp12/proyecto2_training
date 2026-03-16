import { pool } from '../db.js'


export const crearAprendiz = async (req, res) => {
    const { nombre, apellido, documento, email, direccion, telefono, id_ficha } = req.body;
    const query = 'INSERT INTO APRENDICES (NOMBRE, APELLIDO, DOCUMENTO, CORREO, DIRECCION, TELEFONO, ID_FICHA) VALUES (?, ?, ?, ?, ?, ?, ?)';
    try {
        const [result] = await pool.execute(query, [nombre, apellido, documento, email, direccion, telefono, id_ficha]);
        res.status(201).json({ id: result.insertId, ...req.body, mensaje: 'Aprendiz creado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const obtenerAprendices = async (req, res) => {
    const query = 'SELECT * FROM APRENDICES';
    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const obtenerAprendizPorId = async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM APRENDICES WHERE ID_APRENDIZ = ?';
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
    const query = 'UPDATE APRENDICES SET NOMBRE = ?, APELLIDO = ?, DOCUMENTO = ?, CORREO = ?, DIRECCION = ?, TELEFONO = ?, ID_FICHA = ? WHERE ID_APRENDIZ = ?';
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
    const query = 'DELETE FROM APRENDICES WHERE ID_APRENDIZ = ?';
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