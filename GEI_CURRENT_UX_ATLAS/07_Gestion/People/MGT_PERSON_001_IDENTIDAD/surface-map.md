# SURFACE MAP — MGT_PERSON_001_IDENTIDAD

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_PERSON_001_IDENTIDAD

**SCREEN ID:** MGT_PERSON_001_IDENTIDAD

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Ficha de persona — Identidad

**PURPOSE AS IMPLEMENTED:** Ficha administrativa de una persona: pestañas por sección y la sección de identidad con los datos que administra el club.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/people/p2

**ORIGIN:** Personas → click en una persona

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p2 (Lucía Fernández)

**RESOURCE STATE:** CUENTA ACTIVA · 1 equipo · 1 rol

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/p2?demo=admin.

**RELATED SCREEN IDS:** MGT_PERSON_002_PERTENENCIA, MGT_PERSON_006_IDENTITY_MODAL, MGT_PERSON_007_INCOMPLETE

**RESPONSIVE COUNTERPART:** 390: la fila de pestañas (478,58 px) desborda el ancho de contenido (358 px) y se desplaza horizontalmente dentro de su contenedor con overflow-x-auto; el documento no desborda (scrollWidth = 390) porque el contenedor raíz del Shell usa overflow-x-clip.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** PersonAdminDetail, TabBar, Surface, SectionHeader, RowStatic, Button, StateBadge

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PERSON_001_IDENTIDAD_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Pestañas de sección con sus contadores
- **FOCAL 2:** Superficie «Datos que administra el club»
- **SUPPORTING:** Botón «Corregir identidad»
- **SECONDARY:** Bloque «Cambios de esta ficha»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PersonAdminTabBar | div[role=tablist] con 5 pestañas | Secciones de la ficha |
| C02 | ManagedDataSurface | Surface grid gap-4 | Datos de identidad que administra el club |
| C03 | EditIdentityButton | Button secondary sm | Abrir la corrección de identidad |

### C01 — PersonAdminTabBar

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** div[role=tablist] con 5 pestañas
- **INSTANCE / ROLE:** Secciones de la ficha
- **SOURCE COMPONENT:** TabBar
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TabBar (ficha de persona)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=12 y=266.63 w=478.58 h=37
- CSS: width: 478.578px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 478.578px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: normal · gap: 4px · padding: 0px 4px 1px · margin: 0px -4px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=-4 dy=0 · padre 470.58×38

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Identidad Pertenencia Equipos 1 Roles 1 Cuenta"

#### STATE

- «Identidad» activa

#### INTERACTION

- trigger: click en una pestaña → query.set({section})

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 478,58 px de ancho con scroll horizontal; las cinco pestañas: 87,58 / 105,38 / 103,06 / 85,78 / 72,78 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- Las pestañas se filtran por `show: admin`: sin autoridad de administración de personas sólo queda la sección de identidad.
- Las pestañas «Equipos» y «Roles» llevan contador.

### C02 — ManagedDataSurface

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Surface grid gap-4
- **INSTANCE / ROLE:** Datos de identidad que administra el club
- **SOURCE COMPONENT:** Surface + SectionHeader + RowStatic
- **SOURCE FILE:** src/features/management.tsx
- **SOURCE SYMBOL:** PersonAdminDetail > Surface (Datos que administra el club)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=375.92 w=231.03 h=21.25
- CSS: width: 231.031px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 231.031px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 231.03×21.25
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Datos que administra el club"

#### STATE

- idle

#### INTERACTION

- trigger: click en «Corregir identidad» → abre el Modal de corrección

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×476,2 px; 5 filas de datos
- 1440: 896 px

#### IMPLEMENTATION NOTES

- Las filas son RowStatic con nombre, documento, fecha de nacimiento, correo y teléfono.

### C03 — EditIdentityButton

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** Button secondary sm
- **INSTANCE / ROLE:** Abrir la corrección de identidad
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=secondary size=sm
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=332.83 y=365.63 w=136.75 h=44
- CSS: width: 136.75px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 136.75px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=299.83 dy=0 · padre 436.58×44

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Corregir identidad"

#### STATE

- idle

#### INTERACTION

- trigger: click → setDialog('identidad')

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: 136,75×44 px (min-h-11) en el action del SectionHeader
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1162 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: la fila de cinco pestañas mide 478,58 px a 390 y 478,58 px a 1440 (contenido del clip): el overflow-x-auto del TabBar lo hace desplazable sin desbordar el documento.
- El botón «Corregir identidad» vive en el action del SectionHeader, a la derecha del título.

