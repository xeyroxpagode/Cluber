# GEI HOCKEY MANAGEMENT SYSTEM
## UC SPECIFICATIONS — PRT (Participation) V1

**Etapa:** 5 — Especificaciones de TODOS los casos de uso
**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-07
**Rama:** `gei/e5-use-case-specifications-freeze-v1`
**Plantilla:** `GEI_USE_CASE_SPECIFICATION_STANDARD_V1.md`
**CU:** 13 — `UC-PRT-01` … `UC-PRT-13`

> `UC-PRT-07` y `UC-PRT-10` son **SIBLING** de cerrar asistencia y finalizar resultado
> respectivamente (E4 V1.0.1 EXT-02/EXT-03): sin arista, sin derivación interna.

---

## CASO DE USO: UC-PRT-01 · Responder mi disponibilidad

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a una jugadora decir si va o no va a un evento, y a un guardián hacerlo por su menor delegado, para que el equipo lo sepa. Es un mismo caso de uso con dos sujetos: la propia jugadora o el menor de la relación.
Actores:
- Actor principal: `ACT-PLAYER` (respuesta propia) · `ACT-GUARDIAN` (respuesta por un menor, mismo CU)
- Actores secundarios: `ACT-CAPTAIN` (sólo con `RoleAssignment PLAYER` vigente, invariante E2 §7.5) · `ACT-COACH` (observa el conteo)
Precondiciones:
- El evento está `SCHEDULED` y alcanza a la jugadora o al menor.
- La jugadora tiene `RoleAssignment PLAYER` vigente más `TeamAssignment` y `Membership` vigentes — o — existe `GuardianRelationship` vigente con `can_respond_availability` y el evento alcanza al menor.
Postcondiciones:
- Éxito: la respuesta `sí`, `quizás` o `no` queda registrada con fecha y visible en el conteo del equipo; una respuesta nueva sustituye la anterior.
- Rechazo: no queda ninguna respuesta nueva; la anterior, si existía, se conserva.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. La jugadora consulta un evento con horario vigente que la alcanza y para el que todavía no respondió.
2. GEI valida la autoridad: `RoleAssignment PLAYER` vigente con `TeamAssignment` y `Membership` vigentes.
3. La jugadora informa su respuesta: `sí`, `quizás` o `no`.
4. GEI registra la respuesta con fecha y la deja visible en el conteo del evento.

