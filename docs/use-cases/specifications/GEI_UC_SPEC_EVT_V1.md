# GEI HOCKEY MANAGEMENT SYSTEM
## UC SPECIFICATIONS — EVT (Events & Calendar) V1

**Etapa:** 5 — Especificaciones de TODOS los casos de uso
**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-07
**Rama:** `gei/e5-use-case-specifications-freeze-v1`
**Plantilla:** `GEI_USE_CASE_SPECIFICATION_STANDARD_V1.md`
**CU:** 19 — `UC-EVT-01` … `UC-EVT-19`

> Relaciones consumidas según E4 V1.0.1: `<<include>>` `UC-EVT-05/07/08 → UC-EVT-11`;
> `<<extend>>` `UC-EVT-11 → UC-EVT-04` `[MATERIAL_CHANGE]`, `UC-EVT-12 → UC-EVT-04`
> `[STALE_VERSION]`, `UC-EVT-11 → UC-EVT-16` `[MATERIAL_CHANGE]`.

---

## CASO DE USO: UC-EVT-01 · Crear un entrenamiento

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un entrenador autorizado o a la Subcomisión programar un entrenamiento para las personas que quiere convocar, y que quede visible para ellas en sus proyecciones.
Actores:
- Actor principal: `ACT-COACH` (alcance `TEAM` o `EVENT`) · `ACT-SUBCOMMITTEE` (alcance `CLUB`)
- Actores secundarios: `ACT-PLAYER`, `ACT-CAPTAIN`, `ACT-GUARDIAN` (quedan alcanzados por el evento)
Precondiciones:
- Rol vigente con alcance sobre el destino.
- El destino del entrenamiento es válido.
- Las invariantes de fecha y horario se cumplen.
Postcondiciones:
- Éxito: existe un evento de tipo `TRAINING` con horario vigente y destinatarios válidos, nacido `SCHEDULED` en la misma operación, disponible para las personas alcanzadas.
- Rechazo: no se crea ningún evento.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El entrenador o la Subcomisión inicia la programación de un entrenamiento.
2. GEI solicita los datos del entrenamiento.
3. El actor proporciona horario, sede y destinatarios: una o más listas de equipos y de personas, independientes entre sí, elegidas de las listas del club.
4. GEI valida la autoridad y el alcance del actor, el destino y las invariantes de fecha y horario.
5. GEI registra el entrenamiento como evento `SCHEDULED` en la misma operación, sin borrador observable, y lo deja disponible para las personas alcanzadas.

Camino alternativo:
4.1. Si el actor no informara ningún destino, GEI rechaza la operación (`EVENT_TARGET_INVALID`) sin crear nada.
4.2. Si el actor no tiene autoridad sobre el destino (por ejemplo `ACT-ADMIN` sin autoridad deportiva), GEI deniega la operación.
4.3. Si las invariantes de fecha u horario no se cumplen, GEI rechaza la operación indicando la causa.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-EVT-002` (P) · `REQ-EVT-009` (S) · `REQ-EVT-005` (S) · `REQ-EVT-001` (S) · `REQ-EVT-007` (S) · `REQ-STR-012` (S) · `REQ-COM-016` (S) · `REQ-SYS-018` (S) · `REQ-STR-013` (S)
- Authority source: `RoleAssignment COACH` / `RoleAssignment SUBCOMMITTEE`
- Scope: `TEAM` / `EVENT` / `CLUB`
- Business rules: `REQ-EVT-005` (destinatarios plurales, listas independientes) · `REQ-EVT-009` (sin borrador observable) · `REQ-STR-013` (estructura elegible de listas) · `REQ-SYS-018` (una orden, una transacción)
- Estado / objeto afectado: `Event` `TRAINING` nace `SCHEDULED`
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: objetivo distinto de `UC-EVT-02`: las reglas de destino son distintas y el resultado esperado por el club es distinto. Sin `<<include>>` de autenticación (`REJ-01`): `REQ-IAM-012` es precondición transversal.

---

## CASO DE USO: UC-EVT-02 · Crear un partido

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un entrenador autorizado o a la Subcomisión programar un partido para un equipo concreto, y que quede asentado para todos los alcanzados.
Actores:
- Actor principal: `ACT-COACH` (alcance `TEAM`) · `ACT-SUBCOMMITTEE` (alcance `CLUB`)
- Actores secundarios: `ACT-PLAYER`, `ACT-CAPTAIN`, `ACT-GUARDIAN` (alcanzados)
Precondiciones:
- Rol vigente con alcance.
- El partido tiene exactamente un equipo destino.
- Si hay competencia de jornada, la inscripción de esa competencia es compatible.
- Las invariantes de fecha y horario se cumplen.
Postcondiciones:
- Éxito: existe un evento `MATCH` con exactamente un equipo, inmutable una vez programado, nacido `SCHEDULED`, y el equipo queda alcanzable por sus eventos.
- Rechazo: no se crea ningún partido.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El entrenador o la Subcomisión inicia la programación de un partido.
2. GEI solicita los datos del partido.
3. El actor proporciona horario, sede y exactamente un equipo destino.
4. GEI valida la autoridad, la unicidad del equipo destino, la compatibilidad de la inscripción de competencia cuando corresponde, y las invariantes de fecha y horario.
5. GEI registra el partido como evento `MATCH` `SCHEDULED` en la misma operación y lo deja disponible para el equipo alcanzado.

Camino alternativo:
4.1. Si el actor indica más de un equipo, personas destino o alcance de club, GEI rechaza la operación (`EVENT_TARGET_INVALID`).
4.2. Si el actor no tiene autoridad sobre el equipo destino, GEI deniega la operación.
4.3. Si la jornada tiene competencia y el partido no usa una inscripción de esa competencia con alcance compatible, GEI rechaza la operación explicando la causa (`REQ-CMP-005`).
4.4. Si las invariantes de fecha u horario no se cumplen, GEI rechaza la operación indicando la causa.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-EVT-003` (P) · `REQ-EVT-006` (S) · `REQ-EVT-009` (S) · `REQ-EVT-001` (S) · `REQ-EVT-007` (S) · `REQ-CMP-005` (S) · `REQ-EVT-005` (S)
- Authority source: `RoleAssignment COACH` / `RoleAssignment SUBCOMMITTEE`
- Scope: `TEAM` / `CLUB`
- Business rules: `REQ-EVT-006` — el equipo del partido es inmutable una vez programado · `REQ-CMP-005` — uso de la inscripción de la competencia de la jornada
- Estado / objeto afectado: `Event` `MATCH` nace `SCHEDULED`
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: cambiar el equipo después de programado se rechaza; antes de programar es un cambio material (`UC-EVT-04`).

