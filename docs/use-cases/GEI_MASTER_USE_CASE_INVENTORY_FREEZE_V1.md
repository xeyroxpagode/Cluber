# GEI HOCKEY MANAGEMENT SYSTEM
## MASTER USE CASE INVENTORY FREEZE V1

**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-05
**Etapa:** 3 — Uso de casos
**Rama:** `gei/e3-use-case-inventory-freeze-v1`
**Baseline de requerimientos:** `29b923f3cb01cf4b425fd6928d210799b9a4bbec` (`gei/e1-requirements-freeze-v1`)
**Baseline de actores:** `730bf8ffee428666d24a588e23f23b457dc35123` (`gei/e2-actor-model-freeze-v1`)

> Este documento contiene **verdad**, no proceso. El proceso, la evidencia, los rechazos y las
> decisiones de derivación están en `docs/use-cases/GEI_USE_CASE_RECONSTRUCTION_AUDIT_V1.md`.

---

# 1. STATUS Y AUTORIDAD

Este documento es la **autoridad del inventario de casos de uso** de GEI a partir de esta fecha.
Responde **qué objetivo funcional puede intentar cada actor**, bajo qué autoridad, con qué resultado
observable y con qué requerimiento que lo respalda.

| Documento | Rol |
|---|---|
| `docs/use-cases/GEI_MASTER_USE_CASE_INVENTORY_FREEZE_V1.md` (este) | **Autoridad del inventario de casos de uso.** |
| `docs/use-cases/GEI_MASTER_USE_CASE_CATALOG_V1.md` | Los 102 casos de uso con su ficha completa. |
| `docs/use-cases/GEI_REQ_ACTOR_USE_CASE_MATRIX_V1.md` | Los 157 REQ IN con su actor, su CU y su tipo de cobertura. Trazabilidad inversa incluida. |
| `docs/use-cases/GEI_USE_CASE_RELATION_CANDIDATES_V1.md` | 8 candidatas `include`/`extend` y 9 rechazos. **Sin congelar.** |
| `docs/use-cases/GEI_PRE_E3_INPUT_CLOSURE_V1.md` | Cierre de insumos, errata de E1 y resolución de decisiones. |
| `docs/use-cases/GEI_USE_CASE_OPEN_DECISIONS_V1.md` | 2 decisiones abiertas de E3, **0 bloqueantes**. |
| `docs/use-cases/GEI_USE_CASE_RECONSTRUCTION_AUDIT_V1.md` | Proceso, evidencia y estrés. No es autoridad. |
| `docs/requirements/GEI_REQUIREMENTS_FREEZE_V1.md` | **Autoridad de requerimientos.** Este documento **no la sustituye**: la traduce a objetivos de actor. |
| `docs/actors/GEI_ACTOR_MODEL_FREEZE_V1.md` | **Autoridad de actores.** Este documento **no la sustituye**: consume su autoridad, scope y límites. |
| `docs/GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md` | Autoridad de producto y dominio. Si un CU de este freeze contradice PT, **manda PT**. |
| `src/**` | Prototipo. **No es autoridad de casos de uso.** Fue usado sólo como evidencia secundaria. |

**Contadores del freeze:** 102 casos de uso canónicos · 0 en `SYS` · 157 REQ IN trazados ·
122 REQ funcionales · **0 `UNMAPPED`** · 0 CU sin REQ · 0 CU duplicados · 8 candidatas de relación ·
9 relaciones rechazadas · 2 decisiones abiertas (0 bloqueantes).

**Cambio de este documento:** sólo con decisión de producto escrita, versión nueva de E1 o E2
cuando la autoridad lo requiera, y verificación de los gates de §12.

---

# 2. REGLAS DE MODELADO DE CASOS DE USO

Estas reglas gobiernan cualquier caso de uso que se agregue en el futuro.

| # | Regla | Origen |
|---:|---|---|
| 1 | Un caso de uso es un **OBJETIVO FUNCIONAL** que un actor intenta conseguir mediante GEI. Responde *qué intenta lograr*, nunca *qué componente toca* | Brief §3 |
| 2 | Un CU tiene **valor observable**, **inicio**, **resultado** y **≥1 requerimiento** que lo respalda | Brief §3 |
| 3 | Un CU **no** se deriva de rutas, pantallas, botones, modales, endpoints, filas ni estados de cliente | Brief §2, §61; E1 Freeze §13 |
| 4 | Un CU se deriva de `REQUIREMENT + ACTOR + GOAL + AUTHORITY + OBSERVABLE RESULT` | Brief §2 |
| 5 | **CRUD no es un caso de uso.** Se crea un CU sólo cuando el REQ expresa ese objetivo, y se decide por objetivo, no por tabla | Brief §5 |
| 6 | El nombre es **`VERBO + OBJETIVO/RESULTADO`**. Se evita "Gestionar", "Procesar" y "Administrar" cuando ocultan varios objetivos independientes | Brief §15 |
| 7 | **Entry point no crea CU.** El mismo objetivo alcanzado desde Inicio, Calendario o Evento es **un** CU | Brief §16, §45 |
| 8 | Dos actores que pueden ejecutar el mismo objetivo con el mismo flujo y el mismo resultado son **un** CU con múltiples actores autorizados. Se separan sólo si cambia el objetivo, el flujo, el resultado o las reglas | Brief §17 |
| 9 | No se crea un CU por cada estado del mismo objeto. Se separan las transiciones que **cambian lifecycle y resultado** | Brief §18 |
| 10 | Un REQ puede generar **varios** CU, uno, ninguno, o actuar como condición transversal. No hay ratio `1 REQ = 1 CU` | Brief §13 |
| 11 | Un CU puede estar soportado por **varios** REQ. Eso es lo esperado, no un error | Brief §14 |
| 12 | Un REQ `SYSTEM_INTERNAL` **no** necesita actor ficticio. Se analiza si es regla de soporte, invariante transversal o user goal mal clasificado | Brief §34; E2 §2 |
| 13 | Un `SYSTEM` interno —logging, base de datos, workers, validación interna, persistencia de auditoría— **no** genera CU | Brief §22 |
| 14 | El **actor**, la **authority** y el **scope** se toman del Actor Freeze. No se reconstruyen desde `src/**` | Brief §19, §61; E2 §1 |
| 15 | `ADMIN` **no** es superusuario deportivo. `CAPTAIN` **no** hereda `COACH`. `GUARDIAN` **no** sale del menor | Brief §19, §20, §21; E2 §14 |
| 16 | `ACT-CAPTAIN` es actor independiente y **no** hereda nada por UML. Se registra por su autoridad propia | Brief §20; E2 §7 |
| 17 | El guardián no genera un CU paralelo cuando el objetivo es el mismo y sólo cambia la authority o el sujeto. Se documenta **actor, sujeto y authority source** | Brief §21; E2 §5 |
| 18 | El **dominio organiza la verdad funcional**. `EVT` **no** significa "página Calendario". Los entry points son de Etapa 10 | Brief §23, §45 |
| 19 | `include`/`extend` sólo se identifican como **candidatas**, con evidencia. No se usan para reducir líneas | Brief §24–§26 |
| 20 | 0 actores inventados. 0 capacidades nuevas sin Product Truth o REQ | Brief §46, §61 |

---

# 3. ALCANCE

## 3.1 Qué incluye este freeze

| Elemento | Cantidad |
|---|---:|
| Casos de uso canónicos con ficha completa | **102** |
| REQ IN con destino explícito | **157 / 157** |
| REQ funcionales con destino explícito | **122 / 122** |
| Candidatas de relación `<<include>>` | **2** |
| Candidatas de relación `<<extend>>` | **6** |
| Relaciones rechazadas con motivo | **9** |
| Decisiones abiertas | **2** (0 bloqueantes) |

## 3.2 Qué NO incluye

