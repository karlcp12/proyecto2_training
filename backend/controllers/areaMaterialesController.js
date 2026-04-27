import { pool } from '../config/db.js';

export const obtenerMaterialesPorArea = async (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT am.id_area_material, am.codigo_material, 
            m.Nombre_Material as nombre, am.cantidad, m.Tipo_Material as tipo
        FROM area_materiales am
        JOIN materiales m ON am.codigo_material = m.ID_Material
        WHERE am.id_area = ?
    `;
    try {
        const [rows] = await pool.query(query, [id]);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const asignarMaterialAArea = async (req, res) => {
    const { id } = req.params;
    const { codigo_material, cantidad } = req.body;

    try {
        const [existing] = await pool.query(
            'SELECT * FROM area_materiales WHERE id_area = ? AND codigo_material = ?',
            [id, codigo_material]
        );

        if (existing.length > 0) {
            await pool.execute(
                'UPDATE area_materiales SET cantidad = cantidad + ? WHERE id_area = ? AND codigo_material = ?',
                [cantidad, id, codigo_material]
            );
            res.status(200).json({ mensaje: 'Cantidad actualizada en el área' });
        } else {
            await pool.execute(
                'INSERT INTO area_materiales (id_area, codigo_material, cantidad) VALUES (?, ?, ?)',
                [id, codigo_material, cantidad]
            );
            res.status(201).json({ mensaje: 'Material asignado al área con éxito' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarMaterialDeArea = async (req, res) => {
    const { id, matId } = req.params;
    try {
        await pool.execute(
            'DELETE FROM area_materiales WHERE id_area = ? AND codigo_material = ?',
            [id, matId]
        );
        res.status(200).json({ mensaje: 'Material removido del área' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