---

## CASO DE USO: UC-EVT-03 · Crear un evento del club

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la Subcomisión o a un entrenador convocar a una actividad del club que no es entrenar ni jugar —reunión, tarea, evento de organización— y que quede en la agenda de los alcanzados.
Actores:
- Actor principal: `ACT-SUBCOMMITTEE` (alcance `CLUB`) · `ACT-COACH` (alcance `EVENT`)
- Actores secundarios: `ACT-PLAYER`, `ACT-CAPTAIN`, `ACT-GUARDIAN` (alcanzados)
Precondiciones:
- Rol vigente con alcance.
- Los marcadores de alcance del evento son coherentes.
Postcondiciones:
- Éxito: existe un evento de club `SCHEDULED`, para todo el club con cero destinos de equipo y de persona, o dirigido con al menos un destino.
- Rechazo: no se crea ningún evento.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. La Subcomisión o el entrenador inicia la convocatoria de una actividad del club.
2. GEI solicita los datos del evento.
3. El actor indica si el evento es para todo el club o dirigido, y en el segundo caso informa los destinatarios de equipo y de persona.
4. GEI valida la autoridad, la coherencia de los marcadores de alcance y las invariantes de fecha y horario.
5. GEI registra el evento de club como `SCHEDULED` en la misma operación y lo deja disponible para las personas alcanzadas.

Camino alternativo:
4.1. Si el actor marca el evento como para todo el club y además indica destinatarios, o lo marca como dirigido sin destinatarios, GEI rechaza la operación por marcadores contradictorios.
4.2. Si el actor no tiene autoridad para el alcance declarado, GEI deniega la operación.
4.3. Si las invariantes de fecha u horario no se cumplen, GEI rechaza la operación indicando la causa.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-EVT-004` (P) · `REQ-EVT-005` (S) · `REQ-EVT-009` (S) · `REQ-EVT-001` (S) · `REQ-EVT-017` (S) · `REQ-STR-013` (S)
- Authority source: `RoleAssignment SUBCOMMITTEE` / `RoleAssignment COACH`
- Scope: `CLUB` / `EVENT`
- Business rules: `REQ-EVT-017` — un evento de club no tiene convocatoria ni resultado; sí admite disponibilidad
- Estado / objeto afectado: `Event` `CLUB_EVENT` nace `SCHEDULED`
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: admite disponibilidad (PT §12); lo que no admite es convocatoria ni resultado.

---

## CASO DE USO: UC-EVT-04 · Editar un evento

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un entrenador autorizado o a la Subcomisión corregir o cambiar los datos de un evento ya programado —título, redacción, metadatos, horario, sede o destinatarios— con efectos distintos según el cambio sea o no material para la coordinación.
Actores:
- Actor principal: `ACT-COACH` (alcance `TEAM` o `EVENT`) · `ACT-SUBCOMMITTEE` (alcance `CLUB`)
- Actores secundarios: `ACT-CAPTAIN` (sólo logística, `UC-EVT-16`) · `ACT-ADMIN` (sólo valla técnica de concurrencia)
Precondiciones:
- Rol vigente con alcance sobre el evento.
- El evento no está `COMPLETED`.
Postcondiciones:
- Éxito: el evento queda con los datos nuevos; en cambio no material la corrección queda registrada sin impacto de coordinación; en cambio material la revisión de coordinación de cada ocurrencia afectada sube, se derivan las reconfirmaciones que correspondan y se notifica a las audiencias afectadas.
- Rechazo: el evento conserva sus datos vigentes.
Puntos de Extensión:
- Cambio material [MATERIAL_CHANGE]: cuando el cambio toca un campo de la lista cerrada de `REQ-EVT-011` (horario, sede, destinatarios), activa `UC-EVT-11` · Revisar el impacto de un cambio material.
- Edición concurrente [STALE_VERSION]: cuando el recurso cambió en el servidor al confirmar, activa `UC-EVT-12` · Resolver un conflicto de edición concurrente.
Prioridad: P0

Camino básico:
1. El entrenador o la Subcomisión solicita editar un evento dentro de su alcance.
2. GEI valida la autoridad y verifica que el evento no está `COMPLETED`.
3. El actor modifica los datos no coordinativos del evento: título, redacción o metadatos.
4. El actor confirma la edición.
5. GEI registra la corrección sin vista previa de impacto, sin incremento de revisión de coordinación, sin reconfirmación y sin notificación, conservando la historia del evento.

Camino alternativo:
2.1. Si el evento está `COMPLETED`, GEI rechaza la edición: `COMPLETED` no se reabre.
2.2. Si el actor no tiene alcance sobre el evento, GEI rechaza la operación sin modificar información.
3.1. Si el actor cambia un campo material de la lista cerrada (horario, sede, destinatarios), se cumple [MATERIAL_CHANGE] y se activa `UC-EVT-11` · Revisar el impacto de un cambio material <<extend>>: el actor revisa el impacto sobre las personas alcanzadas, lo confirma, la revisión de coordinación de cada ocurrencia afectada sube, se derivan las reconfirmaciones que correspondan y GEI notifica a la unión de audiencias afectadas.
3.2. Si el evento pertenece a una serie, el actor elige el alcance del cambio —sólo esta ocurrencia · esta y las siguientes · toda la serie— y el impacto se calcula sobre el conjunto real afectado, nunca sobre un total de serie.
3.3. Si el actor intenta cambiar el equipo de un partido ya programado, GEI rechaza la operación: el equipo del partido es inmutable (`REQ-EVT-006`).
4.1. Si la versión del evento cambió en el servidor al confirmar, se cumple [STALE_VERSION] y se activa `UC-EVT-12` · Resolver un conflicto de edición concurrente <<extend>>: el actor ve su base, sus cambios locales y la versión vigente del servidor, reconcilia campo por campo y vuelve a confirmar.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-EVT-010` (P) · `REQ-EVT-011` (P) · `REQ-EVT-012` (S) · `REQ-EVT-015` (S) · `REQ-EVT-006` (S) · `REQ-STR-012` (S) · `REQ-PRT-003` (S) · `REQ-EVT-013` (S) · `REQ-EVT-001` (S) · `REQ-COM-016` (S) · `REQ-STR-011` (S) · `REQ-SYS-017` (S)
- Authority source: `RoleAssignment COACH` / `RoleAssignment SUBCOMMITTEE`
- Scope: `TEAM` / `EVENT` / `CLUB`
- Business rules: `REQ-EVT-011` (lista cerrada de campos materiales) · `REQ-EVT-010` (cambio no material sin efectos de coordinación) · `REQ-EVT-015` (las tres opciones de alcance de serie son de esta misma operación) · `REQ-EVT-006` (equipo del partido inmutable) · `REQ-STR-012` regla B (cambiar la sede del evento es cambio material) · `REQ-PRT-003` (las respuestas previas a un cambio coordinativo pasan a «necesita confirmación»)
- Estado / objeto afectado: `Event` con datos actualizados; revisión de coordinación de cada ocurrencia afectada incrementada sólo en la rama material; respuestas derivadas a «necesita confirmación» según `REQ-PRT-003`
- Includes: Ninguno.
- Extends: `UC-EVT-11` · Revisar el impacto de un cambio material ([MATERIAL_CHANGE]) · `UC-EVT-12` · Resolver un conflicto de edición concurrente ([STALE_VERSION])
- Notas de trazabilidad: **un** CU con dos ramas (material / no material), no dos: el objetivo del actor es el mismo y las ramas difieren en efectos. La reanudación `POSTPONED → SCHEDULED` es otro objetivo: `UC-EVT-06`. `ACT-ADMIN` participa sólo como valla técnica de concurrencia (`ACTOR-DECISION-02`).

