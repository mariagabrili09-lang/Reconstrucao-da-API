-- LOJAS

INSERT INTO loja (nome, cidade, endereco)
VALUES ('Esporte Mais', 'Aracati', 'Rua Coronel Alexanzito');

INSERT INTO loja (nome, cidade, endereco)
VALUES ('Esporte Mais', 'Icapuí', 'Rua Principal');

-- FUNCIONÁRIOS

INSERT INTO funcionario (nome, cpf, cargo, id_loja,)
VALUES ('Carlos Silva', '11111111111', 'Vendedor', 1);

INSERT INTO funcionario (nome, cpf, cargo, id_loja)
VALUES ('Ana Oliveira', '22222222222', 'Gerente', 1);

INSERT INTO funcionario (nome, cpf, cargo, id_loja)
VALUES ('Pedro Santos', '33333333333', 'Vendedor', 2);

-- FORNECEDORES

INSERT INTO fornecedor (nome, cnpj, telefone)
VALUES ('Nike Brasil', '11111111000111', '85999990001');

INSERT INTO fornecedor (nome, cnpj, telefone)
VALUES ('Adidas Brasil', '22222222000122', '85999990002');

INSERT INTO fornecedor (nome, cnpj, telefone)
VALUES ('Penalty', '33333333000133', '85999990003');

-- CATEGORIAS

INSERT INTO categoria (nome)
VALUES ('Futebol');

INSERT INTO categoria (nome)
VALUES ('Corrida');

INSERT INTO categoria (nome)
VALUES ('Academia');

INSERT INTO categoria (nome)
VALUES ('Vôlei');

-- PRODUTOS

INSERT INTO produto
(nome, estoque, preco, id_categoria, id_fornecedor)
VALUES
('Chuteira', 20, 299.90, 1, 1);

INSERT INTO produto
(nome, estoque, preco, id_categoria, id_fornecedor)
VALUES
('Camisa de Futebol', 30, 179.90, 1, 2);

INSERT INTO produto
(nome, estoque, preco, id_categoria, id_fornecedor)
VALUES
('Bola de Futebol', 15, 129.90, 1, 3);

INSERT INTO produto
(nome, estoque, preco, id_categoria, id_fornecedor)
VALUES
('Tênis de Corrida', 10, 399.90, 2, 1);

INSERT INTO produto
(nome, estoque, preco, id_categoria, id_fornecedor)
VALUES
('Corda de Pular', 25, 34.90, 3, 3);

INSERT INTO produto
(nome, estoque, preco, id_categoria, id_fornecedor)
VALUES
('Bola de Vôlei', 12, 199.90, 4, 3);

-- CLIENTES

INSERT INTO cliente (nome, cpf, telefone)
VALUES ('João Silva', '44444444444', '88999990004');

INSERT INTO cliente (nome, cpf, telefone)
VALUES ('Maria Santos', '55555555555', '88999990005');

INSERT INTO cliente (nome, cpf, telefone)
VALUES ('Lucas Oliveira', '66666666666', '88999990006');

INSERT INTO cliente (nome, cpf, telefone)
VALUES ('Beatriz Costa', '77777777777', '88999990007');

-- VENDAS

INSERT INTO venda
(data, valor_total, id_cliente, id_funcionario, id_loja)
VALUES
('2026-09-18', 299.90, 1, 1, 1);

INSERT INTO venda
(data, valor_total, id_cliente, id_funcionario, id_loja)
VALUES
('2026-09-18', 179.90, 2, 1, 2);

INSERT INTO venda
(data, valor_total, id_cliente, id_funcionario, id_loja)
VALUES
('2026-09-19', 129.90, 3, 2, 2);

INSERT INTO venda
(data, valor_total, id_cliente, id_funcionario, id_loja)
VALUES
('2026-09-19', 399.90, 4, 2, 1);

-- ITENS DAS VENDAS

INSERT INTO item_venda
(id_venda, id_produto, quantidade, preco_unitario)
VALUES
(1, 1, 1, 299.90),
(2, 2, 1, 179.90),
(3, 3, 1, 129.90),
(4, 4, 1, 399.90);


-- MOVIMENTAÇÕES DE ESTOQUE

INSERT INTO movimentacao_estoque
(id_produto, motivo, quantidade)
VALUES
(1, 'Venda 1', -1),
(2, 'Venda 2', -1),
(3, 'Venda 3', -1),
(4, 'Venda 4', -1);

-- PAGAMENTOS

INSERT INTO pagamento
(data, forma_pagamento, valor_pagamento, id_venda)
VALUES
('2026-09-18', 'PIX', 299.90, 1);

INSERT INTO pagamento
(data, forma_pagamento, valor_pagamento, id_venda)
VALUES
('2026-09-18', 'Cartão de Crédito', 179.90, 2);

INSERT INTO pagamento
(data, forma_pagamento, valor_pagamento, id_venda)
VALUES
('2026-09-19', 'Dinheiro', 129.90, 3);

INSERT INTO pagamento
(data, forma_pagamento, valor_pagamento, id_venda)
VALUES
('2026-09-19', 'PIX', 399.90, 4);

INSERT INTO produto_fornecedor (id_produto, id_fornecedor)
VALUES
(1, 1),
(2, 2),
(3, 1),
(4, 3),
(5, 2),
(6, 3);

INSERT INTO item_venda
(id_venda, id_produto, quantidade, preco_unitario)
VALUES
(1, 1, 1, 299.90),
(2, 2, 1, 179.90),
(3, 3, 1, 129.90),
(4, 4, 1, 399.90);


-- MOVIMENTAÇÕES DE ESTOQUE

INSERT INTO movimentacao_estoque
(id_produto, motivo, quantidade)
VALUES
(1, 'Venda 1', -1),
(2, 'Venda 2', -1),
(3, 'Venda 3', -1),
(4, 'Venda 4', -1);