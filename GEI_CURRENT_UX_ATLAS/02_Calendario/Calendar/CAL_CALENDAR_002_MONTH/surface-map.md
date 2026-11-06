# SURFACE MAP — CAL_CALENDAR_002_MONTH

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_CALENDAR_002_MONTH

**SCREEN ID:** CAL_CALENDAR_002_MONTH

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Calendario — vista Mes

**PURPOSE AS IMPLEMENTED:** Matriz de 6 semanas × 7 días con hasta dos eventos por celda. Es la vista por defecto en escritorio.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /calendar?view=month

**ORIGIN:** CAL_CALENDAR_001_AGENDA → control «Mes»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** 11 eventos del mes visible

**RESOURCE STATE:** vista mes · sin selección

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /calendar?view=month&demo=coach.

**RELATED SCREEN IDS:** CAL_CALENDAR_001_AGENDA, CAL_CALENDAR_003_MONTH_EVENT_SELECTED

**RESPONSIVE COUNTERPART:** 390: la matriz se mantiene en 7 columnas dentro de 358 px; cada celda tiene min-h-[5.5rem] (88 px) y los chips de evento se truncan. 1440: la matriz ocupa la columna principal (~1014 px) y el panel lateral queda a la derecha.

**SOURCE FILES:** src/features/overview.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** Calendar > monthGrid, eventToneChip, Button size=sm

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_CALENDAR_002_MONTH_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Matriz del mes con los chips de evento
- **FOCAL 2:** Botones «Mes anterior» / «Mes siguiente»
- **SUPPORTING:** Filtros y control de vista
- **SECONDARY:** Panel lateral con la leyenda de estados
- **AMBIENT:** TopBar y BottomNav

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | MonthGrid | div grid con 7 columnas y gap-px | Matriz mensual de eventos |
| C02 | EventChip (celda del mes) | button truncado | Evento resumido: hora + tipo |
| C03 | MonthNavigation | div flex justify-between con 2 Button sm | Cambiar de mes |
| C04 | MonthLegendNote | p gei-meta | Explica la lectura de la matriz |

### C01 — MonthGrid

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** div grid con 7 columnas y gap-px
- **INSTANCE / ROLE:** Matriz mensual de eventos
- **SOURCE COMPONENT:** Calendar > monthGrid
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Calendar > monthGrid
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=17 y=445.59 w=356 h=30.84
- CSS: width: 356px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 356px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 50.8438px 50.8594px 50.8594px 50.8594px 50.8594px 50.8594px 50.8594px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=1 dy=1 · padre 358×566.84
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Dom Lun Mar Mié Jue Vie Sáb"

#### STATE

- octubre de 2026

#### INTERACTION

- trigger: click en un chip → query.set({event: id})

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px de ancho, 6 filas de 88 px mínimo
- 1440: columna principal del grid de 2 columnas

#### IMPLEMENTATION NOTES

- El fondo de la grilla es bg-line y las celdas bg-surface: el gap-px dibuja la retícula.
- Las celdas fuera del mes actual usan bg-page.
- El día actual se marca con ring-1 ring-inset ring-interactive y su número en text-interactive font-bold.

### C02 — EventChip (celda del mes)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** button truncado
- **INSTANCE / ROLE:** Evento resumido: hora + tipo
- **SOURCE COMPONENT:** Calendar > dayEvents button
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Calendar > button (eventToneChip)
- **PARENT:** li
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=23 y=769.28 w=91.05 h=22.84
- CSS: width: 91.0469px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 91.0469px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 4px 6px

#### SPATIAL RELATIONSHIPS

- contained-by li · offset dx=0 dy=0 · padre 91.05×22.84
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(238, 241, 245) · color: rgb(43, 54, 72) · border: 0px solid rgb(43, 54, 72) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 11px · line-height: 14.85px · font-weight: 600

#### CONTENT

- visible: "Entreno."

#### STATE

- idle

#### INTERACTION

- trigger: click → query.set({event: event.id})

#### MOTION

- transition-colors (sin duración declarada)

#### RESPONSIVE

- 390: 84–103 px de ancho, 22,84 px de alto, text-micro
- 1440: ancho de la celda menos el padding

#### IMPLEMENTATION NOTES

