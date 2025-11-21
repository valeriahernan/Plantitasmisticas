/* ================================================================
   PRODUCTOS DISPONIBLES FLORECITAS
================================================================ */

const PRODUCTS = [
  { id: 1, title: "Cerezo Místico", price: 12000, image: "img/flor1.jpg", description: "Una flor que ilumina tus sueños." },
  { id: 2, title: "Clavel Lunar", price: 15000, image: "img/flor2.jpg", description: "Calma la mente y abre la intuición." },
  { id: 3, title: "Girasol del Sol", price: 9000, image: "img/flor3.jpg", description: "Energía suave y reconfortante." },
  { id: 4, title: "Lírio Cósmico", price: 18000, image: "img/flor4.jpg", description: "Exótica y poderosa para rituales." },
  { id: 5, title: "Margarita Vibrante", price: 8000, image: "img/flor5.jpg", description: "Aumenta la alegría y la creatividad." },
  { id: 6, title: "Orquídea Mágica", price: 7000, image: "img/flor6.jpg", description: "Pequeña pero llena de energía." },
  { id: 7, title: "Rosa Bendita", price: 6000, image: "img/flor7.jpg", description: "Protección y conexión a la tierra." },
  { id: 8, title: "Tulipán Etéreo", price: 11000, image: "img/flor8.jpg", description: "Elegante y humilde." }
];

/* ================================================================
   LOCAL STORAGE
================================================================ */

function getCart() {
  try { return JSON.parse(localStorage.getItem("pm_cart")) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem("pm_cart", JSON.stringify(cart));
}

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;

  const total = getCart().reduce((s, i) => s + i.qty, 0);
  badge.textContent = total;
}

/* ================================================================
   AÑADIR AL CARRITO
================================================================ */

function addToCart(productId, qty = 1) {
  const cart = getCart();
  const found = cart.find(i => i.id === productId);

  if (found) found.qty += qty;
  else cart.push({ id: productId, qty });

  saveCart(cart);
  updateCartBadge();

  const name = PRODUCTS.find(p => p.id === productId)?.title || "Producto";
  showAddPopup(`${name} agregado al carrito`);
}

/* ================================================================
   GRID DE PRODUCTOS
================================================================ */

function renderProductsGrid(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  PRODUCTS.forEach(product => {
    const col = document.createElement("div");
    col.className = "col-6 col-md-4 col-lg-3";

    col.innerHTML = `
      <article class="card h-100">
        <img src="${product.image}" class="card-img-top" alt="${product.title}">
        <div class="card-body d-flex flex-column">
          <h3 class="card-title h6 mb-2">${product.title}</h3>
          <p class="card-text text-white mb-2">${product.price.toLocaleString()} CLP</p>

          <div class="mt-auto d-flex gap-2">
            <a href="detail.html?id=${product.id}" class="btn btn-sm btn-ver-mas">Ver más</a>
            <button class="btn btn-sm btn-agregar" data-add="${product.id}">Agregar</button>
          </div>
        </div>
      </article>
    `;

    container.appendChild(col);
  });

  container.querySelectorAll("[data-add]").forEach(btn => {
    btn.addEventListener("click", () => addToCart(Number(btn.dataset.add)));
  });
}

/* ================================================================
   DETALLE DEL PRODUCTO
================================================================ */

function getQueryParam(name) {
  return new URLSearchParams(location.search).get(name);
}

function renderProductDetail(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const id = Number(getQueryParam("id"));
  const product = PRODUCTS.find(p => p.id === id);

  if (!product) {
    container.innerHTML = `<p class="text-muted">Producto no encontrado. <a href="index.html">Volver</a></p>`;
    return;
  }

  container.innerHTML = `
    <article class="row g-4 align-items-center">
      <div class="col-md-6">
        <img src="${product.image}" alt="${product.title}" class="img-fluid rounded">
      </div>
      <div class="col-md-6">
        <h2>${product.title}</h2>
        <p class="text-muted">${product.price.toLocaleString()} CLP</p>
        <p>${product.description}</p>

        <div class="d-flex gap-2">
          <button id="btn-add" class="btn btn-agregar">Agregar al carrito</button>
          <a href="index.html" class="btn btn-ver-mas">Volver</a>
        </div>
      </div>
    </article>
  `;

  document.getElementById("btn-add").addEventListener("click", () => {
    addToCart(product.id);
  });
}

