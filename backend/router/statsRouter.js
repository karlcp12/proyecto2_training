import { Router } from 'express';
import { 
    getDashboardStats, 
    getReportesData, 
    getAlertas, 
    getMovimientosReport, 
    getMaterialsPDFData 
} from '../controllers/statsController.js';

const router = Router();

router.get('/dashboard', getDashboardStats);
router.get('/reportes', getReportesData);
router.get('/alertas', getAlertas);
router.get('/movimientos', getMovimientosReport);
router.get('/materials-pdf', getMaterialsPDFData);

export default router;
