import { pool } from './db.js';

async function updateDB() {
    try {
        await pool.query("ALTER TABLE USUARIOS ADD COLUMN CONTRASENA VARCHAR(255) DEFAULT '\\$2a\\$10\\$XoH.qB.p9wZbH8Fk5FZTlOA./J1HlQdK.Y2D.T9zOqL9nZcE/.k.O';");
        console.log("Columna agregada exitosamente.");
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log("La columna ya existe.");
        } else {
            console.error("Error al alterar la tabla", err);
        }
    } finally {
        process.exit();
    }
}

updateDB();
