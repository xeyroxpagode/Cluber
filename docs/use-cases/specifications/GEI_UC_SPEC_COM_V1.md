# GEI HOCKEY MANAGEMENT SYSTEM
## UC SPECIFICATIONS — COM (Communication) V1

**Etapa:** 5 — Especificaciones de TODOS los casos de uso
**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-07
**Rama:** `gei/e5-use-case-specifications-freeze-v1`
**Plantilla:** `GEI_USE_CASE_SPECIFICATION_STANDARD_V1.md`
**CU:** 14 — `UC-COM-01` … `UC-COM-14`

> `UC-COM-14` es **SIBLING** de `UC-COM-13` (E4 V1.0.1 EXT-05): consultar no muta, marcar sí;
> sin arista entre ellos. `ACT-ADMIN` y `ACT-SUBCOMMITTEE` sólo participan de conversaciones con
> derecho comunicacional (`REQ-COM-012`); `ACT-GUARDIAN` no tiene accesorio comunicacional.

---

## CASO DE USO: UC-COM-01 · Redactar un comunicado

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la Subcomisión escribir un comunicado oficial del club y definir a quién va dirigido, como conjunto real de equipos o el club entero.
Actores:
- Actor principal: `ACT-SUBCOMMITTEE`
- Actores secundarios: —
Precondiciones:
- `RoleAssignment SUBCOMMITTEE` vigente.
Postcondiciones:
- Éxito: existe un comunicado en `DRAFT` con título, cuerpo y audiencia, con identificación completa de cada equipo destinatario.
- Rechazo: no queda ningún borrador.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. La Subcomisión inicia la redacción de un comunicado oficial.
2. GEI valida el `RoleAssignment SUBCOMMITTEE` vigente.
3. La Subcomisión escribe el título y el cuerpo, y elige la audiencia: el club entero o un conjunto real de equipos de las listas del club.
4. GEI registra el comunicado en `DRAFT` con su audiencia.

Camino alternativo:
2.1. Si quien intenta redactar es otro rol, incluida la administración, GEI deniega la operación: el comunicado oficial es sólo de la Subcomisión.
2.2. Si la audiencia no se expresa como conjunto real de equipos de las listas, GEI rechaza la operación: no existe audiencia en texto libre.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-COM-001` (P) · `REQ-COM-002` (S) · `REQ-STR-013` (S) · `REQ-SYS-007` (S)
- Authority source: `RoleAssignment SUBCOMMITTEE`
- Scope: `CLUB` / `TEAM_SET`
- Business rules: `REQ-COM-002` — audiencia como conjunto real, nunca texto libre · PT §5: `ACT-ADMIN` no publica comunicados oficiales
- Estado / objeto afectado: `Announcement` nace `DRAFT`
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: la publicación es `UC-COM-02`.

---

## CASO DE USO: UC-COM-02 · Publicar un comunicado

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la Subcomisión hacer que un comunicado llegue a su audiencia de forma oficial e inalterable, fijando la audiencia como snapshot.
Actores:
- Actor principal: `ACT-SUBCOMMITTEE`
- Actores secundarios: la audiencia alcanzada
Precondiciones:
- El comunicado está `DRAFT`.
- La audiencia es válida.
- `RoleAssignment SUBCOMMITTEE` vigente.
Postcondiciones:
- Éxito: el comunicado queda `PUBLISHED` y la audiencia queda fijada como snapshot inmutable; las personas alcanzadas quedan notificadas.
- Rechazo: el comunicado queda `DRAFT`.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. La Subcomisión solicita publicar el borrador de un comunicado.
2. GEI valida el `RoleAssignment SUBCOMMITTEE` vigente, el estado `DRAFT` y la audiencia.
3. La Subcomisión confirma la publicación.
4. GEI deja el comunicado `PUBLISHED`, fija la audiencia como snapshot inmutable y notifica a las personas alcanzadas con el tipo distinguible de comunicado publicado.

Camino alternativo:
2.1. Si el comunicado no está `DRAFT`, GEI rechaza la publicación.
2.2. Si quien intenta publicar es otro rol, GEI deniega la operación.
4.1. Si las afiliaciones del club cambian después, el snapshot de audiencia no cambia.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-COM-001` (P) · `REQ-COM-003` (P) · `REQ-COM-002` (S) · `REQ-COM-014` (S) · `REQ-COM-005` (S)
- Authority source: `RoleAssignment SUBCOMMITTEE`
- Scope: `CLUB` / `TEAM_SET`
- Business rules: `REQ-COM-003` — snapshot inmutable; cambiar la audiencia **no está disponible** · si la audiencia quedó mal, corresponde un comunicado nuevo (`REQ-COM-004` AC 3)
- Estado / objeto afectado: `Announcement` `DRAFT → PUBLISHED` con audiencia snapshot
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: «Consultar comunicado» no es include de publicar (`REJ-08`): actores y objetivos distintos.

