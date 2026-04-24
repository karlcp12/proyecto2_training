import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fomacion',
  port: 3306
});

const checkData = async () => {
  try {
    const [movements] = await pool.query('SELECT * FROM MOVIMIENTOS_MATERIAL');
    const [materials] = await pool.query('SELECT * FROM MATERIALES');
    console.log('Movements:', movements);
    console.log('Materials:', materials);
    process.exit(0);
  } catch (error) {
    console.error('Error checking data:', error);
    process.exit(1);
  }
};

checkData();
