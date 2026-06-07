/* ─── app.js · Al Toque Multiservicios ─── */

// ── DATOS DE PRODUCTOS ─────────────────────────────────────────────────────
const PRODUCTS = [
  // Mandados
  { id: 1,  cat: 'mandados',  emoji: '🛵', name: 'Mandado Express',      shop: 'Al Toque',        price: 1500 },
  { id: 2,  cat: 'mandados',  emoji: '📦', name: 'Paquete Pequeño',      shop: 'Al Toque',        price: 1500 },
  { id: 3,  cat: 'mandados',  emoji: '📋', name: 'Trámite Bancario',     shop: 'Al Toque',        price: 2000 },
  // Comida
  { id: 4,  cat: 'comida',    emoji: '🍗', name: 'Pollo Entero Local',   shop: 'Pollos del Pueblo', price: 4800 },
  { id: 5,  cat: 'comida',    emoji: '🍕', name: 'Pizza Familiar',       shop: 'Pizzería Local',  price: 6800 },
  { id: 6,  cat: 'comida',    emoji: '🍔', name: 'Casado Completo',      shop: 'Soda El Pueblo',  price: 3200 },
  { id: 7,  cat: 'comida',    emoji: '🌮', name: 'Tacos x3',             shop: 'Soda El Pueblo',  price: 2800 },
  // Supermercado
  { id: 8,  cat: 'super',     emoji: '🍚', name: 'Arroz 2 kg',           shop: 'Palí',            price: 2200 },
  { id: 9,  cat: 'super',     emoji: '🫘', name: 'Frijoles 900 g',       shop: 'Palí',            price: 1800 },
  { id: 10, cat: 'super',     emoji: '☕', name: 'Café Britt 250 g',     shop: 'Palí',            price: 3400 },
  { id: 11, cat: 'super',     emoji: '🥛', name: 'Leche Dos Pinos 1 L',  shop: 'Palí',            price: 1100 },
  { id: 12, cat: 'super',     emoji: '🍳', name: 'Aceite Palma 1 L',     shop: 'Palí',            price: 2100 },
  // Farmacia
  { id: 13, cat: 'farmacia',  emoji: '💊', name: 'Acetaminofén 500 mg',  shop: 'Farmacia Local',  price: 1200 },
  { id: 14, cat: 'farmacia',  emoji: '🩹', name: 'Curita / Gasas',       shop: 'Farmacia Local',  price: 800  },
  { id: 15, cat: 'farmacia',  emoji: '🌡️', name: 'Antigripal',           shop: 'Farmacia Local',  price: 2500 },
  // Ferretería
  { id: 16, cat: 'ferreteria',emoji: '🔧', name: 'Tornillos Surtidos',   shop: 'Ferretería MRC',  price: 1500 },
  { id: 17, cat: 'ferreteria',emoji: '🔩', name: 'Anclaje Fisher x10',   shop: 'Ferretería MRC',  price: 900  },
  { id: 18, cat: 'ferreteria',emoji: '🔦', name: 'Foco LED 12 W',        shop: 'Ferretería MRC',  price: 2200 },
];

// ── ESTADO ─────────────────────────────────────────────────────────────────
let currentZone   = null;   // 'miramar' | 'otros'
let currentCat    = 'all';
let searchQuery   = '';
let cart          = [];     // [{ product, qty }]

// ── NAVEGACIÓN ─────────────────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) { target.classList.add('active'); window.scrollTo(0, 0); }
}

function selectZone(zone) {
  currentZone = zone;
  if (zone === 'otros') {
    showScreen('screen-otros');
    return;
  }
  // Miramar
  document.getElementById('active-zone-label').textContent = 'Miramar Centro';
  document.getElementById('delivery-msg').textContent =
    'Entrega exprés en Miramar Centro · 30–45 min';
  document.getElementById('products-title').innerHTML =
    'DISPONIBLE EN MIRAMAR CENTRO <span class="item-count" id="item-count"></span>';
  currentCat   = 'all';
  searchQuery  = '';
  cart         = [];
  updateCartUI();
  renderProducts();
  showScreen('screen-catalog');
  // Reset active cat button
  document.querySelectorAll('.cat-card').forEach(b => b.classList.remove('active'));
  document.getElementById('cat-all')?.classList.add('active');
  document.getElementById('search-input').value = '';
}

function goBack() {
  showScreen('screen-location');
  currentZone = null;
}

