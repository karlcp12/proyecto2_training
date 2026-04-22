import { pool } from './db.js';
import bcrypt from 'bcryptjs';

async function createAdmin() {
    try {
        const hash = await bcrypt.hash('Admin123', 10);
        const querySelect = "SELECT * FROM usuarios WHERE Correo = 'admin'";
        const [rows] = await pool.query(querySelect);

        if (rows.length > 0) {
            console.log("Admin already exists. Updating password and active status.");
            await pool.query("UPDATE usuarios SET Contrasena = ?, Estado = 'Activo' WHERE Correo = 'admin'", [hash]);
        } else {
            console.log("Admin does not exist. Creating new user.");
            // ID_Usuario, Nombre, Apellidos, Correo, Contrasena, Estado, ID_Rol
            await pool.query(
                "INSERT INTO usuarios (Nombre, Apellidos, Correo, Contrasena, Estado, ID_Rol) VALUES (?, ?, ?, ?, ?, ?)",
                ['Administrador', 'Sistema', 'admin', hash, 'Activo', 1]
            );
        }
        console.log("Admin setup complete! Username: 'admin', Password: 'Admin123'");
    } catch (e) {
        console.error("Error creating/updating admin:", e);
    } finally {
        process.exit();
    }
}

createAdmin();
