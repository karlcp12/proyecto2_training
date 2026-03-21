import { pool } from '../db.js';

export const crearMaterial = async (req, res) => {
    const { nombre, cantidad, tipo, responsable, ubicacion, uso, tiene_caducidad, fecha_vencimiento, categoria, id_area, ente_sena } = req.body;
    const query = `
        INSERT INTO MATERIALES 
        (NOMBRE, CANTIDAD, TIPO, RESPONSABLE, UBICACION, USO, TIENE_CADUCIDAD, FECHA_VENCIMIENTO, CATEGORIA, ID_AREA, ENTE_SENA) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    try {
        const [result] = await pool.execute(query, [
            nombre, cantidad, tipo || 'General', responsable, ubicacion, uso, tiene_caducidad, fecha_vencimiento || null, categoria, id_area || null, ente_sena
        ]);
        res.status(201).json({ 
            codigo_material: result.insertId, 
            nombre, cantidad, tipo, responsable, ubicacion, uso, tiene_caducidad, fecha_vencimiento, categoria, id_area, ente_sena,
            mensaje: 'Material creado con éxito' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerMateriales = async (req, res) => {
    const query = `
        SELECT m.CODIGO_MATERIAL as codigo_material, m.NOMBRE as nombre, m.CANTIDAD as cantidad, m.TIPO as tipo,
               m.RESPONSABLE as responsable, m.UBICACION as ubicacion, m.USO as uso, 
               m.TIENE_CADUCIDAD as tiene_caducidad, m.FECHA_VENCIMIENTO as fecha_vencimiento, 
               m.CATEGORIA as categoria, m.ID_AREA as id_area, m.ENTE_SENA as ente_sena,
               a.NOMBRE_AREA as nombre_area
        FROM MATERIALES m
        LEFT JOIN AREA a ON m.ID_AREA = a.ID_AREA
    `;
    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerMaterialPorId = async (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT CODIGO_MATERIAL as codigo_material, NOMBRE as nombre, CANTIDAD as cantidad, TIPO as tipo,
               RESPONSABLE as responsable, UBICACION as ubicacion, USO as uso, 
               TIENE_CADUCIDAD as tiene_caducidad, FECHA_VENCIMIENTO as fecha_vencimiento, 
               CATEGORIA as categoria, ID_AREA as id_area, ENTE_SENA as ente_sena
        FROM MATERIALES WHERE CODIGO_MATERIAL = ?
    `;
    try {
        const [rows] = await pool.query(query, [id]);
        if (rows.length === 0) return res.status(404).json({ mensaje: 'Material no encontrado' });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarMaterial = async (req, res) => {
    const { id } = req.params;
    const { nombre, cantidad, tipo, responsable, ubicacion, uso, tiene_caducidad, fecha_vencimiento, categoria, id_area, ente_sena } = req.body;
    const query = `
        UPDATE MATERIALES 
        SET NOMBRE = ?, CANTIDAD = ?, TIPO = ?, RESPONSABLE = ?, UBICACION = ?, USO = ?, 
            TIENE_CADUCIDAD = ?, FECHA_VENCIMIENTO = ?, CATEGORIA = ?, ID_AREA = ?, ENTE_SENA = ?
        WHERE CODIGO_MATERIAL = ?
    `;
    try {
        const [result] = await pool.execute(query, [
            nombre, cantidad, tipo || 'General', responsable, ubicacion, uso, tiene_caducidad, fecha_vencimiento || null, categoria, id_area || null, ente_sena, id
        ]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Material no encontrado' });
        res.status(200).json({ 
            codigo_material: id, nombre, cantidad, tipo, responsable, ubicacion, uso, tiene_caducidad, fecha_vencimiento, categoria, id_area, ente_sena,
            mensaje: 'Material actualizado con éxito' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarMaterial = async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM MATERIALES WHERE CODIGO_MATERIAL = ?';
    try {
        const [result] = await pool.execute(query, [id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Material no encontrado' });
        res.status(200).json({ mensaje: 'Material eliminado con éxito', codigo_material: id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};