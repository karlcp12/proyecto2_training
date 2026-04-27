import { Router } from "express";
import {
    obtenerBodegas,
    obtenerBodegaPorId,
    eliminarBodega
} from "../controllers/bodegaController.js";

const router = Router();

router.get("/", obtenerBodegas);
router.get("/:id", obtenerBodegaPorId);
router.delete("/:id", eliminarBodega);

export default router;
