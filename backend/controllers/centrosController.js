import { pool } from '../db.js';

export const crearArea = async (req, res) => {
    const { nombre_area, nombre_programa } = req.body;
    try {
        // 1. Crear el área
        const queryArea = 'INSERT INTO AREA (NOMBRE_AREA) VALUES (?)';
        const [resultArea] = await pool.execute(queryArea, [nombre_area]);
        const idArea = resultArea.insertId;

        // 2. Si se envió un programa, crearlo vinculado a esta área
        if (nombre_programa) {
            // Generar un código automático para cumplir con la restricción NOT NULL de la DB
            const codigoAuto = `${nombre_area.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
            const queryProg = 'INSERT INTO PROGRAMAS (CODIGO, NOMBRE_PROGRAMA, ID_AREA, ESTADO) VALUES (?, ?, ?, ?)';
            await pool.execute(queryProg, [codigoAuto, nombre_programa, idArea, 'activo']);
        }

        res.status(201).json({ id_area: idArea, nombre_area, mensaje: 'Área y programa creados con éxito' });
    } catch (error) {
        console.error("Error en crearArea:", error);
        res.status(500).json({ error: error.message });
    }
};

export const obtenerAreas = async (req, res) => {
    // Consulta que trae las áreas y concatena los nombres de sus programas
    const query = `
        SELECT a.ID_AREA as id_area, a.NOMBRE_AREA as nombre_area, 
               GROUP_CONCAT(p.NOMBRE_PROGRAMA SEPARATOR ', ') as programas
        FROM AREA a
        LEFT JOIN PROGRAMAS p ON a.ID_AREA = p.ID_AREA
        GROUP BY a.ID_AREA`;
    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerAreaPorId = async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT ID_AREA as id_area, NOMBRE_AREA as nombre_area FROM AREA WHERE ID_AREA = ?';
    try {
        const [rows] = await pool.query(query, [id]);
        if (rows.length === 0) return res.status(404).json({ mensaje: 'Área no encontrada' });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarArea = async (req, res) => {
    const { id } = req.params;
    const { nombre_area } = req.body;
    const query = 'UPDATE AREA SET NOMBRE_AREA = ? WHERE ID_AREA = ?';
    try {
        const [result] = await pool.execute(query, [nombre_area, id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Área no encontrada' });
        res.status(200).json({ id_area: id, nombre_area, mensaje: 'Área actualizada con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarArea = async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM AREA WHERE ID_AREA = ?';
    try {
        const [result] = await pool.execute(query, [id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Área no encontrada' });
        res.status(200).json({ mensaje: 'Área eliminada con éxito', id_area: id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};