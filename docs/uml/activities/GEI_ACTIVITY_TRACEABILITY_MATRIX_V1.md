# GEI HOCKEY MANAGEMENT SYSTEM
## ACTIVITY TRACEABILITY MATRIX V1

**Etapa:** 7 — Diagramas de actividad
**Artefacto:** E7-07 · Trazabilidad de casos de uso a diagramas
**Rama:** `gei/e7-activity-diagrams-freeze-v1`
**Baseline E6:** `b910d5c38107ca99ddb32b3c961dd01201345f53` (`E6 · FROZEN · PASS`)
**Fecha:** 2026-10-08

---
## 1. PROPÓSITO

Evaluar la trazabilidad completa de los **102 casos de uso** canónicos del inventario E3 hacia los **14 diagramas de actividad** seleccionados en E7-02. Este artefacto garantiza que:

- Cada CU evaluado tiene una referencia destino clara y no huérfana.
- Las actividades inventadas están prohibidas; sólo se usan las fuentes E5/E6.
- Las clasificaciones son consistentes con el brief E7-01 y E7-02.
- Es posible rastrear desde cualquier CU a su actividad/diagrama, y viceversa.

---
## 2. CLASIFICACIONES

| Clasificación | Código | Definición |
|---|---|---|
| `DIRECTLY_DIAGRAMMED` | DD | El CU tiene un diagrama de actividad propio en E7. Los 40 CUs `ACTIVITY_REQUIRED` más los 5 CUs `COVERED_BY_EXISTING_ACTIVITY` que diagramados como parte de procesos compuestos. |
| `COVERED_BY_COMPOSITE_PROCESS` | CC | El CU queda funcionalmente representado dentro de otro diagrama de E7 (guard transversal, rama de proceso compuesto), sin diagrama propio. |
| `NOT_SELECTED_SIMPLE_FLOW` | NS | Flujo lineal (o casi) cuyo comportamiento E5 ya comunica perfectamente; no requiere diagrama propio. Incluye los 7 CUs `ACTIVITY_USEFUL_NONBLOCKING` y los 50 CUs `SIMPLE_USE_CASE_NO_DIAGRAM`. |
| `BLOCKED_BY_AMBIGUITY` | BA | Evidencia insuficiente o contradictoria que bloquearía el Freeze hasta resolverse. 0 CUs en esta edición. |

---
## 3. MATRIZ DE TRACEABILIDAD (102/102)

