import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fomacion',
  port: 3306
});

const checkAprendices = async () => {
  try {
    const [rows] = await pool.query('SELECT ID_APRENDIZ, NOMBRE FROM APRENDICES');
    console.log('Aprendices in DB:', rows);
    process.exit(0);
  } catch (error) {
    console.error('Error checking aprendices:', error);
    process.exit(1);
  }
};

checkAprendices();
