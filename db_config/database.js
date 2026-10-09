import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const createDatabase = (dbName = "info.db") => {
  const databaseDir = path.join(import.meta.dirname, "../databases");
  fs.mkdirSync(databaseDir, { recursive: true });

  const db = new Database(path.join(databaseDir, dbName));
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS loja (
      id_loja INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cidade TEXT NOT NULL,
      endereco TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS funcionario (
      id_funcionario INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cpf TEXT NOT NULL,
      cargo TEXT NOT NULL,
      id_loja INTEGER NOT NULL,
      FOREIGN KEY (id_loja) REFERENCES loja(id_loja)
    );

    CREATE TABLE IF NOT EXISTS fornecedor (
      id_fornecedor INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cnpj TEXT NOT NULL,
      telefone TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categoria (
      id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS produto (
      id_produto INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      estoque INTEGER NOT NULL CHECK (estoque >= 0),
      preco REAL NOT NULL CHECK (preco >= 0),
      id_categoria INTEGER NOT NULL,
      id_fornecedor INTEGER NOT NULL,
      FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria),
      FOREIGN KEY (id_fornecedor) REFERENCES fornecedor(id_fornecedor)
    );

    CREATE TABLE IF NOT EXISTS cliente (
      id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cpf TEXT NOT NULL,
      telefone TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS venda (
      id_venda INTEGER PRIMARY KEY AUTOINCREMENT,
      data TEXT NOT NULL,
      valor_total REAL NOT NULL CHECK (valor_total >= 0),
      id_cliente INTEGER NOT NULL,
      id_funcionario INTEGER NOT NULL,
      id_produto INTEGER NOT NULL,
      id_loja INTEGER NOT NULL,
      FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
      FOREIGN KEY (id_funcionario) REFERENCES funcionario(id_funcionario),
      FOREIGN KEY (id_produto) REFERENCES produto(id_produto),
      FOREIGN KEY (id_loja) REFERENCES loja(id_loja)
    );

    CREATE TABLE IF NOT EXISTS pagamento (
      id_pagamento INTEGER PRIMARY KEY AUTOINCREMENT,
      data TEXT NOT NULL,
      forma_pagamento TEXT NOT NULL,
      valor_pagamento REAL NOT NULL CHECK (valor_pagamento >= 0),
      id_venda INTEGER NOT NULL,
      FOREIGN KEY (id_venda) REFERENCES venda(id_venda)
    );

    CREATE TABLE IF NOT EXISTS produto_fornecedor (
      id_produto INTEGER NOT NULL,
      id_fornecedor INTEGER NOT NULL,
      PRIMARY KEY (id_produto, id_fornecedor),
      FOREIGN KEY (id_produto) REFERENCES produto(id_produto) ON DELETE CASCADE,
      FOREIGN KEY (id_fornecedor) REFERENCES fornecedor(id_fornecedor) ON DELETE CASCADE
    );
  `);

  return db;
};

export { createDatabase };
