import { Router } from "express";
import {
    crearSolicitud,
    obtenerSolicitudes,
    obtenerSolicitudPorId,
    actualizarSolicitud,
    eliminarSolicitud,
    obtenerSolicitudesPorUsuario
} from "../controllers/solicitudesController.js";

const router = Router();

router.post('/', crearSolicitud);
router.get('/', obtenerSolicitudes);
router.get('/usuario/:id_usuario', obtenerSolicitudesPorUsuario);
router.get('/:id', obtenerSolicitudPorId);
router.put('/:id', actualizarSolicitud);
router.delete('/:id', eliminarSolicitud);

export default router;