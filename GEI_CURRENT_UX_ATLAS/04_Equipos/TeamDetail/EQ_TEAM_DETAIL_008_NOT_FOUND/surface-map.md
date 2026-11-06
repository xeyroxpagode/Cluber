# SURFACE MAP — EQ_TEAM_DETAIL_008_NOT_FOUND

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# EQ_TEAM_DETAIL_008_NOT_FOUND

**SCREEN ID:** EQ_TEAM_DETAIL_008_NOT_FOUND

**DOMAIN:** 04_Equipos

**SURFACE NAME:** Detalle de equipo — equipo inexistente

**PURPOSE AS IMPLEMENTED:** Estado de acceso denegado por identificador de equipo desconocido: es la forma alcanzable del Empty «Ese equipo no está en tu alcance».

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /teams/zzz

**ORIGIN:** enlace con un id de equipo inexistente

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** ID DE EQUIPO DESCONOCIDO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /teams/zzz?demo=player.

**RELATED SCREEN IDS:** EQ_TEAM_DETAIL_004_OUT_OF_SCOPE

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/overview.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** TeamDetail (!team) > Empty, Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `EQ_TEAM_DETAIL_008_NOT_FOUND_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «No llegaste a ese equipo»
- **FOCAL 2:** Mensaje «Ese equipo no está en tu alcance»
- **SUPPORTING:** Ícono
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | TeamNotFoundEmpty | Empty | Estado denegado por equipo inexistente |

### C01 — TeamNotFoundEmpty

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado denegado por equipo inexistente
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=190.22 w=358 h=160.47
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 316px · gap: 12px · padding: 32px 20px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=101.22 · padre 358×261.69
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Ese equipo no está en tu alcance Pedile a la administración que te lo asigne si "

#### STATE

- denied

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: ancho del <main> menos padding
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El encabezado conserva el contexto «Equipos» y el título «No llegaste a ese equipo».
- El detalle dice «Pedile a la administración que te lo asigne si lo necesitás.»

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.

# EQ_TEAM_DETAIL_008_NOT_FOUND

**SCREEN ID:** EQ_TEAM_DETAIL_008_NOT_FOUND

**DOMAIN:** 04_Equipos

**SURFACE NAME:** Detalle de equipo — equipo inexistente

**PURPOSE AS IMPLEMENTED:** Estado de acceso denegado por identificador de equipo desconocido: es la forma alcanzable del Empty «Ese equipo no está en tu alcance».

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /teams/zzz

**ORIGIN:** enlace con un id de equipo inexistente

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** ID DE EQUIPO DESCONOCIDO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /teams/zzz?demo=player.

**RELATED SCREEN IDS:** EQ_TEAM_DETAIL_004_OUT_OF_SCOPE

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/overview.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** TeamDetail (!team) > Empty, Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `EQ_TEAM_DETAIL_008_NOT_FOUND_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «No llegaste a ese equipo»
- **FOCAL 2:** Mensaje «Ese equipo no está en tu alcance»
- **SUPPORTING:** Ícono
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | TeamNotFoundEmpty | Empty | Estado denegado por equipo inexistente |

### C01 — TeamNotFoundEmpty

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado denegado por equipo inexistente
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=190.22 w=768 h=143.08
- CSS: width: 768px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 768px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 726px · gap: 12px · padding: 32px 20px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=101.22 · padre 768×244.3
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Ese equipo no está en tu alcance Pedile a la administración que te lo asigne si "

#### STATE

- denied

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: ancho del <main> menos padding
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El encabezado conserva el contexto «Equipos» y el título «No llegaste a ese equipo».
- El detalle dice «Pedile a la administración que te lo asigne si lo necesitás.»

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.
