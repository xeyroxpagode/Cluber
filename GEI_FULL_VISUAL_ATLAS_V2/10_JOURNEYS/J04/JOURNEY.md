# JOURNEY J04 — Home → Availability response

**Actor:** PLAYER
**Inicio:** Home
**Fin:** Availability response
**Pasos:** 4
**Rutas alternativas:** -

## Superficies cubiertas

| # | Surface ID | Dominio | Ruta | Estado | Actor | 390×844 | 1440×900 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `CAL_EVENT_DETAIL_009_PLAYER_VIEW` | 04_CALENDAR_PARTICIPATION | `/events/match-cuba` | SCHEDULED · p2 en la convocatoria publicada | PLAYER | CAPTURED | CAPTURED |
| 2 | `GBL_NAV_001_SIDEBAR_ACTIVE_CALENDAR` | 01_GLOBAL | `/calendar` | AUTHENTICATED · ruta /calendar | COACH | N/A | CAPTURED |
| 3 | `GBL_NAV_002_BOTTOMNAV_ACTIVE_CALENDAR` | 01_GLOBAL | `/calendar` | AUTHENTICATED · ruta /calendar | COACH | CAPTURED | N/A |
| 4 | `GBL_NAV_004_SIDEBAR_BADGES_COACH` | 01_GLOBAL | `/home` | AUTHENTICATED · 2 mensajes sin leer · 1 aviso sin leer | COACH | N/A | CAPTURED |
| 5 | `GBL_NAV_005_SIDEBAR_BADGES_ADMIN` | 01_GLOBAL | `/home` | AUTHENTICATED · sin conversaciones habilitadas | ADMIN | N/A | CAPTURED |
| 6 | `GBL_NAV_006_SCROLL_02` | 01_GLOBAL | `/home` | AUTHENTICATED · página desplazada 900 px | ADMIN | N/A | CAPTURED |
| 7 | `GBL_OVERLAY_004_TOAST_RESPUESTA_GUARDADA` | 01_GLOBAL | `/events/match-cuba` | Disponibilidad guardada · toast visible | PLAYER | CAPTURED | CAPTURED |
| 8 | `GBL_SHELL_001_TOPBAR_MOBILE` | 01_GLOBAL | `/home` | AUTHENTICATED · sin avisos sin leer | COACH | CAPTURED | N/A |
| 9 | `GBL_SHELL_002_TOPBAR_DESKTOP` | 01_GLOBAL | `/home` | AUTHENTICATED | COACH | N/A | CAPTURED |
| 10 | `GBL_SHELL_003_BYPASS_LINK_FOCUSED` | 01_GLOBAL | `/home` | AUTHENTICATED · elemento con foco | COACH | CAPTURED | CAPTURED |
| 11 | `GBL_STATE_001_NOT_FOUND` | 01_GLOBAL | `/ruta-inexistente` | RUTA NO RECONOCIDA | COACH | CAPTURED | CAPTURED |
| 12 | `HOME_001_DEFAULT_COACH` | 03_HOME | `/home` | COACH · sin pendientes propios | COACH | CAPTURED | CAPTURED |
| 13 | `HOME_002_DEFAULT_ADMIN` | 03_HOME | `/home` | ADMIN · 2 items de atención | ADMIN | CAPTURED | CAPTURED |
| 14 | `HOME_003_ATTENTION_ITEMS_ADMIN` | 03_HOME | `/home` | ADMIN · bloque de atención visible | ADMIN | CAPTURED | CAPTURED |
| 15 | `HOME_006_SCROLL_02` | 03_HOME | `/home` | COACH · scroll 760 px | COACH | CAPTURED | CAPTURED |
| 16 | `HOME_007_COMMS_SECTION` | 03_HOME | `/home` | PLAYER · 1 mensaje sin leer · 1 aviso sin leer | PLAYER | CAPTURED | CAPTURED |
| 17 | `PRT_AVAILABILITY_001_DEFAULT` | 04_CALENDAR_PARTICIPATION | `/events/match-cuba/availability` | SCHEDULED · 8 respuestas · p0 con NEEDS_RECONFIRMATION | COACH | CAPTURED | CAPTURED |
| 18 | `PRT_AVAILABILITY_002_PLAYER_SELF` | 04_CALENDAR_PARTICIPATION | `/events/match-cuba/availability` | SCHEDULED · p2 sin responder | PLAYER | CAPTURED | CAPTURED |
| 19 | `PRT_AVAILABILITY_003_POSTPONED` | 04_CALENDAR_PARTICIPATION | `/events/match-banco/availability` | POSTPONED | COACH | CAPTURED | CAPTURED |
| 20 | `PRT_AVAILABILITY_004_SCROLL_02` | 04_CALENDAR_PARTICIPATION | `/events/match-cuba/availability` | SCHEDULED · scroll 700 px | COACH | CAPTURED | CAPTURED |
| 21 | `PRT_AVAILABILITY_005_CLUB_EVENT` | 04_CALENDAR_PARTICIPATION | `/events/club-familias/availability` | SCHEDULED · 0 personas en el roster | COACH | CAPTURED | CAPTURED |

