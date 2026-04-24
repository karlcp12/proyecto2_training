import { pool } from '../db.js'


export const crearInstructor = async (req, res) => {
    const { nombre, apellido, id_area } = req.body;
    const query = 'INSERT INTO INSTRUCTORES (NOMBRE, APELLIDO, ID_AREA) VALUES (?, ?, ?)';
    try {
        const [result] = await pool.execute(query, [nombre, apellido, id_area]);
        res.status(201).json({ id: result.insertId, ...req.body, mensaje: 'Instructor creado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const obtenerInstructores = async (req, res) => {
    const query = 'SELECT I.ID_INSTRUCTOR, I.NOMBRE, I.APELLIDO, I.ID_AREA, A.NOMBRE_AREA FROM INSTRUCTORES I JOIN AREA A ON I.ID_AREA = A.ID_AREA';
    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const obtenerInstructorPorId = async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT I.ID_INSTRUCTOR, I.NOMBRE, I.APELLIDO, I.ID_AREA, A.NOMBRE_AREA FROM INSTRUCTORES I JOIN AREA A ON I.ID_AREA = A.ID_AREA WHERE I.ID_INSTRUCTOR = ?';
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
    const query = 'UPDATE INSTRUCTORES SET NOMBRE = ?, APELLIDO = ?, ID_AREA = ? WHERE ID_INSTRUCTOR = ?';
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
    const query = 'DELETE FROM INSTRUCTORES WHERE ID_INSTRUCTOR = ?';
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