---

## CASO DE USO: UC-COM-03 · Corregir un comunicado publicado

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la Subcomisión corregir un error de título o cuerpo de un comunicado publicado sin tocar a quién le llegó.
Actores:
- Actor principal: `ACT-SUBCOMMITTEE`
- Actores secundarios: la audiencia
Precondiciones:
- El comunicado está `PUBLISHED`.
- La corrección incluye motivo.
- `RoleAssignment SUBCOMMITTEE` vigente.
Postcondiciones:
- Éxito: título o cuerpo quedan corregidos; la audiencia no cambia; el texto anterior queda en historia.
- Rechazo: el comunicado queda como estaba.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. La Subcomisión identifica un error de texto en un comunicado publicado.
2. La Subcomisión indica la corrección y el motivo.
3. GEI valida la autoridad, el estado `PUBLISHED` y el motivo.
4. GEI corrige título o cuerpo, conserva el texto anterior en historia y mantiene la audiencia intacta.

Camino alternativo:
3.1. Si la corrección llega sin motivo, la operación no completa y GEI lo explica.
3.2. Si el error era de audiencia, GEI explica que la corrección no existe: corresponde un comunicado nuevo.
3.3. Si el comunicado no está `PUBLISHED`, GEI rechaza la operación explicando el estado.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-COM-004` (P) · `REQ-COM-003` (S) · `REQ-INS-011` (S) · `REQ-INS-009` (S) · `REQ-SYS-006` (S)
- Authority source: `RoleAssignment SUBCOMMITTEE`
- Scope: `CLUB`
- Business rules: la audiencia no cambia **nunca** en una corrección · el motivo se escribe en lenguaje de usuario
- Estado / objeto afectado: `Announcement` corregida; el texto anterior queda en historia
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: —

---

## CASO DE USO: UC-COM-04 · Archivar un comunicado

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la Subcomisión retirar un comunicado que ya no debe estar vigente, sin borrarlo.
Actores:
- Actor principal: `ACT-SUBCOMMITTEE`
- Actores secundarios: —
Precondiciones:
- El comunicado está `PUBLISHED`.
- `RoleAssignment SUBCOMMITTEE` vigente.
Postcondiciones:
- Éxito: el comunicado queda `ARCHIVED` y deja de estar vigente; su contenido y su historia se conservan.
- Rechazo: el comunicado queda `PUBLISHED`.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. La Subcomisión solicita archivar un comunicado que dejó de estar en vigor.
2. GEI valida el `RoleAssignment SUBCOMMITTEE` vigente y el estado `PUBLISHED`.
3. La Subcomisión confirma el archivado.
4. GEI archiva el comunicado conservando su contenido y su historia.

Camino alternativo:
2.1. Si el comunicado no está `PUBLISHED`, GEI rechaza la operación explicando el estado.
2.2. Si quien intenta archivar es otro rol, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-COM-001` (P) · `REQ-PPL-015` (S)
- Authority source: `RoleAssignment SUBCOMMITTEE`
- Scope: `CLUB`
- Business rules: nada con significado se elimina
- Estado / objeto afectado: `Announcement` `PUBLISHED → ARCHIVED`
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: —

---

