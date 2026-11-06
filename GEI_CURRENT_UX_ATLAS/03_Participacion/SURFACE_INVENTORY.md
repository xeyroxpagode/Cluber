# SURFACE INVENTORY — 03_Participacion

Inventario de superficies de este dominio. El listado sale de la implementación real:
routes del router + navegación visible + acciones + overflow + formularios + tabs +
estados de transición + overlays + variantes de autoridad + estados vacío/carga/error.

**Superficies en este dominio:** 29

| [x] | ID | Route / origin | Actor | Estado | Cómo llegar | 390 | 1440 | Capturada | Mapeada | Motion |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [x] | `PRT_ATTENDANCE_001_OPEN` | `/events/match-lomas/attendance` | COACH | attendanceOpened=true · sin cerrar · 5 de 8 registradas | Abrir /events/match-lomas/attendance?demo=coach. | sí | sí | sí | sí | — |
| [x] | `PRT_ATTENDANCE_002_NOT_OPENED` | `/events/match-cuba/attendance` | COACH | attendanceOpened=false · 0 registros | Abrir /events/match-cuba/attendance?demo=coach. | sí | sí | sí | sí | — |
| [x] | `PRT_ATTENDANCE_003_CLOSED` | `/events/match-sic/attendance` | COACH | CERRADA · 7 de 8 registradas · 1 corrección | Abrir /events/match-sic/attendance?demo=coach. | sí | sí | sí | sí | — |
| [x] | `PRT_ATTENDANCE_004_CLOSE_CONFIRM` | `/events/match-lomas/attendance` | COACH | CIERRE CONFIRMADO | Abrir /events/match-lomas/attendance?demo=coach. → Pulsar «Cerrar asistencia». | sí | sí | sí | sí | — |
| [x] | `PRT_ATTENDANCE_005_CORRECTION_DIALOG` | `/events/match-lomas/attendance` | COACH | CORRECCIÓN CONFIRMADA | Abrir /events/match-lomas/attendance?demo=coach. → Desplazar a y = 700. → Pulsar el botón «Ausente» de la primera fila registrada. | sí | sí | sí | sí | — |
| [x] | `PRT_ATTENDANCE_006_CORRECTIONS_HISTORY` | `/events/match-sic/attendance` | COACH | CERRADA · historial desplegado | Abrir /events/match-sic/attendance?demo=coach. → Pulsar «Ver 1». | sí | sí | sí | sí | — |
| [x] | `PRT_ATTENDANCE_007_NO_AUTHORITY` | `/events/match-lomas/attendance` | PLAYER | SIN ALCANCE | Abrir /events/match-lomas/attendance?demo=player. | sí | sí | sí | sí | — |
| [x] | `PRT_AVAILABILITY_001_DEFAULT` | `/events/match-cuba/availability` | COACH | SCHEDULED · 8 respuestas · p0 con NEEDS_RECONFIRMATION | Abrir /events/match-cuba/availability?demo=coach. | sí | sí | sí | sí | — |
| [x] | `PRT_AVAILABILITY_002_PLAYER_SELF` | `/events/match-cuba/availability` | PLAYER | SCHEDULED · p2 sin responder | Abrir /events/match-cuba/availability?demo=player. | sí | sí | sí | sí | — |
| [x] | `PRT_AVAILABILITY_003_POSTPONED` | `/events/match-banco/availability` | COACH | POSTPONED | Abrir /events/match-banco/availability?demo=coach. | sí | sí | sí | sí | — |
| [x] | `PRT_AVAILABILITY_004_SCROLL_02` | `/events/match-cuba/availability` | COACH | SCHEDULED · scroll 700 px | Abrir /events/match-cuba/availability?demo=coach. → Desplazar a y = 700. | sí | sí | sí | sí | — |
| [x] | `PRT_AVAILABILITY_005_CLUB_EVENT` | `/events/club-familias/availability` | COACH | SCHEDULED · 0 personas en el roster | Abrir /events/club-familias/availability?demo=coach. | sí | sí | sí | sí | — |
| [x] | `PRT_MATCH_RECORD_001_NOT_STARTED` | `/events/match-cuba/match-record` | COACH | SCHEDULED · record DRAFT | Abrir /events/match-cuba/match-record?demo=coach. | sí | sí | sí | sí | — |
| [x] | `PRT_MATCH_RECORD_002_EDITABLE` | `/events/match-lomas/match-record` | COACH | IN_PROGRESS · record DRAFT 1–1 · editing=true | Abrir /events/match-lomas/match-record?demo=coach. → Pulsar «Cargar el resultado». | sí | sí | sí | sí | — |
| [x] | `PRT_MATCH_RECORD_003_FINAL` | `/events/match-sic/match-record` | COACH | COMPLETED · record FINAL 3–1 | Abrir /events/match-sic/match-record?demo=coach. | sí | sí | sí | sí | — |
| [x] | `PRT_MATCH_RECORD_004_FINALIZE_CONFIRM` | `/events/match-lomas/match-record` | COACH | FINALIZACIÓN CONFIRMADA | Abrir /events/match-lomas/match-record?demo=coach. → Pulsar «Cargar el resultado». → Pulsar «Finalizar resultado». | sí | sí | sí | sí | — |
| [x] | `PRT_MATCH_RECORD_005_CORRECT_CONFIRM` | `/events/match-sic/match-record` | COACH | CORRECCIÓN CONFIRMADA | Abrir /events/match-sic/match-record?demo=coach. → Pulsar «Corregir el resultado». | sí | sí | sí | sí | — |
| [x] | `PRT_MATCH_RECORD_006_NOT_A_MATCH` | `/events/club-familias/match-record` | COACH | TIPO DE EVENTO NO MATCH | Abrir /events/club-familias/match-record?demo=coach. | sí | sí | sí | sí | — |
| [x] | `PRT_MATCH_RECORD_007_NO_AUTHORITY` | `/events/match-sic/match-record` | PLAYER | SIN ALCANCE | Abrir /events/match-sic/match-record?demo=player. | sí | sí | sí | sí | — |
| [x] | `PRT_MATCH_RECORD_008_HISTORY_OPEN` | `/events/match-sic/match-record` | COACH | COMPLETED · historial desplegado | Abrir /events/match-sic/match-record?demo=coach. → Pulsar «Ver 1». | sí | sí | sí | sí | — |
| [x] | `PRT_SELECTION_001_PUBLISHED` | `/events/match-cuba/selection` | COACH | PUBLISHED · 8 de 8 convocadas | Abrir /events/match-cuba/selection?demo=coach. | sí | sí | sí | sí | — |
| [x] | `PRT_SELECTION_002_DRAFT` | `/events/training-serie-1/selection` | COACH | DRAFT · published = null | Abrir /events/training-serie-1/selection?demo=coach. | sí | sí | sí | sí | — |
| [x] | `PRT_SELECTION_003_REVISIONS_OPEN` | `/events/match-cuba/selection` | COACH | PUBLISHED · historial desplegado | Abrir /events/match-cuba/selection?demo=coach. → Pulsar «Ver 1». | sí | sí | sí | sí | MOTION_SELECTION_EXPAND_390 |
| [x] | `PRT_SELECTION_004_DRAFT_DIRTY` | `/events/training-serie-1/selection` | COACH | DRAFT · dirty=true · 1 sumada | Abrir /events/training-serie-1/selection?demo=coach. → Pulsar el checkbox #sel-p0. | sí | sí | sí | sí | — |
| [x] | `PRT_SELECTION_005_PUBLISH_CONFIRM` | `/events/training-serie-1/selection` | COACH | PUBLICACIÓN CONFIRMADA | Abrir /events/training-serie-1/selection?demo=coach. → Pulsar el checkbox #sel-p0. → Pulsar «Publicar convocatoria». | sí | sí | sí | sí | — |
| [x] | `PRT_SELECTION_006_NO_AUTHORITY` | `/events/match-cuba/selection` | PLAYER | SIN ALCANCE SOBRE LA CONVOCATORIA | Abrir /events/match-cuba/selection?demo=player. | sí | sí | sí | sí | — |
| [x] | `PRT_SELECTION_007_OFFICIAL_VS_COACH` | `/events/match-cuba/selection` | SUBCOMMITTEE | SIN ALCANCE (canManageSelection exige rol de entrenador) | Abrir /events/match-cuba/selection?demo=subcommittee. | sí | sí | sí | sí | — |
| [x] | `PRT_SELECTION_008_SCROLL_02` | `/events/match-cuba/selection` | COACH | PUBLISHED · scroll 800 px | Abrir /events/match-cuba/selection?demo=coach. → Desplazar a y = 800. | sí | sí | sí | sí | — |
| [x] | `PRT_SELECTION_009_PUBLISH_TOAST` | `/events/training-serie-1/selection` | COACH | PUBLISHED · toast visible | Abrir /events/training-serie-1/selection?demo=coach. → Marcar el checkbox #sel-p0. → Pulsar «Publicar convocatoria». → Pulsar «Publicar» en el diálogo. → Esperar 1200 ms. | sí | sí | sí | sí | — |
