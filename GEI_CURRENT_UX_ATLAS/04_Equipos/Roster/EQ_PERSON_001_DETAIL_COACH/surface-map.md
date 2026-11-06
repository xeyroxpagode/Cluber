# SURFACE MAP — EQ_PERSON_001_DETAIL_COACH

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# EQ_PERSON_001_DETAIL_COACH

**SCREEN ID:** EQ_PERSON_001_DETAIL_COACH

**DOMAIN:** 04_Equipos

**SURFACE NAME:** Persona — ficha de lectura (COACH)

**PURPOSE AS IMPLEMENTED:** Ficha pública de una persona dentro del club: identidad, contacto según autoridad, roles y equipos. La PII sensible depende del actor.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /people/p2

**ORIGIN:** Equipo → pestaña Personas → click en una persona

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** p2 (Lucía Fernández)

**RESOURCE STATE:** ACCOUNT ACTIVE · PLAYER de Sexta A

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /people/p2?demo=coach.

**RELATED SCREEN IDS:** EQ_PERSON_002_DETAIL_ADMIN, EQ_PERSON_003_DETAIL_STRANGER

**RESPONSIVE COUNTERPART:** Contenedor max-w-3xl (768 px) en ambos viewports.

**SOURCE FILES:** src/features/overview.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** PersonDetail, DetailSection, RowStatic, StateBadge, PageContextHeader

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `EQ_PERSON_001_DETAIL_COACH_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Nombre de la persona con el badge de cuenta
- **FOCAL 2:** Sección «Identidad»
- **SUPPORTING:** Roles y alcance
- **SECONDARY:** Equipos
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PageContextHeader (Persona) | header grid con back y action | Nombre y estado de la cuenta |
| C02 | IdentityRows | dl con RowStatic | Datos de identidad visibles según la autoridad |

### C01 — PageContextHeader (Persona)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid con back y action
- **INSTANCE / ROLE:** Nombre y estado de la cuenta
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

- contained-by div · offset dx=0 dy=0 · padre 390×844
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: oklab(0.999994 0.0000455678 0.0000200868 / 0.95) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "GEI Persona TB"

#### STATE

- idle

#### INTERACTION

- trigger: click en «Volver» → /teams

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: 768 px

#### IMPLEMENTATION NOTES

- —

### C02 — IdentityRows

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** dl con RowStatic
- **INSTANCE / ROLE:** Datos de identidad visibles según la autoridad
- **SOURCE COMPONENT:** RowStatic
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** PersonDetail > DetailSection «Identidad» > RowStatic
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=28 y=354.52 w=334 h=20.25
- CSS: width: 334px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 334px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 334×39.64
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 15px · line-height: 20.25px · font-weight: 650

#### CONTENT

- visible: "Contacto"

#### STATE

- el COACH no puede ver documento ni fecha de nacimiento

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px; el contacto se parte en 2 líneas
- 1440: 768 px

#### IMPLEMENTATION NOTES

- Las filas de documento y fecha de nacimiento sólo se renderizan si authority.canViewDni / canViewBirth, es decir sólo para el ADMIN.
- El contacto se oculta con el texto «No disponible para tu rol» cuando canViewContact es falso.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: la ficha usa max-w-3xl; a 390 quedan 358 px útiles y a 1440 los 768 px completos.
- El botón «Volver» de la cabecera apunta a /teams.

# EQ_PERSON_001_DETAIL_COACH

**SCREEN ID:** EQ_PERSON_001_DETAIL_COACH

**DOMAIN:** 04_Equipos

**SURFACE NAME:** Persona — ficha de lectura (COACH)

**PURPOSE AS IMPLEMENTED:** Ficha pública de una persona dentro del club: identidad, contacto según autoridad, roles y equipos. La PII sensible depende del actor.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /people/p2

**ORIGIN:** Equipo → pestaña Personas → click en una persona

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** p2 (Lucía Fernández)

**RESOURCE STATE:** ACCOUNT ACTIVE · PLAYER de Sexta A

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /people/p2?demo=coach.

**RELATED SCREEN IDS:** EQ_PERSON_002_DETAIL_ADMIN, EQ_PERSON_003_DETAIL_STRANGER

**RESPONSIVE COUNTERPART:** Contenedor max-w-3xl (768 px) en ambos viewports.

**SOURCE FILES:** src/features/overview.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** PersonDetail, DetailSection, RowStatic, StateBadge, PageContextHeader

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `EQ_PERSON_001_DETAIL_COACH_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Nombre de la persona con el badge de cuenta
- **FOCAL 2:** Sección «Identidad»
- **SUPPORTING:** Roles y alcance
- **SECONDARY:** Equipos
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PageContextHeader (Persona) | header grid con back y action | Nombre y estado de la cuenta |
| C02 | IdentityRows | dl con RowStatic | Datos de identidad visibles según la autoridad |

### C01 — PageContextHeader (Persona)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid con back y action
- **INSTANCE / ROLE:** Nombre y estado de la cuenta
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

- contained-by div · offset dx=0 dy=0 · padre 1440×901
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: oklab(0.999994 0.0000455678 0.0000200868 / 0.95) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Hockey Persona Buscar ⌘K TB"

#### STATE

- idle

#### INTERACTION

- trigger: click en «Volver» → /teams

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: 768 px

#### IMPLEMENTATION NOTES

- —

### C02 — IdentityRows

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** dl con RowStatic
- **INSTANCE / ROLE:** Datos de identidad visibles según la autoridad
- **SOURCE COMPONENT:** RowStatic
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** PersonDetail > DetailSection «Identidad» > RowStatic
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=460 y=319.52 w=744 h=20.25
- CSS: width: 744px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 744px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 744×39.64
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 15px · line-height: 20.25px · font-weight: 650

#### CONTENT

- visible: "Contacto"

#### STATE

- el COACH no puede ver documento ni fecha de nacimiento

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px; el contacto se parte en 2 líneas
- 1440: 768 px

#### IMPLEMENTATION NOTES

- Las filas de documento y fecha de nacimiento sólo se renderizan si authority.canViewDni / canViewBirth, es decir sólo para el ADMIN.
- El contacto se oculta con el texto «No disponible para tu rol» cuando canViewContact es falso.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: la ficha usa max-w-3xl; a 390 quedan 358 px útiles y a 1440 los 768 px completos.
- El botón «Volver» de la cabecera apunta a /teams.
