// CONFIGURACIÓN: WhatsApp real (solo dígitos, con código de país)
const WHATSAPP_NUMBER = "593999806465";

// Carrito persistente: sobrevive recargas (mismo patrón que el theme)
const CART_STORAGE_KEY = 'drcode_cart';

function loadCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
    if (!Array.isArray(stored)) return [];
    return stored.filter(item =>
      item &&
      typeof item.service === 'string' &&
      typeof item.basePrice === 'number' &&
      Array.isArray(item.extras) &&
      typeof item.subtotal === 'number'
    );
  } catch (e) {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {}
}

// Variables globales
let cart = loadCart();
let currentServiceIndex = null;

// Elementos DOM
const servicesGrid = document.getElementById('servicesGrid');
const cartIcon = document.getElementById('cartIcon');
const cartBadge = document.getElementById('cartBadge');

// Service Drawer Elements
const serviceDrawer = document.getElementById('serviceDrawer');
const serviceDrawerOverlay = document.getElementById('serviceDrawerOverlay');
const closeServiceDrawerBtn = document.getElementById('closeServiceDrawer');
const cancelServiceDrawerBtn = document.getElementById('cancelServiceDrawer');
const serviceDrawerTitle = document.getElementById('serviceDrawerTitle');
const serviceDrawerPrice = document.getElementById('serviceDrawerPrice');
const serviceDrawerDiscount = document.getElementById('serviceDrawerDiscount');
const serviceDrawerExtras = document.getElementById('serviceDrawerExtras');
const serviceDrawerSubtotal = document.getElementById('serviceDrawerSubtotal');
const addToCartBtn = document.getElementById('addToCartBtn');

// Cart Drawer Elements
const cartDrawer = document.getElementById('cartDrawer');
const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
const closeCartDrawerBtn = document.getElementById('closeCartDrawer');
const cartItems = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const whatsappBtn = document.getElementById('whatsappBtn');

// Toast
const toast = document.getElementById('toast');

// Formato de dinero
function money(value) {
  return `$${Number(value).toFixed(2)}`;
}

// Crear la tarjeta de un servicio — estándar tipo T:
// título arriba · izquierda descripción y precio · derecha entrega e incluye
function buildServiceCard(service, index) {
  const card = document.createElement('div');
  card.className = `service-card${service.size === 'normal' ? '' : ` service-card--${service.size}`}`;
  card.dataset.service = index;
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `Cotizar ${service.name}`);

  const bulletsHTML = service.bullets
    .map(item => `<li>${item}</li>`)
    .join('');

  card.innerHTML = `
    <div class="service-badge">${service.badge}</div>
    <div class="service-title">${service.name}</div>
    <div class="service-body">
      <div class="service-info">
        <p class="service-tagline">${service.tagline}</p>
        <div class="service-price">
          <span class="price-old">$${service.originalPrice}</span>
          <span class="price-now">$${service.basePrice}</span>
          <span class="price-currency">USD</span>
        </div>
      </div>
      <div class="service-meta">
        <span class="service-delivery">Entrega: ${service.delivery}</span>
        <div class="includes-label">Incluye:</div>
        <ul class="service-includes">${bulletsHTML}</ul>
      </div>
    </div>
    <div class="card-hint">click para cotizar</div>
  `;

  return card;
}

// Renderizar el catálogo agrupado por secciones
function renderServices() {
  servicesGrid.innerHTML = '';

  sections.forEach(section => {
    const sectionEl = document.createElement('section');
    sectionEl.className = 'catalog-section';
    sectionEl.id = section.id;

    const heading = document.createElement('div');
    heading.className = 'section-heading';
    heading.innerHTML = `
      <h2 class="section-title">&gt; ${section.title}</h2>
      <p class="section-desc">${section.description}</p>
    `;
    sectionEl.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'services-grid';

    services.forEach((service, index) => {
      if (service.section !== section.id) return;
      grid.appendChild(buildServiceCard(service, index));
    });

    sectionEl.appendChild(grid);
    servicesGrid.appendChild(sectionEl);
  });

  // Toda la tarjeta es clicable (y accesible con Enter/Espacio)
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => openServiceDrawer(parseInt(card.dataset.service)));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openServiceDrawer(parseInt(card.dataset.service));
      }
    });
  });
}

