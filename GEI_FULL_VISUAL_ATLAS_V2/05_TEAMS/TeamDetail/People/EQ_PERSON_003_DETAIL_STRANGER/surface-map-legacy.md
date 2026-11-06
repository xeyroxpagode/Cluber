# SURFACE MAP — EQ_PERSON_003_DETAIL_STRANGER

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# EQ_PERSON_003_DETAIL_STRANGER

**SCREEN ID:** EQ_PERSON_003_DETAIL_STRANGER

**DOMAIN:** 04_Equipos

**SURFACE NAME:** Persona — ficha de lectura sin relación (PLAYER)

**PURPOSE AS IMPLEMENTED:** Ficha de una persona de otro equipo: el contacto se oculta y no se muestran documento ni fecha de nacimiento.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /people/p15

**ORIGIN:** Búsqueda → click en una persona de otro equipo

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** p15 (Florencia Vidal, equipo quinta)

**RESOURCE STATE:** FUERA DEL ALCANCE DE CONTACTO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /people/p15?demo=player.

**RELATED SCREEN IDS:** EQ_PERSON_001_DETAIL_COACH

**RESPONSIVE COUNTERPART:** Misma composición.

**SOURCE FILES:** src/features/overview.tsx, src/mock/authority.ts

**SOURCE SYMBOLS:** canViewContact (authority.ts:168)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `EQ_PERSON_003_DETAIL_STRANGER_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Fila «Contacto — No disponible para tu rol»
- **FOCAL 2:** Nombre y roles de la persona
- **SUPPORTING:** Equipos
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ContactRow (oculta) | RowStatic | Contacto restringido por autoridad |

### C01 — ContactRow (oculta)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowStatic
- **INSTANCE / ROLE:** Contacto restringido por autoridad
- **SOURCE COMPONENT:** RowStatic
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** PersonDetail > RowStatic (Contacto)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=28 y=376.77 w=334 h=17.39
- CSS: width: 334px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 334px, min-width 0px, max-width none

#### LAYOUT

- display: flow-root · padding: 0px · margin: 2px 0px 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=22.25 · padre 334×39.64
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "No disponible para tu rol"

#### STATE

- restringido

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: 768 px

#### IMPLEMENTATION NOTES

- canViewContact concede acceso a la propia persona, al ADMIN, a la Subcomisión y a los coaches/capitanos del equipo actual de la persona consultada.
- p15 juega en «quinta» y la jugadora p2 está en «sexta»: no hay relación, por lo que el contacto se oculta.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# EQ_PERSON_003_DETAIL_STRANGER

**SCREEN ID:** EQ_PERSON_003_DETAIL_STRANGER

**DOMAIN:** 04_Equipos

**SURFACE NAME:** Persona — ficha de lectura sin relación (PLAYER)

**PURPOSE AS IMPLEMENTED:** Ficha de una persona de otro equipo: el contacto se oculta y no se muestran documento ni fecha de nacimiento.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /people/p15

**ORIGIN:** Búsqueda → click en una persona de otro equipo

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** p15 (Florencia Vidal, equipo quinta)

**RESOURCE STATE:** FUERA DEL ALCANCE DE CONTACTO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /people/p15?demo=player.

**RELATED SCREEN IDS:** EQ_PERSON_001_DETAIL_COACH

**RESPONSIVE COUNTERPART:** Misma composición.

**SOURCE FILES:** src/features/overview.tsx, src/mock/authority.ts

**SOURCE SYMBOLS:** canViewContact (authority.ts:168)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `EQ_PERSON_003_DETAIL_STRANGER_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Fila «Contacto — No disponible para tu rol»
- **FOCAL 2:** Nombre y roles de la persona
- **SUPPORTING:** Equipos
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ContactRow (oculta) | RowStatic | Contacto restringido por autoridad |

### C01 — ContactRow (oculta)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowStatic
- **INSTANCE / ROLE:** Contacto restringido por autoridad
- **SOURCE COMPONENT:** RowStatic
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** PersonDetail > RowStatic (Contacto)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=460 y=341.77 w=744 h=17.39
- CSS: width: 744px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 744px, min-width 0px, max-width none

#### LAYOUT

- display: flow-root · padding: 0px · margin: 2px 0px 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=22.25 · padre 744×39.64
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "No disponible para tu rol"

#### STATE

- restringido

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: 768 px

#### IMPLEMENTATION NOTES

- canViewContact concede acceso a la propia persona, al ADMIN, a la Subcomisión y a los coaches/capitanos del equipo actual de la persona consultada.
- p15 juega en «quinta» y la jugadora p2 está en «sexta»: no hay relación, por lo que el contacto se oculta.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
