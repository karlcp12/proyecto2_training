import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM ROLES');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM ROLES WHERE ID_ROL = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ mensaje: 'Rol no encontrado' });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const { nombre_rol } = req.body;
    try {
        const [result] = await pool.execute('INSERT INTO ROLES (NOMBRE_ROL) VALUES (?)', [nombre_rol]);
        res.status(201).json({ id_rol: result.insertId, nombre_rol, mensaje: 'Rol creado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { nombre_rol } = req.body;
    try {
        const [result] = await pool.execute('UPDATE ROLES SET NOMBRE_ROL = ? WHERE ID_ROL = ?', [nombre_rol, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Rol no encontrado' });
        res.status(200).json({ id_rol: req.params.id, nombre_rol, mensaje: 'Rol actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.execute('DELETE FROM ROLES WHERE ID_ROL = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Rol no encontrado' });
        res.status(200).json({ mensaje: 'Rol eliminado', id_rol: req.params.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