| Excluido | Motivo |
|---|---|
| Diagramas UML, PlantUML o Mermaid | Etapa 4 |
| Especificaciones completas de CU | Etapa 5 |
| Caminos felices, Given/When/Then | Etapa 5 |
| Diagramas de actividad | Etapa 5 |
| Diagramas de estado y máquinas de estado | Etapa 4 |
| Arquitectura de información y entry points | Etapa 10 |
| Diseño de pantallas o contratos de pantalla | Etapa 9 |
| Arquitectura, backend, base de datos, endpoints | Etapa 10–11 |
| Modificación de `src/**` | §59 del brief |
| Modificación de los freezes de E1 y E2 | §59 del brief |

## 3.3 Un caso de uso no está en este freeze

| Ausencia | Motivo |
|---|---|
| Restaurar estructura sportive archivada | `DEF-STR-001` y `DEF-STR-002` están **DEFER**; PT §9 y §19 no autorizan la transición inversa. `REQ-DECISION-NEEDED-01` sigue abierta |
| Consultar la ficha de un equipo | Ningún REQ IN lo expresa. `UC-DECISION-01` |
| Consultar la ficha de una persona (entre pares) | Ningún REQ IN lo expresa. `UC-DECISION-01` |
| Cerrar la sesión propia | `REQ-IAM-010` dice "sesión **remota**". `UC-DECISION-02` |
| Consultar mi propio estado de habilitación | `ACTOR-DECISION-01` congelada en (a) `NONE` |
| Reabrir una planilla de asistencia cerrada | `REQ-PRT-011` NOTES: la corrección la cubre (`CON-13`) |
| Recuperar mi contraseña | `OUT-IAM-003` |
| Confirmaciones de lectura, acuses, menciones, respuestas anidadas, silenciar, recordatorios de disponibilidad | `OUT-COM-001`, `DEF-COM-001`…`DEF-COM-004` |
| Gestionar participantes de grupo o salir del grupo | `OUT-COM-002` |
| Integración automática con federación, pases, habilitaciones federativas completas | `OUT-CMP-003`, `OUT-CMP-004` |
| Eliminar permanentemente a una jugadora | `OUT-PPL-002` |
| Reserva de canchas o sedes | `OUT-STR-001` |
| Adjuntos de acta y fotos | `OUT-EVT-002` |
| Generación automática de fechas de jornada | `DEF-EVT-001`, `OUT-EVT-003` |
| Cuotas, contabilidad, motor de estadísticas | `OUT-CMP-001`, `OUT-CMP-002`, `OUT-INS-002` |
| Exportación de informes y auditoría | `OUT-INS-001`, `DEF-SYS-001` |
| Línea de tiempo personal de actividad | `OUT-SYS-001` |
| Procesos de privacidad de la organización | `REQ-SYS-027` es `EXTERNAL` |

**Ninguna de estas ausencias se ha reintroducido.**

---

# 4. CASOS DE USO CANÓNICOS POR DOMINIO

| Dominio | CU | IDs |
|---|---:|---|
| `IAM` — Identity & Access | **10** | `UC-IAM-01` … `UC-IAM-10` |
| `PPL` — People & Relationships | **17** | `UC-PPL-01` … `UC-PPL-17` |
| `STR` — Club Structure | **15** | `UC-STR-01` … `UC-STR-15` |
| `EVT` — Events & Calendar | **19** | `UC-EVT-01` … `UC-EVT-19` |
| `PRT` — Participation | **13** | `UC-PRT-01` … `UC-PRT-13` |
| `COM` — Communication | **14** | `UC-COM-01` … `UC-COM-14` |
| `CMP` — Competition | **9** | `UC-CMP-01` … `UC-CMP-09` |
| `INS` — Search / Reports / Audit | **5** | `UC-INS-01` … `UC-INS-05` |
| `SYS` — Cross-cutting | **0** | — |
| **TOTAL** | **102** | |

## 4.1 Fichas completas

Cada caso de uso se define en `docs/use-cases/GEI_MASTER_USE_CASE_CATALOG_V1.md` con los 20 campos
exigidos: ID, nombre, dominio, goal, actores primarios, actores secundarios, beneficiario, trigger,
precondiciones resumidas, success outcome, authority source, scope, objeto/sujeto, restricciones de
estado, REQ de soporte, reglas de negocio relacionadas, candidatas `include`, candidatas `extend`,
notas y estado.

## 4.2 Los 102, en una línea cada uno

