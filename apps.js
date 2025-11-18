// ---------------------
// Lista de productos
// ---------------------
const products = [
  { id: 1, name: "Monstera Deliciosa", price: 14990, img: "img/monstera.jpg", desc: "Planta tropical de hojas grandes." },
  { id: 2, name: "Suculenta Jade", price: 4990, img: "img/jade.jpg", desc: "Fácil de cuidar, ideal para interiores." },
  { id: 3, name: "Helecho Nephrolepis", price: 7990, img: "img/helecho.jpg", desc: "Elegante y purificadora del aire." }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ---------------------
// Render Home
// ---------------------
const productList = document.getElementById("product-list");

if (productList) {
  products.forEach(p => {
    productList.innerHTML += `
      <div class="col-12 col-md-4 mb-4">
        <div class="card shadow">
          <img src="${p.img}" class="card-img-top" alt="${p.name}">
          <div class="card-body">
            <h5 class="card-title">${p.name}</h5>
            <p class="card-text">$${p.price}</p>
            <a href="detalle.html?id=${p.id}" class="btn btn-outline-success mb-2 w-100">Ver más</a>
            <button class="btn btn-success w-100" onclick="addToCart(${p.id})">Agregar</button>
          </div>
        </div>
      </div>
    `;
  });
}

// ---------------------
// Detalle de producto
// ---------------------
const detailContainer = document.getElementById("detail-container");

if (detailContainer) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const product = products.find(p => p.id == id);

  detailContainer.innerHTML = `
    <div class="row">
      <div class="col-md-6">
        <img src="${product.img}" class="img-fluid rounded shadow">
      </div>
      <div class="col-md-6">
        <h2>${product.name}</h2>
        <p>${product.desc}</p>
        <h4 class="text-success">$${product.price}</h4>
        <button class="btn btn-success mt-3" onclick="addToCart(${product.id})">Agregar al carrito</button>
      </div>
    </div>
  `;
}

// ---------------------
// Carrito
// ---------------------
const cartItems = document.getElementById("cart-items");

function addToCart(id) {
  cart.push(id);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const badge = document.getElementById("cart-count");
  if (badge) badge.innerText = cart.length;
}

updateCartCount();

if (cartItems) {
  cartItems.innerHTML = cart.map(id => {
    const p = products.find(x => x.id === id);
    return `<li class="list-group-item d-flex justify-content-between">
              ${p.name}
              <span>$${p.price}</span>
            </li>`;
  }).join("");
}
