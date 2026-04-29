import { Router } from "express";
import {
    crearPrestamo,
    obtenerPrestamos,
    obtenerPrestamoPorId,
    actualizarPrestamo,
    eliminarPrestamo
} from "../controllers/prestamosController.js";

const router = Router();

router.post('/', crearPrestamo);
router.get('/', obtenerPrestamos);
router.get('/:id', obtenerPrestamoPorId);
router.put('/:id', actualizarPrestamo);
router.delete('/:id', eliminarPrestamo);

export default router;