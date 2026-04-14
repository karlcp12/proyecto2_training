import { Router } from 'express';
import { getDashboardStats, getReportesData, getAlertas } from '../controllers/statsController.js';

const router = Router();

router.get('/dashboard', getDashboardStats);
router.get('/reportes', getReportesData);
router.get('/alertas', getAlertas);

export default router;
