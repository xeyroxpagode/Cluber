# SURFACE MAP — MGT_PEOPLE_005_NEW_FORM

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_PEOPLE_005_NEW_FORM

**SCREEN ID:** MGT_PEOPLE_005_NEW_FORM

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Personas — alta

**PURPOSE AS IMPLEMENTED:** Formulario de alta de persona con identidad administrada por el club y contacto.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/people/new

**ORIGIN:** Personas → «Crear persona»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** FORMULARIO VACÍO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/new?demo=admin.

**RELATED SCREEN IDS:** MGT_PEOPLE_006_NEW_VALIDATION, MGT_PERSON_001_IDENTIDAD

**RESPONSIVE COUNTERPART:** Contenedor max-w-2xl (672 px); las secciones son de una columna.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** CreatePerson, Surface, SectionHeader, TextField, Button

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PEOPLE_005_NEW_FORM_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Sección «Identidad» con documento y fecha de nacimiento
- **FOCAL 2:** Sección «Contacto»
- **SUPPORTING:** Sección «Qué sigue»
- **SECONDARY:** Botones «Cancelar» y «Crear persona»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | DniTextField | TextField required | Documento de identidad administrado por el club |
| C02 | NextStepsSurface («Qué sigue») | Surface grid gap-4 | Explica el flujo posterior al alta |

### C01 — DniTextField

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** TextField required
- **INSTANCE / ROLE:** Documento de identidad administrado por el club
- **SOURCE COMPONENT:** TextField / Field
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TextField (id=cp-dni)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=473.72 w=324 h=43.69
- CSS: width: 324px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=68.47 · padre 324×112.16
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- vacío, required

#### INTERACTION

- trigger: escribir → guarda el dato; al enviar sin valor muestra «El documento lo administra el club y es obligatorio.»

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 324×43,69 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El hint dice «Dato del club. La persona no puede editarlo desde su perfil.»

### C02 — NextStepsSurface («Qué sigue»)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Surface grid gap-4
- **INSTANCE / ROLE:** Explica el flujo posterior al alta
- **SOURCE COMPONENT:** Surface + SectionHeader
- **SOURCE FILE:** src/features/management.tsx
- **SOURCE SYMBOL:** CreatePerson > Surface («Qué sigue»)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=908.78 w=324 h=21.25
- CSS: width: 324px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 324×58.03
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Qué sigue"

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: 672 px

#### IMPLEMENTATION NOTES

- El texto explica que la persona queda con cuenta pendiente y que la pertenencia y el código de activación se operan desde su ficha.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1211 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# MGT_PEOPLE_005_NEW_FORM

**SCREEN ID:** MGT_PEOPLE_005_NEW_FORM

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Personas — alta

**PURPOSE AS IMPLEMENTED:** Formulario de alta de persona con identidad administrada por el club y contacto.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/people/new

**ORIGIN:** Personas → «Crear persona»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** FORMULARIO VACÍO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/new?demo=admin.

**RELATED SCREEN IDS:** MGT_PEOPLE_006_NEW_VALIDATION, MGT_PERSON_001_IDENTIDAD

**RESPONSIVE COUNTERPART:** Contenedor max-w-2xl (672 px); las secciones son de una columna.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** CreatePerson, Surface, SectionHeader, TextField, Button

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PEOPLE_005_NEW_FORM_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Sección «Identidad» con documento y fecha de nacimiento
- **FOCAL 2:** Sección «Contacto»
- **SUPPORTING:** Sección «Qué sigue»
- **SECONDARY:** Botones «Cancelar» y «Crear persona»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | DniTextField | TextField required | Documento de identidad administrado por el club |
| C02 | NextStepsSurface («Qué sigue») | Surface grid gap-4 | Explica el flujo posterior al alta |

### C01 — DniTextField

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** TextField required
- **INSTANCE / ROLE:** Documento de identidad administrado por el club
- **SOURCE COMPONENT:** TextField / Field
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TextField (id=cp-dni)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=517 y=437.83 w=630 h=43.69
- CSS: width: 630px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 630px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=51.08 · padre 630×94.77
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- vacío, required

#### INTERACTION

- trigger: escribir → guarda el dato; al enviar sin valor muestra «El documento lo administra el club y es obligatorio.»

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 324×43,69 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El hint dice «Dato del club. La persona no puede editarlo desde su perfil.»

### C02 — NextStepsSurface («Qué sigue»)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Surface grid gap-4
- **INSTANCE / ROLE:** Explica el flujo posterior al alta
- **SOURCE COMPONENT:** Surface + SectionHeader
- **SOURCE FILE:** src/features/management.tsx
- **SOURCE SYMBOL:** CreatePerson > Surface («Qué sigue»)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=517 y=888.89 w=397.39 h=21.25
- CSS: width: 397.391px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 397.391px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 397.39×40.64
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Qué sigue"

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: 672 px

#### IMPLEMENTATION NOTES

- El texto explica que la persona queda con cuenta pendiente y que la pertenencia y el código de activación se operan desde su ficha.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1129 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
