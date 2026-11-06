# SURFACE MAP — MGT_PEOPLE_006_NEW_VALIDATION

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_PEOPLE_006_NEW_VALIDATION

**SCREEN ID:** MGT_PEOPLE_006_NEW_VALIDATION

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Personas — alta con errores de validación

**PURPOSE AS IMPLEMENTED:** Errores de validación del alta: documento y fecha de nacimiento son obligatorios y el foco pasa al primer campo inválido.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/people/new

**ORIGIN:** MGT_PEOPLE_005_NEW_FORM → «Crear persona»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** VALIDATION FAILED

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/new?demo=admin.
2. Pulsar «Crear persona» sin completar.

**RELATED SCREEN IDS:** MGT_PEOPLE_005_NEW_FORM

**RESPONSIVE COUNTERPART:** Cada error aparece bajo su campo.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** CreatePerson > validate(), Field (error)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PEOPLE_006_NEW_VALIDATION_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Errores bajo cada campo
- **FOCAL 2:** Campo «Nombre y apellido» marcado
- **SUPPORTING:** Mensaje del documento obligatorio
- **SECONDARY:** Resto del formulario
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NameFieldError | p con AlertCircle | Error de validación del nombre |

### C01 — NameFieldError

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** p con AlertCircle
- **INSTANCE / ROLE:** Error de validación del nombre
- **SOURCE COMPONENT:** Field (error)
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Field > p (error)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=49.25 w=324 h=17.39
- CSS: width: 324px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 6px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=77.37 · padre 324×94.77
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(163, 35, 43) · border: 0px solid rgb(163, 35, 43) · border-radius: 0px · box-shadow: none · opacity: 1
- icon: lucide lucide-circle-alert lucide-alert-circle mt-0.5 shrink-0 (14x14)
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 500

#### CONTENT

- visible: "Escribí el nombre completo."

#### STATE

- error

#### INTERACTION

- se borra al escribir en el campo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 324 px, 1 línea
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El foco se traslada al primer campo con error mediante document.getElementById(`cp-${clave}`).focus() en un setTimeout.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1263 · scrollY 346 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: los mensajes de error son los mismos; cambian las líneas que ocupan.

# MGT_PEOPLE_006_NEW_VALIDATION

**SCREEN ID:** MGT_PEOPLE_006_NEW_VALIDATION

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Personas — alta con errores de validación

**PURPOSE AS IMPLEMENTED:** Errores de validación del alta: documento y fecha de nacimiento son obligatorios y el foco pasa al primer campo inválido.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/people/new

**ORIGIN:** MGT_PEOPLE_005_NEW_FORM → «Crear persona»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** VALIDATION FAILED

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/new?demo=admin.
2. Pulsar «Crear persona» sin completar.

**RELATED SCREEN IDS:** MGT_PEOPLE_005_NEW_FORM

**RESPONSIVE COUNTERPART:** Cada error aparece bajo su campo.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** CreatePerson > validate(), Field (error)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PEOPLE_006_NEW_VALIDATION_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Errores bajo cada campo
- **FOCAL 2:** Campo «Nombre y apellido» marcado
- **SUPPORTING:** Mensaje del documento obligatorio
- **SECONDARY:** Resto del formulario
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NameFieldError | p con AlertCircle | Error de validación del nombre |

### C01 — NameFieldError

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** p con AlertCircle
- **INSTANCE / ROLE:** Error de validación del nombre
- **SOURCE COMPONENT:** Field (error)
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Field > p (error)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=517 y=147.75 w=630 h=17.39
- CSS: width: 630px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 630px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 6px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=77.37 · padre 630×94.77
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(163, 35, 43) · border: 0px solid rgb(163, 35, 43) · border-radius: 0px · box-shadow: none · opacity: 1
- icon: lucide lucide-circle-alert lucide-alert-circle mt-0.5 shrink-0 (14x14)
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 500

#### CONTENT

- visible: "Escribí el nombre completo."

#### STATE

- error

#### INTERACTION

- se borra al escribir en el campo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 324 px, 1 línea
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El foco se traslada al primer campo con error mediante document.getElementById(`cp-${clave}`).focus() en un setTimeout.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1199 · scrollY 229 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: los mensajes de error son los mismos; cambian las líneas que ocupan.
