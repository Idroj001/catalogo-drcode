# AGENTS.md

Service quotator for {Dr.Code}. Vanilla HTML/CSS/JS — no build, no frameworks, no `package.json`.

> **Estándares de diseño, tokens CSS y Sistema Tipográfico: ver el `AGENTS.md` del workspace root (`Proyectos/`).** Este archivo solo guarda el cableado crítico del repo. Resumen visual: VT323 en todo, logo de spans como web (llaves neón con glow), carrito de cotización en el header.

## Key patterns

- All catalog data lives in the `services` array of `data.js` — prices, extras, discounts and delivery times, not in HTML. `data.js` is loaded before `quote.js` and `script.js`; the tests require it directly
- The bundle (Paquete Integral) is `services[5]`, referenced **by index** in `openServiceDrawer()`, `renderBundleExtras()`, etc. Don't reorder the array without checking these
- Prices are a **75% launch discount**: `originalPrice` is the reference price, `basePrice` is what the client pays (originalPrice × 0.25). Keep that ratio when adding services
- Bundle components are **object references** to `services[0]`, `[1]`, `[2]`, `[3]`, wired right after the array (`bundleService.includes`, `thirdOptions`). Edit a service once and the bundle picks it up
- Bundle price formula lives only in `quote.js`: `bundleBasePrice(thirdChoice, bases)` = 25% of the reference sum minus $15. `script.js` passes `getBundleBases()` in `calculateBundleBase()`, `updateServiceSubtotal()` and `addToCart()` — never inline the numbers again
- Extras are passed to checkboxes via `data-price`; the cart uses the adjacent `<label>` text as the extra's name (structural coupling between markup and `addToCart()`)
- Dynamic sections rendered via `innerHTML`; event listeners are reattached after every render (`renderServices`, `renderBundleExtras`, `updateCartDrawer`)
- Config at top of `script.js`: `WHATSAPP_NUMBER`. Checkout uses `buildWhatsAppUrl(cart, number)` from `quote.js`; never concatenate the message into the URL by hand

## Fragile styling/layout couplings

- `.services-grid`: fixed 3/2/1 columns at 1024px and 640px (do not use `auto-fill`); a 768px media query forces 1 column and full-width `.drawer`
- Header: nav visible above 1000px; at <=1000px it collapses to hamburger + dropdown. Nav links point to the deployed web plus the landing (`https://idroj001.github.io/DrCode-landing/`, between Skills and Contacto); theme toggle + cart stay in `.header-actions`
- `.service-card` needs `overflow: visible` — the badge sits at negative top/right offsets. Card symmetry: `flex-direction: column` + `min-height: 360px` + `margin-top: auto` on the button
- Footer: logo (spans, como web) a la izquierda, copyright al centro, accesos a WhatsApp/correo/agenda a la derecha. No duplicar el enlace de regreso

## Common issues to avoid

- Scripts use `defer` (`canvas.js` before `script.js`) and DOM elements are captured at top-level script scope — no DOMContentLoaded wrapper, so keep `defer` on both
- Drawers lock `body.overflow` on open; every open path must have its matching close handler (overlay click included)
- Cart badge only shows via `.show` class when `cart.length > 0`
- Classic scripts share the global lexical scope: never repeat a top-level `const`/`function` name across `data.js`, `quote.js` and `script.js` (a collision like `cartTotal` silently kills the whole page)
- Run the suite with `node --test test/catalog.test.js test/quote.test.js` (Node on Windows does not expand `node --test test/`)
