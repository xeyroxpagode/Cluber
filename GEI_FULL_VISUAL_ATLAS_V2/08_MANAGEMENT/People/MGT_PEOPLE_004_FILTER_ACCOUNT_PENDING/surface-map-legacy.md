# SURFACE MAP — MGT_PEOPLE_004_FILTER_ACCOUNT_PENDING

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_PEOPLE_004_FILTER_ACCOUNT_PENDING

**SCREEN ID:** MGT_PEOPLE_004_FILTER_ACCOUNT_PENDING

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Personas — filtro de cuenta pendiente

**PURPOSE AS IMPLEMENTED:** Listado filtrado por el estado de cuenta «Pendiente»: muestra a quién falta activar.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/people?account=PENDING

**ORIGIN:** MGT_PEOPLE_001_LIST → filtro «Cuenta»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p16 (Lola Martínez)

**RESOURCE STATE:** 1 cuenta pendiente

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people?account=PENDING&demo=admin.

**RELATED SCREEN IDS:** MGT_PEOPLE_001_LIST, MGT_PERSON_008_PENDING_ACCOUNT

**RESPONSIVE COUNTERPART:** Misma composición.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** PeopleManagement (filtro account), StateBadge value=PENDING

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PEOPLE_004_FILTER_ACCOUNT_PENDING_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Fila con el badge «Pendiente»
- **FOCAL 2:** Select de cuenta con el valor aplicado
- **SUPPORTING:** Botón «Quitar filtros»
- **SECONDARY:** Contador de personas filtradas
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PendingStateBadge | span badge | Estado de la cuenta |

### C01 — PendingStateBadge

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** span badge
- **INSTANCE / ROLE:** Estado de la cuenta
- **SOURCE COMPONENT:** StateBadge
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** StateBadge value=person.account
- **PARENT:** span
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=254.63 y=600.16 w=74.38 h=23
- CSS: width: 74.375px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 74.375px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 6px · padding: 4px 8px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by span · offset dx=0 dy=0 · padre 74.38×23
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(251, 243, 224) · color: rgb(133, 90, 16) · border: 0px solid rgb(133, 90, 16) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 15px · font-weight: 600

#### CONTENT

- visible: "Pendiente"

#### STATE

- PENDING → warning (bg-warning-soft text-warning)

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: inline-flex shrink-0
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# MGT_PEOPLE_004_FILTER_ACCOUNT_PENDING

**SCREEN ID:** MGT_PEOPLE_004_FILTER_ACCOUNT_PENDING

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Personas — filtro de cuenta pendiente

**PURPOSE AS IMPLEMENTED:** Listado filtrado por el estado de cuenta «Pendiente»: muestra a quién falta activar.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/people?account=PENDING

**ORIGIN:** MGT_PEOPLE_001_LIST → filtro «Cuenta»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p16 (Lola Martínez)

**RESOURCE STATE:** 1 cuenta pendiente

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people?account=PENDING&demo=admin.

**RELATED SCREEN IDS:** MGT_PEOPLE_001_LIST, MGT_PERSON_008_PENDING_ACCOUNT

**RESPONSIVE COUNTERPART:** Misma composición.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** PeopleManagement (filtro account), StateBadge value=PENDING

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PEOPLE_004_FILTER_ACCOUNT_PENDING_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Fila con el badge «Pendiente»
- **FOCAL 2:** Select de cuenta con el valor aplicado
- **SUPPORTING:** Botón «Quitar filtros»
- **SECONDARY:** Contador de personas filtradas
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PendingStateBadge | span badge | Estado de la cuenta |

### C01 — PendingStateBadge

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** span badge
- **INSTANCE / ROLE:** Estado de la cuenta
- **SOURCE COMPONENT:** StateBadge
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** StateBadge value=person.account
- **PARENT:** span
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1224.63 y=412.78 w=74.38 h=23
- CSS: width: 74.375px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 74.375px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 6px · padding: 4px 8px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by span · offset dx=0 dy=0 · padre 74.38×23
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(251, 243, 224) · color: rgb(133, 90, 16) · border: 0px solid rgb(133, 90, 16) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 15px · font-weight: 600

#### CONTENT

- visible: "Pendiente"

#### STATE

- PENDING → warning (bg-warning-soft text-warning)

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: inline-flex shrink-0
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
