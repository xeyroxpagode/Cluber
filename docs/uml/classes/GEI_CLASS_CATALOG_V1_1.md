# GEI Class Catalog V1.1

| ID | Class | Type | Responsibility |
| --- | --- | --- | --- |
| CL-01 | Person | entity | Human identity and canonical email. Person.email is required for a Person with Account and unique case-insensitively among authenticable accounts. |
| CL-02 | Account | entity | 1:1 access record for Person; credential and status. No email copy. username is unique stable profile identity only. |
| CL-03 | Membership | entity | Período de pertenencia al club [valid_from, valid_until); prerrequisito para TeamAssignment/RoleAssignment internos |
| CL-04 | TeamAssignment | entity | Afiliación deportiva PLAYER a Team con vigencia temporal; atómica con RoleAssignment PLAYER |
| CL-05 | RoleAssignment | entity | Rol + scope (CLUB/TEAM/EVENT) + vigencia temporal; 5 roles; combinación inválida → INVALID_ROLE_SCOPE |
| CL-07 | Season | entity | Entidad histórica: nombre, fechas; sin lifecycle; no hard-delete; referencia para Team/Competition/Jornada |
| CL-08 | Division | entity | Nivel competitivo; lifecycle ACTIVE→ARCHIVED; renombrar con equipos activos rechazado; valla dependencias |
| CL-09 | Line | entity | Tira/línea deportiva dentro de Division; lifecycle ACTIVE→ARCHIVED; etiqueta completa incluye división+temporada |
| CL-10 | Team | entity | Entidad concreta de temporada: identidad = Season + Division + Line (única inmutable); nombre derivado; DRAFT→ACTIVE→ARCHIVED |
| CL-11 | Venue | entity | Sede: nombre, dirección, field_label opcional; Regla A/B; lifecycle ACTIVE→ARCHIVED |
| CL-12 | Event | entity | Raíz común TRAINING/MATCH/CLUB_EVENT; 7 estados; invariantes fecha, destinatarios plurales, coordination_revision; subtipo discriminado por type Match may reference Competition directly through optional competitionId. |
| CL-13 | EventSeries | entity | Contenedor de ocurrencias recurrentes; máx 366 por comando; 3 alcances de edición; coordination_revision por ocurrencia; ACTIVE→ENDED |
| CL-14 | EventOccurrenceOverride | entity | Anulación específica de una ocurrencia en serie; identidad propia; permite 'solo esta' en ediciones de serie |
| CL-15 | Jornada | entity | Groups Matches for one operational day; season coherence and conceptual atomicity; optional direct competitionId. |
| CL-16 | EventLogistics | entity | Logística de evento (meetingAt, departureAt, meetingPoint, transportNote, arrivalInstructions); opcional 0..1 por Event; auditable |
| CL-17 | EventTargetTeam | association_class | Asociación Event ↔ Team (N:M) para destinatarios plurales; club_wide_target=false; identity propia |
| CL-18 | EventTargetPerson | association_class | Asociación Event ↔ Person (N:M) para destinatarios personales; identity propia |
| CL-19 | Availability | entity | Respuesta previa a Event SCHEDULED: YES/MAYBE/NO persistidos + NO_RESPONSE/NEEDS_RECONFIRMATION derivados; POSTPONED conserva |
| CL-20 | Selection | entity | Contenedor de convocatoria de un Match: borrador actual mutable + historial de SelectionRevision PUBLISHED inmutables |
| CL-21 | SelectionRevision | entity | Unidad de publicación: DRAFT (editable, autosave 600ms) → PUBLISHED (inmutable); republicar = nueva revisión |
| CL-22 | SelectionEntry | entity | Entrada individual en SelectionRevision: persona + estado (selected/alternate/etc.) + metadata |
| CL-23 | AttendanceSheet | entity | Contenedor por Event (TRAINING/MATCH): OPEN (closed_at NULL) / CLOSED (closed_at timestamp); no reapertura inventada |
| CL-24 | AttendanceEntry | entity | Valor de asistencia: PRESENT/ABSENT/JUSTIFIED persistidos + UNRECORDED derivado; corrección auditada con motivo obligatorio |
| CL-25 | MatchRecord | entity | Resultado de partido: DRAFT → FINAL (terminal); corrección explícita separada; compatibilidad con Event state; stats solo PLAYED |
| CL-26 | PlayerMatchStats | entity | Estadísticas fijas por jugador en MatchRecord PLAYED; participación real; matches_played derivado del resultado |
| CL-28 | Announcement | entity | Comunicado oficial: DRAFT → PUBLISHED (audiencia snapshot inmutable) → ARCHIVED; corrección solo title/body; solo Subcomisión |
| CL-29 | AnnouncementTargetTeam | association_class | Asociación Announcement ↔ Team (N:M) para audiencia snapshot inmutable al publicar |
| CL-30 | Conversation | entity | 4 tipos: DIRECT (par canónico único), GROUP (≥2, título, archivable), TEAM (0..1 canónica, sync), EVENT (0..1 canónica, sync); solo GROUP tiene SM |
| CL-31 | ConversationParticipant | association_class | Asociación Person ↔ Conversation (N:M) con joined_at/left_at; acceso temporal autoritativo; ex-participante conserva período |
| CL-32 | Message | entity | Mensaje en conversación: SENT → EDITED → DELETED (tombstone irreversible, confirmación+motivo); solo mensajes propios |
| CL-33 | Notification | entity | Notificación de 7 tipos; clave lógica única origin_event_id + recipient + type; audienceResolvedAt inmutable; UNREAD/READ derivado |
| CL-34 | Competition | entity | Simple sports context: create, edit, archive and consult; no dedicated state machine. |
| CL-37 | AuditEntry | entity | Entrada append-only: qué cambió, quién, cuándo, motivo, enlace al objeto; datos sensibles redactados; sin secrets |

Active canonical class count: 33. GuardianRelationship, EligibilityConstraint and CompetitionEntry are OUT. ExternalReference is DEFER. Enums are not canonical classes.
