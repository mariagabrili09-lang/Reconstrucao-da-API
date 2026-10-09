export default class ProdutoController {
  constructor(db) {
    this.db = db;
  }

  getProducts = (req, res, next) => {
    try {
      const products = this.db.prepare(`
        SELECT
          p.id_produto AS id,
          p.nome,
          p.estoque,
          p.preco,
          p.id_categoria,
          c.nome AS categoria,
          p.id_fornecedor,
          f.nome AS fornecedor
        FROM produto p
        JOIN categoria c ON c.id_categoria = p.id_categoria
        JOIN fornecedor f ON f.id_fornecedor = p.id_fornecedor
        ORDER BY p.nome ASC
      `).all();

      res.status(200).json({ productsList: products });
    } catch (error) {
      next(error);
    }
  };

  getProductById = (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const product = this.db.prepare(`
        SELECT
          p.id_produto AS id,
          p.nome,
          p.estoque,
          p.preco,
          p.id_categoria,
          c.nome AS categoria,
          p.id_fornecedor,
          f.nome AS fornecedor
        FROM produto p
        JOIN categoria c ON c.id_categoria = p.id_categoria
        JOIN fornecedor f ON f.id_fornecedor = p.id_fornecedor
        WHERE p.id_produto = ?
      `).get(id);

      if (!product) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }

      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  };

  createProduct = (req, res, next) => {
    try {
      const { nome, estoque, preco, id_categoria, id_fornecedor } = req.body;

      if (!nome || estoque === undefined || preco === undefined || !id_categoria || !id_fornecedor) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
      }

      const result = this.db.prepare(`
        INSERT INTO produto (nome, estoque, preco, id_categoria, id_fornecedor)
        VALUES (?, ?, ?, ?, ?)
      `).run(nome, Number(estoque), Number(preco), Number(id_categoria), Number(id_fornecedor));

      const product = this.db.prepare(`
        SELECT * FROM produto WHERE id_produto = ?
      `).get(result.lastInsertRowid);

      res.status(201).json({ message: "Produto cadastrado!", product });
    } catch (error) {
      next(error);
    }
  };

  updateProduct = (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const { nome, estoque, preco, id_categoria, id_fornecedor } = req.body;

      const exists = this.db.prepare(
        "SELECT id_produto FROM produto WHERE id_produto = ?"
      ).get(id);

      if (!exists) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }

      this.db.prepare(`
        UPDATE produto
        SET nome = ?, estoque = ?, preco = ?, id_categoria = ?, id_fornecedor = ?
        WHERE id_produto = ?
      `).run(nome, Number(estoque), Number(preco), Number(id_categoria), Number(id_fornecedor), id);

      const product = this.db.prepare(
        "SELECT * FROM produto WHERE id_produto = ?"
      ).get(id);

      res.status(200).json({ message: "Produto atualizado!", product });
    } catch (error) {
      next(error);
    }
  };

  patchProduct = (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const product = this.db.prepare(
        "SELECT * FROM produto WHERE id_produto = ?"
      ).get(id);

      if (!product) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }

      const fields = ["nome", "estoque", "preco", "id_categoria", "id_fornecedor"];
      const values = [];
      const updates = [];

      for (const field of fields) {
        if (req.body[field] !== undefined) {
          updates.push(`${field} = ?`);
          values.push(req.body[field]);
        }
      }

      if (updates.length === 0) {
        return res.status(400).json({ message: "Nenhum campo informado para atualização" });
      }

      values.push(id);
      this.db.prepare(`
        UPDATE produto SET ${updates.join(", ")} WHERE id_produto = ?
      `).run(...values);

      const updated = this.db.prepare(
        "SELECT * FROM produto WHERE id_produto = ?"
      ).get(id);

      res.status(200).json({ message: "Produto atualizado!", product: updated });
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const product = this.db.prepare(
        "SELECT * FROM produto WHERE id_produto = ?"
      ).get(id);

      if (!product) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }

      this.db.prepare("DELETE FROM produto_fornecedor WHERE id_produto = ?").run(id);
      this.db.prepare("DELETE FROM produto WHERE id_produto = ?").run(id);

      res.status(200).json({ message: "Produto deletado!", product });
    } catch (error) {
      next(error);
    }
  };
}
