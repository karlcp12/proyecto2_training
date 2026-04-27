import { Router } from "express";
import {
    obtenerSedess,
    obtenerSedesPorId,
    eliminarSedes
} from "../controllers/sedesController.js";

const router = Router();

router.get("/", obtenerSedess);
router.get("/:id", obtenerSedesPorId);
router.delete("/:id", eliminarSedes);

export default router;
