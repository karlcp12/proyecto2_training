import { pool } from '../db.js';

export const obtenerMaterialesPorArea = async (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT am.ID_AREA_MATERIAL as id_area_material, am.CODIGO_MATERIAL as codigo_material, 
               m.NOMBRE as nombre, am.CANTIDAD as cantidad, m.TIPO as tipo
        FROM AREA_MATERIALES am
        JOIN MATERIALES m ON am.CODIGO_MATERIAL = m.CODIGO_MATERIAL
        WHERE am.ID_AREA = ?
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
            'SELECT * FROM AREA_MATERIALES WHERE ID_AREA = ? AND CODIGO_MATERIAL = ?',
            [id, codigo_material]
        );

        if (existing.length > 0) {
            await pool.execute(
                'UPDATE AREA_MATERIALES SET CANTIDAD = CANTIDAD + ? WHERE ID_AREA = ? AND CODIGO_MATERIAL = ?',
                [cantidad, id, codigo_material]
            );
            res.status(200).json({ mensaje: 'Cantidad actualizada en el área' });
        } else {
            await pool.execute(
                'INSERT INTO AREA_MATERIALES (ID_AREA, CODIGO_MATERIAL, CANTIDAD) VALUES (?, ?, ?)',
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
            'DELETE FROM AREA_MATERIALES WHERE ID_AREA = ? AND CODIGO_MATERIAL = ?',
            [id, matId]
        );
        res.status(200).json({ mensaje: 'Material removido del área' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
