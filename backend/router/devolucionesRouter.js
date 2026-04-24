import { Router } from "express";
import {
    crearDevolucion,
    obtenerDevoluciones,
    obtenerDevolucionPorId,
    actualizarDevolucion,
    eliminarDevolucion
} from "../controllers/devolucionesController.js";

const router = Router();

router.post('/', crearDevolucion);
router.get('/', obtenerDevoluciones);
router.get('/:id', obtenerDevolucionPorId);
router.put('/:id', actualizarDevolucion);
router.delete('/:id', eliminarDevolucion);

export default router;