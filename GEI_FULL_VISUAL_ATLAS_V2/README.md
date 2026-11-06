# GEI FULL VISUAL ATLAS V2

Atlas visual exhaustivo de GEI CURRENT, destinado a un rediseño visual completo.

Este atlas NO diseña. NO implementa el TARGET. NO aplica GEI_VISUAL_DIRECTION_FREEZE_V1.0.
Exclusivamente DESCUBRE → RECORRE → CAPTURA → CLASIFICA → INDEXA → VERIFICA el producto actual.

## Conteos finales

| Métrica | Valor |
| --- | --- |
| TOTAL SURFACES | 203 |
| MOBILE CAPTURED (390×844) | 198 |
| MOBILE N/A (justificado) | 5 |
| DESKTOP CAPTURED (1440×900) | 200 |
| DESKTOP N/A (justificado) | 3 |
| BOTH COVERED | 203 |
| UNRESOLVED MOBILE | 0 |
| UNRESOLVED DESKTOP | 0 |
| PNG totales | 398 |
| Clips de motion | 12 |
| Journey IDs | 44 |
| Dominios | 9 |

## Qué contiene

```
GEI_FULL_VISUAL_ATLAS_V2/
  00_META/              Baseline, stats, manifest, capture recipes
  01_GLOBAL/            Shell, Search, Notifications, Navigation, GlobalStates, Overlays
  02_AUTH/              Login, Activation, NoAccess, Security, Sessions
  03_HOME/              Root, Attention, Today, Upcoming, Communications
  04_CALENDAR_PARTICIPATION/  Calendar, Event, Jornada, Availability, Selection, Attendance, MatchRecord
  05_TEAMS/             TeamsList, TeamDetail, PersonOperational
  06_COMMUNICATION/     Root, Conversations, NewConversation, Announcements, Notifications
  07_MORE/              Root, Profile, Reports
  08_MANAGEMENT/        Root, People, Teams, Structure, Competitions, Audit
  09_CROSS_DOMAIN/      SharedPatterns
  10_JOURNEYS/
  11_INDEXES/           Master indexes (md/json/csv), matrices, contact sheets
  12_QA/                QA reports y evidencia de cierre
  13_MOTION_REFERENCE/  Clips de motion copiados + MOTION_REFERENCE_INDEX.md
```

Cada surface vive en su propia carpeta bajo el dominio correspondiente y contiene:

```
<SURFACE_ID>/
  <SURFACE_ID>__<ACTOR>__390x844.png     (si el viewport está CAPTURED)
  <SURFACE_ID>__<ACTOR>__1440x900.png    (si el viewport está CAPTURED)
  SURFACE.md
  surface.json
  surface-map-legacy.md
```

## Naming

Formato: `<SURFACE_ID>__<ACTOR>__<W>x<H>.png`.

## Viewport status

Cada superficie declara el estado de cada viewport en `SURFACE.md` y en `surface.json`:

- `CAPTURED — <archivo>` cuando existe captura real.
- `N/A — CURRENT does not render this surface at this viewport` cuando CURRENT no renderiza
  esa composición en ese viewport. Cada N/A lleva **reason**, **current behavior** y
  **alternate surface/route**, y está respaldado por sonda runtime en
  `12_QA/VIEWPORT_NA_EVIDENCE.json`.

El breakpoint vigente en CURRENT es `lg` = 64rem = 1024 px (Tailwind v4). Por eso la barra
lateral de destinos es desktop-only (`hidden ... lg:flex`, src/app/Shell.tsx:183-185) y la
bottom nav es mobile-only (`flex ... lg:hidden`, src/app/Shell.tsx:230-232).

## Evidence levels

- RUNTIME: alcanzada recorriendo la app.
- SEEDED_RUNTIME: alcanzada con fixtures/seed de desarrollo (este atlas).
- ISOLATED_COMPONENT: existe en código pero no alcanzable por flujo normal.
- UNREACHABLE: no puede renderizarse confiablemente.

Todos los captures de este atlas son SEEDED_RUNTIME.

## Índice

- 11_INDEXES/MASTER_SURFACE_INDEX.md
- 11_INDEXES/MASTER_SURFACE_INDEX.json
- 11_INDEXES/MASTER_SURFACE_INDEX.csv
- 11_INDEXES/MASTER_JOURNEY_INDEX.md
- 11_INDEXES/ROUTE_SURFACE_MATRIX.md
- 11_INDEXES/ACTOR_SURFACE_MATRIX.md
- 11_INDEXES/STATE_COVERAGE_MATRIX.md
- 11_INDEXES/RESPONSIVE_COVERAGE.md

## QA

- 12_QA/DIMENSION_AUDIT.md — dimensiones exactas de todas las capturas (0 fallos).
- 12_QA/NAMING_QA.md — IDs duplicados, huérfanos, superficies sin SURFACE.md.
- 12_QA/POSSIBLE_DUPLICATES.md — 48 grupos clasificados, 0 sin clasificar.
- 12_QA/CAPTURE_FAILURES.md — capturas rotas (0).
- 12_QA/FINAL_COVERAGE_REPORT.md — gate final.
- 12_QA/VIEWPORT_NA_EVIDENCE.json — evidencia runtime de los N/A.
- 12_QA/DUPLICATE_ANALYSIS.json — SHA-256 y diferencia de píxeles por par.
- 12_QA/BYPASS_LINK_RECAPTURE.json — recaptura correctiva del skip link enfocado.
- 12_QA/OLD_ATLAS_RECONCILIATION.md — reconciliación con el atlas previo.

## Motion

- 13_MOTION_REFERENCE/MOTION_REFERENCE_INDEX.md — 12 clips copiados sin modificar,
  con cobertura por categoría (push, back, sheet, dialog, inspector, message send/failure,
  realtime/local highlight, list insert/remove). Las categorías sin clip en CURRENT están
  documentadas como tales, sin inventar clips.

## App source modified

NO. Ningún fichero bajo `src/` fue modificado.
