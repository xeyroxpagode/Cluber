# RESPONSIVE COVERAGE — GEI FULL VISUAL ATLAS V2

Cierre de cobertura responsive. Cada superficie queda en CAPTURED o en N/A justificado.

**Total superficies:** 203
**390×844 CAPTURED:** 198
**390×844 N/A:** 5
**1440×900 CAPTURED:** 200
**1440×900 N/A:** 3
**Capturadas en ambos:** 195
**UNRESOLVED MOBILE:** 0
**UNRESOLVED DESKTOP:** 0

## Breakpoint vigente en CURRENT

`lg` = 64rem = **1024 px** (Tailwind v4, sin `--breakpoint-lg` propio).

- Barra lateral de destinos: `hidden ... lg:flex` — src/app/Shell.tsx:183-185
- BottomNav fijo: `flex ... lg:hidden` — src/app/Shell.tsx:230-232
- Marca GEI del topbar: `lg:hidden` — src/app/Shell.tsx:113-121
- Contexto de ruta de escritorio: `hidden ... lg:block` — src/app/Shell.tsx:123-128
- Buscar como texto: `hidden ... sm:inline-flex` — src/app/Shell.tsx:136-145

## 390×844 N/A justificados

| Surface ID | Motivo | Comportamiento CURRENT | Alternativa |
| --- | --- | --- | --- |
| `GBL_NAV_001_SIDEBAR_ACTIVE_CALENDAR` | La barra lateral de destinos no se renderiza por debajo del breakpoint lg (1024 px). El <nav aria-label="Destinos"> de escritorio lleva las clases `hidden ... lg:flex` (src/app/Shell.tsx:183-185), de modo que su computed display es `none` a 390 px. | Runtime verificado en Chrome headless a 390×844: sidebar display=none, visibleBox=false. La misma función la cumple el BottomNav fijo (`flex ... lg:hidden`, src/app/Shell.tsx:230-232), que presenta los mismos 5 destinos con icono + label micro y marca Calendario como activo. | GBL_NAV_002_BOTTOMNAV_ACTIVE_CALENDAR — misma ruta /calendar, actor COACH, viewport 390×844. |
| `GBL_NAV_004_SIDEBAR_BADGES_COACH` | Los contadores de no-leídos se renderizan exclusivamente dentro de la barra lateral (`hidden ... lg:flex`, src/app/Shell.tsx:183-185); el bloque de badges pertenece a ese nav (src/app/Shell.tsx:204-215) y no al BottomNav (src/app/Shell.tsx:234-250). | Runtime verificado a 390×844: sidebar display=none; el BottomNav visible no contiene ningún elemento .bg-unread ni contador (unreadDot=false en los 5 destinos). El único aviso de no-leído disponible en mobile es el punto sobre la campana del topbar (src/app/Shell.tsx:153-168), que es un elemento distinto del contador de navegación. | Campana de avisos del topbar en /home (src/app/Shell.tsx:153-168) para el aviso no-leído; no existe equivalente mobile para el contador de mensajes sin leer. La variante desktop de esta misma superficie es GBL_NAV_004 a 1440×900. |
| `GBL_NAV_005_SIDEBAR_BADGES_ADMIN` | La superficie documenta la barra lateral de destinos; a 390 px esa columna no se renderiza (`hidden ... lg:flex`, src/app/Shell.tsx:183-185). | Runtime verificado a 390×844: sidebar display=none. El BottomNav para ADMIN presenta los mismos 4 destinos que la sidebar (Inicio, Calendario, Equipos, Más) y omite Comunicación, porque el filtrado depende del actor vía authority.canOpen (src/app/Shell.tsx:62) y no del viewport. | BottomNav de /home con actor ADMIN en 390×844 — misma ruta, mismo actor, mismo conjunto de destinos. |
| `GBL_NAV_006_SCROLL_02` | La superficie documenta el scroll propio de la columna de destinos de escritorio (overflow-y:auto con altura limitada, src/app/Shell.tsx:185). A 390 px no existe esa columna, por lo que la superficie no existe. | Runtime verificado a 390×844: sidebar display=none, scrollHeight=0, clientHeight=0. El scroll del documento sí existe en mobile, pero es una composición distinta (no la barra lateral) y ya está documentada por las superficies de scroll de HOME. | HOME_006_SCROLL_02 — scroll de /home en 1440×900. |
| `GBL_SHELL_002_TOPBAR_DESKTOP` | La composición «topbar escritorio» (sin marca GEI, micro-etiqueta Hockey + contexto en dos líneas, buscar como texto con atajo ⌘K) no existe en 390 px: el contexto de escritorio está en `hidden ... lg:block` (src/app/Shell.tsx:123-128) y el buscar como texto en `hidden ... sm:inline-flex` (src/app/Shell.tsx:136-145). | Runtime verificado a 390×844: marca GEI display=flex; contexto de escritorio display=none; contexto móvil display=block; buscar como texto display=none; buscar como icono display=flex. La barra superior sí existe, pero con la composición móvil. | GBL_SHELL_001_TOPBAR_MOBILE — misma ruta /home, actor COACH, viewport 390×844. |

