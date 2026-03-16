import { Router } from "express";
import {
    crearInstructor,
    obtenerInstructores,
    obtenerInstructorPorId,
    actualizarInstructor,
    eliminarInstructor
} from "../controllers/instructorController.js";

const router = Router()


router.post('/', crearInstructor);

router.get('/', obtenerInstructores);

router.get('/:id', obtenerInstructorPorId);

router.put('/:id', actualizarInstructor);

router.delete('/:id', eliminarInstructor);

export default router;