Camino alternativo:
2.1. Si quien responde es un guardián con `GuardianRelationship` vigente y `can_respond_availability`, GEI aplica la respuesta al menor de esa relación: el mismo caso de uso con sujeto `CHILD`, registrado a nombre del menor y visible por el equipo como del menor. La operación termina con éxito.
2.2. Si el evento está `POSTPONED`, GEI no acepta una respuesta nueva y explica que las respuestas previas se conservan.
2.3. Si el evento no alcanza al menor de la relación, GEI rechaza la operación.
2.4. Si el guardián no tiene `can_respond_availability` vigente, GEI deniega la operación.
2.5. Si el actor tiene un rol sin `RoleAssignment PLAYER` vigente, GEI deniega la operación: ni la capitana por sí sola ni ningún otro rol responden por sí mismos.
4.1. Si la jugadora o el guardián cambia la respuesta, GEI sustituye la anterior: queda vigente la última.
4.2. Si se responde de nuevo después de un cambio de coordinación, la respuesta deja de estar «necesita confirmación».

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-PRT-001` (P) · `REQ-PRT-002` (P) · `REQ-PRT-004` (P) · `REQ-PRT-003` (S) · `REQ-PRT-018` (S) · `REQ-PRT-019` (S) · `REQ-COM-017` (S) · `REQ-EVT-017` (S) · `REQ-PPL-012` (S)
- Authority source: `RoleAssignment PLAYER` + `TeamAssignment` + `Membership` — o — `GuardianRelationship.can_respond_availability`
- Scope: `TEAM` (propia) · `CHILD` (delegada)
- Business rules: `REQ-PRT-003` — sin respuesta ≠ «no voy»; tras cambio de coordinación la respuesta previa pasa a «necesita confirmación» · `REQ-PRT-018` — disponibilidad, convocatoria, asistencia y habilitación no se derivan entre sí · `REQ-COM-017` — responder no genera notificación · `REQ-PRT-019` — matriz de aplicabilidad por tipo
- Estado / objeto afectado: `Availability` propia o del menor registrada; una respuesta nueva sustituye la anterior
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: **un solo CU para persona y guardián** (§21 del brief): cambia el sujeto y la authority source, no el objetivo. No existe «responder disponibilidad como Guardian». `ACT-CAPTAIN` responde sólo con `PLAYER` vigente (E2 §7.5).

---

## CASO DE USO: UC-PRT-02 · Preparar la convocatoria de un partido

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un entrenador armar la lista de quién está convocado para un partido, en un borrador editable con guardado automático, sin que eso todavía obligue a nadie.
Actores:
- Actor principal: `ACT-COACH` (alcance `TEAM` o `EVENT`)
- Actores secundarios: —
Precondiciones:
- El evento está `SCHEDULED` y es de tipo `MATCH`.
- Rol `COACH` vigente con alcance sobre el evento.
Postcondiciones:
- Éxito: existe un borrador de convocatoria editable, con guardado automático y estado de guardado visible; el refresco de fondo no pisa lo escrito.
- Rechazo: la operación no aplica; no se crea ningún borrador.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El entrenador inicia la preparación de la convocatoria de un partido.
2. GEI valida la autoridad y que el evento está `SCHEDULED` y es `MATCH`.
3. El entrenador arma la lista de convocadas sobre el borrador.
4. GEI guarda automáticamente los cambios del borrador y presenta el estado de guardado.
5. El entrenador queda con el borrador listo para publicar en `UC-PRT-03`.

Camino alternativo:
2.1. Si el evento no está `SCHEDULED` o no es de tipo `MATCH`, la convocatoria no aplica: GEI lo comunica (matriz de aplicabilidad por tipo).
2.2. Si el actor no tiene alcance sobre el evento, GEI deniega la operación.
4.1. Si el guardado automático falla, GEI reintenta y nunca informa éxito falso: el estado de guardado refleja el estado real.
4.2. Si un refresco de fondo llega mientras el entrenador escribe, GEI no pisa lo escrito.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-PRT-005` (P) · `REQ-PRT-008` (S) · `REQ-EVT-017` (S) · `REQ-SYS-018` (S)
- Authority source: `RoleAssignment COACH`
- Scope: `TEAM` / `EVENT`
- Business rules: `REQ-PRT-008` — cinco estados de guardado, una sóla operación en vuelo, el refresco de fondo no pisa lo escrito, nunca éxito falso
- Estado / objeto afectado: `Selection` en borrador editable
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: `UC-PRT-04` (revisar conflictos) es SIBLING de este CU (E4 EXT-04): la revisión se ofrece en la consulta, no dentro de la preparación. `RWS-07`: el CURRENT implementa 3 de los 5 estados de guardado; `DEF-SYS-003` pendiente.

---

## CASO DE USO: UC-PRT-03 · Publicar la convocatoria de un partido

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un entrenador hacer oficial quién está convocado, creando una revisión inmutable que no se puede reescribir después.
Actores:
- Actor principal: `ACT-COACH`
- Actores secundarios: `ACT-PLAYER`, `ACT-GUARDIAN` (reciben la notificación correspondiente)
Precondiciones:
- El evento está `SCHEDULED` y es `MATCH`.
- El borrador de convocatoria está completo.
- Rol `COACH` vigente con alcance sobre el evento.
Postcondiciones:
- Éxito: existe una revisión publicada inmutable de la convocatoria; las agregadas y las quitadas quedan notificadas, las que permanecen no; si hay conflictos derivados, la publicación prospera igual y el conflicto queda derivado y visible.
- Rechazo: no se publica ninguna revisión; el borrador se conserva.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El entrenador solicita publicar la convocatoria preparada.
2. GEI valida la autoridad y que el evento está `SCHEDULED`.
3. GEI espera lo que esté en vuelo del guardado automático, sin coreografía de guardado y publicación.
4. GEI publica la revisión inmutable de la convocatoria.
5. GEI notifica a las agregadas y a las quitadas con respecto a la revisión anterior; las que permanecen no reciben notificación.

