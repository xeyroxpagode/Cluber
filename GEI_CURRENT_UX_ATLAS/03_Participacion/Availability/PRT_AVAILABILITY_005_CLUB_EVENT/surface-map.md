# SURFACE MAP — PRT_AVAILABILITY_005_CLUB_EVENT

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# PRT_AVAILABILITY_005_CLUB_EVENT

**SCREEN ID:** PRT_AVAILABILITY_005_CLUB_EVENT

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Disponibilidad — evento de club sin roster

**PURPOSE AS IMPLEMENTED:** Disponibilidad de un evento clubWide: el roster se construye con los equipos destino (vacío) y las personas destino (vacía), por lo que la lista queda vacía.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/club-familias/availability

**ORIGIN:** URL directa

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** club-familias (clubWide, targetTeams=[])

**RESOURCE STATE:** SCHEDULED · 0 personas en el roster

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/club-familias/availability?demo=coach.

**RELATED SCREEN IDS:** PRT_AVAILABILITY_001_DEFAULT

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/participation.tsx

**SOURCE SYMBOLS:** AvailabilityPage (roster derivado de targetTeams + targetPersonIds)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_AVAILABILITY_005_CLUB_EVENT_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Encabezado con «0 personas de todo el hockey»
- **FOCAL 2:** Bloque «Resumen» con todos los contadores en 0
- **SUPPORTING:** Control ¿Vas? de sólo consulta
- **SECONDARY:** Sección «Respuestas» vacía
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | SummarySurface (todos en 0) | Surface | Resumen sin datos |

### C01 — SummarySurface (todos en 0)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Surface
- **INSTANCE / ROLE:** Resumen sin datos
- **SOURCE COMPONENT:** Surface + RowStatic
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** AvailabilityPage > Surface (Resumen)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=400.53 w=76.34 h=21.25
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

- vacío (0 en los 5 valores)

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: 896 px

#### IMPLEMENTATION NOTES

- El roster se arma con event.targetTeams y event.targetPersonIds; un evento clubWide con ambos vacíos no deja ninguna persona en la lista.
- El lead del encabezado dice «0 personas de todo el hockey».

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 891 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.

# PRT_AVAILABILITY_005_CLUB_EVENT

**SCREEN ID:** PRT_AVAILABILITY_005_CLUB_EVENT

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Disponibilidad — evento de club sin roster

**PURPOSE AS IMPLEMENTED:** Disponibilidad de un evento clubWide: el roster se construye con los equipos destino (vacío) y las personas destino (vacía), por lo que la lista queda vacía.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/club-familias/availability

**ORIGIN:** URL directa

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** club-familias (clubWide, targetTeams=[])

**RESOURCE STATE:** SCHEDULED · 0 personas en el roster

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/club-familias/availability?demo=coach.

**RELATED SCREEN IDS:** PRT_AVAILABILITY_001_DEFAULT

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/participation.tsx

**SOURCE SYMBOLS:** AvailabilityPage (roster derivado de targetTeams + targetPersonIds)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_AVAILABILITY_005_CLUB_EVENT_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Encabezado con «0 personas de todo el hockey»
- **FOCAL 2:** Bloque «Resumen» con todos los contadores en 0
- **SUPPORTING:** Control ¿Vas? de sólo consulta
- **SECONDARY:** Sección «Respuestas» vacía
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | SummarySurface (todos en 0) | Surface | Resumen sin datos |

### C01 — SummarySurface (todos en 0)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Surface
- **INSTANCE / ROLE:** Resumen sin datos
- **SOURCE COMPONENT:** Surface + RowStatic
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** AvailabilityPage > Surface (Resumen)
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

- vacío (0 en los 5 valores)

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: 896 px

#### IMPLEMENTATION NOTES

- El roster se arma con event.targetTeams y event.targetPersonIds; un evento clubWide con ambos vacíos no deja ninguna persona en la lista.
- El lead del encabezado dice «0 personas de todo el hockey».

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.
