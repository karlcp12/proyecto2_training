import { Router } from "express";
import {
    crearDetallePrestamo,
    obtenerDetallesPrestamo,
    obtenerDetallePrestamoPorId,
    actualizarDetallePrestamo,
    eliminarDetallePrestamo
} from "../controllers/detallePrestamoController.js";

const router = Router();

router.post('/', crearDetallePrestamo);
router.get('/', obtenerDetallesPrestamo);
router.get('/:id', obtenerDetallePrestamoPorId);
router.put('/:id', actualizarDetallePrestamo);
router.delete('/:id', eliminarDetallePrestamo);

export default router;