import { Router } from "express";
import {
    crearSolicitud,
    obtenerSolicitudes,
    obtenerSolicitudPorId,
    actualizarSolicitud,
    eliminarSolicitud
} from "../controllers/solicitudesController.js";

const router = Router();

router.post('/', crearSolicitud);
router.get('/', obtenerSolicitudes);
router.get('/:id', obtenerSolicitudPorId);
router.put('/:id', actualizarSolicitud);
router.delete('/:id', eliminarSolicitud);

export default router;