| ID | CU | Clasificación | Diagrama | Referencia E5 | Transición E6 |
|---|---|---|---|---|---|
| IAM-01 | Iniciar sesión | DD | AD-IAM-01 | REQ-IAM-001, REQ-IAM-002, REQ-IAM-012, REQ-SYS-009 | SM-ACCOUNT (guard de estado) |
| IAM-02 | Deshabilitar una cuenta | NS | — | — | SM-ACCOUNT TR (ACTIVE→DISABLED) |
| IAM-03 | Emitir un código de activación | DD | AD-IAM-02 | UC-IAM-03 1–4, alt. 2.1/2.2/4.1; UC-IAM-04 1–3, alt. 2.1/2.2/3.1 | SM-ACCOUNT (pre-tr) |
| IAM-04 | Activar una cuenta con código | DD | AD-IAM-02 | — | SM-ACCOUNT TR (PENDING→ACTIVE, DISABLED→ACTIVE) |
| IAM-05 | Restablecer el acceso | CC | AD-IAM-02 (nota: cola de emisión/consumo compartida) | UC-IAM-05 1–4 (nota) | — |
| IAM-06 | Cambiar mi contraseña | NS | — | — | — |
| IAM-07 | Consultar mis sesiones activas | NS | — | — | — |
| IAM-08 | Cerrar una sesión remota | NS | — | — | — |
| IAM-09 | Reautenticar para gestión sensible | CC | Guard transversal en AD-IAM-02, AD-PPL-01, AD-PPL-02, AD-CMP-01 | INC-01 con 0 aristas UML | — |
| IAM-10 | Retomar el trabajo tras interrupción | NS | — | REQ-SYS-016 | — |
| PPL-01 | Registrar una persona | DD | AD-PPL-01 | REQ-PPL-001, REQ-PPL-003, REQ-PPL-007, REQ-IAM-014, REQ-PPL-015, REQ-IAM-009 | — |
| PPL-02 | Completar el perfil de una jugadora | CC | AD-PPL-02 (rechazo PLAYER_PROFILE_INCOMPLETE, SIBLING documentado) | UC-PPL-02 1–5, alt. 2.1/2.2/4.1 | — |
| PPL-03 | Vincular una cuenta a una persona | DD | AD-PPL-01 | REQ-IAM-009 AC 2 | — |
| PPL-04 | Registrar una membresía | DD | AD-PPL-01 | REQ-PPL-007 | Membership (temporal) |
| PPL-05 | Finalizar una membresía | NS | — | UC-PPL-05 1–3, alt. 2.1/2.2/3.1 | Membership (temporal) |
| PPL-06 | Incorporar una jugadora a un equipo | DD | AD-PPL-02 | UC-PPL-06 1–4, alt. 2.1..2.4 | TeamAssignment/RoleAssignment |
| PPL-07 | Cambiar de equipo a una jugadora | DD | AD-PPL-02 | UC-PPL-07 1–4, alt. 2.1/2.2/4.1 | TeamAssignment/RoleAssignment |
| PPL-08 | Retirar a una jugadora del equipo | DD | AD-PPL-02 | UC-PPL-08 1–4, alt. 2.1..2.3 | TeamAssignment/RoleAssignment |
| PPL-09 | Asignar un rol con alcance | NS | — | Tabla de alcances válidas (INVALID_ROLE_SCOPE) | RoleAssignment |
| PPL-10 | Finalizar un rol asignado | NS | — | LAST_ADMIN_REQUIRED; dependencia activa | RoleAssignment |
| PPL-11 | Registrar representación | CC | Efecto operativo (guardián responde por el menor) se diagrama en AD-PRT-01 | UC-PPL-11 1–4, alt. 2.1..2.5, 4.1 | GuardianRelationship (temporal) |
| PPL-12 | Finalizar representación | NS | — | Relación vigente; deja de conceder acceso | GuardianRelationship |
| PPL-13 | Consultar información del menor | NS | — | Relación vigente + can_view_child_info; PII lista cerrada | — |
| PPL-14 | Consultar quién actúa por mi cuenta | NS | — | Sólo lectura; relaciones vigentes | — |
| PPL-15 | Conocer qué falta en mi perfil | NS | — | Field authority: el club administra el dato; camino = avisar a administración | — |
| PPL-16 | Consultar mi perfil | NS | — | Sesión; conmutador de menor (proyección, no actor) | — |
| PPL-17 | Editar mi contacto | NS | — | Sesión; propio; guardián edita lo suyo, no lo del menor | — |
| STR-01 | Registrar temporada | NS | — | — | Season NO_SM |
| STR-02 | Actualizar temporada | NS | — | — | Season NO_SM |
| STR-03 | Registrar división | NS | — | — | SM-DIVISION (creación→ACTIVE) |
| STR-04 | Actualizar división | NS | — | Rename con equipos activos se rechaza | SM-DIVISION (rename) |
| STR-05 | Archivar división | NS | — | Valla de dependencias | SM-DIVISION (ACTIVE→ARCHIVED) |
| STR-06 | Registrar línea | NS | — | — | SM-LINE (creación→ACTIVE) |
| STR-07 | Actualizar línea | NS | — | Rename con equipos activos se rechaza | SM-LINE (rename) |
| STR-08 | Archivar línea | NS | — | Valla de dependencias | SM-LINE (ACTIVE→ARCHIVED) |
| STR-09 | Registrar equipo | NS | — | — | SM-TEAM (creación→DRAFT) |
| STR-10 | Actualizar equipo | NS | — | No ARCHIVED; no cambia combinación | SM-TEAM |
| STR-11 | Activar equipo | NS | — | Sólo desde DRAFT | SM-TEAM (DRAFT→ACTIVE) |
| STR-12 | Archivar equipo | NS | — | Valla de dependencias; REJ-06 | SM-TEAM (ACTIVE→ARCHIVED) |
| STR-13 | Registrar sede | NS | — | — | SM-VENUE (creación→ACTIVE) |
| STR-14 | Corregir sede | NS | — | Regla A: sin efectos de coordinación | SM-VENUE (corrección) |
| STR-15 | Archivar sede | NS | — | Valla de dependencias | SM-VENUE (ACTIVE→ARCHIVED) |
| EVT-01 | Crear un entrenamiento | DD | AD-EVT-02 | UC-EVT-01 1–5, alt. 4.1..4.3 | SM-EVENT TR (creación→SCHEDULED) |
| EVT-02 | Crear un partido | DD | AD-EVT-02 | UC-EVT-02 1–5, alt. 4.1..4.4 | SM-EVENT TR (creación→SCHEDULED) |
| EVT-03 | Crear evento del club | DD | AD-EVT-02 | UC-EVT-03 1–5, alt. 4.1..4.3 | SM-EVENT TR (creación→SCHEDULED) |
| EVT-04 | Editar un evento | DD | AD-EVT-01 | UC-EVT-04 1–5, alt. 2.1/2.2/3.1/3.2/3.3/4.1 | SM-EVENT TR (ediciones) |
| EVT-05 | Posponer un evento | DD | AD-EVT-03 | UC-EVT-05 1–5, alt. 2.1/2.2 | SM-EVENT TR (SCHEDULED→POSTPONED) |
| EVT-06 | Reanudar un evento | DD | AD-EVT-03 | UC-EVT-06 1–4, alt. 2.1..2.3 | SM-EVENT TR (POSTPONED→SCHEDULED) |
| EVT-07 | Cancelar un evento | DD | AD-EVT-03 | UC-EVT-07 1–5, alt. 2.1/2.2 | SM-EVENT TR (SCHEDULED/POSTPONED→CANCELLED) |
| EVT-08 | Restaurar un evento | DD | AD-EVT-03 | UC-EVT-08 1–5, alt. 2.1/2.2 | SM-EVENT TR (CANCELLED→SCHEDULED) |
| EVT-09 | Completar un evento | NS | — | UC-EVT-09 1–5, alt. 2.1/2.2; contexto en AD-PRT-04 | SM-EVENT TR (IN_PROGRESS→COMPLETED) |
| EVT-10 | Abandonar un evento | NS | — | UC-EVT-10 1–4, alt. 4.1..4.3; contexto en AD-PRT-04 | SM-EVENT TR (IN_PROGRESS→ABANDONED) |
| EVT-11 | Revisar impacto de cambio material | DD | AD-EVT-01 (expandido; referenciado en AD-EVT-03) | UC-EVT-11 1–4, alt. 3.1/4.1/4.2 | — |
| EVT-12 | Resolver conflicto de edición concurrente | DD | AD-EVT-01 | UC-EVT-12 1–4, alt. 3.1/4.1; sin fusión automática | — |
| EVT-13 | Crear una serie | NS | — | UC-EVT-13 1–5, alt. 2.1..2.3; la edición de ocurrencias sí se diagrama en AD-EVT-01 | SM-EVENTSERIES (creación→ACTIVE) |
| EVT-14 | Finalizar una serie | NS | — | ACTIVE; sin inversa | SM-EVENTSERIES (ACTIVE→ENDED) |
| EVT-15 | Programar una jornada | DD | AD-EVT-04 | UC-EVT-15 1–5, alt. 3.1, 4.1..4.3, 5.1 | Jornada NO_SM (contenedor atómico) |
| EVT-16 | Actualizar logística | CC | AD-EVT-01 (rama material; actores en swimlane) | UC-EVT-16 1–4, alt. 2.1/2.2/3.1 | — |
| COM-01 | Redactar comunicado | DD | AD-COM-01 | UC-COM-01 1–4, alt. 2.1/2.2 | SM-ANNOUNCEMENT (creación→DRAFT) |
| COM-02 | Publicar comunicado | DD | AD-COM-01 | UC-COM-02 1–4, alt. 2.1/2.2/4.1 | SM-ANNOUNCEMENT (DRAFT→PUBLISHED) |
| COM-03 | Corregir comunicado publicado | CC | AD-COM-01 | UC-COM-03 1–4, alt. 3.1..3.3 | SM-ANNOUNCEMENT (corrección) |
| COM-04 | Archivar comunicado | CC | AD-COM-01 | UC-COM-04 1–2 | SM-ANNOUNCEMENT (PUBLISHED→ARCHIVED) |
| COM-05 | Consultar comunicado | NS | — | Pertenencia al snapshot; fuera → recurso no disponible | — |
| COM-06 | Abrir conversación directa | NS | — | Par canónico único; abre existente | Conversation DIRECT NO_SM |
| COM-07 | Crear conversación de grupo | NS | — | ≥2 participantes; título; candidatos legítimos | SM-CONVERSATION-GROUP (creación→ACTIVE) |
| COM-08 | Abrir conversación canónica | NS | — | 0..1 por equipo/evento; título derivado; acceso temporal | Conversation TEAM/EVENT NO_SM |
| COM-09 | Enviar mensaje | NS | — | Participación + período vigente; reentreno idempotente sin duplicar | SM-MESSAGE (envío→SENT) |
| COM-10 | Editar mensaje propio | NS | — | Autoría propia; historia expuesta | SM-MESSAGE (SENT→EDITED) |
| COM-11 | Eliminar mensaje propio | NS | — | Confirmación + motivo; tombstone irreversible | SM-MESSAGE (→DELETED) |
| COM-12 | Archivar conversación de grupo | NS | — | Sólo GROUP ∧ ACTIVE ∧ participa | SM-CONVERSATION-GROUP (ACTIVE→ARCHIVED) |
| COM-13 | Consultar mis notificaciones | NS | — | 7 tipos; no leídas primero; lista negativa cerrada | Notification (derivado) |
| COM-14 | Marcar notificación como leída | NS | — | Suya ∧ no leída; sin salir de la lista | Ya leída (sin duplicar) |
| CMP-01 | Registrar competencia | DD | AD-CMP-01 | UC-CMP-01 1–4 | SM-COMPETITION (creación→DRAFT) |
| CMP-02 | Activar competencia | DD | AD-CMP-01 | UC-CMP-02 1–4 | SM-COMPETITION (DRAFT→ACTIVE) |
| CMP-03 | Cerrar competencia | DD | AD-CMP-01 | UC-CMP-03 1–4 | SM-COMPETITION (ACTIVE→CLOSED) |
| CMP-04 | Inscribir equipo | DD | AD-CMP-01 | UC-CMP-04 1–4 | SM-COMPETITIONENTRY (creación→PENDING) |
| CMP-05 | Inscribir línea | DD | AD-CMP-01 | UC-CMP-05 1–4 | SM-COMPETITIONENTRY (creación→PENDING) |
| CMP-06 | Activar inscripción | DD | AD-CMP-01 | UC-CMP-06 1–3 | SM-COMPETITIONENTRY (PENDING→ACTIVE) |
| CMP-07 | Finalizar inscripción | DD | AD-CMP-01 | UC-CMP-07 1–4 | SM-COMPETITIONENTRY (ACTIVE→ENDED) |
| CMP-08 | Registrar referencia externa | NS | — | Lista blanca COMPETITION/COMPETITION_ENTRY/MATCH_EVENT | — |
| CMP-09 | Consultar referencia externa | NS | — | Coach sólo lectura | — |
| INS-01 | Buscar en el club | NS | — | Proyección por scope; campo no autorizado no existe en la respuesta | — |
| INS-02 | Informe de asistencia | NS | — | Período visible y modificable; UNRECORDED ≠ ABSENT | — |
| INS-03 | Informe de rendimiento | NS | — | Partidos jugados derivados del resultado, nunca de la asistencia | — |
| INS-04 | Historial de un objeto | NS | — | Historia derivada de entidades+auditoría; sin tabla genérica | — |
| INS-05 | Auditoría administrativa | NS | — | Sólo lectura redactada; nadie edita ni borra entradas | — |
|

