import { Router } from "express";
import {
    crearUsuario,
    loginUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario
} from "../controllers/usuariosController.js";

const router = Router()


router.post('/', crearUsuario);
router.post('/login', loginUsuario);

router.get('/', obtenerUsuarios);

router.get('/:id', obtenerUsuarioPorId);

router.put('/:id', actualizarUsuario);

router.delete('/:id', eliminarUsuario);

export default router;