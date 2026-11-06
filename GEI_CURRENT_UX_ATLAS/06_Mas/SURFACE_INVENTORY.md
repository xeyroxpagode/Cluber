# SURFACE INVENTORY — 06_Mas

Inventario de superficies de este dominio. El listado sale de la implementación real:
routes del router + navegación visible + acciones + overflow + formularios + tabs +
estados de transición + overlays + variantes de autoridad + estados vacío/carga/error.

**Superficies en este dominio:** 16

| [x] | ID | Route / origin | Actor | Estado | Cómo llegar | 390 | 1440 | Capturada | Mapeada | Motion |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [x] | `MOR_PROFILE_001_COACH` | `/more/profile` | COACH | CUENTA ACTIVA · 2 sesiones | Abrir /more/profile?demo=coach. | sí | sí | sí | sí | — |
| [x] | `MOR_PROFILE_002_ADMIN` | `/more/profile` | ADMIN | CUENTA ACTIVA · 1 sesión | Abrir /more/profile?demo=admin. | sí | sí | sí | sí | — |
| [x] | `MOR_PROFILE_003_PLAYER` | `/more/profile` | PLAYER | CUENTA ACTIVA · 2 sesiones | Abrir /more/profile?demo=player. | sí | sí | sí | sí | — |
| [x] | `MOR_PROFILE_004_CONTACT_SHEET` | `/more/profile` | COACH | Panel abierto, sin cambios | Abrir /more/profile?demo=coach. → Desplazar a y = 700. → Pulsar «Editar». | sí | sí | sí | sí | — |
| [x] | `MOR_PROFILE_005_SCROLL_02` | `/more/profile` | COACH | COACH · scroll 900 px | Abrir /more/profile?demo=coach. → Desplazar a y = 900. | sí | sí | sí | sí | — |
| [x] | `MOR_REPORTS_001_LIST` | `/reports` | COACH | Sin filtros · 6 eventos visibles | Abrir /reports?demo=coach. | sí | sí | sí | sí | — |
| [x] | `MOR_REPORTS_002_ASISTENCIA` | `/reports/attendance` | COACH | 2 eventos con planilla | Abrir /reports/attendance?demo=coach. | sí | sí | sí | sí | — |
| [x] | `MOR_REPORTS_003_RENDIMIENTO` | `/reports/performance` | COACH | 1 evento finalizado | Abrir /reports/performance?demo=coach. | sí | sí | sí | sí | — |
| [x] | `MOR_REPORTS_004_FILTERED_EMPTY` | `/reports?team=quinta&period=month` | COACH | 0 eventos para los filtros aplicados | Abrir /reports?team=quinta&period=month&demo=coach. | sí | sí | sí | sí | — |
| [x] | `MOR_REPORTS_005_NO_ACCESS_ADMIN` | `/reports` | ADMIN | SIN ALCANCE DE INFORME | Abrir /reports?demo=admin. | sí | sí | sí | sí | — |
| [x] | `MOR_REPORTS_006_ASISTENCIA_FILTERED` | `/reports/attendance?period=month` | COACH | period=month · 1 evento con planilla | Abrir /reports/attendance?period=month&demo=coach. | sí | sí | sí | sí | — |
| [x] | `MORE_001_COACH` | `/more` | COACH | COACH · 4 accesos visibles | Abrir /more?demo=coach. | sí | sí | sí | sí | — |
| [x] | `MORE_002_ADMIN` | `/more` | ADMIN | ADMIN · 6 accesos visibles | Abrir /more?demo=admin. | sí | sí | sí | sí | — |
| [x] | `MORE_003_SUBCOMMITTEE` | `/more` | SUBCOMMITTEE | SUBCOMMITTEE · 4 accesos visibles | Abrir /more?demo=subcommittee. | sí | sí | sí | sí | — |
| [x] | `MORE_004_PLAYER` | `/more` | PLAYER | PLAYER · 2 accesos visibles | Abrir /more?demo=player. | sí | sí | sí | sí | — |
| [x] | `MORE_005_JORNADAS` | `/more` | COACH | COACH · 1 jornada | Abrir /more?demo=coach. → Desplazar a y = 500. | sí | sí | sí | sí | — |