/* ================================================================
   CARRITO
================================================================ */

function renderCart(listId, actionsId) {
  const list = document.getElementById(listId);
  const actions = document.getElementById(actionsId);
  if (!list || !actions) return;

  const cart = getCart();

  if (cart.length === 0) {
    list.innerHTML = `<p class="text-muted">Tu carrito está vacío. <a href="index.html">Ir a tienda</a></p>`;
    actions.innerHTML = "";
    return;
  }

  list.innerHTML = cart.map(item => {
    const prod = PRODUCTS.find(p => p.id === item.id);
    const subtotal = prod.price * item.qty;

    return `
      <div class="card mb-2">
        <div class="card-body d-flex align-items-center gap-3">
          <img src="${prod.image}" style="width:72px;height:72px;object-fit:cover;border-radius:6px">
          <div class="flex-grow-1 d-flex justify-content-between">
            <div>
              <h6 class="mb-1">${prod.title}</h6>
              <small class="text-muted">${prod.price.toLocaleString()} CLP</small>
            </div>
            <div>
              <div class="d-flex align-items-center gap-2">
                <button class="btn btn-sm btn-outline-secondary" data-decrease="${item.id}">-</button>
                <span>${item.qty}</span>
                <button class="btn btn-sm btn-outline-secondary" data-increase="${item.id}">+</button>
              </div>
              <div class="mt-2 text-end">
                <strong>${subtotal.toLocaleString()} CLP</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");

  const total = cart.reduce((s, i) => {
    const p = PRODUCTS.find(prod => prod.id === i.id);
    return s + p.price * i.qty;
  }, 0);

  actions.innerHTML = `
    <div class="d-flex justify-content-between">
      <strong>Total: ${total.toLocaleString()} CLP</strong>
      <div class="d-flex gap-2">
        <button id="btn-clear" class="btn btn-outline-danger btn-sm">Vaciar</button>
        <button id="btn-checkout" class="btn btn-comprar btn-sm">Comprar</button>
      </div>
    </div>
  `;

  // Cambiar cantidad
  list.querySelectorAll("[data-increase]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.increase);
      const cart = getCart();
      const item = cart.find(x => x.id === id);
      item.qty++;
      saveCart(cart);
      renderCart(listId, actionsId);
      updateCartBadge();
    });
  });

  list.querySelectorAll("[data-decrease]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.decrease);
      let cart = getCart();
      const item = cart.find(x => x.id === id);
      item.qty--;
      if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
      saveCart(cart);
      renderCart(listId, actionsId);
      updateCartBadge();
    });
  });

  // Vaciar carrito
  document.getElementById("btn-clear").addEventListener("click", () => {
    if (confirm("¿Vaciar carrito?")) {
      saveCart([]);
      renderCart(listId, actionsId);
      updateCartBadge();
    }
  });

  // Comprar → abre popup
  document.getElementById("btn-checkout").addEventListener("click", () => {
    document.getElementById("popup-compra").style.display = "flex";
  });
}

/* ================================================================
   POPUP DE COMPRA
================================================================ */

function initCheckoutPopup() {
  const popup = document.getElementById("popup-compra");
  const close = document.querySelector(".popup-close");
  const ok = document.querySelector(".popup-ok");

  if (!popup) return;

  close?.addEventListener("click", () => popup.style.display = "none");
  ok?.addEventListener("click", () => {
    popup.style.display = "none";
    saveCart([]);        // limpia carrito
    updateCartBadge();
    location.href = "index.html"; // vuelve a tienda
  });
}

/* ================================================================
   POPUP DE AGREGADO
================================================================ */

function showAddPopup(message) {
  const popup = document.getElementById("popup-added");
  const text = document.getElementById("popup-text");

  if (!popup || !text) return;

  text.textContent = message;
  popup.classList.remove("hidden");

  setTimeout(() => popup.classList.add("hidden"), 2000);
}

/* ================================================================
   INIT
================================================================ */

document.addEventListener("DOMContentLoaded", () => {
  renderProductsGrid("productos-grid");
  updateCartBadge();
  initCheckoutPopup();
});
