import { pool } from './db.js';
async function test() {
  try {
    const [rows] = await pool.query('DESCRIBE usuarios');
    console.log(JSON.stringify(rows, null, 2));
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
test();
