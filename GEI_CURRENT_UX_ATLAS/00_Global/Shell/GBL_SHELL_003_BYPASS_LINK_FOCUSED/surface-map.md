# SURFACE MAP — GBL_SHELL_003_BYPASS_LINK_FOCUSED

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# GBL_SHELL_003_BYPASS_LINK_FOCUSED

**SCREEN ID:** GBL_SHELL_003_BYPASS_LINK_FOCUSED

**DOMAIN:** 00_Global

**SURFACE NAME:** Enlace de salto al contenido, enfocado

**PURPOSE AS IMPLEMENTED:** Primer elemento tabulable del Shell. En reposo es invisible (sr-only); al recibir foco se convierte en un botón oscuro fijo en la esquina superior izquierda.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /home

**ORIGIN:** Shell

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** actor=coach

**RESOURCE STATE:** AUTHENTICATED · elemento con foco

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /home?demo=coach.
2. Poner el foco sobre el primer <a href="#contenido">: document.querySelector('a[href="#contenido"]').focus().

**RELATED SCREEN IDS:** GBL_SHELL_001_TOPBAR_MOBILE

**RESPONSIVE COUNTERPART:** El enlace usa focus:left-4 focus:top-4: misma posición en 390 y 1440.

**SOURCE FILES:** src/app/Shell.tsx

**SOURCE SYMBOLS:** Shell > a[href=#contenido]

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_SHELL_003_BYPASS_LINK_FOCUSED_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Botón «Ir al contenido» (único elemento visible por foco)
- **FOCAL 2:** —
- **SUPPORTING:** Resto de la página desenfocada por el fondo translúcido del botón
- **SECONDARY:** —
- **AMBIENT:** TopBar y BottomNav

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | SkipLink | a (sr-only → visible al enfocar) | Acceso rápido al contenido principal |

### C01 — SkipLink

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** a (sr-only → visible al enfocar)
- **INSTANCE / ROLE:** Acceso rápido al contenido principal
- **SOURCE COMPONENT:** Shell
- **SOURCE FILE:** src/app/Shell.tsx
- **SOURCE SYMBOL:** Shell > a[href=#contenido]
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=-1 y=-1 w=1 h=1
- CSS: width: 1px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- absolute

#### CONSTRAINTS

- width 1px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px · margin: -1px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=-1 dy=-1 · padre 390×1306.7
- aligned with parent left edge
- positioned absolute · z-index auto

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Ir al contenido"

#### STATE

- focused (sr-only focus:not-sr-only)

#### INTERACTION

- trigger: Tab desde el inicio del documento → aparece
- trigger: Enter → desplaza al ancla #contenido (el <main id="contenido">)

#### MOTION

- Sin transición declarada

#### RESPONSIVE

- 390: fixed left-4 top-4
- 1440: fixed left-4 top-4

#### IMPLEMENTATION NOTES

- En reposo ocupa 1×1 px en (0,0) por sr-only (position:absolute; width:1px; height:1px; overflow:hidden).
- z-index 50 al enfocarse: por debajo de Modal/Sheet (también z-50, orden de DOM posterior).

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: Al enfocarse pasa a position: fixed (focus:fixed)
- initial scroll: scrollY = 0
- scroll restoration observed: n/a
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 1307 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: no hay diferencia de composición; es el mismo elemento con las mismas utilidades focus:*.

# GBL_SHELL_003_BYPASS_LINK_FOCUSED

**SCREEN ID:** GBL_SHELL_003_BYPASS_LINK_FOCUSED

**DOMAIN:** 00_Global

**SURFACE NAME:** Enlace de salto al contenido, enfocado

**PURPOSE AS IMPLEMENTED:** Primer elemento tabulable del Shell. En reposo es invisible (sr-only); al recibir foco se convierte en un botón oscuro fijo en la esquina superior izquierda.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /home

**ORIGIN:** Shell

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** actor=coach

**RESOURCE STATE:** AUTHENTICATED · elemento con foco

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /home?demo=coach.
2. Poner el foco sobre el primer <a href="#contenido">: document.querySelector('a[href="#contenido"]').focus().

**RELATED SCREEN IDS:** GBL_SHELL_001_TOPBAR_MOBILE

**RESPONSIVE COUNTERPART:** El enlace usa focus:left-4 focus:top-4: misma posición en 390 y 1440.

**SOURCE FILES:** src/app/Shell.tsx

**SOURCE SYMBOLS:** Shell > a[href=#contenido]

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_SHELL_003_BYPASS_LINK_FOCUSED_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Botón «Ir al contenido» (único elemento visible por foco)
- **FOCAL 2:** —
- **SUPPORTING:** Resto de la página desenfocada por el fondo translúcido del botón
- **SECONDARY:** —
- **AMBIENT:** TopBar y BottomNav

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | SkipLink | a (sr-only → visible al enfocar) | Acceso rápido al contenido principal |

### C01 — SkipLink

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** a (sr-only → visible al enfocar)
- **INSTANCE / ROLE:** Acceso rápido al contenido principal
- **SOURCE COMPONENT:** Shell
- **SOURCE FILE:** src/app/Shell.tsx
- **SOURCE SYMBOL:** Shell > a[href=#contenido]
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=-1 y=-1 w=1 h=1
- CSS: width: 1px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- absolute

#### CONSTRAINTS

- width 1px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px · margin: -1px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=-1 dy=-1 · padre 1440×1225.36
- aligned with parent left edge
- positioned absolute · z-index auto

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Ir al contenido"

#### STATE

- focused (sr-only focus:not-sr-only)

#### INTERACTION

- trigger: Tab desde el inicio del documento → aparece
- trigger: Enter → desplaza al ancla #contenido (el <main id="contenido">)

#### MOTION

- Sin transición declarada

#### RESPONSIVE

- 390: fixed left-4 top-4
- 1440: fixed left-4 top-4

#### IMPLEMENTATION NOTES

- En reposo ocupa 1×1 px en (0,0) por sr-only (position:absolute; width:1px; height:1px; overflow:hidden).
- z-index 50 al enfocarse: por debajo de Modal/Sheet (también z-50, orden de DOM posterior).

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: Al enfocarse pasa a position: fixed (focus:fixed)
- initial scroll: scrollY = 0
- scroll restoration observed: n/a
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 1225 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: no hay diferencia de composición; es el mismo elemento con las mismas utilidades focus:*.
