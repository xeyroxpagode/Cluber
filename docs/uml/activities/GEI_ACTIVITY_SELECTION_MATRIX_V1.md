# GEI HOCKEY MANAGEMENT SYSTEM
## ACTIVITY SELECTION MATRIX V1

**Etapa:** 7 — Diagramas de actividad
**Artefacto:** E7-02 · Selección de procesos
**Rama:** `gei/e7-activity-diagrams-freeze-v1`
**Fecha:** 2026-10-08
**Insumo obligatorio:** `GEI_ACTIVITY_RECONSTRUCTION_AUDIT_V1.md` (E7-01 PASS)
**Resultado:** **PASS** — 14 procesos seleccionados de 102 CU evaluados; 0 bloqueos

---

# 1. CRITERIO DE SELECCIÓN

Un diagrama se selecciona cuando describe **un proceso funcional coherente** —no una pantalla— y puede responder: ¿qué lo inicia?, ¿quién hace cada acción?, ¿qué decisiones existen?, ¿cómo continúa cada alternativa?, ¿qué sucede ante un rechazo?, ¿qué resultado exitoso produce?, ¿en qué condiciones finaliza?

Se excluye cuando E5 ya comunica perfectamente el comportamiento (lineal) o cuando el CU queda funcionalmente representado dentro de otro proceso (guard transversal, rama de proceso compuesto). **No se impone cantidad**: la selección sale del análisis, no de una cuota por dominio.

# 2. CANDIDATOS DEL BRIEF AUDITADOS

| Candidato (§6 del brief) | Veredicto | Diagrama |
|---|---|---|
| Activación de cuenta | **Seleccionado** | AD-IAM-02 |
| Reautenticación para gestión sensible | **No seleccionado como diagrama propio** — es regla transversal INC-01 con 0 aristas (E4); se representa como guard transversal en 4 diagramas | (guard en AD-IAM-02, AD-PPL-01, AD-PPL-02, AD-CMP-01) |
| Registro y vinculación de persona, cuenta y membresía | **Seleccionado** | AD-PPL-01 |
| Incorporación, cambio y retiro de jugadora de equipo | **Seleccionado** | AD-PPL-02 |
| Asignación/finalización de roles | **No seleccionado** — flujo lineal con dos guards (tabla de alcances, LAST_ADMIN/dependencias) bien comunicado por E5 y E6 | — |
| Representación de menores y delegación | **No seleccionado** — registro lineal (sujeto menor, flags independientes); su efecto operativo (guardián responde por el menor) se diagrama en AD-PRT-01 | — |
| Creación de entrenamiento, partido y evento del club | **Seleccionado, un diagrama** — comparten el patrón de creación atómica y difieren exactamente en la regla de destinatarios: la decisión por tipo hace explícita la diferencia | AD-EVT-02 |
| Cambio material de evento | **Seleccionado** — el proceso más denso de GEI (impacto, STALE_VERSION, serie, efectos de coordinación) | AD-EVT-01 |
| Resolución de impacto y reconfirmación | **Seleccionado** — expande UC-EVT-11 dentro de AD-EVT-01 | AD-EVT-01 |
| Edición de ocurrencias de EventSeries | **Seleccionado** — la decisión de alcance (sólo esta / esta y siguientes / toda) con consecuencias distintas vive en la rama material | AD-EVT-01 |
| Programación masiva y atómica de Jornada | **Seleccionado** | AD-EVT-04 |
| Cancelación/restauración de evento con dependencias complejas | **Seleccionado** — junto con posponer/reanudar, comparten el patrón «guard de estado + revisión de impacto + efectos distinguibles» | AD-EVT-03 |
| Respuesta de disponibilidad, incluida la variante Guardian | **Seleccionado** | AD-PRT-01 |
| Preparación y publicación de convocatoria | **Seleccionado** | AD-PRT-02 |
| Consulta y revisión de conflictos | **Cubierto** — los conflictos derivados se representan en la rama de publicación que prospera igual (REQ-PRT-006); la revisión no muta | AD-PRT-02 |
| Registro, cierre y corrección de asistencia | **Seleccionado** | AD-PRT-03 |
| Registro, finalización y corrección de MatchRecord | **Seleccionado** | AD-PRT-04 |
| Publicación de comunicado con audiencia snapshot | **Seleccionado** — el snapshot inmutable produce tres destinos distintos: corregir texto / audiencia ⇒ comunicado nuevo / archivar | AD-COM-01 |
| Gestión de conversaciones | **No seleccionado** — sin complejidad real: lineales, guards de participación/autoría, ciclos ya dibujados en E6 | — |
| Inscripción por Team o Line | **Seleccionado** — la decisión de scope con reglas de identificación y validación distintas | AD-CMP-01 |
| Activación/finalización de CompetitionEntry | **Seleccionado** | AD-CMP-01 |
| Dependencias de elegibilidad | **Cubiertas** — el efecto derivado sobre la convocatoria se muestra en AD-PRT-02; el registro de restricciones es lineal | AD-PRT-02 |
| Iniciar sesión | **Seleccionado** (colateral del dominio identidad: guards de estado de cuenta, límite de intentos y «sin acceso») | AD-IAM-01 |

