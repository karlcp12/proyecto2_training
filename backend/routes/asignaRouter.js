import { Router } from "express";
import {
    obtenerAsignas,
    obtenerAsignaPorId,
    eliminarAsigna
} from "../controllers/asignaController.js";

const router = Router();

router.get("/", obtenerAsignas);
router.get("/:id", obtenerAsignaPorId);
router.delete("/:id", eliminarAsigna);

export default router;
