import { pool } from '../db.js';

export const crearFicha = async (req, res) => {
    const { numero_ficha, id_programa, id_area, instructor_lider, ambiente, jornada, fecha_inicio, fecha_fin, estado } = req.body;
    const query = 'INSERT INTO FICHAS (NUMERO_FICHA, ID_PROGRAMA, ID_AREA, INSTRUCTOR_LIDER, AMBIENTE, JORNADA, FECHA_INICIO, FECHA_FIN, ESTADO) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    try {
        const [result] = await pool.execute(query, [numero_ficha, id_programa, id_area, instructor_lider, ambiente, jornada, fecha_inicio, fecha_fin, estado]);
        res.status(201).json({ id_ficha: result.insertId, ...req.body, mensaje: 'Ficha creada con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerFichas = async (req, res) => {
    const query = `
        SELECT f.ID_FICHA as id_ficha, f.NUMERO_FICHA as numero_ficha, 
               f.ID_PROGRAMA as id_programa, p.NOMBRE_PROGRAMA as nombre_programa,
               f.ID_AREA as id_area, a.NOMBRE_AREA as nombre_area,
               f.INSTRUCTOR_LIDER as instructor_lider, f.AMBIENTE as ambiente, 
               f.JORNADA as jornada, f.FECHA_INICIO as fecha_inicio, 
               f.FECHA_FIN as fecha_fin, f.ESTADO as estado 
        FROM FICHAS f
        LEFT JOIN PROGRAMAS p ON f.ID_PROGRAMA = p.ID_PROGRAMA
        LEFT JOIN AREA a ON f.ID_AREA = a.ID_AREA`;
    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerFichaPorId = async (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT f.ID_FICHA as id_ficha, f.NUMERO_FICHA as numero_ficha, 
               f.ID_PROGRAMA as id_programa, p.NOMBRE_PROGRAMA as nombre_programa,
               f.ID_AREA as id_area, a.NOMBRE_AREA as nombre_area,
               f.INSTRUCTOR_LIDER as instructor_lider, f.AMBIENTE as ambiente, 
               f.JORNADA as jornada, f.FECHA_INICIO as fecha_inicio, 
               f.FECHA_FIN as fecha_fin, f.ESTADO as estado 
        FROM FICHAS f
        LEFT JOIN PROGRAMAS p ON f.ID_PROGRAMA = p.ID_PROGRAMA
        LEFT JOIN AREA a ON f.ID_AREA = a.ID_AREA
        WHERE f.ID_FICHA = ?`;
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
    const { numero_ficha, id_programa, id_area, instructor_lider, ambiente, jornada, fecha_inicio, fecha_fin, estado } = req.body;
    const query = 'UPDATE FICHAS SET NUMERO_FICHA=?, ID_PROGRAMA=?, ID_AREA=?, INSTRUCTOR_LIDER=?, AMBIENTE=?, JORNADA=?, FECHA_INICIO=?, FECHA_FIN=?, ESTADO=? WHERE ID_FICHA = ?';
    try {
        const [result] = await pool.execute(query, [numero_ficha, id_programa, id_area, instructor_lider, ambiente, jornada, fecha_inicio, fecha_fin, estado, id]);
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