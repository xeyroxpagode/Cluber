# SURFACE MAP — PRT_AVAILABILITY_001_DEFAULT

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# PRT_AVAILABILITY_001_DEFAULT

**SCREEN ID:** PRT_AVAILABILITY_001_DEFAULT

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Disponibilidad — detalle de respuestas de un evento

**PURPOSE AS IMPLEMENTED:** Pantalla que lista la disponibilidad de todas las personas del evento con su estado derivado y un resumen por valor. Se alcanza por URL directa: no hay enlace a esta ruta en la navegación actual.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-cuba/availability

**ORIGIN:** URL directa (no hay link en la UI actual a /availability)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba, p0..p7 (8 personas de Sexta A)

**RESOURCE STATE:** SCHEDULED · 8 respuestas · p0 con NEEDS_RECONFIRMATION

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba/availability?demo=coach.

**RELATED SCREEN IDS:** PRT_AVAILABILITY_002_PLAYER_SELF, CAL_EVENT_DETAIL_001_SCHEDULED_COACH

**RESPONSIVE COUNTERPART:** 390: una columna de 358 px; el Surface del control ¿Vas? va arriba y la lista de respuestas debajo. 1440: misma composición con max-w-4xl (896 px).

**SOURCE FILES:** src/features/participation.tsx, src/shared/vas.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** AvailabilityPage, VasControl, SectionHeader, RowStatic, StateBadge, DetailSection

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_AVAILABILITY_001_DEFAULT_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Lista de respuestas con el estado de cada persona
- **FOCAL 2:** Bloque «Resumen» con los contadores por valor
- **SUPPORTING:** Control ¿Vas? del actor en la parte superior
- **SECONDARY:** Encabezado con la fecha y el equipo
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PageContextHeader (Disponibilidad) | header grid con back | Nombre del evento y alcance de personas |
| C02 | VasControl (propio) | RadioGroup dentro de Surface | Respuesta de disponibilidad del actor en esta pantalla |
| C03 | SummarySurface (Resumen) | Surface grid con 5 RowStatic | Contadores por valor de respuesta |
| C04 | ResponsesList (Respuestas) | ul con li flex-wrap | Estado de respuesta de cada persona del roster |

### C01 — PageContextHeader (Disponibilidad)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid con back
- **INSTANCE / ROLE:** Nombre del evento y alcance de personas
- **SOURCE COMPONENT:** PageContextHeader
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** PageContextHeader
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=0 w=390 h=65
- CSS: width: 390px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- sticky

#### CONSTRAINTS

- width 390px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 390×1213.41
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: oklab(0.999994 0.0000455678 0.0000200868 / 0.95) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "GEI Eventos TB"

#### STATE

- idle

#### INTERACTION

- trigger: click en «Volver» → /events/match-cuba

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×143,13 px
- 1440: 896 px

#### IMPLEMENTATION NOTES

- El lead declara cuántas personas son del equipo: «8 personas de Sexta A».

### C02 — VasControl (propio)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** RadioGroup dentro de Surface
- **INSTANCE / ROLE:** Respuesta de disponibilidad del actor en esta pantalla
- **SOURCE COMPONENT:** VasControl
- **SOURCE FILE:** src/shared/vas.tsx
- **SOURCE SYMBOL:** VasControl
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=258.13 w=326.48 h=34.78
- CSS: width: 326.484px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 326.484px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=17 dy=17 · padre 360.48×68.78

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Vos no jugás este evento, así que no respondés disponibilidad. La lista de respu"

#### STATE

- el COACH no puede responder (canRespondOwn false) → texto de sólo consulta

#### INTERACTION

- Para quien sí puede: click en una opción → respondAvailability + toast

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 3 columnas de 100 px
- 1440: 3 columnas más anchas

#### IMPLEMENTATION NOTES

- —

### C03 — SummarySurface (Resumen)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** Surface grid con 5 RowStatic
- **INSTANCE / ROLE:** Contadores por valor de respuesta
- **SOURCE COMPONENT:** Surface + RowStatic + StateBadge
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** AvailabilityPage > Surface (Resumen),RowStatic,StateBadge
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=370.91 w=76.34 h=21.25
- CSS: width: 76.3438px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 76.3438px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 76.34×21.25
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Resumen"

#### STATE

- con contadores

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px de ancho
- 1440: 896 px

#### IMPLEMENTATION NOTES

- Cada fila lleva un StateBadge con el valor (YES→success, MAYBE→warning, NO→danger, NO_RESPONSE→neutral, NEEDS_RECONFIRMATION→attention) y la cifra a la derecha.

### C04 — ResponsesList (Respuestas)

- **COMPONENT ID:** C04
- **COMPONENT TYPE:** ul con li flex-wrap
- **INSTANCE / ROLE:** Estado de respuesta de cada persona del roster
- **SOURCE COMPONENT:** DetailSection + li
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** AvailabilityPage > DetailSection «Respuestas»
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=716.16 w=95.72 h=21.25
- CSS: width: 95.7188px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 95.7188px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 95.72×21.25
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Respuestas"

#### STATE

- 8 filas

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: cada fila: min-h-11 con borde inferior y wrap
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El nombre va en gei-item-title con el sufijo «(vos)» en text-meta para la persona actual.
- El estado se muestra con StateBadge a la derecha.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1213 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: la lista de respuestas es una columna en ambos; el contenedor pasa de 358 a 896 px y las filas quedan más anchas.
- El bloque «Resumen» usa 5 filas (Voy / Tal vez / No voy / Hay que volver a confirmar / Sin responder) con su contador.

