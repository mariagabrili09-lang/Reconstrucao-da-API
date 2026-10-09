async function carregarProdutos() {
  const container = document.getElementById("container-produtos");
  const mensagem = document.getElementById("mensagem");

  try {
    const response = await fetch("/api/products");
    const dados = await response.json();

    if (!response.ok) {
      throw new Error(dados.message || "Erro ao carregar produtos");
    }

    if (dados.productsList.length === 0) {
      mensagem.innerHTML = '<div class="alert alert-warning">Nenhum produto encontrado.</div>';
      return;
    }

    container.innerHTML = dados.productsList.map((p) => `
      <div class="col-md-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h3 class="card-title">${p.nome}</h3>
            <p class="mb-1"><strong>Categoria:</strong> ${p.categoria}</p>
            <p class="mb-1"><strong>Fornecedor:</strong> ${p.fornecedor}</p>
            <p class="mb-1"><strong>Estoque:</strong> ${p.estoque}</p>
            <p><strong>Preço:</strong> R$ ${Number(p.preco).toFixed(2)}</p>
            <a class="btn btn-primary" href="/products/${p.id}">Ver detalhes</a>
          </div>
        </div>
      </div>
    `).join("");
  } catch (error) {
    mensagem.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
}

window.addEventListener("DOMContentLoaded", carregarProdutos);