# 3. DIAGRAMAS SELECCIONADOS (14)

| AD-ID | Nombre de archivo | Proceso | CU directamente diagramados | CU cubiertos sin diagrama propio |
|---|---|---|---|---|
| AD-IAM-01 | `AD-IAM-01__Login.drawio` | Iniciar sesión | UC-IAM-01 | — |
| AD-IAM-02 | `AD-IAM-02__Account_Activation.drawio` | Activación de cuenta con código de un solo uso | UC-IAM-03, UC-IAM-04 | UC-IAM-05 (cola de emisión/consumo compartida), UC-IAM-09 (guard) |
| AD-PPL-01 | `AD-PPL-01__Person_Account_Membership_Onboarding.drawio` | Alta de persona, vinculación de cuenta y membresía | UC-PPL-01, UC-PPL-03, UC-PPL-04 | UC-IAM-09 (guard) |
| AD-PPL-02 | `AD-PPL-02__Player_Team_Assignment_Lifecycle.drawio` | Incorporación, cambio y retiro de jugadora de equipo | UC-PPL-06, UC-PPL-07, UC-PPL-08 | UC-PPL-02 (rechazo PLAYER_PROFILE_INCOMPLETE, SIBLING), UC-IAM-09 (guard) |
| AD-EVT-01 | `AD-EVT-01__Material_Event_Change.drawio` | Cambio material de evento (impacto, serie, concurrencia) | UC-EVT-04, UC-EVT-11, UC-EVT-12 | UC-EVT-16 (rama material; swimlane incluye a la Capitana) |
| AD-EVT-02 | `AD-EVT-02__Event_Creation.drawio` | Creación de evento por tipo (entrenamiento / partido / club) | UC-EVT-01, UC-EVT-02, UC-EVT-03 | — |
| AD-EVT-03 | `AD-EVT-03__Event_Lifecycle_Operations.drawio` | Posponer, reanudar, cancelar y restaurar evento | UC-EVT-05, UC-EVT-06, UC-EVT-07, UC-EVT-08 | — |
| AD-EVT-04 | `AD-EVT-04__Jornada_Bulk_Scheduling.drawio` | Programación de jornada (operación masiva atómica ≤100) | UC-EVT-15 | — |
| AD-PRT-01 | `AD-PRT-01__Availability_Response.drawio` | Respuesta de disponibilidad (jugadora y guardián) | UC-PRT-01 | — |
| AD-PRT-02 | `AD-PRT-02__Selection_Publish.drawio` | Preparar y publicar la convocatoria de un partido | UC-PRT-02, UC-PRT-03 | UC-PRT-04 (conflictos derivados) |
| AD-PRT-03 | `AD-PRT-03__Attendance_Management.drawio` | Registrar, cerrar y corregir asistencia | UC-PRT-05, UC-PRT-06, UC-PRT-07 | — |
| AD-PRT-04 | `AD-PRT-04__MatchRecord_Lifecycle.drawio` | Resultado del partido: registrar, finalizar y corregir | UC-PRT-08, UC-PRT-09, UC-PRT-10 | UC-EVT-09, UC-EVT-10 (contexto de compatibilidad) |
| AD-COM-01 | `AD-COM-01__Announcement_Publication.drawio` | Publicación de comunicado con audiencia snapshot | UC-COM-01, UC-COM-02, UC-COM-03, UC-COM-04 | — |
| AD-CMP-01 | `AD-CMP-01__Competition_Entry_Lifecycle.drawio` | Ciclo de competencia e inscripción (TEAM/LINE) | UC-CMP-01, UC-CMP-02, UC-CMP-03, UC-CMP-04, UC-CMP-05, UC-CMP-06, UC-CMP-07 | UC-IAM-09 (guard) |