| ID | Nombre | Actor primario |
|---|---|---|
| `UC-IAM-01` | Iniciar sesión | `ACT-UNAUTHENTICATED` |
| `UC-IAM-02` | Deshabilitar una cuenta | `ACT-ADMIN` |
| `UC-IAM-03` | Emitir un código de activación | `ACT-ADMIN` |
| `UC-IAM-04` | Activar una cuenta con un código de un solo uso | `ACT-UNAUTHENTICATED` |
| `UC-IAM-05` | Restablecer el acceso de una cuenta | `ACT-ADMIN` |
| `UC-IAM-06` | Cambiar mi contraseña | `ACT-AUTHENTICATED` |
| `UC-IAM-07` | Consultar mis sesiones activas | `ACT-AUTHENTICATED` |
| `UC-IAM-08` | Cerrar una sesión remota | `ACT-AUTHENTICATED` |
| `UC-IAM-09` | Reautenticar para una gestión sensible | `ACT-ADMIN`, `ACT-SUBCOMMITTEE` |
| `UC-IAM-10` | Retomar el trabajo tras una interrupción de sesión | `ACT-AUTHENTICATED` |
| `UC-PPL-01` | Registrar una persona | `ACT-ADMIN` |
| `UC-PPL-02` | Completar el perfil de una jugadora | `ACT-ADMIN` |
| `UC-PPL-03` | Vincular una cuenta a una persona | `ACT-ADMIN` |
| `UC-PPL-04` | Registrar una membresía al club | `ACT-ADMIN` |
| `UC-PPL-05` | Finalizar una membresía al club | `ACT-ADMIN` |
| `UC-PPL-06` | Incorporar una jugadora a un equipo | `ACT-ADMIN` |
| `UC-PPL-07` | Cambiar de equipo a una jugadora | `ACT-ADMIN` |
| `UC-PPL-08` | Retirar a una jugadora del equipo | `ACT-ADMIN` |
| `UC-PPL-09` | Asignar un rol con alcance | `ACT-ADMIN` |
| `UC-PPL-10` | Finalizar un rol asignado | `ACT-ADMIN` |
| `UC-PPL-11` | Registrar una relación de representación | `ACT-ADMIN` |
| `UC-PPL-12` | Finalizar una relación de representación | `ACT-ADMIN` |
| `UC-PPL-13` | Consultar la información del menor delegado | `ACT-GUARDIAN` |
| `UC-PPL-14` | Consultar quién actúa por mi cuenta | `ACT-PLAYER`, `ACT-GUARDIAN` |
| `UC-PPL-15` | Conocer qué falta en mi perfil y cómo completarlo | `ACT-PLAYER` |
| `UC-PPL-16` | Consultar mi perfil | `ACT-AUTHENTICATED` |
| `UC-PPL-17` | Editar mi contacto | `ACT-AUTHENTICATED` |
| `UC-STR-01` | Registrar una temporada | `ACT-ADMIN` |
| `UC-STR-02` | Actualizar los datos de una temporada | `ACT-ADMIN` |
| `UC-STR-03` | Registrar una división | `ACT-ADMIN` |
| `UC-STR-04` | Actualizar una división | `ACT-ADMIN` |
| `UC-STR-05` | Archivar una división | `ACT-ADMIN` |
| `UC-STR-06` | Registrar una línea | `ACT-ADMIN` |
| `UC-STR-07` | Actualizar una línea | `ACT-ADMIN` |
| `UC-STR-08` | Archivar una línea | `ACT-ADMIN` |
| `UC-STR-09` | Registrar un equipo | `ACT-ADMIN` |
| `UC-STR-10` | Actualizar un equipo | `ACT-ADMIN` |
| `UC-STR-11` | Activar un equipo | `ACT-ADMIN` |
| `UC-STR-12` | Archivar un equipo | `ACT-ADMIN` |
| `UC-STR-13` | Registrar una sede | `ACT-ADMIN` |
| `UC-STR-14` | Corregir los datos de una sede | `ACT-ADMIN` |
| `UC-STR-15` | Archivar una sede | `ACT-ADMIN` |
| `UC-EVT-01` | Crear un entrenamiento | `ACT-COACH`, `ACT-SUBCOMMITTEE` |
| `UC-EVT-02` | Crear un partido | `ACT-COACH`, `ACT-SUBCOMMITTEE` |
| `UC-EVT-03` | Crear un evento del club | `ACT-SUBCOMMITTEE`, `ACT-COACH` |
| `UC-EVT-04` | Editar un evento | `ACT-COACH`, `ACT-SUBCOMMITTEE` |
| `UC-EVT-05` | Posponer un evento | `ACT-COACH`, `ACT-SUBCOMMITTEE` |
| `UC-EVT-06` | Reanudar un evento pospuesto | `ACT-COACH`, `ACT-SUBCOMMITTEE` |
| `UC-EVT-07` | Cancelar un evento | `ACT-COACH`, `ACT-SUBCOMMITTEE` |
| `UC-EVT-08` | Restaurar un evento cancelado | `ACT-COACH`, `ACT-SUBCOMMITTEE` |
| `UC-EVT-09` | Completar un evento | `ACT-COACH`, `ACT-SUBCOMMITTEE` |
| `UC-EVT-10` | Abandonar un evento | `ACT-COACH`, `ACT-SUBCOMMITTEE` |
| `UC-EVT-11` | Revisar el impacto de un cambio material | `ACT-COACH`, `ACT-SUBCOMMITTEE` |
| `UC-EVT-12` | Resolver un conflicto de edición concurrente | `ACT-COACH`, `ACT-SUBCOMMITTEE` |
| `UC-EVT-13` | Crear una serie de eventos | `ACT-COACH`, `ACT-SUBCOMMITTEE` |
| `UC-EVT-14` | Finalizar una serie de eventos | `ACT-COACH`, `ACT-SUBCOMMITTEE` |
| `UC-EVT-15` | Programar una jornada | `ACT-COACH`, `ACT-SUBCOMMITTEE` |
| `UC-EVT-16` | Actualizar la logística de un evento | `ACT-COACH`, `ACT-SUBCOMMITTEE` · `ACT-CAPTAIN` alterno |
| `UC-EVT-17` | Consultar el calendario | `ACT-AUTHENTICATED` |
| `UC-EVT-18` | Revisar lo que requiere mi atención | `ACT-AUTHENTICATED` |
| `UC-EVT-19` | Consultar un evento | `ACT-AUTHENTICATED` |
| `UC-PRT-01` | Responder mi disponibilidad | `ACT-PLAYER`, `ACT-GUARDIAN` |
| `UC-PRT-02` | Preparar la convocatoria de un partido | `ACT-COACH` |
| `UC-PRT-03` | Publicar la convocatoria de un partido | `ACT-COACH` |
| `UC-PRT-04` | Revisar los conflictos de una convocatoria | `ACT-COACH` |
| `UC-PRT-05` | Registrar la asistencia de un evento | `ACT-COACH` |
| `UC-PRT-06` | Cerrar la asistencia de un evento | `ACT-COACH` |
| `UC-PRT-07` | Corregir la asistencia de un evento | `ACT-COACH` |
| `UC-PRT-08` | Registrar el resultado de un partido | `ACT-COACH` |
| `UC-PRT-09` | Finalizar el resultado de un partido | `ACT-COACH` |
| `UC-PRT-10` | Corregir el resultado de un partido | `ACT-COACH` |
| `UC-PRT-11` | Consultar las estadísticas de un partido | `ACT-COACH` · `ACT-CAPTAIN` alterno |
| `UC-PRT-12` | Registrar una restricción de habilitación | `ACT-SUBCOMMITTEE`, `ACT-ADMIN` |
| `UC-PRT-13` | Consultar el estado de habilitación de una jugadora | `ACT-SUBCOMMITTEE`, `ACT-ADMIN`, `ACT-COACH` |
| `UC-COM-01` | Redactar un comunicado | `ACT-SUBCOMMITTEE` |
| `UC-COM-02` | Publicar un comunicado | `ACT-SUBCOMMITTEE` |
| `UC-COM-03` | Corregir un comunicado publicado | `ACT-SUBCOMMITTEE` |
| `UC-COM-04` | Archivar un comunicado | `ACT-SUBCOMMITTEE` |
| `UC-COM-05` | Consultar un comunicado | `ACT-AUTHENTICATED` |
| `UC-COM-06` | Abrir una conversación directa | `ACT-AUTHENTICATED` con derecho comunicacional |
| `UC-COM-07` | Crear una conversación de grupo | `ACT-AUTHENTICATED` con derecho comunicacional |
| `UC-COM-08` | Abrir la conversación canónica del equipo o del evento | `ACT-AUTHENTICATED` con derecho comunicacional |
| `UC-COM-09` | Enviar un mensaje | `ACT-AUTHENTICATED` participante |
| `UC-COM-10` | Editar un mensaje propio | `ACT-AUTHENTICATED` |
| `UC-COM-11` | Eliminar un mensaje propio | `ACT-AUTHENTICATED` |
| `UC-COM-12` | Archivar una conversación de grupo | `ACT-AUTHENTICATED` participante |
| `UC-COM-13` | Consultar mis notificaciones | `ACT-AUTHENTICATED` |
| `UC-COM-14` | Marcar una notificación como leída | `ACT-AUTHENTICATED` |
| `UC-CMP-01` | Registrar una competencia | `ACT-SUBCOMMITTEE`, `ACT-ADMIN` |
| `UC-CMP-02` | Activar una competencia | `ACT-SUBCOMMITTEE`, `ACT-ADMIN` |
| `UC-CMP-03` | Cerrar una competencia | `ACT-SUBCOMMITTEE`, `ACT-ADMIN` |
| `UC-CMP-04` | Inscribir un equipo en una competencia | `ACT-SUBCOMMITTEE`, `ACT-ADMIN` |
| `UC-CMP-05` | Inscribir una línea en una competencia | `ACT-SUBCOMMITTEE`, `ACT-ADMIN` |
| `UC-CMP-06` | Activar una inscripción en una competencia | `ACT-SUBCOMMITTEE`, `ACT-ADMIN` |
| `UC-CMP-07` | Finalizar una inscripción en una competencia | `ACT-SUBCOMMITTEE`, `ACT-ADMIN` |
| `UC-CMP-08` | Registrar una referencia externa | `ACT-SUBCOMMITTEE`, `ACT-ADMIN` |
| `UC-CMP-09` | Consultar una referencia externa | `ACT-COACH`, `ACT-SUBCOMMITTEE`, `ACT-ADMIN` |
| `UC-INS-01` | Buscar en el club | `ACT-AUTHENTICATED` |
| `UC-INS-02` | Consultar el informe de asistencia | `ACT-COACH`, `ACT-SUBCOMMITTEE`, `ACT-PLAYER`, `ACT-CAPTAIN` |
| `UC-INS-03` | Consultar el informe de rendimiento | `ACT-COACH`, `ACT-SUBCOMMITTEE`, `ACT-PLAYER`, `ACT-CAPTAIN` |
| `UC-INS-04` | Consultar el historial de un objeto | `ACT-AUTHENTICATED` |
| `UC-INS-05` | Consultar la auditoría administrativa | `ACT-ADMIN` |

---

# 5. PARTICIPACIÓN DE ACTORES

## 5.1 Quién inicia qué

La columna cuenta un CU una vez por cada actor que puede **iniciarlo** con autoridad propia. Un CU
con tres iniciadores cuenta en tres filas, y por eso la suma (134) supera el total de CU (102).

| Actor | CU que puede iniciar | CU donde es secundario o alternativo autorizado |
|---|---:|---:|
| `ACT-ADMIN` | **42** | 6 |
| `ACT-SUBCOMMITTEE` | **32** | 11 |
| `ACT-COACH` | **28** | 8 |
| `ACT-AUTHENTICATED` (abstracto → sus 6 roles) | **24** | 12 |
| `ACT-PLAYER` | **3** | 5 |
| `ACT-GUARDIAN` | **3** | 5 |
| `ACT-UNAUTHENTICATED` | **2** | 1 |
| `ACT-CAPTAIN` | **0** | 4 |
| **Total de membresías** | **134** | — |

