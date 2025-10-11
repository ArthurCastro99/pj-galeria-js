const galeria = document.getElementById("galeria");
const botaoLimpar = document.getElementById("limpar");
const botaoRecarregar = document.getElementById("recarregar");
const buscarUsuario = document.getElementById("buscar");

let usuarios = [];

fetch("https://jsonplaceholder.typicode.com/users")
  .then((res) => res.json())
  .then((data) => {
    usuarios = data;
    mostrarUsuarios(usuarios);
  });
function mostrarUsuarios(lista) {
  galeria.innerHTML = "";
  lista.forEach((user) => {
    const card = document.createElement("section");
    card.classList.add("card");
    card.innerHTML = `
      <h2>${user.name}</h2>
      <p><strong>Email:</strong>${user.email}</p>
      <p><strong>Cidade:</strong>${user.address.city}</p>
      <button class="detalhes">Ver detalhes</button>
      <div  class="extra" style="display: none;">
      <p><strong>Telefone:</strong> ${user.phone}</p>
      <p><strong>Empresa:</strong> ${user.company.name}</p>
      </div>
      `;
    card.querySelector(".detalhes").addEventListener("click", () => {
      const extra = card.querySelector(".extra");
      extra.style.display = extra.style.display === "none" ? "block" : "none";
    });
    galeria.appendChild(card);
    if (lista.length === 0) {
      galeria.innerHTML = "<p>Nenhum usuário encontrado</p>";
      return;
    }
  });
}

buscarUsuario.addEventListener("input", () => {
  const termo = buscarUsuario.value.toLowerCase();
  const filtrados = usuarios.filter((user) =>
    user.name.toLowerCase().includes(termo)
  );

  mostrarUsuarios(filtrados);
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