**Cobertura:** 40 CU `ACTIVITY_REQUIRED` → 40 CU directamente diagramados en 14 procesos. 5 CU cubiertos sin diagrama propio. 7 CU útiles-no-bloqueantes excluidos. 50 CU simples excluidos. 102/102 evaluados.

# 4. EXCLUSIONES JUSTIFICADAS

## 4.1 Útiles no bloqueantes (7)

| CU | Motivo de exclusión |
|---|---|
| UC-IAM-10 | Retomar tras interrupción: 4 pasos lineales, 2 alternativas de idempotencia; REQ-SYS-016 ya lo comunica; no aporta decisiones divergentes. |
| UC-PPL-05 | Valla de dependencias de membresía: patrón de un guard con rechazo que nombra la dependencia; ya trazado en E6 y en la familia de guards del dominio. |
| UC-PPL-09 / UC-PPL-10 | Asignación/finalización de rol: guard de tabla de alcances + LAST_ADMIN + dependencias; lineal, sin alternativas divergentes. |
| UC-PPL-11 | Representación: registro lineal; el efecto funcional de la delegación (guardián responde disponibilidad) se diagrama en AD-PRT-01. |
| UC-EVT-13 | Creación de serie: lineal con un guard de límite (≤366) y validación por ocurrencia; la **edición** de ocurrencias (3 alcances) sí se diagrama en AD-EVT-01. |
| UC-PRT-12 | Registro de restricción de habilitación: lineal con reauth; su efecto derivado sobre convocatoria está en AD-PRT-02. |

## 4.2 Dominios con 0 diagramas

| Dominio | CU | Justificación |
|---|---|---|
| STR | 15 | Patrón administrativo lineal homogéneo (solicitar→validar ADMIN→registrar) con guards ya dibujados en E6 (SM-TEAM/DIVISION/LINE/VENUE, valla de dependencias, denegación a Subcomisión). Ninguna bifurcación con consecuencias divergentes. |
| INS | 5 | Consultas/proyecciones sin mutación; su riqueza es de field authority y explicitud del vacío, ya especificada en E5. |

# 5. GRANULARIDAD Y VISTAS

- Ningún diagrama gigante: el proceso más extenso (AD-CMP-01) mantiene un único modelo funcional coherente en una sola vista con lectura vertical.
- Ningún diagrama trivial Inicio→Acción→Fin: el proceso más corto seleccionado (AD-EVT-04) tiene 3 decisiones y 5 rechazos con destinos distintos.
- **Fork/Join: 0 en los 14 diagramas.** No existe paralelismo real respaldado por E1–E6 (AUD-ACT-01). No se inventa concurrencia.

**E7-02: PASS.** Selección cerrada: 14 diagramas, 0 bloqueos.
