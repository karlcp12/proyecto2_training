import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fomacion',
  port: 3306
});

const seedUsers = async () => {
  try {
    // Roles: 1: Admin, 2: Instructor, 3: Vocero
    await pool.query(`
        INSERT INTO USUARIOS (NOMBRE, APELLIDOS, DOCUMENTO, EMAIL, PASSWORD, ID_ROL, ESTADO) 
        VALUES 
        ('Admin', 'Principal', '10', 'admin@sena.edu.co', 'Admin123', 1, 'Activo'),
        ('Carlos', 'Instructor', '20', 'carlos@sena.edu.co', 'Admin123', 2, 'Activo'),
        ('Ana', 'Vocera', '30', 'ana@sena.edu.co', 'Admin123', 3, 'Activo'),
        ('Luis', 'Vocero', '40', 'luis@sena.edu.co', 'Admin123', 3, 'Activo')
        ON DUPLICATE KEY UPDATE ESTADO='Activo'
    `);

    console.log('Mock users (Admin, Instructor, Vocero) created');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
