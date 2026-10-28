const container = document.getElementById("container-produtos");
const mensagem = document.getElementById("mensagem");
const formularioArea = document.getElementById("formulario-area");
const formulario = document.getElementById("form-produto");
const tituloFormulario = document.getElementById("formulario-titulo");
const botaoSalvar = document.getElementById("btn-salvar");

const campoId = document.getElementById("produto-id");
const campoNome = document.getElementById("nome");
const campoPreco = document.getElementById("preco");
const campoEstoque = document.getElementById("estoque");
const campoCategoria = document.getElementById("id_categoria");
const campoFornecedor = document.getElementById("id_fornecedor");

function mostrarMensagem(texto, tipo = "success") {
  mensagem.replaceChildren();

  const alerta = document.createElement("div");
  alerta.className = `alert alert-${tipo}`;
  alerta.textContent = texto;
  mensagem.appendChild(alerta);
}

async function requisicao(url, opcoes = {}) {
  const resposta = await fetch(url, {
    ...opcoes,
    headers: {
      ...(opcoes.body ? { "Content-Type": "application/json" } : {}),
      ...opcoes.headers,
    },
  });

  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    throw new Error(dados.message || "Não foi possível concluir a operação.");
  }

  return dados;
}

async function carregarOpcoes(url, campo, id, nome, titulo) {
  try {
    const dados = await requisicao(url);

    campo.replaceChildren(new Option(`Selecione ${titulo}`, ""));

    dados.forEach((item) => {
      campo.add(new Option(item[nome], item[id]));
    });
  } catch (erro) {
    campo.replaceChildren(new Option("Erro ao carregar opções", ""));
    console.error(erro);
  }
}

async function carregarProdutos() {
  container.replaceChildren();

  try {
    const dados = await requisicao("/api/products");
    const produtos = dados.productsList || [];

    if (produtos.length === 0) {
      const aviso = document.createElement("p");
      aviso.className = "text-secondary";
      aviso.textContent = "Nenhum produto encontrado.";
      container.appendChild(aviso);
      return;
    }

    produtos.forEach((produto) => {
      const coluna = document.createElement("div");
      coluna.className = "col-12 col-md-6 col-lg-4";

      const card = document.createElement("div");
      card.className = "card h-100 shadow-sm";

      const corpo = document.createElement("div");
      corpo.className = "card-body d-flex flex-column";

      const nome = document.createElement("h3");
      nome.className = "card-title h5";
      nome.textContent = produto.nome;

      const categoria = document.createElement("p");
      categoria.textContent = `Categoria: ${produto.categoria}`;

      const fornecedor = document.createElement("p");
      fornecedor.textContent = `Fornecedor: ${produto.fornecedor}`;

      const estoque = document.createElement("p");
      estoque.textContent = `Estoque: ${produto.estoque}`;

      const preco = document.createElement("p");
      preco.className = "fw-bold";
      preco.textContent = `Preço: ${Number(produto.preco).toLocaleString(
        "pt-BR",
        { style: "currency", currency: "BRL" },
      )}`;

      const botoes = document.createElement("div");
      botoes.className = "d-flex flex-wrap gap-2 mt-auto";

      const detalhes = document.createElement("a");
      detalhes.className = "btn btn-outline-primary";
      detalhes.href = `/products/${produto.id}`;
      detalhes.textContent = "Ver detalhes";

      const editar = document.createElement("button");
      editar.type = "button";
      editar.className = "btn btn-primary";
      editar.textContent = "Editar";
      editar.addEventListener("click", () => editarProduto(produto.id));

      const excluir = document.createElement("button");
      excluir.type = "button";
      excluir.className = "btn btn-danger";
      excluir.textContent = "Excluir";
      excluir.addEventListener("click", () => excluirProduto(produto.id));

      botoes.append(detalhes, editar, excluir);
      corpo.append(nome, categoria, fornecedor, estoque, preco, botoes);
      card.appendChild(corpo);
      coluna.appendChild(card);
      container.appendChild(coluna);
    });
  } catch (erro) {
    mostrarMensagem(erro.message, "danger");
  }
}

function abrirFormulario() {
  formularioArea.hidden = false;
  formularioArea.scrollIntoView({ behavior: "smooth", block: "start" });
}

function limparFormulario() {
  formulario.reset();
  campoId.value = "";
  tituloFormulario.textContent = "Adicionar produto";
  botaoSalvar.textContent = "Salvar produto";
}

document.getElementById("btn-adicionar").addEventListener("click", () => {
  limparFormulario();
  abrirFormulario();
});

document.getElementById("btn-cancelar").addEventListener("click", () => {
  formularioArea.hidden = true;
  limparFormulario();
});

async function editarProduto(id) {
  try {
    const produto = await requisicao(`/api/products/${id}`);

    limparFormulario();
    campoId.value = produto.id;
    campoNome.value = produto.nome;
    campoPreco.value = produto.preco;
    campoEstoque.value = produto.estoque;
    campoCategoria.value = produto.id_categoria;
    campoFornecedor.value = produto.id_fornecedor;

    tituloFormulario.textContent = "Editar produto";
    botaoSalvar.textContent = "Salvar alterações";
    abrirFormulario();
  } catch (erro) {
    mostrarMensagem(erro.message, "danger");
  }
}

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const id = campoId.value;

  const produto = {
    nome: campoNome.value.trim(),
    preco: Number(campoPreco.value),
    estoque: Number(campoEstoque.value),
    id_categoria: Number(campoCategoria.value),
    id_fornecedor: Number(campoFornecedor.value),
  };

  if (
    !produto.nome ||
    campoPreco.value === "" ||
    campoEstoque.value === "" ||
    !produto.id_categoria ||
    !produto.id_fornecedor ||
    !Number.isFinite(produto.preco) ||
    !Number.isInteger(produto.estoque) ||
    produto.preco < 0 ||
    produto.estoque < 0
  ) {
    mostrarMensagem("Preencha todos os campos com valores válidos.", "warning");
    return;
  }

  botaoSalvar.disabled = true;
  botaoSalvar.textContent = "Salvando...";

  try {
    if (id) {
      await requisicao(`/api/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(produto),
      });
      mostrarMensagem("Produto atualizado com sucesso!");
    } else {
      await requisicao("/api/products", {
        method: "POST",
        body: JSON.stringify(produto),
      });
      mostrarMensagem("Produto cadastrado com sucesso!");
    }

    formularioArea.hidden = true;
    limparFormulario();
    await carregarProdutos();
  } catch (erro) {
    mostrarMensagem(erro.message, "danger");
  } finally {
    botaoSalvar.disabled = false;
    botaoSalvar.textContent = campoId.value
      ? "Salvar alterações"
      : "Salvar produto";
  }
});

async function excluirProduto(id) {
  if (!confirm("Deseja realmente excluir este produto?")) {
    return;
  }

  try {
    await requisicao(`/api/products/${id}`, {
      method: "DELETE",
    });

    mostrarMensagem("Produto excluído com sucesso!");
    await carregarProdutos();
  } catch (erro) {
    mostrarMensagem(erro.message, "danger");
  }
}

async function iniciarPagina() {
  await Promise.all([
    carregarOpcoes(
      "/api/categorias",
      campoCategoria,
      "id_categoria",
      "nome",
      "uma categoria",
    ),
    carregarOpcoes(
      "/api/fornecedores",
      campoFornecedor,
      "id_fornecedor",
      "nome",
      "um fornecedor",
    ),
  ]);

  await carregarProdutos();
}

window.addEventListener("DOMContentLoaded", iniciarPagina);
