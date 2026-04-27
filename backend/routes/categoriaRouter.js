import { Router } from "express";
import {
    obtenerCategorias,
    obtenerCategoriaPorId,
    eliminarCategoria
} from "../controllers/categoriaController.js";

const router = Router();

router.get("/", obtenerCategorias);
router.get("/:id", obtenerCategoriaPorId);
router.delete("/:id", eliminarCategoria);

export default router;
