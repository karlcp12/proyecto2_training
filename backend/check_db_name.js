import mysql from 'mysql2/promise';

async function checkDB() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });
    const [rows] = await connection.query('SHOW DATABASES');
    console.log('Databases found:', rows.map(r => r.Database));
    await connection.end();
  } catch (err) {
    console.error('Error connecting to MySQL:', err.message);
  }
}

checkDB();
