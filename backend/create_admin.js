import { pool } from './db.js';
import bcrypt from 'bcryptjs';

async function createAdmin() {
    try {
        const hash = await bcrypt.hash('admin123', 10);
        const querySelect = "SELECT * FROM USUARIOS WHERE DOCUMENTO = 'admin'";
        const [rows] = await pool.query(querySelect);

        if (rows.length > 0) {
            console.log("Admin already exists. Updating password and active status.");
            await pool.query("UPDATE USUARIOS SET CONTRASENA = ?, ESTADO = 'Activo' WHERE DOCUMENTO = 'admin'", [hash]);
        } else {
            console.log("Admin does not exist. Creating new user.");
            // ID_USUARIO, NOMBRE, APELLIDOS, DOCUMENTO, EMAIL, TELEFONO, ROL, ESTADO, CONTRASENA
            await pool.query(
                "INSERT INTO USUARIOS (NOMBRE, DOCUMENTO, EMAIL, ROL, ESTADO, CONTRASENA) VALUES (?, ?, ?, ?, ?, ?)",
                ['Administrador', 'admin', 'admin@example.com', 'Administrador', 'Activo', hash]
            );
        }
        console.log("Admin setup complete!");
    } catch (e) {
        console.error("Error creating/updating admin:", e);
    } finally {
        process.exit();
    }
}

createAdmin();
