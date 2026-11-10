// Datos del catálogo — única fuente de precios, extras y tiempos de entrega
// Cargado en el navegador antes de quote.js y script.js, y requerido por los tests.

const services = [
  {
    name: "Landing page simple",
    tagline: "Una sola página que presenta tu negocio y convierte visitas en mensajes.",
    basePrice: 20,
    originalPrice: 80,
    delivery: "2-3 días",
    badge: "75% OFF",
    bullets: ["Diseño responsive", "Secciones base de la landing", "Carga rápida y SEO básico"],
    extras: [
      { name: "Sección adicional", price: 5 },
      { name: "Formulario de contacto", price: 5 },
      { name: "Botón flotante de WhatsApp", price: 3 },
      { name: "Animaciones suaves", price: 4 },
      { name: "Mapa de Google", price: 5 },
      { name: "Galería de imágenes", price: 5 }
    ]
  },
  {
    name: "Web corporativa (3-5 páginas)",
    tagline: "Sitio de 3 a 5 páginas para presentar tu empresa y tus servicios.",
    basePrice: 25,
    originalPrice: 100,
    delivery: "5-7 días",
    badge: "75% OFF",
    bullets: ["3 a 5 páginas", "Menú de navegación", "Diseño responsive"],
    extras: [
      { name: "Página adicional", price: 8 },
      { name: "Blog estático", price: 12 },
      { name: "Galería de proyectos", price: 6 },
      { name: "Formulario con WhatsApp", price: 7 },
      { name: "Mapa de Google", price: 5 },
      { name: "Botón de WhatsApp", price: 3 },
      { name: "Tema oscuro/claro", price: 4 }
    ]
  },
  {
    name: "Catálogo de compras con WhatsApp",
    tagline: "Muestra tus productos y recibe pedidos directo en tu WhatsApp.",
    basePrice: 20,
    originalPrice: 80,
    delivery: "4-6 días",
    badge: "75% OFF",
    bullets: ["Grilla de productos", "Pedido por WhatsApp", "Diseño responsive"],
    extras: [
      { name: "Filtros por categoría", price: 6 },
      { name: "Buscador en tiempo real", price: 5 },
      { name: "Carrito con pedido a WhatsApp", price: 10 },
      { name: "Página de detalle de producto", price: 7 },
      { name: "Destacar \"más vendidos\"", price: 4 },
      { name: "Cantidad (+/−) por producto", price: 5 }
    ]
  },
  {
    name: "Tarjeta digital profesional",
    tagline: "Tu perfil profesional en un enlace que puedes compartir en cualquier lugar.",
    basePrice: 10,
    originalPrice: 40,
    delivery: "1-2 días",
    badge: "75% OFF",
    bullets: ["Perfil con foto y bio", "Enlaces a tus redes", "Diseño responsive"],
    extras: [
      { name: "WhatsApp con mensaje predefinido", price: 3 },
      { name: "Enlaces a Instagram/Facebook", price: 3 },
      { name: "Galería de fotos del trabajo", price: 5 },
      { name: "Descargar contacto vCard", price: 4 },
      { name: "Tema oscuro/claro", price: 4 },
      { name: "Contador de visitas", price: 3 },
      { name: "Horario semanal", price: 3 }
    ]
  },
  {
    name: "Menú digital para restaurante",
    tagline: "Tu carta completa en un enlace, sin apps ni impresión.",
    basePrice: 20,
    originalPrice: 80,
    delivery: "3-5 días",
    badge: "75% OFF",
    bullets: ["Platos y precios", "Categorías del menú", "Diseño responsive"],
    extras: [
      { name: "Carrito con pedido a WhatsApp", price: 10 },
      { name: "Categorías animadas", price: 5 },
      { name: "Indicador \"más pedido\"", price: 4 },
      { name: "Precios y textos editables sin código", price: 12 },
      { name: "Búsqueda de platos", price: 5 },
      { name: "Galería de fotos de platos", price: 6 }
    ]
  },
  {
    name: "Paquete Integral Dr.Code",
    tagline: "Tres servicios en uno: web corporativa, catálogo con WhatsApp y un tercero a elección.",
    type: "bundle",
    isBundle: true,
    delivery: "7-10 días",
    badge: "75% OFF + $15",
    bullets: ["Web corporativa 3-5 páginas", "Catálogo con pedidos a WhatsApp", "Landing page o tarjeta digital"],
    includes: [],
    thirdOptions: {}
  }
];

// El paquete reutiliza los servicios existentes: una sola fuente de datos
services[5].includes = [services[1], services[2]];
services[5].thirdOptions = { landing: services[0], tarjeta: services[3] };

if (typeof module !== 'undefined') {
  module.exports = { services };
}