# MGT_PERSON_001_IDENTIDAD

**SCREEN ID:** MGT_PERSON_001_IDENTIDAD

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Ficha de persona — Identidad

**PURPOSE AS IMPLEMENTED:** Ficha administrativa de una persona: pestañas por sección y la sección de identidad con los datos que administra el club.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/people/p2

**ORIGIN:** Personas → click en una persona

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p2 (Lucía Fernández)

**RESOURCE STATE:** CUENTA ACTIVA · 1 equipo · 1 rol

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/p2?demo=admin.

**RELATED SCREEN IDS:** MGT_PERSON_002_PERTENENCIA, MGT_PERSON_006_IDENTITY_MODAL, MGT_PERSON_007_INCOMPLETE

**RESPONSIVE COUNTERPART:** 390: la fila de pestañas (478,58 px) desborda el ancho de contenido (358 px) y se desplaza horizontalmente dentro de su contenedor con overflow-x-auto; el documento no desborda (scrollWidth = 390) porque el contenedor raíz del Shell usa overflow-x-clip.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** PersonAdminDetail, TabBar, Surface, SectionHeader, RowStatic, Button, StateBadge

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PERSON_001_IDENTIDAD_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Pestañas de sección con sus contadores
- **FOCAL 2:** Superficie «Datos que administra el club»
- **SUPPORTING:** Botón «Corregir identidad»
- **SECONDARY:** Bloque «Cambios de esta ficha»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PersonAdminTabBar | div[role=tablist] con 5 pestañas | Secciones de la ficha |
| C02 | ManagedDataSurface | Surface grid gap-4 | Datos de identidad que administra el club |
| C03 | EditIdentityButton | Button secondary sm | Abrir la corrección de identidad |

### C01 — PersonAdminTabBar

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** div[role=tablist] con 5 pestañas
- **INSTANCE / ROLE:** Secciones de la ficha
- **SOURCE COMPONENT:** TabBar
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TabBar (ficha de persona)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=380 y=209.13 w=904 h=37
- CSS: width: 904px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 904px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: normal · gap: 4px · padding: 0px 4px 1px · margin: 0px -4px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=-4 dy=0 · padre 896×38

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Identidad Pertenencia Equipos 1 Roles 1 Cuenta"

#### STATE

- «Identidad» activa

#### INTERACTION

- trigger: click en una pestaña → query.set({section})

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 478,58 px de ancho con scroll horizontal; las cinco pestañas: 87,58 / 105,38 / 103,06 / 85,78 / 72,78 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- Las pestañas se filtran por `show: admin`: sin autoridad de administración de personas sólo queda la sección de identidad.
- Las pestañas «Equipos» y «Roles» llevan contador.

### C02 — ManagedDataSurface

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Surface grid gap-4
- **INSTANCE / ROLE:** Datos de identidad que administra el club
- **SOURCE COMPONENT:** Surface + SectionHeader + RowStatic
- **SOURCE FILE:** src/features/management.tsx
- **SOURCE SYMBOL:** PersonAdminDetail > Surface (Datos que administra el club)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=405 y=322.42 w=231.03 h=21.25
- CSS: width: 231.031px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 231.031px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 231.03×21.25
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Datos que administra el club"

#### STATE

- idle

#### INTERACTION

- trigger: click en «Corregir identidad» → abre el Modal de corrección

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×476,2 px; 5 filas de datos
- 1440: 896 px

#### IMPLEMENTATION NOTES

- Las filas son RowStatic con nombre, documento, fecha de nacimiento, correo y teléfono.

### C03 — EditIdentityButton

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** Button secondary sm
- **INSTANCE / ROLE:** Abrir la corrección de identidad
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=secondary size=sm
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1122.25 y=312.13 w=136.75 h=44
- CSS: width: 136.75px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 136.75px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=717.25 dy=0 · padre 854×44

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Corregir identidad"

#### STATE

- idle

#### INTERACTION

- trigger: click → setDialog('identidad')

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: 136,75×44 px (min-h-11) en el action del SectionHeader
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1073 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: la fila de cinco pestañas mide 478,58 px a 390 y 478,58 px a 1440 (contenido del clip): el overflow-x-auto del TabBar lo hace desplazable sin desbordar el documento.
- El botón «Corregir identidad» vive en el action del SectionHeader, a la derecha del título.