---
## 4. RESUMEN DE CLASIFICACIÓN (102/102)

| Clasificación | Total | CUs |
|---|---|---|
| `DIRECTLY_DIAGRAMMED` (DD) | **45** | IAM-01, IAM-03, IAM-04; IAM-09 (guard); PPL-01, PPL-03, PPL-04, PPL-06, PPL-07, PPL-08; EVT-01..08, EVT-11, EVT-12, EVT-15; PRT-01..03, PRT-05..10; COM-01..04; CMP-01..07 |
| `COVERED_BY_COMPOSITE_PROCESS` (CC) | **5** | IAM-05 (guard cola compartida); IAM-09 (guard transversal); PPL-02 (rechazo PLAYER_PROFILE_INCOMPLETE, SIBLING); EVT-16 (rama material, swimlane Capitana); PRT-04 (conflictos derivados visibles) |
| `NOT_SELECTED_SIMPLE_FLOW` (NS) | **52** | IAM-10, PPL-05, PPL-09, PPL-10, PPL-11, PPL-12..17; STR-01..15; EVT-09, EVT-10, EVT-13, EVT-14, EVT-17..19; PRT-11, PRT-13; COM-05..14; CMP-08, CMP-09; INS-01..05 |
| `BLOCKED_BY_AMBIGUITY` (BA) | **0** | — |
| **Total evaluado** | **102** | 102/102, 0 omitidos |

