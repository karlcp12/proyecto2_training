import { Router } from 'express';
import { 
    obtenerMaterialesPorArea, 
    asignarMaterialAArea, 
    eliminarMaterialDeArea 
} from '../controllers/areaMaterialesController.js';

const router = Router();

// Estas rutas se montarán colgando de /centros/:id/materiales o similar
router.get('/:id/materiales', obtenerMaterialesPorArea);
router.post('/:id/materiales', asignarMaterialAArea);
router.delete('/:id/materiales/:matId', eliminarMaterialDeArea);

export default router;
