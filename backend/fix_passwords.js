import { pool } from './db.js';
import bcrypt from 'bcryptjs';

async function updatePasswords() {
    try {
        const hash = await bcrypt.hash('123456', 10);
        console.log("Correct hash: ", hash);
        const [result] = await pool.query("UPDATE USUARIOS SET CONTRASENA = ?", [hash]);
        console.log("Rows affected:", result.affectedRows);
        
        // Let's also verify it right after
        const [rows] = await pool.query("SELECT CONTRASENA FROM USUARIOS LIMIT 1");
        const isMatch = await bcrypt.compare("123456", rows[0].CONTRASENA);
        console.log("Does the new one match? ", isMatch);
        
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
updatePasswords();
