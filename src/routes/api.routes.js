import { Router } from "express";
import { ApiController } from "../controllers/api.controller.js";

const router = Router();

const controller = (req) => new ApiController(req.app.locals.db);

router.get("/home", (req, res, next) => controller(req).home(req, res, next));
router.get("/vendas/detalhadas", (req, res, next) => controller(req).vendasDetalhadas(req, res, next));
router.get("/vendas/faturamento", (req, res, next) => controller(req).faturamento(req, res, next));

// CRUD genérico das entidades do banco.
router.get("/:resource", (req, res, next) => controller(req).list(req, res, next));
router.get("/:resource/:id", (req, res, next) => controller(req).getById(req, res, next));
router.post("/:resource", (req, res, next) => controller(req).create(req, res, next));
router.put("/:resource/:id", (req, res, next) => controller(req).update(req, res, next));
router.patch("/:resource/:id", (req, res, next) => controller(req).patch(req, res, next));
router.delete("/:resource/:id", (req, res, next) => controller(req).delete(req, res, next));

export { router };
