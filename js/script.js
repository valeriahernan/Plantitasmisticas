/* ================================================================
   PRODUCTOS DISPONIBLES FLORECITAS
================================================================ */

const PRODUCTS = [
  { id: 1, title: "Cerezo Místico", price: 12000, image: "img/flor1.jpg", description: "Una flor que ilumina tus sueños." },
  { id: 2, title: "Clavel Lunar", price: 15000, image: "img/flor2.jpg", description: "Una flor que brilla en noches frías." },
  { id: 3, title: "Orquídea Solar", price: 18000, image: "img/flor3.jpg", description: "Captura la energía del sol." },
  { id: 4, title: "Rosa Nebular", price: 22000, image: "img/flor4.jpg", description: "Una rosa creada por las estrellas." }
];

/* ================================================================
   CARRITO
================================================================ */

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(productId) {
  const cart = getCart();
  const existingProduct = cart.find(p => p.id === productId);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart(cart);
  updateCartBadge();
  showAddedPopup();
}

function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = totalItems;
}

/* ================================================================
   POPUP "AGREGADO AL CARRITO"
================================================================ */

function initCheckoutPopup() {
  const popup = document.getElementById("popup-checkout");
  if (!popup) return;

  popup.style.display = "none";
}

function showAddedPopup() {
  const popup = document.getElementById("popup-checkout");
  if (!popup) return;

  popup.style.display = "block";
  setTimeout(() => {
    popup.style.display = "none";
  }, 2000);
}

/* ================================================================
   GRID DE PRODUCTOS (index)
================================================================ */

function renderProductsGrid(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  PRODUCTS.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("col-md-3", "text-center", "product-card");

    card.innerHTML = `
      <div class="card p-3 shadow-sm">
        <img src="${product.image}" alt="${product.title}">
        <h5 class="mt-2">${product.title}</h5>
        <p class="text-muted">$${product.price.toLocaleString()}</p>
        <button class="btn btn-primary btn-sm ver-mas" data-id="${product.id}">Ver más</button>
        <button class="btn btn-success btn-sm mt-2 agregar" data-id="${product.id}">Agregar</button>
      </div>
    `;

    container.appendChild(card);
  });

  // Botones ver más
  document.querySelectorAll(".ver-mas").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = parseInt(e.target.dataset.id);
      window.location.href = `detail.html?id=${id}`;
    });
  });

  // Botones agregar al carrito
  document.querySelectorAll(".agregar").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = parseInt(e.target.dataset.id);
      addToCart(id);
    });
  });
}

/* ================================================================
   DETALLE DE PRODUCTO (detail)
================================================================ */

function renderProductDetail(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const product = PRODUCTS.find(p => p.id === id);

  if (!product) {
    container.innerHTML = "<p>Producto no encontrado.</p>";
    return;
  }

  container.innerHTML = `
    <div class="card p-4 shadow-sm">
      <img src="${product.image}" alt="${product.title}">
      <h2 class="mt-3">${product.title}</h2>
      <p class="text-muted">$${product.price.toLocaleString()}</p>
      <p>${product.description}</p>
      <button id="btn-add" class="btn btn-success btn-lg mt-3">Agregar al carrito</button>
    </div>
  `;

  document.getElementById("btn-add").addEventListener("click", () => {
    addToCart(product.id);
  });
}

/* ================================================================
   INIT GLOBAL — FUNCIONA EN INDEX Y DETAIL
================================================================ */

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  initCheckoutPopup();

  if (document.getElementById("productos-grid")) {
    renderProductsGrid("productos-grid");
  }

  if (document.getElementById("detalle-producto")) {
    renderProductDetail("detalle-producto");
  }
});
