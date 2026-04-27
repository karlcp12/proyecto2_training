import { pool } from "../config/db.js";

export const obtenerAsignas = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM asigna");
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerAsignaPorId = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM asigna WHERE ID_Asignacion = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ mensaje: "Asigna no encontrado" });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarAsigna = async (req, res) => {
    try {
        const [result] = await pool.execute("DELETE FROM asigna WHERE ID_Asignacion = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Asigna no encontrado" });
        res.status(200).json({ mensaje: "Asigna eliminado", id: req.params.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
