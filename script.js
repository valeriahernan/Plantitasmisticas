/* script.js
  - Array de productos (8 items). Ajusta file names en `image` si cambias nombres.
  - Funciones:
    - renderProductsGrid(containerId)
    - addToCart(productId)
    - updateCartBadge()
    - renderProductDetail(containerId)
    - renderCart(listContainerId, actionsContainerId)
*/

const PRODUCTS = [
  { id: 1, title: "Flor Astral", price: 12000, image: "img/flor1.jpg", description: "Una flor que ilumina tus sueños." },
  { id: 2, title: "Loto Lunar", price: 15000, image: "img/flor2.jpg", description: "Calma la mente y abre la intuición." },
  { id: 3, title: "Rosa del Alba", price: 9000, image: "img/flor3.jpg", description: "Energía suave y reconfortante." },
  { id: 4, title: "Orquídea Cósmica", price: 18000, image: "img/flor4.jpg", description: "Exótica y poderosa para rituales." },
  { id: 5, title: "Jazmín Solar", price: 8000, image: "img/flor5.jpg", description: "Aumenta la alegría y la creatividad." },
  { id: 6, title: "Campanilla Verde", price: 7000, image: "img/flor6.jpg", description: "Pequeña pero llena de energía." },
  { id: 7, title: "Hiedra Bendita", price: 6000, image: "img/flor7.jpg", description: "Protección y conexión a la tierra." },
  { id: 8, title: "Tulipán Etéreo", price: 11000, image: "img/flor8.jpg", description: "Elegante y etéreo." }
];

// --- Utility: CART stored in localStorage under 'pm_cart' (array of {id, qty})
function getCart() {
  try {
    return JSON.parse(localStorage.getItem('pm_cart')) || [];
  } catch {
    return [];
  }
}
function saveCart(cart) {
  localStorage.setItem('pm_cart', JSON.stringify(cart));
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const total = getCart().reduce((s, item) => s + item.qty, 0);
  badge.textContent = total;
}

// --- Add product to cart (increment if exists)
function addToCart(productId, qty = 1) {
  const cart = getCart();
  const found = cart.find(i => i.id === productId);
  if (found) found.qty += qty;
  else cart.push({ id: productId, qty });
  saveCart(cart);
  updateCartBadge();
  // feedback simple
  const name = PRODUCTS.find(p => p.id === productId)?.title || 'Producto';
  alert(`${name} agregado al carrito`);
}

// --- Render grid of product cards (Bootstrap cards)
function renderProductsGrid(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  PRODUCTS.forEach(product => {
    const col = document.createElement('div');
    col.className = 'col-6 col-md-4 col-lg-3';

    col.innerHTML = `
      <article class="card h-100">
        <img src="${product.image}" class="card-img-top" alt="${product.title}">
        <div class="card-body d-flex flex-column">
          <h3 class="card-title h6 mb-2">${product.title}</h3>
          <p class="card-text text-muted mb-2">${(product.price).toLocaleString()} CLP</p>
          <div class="mt-auto d-flex gap-2">
            <a href="detail.html?id=${product.id}" class="btn btn-sm btn-outline-primary">Ver más</a>
            <button class="btn btn-sm btn-success" data-add="${product.id}">Agregar</button>
          </div>
        </div>
      </article>
    `;

    container.appendChild(col);
  });

  // Delegation: escucha botones "Agregar"
  container.querySelectorAll('button[data-add]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(e.currentTarget.getAttribute('data-add'));
      addToCart(id, 1);
    });
  });
}

// --- Render detail page based on URL ?id=#
function getQueryParam(name) {
  return new URLSearchParams(location.search).get(name);
}