// Abrir drawer de servicio
function openServiceDrawer(serviceIndex) {
  currentServiceIndex = serviceIndex;
  const service = services[serviceIndex];

  serviceDrawerTitle.textContent = service.name;
  serviceDrawerPrice.innerHTML = `
    <span class="price-old">$${service.originalPrice}</span>
    <span class="price-now">$${service.basePrice}</span>
    <span class="price-currency">USD</span>
  `;
  serviceDrawerDiscount.textContent = service.badge;
  renderServiceExtras(service.extras);

  updateServiceSubtotal();
  serviceDrawer.classList.add('show');
  serviceDrawerOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

// Renderizar extras del servicio
function renderServiceExtras(extras) {
  serviceDrawerExtras.innerHTML = '';
  extras.forEach((extra, index) => {
    serviceDrawerExtras.innerHTML += `
      <div class="extra-item">
        <input type="checkbox" id="extra-${index}" data-price="${extra.price}">
        <label for="extra-${index}">${extra.name}</label>
        <span class="extra-price">+$${extra.price}</span>
      </div>
    `;
  });

  // Event listeners para checkboxes
  serviceDrawerExtras.querySelectorAll('input').forEach(cb => {
    cb.addEventListener('change', updateServiceSubtotal);
  });
}

// Actualizar subtotal del servicio en tiempo real (con promo: el extra más caro sale gratis)
function updateServiceSubtotal() {
  const service = services[currentServiceIndex];

  // Restaurar el precio de cada extra antes de recalcular
  serviceDrawerExtras.querySelectorAll('.extra-item').forEach(item => {
    item.classList.remove('extra-free');
    item.querySelector('.extra-price').textContent = `+$${item.querySelector('input').dataset.price}`;
  });

  const checked = [...serviceDrawerExtras.querySelectorAll('input:checked')];
  const selectedExtras = checked.map(cb => ({
    name: cb.parentElement.querySelector('label').textContent,
    price: parseFloat(cb.dataset.price)
  }));

  const discount = freeExtraDiscount(selectedExtras);
  let subtotal = service.basePrice + selectedExtras.reduce((sum, extra) => sum + extra.price, 0) - discount;

  // Marcar el extra que sale gratis (el de mayor costo)
  if (discount > 0) {
    const freeCb = checked.find(cb => parseFloat(cb.dataset.price) === discount);
    const freeItem = freeCb.closest('.extra-item');
    freeItem.classList.add('extra-free');
    freeItem.querySelector('.extra-price').textContent = 'GRATIS';
  }

  serviceDrawerSubtotal.textContent = money(subtotal);
}

// Cerrar drawer de servicio
function closeServiceDrawerFunc() {
  serviceDrawer.classList.remove('show');
  serviceDrawerOverlay.classList.remove('show');
  document.body.style.overflow = 'auto';
}

// Agregar servicio al carrito
function addToCart() {
  const service = services[currentServiceIndex];
  const selectedExtras = [];

  serviceDrawerExtras.querySelectorAll('input:checked').forEach(cb => {
    selectedExtras.push({
      name: cb.parentElement.querySelector('label').textContent,
      price: parseFloat(cb.dataset.price)
    });
  });

  // Promo: el extra de mayor costo sale gratis
  const freePrice = freeExtraDiscount(selectedExtras);
  const freeExtra = freePrice > 0
    ? selectedExtras.find(extra => extra.price === freePrice)
    : null;

  const subtotal = service.basePrice
    + selectedExtras.reduce((sum, extra) => sum + extra.price, 0)
    - freePrice;

  cart.push({
    service: service.name,
    basePrice: service.basePrice,
    extras: selectedExtras,
    freeExtra: freeExtra ? { name: freeExtra.name, price: freeExtra.price } : null,
    subtotal: subtotal
  });

  saveCart();
  updateCartBadge();
  showToast();
  closeServiceDrawerFunc();
}

// Actualizar badge del carrito
function updateCartBadge() {
  cartBadge.textContent = cart.length;
  if (cart.length > 0) {
    cartBadge.classList.add('show');
  } else {
    cartBadge.classList.remove('show');
  }
}

// Mostrar toast
function showToast() {
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Abrir drawer del carrito
function openCartDrawer() {
  updateCartDrawer();
  cartDrawer.classList.add('show');
  cartDrawerOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

// Cerrar drawer del carrito
function closeCartDrawerFunc() {
  cartDrawer.classList.remove('show');
  cartDrawerOverlay.classList.remove('show');
  document.body.style.overflow = 'auto';
}

// Actualizar contenido del carrito
function updateCartDrawer() {
  whatsappBtn.disabled = cart.length === 0;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">No hay servicios agregados aún</p>';
    cartTotalEl.textContent = 'Total: $0.00';
    return;
  }

  let itemsHTML = '';

  cart.forEach((item, index) => {
    const extrasHTML = item.extras.length > 0
      ? `<div class="cart-extras">Extras: ${item.extras.map(e => `${e.name} (+$${e.price})`).join(', ')}</div>`
      : '';

    const freeExtraHTML = item.freeExtra
      ? `<div class="cart-free-extra">Extra gratis: ${item.freeExtra.name} (-$${item.freeExtra.price})</div>`
      : '';

    itemsHTML += `
      <div class="cart-item">
        <div class="cart-item-header">
          <div class="cart-item-title">${item.service}</div>
          <div>
            <span class="cart-item-price">${money(item.subtotal)}</span>
            <button class="delete-item" data-index="${index}">Eliminar</button>
          </div>
        </div>
        <div>Base: ${money(item.basePrice)}</div>
        ${extrasHTML}
        ${freeExtraHTML}
      </div>
    `;
  });

  cartItems.innerHTML = itemsHTML;
  cartTotalEl.textContent = `Total: ${money(cartTotal(cart))}`;

  // Event listeners para eliminar
  document.querySelectorAll('.delete-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      cart.splice(index, 1);
      saveCart();
      updateCartBadge();
      updateCartDrawer();
    });
  });
}

