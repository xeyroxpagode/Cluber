# SURFACE MAP — MOR_PROFILE_004_CONTACT_SHEET

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MOR_PROFILE_004_CONTACT_SHEET

**SCREEN ID:** MOR_PROFILE_004_CONTACT_SHEET

**DOMAIN:** 06_Mas

**SURFACE NAME:** Mi perfil — hoja de edición de contacto

**PURPOSE AS IMPLEMENTED:** Sheet de edición del teléfono y el correo propios, con validación en línea.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /more/profile

**ORIGIN:** MOR_PROFILE_001_COACH → sección «Contacto» → «Editar»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** actor=coach

**RESOURCE STATE:** Panel abierto, sin cambios

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /more/profile?demo=coach.
2. Desplazar a y = 700.
3. Pulsar «Editar».

**RELATED SCREEN IDS:** MOR_PROFILE_001_COACH, GBL_OVERLAY_003_SHEET_CAMBIAR_CONTRASENA

**RESPONSIVE COUNTERPART:** Sheet de 448 px (max-w-md).

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** ContactDialog, Sheet, TextField

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MOR_PROFILE_004_CONTACT_SHEET_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Campos «Teléfono» y «Correo»
- **FOCAL 2:** Botón «Guardar contacto»
- **SUPPORTING:** Título «Editar contacto»
- **SECONDARY:** Botón «Cancelar»
- **AMBIENT:** Perfil atenuado

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ContactSheet | section[role=dialog] | Edición del contacto propio |

### C01 — ContactSheet

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Edición del contacto propio
- **SOURCE COMPONENT:** Sheet
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Sheet
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=0 w=390 h=844
- CSS: width: 390px · min-width: auto · min-height: auto · max-width: 448px

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 390px, min-width auto, max-width 448px

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · max-width: 448px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 390×844
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Editar contacto Teléfono OBLIGATORIO Correo OBLIGATORIO Es tu correo de acceso: "

#### STATE

- open

#### INTERACTION

- trigger: click en «Guardar contacto» → valida teléfono no vacío y correo con «@» → updateOwnContact
- trigger: Escape → cierra

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: 100% del viewport
- 1440: 448 px a la derecha

#### IMPLEMENTATION NOTES

- El botón del pie es primario y no se deshabilita: la validación se ejecuta al pulsar y no hay mensaje de error visible en el Sheet.

## SCROLL CONTRACT

- what scrolls: el cuerpo del sheet
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 1632 · scrollY 507 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Sheet.

# MOR_PROFILE_004_CONTACT_SHEET

**SCREEN ID:** MOR_PROFILE_004_CONTACT_SHEET

**DOMAIN:** 06_Mas

**SURFACE NAME:** Mi perfil — hoja de edición de contacto

**PURPOSE AS IMPLEMENTED:** Sheet de edición del teléfono y el correo propios, con validación en línea.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /more/profile

**ORIGIN:** MOR_PROFILE_001_COACH → sección «Contacto» → «Editar»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** actor=coach

**RESOURCE STATE:** Panel abierto, sin cambios

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /more/profile?demo=coach.
2. Desplazar a y = 700.
3. Pulsar «Editar».

**RELATED SCREEN IDS:** MOR_PROFILE_001_COACH, GBL_OVERLAY_003_SHEET_CAMBIAR_CONTRASENA

**RESPONSIVE COUNTERPART:** Sheet de 448 px (max-w-md).

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** ContactDialog, Sheet, TextField

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MOR_PROFILE_004_CONTACT_SHEET_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Campos «Teléfono» y «Correo»
- **FOCAL 2:** Botón «Guardar contacto»
- **SUPPORTING:** Título «Editar contacto»
- **SECONDARY:** Botón «Cancelar»
- **AMBIENT:** Perfil atenuado

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ContactSheet | section[role=dialog] | Edición del contacto propio |

### C01 — ContactSheet

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Edición del contacto propio
- **SOURCE COMPONENT:** Sheet
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Sheet
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=992 y=0 w=448 h=900
- CSS: width: 448px · min-width: auto · min-height: auto · max-width: 448px

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 448px, min-width auto, max-width 448px

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · max-width: 448px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=992 dy=0 · padre 1440×900

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Editar contacto Teléfono OBLIGATORIO Correo OBLIGATORIO Es tu correo de acceso: "

#### STATE

- open

#### INTERACTION

- trigger: click en «Guardar contacto» → valida teléfono no vacío y correo con «@» → updateOwnContact
- trigger: Escape → cierra

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: 100% del viewport
- 1440: 448 px a la derecha

#### IMPLEMENTATION NOTES

- El botón del pie es primario y no se deshabilita: la validación se ejecuta al pulsar y no hay mensaje de error visible en el Sheet.

## SCROLL CONTRACT

- what scrolls: el cuerpo del sheet
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 1472 · scrollY 367 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Sheet.
