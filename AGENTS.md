# AGENTS.md

Service quotator for {Dr.Code}. Vanilla HTML/CSS/JS — no build, no frameworks, no `package.json`.

> **Estándares de diseño, tokens CSS y Sistema Tipográfico: ver el `AGENTS.md` del workspace root (`Proyectos/`).** Este archivo solo guarda el cableado crítico del repo. Resumen visual: VT323 en todo, logo de spans como web (llaves neón con glow), carrito de cotización en el header.

## Key patterns

- All catalog data lives in the `services` array of `data.js` — prices, extras, discounts, sections and delivery times, not in HTML. `data.js` is loaded before `quote.js` and `script.js`; the tests require it directly
- The catalog is grouped in **3 sections** declared in the `sections` array of `data.js` (`estaticos` → `dinamicos` → `bots`, in that order); each service carries a `section` id and a card `size` (`normal` = 2/6 columns, `wide` = 3/6, `full` = 6/6). `renderServices()` builds one `.catalog-section` per entry — don't reorder the `sections` array
- Prices are a **75% launch discount**: `originalPrice` is the reference price, `basePrice` is what the client pays (originalPrice × 0.25). Keep that ratio when adding services. Dynamic (database) and bot services are the $30/$120 tier
- Extras are passed to checkboxes via `data-price`; the cart uses the adjacent `<label>` text as the extra's name (structural coupling between markup and `addToCart()`)
- Dynamic sections rendered via `innerHTML`; event listeners are reattached after every render (`renderServices`, `updateCartDrawer`)
- Config at top of `script.js`: `WHATSAPP_NUMBER`. Checkout uses `buildWhatsAppUrl(cart, number)` from `quote.js`; never concatenate the message into the URL by hand

## Fragile styling/layout couplings

- `.services-grid`: 6-column grid, spans by card size (normal 2, wide 3, full 6; do not use `auto-fill`); at <=1024px normal/wide span 3 (two per row), at <=768px everything is 1 column with full-width `.drawer`. Section anchors need `scroll-margin-top` because the header is fixed
- Header: **sin nav** — logo a la izquierda y 3 íconos a la derecha (`.header-actions` con `margin-left: auto`): `.web-link` (globo → web principal), theme toggle y carrito; mismo estilo de ícono (24px, hover scale + chip). No hamburger ni menú móvil (eliminados). Los enlaces internos del catálogo son las anclas de sección del `main`
- `.service-card` needs `overflow: visible` — the badge sits at negative top/right offsets. Cards follow the **T standard**: title on top with a bottom border, left column = tagline + price (before/after), right column (`.service-meta`, border-left) = delivery + `> Incluye:` bullets; the whole card is clickable (`role="button"` + Enter/Space in `script.js`), no CTA button. The `.card-hint` (`> click para cotizar_`) pins to the bottom via `margin-top: auto`
- Footer: logo (spans, como web) a la izquierda, copyright al centro, accesos a WhatsApp/correo a la derecha (sin enlace de agendar). No duplicar el enlace de regreso

## Common issues to avoid

- Scripts use `defer` (`canvas.js` before `script.js`) and DOM elements are captured at top-level script scope — no DOMContentLoaded wrapper, so keep `defer` on both
- Drawers lock `body.overflow` on open; every open path must have its matching close handler (overlay click included)
- Cart badge only shows via `.show` class when `cart.length > 0`
- The footer email access is a `button.social-link#mailLink` that opens `.contact-modal` (form → FormSubmit AJAX to `jordy.mh_1994@hotmail.com`). Close paths: `×`, overlay click, `Escape`, "Listo" — every open path must have its close handler. `.contact-success[hidden]` must keep `display: none` (it overrides `display: flex`)
- The contact form's service `<select>` is populated from `data.js` (`renderContactServiceOptions`); adding a service adds it there automatically
- Classic scripts share the global lexical scope: never repeat a top-level `const`/`function` name across `data.js`, `quote.js` and `script.js` (a collision like `cartTotal` silently kills the whole page)
- Run the suite with `node --test test/catalog.test.js test/quote.test.js` (Node on Windows does not expand `node --test test/`)
