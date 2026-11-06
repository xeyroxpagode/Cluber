# SURFACE INVENTORY — 00_Global

Inventario de superficies de este dominio. El listado sale de la implementación real:
routes del router + navegación visible + acciones + overflow + formularios + tabs +
estados de transición + overlays + variantes de autoridad + estados vacío/carga/error.

**Superficies en este dominio:** 22

| [x] | ID | Route / origin | Actor | Estado | Cómo llegar | 390 | 1440 | Capturada | Mapeada | Motion |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [x] | `GBL_NAV_001_SIDEBAR_ACTIVE_CALENDAR` | `/calendar` | COACH | AUTHENTICATED · ruta /calendar | Abrir /calendar?demo=coach con viewport 1440×900. | N/A | sí | sí | sí | — |
| [x] | `GBL_NAV_002_BOTTOMNAV_ACTIVE_CALENDAR` | `/calendar` | COACH | AUTHENTICATED · ruta /calendar | Abrir /calendar?demo=coach con viewport 390×844. | sí | N/A | sí | sí | — |
| [x] | `GBL_NAV_003_BOTTOMNAV_ACTIVE_COMMUNICATION` | `/communication` | COACH | AUTHENTICATED · 2 mensajes sin leer en el equipo | Abrir /communication?demo=coach con viewport 390×844. | sí | N/A | sí | sí | — |
| [x] | `GBL_NAV_004_SIDEBAR_BADGES_COACH` | `/home` | COACH | AUTHENTICATED · 2 mensajes sin leer · 1 aviso sin leer | Abrir /home?demo=coach con viewport 1440×900. | N/A | sí | sí | sí | — |
| [x] | `GBL_NAV_005_SIDEBAR_BADGES_ADMIN` | `/home` | ADMIN | AUTHENTICATED · sin conversaciones habilitadas | Abrir /home?demo=admin con viewport 1440×900. | N/A | sí | sí | sí | — |
| [x] | `GBL_NAV_006_SCROLL_02` | `/home` | ADMIN | AUTHENTICATED · página desplazada 900 px | Abrir /home?demo=admin con viewport 1440×900. → Desplazar la página a y = 900. | N/A | sí | sí | sí | — |
| [x] | `GBL_NOTIF_001_LIST_COACH_ALL_READ` | `/notifications` | COACH | 0 avisos sin leer · 2 leídos | Abrir /notifications?demo=coach. | sí | sí | sí | sí | — |
| [x] | `GBL_NOTIF_002_LIST_PLAYER_WITH_UNREAD` | `/notifications` | PLAYER | 1 aviso sin leer · 2 leídos | Abrir /notifications?demo=player. | sí | sí | sí | sí | — |
| [x] | `GBL_NOTIF_003_ALL_MARKED_READ` | `/notifications` | PLAYER | 0 avisos sin leer (los 3 leídos) | Abrir /notifications?demo=player. → Pulsar «Marcar todo como leído». | sí | sí | sí | sí | — |
| [x] | `GBL_NOTIF_004_EMPTY_STATE` | `/notifications` | ADMIN | 0 avisos recibidos | Abrir /notifications?demo=admin. | sí | sí | sí | sí | — |
| [x] | `GBL_OVERLAY_001_MENU_ACCIONES_EVENTO` | `/events/match-cuba` | COACH | SCHEDULED · menú abierto | Abrir /events/match-cuba?demo=coach. → Pulsar el botón «Acciones» del encabezado. | sí | sí | sí | sí | MOTION_MENU_OPEN_390, MOTION_MENU_OPEN_1440 |
| [x] | `GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO` | `/events/match-cuba` | COACH | SCHEDULED · modal abierto | Abrir /events/match-cuba?demo=coach. → Pulsar «Ver todo» en la sección «Historial». | sí | sí | sí | sí | MOTION_MODAL_HISTORY_390 |
| [x] | `GBL_OVERLAY_003_SHEET_CAMBIAR_CONTRASENA` | `/more/profile` | COACH | Panel abierto, sin valores escritos | Abrir /more/profile?demo=coach. → Pulsar «Cambiar contraseña» en la sección «Seguridad». | sí | sí | sí | sí | MOTION_SHEET_PASSWORD_390 |
| [x] | `GBL_OVERLAY_004_TOAST_RESPUESTA_GUARDADA` | `/events/match-cuba` | PLAYER | Disponibilidad guardada · toast visible | Abrir /events/match-cuba?demo=player. → Desplazar hasta el control «¿Vas?». → Pulsar la opción «Tal vez». → Esperar ~900 ms a que aparezca el toast. | sí | sí | sí | sí | — |
| [x] | `GBL_SEARCH_001_EMPTY` | `/search` | COACH | SIN TÉRMINO DE BÚSQUEDA | Abrir /search?demo=coach. | sí | sí | sí | sí | — |
| [x] | `GBL_SEARCH_002_RESULTS` | `/search` | COACH | TÉRMINO «Lucía» | Abrir /search?demo=coach. → Escribir «Lucía» en el campo y pulsar «Buscar» (o Enter). | sí | sí | sí | sí | — |
| [x] | `GBL_SEARCH_003_NO_RESULTS` | `/search?q=zzzqqq` | COACH | TÉRMINO «zzzqqq» · 0 resultados | Abrir /search?q=zzzqqq&demo=coach. | sí | sí | sí | sí | — |
| [x] | `GBL_SEARCH_004_MULTI_RESULT` | `/search?q=a` | COACH | TÉRMINO «a» · coincidencias en los 4 grupos | Abrir /search?q=a&demo=coach. | sí | sí | sí | sí | — |
| [x] | `GBL_SHELL_001_TOPBAR_MOBILE` | `/home` | COACH | AUTHENTICATED · sin avisos sin leer | Abrir el dev server (pnpm dev) en http://localhost:8443. → Navegar a /home?demo=coach. → Esperar el layout estable; no hay scroll en esta captura. | sí | N/A | sí | sí | — |
| [x] | `GBL_SHELL_002_TOPBAR_DESKTOP` | `/home` | COACH | AUTHENTICATED | Abrir /home?demo=coach con viewport 1440×900. → La barra lateral de destinos aparece a la izquierda (lg:flex). | N/A | sí | sí | sí | — |
| [x] | `GBL_SHELL_003_BYPASS_LINK_FOCUSED` | `/home` | COACH | AUTHENTICATED · elemento con foco | Abrir /home?demo=coach. → Poner el foco sobre el primer <a href="#contenido">: document.querySelector('a[href="#contenido"]').focus(). | sí | sí | sí | sí | — |
| [x] | `GBL_STATE_001_NOT_FOUND` | `/ruta-inexistente` | COACH | RUTA NO RECONOCIDA | Abrir /ruta-inexistente?demo=coach. | sí | sí | sí | sí | — |