- El color depende del estado: CANCELLED/ABANDONED → bg-danger-soft text-danger; POSTPONED → bg-warning-soft text-warning; COMPLETED → bg-neutral-soft text-ink-muted; MATCH → bg-selected-soft text-selected; TRAINING → bg-neutral-soft text-ink-strong.
- El texto es «{hora} {Cancelado|Partido|Entreno.}».
- Si el evento está seleccionado se le añade outline-2 outline-offset-1 outline-interactive.
- Cada celda muestra como máximo 2 eventos; el resto se resume en «+N más».

### C03 — MonthNavigation

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** div flex justify-between con 2 Button sm
- **INSTANCE / ROLE:** Cambiar de mes
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=secondary size=sm
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=388.59 w=128.44 h=44
- CSS: width: 128.438px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 128.438px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×44
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-left (15x15)
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Mes anterior"

#### STATE

- idle

#### INTERACTION

- trigger: click → shiftMonth(±1) → cambia ?m= en la URL

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: 143,89 px y 136,05 px, alto 44 px
- 1440: idéntico, repartidos con justify-between

#### IMPLEMENTATION NOTES

- Cada botón lleva un ChevronLeft / ChevronRight de 15 px.

### C04 — MonthLegendNote

- **COMPONENT ID:** C04
- **COMPONENT TYPE:** p gei-meta
- **INSTANCE / ROLE:** Explica la lectura de la matriz
- **SOURCE COMPONENT:** Calendar > nota bajo la matriz
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Calendar > p (nota de la vista mes)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=1023.44 w=358 h=34.78
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=634.85 · padre 358×669.63
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "En el mes, cada celda muestra hasta dos eventos con hora y tipo. Tocá uno para v"

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×34,78 px, 2 líneas
- 1440: 1 línea en el ancho de la columna

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1459 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390: cada celda del mes mide ~51,14 px de ancho (358 / 7) y 88 px de alto mínimo; los chips de evento usan text-micro y `truncate`.
- 1440: celda de ~144,86 px de ancho; los chips pueden mostrar la hora y el tipo sin truncarse.
- La navegación de mes (Mes anterior / Mes siguiente) está por encima de la matriz en ambos viewports.

# CAL_CALENDAR_002_MONTH

**SCREEN ID:** CAL_CALENDAR_002_MONTH

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Calendario — vista Mes

**PURPOSE AS IMPLEMENTED:** Matriz de 6 semanas × 7 días con hasta dos eventos por celda. Es la vista por defecto en escritorio.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /calendar?view=month

**ORIGIN:** CAL_CALENDAR_001_AGENDA → control «Mes»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** 11 eventos del mes visible

**RESOURCE STATE:** vista mes · sin selección

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /calendar?view=month&demo=coach.

**RELATED SCREEN IDS:** CAL_CALENDAR_001_AGENDA, CAL_CALENDAR_003_MONTH_EVENT_SELECTED

**RESPONSIVE COUNTERPART:** 390: la matriz se mantiene en 7 columnas dentro de 358 px; cada celda tiene min-h-[5.5rem] (88 px) y los chips de evento se truncan. 1440: la matriz ocupa la columna principal (~1014 px) y el panel lateral queda a la derecha.

**SOURCE FILES:** src/features/overview.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** Calendar > monthGrid, eventToneChip, Button size=sm

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_CALENDAR_002_MONTH_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Matriz del mes con los chips de evento
- **FOCAL 2:** Botones «Mes anterior» / «Mes siguiente»
- **SUPPORTING:** Filtros y control de vista
- **SECONDARY:** Panel lateral con la leyenda de estados
- **AMBIENT:** TopBar y BottomNav

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | MonthGrid | div grid con 7 columnas y gap-px | Matriz mensual de eventos |
| C02 | EventChip (celda del mes) | button truncado | Evento resumido: hora + tipo |
| C03 | MonthNavigation | div flex justify-between con 2 Button sm | Cambiar de mes |
| C04 | MonthLegendNote | p gei-meta | Explica la lectura de la matriz |