Camino alternativo:
2.1. Si el evento no está `SCHEDULED`, GEI rechaza la publicación.
2.2. Si el actor no tiene alcance sobre el evento, GEI deniega la operación.
4.1. Si existe un conflicto de habilitación en alguna convocada, la publicación prospera igual: el conflicto queda derivado, visible, explicado en lenguaje de usuario y con superficie de revisión (`UC-PRT-04`).
5.1. Si el entrenador republica después, GEI crea una revisión nueva sin reescribir la anterior.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-PRT-005` (P) · `REQ-PRT-006` (S) · `REQ-COM-015` (S) · `REQ-PRT-008` (S) · `REQ-INS-011` (S) · `REQ-SYS-018` (S) · `REQ-COM-014` (S)
- Authority source: `RoleAssignment COACH`
- Scope: `TEAM` / `EVENT`
- Business rules: `REQ-PRT-006` — la publicación no se bloquea por un conflicto derivado · `REQ-COM-015` — notifica agregadas y quitadas, no las que permanecen · republicar crea revisión nueva
- Estado / objeto afectado: `Selection` borrador → revisión publicada inmutable
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: por eso «revisar conflictos» es SIBLING y no `<<include>>` de publicar (`REJ-04`): publica igual.

---

## CASO DE USO: UC-PRT-04 · Revisar los conflictos de una convocatoria

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un entrenador saber a quién de su lista convocardia no le corresponde estar, y qué hacer al respecto, cuando una convocatoria publicada tiene restricciones activas que la afectan.
Actores:
- Actor principal: `ACT-COACH`
- Actores secundarios: —
Precondiciones:
- Existe una convocatoria publicada.
- Existen restricciones de habilitación o de afiliación aplicables a la convocatoria.
Postcondiciones:
- Éxito: el entrenador ve los conflictos derivados explicados en lenguaje de usuario, sin que la publicación se reescriba.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. El entrenador consulta una convocatoria publicada.
2. GEI deriva los conflictos actuales: `ELIGIBILITY_BLOCKED`, `ELIGIBILITY_PENDING`, `NO_LONGER_EVENT_TARGET`, `NO_LONGER_TEAM_AFFILIATED`.
3. GEI presenta cada conflicto explicado en lenguaje de usuario, con la superficie de revisión disponible.

Camino alternativo:
3.1. Si no hay conflictos aplicables, GEI lo comunica explícitamente en lugar de mostrar una lista vacía sin explicación.
3.2. Si un conflicto deriva en un pendiente accionable, GEI lo puede presentar en el inicio del entrenador como «requiere tu atención» (`UC-EVT-18`).

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-PRT-007` (P) · `REQ-PRT-006` (S) · `REQ-PRT-017` (S) · `REQ-PRT-018` (S) · `REQ-EVT-021` (S) · `REQ-PPL-011` (S)
- Authority source: `RoleAssignment COACH`
- Scope: `TEAM` / `EVENT`
- Business rules: `REQ-PRT-017` — el entrenador ve estado, nunca motivo ni origen · `REQ-PRT-018` — los conflictos no se derivan de la disponibilidad · PII default deny en la explicación
- Estado / objeto afectado: consulta sin mutación; la publicación no se reescribe
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: objetivo distinto de `UC-PRT-02` y `UC-PRT-03`: el actor no quiere cambiar la lista, quiere entender un bloqueo. SIBLING de preparar y publicar (E4 EXT-04).

---

## CASO DE USO: UC-PRT-05 · Registrar la asistencia de un evento

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un entrenador dejar asentado quién estuvo presente en un entrenamiento o partido, marcando la planilla con persistencia inmediata.
Actores:
- Actor principal: `ACT-COACH` (alcance `TEAM` o `EVENT`)
- Actores secundarios: —
Precondiciones:
- El evento está `SCHEDULED` o `IN_PROGRESS`.
- El tipo de evento es `TRAINING` o `MATCH`.
- La planilla de asistencia está `OPEN`.
- Rol `COACH` vigente con alcance sobre el evento.
Postcondiciones:
- Éxito: el valor marcado queda persistido de inmediato; lo que no se registró queda como «sin registrar», estado propio y distinguible de «ausente».
- Rechazo: no queda ningún valor nuevo registrado.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El entrenador inicia la carga de la planilla de asistencia del evento.
2. GEI valida la autoridad, el estado del evento, el tipo aplicable y que la planilla está `OPEN`.
3. El entrenador marca la asistencia de cada jugadora: presente, ausente o justificada.
4. GEI persiste cada valor de inmediato y presenta el conteo vivo.

