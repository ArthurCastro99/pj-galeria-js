const galeria = document.getElementById("galeria");
const botaoLimpar = document.getElementById("limpar");
const botaoRecarregar = document.getElementById("recarregar");
const buscarUsuario = document.getElementById("buscar");

let usuarios = [];

fetch("https://jsonplaceholder.typicode.com/users")
  .then((res) => res.json())
  .then((data) => {
    usuarios = data;

    const termoSalvo = localStorage.getItem("termoBusca");
    if (termoSalvo) {
      buscarUsuario.value = termoSalvo;
      const filtrados = usuarios.filter((user) =>
        user.name.toLowerCase().includes(termoSalvo)
      );
      mostrarUsuarios(filtrados);
    } else {
      mostrarUsuarios(usuarios);
    }
  });

function mostrarUsuarios(lista) {
  galeria.innerHTML = "";
  if (lista.length === 0) {
    galeria.innerHTML = "<p>Nenhum usuário encontrado</p>";
    return;
  }

  lista.forEach((user) => {
    let card = document.createElement("section");

    card.classList.add("card");

    card.innerHTML = `
      <h2>${user.name}</h2>
      <p><strong>Email:</strong>${user.email}</p>
      <p><strong>Cidade:</strong>${user.address.city}</p>
      <button class="detalhes">Ver detalhes</button>  <button class="favoritar">Favoritar</button>
      <div  class="extra" style="display: none;">
      <p><strong>Telefone:</strong> ${user.phone}</p>
      <p><strong>Empresa:</strong> ${user.company.name}</p>
      </div>
      `;

    card.querySelector(".detalhes").addEventListener("click", () => {
      const extra = card.querySelector(".extra");
      const estaAberto = extra.style.display === "block";

      extra.style.display = estaAberto ? "none" : "block";
      let abertos = JSON.parse(localStorage.getItem("detalhesAbertos") || "[]");
      if (!estaAberto) {
        abertos.push(user.id);
      } else {
        abertos = abertos.filter((id) => id !== user.id);
      }

      localStorage.setItem("detalhesAbertos", JSON.stringify(abertos));
    });

    galeria.appendChild(card);

    let abertos = JSON.parse(localStorage.getItem("detalhesAbertos") || "[]");
    console.log(abertos);
    if (abertos.includes(user.id)) {
      card.querySelector(".extra").style.display = "block";
    }
    let favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");

    if (favoritos.includes(user.id)) {
      card.classList.add("favorito");
    }

    card.querySelector(".favoritar").addEventListener("click", () => {
      let favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");
      if (favoritos.includes(user.id)) {
        favoritos = favoritos.filter((id) => id !== user.id);
        card.classList.remove("favorito");
      } else {
        favoritos.push(user.id);
        card.classList.add("favorito");
      }
      localStorage.setItem("favoritos", JSON.stringify(favoritos));
    });
  });
}
let mostrandoFavoritos = false;

document.getElementById("toggleFavoritos").addEventListener("click", () => {
  mostrandoFavoritos = !mostrandoFavoritos;

  const favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");
  if (mostrandoFavoritos) {
    const filtrados = usuarios.filter((user) => favoritos.includes(user.id));
    mostrarUsuarios(filtrados);
    toggleFavoritos.textContent = "Mostrar todos";
  } else {
    mostrarUsuarios(usuarios);
    toggleFavoritos.textContent = "Mostrar favoritos";
  }
});

buscarUsuario.addEventListener("input", () => {
  const termo = buscarUsuario.value.trim().toLowerCase();

  localStorage.setItem("termoBusca", termo); // salva o termo

  const filtrados = usuarios.filter((user) =>
    user.name.toLowerCase().includes(termo)
  );
  mostrarUsuarios(filtrados);
  let historico = JSON.parse(localStorage.getItem("historicoBuscas") || "[]");

  if (!historico.includes(termo)) {
    historico.unshift(termo); // adiciona no início
    historico = historico.slice(0, 5);
    localStorage.setItem("historicoBuscas", JSON.stringify(historico));
  }
  const sugestoes = document.getElementById("sugestoes");
  sugestoes.innerHTML = "";

  historico.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    li.addEventListener("click", () => {
      buscarUsuario.value = item;
      // opcional: disparar a busca
      const filtrados = usuarios.filter((user) =>
        user.name.toLowerCase().includes(item.toLowerCase())
      );
      mostrarUsuarios(filtrados);
    });
    sugestoes.appendChild(li);
  });

  document.getElementById("limparHistorico").addEventListener("click", () => {
    localStorage.removeItem("historicoBuscas");
    document.getElementById("sugestoes").innerHTML = "";
  });

  if (termo === "") {
    sugestoes.innerHTML = "";
    return;
  }
});

botaoLimpar.addEventListener("click", () => {
  galeria.innerHTML = "";
});

botaoRecarregar.addEventListener("click", () => {
  fetch("https://jsonplaceholder.typicode.com/users")
    .then((res) => res.json())
    .then((data) => {
      usuarios = data;
      mostrarUsuarios(usuarios);
      buscarUsuario.value = "";
    });
});

document.getElementById("exportarFavoritos").addEventListener("click", () => {
  const favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");
  const dadosFavoritos = usuarios.filter((user) => favoritos.includes(user.id));
  const json = JSON.stringify(dadosFavoritos, null, 2);

  document.getElementById("saidaExportacao").textContent = json;
});

document.getElementById("copiarJSON").addEventListener("click", () => {
  const texto = document.getElementById("saidaExportacao").textContent;
  navigator.clipboard.writeText(texto).then(() => {
    alert("JSON copiado para a aréa de trasnferência!");
  });
});

const botaoTema = document.getElementById("toggleTema");

if (localStorage.getItem("tema") === "escuro") {
  document.body.classList.add("escuro");
}

botaoTema.addEventListener("click", () => {
  document.body.classList.toggle("escuro");

  const temaAtual = document.body.classList.contains("escuro")
    ? "escuro"
    : "claro";
  localStorage.setItem("tema", temaAtual);
});
console.log(botaoTema);
