import { Router } from "express";
import {
    obtenerAreas,
    obtenerAreaPorId,
    eliminarArea
} from "../controllers/areaController.js";

const router = Router();

router.get("/", obtenerAreas);
router.get("/:id", obtenerAreaPorId);
router.delete("/:id", eliminarArea);

export default router;
