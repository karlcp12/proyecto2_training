import { pool } from './db.js';

async function getUser() {
    try {
        const [rows] = await pool.query("SELECT DOCUMENTO FROM USUARIOS LIMIT 1");
        console.log("Documento de prueba:", rows[0] ? rows[0].DOCUMENTO : "Ninguno");
    } finally {
        process.exit();
    }
}
getUser();
