// CONFIGURACIÓN: WhatsApp real (solo dígitos, con código de país)
const WHATSAPP_NUMBER = "593999806465";

// Servicios disponibles: los define data.js
const [landingService, webService, catalogoService, tarjetaService, , bundleService] = services;

// Variables globales
let cart = [];
let currentServiceIndex = null;
let currentBundleThird = 'landing';

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
const bundleChoice = document.getElementById('bundleChoice');
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

// Precios de referencia del paquete, tomados de los servicios reales
function getBundleBases() {
  return {
    web: webService.originalPrice,
    catalogo: catalogoService.originalPrice,
    landing: landingService.originalPrice,
    tarjeta: tarjetaService.originalPrice
  };
}

// Renderizar servicios
function renderServices() {
  servicesGrid.innerHTML = '';

  services.forEach((service, index) => {
    const card = document.createElement('div');
    card.className = `service-card${service.isBundle ? ' is-bundle' : ''}`;

    const isBundle = service.isBundle;
    const priceValue = isBundle ? calculateBundleBase() : service.basePrice;
    const originalValue = isBundle ? calculateBundleOriginal() : service.originalPrice;

    const bulletsHTML = service.bullets
      .map(item => `<li>${item}</li>`)
      .join('');

    card.innerHTML = `
      <div class="service-badge">${service.badge}</div>
      <div class="service-title">${service.name}</div>
      <p class="service-tagline">${service.tagline}</p>
      <div class="service-price">
        <span class="price-old">$${originalValue}</span>
        <span class="price-now">$${priceValue}</span>
        <span class="price-currency">USD</span>
      </div>
      <ul class="service-includes">${bulletsHTML}</ul>
      <span class="service-delivery">Entrega: ${service.delivery}</span>
      <button class="select-service-btn" data-service="${index}">Cotizar este servicio</button>
    `;

    servicesGrid.appendChild(card);
  });

  // Event listeners para botones de seleccionar
  document.querySelectorAll('.select-service-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceIndex = parseInt(e.target.dataset.service);
      openServiceDrawer(serviceIndex);
    });
  });
}

// Calcular base del bundle
function calculateBundleBase() {
  return bundleBasePrice(currentBundleThird, getBundleBases());
}

// Calcular precio de referencia del bundle
function calculateBundleOriginal() {
  return bundleOriginalPrice(currentBundleThird, getBundleBases());
}

