import { pool } from './db.js';

const createAuditTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS audit_logs (
        id_audit INT AUTO_INCREMENT PRIMARY KEY,
        usuario VARCHAR(100),
        accion VARCHAR(50),
        modulo VARCHAR(50),
        detalles TEXT,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
    console.log('Tabla audit_logs creada o ya existente.');
  } catch (error) {
    console.error('Error al crear tabla audit_logs:', error);
  } finally {
    process.exit();
  }
};

createAuditTable();
