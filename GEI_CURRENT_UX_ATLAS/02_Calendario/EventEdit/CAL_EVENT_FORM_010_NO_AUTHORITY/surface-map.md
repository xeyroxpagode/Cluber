# SURFACE MAP — CAL_EVENT_FORM_010_NO_AUTHORITY

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_EVENT_FORM_010_NO_AUTHORITY

**SCREEN ID:** CAL_EVENT_FORM_010_NO_AUTHORITY

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Edición de evento — sin autoridad

**PURPOSE AS IMPLEMENTED:** Estado de acceso denegado al abrir el formulario de edición de un evento sobre el que el actor no tiene alcance.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-septima-quinta/edit

**ORIGIN:** enlace directo a la ruta de edición

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** match-septima-quinta (equipo septima)

**RESOURCE STATE:** SIN ALCANCE DE EDICIÓN

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-septima-quinta/edit?demo=player.

**RELATED SCREEN IDS:** CAL_EVENT_FORM_005_EDIT

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** EventForm (!canEditThis) > Empty, Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_FORM_010_NO_AUTHORITY_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «No podés editar este evento»
- **FOCAL 2:** Detalle con la indicación de a quién pedirlo
- **SUPPORTING:** Ícono
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NoAuthorityEmpty | Empty | Estado de acceso denegado |

### C01 — NoAuthorityEmpty

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado de acceso denegado
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=89 w=358 h=160.47
- CSS: width: 358px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width 0px, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 316px · gap: 12px · padding: 32px 20px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×160.47
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "No podés editar este evento Tu rol no tiene alcance sobre este equipo o evento. "

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

- Detalle: «Tu rol no tiene alcance sobre este equipo o evento. Pedile a la Subcomisión o al entrenador.»

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el bloque no declara max-width propio.

# CAL_EVENT_FORM_010_NO_AUTHORITY

**SCREEN ID:** CAL_EVENT_FORM_010_NO_AUTHORITY

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Edición de evento — sin autoridad

**PURPOSE AS IMPLEMENTED:** Estado de acceso denegado al abrir el formulario de edición de un evento sobre el que el actor no tiene alcance.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-septima-quinta/edit

**ORIGIN:** enlace directo a la ruta de edición

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** match-septima-quinta (equipo septima)

**RESOURCE STATE:** SIN ALCANCE DE EDICIÓN

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-septima-quinta/edit?demo=player.

**RELATED SCREEN IDS:** CAL_EVENT_FORM_005_EDIT

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** EventForm (!canEditThis) > Empty, Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_FORM_010_NO_AUTHORITY_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «No podés editar este evento»
- **FOCAL 2:** Detalle con la indicación de a quién pedirlo
- **SUPPORTING:** Ícono
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NoAuthorityEmpty | Empty | Estado de acceso denegado |

### C01 — NoAuthorityEmpty

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado de acceso denegado
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=89 w=768 h=160.47
- CSS: width: 768px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 768px, min-width 0px, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 726px · gap: 12px · padding: 32px 20px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 768×160.47
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "No podés editar este evento Tu rol no tiene alcance sobre este equipo o evento. "

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

- Detalle: «Tu rol no tiene alcance sobre este equipo o evento. Pedile a la Subcomisión o al entrenador.»

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el bloque no declara max-width propio.
