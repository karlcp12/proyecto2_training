import { Router } from "express";
import {
    crearArea,
    obtenerAreas,
    obtenerAreaPorId,
    actualizarArea,
    eliminarArea
} from "../controllers/centrosController.js";

const router = Router();

router.post('/', crearArea);
router.get('/', obtenerAreas);
router.get('/:id', obtenerAreaPorId);
router.put('/:id', actualizarArea);
router.delete('/:id', eliminarArea);

export default router;