`ACT-AUTHENTICATED` es el actor abstracto de E2 y **no concede autoridad por sí mismo**. Sus 24 CU
son las capacidades propias que los 6 roles concretos ejercen: contacto, contraseña, sesiones,
perfil, y las cinco proyecciones (`UC-EVT-17`, `UC-EVT-18`, `UC-EVT-19`, `UC-INS-01`,
`UC-INS-04`) cuyo contenido depende del scope de cada actor.

## 5.2 Los cuatro casos que exigen justificación

| Actor | Situación | Veredicto |
|---|---|---|
| `ACT-CAPTAIN` | 0 CU como iniciador | **Correcto.** Puede iniciar `UC-EVT-16` (logística) con autoridad propia de scope `TEAM`, pero comparte objetivo, flujo y resultado con `ACT-COACH` y `ACT-SUBCOMMITTEE`, así que §17 del brief impide duplicar el CU. Se registra como `ALTERNATE AUTHORIZED ACTOR`. E2 §11.3 llegó a la misma conclusión por otra vía |
| `ACT-CAPTAIN` | No es iniciador en ningún otro CU | **Correcto y verificable.** No existe "logística como capitana", ni "disponibilidad como capitana", ni "informes como capitana" con CU propio. En `UC-INS-02` y `UC-INS-03` es alterno autorizado con `TEAM` "si corresponde" (PT §5, `ACTOR-FEEDBACK-03`). En `UC-PPL-07` y `UC-PPL-08` es **afectada**, no participante |
| `ACT-GUARDIAN` | 3 CU como iniciador | **Correcto.** `UC-PPL-13` (ver la información del menor), `UC-PRT-01` (responder por el menor, mismo CU que la jugadora) y `UC-PPL-14` (ver quién actúa por la cuenta). Ninguno le da rol deportivo, accesorio comunicacional ni autoridad fuera del menor |
| `ACT-UNAUTHENTICATED` | 2 CU como iniciador | **Correcto.** `UC-IAM-01` e `UC-IAM-04`. E2 §3.2 lo define como una persona real en un momento concreto, no como un actor definido por un estado de `Account` |

## 5.3 Coexistencia que E3 respeta y no convierte en herencia

| Relación | Efecto en E3 |
|---|---|
| `ACT-PLAYER` + `ACT-CAPTAIN` | `ACT-CAPTAIN` participa en `UC-PRT-01` **sólo** con `RoleAssignment PLAYER` vigente, por la invariante de co-ocurrencia de E2 §7.5. **Nunca** por analogía con `ACT-COACH` |
| `ACT-COACH` + `ACT-PLAYER` | Un entrenador puede responder su propia disponibilidad si además tiene `PLAYER` vigente. Sin `PLAYER`, **no** |
| `ACT-ADMIN` + `ACT-ADMIN` como `ACT-COACH` | **No hay ningún CU con doble bundling.** Si un admin también es entrenador, son dos decisiones de authority independientes |
| `ACT-GUARDIAN` + cualquier rol | Fuente separada. `UC-PPL-11` y `UC-PPL-12` no conceden roles; `REQ-PPL-012` lo prohíbe explícitamente |

---

# 6. PRINCIPIOS DE AUTORIDAD Y SCOPE

## 6.1 La fórmula, heredada sin modificar

```
ROL + ACCIÓN + ALCANCE + ESTADO DEL OBJETO + AUTORIDAD POR CAMPO + ORIGEN
default: DENEGAR
```

Los 102 CU se verificaron contra los seis conjunctos. **El quinto —autoridad por campo— es el que
más se respeta y el que más se ha documentado por CU.**

## 6.2 Scope: sólo los seis que existen

| Scope | Actor que lo tiene | CU donde aparece |
|---|---|---|
| `SELF` | los 6 roles + `ACT-UNAUTHENTICATED` | `UC-IAM-01`…`UC-IAM-08`, `UC-IAM-10`, `UC-PPL-14`…`UC-PPL-17`, `UC-COM-06`…`UC-COM-11`, `UC-INS-04` |
| `CHILD` | `ACT-GUARDIAN` | `UC-PPL-11`, `UC-PPL-12`, `UC-PPL-13`, `UC-PRT-01` |
| `TEAM` | `ACT-PLAYER`, `ACT-CAPTAIN`, `ACT-COACH` | `UC-EVT-01`…`UC-EVT-08`, `UC-EVT-16`, `UC-PRT-01`…`UC-PRT-11`, `UC-COM-08`, `UC-INS-02`, `UC-INS-03` |
| `TEAM_SET` | `ACT-SUBCOMMITTEE` | `UC-COM-01`, `UC-COM-02`, `UC-COM-05` |
| `CLUB` | `ACT-SUBCOMMITTEE`, `ACT-ADMIN` | `UC-PPL-01`…`UC-PPL-12`, `UC-STR-01`…`UC-STR-15`, `UC-EVT-01`…`UC-EVT-03`, `UC-PRT-12`, `UC-PRT-13`, `UC-COM-01`…`UC-COM-04`, `UC-CMP-01`…`UC-CMP-08`, `UC-INS-05` |
| `EVENT` | `ACT-COACH` | `UC-EVT-01`, `UC-EVT-04`…`UC-EVT-16`, `UC-COM-08`, `UC-CMP-09` |

`DIVISION`, `LINE`, `SEASON` y `COMPETITION` **no** son scopes de actor: acotan filas, no amplían
alcance (E2 §9.2). Aparecen en `UC-CMP-04` y `UC-CMP-05` como **alcance de dato** de la
inscripción, nunca como scope del actor.

## 6.3 Los cinco límites que ningún CU puede violar

| Límite | Dónde se verifica | Evidencia |
|---|---|---|
| `ACT-ADMIN` **no** tiene autoridad deportiva | Ninguno de sus 42 CU es deportivo: son identidad, personas, estructura, comunicados de lectura, habilitación, competencia, referencia externa y auditoría | PT §5; E2 §14.1 |
| `ACT-CAPTAIN` **no** tiene autoridad de `COACH` | `UC-EVT-16` es el único CU que puede iniciar. No crea eventos, no gestiona convocatoria, asistencia, resultado ni estadísticas | PT §5; E2 §14.5 |
| `ACT-GUARDIAN` **no** sale del menor | Sus 3 CU tienen todos `CHILD` como scope y `GuardianRelationship` como authority source | PT §6; E2 §14.6 |
| `ACT-AUTHENTICATED` **no** concede acceso por sí mismo | Aparece como etiqueta de los 6 roles, nunca como permiso. `REQ-IAM-012` es `CROSS_CUTTING` y su unsatisfactory caso es `/no-access` sin datos | E2 §4.2, §4.4 |
| El campo no autorizado **no existe en la respuesta** | `REQ-PPL-011` es `CROSS_CUTTING` y aparece en las AC de los 102 CU donde hay PII | E2 §10.1; PT §6 |

## 6.4 Restricciones por estado de objeto que gobiernan CU

