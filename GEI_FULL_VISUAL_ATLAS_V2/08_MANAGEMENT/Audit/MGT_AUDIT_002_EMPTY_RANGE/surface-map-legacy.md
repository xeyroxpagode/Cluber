# SURFACE MAP — MGT_AUDIT_002_EMPTY_RANGE

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_AUDIT_002_EMPTY_RANGE

**SCREEN ID:** MGT_AUDIT_002_EMPTY_RANGE

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Historial de cambios — rango sin movimientos

**PURPOSE AS IMPLEMENTED:** Estado vacío del historial cuando el rango de fechas no contiene ningún movimiento; el mensaje indica el total disponible.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /audit?from=2030-01-01&to=2030-12-31

**ORIGIN:** MGT_AUDIT_001_LIST → filtros de fecha

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** 3 movimientos fuera de rango

**RESOURCE STATE:** RANGO SIN RESULTADOS

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /audit?from=2030-01-01&to=2030-12-31&demo=admin.

**RELATED SCREEN IDS:** MGT_AUDIT_001_LIST

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** AuditPage (entries.length === 0) > Empty, Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_AUDIT_002_EMPTY_RANGE_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «No hay cambios en ese rango»
- **FOCAL 2:** Detalle con el total de movimientos del historial
- **SUPPORTING:** Ícono ShieldCheck 22 px
- **SECONDARY:** Filtros con el rango aplicado
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | EmptyAuditRange | Empty | Estado vacío por rango de fechas |

### C01 — EmptyAuditRange

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado vacío por rango de fechas
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=405.97 w=358 h=160.47
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 316px · gap: 12px · padding: 32px 20px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=316.97 · padre 358×477.44
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "No hay cambios en ese rango El historial tiene 3 movimientos en total. Ajustá la"

#### STATE

- empty (filtered)

#### INTERACTION

- No hay action: el estado vacío no ofrece limpiar el rango

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: ancho del <main> menos padding
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El detalle informa el total del historial: «El historial tiene 3 movimientos en total. Ajustá las fechas para verlos.»
- El icono por defecto en esta pantalla es ShieldCheck 22 px.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.

# MGT_AUDIT_002_EMPTY_RANGE

**SCREEN ID:** MGT_AUDIT_002_EMPTY_RANGE

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Historial de cambios — rango sin movimientos

**PURPOSE AS IMPLEMENTED:** Estado vacío del historial cuando el rango de fechas no contiene ningún movimiento; el mensaje indica el total disponible.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /audit?from=2030-01-01&to=2030-12-31

**ORIGIN:** MGT_AUDIT_001_LIST → filtros de fecha

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** 3 movimientos fuera de rango

**RESOURCE STATE:** RANGO SIN RESULTADOS

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /audit?from=2030-01-01&to=2030-12-31&demo=admin.

**RELATED SCREEN IDS:** MGT_AUDIT_001_LIST

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** AuditPage (entries.length === 0) > Empty, Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_AUDIT_002_EMPTY_RANGE_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «No hay cambios en ese rango»
- **FOCAL 2:** Detalle con el total de movimientos del historial
- **SUPPORTING:** Ícono ShieldCheck 22 px
- **SECONDARY:** Filtros con el rango aplicado
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | EmptyAuditRange | Empty | Estado vacío por rango de fechas |

### C01 — EmptyAuditRange

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado vacío por rango de fechas
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=304.09 w=896 h=160.47
- CSS: width: 896px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 896px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 854px · gap: 12px · padding: 32px 20px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=215.09 · padre 896×375.56
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "No hay cambios en ese rango El historial tiene 3 movimientos en total. Ajustá la"

#### STATE

- empty (filtered)

#### INTERACTION

- No hay action: el estado vacío no ofrece limpiar el rango

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: ancho del <main> menos padding
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El detalle informa el total del historial: «El historial tiene 3 movimientos en total. Ajustá las fechas para verlos.»
- El icono por defecto en esta pantalla es ShieldCheck 22 px.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.
