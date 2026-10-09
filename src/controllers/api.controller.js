const TABLES = {
  lojas: {
    table: "loja",
    id: "id_loja",
    columns: ["nome", "cidade", "endereco"]
  },
  funcionarios: {
    table: "funcionario",
    id: "id_funcionario",
    columns: ["nome", "cpf", "cargo", "id_loja"]
  },
  fornecedores: {
    table: "fornecedor",
    id: "id_fornecedor",
    columns: ["nome", "cnpj", "telefone"]
  },
  categorias: {
    table: "categoria",
    id: "id_categoria",
    columns: ["nome"]
  },
  clientes: {
    table: "cliente",
    id: "id_cliente",
    columns: ["nome", "cpf", "telefone"]
  },
  vendas: {
    table: "venda",
    id: "id_venda",
    columns: ["data", "valor_total", "id_cliente", "id_funcionario", "id_produto", "id_loja"]
  },
  pagamentos: {
    table: "pagamento",
    id: "id_pagamento",
    columns: ["data", "forma_pagamento", "valor_pagamento", "id_venda"]
  }
};

export class ApiController {
  constructor(db) {
    this.db = db;
  }

  list = (req, res, next) => {
    try {
      const config = TABLES[req.params.resource];
      if (!config) return res.status(404).json({ message: "Recurso não encontrado" });

      const rows = this.db.prepare(
        `SELECT * FROM ${config.table} ORDER BY ${config.id} ASC`
      ).all();

      res.status(200).json(rows);
    } catch (error) {
      next(error);
    }
  };

  getById = (req, res, next) => {
    try {
      const config = TABLES[req.params.resource];
      const id = Number(req.params.id);

      if (!config) return res.status(404).json({ message: "Recurso não encontrado" });
      if (!Number.isInteger(id)) return res.status(400).json({ message: "ID inválido" });

      const row = this.db.prepare(
        `SELECT * FROM ${config.table} WHERE ${config.id} = ?`
      ).get(id);

      if (!row) return res.status(404).json({ message: "Registro não encontrado" });

      res.status(200).json(row);
    } catch (error) {
      next(error);
    }
  };

  create = (req, res, next) => {
    try {
      const config = TABLES[req.params.resource];
      if (!config) return res.status(404).json({ message: "Recurso não encontrado" });

      const values = config.columns.map(column => req.body[column]);

      if (values.some(value => value === undefined || value === null || value === "")) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
      }

      const placeholders = config.columns.map(() => "?").join(", ");
      const result = this.db.prepare(`
        INSERT INTO ${config.table} (${config.columns.join(", ")})
        VALUES (${placeholders})
      `).run(...values);

      const row = this.db.prepare(
        `SELECT * FROM ${config.table} WHERE ${config.id} = ?`
      ).get(result.lastInsertRowid);

      res.status(201).json({ message: "Registro cadastrado!", data: row });
    } catch (error) {
      next(error);
    }
  };

  update = (req, res, next) => {
    try {
      const config = TABLES[req.params.resource];
      const id = Number(req.params.id);

      if (!config) return res.status(404).json({ message: "Recurso não encontrado" });
      if (!Number.isInteger(id)) return res.status(400).json({ message: "ID inválido" });

      const exists = this.db.prepare(
        `SELECT * FROM ${config.table} WHERE ${config.id} = ?`
      ).get(id);

      if (!exists) return res.status(404).json({ message: "Registro não encontrado" });

      const values = config.columns.map(column => req.body[column]);
      if (values.some(value => value === undefined || value === null || value === "")) {
        return res.status(400).json({ message: "No PUT, todos os campos são obrigatórios" });
      }

      const assignments = config.columns.map(column => `${column} = ?`).join(", ");

      this.db.prepare(`
        UPDATE ${config.table}
        SET ${assignments}
        WHERE ${config.id} = ?
      `).run(...values, id);

      const row = this.db.prepare(
        `SELECT * FROM ${config.table} WHERE ${config.id} = ?`
      ).get(id);

      res.status(200).json({ message: "Registro atualizado!", data: row });
    } catch (error) {
      next(error);
    }
  };

  patch = (req, res, next) => {
    try {
      const config = TABLES[req.params.resource];
      const id = Number(req.params.id);

      if (!config) return res.status(404).json({ message: "Recurso não encontrado" });
      if (!Number.isInteger(id)) return res.status(400).json({ message: "ID inválido" });

      const exists = this.db.prepare(
        `SELECT * FROM ${config.table} WHERE ${config.id} = ?`
      ).get(id);

      if (!exists) return res.status(404).json({ message: "Registro não encontrado" });

      const allowed = config.columns.filter(column => req.body[column] !== undefined);

      if (allowed.length === 0) {
        return res.status(400).json({ message: "Nenhum campo informado" });
      }

      const values = allowed.map(column => req.body[column]);
      const assignments = allowed.map(column => `${column} = ?`).join(", ");

      this.db.prepare(`
        UPDATE ${config.table}
        SET ${assignments}
        WHERE ${config.id} = ?
      `).run(...values, id);

      const row = this.db.prepare(
        `SELECT * FROM ${config.table} WHERE ${config.id} = ?`
      ).get(id);

      res.status(200).json({ message: "Registro atualizado!", data: row });
    } catch (error) {
      next(error);
    }
  };

  delete = (req, res, next) => {
    try {
      const config = TABLES[req.params.resource];
      const id = Number(req.params.id);

      if (!config) return res.status(404).json({ message: "Recurso não encontrado" });

      const row = this.db.prepare(
        `SELECT * FROM ${config.table} WHERE ${config.id} = ?`
      ).get(id);

      if (!row) return res.status(404).json({ message: "Registro não encontrado" });

      this.db.prepare(
        `DELETE FROM ${config.table} WHERE ${config.id} = ?`
      ).run(id);

      res.status(200).json({ message: "Registro deletado!", data: row });
    } catch (error) {
      next(error);
    }
  };

  home = (req, res, next) => {
    try {
      res.status(200).json({
        titulo: "Loja Esporte Mais",
        descricao: "API REST da loja de artigos esportivos"
      });
    } catch (error) {
      next(error);
    }
  };

  faturamento = (req, res, next) => {
    try {
      const result = this.db.prepare(
        "SELECT COALESCE(SUM(valor_total), 0) AS faturamento_total FROM venda"
      ).get();

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  vendasDetalhadas = (req, res, next) => {
    try {
      const rows = this.db.prepare(`
        SELECT
          v.id_venda,
          v.data,
          c.nome AS cliente,
          f.nome AS funcionario,
          p.nome AS produto,
          l.nome AS loja,
          v.valor_total
        FROM venda v
        JOIN cliente c ON v.id_cliente = c.id_cliente
        JOIN funcionario f ON v.id_funcionario = f.id_funcionario
        JOIN produto p ON v.id_produto = p.id_produto
        JOIN loja l ON v.id_loja = l.id_loja
        ORDER BY v.data DESC, v.id_venda DESC
      `).all();

      res.status(200).json(rows);
    } catch (error) {
      next(error);
    }
  };
}
