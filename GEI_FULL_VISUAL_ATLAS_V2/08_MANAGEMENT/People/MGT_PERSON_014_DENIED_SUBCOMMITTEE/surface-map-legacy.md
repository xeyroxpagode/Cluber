# SURFACE MAP — MGT_PERSON_014_DENIED_SUBCOMMITTEE

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_PERSON_014_DENIED_SUBCOMMITTEE

**SCREEN ID:** MGT_PERSON_014_DENIED_SUBCOMMITTEE

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Ficha de persona — sin acceso (SUBCOMMITTEE)

**PURPOSE AS IMPLEMENTED:** Estado de acceso denegado en la ficha administrativa de personas para la Subcomisión.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/people/p2

**ORIGIN:** URL directa (actor SUBCOMMITTEE)

**ACTOR:** SUBCOMMITTEE

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** SIN ACCESO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/p2?demo=subcommittee.

**RELATED SCREEN IDS:** MGT_PERSON_001_IDENTIDAD, MGT_HOME_002_SUBCOMMITTEE

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** PersonAdminDetail (!canOpen('people')) > Empty, Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PERSON_014_DENIED_SUBCOMMITTEE_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «No tenés acceso a las fichas de personas»
- **FOCAL 2:** Detalle «Reservado a administración.»
- **SUPPORTING:** Ícono
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NoPersonAdminAccessEmpty | Empty | Estado de acceso denegado |

### C01 — NoPersonAdminAccessEmpty

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado de acceso denegado
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
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

- contained-by div · offset dx=0 dy=0 · padre 358×143.08
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "No tenés acceso a las fichas de personas Reservado a administración."

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

- canOpen('people') = admin: la Subcomisión no administra personas, cuentas ni estructura.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 poruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.

# MGT_PERSON_014_DENIED_SUBCOMMITTEE

**SCREEN ID:** MGT_PERSON_014_DENIED_SUBCOMMITTEE

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Ficha de persona — sin acceso (SUBCOMMITTEE)

**PURPOSE AS IMPLEMENTED:** Estado de acceso denegado en la ficha administrativa de personas para la Subcomisión.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/people/p2

**ORIGIN:** URL directa (actor SUBCOMMITTEE)

**ACTOR:** SUBCOMMITTEE

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** SIN ACCESO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/p2?demo=subcommittee.

**RELATED SCREEN IDS:** MGT_PERSON_001_IDENTIDAD, MGT_HOME_002_SUBCOMMITTEE

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** PersonAdminDetail (!canOpen('people')) > Empty, Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PERSON_014_DENIED_SUBCOMMITTEE_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «No tenés acceso a las fichas de personas»
- **FOCAL 2:** Detalle «Reservado a administración.»
- **SUPPORTING:** Ícono
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NoPersonAdminAccessEmpty | Empty | Estado de acceso denegado |

### C01 — NoPersonAdminAccessEmpty

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado de acceso denegado
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=89 w=768 h=143.08
- CSS: width: 768px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 768px, min-width 0px, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 726px · gap: 12px · padding: 32px 20px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 768×143.08
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "No tenés acceso a las fichas de personas Reservado a administración."

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

- canOpen('people') = admin: la Subcomisión no administra personas, cuentas ni estructura.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 poruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.
