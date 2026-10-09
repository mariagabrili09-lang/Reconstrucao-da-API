import express from "express";
import path from "node:path";
import expressLayouts from "express-ejs-layouts";

import { createDatabase } from "../db_config/database.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import { router as apiRouter } from "./routes/api.routes.js";
import { router as produtoRouter } from "./routes/produto.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;
const db = createDatabase("info.db");

app.locals.db = db;

// EJS + layout
app.set("view engine", "ejs");
app.set("views", path.join(import.meta.dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(import.meta.dirname, "../public")));

// Rotas de API
app.use("/api", apiRouter);
app.use("/api", produtoRouter);

// Páginas EJS
app.get("/", (req, res) => res.redirect("/home"));

app.get("/home", (req, res) => {
  const resumo = {
    lojas: db.prepare("SELECT COUNT(*) AS total FROM loja").get().total,
    produtos: db.prepare("SELECT COUNT(*) AS total FROM produto").get().total,
    clientes: db.prepare("SELECT COUNT(*) AS total FROM cliente").get().total,
    vendas: db.prepare("SELECT COUNT(*) AS total FROM venda").get().total
  };
  res.render("home", { title: "Início", resumo });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "Sobre" });
});

app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contato" });
});

app.get("/products", (req, res) => {
  res.render("products", { title: "Produtos" });
});

app.get("/products/:id", (req, res) => {
  res.render("product-details", {
    title: "Detalhes do Produto",
    productId: req.params.id
  });
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