## CASO DE USO: UC-COM-05 · Consultar un comunicado

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a una persona alcanzada por la audiencia leer un comunicado vigente que le toca.
Actores:
- Actor principal: `ACT-AUTHENTICATED` (cualquier rol concreto alcanzado por la audiencia)
- Actores secundarios: —
Precondiciones:
- El comunicado está `PUBLISHED`.
- La persona está en la audiencia fijada al publicar.
Postcondiciones:
- Éxito: la persona lee el contenido del comunicado.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. La persona solicita leer un comunicado que le corresponde.
2. GEI valida su sesión y que está dentro del snapshot de audiencia del comunicado.
3. GEI presenta el contenido del comunicado.

Camino alternativo:
2.1. Si la persona no está en la audiencia y llega por dirección directa, GEI no entrega contenido: la respuesta es de recurso no disponible, no un contenido recortado.
2.2. Si la persona no está en la audiencia, el comunicado no le aparece como disponible: lo no autorizado se oculta.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-COM-005` (P) · `REQ-PPL-011` (S) · `REQ-SYS-012` (S)
- Authority source: snapshot de audiencia
- Scope: derivado de la audiencia: `TEAM_SET` o `CLUB`
- Business rules: `ACT-ADMIN` no tiene acceso garantizado por su rol: lo tiene si está en la audiencia
- Estado / objeto afectado: consulta sin mutación
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: no es include de publicar (`REJ-08`).

---

## CASO DE USO: UC-COM-06 · Abrir una conversación directa

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a una persona con derecho comunicacional hablar con otra en un hilo propio de los dos, único por par.
Actores:
- Actor principal: `ACT-AUTHENTICATED` con derecho comunicacional: `ACT-PLAYER`, `ACT-CAPTAIN`, `ACT-COACH`
- Actores secundarios: la otra persona, si también tiene derecho comunicacional
Precondiciones:
- Ambos tienen derecho comunicacional.
- La otra persona es un candidato legítimo (`REQ-COM-013`).
Postcondiciones:
- Éxito: existe una única conversación directa con ese par canónico, o se abre la existente; el orden inverso encuentra la misma.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. La persona con derecho comunicacional solicita hablar con otra persona concreta.
2. GEI valida el derecho comunicacional del actor y de la otra persona.
3. GEI abre la conversación directa canónica del par, creándola si no existía.

Camino alternativo:
2.1. Si el actor no tiene derecho comunicacional, GEI deniega la operación: la administración y la Subcomisión sólo con entitlement comunicacional, el guardián sin accesorio.
2.2. Si la otra persona no es un candidato legítimo, GEI rechaza la operación explicando la causa.
3.1. Si ya existe una conversación directa con ese par, GEI abre la existente: máximo una por par canónico.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-COM-006` (P) · `REQ-COM-013` (S) · `REQ-COM-012` (S) · `REQ-PPL-004` (S)
- Authority source: `Account` + sesión + `REQ-COM-012`
- Scope: `SELF`
- Business rules: `REQ-COM-012` — derecho comunicacional automático para `PLAYER`, `CAPTAIN`, `COACH` · par canónico único, el orden inverso encuentra la misma
- Estado / objeto afectado: `Conversation` `DIRECT` única por par
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: la unicidad del directo es la que hace innecesario un botón anti-duplicado como CU.

---

## CASO DE USO: UC-COM-07 · Crear una conversación de grupo

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a una persona con derecho comunicacional hablar con varias personas en un hilo con título, que no depende de un equipo ni de un evento.
Actores:
- Actor principal: `ACT-AUTHENTICATED` con derecho comunicacional: `ACT-PLAYER`, `ACT-CAPTAIN`, `ACT-COACH`
- Actores secundarios: los participantes elegidos
Precondiciones:
- El grupo tiene al menos 2 participantes.
- El grupo tiene título.
- Los candidatos son personas con las que puede hablar legítimamente.
Postcondiciones:
- Éxito: existe un grupo con título y participantes; varios grupos entre las mismas personas están permitidos.
- Rechazo: no se crea ningún grupo.
Puntos de Extensión:
- No posee.
Prioridad: P2

Camino básico:
1. La persona con derecho comunicacional inicia la creación de un grupo.
2. GEI valida el derecho comunicacional del actor.
3. La persona elige a los participantes y escribe el título del grupo.
4. GEI valida el mínimo de 2 participantes, el título y la legitimidad de los candidatos.
5. GEI crea la conversación de grupo `ACTIVE`.

