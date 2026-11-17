const test = require('node:test');
const assert = require('node:assert');
const { services, sections } = require('../data.js');

const SECTION_IDS = ['estaticos', 'dinamicos', 'bots'];
const SIZES = ['normal', 'wide', 'full'];

test('el catálogo tiene 11 servicios sin paquete', () => {
  assert.strictEqual(services.length, 11);
  services.forEach(service => {
    assert.strictEqual(service.isBundle, undefined, `${service.name}: ya no existe el paquete`);
  });
});

test('los servicios se agrupan en las 3 secciones del catálogo', () => {
  assert.deepStrictEqual(sections.map(s => s.id), SECTION_IDS);

  SECTION_IDS.forEach(id => {
    const inSection = services.filter(service => service.section === id);
    assert.ok(inSection.length > 0, `la sección "${id}" no tiene servicios`);
  });

  services.forEach(service => {
    assert.ok(
      SECTION_IDS.includes(service.section),
      `${service.name}: sección inválida "${service.section}"`
    );
  });
});

test('cada servicio declara un tamaño de tarjeta válido', () => {
  services.forEach(service => {
    assert.ok(SIZES.includes(service.size), `${service.name}: tamaño inválido "${service.size}"`);
  });

  // Layout acordado: 3 normales + 2 anchas (estáticos), 3 normales + 1 completa (dinámicos), 2 anchas (bots)
  assert.deepStrictEqual(
    services.filter(s => s.section === 'estaticos').map(s => s.size),
    ['normal', 'normal', 'normal', 'wide', 'wide']
  );
  assert.deepStrictEqual(
    services.filter(s => s.section === 'dinamicos').map(s => s.size),
    ['normal', 'normal', 'normal', 'full']
  );
  assert.deepStrictEqual(
    services.filter(s => s.section === 'bots').map(s => s.size),
    ['wide', 'wide']
  );
});

test('cada servicio declara los campos que muestra la tarjeta', () => {
  services.forEach(service => {
    assert.ok(service.name && service.name.trim(), `sin nombre: ${service.name}`);
    assert.ok(service.tagline && service.tagline.trim(), `sin tagline: ${service.name}`);
    assert.ok(service.delivery && service.delivery.trim(), `sin entrega: ${service.name}`);
    assert.ok(service.badge && service.badge.trim(), `sin badge: ${service.name}`);
    assert.ok(service.bullets.length >= 3, `bullets incompletos: ${service.name}`);
  });
});

test('el 75% de descuento es real en todos los servicios', () => {
  services.forEach(service => {
    assert.strictEqual(
      service.basePrice,
      service.originalPrice * 0.25,
      `${service.name}: el precio no es el 25% del de referencia`
    );
  });
});

test('el chatbot cuesta $20 con referencia de $80 y el resto de premium $30/$120', () => {
  const chatbot = services.find(s => s.name.includes('Chatbot'));
  assert.strictEqual(chatbot.basePrice, 20);
  assert.strictEqual(chatbot.originalPrice, 80);

  const premium30 = services.filter(s => s.section === 'dinamicos' || s.name.includes('Automatizaciones'));
  assert.strictEqual(premium30.length, 5);
  premium30.forEach(service => {
    assert.strictEqual(service.basePrice, 30, `${service.name}: basePrice`);
    assert.strictEqual(service.originalPrice, 120, `${service.name}: originalPrice`);
  });
});

test('los extras son válidos, únicos y sin precio dentro del nombre', () => {
  services.forEach(service => {
    const names = service.extras.map(extra => extra.name);
    assert.strictEqual(
      new Set(names).size,
      names.length,
      `${service.name}: extras duplicados`
    );

    service.extras.forEach(extra => {
      assert.ok(extra.name.trim(), `${service.name}: extra sin nombre`);
      assert.ok(Number.isInteger(extra.price), `${extra.name}: precio no entero`);
      assert.ok(extra.price > 0, `${extra.name}: precio inválido`);
      assert.ok(extra.price <= 15, `${extra.name}: extra demasiado caro`);
      assert.ok(!/\$\s*\d/.test(extra.name), `${extra.name}: el nombre incluye el precio`);
    });
  });
});

test('el mismo extra cuesta lo mismo en todo el catálogo', () => {
  const seen = new Map();

  services.forEach(service => {
    service.extras.forEach(extra => {
      if (seen.has(extra.name)) {
        const previous = seen.get(extra.name);
        assert.strictEqual(
          extra.price,
          previous.price,
          `"${extra.name}" cuesta $${previous.price} en ${previous.service} y $${extra.price} en ${service.name}`
        );
      } else {
        seen.set(extra.name, { price: extra.price, service: service.name });
      }
    });
  });
});

test('las secciones declaran título y descripción para pintar la pantalla', () => {
  sections.forEach(section => {
    assert.ok(section.id && section.id.trim());
    assert.ok(section.title && section.title.trim());
    assert.ok(section.description && section.description.trim());
  });
});

test('los servicios declaran la entrega uniforme de su sección', () => {
  services.filter(s => s.section === 'estaticos').forEach(service => {
    assert.strictEqual(service.delivery, '2-3 días', `${service.name}: entrega`);
  });
  services.filter(s => s.section === 'dinamicos').forEach(service => {
    assert.strictEqual(service.delivery, '3-4 días', `${service.name}: entrega`);
  });
  const chatbot = services.find(s => s.name.includes('Chatbot'));
  const automatizaciones = services.find(s => s.name.includes('Automatizaciones'));
  assert.strictEqual(chatbot.delivery, '2 días');
  assert.strictEqual(automatizaciones.delivery, '4 días');
});