Camino alternativo:
2.1. Si la planilla está `CLOSED`, GEI no admite marcaje nuevo: explica que la corrección se hace por `UC-PRT-07`.
2.2. Si el actor no tiene autoridad, GEI deniega la operación.
2.3. Si el tipo de evento no admite asistencia (matriz de aplicabilidad), GEI lo comunica.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-PRT-009` (P) · `REQ-PRT-010` (P) · `REQ-PRT-019` (S) · `REQ-EVT-017` (S) · `REQ-COM-017` (S)
- Authority source: `RoleAssignment COACH`
- Scope: `TEAM` / `EVENT`
- Business rules: `REQ-PRT-010` — «sin registrar» ≠ «ausente» · `REQ-PRT-019` — matriz de aplicabilidad por tipo · `REQ-COM-017` — registrar asistencia no notifica
- Estado / objeto afectado: `Attendance` con valores persistidos de inmediato
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: la asistencia se puede abrir y cargar antes de que el evento esté `COMPLETED` (PT §12). `UC-PRT-07` es SIBLING (E4 EXT-02).

---

## CASO DE USO: UC-PRT-06 · Cerrar la asistencia de un evento

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un entrenador dejar constancia de cuándo los datos de presencia de un evento quedaron cerrados, dejando la planilla sin marcaje directo.
Actores:
- Actor principal: `ACT-COACH`
- Actores secundarios: —
Precondiciones:
- El evento está `SCHEDULED`, `IN_PROGRESS` o `COMPLETED`.
- La planilla está `OPEN`.
- Rol `COACH` vigente con alcance sobre el evento.
Postcondiciones:
- Éxito: queda registrada la marca de cierre; la planilla queda `CLOSED` y no admite marcaje nuevo sin corrección.
- Rechazo: la planilla queda `OPEN`.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. El entrenador solicita cerrar la planilla de asistencia del evento.
2. GEI valida la autoridad y que la planilla está `OPEN`.
3. El entrenador confirma el cierre.
4. GEI registra la marca de cierre y deja la planilla `CLOSED`, distinguible de «abierta».

Camino alternativo:
2.1. Si la planilla ya está `CLOSED`, GEI rechaza la operación explicando el estado.
2.2. Si el actor no tiene alcance sobre el evento, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-PRT-011` (P) · `REQ-PRT-009` (S) · `REQ-PRT-012` (S)
- Authority source: `RoleAssignment COACH`
- Scope: `TEAM` / `EVENT`
- Business rules: `REQ-PRT-011` — la reapertura de una planilla cerrada **no** es requisito (`CON-13`): la corrección la cubre `UC-PRT-07`
- Estado / objeto afectado: `Attendance` planilla `OPEN → CLOSED` (derivado de la marca de cierre)
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: exclusión explícita: no se crea CU de reapertura.

---

## CASO DE USO: UC-PRT-07 · Corregir la asistencia de un evento

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un entrenador arreglar un error de registro de asistencia sin perder la traza del error, exigiendo motivo escrito.
Actores:
- Actor principal: `ACT-COACH`
- Actores secundarios: —
Precondiciones:
- Existe un valor de asistencia registrado.
- La corrección incluye motivo escrito.
- Rol `COACH` vigente con alcance sobre el evento.
Postcondiciones:
- Éxito: quedan persistidos el valor anterior, el nuevo, el motivo, el autor y la fecha; al consultar la asistencia, el antes y el después son visibles.
- Rechazo: la operación no completa; el valor original queda intacto.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El entrenador identifica un valor de asistencia mal cargado.
2. El entrenador indica el valor nuevo y el motivo escrito de la corrección.
3. GEI valida la autoridad y el motivo.
4. GEI persiste el valor anterior, el nuevo, el motivo, el autor y la fecha, y deja el valor corregido vigente.

