const produtos = [
  { sku: "WF-08421", categoria: "Smartphones", selo: "LANÇAMENTO", nome: "Smartphone Pro Titanium 256GB - Cinza Espacial", nota: "4.8", de: 4399, preco: 3499, parcelas: 10 },
  { sku: "WF-77210", categoria: "Notebooks", selo: "-25% OFF", nome: "Ultrabook Core i7 16GB SSD 512GB 14\" Full HD", nota: "5.0", de: 5199, preco: 3899, parcelas: 10 },
  { sku: "WF-41092", categoria: "Áudio", selo: "OFERTA", nome: "Fone de Ouvido Noise Cancelling Bluetooth 5.3", nota: "4.7", de: 899, preco: 649, parcelas: 6 },
  { sku: "WF-62388", categoria: "Smartwatches", selo: "NOVO", nome: "Smartwatch Sport GPS Sensor Cardíaco Black", nota: "4.9", de: 1299, preco: 989, parcelas: 10 },
  { sku: "WF-30517", categoria: "Monitores", selo: "OFERTA", nome: "Monitor Gamer 27\" 165Hz QHD IPS", nota: "4.8", de: 2199, preco: 1699, parcelas: 10 },
  { sku: "WF-55803", categoria: "Acessórios", selo: "NOVO", nome: "Teclado Mecânico Sem Fio Switch Silencioso", nota: "4.6", de: 599, preco: 449, parcelas: 5 }
];

const departamentos = [
  { nome: "Smartphones", qtd: 124 },
  { nome: "Notebooks", qtd: 86 },
  { nome: "Áudio & Fones", qtd: 92, filtro: "Áudio" },
  { nome: "Smartwatches", qtd: 45 },
  { nome: "Monitores", qtd: 38 },
  { nome: "Acessórios Tech", qtd: 156, filtro: "Acessórios" }
];

const lista = document.getElementById("produtos");
const contador = document.getElementById("contador");
const total = document.getElementById("total");
const categoria = document.getElementById("categoria");
const campoBusca = document.getElementById("campoBusca");
const departamentosGrade = document.getElementById("departamentosGrade");

const estado = { itens: 2, soma: 3499, termo: "", categoria: "" };
const favoritos = new Set();

const moeda = valor => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function desenharDepartamentos() {
  departamentosGrade.innerHTML = departamentos.map(d => `
    <a href="#destaques" class="departamento" data-filtro="${d.filtro || d.nome}">
      <svg><use href="#i-focus"/></svg>
      <strong>${d.nome}</strong>
      <span>${d.qtd} produtos</span>
    </a>
  `).join("");
}

function atualizarCarrinho() {
  contador.textContent = estado.itens;
  total.textContent = moeda(estado.soma);
}

function desenharProdutos() {
  const termo = estado.termo.trim().toLowerCase();
  const filtrados = produtos.filter(p => {
    const daCategoria = !estado.categoria || p.categoria === estado.categoria;
    return daCategoria && p.nome.toLowerCase().includes(termo);
  });

  if (!filtrados.length) {
    lista.innerHTML = '<p class="vazio">Nenhum produto encontrado.</p>';
    return;
  }

  lista.innerHTML = filtrados.map(p => `
    <article class="produto">
      <div class="produto-imagem">
        <span class="selo">${p.selo}</span>
        <button class="favorito${favoritos.has(p.sku) ? " ativo" : ""}" data-fav="${p.sku}" aria-label="Favoritar" aria-pressed="${favoritos.has(p.sku)}"><svg><use href="#i-heart"/></svg></button>
        <i></i>
      </div>
      <div class="sku">SKU: #${p.sku}</div>
      <h3>${p.nome}</h3>
      <div class="estrelas"><b>★★★★★</b> (${p.nota})</div>
      <div class="de">De: ${moeda(p.de)}</div>
      <div class="preco">${moeda(p.preco)}</div>
      <div class="parcela">${p.parcelas}x de ${moeda(p.preco / p.parcelas)} s/ juros</div>
      <button class="adicionar" data-preco="${p.preco}"><svg><use href="#i-cart"/></svg><span>Adicionar ao carrinho</span></button>
    </article>
  `).join("");
}

lista.addEventListener("click", e => {
  const fav = e.target.closest(".favorito");
  if (fav) {
    const sku = fav.dataset.fav;
    favoritos.has(sku) ? favoritos.delete(sku) : favoritos.add(sku);
    const ativo = fav.classList.toggle("ativo");
    fav.setAttribute("aria-pressed", ativo);
    return;
  }

  const add = e.target.closest(".adicionar");
  if (add) {
    estado.itens += 1;
    estado.soma += Number(add.dataset.preco);
    atualizarCarrinho();
    const rotulo = add.querySelector("span");
    rotulo.textContent = "Adicionado";
    setTimeout(() => { rotulo.textContent = "Adicionar ao carrinho"; }, 1200);
  }
});

function rolar(direcao) {
  const card = lista.querySelector(".produto");
  if (!card) return;
  lista.scrollBy({ left: direcao * (card.offsetWidth + 16), behavior: "smooth" });
}

document.getElementById("anterior").addEventListener("click", () => rolar(-1));
document.getElementById("proximo").addEventListener("click", () => rolar(1));

departamentosGrade.addEventListener("click", e => {
  const item = e.target.closest(".departamento");
  if (!item) return;
  estado.categoria = item.dataset.filtro;
  categoria.value = estado.categoria;
  desenharProdutos();
});

categoria.addEventListener("change", () => {
  estado.categoria = categoria.value;
  desenharProdutos();
});

document.getElementById("formBusca").addEventListener("submit", e => {
  e.preventDefault();
  estado.termo = campoBusca.value;
  estado.categoria = categoria.value;
  desenharProdutos();
  document.getElementById("destaques").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("formNews").addEventListener("submit", e => {
  e.preventDefault();
  const campo = document.getElementById("emailNews");
  const msg = document.getElementById("mensagem");
  const valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campo.value);
  msg.style.color = valido ? "#4ade80" : "#f87171";
  msg.textContent = valido ? "Cadastro realizado. Você receberá nossas ofertas." : "Digite um e-mail válido, como nome@email.com.";
  if (valido) campo.value = "";
});

desenharDepartamentos();
desenharProdutos();
atualizarCarrinho();