| Objeto | Estado | Efecto | CU afectados |
|---|---|---|---|
| `Event` | `DRAFT` | No acepta disponibilidad | `UC-PRT-01` |
| `Event` | `POSTPONED` | Conserva respuestas; no acepta nuevas | `UC-PRT-01`, `UC-EVT-06` |
| `Event` | `CANCELLED` / `COMPLETED` / `ABANDONED` | Terminal; sin respuesta de disponibilidad como acción principal | `UC-PRT-01`, `UC-EVT-19` |
| `Event` | `COMPLETED` | No se reabre | `UC-EVT-04` |
| `Attendance` | `CLOSED` | No admite marcaje nuevo sin corrección | `UC-PRT-05`, `UC-PRT-07` |
| `MatchRecord` | `FINAL` | No se edita por la vía normal | `UC-PRT-09`, `UC-PRT-10` |
| `MatchRecord` + `Event` | evento ∉ {`COMPLETED`, `ABANDONED`} | `MATCH_STATE_INCOMPATIBLE` | `UC-PRT-08`, `UC-PRT-09` |
| `EventLogistics` | evento terminal | Logística no editable | `UC-EVT-16` |
| `Selection` | evento ≠ `SCHEDULED` o tipo ≠ `MATCH` | No aplica | `UC-PRT-02`, `UC-PRT-03` |
| `Announcement` | `PUBLISHED` | La audiencia es snapshot inmutable | `UC-COM-02`, `UC-COM-03`, `UC-COM-05` |
| `Competition` | inscripciones activas | Cerrar se rechaza explicándolas | `UC-CMP-03` |
| `Team` | con equipos activos en la división o línea | Renombrar se rechaza | `UC-STR-04`, `UC-STR-07` |
| Estructura | con dependencia activa | Archivar se rechaza nombrando la dependencia | `UC-STR-05`, `UC-STR-08`, `UC-STR-12`, `UC-STR-15` |
| `Membership` | con dependencias activas | Finalizar se rechaza; el período se conserva | `UC-PPL-05` |
| `Account` | `DISABLED` | Revoca sesiones | `UC-IAM-02` |
| `Account` | `PENDING` / `DISABLED` | Acceso rechazado, sin sesión | `UC-IAM-01` |
| Conjunto de `ADMIN` | quedaría en 0 `ACTIVE`/`CLUB` | `LAST_ADMIN_REQUIRED`; nada cambia | `UC-IAM-02`, `UC-IAM-05`, `UC-IAM-09`, `UC-PPL-10` |
| `GuardianRelationship` | finalizada | Deja de conceder acceso; el período se conserva | `UC-PPL-12`, `UC-PPL-13`, `UC-PRT-01` |
| `RoleAssignment` | expirada | No computa | `UC-PPL-09`, `UC-PPL-10` |
| `Event MATCH` | `SCHEDULED` | Cambiar el equipo se rechaza | `UC-EVT-02`, `UC-EVT-04` |
| `EventSeries` | `ACTIVE` → `ENDED` | Sin transición inversa | `UC-EVT-14` |
| Estructura | — | `ACT-SUBCOMMITTEE` recibe denegación con explicación | los 15 CU de `STR` |

---

# 7. REGLAS FUNCIONALES DE SOPORTE Y LAS INTERNAS

## 7.1 Los 9 `SUPPORTING`

Un REQ que gobierna un CU sin definirlo. **Ninguno genera CU propio.**

| REQ | Gobierna | Por qué no es un CU |
|---|---|---|
| `REQ-STR-008` | los 15 CU de `STR` | Exige que alta, edición y archivo **existan desde el producto**; no añade un objetivo nuevo, exige que los que ya existen sean alcanzables |
| `REQ-COM-002` | `UC-COM-01`, `UC-COM-02` | Elegir la audiencia es una decisión dentro de redactar y de publicar, no un objetivo aparte |
| `REQ-COM-013` | `UC-COM-06`, `UC-COM-07`, `UC-COM-08` | Define **quién** puede ser destinatario, no **qué** se intenta conseguir |
| `REQ-COM-015` | `UC-COM-13`, `UC-PRT-03` | Notificar altas y bajas es el efecto observable de publicar, no un goal |
| `REQ-COM-016` | `UC-COM-13`, `UC-EVT-04` | Igual: efecto del cambio de destinatarios |
| `REQ-INS-002` | `UC-INS-01` | Alcance y PII de la búsqueda son reglas del mismo objetivo |
| `REQ-INS-003` | `UC-INS-01` | La consulta vive en la navegación: regla del mismo objetivo |
| `REQ-INS-006` | `UC-INS-02`, `UC-INS-03` | El período aplicado es visible y modificable: alternativa interna del informe |
| `REQ-INS-007` | `UC-INS-02`, `UC-INS-03` | El enlace al origen es propiedad del informe, no un objetivo |

## 7.2 Los 23 `BUSINESS_RULE`

Restringen o condicionan otros CU. Ninguno es un objetivo.

| Dominio | REQ | Regla |
|---|---|---|
| IAM | `REQ-IAM-013` | `LAST_ADMIN_REQUIRED`: nada cambia |
| IAM | `REQ-IAM-014` | Username único, inmutable e independiente del equipo |
| PPL | `REQ-PPL-012` | La representación no otorga rol deportivo ni accesorio comunicacional |
| PPL | `REQ-PPL-014` | Identidad estable del equipo; renombrar con equipos activos se rechaza |
| PPL | `REQ-PPL-015` | Nada con significado se elimina; el período se conserva |
| STR | `REQ-STR-006` | Valla de dependencias al archivar, nombrando la dependencia |
| STR | `REQ-STR-009` | `ACT-SUBCOMMITTEE` no accede a estructura, con explicación del motivo |
| STR | `REQ-STR-012` | Regla A/B: corregir identidad de sede no reprograma; cambiar la sede de un evento sí |
| EVT | `REQ-EVT-005` | Destinatarios plurales, ambas listas independientes |
| EVT | `REQ-EVT-006` | El equipo del partido es inmutable una vez programado |
| EVT | `REQ-EVT-008` | Los estados terminales tienen composición propia y consecuencia explicada |
| EVT | `REQ-EVT-009` | Programar es una operación: el estado final persiste en la misma operación |
| EVT | `REQ-EVT-015` | Las tres opciones de alcance de serie, con impacto sobre el conjunto real |
| EVT | `REQ-EVT-017` | Matriz de aplicabilidad por tipo de evento |
| EVT | `REQ-EVT-024` | Valla de dependencias de jornada |
| PRT | `REQ-PRT-003` | Estados derivados de la disponibilidad; cambio coordinativo sí, no coordinativo no |
| PRT | `REQ-PRT-004` | Sólo con `SCHEDULED`; `POSTPONED` conserva y no acepta |
| PRT | `REQ-PRT-006` | La publicación **no** se bloquea por un conflicto derivado |
| PRT | `REQ-PRT-015` | `PLAYED`/`FORFEIT` ⇒ `COMPLETED`; `ABANDONED` ⇒ `ABANDONED` |
| PRT | `REQ-PRT-019` | Matriz de aplicabilidad por tipo |
| CMP | `REQ-CMP-004` | `TEAM` y `LINE` son alcances distintos e incompatibles |
| CMP | `REQ-CMP-005` | La inscripción usada por un partido debe ser de la competencia de la jornada |
| CMP | `REQ-CMP-008` | El alcance limita dónde aplica; motivo y origen sólo para Subcomisión y Admin |

## 7.3 Los 9 `SYSTEM_INTERNAL`

Los 18 funcionales que E2 marcó `SYSTEM_INTERNAL` se analizaron uno por uno (§34 del brief). **9
siguen siendo `SYSTEM_INTERNAL` y 9 se refinaron a `BUSINESS_RULE` o `CROSS_CUTTING`. Ninguno
genera un CU nuevo.**

### 7.3.1 Los 9 que siguen siendo `SYSTEM_INTERNAL`

| REQ | Análisis §34 | Resultado |
|---|---|---|
| `REQ-STR-007` | Zona horaria. No hay nadie que "quiera" una zona horaria | **B.** Invariante de presentación |
| `REQ-STR-011` | Referencias por identidad. Nadie intenta conseguirla | **B.** Integridad referencial |
| `REQ-EVT-001` | Invariantes de fecha y horario de un evento | **B.** Invariante |
| `REQ-PRT-010` | "Sin registrar" ≠ "ausente". Observable, pero el goal sigue siendo registrar asistencia | **A.** Regla de soporte de `UC-PRT-05` y `UC-INS-02` |
| `REQ-PRT-018` | Los cuatro conceptos de participación no se derivan entre sí | **B.** Invariante transversal. **Es la regla que impide 3 relaciones `include`** |
| `REQ-COM-003` | La audiencia es un snapshot al publicar | **A.** Regla de soporte de `UC-COM-02`, `UC-COM-03`, `UC-COM-05` |
| `REQ-COM-011` | Acceso temporal por `joined_at` / `left_at` | **A.** Regla de soporte de los 5 CU de conversación |
| `REQ-COM-017` | Lista negativa cerrada de hechos que no notifican | **A.** Regla de soporte de `UC-COM-13` y de 4 CU de `PRT` |
| `REQ-CMP-007` | Límite federativo: la referencia **es** referencia | **A.** Regla de soporte de `UC-CMP-08`, `UC-CMP-09` |

