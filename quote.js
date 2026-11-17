// Lógica pura de cotización — sin DOM, testeable con node --test
// Cargada en el navegador junto a data.js y script.js, y en Node por los tests.

// Promo: 1 extra gratis. Si el cliente elige varios, el de mayor costo no se cobra.
function freeExtraDiscount(extras) {
  if (!extras || extras.length === 0) return 0;
  return Math.max(...extras.map(extra => extra.price));
}

// Total del carrito: suma de subtotales ya calculados
function cartTotal(cart) {
  return cart.reduce((sum, item) => sum + item.subtotal, 0);
}

// Mensaje para wa.me — texto plano con saltos de línea reales
function buildWhatsAppMessage(cart) {
  if (cart.length === 0) return '';

  let message = "Hola Dr.Code, quiero cotizar estos servicios:\n\n";

  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.service}\n`;
    message += `   Base: $${item.basePrice.toFixed(2)} USD\n`;

    if (item.extras.length > 0) {
      message += `   Extras:\n`;
      item.extras.forEach(extra => {
        message += `   - ${extra.name} (+$${extra.price})\n`;
      });
    }

    if (item.freeExtra) {
      message += `   Extra gratis (el más caro): ${item.freeExtra.name} (-$${item.freeExtra.price})\n`;
    }

    message += `   Subtotal: $${item.subtotal.toFixed(2)} USD\n\n`;
  });

  message += `TOTAL: $${cartTotal(cart).toFixed(2)} USD\n\n`;
  message += "Quedo a la espera de su respuesta.";

  return message;
}

// URL lista para abrir wa.me con el mensaje codificado
function buildWhatsAppUrl(cart, number) {
  const message = buildWhatsAppMessage(cart);
  if (!message) return '';
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

if (typeof module !== 'undefined') {
  module.exports = { freeExtraDiscount, cartTotal, buildWhatsAppMessage, buildWhatsAppUrl };
}
