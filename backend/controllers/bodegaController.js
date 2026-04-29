import { pool } from '../db.js';
import { logAction } from './auditController.js';

export const crearMaterial = async (req, res) => {
    const { nombre, cantidad, tipo, responsable, ubicacion, uso, tiene_caducidad, fecha_vencimiento, categoria, id_area, ente_sena } = req.body;
    const user = req.query.user || req.headers['x-user-action'] || 'Desconocido';
    
    try {
        const cleanNombre = nombre.trim();
        const cleanTipo = tipo.trim();

        // 1. Verificar si ya existe un material con el mismo nombre y tipo
        const [existing] = await pool.query(
            'SELECT CODIGO_MATERIAL, CANTIDAD FROM MATERIALES WHERE LOWER(TRIM(NOMBRE)) = LOWER(?) AND LOWER(TRIM(TIPO)) = LOWER(?)', 
            [cleanNombre, cleanTipo]
        );

        if (existing.length > 0) {
            const materialId = existing[0].CODIGO_MATERIAL;
            const nuevaCantidad = parseInt(existing[0].CANTIDAD) + parseInt(cantidad);

            await pool.execute('UPDATE MATERIALES SET CANTIDAD = ? WHERE CODIGO_MATERIAL = ?', [nuevaCantidad, materialId]);
            await pool.execute('INSERT INTO MOVIMIENTOS_MATERIAL (ID_MATERIAL, TIPO_MOVIMIENTO, CANTIDAD, MOTIVO) VALUES (?, ?, ?, ?)', [materialId, 'Entrada', cantidad, 'Carga de material duplicado (unión)']);
            await logAction(user, 'Unión', 'Bodega', `Material "${cleanNombre}" unido. Nuevo stock: ${nuevaCantidad}`);

            return res.status(200).json({ codigo_material: materialId, nombre: cleanNombre, cantidad: nuevaCantidad, tipo: cleanTipo, mensaje: 'Stock actualizado por duplicidad' });
        }

        // Si no existe, crear nuevo con todos los campos
        const query = `INSERT INTO MATERIALES 
            (NOMBRE, CANTIDAD, TIPO, RESPONSABLE, UBICACION, USO, TIENE_CADUCIDAD, FECHA_VENCIMIENTO, CATEGORIA, ID_AREA, ENTE_SENA) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        const [result] = await pool.execute(query, [
            cleanNombre, cantidad, cleanTipo, responsable || null, ubicacion || null, 
            uso || null, tiene_caducidad || 'No', fecha_vencimiento || null, 
            categoria || null, id_area || null, ente_sena || null
        ]);
        
        await pool.execute('INSERT INTO MOVIMIENTOS_MATERIAL (ID_MATERIAL, TIPO_MOVIMIENTO, CANTIDAD, MOTIVO) VALUES (?, ?, ?, ?)', [result.insertId, 'Entrada', cantidad, 'Carga inicial']);
        await logAction(user, 'Crear', 'Bodega', `Material: ${cleanNombre} (${cantidad} unidades)`);

        res.status(201).json({ codigo_material: result.insertId, ...req.body, mensaje: 'Material creado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerMateriales = async (req, res) => {
    const query = `
        SELECT m.CODIGO_MATERIAL as codigo_material, m.NOMBRE as nombre, m.CANTIDAD as cantidad, 
               m.TIPO as tipo, m.RESPONSABLE as responsable, m.UBICACION as ubicacion, 
               m.USO as uso, m.TIENE_CADUCIDAD as tiene_caducidad, m.FECHA_VENCIMIENTO as fecha_vencimiento, 
               m.CATEGORIA as categoria, m.ID_AREA as id_area, a.NOMBRE_AREA as nombre_area, m.ENTE_SENA as ente_sena
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
        SELECT m.CODIGO_MATERIAL as codigo_material, m.NOMBRE as nombre, m.CANTIDAD as cantidad, 
               m.TIPO as tipo, m.RESPONSABLE as responsable, m.UBICACION as ubicacion, 
               m.USO as uso, m.TIENE_CADUCIDAD as tiene_caducidad, m.FECHA_VENCIMIENTO as fecha_vencimiento, 
               m.CATEGORIA as categoria, m.ID_AREA as id_area, a.NOMBRE_AREA as nombre_area, m.ENTE_SENA as ente_sena
        FROM MATERIALES m
        LEFT JOIN AREA a ON m.ID_AREA = a.ID_AREA
        WHERE m.CODIGO_MATERIAL = ?
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
    const query = `UPDATE MATERIALES SET 
        NOMBRE = ?, CANTIDAD = ?, TIPO = ?, RESPONSABLE = ?, UBICACION = ?, 
        USO = ?, TIENE_CADUCIDAD = ?, FECHA_VENCIMIENTO = ?, CATEGORIA = ?, 
        ID_AREA = ?, ENTE_SENA = ? 
        WHERE CODIGO_MATERIAL = ?`;
    try {
        const [oldRows] = await pool.query('SELECT CANTIDAD FROM MATERIALES WHERE CODIGO_MATERIAL = ?', [id]);
        const oldCantidad = oldRows[0]?.CANTIDAD || 0;

        await pool.execute(query, [
            nombre, cantidad, tipo, responsable || null, ubicacion || null, 
            uso || null, tiene_caducidad || 'No', fecha_vencimiento || null, 
            categoria || null, id_area || null, ente_sena || null, id
        ]);

        if (oldCantidad !== parseInt(cantidad)) {
            const diff = parseInt(cantidad) - oldCantidad;
            await pool.execute(
                'INSERT INTO MOVIMIENTOS_MATERIAL (ID_MATERIAL, TIPO_MOVIMIENTO, CANTIDAD, MOTIVO) VALUES (?, ?, ?, ?)',
                [id, diff > 0 ? 'Entrada' : 'Salida', Math.abs(diff), 'Actualización manual de stock']
            );
        }

        res.status(200).json({ codigo_material: id, ...req.body, mensaje: 'Material actualizado con éxito' });
        
        const user = req.query.user || req.headers['x-user-action'] || 'Desconocido';
        await logAction(user, 'Editar', 'Bodega', `Material ID: ${id} - ${nombre}`);
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
        
        // Log to Audit
        const user = req.query.user || req.headers['x-user-action'] || 'Desconocido';
        await logAction(user, 'Eliminar', 'Bodega', `Material ID: ${id}`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};