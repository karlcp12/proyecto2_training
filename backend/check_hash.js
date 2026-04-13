import { pool } from './db.js';

async function checkHash() {
    try {
        const [rows] = await pool.query("SELECT CONTRASENA FROM USUARIOS LIMIT 1");
        console.log("Hash in DB:", rows[0].CONTRASENA);
        
        import('bcryptjs').then(async bcrypt => {
            const isMatch = await bcrypt.default.compare("123456", rows[0].CONTRASENA);
            console.log("Does it match? ", isMatch);
            process.exit();
        });
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
checkHash();
