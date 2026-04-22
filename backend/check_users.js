import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fomacion',
  port: 3306
});

const checkUsers = async () => {
  try {
    const [rows] = await pool.query('SELECT EMAIL, PASSWORD, ESTADO FROM USUARIOS');
    console.log('Users in DB:', rows);
    process.exit(0);
  } catch (error) {
    console.error('Error checking users:', error);
    process.exit(1);
  }
};

checkUsers();