Camino alternativo:
3.1. Si la corrección llega sin motivo escrito, la operación no completa y GEI lo explica.
3.2. Si el actor no tiene alcance sobre el evento, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-PRT-012` (P) · `REQ-INS-011` (S) · `REQ-INS-009` (S) · `REQ-SYS-006` (S) · `REQ-COM-017` (S)
- Authority source: `RoleAssignment COACH`
- Scope: `TEAM` / `EVENT`
- Business rules: `REQ-SYS-006` — el motivo se escribe en lenguaje de usuario · `REQ-COM-017` — la corrección menor no notifica · único camino para cambiar un valor con planilla `CLOSED`
- Estado / objeto afectado: `Attendance` corregida con evidencia de antes y después; no retrocede el ciclo de vida de nada
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: SIBLING de `UC-PRT-05`/`UC-PRT-06` (E4 EXT-02): el base ya terminó; la corrección es una operación independiente con resultado propio.

---

## CASO DE USO: UC-PRT-08 · Registrar el resultado de un partido

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un entrenador cargar cómo terminó un partido como borrador, todavía no oficial, dentro del ciclo de vida que el evento permite.
Actores:
- Actor principal: `ACT-COACH`
- Actores secundarios: —
Precondiciones:
- El evento es `MATCH`.
- El ciclo del evento permite el resultado: `PLAYED` o `FORFEIT` exigen `COMPLETED`; `ABANDONED` exige `ABANDONED`.
- Rol `COACH` vigente con alcance sobre el evento.
Postcondiciones:
- Éxito: existe un `MatchRecord` en `DRAFT`; el resultado no fija un estado que el evento no tiene.
- Rechazo: no se crea ningún resultado.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El entrenador inicia la carga del resultado del partido terminado.
2. GEI valida la autoridad, el tipo `MATCH` y la compatibilidad del ciclo del evento.
3. El entrenador proporciona el resultado del partido.
4. GEI registra el `MatchRecord` en `DRAFT`.

Camino alternativo:
2.1. Si el ciclo del evento no es compatible con el resultado indicado, GEI rechaza la operación (`MATCH_STATE_INCOMPATIBLE`).
2.2. Si el actor no tiene alcance sobre el evento, GEI deniega la operación. `ACT-ADMIN` no registra resultados (E2 §14.1).

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-PRT-013` (P) · `REQ-PRT-015` (P) · `REQ-PRT-019` (S) · `REQ-PRT-016` (S)
- Authority source: `RoleAssignment COACH`
- Scope: `TEAM` / `EVENT`
- Business rules: `REQ-PRT-015` — `PLAYED`/`FORFEIT` ⇒ evento `COMPLETED`; `ABANDONED` ⇒ evento `ABANDONED` · `REQ-PRT-019` — aplicabilidad por tipo
- Estado / objeto afectado: `MatchRecord` nace `DRAFT`
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: separado de `UC-PRT-09` porque borrador ≠ oficial: el resultado observable cambia.

---

## CASO DE USO: UC-PRT-09 · Finalizar el resultado de un partido

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un entrenador dejar el resultado del partido como estado final oficial, a partir del cual los partidos jugados se derivan del resultado.
Actores:
- Actor principal: `ACT-COACH`
- Actores secundarios: —
Precondiciones:
- El `MatchRecord` está `DRAFT`.
- El ciclo del evento lo permite.
- Rol `COACH` vigente con alcance sobre el evento.
Postcondiciones:
- Éxito: el resultado queda `FINAL`; la finalización es terminal por la vía normal; los partidos jugados quedan derivados del resultado y las estadísticas de partido se hacen reales.
- Rechazo: el resultado queda `DRAFT`.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El entrenador solicita finalizar el borrador del resultado del partido.
2. GEI valida la autoridad, el estado `DRAFT` del resultado y la compatibilidad del ciclo del evento.
3. El entrenador confirma la finalización.
4. GEI deja el resultado `FINAL` y habilita las estadísticas de partido para los estados jugados.

