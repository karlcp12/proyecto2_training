import { pool } from "../config/db.js";

export const obtenerAreas = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM area");
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerAreaPorId = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM area WHERE ID_Area = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ mensaje: "Area no encontrado" });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarArea = async (req, res) => {
    try {
        const [result] = await pool.execute("DELETE FROM area WHERE ID_Area = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Area no encontrado" });
        res.status(200).json({ mensaje: "Area eliminado", id: req.params.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
