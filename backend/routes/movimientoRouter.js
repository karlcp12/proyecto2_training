import { Router } from "express";
import {
    obtenerMovimientos,
    obtenerMovimientoPorId,
    eliminarMovimiento
} from "../controllers/movimientoController.js";

const router = Router();

router.get("/", obtenerMovimientos);
router.get("/:id", obtenerMovimientoPorId);
router.delete("/:id", eliminarMovimiento);

export default router;
