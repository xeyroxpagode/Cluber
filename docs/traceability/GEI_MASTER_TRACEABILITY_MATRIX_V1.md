# GEI — Master Traceability Matrix V1

> **Etapa:** E9-03 · **Estado:** FROZEN con E9 · **Fuente estructural:** `GEI_TRACEABILITY_LEDGER_V1.csv` (3.929 relaciones justificadas).
> Cadena directa: `REQ → ACTOR → CU → ESPECIFICACIÓN → ESTADOS/TRANSICIONES → ACTIVIDADES → CLASES/OPERACIONES`.
> Proyección 1:1 del ledger; no constituye una segunda verdad. La evidencia por fila son las aristas del ledger citadas por ID.

**Tipos de cobertura (REQ funcional):** `DIRECT` (≥1 CU lo implementa como primario) · `SUPPORTING` (soporte vía CU secundario) · `CROSS_CUTTING` (regla transversal aplicable al conjunto, referencia colectiva de la matriz E3).
**Cobertura (REQ no funcional):** `MODELLED` (tiene máquina/estructura E6/E8) · `CONSTRAINT_DOCUMENTED` (restricción documentada en catálogo/PT) · `IMPLEMENTATION_PENDING` (evidencia de implementación pendiente, DEF-* de E1) · `DEFERRED_BY_AUTHORITY` (decisión externa).

| Columna | Contenido |
|---|---|
| Actores | Actores fuente del REQ (REQUESTED_BY, matriz E2) |
| CU | Casos de uso que lo implementan (IMPLEMENTS_GOAL, matriz E3) |
| Spec | Fichas E5 donde el CU está especificado |
| AC | Criterios de aceptación del REQ (nº) |
| SM / TR | Máquinas y transiciones E6 respaldadas por el REQ |
| AD | Diagramas de actividad E7 que representan sus CU |
| Clases/Op | Clases E8 y operaciones que lo realizan |

## Matriz maestra — 157 REQ

