# SURFACE MAP — COM_ANNOUNCEMENT_005_DRAFT

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# COM_ANNOUNCEMENT_005_DRAFT

**SCREEN ID:** COM_ANNOUNCEMENT_005_DRAFT

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Comunicado — borrador

**PURPOSE AS IMPLEMENTED:** Comunicado en borrador: la pantalla no muestra el snapshot de audiencia (no hay audiencia registrada hasta publicar) y el badge indica el estado.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /announcements/a3

**ORIGIN:** Comunicación → «Comunicados» → fila «Cierre de temporada 2026»

**ACTOR:** SUBCOMMITTEE

**RESOURCE / FIXTURE IDS:** a3 (Cierre de temporada 2026)

**RESOURCE STATE:** DRAFT · audienceSnapshot = null

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /announcements/a3?demo=subcommittee.

**RELATED SCREEN IDS:** COM_ANNOUNCEMENT_001_DETAIL, COM_ANNOUNCEMENT_006_NOT_REACHED

**RESPONSIVE COUNTERPART:** Contenedor max-w-2xl en ambos viewports.

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** AnnouncementDetail (snapshot null)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_ANNOUNCEMENT_005_DRAFT_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «Cierre de temporada 2026»
- **FOCAL 2:** Badge «Borrador»
- **SUPPORTING:** Cuerpo del comunicado
- **SECONDARY:** Lead de publicación
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | StateBadge (Borrador) | span badge emphasis | Estado del comunicado |

### C01 — StateBadge (Borrador)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** span badge emphasis
- **INSTANCE / ROLE:** Estado del comunicado
- **SOURCE COMPONENT:** StateBadge
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** StateBadge value=announcement.state emphasis
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=238.13 w=67.22 h=23
- CSS: width: 67.2188px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 67.2188px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 6px · padding: 4px 8px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=6.5 · padre 169.23×36
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(238, 241, 245) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 15px · font-weight: 600

#### CONTENT

- visible: "Borrador"

#### STATE

- DRAFT → neutral

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: inline-flex
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El bloque del snapshot no se renderiza: en un borrador no hay audiencia registrada.
- El lead sigue mostrando «Publicado el {fecha} por {autor}» aunque el comunicado no esté publicado: el texto es el mismo en ambos estados.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# COM_ANNOUNCEMENT_005_DRAFT

**SCREEN ID:** COM_ANNOUNCEMENT_005_DRAFT

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Comunicado — borrador

**PURPOSE AS IMPLEMENTED:** Comunicado en borrador: la pantalla no muestra el snapshot de audiencia (no hay audiencia registrada hasta publicar) y el badge indica el estado.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /announcements/a3

**ORIGIN:** Comunicación → «Comunicados» → fila «Cierre de temporada 2026»

**ACTOR:** SUBCOMMITTEE

**RESOURCE / FIXTURE IDS:** a3 (Cierre de temporada 2026)

**RESOURCE STATE:** DRAFT · audienceSnapshot = null

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /announcements/a3?demo=subcommittee.

**RELATED SCREEN IDS:** COM_ANNOUNCEMENT_001_DETAIL, COM_ANNOUNCEMENT_006_NOT_REACHED

**RESPONSIVE COUNTERPART:** Contenedor max-w-2xl en ambos viewports.

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** AnnouncementDetail (snapshot null)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_ANNOUNCEMENT_005_DRAFT_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «Cierre de temporada 2026»
- **FOCAL 2:** Badge «Borrador»
- **SUPPORTING:** Cuerpo del comunicado
- **SECONDARY:** Lead de publicación
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | StateBadge (Borrador) | span badge emphasis | Estado del comunicado |

### C01 — StateBadge (Borrador)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** span badge emphasis
- **INSTANCE / ROLE:** Estado del comunicado
- **SOURCE COMPONENT:** StateBadge
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** StateBadge value=announcement.state emphasis
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=998.77 y=143.5 w=67.22 h=23
- CSS: width: 67.2188px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 67.2188px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 6px · padding: 4px 8px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=6.5 · padre 169.23×36
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(238, 241, 245) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 15px · font-weight: 600

#### CONTENT

- visible: "Borrador"

#### STATE

- DRAFT → neutral

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: inline-flex
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El bloque del snapshot no se renderiza: en un borrador no hay audiencia registrada.
- El lead sigue mostrando «Publicado el {fecha} por {autor}» aunque el comunicado no esté publicado: el texto es el mismo en ambos estados.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
