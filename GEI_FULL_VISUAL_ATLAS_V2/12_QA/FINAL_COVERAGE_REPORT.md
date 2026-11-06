# FINAL COVERAGE REPORT — GEI FULL VISUAL ATLAS V2

Generado: 2026-10-26T04:11:54.812994+00:00

## Conteos finales (recontados sobre los ficheros del atlas)

- TOTAL SURFACES: 203
- MOBILE CAPTURED: 198
- MOBILE N/A: 5
- DESKTOP CAPTURED: 200
- DESKTOP N/A: 3
- BOTH COVERED: 203
- UNRESOLVED MOBILE: 0
- UNRESOLVED DESKTOP: 0

## Gate final

| Condición | Valor | Estado |
| --- | --- | --- |
| 203/203 clasificadas | 203/203 | PASS |
| 390 capturado o N/A justificado | 198 + 5 = 203 | PASS |
| 1440 capturado o N/A justificado | 200 + 3 = 203 | PASS |
| dimension failures = 0 | 0 | PASS |
| naming failures = 0 | 0 | PASS |
| orphans = 0 | 0 | PASS |
| unresolved capture failures = 0 | 0 | PASS |
| unclassified duplicate groups = 0 | 0 | PASS |
| all domains covered | 9 dominios | PASS |
| all journeys indexed | 44 | PASS |
| app source modified = NO | NO | PASS |

## Superficies con N/A justificado

| Surface ID | Viewport | Motivo | Alternativa |
| --- | --- | --- | --- |
| `GBL_NAV_001_SIDEBAR_ACTIVE_CALENDAR` | 390×844 | La barra lateral de destinos no se renderiza por debajo del breakpoint lg (1024 px). El <nav aria-label="Destinos"> de escritorio lleva las clases `hidden ... lg:flex` (src/app/Shell.tsx:183-185), de modo que su computed display es `none` a 390 px. | GBL_NAV_002_BOTTOMNAV_ACTIVE_CALENDAR — misma ruta /calendar, actor COACH, viewport 390×844. |
| `GBL_NAV_002_BOTTOMNAV_ACTIVE_CALENDAR` | 1440×900 | El BottomNav fijo lleva `flex ... lg:hidden` (src/app/Shell.tsx:230-232), por lo que no se renderiza a partir de 1024 px. | GBL_NAV_001_SIDEBAR_ACTIVE_CALENDAR — misma ruta /calendar, actor COACH, viewport 1440×900. |
| `GBL_NAV_003_BOTTOMNAV_ACTIVE_COMMUNICATION` | 1440×900 | El BottomNav fijo no se renderiza en 1440 px (`flex ... lg:hidden`, src/app/Shell.tsx:230-232); además el BottomNav no implementa contadores (src/app/Shell.tsx:234-250). | GBL_NAV_004_SIDEBAR_BADGES_COACH — misma ruta /communication, actor COACH, viewport 1440×900. |
| `GBL_NAV_004_SIDEBAR_BADGES_COACH` | 390×844 | Los contadores de no-leídos se renderizan exclusivamente dentro de la barra lateral (`hidden ... lg:flex`, src/app/Shell.tsx:183-185); el bloque de badges pertenece a ese nav (src/app/Shell.tsx:204-215) y no al BottomNav (src/app/Shell.tsx:234-250). | Campana de avisos del topbar en /home (src/app/Shell.tsx:153-168) para el aviso no-leído; no existe equivalente mobile para el contador de mensajes sin leer. La variante desktop de esta misma superficie es GBL_NAV_004 a 1440×900. |
| `GBL_NAV_005_SIDEBAR_BADGES_ADMIN` | 390×844 | La superficie documenta la barra lateral de destinos; a 390 px esa columna no se renderiza (`hidden ... lg:flex`, src/app/Shell.tsx:183-185). | BottomNav de /home con actor ADMIN en 390×844 — misma ruta, mismo actor, mismo conjunto de destinos. |
| `GBL_NAV_006_SCROLL_02` | 390×844 | La superficie documenta el scroll propio de la columna de destinos de escritorio (overflow-y:auto con altura limitada, src/app/Shell.tsx:185). A 390 px no existe esa columna, por lo que la superficie no existe. | HOME_006_SCROLL_02 — scroll de /home en 1440×900. |
| `GBL_SHELL_001_TOPBAR_MOBILE` | 1440×900 | La composición «topbar móvil» (marca GEI + contexto de ruta en una línea + buscar como icono 44×44) no existe en 1440 px: la marca tiene `lg:hidden` (src/app/Shell.tsx:113-121), el bloque de contexto móvil tiene `lg:hidden` (src/app/Shell.tsx:129-133), el buscar como texto tiene `hidden ... sm:inline-flex` y el icono `sm:hidden` (src/app/Shell.tsx:135-152). | GBL_SHELL_002_TOPBAR_DESKTOP — misma ruta /home, actor COACH, viewport 1440×900. |
| `GBL_SHELL_002_TOPBAR_DESKTOP` | 390×844 | La composición «topbar escritorio» (sin marca GEI, micro-etiqueta Hockey + contexto en dos líneas, buscar como texto con atajo ⌘K) no existe en 390 px: el contexto de escritorio está en `hidden ... lg:block` (src/app/Shell.tsx:123-128) y el buscar como texto en `hidden ... sm:inline-flex` (src/app/Shell.tsx:136-145). | GBL_SHELL_001_TOPBAR_MOBILE — misma ruta /home, actor COACH, viewport 390×844. |

## Duplicados

- EXPECTED VISUAL DUPLICATE: 48 grupos
- ACCIDENTAL DUPLICATE: 0 grupos pendientes
- ACCIDENTAL DUPLICATE corregido: 1 (`GBL_SHELL_003_BYPASS_LINK_FOCUSED` — recaptura con `Emulation.setFocusEmulationEnabled`)
- UNCLASSIFIED: 0

## Motion

- Clips copiados sin modificar: 12
- Clips regenerados: 0
- Categorías sin clip en CURRENT documentadas sin inventar: push navigation, back navigation, message send/failure, list insert/remove.

## Evidencia de esta reconciliación

- 12_QA/VIEWPORT_NA_EVIDENCE.json — sonda CDP runtime de las 8 superficies con viewport faltante.
- 12_QA/BYPASS_LINK_RECAPTURE.json — recaptura correctiva del skip link enfocado.
- 12_QA/DUPLICATE_ANALYSIS.json — SHA-256 y diferencia real de píxeles por par.
- 12_QA/POSSIBLE_DUPLICATES.md — clasificación de los 48 grupos.
- 13_MOTION_REFERENCE/MOTION_REFERENCE_INDEX.md — índice de clips y cobertura por categoría.

## App source modified

NO. Ningún fichero bajo `src/` fue modificado. Los únicos ficheros escritos están bajo
`GEI_FULL_VISUAL_ATLAS_V2/` y `tools/ux-atlas-v2/`.