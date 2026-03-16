

import { Router } from "express";
import {
    crearAprendiz,
    obtenerAprendices,
    obtenerAprendizPorId,
    actualizarAprendiz,
    eliminarAprendiz
} from "../controllers/aprendizController.js";

const router = Router()


router.post('/', crearAprendiz);


router.get('/', obtenerAprendices);


router.get('/:id', obtenerAprendizPorId);


router.put('/:id', actualizarAprendiz);


router.delete('/:id', eliminarAprendiz);


export default router;