const test = require('node:test');
const assert = require('node:assert');
const { services } = require('../data.js');

const catalog = services.slice(0, 5);
const bundle = services[5];

test('el catálogo tiene 5 servicios y el paquete al final', () => {
  assert.strictEqual(services.length, 6);
  assert.strictEqual(bundle.isBundle, true);
  assert.ok(bundle.name.includes('Paquete'));
});

test('cada servicio declara los campos que muestra la tarjeta', () => {
  services.forEach(service => {
    assert.ok(service.name && service.name.trim(), `sin nombre: ${service.name}`);
    assert.ok(service.tagline && service.tagline.trim(), `sin tagline: ${service.name}`);
    assert.ok(service.delivery && service.delivery.trim(), `sin entrega: ${service.name}`);
    assert.ok(service.badge && service.badge.trim(), `sin badge: ${service.name}`);
    assert.strictEqual(service.bullets.length, 3, `bullets incompletos: ${service.name}`);
  });
});

test('el 75% de descuento es real en todos los servicios', () => {
  catalog.forEach(service => {
    assert.strictEqual(
      service.basePrice,
      service.originalPrice * 0.25,
      `${service.name}: el precio no es el 25% del de referencia`
    );
  });
});

test('los extras son válidos, únicos y sin precio dentro del nombre', () => {
  catalog.forEach(service => {
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

  catalog.forEach(service => {
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

test('el paquete reutiliza los servicios reales, no copias', () => {
  assert.strictEqual(bundle.includes[0], services[1]);
  assert.strictEqual(bundle.includes[1], services[2]);
  assert.strictEqual(bundle.thirdOptions.landing, services[0]);
  assert.strictEqual(bundle.thirdOptions.tarjeta, services[3]);
});
