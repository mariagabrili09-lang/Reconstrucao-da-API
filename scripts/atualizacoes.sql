-- Exemplos de UPDATE
UPDATE produto
SET estoque = 25
WHERE id_produto = 1;

UPDATE produto
SET nome = 'Chuteira Profissional', preco = 349.90
WHERE id_produto = 1;

UPDATE cliente
SET telefone = '88988887777'
WHERE id_cliente = 1;

-- Exemplo de DELETE
-- Execute somente se realmente quiser remover o registro.
DELETE FROM produto_fornecedor
WHERE id_produto = 6 AND id_fornecedor = 3;

DELETE FROM produto
WHERE id_produto = 6;
