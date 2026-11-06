# SURFACE MAP — MGT_PERSON_007_INCOMPLETE

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_PERSON_007_INCOMPLETE

**SCREEN ID:** MGT_PERSON_007_INCOMPLETE

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Ficha de persona — perfil incompleto

**PURPOSE AS IMPLEMENTED:** Ficha de una persona a la que le faltan datos de identidad: un banner explica qué falta y por qué no se puede asignar a un equipo.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/people/p17

**ORIGIN:** Personas → filtro «Perfil incompleto» → click en Florencia Vidal

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p17 (Florencia Vidal, sin dni/birth/phone)

**RESOURCE STATE:** PERFIL INCOMPLETO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/p17?demo=admin.

**RELATED SCREEN IDS:** MGT_PEOPLE_002_FILTER_INCOMPLETE, MGT_PERSON_001_IDENTIDAD

**RESPONSIVE COUNTERPART:** El banner ocupa arriba de la ficha.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx, src/mock/derive.ts

**SOURCE SYMBOLS:** profileCompleteness (derive.ts:123), Banner tone=attention

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PERSON_007_INCOMPLETE_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Banner ámbar «Perfil incompleto» con la lista de faltantes
- **FOCAL 2:** Lead del encabezado con los campos que faltan
- **SUPPORTING:** Pestañas de la ficha
- **SECONDARY:** Campos con el valor «Sin cargar»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | IncompleteProfileBanner | Banner tone=attention | Explica qué datos faltan y su consecuencia |

### C01 — IncompleteProfileBanner

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Banner tone=attention
- **INSTANCE / ROLE:** Explica qué datos faltan y su consecuencia
- **SOURCE COMPONENT:** Banner
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Banner tone=attention
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=348.63 w=470.58 h=124.75
- CSS: width: 470.578px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 470.578px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 12px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 470.58×616.95
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(253, 241, 226) · color: rgb(16, 23, 37) · border: 1px solid rgb(240, 211, 171) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-info mt-0.5 shrink-0 text-attention (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Perfil incompleto Mientras falten documento de identidad, fecha de nacimiento, t"

#### STATE

- attention

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px, 3 líneas
- 1440: 896 px, 2 líneas

#### IMPLEMENTATION NOTES

- profileCompleteness revisa username, dni, birth, phone y email; en p17 faltan dni, birth y phone.
- El lead del encabezado de la ficha lista los campos que faltan: «Faltan datos para poder asignarla: …».

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1206 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# MGT_PERSON_007_INCOMPLETE

**SCREEN ID:** MGT_PERSON_007_INCOMPLETE

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Ficha de persona — perfil incompleto

**PURPOSE AS IMPLEMENTED:** Ficha de una persona a la que le faltan datos de identidad: un banner explica qué falta y por qué no se puede asignar a un equipo.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/people/p17

**ORIGIN:** Personas → filtro «Perfil incompleto» → click en Florencia Vidal

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p17 (Florencia Vidal, sin dni/birth/phone)

**RESOURCE STATE:** PERFIL INCOMPLETO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/p17?demo=admin.

**RELATED SCREEN IDS:** MGT_PEOPLE_002_FILTER_INCOMPLETE, MGT_PERSON_001_IDENTIDAD

**RESPONSIVE COUNTERPART:** El banner ocupa arriba de la ficha.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx, src/mock/derive.ts

**SOURCE SYMBOLS:** profileCompleteness (derive.ts:123), Banner tone=attention

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PERSON_007_INCOMPLETE_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Banner ámbar «Perfil incompleto» con la lista de faltantes
- **FOCAL 2:** Lead del encabezado con los campos que faltan
- **SUPPORTING:** Pestañas de la ficha
- **SECONDARY:** Campos con el valor «Sin cargar»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | IncompleteProfileBanner | Banner tone=attention | Explica qué datos faltan y su consecuencia |

### C01 — IncompleteProfileBanner

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Banner tone=attention
- **INSTANCE / ROLE:** Explica qué datos faltan y su consecuencia
- **SOURCE COMPONENT:** Banner
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Banner tone=attention
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=313.63 w=896 h=103.06
- CSS: width: 896px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 896px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 12px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 896×603.27
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(253, 241, 226) · color: rgb(16, 23, 37) · border: 1px solid rgb(240, 211, 171) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-info mt-0.5 shrink-0 text-attention (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Perfil incompleto Mientras falten documento de identidad, fecha de nacimiento, t"

#### STATE

- attention

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px, 3 líneas
- 1440: 896 px, 2 líneas

#### IMPLEMENTATION NOTES

- profileCompleteness revisa username, dni, birth, phone y email; en p17 faltan dni, birth y phone.
- El lead del encabezado de la ficha lista los campos que faltan: «Faltan datos para poder asignarla: …».

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1118 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