## Capturas

### 1. `CAL_EVENT_DETAIL_009_PLAYER_VIEW`

- **390×844:** CAPTURED — `04_CALENDAR_PARTICIPATION/Event/Detail/CAL_EVENT_DETAIL_009_PLAYER_VIEW/CAL_EVENT_DETAIL_009_PLAYER_VIEW__PLAYER__390x844.png`
- **1440×900:** CAPTURED — `04_CALENDAR_PARTICIPATION/Event/Detail/CAL_EVENT_DETAIL_009_PLAYER_VIEW/CAL_EVENT_DETAIL_009_PLAYER_VIEW__PLAYER__1440x900.png`

### 2. `GBL_NAV_001_SIDEBAR_ACTIVE_CALENDAR`

- **390×844:** N/A — CURRENT does not render this surface at this viewport
  - reason: La barra lateral de destinos no se renderiza por debajo del breakpoint lg (1024 px). El <nav aria-label="Destinos"> de escritorio lleva las clases `hidden ... lg:flex` (src/app/Shell.tsx:183-185), de modo que su computed display es `none` a 390 px.
  - alternate surface/route: GBL_NAV_002_BOTTOMNAV_ACTIVE_CALENDAR — misma ruta /calendar, actor COACH, viewport 390×844.
- **1440×900:** CAPTURED — `01_GLOBAL/Navigation/GBL_NAV_001_SIDEBAR_ACTIVE_CALENDAR/GBL_NAV_001_SIDEBAR_ACTIVE_CALENDAR__COACH__1440x900.png`

### 3. `GBL_NAV_002_BOTTOMNAV_ACTIVE_CALENDAR`

- **390×844:** CAPTURED — `01_GLOBAL/Navigation/GBL_NAV_002_BOTTOMNAV_ACTIVE_CALENDAR/GBL_NAV_002_BOTTOMNAV_ACTIVE_CALENDAR__COACH__390x844.png`
- **1440×900:** N/A — CURRENT does not render this surface at this viewport
  - reason: El BottomNav fijo lleva `flex ... lg:hidden` (src/app/Shell.tsx:230-232), por lo que no se renderiza a partir de 1024 px.
  - alternate surface/route: GBL_NAV_001_SIDEBAR_ACTIVE_CALENDAR — misma ruta /calendar, actor COACH, viewport 1440×900.

### 4. `GBL_NAV_004_SIDEBAR_BADGES_COACH`

- **390×844:** N/A — CURRENT does not render this surface at this viewport
  - reason: Los contadores de no-leídos se renderizan exclusivamente dentro de la barra lateral (`hidden ... lg:flex`, src/app/Shell.tsx:183-185); el bloque de badges pertenece a ese nav (src/app/Shell.tsx:204-215) y no al BottomNav (src/app/Shell.tsx:234-250).
  - alternate surface/route: Campana de avisos del topbar en /home (src/app/Shell.tsx:153-168) para el aviso no-leído; no existe equivalente mobile para el contador de mensajes sin leer. La variante desktop de esta misma superficie es GBL_NAV_004 a 1440×900.
- **1440×900:** CAPTURED — `01_GLOBAL/Navigation/GBL_NAV_004_SIDEBAR_BADGES_COACH/GBL_NAV_004_SIDEBAR_BADGES_COACH__COACH__1440x900.png`

### 5. `GBL_NAV_005_SIDEBAR_BADGES_ADMIN`

- **390×844:** N/A — CURRENT does not render this surface at this viewport
  - reason: La superficie documenta la barra lateral de destinos; a 390 px esa columna no se renderiza (`hidden ... lg:flex`, src/app/Shell.tsx:183-185).
  - alternate surface/route: BottomNav de /home con actor ADMIN en 390×844 — misma ruta, mismo actor, mismo conjunto de destinos.
- **1440×900:** CAPTURED — `01_GLOBAL/Navigation/GBL_NAV_005_SIDEBAR_BADGES_ADMIN/GBL_NAV_005_SIDEBAR_BADGES_ADMIN__ADMIN__1440x900.png`

### 6. `GBL_NAV_006_SCROLL_02`

- **390×844:** N/A — CURRENT does not render this surface at this viewport
  - reason: La superficie documenta el scroll propio de la columna de destinos de escritorio (overflow-y:auto con altura limitada, src/app/Shell.tsx:185). A 390 px no existe esa columna, por lo que la superficie no existe.
  - alternate surface/route: HOME_006_SCROLL_02 — scroll de /home en 1440×900.