Camino alternativo:
2.1. Si el actor no tiene derecho comunicacional, GEI deniega la operación.
4.1. Si el grupo tendría menos de 2 participantes, GEI rechaza la operación.
4.2. Si el actor no informa el título, GEI rechaza la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-COM-007` (P) · `REQ-COM-013` (S) · `REQ-COM-012` (S)
- Authority source: `Account` + sesión + `REQ-COM-012`
- Scope: `SELF`
- Business rules: grupos múltiples entre las mismas personas permitidos · `OUT-COM-002` — la gestión de participantes y salir del grupo **no** es de V1
- Estado / objeto afectado: `Conversation` `GROUP` `ACTIVE`
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: no hay CU «gestionar participantes de grupo» (`OUT-COM-002`).

---

## CASO DE USO: UC-COM-08 · Abrir la conversación canónica del equipo o del evento

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a una persona con derecho comunicacional hablar con quienes participan en un equipo o en un evento, sin crear un hilo nuevo cada vez.
Actores:
- Actor principal: `ACT-AUTHENTICATED` con derecho comunicacional: `ACT-PLAYER`, `ACT-CAPTAIN`, `ACT-COACH`
- Actores secundarios: los participantes con acceso vigente
Precondiciones:
- El equipo o el evento está en alcance del actor.
- El actor tiene derecho comunicacional.
Postcondiciones:
- Éxito: existe una conversación canónica por equipo o por evento (`0..1` cada una), con título derivado del objeto real; si no existía, se abre la existente al primer uso.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. La persona con derecho comunicacional solicita hablar sobre un equipo o un evento de su alcance.
2. GEI valida el derecho comunicacional del actor y el alcance sobre el objeto.
3. GEI abre la conversación canónica del equipo o del evento, creándola si no existía, con el título derivado del objeto real.

Camino alternativo:
2.1. Si el actor no tiene alcance sobre el equipo o el evento, GEI deniega la operación.
2.2. Si el actor no tiene derecho comunicacional, GEI deniega la operación.
3.1. Si el evento cambia, el título de la conversación refleja el dato vigente.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-COM-008` (P) · `REQ-COM-013` (S) · `REQ-COM-006` (S) · `REQ-COM-011` (S) · `REQ-COM-012` (S)
- Authority source: `Account` + sesión + `REQ-COM-012`
- Scope: `TEAM` / `EVENT`
- Business rules: máximo una canónica por equipo y una por evento · título derivado del objeto real · acceso temporal por `joined_at`/`left_at`
- Estado / objeto afectado: `Conversation` `TEAM`/`EVENT` canónica
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: la primera vez se crea; las siguientes se abre la existente: el objetivo es uno (§16 del brief de E3).

---

## CASO DE USO: UC-COM-09 · Enviar un mensaje

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un participante decir algo en una conversación, con el mensaje persistido y visible para los participantes autorizados.
Actores:
- Actor principal: `ACT-AUTHENTICATED` con derecho comunicacional, participante de la conversación
- Actores secundarios: los demás participantes dentro de su período autorizado
Precondiciones:
- El actor participa de la conversación.
- Su acceso es vigente.
Postcondiciones:
- Éxito: el mensaje queda persistido y visible para los participantes autorizados.
- Rechazo: el mensaje no queda registrado; sin estado de envío no se afirma éxito.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El participante escribe su mensaje en la conversación.
2. GEI valida su participación y su período de acceso vigente.
3. GEI persiste el mensaje y lo deja visible para los participantes autorizados.

