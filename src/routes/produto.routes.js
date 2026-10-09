import { Router } from "express";
import ProdutoController from "../controllers/produto.controller.js";

const router = Router();

router.use((req, res, next) => {
  if (!req.app.locals.db) {
    return res.status(500).json({ message: "Banco de dados não disponível" });
  }
  next();
});

router.get("/products", (req, res, next) =>
  new ProdutoController(req.app.locals.db).getProducts(req, res, next)
);

router.get("/products/:id", (req, res, next) =>
  new ProdutoController(req.app.locals.db).getProductById(req, res, next)
);

router.post("/products", (req, res, next) =>
  new ProdutoController(req.app.locals.db).createProduct(req, res, next)
);

router.put("/products/:id", (req, res, next) =>
  new ProdutoController(req.app.locals.db).updateProduct(req, res, next)
);

router.patch("/products/:id", (req, res, next) =>
  new ProdutoController(req.app.locals.db).patchProduct(req, res, next)
);

router.delete("/products/:id", (req, res, next) =>
  new ProdutoController(req.app.locals.db).deleteProduct(req, res, next)
);

export { router };