Camino alternativo:
2.1. Si el resultado no está `DRAFT`, GEI rechaza la operación: un resultado `FINAL` no se edita por la vía normal; la vía es la corrección (`UC-PRT-10`).
2.2. Si el ciclo del evento no lo permite, GEI rechaza la operación (`MATCH_STATE_INCOMPATIBLE`).
2.3. Si el actor no tiene alcance sobre el evento, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-PRT-013` (P) · `REQ-PRT-015` (P) · `REQ-PRT-016` (S) · `REQ-PRT-014` (S) · `REQ-INS-005` (S)
- Authority source: `RoleAssignment COACH`
- Scope: `TEAM` / `EVENT`
- Business rules: `REQ-PRT-014` — el único camino posterior es la corrección · `REQ-PRT-016` — partidos jugados derivados del resultado, nunca de la asistencia
- Estado / objeto afectado: `MatchRecord` `DRAFT → FINAL`, terminal por la vía normal
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: `UC-PRT-10` es SIBLING (E4 EXT-03): la corrección es una operación independiente, no una extensión de la finalización.

---

## CASO DE USO: UC-PRT-10 · Corregir el resultado de un partido

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un entrenador corregir un resultado ya finalizado sin perder la evidencia del error, exigiendo motivo escrito.
Actores:
- Actor principal: `ACT-COACH`
- Actores secundarios: —
Precondiciones:
- El `MatchRecord` está `FINAL`.
- La corrección incluye motivo escrito.
- Rol `COACH` vigente con alcance sobre el evento.
Postcondiciones:
- Éxito: quedan persistidos el marcador anterior, el nuevo, el motivo, el autor y la fecha; el marcador final queda visible junto con la evidencia.
- Rechazo: la operación no completa; el marcador oficial queda intacto.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El entrenador identifica un error en el resultado oficial del partido.
2. El entrenador indica el marcador nuevo y el motivo escrito de la corrección.
3. GEI valida la autoridad y el motivo.
4. GEI persiste el marcador anterior, el nuevo, el motivo, el autor y la fecha, y deja el marcador corregido vigente junto con la evidencia.

Camino alternativo:
2.1. Si el resultado no está `FINAL`, GEI explica que la corrección aplica sólo sobre resultados finalizados.
3.1. Si la corrección llega sin motivo escrito, la operación no completa y GEI lo explica.
3.2. Si el actor no tiene alcance sobre el evento, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-PRT-014` (P) · `REQ-INS-011` (S) · `REQ-INS-009` (S) · `REQ-PRT-013` (S) · `REQ-SYS-006` (S)
- Authority source: `RoleAssignment COACH`
- Scope: `TEAM` / `EVENT`
- Business rules: único camino para cambiar un `FINAL` · una corrección no retrocede el ciclo de vida del evento ni del resultado
- Estado / objeto afectado: `MatchRecord` corregido con evidencia; el resultado sigue `FINAL`
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: SIBLING de `UC-PRT-09` (E4 EXT-03).

---

## CASO DE USO: UC-PRT-11 · Consultar las estadísticas de un partido

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un entrenador, o a una capitana si corresponde, ver cómo rindieron las jugadoras de un partido a partir de la participación real registrada.
Actores:
- Actor principal: `ACT-COACH` (alcance `TEAM` o `EVENT`)
- Actores secundarios: `ACT-CAPTAIN` (`TEAM` si corresponde)
Precondiciones:
- El `MatchRecord` está en `PLAYED`.
- El actor tiene alcance sobre el partido.
Postcondiciones:
- Éxito: el actor ve las estadísticas del partido, reconocidas sólo sobre participación real registrada en `PLAYED`.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. El entrenador o la capitana solicita ver las estadísticas de un partido de su alcance.
2. GEI valida la autoridad y que el resultado del partido es `PLAYED`.
3. GEI presenta las estadísticas del partido derivadas de la participación real registrada.

