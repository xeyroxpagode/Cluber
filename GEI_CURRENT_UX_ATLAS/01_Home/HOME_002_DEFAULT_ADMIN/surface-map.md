# SURFACE MAP — HOME_002_DEFAULT_ADMIN

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# HOME_002_DEFAULT_ADMIN

**SCREEN ID:** HOME_002_DEFAULT_ADMIN

**DOMAIN:** 01_Home

**SURFACE NAME:** Inicio — administración (ADMIN)

**PURPOSE AS IMPLEMENTED:** La misma pantalla de inicio para el administrador. La sección «Necesita tu atención» pasa a listar altas pendientes y el bloque de comunicaciones desaparece para el ADMIN.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /home

**ORIGIN:** Shell → destino «Inicio»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** actor=admin, p16 (cuenta pendiente), p17 (perfil incompleto)

**RESOURCE STATE:** ADMIN · 2 items de atención

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /home?demo=admin.

**RELATED SCREEN IDS:** HOME_003_ATTENTION_ITEMS_ADMIN, HOME_001_DEFAULT_COACH

**RESPONSIVE COUNTERPART:** Misma composición; el contenido de atención es el que cambia por actor.

**SOURCE FILES:** src/features/overview.tsx

**SOURCE SYMBOLS:** Home, AttentionSection, buildAttention

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `HOME_002_DEFAULT_ADMIN_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Saludo «Hola, Mariana»
- **FOCAL 2:** Sección «Necesita tu atención» con 2 ítems numerados
- **SUPPORTING:** Bloques Hoy y Próximamente
- **SECONDARY:** —
- **AMBIENT:** TopBar y barra lateral de destinos

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PageContextHeader | header grid | Saludo del administrador |
| C02 | AttentionSection con ítems | section grid + ul | Lista de hasta 3 pendientes con numeración y acción propia |

### C01 — PageContextHeader

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid
- **INSTANCE / ROLE:** Saludo del administrador
- **SOURCE COMPONENT:** PageContextHeader
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** PageContextHeader
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=0 w=390 h=65
- CSS: width: 390px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- sticky

#### CONSTRAINTS

- width 390px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 390×1356.83
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: oklab(0.999994 0.0000455678 0.0000200868 / 0.95) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "GEI Inicio MC"

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: una columna
- 1440: flex basis-64

#### IMPLEMENTATION NOTES

- —

### C02 — AttentionSection con ítems

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** section grid + ul
- **INSTANCE / ROLE:** Lista de hasta 3 pendientes con numeración y acción propia
- **SOURCE COMPONENT:** AttentionSection
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** AttentionSection (items.map)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=220.72 w=358 h=359.38
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 358px · gap: 12px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=131.72 · padre 358×1155.83
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Necesita tu atención 2 cosas 1 1 persona tiene el perfil incompleto. No se puede"

#### STATE

- 2 ítems: perfil incompleto (urgency=now) y cuentas pendientes (urgency=soon)

#### INTERACTION

- trigger: click en el botón de acción de cada ítem → la ruta que declara el ítem
- el ítem 0 (now) tiene botón primario bg-interactive; los siguientes, secundario con borde

#### MOTION

- transition-colors en los botones de acción

#### RESPONSIVE

- 390: cada ítem es una tarjeta con borde; el de urgencia now usa border-attention-line bg-attention-soft
- 1440: las tarjetas ocupan el ancho de la columna de 1024 px

#### IMPLEMENTATION NOTES

- El índice se muestra en un círculo de 20×20 px (size-5 rounded-pill) con bg-attention y texto blanco para urgency=now, bg-neutral-soft para los demás.
- El orden lo define la urgencia: now → soon → later, y se corta a 3 elementos (slice(0,3)).
- Los ítems son: perfil-incomplete, no-membership, pending-accounts, reconfirm, unanswered, selection-conflict.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1357 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: no cambia la estructura; los items de atención se apilan en 390 y se mantienen en una columna en 1440.

# HOME_002_DEFAULT_ADMIN

**SCREEN ID:** HOME_002_DEFAULT_ADMIN

**DOMAIN:** 01_Home

**SURFACE NAME:** Inicio — administración (ADMIN)

**PURPOSE AS IMPLEMENTED:** La misma pantalla de inicio para el administrador. La sección «Necesita tu atención» pasa a listar altas pendientes y el bloque de comunicaciones desaparece para el ADMIN.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /home

**ORIGIN:** Shell → destino «Inicio»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** actor=admin, p16 (cuenta pendiente), p17 (perfil incompleto)

**RESOURCE STATE:** ADMIN · 2 items de atención

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /home?demo=admin.

**RELATED SCREEN IDS:** HOME_003_ATTENTION_ITEMS_ADMIN, HOME_001_DEFAULT_COACH

**RESPONSIVE COUNTERPART:** Misma composición; el contenido de atención es el que cambia por actor.

**SOURCE FILES:** src/features/overview.tsx

**SOURCE SYMBOLS:** Home, AttentionSection, buildAttention

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `HOME_002_DEFAULT_ADMIN_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Saludo «Hola, Mariana»
- **FOCAL 2:** Sección «Necesita tu atención» con 2 ítems numerados
- **SUPPORTING:** Bloques Hoy y Próximamente
- **SECONDARY:** —
- **AMBIENT:** TopBar y barra lateral de destinos

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PageContextHeader | header grid | Saludo del administrador |
| C02 | AttentionSection con ítems | section grid + ul | Lista de hasta 3 pendientes con numeración y acción propia |

### C01 — PageContextHeader

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid
- **INSTANCE / ROLE:** Saludo del administrador
- **SOURCE COMPONENT:** PageContextHeader
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** PageContextHeader
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=0 w=1440 h=65
- CSS: width: 1440px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- sticky

#### CONSTRAINTS

- width 1440px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 1440×1249.5
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: oklab(0.999994 0.0000455678 0.0000200868 / 0.95) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Hockey Inicio Buscar ⌘K MC"

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: una columna
- 1440: flex basis-64

#### IMPLEMENTATION NOTES

- —

### C02 — AttentionSection con ítems

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** section grid + ul
- **INSTANCE / ROLE:** Lista de hasta 3 pendientes con numeración y acción propia
- **SOURCE COMPONENT:** AttentionSection
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** AttentionSection (items.map)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=320 y=220.72 w=1024 h=316
- CSS: width: 1024px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 1024px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 1024px · gap: 12px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=131.72 · padre 1024×1096.5
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Necesita tu atención 2 cosas 1 1 persona tiene el perfil incompleto. No se puede"

#### STATE

- 2 ítems: perfil incompleto (urgency=now) y cuentas pendientes (urgency=soon)

#### INTERACTION

- trigger: click en el botón de acción de cada ítem → la ruta que declara el ítem
- el ítem 0 (now) tiene botón primario bg-interactive; los siguientes, secundario con borde

#### MOTION

- transition-colors en los botones de acción

#### RESPONSIVE

- 390: cada ítem es una tarjeta con borde; el de urgencia now usa border-attention-line bg-attention-soft
- 1440: las tarjetas ocupan el ancho de la columna de 1024 px

#### IMPLEMENTATION NOTES

- El índice se muestra en un círculo de 20×20 px (size-5 rounded-pill) con bg-attention y texto blanco para urgency=now, bg-neutral-soft para los demás.
- El orden lo define la urgencia: now → soon → later, y se corta a 3 elementos (slice(0,3)).
- Los ítems son: perfil-incomplete, no-membership, pending-accounts, reconfirm, unanswered, selection-conflict.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1250 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: no cambia la estructura; los items de atención se apilan en 390 y se mantienen en una columna en 1440.
