import { Router } from "express";
import {
    crearFicha,
    obtenerFichas,
    obtenerFichaPorId,
    actualizarFicha,
    eliminarFicha
} from "../controllers/fichasController.js";

const router = Router();

router.post('/', crearFicha);
router.get('/', obtenerFichas);
router.get('/:id', obtenerFichaPorId);
router.put('/:id', actualizarFicha);
router.delete('/:id', eliminarFicha);

export default router;