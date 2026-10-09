import { createDatabase } from "../db_config/database.js";

const db = createDatabase("info.db");

const count = db.prepare("SELECT COUNT(*) AS total FROM loja").get().total;
if (count > 0) {
  console.log("Banco já possui dados. População cancelada para evitar duplicação.");
  process.exit(0);
}

const insertLoja = db.prepare(`
  INSERT INTO loja (nome, cidade, endereco) VALUES (?, ?, ?)
`);
insertLoja.run("Esporte Mais", "Aracati", "Rua Coronel Alexanzito");
insertLoja.run("Esporte Mais", "Icapuí", "Rua Principal");

const insertFuncionario = db.prepare(`
  INSERT INTO funcionario (nome, cpf, cargo, id_loja) VALUES (?, ?, ?, ?)
`);
insertFuncionario.run("Carlos Silva", "11111111111", "Vendedor", 1);
insertFuncionario.run("Ana Oliveira", "22222222222", "Gerente", 1);
insertFuncionario.run("Pedro Santos", "33333333333", "Vendedor", 2);

const insertFornecedor = db.prepare(`
  INSERT INTO fornecedor (nome, cnpj, telefone) VALUES (?, ?, ?)
`);
insertFornecedor.run("Nike Brasil", "11111111000111", "85999990001");
insertFornecedor.run("Adidas Brasil", "22222222000122", "85999990002");
insertFornecedor.run("Penalty", "33333333000133", "85999990003");

const insertCategoria = db.prepare(`
  INSERT INTO categoria (nome) VALUES (?)
`);
for (const nome of ["Futebol", "Corrida", "Academia", "Vôlei"]) {
  insertCategoria.run(nome);
}

const insertProduto = db.prepare(`
  INSERT INTO produto (nome, estoque, preco, id_categoria, id_fornecedor)
  VALUES (?, ?, ?, ?, ?)
`);
insertProduto.run("Chuteira", 20, 299.90, 1, 1);
insertProduto.run("Camisa de Futebol", 30, 179.90, 1, 2);
insertProduto.run("Bola de Futebol", 15, 129.90, 1, 3);
insertProduto.run("Tênis de Corrida", 10, 399.90, 2, 1);
insertProduto.run("Corda de Pular", 25, 34.90, 3, 3);
insertProduto.run("Bola de Vôlei", 12, 199.90, 4, 3);

const insertCliente = db.prepare(`
  INSERT INTO cliente (nome, cpf, telefone) VALUES (?, ?, ?)
`);
insertCliente.run("João Silva", "44444444444", "88999990004");
insertCliente.run("Maria Santos", "55555555555", "88999990005");
insertCliente.run("Lucas Oliveira", "66666666666", "88999990006");
insertCliente.run("Beatriz Costa", "77777777777", "88999990007");

const insertVenda = db.prepare(`
  INSERT INTO venda
  (data, valor_total, id_cliente, id_funcionario, id_produto, id_loja)
  VALUES (?, ?, ?, ?, ?, ?)
`);
insertVenda.run("2026-09-18", 299.90, 1, 1, 1, 1);
insertVenda.run("2026-09-18", 179.90, 2, 1, 2, 1);
insertVenda.run("2026-09-19", 129.90, 3, 2, 3, 1);
insertVenda.run("2026-09-19", 399.90, 4, 3, 4, 2);

const insertPagamento = db.prepare(`
  INSERT INTO pagamento
  (data, forma_pagamento, valor_pagamento, id_venda)
  VALUES (?, ?, ?, ?)
`);
insertPagamento.run("2026-09-18", "PIX", 299.90, 1);
insertPagamento.run("2026-09-18", "Cartão de Crédito", 179.90, 2);
insertPagamento.run("2026-09-19", "Dinheiro", 129.90, 3);
insertPagamento.run("2026-09-19", "PIX", 399.90, 4);

const insertProdutoFornecedor = db.prepare(`
  INSERT INTO produto_fornecedor (id_produto, id_fornecedor) VALUES (?, ?)
`);
[
  [1, 1],
  [1, 2],
  [2, 2],
  [3, 3],
  [4, 1],
  [5, 3],
  [6, 3]
].forEach(([produto, fornecedor]) => insertProdutoFornecedor.run(produto, fornecedor));

console.log("Banco populado com sucesso!");
