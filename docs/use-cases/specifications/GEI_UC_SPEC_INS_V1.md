# GEI HOCKEY MANAGEMENT SYSTEM
## UC SPECIFICATIONS — INS (Search / Reports / Audit) V1

**Etapa:** 5 — Especificaciones de TODOS los casos de uso
**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-07
**Rama:** `gei/e5-use-case-specifications-freeze-v1`
**Plantilla:** `GEI_USE_CASE_SPECIFICATION_STANDARD_V1.md`
**CU:** 5 — `UC-INS-01` … `UC-INS-05`

---

## CASO DE USO: UC-INS-01 · Buscar en el club

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a cualquier persona con actor válido encontrar una persona, un equipo, un evento o una división o línea del club sin recorrer todo.
Actores:
- Actor principal: `ACT-AUTHENTICATED` (los 6 roles concretos)
- Actores secundarios: —
Precondiciones:
- La persona tiene actor válido: rol interno vigente o delegación con permiso.
Postcondiciones:
- Éxito: la persona ve resultados de personas, equipos, eventos y divisiones o líneas dentro de su alcance; «sin consulta» es distinto de «cero resultados».
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. La persona busca algo del club.
2. GEI valida su actor y deriva su alcance.
3. La persona escribe su consulta.
4. GEI presenta los resultados de personas, equipos, eventos y divisiones o líneas dentro del alcance, respetando la autoridad por campo; la estructura se busca por división y línea.

Camino alternativo:
4.1. Si buscó y no hay resultados, GEI lo dice y ofrece el siguiente paso.
4.2. Si todavía no buscó, GEI no afirma que no hay nada: «sin consulta» ≠ «cero resultados».

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-INS-001` (P) · `REQ-INS-002` (S) · `REQ-INS-003` (S) · `REQ-PPL-011` (S) · `REQ-SYS-013` (S) · `REQ-SYS-011` (S) · `REQ-SYS-019` (S) · `REQ-STR-010` (S) · `REQ-SYS-023` (S)
- Authority source: `Account` + sesión + `REQ-PPL-011`
- Scope: derivado del actor
- Business rules: `REQ-PPL-011` — los resultados respetan la autoridad por campo: el campo no autorizado **no existe** en la respuesta · la consulta sobrevive al botón atrás y se reproduce por dirección directa · la búsqueda es una proyección sin escritura propia
- Estado / objeto afectado: consulta sin mutación
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: un CU para los tres REQ: alcance, PII y persistencia son reglas del mismo objetivo.

---

## CASO DE USO: UC-INS-02 · Consultar el informe de asistencia

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un entrenador, a la Subcomisión, a una jugadora o a una capitana si corresponde ver cómo se dio la asistencia en un período, con cada fila enlazada al hecho que la originó.
Actores:
- Actor principal: `ACT-COACH` (alcance `TEAM`) · `ACT-SUBCOMMITTEE` (alcance `CLUB`) · `ACT-PLAYER` (sólo lo propio) · `ACT-CAPTAIN` (`TEAM` si corresponde)
- Actores secundarios: —
Precondiciones:
- El actor tiene alcance.
- El período aplicado es visible.
Postcondiciones:
- Éxito: el informe distingue presente, ausente, justificada y sin registrar; lo no registrado nunca se cuenta como ausente; la jugadora ve sólo lo suyo; cada fila enlaza al hecho que la originó.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. El actor solicita el informe de asistencia de un período.
2. GEI valida la autoridad y deriva el alcance del actor.
3. El actor ajusta el período aplicado, que es visible y modificable.
4. GEI presenta la asistencia del período dentro del alcance, distinguiendo presente, ausente, justificada y sin registrar, con cada fila enlazada al hecho que la originó.

Camino alternativo:
2.1. Si el actor es `ACT-ADMIN`, GEI deniega el acceso de forma explícita: es una denegación, no una omisión.
2.2. Si quien consulta es la jugadora, GEI presenta sólo su propia asistencia.
2.3. Si no hay registros en el período, GEI lo comunica explícitamente: vacío ≠ cero ≠ error.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-INS-004` (P) · `REQ-INS-006` (S) · `REQ-INS-007` (S) · `REQ-PRT-010` (S) · `REQ-PRT-012` (S) · `REQ-SYS-011` (S)
- Authority source: `RoleAssignment COACH` / `SUBCOMMITTEE` / `PLAYER` / `CAPTAIN`
- Scope: `TEAM` / `CLUB` / `SELF`
- Business rules: `REQ-PRT-010` — lo no registrado es un estado propio, nunca se cuenta como ausente · el antes y el después de una corrección son visibles (`REQ-PRT-012`) · el enlace respeta la autoridad
- Estado / objeto afectado: consulta sin mutación
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: `ACTOR-FEEDBACK-03` resuelto: `ACT-CAPTAIN` con `TEAM` «si corresponde» (PT §5). Sin exportación (`OUT-INS-001`).

---

## CASO DE USO: UC-INS-03 · Consultar el informe de rendimiento

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un entrenador, a la Subcomisión, a una jugadora o a una capitana si corresponde ver cómo rindieron las jugadoras en un período, con los partidos jugados derivados del resultado.
Actores:
- Actor principal: `ACT-COACH` (alcance `TEAM`) · `ACT-SUBCOMMITTEE` (alcance `CLUB`) · `ACT-PLAYER` (sólo lo propio) · `ACT-CAPTAIN` (`TEAM` si corresponde)
- Actores secundarios: —
Precondiciones:
- El actor tiene alcance.
- El período aplicado es visible.
Postcondiciones:
- Éxito: el informe presenta el rendimiento del período dentro del alcance; los partidos jugados se derivan del resultado, nunca de la asistencia; la jugadora ve sólo lo suyo; cada fila enlaza al partido que la originó.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. El actor solicita el informe de rendimiento de un período.
2. GEI valida la autoridad y deriva el alcance del actor.
3. El actor ajusta el período aplicado, que es visible y modificable.
4. GEI presenta el rendimiento del período dentro del alcance, con los partidos jugados derivados del resultado y cada fila enlazada al partido que la originó.