| REQ | Objetivo | Actores | CU | Spec | AC | SM | TR | AD | Clases/Op | Cobertura |
|---|---|---|---|---|---:|---|---|---|---|---|
| REQ-CMP-001 | Que las competencias en las que participa el club queden registradas con su identidad y s… | ACT-ADMIN, ACT-SUBCOMMITTEE | UC-CMP-01, UC-CMP-02 | CMP | 3 | SM-COMPETITION-01 | TR-060, TR-061 | AD-CMP-01 | Competition op:2 | DIRECT |
| REQ-CMP-002 | Que no se cierre una competencia que todavía tiene equipos inscritos jugando. | ACT-ADMIN, ACT-SUBCOMMITTEE | UC-CMP-03 | CMP | 2 | SM-COMPETITION-01 | TR-062 | AD-CMP-01 | Competition op:1 | DIRECT |
| REQ-CMP-003 | Que la participación en una competencia tenga un registro propio y con ciclo de vida. | ACT-ADMIN, ACT-SUBCOMMITTEE | UC-CMP-04, UC-CMP-05, UC-CMP-06, UC-CMP-07 | CMP | 4 | SM-COMPETITION-01, SM-COMPETITIONENTRY-01 | TR-061, TR-063, TR-064, TR-065, TR-066 | AD-CMP-01 | CompetitionEntry op:3 | DIRECT |
| REQ-CMP-004 | Que "inscrito" sea una afirmación precisa y no ambigua. | ACT-ADMIN, ACT-SUBCOMMITTEE | UC-CMP-04, UC-CMP-05, UC-CMP-06 | CMP | 3 | SM-COMPETITIONENTRY-01 | TR-063, TR-064, TR-065 | AD-CMP-01 | CompetitionEntry op:1 | SUPPORTING |
| REQ-CMP-005 | Que los resultados de un partido sean comparables dentro de la competencia que correspond… | ACT-COACH, ACT-SUBCOMMITTEE | UC-CMP-04, UC-CMP-05, UC-EVT-02, UC-EVT-15 | CMP, EVT | 2 | SM-COMPETITIONENTRY-01, SM-EVENT-01 | TR-065 | AD-CMP-01, AD-EVT-02, AD-EVT-04 | CompetitionEntry op:3 | SUPPORTING |
| REQ-CMP-006 | Que el dato federativo oficial quede registrado sin construir una integración. | ACT-ADMIN, ACT-SUBCOMMITTEE | UC-CMP-08, UC-CMP-09 | CMP | 3 | SM-COMPETITION-01 | TR-060 | — | ExternalReference op:1 | DIRECT |
| REQ-CMP-007 | Que el club no confunda el dato que GEI registra con el dato que la federación define. | — | UC-CMP-08, UC-CMP-09 | CMP | 3 | SM-COMPETITION-01, SM-ELIGIBILITY-01 | — | — | ExternalReference | SUPPORTING |
| REQ-CMP-008 | Que una restricción tenga el alcance correcto y no se difunda más de lo necesario. | ACT-ADMIN, ACT-COACH, ACT-SUBCOMMITTEE | UC-PRT-12, UC-PRT-13 | PRT | 4 | SM-COMPETITIONENTRY-01, SM-ELIGIBILITY-01 | TR-048 | — | EligibilityConstraint | SUPPORTING |
| REQ-COM-001 | Que el canal oficial del club tenga un estado inequívoco y una única autoridad. | ACT-SUBCOMMITTEE | UC-COM-01, UC-COM-02, UC-COM-04 | COM | 3 | SM-ANNOUNCEMENT-01 | TR-051, TR-052, TR-054 | AD-COM-01 | Announcement op:1 | DIRECT |
| REQ-COM-002 | Que un comunicado para una división no se lea como si fuera para todo el club. | ACT-SUBCOMMITTEE | UC-COM-01, UC-COM-02 | COM | 3 | SM-ANNOUNCEMENT-01 | TR-051 | AD-COM-01 | Announcement, AnnouncementTargetTeam op:2 | SUPPORTING |
| REQ-COM-003 | Que la responsabilidad de "lo vi" quede definida en el momento de la publicación. | — | UC-COM-02, UC-COM-03, UC-COM-05 | COM | 2 | SM-ANNOUNCEMENT-01 | TR-052, TR-053 | AD-COM-01 | Announcement, AnnouncementTargetTeam op:1 | SUPPORTING |
| REQ-COM-004 | Que un error en un comunicado oficial se pueda corregir sin romper la verdad de quién lo … | ACT-SUBCOMMITTEE | UC-COM-03 | COM | 3 | SM-ANNOUNCEMENT-01 | TR-053 | AD-COM-01 | Announcement op:2 | DIRECT |
| REQ-COM-005 | Que la audiencia del comunicado sea un control de acceso y no una etiqueta decorativa. | ACT-AUTHENTICATED | UC-COM-05 | COM | 2 | SM-ANNOUNCEMENT-01 | — | — | Announcement op:1 | DIRECT |
| REQ-COM-006 | Que la conversación directa sea única y no se fragmente en hilos paralelos. | ACT-AUTHENTICATED, ACT-CAPTAIN, ACT-COACH, ACT-PLAYER | UC-COM-06 | COM | 3 | — | — | — | Conversation op:1 | DIRECT |
| REQ-COM-007 | Que existan conversaciones que no dependan de un equipo o un evento. | ACT-AUTHENTICATED, ACT-CAPTAIN, ACT-COACH, ACT-PLAYER | UC-COM-07, UC-COM-12 | COM | 4 | SM-CONVERSATION-GROUP-01 | TR-055, TR-056 | — | Conversation op:2 | DIRECT |
| REQ-COM-008 | Que la conversación de un equipo o de un partido sea siempre la misma y no se confunda co… | ACT-AUTHENTICATED, ACT-CAPTAIN, ACT-COACH, ACT-PLAYER | UC-COM-08 | COM | 3 | — | — | — | Conversation op:2 | DIRECT |
| REQ-COM-009 | Que la conversación sea el canal de coordinación diaria del club. | ACT-AUTHENTICATED, ACT-CAPTAIN, ACT-COACH, ACT-PLAYER | UC-COM-09 | COM | 3 | SM-CONVERSATION-GROUP-01, SM-MESSAGE-01 | TR-057 | — | Message op:1 | DIRECT |
| REQ-COM-010 | Que rectificar un mensaje no destruya la conversación ni su historia. | ACT-AUTHENTICATED | UC-COM-10, UC-COM-11 | COM | 3 | SM-CONVERSATION-GROUP-01, SM-MESSAGE-01 | TR-058, TR-059 | — | Message op:3 | DIRECT |
| REQ-COM-011 | Que la conversación privada tenga límites temporales verificables. | — | UC-COM-09, UC-COM-12 | COM | 3 | SM-CONVERSATION-GROUP-01, SM-MESSAGE-01 | TR-056, TR-057 | — | ConversationParticipant op:3 | SUPPORTING |
| REQ-COM-012 | Que "tener el rol" no equivalga a "poder leer todo lo que se escribe". | — | UC-COM-06, UC-COM-07, UC-COM-08, UC-COM-09 | COM | 3 | SM-CONVERSATION-GROUP-01 | TR-055, TR-057 | — | Conversation op:1 | SUPPORTING |
| REQ-COM-013 | Que crear una conversación no produzca combinaciones imposibles ni una lista arbitraria. | ACT-AUTHENTICATED | UC-COM-06, UC-COM-07, UC-COM-08 | COM | 2 | — | TR-055 | — | — | SUPPORTING |
| REQ-COM-014 | Que el aviso que recibe una persona diga qué pasó. | ACT-AUTHENTICATED | UC-COM-13 | COM | 3 | SM-ANNOUNCEMENT-01, SM-EVENT-01 | TR-018, TR-019, TR-020, TR-021, TR-022 (+1) | — | Notification op:1 | SUPPORTING |
| REQ-COM-015 | Que nadie se entere de su convocación por ausencia. | ACT-GUARDIAN, ACT-PLAYER | UC-COM-13, UC-PRT-03 | COM, PRT | 3 | SM-SELECTIONREV-01 | TR-040 | AD-PRT-02 | Notification op:1 | SUPPORTING |
| REQ-COM-016 | Que un cambio de destinatarios no deje sin avisar a quien debía enterarse. | ACT-COACH, ACT-GUARDIAN, ACT-PLAYER | UC-COM-13, UC-EVT-04 | COM, EVT | 3 | SM-EVENT-01, SM-EVENTSERIES-01 | TR-027, TR-033 | AD-EVT-01 | Notification op:1 | SUPPORTING |
| REQ-COM-017 | Que el canal de avisos siga siendo útil y no se llene de ruido. | — | UC-COM-09, UC-COM-13, UC-PRT-01, UC-PRT-05, UC-PRT-07 | COM, PRT | 4 | SM-ATTENDANCEENTRY-01, SM-AVAILABILITY-01, SM-CONVERSATION-GROUP-01 (+2) | — | AD-PRT-01, AD-PRT-03 | Notification | SUPPORTING |
| REQ-COM-018 | Que la lista de avisos sea una lista, no un registro duplicado ni una trampa de navegació… | ACT-AUTHENTICATED | UC-COM-13, UC-COM-14 | COM | 4 | — | — | — | Notification op:2 | DIRECT |
| REQ-EVT-001 | Que ningún evento sea una fecha incoherente. | — | UC-EVT-01, UC-EVT-02, UC-EVT-03 | EVT | 3 | SM-EVENT-01, SM-EVENTSERIES-01 | TR-017, TR-023, TR-026 | AD-EVT-02 | Event op:1 | SUPPORTING |
| REQ-EVT-002 | Que el club pueda convocar entrenamientos. | ACT-COACH, ACT-SUBCOMMITTEE | UC-EVT-01 | EVT | 4 | SM-EVENT-01 | TR-017 | AD-EVT-02 | Event, EventTargetTeam, EventTargetPerson op:1 | DIRECT |
| REQ-EVT-003 | Que el club pueda registrar su calendario de partidos. | ACT-COACH, ACT-SUBCOMMITTEE | UC-EVT-02 | EVT | 4 | SM-EVENT-01 | — | AD-EVT-02 | Event, EventTargetTeam op:1 | DIRECT |
| REQ-EVT-004 | Que el club puedaJd convocar a actividades que no son entrenar ni jugar (reuniones,.tasks… | ACT-COACH, ACT-SUBCOMMITTEE | UC-EVT-03 | EVT | 3 | SM-EVENT-01 | — | AD-EVT-02 | Event, EventTargetTeam, EventTargetPerson op:1 | DIRECT |
| REQ-EVT-005 | Que un unwelcome evento para varias categorías no requiera crear un evento por categoría. | — | UC-EVT-01, UC-EVT-02, UC-EVT-03, UC-EVT-13 | EVT | 2 | SM-EVENT-01, SM-EVENTSERIES-01 | TR-017, TR-031 | AD-EVT-02 | Event, EventTargetTeam, EventTargetPerson op:1 | SUPPORTING |
| REQ-EVT-006 | Que un partido no cambie de equipo una vez programado, para no invalidar lo ya registrado. | — | UC-EVT-02, UC-EVT-04 | EVT | 2 | SM-EVENT-01 | — | AD-EVT-02, AD-EVT-01 | Event op:2 | SUPPORTING |
| REQ-EVT-007 | Que el estado de un evento sea siempre derivable y no ambiguo. | ACT-COACH, ACT-SUBCOMMITTEE | UC-EVT-05, UC-EVT-06, UC-EVT-07, UC-EVT-08, UC-EVT-09, UC-EVT-10 | EVT | 5 | SM-EVENT-01 | TR-018, TR-019, TR-020, TR-021, TR-022 (+3) | AD-EVT-03, AD-PRT-04 | Event op:1 | DIRECT |
| REQ-EVT-008 | Que un evento cancelado no se vea igual que uno vivo ni ofrezca acciones que ya no tienen… | ACT-AUTHENTICATED | UC-EVT-07, UC-EVT-09, UC-EVT-10, UC-EVT-19 | EVT | 3 | SM-EVENT-01 | TR-020, TR-021, TR-024, TR-025 | AD-EVT-03, AD-PRT-04 | Event op:2 | SUPPORTING |
| REQ-EVT-009 | Que la programación de un evento sea una decisión única y coherente. | ACT-COACH, ACT-SUBCOMMITTEE | UC-EVT-01, UC-EVT-02, UC-EVT-03 | EVT | 3 | SM-EVENT-01 | TR-017 | AD-EVT-02 | Event op:1 | SUPPORTING |
| REQ-EVT-010 | Que una corrección de redacción no obligue a reconfirmar a todo el equipo. | ACT-COACH, ACT-SUBCOMMITTEE | UC-EVT-04 | EVT | 2 | SM-EVENT-01 | TR-026, TR-028, TR-029 | AD-EVT-01 | Event op:1 | DIRECT |
| REQ-EVT-011 | Que el sistema sepa qué cambios obligan a volver a coordinar a la gente. | ACT-CAPTAIN, ACT-COACH, ACT-SUBCOMMITTEE | UC-EVT-04, UC-EVT-05, UC-EVT-07, UC-EVT-08, UC-EVT-16 | EVT | 4 | SM-EVENT-01, SM-VENUE-01 | TR-018, TR-020, TR-021, TR-022, TR-027 (+1) | AD-EVT-01, AD-EVT-03 | Event op:3 | DIRECT |
| REQ-EVT-012 | Que nadie coordine a un equipo a ciegas. | ACT-COACH, ACT-SUBCOMMITTEE | UC-EVT-11 | EVT | 4 | SM-EVENT-01 | TR-027 | AD-EVT-01 | Event op:2 | DIRECT |
| REQ-EVT-013 | Que dos personas que editan lo mismo no pierdan trabajo ni se pisen sin avisar. | ACT-ADMIN, ACT-COACH, ACT-SUBCOMMITTEE | UC-EVT-12 | EVT | 3 | SM-EVENT-01 | TR-030 | AD-EVT-01 | Event op:1 | DIRECT |
| REQ-EVT-014 | Que las series de eventos (entrenamientos semanales, liga) sean una entidad y no una supo… | ACT-COACH, ACT-SUBCOMMITTEE | UC-EVT-13 | EVT | 2 | SM-EVENT-01, SM-EVENTSERIES-01 | TR-031 | — | EventSeries op:1 | DIRECT |
| REQ-EVT-015 | Que cambiar un entrenamiento de la semana no modifique toda la temporada por accidente. | ACT-COACH, ACT-SUBCOMMITTEE | UC-EVT-04 | EVT | 5 | SM-EVENT-01, SM-EVENTSERIES-01 | TR-027, TR-033 | AD-EVT-01 | EventSeries, EventOccurrenceOverride op:1 | SUPPORTING |
| REQ-EVT-016 | Que las series tengan un cierre explícito y un límite de protección. | ACT-COACH, ACT-SUBCOMMITTEE | UC-EVT-14 | EVT | 2 | SM-EVENT-01, SM-EVENTSERIES-01 | TR-031, TR-032 | — | EventSeries op:1 | DIRECT |
| REQ-EVT-017 | Que la participación en un evento se resuelva desde el propio evento. | ACT-COACH, ACT-GUARDIAN, ACT-PLAYER, ACT-SUBCOMMITTEE | UC-EVT-19, UC-PRT-01, UC-PRT-02, UC-PRT-05, UC-PRT-08 | EVT, PRT | 4 | SM-ATTENDANCEENTRY-01, SM-AVAILABILITY-01, SM-EVENT-01 (+1) | — | AD-PRT-01, AD-PRT-02, AD-PRT-03, AD-PRT-04 | — | SUPPORTING |
| REQ-EVT-018 | Que el club pueda programar una jornada con varios partidos de una sola vez. | ACT-COACH, ACT-SUBCOMMITTEE | UC-EVT-15 | EVT | 5 | SM-EVENT-01 | — | AD-EVT-04 | Jornada op:4 | DIRECT |
| REQ-EVT-019 | Que la logística de una salida a partido no viva en mensajes sueltos. | ACT-CAPTAIN, ACT-COACH, ACT-SUBCOMMITTEE | UC-EVT-16 | EVT | 3 | SM-EVENT-01 | — | AD-EVT-01 | EventLogistics op:3 | DIRECT |
| REQ-EVT-020 | Que el calendario sea consultable y compartible sin perderse el contexto. | ACT-AUTHENTICATED | UC-EVT-17 | EVT | 3 | SM-EVENT-01 | — | — | — | DIRECT |
| REQ-EVT-021 | Que la primera pantalla del producto responda "¿qué tengo que hacer?". | ACT-AUTHENTICATED | UC-EVT-18 | EVT | 3 | SM-EVENT-01 | — | — | — | DIRECT |
| REQ-EVT-022 | Que la persona no reciba dos verdades sobre el mismo evento. | ACT-AUTHENTICATED | UC-EVT-17, UC-EVT-18, UC-EVT-19 | EVT | 2 | SM-EVENT-01 | — | — | — | SUPPORTING |
| REQ-EVT-023 | Que el evento sea la unidad de consulta del producto. | ACT-AUTHENTICATED | UC-EVT-19 | EVT | 3 | SM-EVENT-01 | — | — | — | DIRECT |
| REQ-EVT-024 | Que el cierre de una competencia con inscripciones activas no deje partidos sin respaldo. | ACT-ADMIN, ACT-SUBCOMMITTEE | UC-CMP-07, UC-EVT-15 | CMP, EVT | 2 | SM-COMPETITION-01, SM-COMPETITIONENTRY-01, SM-EVENT-01 (+1) | TR-016, TR-062, TR-065, TR-066 | AD-CMP-01, AD-EVT-04 | Jornada op:1 | SUPPORTING |
| REQ-IAM-001 | Permitir que cada persona con cuentaClub entre al sistema sin pedir ayuda. | ACT-AUTHENTICATED, ACT-UNAUTHENTICATED | UC-IAM-01 | IAM | 3 | SM-ACCOUNT-01 | — | AD-IAM-01 | Account op:2 | DIRECT |
| REQ-IAM-002 | Controlar el acceso al club y poder suspenderlo sin borrar información. | ACT-ADMIN | UC-IAM-02, UC-IAM-03, UC-IAM-04 | IAM | 3 | SM-ACCOUNT-01 | TR-002, TR-003 | AD-IAM-02 | Account op:3 | DIRECT |
| REQ-IAM-003 | Permitir que una persona nueva tenga su primera contraseña sin que nadie más la conozca. | ACT-ADMIN, ACT-UNAUTHENTICATED | UC-IAM-03, UC-IAM-04 | IAM | 4 | SM-ACCOUNT-01 | TR-001, TR-002 | AD-IAM-02 | Account op:3 | DIRECT |
| REQ-IAM-004 | Resolver una pérdida de acceso sin que el club quede sin administración. | ACT-ADMIN | UC-IAM-05 | IAM | 2 | SM-ACCOUNT-01 | TR-004 | AD-IAM-02 | op:2 | DIRECT |
| REQ-IAM-005 | Permitir rotar la credencial sin intervención administrativa. | ACT-AUTHENTICATED | UC-IAM-06 | IAM | 3 | SM-ACCOUNT-01 | — | — | Account op:3 | DIRECT |
| REQ-IAM-006 | Que un token capturado en el navegador no sirva para actuar en el sistema. | — | — | — | 3 | SM-ACCOUNT-01 | — | — | op:1 | MODELLED |
| REQ-IAM-007 | Impedir que un tercero haga actuar al usuario con su sesión. | — | — | — | 2 | SM-ACCOUNT-01 | — | — | op:1 | MODELLED |
| REQ-IAM-008 | Que las sesiones unattended no queden abiertas indefinidamente. | — | — | — | 3 | SM-ACCOUNT-01 | — | — | — | MODELLED |
| REQ-IAM-009 | Que una sesión dejada abierta no habilite por sí sola operaciones destructivas o de alto … | ACT-ADMIN, ACT-SUBCOMMITTEE | UC-IAM-09 | IAM | 3 | SM-ACCOUNT-01 | — | AD-CMP-01, AD-IAM-02, AD-PPL-01, AD-PPL-02 | — | DIRECT |
| REQ-IAM-010 | Detectar y cortar accesos no reconocidos. | ACT-AUTHENTICATED | UC-IAM-07, UC-IAM-08 | IAM | 3 | SM-ACCOUNT-01 | — | — | op:1 | DIRECT |
| REQ-IAM-011 | Que cerrar sesión en una pestaña cierre también el acceso de las demás. | — | — | — | 2 | SM-ACCOUNT-01 | — | — | — | MODELLED |
| REQ-IAM-012 | Que una cuenta sin permisos no entre a un producto inerte ni reciba datos. | ACT-AUTHENTICATED, ACT-GUARDIAN | UC-IAM-01 | IAM | 3 | SM-ACCOUNT-01 | — | AD-IAM-01 | — | SUPPORTING |
| REQ-IAM-013 | Impedir que el club quede sin nadie que pueda administrar cuentas, estructura y accesos. | ACT-ADMIN | UC-IAM-02, UC-IAM-05, UC-IAM-09, UC-PPL-10 | IAM, PPL | 2 | SM-ACCOUNT-01 | TR-003, TR-004 | AD-IAM-02, AD-CMP-01, AD-PPL-01, AD-PPL-02 | Account, RoleAssignment op:2 | SUPPORTING |
| REQ-IAM-014 | Que la identidad de acceso no dependa de la afiliación deportiva ni cambie con ella. | ACT-ADMIN | UC-IAM-03, UC-PPL-03 | IAM, PPL | 3 | SM-ACCOUNT-01 | — | AD-IAM-02, AD-PPL-01 | Account | SUPPORTING |
| REQ-IAM-015 | Permitir contraseñas fuertes yTlanas de usar sin reglas arbitrarias. | — | — | — | 4 | SM-ACCOUNT-01 | TR-004 | — | — | MODELLED |
| REQ-IAM-016 | Que ninguna acción sea posible por omisión. | — | 102 CU (transversal, ref. colectiva E3) | CMP, COM, EVT, IAM (+4) | 3 | — | — | AD-CMP-01, AD-COM-01, AD-EVT-02, AD-EVT-01 (+10) | — | CROSS_CUTTING |
| REQ-IAM-017 | Que la interfaz no ofrezca ni calle acciones por su cuenta y que dos superficies no discr… | — | 102 CU (transversal, ref. colectiva E3) | CMP, COM, EVT, IAM (+4) | 3 | — | — | AD-CMP-01, AD-COM-01, AD-EVT-02, AD-EVT-01 (+10) | — | CROSS_CUTTING |
| REQ-IAM-018 | Evitar que el control de acceso se desincronice entre superficies. | — | — | — | 2 | — | — | — | — | CONSTRAINT_DOCUMENTED |
| REQ-IAM-019 | Frenar ataques de fuerza bruta y abuso sin confiar en una instancia única. | — | — | — | 2 | SM-ACCOUNT-01 | — | — | — | MODELLED |
| REQ-IAM-020 | Que un corte de sesión no cause pérdida de datos ni un falso éxito. | ACT-AUTHENTICATED | UC-IAM-10 | IAM | 2 | SM-ACCOUNT-01 | — | — | — | DIRECT |
| REQ-INS-001 | Que el club encuentre una persona o un evento sin navegar la jerarquía. | ACT-AUTHENTICATED | UC-INS-01 | INS | 3 | — | — | — | — | DIRECT |
| REQ-INS-002 | Que buscar no se convierta en una vía para ver PII. | ACT-AUTHENTICATED | UC-INS-01 | INS | 2 | — | — | — | — | SUPPORTING |
| REQ-INS-003 | Que una búsqueda se pueda compartir y no se pierda al navegar. | ACT-AUTHENTICATED | UC-INS-01 | INS | 2 | — | — | — | — | SUPPORTING |
| REQ-INS-004 | Que el club pueda ver la asistencia real sin recalcularla a mano. | ACT-ADMIN, ACT-CAPTAIN, ACT-COACH, ACT-PLAYER (+1) | UC-INS-02 | INS | 5 | — | — | — | — | DIRECT |
| REQ-INS-005 | Que el rendimiento se mida sobre lo registrado y sea trazable al partido. | ACT-ADMIN, ACT-CAPTAIN, ACT-COACH, ACT-PLAYER (+1) | UC-INS-03 | INS | 3 | SM-MATCHRECORD-01 | — | — | PlayerMatchStats | DIRECT |
| REQ-INS-006 | Que un informe no muestre más de lo que el actor puede ver ni una período no solicitada. | ACT-AUTHENTICATED | UC-INS-02, UC-INS-03 | INS | 3 | — | — | — | — | SUPPORTING |
| REQ-INS-007 | Que un informe sea el comienzo de una decisión y no un callejón. | ACT-COACH, ACT-SUBCOMMITTEE | UC-INS-02, UC-INS-03 | INS | 2 | — | — | — | — | SUPPORTING |
| REQ-INS-008 | Que el club pueda reconstruir quién cambió qué. | ACT-ADMIN | UC-INS-05 | INS | 3 | — | — | — | AuditEntry op:1 | DIRECT |
| REQ-INS-009 | Que el registro de cambios sirva para comprender y no sólo para contar. | ACT-ADMIN | UC-INS-05 | INS | 3 | SM-ELIGIBILITY-01 | TR-048 | — | AuditEntry op:1 | DIRECT |
| REQ-INS-010 | Que el registro sea creíble precisamente porque no se puede arreglar. | — | — | — | 2 | — | — | — | AuditEntry op:1 | CONSTRAINT_DOCUMENTED |
| REQ-INS-011 | Que la historia exista para quien la necesita y no sólo en la base de datos. | ACT-AUTHENTICATED | UC-INS-04 | INS | 5 | SM-ATTENDANCEENTRY-01, SM-MATCHRECORD-01, SM-MESSAGE-01 | TR-040, TR-043, TR-047, TR-053, TR-058 | — | AuditEntry | DIRECT |
| REQ-INS-012 | Que la historia sea un hecho derivado y no un almacén paralelo que puede divergir. | — | — | — | 2 | — | — | — | — | CONSTRAINT_DOCUMENTED |
| REQ-PPL-001 | Identificar a las personas del club sin exigir de más en el alta. | ACT-ADMIN | UC-PPL-01 | PPL | 3 | — | — | AD-PPL-01 | Person op:1 | DIRECT |
| REQ-PPL-002 | Que el club no NTTenga jugadoras sin datos de contacto o identificación necessários para … | ACT-ADMIN, ACT-PLAYER | UC-PPL-02, UC-PPL-15 | PPL | 2 | — | — | AD-PPL-02 | Person op:2 | DIRECT |
| REQ-PPL-003 | Que la identidad de acceso y la identidad civil no se separen. | ACT-ADMIN | UC-PPL-03 | PPL | 2 | — | — | AD-PPL-01 | Account op:1 | DIRECT |
| REQ-PPL-004 | Distinguir "es del club" de "está en este equipo", que son cosas distintas. | ACT-ADMIN | UC-PPL-04, UC-PPL-05 | PPL | 4 | SM-CONVERSATION-GROUP-01 | — | AD-PPL-01 | Membership op:3 | DIRECT |
| REQ-PPL-005 | Poder responder "¿a qué equipo/azzona juega?" sin inferirlo de un rol. | ACT-ADMIN | UC-PPL-06, UC-PPL-07 | PPL | 2 | — | — | AD-PPL-02 | TeamAssignment op:1 | DIRECT |
| REQ-PPL-006 | Que la autoridad de una persona sea la unión de sus asignaciones vigentes y no un único c… | ACT-ADMIN | UC-PPL-09, UC-PPL-10 | PPL | 3 | — | — | — | RoleAssignment op:2 | DIRECT |
| REQ-PPL-007 | Que una jugadora nunca quede con afiliacion sin rol ni con rol sin afiliacion al cambiar … | ACT-ADMIN, ACT-CAPTAIN | UC-PPL-06, UC-PPL-07, UC-PPL-08, UC-PPL-10 | PPL | 3 | — | — | AD-PPL-02 | TeamAssignment op:1 | DIRECT |
| REQ-PPL-008 | Que un adulto responsable pueda cumplir la gestión del menor sin convertirse en un rol de… | ACT-ADMIN, ACT-GUARDIAN | UC-PPL-11, UC-PPL-12 | PPL | 4 | — | — | — | GuardianRelationship op:4 | DIRECT |
| REQ-PPL-009 | Que la delegación sirva para operar sin abrir PII sensible del menor. | ACT-GUARDIAN | UC-PPL-13 | PPL | 3 | — | — | — | GuardianRelationship op:1 | DIRECT |
| REQ-PPL-010 | Que el menor conozca quién actúa en su nombre. | ACT-PLAYER | UC-PPL-14 | PPL | 2 | — | — | — | RoleAssignment op:1 | DIRECT |
| REQ-PPL-011 | Que ningún dato sensible se exponga por pertenencia a un grupo. | — | 102 CU (transversal, ref. colectiva E3) | CMP, COM, EVT, IAM (+4) | 4 | — | — | AD-CMP-01, AD-COM-01, AD-EVT-02, AD-EVT-01 (+10) | Person, GuardianRelationship | CROSS_CUTTING |
| REQ-PPL-012 | Que "tutor" no se convierta de hecho en un séptimo rol. | ACT-GUARDIAN | UC-COM-06, UC-PPL-11, UC-PPL-12, UC-PRT-01 | COM, PPL, PRT | 2 | SM-AVAILABILITY-01 | — | AD-PRT-01 | — | SUPPORTING |
| REQ-PPL-013 | Que la jugadera no quede bloqueada sin salida y sin saber qué hacer. | ACT-ADMIN, ACT-PLAYER | UC-PPL-15 | PPL | 3 | — | — | — | op:1 | DIRECT |
| REQ-PPL-014 | Que el mismo equipo no cambie de nombre bajo los pies de la historia ya registrada. | ACT-ADMIN | UC-STR-04, UC-STR-07, UC-STR-09, UC-STR-10 | STR | 2 | SM-DIVISION-01, SM-LINE-01, SM-TEAM-01 | TR-009, TR-012 | — | Team op:2 | SUPPORTING |
| REQ-PPL-015 | Que "eliminar jugadora" no sea una operación que borre el pasado del club. | ACT-ADMIN | UC-PPL-05, UC-PPL-08, UC-PPL-10, UC-PPL-12, UC-STR-05 | PPL, STR | 2 | SM-ANNOUNCEMENT-01, SM-COMPETITION-01, SM-COMPETITIONENTRY-01 (+7) | TR-032, TR-054, TR-059, TR-062, TR-066 | AD-PPL-02 | Membership, TeamAssignment op:2 | SUPPORTING |
| REQ-PPL-016 | Que cada persona comprenda qué puede hacer, con qué cuenta entra y a quién mira. | ACT-AUTHENTICATED, ACT-GUARDIAN | UC-PPL-16, UC-PPL-17 | PPL | 4 | — | — | — | — | DIRECT |
| REQ-PRT-001 | Que el club sepa con Who's Quién se cuenta antes de una sesión o un partido. | ACT-CAPTAIN, ACT-PLAYER | UC-PRT-01 | PRT | 3 | SM-AVAILABILITY-01, SM-EVENT-01 | TR-034, TR-035 | AD-PRT-01 | Availability op:2 | DIRECT |
| REQ-PRT-002 | Que la disponibilidad de las menores no dependa de que la menor tenga cuenta propia. | ACT-GUARDIAN | UC-PRT-01 | PRT | 3 | SM-AVAILABILITY-01, SM-EVENT-01 | TR-034 | AD-PRT-01 | Availability op:2 | DIRECT |
| REQ-PRT-003 | Distinguir "no han contestado" de "contestaron antes de que cambiara todo". | — | UC-EVT-18, UC-PRT-01, UC-PRT-04 | EVT, PRT | 4 | SM-AVAILABILITY-01, SM-EVENT-01 | TR-027, TR-037, TR-038 | AD-PRT-01, AD-PRT-02 | Availability op:1 | SUPPORTING |
| REQ-PRT-004 | Que no se pida a la gente confirmar disponibilidad de algo que no tiene fecha. | ACT-GUARDIAN, ACT-PLAYER | UC-EVT-06, UC-EVT-08, UC-PRT-01 | EVT, PRT | 3 | SM-AVAILABILITY-01, SM-EVENT-01 | TR-018, TR-019, TR-020, TR-021, TR-022 (+1) | AD-EVT-03, AD-PRT-01 | Event, Availability op:1 | SUPPORTING |
| REQ-PRT-005 | Que la lista de convocadas sea un hecho consumable y auditable. | ACT-COACH | UC-INS-04, UC-PRT-02, UC-PRT-03 | INS, PRT | 4 | SM-EVENT-01, SM-SELECTIONREV-01 | TR-039, TR-040, TR-041 | AD-PRT-02 | Selection, SelectionRevision, SelectionEntry op:3 | DIRECT |
| REQ-PRT-006 | Que la decision de publicar sea del entrenador informado, no un bloqueo automatico del si… | ACT-COACH | UC-PRT-03, UC-PRT-04 | PRT | 3 | SM-EVENT-01, SM-SELECTIONREV-01 | TR-040, TR-041 | AD-PRT-02 | SelectionRevision op:1 | SUPPORTING |
| REQ-PRT-007 | Que el entrenador sepa, sin relectura manual, qué de lo publicado ya no coincide con la r… | ACT-COACH | UC-PRT-04 | PRT | 3 | SM-EVENT-01 | — | AD-PRT-02 | — | DIRECT |
| REQ-PRT-008 | Que una convocatoria larga no se pierda por un corte o un refresco. | ACT-COACH | UC-PRT-02, UC-PRT-03 | PRT | 4 | SM-EVENT-01, SM-SELECTIONREV-01 | TR-039 | AD-PRT-02 | Selection, SelectionRevision op:2 | SUPPORTING |
| REQ-PRT-009 | Que quede registrado quién estuvo realmente. | ACT-COACH | UC-PRT-05 | PRT | 4 | SM-ATTENDANCEENTRY-01, SM-EVENT-01 | TR-042 | AD-PRT-03 | AttendanceSheet, AttendanceEntry op:4 | DIRECT |
| REQ-PRT-010 | Que el informe de asistencia no invente ausencias. | — | UC-INS-02, UC-PRT-05 | INS, PRT | 3 | SM-ATTENDANCEENTRY-01, SM-EVENT-01 | TR-042 | AD-PRT-03 | AttendanceSheet, AttendanceEntry op:1 | SUPPORTING |
| REQ-PRT-011 | Que quede constancia de cuándo los datos de presencia quedaron cerrados. | ACT-COACH | UC-PRT-06 | PRT | 2 | SM-ATTENDANCEENTRY-01, SM-EVENT-01 | TR-044 | AD-PRT-03 | AttendanceSheet op:1 | DIRECT |
| REQ-PRT-012 | Que un error de registro se pueda arreglar sin perder la traza del error. | ACT-COACH | UC-PRT-07 | PRT | 3 | SM-ATTENDANCEENTRY-01, SM-EVENT-01 | TR-043 | AD-PRT-03 | AttendanceEntry op:2 | DIRECT |
| REQ-PRT-013 | Que el resultado oficial de un partido quede registrado como tal. | ACT-COACH | UC-PRT-08, UC-PRT-09 | PRT | 3 | SM-EVENT-01, SM-MATCHRECORD-01 | TR-024, TR-045, TR-046 | AD-PRT-04 | MatchRecord op:2 | DIRECT |
| REQ-PRT-014 | Que un resultado corregido no borre el resultado que se publicó. | ACT-COACH | UC-PRT-10 | PRT | 2 | SM-EVENT-01, SM-MATCHRECORD-01 | TR-047 | AD-PRT-04 | MatchRecord op:1 | DIRECT |
| REQ-PRT-015 | Que el resultado y el evento no puedan contar historias distintas. | — | UC-EVT-09, UC-EVT-10, UC-PRT-08, UC-PRT-09 | EVT, PRT | 3 | SM-EVENT-01, SM-MATCHRECORD-01 | TR-024, TR-025, TR-045, TR-046 | AD-PRT-04 | MatchRecord op:3 | SUPPORTING |
| REQ-PRT-016 | Que el rendimiento se mida sobre participación real registrada. | ACT-COACH | UC-INS-03, UC-PRT-11 | INS, PRT | 3 | SM-EVENT-01, SM-MATCHRECORD-01 | TR-025, TR-046 | — | PlayerMatchStats op:3 | DIRECT |
| REQ-PRT-017 | Que la condición de poder jugar sea un dato administrable con su fundamento, no una etiqu… | ACT-ADMIN, ACT-COACH, ACT-SUBCOMMITTEE | UC-PRT-12, UC-PRT-13 | PRT | 5 | SM-ELIGIBILITY-01, SM-EVENT-01, SM-SELECTIONREV-01 | TR-048, TR-049, TR-050 | — | EligibilityConstraint op:2 | DIRECT |
| REQ-PRT-018 | Que "noví" en tres sitios no se mezcle con un solo dato mal interpretado. | — | UC-PRT-01, UC-PRT-02, UC-PRT-03, UC-PRT-04, UC-PRT-05, UC-PRT-06 (+7) | PRT | 3 | SM-AVAILABILITY-01, SM-EVENT-01, SM-SELECTIONREV-01 | — | AD-PRT-01, AD-PRT-02, AD-PRT-03, AD-PRT-04 | — | CROSS_CUTTING |
| REQ-PRT-019 | Que no se ofrezca participación que no aplica al tipo de evento. | — | UC-PRT-01, UC-PRT-05, UC-PRT-08 | PRT | 3 | SM-ATTENDANCEENTRY-01, SM-AVAILABILITY-01, SM-EVENT-01 (+1) | TR-042, TR-045 | AD-PRT-01, AD-PRT-03, AD-PRT-04 | — | SUPPORTING |
| REQ-STR-001 | Que la organización del club por temporada quede registrada y sea consultable en el futur… | ACT-ADMIN | UC-STR-01, UC-STR-02 | STR | 3 | — | — | — | Season op:2 | DIRECT |
| REQ-STR-002 | Que las divisiones del club (Primera, Quinta, Sexta…) sean estructura administrable. | ACT-ADMIN | UC-STR-03, UC-STR-04, UC-STR-05 | STR | 3 | SM-DIVISION-01 | TR-008, TR-009, TR-010 | — | Division op:3 | DIRECT |
| REQ-STR-003 | Que las líneas deportivas (A/B/C/Proyección) sean estructura administrable. | ACT-ADMIN | UC-STR-06, UC-STR-07, UC-STR-08 | STR | 3 | SM-LINE-01 | TR-011, TR-012, TR-013 | — | Line op:3 | DIRECT |
| REQ-STR-004 | Que la unidad sports defiliación y de eventos sea una entidad concreta y única por tempor… | ACT-ADMIN | UC-STR-09, UC-STR-10, UC-STR-11, UC-STR-12 | STR | 4 | SM-TEAM-01 | TR-005, TR-006, TR-007 | — | Team op:4 | DIRECT |
| REQ-STR-005 | Que los lugares donde se juega existan como datos reutilizables y no como texto libre. | ACT-ADMIN | UC-STR-13, UC-STR-14, UC-STR-15 | STR | 3 | SM-VENUE-01 | TR-014, TR-015, TR-016 | — | Venue op:2 | DIRECT |
| REQ-STR-006 | Que archivar no deje referencias colgando que rompan la historia. | ACT-ADMIN | UC-STR-05, UC-STR-08, UC-STR-12, UC-STR-15 | STR | 2 | SM-DIVISION-01, SM-LINE-01, SM-TEAM-01 (+1) | TR-007, TR-010, TR-013, TR-016 | — | Division, Line, Team, Venue op:4 | SUPPORTING |
| REQ-STR-007 | Que un horario de entrenamiento no se desplace por la zona horaria del servidor o del dis… | — | UC-EVT-17, UC-EVT-19 | EVT | 1 | — | — | — | — | SUPPORTING |
| REQ-STR-008 | Que la gestión de estructura sea una capacidad real y no una tarea que sólo el personal t… | ACT-ADMIN | UC-STR-01, UC-STR-02, UC-STR-03, UC-STR-04, UC-STR-05, UC-STR-06 (+9) | STR | 2 | SM-DIVISION-01, SM-LINE-01, SM-TEAM-01 (+1) | TR-005 | — | — | CROSS_CUTTING |
| REQ-STR-009 | Que la separación entre Subcomisión y Administración sea explícita y comprensible. | ACT-ADMIN, ACT-SUBCOMMITTEE | UC-STR-01, UC-STR-02, UC-STR-03, UC-STR-04, UC-STR-05, UC-STR-06 (+9) | STR | 2 | — | — | — | — | CROSS_CUTTING |
| REQ-STR-010 | Que "Línea A" no sea ambiguo entre divisiones ni entre temporadas. | ACT-AUTHENTICATED | UC-EVT-19, UC-INS-01, UC-PPL-16 | EVT, INS, PPL | 2 | SM-LINE-01, SM-TEAM-01 | TR-063, TR-064 | — | Line op:1 | SUPPORTING |
| REQ-STR-011 | Que renombrar una sede o una línea noreatribuya silenciosamente la historia de eventos y … | — | 102 CU (transversal, ref. colectiva E3) | CMP, COM, EVT, IAM (+4) | 2 | SM-DIVISION-01, SM-LINE-01, SM-TEAM-01 (+1) | — | AD-CMP-01, AD-COM-01, AD-EVT-02, AD-EVT-01 (+10) | Team, Venue op:1 | CROSS_CUTTING |
| REQ-STR-012 | Que corregir un nombre no genere reprogramaciones ni avisos, y que cambiar la sede de un … | ACT-ADMIN, ACT-COACH, ACT-SUBCOMMITTEE | UC-EVT-04, UC-EVT-16, UC-STR-14 | EVT, STR | 2 | SM-EVENT-01, SM-VENUE-01 | TR-015 | AD-EVT-01 | Venue op:1 | DIRECT |
| REQ-STR-013 | Que la estructura de referencia se pueda elegir sin memorizar nombres. | ACT-ADMIN | UC-COM-01, UC-EVT-01, UC-EVT-02 | COM, EVT | 1 | SM-ANNOUNCEMENT-01, SM-TEAM-01, SM-VENUE-01 | — | AD-COM-01, AD-EVT-02 | — | SUPPORTING |
| REQ-SYS-001 | Que se pueda usar el producto en la cancha, con una mano, sin perder información. | — | — | — | 4 | — | — | — | — | IMPLEMENTATION_PENDING |
| REQ-SYS-002 | Que registrar la asistencia de una persona no dependa de acertar un botón de 36 px. | — | — | — | 2 | — | — | — | — | CONSTRAINT_DOCUMENTED |
| REQ-SYS-003 | Que el producto sea operable sin ratón y comprensible con lector de pantalla. | — | — | — | 4 | — | — | — | — | IMPLEMENTATION_PENDING |
| REQ-SYS-004 | Que la animación informe y no moleste. | — | — | — | 2 | — | — | — | — | CONSTRAINT_DOCUMENTED |
| REQ-SYS-005 | Que el estado de un evento, una respuesta o una habilitación no dependa de la percepción … | — | — | — | 3 | — | — | — | — | CONSTRAINT_DOCUMENTED |
| REQ-SYS-006 | Que una jugadora nueva entienda el producto sin aprender el modelo. | — | — | — | 3 | SM-ANNOUNCEMENT-01 | TR-043, TR-047 | — | — | MODELLED |
| REQ-SYS-007 | Que el usuario sepa qué hacer sin leer todas las opciones. | — | — | — | 3 | SM-ANNOUNCEMENT-01 | TR-059 | — | — | MODELLED |
| REQ-SYS-008 | Que la pantalla no presente todo con el mismo peso. | — | — | — | 2 | — | — | — | — | CONSTRAINT_DOCUMENTED |
| REQ-SYS-009 | Que el club nunca confíe en un "listo" que no ocurrió. | — | — | — | 3 | SM-ACCOUNT-01 | — | — | — | MODELLED |
| REQ-SYS-010 | Que un error de validación no cueste el trabajo hecho. | — | — | — | 3 | SM-ACCOUNT-01 | TR-030 | — | — | MODELLED |
| REQ-SYS-011 | Que "0 %" nunca signifique "no hay dato". | — | — | — | 4 | — | — | — | — | CONSTRAINT_DOCUMENTED |
| REQ-SYS-012 | Que la interfaz diga la verdad sobre lo que se puede y lo que no se puede hacer, y por qu… | ACT-AUTHENTICATED | 102 CU (transversal, ref. colectiva E3) | CMP, COM, EVT, IAM (+4) | 3 | SM-ANNOUNCEMENT-01 | — | AD-CMP-01, AD-COM-01, AD-EVT-02, AD-EVT-01 (+10) | — | CROSS_CUTTING |
| REQ-SYS-013 | Que el producto sea navegable y compartible. | — | — | — | 3 | — | — | — | — | CONSTRAINT_DOCUMENTED |
| REQ-SYS-014 | Que la persona nunca reciba dos versiones del mismo hecho. | — | — | — | 3 | — | — | — | — | CONSTRAINT_DOCUMENTED |
| REQ-SYS-015 | Que la interfaz diga siempre la verdad sobre el estado del club. | — | — | — | 3 | — | — | — | — | CONSTRAINT_DOCUMENTED |
| REQ-SYS-016 | Que un corte de red no produzca dos avisos ni una doble convocatoria. | — | — | — | 3 | SM-ACCOUNT-01, SM-CONVERSATION-GROUP-01, SM-MESSAGE-01 | — | — | — | MODELLED |
| REQ-SYS-017 | Que dos personas no se pisen sin avisarse. | — | — | — | 2 | — | TR-030 | — | — | MODELLED |
| REQ-SYS-018 | Que no existan estados intermedios que el usuario pueda observar como definitivos. | — | — | — | 2 | SM-COMPETITIONENTRY-01, SM-SELECTIONREV-01 | TR-017, TR-066 | — | — | MODELLED |
| REQ-SYS-019 | Que no existan dos verdades para el mismo hecho. | — | — | — | 2 | — | — | — | — | CONSTRAINT_DOCUMENTED |
| REQ-SYS-020 | Que un registro técnico no se convierta en una segunda copia de la PII. | — | — | — | 2 | — | — | — | — | CONSTRAINT_DOCUMENTED |
| REQ-SYS-021 | Que el producto sirva sin exponer datos. | — | — | — | 3 | — | — | — | — | CONSTRAINT_DOCUMENTED |
| REQ-SYS-022 | Que el club no pierda la operación de la temporada por una falla. | — | — | — | 3 | — | — | — | — | IMPLEMENTATION_PENDING |
| REQ-SYS-023 | Que el club no espere para ver la asistencia de un equipo. | — | — | — | 2 | — | — | — | — | IMPLEMENTATION_PENDING |
| REQ-SYS-024 | Que un aviso de reprogramación llegue antes de que la jugadora salga de casa. | — | — | — | 2 | — | — | — | — | IMPLEMENTATION_PENDING |
| REQ-SYS-025 | Que un fallo en el envío de una notificación no pueda deshacer un cambio confirmado ni ha… | — | — | — | 4 | — | — | — | — | CONSTRAINT_DOCUMENTED |
| REQ-SYS-026 | Que actualizar el sistema no rompa la operación del club. | — | — | — | 2 | — | — | — | — | CONSTRAINT_DOCUMENTED |
| REQ-SYS-027 | Que la conformidad legal no se confunda con haber cerrado los controles técnicos. | — | — | — | 2 | — | — | — | — | DEFERRED_BY_AUTHORITY |

## Cobertura agregada

| Métrica | Valor |
|---|---|
| REQ IN clasificados con destino | 157/157 |
| REQ funcionales | 122 = 71 DIRECT + 43 SUPPORTING + 8 CROSS_CUTTING |
| REQ no funcionales | 35 = 13 MODELLED + 16 CONSTRAINT_DOCUMENTED + 5 IMPLEMENTATION_PENDING + 1 DEFERRED_BY_AUTHORITY |
| CU trazados (≥1 arista REQ) | 102/102 |
| AC contabilizados | 454/454 (418 con CU + 36 transversales/N.A. justificados) |
| Transiciones E6 respaldadas | 65/65 (66 filas de matriz = 65 reales + TR-036 ausencia documentada) |
| CU evaluados en actividades | 102/102 (40 DIRECT + 5 COMPOSITE + 57 SIMPLE_NOT_SELECTED justificados) |
| Clases E8 justificadas | 37/37 |

**Notas de cobertura.** (1) Un `CROSS_CUTTING` no implica aristas inventadas: la matriz E3 declara la referencia colectiva y el ledger la registra con esa única evidencia. (2) `UNMAPPED` = 0 en REQ funcionales. (3) Los REQ NF no se fuerzan a actor/CU: su destino es la clasificación NFR (§8 del contrato E9).