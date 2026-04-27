import { Router } from "express";
import {
    crearMaterial,
    obtenerMateriales,
    obtenerMaterialPorId,
    actualizarMaterial,
    eliminarMaterial
} from "../controllers/materialesController.js";

const router = Router();

router.post('/', crearMaterial);
router.get('/', obtenerMateriales);
router.get('/:id', obtenerMaterialPorId);
router.put('/:id', actualizarMaterial);
router.delete('/:id', eliminarMaterial);

export default router;