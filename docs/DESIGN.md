# DESIGN.md

## Color
- Tokens en `:root` y `html.dark` (`styles.css`). Ningún hex fuera de esos bloques.
- `--neon-green: #00ff41` solo en bordes, marcos y fondos de botones/badges. Texto verde usa `--matrix-green`.
- Sobre neón, el texto usa `--on-accent` (oscuro en ambos temas).
- Superficies: `--surface`, `--surface-alt`, `--surface-hover`, `--border`.
- Estrategia: **Restrained** con un acento neón. La identidad la cargan el canvas matrix, la tipografía y el microcopy, no bloques de color.

## Typography
- Orbitron (400/700/900): títulos, precios, botones, badges.
- DM Mono (300/400/500): cuerpo, extras, notas.
- Jerarquía por escala y peso; cuerpo a 62–72ch como máximo en bloques de texto.

## Layout
- `main` max 1400px, grid fijo 3/2/1 columnas (1024 / 640 px, además 768 px fuerza 1 columna).
- Tarjetas: `flex-direction: column`, `min-height: 360px`, botón con `margin-top: auto`.
- El paquete (`.is-bundle`) se distingue con borde `--matrix-green` y un lavado verde superior.
- Footer minimal fuera de `main`, mismo ancho y padding.

## Components
- `.service-card`: badge, título, tagline, precio anterior tachado + actual + USD, 3 bullets, entrega, botón.
- `.drawer`: panel lateral 450px (100% en móvil), overlay con blur, `body.overflow` bloqueado al abrir.
- `.extra-item`: checkbox + label + precio a la derecha. El nombre del extra nunca incluye el precio.
- `.site-footer`: logo, enlace de regreso a la web principal, aviso USD/alcance.

## Motion
- Solo `transform` y `opacity`. Curvas ease-out; sin rebote.
- `fadeInUp` escalonado por tarjeta, subrayados de hover, badge pulse, caret del intro.
- `prefers-reduced-motion` pendiente de implementar.

## Constraints
- El canvas matrix y las scanlines son `pointer-events: none`.
- Verde neón nunca como color de texto.
- Los scripts usan `defer`; no hay build ni dependencias.
