# SURFACE MAP — PRT_MATCH_RECORD_003_FINAL

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# PRT_MATCH_RECORD_003_FINAL

**SCREEN ID:** PRT_MATCH_RECORD_003_FINAL

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Resultado — oficial (finalizado)

**PURPOSE AS IMPLEMENTED:** Acta finalizada: banner de resultado oficial, campos bloqueados y acción de corrección con motivo.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-sic/match-record

**ORIGIN:** Detalle de evento → «Resultado»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-sic, recordHistory con 1 corrección

**RESOURCE STATE:** COMPLETED · record FINAL 3–1

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-sic/match-record?demo=coach.

**RELATED SCREEN IDS:** PRT_MATCH_RECORD_005_CORRECT_CONFIRM, PRT_MATCH_RECORD_008_HISTORY_OPEN

**RESPONSIVE COUNTERPART:** Los campos siguen en una columna en 390 y dos en 1440, pero deshabilitados.

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** MatchRecordPage (isFinal), Banner tone=success, Button variant=danger

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_MATCH_RECORD_003_FINAL_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Banner verde «Resultado oficial»
- **FOCAL 2:** Marcador «3 – 1»
- **SUPPORTING:** Botón «Corregir el resultado»
- **SECONDARY:** Observaciones del acta
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | OfficialResultBanner | Banner tone=success | Declara el resultado como oficial |
| C02 | CorrectRecordButton | Button danger | Abrir la corrección del resultado |

### C01 — OfficialResultBanner

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Banner tone=success
- **INSTANCE / ROLE:** Declara el resultado como oficial
- **SOURCE COMPONENT:** Banner
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Banner tone=success (isFinal)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=276.13 w=358 h=124.75
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 12px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=187.13 · padre 358×1029.84
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(231, 244, 236) · color: rgb(16, 23, 37) · border: 1px solid rgb(185, 223, 201) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-circle-check lucide-check-circle-2 mt-0.5 shrink-0 text-success (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Resultado oficial jueves, 15 de octubre de 2026 · cargado por el club. Corregirl"

#### STATE

- success

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 2 líneas
- 1440: 1 línea

#### IMPLEMENTATION NOTES

- Incluye la fecha y la advertencia de que corregirlo pide motivo.

### C02 — CorrectRecordButton

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Button danger
- **INSTANCE / ROLE:** Abrir la corrección del resultado
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=danger «Corregir el resultado»
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=895.06 w=189.34 h=46
- CSS: width: 189.344px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 189.344px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 324×46
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(253, 236, 236) · color: rgb(163, 35, 43) · border: 1px solid rgb(242, 194, 196) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Corregir el resultado"

#### STATE

- idle

#### INTERACTION

- trigger: click → abre el ConfirmDialog de corrección

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: min-height 44 px, borde border-danger-line y fondo bg-danger-soft
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1231 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.

# PRT_MATCH_RECORD_003_FINAL

**SCREEN ID:** PRT_MATCH_RECORD_003_FINAL

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Resultado — oficial (finalizado)

**PURPOSE AS IMPLEMENTED:** Acta finalizada: banner de resultado oficial, campos bloqueados y acción de corrección con motivo.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-sic/match-record

**ORIGIN:** Detalle de evento → «Resultado»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-sic, recordHistory con 1 corrección

**RESOURCE STATE:** COMPLETED · record FINAL 3–1

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-sic/match-record?demo=coach.

**RELATED SCREEN IDS:** PRT_MATCH_RECORD_005_CORRECT_CONFIRM, PRT_MATCH_RECORD_008_HISTORY_OPEN

**RESPONSIVE COUNTERPART:** Los campos siguen en una columna en 390 y dos en 1440, pero deshabilitados.

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** MatchRecordPage (isFinal), Banner tone=success, Button variant=danger

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_MATCH_RECORD_003_FINAL_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Banner verde «Resultado oficial»
- **FOCAL 2:** Marcador «3 – 1»
- **SUPPORTING:** Botón «Corregir el resultado»
- **SECONDARY:** Observaciones del acta
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | OfficialResultBanner | Banner tone=success | Declara el resultado como oficial |
| C02 | CorrectRecordButton | Button danger | Abrir la corrección del resultado |

### C01 — OfficialResultBanner

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Banner tone=success
- **INSTANCE / ROLE:** Declara el resultado como oficial
- **SOURCE COMPONENT:** Banner
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Banner tone=success (isFinal)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=241.13 w=768 h=81.38
- CSS: width: 768px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 768px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 12px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=152.13 · padre 768×861.02
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(231, 244, 236) · color: rgb(16, 23, 37) · border: 1px solid rgb(185, 223, 201) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-circle-check lucide-check-circle-2 mt-0.5 shrink-0 text-success (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Resultado oficial jueves, 15 de octubre de 2026 · cargado por el club. Corregirl"

#### STATE

- success

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 2 líneas
- 1440: 1 línea

#### IMPLEMENTATION NOTES

- Incluye la fecha y la advertencia de que corregirlo pide motivo.

### C02 — CorrectRecordButton

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Button danger
- **INSTANCE / ROLE:** Abrir la corrección del resultado
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=danger «Corregir el resultado»
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=469 y=731.63 w=189.34 h=46
- CSS: width: 189.344px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 189.344px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 726×46
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(253, 236, 236) · color: rgb(163, 35, 43) · border: 1px solid rgb(242, 194, 196) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Corregir el resultado"

#### STATE

- idle

#### INTERACTION

- trigger: click → abre el ConfirmDialog de corrección

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: min-height 44 px, borde border-danger-line y fondo bg-danger-soft
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1014 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.
