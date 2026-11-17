const test = require('node:test');
const assert = require('node:assert');
const { freeExtraDiscount, cartTotal, buildWhatsAppMessage, buildWhatsAppUrl } = require('../quote.js');

test('free extra discount picks the most expensive selected extra', () => {
  assert.strictEqual(freeExtraDiscount([]), 0);
  assert.strictEqual(freeExtraDiscount(undefined), 0);
  assert.strictEqual(freeExtraDiscount([{ name: 'A', price: 5 }]), 5);
  assert.strictEqual(
    freeExtraDiscount([
      { name: 'A', price: 5 },
      { name: 'B', price: 12 },
      { name: 'C', price: 8 },
    ]),
    12
  );
});

test('whatsapp message includes the free extra line and the discounted subtotal', () => {
  const msg = buildWhatsAppMessage([
    {
      service: 'Finanzas personales',
      basePrice: 30,
      extras: [
        { name: 'Login de usuario', price: 8 },
        { name: 'Exportar a CSV', price: 6 },
      ],
      freeExtra: { name: 'Login de usuario', price: 8 },
      subtotal: 36,
    },
  ]);

  assert.ok(msg.includes('- Login de usuario (+$8)\n'));
  assert.ok(msg.includes('Extra gratis (el más caro): Login de usuario (-$8)\n'));
  assert.ok(msg.includes('Subtotal: $36.00 USD'));
  assert.ok(msg.includes('TOTAL: $36.00 USD'));
});

test('whatsapp message omits the free extra line when no extra was chosen', () => {
  const msg = buildWhatsAppMessage([
    { service: 'Landing page simple', basePrice: 20, extras: [], freeExtra: null, subtotal: 20 },
  ]);

  assert.ok(!msg.includes('Extra gratis'));
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