Camino alternativo:
2.1. Si el actor no participa de la conversación, GEI deniega la operación.
2.2. Si el envío falla, GEI reintenta sin duplicar: nunca se afirma éxito sin confirmación.
2.3. Si el actor no tiene acceso a la historia anterior a su ingreso, GEI no se la presenta.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-COM-009` (P) · `REQ-COM-011` (S) · `REQ-COM-012` (S) · `REQ-COM-017` (S) · `REQ-SYS-016` (S) · `REQ-PPL-004` (S)
- Authority source: participación + período autorizado
- Scope: `SELF`
- Business rules: `REQ-COM-017` — enviar un mensaje no genera notificación · `REQ-SYS-016` — reintento idempotente sin duplicar · `OUT-COM-001`, `DEF-COM-002/003/004` — sin confirmaciones de lectura, sin silenciar, sin menciones, sin respuestas anidadas
- Estado / objeto afectado: `Message` persistido
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: «Archivar conversación» no es include de enviar (`REJ-09`).

---

## CASO DE USO: UC-COM-10 · Editar un mensaje propio

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a una persona corregir un mensaje que ella misma escribió, dejando la corrección visible con su historia.
Actores:
- Actor principal: `ACT-AUTHENTICATED` (sólo sobre mensajes propios)
- Actores secundarios: —
Precondiciones:
- El mensaje es del actor.
- El actor tiene acceso vigente a la conversación.
Postcondiciones:
- Éxito: el mensaje refleja la corrección, exponiendo su historia con fecha real y actor.
- Rechazo: el mensaje queda como estaba.
Puntos de Extensión:
- No posee.
Prioridad: P2

Camino básico:
1. La persona solicita corregir un mensaje propio.
2. GEI valida la autoría del mensaje y el acceso vigente a la conversación.
3. La persona escribe la corrección.
4. GEI aplica la corrección y registra su historia con fecha real y actor.

Camino alternativo:
2.1. Si el mensaje es de otra persona, GEI no ofrece la operación: un mensaje ajeno no tiene edición.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-COM-010` (P) · `REQ-INS-011` (S)
- Authority source: autoría propia
- Scope: `SELF`
- Business rules: el mensaje editado expone su historia
- Estado / objeto afectado: `Message` propia corregida
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: —

---

## CASO DE USO: UC-COM-11 · Eliminar un mensaje propio

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a una persona retirar un mensaje propio que no debe seguir visible, de forma irreversible y con confirmación y motivo.
Actores:
- Actor principal: `ACT-AUTHENTICATED` (sólo sobre mensajes propios)
- Actores secundarios: —
Precondiciones:
- El mensaje es del actor.
- La operación incluye confirmación con motivo: es irreversible.
Postcondiciones:
- Éxito: el mensaje queda como *tombstone*: el hecho de que existió y que se borró permanece, el contenido desaparece.
- Rechazo: el mensaje queda como estaba.
Puntos de Extensión:
- No posee.
Prioridad: P2

Camino básico:
1. La persona solicita eliminar un mensaje propio.
2. GEI valida la autoría y exige la confirmación con motivo.
3. La persona confirma la eliminación con su motivo.
4. GEI deja el mensaje como *tombstone*: el contenido desaparece y el hecho de su existencia y borrado permanece.

Camino alternativo:
2.1. Si el mensaje es de otra persona, GEI no ofrece la operación.
3.1. Si la persona no confirma con motivo, la operación no se ejecuta: lo peligroso va separado y con confirmación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-COM-010` (P) · `REQ-PPL-015` (S) · `REQ-SYS-007` (S)
- Authority source: autoría propia
- Scope: `SELF`
- Business rules: irreversible ⇒ confirmación con motivo · el *tombstone* hace el objetivo observable distinto de «nunca se escribió»
- Estado / objeto afectado: `Message` propia como *tombstone*
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: —

---

## CASO DE USO: UC-COM-12 · Archivar una conversación de grupo

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un participante retirar un grupo que ya no se usa, sin borrar lo que se dijo en él.
Actores:
- Actor principal: `ACT-AUTHENTICATED`, participante del grupo
- Actores secundarios: los demás participantes
Precondiciones:
- La conversación es de tipo `GROUP` y está `ACTIVE`.
- El actor participa del grupo.
Postcondiciones:
- Éxito: la conversación queda archivada; el contenido y el período de cada participante se conservan.
- Rechazo: la conversación queda `ACTIVE`.
Puntos de Extensión:
- No posee.
Prioridad: P2

Camino básico:
1. El participante solicita archivar una conversación de grupo que dejó de servir.
2. GEI valida que la conversación es `GROUP`, está `ACTIVE` y que el actor participa.
3. El participante confirma el archivado.
4. GEI archiva la conversación conservando el contenido y el período de cada participante.

Camino alternativo:
2.1. Si la conversación es directa o canónica, GEI rechaza la operación: ningún REQ expresa archivar esos tipos.
2.2. Si la conversación ya está archivada, GEI rechaza la operación explicando el estado.
2.3. Si el actor no participa del grupo, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-COM-007` (P, AC 4) · `REQ-COM-011` (S)
- Authority source: participación + `Account` + sesión
- Scope: `SELF`
- Business rules: el ex-participante conserva su período · no existe CU de archivar conversación directa ni canónica
- Estado / objeto afectado: `Conversation` `GROUP` `ACTIVE → ARCHIVED`
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: existe por `REQ-COM-007` AC 4 literal.

