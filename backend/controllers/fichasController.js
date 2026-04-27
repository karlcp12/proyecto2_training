import { pool } from '../config/db.js';

export const crearFicha = async (req, res) => {
    const { numero_ficha, id_programa, instructor_lider, ambiente, jornada, fecha_inicio, fecha_fin, estado } = req.body;
    const query = 'INSERT INTO fichas (numero_ficha, id_programa, instructor_lider, ambiente, jornada, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    try {
        const [result] = await pool.execute(query, [numero_ficha, id_programa, instructor_lider, ambiente, jornada, fecha_inicio, fecha_fin, estado]);
        res.status(201).json({ id_ficha: result.insertId, ...req.body, mensaje: 'Ficha creada con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerFichas = async (req, res) => {
    const query = 'SELECT * FROM fichas';
    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerFichaPorId = async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM fichas WHERE id_ficha = ?';
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
    const query = 'UPDATE fichas SET numero_ficha=?, id_programa=?, instructor_lider=?, ambiente=?, jornada=?, fecha_inicio=?, fecha_fin=?, estado=? WHERE id_ficha = ?';
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
    const query = 'DELETE FROM fichas WHERE id_ficha = ?';
    try {
        const [result] = await pool.execute(query, [id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Ficha no encontrada' });
        res.status(200).json({ mensaje: 'Ficha eliminada con éxito', id_ficha: id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};