---

## CASO DE USO: UC-EVT-05 · Posponer un evento

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un entrenador autorizado o a la Subcomisión mover un evento fuera de agenda porque no puede realizarse en su fecha, conservando las respuestas ya dadas.
Actores:
- Actor principal: `ACT-COACH` · `ACT-SUBCOMMITTEE`
- Actores secundarios: `ACT-ADMIN` (sólo valla técnica)
Precondiciones:
- El evento está `SCHEDULED`.
- Rol vigente con alcance sobre el evento.
Postcondiciones:
- Éxito: el evento queda `POSTPONED` sin horario vigente; las respuestas de disponibilidad previas se conservan y no se aceptan nuevas; la revisión de coordinación sube y las personas alcanzadas quedan notificadas del aplazamiento.
- Rechazo: el evento conserva su estado y su horario.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El entrenador o la Subcomisión solicita posponer un evento que no puede realizarse en su fecha.
2. GEI valida la autoridad y el estado `SCHEDULED` del evento.
3. GEI ejecuta `UC-EVT-11` · Revisar el impacto de un cambio material <<include>>.
4. El actor confirma el aplazamiento sobre el impacto presentado.
5. GEI deja el evento `POSTPONED` sin horario vigente, conserva las respuestas previas, cierra la respuesta nueva, incrementa la revisión de coordinación y notifica el aplazamiento a las personas alcanzadas.

Camino alternativo:
2.1. Si el evento no está `SCHEDULED`, GEI rechaza la operación explicando el estado actual.
2.2. Si el actor no tiene alcance sobre el evento, GEI rechaza la operación sin modificar información.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-EVT-007` (P) · `REQ-EVT-011` (S) · `REQ-PRT-004` (S) · `REQ-PRT-003` (S) · `REQ-COM-014` (S) · `REQ-EVT-008` (S)
- Authority source: `RoleAssignment COACH` / `RoleAssignment SUBCOMMITTEE`
- Scope: `TEAM` / `EVENT` / `CLUB`
- Business rules: `REQ-PRT-004` — `POSTPONED` conserva respuestas y no acepta nuevas · `REQ-COM-014` — posponer es un tipo de notificación distinguible
- Estado / objeto afectado: `Event` `SCHEDULED → POSTPONED`, sin horario vigente; disponibilidad cerrada a nuevas respuestas
- Includes: `UC-EVT-11` · Revisar el impacto de un cambio material <<include>> ([MATERIAL_CHANGE]) — toda posposición es cambio material
- Extends: Ninguno.
- Notas de trazabilidad: objetivo distinto de `UC-EVT-04`: cambia el ciclo de vida y el resultado observable. La reversión es `UC-EVT-06`.

---

## CASO DE USO: UC-EVT-06 · Reanudar un evento pospuesto

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un entrenador autorizado o a la Subcomisión volver a poner en agenda un evento pospuesto cuando ya hay una fecha nueva, reabriendo la respuesta de disponibilidad.
Actores:
- Actor principal: `ACT-COACH` · `ACT-SUBCOMMITTEE`
- Actores secundarios: `ACT-PLAYER`, `ACT-GUARDIAN` (pueden volver a responder)
Precondiciones:
- El evento está `POSTPONED`.
- Rol vigente con alcance sobre el evento.
Postcondiciones:
- Éxito: el evento queda `SCHEDULED` con horario vigente y la respuesta de disponibilidad vuelve a estar abierta; las respuestas conservadas siguen visibles; las personas alcanzadas quedan notificadas de la reprogramación.
- Rechazo: el evento queda `POSTPONED`.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El entrenador o la Subcomisión indica la fecha nueva para un evento pospuesto.
2. GEI valida la autoridad, el estado `POSTPONED` y las invariantes de fecha y horario.
3. El actor confirma la reanudación.
4. GEI deja el evento `SCHEDULED` con horario vigente, reabre la respuesta de disponibilidad conservando las respuestas previas y notifica la reprogramación a las personas alcanzadas.

Camino alternativo:
2.1. Si el evento no está `POSTPONED`, GEI rechaza la operación explicando el estado actual.
2.2. Si el actor no tiene alcance sobre el evento, GEI rechaza la operación sin modificar información.
2.3. Si las invariantes de fecha u horario no se cumplen, GEI rechaza la operación indicando la causa.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-EVT-007` (P) · `REQ-PRT-004` (P) · `REQ-PRT-003` (S) · `REQ-COM-014` (S)
- Authority source: `RoleAssignment COACH` / `RoleAssignment SUBCOMMITTEE`
- Scope: `TEAM` / `EVENT` / `CLUB`
- Business rules: `REQ-PRT-004` — al volver a `SCHEDULED` se puede responder de nuevo · `REQ-COM-014` — reprogramar es tipo distinguible
- Estado / objeto afectado: `Event` `POSTPONED → SCHEDULED` con horario vigente; disponibilidad reabierta
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: no fusionado con `UC-EVT-04` porque el resultado observable es distinto: reabre la disponibilidad.

