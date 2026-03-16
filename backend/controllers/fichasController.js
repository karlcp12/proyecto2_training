import { pool } from '../db.js';

export const crearFicha = async (req, res) => {
    const { numero_ficha, id_programa, instructor_lider, ambiente, jornada, fecha_inicio, fecha_fin, estado } = req.body;
    const query = 'INSERT INTO FICHAS (NUMERO_FICHA, ID_PROGRAMA, INSTRUCTOR_LIDER, AMBIENTE, JORNADA, FECHA_INICIO, FECHA_FIN, ESTADO) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    try {
        const [result] = await pool.execute(query, [numero_ficha, id_programa, instructor_lider, ambiente, jornada, fecha_inicio, fecha_fin, estado]);
        res.status(201).json({ id_ficha: result.insertId, ...req.body, mensaje: 'Ficha creada con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerFichas = async (req, res) => {
    const query = 'SELECT ID_FICHA as id_ficha, NUMERO_FICHA as numero_ficha, ID_PROGRAMA as id_programa, INSTRUCTOR_LIDER as instructor_lider, AMBIENTE as ambiente, JORNADA as jornada, FECHA_INICIO as fecha_inicio, FECHA_FIN as fecha_fin, ESTADO as estado FROM FICHAS';
    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerFichaPorId = async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT ID_FICHA as id_ficha, NUMERO_FICHA as numero_ficha, ID_PROGRAMA as id_programa, INSTRUCTOR_LIDER as instructor_lider, AMBIENTE as ambiente, JORNADA as jornada, FECHA_INICIO as fecha_inicio, FECHA_FIN as fecha_fin, ESTADO as estado FROM FICHAS WHERE ID_FICHA = ?';
    try {
        const [rows] = await pool.query(query, [id]);
        if (rows.length === 0) return res.status(404).json({ mensaje: 'Ficha no encontrada' });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarFicha = async (req, res) => {
    const { id } = req.params;
    const { numero_ficha, id_programa, instructor_lider, ambiente, jornada, fecha_inicio, fecha_fin, estado } = req.body;
    const query = 'UPDATE FICHAS SET NUMERO_FICHA=?, ID_PROGRAMA=?, INSTRUCTOR_LIDER=?, AMBIENTE=?, JORNADA=?, FECHA_INICIO=?, FECHA_FIN=?, ESTADO=? WHERE ID_FICHA = ?';
    try {
        const [result] = await pool.execute(query, [numero_ficha, id_programa, instructor_lider, ambiente, jornada, fecha_inicio, fecha_fin, estado, id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Ficha no encontrada' });
        res.status(200).json({ id_ficha: id, ...req.body, mensaje: 'Ficha actualizada con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarFicha = async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM FICHAS WHERE ID_FICHA = ?';
    try {
        const [result] = await pool.execute(query, [id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Ficha no encontrada' });
        res.status(200).json({ mensaje: 'Ficha eliminada con éxito', id_ficha: id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};