Camino alternativo:
2.1. Si el resultado no es `PLAYED`, GEI explica que no hay estadísticas de partido real.
2.2. Si el actor no tiene alcance sobre el partido, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-PRT-016` (P) · `REQ-PRT-015` (S)
- Authority source: `RoleAssignment COACH` / `RoleAssignment CAPTAIN`
- Scope: `TEAM` / `EVENT`
- Business rules: sólo `PLAYED`; los partidos jugados se derivan del resultado, nunca de la asistencia; ampliar el set de estadísticas es decisión pendiente (`DEF-CMP-001`), no de V1
- Estado / objeto afectado: consulta sin mutación
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: no fusionado con `UC-INS-03`: aquél es agregado y transversal; éste es por partido y con autoridad deportiva distinta.

---

## CASO DE USO: UC-PRT-12 · Registrar una restricción de habilitación

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la Subcomisión o a la administración dejar constancia de una condición que impide o condiciona la participación de una jugadora, con estado, alcance, origen, motivo y vigencia.
Actores:
- Actor principal: `ACT-SUBCOMMITTEE` (alcance `CLUB`) · `ACT-ADMIN` (alcance `CLUB`)
- Actores secundarios: —
Precondiciones:
- `RoleAssignment SUBCOMMITTEE` o `RoleAssignment ADMIN` vigente.
- La jugadora existe.
Postcondiciones:
- Éxito: la restricción queda registrada con estado, alcance, origen, motivo y vigencia, y toda mutación queda auditada; sin restricción activa aplicable el estado derivado es `ELIGIBLE`.
- Rechazo: no se registra ninguna restricción.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. La Subcomisión o la administración registra una condición de aptitud o restricción de una jugadora.
2. GEI valida la autoridad y que la jugadora existe.
3. El actor indica el estado, el alcance, el origen, el motivo y la vigencia de la restricción.
4. GEI persiste la restricción y registra la mutación en la auditoría.

Camino alternativo:
2.1. Si el actor no tiene autoridad de Subcomisión ni de administración, GEI deniega la operación.
2.2. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
4.1. Si no existe ninguna restricción activa aplicable a una jugadora, su estado derivado es `ELIGIBLE`: nunca se infiere de la disponibilidad.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-PRT-017` (P) · `REQ-CMP-008` (P) · `REQ-CMP-007` (S) · `REQ-INS-009` (S) · `REQ-PPL-015` (S)
- Authority source: `RoleAssignment SUBCOMMITTEE` / `RoleAssignment ADMIN`
- Scope: `CLUB` (la restricción acota dónde aplica: `CLUB`, `COMPETITION`, `ENTRY`, `EVENT`)
- Business rules: `REQ-CMP-007` — límite federativo: sin historia clínica, sólo estado, motivo y vigencia · `REQ-CMP-008` — toda mutación auditada · `ELIGIBLE` es derivado
- Estado / objeto afectado: `EligibilityConstraint` persistida con estados `PENDING`/`BLOCKED` y vigencia; no hay CU de «finalizar una restricción»: la vigencia se registra dentro de este CU
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: la vigencia se registra dentro de este CU; ningún REQ expresa «finalizar una restricción» como objetivo separado.

---

## CASO DE USO: UC-PRT-13 · Consultar el estado de habilitación de una jugadora

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la Subcomisión, a la administración o a un entrenador con alcance saber si una jugadora puede participar y, si no puede, por qué y desde cuándo, con visibilidad diferenciada por autoridad.
Actores:
- Actor principal: `ACT-SUBCOMMITTEE` · `ACT-ADMIN` · `ACT-COACH` (sólo el estado)
- Actores secundarios: —
Precondiciones:
- El actor tiene alcance.
- La jugadora existe.
Postcondiciones:
- Éxito: `ACT-COACH` ve el estado derivado y el alcance, nunca el motivo ni el origen; `ACT-SUBCOMMITTEE` y `ACT-ADMIN` ven además el motivo y el origen con su vigencia.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. La Subcomisión, la administración o el entrenador consulta el estado de habilitación de una jugadora.
2. GEI valida la autoridad del actor y deriva el estado de habilitación de la jugadora.
3. GEI presenta el estado derivado con el alcance, y el motivo y el origen con su vigencia cuando el actor tiene autoridad para verlos.

Camino alternativo:
2.1. Si el actor no tiene alcance sobre la jugadora, GEI deniega la operación.
3.1. Si quien consulta es `ACT-COACH`, GEI presenta sólo el estado derivado y el alcance: el motivo y el origen no existen en la respuesta.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-PRT-017` (P) · `REQ-CMP-008` (P) · `REQ-PPL-011` (S) · `REQ-PRT-018` (S) · `REQ-CMP-007` (S)
- Authority source: `RoleAssignment SUBCOMMITTEE` / `RoleAssignment ADMIN` / `RoleAssignment COACH` (con alcance)
- Scope: `CLUB` (`SUBCOMMITTEE`, `ADMIN`) · `TEAM`/`EVENT` (`COACH` con alcance)
- Business rules: `REQ-PRT-018` — la habilitación nunca se infiere de la disponibilidad · `REQ-PPL-011` — el campo no autorizado no existe en la respuesta · `REQ-CMP-007` — sin historia clínica
- Estado / objeto afectado: consulta sin mutación; estado derivado de habilitación
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: `ACTOR-DECISION-01` congelado en (a): `ACT-PLAYER` y `ACT-CAPTAIN` están **excluidos**. No existe «consultar mi estado de habilitación».

---

**Fin de las especificaciones PRT. 13 CU · `UC-PRT-01` … `UC-PRT-13`.**
