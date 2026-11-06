# SURFACE INVENTORY — 02_Calendario

Inventario de superficies de este dominio. El listado sale de la implementación real:
routes del router + navegación visible + acciones + overflow + formularios + tabs +
estados de transición + overlays + variantes de autoridad + estados vacío/carga/error.

**Superficies en este dominio:** 35

| [x] | ID | Route / origin | Actor | Estado | Cómo llegar | 390 | 1440 | Capturada | Mapeada | Motion |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [x] | `CAL_CALENDAR_001_AGENDA` | `/calendar?view=agenda` | COACH | SCHEDULED · sin evento seleccionado · sin filtros | Abrir /calendar?view=agenda&demo=coach. | sí | sí | sí | sí | — |
| [x] | `CAL_CALENDAR_002_MONTH` | `/calendar?view=month` | COACH | vista mes · sin selección | Abrir /calendar?view=month&demo=coach. | sí | sí | sí | sí | — |
| [x] | `CAL_CALENDAR_003_MONTH_EVENT_SELECTED` | `/calendar?view=month&event=match-cuba` | COACH | SCHEDULED · seleccionado | Abrir /calendar?view=month&event=match-cuba&demo=coach. | sí | sí | sí | sí | — |
| [x] | `CAL_CALENDAR_004_AGENDA_EVENT_SELECTED` | `/calendar?view=agenda&event=match-cuba` | COACH | SCHEDULED · seleccionado | Abrir /calendar?view=agenda&event=match-cuba&demo=coach. | sí | sí | sí | sí | — |
| [x] | `CAL_CALENDAR_005_FILTER_EMPTY` | `/calendar?view=agenda&team=septima&type=TRAINING` | COACH | 0 eventos para team=septima + type=TRAINING | Abrir /calendar?view=agenda&team=septima&type=TRAINING&demo=coach. | sí | sí | sí | sí | — |
| [x] | `CAL_CALENDAR_006_FILTERED_MATCH` | `/calendar?view=agenda&type=MATCH` | COACH | tipo=MATCH | Abrir /calendar?view=agenda&type=MATCH&demo=coach. | sí | sí | sí | sí | — |
| [x] | `CAL_CALENDAR_007_MONTH_SCROLL_02` | `/calendar?view=month` | COACH | vista mes · scroll 700 px | Abrir /calendar?view=month&demo=coach. → Desplazar a y = 700. | sí | sí | sí | sí | — |
| [x] | `CAL_EVENT_DETAIL_001_SCHEDULED_COACH` | `/events/match-cuba` | COACH | SCHEDULED ·ublished 8 personas · coordinationRevision 3 | Abrir /events/match-cuba?demo=coach. | sí | sí | sí | sí | — |
| [x] | `CAL_EVENT_DETAIL_002_LIFECYCLE_SHEET` | `/events/match-cuba` | COACH | SCHEDULED · hoja abierta | Abrir /events/match-cuba?demo=coach. → Pulsar «Acciones». → Pulsar «Postergar». | sí | sí | sí | sí | MOTION_SHEET_LIFECYCLE_390 |
| [x] | `CAL_EVENT_DETAIL_003_CANCEL_CONFIRM` | `/events/match-cuba` | COACH | SCHEDULED · confirmación abierta | Abrir /events/match-cuba?demo=coach. → Pulsar «Acciones». → Pulsar «Cancelar evento». → Pulsar «Cancelar» en la hoja de ciclo de vida. | sí | sí | sí | sí | MOTION_CONFIRM_CANCEL_390 |
| [x] | `CAL_EVENT_DETAIL_004_HISTORY_MODAL` | `/events/match-cuba` | COACH | SCHEDULED · modal abierto | Abrir /events/match-cuba?demo=coach. → Pulsar «Ver todo» en la sección Historial. | sí | sí | sí | sí | — |
| [x] | `CAL_EVENT_DETAIL_005_IN_PROGRESS` | `/events/match-lomas` | COACH | IN_PROGRESS · asistencia abierta con 5 registros · record DRAFT 1–1 | Abrir /events/match-lomas?demo=coach. | sí | sí | sí | sí | — |
| [x] | `CAL_EVENT_DETAIL_006_COMPLETED` | `/events/match-sic` | COACH | COMPLETED · record FINAL 3–1 · attendance cerrada | Abrir /events/match-sic?demo=coach. | sí | sí | sí | sí | — |
| [x] | `CAL_EVENT_DETAIL_007_CANCELLED` | `/events/training-cancelado` | COACH | CANCELLED | Abrir /events/training-cancelado?demo=coach. | sí | sí | sí | sí | — |
| [x] | `CAL_EVENT_DETAIL_008_POSTPONED` | `/events/match-banco` | COACH | POSTPONED | Abrir /events/match-banco?demo=coach. | sí | sí | sí | sí | — |
| [x] | `CAL_EVENT_DETAIL_009_PLAYER_VIEW` | `/events/match-cuba` | PLAYER | SCHEDULED · p2 en la convocatoria publicada | Abrir /events/match-cuba?demo=player. | sí | sí | sí | sí | MOTION_VAS_ANSWER_390 |
| [x] | `CAL_EVENT_DETAIL_010_CAPTAIN_RECONFIRM` | `/events/match-cuba` | CAPTAIN | SCHEDULED · NEEDS_RECONFIRMATION | Abrir /events/match-cuba?demo=captain. | sí | sí | sí | sí | — |
| [x] | `CAL_EVENT_DETAIL_011_OFFICIAL_COORDINATION` | `/events/match-cuba` | SUBCOMMITTEE | SCHEDULED · actor club-wide sin rol de entrenador | Abrir /events/match-cuba?demo=subcommittee. | sí | sí | sí | sí | — |
| [x] | `CAL_EVENT_DETAIL_012_SCROLL_02` | `/events/match-cuba` | COACH | SCHEDULED · scroll 1100 px | Abrir /events/match-cuba?demo=coach. → Desplazar a y = 1100. | sí | sí | sí | sí | — |
| [x] | `CAL_EVENT_DETAIL_013_NOT_FOUND` | `/events/no-existe` | COACH | ID DE EVENTO DESCONOCIDO | Abrir /events/no-existe?demo=coach. | sí | sí | sí | sí | — |
| [x] | `CAL_EVENT_DETAIL_014_PLAYER_NOT_INVITED` | `/events/match-cuba` | SUBCOMMITTEE | SCHEDULED · sin convocatoria y sin respuesta propia | Abrir /events/match-cuba?demo=subcommittee. | sí | sí | sí | sí | — |
| [x] | `CAL_EVENT_FORM_001_NEW` | `/events/new` | COACH | FORMULARIO VACÍO | Abrir /events/new?demo=coach. | sí | sí | sí | sí | — |
| [x] | `CAL_EVENT_FORM_002_NEW_MATCH_TYPE` | `/events/new` | COACH | type=MATCH | Abrir /events/new?demo=coach. → Pulsar la opción «Partido». | sí | sí | sí | sí | — |
| [x] | `CAL_EVENT_FORM_003_NEW_CLUB_WIDE` | `/events/new` | COACH | clubWide=true | Abrir /events/new?demo=coach. → Pulsar la opción «Todo el hockey». | sí | sí | sí | sí | — |
| [x] | `CAL_EVENT_FORM_004_NEW_VALIDATION_ERRORS` | `/events/new` | COACH | VALIDATION FAILED | Abrir /events/new?demo=coach. → Pulsar «Crear evento» sin completar nada. | sí | sí | sí | sí | — |
| [x] | `CAL_EVENT_FORM_005_EDIT` | `/events/match-cuba/edit` | COACH | SCHEDULED · edición sin cambios (baseline = formulario actual) | Abrir /events/match-cuba/edit?demo=coach. | sí | sí | sí | sí | — |
| [x] | `CAL_EVENT_FORM_006_EDIT_DIRTY` | `/events/match-cuba/edit` | COACH | DIRTY · cambio no material (sólo título) | Abrir /events/match-cuba/edit?demo=coach. → Escribir en el campo #field-title. | sí | sí | sí | sí | — |
| [x] | `CAL_EVENT_FORM_007_EDIT_DISCARD_CONFIRM` | `/events/match-cuba/edit` | COACH | DIRTY · confirmación abierta | Abrir /events/match-cuba/edit?demo=coach. → Escribir en el campo #field-title. → Pulsar «Descartar». | sí | sí | sí | sí | — |
| [x] | `CAL_EVENT_FORM_008_EDIT_SERIES` | `/events/training-serie-1/edit` | COACH | SCHEDULED · serie de 4 ocurrencias | Abrir /events/training-serie-1/edit?demo=coach. | sí | sí | sí | sí | — |
| [x] | `CAL_EVENT_FORM_009_SCOPE_DIALOG` | `/events/training-serie-1/edit` | COACH | SCHEDULED · diálogo de alcance abierto | Abrir /events/training-serie-1/edit?demo=coach. → Escribir «18:30» en el campo #field-time. → Pulsar «Guardar cambios». | sí | sí | sí | sí | MOTION_MODAL_SCOPE_1440 |
| [x] | `CAL_EVENT_FORM_010_NO_AUTHORITY` | `/events/match-septima-quinta/edit` | PLAYER | SIN ALCANCE DE EDICIÓN | Abrir /events/match-septima-quinta/edit?demo=player. | sí | sí | sí | sí | — |
| [x] | `CAL_JORNADA_001_DETAIL` | `/jornadas/j1` | COACH | jornada con 1 partido · editable por el entrenador | Abrir /jornadas/j1?demo=coach. | sí | sí | sí | sí | — |
| [x] | `CAL_JORNADA_002_NEW` | `/jornadas/new` | COACH | FORMULARIO VACÍO | Abrir /jornadas/new?demo=coach. | sí | sí | sí | sí | — |
| [x] | `CAL_JORNADA_003_READ_ONLY` | `/jornadas/j1` | PLAYER | LECTURA | Abrir /jornadas/j1?demo=player. | sí | sí | sí | sí | — |
| [x] | `CAL_JORNADA_004_IMPACT_MODAL` | `/jornadas/j1` | COACH | GUARDADO · modal de impacto abierto | Abrir /jornadas/j1?demo=coach. → Elegir la sede CUBA en el select de «Sede de la jornada». → Pulsar «Guardar jornada». | sí | sí | sí | sí | — |
