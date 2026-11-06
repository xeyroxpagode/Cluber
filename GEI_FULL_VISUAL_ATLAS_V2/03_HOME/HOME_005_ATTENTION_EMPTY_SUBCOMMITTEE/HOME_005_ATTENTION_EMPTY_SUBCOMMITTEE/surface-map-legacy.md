# SURFACE MAP — HOME_005_ATTENTION_EMPTY_SUBCOMMITTEE

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# HOME_005_ATTENTION_EMPTY_SUBCOMMITTEE

**SCREEN ID:** HOME_005_ATTENTION_EMPTY_SUBCOMMITTEE

**DOMAIN:** 01_Home

**SURFACE NAME:** Inicio — subcomisión, sin pendientes propios

**PURPOSE AS IMPLEMENTED:** La pantalla de inicio de la Subcomisión: sin acceso a gestión de personas ni a responder disponibilidad, el bloque de atención queda vacío.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /home

**ORIGIN:** Shell → destino «Inicio»

**ACTOR:** SUBCOMMITTEE

**RESOURCE / FIXTURE IDS:** actor=subcommittee

**RESOURCE STATE:** SUBCOMMITTEE · sin items de atención

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /home?demo=subcommittee.

**RELATED SCREEN IDS:** HOME_002_DEFAULT_ADMIN, CAL_EVENT_DETAIL_011_OFFICIAL_COORDINATION

**RESPONSIVE COUNTERPART:** Misma composición; el actor cambia el contenido del bloque de atención y los datos visibles.

**SOURCE FILES:** src/features/overview.tsx

**SOURCE SYMBOLS:** Home, buildAttention, visibleEvents

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `HOME_005_ATTENTION_EMPTY_SUBCOMMITTEE_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Saludo «Hola, Carolina»
- **FOCAL 2:** Bloque verde «No hay nada pendiente»
- **SUPPORTING:** Eventos del club (la Subcomisión ve todos: clubWide)
- **SECONDARY:** Comunicaciones
- **AMBIENT:** TopBar y barra lateral

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | AttentionSection (vacía) | section | Confirma ausencia de pendientes |
| C02 | EventRow (GEI vs. CUBA) | RowLink | Evento visible para la Subcomisión |

### C01 — AttentionSection (vacía)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section
- **INSTANCE / ROLE:** Confirma ausencia de pendientes
- **SOURCE COMPONENT:** AttentionSection
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** AttentionSection (items.length === 0)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=220.72 w=358 h=102.33
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 358px · gap: 12px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=131.72 · padre 358×898.78
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Necesita tu atención No hay nada pendiente Todo lo que dependía de vos está resu"

#### STATE

- vacío

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×102,33 px
- 1440: 1024 px

#### IMPLEMENTATION NOTES

- La Subcomisión no entra en ninguno de los seis tipos de ítem: no gestiona personas, no responde su propia disponibilidad y no convoca.

### C02 — EventRow (GEI vs. CUBA)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Evento visible para la Subcomisión
- **SOURCE COMPONENT:** RowLink + EventLine
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** EventLine
- **PARENT:** li
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=21 y=806.31 w=348 h=67.08
- CSS: width: 348px · min-width: 0px · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 348px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px

#### SPATIAL RELATIONSHIPS

- contained-by li · offset dx=0 dy=0 · padre 348×67.08
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "GEI vs. CUBA Sexta A · GEI · Cancha de hockey 18:00 mar, 27 oct"

#### STATE

- idle

#### INTERACTION

- trigger: click → /events/match-cuba

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 348×67,08 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- La Subcomisión tiene alcance CLUB: visibleEvents le devuelve todos los eventos.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1100 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# HOME_005_ATTENTION_EMPTY_SUBCOMMITTEE

**SCREEN ID:** HOME_005_ATTENTION_EMPTY_SUBCOMMITTEE

**DOMAIN:** 01_Home

**SURFACE NAME:** Inicio — subcomisión, sin pendientes propios

**PURPOSE AS IMPLEMENTED:** La pantalla de inicio de la Subcomisión: sin acceso a gestión de personas ni a responder disponibilidad, el bloque de atención queda vacío.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /home

**ORIGIN:** Shell → destino «Inicio»

**ACTOR:** SUBCOMMITTEE

**RESOURCE / FIXTURE IDS:** actor=subcommittee

**RESOURCE STATE:** SUBCOMMITTEE · sin items de atención

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /home?demo=subcommittee.

**RELATED SCREEN IDS:** HOME_002_DEFAULT_ADMIN, CAL_EVENT_DETAIL_011_OFFICIAL_COORDINATION

**RESPONSIVE COUNTERPART:** Misma composición; el actor cambia el contenido del bloque de atención y los datos visibles.

**SOURCE FILES:** src/features/overview.tsx

**SOURCE SYMBOLS:** Home, buildAttention, visibleEvents

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `HOME_005_ATTENTION_EMPTY_SUBCOMMITTEE_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Saludo «Hola, Carolina»
- **FOCAL 2:** Bloque verde «No hay nada pendiente»
- **SUPPORTING:** Eventos del club (la Subcomisión ve todos: clubWide)
- **SECONDARY:** Comunicaciones
- **AMBIENT:** TopBar y barra lateral

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | AttentionSection (vacía) | section | Confirma ausencia de pendientes |
| C02 | EventRow (GEI vs. CUBA) | RowLink | Evento visible para la Subcomisión |

### C01 — AttentionSection (vacía)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section
- **INSTANCE / ROLE:** Confirma ausencia de pendientes
- **SOURCE COMPONENT:** AttentionSection
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** AttentionSection (items.length === 0)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=320 y=220.72 w=1024 h=102.33
- CSS: width: 1024px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 1024px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 1024px · gap: 12px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=131.72 · padre 1024×882.83
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Necesita tu atención No hay nada pendiente Todo lo que dependía de vos está resu"

#### STATE

- vacío

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×102,33 px
- 1440: 1024 px

#### IMPLEMENTATION NOTES

- La Subcomisión no entra en ninguno de los seis tipos de ítem: no gestiona personas, no responde su propia disponibilidad y no convoca.

### C02 — EventRow (GEI vs. CUBA)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Evento visible para la Subcomisión
- **SOURCE COMPONENT:** RowLink + EventLine
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** EventLine
- **PARENT:** li
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=325 y=790.36 w=1014 h=67.08
- CSS: width: 1014px · min-width: 0px · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 1014px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px

#### SPATIAL RELATIONSHIPS

- contained-by li · offset dx=0 dy=0 · padre 1014×67.08
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "GEI vs. CUBA Sexta A · GEI · Cancha de hockey 18:00 mar, 27 oct"

#### STATE

- idle

#### INTERACTION

- trigger: click → /events/match-cuba

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 348×67,08 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- La Subcomisión tiene alcance CLUB: visibleEvents le devuelve todos los eventos.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1036 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
