import { pool } from "../config/db.js";

export const obtenerCategorias = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM categoria");
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerCategoriaPorId = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM categoria WHERE ID_Categoria = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ mensaje: "Categoria no encontrado" });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarCategoria = async (req, res) => {
    try {
        const [result] = await pool.execute("DELETE FROM categoria WHERE ID_Categoria = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Categoria no encontrado" });
        res.status(200).json({ mensaje: "Categoria eliminado", id: req.params.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
