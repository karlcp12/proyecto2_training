import { pool } from "../config/db.js";

export const obtenerBodegas = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM bodega");
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerBodegaPorId = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM bodega WHERE ID_Bodega = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ mensaje: "Bodega no encontrado" });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarBodega = async (req, res) => {
    try {
        const [result] = await pool.execute("DELETE FROM bodega WHERE ID_Bodega = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Bodega no encontrado" });
        res.status(200).json({ mensaje: "Bodega eliminado", id: req.params.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
