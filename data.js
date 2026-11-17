// Datos del catálogo — única fuente de precios, extras, secciones y tiempos de entrega
// Cargado en el navegador antes de quote.js y script.js, y requerido por los tests.
//
// Cada servicio declara:
//   section: "estaticos" | "dinamicos" | "bots"  (agrupa las tarjetas en pantalla)
//   size:    "normal" (2 de 6 columnas) | "wide" (3 de 6) | "full" (6 de 6)
//
// Entregas uniformes por sección: estáticos 2-3 días, dinámicos 3-4 días,
// chatbot 2 días y automatizaciones 4 días.

const services = [
  // ── Sección 1 · Webs estáticas ───────────────────────────────────────────
  {
    name: "Landing page simple",
    section: "estaticos",
    size: "normal",
    tagline: "Una sola página que convierte visitas en <span class=\"hl\">clientes que te escriben</span>.",
    basePrice: 20,
    originalPrice: 80,
    delivery: "2-3 días",
    badge: "75% OFF",
    bullets: ["Se ve perfecta en móvil y PC", "Secciones listas para vender", "Carga rápida y SEO básico"],
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
    section: "estaticos",
    size: "normal",
    tagline: "De 3 a 5 páginas para que tu empresa <span class=\"hl\">se vea grande y profesional</span> en internet.",
    basePrice: 25,
    originalPrice: 100,
    delivery: "2-3 días",
    badge: "75% OFF",
    bullets: ["3 a 5 páginas a tu medida", "Menú de navegación claro", "Perfecta en móvil y PC"],
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
    section: "estaticos",
    size: "normal",
    tagline: "Tus productos en línea y los pedidos llegan <span class=\"hl\">directo a tu WhatsApp</span>. Sin complicaciones.",
    basePrice: 20,
    originalPrice: 80,
    delivery: "2-3 días",
    badge: "75% OFF",
    bullets: ["Grilla de productos con precios", "Pedidos directo a tu WhatsApp", "Fácil de recorrer y comprar"],
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
    section: "estaticos",
    size: "wide",
    tagline: "Todos tus datos de contacto en <span class=\"hl\">un solo enlace</span>, listo para compartir al instante.",
    basePrice: 2,
    originalPrice: 8,
    delivery: "2-3 días",
    badge: "75% OFF",
    bullets: ["Perfil con foto y bio", "Tus redes y WhatsApp a un toque", "Se comparte en segundos"],
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
    section: "estaticos",
    size: "wide",
    tagline: "Tu carta completa en un enlace: el cliente <span class=\"hl\">escanea, mira y pide</span>. Sin apps ni impresión.",
    basePrice: 20,
    originalPrice: 80,
    delivery: "2-3 días",
    badge: "75% OFF",
    bullets: ["Platos y precios siempre al día", "Categorías para encontrar rápido", "Pedidos por WhatsApp"],
    extras: [
      { name: "Carrito con pedido a WhatsApp", price: 10 },
      { name: "Categorías animadas", price: 5 },
      { name: "Indicador \"más pedido\"", price: 4 },
      { name: "Precios y textos editables sin código", price: 12 },
      { name: "Búsqueda de platos", price: 5 },
      { name: "Galería de fotos de platos", price: 6 }
    ]
  },

  // ── Sección 2 · Apps dinámicas (con base de datos) ───────────────────────
  {
    name: "Web de estudios",
    section: "dinamicos",
    size: "normal",
    tagline: "Apuntes, tareas y horarios en un solo lugar, con tu información <span class=\"hl\">guardada en la nube</span>.",
    basePrice: 30,
    originalPrice: 120,
    delivery: "3-4 días",
    badge: "75% OFF",
    bullets: ["Apuntes y tareas organizados", "Horario y calendario a la vista", "Nunca más pierdes un apunte"],
    extras: [
      { name: "Login de usuario", price: 8 },
      { name: "Recordatorios de tareas", price: 5 },
      { name: "Calendario de clases", price: 6 },
      { name: "Estadísticas de progreso", price: 8 },
      { name: "Galería de apuntes", price: 5 },
      { name: "Tema oscuro/claro", price: 4 }
    ]
  },
  {
    name: "Finanzas personales",
    section: "dinamicos",
    size: "normal",
    tagline: "<span class=\"hl\">Cada dólar bajo control</span>: registra ingresos y gastos y mira tu saldo con gráficos claros.",
    basePrice: 30,
    originalPrice: 120,
    delivery: "3-4 días",
    badge: "75% OFF",
    bullets: ["Ingresos y gastos por categoría", "Resumen mensual con gráficos", "Datos privados y en la nube"],
    extras: [
      { name: "Login de usuario", price: 8 },
      { name: "Gráficos mensuales", price: 8 },
      { name: "Exportar a CSV", price: 6 },
      { name: "Metas de ahorro", price: 5 },
      { name: "Alertas de gastos", price: 4 },
      { name: "Tema oscuro/claro", price: 4 }
    ]
  },
  {
    name: "Gestión profesional",
    section: "dinamicos",
    size: "normal",
    tagline: "Tus clientes, inventario y agenda en un solo panel, hecho <span class=\"hl\">a la medida de tu negocio</span>.",
    basePrice: 30,
    originalPrice: 120,
    delivery: "3-4 días",
    badge: "75% OFF",
    bullets: ["Panel hecho a tu medida", "Clientes e inventario a un clic", "Registros seguros en la nube"],
    extras: [
      { name: "Panel de administración", price: 12 },
      { name: "Multiusuario", price: 10 },
      { name: "Exportar a CSV", price: 6 },
      { name: "Gráficos mensuales", price: 8 },
      { name: "Historial de movimientos", price: 5 },
      { name: "Tema oscuro/claro", price: 4 }
    ]
  },
  {
    name: "Dashboard con datos en vivo",
    section: "dinamicos",
    size: "full",
    tagline: "<span class=\"hl\">Tus números en vivo</span>: métricas y gráficos que se actualizan solos, desde cualquier dispositivo.",
    basePrice: 30,
    originalPrice: 120,
    delivery: "3-4 días",
    badge: "75% OFF",
    bullets: ["Métricas al minuto", "Gráficos en tiempo real", "Acceso desde PC y móvil"],
    extras: [
      { name: "Gráficos avanzados", price: 8 },
      { name: "Login con roles", price: 10 },
      { name: "Exportar a CSV", price: 6 },
      { name: "Actualización automática", price: 8 },
      { name: "Panel de administración", price: 12 },
      { name: "Tema oscuro/claro", price: 4 }
    ]
  },

  // ── Sección 3 · Chatbot y automatizaciones ───────────────────────────────
  {
    name: "Chatbot para WhatsApp",
    section: "bots",
    size: "wide",
    tagline: "Atiende a tus clientes <span class=\"hl\">las 24 horas, todos los días</span>, sin levantar un dedo. Nunca pierdes una venta.",
    basePrice: 20,
    originalPrice: 80,
    delivery: "2 días",
    badge: "75% OFF",
    bullets: ["Respuestas automáticas 24/7", "Menú de opciones claro", "Pasa la conversación a humano"],
    extras: [
      { name: "Respuestas personalizadas", price: 8 },
      { name: "Bienvenida automática", price: 4 },
      { name: "Horario de atención", price: 4 },
      { name: "Encuesta de satisfacción", price: 5 },
      { name: "Notificaciones a WhatsApp", price: 5 },
      { name: "Tema oscuro/claro", price: 4 }
    ]
  },
  {
    name: "Automatizaciones",
    section: "bots",
    size: "wide",
    tagline: "Las tareas repetitivas dejan de robarte tiempo: <span class=\"hl\">flujos que trabajan por ti</span>, solos.",
    basePrice: 30,
    originalPrice: 120,
    delivery: "4 días",
    badge: "75% OFF",
    bullets: ["Recordatorios y notificaciones", "Formularios conectados a tu flujo", "Reportes automáticos periódicos"],
    extras: [
      { name: "Integración con Google Sheets", price: 8 },
      { name: "Recordatorios automáticos", price: 6 },
      { name: "Correos automáticos", price: 6 },
      { name: "Formularios conectados", price: 8 },
      { name: "Reportes automáticos", price: 8 },
      { name: "Notificaciones a WhatsApp", price: 5 }
    ]
  }
];

// Las secciones ordenan el catálogo en pantalla: estáticas → dinámicas → bots
const sections = [
  {
    id: "estaticos",
    title: "Webs estáticas",
    description: "Sitios rápidos sin base de datos, listos en días."
  },
  {
    id: "dinamicos",
    title: "Webs dinámicas con base de datos",
    description: "Tu información guardada en la nube: Cloudflare + D1."
  },
  {
    id: "bots",
    title: "Chatbot y automatizaciones",
    description: "Atiende clientes y automatiza tareas 24/7."
  }
];

if (typeof module !== 'undefined') {
  module.exports = { services, sections };
}
