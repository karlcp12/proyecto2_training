import { Router } from "express";
import {
    crearPrograma,
    obtenerProgramas,
    obtenerProgramaPorId,
    actualizarPrograma,
    eliminarPrograma
} from "../controllers/programaController.js"; // ¡Asegúrate del .js!

const router = Router()


router.post('/', crearPrograma);

router.get('/', obtenerProgramas);

router.get('/:id', obtenerProgramaPorId);

router.put('/:id', actualizarPrograma);

router.delete('/:id', eliminarPrograma);

export default router;