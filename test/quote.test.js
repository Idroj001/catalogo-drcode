const test = require('node:test');
const assert = require('node:assert');
const { bundleBasePrice, bundleOriginalPrice, cartTotal, buildWhatsAppMessage, buildWhatsAppUrl } = require('../quote.js');
const { services } = require('../data.js');

const bases = {
  web: services[1].originalPrice,
  catalogo: services[2].originalPrice,
  landing: services[0].originalPrice,
  tarjeta: services[3].originalPrice,
};

test('bundle original price sums the three reference prices', () => {
  assert.strictEqual(bundleOriginalPrice('landing', bases), 260);
  assert.strictEqual(bundleOriginalPrice('tarjeta', bases), 220);
});

test('bundle base price applies 75% off and the $15 combo bonus', () => {
  // (100 web + 80 catalogo + 80 landing) * 0.25 - 15
  assert.strictEqual(bundleBasePrice('landing', bases), '50');
});

test('bundle base price uses the digital card reference when selected', () => {
  // (100 + 80 + 40) * 0.25 - 15
  assert.strictEqual(bundleBasePrice('tarjeta', bases), '40');
});

test('unknown third component falls back to landing price', () => {
  assert.strictEqual(bundleBasePrice(undefined, bases), '50');
});

test('the bundle costs less than its parts bought separately', () => {
  const separateLanding = services[1].basePrice + services[2].basePrice + services[0].basePrice;
  const separateTarjeta = services[1].basePrice + services[2].basePrice + services[3].basePrice;

  assert.ok(Number(bundleBasePrice('landing', bases)) < separateLanding);
  assert.ok(Number(bundleBasePrice('tarjeta', bases)) < separateTarjeta);
});

test('cart total adds every subtotal and handles decimals', () => {
  const cart = [
    { subtotal: 33.5 },
    { subtotal: 10.25 },
    { subtotal: 6 },
  ];

  assert.strictEqual(cartTotal(cart), 49.75);
});

test('cart total of an empty cart is zero and does not mutate the cart', () => {
  const cart = [];
  assert.strictEqual(cartTotal(cart), 0);
  assert.deepStrictEqual(cart, []);

  const filled = [{ subtotal: 12 }];
  cartTotal(filled);
  assert.deepStrictEqual(filled, [{ subtotal: 12 }]);
});

test('whatsapp message opens with greeting and real newlines', () => {
  const msg = buildWhatsAppMessage([
    {
      service: 'Landing page simple',
      basePrice: 20,
      extras: [{ name: 'Formulario de contacto', price: 5 }],
      subtotal: 25,
    },
  ]);

  assert.ok(msg.startsWith('Hola Dr.Code, quiero cotizar estos servicios:\n'));
  assert.ok(msg.includes('1. Landing page simple\n'));
  assert.ok(msg.includes('Base: $20.00 USD\n'));
  assert.ok(msg.includes('- Formulario de contacto (+$5)\n'));
  assert.ok(msg.includes('Subtotal: $25.00 USD\n'));
  assert.ok(msg.includes('TOTAL: $25.00 USD\n'));
  assert.ok(!msg.includes('%0A'));
  assert.ok(msg.endsWith('Quedo a la espera de su respuesta.'));
});

test('whatsapp message total equals the cart total', () => {
  const msg = buildWhatsAppMessage([
    { service: 'Landing page simple', basePrice: 20, extras: [], subtotal: 20 },
    { service: 'Tarjeta digital profesional', basePrice: 10, extras: [], subtotal: 10 },
  ]);

  assert.ok(msg.includes('TOTAL: $30.00 USD'));
});

test('whatsapp message marks bundle items with their third component', () => {
  const msg = buildWhatsAppMessage([
    {
      service: 'Paquete Integral Dr.Code',
      basePrice: 40,
      extras: [],
      subtotal: 40,
      isBundle: true,
      bundleThird: 'tarjeta',
    },
  ]);

  assert.ok(msg.includes('(Incluye: Web Corporativa, Catálogo de Compras, Tarjeta Digital)'));
});

test('whatsapp message returns empty string for an empty cart', () => {
  assert.strictEqual(buildWhatsAppMessage([]), '');
});

test('whatsapp url is empty for an empty cart', () => {
  assert.strictEqual(buildWhatsAppUrl([], '593999806465'), '');
});

test('whatsapp url points to wa.me and encodes the full message', () => {
  const cart = [
    {
      service: 'Catálogo de compras con WhatsApp',
      basePrice: 20,
      extras: [{ name: 'Cantidad (+/−) por producto', price: 5 }],
      subtotal: 25,
    },
  ];

  const url = buildWhatsAppUrl(cart, '593999806465');
  const message = buildWhatsAppMessage(cart);

  assert.ok(url.startsWith('https://wa.me/593999806465?text='));
  assert.strictEqual(new URL(url).searchParams.get('text'), message);
});

test('whatsapp url keeps plus signs instead of turning them into spaces', () => {
  const cart = [
    {
      service: 'Catálogo de compras con WhatsApp',
      basePrice: 20,
      extras: [{ name: 'Cantidad (+/−) por producto', price: 5 }],
      subtotal: 25,
    },
  ];

  const decoded = new URL(buildWhatsAppUrl(cart, '593999806465')).searchParams.get('text');
  assert.ok(decoded.includes('Cantidad (+/−) por producto'));
});

test('whatsapp url keeps ampersands from breaking the query', () => {
  const cart = [
    {
      service: 'Landing page simple',
      basePrice: 20,
      extras: [{ name: 'SEO & velocidad', price: 5 }],
      subtotal: 25,
    },
  ];

  const url = buildWhatsAppUrl(cart, '593999806465');
  const decoded = new URL(url).searchParams.get('text');

  assert.strictEqual(decoded, buildWhatsAppMessage(cart));
  assert.ok(decoded.includes('SEO & velocidad'));
});
