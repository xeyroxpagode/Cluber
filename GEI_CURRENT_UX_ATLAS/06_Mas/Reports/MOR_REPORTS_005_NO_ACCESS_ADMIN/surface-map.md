# SURFACE MAP — MOR_REPORTS_005_NO_ACCESS_ADMIN

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MOR_REPORTS_005_NO_ACCESS_ADMIN

**SCREEN ID:** MOR_REPORTS_005_NO_ACCESS_ADMIN

**DOMAIN:** 06_Mas

**SURFACE NAME:** Informes — sin acceso (ADMIN)

**PURPOSE AS IMPLEMENTED:** Estado de acceso denegado para el administrador: no tiene alcance de informe.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /reports

**ORIGIN:** URL directa (actor ADMIN)

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** SIN ALCANCE DE INFORME

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /reports?demo=admin.

**RELATED SCREEN IDS:** MOR_REPORTS_001_LIST, MORE_002_ADMIN

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx, src/mock/authority.ts

**SOURCE SYMBOLS:** ReportsPage (!canSee) > Empty, canOpen('reports')

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MOR_REPORTS_005_NO_ACCESS_ADMIN_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «No tenés informes disponibles»
- **FOCAL 2:** Detalle «Los informes muestran asistencia y rendimiento según tu alcance.»
- **SUPPORTING:** Ícono
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NoReportsEmpty | Empty | Estado de acceso denegado por alcance |

### C01 — NoReportsEmpty

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado de acceso denegado por alcance
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

- visible: "No tenés informes disponibles Los informes muestran asistencia y rendimiento seg"

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

- canOpen('reports') = isSelfPlayer || coachTeamIds.length > 0 || official. El ADMIN cumple las tres condiciones como falso: no es jugadora, no es entrenadora y no es Subcomisión.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.

# MOR_REPORTS_005_NO_ACCESS_ADMIN

**SCREEN ID:** MOR_REPORTS_005_NO_ACCESS_ADMIN

**DOMAIN:** 06_Mas

**SURFACE NAME:** Informes — sin acceso (ADMIN)

**PURPOSE AS IMPLEMENTED:** Estado de acceso denegado para el administrador: no tiene alcance de informe.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /reports

**ORIGIN:** URL directa (actor ADMIN)

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** SIN ALCANCE DE INFORME

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /reports?demo=admin.

**RELATED SCREEN IDS:** MOR_REPORTS_001_LIST, MORE_002_ADMIN

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx, src/mock/authority.ts

**SOURCE SYMBOLS:** ReportsPage (!canSee) > Empty, canOpen('reports')

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MOR_REPORTS_005_NO_ACCESS_ADMIN_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «No tenés informes disponibles»
- **FOCAL 2:** Detalle «Los informes muestran asistencia y rendimiento según tu alcance.»
- **SUPPORTING:** Ícono
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NoReportsEmpty | Empty | Estado de acceso denegado por alcance |

### C01 — NoReportsEmpty

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado de acceso denegado por alcance
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

- visible: "No tenés informes disponibles Los informes muestran asistencia y rendimiento seg"

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

- canOpen('reports') = isSelfPlayer || coachTeamIds.length > 0 || official. El ADMIN cumple las tres condiciones como falso: no es jugadora, no es entrenadora y no es Subcomisión.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.