---

## CASO DE USO: UC-COM-13 · Consultar mis notificaciones

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a una persona saber qué novedades la afectan: sus notificaciones con destinatario, tipo, recurso, origen y fecha, con las no leídas primero.
Actores:
- Actor principal: `ACT-AUTHENTICATED` (los 6 roles concretos)
- Actores secundarios: —
Precondiciones:
- Sesión vigente.
Postcondiciones:
- Éxito: la persona ve sus notificaciones con destinatario, tipo en lenguaje de usuario, recurso, origen y fecha; las no leídas primero; la combinación origen + destinatario + tipo no se repite.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. La persona consulta sus notificaciones.
2. GEI valida su sesión.
3. GEI presenta sus notificaciones, con las no leídas primero y el tipo en lenguaje de usuario.

Camino alternativo:
3.1. Si no hay notificaciones, GEI lo comunica explícitamente en lugar de mostrar una lista vacía sin explicación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-COM-018` (P) · `REQ-COM-014` (P) · `REQ-COM-015` (S) · `REQ-COM-016` (S) · `REQ-COM-017` (S) · `REQ-SYS-015` (S) · `REQ-SYS-013` (S) · `REQ-SYS-024` (S)
- Authority source: `Account` + sesión
- Scope: derivado del actor
- Business rules: sólo **7 tipos** — posponer, reprogramar, cancelar, restaurar, alta/baja en convocatoria, comunicado publicado, y los derivados de cambio de destinatarios · `REQ-COM-017` — lista negativa cerrada: disponibilidad, asistencia, mensaje y corrección menor no notifican · clave lógica única origen + destinatario + tipo
- Estado / objeto afectado: consulta sin mutación
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: `IWR-07` (marcar todas) e `IWR-08` (filtro Todas/Sin leer) son `ACCIDENTAL UI`: la presentación de `REQ-COM-018` los cubre. No hay CU de preferencias de notificación (`DEF-IAM-001`).

---

## CASO DE USO: UC-COM-14 · Marcar una notificación como leída

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a una persona dar por vista una notificación que ya leyó, sin salir de la lista.
Actores:
- Actor principal: `ACT-AUTHENTICATED` (los 6 roles concretos)
- Actores secundarios: —
Precondiciones:
- La notificación pertenece a la persona.
- La notificación no estaba leída.
Postcondiciones:
- Éxito: la notificación queda registrada como leída sin salir de la lista; la combinación origen + destinatario + tipo no se rompe ni se duplica.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. La persona marca como leída una notificación que ya vio.
2. GEI valida que la notificación es suya y no estaba leída.
3. GEI registra la marca de lectura sin que la persona salga de la lista.

Camino alternativo:
2.1. Si la notificación ya estaba leída, GEI lo comunica sin duplicar la marca.
2.2. Si la notificación es de otra persona, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-COM-018` (P) · `REQ-SYS-013` (S)
- Authority source: `Account` + sesión
- Scope: derivado del actor
- Business rules: el botón atrás devuelve el contexto de la lista
- Estado / objeto afectado: `Notification` propia con `read_at` registrada
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: SIBLING de `UC-COM-13` (E4 EXT-05): consultar no muta, marcar sí — resultado observable distinto.

---

**Fin de las especificaciones COM. 14 CU · `UC-COM-01` … `UC-COM-14`.**
