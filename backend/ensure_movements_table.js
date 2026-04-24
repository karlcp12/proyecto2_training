import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fomacion',
  port: 3306
});

const ensureTable = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS MOVIMIENTOS_MATERIAL (
          ID_MOVIMIENTO INT AUTO_INCREMENT PRIMARY KEY,
          ID_MATERIAL INT,
          TIPO_MOVIMIENTO ENUM('Entrada', 'Salida') NOT NULL,
          CANTIDAD INT NOT NULL,
          FECHA TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          MOTIVO VARCHAR(255),
          ID_USUARIO INT,
          FOREIGN KEY (ID_MATERIAL) REFERENCES MATERIALES(CODIGO_MATERIAL) ON DELETE CASCADE,
          FOREIGN KEY (ID_USUARIO) REFERENCES USUARIOS(ID_USUARIO) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await pool.query(createTableQuery);
    console.log('Table MOVIMIENTOS_MATERIAL ensured');

    // Seed some movements if empty
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM MOVIMIENTOS_MATERIAL');
    if (rows[0].count === 0) {
        await pool.query(`
            INSERT INTO MOVIMIENTOS_MATERIAL (ID_MATERIAL, TIPO_MOVIMIENTO, CANTIDAD, MOTIVO, ID_USUARIO)
            VALUES 
            (1, 'Entrada', 10, 'Carga inicial de inventario', 1),
            (2, 'Entrada', 5, 'Carga inicial de inventario', 1)
        `);
        console.log('Mock movements seeded');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error ensuring table:', error);
    process.exit(1);
  }
};

ensureTable();
