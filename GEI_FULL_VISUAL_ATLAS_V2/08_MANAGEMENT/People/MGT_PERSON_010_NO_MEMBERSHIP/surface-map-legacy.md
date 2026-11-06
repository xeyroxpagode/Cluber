# SURFACE MAP — MGT_PERSON_010_NO_MEMBERSHIP

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_PERSON_010_NO_MEMBERSHIP

**SCREEN ID:** MGT_PERSON_010_NO_MEMBERSHIP

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Ficha de persona — sin pertenencia

**PURPOSE AS IMPLEMENTED:** Sección de pertenencia de una persona que no la tiene: estado vacío con la acción de iniciarla.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/people/p16?section=pertenencia

**ORIGIN:** MGT_PERSON_008_PENDING_ACCOUNT → pestaña «Pertenencia»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p16 (sin membership)

**RESOURCE STATE:** SIN PERTENENCIA VIGENTE

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/p16?section=pertenencia&demo=admin.

**RELATED SCREEN IDS:** MGT_PERSON_002_PERTENENCIA, MGT_PERSON_011_MEMBERSHIP_START_CONFIRM

**RESPONSIVE COUNTERPART:** El estado vacío es de una columna en ambos viewports.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** PersonAdminDetail (memberships.length === 0) > Empty, Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PERSON_010_NO_MEMBERSHIP_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «Sin pertenencia vigente»
- **FOCAL 2:** Botón «Iniciar pertenencia»
- **SUPPORTING:** Detalle sobre el vínculo con el club
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NoMembershipEmpty | Empty | Estado vacío de pertenencia |

### C01 — NoMembershipEmpty

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado vacío de pertenencia
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=369.63 w=473.19 h=199.08
- CSS: width: 473.188px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 473.188px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 431.188px · gap: 12px · padding: 32px 20px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 473.19×199.08
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Sin pertenencia vigente La pertenencia es el vínculo con el club. Sin ella no ha"

#### STATE

- empty

#### INTERACTION

- trigger: click en «Iniciar pertenencia» → abre el ConfirmDialog

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: ancho del <main> menos padding
- 1440: idéntico

#### IMPLEMENTATION NOTES

- La sección de pertenencia es la única que renderiza un Empty con action; las de equipos y roles usan un párrafo de texto.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.

# MGT_PERSON_010_NO_MEMBERSHIP

**SCREEN ID:** MGT_PERSON_010_NO_MEMBERSHIP

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Ficha de persona — sin pertenencia

**PURPOSE AS IMPLEMENTED:** Sección de pertenencia de una persona que no la tiene: estado vacío con la acción de iniciarla.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/people/p16?section=pertenencia

**ORIGIN:** MGT_PERSON_008_PENDING_ACCOUNT → pestaña «Pertenencia»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p16 (sin membership)

**RESOURCE STATE:** SIN PERTENENCIA VIGENTE

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/p16?section=pertenencia&demo=admin.

**RELATED SCREEN IDS:** MGT_PERSON_002_PERTENENCIA, MGT_PERSON_011_MEMBERSHIP_START_CONFIRM

**RESPONSIVE COUNTERPART:** El estado vacío es de una columna en ambos viewports.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** PersonAdminDetail (memberships.length === 0) > Empty, Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PERSON_010_NO_MEMBERSHIP_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «Sin pertenencia vigente»
- **FOCAL 2:** Botón «Iniciar pertenencia»
- **SUPPORTING:** Detalle sobre el vínculo con el club
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NoMembershipEmpty | Empty | Estado vacío de pertenencia |

### C01 — NoMembershipEmpty

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado vacío de pertenencia
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=291.13 w=896 h=199.08
- CSS: width: 896px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 896px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 854px · gap: 12px · padding: 32px 20px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 896×199.08
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Sin pertenencia vigente La pertenencia es el vínculo con el club. Sin ella no ha"

#### STATE

- empty

#### INTERACTION

- trigger: click en «Iniciar pertenencia» → abre el ConfirmDialog

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: ancho del <main> menos padding
- 1440: idéntico

#### IMPLEMENTATION NOTES

- La sección de pertenencia es la única que renderiza un Empty con action; las de equipos y roles usan un párrafo de texto.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.