- **1440×900:** CAPTURED — `01_GLOBAL/Navigation/GBL_NAV_006_SCROLL_02/GBL_NAV_006_SCROLL_02__ADMIN__1440x900.png`

### 7. `GBL_OVERLAY_004_TOAST_RESPUESTA_GUARDADA`

- **390×844:** CAPTURED — `01_GLOBAL/Overlays/GBL_OVERLAY_004_TOAST_RESPUESTA_GUARDADA/GBL_OVERLAY_004_TOAST_RESPUESTA_GUARDADA__PLAYER__390x844.png`
- **1440×900:** CAPTURED — `01_GLOBAL/Overlays/GBL_OVERLAY_004_TOAST_RESPUESTA_GUARDADA/GBL_OVERLAY_004_TOAST_RESPUESTA_GUARDADA__PLAYER__1440x900.png`

### 8. `GBL_SHELL_001_TOPBAR_MOBILE`

- **390×844:** CAPTURED — `01_GLOBAL/Shell/GBL_SHELL_001_TOPBAR_MOBILE/GBL_SHELL_001_TOPBAR_MOBILE__COACH__390x844.png`
- **1440×900:** N/A — CURRENT does not render this surface at this viewport
  - reason: La composición «topbar móvil» (marca GEI + contexto de ruta en una línea + buscar como icono 44×44) no existe en 1440 px: la marca tiene `lg:hidden` (src/app/Shell.tsx:113-121), el bloque de contexto móvil tiene `lg:hidden` (src/app/Shell.tsx:129-133), el buscar como texto tiene `hidden ... sm:inline-flex` y el icono `sm:hidden` (src/app/Shell.tsx:135-152).
  - alternate surface/route: GBL_SHELL_002_TOPBAR_DESKTOP — misma ruta /home, actor COACH, viewport 1440×900.

### 9. `GBL_SHELL_002_TOPBAR_DESKTOP`

- **390×844:** N/A — CURRENT does not render this surface at this viewport
  - reason: La composición «topbar escritorio» (sin marca GEI, micro-etiqueta Hockey + contexto en dos líneas, buscar como texto con atajo ⌘K) no existe en 390 px: el contexto de escritorio está en `hidden ... lg:block` (src/app/Shell.tsx:123-128) y el buscar como texto en `hidden ... sm:inline-flex` (src/app/Shell.tsx:136-145).
  - alternate surface/route: GBL_SHELL_001_TOPBAR_MOBILE — misma ruta /home, actor COACH, viewport 390×844.
- **1440×900:** CAPTURED — `01_GLOBAL/Shell/GBL_SHELL_002_TOPBAR_DESKTOP/GBL_SHELL_002_TOPBAR_DESKTOP__COACH__1440x900.png`

### 10. `GBL_SHELL_003_BYPASS_LINK_FOCUSED`

- **390×844:** CAPTURED — `01_GLOBAL/Shell/GBL_SHELL_003_BYPASS_LINK_FOCUSED/GBL_SHELL_003_BYPASS_LINK_FOCUSED__COACH__390x844.png`
- **1440×900:** CAPTURED — `01_GLOBAL/Shell/GBL_SHELL_003_BYPASS_LINK_FOCUSED/GBL_SHELL_003_BYPASS_LINK_FOCUSED__COACH__1440x900.png`

### 11. `GBL_STATE_001_NOT_FOUND`

- **390×844:** CAPTURED — `01_GLOBAL/GlobalStates/GBL_STATE_001_NOT_FOUND/GBL_STATE_001_NOT_FOUND__COACH__390x844.png`
- **1440×900:** CAPTURED — `01_GLOBAL/GlobalStates/GBL_STATE_001_NOT_FOUND/GBL_STATE_001_NOT_FOUND__COACH__1440x900.png`

### 12. `HOME_001_DEFAULT_COACH`

- **390×844:** CAPTURED — `03_HOME/HOME_001_DEFAULT_COACH/HOME_001_DEFAULT_COACH/HOME_001_DEFAULT_COACH__COACH__390x844.png`
- **1440×900:** CAPTURED — `03_HOME/HOME_001_DEFAULT_COACH/HOME_001_DEFAULT_COACH/HOME_001_DEFAULT_COACH__COACH__1440x900.png`

### 13. `HOME_002_DEFAULT_ADMIN`

- **390×844:** CAPTURED — `03_HOME/HOME_002_DEFAULT_ADMIN/HOME_002_DEFAULT_ADMIN/HOME_002_DEFAULT_ADMIN__ADMIN__390x844.png`
- **1440×900:** CAPTURED — `03_HOME/HOME_002_DEFAULT_ADMIN/HOME_002_DEFAULT_ADMIN/HOME_002_DEFAULT_ADMIN__ADMIN__1440x900.png`