### 7.3.2 Los 9 que E3 refinó desde el `SYSTEM_INTERNAL` de E2

E2 marcó 18 REQ funcionales como `SYSTEM_INTERNAL`. **9** siguen siéndolo (tabla 7.3.1). Los
**otros 9** E3 los tipa `BUSINESS_RULE` o `CROSS_CUTTING` porque participan de un CU de forma
distinta a "regla interna sin objetivo".

| REQ | E3 lo clasifica | Por qué |
|---|---|---|
| `REQ-IAM-016` | `CROSS_CUTTING` | Fórmula de los 6 conjunctos. Gobierna los 102 CU y sólo es observable como denegación. precursor de `ACTOR-FEEDBACK-04`: E2 ya pidió listar los actores afectados |
| `REQ-IAM-017` | `CROSS_CUTTING` | Fuente única de navegación y de acciones. `REQ-SYS-012` es quien lo hace observable |
| `REQ-PPL-011` | `CROSS_CUTTING` | Autoridad por campo. Se observa en cada respuesta y gobierna los 102 CU donde hay PII |
| `REQ-EVT-005` | `BUSINESS_RULE` | Regla de la **forma** del destinatario. Condiciona cómo se crea un evento; no es un goal |
| `REQ-EVT-006` | `BUSINESS_RULE` | Invariante que condiciona la edición de un partido. No es un goal |
| `REQ-PRT-003` | `BUSINESS_RULE` | Regla de derivación que condiciona la disponibilidad. No es un goal |
| `REQ-PRT-015` | `BUSINESS_RULE` | Regla de compatibilidad entre resultado y ciclo del evento. No es un goal |
| `REQ-PRT-019` | `BUSINESS_RULE` | Matriz de aplicabilidad por tipo. No es un goal |
| `REQ-COM-012` | `CROSS_CUTTING` | Regla de elegibilidad comunicacional. `ACTOR-FEEDBACK-04` ya pedía esto explícitamente |

**Reparto:** `5` a `BUSINESS_RULE` + `4` a `CROSS_CUTTING` = `9`. Con los 9 de 7.3.1:
`9 + 9 = 18`. **Coincide con el `SYSTEM_INTERNAL` funcional de E2 §16.1.**

**Un caso adicional.** `REQ-IAM-012` lo marcó E2 como `SYSTEM_INTERNAL` funcional y E3 lo tipa
`CROSS_CUTTING`. No está en la tabla porque E2 no lo contado entre los 18 funcionales: su
`Actor Status` era `SYSTEM_INTERNAL` pero su `Coverage Type` es de regla transversal. Convertirlo
en CU obligaría a un `<<include>>` desde casi todos los CU restantes, y §24 del brief lo prohíbe
por nombre. Es `REJ-01`.

**En ningún caso cambió el `Actor Status` heredado de E2. Cambia cómo participa el REQ en un CU, no
quién lo aplica.** Verificado en `GEI_REQ_ACTOR_USE_CASE_MATRIX_V1.md` §11.4:
`104 + 18 = 122`, **0 actores modificados**.
### 7.3.3 El resultado del análisis §34

| Categoría §34 | REQ | Genera CU nuevo |
|---|---:|---|
| **A.** Regla de soporte de uno o más CU | 7 | **0** |
| **B.** Invariante transversal | 11 | **0** |
| **C.** User goal mal clasificado | **0** | **0** |

**Ningún REQ `SYSTEM_INTERNAL` de E2 escondía un objetivo de usuario.** Los tres casos que más
podían hacerlo se analizaron por separado:

| REQ | Por qué parecía un goal | Veredicto |
|---|---|---|
| `REQ-EVT-005` Destinatarios plurales | "Quiero gestionar a qui\u00e9n convoco" | Es una **regla de la forma** del destinatario. El goal es el del CU que lo crea: `UC-EVT-01`, `UC-EVT-02`, `UC-EVT-03` |
| `REQ-COM-011` Participantes y acceso temporal | "Quiero gestionar participantes de grupo" | `OUT-COM-002` excluye **explícitamente** la gestión de participantes y salir del grupo. El REQ sólo regula el corte histórico de acceso |
| `REQ-CMP-007` Límite federativo | "Quiero resolver pases federativos" | `OUT-CMP-004` excluye pases y habilitaciones federativas completas. El REQ obliga a **no** resolverlos |

---

# 8. ESTADO DE LAS RELACIONES

## 8.1 Nada congelado

**Este freeze NO congela ninguna relación `<<include>>` ni `<<extend>>`.** Congelarlas es trabajo de
E4. Lo que este freeze congela es el **conjunto de CU** y el hecho de que cada uno tiene un goal, un
actor, un resultado y un REQ.

## 8.2 Las 8 candidatas

| ID | Tipo | Source → Target | Condición | Confianza |
|---|---|---|---|---|
| `INC-01` | `include` | Bloque de gestión sensible → `UC-IAM-09` | Sin reautenticación vigente | **ALTA** |
| `INC-02` | `include` | `UC-EVT-04`, `05`, `07`, `08`, `16` → `UC-EVT-11` | Cambio material | **ALTA** (MEDIA para las transiciones) |
| `EXT-01` | `extend` | `UC-EVT-04` → `UC-EVT-12` | `STALE_VERSION` | **ALTA** |
| `EXT-02` | `extend` | `UC-PRT-05`, `UC-PRT-06` → `UC-PRT-07` | Planilla `CLOSED` | **ALTA** |
| `EXT-03` | `extend` | `UC-PRT-09` → `UC-PRT-10` | Resultado `FINAL` | **ALTA** |
| `EXT-04` | `extend` | `UC-PRT-02`, `UC-PRT-03` → `UC-PRT-04` | Conflictos derivados | **ALTA** |
| `EXT-05` | `extend` | `UC-COM-13` → `UC-COM-14` | Notificación no leída | **MEDIA** |
| `EXT-06` | `extend` | `UC-PPL-06` → `UC-PPL-02` | `PLAYER_PROFILE_INCOMPLETE` | **MEDIA** |

## 8.3 Las 9 rechazadas

| ID | Relación rechazada | AC que lo prohíbe |
|---|---|---|
| `REJ-01` | "Autenticar usuario" como `include` de todo | `REQ-IAM-012`: sin rol ni delegación ⇒ `/no-access`. Es **precondición** |
| `REJ-02` | `UC-IAM-01` como `include` de todo | Ya es un CU con goal y outcome propios. Es hermano, no behaviour embebido |
| `REJ-03` | Disponibilidad `include` en asistencia | `REQ-PRT-018`: no se derivan entre sí |
| `REJ-04` | Habilitación `include` en publicar convocatoria | `REQ-PRT-006`: **publica igual**. Un `include` aquí falsearía la regla |
| `REJ-05` | "Solicitar reconfirmación" como `extend` | `REQ-PRT-001` *"cambiar sustituye"* y `REQ-PRT-003`: el estado es **derivado**. No existe el comando |
| `REJ-06` | Archivar estructura `include` en archivar equipo | `REQ-STR-006` es una **valla**, no una composición |
| `REJ-07` | Historial `include` en las correcciones | La corrección **produce** historia; `REQ-INS-011` la expone donde corresponde |
| `REJ-08` | Consultar comunicado `include` en publicarlo | `REQ-COM-001` frente a `REQ-COM-005`: actores y objetivos distintos |
| `REJ-09` | Archivar conversación `include` en enviar mensaje | `REQ-COM-007` AC 4 sólo para grupos; objetivo independiente |

## 8.4 Lo que E4 no debe dibujar

Las 9 de §8.3. En particular **no** debe dibujar una arista `include` desde cada CU hacia
"autenticarse": `REQ-IAM-012` es una precondición y hacerlo ensuciaría el modelo por completo.

---

# 9. EXCLUSIONES EXPLÍCITAS

