import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT ID_Rol as id, Nombre_Rol as nombre FROM rol');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT ID_Rol as id, Nombre_Rol as nombre FROM rol WHERE ID_Rol = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ mensaje: 'Rol no encontrado' });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const { nombre } = req.body;
    try {
        const [result] = await pool.execute('INSERT INTO rol (Nombre_Rol) VALUES (?)', [nombre]);
        res.status(201).json({ id: result.insertId, nombre, mensaje: 'Rol creado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { nombre } = req.body;
    try {
        const [result] = await pool.execute('UPDATE rol SET Nombre_Rol = ? WHERE ID_Rol = ?', [nombre, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Rol no encontrado' });
        res.status(200).json({ id: req.params.id, nombre, mensaje: 'Rol actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.execute('DELETE FROM rol WHERE ID_Rol = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Rol no encontrado' });
        res.status(200).json({ mensaje: 'Rol eliminado', id: req.params.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