function renderProductDetail(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const id = Number(getQueryParam('id'));
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) {
    container.innerHTML = `<p class="text-muted">Producto no encontrado. <a href="index.html">Volver al inicio</a></p>`;
    return;
  }

  container.innerHTML = `
    <article class="row g-4 align-items-center">
      <div class="col-12 col-md-6">
        <img src="${product.image}" alt="${product.title}" class="img-fluid rounded">
      </div>
      <div class="col-12 col-md-6">
        <h2>${product.title}</h2>
        <p class="text-muted">${(product.price).toLocaleString()} CLP</p>
        <p>${product.description}</p>
        <div class="d-flex gap-2">
          <button id="btn-add" class="btn btn-success">Agregar al carrito</button>
          <a href="index.html" class="btn btn-outline-secondary">Volver</a>
        </div>
      </div>
    </article>
  `;

  document.getElementById('btn-add').addEventListener('click', () => {
    addToCart(product.id, 1);
  });
}

// --- Render cart page
function renderCart(listContainerId, actionsContainerId) {
  const list = document.getElementById(listContainerId);
  const actions = document.getElementById(actionsContainerId);
  if (!list || !actions) return;

  const cart = getCart();
  if (cart.length === 0) {
    list.innerHTML = `<p class="text-muted">Tu carrito está vacío. <a href="index.html">Ir a tienda</a></p>`;
    actions.innerHTML = '';
    return;
  }

  // Map cart to product info
  const rows = cart.map(item => {
    const prod = PRODUCTS.find(p => p.id === item.id) || {};
    const subtotal = (prod.price || 0) * item.qty;
    return `
      <div class="card mb-2">
        <div class="card-body d-flex align-items-center gap-3">
          <img src="${prod.image}" alt="${prod.title}" style="width:72px;height:72px;object-fit:cover;border-radius:6px;">
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="mb-1">${prod.title}</h6>
                <small class="text-muted">${(prod.price || 0).toLocaleString()} CLP</small>
              </div>
              <div>
                <div class="d-flex align-items-center gap-2">
                  <button class="btn btn-sm btn-outline-secondary" data-decrease="${item.id}">-</button>
                  <span>${item.qty}</span>
                  <button class="btn btn-sm btn-outline-secondary" data-increase="${item.id}">+</button>
                </div>
                <div class="mt-2 text-end"><strong>${subtotal.toLocaleString()} CLP</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  list.innerHTML = rows;

  // Actions (total + botones)
  const total = cart.reduce((s, item) => {
    const prod = PRODUCTS.find(p => p.id === item.id) || {};
    return s + (prod.price || 0) * item.qty;
  }, 0);

  actions.innerHTML = `
    <div class="d-flex justify-content-between align-items-center">
      <div><strong>Total:</strong> ${total.toLocaleString()} CLP</div>
      <div class="d-flex gap-2">
        <button id="btn-clear" class="btn btn-outline-danger btn-sm">Vaciar carrito</button>
        <button id="btn-checkout" class="btn btn-success btn-sm">Simular compra</button>
      </div>
    </div>
  `;

  // Event listeners for increase/decrease
  list.querySelectorAll('button[data-increase]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.getAttribute('data-increase'));
      const c = getCart();
      const it = c.find(x => x.id === id);
      if (it) it.qty += 1;
      saveCart(c);
      renderCart(listContainerId, actionsContainerId);
      updateCartBadge();
    });
  });

  list.querySelectorAll('button[data-decrease]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.getAttribute('data-decrease'));
      let c = getCart();
      const it = c.find(x => x.id === id);
      if (it) {
        it.qty -= 1;
        if (it.qty <= 0) c = c.filter(x => x.id !== id);
        saveCart(c);
        renderCart(listContainerId, actionsContainerId);
        updateCartBadge();
      }
    });
  });

  document.getElementById('btn-clear').addEventListener('click', () => {
    if (confirm('¿Vaciar carrito?')) {
      saveCart([]);
      renderCart(listContainerId, actionsContainerId);
      updateCartBadge();
    }
  });

  document.getElementById('btn-checkout').addEventListener('click', () => {
    alert('Compra simulada. Gracias por tu pedido :)');
    saveCart([]);
    renderCart(listContainerId, actionsContainerId);
    updateCartBadge();
  });
}