// ── CATEGORÍAS ─────────────────────────────────────────────────────────────
function filterCat(cat, btn) {
  currentCat = cat;
  document.querySelectorAll('.cat-card').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts();
}

// ── BÚSQUEDA ────────────────────────────────────────────────────────────────
function filterProducts() {
  searchQuery = document.getElementById('search-input').value.toLowerCase().trim();
  renderProducts();
}

// ── RENDER PRODUCTOS ────────────────────────────────────────────────────────
function renderProducts() {
  const list = document.getElementById('products-list');
  const countEl = document.getElementById('item-count');

  let filtered = PRODUCTS.filter(p => {
    const matchCat    = currentCat === 'all' || p.cat === currentCat;
    const matchSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery) ||
      p.shop.toLowerCase().includes(searchQuery);
    return matchCat && matchSearch;
  });

  if (countEl) countEl.textContent = filtered.length + ' items';

  if (!filtered.length) {
    list.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <p>No encontramos "<strong>${searchQuery || currentCat}</strong>"</p>
        <p style="margin-top:6px;font-size:0.8rem;">Intentá con otra búsqueda</p>
      </div>`;
    return;
  }

  list.innerHTML = filtered.map(p => {
    const inCart = cart.find(c => c.product.id === p.id);
    return `
    <div class="product-card" id="pc-${p.id}">
      <div class="product-emoji">${p.emoji}</div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-shop">${p.shop}</div>
        <div class="product-price">₡${p.price.toLocaleString('es-CR')}</div>
      </div>
      <button class="add-btn ${inCart ? 'added' : ''}" id="add-${p.id}" onclick="addToCart(${p.id})">
        ${inCart ? '✓ ' + inCart.qty : '+ Agregar'}
      </button>
    </div>`;
  }).join('');
}

// ── CARRITO ─────────────────────────────────────────────────────────────────
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(c => c.product.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ product, qty: 1 });
  }

  updateCartUI();
  renderProducts(); // refresh button states

  // Tiny pop animation on badge
  const badge = document.getElementById('cart-count');
  badge.style.transform = 'scale(1.5)';
  setTimeout(() => { badge.style.transform = 'scale(1)'; }, 200);
}

function changeQty(productId, delta) {
  const idx = cart.findIndex(c => c.product.id === productId);
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  updateCartUI();
  renderProducts();
}

function updateCartUI() {
  const count   = cart.reduce((s, c) => s + c.qty, 0);
  const total   = cart.reduce((s, c) => s + c.product.price * c.qty, 0);

  document.getElementById('cart-count').textContent = count;

  const itemsEl  = document.getElementById('cart-items');
  const footerEl = document.getElementById('cart-footer');
  const totalEl  = document.getElementById('cart-total');

  if (!cart.length) {
    itemsEl.innerHTML = '<p class="cart-empty">Tu pedido está vacío.<br/>¡Agregá algo! 🛵</p>';
    footerEl.style.display = 'none';
    return;
  }

  footerEl.style.display = 'block';
  totalEl.textContent = '₡' + total.toLocaleString('es-CR');

  itemsEl.innerHTML = cart.map(c => `
    <div class="cart-item-row">
      <span class="cart-item-emoji">${c.product.emoji}</span>
      <div class="cart-item-info">
        <div class="cart-item-name">${c.product.name}</div>
        <div class="cart-item-price">₡${(c.product.price * c.qty).toLocaleString('es-CR')}</div>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="changeQty(${c.product.id}, -1)">−</button>
        <span class="qty-num">${c.qty}</span>
        <button class="qty-btn" onclick="changeQty(${c.product.id}, +1)">+</button>
      </div>
    </div>
  `).join('');

  // Build WhatsApp message
  let msg = '¡Hola! Quiero hacer un pedido Al Toque:%0A%0A';
  cart.forEach(c => {
    msg += `• ${c.product.name} x${c.qty} = ₡${(c.product.price * c.qty).toLocaleString('es-CR')}%0A`;
  });
  msg += `%0A*Total estimado: ₡${total.toLocaleString('es-CR')}*%0A%0AGracias 🛵`;
  document.getElementById('cart-whatsapp-btn').href =
    `https://wa.me/50684607119?text=${msg}`;
}

function toggleCart() {
  const overlay = document.getElementById('cart-overlay');
  overlay.classList.toggle('hidden');
}

function closeCartOutside(e) {
  if (e.target === document.getElementById('cart-overlay')) toggleCart();
}

// ── INIT ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderProducts(); // pre-render for when user selects Miramar
});