---

## CASO DE USO: UC-EVT-07 · Cancelar un evento

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un entrenador autorizado o a la Subcomisión dar por cancelado un evento y que todos los alcanzados lo entiendan sin seguir esperando.
Actores:
- Actor principal: `ACT-COACH` · `ACT-SUBCOMMITTEE`
- Actores secundarios: `ACT-ADMIN` (sólo valla técnica)
Precondiciones:
- El evento está `SCHEDULED` o `POSTPONED`.
- Rol vigente con alcance sobre el evento.
Postcondiciones:
- Éxito: el evento queda `CANCELLED` con su composición propia y la consecuencia explicada; la disponibilidad deja de ser la acción principal; las personas alcanzadas quedan notificadas con el tipo distinguible de cancelación.
- Rechazo: el evento conserva su estado.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El entrenador o la Subcomisión solicita cancelar un evento que no se va a realizar.
2. GEI valida la autoridad y el estado del evento (`SCHEDULED` o `POSTPONED`).
3. GEI ejecuta `UC-EVT-11` · Revisar el impacto de un cambio material <<include>>.
4. El actor confirma la cancelación sobre el impacto presentado.
5. GEI deja el evento `CANCELLED` con su composición propia, explica la consecuencia, cierra la disponibilidad como acción principal y notifica la cancelación a las personas alcanzadas.

Camino alternativo:
2.1. Si el evento está en un estado que no admite cancelación, GEI rechaza la operación explicando el estado actual.
2.2. Si el actor no tiene alcance sobre el evento, GEI rechaza la operación sin modificar información.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-EVT-007` (P) · `REQ-EVT-008` (P) · `REQ-EVT-011` (S) · `REQ-COM-014` (S) · `REQ-PRT-004` (S) · `REQ-EVT-024` (S)
- Authority source: `RoleAssignment COACH` / `RoleAssignment SUBCOMMITTEE`
- Scope: `TEAM` / `EVENT` / `CLUB`
- Business rules: `REQ-EVT-008` — estados terminales con composición propia y consecuencia explicada · `REQ-COM-014` — cancelar es tipo distinguible
- Estado / objeto afectado: `Event` `SCHEDULED → CANCELLED` o `POSTPONED → CANCELLED`; terminal para la participación
- Includes: `UC-EVT-11` · Revisar el impacto de un cambio material <<include>> ([MATERIAL_CHANGE]) — toda cancelación es cambio material
- Extends: Ninguno.
- Notas de trazabilidad: cancelado no es lo mismo que pospuesto: `UC-EVT-07` es terminal para la participación; `UC-EVT-05` conserva respuestas y puede revertirse con `UC-EVT-06`. La restauración de un cancelado existe: `UC-EVT-08`.

---

## CASO DE USO: UC-EVT-08 · Restaurar un evento cancelado

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un entrenador autorizado o a la Subcomisión volver a agenda un evento que se había cancelado porque la cancelación fue un error o el evento finalmente se va a hacer.
Actores:
- Actor principal: `ACT-COACH` · `ACT-SUBCOMMITTEE`
- Actores secundarios: `ACT-PLAYER`, `ACT-GUARDIAN` (pueden volver a responder)
Precondiciones:
- El evento está `CANCELLED`.
- Rol vigente con alcance sobre el evento.
Postcondiciones:
- Éxito: el evento vuelve a `SCHEDULED` con horario vigente; la revisión de coordinación sube y las personas alcanzadas quedan notificadas con el tipo distinguible de restauración.
- Rechazo: el evento queda `CANCELLED`.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El entrenador o la Subcomisión solicita restaurar un evento cancelado.
2. GEI valida la autoridad y el estado `CANCELLED` del evento.
3. GEI ejecuta `UC-EVT-11` · Revisar el impacto de un cambio material <<include>>.
4. El actor confirma la restauración sobre el impacto presentado.
5. GEI deja el evento `SCHEDULED` con horario vigente, incrementa la revisión de coordinación y notifica la restauración a las personas alcanzadas.

Camino alternativo:
2.1. Si el evento no está `CANCELLED`, GEI rechaza la operación explicando el estado actual.
2.2. Si el actor no tiene alcance sobre el evento, GEI rechaza la operación sin modificar información.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-EVT-007` (P) · `REQ-EVT-011` (S) · `REQ-COM-014` (S) · `REQ-PRT-004` (S)
- Authority source: `RoleAssignment COACH` / `RoleAssignment SUBCOMMITTEE`
- Scope: `TEAM` / `EVENT` / `CLUB`
- Business rules: `REQ-COM-014` — restaurar es tipo distinguible · `REQ-PRT-004` — al volver a `SCHEDULED` se puede responder de nuevo
- Estado / objeto afectado: `Event` `CANCELLED → SCHEDULED`
- Includes: `UC-EVT-11` · Revisar el impacto de un cambio material <<include>> ([MATERIAL_CHANGE]) — toda restauración es cambio material
- Extends: Ninguno.
- Notas de trazabilidad: autorizado por PT §9 (`CANCELLED -> SCHEDULED` mediante Restore). Contrasta deliberadamente con la estructura: restaurar **evento** es de V1; restaurar **estructura** es DEFER. Son objetos con contratos distintos.

---