Camino alternativo:
2.1. Si el actor es `ACT-ADMIN`, GEI deniega el acceso de forma explícita.
2.2. Si quien consulta es la jugadora, GEI presenta sólo su propio rendimiento.
2.3. Si no hay partidos en el período, GEI lo comunica explícitamente: vacío ≠ cero ≠ error.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-INS-005` (P) · `REQ-INS-006` (S) · `REQ-INS-007` (S) · `REQ-PRT-016` (S) · `REQ-PRT-013` (S) · `REQ-PRT-014` (S)
- Authority source: `RoleAssignment COACH` / `SUBCOMMITTEE` / `PLAYER` / `CAPTAIN`
- Scope: `TEAM` / `CLUB` / `SELF`
- Business rules: partidos jugados derivados del resultado (`REQ-PRT-016`) · el marcador corregido queda visible junto con la evidencia (`REQ-PRT-014`)
- Estado / objeto afectado: consulta sin mutación
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: no fusionado con `UC-PRT-11`: aquél es por partido con autoridad deportiva; éste es agregado y transversal. Sin exportación (`OUT-INS-001`); sin motor de estadísticas configurable (`OUT-CMP-002`).

---

## CASO DE USO: UC-INS-04 · Consultar el historial de un objeto

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a cualquier persona con actor válido entender qué pasó con una cosa y cuándo, en la superficie donde la está mirando: correcciones, revisiones y estados con fecha real y actor.
Actores:
- Actor principal: `ACT-AUTHENTICATED` (los 6 roles concretos, cada uno con su alcance)
- Actores secundarios: —
Precondiciones:
- El objeto está en alcance de la persona.
- La persona tiene actor válido.
Postcondiciones:
- Éxito: en la superficie que corresponde, la persona ve las correcciones de asistencia, las correcciones de resultado, las revisiones publicadas de convocatoria, las líneas de historia del evento, las correcciones de comunicado y el estado de mensajes editados o borrados, con fecha real y actor.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. La persona consulta la historia de un objeto en la superficie donde lo está mirando.
2. GEI valida su actor y que el objeto está en su alcance.
3. GEI presenta la historia del objeto derivada de las entidades y de la auditoría: correcciones de asistencia con antes y después, correcciones de resultado con marcador anterior, revisiones de convocatoria, historia del evento, correcciones de comunicado y estado de mensajes editados o borrados.

Camino alternativo:
2.1. Si el objeto no está en alcance, GEI no entrega contenido.
3.1. Si el objeto no tiene historia registrada, GEI lo comunica explícitamente en lugar de mostrar un vacío sin explicación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-INS-011` (P) · `REQ-INS-012` (S) · `REQ-INS-009` (S) · `REQ-EVT-008` (S) · `REQ-PPL-015` (S)
- Authority source: `Account` + sesión + alcance
- Scope: derivado del actor
- Business rules: `REQ-INS-012` — no hay tabla genérica ni línea de tiempo personal; la historia se deriva de las entidades y de la auditoría · fecha real y actor en cada línea
- Estado / objeto afectado: consulta sin mutación
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: un CU con 6 alternativas de superficie, no 6 CU: el objetivo —comprender qué pasó— es el mismo. No fusionado con `UC-INS-05`: actores, authority y goals distintos. La corrección **produce** historia; no hay include de historial en las correcciones (`REJ-07`).

---

## CASO DE USO: UC-INS-05 · Consultar la auditoría administrativa

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración revisar qué cambió en el club, quién lo cambió y por qué, con filtros por rango de fechas y por actor, en modo de sólo lectura.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- `RoleAssignment ADMIN` vigente.
Postcondiciones:
- Éxito: la administración ve qué cambió, quién, cuándo, el motivo cuando la acción lo exige y el enlace al objeto; los datos sensibles aparecen redactados.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. La administración consulta la auditoría del club.
2. GEI valida el `RoleAssignment ADMIN` vigente.
3. La administración filtra por rango de fechas y por actor.
4. GEI presenta las entradas: qué cambió, quién, cuándo, el motivo cuando la acción lo exige y el enlace al objeto, con los datos sensibles redactados.

Camino alternativo:
2.1. Si el actor no es `ACT-ADMIN`, GEI deniega la operación con explicación: `ACT-SUBCOMMITTEE` y `ACT-GUARDIAN` no ven auditoría.
4.1. Si no hay entradas en el filtro aplicado, GEI lo comunica explícitamente.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-INS-008` (P) · `REQ-INS-009` (P) · `REQ-INS-010` (S) · `REQ-SYS-020` (S) · `REQ-PPL-011` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: sólo lectura agregada: no existe modificación ni eliminación de entradas · `REQ-SYS-020` — sin contraseñas, hashes, tokens, cookies, cuerpos de mensaje ni documentos · datos sensibles redactados
- Estado / objeto afectado: consulta sin mutación
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: único actor `ACT-ADMIN`. Sin exportación (`OUT-INS-001`); sin línea de tiempo personal (`OUT-SYS-001`).

---

**Fin de las especificaciones INS. 5 CU · `UC-INS-01` … `UC-INS-05`.**
