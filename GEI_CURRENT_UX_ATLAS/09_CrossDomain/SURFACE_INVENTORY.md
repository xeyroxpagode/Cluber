# SURFACE INVENTORY — 09_CrossDomain

Inventario de superficies de este dominio. El listado sale de la implementación real:
routes del router + navegación visible + acciones + overflow + formularios + tabs +
estados de transición + overlays + variantes de autoridad + estados vacío/carga/error.

**Superficies en este dominio:** 10

| [x] | ID | Route / origin | Actor | Estado | Cómo llegar | 390 | 1440 | Capturada | Mapeada | Motion |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [x] | `XD_CALENDAR_001_TO_EVENT` | `/calendar?view=agenda` | COACH | AGENDA → EVENTO | Abrir /calendar?view=agenda&demo=coach. → Pulsar la fila «Entrenamiento Sexta A». | sí | sí | sí | sí | — |
| [x] | `XD_COMPETITION_001_TO_JORNADA` | `/management/competitions/ahba` | ADMIN | COMPETENCIA → JORNADA | Abrir /management/competitions/ahba?demo=admin. → Pulsar la fila de la jornada «Fecha 21 · GEI vs. CUBA». | sí | sí | sí | sí | — |
| [x] | `XD_EVENT_001_TO_CONVERSATION` | `/events/match-cuba` | COACH | CONVERSACIÓN NO RESUELTA | Abrir /events/match-cuba?demo=coach. → Desplazar a y = 1900. → Pulsar «Abrir la conversación». | sí | sí | sí | sí | — |
| [x] | `XD_HOME_001_TO_EVENT` | `/home` | COACH | INICIO → EVENTO | Abrir /home?demo=coach. → Pulsar la fila «GEI vs. Lomas». | sí | sí | sí | sí | — |
| [x] | `XD_NOTIF_001_TO_EVENT` | `/notifications` | PLAYER | AVISO NO LEÍDO → COMUNICADO | Abrir /notifications?demo=player. → Pulsar el botón «Abrir» de la primera fila. | sí | sí | sí | sí | — |
| [x] | `XD_REPORT_001_TO_ATTENDANCE` | `/reports/attendance` | COACH | INFORME → PLANILLA | Abrir /reports/attendance?demo=coach. → Pulsar el enlace «Ver planilla». | sí | sí | sí | sí | — |
| [x] | `XD_SEARCH_001_TO_PERSON` | `/search?q=Lucía` | COACH | RESULTADO DE BÚSQUEDA → FICHA DE PERSONA | Abrir /search?q=Lucía&demo=coach. → Pulsar la fila «Lucía Fernández». | sí | sí | sí | sí | — |
| [x] | `XD_SEARCH_002_TO_TEAM` | `/search?q=Sexta` | COACH | RESULTADO DE BÚSQUEDA → DETALLE DE EQUIPO | Abrir /search?q=Sexta&demo=coach. → Pulsar la fila «Sexta A». | sí | sí | sí | sí | — |
| [x] | `XD_SEARCH_003_TO_EVENT` | `/search?q=CUBA` | COACH | RESULTADO DE BÚSQUEDA → DETALLE DE EVENTO | Abrir /search?q=CUBA&demo=coach. → Pulsar la fila «GEI vs. CUBA». | sí | sí | sí | sí | — |
| [x] | `XD_TEAM_001_TO_EVENT` | `/teams/sexta` | COACH | EQUIPO → EVENTO | Abrir /teams/sexta?demo=coach. → Pulsar la fila «GEI vs. CUBA». | sí | sí | sí | sí | — |
