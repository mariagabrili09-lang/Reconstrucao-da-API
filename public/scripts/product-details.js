async function carregarDetalhesProduto() {
  const id = window.location.pathname.split("/").pop();
  const container = document.getElementById("container-produto");

  try {
    const response = await fetch(`/api/products/${id}`);
    const produto = await response.json();

    if (!response.ok) {
      throw new Error(produto.message || "Produto não encontrado");
    }

    container.innerHTML = `
      <div class="card shadow-sm">
        <div class="card-body">
          <h2>${produto.nome}</h2>
          <p><strong>ID:</strong> ${produto.id}</p>
          <p><strong>Categoria:</strong> ${produto.categoria}</p>
          <p><strong>Fornecedor:</strong> ${produto.fornecedor}</p>
          <p><strong>Estoque:</strong> ${produto.estoque}</p>
          <p><strong>Preço:</strong> R$ ${Number(produto.preco).toFixed(2)}</p>
          <a href="/products" class="btn btn-secondary">Voltar</a>
        </div>
      </div>
    `;
  } catch (error) {
    container.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
}

window.addEventListener("DOMContentLoaded", carregarDetalhesProduto);
