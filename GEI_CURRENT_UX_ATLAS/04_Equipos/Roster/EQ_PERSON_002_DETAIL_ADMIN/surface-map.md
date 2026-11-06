# SURFACE MAP — EQ_PERSON_002_DETAIL_ADMIN

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# EQ_PERSON_002_DETAIL_ADMIN

**SCREEN ID:** EQ_PERSON_002_DETAIL_ADMIN

**DOMAIN:** 04_Equipos

**SURFACE NAME:** Persona — ficha de lectura (ADMIN)

**PURPOSE AS IMPLEMENTED:** La misma ficha para el administrador: aparecen el documento y la fecha de nacimiento, que para el resto de actores no se renderizan.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /people/p2

**ORIGIN:** Búsqueda o equipo → click en una persona (actor ADMIN)

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p2 (Lucía Fernández)

**RESOURCE STATE:** ACCOUNT ACTIVE · PII completa

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /people/p2?demo=admin.

**RELATED SCREEN IDS:** EQ_PERSON_001_DETAIL_COACH, MGT_PERSON_001_IDENTIDAD

**RESPONSIVE COUNTERPART:** Misma composición; sólo cambia la cantidad de filas de identidad.

**SOURCE FILES:** src/features/overview.tsx, src/mock/authority.ts

**SOURCE SYMBOLS:** PersonDetail (canViewDni / canViewBirth), canViewDni, canViewBirth

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `EQ_PERSON_002_DETAIL_ADMIN_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Sección «Identidad» completa
- **FOCAL 2:** Documento y fecha de nacimiento
- **SUPPORTING:** Contacto completo
- **SECONDARY:** Roles y equipos
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | IdentityRows (con PII) | dl con RowStatic | Identidad completa de la persona |

### C01 — IdentityRows (con PII)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** dl con RowStatic
- **INSTANCE / ROLE:** Identidad completa de la persona
- **SOURCE COMPONENT:** RowStatic
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** PersonDetail > RowStatic (dni / birth)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=28 y=418.16 w=334 h=20.25
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

- visible: "Documento"

#### STATE

- visible sólo para ADMIN

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: 768 px

#### IMPLEMENTATION NOTES

- canViewDni y canViewBirth devuelven admin, de modo que el ADMIN ve ambas filas.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 927 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# EQ_PERSON_002_DETAIL_ADMIN

**SCREEN ID:** EQ_PERSON_002_DETAIL_ADMIN

**DOMAIN:** 04_Equipos

**SURFACE NAME:** Persona — ficha de lectura (ADMIN)

**PURPOSE AS IMPLEMENTED:** La misma ficha para el administrador: aparecen el documento y la fecha de nacimiento, que para el resto de actores no se renderizan.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /people/p2

**ORIGIN:** Búsqueda o equipo → click en una persona (actor ADMIN)

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p2 (Lucía Fernández)

**RESOURCE STATE:** ACCOUNT ACTIVE · PII completa

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /people/p2?demo=admin.

**RELATED SCREEN IDS:** EQ_PERSON_001_DETAIL_COACH, MGT_PERSON_001_IDENTIDAD

**RESPONSIVE COUNTERPART:** Misma composición; sólo cambia la cantidad de filas de identidad.

**SOURCE FILES:** src/features/overview.tsx, src/mock/authority.ts

**SOURCE SYMBOLS:** PersonDetail (canViewDni / canViewBirth), canViewDni, canViewBirth

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `EQ_PERSON_002_DETAIL_ADMIN_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Sección «Identidad» completa
- **FOCAL 2:** Documento y fecha de nacimiento
- **SUPPORTING:** Contacto completo
- **SECONDARY:** Roles y equipos
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | IdentityRows (con PII) | dl con RowStatic | Identidad completa de la persona |

### C01 — IdentityRows (con PII)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** dl con RowStatic
- **INSTANCE / ROLE:** Identidad completa de la persona
- **SOURCE COMPONENT:** RowStatic
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** PersonDetail > RowStatic (dni / birth)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=460 y=383.16 w=744 h=20.25
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

- visible: "Documento"

#### STATE

- visible sólo para ADMIN

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: 768 px

#### IMPLEMENTATION NOTES

- canViewDni y canViewBirth devuelven admin, de modo que el ADMIN ve ambas filas.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