## CASO DE USO: UC-EVT-09 · Completar un evento

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un entrenador autorizado o a la Subcomisión dejar constancia de que un evento se realizó, habilitando el resultado del partido cuando corresponda.
Actores:
- Actor principal: `ACT-COACH` · `ACT-SUBCOMMITTEE`
- Actores secundarios: —
Precondiciones:
- El evento está `SCHEDULED` o `IN_PROGRESS`.
- El ciclo de vida del evento permite `COMPLETED`.
- Rol vigente con alcance sobre el evento.
Postcondiciones:
- Éxito: el evento queda `COMPLETED` con su composición propia y no se reabre; se habilita el resultado del partido para `PLAYED` o `FORFEIT`.
- Rechazo: el evento conserva su estado.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El entrenador o la Subcomisión solicita dejar constancia de que el evento se realizó.
2. GEI valida la autoridad y que el ciclo del evento permite `COMPLETED`.
3. El actor confirma la finalización.
4. GEI deja el evento `COMPLETED` con su composición propia, explicando la consecuencia, y habilita el registro del resultado del partido cuando el evento es `MATCH`.

Camino alternativo:
2.1. Si el ciclo del evento no permite `COMPLETED`, GEI rechaza la operación explicando el estado actual.
2.2. Si el actor no tiene alcance sobre el evento, GEI rechaza la operación sin modificar información.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-EVT-007` (P) · `REQ-EVT-008` (P) · `REQ-PRT-015` (S) · `REQ-PRT-013` (S) · `REQ-PRT-011` (S)
- Authority source: `RoleAssignment COACH` / `RoleAssignment SUBCOMMITTEE`
- Scope: `TEAM` / `EVENT` / `CLUB`
- Business rules: `REQ-PRT-015` — `PLAYED`/`FORFEIT` exigen `COMPLETED` · `REQ-PRT-011` — la asistencia puede cerrarse después de `COMPLETED`
- Estado / objeto afectado: `Event` `SCHEDULED`/`IN_PROGRESS → COMPLETED`; terminal, no se reabre
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: el paso `SCHEDULED → IN_PROGRESS` no es un CU: la asistencia abre en ambos estados. Es regla de ciclo de vida que gobierna este CU y `UC-EVT-10`.

---

## CASO DE USO: UC-EVT-10 · Abandonar un evento

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un entrenador autorizado o a la Subcomisión dejar constancia de que un evento empezado se suspendió y no se completa.
Actores:
- Actor principal: `ACT-COACH` · `ACT-SUBCOMMITTEE`
- Actores secundarios: —
Precondiciones:
- El evento está `IN_PROGRESS`.
- El ciclo de vida permite `ABANDONED`.
- Rol vigente con alcance sobre el evento.
Postcondiciones:
- Éxito: el evento queda `ABANDONED` con su composición propia; el resultado del partido, si se registra, debe ser `ABANDONED` y no hay estadísticas de partido real.
- Rechazo: el evento conserva su estado.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El entrenador o la Subcomisión solicita dejar constancia de que el evento no se puede completar.
2. GEI valida la autoridad y que el ciclo del evento permite `ABANDONED`.
3. El actor confirma el abandono.
4. GEI deja el evento `ABANDONED` con su composición propia, explicando la consecuencia.

Camino alternativo:
2.1. Si el ciclo del evento no permite `ABANDONED`, GEI rechaza la operación explicando el estado actual.
2.2. Si el actor no tiene alcance sobre el evento, GEI rechaza la operación sin modificar información.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-EVT-007` (P) · `REQ-EVT-008` (P) · `REQ-PRT-015` (P) · `REQ-PRT-016` (S)
- Authority source: `RoleAssignment COACH` / `RoleAssignment SUBCOMMITTEE`
- Scope: `TEAM` / `EVENT` / `CLUB`
- Business rules: `REQ-PRT-015` — resultado `ABANDONED` exige evento `ABANDONED` · `REQ-PRT-016` — estadísticas sólo de `PLAYED`
- Estado / objeto afectado: `Event` `IN_PROGRESS → ABANDONED`; terminal
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: separado de `UC-EVT-09` porque el resultado funcional difiere: `COMPLETED` habilita resultado real y estadísticas; `ABANDONED` impide ambas.

---

## CASO DE USO: UC-EVT-11 · Revisar el impacto de un cambio material

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un entrenador autorizado o a la Subcomisión saber a quién alcanza el cambio material que está por aplicar, con qué consecuencias, antes de confirmarlo.
Actores:
- Actor principal: `ACT-COACH` · `ACT-SUBCOMMITTEE`
- Actores secundarios: —
Precondiciones:
- Existe un cambio material propuesto.
- La operación que lo origina está autorizada.
Postcondiciones:
- Éxito: el actor vio las personas y roles alcanzados y las consecuencias con conteos derivados de los conjuntos reales, confirmó el cambio y el impacto se recalculó y revalidó al ejecutar.
- Rechazo: el cambio material no se aplica.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. GEI presenta, para el cambio material propuesto, las personas y roles alcanzados y las consecuencias, con conteos derivados de los conjuntos reales afectados.
2. El actor revisa el impacto presentado.
3. El actor confirma el cambio.
4. GEI recalcula y revalida el impacto en el momento de ejecutar y aplica el cambio con el impacto confirmado.

