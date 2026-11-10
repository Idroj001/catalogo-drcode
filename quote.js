// Lógica pura de cotización — sin DOM, testeable con node --test
// Cargada en el navegador junto a data.js y script.js, y en Node por los tests.

// Precios de lanzamiento: 75% de descuento sobre el precio de referencia
const LAUNCH_OFF = 0.75;
const BUNDLE_BONUS = 15;

// Precio de referencia del bundle: suma de los tres componentes sin descuento
function bundleOriginalPrice(thirdChoice, bases) {
  const thirdBase = thirdChoice === 'tarjeta' ? bases.tarjeta : bases.landing;
  return bases.web + bases.catalogo + thirdBase;
}

// Base del bundle: 25% de la suma de referencias, menos $15 por el combo
function bundleBasePrice(thirdChoice, bases) {
  const original = bundleOriginalPrice(thirdChoice, bases);
  return String(Math.round(original * (1 - LAUNCH_OFF)) - BUNDLE_BONUS);
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

    if (item.isBundle) {
      message += `   (Incluye: Web Corporativa, Catálogo de Compras, ${item.bundleThird === 'landing' ? 'Landing Page' : 'Tarjeta Digital'})\n`;
    }

    if (item.extras.length > 0) {
      message += `   Extras:\n`;
      item.extras.forEach(extra => {
        message += `   - ${extra.name} (+$${extra.price})\n`;
      });
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
  module.exports = { bundleBasePrice, bundleOriginalPrice, cartTotal, buildWhatsAppMessage, buildWhatsAppUrl };
}