### 14. `HOME_003_ATTENTION_ITEMS_ADMIN`

- **390×844:** CAPTURED — `03_HOME/HOME_003_ATTENTION_ITEMS_ADMIN/HOME_003_ATTENTION_ITEMS_ADMIN/HOME_003_ATTENTION_ITEMS_ADMIN__ADMIN__390x844.png`
- **1440×900:** CAPTURED — `03_HOME/HOME_003_ATTENTION_ITEMS_ADMIN/HOME_003_ATTENTION_ITEMS_ADMIN/HOME_003_ATTENTION_ITEMS_ADMIN__ADMIN__1440x900.png`

### 15. `HOME_006_SCROLL_02`

- **390×844:** CAPTURED — `03_HOME/HOME_006_SCROLL_02/HOME_006_SCROLL_02/HOME_006_SCROLL_02__COACH__390x844.png`
- **1440×900:** CAPTURED — `03_HOME/HOME_006_SCROLL_02/HOME_006_SCROLL_02/HOME_006_SCROLL_02__COACH__1440x900.png`

### 16. `HOME_007_COMMS_SECTION`

- **390×844:** CAPTURED — `03_HOME/HOME_007_COMMS_SECTION/HOME_007_COMMS_SECTION/HOME_007_COMMS_SECTION__PLAYER__390x844.png`
- **1440×900:** CAPTURED — `03_HOME/HOME_007_COMMS_SECTION/HOME_007_COMMS_SECTION/HOME_007_COMMS_SECTION__PLAYER__1440x900.png`

### 17. `PRT_AVAILABILITY_001_DEFAULT`

- **390×844:** CAPTURED — `04_CALENDAR_PARTICIPATION/Availability/PRT_AVAILABILITY_001_DEFAULT/PRT_AVAILABILITY_001_DEFAULT__COACH__390x844.png`
- **1440×900:** CAPTURED — `04_CALENDAR_PARTICIPATION/Availability/PRT_AVAILABILITY_001_DEFAULT/PRT_AVAILABILITY_001_DEFAULT__COACH__1440x900.png`

### 18. `PRT_AVAILABILITY_002_PLAYER_SELF`

- **390×844:** CAPTURED — `04_CALENDAR_PARTICIPATION/Availability/PRT_AVAILABILITY_002_PLAYER_SELF/PRT_AVAILABILITY_002_PLAYER_SELF__PLAYER__390x844.png`
- **1440×900:** CAPTURED — `04_CALENDAR_PARTICIPATION/Availability/PRT_AVAILABILITY_002_PLAYER_SELF/PRT_AVAILABILITY_002_PLAYER_SELF__PLAYER__1440x900.png`

### 19. `PRT_AVAILABILITY_003_POSTPONED`

- **390×844:** CAPTURED — `04_CALENDAR_PARTICIPATION/Availability/PRT_AVAILABILITY_003_POSTPONED/PRT_AVAILABILITY_003_POSTPONED__COACH__390x844.png`
- **1440×900:** CAPTURED — `04_CALENDAR_PARTICIPATION/Availability/PRT_AVAILABILITY_003_POSTPONED/PRT_AVAILABILITY_003_POSTPONED__COACH__1440x900.png`

### 20. `PRT_AVAILABILITY_004_SCROLL_02`

- **390×844:** CAPTURED — `04_CALENDAR_PARTICIPATION/Availability/PRT_AVAILABILITY_004_SCROLL_02/PRT_AVAILABILITY_004_SCROLL_02__COACH__390x844.png`
- **1440×900:** CAPTURED — `04_CALENDAR_PARTICIPATION/Availability/PRT_AVAILABILITY_004_SCROLL_02/PRT_AVAILABILITY_004_SCROLL_02__COACH__1440x900.png`

### 21. `PRT_AVAILABILITY_005_CLUB_EVENT`

- **390×844:** CAPTURED — `04_CALENDAR_PARTICIPATION/Availability/PRT_AVAILABILITY_005_CLUB_EVENT/PRT_AVAILABILITY_005_CLUB_EVENT__COACH__390x844.png`
- **1440×900:** CAPTURED — `04_CALENDAR_PARTICIPATION/Availability/PRT_AVAILABILITY_005_CLUB_EVENT/PRT_AVAILABILITY_005_CLUB_EVENT__COACH__1440x900.png`

## Índice del atlas

- 11_INDEXES/MASTER_JOURNEY_INDEX.md
- 11_INDEXES/MASTER_SURFACE_INDEX.md
- 11_INDEXES/ROUTE_SURFACE_MATRIX.md
