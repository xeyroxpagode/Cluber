# SURFACE MAP — COM_ANNOUNCEMENT_002_AUDIENCE_SHEET

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# COM_ANNOUNCEMENT_002_AUDIENCE_SHEET

**SCREEN ID:** COM_ANNOUNCEMENT_002_AUDIENCE_SHEET

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Comunicado — hoja de audiencia

**PURPOSE AS IMPLEMENTED:** Hoja lateral que explica a quién le llegó el comunicado, con la audiencia congelada en la publicación.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /announcements/a1

**ORIGIN:** COM_ANNOUNCEMENT_001_DETAIL → «Quién lo ve»

**ACTOR:** SUBCOMMITTEE

**RESOURCE / FIXTURE IDS:** a1, audienceSnapshot Sexta A

**RESOURCE STATE:** PUBLICADO · hoja abierta

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /announcements/a1?demo=subcommittee.
2. Pulsar «Quién lo ve».

**RELATED SCREEN IDS:** COM_ANNOUNCEMENT_001_DETAIL, GBL_OVERLAY_003_SHEET_CAMBIAR_CONTRASENA

**RESPONSIVE COUNTERPART:** Sheet de 448 px (max-w-md): a 390 ocupa todo el ancho; a 1440 el 31%.

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** AnnouncementDetail > Sheet «Quién ve este comunicado», Sheet, RowStatic

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_ANNOUNCEMENT_002_AUDIENCE_SHEET_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «Quién ve este comunicado»
- **FOCAL 2:** Fila con la audiencia concreta
- **SUPPORTING:** Botón «Entendido»
- **SECONDARY:** Descripción del panel
- **AMBIENT:** Comunicado atenuado

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | AudienceSheet | section[role=dialog] | Detalle de la audiencia congelada |

### C01 — AudienceSheet

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Detalle de la audiencia congelada
- **SOURCE COMPONENT:** Sheet
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Sheet
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=0 w=390 h=844
- CSS: width: 390px · min-width: auto · min-height: auto · max-width: 448px

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 390px, min-width auto, max-width 448px

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · max-width: 448px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 390×844
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Quién ve este comunicado La audiencia quedó registrada al publicarlo. Equipos co"

#### STATE

- open

#### INTERACTION

- trigger: click en «Entendido» → cierra
- trigger: Escape → cierra
- focus trap: sí

#### MOTION

- Sin animación de entrada

#### RESPONSIVE

- 390: 100% del viewport
- 1440: 448 px a la derecha

#### IMPLEMENTATION NOTES

- El pie del Sheet tiene un solo botón primario «Entendido».

## SCROLL CONTRACT

- what scrolls: el cuerpo del sheet
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Sheet; cambia el porcentaje de viewport que ocupa.

# COM_ANNOUNCEMENT_002_AUDIENCE_SHEET

**SCREEN ID:** COM_ANNOUNCEMENT_002_AUDIENCE_SHEET

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Comunicado — hoja de audiencia

**PURPOSE AS IMPLEMENTED:** Hoja lateral que explica a quién le llegó el comunicado, con la audiencia congelada en la publicación.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /announcements/a1

**ORIGIN:** COM_ANNOUNCEMENT_001_DETAIL → «Quién lo ve»

**ACTOR:** SUBCOMMITTEE

**RESOURCE / FIXTURE IDS:** a1, audienceSnapshot Sexta A

**RESOURCE STATE:** PUBLICADO · hoja abierta

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /announcements/a1?demo=subcommittee.
2. Pulsar «Quién lo ve».

**RELATED SCREEN IDS:** COM_ANNOUNCEMENT_001_DETAIL, GBL_OVERLAY_003_SHEET_CAMBIAR_CONTRASENA

**RESPONSIVE COUNTERPART:** Sheet de 448 px (max-w-md): a 390 ocupa todo el ancho; a 1440 el 31%.

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** AnnouncementDetail > Sheet «Quién ve este comunicado», Sheet, RowStatic

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_ANNOUNCEMENT_002_AUDIENCE_SHEET_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «Quién ve este comunicado»
- **FOCAL 2:** Fila con la audiencia concreta
- **SUPPORTING:** Botón «Entendido»
- **SECONDARY:** Descripción del panel
- **AMBIENT:** Comunicado atenuado

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | AudienceSheet | section[role=dialog] | Detalle de la audiencia congelada |

### C01 — AudienceSheet

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Detalle de la audiencia congelada
- **SOURCE COMPONENT:** Sheet
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Sheet
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=992 y=0 w=448 h=900
- CSS: width: 448px · min-width: auto · min-height: auto · max-width: 448px

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 448px, min-width auto, max-width 448px

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · max-width: 448px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=992 dy=0 · padre 1440×900

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Quién ve este comunicado La audiencia quedó registrada al publicarlo. Equipos co"

#### STATE

- open

#### INTERACTION

- trigger: click en «Entendido» → cierra
- trigger: Escape → cierra
- focus trap: sí

#### MOTION

- Sin animación de entrada

#### RESPONSIVE

- 390: 100% del viewport
- 1440: 448 px a la derecha

#### IMPLEMENTATION NOTES

- El pie del Sheet tiene un solo botón primario «Entendido».

## SCROLL CONTRACT

- what scrolls: el cuerpo del sheet
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Sheet; cambia el porcentaje de viewport que ocupa.
