# SURFACE MAP — MGT_AUDIT_001_LIST

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_AUDIT_001_LIST

**SCREEN ID:** MGT_AUDIT_001_LIST

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Historial de cambios — listado

**PURPOSE AS IMPLEMENTED:** Auditoría del club con filtros de rango de fechas y de persona, y el detalle before/after de cada movimiento.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /audit

**ORIGIN:** Más → «Historial de cambios»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** audit1, audit2, audit3

**RESOURCE STATE:** SIN FILTROS · 3 movimientos

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /audit?demo=admin.

**RELATED SCREEN IDS:** MGT_AUDIT_002_EMPTY_RANGE, MGT_AUDIT_003_DENIED_COACH

**RESPONSIVE COUNTERPART:** Contenedor max-w-4xl; los filtros se reparten en una fila y las entradas son de una columna.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** AuditPage, HistoryList, TimelineEntry, TextField, Select

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_AUDIT_001_LIST_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Filtros de rango y de persona
- **FOCAL 2:** Entradas del historial con el diff antes/después
- **SUPPORTING:** Actor y fecha de cada entrada
- **SECONDARY:** Motivo de cada entrada
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | AuditDateFilter | TextField type=date | Filtro de rango de fechas |
| C02 | AuditEntry (Reprogramar partido) | li con diff | Movimiento registrado con autor, fecha, motivo y valores |

### C01 — AuditDateFilter

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** TextField type=date
- **INSTANCE / ROLE:** Filtro de rango de fechas
- **SOURCE COMPONENT:** TextField / Field
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TextField (id/from/to)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=238.91 w=152 h=43.69
- CSS: width: 152px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 152px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=27.69 · padre 152×71.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- vacío (muestra el placeholder nativo dd/mm/aaaa)

#### INTERACTION

- trigger: change → query.set({from}) o query.set({to})

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 160 px (min-w-40), 43,69 px de alto
- 1440: 160 px

#### IMPLEMENTATION NOTES

- El filtro compara el día de la entrada (entry.at.slice(0,10)) contra los límites, de modo que ambos extremos son inclusivos.

### C02 — AuditEntry (Reprogramar partido)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** li con diff
- **INSTANCE / ROLE:** Movimiento registrado con autor, fecha, motivo y valores
- **SOURCE COMPONENT:** HistoryList / TimelineEntry
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** HistoryList / TimelineEntry
- **PARENT:** ul
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=17 y=406.97 w=356 h=115.16
- CSS: width: 356px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 356px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 356px · gap: 4px · padding: 12px 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by ul · offset dx=0 dy=0 · padre 356×344.47
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Reprogramar partido 19 oct, 06:00 p. m. 16:00 → 18:00 “Celular del entrenador” T"

#### STATE

- idle

#### INTERACTION

- No interactivo en esta pantalla

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px; el diff «16:00 → 18:00» con el valor anterior tachado
- 1440: 896 px

#### IMPLEMENTATION NOTES

- El motivo del movimiento se muestra con el campo `reason`, que en esta pantalla se alimenta de entry.source (el origen declarado de la acción).
- El enlace «Ver el objeto» de TimelineEntry NO se renderiza en esta pantalla: el componente exige las props `to` y `route`, y AuditPage sólo pasa `to`.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 864 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el bloque de filtros es `flex flex-wrap items-end gap-2` con un TextField de fecha (min-w-40 = 160 px), otro igual y un Select (min-w-48 = 192 px).
- Los inputs de fecha muestran el placeholder nativo «dd/mm/aaaa».

# MGT_AUDIT_001_LIST

**SCREEN ID:** MGT_AUDIT_001_LIST

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Historial de cambios — listado

**PURPOSE AS IMPLEMENTED:** Auditoría del club con filtros de rango de fechas y de persona, y el detalle before/after de cada movimiento.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /audit

**ORIGIN:** Más → «Historial de cambios»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** audit1, audit2, audit3

**RESOURCE STATE:** SIN FILTROS · 3 movimientos

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /audit?demo=admin.

**RELATED SCREEN IDS:** MGT_AUDIT_002_EMPTY_RANGE, MGT_AUDIT_003_DENIED_COACH

**RESPONSIVE COUNTERPART:** Contenedor max-w-4xl; los filtros se reparten en una fila y las entradas son de una columna.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** AuditPage, HistoryList, TimelineEntry, TextField, Select

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_AUDIT_001_LIST_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Filtros de rango y de persona
- **FOCAL 2:** Entradas del historial con el diff antes/después
- **SUPPORTING:** Actor y fecha de cada entrada
- **SECONDARY:** Motivo de cada entrada
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | AuditDateFilter | TextField type=date | Filtro de rango de fechas |
| C02 | AuditEntry (Reprogramar partido) | li con diff | Movimiento registrado con autor, fecha, motivo y valores |

### C01 — AuditDateFilter

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** TextField type=date
- **INSTANCE / ROLE:** Filtro de rango de fechas
- **SOURCE COMPONENT:** TextField / Field
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TextField (id/from/to)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=216.41 w=152 h=43.69
- CSS: width: 152px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 152px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=27.69 · padre 152×71.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- vacío (muestra el placeholder nativo dd/mm/aaaa)

#### INTERACTION

- trigger: change → query.set({from}) o query.set({to})

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 160 px (min-w-40), 43,69 px de alto
- 1440: 160 px

#### IMPLEMENTATION NOTES

- El filtro compara el día de la entrada (entry.at.slice(0,10)) contra los límites, de modo que ambos extremos son inclusivos.

### C02 — AuditEntry (Reprogramar partido)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** li con diff
- **INSTANCE / ROLE:** Movimiento registrado con autor, fecha, motivo y valores
- **SOURCE COMPONENT:** HistoryList / TimelineEntry
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** HistoryList / TimelineEntry
- **PARENT:** ul
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=385 y=305.09 w=894 h=115.16
- CSS: width: 894px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 894px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 894px · gap: 4px · padding: 12px 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by ul · offset dx=0 dy=0 · padre 894×344.47
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Reprogramar partido 19 oct, 06:00 p. m. 16:00 → 18:00 “Celular del entrenador” T"

#### STATE

- idle

#### INTERACTION

- No interactivo en esta pantalla

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px; el diff «16:00 → 18:00» con el valor anterior tachado
- 1440: 896 px

#### IMPLEMENTATION NOTES

- El motivo del movimiento se muestra con el campo `reason`, que en esta pantalla se alimenta de entry.source (el origen declarado de la acción).
- El enlace «Ver el objeto» de TimelineEntry NO se renderiza en esta pantalla: el componente exige las props `to` y `route`, y AuditPage sólo pasa `to`.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el bloque de filtros es `flex flex-wrap items-end gap-2` con un TextField de fecha (min-w-40 = 160 px), otro igual y un Select (min-w-48 = 192 px).
- Los inputs de fecha muestran el placeholder nativo «dd/mm/aaaa».
