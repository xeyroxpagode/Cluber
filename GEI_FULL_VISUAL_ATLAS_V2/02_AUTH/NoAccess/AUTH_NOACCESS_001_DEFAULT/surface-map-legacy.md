# SURFACE MAP — AUTH_NOACCESS_001_DEFAULT

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# AUTH_NOACCESS_001_DEFAULT

**SCREEN ID:** AUTH_NOACCESS_001_DEFAULT

**DOMAIN:** 08_Auth

**SURFACE NAME:** Sin acceso — cuenta sin rol asignado

**PURPOSE AS IMPLEMENTED:** Pantalla para una cuenta activa sin rol deportivo asignado: explica la situación y ofrece cerrar sesión.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /no-access

**ORIGIN:** Shell → redirección cuando el actor no tiene acceso

**ACTOR:** COACH (el actor de la sesión; el contenido refleja su nombre)

**RESOURCE / FIXTURE IDS:** actor=coach

**RESOURCE STATE:** CUENTA ACTIVA SIN ROL

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /no-access?demo=coach.

**RELATED SCREEN IDS:** AUTH_LOGIN_001_DEFAULT, MGT_PERSON_001_IDENTIDAD

**RESPONSIVE COUNTERPART:** Contenedor max-w-md (448 px) centrado; sin cromo de la app.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** NoAccessPage, KeyValue, MetaRow, StateBadge, Banner tone=neutral, Button variant=secondary

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `AUTH_NOACCESS_001_DEFAULT_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «Todavía no tenés acceso al sistema»
- **FOCAL 2:** Bloque «Qué sigue»
- **SUPPORTING:** Datos de cuenta y estado
- **SECONDARY:** Botón «Cerrar sesión»
- **AMBIENT:** Fondo de página

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NoAccessKeyValue | dl con MetaRow | Datos de la cuenta sin acceso |

### C01 — NoAccessKeyValue

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** dl con MetaRow
- **INSTANCE / ROLE:** Datos de la cuenta sin acceso
- **SOURCE COMPONENT:** KeyValue / MetaRow
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** KeyValue / MetaRow
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=409.39 w=38.81 h=17.39
- CSS: width: 38.8125px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 38.8125px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=13 · padre 358×43
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Estado"

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×85,69 px; el valor se alinea a la derecha
- 1440: 448 px

#### IMPLEMENTATION NOTES

- El valor de «Estado» es un StateBadge con emphasis (tono success para ACTIVE).
- La ruta /no-access está declarada fuera del Shell en el router, por lo que se alcanza por URL directa; el Shell redirige a ella cuando hasAccess es falso.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: ninguno: estas rutas están fuera del Shell
- initial scroll: scrollY = 0
- scroll restoration observed: n/a
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo main que el login (max-w-md, content-center, px-4).

# AUTH_NOACCESS_001_DEFAULT

**SCREEN ID:** AUTH_NOACCESS_001_DEFAULT

**DOMAIN:** 08_Auth

**SURFACE NAME:** Sin acceso — cuenta sin rol asignado

**PURPOSE AS IMPLEMENTED:** Pantalla para una cuenta activa sin rol deportivo asignado: explica la situación y ofrece cerrar sesión.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /no-access

**ORIGIN:** Shell → redirección cuando el actor no tiene acceso

**ACTOR:** COACH (el actor de la sesión; el contenido refleja su nombre)

**RESOURCE / FIXTURE IDS:** actor=coach

**RESOURCE STATE:** CUENTA ACTIVA SIN ROL

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /no-access?demo=coach.

**RELATED SCREEN IDS:** AUTH_LOGIN_001_DEFAULT, MGT_PERSON_001_IDENTIDAD

**RESPONSIVE COUNTERPART:** Contenedor max-w-md (448 px) centrado; sin cromo de la app.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** NoAccessPage, KeyValue, MetaRow, StateBadge, Banner tone=neutral, Button variant=secondary

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `AUTH_NOACCESS_001_DEFAULT_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «Todavía no tenés acceso al sistema»
- **FOCAL 2:** Bloque «Qué sigue»
- **SUPPORTING:** Datos de cuenta y estado
- **SECONDARY:** Botón «Cerrar sesión»
- **AMBIENT:** Fondo de página

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NoAccessKeyValue | dl con MetaRow | Datos de la cuenta sin acceso |

### C01 — NoAccessKeyValue

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** dl con MetaRow
- **INSTANCE / ROLE:** Datos de la cuenta sin acceso
- **SOURCE COMPONENT:** KeyValue / MetaRow
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** KeyValue / MetaRow
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=512 y=448.23 w=38.81 h=17.39
- CSS: width: 38.8125px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 38.8125px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=13 · padre 416×43
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Estado"

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×85,69 px; el valor se alinea a la derecha
- 1440: 448 px

#### IMPLEMENTATION NOTES

- El valor de «Estado» es un StateBadge con emphasis (tono success para ACTIVE).
- La ruta /no-access está declarada fuera del Shell en el router, por lo que se alcanza por URL directa; el Shell redirige a ella cuando hasAccess es falso.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: ninguno: estas rutas están fuera del Shell
- initial scroll: scrollY = 0
- scroll restoration observed: n/a
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 900 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo main que el login (max-w-md, content-center, px-4).
