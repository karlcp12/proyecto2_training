import { pool } from "../config/db.js";

export const obtenerMovimientos = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM movimiento");
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerMovimientoPorId = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM movimiento WHERE ID_Movimiento = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ mensaje: "Movimiento no encontrado" });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarMovimiento = async (req, res) => {
    try {
        const [result] = await pool.execute("DELETE FROM movimiento WHERE ID_Movimiento = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Movimiento no encontrado" });
        res.status(200).json({ mensaje: "Movimiento eliminado", id: req.params.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
