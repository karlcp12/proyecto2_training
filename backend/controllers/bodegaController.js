import { pool } from '../db.js';

export const crearMaterial = async (req, res) => {
    const { nombre, cantidad, tipo } = req.body;
    const query = 'INSERT INTO MATERIALES (NOMBRE, CANTIDAD, TIPO) VALUES (?, ?, ?)';
    try {
        const [result] = await pool.execute(query, [nombre, cantidad, tipo]);
        res.status(201).json({ codigo_material: result.insertId, nombre, cantidad, tipo, mensaje: 'Material creado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerMateriales = async (req, res) => {
    const query = 'SELECT CODIGO_MATERIAL as codigo_material, NOMBRE as nombre, CANTIDAD as cantidad, TIPO as tipo FROM MATERIALES';
    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerMaterialPorId = async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT CODIGO_MATERIAL as codigo_material, NOMBRE as nombre, CANTIDAD as cantidad, TIPO as tipo FROM MATERIALES WHERE CODIGO_MATERIAL = ?';
    try {
        const [rows] = await pool.query(query, [id]);
        if (rows.length === 0) return res.status(404).json({ mensaje: 'Material no encontrado' });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarMaterial = async (req, res) => {
    const { id } = req.params;
    const { nombre, cantidad, tipo } = req.body;
    const query = 'UPDATE MATERIALES SET NOMBRE = ?, CANTIDAD = ?, TIPO = ? WHERE CODIGO_MATERIAL = ?';
    try {
        const [result] = await pool.execute(query, [nombre, cantidad, tipo, id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Material no encontrado' });
        res.status(200).json({ codigo_material: id, nombre, cantidad, tipo, mensaje: 'Material actualizado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarMaterial = async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM MATERIALES WHERE CODIGO_MATERIAL = ?';
    try {
        const [result] = await pool.execute(query, [id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Material no encontrado' });
        res.status(200).json({ mensaje: 'Material eliminado con éxito', codigo_material: id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};