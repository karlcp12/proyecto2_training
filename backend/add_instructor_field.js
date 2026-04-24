import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fomacion',
  port: 3306
});

const addInstructorField = async () => {
  try {
    await pool.query("ALTER TABLE SOLICITUDES ADD COLUMN ID_INSTRUCTOR INT, ADD FOREIGN KEY (ID_INSTRUCTOR) REFERENCES USUARIOS(ID_USUARIO) ON DELETE SET NULL");
    console.log('ID_INSTRUCTOR field added to SOLICITUDES');
    process.exit(0);
  } catch (error) {
    console.error('Error adding field:', error);
    process.exit(1);
  }
};

addInstructorField();
