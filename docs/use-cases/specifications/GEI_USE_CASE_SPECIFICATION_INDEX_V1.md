# GEI HOCKEY MANAGEMENT SYSTEM
## USE CASE SPECIFICATION INDEX V1

**Etapa:** 5 — Especificaciones de TODOS los casos de uso
**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-07
**Rama:** `gei/e5-use-case-specifications-freeze-v1`
**Generado por:** `scripts/generate-use-case-spec-artifacts.mjs` — 102 filas, una por CU canónico.

| UC ID | Nombre | Dominio | Actor/es | Archivo | Camino básico — pasos | Alternativas | Prioridad | Include/Extend | REQ (P) | QA |
|---|---|---|---|---|---:|---:|---|---|---|---|
| `UC-CMP-01` | Registrar una competencia | CMP | ACT-SUBCOMMITTEE, ACT-ADMIN | GEI_UC_SPEC_CMP_V1.md | 4 | 2 | P1 | — | `REQ-CMP-001` | PASS |
| `UC-CMP-02` | Activar una competencia | CMP | ACT-SUBCOMMITTEE, ACT-ADMIN | GEI_UC_SPEC_CMP_V1.md | 4 | 3 | P1 | — | `REQ-CMP-001` | PASS |
| `UC-CMP-03` | Cerrar una competencia | CMP | ACT-SUBCOMMITTEE, ACT-ADMIN | GEI_UC_SPEC_CMP_V1.md | 4 | 3 | P1 | — | `REQ-CMP-002` | PASS |
| `UC-CMP-04` | Inscribir un equipo en una competencia | CMP | ACT-SUBCOMMITTEE, ACT-ADMIN | GEI_UC_SPEC_CMP_V1.md | 4 | 4 | P1 | — | `REQ-CMP-003` | PASS |
| `UC-CMP-05` | Inscribir una línea en una competencia | CMP | ACT-SUBCOMMITTEE, ACT-ADMIN | GEI_UC_SPEC_CMP_V1.md | 4 | 4 | P1 | — | `REQ-CMP-003` | PASS |
| `UC-CMP-06` | Activar una inscripción en una competencia | CMP | ACT-SUBCOMMITTEE, ACT-ADMIN | GEI_UC_SPEC_CMP_V1.md | 4 | 3 | P1 | — | `REQ-CMP-003` | PASS |
| `UC-CMP-07` | Finalizar una inscripción en una competencia | CMP | ACT-SUBCOMMITTEE, ACT-ADMIN | GEI_UC_SPEC_CMP_V1.md | 4 | 3 | P1 | — | `REQ-CMP-003` | PASS |
| `UC-CMP-08` | Registrar una referencia externa | CMP | ACT-SUBCOMMITTEE, ACT-ADMIN | GEI_UC_SPEC_CMP_V1.md | 4 | 3 | P2 | — | `REQ-CMP-006` | PASS |
| `UC-CMP-09` | Consultar una referencia externa | CMP | ACT-COACH (lectura), ACT-SUBCOMMITTEE, ACT-ADMIN | GEI_UC_SPEC_CMP_V1.md | 3 | 2 | P2 | — | `REQ-CMP-006` | PASS |
| `UC-COM-01` | Redactar un comunicado | COM | ACT-SUBCOMMITTEE | GEI_UC_SPEC_COM_V1.md | 4 | 2 | P0 | — | `REQ-COM-001` | PASS |
| `UC-COM-02` | Publicar un comunicado | COM | ACT-SUBCOMMITTEE | GEI_UC_SPEC_COM_V1.md | 4 | 3 | P0 | — | `REQ-COM-001` | PASS |
| `UC-COM-03` | Corregir un comunicado publicado | COM | ACT-SUBCOMMITTEE | GEI_UC_SPEC_COM_V1.md | 4 | 3 | P1 | — | `REQ-COM-004` | PASS |
| `UC-COM-04` | Archivar un comunicado | COM | ACT-SUBCOMMITTEE | GEI_UC_SPEC_COM_V1.md | 4 | 2 | P0 | — | `REQ-COM-001` | PASS |
| `UC-COM-05` | Consultar un comunicado | COM | ACT-AUTHENTICATED (cualquier rol concreto alcanzado por la audiencia) | GEI_UC_SPEC_COM_V1.md | 3 | 2 | P0 | — | `REQ-COM-005` | PASS |
| `UC-COM-06` | Abrir una conversación directa | COM | ACT-AUTHENTICATED con derecho comunicacional: ACT-PLAYER, ACT-CAPTAIN, ACT-COACH | GEI_UC_SPEC_COM_V1.md | 3 | 3 | P1 | — | `REQ-COM-006` | PASS |
| `UC-COM-07` | Crear una conversación de grupo | COM | ACT-AUTHENTICATED con derecho comunicacional: ACT-PLAYER, ACT-CAPTAIN, ACT-COACH | GEI_UC_SPEC_COM_V1.md | 5 | 3 | P2 | — | `REQ-COM-007` | PASS |
| `UC-COM-08` | Abrir la conversación canónica del equipo o del evento | COM | ACT-AUTHENTICATED con derecho comunicacional: ACT-PLAYER, ACT-CAPTAIN, ACT-COACH | GEI_UC_SPEC_COM_V1.md | 3 | 3 | P1 | — | `REQ-COM-008` | PASS |
| `UC-COM-09` | Enviar un mensaje | COM | ACT-AUTHENTICATED con derecho comunicacional, participante de la conversación | GEI_UC_SPEC_COM_V1.md | 3 | 3 | P0 | — | `REQ-COM-009` | PASS |
| `UC-COM-10` | Editar un mensaje propio | COM | ACT-AUTHENTICATED (sólo sobre mensajes propios) | GEI_UC_SPEC_COM_V1.md | 4 | 1 | P2 | — | `REQ-COM-010` | PASS |
| `UC-COM-11` | Eliminar un mensaje propio | COM | ACT-AUTHENTICATED (sólo sobre mensajes propios) | GEI_UC_SPEC_COM_V1.md | 4 | 2 | P2 | — | `REQ-COM-010` | PASS |
| `UC-COM-12` | Archivar una conversación de grupo | COM | ACT-AUTHENTICATED, participante del grupo | GEI_UC_SPEC_COM_V1.md | 4 | 3 | P2 | — | `REQ-COM-007` | PASS |
| `UC-COM-13` | Consultar mis notificaciones | COM | ACT-AUTHENTICATED (los 6 roles concretos) | GEI_UC_SPEC_COM_V1.md | 3 | 1 | P1 | — | `REQ-COM-018` | PASS |
| `UC-COM-14` | Marcar una notificación como leída | COM | ACT-AUTHENTICATED (los 6 roles concretos) | GEI_UC_SPEC_COM_V1.md | 3 | 2 | P1 | — | `REQ-COM-018` | PASS |
| `UC-EVT-01` | Crear un entrenamiento | EVT | ACT-COACH (alcance TEAM o EVENT), ACT-SUBCOMMITTEE (alcance CLUB) | GEI_UC_SPEC_EVT_V1.md | 5 | 3 | P0 | — | `REQ-EVT-002` | PASS |
| `UC-EVT-02` | Crear un partido | EVT | ACT-COACH (alcance TEAM), ACT-SUBCOMMITTEE (alcance CLUB) | GEI_UC_SPEC_EVT_V1.md | 5 | 4 | P0 | — | `REQ-EVT-003` | PASS |
| `UC-EVT-03` | Crear un evento del club | EVT | ACT-SUBCOMMITTEE (alcance CLUB), ACT-COACH (alcance EVENT) | GEI_UC_SPEC_EVT_V1.md | 5 | 3 | P1 | — | `REQ-EVT-004` | PASS |
| `UC-EVT-04` | Editar un evento | EVT | ACT-COACH (alcance TEAM o EVENT), ACT-SUBCOMMITTEE (alcance CLUB) | GEI_UC_SPEC_EVT_V1.md | 5 | 6 | P0 | ← UC-EVT-11 <<extend>> [MATERIAL_CHANGE] · ← UC-EVT-12 <<extend>> [STALE_VERSION] | `REQ-EVT-010`, `REQ-EVT-011` | PASS |
| `UC-EVT-05` | Posponer un evento | EVT | ACT-COACH, ACT-SUBCOMMITTEE | GEI_UC_SPEC_EVT_V1.md | 5 | 2 | P0 | → UC-EVT-11 <<include>> | `REQ-EVT-007` | PASS |
| `UC-EVT-06` | Reanudar un evento pospuesto | EVT | ACT-COACH, ACT-SUBCOMMITTEE | GEI_UC_SPEC_EVT_V1.md | 4 | 3 | P0 | — | `REQ-EVT-007` | PASS |
| `UC-EVT-07` | Cancelar un evento | EVT | ACT-COACH, ACT-SUBCOMMITTEE | GEI_UC_SPEC_EVT_V1.md | 5 | 2 | P0 | → UC-EVT-11 <<include>> | `REQ-EVT-007` | PASS |
| `UC-EVT-08` | Restaurar un evento cancelado | EVT | ACT-COACH, ACT-SUBCOMMITTEE | GEI_UC_SPEC_EVT_V1.md | 5 | 2 | P0 | → UC-EVT-11 <<include>> | `REQ-EVT-007` | PASS |
| `UC-EVT-09` | Completar un evento | EVT | ACT-COACH, ACT-SUBCOMMITTEE | GEI_UC_SPEC_EVT_V1.md | 4 | 2 | P0 | — | `REQ-EVT-007` | PASS |
| `UC-EVT-10` | Abandonar un evento | EVT | ACT-COACH, ACT-SUBCOMMITTEE | GEI_UC_SPEC_EVT_V1.md | 4 | 2 | P0 | — | `REQ-EVT-007` | PASS |
| `UC-EVT-11` | Revisar el impacto de un cambio material | EVT | ACT-COACH, ACT-SUBCOMMITTEE | GEI_UC_SPEC_EVT_V1.md | 4 | 2 | P0 | extensor de UC-EVT-04/16 · incluido por UC-EVT-05/07/08 | `REQ-EVT-012` | PASS |
| `UC-EVT-12` | Resolver un conflicto de edición concurrente | EVT | ACT-COACH, ACT-SUBCOMMITTEE | GEI_UC_SPEC_EVT_V1.md | 4 | 2 | P0 | extensor de UC-EVT-04 [STALE_VERSION] | `REQ-EVT-013` | PASS |
| `UC-EVT-13` | Crear una serie de eventos | EVT | ACT-COACH, ACT-SUBCOMMITTEE | GEI_UC_SPEC_EVT_V1.md | 5 | 3 | P1 | — | `REQ-EVT-014` | PASS |
| `UC-EVT-14` | Finalizar una serie de eventos | EVT | ACT-COACH, ACT-SUBCOMMITTEE | GEI_UC_SPEC_EVT_V1.md | 4 | 2 | P2 | — | `REQ-EVT-016` | PASS |
| `UC-EVT-15` | Programar una jornada | EVT | ACT-COACH (alcance TEAM), ACT-SUBCOMMITTEE (alcance CLUB) | GEI_UC_SPEC_EVT_V1.md | 5 | 5 | P1 | — | `REQ-EVT-018` | PASS |
| `UC-EVT-16` | Actualizar la logística de un evento | EVT | ACT-COACH (alcance TEAM o EVENT), ACT-SUBCOMMITTEE (alcance CLUB) | GEI_UC_SPEC_EVT_V1.md | 4 | 4 | P1 | ← UC-EVT-11 <<extend>> [MATERIAL_CHANGE] | `REQ-EVT-019` | PASS |
| `UC-EVT-17` | Consultar el calendario | EVT | ACT-AUTHENTICATED (los 6 roles concretos, cada uno con su alcance) | GEI_UC_SPEC_EVT_V1.md | 3 | 1 | P1 | — | `REQ-EVT-020` | PASS |
| `UC-EVT-18` | Revisar lo que requiere mi atención | EVT | ACT-AUTHENTICATED (los 6 roles concretos, cada uno con su alcance) | GEI_UC_SPEC_EVT_V1.md | 3 | 2 | P1 | — | `REQ-EVT-021` | PASS |
| `UC-EVT-19` | Consultar un evento | EVT | ACT-AUTHENTICATED (los 6 roles concretos, cada uno con su alcance) | GEI_UC_SPEC_EVT_V1.md | 3 | 3 | P0 | — | `REQ-EVT-023` | PASS |
| `UC-IAM-01` | Iniciar sesión | IAM | ACT-UNAUTHENTICATED | GEI_UC_SPEC_IAM_V1.md | 3 | 4 | P0 | — | `REQ-IAM-001` | PASS |
| `UC-IAM-02` | Deshabilitar una cuenta | IAM | ACT-ADMIN | GEI_UC_SPEC_IAM_V1.md | 4 | 3 | P0 | — | `REQ-IAM-002` | PASS |
| `UC-IAM-03` | Emitir un código de activación | IAM | ACT-ADMIN | GEI_UC_SPEC_IAM_V1.md | 4 | 3 | P0 | — | `REQ-IAM-003` | PASS |
| `UC-IAM-04` | Activar una cuenta con un código de un solo uso | IAM | ACT-UNAUTHENTICATED | GEI_UC_SPEC_IAM_V1.md | 3 | 3 | P0 | — | `REQ-IAM-003` | PASS |
| `UC-IAM-05` | Restablecer el acceso de una cuenta | IAM | ACT-ADMIN | GEI_UC_SPEC_IAM_V1.md | 4 | 3 | P0 | — | `REQ-IAM-004` | PASS |
| `UC-IAM-06` | Cambiar mi contraseña | IAM | ACT-AUTHENTICATED (y sus 6 especializaciones concretas) | GEI_UC_SPEC_IAM_V1.md | 4 | 3 | P0 | — | `REQ-IAM-005` | PASS |
| `UC-IAM-07` | Consultar mis sesiones activas | IAM | ACT-AUTHENTICATED (y sus 6 especializaciones concretas) | GEI_UC_SPEC_IAM_V1.md | 3 | 1 | P1 | — | `REQ-IAM-010` | PASS |
| `UC-IAM-08` | Cerrar una sesión remota | IAM | ACT-AUTHENTICATED (y sus 6 especializaciones concretas) | GEI_UC_SPEC_IAM_V1.md | 4 | 2 | P1 | — | `REQ-IAM-010` | PASS |
| `UC-IAM-09` | Reautenticar para una gestión sensible | IAM | ACT-ADMIN, ACT-SUBCOMMITTEE | GEI_UC_SPEC_IAM_V1.md | 3 | 3 | P1 | regla transversal INC-01 (0 aristas UML) | `REQ-IAM-009` | PASS |
| `UC-IAM-10` | Retomar el trabajo tras una interrupción de sesión | IAM | ACT-AUTHENTICATED (y sus 6 especializaciones concretas) | GEI_UC_SPEC_IAM_V1.md | 4 | 2 | P0 | — | `REQ-IAM-020` | PASS |
| `UC-INS-01` | Buscar en el club | INS | ACT-AUTHENTICATED (los 6 roles concretos) | GEI_UC_SPEC_INS_V1.md | 4 | 2 | P1 | — | `REQ-INS-001` | PASS |
| `UC-INS-02` | Consultar el informe de asistencia | INS | ACT-COACH (alcance TEAM), ACT-SUBCOMMITTEE (alcance CLUB), ACT-PLAYER (sólo lo propio), ACT-CAPTAIN (TEAM si corresponde) | GEI_UC_SPEC_INS_V1.md | 4 | 3 | P1 | — | `REQ-INS-004` | PASS |
| `UC-INS-03` | Consultar el informe de rendimiento | INS | ACT-COACH (alcance TEAM), ACT-SUBCOMMITTEE (alcance CLUB), ACT-PLAYER (sólo lo propio), ACT-CAPTAIN (TEAM si corresponde) | GEI_UC_SPEC_INS_V1.md | 4 | 3 | P1 | — | `REQ-INS-005` | PASS |
| `UC-INS-04` | Consultar el historial de un objeto | INS | ACT-AUTHENTICATED (los 6 roles concretos, cada uno con su alcance) | GEI_UC_SPEC_INS_V1.md | 3 | 2 | P0 | — | `REQ-INS-011` | PASS |
| `UC-INS-05` | Consultar la auditoría administrativa | INS | ACT-ADMIN | GEI_UC_SPEC_INS_V1.md | 4 | 2 | P0 | — | `REQ-INS-008`, `REQ-INS-009` | PASS |
| `UC-PPL-01` | Registrar una persona | PPL | ACT-ADMIN | GEI_UC_SPEC_PPL_V1.md | 5 | 3 | P0 | — | `REQ-PPL-001` | PASS |
| `UC-PPL-02` | Completar el perfil de una jugadora | PPL | ACT-ADMIN | GEI_UC_SPEC_PPL_V1.md | 4 | 4 | P0 | — | `REQ-PPL-002` | PASS |
| `UC-PPL-03` | Vincular una cuenta a una persona | PPL | ACT-ADMIN | GEI_UC_SPEC_PPL_V1.md | 5 | 3 | P0 | — | `REQ-PPL-003` | PASS |
| `UC-PPL-04` | Registrar una membresía al club | PPL | ACT-ADMIN | GEI_UC_SPEC_PPL_V1.md | 4 | 3 | P0 | — | `REQ-PPL-004` | PASS |
| `UC-PPL-05` | Finalizar una membresía al club | PPL | ACT-ADMIN | GEI_UC_SPEC_PPL_V1.md | 4 | 3 | P0 | — | `REQ-PPL-004` | PASS |
| `UC-PPL-06` | Incorporar una jugadora a un equipo | PPL | ACT-ADMIN | GEI_UC_SPEC_PPL_V1.md | 4 | 4 | P0 | — | `REQ-PPL-005`, `REQ-PPL-007` | PASS |
| `UC-PPL-07` | Cambiar de equipo a una jugadora | PPL | ACT-ADMIN | GEI_UC_SPEC_PPL_V1.md | 4 | 4 | P0 | — | `REQ-PPL-007` | PASS |
| `UC-PPL-08` | Retirar a una jugadora del equipo | PPL | ACT-ADMIN | GEI_UC_SPEC_PPL_V1.md | 4 | 3 | P0 | — | `REQ-PPL-007` | PASS |
| `UC-PPL-09` | Asignar un rol con alcance | PPL | ACT-ADMIN | GEI_UC_SPEC_PPL_V1.md | 4 | 4 | P0 | — | `REQ-PPL-006` | PASS |
| `UC-PPL-10` | Finalizar un rol asignado | PPL | ACT-ADMIN | GEI_UC_SPEC_PPL_V1.md | 4 | 4 | P0 | — | `REQ-PPL-006` | PASS |
| `UC-PPL-11` | Registrar una relación de representación | PPL | ACT-ADMIN | GEI_UC_SPEC_PPL_V1.md | 4 | 4 | P0 | — | `REQ-PPL-008` | PASS |
| `UC-PPL-12` | Finalizar una relación de representación | PPL | ACT-ADMIN | GEI_UC_SPEC_PPL_V1.md | 4 | 3 | P0 | — | `REQ-PPL-008` | PASS |
| `UC-PPL-13` | Consultar la información del menor delegado | PPL | ACT-GUARDIAN | GEI_UC_SPEC_PPL_V1.md | 3 | 3 | P0 | — | `REQ-PPL-009` | PASS |
| `UC-PPL-14` | Consultar quién actúa por mi cuenta | PPL | ACT-PLAYER (menor), ACT-GUARDIAN (sobre su propia relación) | GEI_UC_SPEC_PPL_V1.md | 3 | 2 | P1 | — | `REQ-PPL-010` | PASS |
| `UC-PPL-15` | Conocer qué falta en mi perfil y cómo completarlo | PPL | ACT-PLAYER | GEI_UC_SPEC_PPL_V1.md | 3 | 2 | P1 | — | `REQ-PPL-013` | PASS |
| `UC-PPL-16` | Consultar mi perfil | PPL | ACT-AUTHENTICATED (y sus 6 especializaciones concretas) | GEI_UC_SPEC_PPL_V1.md | 3 | 1 | P1 | — | `REQ-PPL-016` | PASS |
| `UC-PPL-17` | Editar mi contacto | PPL | ACT-AUTHENTICATED (y sus 6 especializaciones concretas) | GEI_UC_SPEC_PPL_V1.md | 4 | 2 | P1 | — | `REQ-PPL-016` | PASS |
| `UC-PRT-01` | Responder mi disponibilidad | PRT | ACT-PLAYER (respuesta propia), ACT-GUARDIAN (respuesta por un menor, mismo CU) | GEI_UC_SPEC_PRT_V1.md | 4 | 7 | P0 | — | `REQ-PRT-001`, `REQ-PRT-002` | PASS |
| `UC-PRT-02` | Preparar la convocatoria de un partido | PRT | ACT-COACH (alcance TEAM o EVENT) | GEI_UC_SPEC_PRT_V1.md | 5 | 4 | P0 | — | `REQ-PRT-005` | PASS |
| `UC-PRT-03` | Publicar la convocatoria de un partido | PRT | ACT-COACH | GEI_UC_SPEC_PRT_V1.md | 5 | 4 | P0 | — | `REQ-PRT-005` | PASS |
| `UC-PRT-04` | Revisar los conflictos de una convocatoria | PRT | ACT-COACH | GEI_UC_SPEC_PRT_V1.md | 3 | 2 | P1 | — | `REQ-PRT-007` | PASS |
| `UC-PRT-05` | Registrar la asistencia de un evento | PRT | ACT-COACH (alcance TEAM o EVENT) | GEI_UC_SPEC_PRT_V1.md | 4 | 3 | P0 | — | `REQ-PRT-009` | PASS |
| `UC-PRT-06` | Cerrar la asistencia de un evento | PRT | ACT-COACH | GEI_UC_SPEC_PRT_V1.md | 4 | 2 | P1 | — | `REQ-PRT-011` | PASS |
| `UC-PRT-07` | Corregir la asistencia de un evento | PRT | ACT-COACH | GEI_UC_SPEC_PRT_V1.md | 4 | 2 | P0 | — | `REQ-PRT-012` | PASS |
| `UC-PRT-08` | Registrar el resultado de un partido | PRT | ACT-COACH | GEI_UC_SPEC_PRT_V1.md | 4 | 2 | P0 | — | `REQ-PRT-013` | PASS |
| `UC-PRT-09` | Finalizar el resultado de un partido | PRT | ACT-COACH | GEI_UC_SPEC_PRT_V1.md | 4 | 3 | P0 | — | `REQ-PRT-013` | PASS |
| `UC-PRT-10` | Corregir el resultado de un partido | PRT | ACT-COACH | GEI_UC_SPEC_PRT_V1.md | 4 | 3 | P0 | — | `REQ-PRT-014` | PASS |
| `UC-PRT-11` | Consultar las estadísticas de un partido | PRT | ACT-COACH (alcance TEAM o EVENT) | GEI_UC_SPEC_PRT_V1.md | 3 | 2 | P1 | — | `REQ-PRT-016` | PASS |
| `UC-PRT-12` | Registrar una restricción de habilitación | PRT | ACT-SUBCOMMITTEE (alcance CLUB), ACT-ADMIN (alcance CLUB) | GEI_UC_SPEC_PRT_V1.md | 4 | 3 | P0 | — | `REQ-PRT-017` | PASS |
| `UC-PRT-13` | Consultar el estado de habilitación de una jugadora | PRT | ACT-SUBCOMMITTEE, ACT-ADMIN, ACT-COACH (sólo el estado) | GEI_UC_SPEC_PRT_V1.md | 3 | 2 | P0 | — | `REQ-PRT-017` | PASS |
| `UC-STR-01` | Registrar una temporada | STR | ACT-ADMIN | GEI_UC_SPEC_STR_V1.md | 4 | 3 | P0 | — | `REQ-STR-001` | PASS |
| `UC-STR-02` | Actualizar los datos de una temporada | STR | ACT-ADMIN | GEI_UC_SPEC_STR_V1.md | 4 | 4 | P0 | — | `REQ-STR-001` | PASS |
| `UC-STR-03` | Registrar una división | STR | ACT-ADMIN | GEI_UC_SPEC_STR_V1.md | 4 | 3 | P1 | — | `REQ-STR-002` | PASS |
| `UC-STR-04` | Actualizar una división | STR | ACT-ADMIN | GEI_UC_SPEC_STR_V1.md | 4 | 4 | P1 | — | `REQ-STR-002` | PASS |
| `UC-STR-05` | Archivar una división | STR | ACT-ADMIN | GEI_UC_SPEC_STR_V1.md | 4 | 4 | P1 | — | `REQ-STR-002` | PASS |
| `UC-STR-06` | Registrar una línea | STR | ACT-ADMIN | GEI_UC_SPEC_STR_V1.md | 4 | 4 | P1 | — | `REQ-STR-003` | PASS |
| `UC-STR-07` | Actualizar una línea | STR | ACT-ADMIN | GEI_UC_SPEC_STR_V1.md | 4 | 4 | P1 | — | `REQ-STR-003` | PASS |
| `UC-STR-08` | Archivar una línea | STR | ACT-ADMIN | GEI_UC_SPEC_STR_V1.md | 4 | 4 | P1 | — | `REQ-STR-003` | PASS |
| `UC-STR-09` | Registrar un equipo | STR | ACT-ADMIN | GEI_UC_SPEC_STR_V1.md | 5 | 4 | P0 | — | `REQ-STR-004` | PASS |
| `UC-STR-10` | Actualizar un equipo | STR | ACT-ADMIN | GEI_UC_SPEC_STR_V1.md | 4 | 5 | P1 | — | `REQ-STR-008` | PASS |
| `UC-STR-11` | Activar un equipo | STR | ACT-ADMIN | GEI_UC_SPEC_STR_V1.md | 4 | 4 | P0 | — | `REQ-STR-004` | PASS |
| `UC-STR-12` | Archivar un equipo | STR | ACT-ADMIN | GEI_UC_SPEC_STR_V1.md | 4 | 4 | P0 | — | `REQ-STR-004` | PASS |
| `UC-STR-13` | Registrar una sede | STR | ACT-ADMIN | GEI_UC_SPEC_STR_V1.md | 4 | 3 | P1 | — | `REQ-STR-005` | PASS |
| `UC-STR-14` | Corregir los datos de una sede | STR | ACT-ADMIN | GEI_UC_SPEC_STR_V1.md | 4 | 2 | P0 | — | `REQ-STR-005`, `REQ-STR-012` | PASS |
| `UC-STR-15` | Archivar una sede | STR | ACT-ADMIN | GEI_UC_SPEC_STR_V1.md | 4 | 4 | P1 | — | `REQ-STR-005` | PASS |

**Totales:** 102 CU · pasos básicos: 401 · ramas alternativas: 299 · subflujos anidados: 0 · QA: 102/102 PASS (machine QA 32/32 + muestra académica 16/16).

**Distribución de prioridad:** P0 55 · P1 40 · P2 7 · P3 0 (regla de derivación en el
Specification Standard §4 y en el Reconstruction Audit).

---

**Fin del Use Case Specification Index V1.**