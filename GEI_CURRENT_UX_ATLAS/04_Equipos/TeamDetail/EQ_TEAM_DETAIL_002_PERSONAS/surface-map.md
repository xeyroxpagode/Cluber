# SURFACE MAP — EQ_TEAM_DETAIL_002_PERSONAS

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# EQ_TEAM_DETAIL_002_PERSONAS

**SCREEN ID:** EQ_TEAM_DETAIL_002_PERSONAS

**DOMAIN:** 04_Equipos

**SURFACE NAME:** Detalle de equipo — pestaña Personas

**PURPOSE AS IMPLEMENTED:** Listado de las personas del equipo con sus roles deportivos y el alcance de cada rol.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /teams/sexta?tab=personas

**ORIGIN:** EQ_TEAM_DETAIL_001_EVENTOS → pestaña «Personas»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** sexta, p0..p7

**RESOURCE STATE:** 8 personas con roles vigentes

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /teams/sexta?tab=personas&demo=coach.

**RELATED SCREEN IDS:** EQ_TEAM_DETAIL_001_EVENTOS, EQ_PERSON_001_DETAIL_COACH

**RESPONSIVE COUNTERPART:** Filas de una columna en ambos viewports; el avatar acompaña al nombre.

**SOURCE FILES:** src/features/overview.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** TeamDetail > DetailSection «Personas del equipo», RowLink, Avatar

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `EQ_TEAM_DETAIL_002_PERSONAS_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Filas de personas con avatar y roles
- **FOCAL 2:** Contador «8 personas» en el encabezado de sección
- **SUPPORTING:** Pestañas del equipo
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | MemberRow | RowLink con Avatar | Persona del equipo y sus roles |

### C01 — MemberRow

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink con Avatar
- **INSTANCE / ROLE:** Persona del equipo y sus roles
- **SOURCE COMPONENT:** RowLink + Avatar
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** TeamDetail > RowLink (members)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=411.27 w=358 h=63.64
- CSS: width: 358px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×537.13
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "VB Victoria Berg Jugadora · Sexta A · Capitana · Sexta A"

#### STATE

- idle

#### INTERACTION

- trigger: click → /people/p0

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px; avatar 32×32 a x=28
- 1440: 1024 px

#### IMPLEMENTATION NOTES

- El detalle enumera los roles activos con el formato «{rol} · {alcance}», unidos por dos espacios y un punto.
- El alcance del rol se resuelve con roleScopeLabel: para un rol de equipo es «División Línea» (por ejemplo «Sexta A»).

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1060 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# EQ_TEAM_DETAIL_002_PERSONAS

**SCREEN ID:** EQ_TEAM_DETAIL_002_PERSONAS

**DOMAIN:** 04_Equipos

**SURFACE NAME:** Detalle de equipo — pestaña Personas

**PURPOSE AS IMPLEMENTED:** Listado de las personas del equipo con sus roles deportivos y el alcance de cada rol.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /teams/sexta?tab=personas

**ORIGIN:** EQ_TEAM_DETAIL_001_EVENTOS → pestaña «Personas»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** sexta, p0..p7

**RESOURCE STATE:** 8 personas con roles vigentes

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /teams/sexta?tab=personas&demo=coach.

**RELATED SCREEN IDS:** EQ_TEAM_DETAIL_001_EVENTOS, EQ_PERSON_001_DETAIL_COACH

**RESPONSIVE COUNTERPART:** Filas de una columna en ambos viewports; el avatar acompaña al nombre.

**SOURCE FILES:** src/features/overview.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** TeamDetail > DetailSection «Personas del equipo», RowLink, Avatar

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `EQ_TEAM_DETAIL_002_PERSONAS_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Filas de personas con avatar y roles
- **FOCAL 2:** Contador «8 personas» en el encabezado de sección
- **SUPPORTING:** Pestañas del equipo
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | MemberRow | RowLink con Avatar | Persona del equipo y sus roles |

### C01 — MemberRow

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink con Avatar
- **INSTANCE / ROLE:** Persona del equipo y sus roles
- **SOURCE COMPONENT:** RowLink + Avatar
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** TeamDetail > RowLink (members)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=320 y=355.38 w=1024 h=63.64
- CSS: width: 1024px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 1024px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 1024×537.13
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "VB Victoria Berg Jugadora · Sexta A · Capitana · Sexta A"

#### STATE

- idle

#### INTERACTION

- trigger: click → /people/p0

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px; avatar 32×32 a x=28
- 1440: 1024 px

#### IMPLEMENTATION NOTES

- El detalle enumera los roles activos con el formato «{rol} · {alcance}», unidos por dos espacios y un punto.
- El alcance del rol se resuelve con roleScopeLabel: para un rol de equipo es «División Línea» (por ejemplo «Sexta A»).

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 957 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