## 9.1 Los 22 objetivos que existen en el CURRENT y NO son casos de uso

| Objetivo tempting | Por qué no es CU |
|---|---|
| Restaurar estructura archivada | `DEF-STR-001`/`DEF-STR-002` DEFER; PT §9 y §19 no autorizan la transición |
| Bloque "En el equipo" de capitanía en Inicio | `IWR-06`, `ACCIDENTAL UI`. No hay REQ que lo pida |
| "Marcar todas como leídas" | `IWR-07`, `ACCIDENTAL UI`. Cubierto por la presentación de `REQ-COM-018` |
| Filtro "Todas / Sin leer" como control separado | `IWR-08`, `ACCIDENTAL UI`. `REQ-COM-018` codifica el no-leído una sola vez |
| Hub `/more` | `IWR-01`, `ACCIDENTAL UI`. PT §23 lista 38 rutas canónicas y `/more` no está entre ellas |
| Ruta `/conversations/new` | `IWR-02`, `ACCIDENTAL UI`. Duplica `/communication/conversations/new` |
| Conmutador de actor de demostración por parámetro de URL | `IWR-03`. Arnés de desarrollo; PT §81 lo prohíbe como artefacto de producto |
| Credenciales de demostración precargadas | `IWR-04`. Contradice PT §48 |
| Código de activación como literal compartido | `IWR-05`. Contradice PT §51 |
| Contadores de impacto con cifras fijas | `IWR-09`, `OUTDATED IMPLEMENTATION DETAIL`. Contradice `REQ-EVT-012` y `REQ-SYS-015` |
| Fusión `ADMIN`/`SUBCOMMITTEE` por `officialOnEvent = clubWide` | `ACTOR-UI-01`. Concede autoridad deportiva a `ACT-ADMIN`, que PT §5 niega |
| `canViewEligibilityStatus` a la propia persona | `ACTOR-UI-09`. `CURRENT CONTRADICTORY` bajo `ACTOR-DECISION-01` (a) |
| Cuota de instancia de administrador | `LAST_ADMIN_REQUIRED` es una valla, no un objetivo |
| "Validar token" | No hay nadie que lo intente. `REQ-IAM-006` es `SYSTEM_INTERNAL` |
| Guardar el formulario | Microacción. `REQ-SYS-018` prohíbe la coreografía de guardado |
| Elegir fecha en un calendario | Microacción. `REQ-STR-013` es `CROSS_CUTTING` |
| Abrir un modal | Microacción |
| Ir a `/calendar` | Un destination no es un objetivo. `REQ-IAM-017` gobierna la navegación |
| Actualizar state en el cliente | `REQ-SYS-019` y `REQ-SYS-041` lo prohíbe: las proyecciones no son dueñas |
| Editar una fila | Microacción |
| Llamar un endpoint | `OUT-SYS-002` y `OUT-SYS-003` |
| Consultar la lista de conversaciones | Ningún REQ lo expresa como goal. Es mecanismo de navegación de `UC-COM-06`/`08` |
| Reabrir una planilla de asistencia | `REQ-PRT-011` NOTES: la corrección la cubre (`CON-13`) |

## 9.2 Lo que sigue fuera de V1

Los **14 `DEF-*`** y los **26 `OUT-*`** de E1 §3.2 y §3.3 siguen fuera. Ninguno recibió CU, y
`GEI_ACTOR_REQUIREMENT_MATRIX_V1.md` §11.3 de E2 ya los había dejado sin actor. **Modelarlos sería
ampliar alcance.**

---

# 10. RESUMEN DE COBERTURA DE REQUERIMIENTOS

## 10.1 Los 122 funcionales

| `Coverage Type` | REQ | Significado |
|---|---:|---|
| `PRIMARY` | **70** | El REQ expresa el objetivo del CU |
| `SUPPORTING` | **9** | El REQ gobierna un CU sin definirlo |
| `BUSINESS_RULE` | **23** | Restringe o condiciona otros CU |
| `SYSTEM_INTERNAL` | **9** | Regla interna sin objetivo de usuario |
| `CROSS_CUTTING` | **11** | Regla transversal de autoridad o de presentación |
| **`UNMAPPED`** | **0** | — |
| **TOTAL** | **122** | — |

**Verificación:** `70 + 9 + 23 + 9 + 11 = 122`. `13+16+13+24+19+18+8+10+1 = 122`. **Coinciden.**

## 10.2 Los 35 no funcionales

| `Coverage Type` | REQ |
|---|---:|
| `CROSS_CUTTING` | **22** |
| `SYSTEM_INTERNAL` | **12** |
| `EXTERNAL` | **1** |
| **TOTAL** | **35** |

`22 + 12 + 1 = 35`. **Ninguno genera CU.**

## 10.3 Los 157

| Métrica | Valor |
|---|---:|
| REQ IN totales | **157** |
| Con destino explícito | **157** |
| `UNMAPPED` | **0** |

## 10.4 Correspondencia con el `Actor Status` de E2

| `Actor Status` de E2 | REQ | Actor cambió en E3 |
|---|---:|---:|
| `MAPPED` | 104 | **0** |
| `SYSTEM_INTERNAL` (funcionales) | 18 | **0** |
| `NOT_APPLICABLE` (no funcional) | 1 | **0** |
| `AMBIGUOUS` | 0 | — |

**0 actores modificados. 0 actores añadidos. 0 actores eliminados.** Los 8 actores de E2 §15 son
los 8 que aparecen en los 102 CU.

---

# 11. ÍNDICE DE CASOS DE USO

| Rango | IDs | N.º | Actor dominante |
|---|---|---:|---|
| Identidad y acceso | `UC-IAM-01` … `UC-IAM-10` | 10 | `ACT-ADMIN` (4), `ACT-AUTHENTICATED` (4) |
| Personas y relaciones | `UC-PPL-01` … `UC-PPL-17` | 17 | `ACT-ADMIN` (12) |
| Estructura del club | `UC-STR-01` … `UC-STR-15` | 15 | `ACT-ADMIN` (15) |
| Eventos y calendario | `UC-EVT-01` … `UC-EVT-19` | 19 | `ACT-COACH` + `ACT-SUBCOMMITTEE` (16) |
| Participación | `UC-PRT-01` … `UC-PRT-13` | 13 | `ACT-COACH` (10) |
| Comunicación | `UC-COM-01` … `UC-COM-14` | 14 | `ACT-SUBCOMMITTEE` (4), `ACT-AUTHENTICATED` (10) |
| Competencia | `UC-CMP-01` … `UC-CMP-09` | 9 | `ACT-SUBCOMMITTEE` + `ACT-ADMIN` (8) |
| Búsqueda, informes y auditoría | `UC-INS-01` … `UC-INS-05` | 5 | `ACT-AUTHENTICATED` (3), `ACT-COACH` (2) |
| Transversal | — | **0** | — |
| **TOTAL** | | **102** | |

Índice nominal completo en `docs/use-cases/GEI_MASTER_USE_CASE_CATALOG_V1.md` §11.

---

# 12. RESULTADO DEL GATE

## 12.1 Criterios de la Etapa 3

