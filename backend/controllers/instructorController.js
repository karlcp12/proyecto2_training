import { pool } from '../config/db.js'


export const crearInstructor = async (req, res) => {
    const { nombre, apellido, id_area } = req.body;
    const query = 'INSERT INTO instructores (nombre, apellido, id_area) VALUES (?, ?, ?)';
    try {
        const [result] = await pool.execute(query, [nombre, apellido, id_area]);
        res.status(201).json({ id: result.insertId, ...req.body, mensaje: 'Instructor creado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const obtenerInstructores = async (req, res) => {
    const query = 'SELECT I.id_instructor, I.nombre, I.apellido, I.id_area, A.Nombre_Area FROM instructores I JOIN area A ON I.id_area = A.ID_Area';
    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const obtenerInstructorPorId = async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT I.id_instructor, I.nombre, I.apellido, I.id_area, A.Nombre_Area FROM instructores I JOIN area A ON I.id_area = A.ID_Area WHERE I.id_instructor = ?';
    try {
        const [rows] = await pool.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Instructor no encontrado' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarInstructor = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, id_area } = req.body; 
    const query = 'UPDATE instructores SET nombre = ?, apellido = ?, id_area = ? WHERE id_instructor = ?';
    try {
        const [result] = await pool.execute(query, [nombre, apellido, id_area, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Instructor no encontrado' });
        }
        res.status(200).json({ id, nombre, apellido, id_area, mensaje: 'Instructor actualizado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const eliminarInstructor = async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM instructores WHERE id_instructor = ?';
    try {
        const [result] = await pool.execute(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Instructor no encontrado' });
        }
        res.status(200).json({ mensaje: 'Instructor eliminado con éxito', id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};