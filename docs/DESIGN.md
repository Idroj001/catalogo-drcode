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
- `main` max 1400px. El catálogo se agrupa en 3 secciones (`estaticos` → `dinamicos` → `bots`), cada una con heading (`> título` + descripción) y su propia grilla.
- `.services-grid`: 6 columnas; tarjetas `normal` = span 2, `wide` = span 3, `full` = span 6 (dashboard). A 1024px normales/anchas van a span 3 (dos por fila); a 768px todo a 1 columna. Anclas de sección con `scroll-margin-top` por el header fijo.
- Tarjetas: `flex-direction: column`, `min-height: 360px` (300px las anchas, 260px la completa), botón con `margin-top: auto`. Las anchas/completas pintan los bullets en 2 columnas para aprovechar el espacio.
- Navegación de secciones bajo el intro: chips `# título` con anclas suaves (`scroll-behavior: smooth`).
- Header: logo a la izquierda con el markup de web (spans), navegación de la web, toggle de tema y carrito a la derecha; menú hamburguesa en móvil.
- Footer minimal fuera de `main`, mismo ancho y padding.

## Components
- `.service-card` (estándar tipo T, toda clicable con `role="button"`): badge, título con borde inferior, columna izquierda (tagline + precio anterior tachado + actual + USD), columna derecha con borde (`> Entrega:` + `> Incluye:` + bullets), hint `> click para cotizar_` parpadeante abajo. Sin botón CTA.
- `.drawer`: panel lateral 450px (100% en móvil), superficie sólida, overlay con blur, `body.overflow` bloqueado al abrir, aviso de la promo de 1 extra gratis.
- `.extra-item`: checkbox + label + precio a la derecha. El nombre del extra nunca incluye el precio; el más caro seleccionado se marca `GRATIS`.
- `.site-footer`: logo con el markup de web, enlace de regreso a la web principal; accesos a WhatsApp y correo (sin agendar cita). El botón de correo abre `.contact-modal` (nombre, apellido, teléfono, correo, servicio de interés, mensaje) que envía por FormSubmit AJAX a jordy.mh_1994@hotmail.com; panel de éxito con caret parpadeante y cierre por `×`/overlay/Escape/"Listo".
- Logo: spans con VT323 (solo el logo); llaves en `--matrix-green` con glow `text-shadow` y letras en `--green-text`.

## Motion
- Solo `transform` y `opacity`. Curvas ease-out; sin rebote.
- Hovers de tarjetas, botones y navegación; caret del intro. Sin `fadeInUp` ni `badgePulse`.
- `prefers-reduced-motion` respetado en CSS y canvas.

## Constraints
- El canvas matrix es `pointer-events: none`.
- Verde neón nunca como color de texto.
- Los scripts usan `defer`; no hay build ni dependencias.