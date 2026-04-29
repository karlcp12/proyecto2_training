import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

async function checkTables() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    const [tables] = await connection.query('SHOW TABLES');
    console.log('Tables in database:', tables);

    for (const tableObj of tables) {
        const tableName = Object.values(tableObj)[0];
        console.log(`\nStructure of ${tableName}:`);
        const [columns] = await connection.query(`DESCRIBE ${tableName}`);
        console.table(columns);
    }

    await connection.end();
}

checkTables().catch(console.error);
