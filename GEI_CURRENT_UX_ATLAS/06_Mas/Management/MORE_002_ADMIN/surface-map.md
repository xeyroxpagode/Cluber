# SURFACE MAP — MORE_002_ADMIN

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MORE_002_ADMIN

**SCREEN ID:** MORE_002_ADMIN

**DOMAIN:** 06_Mas

**SURFACE NAME:** Más — entrada de la administración

**PURPOSE AS IMPLEMENTED:** El mismo hub para el administrador: aparecen además «Historial de cambios», «Personas», «Estructura del club» y «Competencias».

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /more

**ORIGIN:** Shell → destino «Más»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** actor=admin, j1

**RESOURCE STATE:** ADMIN · 6 accesos visibles

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /more?demo=admin.

**RELATED SCREEN IDS:** MORE_001_COACH, MGT_HOME_001_ADMIN

**RESPONSIVE COUNTERPART:** Contenedor max-w-3xl; la lista crece a 6 filas.

**SOURCE FILES:** src/features/account-insight.tsx, src/mock/authority.ts

**SOURCE SYMBOLS:** MorePage (links con show), canOpen

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MORE_002_ADMIN_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Seis accesos de administración
- **FOCAL 2:** Acceso «Historial de cambios» (propio del ADMIN)
- **SUPPORTING:** Sección «Jornadas»
- **SECONDARY:** Encabezado
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | MoreLinkRow (Historial de cambios) | RowLink | Acceso al historial de auditoría |

### C01 — MoreLinkRow (Historial de cambios)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Acceso al historial de auditoría
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/account-insight.tsx
- **SOURCE SYMBOL:** MorePage > RowLink (audit)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=310.86 w=358 h=63.64
- CSS: width: 358px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=67.64 · padre 358×334.2
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Historial de cambios Quién hizo qué y cuándo"

#### STATE

- idle

#### INTERACTION

- trigger: click → /audit

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: 768 px

#### IMPLEMENTATION NOTES

- canOpen('audit') es true sólo para el ADMIN.
- El ADMIN no ve «Informes»: canOpen('reports') exige isSelfPlayer, rol COACH o alcance de club, y el ADMIN no cumple ninguna de las tres.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: la lista es de una columna en ambos viewports; en 1440 el contenedor es de 768 px.

# MORE_002_ADMIN

**SCREEN ID:** MORE_002_ADMIN

**DOMAIN:** 06_Mas

**SURFACE NAME:** Más — entrada de la administración

**PURPOSE AS IMPLEMENTED:** El mismo hub para el administrador: aparecen además «Historial de cambios», «Personas», «Estructura del club» y «Competencias».

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /more

**ORIGIN:** Shell → destino «Más»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** actor=admin, j1

**RESOURCE STATE:** ADMIN · 6 accesos visibles

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /more?demo=admin.

**RELATED SCREEN IDS:** MORE_001_COACH, MGT_HOME_001_ADMIN

**RESPONSIVE COUNTERPART:** Contenedor max-w-3xl; la lista crece a 6 filas.

**SOURCE FILES:** src/features/account-insight.tsx, src/mock/authority.ts

**SOURCE SYMBOLS:** MorePage (links con show), canOpen

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MORE_002_ADMIN_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Seis accesos de administración
- **FOCAL 2:** Acceso «Historial de cambios» (propio del ADMIN)
- **SUPPORTING:** Sección «Jornadas»
- **SECONDARY:** Encabezado
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | MoreLinkRow (Historial de cambios) | RowLink | Acceso al historial de auditoría |

### C01 — MoreLinkRow (Historial de cambios)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Acceso al historial de auditoría
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/account-insight.tsx
- **SOURCE SYMBOL:** MorePage > RowLink (audit)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=288.36 w=768 h=63.64
- CSS: width: 768px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 768px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=67.64 · padre 768×334.2
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Historial de cambios Quién hizo qué y cuándo"

#### STATE

- idle

#### INTERACTION

- trigger: click → /audit

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: 768 px

#### IMPLEMENTATION NOTES

- canOpen('audit') es true sólo para el ADMIN.
- El ADMIN no ve «Informes»: canOpen('reports') exige isSelfPlayer, rol COACH o alcance de club, y el ADMIN no cumple ninguna de las tres.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: la lista es de una columna en ambos viewports; en 1440 el contenedor es de 768 px.
