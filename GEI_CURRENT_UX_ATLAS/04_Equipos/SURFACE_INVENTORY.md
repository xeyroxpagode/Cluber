# SURFACE INVENTORY — 04_Equipos

Inventario de superficies de este dominio. El listado sale de la implementación real:
routes del router + navegación visible + acciones + overflow + formularios + tabs +
estados de transición + overlays + variantes de autoridad + estados vacío/carga/error.

**Superficies en este dominio:** 16

| [x] | ID | Route / origin | Actor | Estado | Cómo llegar | 390 | 1440 | Capturada | Mapeada | Motion |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [x] | `EQ_PERSON_001_DETAIL_COACH` | `/people/p2` | COACH | ACCOUNT ACTIVE · PLAYER de Sexta A | Abrir /people/p2?demo=coach. | sí | sí | sí | sí | — |
| [x] | `EQ_PERSON_002_DETAIL_ADMIN` | `/people/p2` | ADMIN | ACCOUNT ACTIVE · PII completa | Abrir /people/p2?demo=admin. | sí | sí | sí | sí | — |
| [x] | `EQ_PERSON_003_DETAIL_STRANGER` | `/people/p15` | PLAYER | FUERA DEL ALCANCE DE CONTACTO | Abrir /people/p15?demo=player. | sí | sí | sí | sí | — |
| [x] | `EQ_PERSON_004_NOT_FOUND` | `/people/no-existe` | COACH | ID DE PERSONA DESCONOCIDO | Abrir /people/no-existe?demo=coach. | sí | sí | sí | sí | — |
| [x] | `EQ_TEAM_DETAIL_001_EVENTOS` | `/teams/sexta` | COACH | SCHEDULED · 6 eventos próximos · 1 resultado final | Abrir /teams/sexta?demo=coach. | sí | sí | sí | sí | — |
| [x] | `EQ_TEAM_DETAIL_002_PERSONAS` | `/teams/sexta?tab=personas` | COACH | 8 personas con roles vigentes | Abrir /teams/sexta?tab=personas&demo=coach. | sí | sí | sí | sí | MOTION_TEAM_TAB_390 |
| [x] | `EQ_TEAM_DETAIL_003_RESULTADOS` | `/teams/sexta?tab=resultados` | COACH | 1 resultado finalizado | Abrir /teams/sexta?tab=resultados&demo=coach. | sí | sí | sí | sí | — |
| [x] | `EQ_TEAM_DETAIL_004_OUT_OF_SCOPE` | `/teams/quinta` | PLAYER | FUERA DE ALCANCE | Abrir /teams/quinta?demo=player. | sí | sí | sí | sí | — |
| [x] | `EQ_TEAM_DETAIL_005_QUERY_ONLY` | `/teams/septima` | PLAYER | VISIBLE PERO NO GESTIONADO | Abrir /teams/septima?demo=player. | sí | sí | sí | sí | — |
| [x] | `EQ_TEAM_DETAIL_006_SCROLL_02` | `/teams/sexta` | COACH | SCHEDULED · scroll 900 px | Abrir /teams/sexta?demo=coach. → Desplazar a y = 900. | sí | sí | sí | sí | — |
| [x] | `EQ_TEAM_DETAIL_007_SEPTIMA` | `/teams/septima` | COACH | 1 evento en el equipo · 0 resultados | Abrir /teams/septima?demo=coach. | sí | sí | sí | sí | — |
| [x] | `EQ_TEAM_DETAIL_008_NOT_FOUND` | `/teams/zzz` | PLAYER | ID DE EQUIPO DESCONOCIDO | Abrir /teams/zzz?demo=player. | sí | sí | sí | sí | — |
| [x] | `EQ_TEAMS_001_LIST_COACH` | `/teams` | COACH | COACH · alcance en sexta y septima | Abrir /teams?demo=coach. | sí | sí | sí | sí | — |
| [x] | `EQ_TEAMS_002_LIST_PLAYER` | `/teams` | PLAYER | PLAYER · alcance en sexta | Abrir /teams?demo=player. | sí | sí | sí | sí | — |
| [x] | `EQ_TEAMS_003_LIST_ADMIN` | `/teams` | ADMIN | ADMIN · alcance club | Abrir /teams?demo=admin. | sí | sí | sí | sí | — |
| [x] | `EQ_TEAMS_004_LIST_CAPTAIN` | `/teams` | CAPTAIN | CAPTAIN · alcance en sexta | Abrir /teams?demo=captain. | sí | sí | sí | sí | — |
