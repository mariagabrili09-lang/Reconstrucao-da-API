-- Consultas simples
SELECT * FROM loja;
SELECT * FROM funcionario;
SELECT * FROM fornecedor;
SELECT * FROM categoria;
SELECT * FROM produto;
SELECT * FROM cliente;
SELECT * FROM venda;
SELECT * FROM pagamento;

-- WHERE
SELECT * FROM loja WHERE cidade = 'Aracati';
SELECT * FROM funcionario WHERE cargo = 'Vendedor';
SELECT * FROM fornecedor WHERE nome = 'Nike Brasil';
SELECT * FROM categoria WHERE nome = 'Futebol';
SELECT * FROM produto WHERE preco > 150;
SELECT * FROM cliente WHERE nome = 'João Silva';
SELECT * FROM venda WHERE valor_total > 200;
SELECT * FROM pagamento WHERE forma_pagamento = 'PIX';

-- ORDER BY
SELECT * FROM loja ORDER BY nome ASC;
SELECT * FROM funcionario ORDER BY nome ASC;
SELECT * FROM fornecedor ORDER BY nome ASC;
SELECT * FROM categoria ORDER BY nome ASC;
SELECT * FROM produto ORDER BY preco DESC;
SELECT * FROM cliente ORDER BY nome ASC;
SELECT * FROM venda ORDER BY valor_total DESC;
SELECT * FROM pagamento ORDER BY valor_pagamento DESC;

-- JOIN: produto + categoria + fornecedor
SELECT
    p.nome AS produto,
    p.preco,
    c.nome AS categoria,
    f.nome AS fornecedor
FROM produto p
JOIN categoria c ON p.id_categoria = c.id_categoria
JOIN fornecedor f ON p.id_fornecedor = f.id_fornecedor;

-- JOIN: venda detalhada
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
JOIN loja l ON v.id_loja = l.id_loja;

-- Faturamento
SELECT SUM(valor_total) AS faturamento_total FROM venda;

-- Relacionamento N:N
SELECT
    p.nome AS produto,
    f.nome AS fornecedor
FROM produto_fornecedor pf
JOIN produto p ON pf.id_produto = p.id_produto
JOIN fornecedor f ON pf.id_fornecedor = f.id_fornecedor;
