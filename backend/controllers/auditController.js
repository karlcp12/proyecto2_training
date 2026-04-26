import { pool } from '../db.js';

export const getAuditLogs = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM audit_logs ORDER BY fecha DESC LIMIT 100');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logAction = async (usuario, accion, modulo, detalles) => {
  try {
    await pool.query(
      'INSERT INTO audit_logs (usuario, accion, modulo, detalles) VALUES (?, ?, ?, ?)',
      [usuario, accion, modulo, detalles]
    );
  } catch (error) {
    console.error('Error recording audit log:', error);
  }
};
