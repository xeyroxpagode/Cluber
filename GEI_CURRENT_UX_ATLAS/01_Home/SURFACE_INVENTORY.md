# SURFACE INVENTORY — 01_Home

Inventario de superficies de este dominio. El listado sale de la implementación real:
routes del router + navegación visible + acciones + overflow + formularios + tabs +
estados de transición + overlays + variantes de autoridad + estados vacío/carga/error.

**Superficies en este dominio:** 7

| [x] | ID | Route / origin | Actor | Estado | Cómo llegar | 390 | 1440 | Capturada | Mapeada | Motion |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [x] | `HOME_001_DEFAULT_COACH` | `/home` | COACH | COACH · sin pendientes propios | Abrir /home?demo=coach. | sí | sí | sí | sí | — |
| [x] | `HOME_002_DEFAULT_ADMIN` | `/home` | ADMIN | ADMIN · 2 items de atención | Abrir /home?demo=admin. | sí | sí | sí | sí | — |
| [x] | `HOME_003_ATTENTION_ITEMS_ADMIN` | `/home` | ADMIN | ADMIN · bloque de atención visible | Abrir /home?demo=admin. → Desplazar a y = 260. | sí | sí | sí | sí | — |
| [x] | `HOME_004_ATTENTION_PLAYER_RECONFIRM` | `/home` | CAPTAIN | CAPTAIN · NEEDS_RECONFIRMATION + NO_RESPONSE | Abrir /home?demo=captain. → Desplazar a y = 260. | sí | sí | sí | sí | — |
| [x] | `HOME_005_ATTENTION_EMPTY_SUBCOMMITTEE` | `/home` | SUBCOMMITTEE | SUBCOMMITTEE · sin items de atención | Abrir /home?demo=subcommittee. | sí | sí | sí | sí | — |
| [x] | `HOME_006_SCROLL_02` | `/home` | COACH | COACH · scroll 760 px | Abrir /home?demo=coach. → Desplazar a y = 760. | sí | sí | sí | sí | — |
| [x] | `HOME_007_COMMS_SECTION` | `/home` | PLAYER | PLAYER · 1 mensaje sin leer · 1 aviso sin leer | Abrir /home?demo=player. → Desplazar a y = 1400. | sí | sí | sí | sí | — |