## 1440×900 N/A justificados

| Surface ID | Motivo | Comportamiento CURRENT | Alternativa |
| --- | --- | --- | --- |
| `GBL_NAV_002_BOTTOMNAV_ACTIVE_CALENDAR` | El BottomNav fijo lleva `flex ... lg:hidden` (src/app/Shell.tsx:230-232), por lo que no se renderiza a partir de 1024 px. | Runtime verificado en Chrome headless a 1440×900: bottomnav display=none, visibleBox=false. La misma función la cumple la barra lateral (`hidden ... lg:flex`, src/app/Shell.tsx:183-185), que marca Calendario como destino activo. | GBL_NAV_001_SIDEBAR_ACTIVE_CALENDAR — misma ruta /calendar, actor COACH, viewport 1440×900. |
| `GBL_NAV_003_BOTTOMNAV_ACTIVE_COMMUNICATION` | El BottomNav fijo no se renderiza en 1440 px (`flex ... lg:hidden`, src/app/Shell.tsx:230-232); además el BottomNav no implementa contadores (src/app/Shell.tsx:234-250). | Runtime verificado a 1440×900: bottomnav display=none. El destino Comunicación de esa ruta muestra punto + «2» en la barra lateral (src/app/Shell.tsx:204-209), que es el soporte real del contador. | GBL_NAV_004_SIDEBAR_BADGES_COACH — misma ruta /communication, actor COACH, viewport 1440×900. |
| `GBL_SHELL_001_TOPBAR_MOBILE` | La composición «topbar móvil» (marca GEI + contexto de ruta en una línea + buscar como icono 44×44) no existe en 1440 px: la marca tiene `lg:hidden` (src/app/Shell.tsx:113-121), el bloque de contexto móvil tiene `lg:hidden` (src/app/Shell.tsx:129-133), el buscar como texto tiene `hidden ... sm:inline-flex` y el icono `sm:hidden` (src/app/Shell.tsx:135-152). | Runtime verificado a 1440×900: marca GEI display=none; contexto móvil display=none; contexto de escritorio display=block; buscar como texto display=flex con atajo ⌘K; buscar como icono display=none. La barra superior sí existe, pero con otra composición. | GBL_SHELL_002_TOPBAR_DESKTOP — misma ruta /home, actor COACH, viewport 1440×900. |

## Evidencia runtime

- 12_QA/VIEWPORT_NA_EVIDENCE.json — sonda CDP con `display`, `visibleBox`, `boundingBox` y badges por viewport.
- 12_QA/BYPASS_LINK_RECAPTURE.json — recaptura correctiva con `Emulation.setFocusEmulationEnabled`.

Los N/A se determinaron por comportamiento CURRENT confirmado en runtime, no por inferencia de código.