import { pool } from '../db.js';

export const crearMaterial = async (req, res) => {
    const { nombre, cantidad, tipo, responsable, ubicacion, uso, tiene_caducidad, fecha_vencimiento, id_categoria, id_area, ente_sena, codigo_sena, unida_medida, descripcion } = req.body;
    const query = `
        INSERT INTO materiales 
        (Nombre_Material, Stock_Total, Tipo_Material, Responsable, Ubicacion, Uso, Tiene_Caducidad, Fecha_Vencimiento, FK_ID_Categoria, FK_ID_Bodega, Ente_SENA, Codigo_SENA, Unida_Medida, Descripcion) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    try {
        const [result] = await pool.execute(query, [
            nombre, cantidad, tipo || 'General', responsable, ubicacion, uso, tiene_caducidad, fecha_vencimiento || null, id_categoria || null, null, ente_sena, codigo_sena, unida_medida, descripcion
        ]);
        res.status(201).json({ 
            id_material: result.insertId, 
            nombre, cantidad, tipo, responsable, ubicacion, uso, tiene_caducidad, fecha_vencimiento, id_categoria, id_area, ente_sena,
            mensaje: 'Material creado con éxito' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerMateriales = async (req, res) => {
    const query = `
        SELECT m.ID_Material as id_material, m.Nombre_Material as nombre, m.Stock_Total as cantidad, m.Tipo_Material as tipo,
               m.Responsable as responsable, m.Ubicacion as ubicacion, m.Uso as uso, 
               m.Tiene_Caducidad as tiene_caducidad, m.Fecha_Vencimiento as fecha_vencimiento, 
               m.FK_ID_Categoria as id_categoria, m.Ente_SENA as ente_sena,
               c.Nombre_Categoria as nombre_categoria
        FROM materiales m
        LEFT JOIN categoria c ON m.FK_ID_Categoria = c.ID_Categoria
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
        SELECT ID_Material as id_material, Nombre_Material as nombre, Stock_Total as cantidad, Tipo_Material as tipo,
               Responsable as responsable, Ubicacion as ubicacion, Uso as uso, 
               Tiene_Caducidad as tiene_caducidad, Fecha_Vencimiento as fecha_vencimiento, 
               FK_ID_Categoria as id_categoria, Ente_SENA as ente_sena
        FROM materiales WHERE ID_Material = ?
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
    const { nombre, cantidad, tipo, responsable, ubicacion, uso, tiene_caducidad, fecha_vencimiento, id_categoria, ente_sena } = req.body;
    const query = `
        UPDATE materiales 
        SET Nombre_Material = ?, Stock_Total = ?, Tipo_Material = ?, Responsable = ?, Ubicacion = ?, Uso = ?, 
            Tiene_Caducidad = ?, Fecha_Vencimiento = ?, FK_ID_Categoria = ?, Ente_SENA = ?
        WHERE ID_Material = ?
    `;
    try {
        const [result] = await pool.execute(query, [
            nombre, cantidad, tipo || 'General', responsable, ubicacion, uso, tiene_caducidad, fecha_vencimiento || null, id_categoria || null, ente_sena, id
        ]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Material no encontrado' });
        res.status(200).json({ 
            id_material: id, nombre, cantidad, tipo, responsable, ubicacion, uso, tiene_caducidad, fecha_vencimiento, id_categoria, ente_sena,
            mensaje: 'Material actualizado con éxito' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarMaterial = async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM materiales WHERE ID_Material = ?';
    try {
        const [result] = await pool.execute(query, [id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Material no encontrado' });
        res.status(200).json({ mensaje: 'Material eliminado con éxito', id_material: id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};