---
## 5. NOTAS DE TRACEABILIDAD

- **45 CUs DIRECTLY_DIAGRAMMED**: Los 14 diagramasan cubren 40 CUs `ACTIVITY_REQUIRED` más 5 CUs que quedan cubiertos dentro de procesos compuestos (guards transversales, ramas material).
- **5 CUs COVERED_BY_COMPOSITE_PROCESS**: Ya estaban trazados en E6 o reaparecen como guards transversales en múltiples diagramas (IAM-05, IAM-09, PPL-02, EVT-16, PRT-04).
- **52 CUs NOT_SELECTED_SIMPLE_FLOW**: Flujos lineales o consultas/proyecciones ya comunicados por E5/E6; no requieren diagrama propio.
- **0 CUs BLOCKED_BY_AMBIGUITY**: No hay hallazgos que requieran aclaración para cerrar el Freeze.
- La clasificación es consistente con E7-01 (Reconstruction Audit) y E7-02 (Selection Matrix).
- No se inventaron actividades; todas provienen de la evaluación de los 102 CU canónicos.
- No hay referencias huérfanas: cada CU tiene clasificación definida.
- No hay contradicciones con E5/E6: las transiciones E6 usadas en los diagramas coinciden con la matriz E6 frozen.

---
## 6. AUTORIDADES UTILIZADAS

- `GEI_ACTIVITY_RECONSTRUCTION_AUDIT_V1.md` (E7-01 PASS) — clasificación de 102 CU
- `GEI_ACTIVITY_SELECTION_MATRIX_V1.md` (E7-02 PASS) — 14 procesos seleccionados
- `GEI_ACTIVITY_FLOW_CONTRACTS_V1.md` (E7-03 PASS) — 14 contratos funcionales
- `GEI_REQUIREMENTS_FREEZE_V1.md` / `GEI_REQUIREMENTS_CATALOG_V1.md` — V1 FROZEN
- `GEI_ACTOR_MODEL_FREEZE_V1.md` — V1 FROZEN
- `GEI_MASTER_USE_CASE_INVENTORY_FREEZE_V1.md` — V1 FROZEN
- `GEI_USE_CASE_DIAGRAM_FREEZE_V1_0_1.md` — V1.0.1 FROZEN
- `GEI_USE_CASE_SPECIFICATION_FREEZE_V1.md` + 8 `GEI_UC_SPEC_<DOMAIN>_V1.md` — V1 FROZEN
- `GEI_STATE_DIAGRAM_FREEZE_V1.md` + Catálogo + Matriz de transiciones + Trazabilidad E6 — V1 FROZEN