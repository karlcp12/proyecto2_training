
import { pool } from '../db.js';

export const crearPrograma = async (req, res) => {
    const { codigo, nombre_programa, id_area, estado } = req.body;
    const query = 'INSERT INTO PROGRAMAS (CODIGO, NOMBRE_PROGRAMA, ID_AREA, ESTADO) VALUES (?, ?, ?, ?)';
    try {
        const [result] = await pool.execute(query, [codigo, nombre_programa, id_area || null, estado || 'activo']);
        res.status(201).json({ id_programa: result.insertId, codigo, nombre_programa, id_area, estado: estado || 'activo', mensaje: 'Programa creado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerProgramas = async (req, res) => {
    const query = `
        SELECT p.ID_PROGRAMA as id_programa, p.CODIGO as codigo, 
               p.NOMBRE_PROGRAMA as nombre_programa, p.ID_AREA as id_area, 
               a.NOMBRE_AREA as nombre_area, p.ESTADO as estado 
        FROM PROGRAMAS p
        LEFT JOIN AREA a ON p.ID_AREA = a.ID_AREA`;
    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerProgramaPorId = async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT ID_PROGRAMA as id_programa, NOMBRE_PROGRAMA as nombre_programa, ID_AREA as id_area FROM PROGRAMAS WHERE ID_PROGRAMA = ?';
    try {
        const [rows] = await pool.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Programa no encontrado' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarPrograma = async (req, res) => {
    const { id } = req.params;
    const { codigo, nombre_programa, id_area, estado } = req.body;
    const query = 'UPDATE PROGRAMAS SET CODIGO = ?, NOMBRE_PROGRAMA = ?, ID_AREA = ?, ESTADO = ? WHERE ID_PROGRAMA = ?';
    try {
        const [result] = await pool.execute(query, [codigo, nombre_programa, id_area, estado, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Programa no encontrado' });
        }
        res.status(200).json({ id_programa: id, codigo, nombre_programa, id_area, estado, mensaje: 'Programa actualizado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarPrograma = async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM PROGRAMAS WHERE ID_PROGRAMA = ?';
    try {
        const [result] = await pool.execute(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Programa no encontrado' });
        }
        res.status(200).json({ mensaje: 'Programa eliminado con éxito', id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};