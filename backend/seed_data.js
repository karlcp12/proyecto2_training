import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fomacion',
  port: 3306
});

const seedData = async () => {
  try {
    // 1. Ensure a role exists
    await pool.query("INSERT IGNORE INTO ROLES (ID_ROL, NOMBRE_ROL) VALUES (3, 'Aprendiz')");
    
    // 2. Ensure a ficha exists
    await pool.query("INSERT IGNORE INTO FICHAS (ID_FICHA, NUMERO_FICHA, INSTRUCTOR_LIDER, AMBIENTE, JORNADA) VALUES (1, '2670687', 'Juan Perez', 'Sistemas', 'Diurna')");

    // 3. Insert mock aprendices
    await pool.query(`
        INSERT IGNORE INTO APRENDICES (ID_APRENDIZ, NOMBRE, APELLIDO, DOCUMENTO, CORREO, ID_FICHA) 
        VALUES 
        (1, 'Willson', 'Sánchez', '1001', 'willson@sena.edu.co', 1),
        (2, 'Maria', 'Gomez', '1002', 'maria@sena.edu.co', 1)
    `);

    // 4. Ensure some materials exist
    await pool.query(`
        INSERT IGNORE INTO MATERIALES (CODIGO_MATERIAL, NOMBRE, CANTIDAD, TIPO) 
        VALUES 
        (1, 'Teclado Mecánico', 10, 'Electrónico'),
        (2, 'Monitor 24\"', 5, 'Electrónico')
    `);

    console.log('Seed data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
