import { pool } from '../db.js';
import { logAction } from './auditController.js';

export const crearMaterial = async (req, res) => {
    const { nombre, cantidad, tipo } = req.body;
    const user = req.query.user || req.headers['x-user-action'] || 'Desconocido';
    
    try {
        const cleanNombre = nombre.trim();
        const cleanTipo = tipo.trim();

        console.log(`[BODEGA] intentando crear/unir: "${cleanNombre}" (${cleanTipo})`);

        // 1. Verificar si ya existe un material con el mismo nombre y tipo (sin importar espacios o mayúsculas)
        const [existing] = await pool.query(
            'SELECT CODIGO_MATERIAL, CANTIDAD FROM MATERIALES WHERE LOWER(TRIM(NOMBRE)) = LOWER(?) AND LOWER(TRIM(TIPO)) = LOWER(?)', 
            [cleanNombre, cleanTipo]
        );

        console.log(`[BODEGA] Resultado búsqueda:`, existing);

        if (existing.length > 0) {
            const materialId = existing[0].CODIGO_MATERIAL;
            const cantidadExistente = parseInt(existing[0].CANTIDAD);
            const cantidadASumar = parseInt(cantidad);
            const nuevaCantidad = cantidadExistente + cantidadASumar;

            console.log(`[BODEGA] UNIÓN DETECTADA. ID: ${materialId}, Vieja: ${cantidadExistente}, Suma: ${cantidadASumar}, Nueva: ${nuevaCantidad}`);

            // 2. Actualizar stock existente
            await pool.execute(
                'UPDATE MATERIALES SET CANTIDAD = ? WHERE CODIGO_MATERIAL = ?', 
                [nuevaCantidad, materialId]
            );

            // 3. Registrar movimiento de entrada
            await pool.execute(
                'INSERT INTO MOVIMIENTOS_MATERIAL (ID_MATERIAL, TIPO_MOVIMIENTO, CANTIDAD, MOTIVO) VALUES (?, ?, ?, ?)',
                [materialId, 'Entrada', cantidadASumar, 'Carga de material duplicado (unión)']
            );

            // 4. Registrar en Auditoría
            await logAction(user, 'Unión', 'Bodega', `Material "${cleanNombre}" ya existía. Se sumaron ${cantidadASumar} unidades. Nuevo stock: ${nuevaCantidad}`);

            return res.status(200).json({ 
                codigo_material: materialId, 
                nombre: cleanNombre, 
                cantidad: nuevaCantidad, 
                tipo: cleanTipo, 
                mensaje: `El material "${cleanNombre}" ya existía en ${cleanTipo}. Se han sumado ${cantidadASumar} unidades al stock.` 
            });
        }

        // Si no existe, crear nuevo
        const query = 'INSERT INTO MATERIALES (NOMBRE, CANTIDAD, TIPO) VALUES (?, ?, ?)';
        const [result] = await pool.execute(query, [cleanNombre, cantidad, cleanTipo]);
        
        await pool.execute(
            'INSERT INTO MOVIMIENTOS_MATERIAL (ID_MATERIAL, TIPO_MOVIMIENTO, CANTIDAD, MOTIVO) VALUES (?, ?, ?, ?)',
            [result.insertId, 'Entrada', cantidad, 'Carga inicial / Compra']
        );

        await logAction(user, 'Crear', 'Bodega', `Material: ${cleanNombre} (${cantidad} unidades)`);

        res.status(201).json({ codigo_material: result.insertId, nombre: cleanNombre, cantidad, tipo: cleanTipo, mensaje: 'Material creado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerMateriales = async (req, res) => {
    const query = 'SELECT CODIGO_MATERIAL as codigo_material, NOMBRE as nombre, CANTIDAD as cantidad, TIPO as tipo FROM MATERIALES';
    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerMaterialPorId = async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT CODIGO_MATERIAL as codigo_material, NOMBRE as nombre, CANTIDAD as cantidad, TIPO as tipo FROM MATERIALES WHERE CODIGO_MATERIAL = ?';
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
    const { nombre, cantidad, tipo } = req.body;
    const query = 'UPDATE MATERIALES SET NOMBRE = ?, CANTIDAD = ?, TIPO = ? WHERE CODIGO_MATERIAL = ?';
    try {
        // Get old quantity to determine if it's an entry or exit
        const [oldRows] = await pool.query('SELECT CANTIDAD FROM MATERIALES WHERE CODIGO_MATERIAL = ?', [id]);
        const oldCantidad = oldRows[0]?.CANTIDAD || 0;

        const [result] = await pool.execute(query, [nombre, cantidad, tipo, id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Material no encontrado' });
        
        // Log movement if quantity changed
        if (oldCantidad !== parseInt(cantidad)) {
            const diff = parseInt(cantidad) - oldCantidad;
            await pool.execute(
                'INSERT INTO MOVIMIENTOS_MATERIAL (ID_MATERIAL, TIPO_MOVIMIENTO, CANTIDAD, MOTIVO) VALUES (?, ?, ?, ?)',
                [id, diff > 0 ? 'Entrada' : 'Salida', Math.abs(diff), 'Actualización manual de stock']
            );
        }

        res.status(200).json({ codigo_material: id, nombre, cantidad, tipo, mensaje: 'Material actualizado con éxito' });
        
        // Log to Audit
        const user = req.query.user || req.headers['x-user-action'] || 'Desconocido';
        await logAction(user, 'Editar', 'Bodega', `Material ID: ${id} - Nuevo nombre: ${nombre}, Stock: ${cantidad}`);
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