Camino alternativo:
4.1. Si el impacto al ejecutar es distinto del previsualizado, GEI rechaza la confirmación (`IMPACT_CHANGED`) y presenta el impacto nuevo para una nueva confirmación.
4.2. Si la vista previa de impacto venció, GEI rechaza la confirmación (`IMPACT_TOKEN_EXPIRED`) y exige revisar el impacto de nuevo.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-EVT-012` (P) · `REQ-EVT-011` (S) · `REQ-SYS-009` (S) · `REQ-IAM-016` (S) · `REQ-SYS-015` (S)
- Authority source: `RoleAssignment COACH` / `RoleAssignment SUBCOMMITTEE`
- Scope: `TEAM` / `EVENT` / `CLUB`
- Business rules: `REQ-SYS-015` — verdad de la superficie: conteos contados, sin cifras fijas · `REQ-SYS-009` — sin éxito falso
- Estado / objeto afectado: impacto sobre el conjunto alcanzable del evento o de la serie; token de impacto vigente
- Includes: Ninguno.
- Extends: Ninguno (este CU es el extensor congelado de `UC-EVT-04` y `UC-EVT-16`, y el incluido de `UC-EVT-05`, `UC-EVT-07` y `UC-EVT-08`).
- Notas de trazabilidad: cumplimenta el §25 del brief: comportamiento observable, REQ propio, especificación propia. `IWR-09` (conteos con cifras fijas) es defecto del CURRENT, no autoridad.

---

## CASO DE USO: UC-EVT-12 · Resolver un conflicto de edición concurrente

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un entrenador autorizado o a la Subcomisión no perder su trabajo ni pisar el de otro cuando dos personas editan el mismo evento y el recurso cambió en el servidor.
Actores:
- Actor principal: `ACT-COACH` · `ACT-SUBCOMMITTEE`
- Actores secundarios: `ACT-ADMIN` (sólo reconciliación y valla técnica)
Precondiciones:
- El actor tiene cambios locales pendientes.
- El servidor tiene una versión más reciente que la base del actor.
Postcondiciones:
- Éxito: el actor vio su base, sus cambios locales y la versión vigente del servidor, reconcilió los campos y el evento quedó con la versión decidida, sin fusión automática que pierda cambios.
- Rechazo: el evento conserva la versión vigente del servidor; el borrador del actor no se descarta silenciosamente.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. GEI detecta que la versión del evento cambió en el servidor al confirmar los cambios locales del actor.
2. GEI presenta la base del actor, sus cambios locales y la versión vigente del servidor.
3. El actor declara, campo por campo, qué valor conservar.
4. GEI aplica la versión reconciliada y confirma el resultado.

Camino alternativo:
3.1. Si un campo no puede declararse seguro de conservar, GEI lo marca en conflicto y el actor resuelve el valor final antes de continuar.
4.1. Si el actor descarta su borrador sin decidir los campos en conflicto, GEI exige confirmación explícita: el descarte no se hace silenciosamente.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-EVT-013` (P) · `REQ-SYS-017` (S) · `REQ-SYS-010` (S)
- Authority source: `RoleAssignment COACH` / `RoleAssignment SUBCOMMITTEE`
- Scope: `TEAM` / `EVENT` / `CLUB`
- Business rules: `REQ-SYS-017` — concurrencia optimista con versión esperada (`STALE_VERSION`) · sin sobrescritura genérica ni fusión automática
- Estado / objeto afectado: `Event` en conflicto reconciliado sobre la versión vigente
- Includes: Ninguno.
- Extends: Ninguno (este CU es el extensor congelado de `UC-EVT-04` `[STALE_VERSION]`).
- Notas de trazabilidad: `ACTOR-DECISION-02` opción (a) congelada: `ACT-ADMIN` participa de la valla, no inicia autoridad deportiva.

---

## CASO DE USO: UC-EVT-13 · Crear una serie de eventos

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un entrenador autorizado o a la Subcomisión programar de una vez un conjunto de eventos que se repiten, sin crear uno por vez.
Actores:
- Actor principal: `ACT-COACH` · `ACT-SUBCOMMITTEE`
- Actores secundarios: —
Precondiciones:
- Rol vigente con alcance.
- Los destinatarios son válidos.
- La serie define a lo sumo 366 ocurrencias.
Postcondiciones:
- Éxito: la serie queda `ACTIVE` con sus destinatarios y sus ocurrencias persistidos; nombre y estado quedan consultables.
- Rechazo: no se crea la serie ni sus ocurrencias.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. El entrenador o la Subcomisión inicia la creación de una serie de eventos.
2. GEI solicita los datos de la serie y de sus ocurrencias.
3. El actor define la serie: destinatarios, datos del evento y las fechas de cada ocurrencia.
4. GEI valida la autoridad, los destinatarios, las invariantes de cada ocurrencia y el límite de 366.
5. GEI registra la serie `ACTIVE` con sus destinatarios y ocurrencias en la misma operación.

Camino alternativo:
4.1. Si la serie definiría más de 366 ocurrencias, GEI rechaza la operación (`RECURRENCE_TOO_LARGE`).
4.2. Si el actor no tiene autoridad para los destinatarios declarados, GEI deniega la operación.
4.3. Si las invariantes de fecha u horario no se cumplen en alguna ocurrencia, GEI rechaza la operación indicando la causa.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-EVT-014` (P) · `REQ-EVT-005` (S) · `REQ-EVT-001` (S) · `REQ-EVT-016` (S) · `REQ-COM-016` (S)
- Authority source: `RoleAssignment COACH` / `RoleAssignment SUBCOMMITTEE`
- Scope: `TEAM` / `EVENT` / `CLUB`
- Business rules: `REQ-EVT-016` — máximo 366 ocurrencias · `DEF-EVT-001`/`OUT-EVT-003` — sin generación automática de fechas: la serie se define, no se adivina
- Estado / objeto afectado: `EventSeries` nace `ACTIVE` con sus ocurrencias
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: los cambios sobre una serie se hacen por `UC-EVT-04` con sus tres alcances; el cierre por `UC-EVT-14`.

---

## CASO DE USO: UC-EVT-14 · Finalizar una serie de eventos

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un entrenador autorizado o a la Subcomisión cerrar un calendario que ya no se va a repetir, conservando lo que ya pasó.
Actores:
- Actor principal: `ACT-COACH` · `ACT-SUBCOMMITTEE`
- Actores secundarios: —
Precondiciones:
- La serie está `ACTIVE`.
- Rol vigente con alcance sobre la serie.
Postcondiciones:
- Éxito: la serie queda `ENDED` y conserva sus ocurrencias.
- Rechazo: la serie queda `ACTIVE`.
Puntos de Extensión:
- No posee.
Prioridad: P2

Camino básico:
1. El entrenador o la Subcomisión solicita finalizar una serie cuya temporada terminó.
2. GEI valida la autoridad y el estado `ACTIVE` de la serie.
3. El actor confirma la finalización.
4. GEI deja la serie `ENDED` conservando sus ocurrencias.

Camino alternativo:
2.1. Si la serie no está `ACTIVE`, GEI rechaza la operación explicando el estado actual.
2.2. Si el actor no tiene alcance sobre la serie, GEI rechaza la operación sin modificar información.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-EVT-016` (P) · `REQ-PPL-015` (S)
- Authority source: `RoleAssignment COACH` / `RoleAssignment SUBCOMMITTEE`
- Scope: `TEAM` / `EVENT` / `CLUB`
- Business rules: `ACTIVE → ENDED` sin transición inversa
- Estado / objeto afectado: `EventSeries` `ACTIVE → ENDED`
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: las ocurrencias individuales conservan su propio ciclo de vida.

---

