import { pool } from "../config/db.js";

export const obtenerSedess = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM sedes");
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerSedesPorId = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM sedes WHERE ID_Sede = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ mensaje: "Sedes no encontrado" });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarSedes = async (req, res) => {
    try {
        const [result] = await pool.execute("DELETE FROM sedes WHERE ID_Sede = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Sedes no encontrado" });
        res.status(200).json({ mensaje: "Sedes eliminado", id: req.params.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
