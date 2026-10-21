const produtos = [
  { id: 1, categoria: "Smartphones", selo: "Lançamento", nome: "Smartphone Pro Titanium 256GB", nota: "4.8", de: 4399, preco: 3499, parcelas: 10 },
  { id: 2, categoria: "Notebooks", selo: "-25% OFF", nome: "Ultrabook Core i7 16GB SSD 512GB 14\"", nota: "5.0", de: 5199, preco: 3899, parcelas: 10 },
  { id: 3, categoria: "Áudio", selo: "Oferta", nome: "Fone Noise Cancelling Bluetooth 5.3", nota: "4.7", de: 899, preco: 649, parcelas: 6 },
  { id: 4, categoria: "Smartwatches", selo: "Novo", nome: "Smartwatch Sport GPS Cardíaco", nota: "4.9", de: 1299, preco: 989, parcelas: 10 },
  { id: 5, categoria: "Monitores", selo: "Oferta", nome: "Monitor Gamer 27\" 165Hz QHD IPS", nota: "4.8", de: 2199, preco: 1699, parcelas: 10 },
  { id: 6, categoria: "Acessórios", selo: "Novo", nome: "Teclado Mecânico Sem Fio Silencioso", nota: "4.6", de: 599, preco: 449, parcelas: 5 },
  { id: 7, categoria: "Áudio", selo: "Oferta", nome: "Caixa Acústica Hi-Fi Portátil", nota: "4.7", de: 799, preco: 589, parcelas: 6 },
  { id: 8, categoria: "Notebooks", selo: "Novo", nome: "Notebook Slim 15\" Ryzen 7 16GB", nota: "4.5", de: 4299, preco: 3299, parcelas: 10 }
];

const categorias = ["Todos", "Smartphones", "Notebooks", "Áudio", "Smartwatches", "Monitores", "Acessórios"];

const grade = document.getElementById("grade");
const chips = document.getElementById("chips");
const resultado = document.getElementById("resultado");
const contador = document.getElementById("contador");
const campoBusca = document.getElementById("campoBusca");

const estado = { categoria: "Todos", termo: "", itens: 0 };
const favoritos = new Set();

const moeda = valor => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function desenharChips() {
  chips.innerHTML = categorias.map(nome => {
    const qtd = nome === "Todos" ? produtos.length : produtos.filter(p => p.categoria === nome).length;
    const ativo = nome === estado.categoria ? " ativo" : "";
    return `<button class="chip${ativo}" data-categoria="${nome}">${nome}<small>${qtd}</small></button>`;
  }).join("");
}

function desenharProdutos() {
  const termo = estado.termo.trim().toLowerCase();
  const lista = produtos.filter(p => {
    const daCategoria = estado.categoria === "Todos" || p.categoria === estado.categoria;
    const daBusca = p.nome.toLowerCase().includes(termo);
    return daCategoria && daBusca;
  });

  resultado.textContent = `${lista.length} ${lista.length === 1 ? "produto" : "produtos"}`;

  if (!lista.length) {
    grade.innerHTML = '<p class="vazio">Nenhum produto encontrado. Tente outra busca ou categoria.</p>';
    return;
  }

  grade.innerHTML = lista.map(p => `
    <article class="produto">
      <div class="produto-img">
        <span class="selo">${p.selo}</span>
        <button class="fav${favoritos.has(p.id) ? " ativo" : ""}" data-fav="${p.id}" aria-label="Favoritar ${p.nome}">♥</button>
        <i></i>
      </div>
      <h3>${p.nome}</h3>
      <div class="nota"><b>★</b> ${p.nota}</div>
      <div class="de">${moeda(p.de)}</div>
      <div class="preco">${moeda(p.preco)}</div>
      <div class="parcela">${p.parcelas}x de ${moeda(p.preco / p.parcelas)} sem juros</div>
      <button class="add" data-add="${p.id}">Adicionar ao carrinho</button>
    </article>
  `).join("");
}

chips.addEventListener("click", e => {
  const botao = e.target.closest(".chip");
  if (!botao) return;
  estado.categoria = botao.dataset.categoria;
  desenharChips();
  desenharProdutos();
});

grade.addEventListener("click", e => {
  const fav = e.target.closest("[data-fav]");
  if (fav) {
    const id = Number(fav.dataset.fav);
    favoritos.has(id) ? favoritos.delete(id) : favoritos.add(id);
    fav.classList.toggle("ativo");
    return;
  }

  const add = e.target.closest("[data-add]");
  if (add) {
    estado.itens += 1;
    contador.textContent = estado.itens;
    add.textContent = "Adicionado";
    setTimeout(() => { add.textContent = "Adicionar ao carrinho"; }, 1200);
  }
});

document.getElementById("formBusca").addEventListener("submit", e => {
  e.preventDefault();
  estado.termo = campoBusca.value;
  desenharProdutos();
  document.getElementById("vitrine").scrollIntoView();
});

campoBusca.addEventListener("input", () => {
  estado.termo = campoBusca.value;
  desenharProdutos();
});

document.getElementById("formNews").addEventListener("submit", e => {
  e.preventDefault();
  const campo = document.getElementById("emailNews");
  const msg = document.getElementById("msg");
  const valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campo.value);
  msg.style.color = valido ? "#15803d" : "#b91c1c";
  msg.textContent = valido ? "Cadastro feito. Em breve você recebe nossas ofertas." : "Digite um e-mail válido, como nome@email.com.";
  if (valido) campo.value = "";
});

desenharChips();
desenharProdutos();