### C01 — MonthGrid

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** div grid con 7 columnas y gap-px
- **INSTANCE / ROLE:** Matriz mensual de eventos
- **SOURCE COMPONENT:** Calendar > monthGrid
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Calendar > monthGrid
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=257 y=383.59 w=782 h=30.84
- CSS: width: 782px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 782px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 111.703px 111.719px 111.719px 111.703px 111.719px 111.719px 111.719px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=1 dy=1 · padre 784×566.84
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Dom Lun Mar Mié Jue Vie Sáb"

#### STATE

- octubre de 2026

#### INTERACTION

- trigger: click en un chip → query.set({event: id})

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px de ancho, 6 filas de 88 px mínimo
- 1440: columna principal del grid de 2 columnas

#### IMPLEMENTATION NOTES

- El fondo de la grilla es bg-line y las celdas bg-surface: el gap-px dibuja la retícula.
- Las celdas fuera del mes actual usan bg-page.
- El día actual se marca con ring-1 ring-inset ring-interactive y su número en text-interactive font-bold.

### C02 — EventChip (celda del mes)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** button truncado
- **INSTANCE / ROLE:** Evento resumido: hora + tipo
- **SOURCE COMPONENT:** Calendar > dayEvents button
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Calendar > button (eventToneChip)
- **PARENT:** li
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=263 y=707.28 w=98.84 h=22.84
- CSS: width: 98.8438px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 98.8438px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 4px 6px

#### SPATIAL RELATIONSHIPS

- contained-by li · offset dx=0 dy=0 · padre 98.84×22.84
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(238, 241, 245) · color: rgb(43, 54, 72) · border: 0px solid rgb(43, 54, 72) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 11px · line-height: 14.85px · font-weight: 600

#### CONTENT

- visible: "Entreno."

#### STATE

- idle

#### INTERACTION

- trigger: click → query.set({event: event.id})

#### MOTION

- transition-colors (sin duración declarada)

#### RESPONSIVE

- 390: 84–103 px de ancho, 22,84 px de alto, text-micro
- 1440: ancho de la celda menos el padding

#### IMPLEMENTATION NOTES

- El color depende del estado: CANCELLED/ABANDONED → bg-danger-soft text-danger; POSTPONED → bg-warning-soft text-warning; COMPLETED → bg-neutral-soft text-ink-muted; MATCH → bg-selected-soft text-selected; TRAINING → bg-neutral-soft text-ink-strong.
- El texto es «{hora} {Cancelado|Partido|Entreno.}».
- Si el evento está seleccionado se le añade outline-2 outline-offset-1 outline-interactive.
- Cada celda muestra como máximo 2 eventos; el resto se resume en «+N más».

### C03 — MonthNavigation

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** div flex justify-between con 2 Button sm
- **INSTANCE / ROLE:** Cambiar de mes
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=secondary size=sm
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=256 y=326.59 w=128.44 h=44
- CSS: width: 128.438px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 128.438px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 784×44
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-left (15x15)
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Mes anterior"

#### STATE

- idle

#### INTERACTION

- trigger: click → shiftMonth(±1) → cambia ?m= en la URL

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: 143,89 px y 136,05 px, alto 44 px
- 1440: idéntico, repartidos con justify-between

#### IMPLEMENTATION NOTES

- Cada botón lleva un ChevronLeft / ChevronRight de 15 px.

### C04 — MonthLegendNote

- **COMPONENT ID:** C04
- **COMPONENT TYPE:** p gei-meta
- **INSTANCE / ROLE:** Explica la lectura de la matriz
- **SOURCE COMPONENT:** Calendar > nota bajo la matriz
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Calendar > p (nota de la vista mes)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=256 y=961.44 w=784 h=17.39
- CSS: width: 784px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 784px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=634.85 · padre 784×652.23
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "En el mes, cada celda muestra hasta dos eventos con hora y tipo. Tocá uno para v"

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×34,78 px, 2 líneas
- 1440: 1 línea en el ancho de la columna

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1043 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390: cada celda del mes mide ~51,14 px de ancho (358 / 7) y 88 px de alto mínimo; los chips de evento usan text-micro y `truncate`.
- 1440: celda de ~144,86 px de ancho; los chips pueden mostrar la hora y el tipo sin truncarse.
- La navegación de mes (Mes anterior / Mes siguiente) está por encima de la matriz en ambos viewports.
