import { Router } from "express";
import {
    obtenerRoles,
    obtenerRolPorId,
    crearRol,
    actualizarRol,
    eliminarRol
} from "../controllers/rolesController.js";

const router = Router();

router.get('/', obtenerRoles);
router.get('/:id', obtenerRolPorId);
router.post('/', crearRol);
router.put('/:id', actualizarRol);
router.delete('/:id', eliminarRol);

export default router;