// Theme toggle (claro/oscuro) — mismo sistema que web/landing
const themeToggle = document.getElementById('themeToggle');
const THEME_STORAGE_KEY = 'drcode_theme';

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const nextTheme = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', nextTheme);
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
});

// Event Listeners
closeServiceDrawerBtn.addEventListener('click', closeServiceDrawerFunc);
cancelServiceDrawerBtn.addEventListener('click', closeServiceDrawerFunc);
serviceDrawerOverlay.addEventListener('click', closeServiceDrawerFunc);

addToCartBtn.addEventListener('click', addToCart);

cartIcon.addEventListener('click', openCartDrawer);
closeCartDrawerBtn.addEventListener('click', closeCartDrawerFunc);
cartDrawerOverlay.addEventListener('click', closeCartDrawerFunc);

whatsappBtn.addEventListener('click', () => {
  const url = buildWhatsAppUrl(cart, WHATSAPP_NUMBER);
  if (url) {
    window.open(url, '_blank');
  } else {
    // Carrito vacío: aviso en lugar de abrir un wa.me sin mensaje
    toast.textContent = 'Agrega un servicio primero';
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      toast.textContent = 'Servicio agregado a cotización';
    }, 3000);
  }
});

// Contact modal (correo del footer)
const mailLink = document.getElementById('mailLink');
const contactModal = document.getElementById('contactModal');
const contactOverlay = document.getElementById('contactOverlay');
const closeContactModalBtn = document.getElementById('closeContactModal');
const contactForm = document.getElementById('contactForm');
const contactServiceSelect = document.getElementById('contactService');
const contactSubmitBtn = document.getElementById('contactSubmitBtn');
const contactSuccess = document.getElementById('contactSuccess');
const contactDoneBtn = document.getElementById('contactDoneBtn');

// Poblar el select de servicios desde la fuente única de datos (data.js)
function renderContactServiceOptions() {
  const placeholder = '<option value="" disabled selected>Selecciona un servicio</option>';
  const groups = sections.map(section => {
    const opts = services
      .filter(service => service.section === section.id)
      .map(service => `<option value="${service.name}">${service.name}</option>`)
      .join('');
    return `<optgroup label="${section.title}">${opts}</optgroup>`;
  }).join('');

  contactServiceSelect.innerHTML = placeholder + groups
    + '<option value="Otro">Otro / aún no lo tengo claro</option>';
}

function openContactModal() {
  contactForm.hidden = false;
  contactSuccess.hidden = true;
  contactSubmitBtn.disabled = false;
  contactSubmitBtn.textContent = 'Enviar mensaje';
  contactModal.classList.add('show');
  contactOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
  const firstInput = contactForm.querySelector('input:not([type=hidden])');
  if (firstInput) firstInput.focus();
}

function closeContactModalFunc() {
  contactModal.classList.remove('show');
  contactOverlay.classList.remove('show');
  document.body.style.overflow = 'auto';
}

// Envío por FormSubmit (AJAX): el mensaje llega a jordy.mh_1994@hotmail.com
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }
  // Honeypot: si el campo trampa tiene contenido, es un bot
  if (contactForm.querySelector('[name="_honey"]').value) return;

  contactSubmitBtn.disabled = true;
  contactSubmitBtn.textContent = 'Enviando...';

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(contactForm)))
    });
    if (!response.ok) throw new Error('HTTP ' + response.status);

    contactForm.reset();
    contactForm.hidden = true;
    contactSuccess.hidden = false;
  } catch (err) {
    toast.textContent = 'No se pudo enviar. Escríbenos a jordy.mh_1994@hotmail.com';
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      toast.textContent = 'Servicio agregado a cotización';
    }, 4000);
  }

  contactSubmitBtn.disabled = false;
  contactSubmitBtn.textContent = 'Enviar mensaje';
});

mailLink.addEventListener('click', openContactModal);
closeContactModalBtn.addEventListener('click', closeContactModalFunc);
contactOverlay.addEventListener('click', closeContactModalFunc);
contactDoneBtn.addEventListener('click', closeContactModalFunc);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && contactModal.classList.contains('show')) {
    closeContactModalFunc();
  }
});

// Inicializar: reflejar el carrito restaurado de localStorage
updateCartBadge();
renderServices();
renderContactServiceOptions();
