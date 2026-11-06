# SURFACE MAP — MGT_HOME_001_ADMIN

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_HOME_001_ADMIN

**SCREEN ID:** MGT_HOME_001_ADMIN

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Administración — hub (ADMIN)

**PURPOSE AS IMPLEMENTED:** Hub de administración del club: personas, estructura y competencias, con un banner de altas pendientes.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management

**ORIGIN:** Más → «Personas» / «Estructura del club» / «Competencias»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p16 (cuenta pendiente), p17 (perfil incompleto)

**RESOURCE STATE:** ADMIN · 3 accesos

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management?demo=admin.

**RELATED SCREEN IDS:** MGT_HOME_002_SUBCOMMITTEE, MGT_HOME_003_DENIED_COACH

**RESPONSIVE COUNTERPART:** Contenedor max-w-4xl (896 px) en ambos viewports.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** ManagementHome, Banner, RowLink, PageContextHeader

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_HOME_001_ADMIN_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Banner ámbar «Hay pendientes de alta»
- **FOCAL 2:** Filas de los tres accesos
- **SUPPORTING:** Título «Administración del club»
- **SECONDARY:** Lead del encabezado
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PendingBanner | Banner tone=attention | Resume las altas pendientes |
| C02 | AdminLinkRow (Personas) | RowLink | Acceso a la gestión de personas |

### C01 — PendingBanner

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Banner tone=attention
- **INSTANCE / ROLE:** Resume las altas pendientes
- **SOURCE COMPONENT:** Banner
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Banner tone=attention
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=243.22 w=358 h=103.06
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 12px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=154.22 · padre 358×500.2
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(253, 241, 226) · color: rgb(16, 23, 37) · border: 1px solid rgb(240, 211, 171) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-info mt-0.5 shrink-0 text-attention (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Hay pendientes de alta 1 persona tiene el perfil incompleto. 1 cuenta espera act"

#### STATE

- attention

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px, 2 líneas
- 1440: 896 px, 1 línea

#### IMPLEMENTATION NOTES

- El texto concatena dos frases: «{n} personas tienen el perfil incompleto. {m} cuentas esperan activación.»
- El banner sólo se renderiza si hay alguna persona incompleta o alguna cuenta pendiente, y sólo para quien puedeManagePeople.

### C02 — AdminLinkRow (Personas)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Acceso a la gestión de personas
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/management.tsx
- **SOURCE SYMBOL:** ManagementHome > RowLink
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=390.28 w=358 h=63.64
- CSS: width: 358px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×198.92
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Personas 21 personas · altas, cuentas y roles"

#### STATE

- idle

#### INTERACTION

- trigger: click → /management/people

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: 896 px

#### IMPLEMENTATION NOTES

- El detalle es «{n} personas · altas, cuentas y roles».

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: la lista de accesos es de una columna en ambos viewports.

# MGT_HOME_001_ADMIN

**SCREEN ID:** MGT_HOME_001_ADMIN

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Administración — hub (ADMIN)

**PURPOSE AS IMPLEMENTED:** Hub de administración del club: personas, estructura y competencias, con un banner de altas pendientes.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management

**ORIGIN:** Más → «Personas» / «Estructura del club» / «Competencias»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p16 (cuenta pendiente), p17 (perfil incompleto)

**RESOURCE STATE:** ADMIN · 3 accesos

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management?demo=admin.

**RELATED SCREEN IDS:** MGT_HOME_002_SUBCOMMITTEE, MGT_HOME_003_DENIED_COACH

**RESPONSIVE COUNTERPART:** Contenedor max-w-4xl (896 px) en ambos viewports.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** ManagementHome, Banner, RowLink, PageContextHeader

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_HOME_001_ADMIN_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Banner ámbar «Hay pendientes de alta»
- **FOCAL 2:** Filas de los tres accesos
- **SUPPORTING:** Título «Administración del club»
- **SECONDARY:** Lead del encabezado
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PendingBanner | Banner tone=attention | Resume las altas pendientes |
| C02 | AdminLinkRow (Personas) | RowLink | Acceso a la gestión de personas |

### C01 — PendingBanner

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Banner tone=attention
- **INSTANCE / ROLE:** Resume las altas pendientes
- **SOURCE COMPONENT:** Banner
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Banner tone=attention
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=220.72 w=896 h=81.38
- CSS: width: 896px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 896px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 12px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=131.72 · padre 896×456.02
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(253, 241, 226) · color: rgb(16, 23, 37) · border: 1px solid rgb(240, 211, 171) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-info mt-0.5 shrink-0 text-attention (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Hay pendientes de alta 1 persona tiene el perfil incompleto. 1 cuenta espera act"

#### STATE

- attention

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px, 2 líneas
- 1440: 896 px, 1 línea

#### IMPLEMENTATION NOTES

- El texto concatena dos frases: «{n} personas tienen el perfil incompleto. {m} cuentas esperan activación.»
- El banner sólo se renderiza si hay alguna persona incompleta o alguna cuenta pendiente, y sólo para quien puedeManagePeople.

### C02 — AdminLinkRow (Personas)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Acceso a la gestión de personas
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/management.tsx
- **SOURCE SYMBOL:** ManagementHome > RowLink
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=346.09 w=896 h=63.64
- CSS: width: 896px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 896px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 896×198.92
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Personas 21 personas · altas, cuentas y roles"

#### STATE

- idle

#### INTERACTION

- trigger: click → /management/people

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: 896 px

#### IMPLEMENTATION NOTES

- El detalle es «{n} personas · altas, cuentas y roles».

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: la lista de accesos es de una columna en ambos viewports.