# PRT_AVAILABILITY_001_DEFAULT

**SCREEN ID:** PRT_AVAILABILITY_001_DEFAULT

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Disponibilidad — detalle de respuestas de un evento

**PURPOSE AS IMPLEMENTED:** Pantalla que lista la disponibilidad de todas las personas del evento con su estado derivado y un resumen por valor. Se alcanza por URL directa: no hay enlace a esta ruta en la navegación actual.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-cuba/availability

**ORIGIN:** URL directa (no hay link en la UI actual a /availability)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba, p0..p7 (8 personas de Sexta A)

**RESOURCE STATE:** SCHEDULED · 8 respuestas · p0 con NEEDS_RECONFIRMATION

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba/availability?demo=coach.

**RELATED SCREEN IDS:** PRT_AVAILABILITY_002_PLAYER_SELF, CAL_EVENT_DETAIL_001_SCHEDULED_COACH

**RESPONSIVE COUNTERPART:** 390: una columna de 358 px; el Surface del control ¿Vas? va arriba y la lista de respuestas debajo. 1440: misma composición con max-w-4xl (896 px).

**SOURCE FILES:** src/features/participation.tsx, src/shared/vas.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** AvailabilityPage, VasControl, SectionHeader, RowStatic, StateBadge, DetailSection

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_AVAILABILITY_001_DEFAULT_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Lista de respuestas con el estado de cada persona
- **FOCAL 2:** Bloque «Resumen» con los contadores por valor
- **SUPPORTING:** Control ¿Vas? del actor en la parte superior
- **SECONDARY:** Encabezado con la fecha y el equipo
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PageContextHeader (Disponibilidad) | header grid con back | Nombre del evento y alcance de personas |
| C02 | VasControl (propio) | RadioGroup dentro de Surface | Respuesta de disponibilidad del actor en esta pantalla |
| C03 | SummarySurface (Resumen) | Surface grid con 5 RowStatic | Contadores por valor de respuesta |
| C04 | ResponsesList (Respuestas) | ul con li flex-wrap | Estado de respuesta de cada persona del roster |

### C01 — PageContextHeader (Disponibilidad)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid con back
- **INSTANCE / ROLE:** Nombre del evento y alcance de personas
- **SOURCE COMPONENT:** PageContextHeader
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** PageContextHeader
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=0 w=1440 h=65
- CSS: width: 1440px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- sticky

#### CONSTRAINTS

- width 1440px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 1440×1164.02
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: oklab(0.999994 0.0000455678 0.0000200868 / 0.95) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Hockey Eventos Buscar ⌘K TB"

#### STATE

- idle

#### INTERACTION

- trigger: click en «Volver» → /events/match-cuba

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×143,13 px
- 1440: 896 px

#### IMPLEMENTATION NOTES

- El lead declara cuántas personas son del equipo: «8 personas de Sexta A».

### C02 — VasControl (propio)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** RadioGroup dentro de Surface
- **INSTANCE / ROLE:** Respuesta de disponibilidad del actor en esta pantalla
- **SOURCE COMPONENT:** VasControl
- **SOURCE FILE:** src/shared/vas.tsx
- **SOURCE SYMBOL:** VasControl
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=405 y=262.13 w=854 h=17.39
- CSS: width: 854px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 854px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=21 dy=21 · padre 896×59.39

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Vos no jugás este evento, así que no respondés disponibilidad. La lista de respu"

#### STATE

- el COACH no puede responder (canRespondOwn false) → texto de sólo consulta

#### INTERACTION

- Para quien sí puede: click en una opción → respondAvailability + toast

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 3 columnas de 100 px
- 1440: 3 columnas más anchas

#### IMPLEMENTATION NOTES

- —

### C03 — SummarySurface (Resumen)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** Surface grid con 5 RowStatic
- **INSTANCE / ROLE:** Contadores por valor de respuesta
- **SOURCE COMPONENT:** Surface + RowStatic + StateBadge
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** AvailabilityPage > Surface (Resumen),RowStatic,StateBadge
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=405 y=365.52 w=76.34 h=21.25
- CSS: width: 76.3438px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 76.3438px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 76.34×21.25
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Resumen"

#### STATE

- con contadores

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px de ancho
- 1440: 896 px

#### IMPLEMENTATION NOTES

- Cada fila lleva un StateBadge con el valor (YES→success, MAYBE→warning, NO→danger, NO_RESPONSE→neutral, NEEDS_RECONFIRMATION→attention) y la cifra a la derecha.

### C04 — ResponsesList (Respuestas)

- **COMPONENT ID:** C04
- **COMPONENT TYPE:** ul con li flex-wrap
- **INSTANCE / ROLE:** Estado de respuesta de cada persona del roster
- **SOURCE COMPONENT:** DetailSection + li
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** AvailabilityPage > DetailSection «Respuestas»
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=714.77 w=95.72 h=21.25
- CSS: width: 95.7188px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 95.7188px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 95.72×21.25
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Respuestas"

#### STATE

- 8 filas

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: cada fila: min-h-11 con borde inferior y wrap
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El nombre va en gei-item-title con el sufijo «(vos)» en text-meta para la persona actual.
- El estado se muestra con StateBadge a la derecha.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1164 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: la lista de respuestas es una columna en ambos; el contenedor pasa de 358 a 896 px y las filas quedan más anchas.
- El bloque «Resumen» usa 5 filas (Voy / Tal vez / No voy / Hay que volver a confirmar / Sin responder) con su contador.