## CASO DE USO: UC-EVT-15 · Programar una jornada

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un entrenador autorizado o a la Subcomisión dejar asentados de una sola vez los partidos de una fecha operativa, agrupados en bloque atómico.
Actores:
- Actor principal: `ACT-COACH` (alcance `TEAM`) · `ACT-SUBCOMMITTEE` (alcance `CLUB`)
- Actores secundarios: `ACT-ADMIN` (sólo valla técnica de dependencias, `ACTOR-DECISION-02`)
Precondiciones:
- Temporada y división válidas.
- Los partidos son válidos y de esa temporada.
- Cada partido pertenece, a lo sumo, a una jornada.
- Si la jornada tiene competencia, cada partido usa una inscripción de esa competencia con alcance compatible.
- La operación define a lo sumo 100 partidos.
Postcondiciones:
- Éxito: la jornada queda creada y los partidos quedan agrupados en bloque atómico; nunca queda una creación parcial.
- Rechazo: no se crea la jornada ni se agrupa ningún partido.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. El entrenador o la Subcomisión inicia la programación de una jornada con los partidos de una fecha operativa.
2. GEI solicita la temporada, la división, la competencia de la jornada cuando corresponda, y los partidos.
3. El actor proporciona hasta 100 partidos válidos de esa temporada, cada uno con su inscripción compatible cuando la jornada tiene competencia.
4. GEI valida la autoridad, la pertenencia única de cada partido, la temporada y las reglas de inscripción.
5. GEI crea la jornada y agrupa los partidos en un bloque atómico: el estado final persiste en la misma operación, sin creación parcial.

Camino alternativo:
3.1. Si el actor incluye más de 100 partidos, GEI rechaza la operación por límite de lote.
4.1. Si un partido es de otra temporada, GEI rechaza la operación explicándolo.
4.2. Si un partido ya está agrupado en otra jornada, GEI rechaza la operación por pertenencia única.
4.3. Si la jornada tiene competencia y un partido no usa una inscripción de esa competencia con alcance compatible, GEI rechaza la operación explicando la causa (`REQ-CMP-005`).
5.1. Si algún partido no puede validarse, GEI no crea nada: la operación es atómica, sin creación parcial.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-EVT-018` (P) · `REQ-EVT-024` (S) · `REQ-CMP-005` (S) · `REQ-EVT-003` (S) · `REQ-EVT-001` (S) · `REQ-SYS-018` (S)
- Authority source: `RoleAssignment COACH` / `RoleAssignment SUBCOMMITTEE`
- Scope: `TEAM` / `CLUB`
- Business rules: `REQ-EVT-018` — bulk ≤ 100 **atómico**; un partido, a lo sumo, una jornada · `REQ-SYS-018` — una orden, una transacción · la jornada no duplica el ciclo de vida de los partidos
- Estado / objeto afectado: jornada creada; partidos agrupados; sin transición de los partidos propios de la jornada
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: **mismatch documentado con el CURRENT** (E3 Audit §14): el prototipo sólo agrupa partidos preexistentes; `REQ-EVT-018` y PT §16 exigen la operación masiva atómica. La spec sigue la autoridad. `ACT-ADMIN` no inicia el cierre ni la creación (valla técnica).

---

## CASO DE USO: UC-EVT-16 · Actualizar la logística de un evento

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un entrenador autorizado, a la Subcomisión o a una capitana con autoridad propia dejar la información operativa de la salida —encuentro, salida, punto de encuentro, transporte, llegada— en el evento y no en mensajes sueltos.
Actores:
- Actor principal: `ACT-COACH` (alcance `TEAM` o `EVENT`) · `ACT-SUBCOMMITTEE` (alcance `CLUB`)
- Actores secundarios: `ACT-CAPTAIN` — actor alternativo autorizado, autoridad propia, scope `TEAM`
Precondiciones:
- El evento no está en estado terminal.
- El actor tiene alcance sobre el equipo o el evento.
Postcondiciones:
- Éxito: la logística queda registrada y es consultable por las personas alcanzadas; el cambio queda auditado.
- Rechazo: la logística del evento no cambia.
Puntos de Extensión:
- Cambio de campo coordinativo [MATERIAL_CHANGE]: cuando la actualización de logística toca además un campo coordinativo del evento, activa `UC-EVT-11` · Revisar el impacto de un cambio material.
Prioridad: P1

Camino básico:
1. El entrenador, la Subcomisión o la capitana del equipo solicita actualizar la logística de un evento de su alcance.
2. GEI valida la autoridad del actor y que el evento no está en estado terminal.
3. El actor proporciona la información operativa: hora de encuentro, hora de salida, punto de encuentro, nota de transporte e instrucciones de llegada.
4. GEI registra la logística en el evento, la deja consultable por las personas alcanzadas y audita el cambio.

Camino alternativo:
2.1. Si el evento está en estado terminal, GEI rechaza la operación: la logística no es editable.
2.2. Si el actor no tiene alcance sobre el equipo o el evento, GEI rechaza la operación sin modificar información. Una capitana sin `RoleAssignment CAPTAIN` vigente sobre el equipo no tiene acceso.
3.1. Si la actualización toca además un campo coordinativo del evento, se cumple [MATERIAL_CHANGE] y se activa `UC-EVT-11` · Revisar el impacto de un cambio material <<extend>>; confirmado el impacto, la revisión de coordinación sube y se notifica según las reglas de cambio material.
4.1. Si no hay logística registrada, GEI lo comunica con honestidad al consultar el evento, sin afirmar un valor por defecto.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-EVT-019` (P) · `REQ-EVT-011` (S) · `REQ-INS-009` (S) · `REQ-EVT-008` (S) · `REQ-STR-012` (S)
- Authority source: `RoleAssignment COACH` / `RoleAssignment CAPTAIN` / `RoleAssignment SUBCOMMITTEE`
- Scope: `TEAM` / `EVENT` / `CLUB`
- Business rules: `REQ-EVT-019` — la logística es consultable por los alcanzados; la ausencia se comunica con honestidad · PII: `ACT-CAPTAIN` no ve `DNI` ni administra nada más
- Estado / objeto afectado: `EventLogistics` registrada; evento terminal ⇒ logística no editable
- Includes: Ninguno.
- Extends: `UC-EVT-11` · Revisar el impacto de un cambio material ([MATERIAL_CHANGE], sólo si la logística toca además un campo coordinativo)
- Notas de trazabilidad: **único CU donde `ACT-CAPTAIN` puede iniciar** (PT §5 fila `Logistics`). Mismo objetivo, flujo y resultado que `ACT-COACH`/`ACT-SUBCOMMITTEE`: no se crea un CU paralelo.

