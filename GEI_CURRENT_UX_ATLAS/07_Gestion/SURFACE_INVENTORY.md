# SURFACE INVENTORY — 07_Gestion

Inventario de superficies de este dominio. El listado sale de la implementación real:
routes del router + navegación visible + acciones + overflow + formularios + tabs +
estados de transición + overlays + variantes de autoridad + estados vacío/carga/error.

**Superficies en este dominio:** 41

| [x] | ID | Route / origin | Actor | Estado | Cómo llegar | 390 | 1440 | Capturada | Mapeada | Motion |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [x] | `MGT_AUDIT_001_LIST` | `/audit` | ADMIN | SIN FILTROS · 3 movimientos | Abrir /audit?demo=admin. | sí | sí | sí | sí | — |
| [x] | `MGT_AUDIT_002_EMPTY_RANGE` | `/audit?from=2030-01-01&to=2030-12-31` | ADMIN | RANGO SIN RESULTADOS | Abrir /audit?from=2030-01-01&to=2030-12-31&demo=admin. | sí | sí | sí | sí | — |
| [x] | `MGT_AUDIT_003_DENIED_COACH` | `/audit` | COACH | SIN ACCESO | Abrir /audit?demo=coach. | sí | sí | sí | sí | — |
| [x] | `MGT_COMPETITIONS_001_LIST` | `/management/competitions` | ADMIN | 2 COMPETENCIAS ACTIVAS · 0 archivadas | Abrir /management/competitions?demo=admin. | sí | sí | sí | sí | — |
| [x] | `MGT_COMPETITIONS_002_DETAIL` | `/management/competitions/ahba` | ADMIN | ACTIVA · 1 jornada · 5 partidos | Abrir /management/competitions/ahba?demo=admin. | sí | sí | sí | sí | — |
| [x] | `MGT_COMPETITIONS_003_CREATE_MODAL` | `/management/competitions` | ADMIN | Panel abierto, sin valores | Abrir /management/competitions?demo=admin. → Pulsar «Crear competencia». | sí | sí | sí | sí | — |
| [x] | `MGT_COMPETITIONS_004_EDIT_MODAL` | `/management/competitions/ahba` | ADMIN | Panel abierto con valores | Abrir /management/competitions/ahba?demo=admin. → Pulsar «Editar». | sí | sí | sí | sí | — |
| [x] | `MGT_COMPETITIONS_005_ARCHIVE_CONFIRM` | `/management/competitions/ahba` | ADMIN | ARCHIVADO CONFIRMADO | Abrir /management/competitions/ahba?demo=admin. → Pulsar «Archivar competencia». | sí | sí | sí | sí | — |
| [x] | `MGT_COMPETITIONS_006_SUBCOMMITTEE` | `/management/competitions` | SUBCOMMITTEE | SUBCOMMITTEE · 2 competencias visibles | Abrir /management/competitions?demo=subcommittee. | sí | sí | sí | sí | — |
| [x] | `MGT_COMPETITIONS_007_DENIED_COACH` | `/management/competitions` | COACH | SIN ACCESO | Abrir /management/competitions?demo=coach. | sí | sí | sí | sí | — |
| [x] | `MGT_HOME_001_ADMIN` | `/management` | ADMIN | ADMIN · 3 accesos | Abrir /management?demo=admin. | sí | sí | sí | sí | — |
| [x] | `MGT_HOME_002_SUBCOMMITTEE` | `/management` | SUBCOMMITTEE | SUBCOMMITTEE · 1 acceso | Abrir /management?demo=subcommittee. | sí | sí | sí | sí | — |
| [x] | `MGT_HOME_003_DENIED_COACH` | `/management` | COACH | SIN ACCESO | Abrir /management?demo=coach. | sí | sí | sí | sí | — |
| [x] | `MGT_PEOPLE_001_LIST` | `/management/people` | ADMIN | SIN FILTROS · 21 personas | Abrir /management/people?demo=admin. | sí | sí | sí | sí | — |
| [x] | `MGT_PEOPLE_002_FILTER_INCOMPLETE` | `/management/people?profileStatus=incomplete` | ADMIN | 1 persona incompleta | Abrir /management/people?profileStatus=incomplete&demo=admin. | sí | sí | sí | sí | — |
| [x] | `MGT_PEOPLE_003_FILTER_EMPTY` | `/management/people?q=zzzzz` | ADMIN | 0 coincidencias | Abrir /management/people?q=zzzzz&demo=admin. | sí | sí | sí | sí | — |
| [x] | `MGT_PEOPLE_004_FILTER_ACCOUNT_PENDING` | `/management/people?account=PENDING` | ADMIN | 1 cuenta pendiente | Abrir /management/people?account=PENDING&demo=admin. | sí | sí | sí | sí | — |
| [x] | `MGT_PEOPLE_005_NEW_FORM` | `/management/people/new` | ADMIN | FORMULARIO VACÍO | Abrir /management/people/new?demo=admin. | sí | sí | sí | sí | — |
| [x] | `MGT_PEOPLE_006_NEW_VALIDATION` | `/management/people/new` | ADMIN | VALIDATION FAILED | Abrir /management/people/new?demo=admin. → Pulsar «Crear persona» sin completar. | sí | sí | sí | sí | — |
| [x] | `MGT_PEOPLE_007_DENIED_COACH` | `/management/people` | COACH | SIN ACCESO | Abrir /management/people?demo=coach. | sí | sí | sí | sí | — |
| [x] | `MGT_PERSON_001_IDENTIDAD` | `/management/people/p2` | ADMIN | CUENTA ACTIVA · 1 equipo · 1 rol | Abrir /management/people/p2?demo=admin. | sí | sí | sí | sí | — |
| [x] | `MGT_PERSON_002_PERTENENCIA` | `/management/people/p2?section=pertenencia` | ADMIN | PERTENENCIA VIGENTE | Abrir /management/people/p2?section=pertenencia&demo=admin. | sí | sí | sí | sí | — |
| [x] | `MGT_PERSON_003_EQUIPOS` | `/management/people/p2?section=equipos` | ADMIN | 1 EQUIPO VIGENTE | Abrir /management/people/p2?section=equipos&demo=admin. | sí | sí | sí | sí | — |
| [x] | `MGT_PERSON_004_ROLES` | `/management/people/p2?section=roles` | ADMIN | 1 ROL VIGENTE | Abrir /management/people/p2?section=roles&demo=admin. | sí | sí | sí | sí | — |
| [x] | `MGT_PERSON_005_CUENTA` | `/management/people/p2?section=cuenta` | ADMIN | CUENTA ACTIVA | Abrir /management/people/p2?section=cuenta&demo=admin. | sí | sí | sí | sí | — |
| [x] | `MGT_PERSON_006_IDENTITY_MODAL` | `/management/people/p2` | ADMIN | Panel abierto, sin cambios | Abrir /management/people/p2?demo=admin. → Pulsar «Corregir identidad». | sí | sí | sí | sí | — |
| [x] | `MGT_PERSON_007_INCOMPLETE` | `/management/people/p17` | ADMIN | PERFIL INCOMPLETO | Abrir /management/people/p17?demo=admin. | sí | sí | sí | sí | — |
| [x] | `MGT_PERSON_008_PENDING_ACCOUNT` | `/management/people/p16` | ADMIN | CUENTA PENDIENTE · SIN PERTENENCIA | Abrir /management/people/p16?demo=admin. | sí | sí | sí | sí | — |
| [x] | `MGT_PERSON_009_CODE_MODAL` | `/management/people/p16?section=cuenta` | ADMIN | CÓDIGO EMITIDO | Abrir /management/people/p16?section=cuenta&demo=admin. → Pulsar «Emitir código de activación». → Pulsar «Emitir código». | sí | sí | sí | sí | — |
| [x] | `MGT_PERSON_010_NO_MEMBERSHIP` | `/management/people/p16?section=pertenencia` | ADMIN | SIN PERTENENCIA VIGENTE | Abrir /management/people/p16?section=pertenencia&demo=admin. | sí | sí | sí | sí | — |
| [x] | `MGT_PERSON_011_MEMBERSHIP_START_CONFIRM` | `/management/people/p16` | ADMIN | INICIO DE PERTENENCIA CONFIRMADO | Abrir /management/people/p16?demo=admin. → Pulsar «Iniciar pertenencia». | sí | sí | sí | sí | — |
| [x] | `MGT_PERSON_012_MEMBERSHIP_END_CONFIRM` | `/management/people/p2?section=pertenencia` | ADMIN | FIN DE PERTENENCIA CONFIRMADO | Abrir /management/people/p2?section=pertenencia&demo=admin. → Pulsar «Finalizar». | sí | sí | sí | sí | — |
| [x] | `MGT_PERSON_013_DISABLE_ACCOUNT_CONFIRM` | `/management/people/p2?section=cuenta` | ADMIN | DESHABILITACIÓN CONFIRMADA | Abrir /management/people/p2?section=cuenta&demo=admin. → Pulsar «Deshabilitar cuenta». | sí | sí | sí | sí | — |
| [x] | `MGT_PERSON_014_DENIED_SUBCOMMITTEE` | `/management/people/p2` | SUBCOMMITTEE | SIN ACCESO | Abrir /management/people/p2?demo=subcommittee. | sí | sí | sí | sí | — |
| [x] | `MGT_STRUCTURE_001_SEASONS` | `/management/structure?tab=SEASON` | ADMIN | 2 TEMPORADAS ACTIVAS | Abrir /management/structure?tab=SEASON&demo=admin. | sí | sí | sí | sí | — |
| [x] | `MGT_STRUCTURE_002_DIVISIONS` | `/management/structure?tab=DIVISION` | ADMIN | 4 DIVISIONES ACTIVAS | Abrir /management/structure?tab=DIVISION&demo=admin. | sí | sí | sí | sí | — |
| [x] | `MGT_STRUCTURE_003_LINES` | `/management/structure?tab=LINE` | ADMIN | 3 LÍNEAS ACTIVAS | Abrir /management/structure?tab=LINE&demo=admin. | sí | sí | sí | sí | — |
| [x] | `MGT_STRUCTURE_004_VENUES` | `/management/structure?tab=VENUE` | ADMIN | 0 SEDES EN LA ESTRUCTURA | Abrir /management/structure?tab=VENUE&demo=admin. | sí | sí | sí | sí | — |
| [x] | `MGT_STRUCTURE_007_DENIED_COACH` | `/management/structure` | COACH | SIN ACCESO | Abrir /management/structure?demo=coach. | sí | sí | sí | sí | — |
| [x] | `MGT_TEAM_001_ADMIN_DETAIL` | `/management/teams/sexta` | ADMIN | EQUIPO ACTIVO · 8 personas | Abrir /management/teams/sexta?demo=admin. | sí | sí | sí | sí | — |
| [x] | `MGT_TEAM_002_NOT_FOUND` | `/management/teams/zzz` | ADMIN | ID DE EQUIPO DESCONOCIDO | Abrir /management/teams/zzz?demo=admin. | sí | sí | sí | sí | — |