| # | Criterio | Resultado |
|---:|---|---|
| 1 | 100 % de REQ funcionales IN revisados | **PASS** — 122/122 |
| 2 | 100 % de REQ IN con destino explícito | **PASS** — 157/157 |
| 3 | 0 `UNMAPPED` | **PASS** — 0 |
| 4 | 0 CU sin REQ | **PASS** — 102/102 |
| 5 | 0 CU duplicados | **PASS** — 102 IDs distintos, 38 clusters de duplicidad fusionados |
| 6 | 0 microacciones como CU | **PASS** — 12 candidatos rechazados |
| 7 | 0 rutas como CU | **PASS** — 27 candidatos de ruta/pantalla/componente rechazados |
| 8 | 0 pantallas como CU | **PASS** — ídem |
| 9 | 0 componentes como CU | **PASS** — ídem |
| 10 | 0 actores inventados | **PASS** — los 8 de E2, ninguno nuevo |
| 11 | 0 capacidades nuevas sin Product Truth o REQ | **PASS** — 6 candidatos rechazados por feature creep |
| 12 | 0 CRUD automático | **PASS** — cada CU tiene un verbo de objetivo, no una operación de tabla |
| 13 | 100 % de CU con ID | **PASS** — 102/102, formato `UC-<DOMAIN>-<NN>` |
| 14 | 100 % de CU con nombre | **PASS** — 102/102, `VERBO + OBJETO` |
| 15 | 100 % de CU con goal | **PASS** — 102/102 |
| 16 | 100 % de CU con actor primario | **PASS** — 102/102 |
| 17 | 100 % de CU con trigger | **PASS** — 102/102, ninguno es un gesto de UI |
| 18 | 100 % de CU con success outcome observable | **PASS** — 102/102, ninguno es "se cierra el modal" |
| 19 | 100 % de CU con authority source | **PASS** — 102/102, tomado del Actor Freeze |
| 20 | 100 % de CU con scope | **PASS** — 102/102 |
| 21 | 100 % de CU con cobertura de REQ | **PASS** — 102/102 |
| 22 | 0 `include`/`extend` definitivo sin análisis | **PASS** — 8 candidatas + 9 rechazos, **0 congeladas** |
| 23 | 0 decisiones bloqueantes | **PASS** — 2 abiertas, 0 bloqueantes |
| 24 | `SYS` con CU sólo si hay un goal transversal real | **PASS** — 0 CU en `SYS` |
| 25 | 0 `SYSTEM_INTERNAL` con actor ficticio | **PASS** — 0 |
| 26 | Domain ≠ navegación | **PASS** — ningún nombre de CU contiene "página", "pantalla" ni una ruta |
| 27 | 0 domain = navegación asumida | **PASS** — `UC-EVT-17` se llama "Consultar el calendario" por su **objetivo**, y existe, con entry point independiente de dónde viva |
| 28 | Granularidad validada CU por CU | **PASS** — §47 aplicado a los 102; 5 candidatos agglomerados desagregados |
| 29 | Estrés de actor validado CU por CU | **PASS** — §48 aplicado a los 102 |
| 30 | Estrés de trazabilidad automatizado | **PASS** — 16 checks, todos en 0. Ver matriz §13 |
| 31 | 0 cambios en `src/**` | **PASS** — verificado con `git status` |
| 32 | 0 versiones nuevas de E1/E2 necesarias | **PASS** — 12 feedbacks, 0 `SEMANTIC_CHANGE` |

## 12.2 Resultado por tarea

```
E3-01  EXTRACT USER GOALS                     PASS
E3-02  NORMALIZE / DEDUPLICATE                PASS
E3-03  ACTORS / AUTHORITY                     PASS
E3-04  DOMAIN GROUPING                        PASS
E3-05  INCLUDE / EXTEND CANDIDATES            PASS
E3-06  TRACEABILITY MATRIX                    PASS
E3-07  FINAL FREEZE GATE                      PASS

MASTER USE CASE INVENTORY FREEZE V1          PASS
```

## 12.3 Limitaciones declaradas

1. **`WORKBOOK_UPDATE_BLOCKED` parcialmente resuelto.** El workbook existe como
   `docs/GEI_Roadmap_Maestro_Proyecto.xlsx` —**sin seguimiento en git**—, no en
   `docs/project-control/` como indica el brief. E3 actualizó el archivo real y **no** creó
   `docs/project-control/` ni movió el existente. Ver desviación D-1.
2. **Las relaciones `include`/`extend` no están congeladas.** Es deliberado: las decide E4.
   Este freeze entrega candidatas con evidencia y rechazos con AC.
3. **0 caminos felices, 0 especificaciones, 0 diagramas.** Es Etapa 5 y Etapa 4.
4. **Los entry points no están decididos.** `POTENTIAL CONTEXT` es informativo y no vinculante.
5. **Dos decisiones de E2 siguen como *change candidate*.** E3 aplicó los valores **congelados**
   por E2, no las recomendaciones. Si el club adopta `ACTOR-DECISION-01` (b), el inventario pasa a
   **103 CU** y `REQ-PPL-011` debe ampliarse.
6. **`REQ-DECISION-NEEDED-01` sigue abierta** y este freeze **no** incluye ningún CU de
   restauración de estructura. Si se adopta la opción (a), hay que versionar E1 y **añadir** los CU.
7. **El CURRENT no satisface este modelo.** 8 `RWS-*` sin superficie, `ACTOR-UI-01` y
   `ACTOR-UI-09` contradictorios, y el gap de jornada documentado en el Audit §14. **No se corrigió
   `src/**`.**
8. **Este freeze no diseña superficies, casos de uso detallados, base de datos ni arquitectura.**

---

# 13. QUÉ ALIMENTA ESTE FREEZE

Este documento es la entrada de las etapas siguientes. No las reemplaza.

| Etapa | Qué recibe de este freeze | Qué NO debe tomar de aquí |
|---|---|---|
| **Etapa 4 — Diagramas de casos de uso** | Los 102 CU con actor, goal y resultado; los 8 actores de E2 con su scope; las **8 candidatas** de relación con su condición y confianza; los **9 rechazos** con su AC. Los límites por estado de objeto de §6.4. | **No debe congelar** una relación que E3 no propuso. **No debe dibujar** las 9 relaciones rechazadas. No debe derivar entry points. |
| **Etapa 5 — Especificaciones y actividad** | Los 102 CU con sus precondiciones resumidas y sus reglas de negocio; los criterios de aceptación de los 157 REQ del catálogo de E1; los 23 `BUSINESS_RULE`; el límite sin resolver de `INC-02`. | No debe escribir caminos felices derivados del CURRENT. No debe introducir un objetivo que no esté en §4.2. |
| **Etapa 6 — Modelo de clases** | Las 5 entidades con goals distintos que exigen clases distintas: `Membership`, `TeamAssignment`, `RoleAssignment`, `GuardianRelationship`, `EventSeries`. Los 4 alcances de `CompetitionEntry` (`TEAM`, `LINE`). La asimetría restore-sí-en-evento / restore-no-en-estructura. | No debe derivar clases de los CU. No debe derivar clases de las 45 tablas ni de `src/**`. |
| **Etapa 7 — Trazabilidad** | La columna que faltaba: `REQ → Actor formal → UC`, completa en `GEI_REQ_ACTOR_USE_CASE_MATRIX_V1.md`, con la inversa `UC → REQ`. 157 y 102 respectively, 0 huecos. | — |
| **Etapa 8 — Arquitectura de información** | Que el dominio **no** es navegación: `UC-EVT-17` existe sin página Calendario. Que `ACT-GUARDIAN` **no** tiene destino propio. Que 8 CU no tienen superficie actual y 2 rutas son `ACCIDENTAL UI`. | **No debe convertir** rutas en destinos obligatorios. No debe asignar entry points. |
| **Etapa 9 — Contratos de pantalla** | Las 17 propiedades transversales de §7 de E1 como restricciones de cualquier pantalla. Las 22 exclusiones explícitas de §9.1. `REQ-DECISION-NEEDED-02` sigue abierta. | No debe diseñar pantallas. No debe corregir `src/**` desde aquí. |
| **Etapa 10 — Arquitectura y backend** | La fórmula de 6 conjunctos, el default deny, la tabla de límites por estado de §6.4, y las 8 candidatas de relación como insight de flujo. | **No debe elegir** pila, base de datos, endpoints ni topología. **No debe tratar** la boundary matrix como spec de permisos. |
| **Etapa 11 — Implementación** | Los 102 CU con su REQ de soporte, sus precondiciones y su success outcome. Los 102 IDs estables. Los 22 objetivos que **no** hay que implementar. | No debe implementar lo que está en `DEFER` u `OUT`. No debe reproducir la fusión `ADMIN`/`SUBCOMMITTEE` del CURRENT. |

---

**Fin del Master Use Case Inventory Freeze V1.**

**SOURCE MODIFIED: NO.** Este lote creó únicamente archivos bajo `docs/use-cases/` y actualizó el
workbook de control de proyecto. `docs/requirements/**`, `docs/actors/**` y `src/**` no se tocaron.
