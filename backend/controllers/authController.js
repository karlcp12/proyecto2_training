import { pool } from '../db.js';

export const login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const query = `
            SELECT u.ID_USUARIO as id, u.NOMBRE as nombre, u.APELLIDOS as apellidos, 
                   r.NOMBRE_ROL as rol, u.EMAIL as email
            FROM USUARIOS u
            LEFT JOIN ROLES r ON u.ID_ROL = r.ID_ROL
            WHERE u.EMAIL = ? AND u.PASSWORD = ? AND u.ESTADO = 'Activo'
        `;
        const [rows] = await pool.query(query, [email, password]);

        if (rows.length === 0) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas o usuario inactivo' });
        }

        const user = rows[0];
        res.status(200).json({
            usuario: user,
            mensaje: 'Inicio de sesión exitoso'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
