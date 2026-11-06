# SURFACE INVENTORY — 05_Comunicacion

Inventario de superficies de este dominio. El listado sale de la implementación real:
routes del router + navegación visible + acciones + overflow + formularios + tabs +
estados de transición + overlays + variantes de autoridad + estados vacío/carga/error.

**Superficies en este dominio:** 21

| [x] | ID | Route / origin | Actor | Estado | Cómo llegar | 390 | 1440 | Capturada | Mapeada | Motion |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [x] | `COM_ANNOUNCEMENT_001_DETAIL` | `/announcements/a1` | COACH | PUBLISHED · 0 correcciones | Abrir /announcements/a1?demo=coach. | sí | sí | sí | sí | — |
| [x] | `COM_ANNOUNCEMENT_002_AUDIENCE_SHEET` | `/announcements/a1` | SUBCOMMITTEE | PUBLICADO · hoja abierta | Abrir /announcements/a1?demo=subcommittee. → Pulsar «Quién lo ve». | sí | sí | sí | sí | — |
| [x] | `COM_ANNOUNCEMENT_003_MENU_OPEN` | `/announcements/a1` | SUBCOMMITTEE | PUBLISHED · menú abierto | Abrir /announcements/a1?demo=subcommittee. → Pulsar «Acciones». | sí | sí | sí | sí | MOTION_MENU_OPEN_1440_CONV |
| [x] | `COM_ANNOUNCEMENT_004_ARCHIVE_CONFIRM` | `/announcements/a1` | SUBCOMMITTEE | ARCHIVADO CONFIRMADO | Abrir /announcements/a1?demo=subcommittee. → Pulsar «Acciones». → Pulsar «Archivar». | sí | sí | sí | sí | — |
| [x] | `COM_ANNOUNCEMENT_005_DRAFT` | `/announcements/a3` | SUBCOMMITTEE | DRAFT · audienceSnapshot = null | Abrir /announcements/a3?demo=subcommittee. | sí | sí | sí | sí | — |
| [x] | `COM_ANNOUNCEMENT_006_NOT_REACHED` | `/announcements/a3` | PLAYER | FUERA DE LA AUDIENCIA | Abrir /announcements/a3?demo=player. | sí | sí | sí | sí | — |
| [x] | `COM_ANNOUNCEMENT_007_NEW_FORM` | `/communication/announcements/new` | SUBCOMMITTEE | FORMULARIO VACÍO · audiencia por defecto = club | Abrir /communication/announcements/new?demo=subcommittee. | sí | sí | sí | sí | — |
| [x] | `COM_ANNOUNCEMENT_008_EDIT_FORM` | `/announcements/a1/edit` | SUBCOMMITTEE | EDICIÓN DE PUBLICADO · audiencia inmutable | Abrir /announcements/a1/edit?demo=subcommittee. | sí | sí | sí | sí | — |
| [x] | `COM_ANNOUNCEMENT_009_NO_AUTHORITY_NEW` | `/communication/announcements/new` | COACH | SIN AUTORIDAD DE PUBLICACIÓN | Abrir /communication/announcements/new?demo=coach. | sí | sí | sí | sí | — |
| [x] | `COM_COMM_001_CONVERSACIONES` | `/communication` | COACH | 3 conversaciones activas · 2 mensajes sin leer | Abrir /communication?demo=coach. | sí | sí | sí | sí | — |
| [x] | `COM_COMM_002_COMUNICADOS` | `/communication?tab=comunicados` | COACH | 2 comunicados visibles (el borrador a3 no se lista) | Abrir /communication?tab=comunicados&demo=coach. | sí | sí | sí | sí | MOTION_TAB_COMMUNICATION_390 |
| [x] | `COM_COMM_003_COMUNICADOS_SUBCOMMITTEE` | `/communication?tab=comunicados` | SUBCOMMITTEE | SIN ROL DE CHAT | Abrir /communication?tab=comunicados&demo=subcommittee. | sí | sí | sí | sí | — |
| [x] | `COM_COMM_004_NO_CHAT_ADMIN` | `/communication` | ADMIN | SIN ROL DE CHAT | Abrir /communication?demo=admin. | sí | sí | sí | sí | — |
| [x] | `COM_COMM_005_CONVERSACIONES_PLAYER` | `/communication` | PLAYER | 1 conversación · 1 mensaje sin leer | Abrir /communication?demo=player. | sí | sí | sí | sí | — |
| [x] | `COM_CONVERSATION_001_DEFAULT` | `/conversations/c-team-sexta` | COACH | ID DE PARÁMETRO NO RESUELTO | Abrir /conversations/c-team-sexta?demo=coach. | sí | sí | sí | sí | — |
| [x] | `COM_CONVERSATION_002_EVENT_KIND` | `/conversations/c-event-cuba` | COACH | ID DE PARÁMETRO NO RESUELTO | Abrir /conversations/c-event-cuba?demo=coach. | sí | sí | sí | sí | — |
| [x] | `COM_CONVERSATION_003_NEW_TARGET` | `/conversations/new?to=p2` | COACH | SELECTOR DE PERSONAS (el parámetro ?to= no se consume) | Abrir /conversations/new?to=p2&demo=coach. | sí | sí | sí | sí | — |
| [x] | `COM_CONVERSATION_004_NO_AUTHORITY` | `/conversations/c-team-sexta` | ADMIN | ID DE PARÁMETRO NO RESUELTO | Abrir /conversations/c-team-sexta?demo=admin. | sí | sí | sí | sí | — |
| [x] | `COM_NEW_CONVERSATION_001_PICK` | `/communication/conversations/new` | COACH | listado completo de personas (12 filas visibles) | Abrir /communication/conversations/new?demo=coach. | sí | sí | sí | sí | — |
| [x] | `COM_NEW_CONVERSATION_002_SEARCH` | `/communication/conversations/new` | COACH | 1 persona coincidente | Abrir /communication/conversations/new?demo=coach. → Escribir «Lucía» en el campo. | sí | sí | sí | sí | — |
| [x] | `COM_NEW_CONVERSATION_003_NO_RESULTS` | `/communication/conversations/new` | COACH | 0 coincidencias | Abrir /communication/conversations/new?demo=coach. → Escribir «zzz» en el campo. | sí | sí | sí | sí | — |