// Abrir drawer de servicio
function openServiceDrawer(serviceIndex) {
  currentServiceIndex = serviceIndex;
  const service = services[serviceIndex];

  serviceDrawerTitle.textContent = service.name;

  if (service.isBundle) {
    serviceDrawerPrice.innerHTML = `
      <span class="price-old">$${calculateBundleOriginal()}</span>
      <span class="price-now">$${calculateBundleBase()}</span>
      <span class="price-currency">USD</span>
    `;
    serviceDrawerDiscount.textContent = service.badge;
    bundleChoice.style.display = 'block';
    renderBundleExtras();
  } else {
    serviceDrawerPrice.innerHTML = `
      <span class="price-old">$${service.originalPrice}</span>
      <span class="price-now">$${service.basePrice}</span>
      <span class="price-currency">USD</span>
    `;
    serviceDrawerDiscount.textContent = service.badge;
    bundleChoice.style.display = 'none';
    renderServiceExtras(service.extras);
  }

  updateServiceSubtotal();
  serviceDrawer.classList.add('show');
  serviceDrawerOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

// Renderizar extras para servicio normal
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

// Renderizar un grupo de extras del bundle
function renderBundleGroup(title, prefix, extras) {
  const items = extras.map((extra, index) => `
    <div class="extra-item">
      <input type="checkbox" id="extra-${prefix}-${index}" data-price="${extra.price}">
      <label for="extra-${prefix}-${index}">${extra.name}</label>
      <span class="extra-price">+$${extra.price}</span>
    </div>
  `).join('');

  return `<h3 class="extras-group-title">${title}</h3>${items}`;
}

// Renderizar extras para bundle
function renderBundleExtras() {
  // Los extras de web y catálogo se conservan al cambiar el tercer componente
  const checkedIds = new Set(
    [...serviceDrawerExtras.querySelectorAll('input:checked')]
      .map(cb => cb.id)
      .filter(id => !id.startsWith('extra-third-'))
  );

  const bundle = bundleService;
  const thirdService = currentBundleThird === 'landing'
    ? bundle.thirdOptions.landing
    : bundle.thirdOptions.tarjeta;

  serviceDrawerExtras.innerHTML =
    renderBundleGroup('Web corporativa', 'web', bundle.includes[0].extras) +
    renderBundleGroup('Catálogo de compras', 'cat', bundle.includes[1].extras) +
    renderBundleGroup(thirdService.name, 'third', thirdService.extras);

  // Event listeners para checkboxes (restaurando la selección previa)
  serviceDrawerExtras.querySelectorAll('input').forEach(cb => {
    if (checkedIds.has(cb.id)) {
      cb.checked = true;
    }
    cb.addEventListener('change', updateServiceSubtotal);
  });
}

// Actualizar subtotal del servicio en tiempo real
function updateServiceSubtotal() {
  const service = services[currentServiceIndex];
  let subtotal = 0;

  if (service.isBundle) {
    subtotal = parseFloat(bundleBasePrice(currentBundleThird, getBundleBases()));
  } else {
    subtotal = service.basePrice;
  }

  // Sumar extras seleccionados
  serviceDrawerExtras.querySelectorAll('input:checked').forEach(cb => {
    subtotal += parseFloat(cb.dataset.price);
  });

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
  let subtotal = 0;

  const basePrice = service.isBundle
    ? parseFloat(bundleBasePrice(currentBundleThird, getBundleBases()))
    : service.basePrice;

  subtotal = basePrice;

  serviceDrawerExtras.querySelectorAll('input:checked').forEach(cb => {
    const price = parseFloat(cb.dataset.price);
    subtotal += price;
    selectedExtras.push({
      name: cb.parentElement.querySelector('label').textContent,
      price: price
    });
  });

  const item = {
    service: service.name,
    basePrice: basePrice,
    extras: selectedExtras,
    subtotal: subtotal
  };

  if (service.isBundle) {
    item.isBundle = true;
    item.bundleThird = currentBundleThird;
  }

  cart.push(item);

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

// Menú de navegación en móvil
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
  const closeNav = () => {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('active');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    navMenu.classList.toggle('active', isOpen);
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && hamburger.classList.contains('active')) {
      closeNav();
      hamburger.focus();
    }
  });
}

// Event Listeners
closeServiceDrawerBtn.addEventListener('click', closeServiceDrawerFunc);
cancelServiceDrawerBtn.addEventListener('click', closeServiceDrawerFunc);
serviceDrawerOverlay.addEventListener('click', closeServiceDrawerFunc);

addToCartBtn.addEventListener('click', addToCart);

cartIcon.addEventListener('click', openCartDrawer);
closeCartDrawerBtn.addEventListener('click', closeCartDrawerFunc);
cartDrawerOverlay.addEventListener('click', closeCartDrawerFunc);

// Cambio del tercer componente del paquete (listener único)
document.querySelectorAll('input[name="bundleThird"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    currentBundleThird = e.target.value;
    serviceDrawerPrice.innerHTML = `
      <span class="price-old">$${calculateBundleOriginal()}</span>
      <span class="price-now">$${calculateBundleBase()}</span>
      <span class="price-currency">USD</span>
    `;
    serviceDrawerDiscount.textContent = bundleService.badge;
    renderBundleExtras();
    updateServiceSubtotal();
  });
});

whatsappBtn.addEventListener('click', () => {
  const url = buildWhatsAppUrl(cart, WHATSAPP_NUMBER);
  if (url) {
    window.open(url, '_blank');
  }
});

// Inicializar
renderServices();
