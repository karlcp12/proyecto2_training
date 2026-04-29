import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditController.js';

const router = Router();

router.get('/', getAuditLogs);
router.delete('/', async (req, res) => {
    try {
        const { pool } = await import('../db.js');
        await pool.execute('DELETE FROM audit_logs');
        res.json({ mensaje: 'Historial de auditoría vaciado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