---

## CASO DE USO: UC-EVT-17 · Consultar el calendario

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a cualquier persona con actor válido ver qué está agendado dentro de su alcance, con mes, filtros y vista coherentes con su navegación.
Actores:
- Actor principal: `ACT-AUTHENTICATED` (los 6 roles concretos, cada uno con su alcance)
- Actores secundarios: —
Precondiciones:
- La persona tiene actor válido: rol interno vigente o delegación con permiso.
Postcondiciones:
- Éxito: la persona ve los eventos dentro de su alcance, con mes, filtros y vista coherentes con la dirección de navegación; el botón atrás devuelve el mismo contexto.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. La persona abre su calendario.
2. GEI valida su actor y deriva su alcance.
3. GEI presenta los eventos dentro del alcance de la persona para el mes y los filtros vigentes de su navegación.

Camino alternativo:
3.1. Si no hay eventos dentro del alcance, GEI lo comunica explícitamente como estado resuelto, no como una lista vacía sin explicación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-EVT-020` (P) · `REQ-EVT-022` (S) · `REQ-SYS-013` (S) · `REQ-SYS-019` (S) · `REQ-EVT-008` (S) · `REQ-SYS-012` (S) · `REQ-STR-007` (S) · `REQ-SYS-014` (S)
- Authority source: `Account` + sesión + alcance derivado
- Scope: derivado del actor: `SELF`, `CHILD`, `TEAM`, `CLUB`
- Business rules: `REQ-SYS-019` — la proyección no es dueña de datos · `REQ-EVT-022` — coherencia entre proyecciones · `REQ-SYS-013` — el botón atrás devuelve el mismo contexto · `REQ-STR-007` — horario en la zona del evento
- Estado / objeto afectado: consulta sin mutación
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: el calendario es una proyección, no un dueño de datos. El botón «Nueva jornada» del CURRENT es un entry point, no parte del objetivo (E10).

---

## CASO DE USO: UC-EVT-18 · Revisar lo que requiere mi atención

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a cualquier persona con actor válido saber qué tiene que hacer ahora, en orden de urgencia, con el motivo, la consecuencia y la acción de cada pendiente.
Actores:
- Actor principal: `ACT-AUTHENTICATED` (los 6 roles concretos, cada uno con su alcance)
- Actores secundarios: —
Precondiciones:
- La persona tiene actor válido.
Postcondiciones:
- Éxito: la persona ve hasta 3 elementos, cada uno con motivo, consecuencia y acción, ordenados por urgencia; los irresolubles no aparecen.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. La persona abre su inicio.
2. GEI valida su actor y deriva su alcance.
3. GEI presenta hasta 3 elementos que requieren su atención, cada uno con motivo, consecuencia y acción, ordenados por urgencia.

Camino alternativo:
3.1. Si no hay pendientes dentro de su alcance, GEI lo comunica explícitamente en vez de mostrar una lista vacía sin explicación.
3.2. Si un pendiente es irresoluble por la persona, no aparece en su inicio (bajo el valor congelado (a) de `ACTOR-DECISION-01`, un conflicto de habilitación de la jugadora no llega a su inicio).

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-EVT-021` (P) · `REQ-PRT-003` (S) · `REQ-PRT-007` (S) · `REQ-SYS-007` (S) · `REQ-SYS-011` (S) · `REQ-EVT-022` (S) · `REQ-SYS-019` (S)
- Authority source: `Account` + sesión + alcance derivado
- Scope: derivado del actor
- Business rules: `REQ-SYS-019` — proyección sin escritura propia · `REQ-SYS-011` — vacío, cero y error son distintos · `REQ-EVT-022` — coherencia entre proyecciones
- Estado / objeto afectado: consulta sin mutación
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: `IWR-06` (bloque «En el equipo» de capitanía) es `ACCIDENTAL UI`: no hay REQ que lo pida.

---

## CASO DE USO: UC-EVT-19 · Consultar un evento

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a una persona alcanzada ver de un evento todo lo que necesita para cumplirlo: horario, sede, destinatarios, estado e historia.
Actores:
- Actor principal: `ACT-AUTHENTICATED` (los 6 roles concretos, cada uno con su alcance)
- Actores secundarios: —
Precondiciones:
- El evento está dentro del alcance de la persona.
Postcondiciones:
- Éxito: la persona ve horario, sede, destinatarios, estado e historia del evento según su alcance; los estados terminales muestran su composición propia con la consecuencia explicada.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. La persona solicita ver un evento.
2. GEI valida que el evento está dentro del alcance de la persona.
3. GEI presenta horario, sede, destinatarios, estado e historia del evento, con las superficies de participación que corresponden al tipo de evento y a la autoridad de la persona.

Camino alternativo:
2.1. Si la persona no tiene alcance sobre el evento por dirección directa, GEI no entrega contenido: la respuesta es de recurso no disponible, no un contenido recortado.
3.1. Si el evento está en estado terminal, GEI lo presenta con su composición propia y la consecuencia explicada, sin respuesta de disponibilidad como acción principal.
3.2. Si el evento no tiene logística registrada, GEI lo comunica con honestidad, sin afirmar un valor por defecto.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-EVT-023` (P) · `REQ-EVT-008` (S) · `REQ-EVT-019` (S) · `REQ-INS-011` (S) · `REQ-STR-012` (S) · `REQ-EVT-022` (S) · `REQ-PPL-011` (S) · `REQ-EVT-017` (S) · `REQ-STR-007` (S) · `REQ-STR-010` (S)
- Authority source: `Account` + sesión + alcance
- Scope: derivado del actor
- Business rules: `REQ-EVT-017` — la matriz de tipo decide qué superficies de participación existen · `REQ-PPL-011` — el campo no autorizado no existe en la respuesta · `REQ-STR-007` — horario en la zona del evento
- Estado / objeto afectado: consulta sin mutación
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: es el ancla de la superficie de participación: el tipo de evento decide qué hay disponible.

---

**Fin de las especificaciones EVT. 19 CU · `UC-EVT-01` … `UC-EVT-19`.**
