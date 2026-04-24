import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fomacion',
  port: 3306
});

const updateRolesAndSchema = async () => {
  try {
    // 1. Update Roles
    await pool.query("UPDATE ROLES SET NOMBRE_ROL = 'Vocero' WHERE ID_ROL = 3");
    await pool.query("DELETE FROM ROLES WHERE ID_ROL = 4"); // Remove 'Personal' if not needed
    
    // 2. Modify SOLICITUDES table to point to USUARIOS instead of APRENDICES
    // We need to drop the old FK first
    // Note: Finding the FK name might be tricky, usually it's solicitudes_ibfk_1 or similar.
    // In some systems, we can just drop the column and recreate it.
    
    // Check if we can just rename the column and update the reference
    await pool.query("ALTER TABLE SOLICITUDES DROP FOREIGN KEY solicitudes_ibfk_1");
    await pool.query("ALTER TABLE SOLICITUDES CHANGE COLUMN ID_APRENDIZ ID_USUARIO INT");
    await pool.query("ALTER TABLE SOLICITUDES ADD CONSTRAINT fk_solicitud_usuario FOREIGN KEY (ID_USUARIO) REFERENCES USUARIOS(ID_USUARIO) ON DELETE SET NULL");

    console.log('Roles and SOLICITUDES schema updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error updating schema:', error);
    process.exit(1);
  }
};

updateRolesAndSchema();
