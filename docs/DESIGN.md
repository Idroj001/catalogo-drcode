# DESIGN.md

## Color
- Tokens en `:root` y `[data-theme="dark"]` (`styles.css`). Ningún hex fuera de esos bloques.
- Paleta alineada con web/landing: `--green-accent: #007f4f`, `--green-text: #00663f` (`#39ff75` en oscuro), `--green-neon: #39ff75`.
- `--green-neon` solo en hovers y acentos decorativos. Texto verde usa `--green-text` / `--matrix-green`.
- Sobre `--green-accent` el texto usa `--on-accent`; sobre `--green-neon` usa `--on-neon`.
- Superficies: `--surface`, `--surface-hover`, `--surface-strong`, `--border`, `--border-strong`.
- Estrategia: **Restrained** con un acento verde. La identidad la cargan el canvas matrix, la tipografía y el microcopy.

## Typography
- VT323 (400): todo el sitio (cuerpo, títulos, precios, botones, badges), idéntico a `web`. Cuerpo 18px/1.6; `p` 1rem/1.7; nav y botones 1.1rem; títulos de tarjeta con el `clamp()` de `h3` de web. Peso único 400 (sin faux bold). La escala completa vive en el `AGENTS.md` del workspace root.
- Jerarquía por escala (VT323 solo tiene un peso); cuerpo a 62–72ch como máximo en bloques de texto.

## Layout
- `main` max 1400px, grid fijo 3/2/1 columnas (1024 / 640 px, además 768 px fuerza 1 columna).
- Tarjetas: `flex-direction: column`, `min-height: 360px`, botón con `margin-top: auto`.
- El paquete (`.is-bundle`) se distingue con borde `--border-strong` y superficie `--surface-strong`.
- Header: logo a la izquierda con el markup de web (spans), navegación de la web, toggle de tema y carrito a la derecha; menú hamburguesa en móvil.
- Footer minimal fuera de `main`, mismo ancho y padding.

## Components
- `.service-card`: badge, título, tagline, precio anterior tachado + actual + USD, 3 bullets, entrega, botón.
- `.drawer`: panel lateral 450px (100% en móvil), superficie sólida, overlay con blur, `body.overflow` bloqueado al abrir.
- `.extra-item`: checkbox + label + precio a la derecha. El nombre del extra nunca incluye el precio.
- `.site-footer`: logo con el markup de web, enlace de regreso a la web principal, aviso USD/alcance.
- Logo: spans con VT323 (solo el logo); llaves en `--matrix-green` con glow `text-shadow` y letras en `--green-text`.

## Motion
- Solo `transform` y `opacity`. Curvas ease-out; sin rebote.
- Hovers de tarjetas, botones y navegación; caret del intro. Sin `fadeInUp` ni `badgePulse`.
- `prefers-reduced-motion` respetado en CSS y canvas.

## Constraints
- El canvas matrix es `pointer-events: none`.
- Verde neón nunca como color de texto.
- Los scripts usan `defer`; no hay build ni dependencias.