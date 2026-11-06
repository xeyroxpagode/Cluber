# SURFACE MAP — GBL_STATE_001_NOT_FOUND

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# GBL_STATE_001_NOT_FOUND

**SCREEN ID:** GBL_STATE_001_NOT_FOUND

**DOMAIN:** 00_Global

**SURFACE NAME:** Página no encontrada (ruta inexistente)

**PURPOSE AS IMPLEMENTED:** Catch-all del router: mensaje de página no encontrada con la misma gramática de estado vacío que el resto del producto.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /ruta-inexistente

**ORIGIN:** cualquiera (ruta no reconocida)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** RUTA NO RECONOCIDA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /ruta-inexistente?demo=coach.

**RELATED SCREEN IDS:** GBL_SEARCH_003_NO_RESULTS

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports. El Empty no declara max-width propio: se renderiza dentro del <main> con el padding global.

**SOURCE FILES:** src/app/App.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** router path="*", Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_STATE_001_NOT_FOUND_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «Página no encontrada»
- **FOCAL 2:** Detalle «Volvé al inicio para continuar con GEI Hockey.»
- **SUPPORTING:** Ícono
- **SECONDARY:** —
- **AMBIENT:** TopBar y BottomNav

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NotFoundEmpty | Empty | Estado de ruta inexistente |

### C01 — NotFoundEmpty

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado de ruta inexistente
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** main
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=89 w=358 h=143.08
- CSS: width: 358px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width 0px, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 316px · gap: 12px · padding: 32px 20px

#### SPATIAL RELATIONSHIPS

- contained-by main · offset dx=16 dy=24 · padre 390×279.08

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Página no encontrada Volvé al inicio para continuar con GEI Hockey."

#### STATE

- empty

#### INTERACTION

- No interactivo: no hay enlace de salida dentro del estado vacío

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: ancho del <main> menos padding
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky, BottomNav fixed
- initial scroll: scrollY = 0
- scroll restoration observed: n/a
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el <main> aplica px-4 en 390 y px-8 (lg:px-8) en 1440; el bloque vacío se estira a ese ancho.

# GBL_STATE_001_NOT_FOUND

**SCREEN ID:** GBL_STATE_001_NOT_FOUND

**DOMAIN:** 00_Global

**SURFACE NAME:** Página no encontrada (ruta inexistente)

**PURPOSE AS IMPLEMENTED:** Catch-all del router: mensaje de página no encontrada con la misma gramática de estado vacío que el resto del producto.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /ruta-inexistente

**ORIGIN:** cualquiera (ruta no reconocida)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** RUTA NO RECONOCIDA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /ruta-inexistente?demo=coach.

**RELATED SCREEN IDS:** GBL_SEARCH_003_NO_RESULTS

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports. El Empty no declara max-width propio: se renderiza dentro del <main> con el padding global.

**SOURCE FILES:** src/app/App.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** router path="*", Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_STATE_001_NOT_FOUND_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «Página no encontrada»
- **FOCAL 2:** Detalle «Volvé al inicio para continuar con GEI Hockey.»
- **SUPPORTING:** Ícono
- **SECONDARY:** —
- **AMBIENT:** TopBar y BottomNav

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NotFoundEmpty | Empty | Estado de ruta inexistente |

### C01 — NotFoundEmpty

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado de ruta inexistente
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** main
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=256 y=89 w=1152 h=143.08
- CSS: width: 1152px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 1152px, min-width 0px, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 1110px · gap: 12px · padding: 32px 20px

#### SPATIAL RELATIONSHIPS

- contained-by main · offset dx=32 dy=24 · padre 1216×836

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Página no encontrada Volvé al inicio para continuar con GEI Hockey."

#### STATE

- empty

#### INTERACTION

- No interactivo: no hay enlace de salida dentro del estado vacío

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: ancho del <main> menos padding
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky, BottomNav fixed
- initial scroll: scrollY = 0
- scroll restoration observed: n/a
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el <main> aplica px-4 en 390 y px-8 (lg:px-8) en 1440; el bloque vacío se estira a ese ancho.
