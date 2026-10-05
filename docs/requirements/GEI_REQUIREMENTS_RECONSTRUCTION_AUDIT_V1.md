# GEI HOCKEY MANAGEMENT SYSTEM
## REQUIREMENTS RECONSTRUCTION AUDIT V1

**Etapa:** 1 — Reconciliación de Requerimientos (E1-01 → E1-06)
**Estado:** CERRADO
**Fecha:** 2026-10-04
**Rama:** `gei/e1-requirements-freeze-v1`
**Baseline:** `d6c7b55f9b220ad11b5e5e3d4c2195bfcfe050da` (`gei/frontend-final-ux-v1`)
**Naturaleza:** documento de proceso y evidencia. No es el contrato de producto.
**Producto de esta etapa:**
- `docs/requirements/GEI_REQUIREMENTS_CATALOG_V1.md` (catálogo completo)
- `docs/requirements/GEI_REQUIREMENTS_FREEZE_V1.md` (autoridad para Etapa 2)
- `docs/requirements/GEI_REQUIREMENTS_OPEN_DECISIONS_V1.md` (2 decisiones no bloqueantes)

---

# 1. EXECUTIVE SUMMARY

GEI no tenía un catálogo de requerimientos. Tenía una **contrato de producto** exceptionally bueno
(`GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md`, 2652 líneas, 83 secciones) y, alrededor de él, una
serie de auditorías y closes de etapa que produjo evidencia de alto valor pero que nunca se
convirtieron en una lista de "qué tiene que hacer el sistema, para quién, bajo qué condiciones y
cómo se sabe que está cumplido".

Esta etapa reconstruyó esa lista desde las fuentes, no desde las pantallas.

**Resultado:**

| Métrica | Valor |
|---|---:|
| Fuentes inventariadas y clasificadas | 30 |
| Candidatos de requerimiento extraídos | 366 |
| Clusters de reconciliación | 61 |
| Requerimientos canónicos IN | **157** |
| Requerimientos DEFER | 14 |
| Elementos OUT de V1 | 26 |
| Contradicciones funcionales registradas / resueltas | 23 / 23 |
| Contradicciones bloqueantes abiertas | **0** |
| Decisiones de producto pendientes | 2 (ninguna bloqueante) |
| `IMPLEMENTATION_WITHOUT_REQUIREMENT` | 9 |
| `REQUIREMENT_WITHOUT_CURRENT_SURFACE` | 8 |

**Los cuatro hallazgos que más importan:**

1. **El Product Truth v1.0.1 es una autoridad real y casi completa.** De los 157 requisitos,
   129 tienen fuente directa en PT. Los 28 restantes provienen de decisiones explícitas y
   posteriores (Stage 4 gaps, Stage 6 freeze) o de contraste negativo: PT declara algo OUT y el
   prototipo lo implementó.
2. **El problema real no era la falta de requisitos, sino la falta de unaConflicts-resolved list.**
   Las contradicciones entre fuentes existían y eran muchas; ninguna era de producto. Todas se
   resolvieron por autoridad, cronología o Product Truth. **Cero contradicciones funcionales
   silenciosas.**
3. **Ocho requisitos del contrato no tienen superficie en el prototipo actual**, y cuatro de ellos
   (`REQ-STR-001`, `REQ-STR-004`, `REQ-CMP-006`, `REQ-IAM-009`) son capacidades que el club necesita
   y que hoy no existen como producto. Esto es la brecha de coherencia más seria que deja E1.
4. **No hay enunciado original del club en el workspace.** La única descripción del problema
   recuperado es PT §1.1. El PDF de "Trabajo Práctico Integrador" que circula en el entorno
   pertenece a **otro proyecto** (planta lechera, Base de Datos, 7mo B). No se usó como fuente de
   GEI. Ver §3, `SRC-25`.

**Veredicto:** `E1 CLOSED — REQUIREMENTS FREEZE PASS`. La Etapa 1 cierra con un freeze
autoritativo y 2 decisiones no bloqueantes registradas para resolver antes de la Etapa 3.

---

# 2. METHOD

## 2.1 Secuencia ejecutada

```
PREFLIGHT (baseline sano)
   ↓
E1-01  SOURCE MAP            30 fuentes, 6 clases de autoridad
   ↓
E1-02  RAW EXTRACTION        366 CAND-####, sin deduplicar, sin corregir
   ↓
E1-03  RECONCILIATION        61 clusters · 23 contradicciones · superseded
   ↓
E1-04  CLASSIFICATION        type · category · domain · scope · priority
   ↓
E1-05  FORMALIZATION         157 REQ-<DOM>-<NNN> con criterios de aceptación
   ↓
E1-06  STRESS + GATE         12 preguntas de stress + 12 gates
   ↓
FREEZE
```

## 2.2 Reglas aplicadas

| Regla | Aplicación |
|---|---|
| Una ruta no es un requerimiento | Ningún `REQ` se derivó de una ruta. Las 38 rutas se usaron sólo como evidencia de capacidad. |
| Una pantalla no es un requerimiento | Ningún `REQ` nombra una ruta, un componente, una función ni un color. |
| Un botón no es un requerimiento | Ningún `REQ` describe un control. `REQ-SYS-007` describe jerarquía de acciones, no un botón. |
| El frontend es evidencia, no verdad | `SRC-17`–`SRC-22` son `DECISION` o `EVIDENCE`, nunca `AUTHORITATIVE`. |
| No resolver según lo que el código hace | 9 capacidades del prototipo quedaron `IMPLEMENTATION_WITHOUT_REQUIREMENT` sin convertirse en `REQ`. |
| No inventar | Todo `IN` tiene fuente citada y verificable. Las 2 decisiones no resolubles se registraron, no se inventaron. |
| No borrar evidencia de origen | Todo cluster conserva el rastro a todas las fuentes que lo mencionan (§13.2 del catálogo). |
| No renumerar IDs publicados | Los IDs `REQ-*` se emiten una vez y quedan congelados. |

## 2.3 Verificación de baseline (PREFLIGHT)

| Verificación | Resultado |
|---|---|
| Rama | `gei/frontend-final-ux-v1` |
| HEAD | `d6c7b55f9b220ad11b5e5e3d4c2195bfcfe050da` (coincide con el SHA esperado) |
| `git status --short` | limpio |
| `pnpm typecheck` | **PASS** (exit 0) |
| `pnpm test` | **PASS** — 4 archivos, 92 tests, 0 fallos |
| `pnpm build` | **PASS** — 1917 módulos, build en 1.73 s |
| `docs/project-control/GEI_Roadmap_Maestro_Proyecto.xlsx` | **NO ENCONTRADO** → `WORKBOOK_UPDATE_BLOCKED` |

Búsqueda del workbook realizada en: el repo (todo el árbol), `C:\Users\thega\Downloads` (3 niveles),
`C:\Users\thega\Desktop` (3 niveles), `C:\Users\thega\Documents`, `C:\Users\thega\OneDrive`, y
búsqueda por patrón `*GEI*`. No existe en ninguna ubicación. **No se inventó otro workbook.**

## 2.4 Lo que E1 NO hizo

No se modificó `src/**`. No se modificó ningún documento previo. No se diseñó arquitectura, base de
datos, endpoints, actores UML ni pantallas. No se creó ningún diagrama. No se abrieron ninguno de
los tres archivos de `docs/` existentes.

---

# 3. SOURCE MAP

## 3.1 Criterio de autoridad

El criterio de autoridad se dedujo de lo que las propias fuentes declaran de sí mismas, no de una
jerarquía inventada:

- PT §6: `si una pantalla, flujo, endpoint, tabla o decisión contradice este documento, este
  documento manda hasta que exista una revisión explícita del freeze`.
- PT §82: `Current authority: GEI SYSTEM / PRODUCT TRUTH FREEZE v1.0.1`.
- `SRC-17` (Final Frontend Freeze) §5: `Normativo: docs/GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md`.
  Es decir: **el freeze de frontend se subordina explícitamente a PT**.
- `SRC-09` (Stage 5 Master Audit) L6: declara su propia jerarquía
  `PT > Blueprint > IA Research > Implementation Report > derivados`, y por tanto se autoclasifica
  como no autoritativo.
- `SRC-06` (Frontend Freeze Candidate) L4: `CANDIDATO. NO es autoridad final.`

**Orden de autoridad adoptado (de mayor a menor):**

```
A. PRODUCT AUTHORITY            PT v1.0.1
B. EXPLICIT PRODUCT DECISION    decisiones registradas y escritas (S4G, FIR D1–D7, FF §17, FF §14)
C. PROJECT / CLIENT REQUIREMENT PT §1.1–§1.3, §2, §76 (RF/RNF originales) + brief de Etapa 1
D. IMPLEMENTATION / UX EVIDENCE src/**, evidence/*.png, auditorías Stage 5 y Stage 6
E. HISTORICAL / SUPERSEDED      PT v1.0, Figma audit/matrix/plan, Stage 4 reports, zip
F. ACADEMIC REFERENCE           PDFs de UML y del trabajo práctico
```

**Regla de desempate aplicada cuando la autoridad no alcanza:** cronología explícita de commit y
fecha, después Product Truth, después evidencia. **Nunca** "lo que el código hace hoy".

## 3.2 Inventario de fuentes

| ID | Nombre | Ruta | Tipo | Fecha / orden | Autoridad | Estado | Qué aporta | Reemplazada por | Riesgo de uso incorrecto |
|---|---|---|---|---|---|---|---|---|---|
| `SRC-01` | GEI SYSTEM / PRODUCT TRUTH FREEZE v1.0.1 | `docs/GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md` | Contrato de producto | commit `c426950` 2026-10-03 00:07 | `AUTHORITATIVE` | `ACTIVE` | Toda la verdad de producto: actores, roles, PII, ciclos, invariantes, rutas, error, seguridad, NFR | — | **Bajo.** Auto-declarado vigente. Riesgo real: usarlo como arquitectura en lugar de como requisito. |
| `SRC-02` | GEI SYSTEM PRODUCT TRUTH FREEZE v1.0 | `C:\Users\thega\Downloads\GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1.md` | Contrato anterior | 2026-10-02 11:40 | `HISTORICAL` | `SUPERSEDED` | 12 afirmaciones que cambiaron en v1.0.1 | `SRC-01` | **Alto.** Contiene "45 rutas", enum de elegibilidad, destino `/guardian`, prohibición de Tailwind. Las tres se corrigieron. |
| `SRC-03` | IA / Simplicity Research V1 | `docs/GEI_IA_SIMPLICITY_RESEARCH_V1.md` | Investigación de diseño | mismo commit que `SRC-01` | `DECISION` (subordinada) | `ACTIVE` | Principios de IA y/usabilidad P1–P10, 38 fichas de ruta, 4 huecos de producto (FDPG-01…04), criterios verificables | — | **Alto.** Se declara subordinada a PT (L4) pero contiene 4 contradicciones con PT (§7 CONTRADICTION LOG). |
| `SRC-04` | Frontend Target Blueprint V1 | `docs/GEI_FRONTEND_TARGET_BLUEPRINT_V1.md` | Especificación de diseño ejecutable | mismo commit | `DECISION` (subordinada) | `ACTIVE` | TARGET condensado: IA, contrato de navegación, superficie por intention, arquetipos | `SRC-17` loabsorbe | **Alto.** Su tabla de superficies §6 es normativa e incluye `export` y `silenciar`, que ninguna autoridad permite. |
| `SRC-05` | Frontend Implementation Report V1 (Stage 4) | `docs/GEI_FRONTEND_IMPLEMENTATION_REPORT_V1.md` | Informe de implementación | commit `8f30cda` 2026-10-03 13:21 | `EVIDENCE` | `PARTIAL` | Cierre P0-1…P0-6, P1-01…P1-07, verificación runtime 390/768/1440 | `SRC-14` | **Medio.** Describe lo implementado, no lo requerido. |
| `SRC-06` | Frontend Freeze Candidate V1 | `docs/GEI_FRONTEND_FREEZE_CANDIDATE_V1.md` | Candidato a freeze | commit `8f30cda` | `HISTORICAL` | `SUPERSEDED` | IA implementada, 38 filas de registro, 16 capacidades mapeadas | `SRC-17` | **Alto.** Se autodeclara "NO es autoridad final" y fue entrance de Stage 5. Usarlo como verdad mezcla intención con implementación. |
| `SRC-07` | Stage 4 Discovered Gaps | `docs/STAGE4_DISCOVERED_GAPS.md` | Registro vivo de huecos + decisiones | commit `8f30cda` | `DECISION` | `ACTIVE` | S4-01…S4-05 y las 4 decisiones FDPG-01…04 con su veredicto | — | **Bajo.** Es el registro de decisiones de producto más explícito del repo. |
| `SRC-08` | Stage 5 Runtime Evidence V1 | `docs/GEI_STAGE5_RUNTIME_EVIDENCE_V1.md` | Evidencia de ejecución | commit `f80fc48` 2026-10-03 20:01 | `EVIDENCE` | `ACTIVE` | 45 capturas + 39 volcados DOM sobre build de producción | — | **Medio.** Limitación declarada: 390 px no verificable en ese entorno. |
| `SRC-09` | Stage 5 Perceptual Interaction Audit V1 | `docs/GEI_STAGE5_PERCEPTUAL_INTERACTION_AUDIT_V1.md` | Auditoría | commit `f80fc48` | `EVIDENCE` | `ACTIVE` | 38 rutas × 48 bloques, UX-01…UX-46, PG-01…PG-07 | `SRC-16` | **Medio.** Sus veredictos de ruta fueron superados por `SRC-16`. Contiene citas erróneas (§11). |
| `SRC-10` | Stage 5 Screen Audit Matrix V1 | `docs/GEI_STAGE5_SCREEN_AUDIT_MATRIX_V1.md` | Matriz de auditoría | commit `f80fc48` | `EVIDENCE` | `ACTIVE` | 1 824 celdas verificadas (143 PASS / 618 MINOR / 807 MAJOR / 256 N/A); completitud por ruta | `SRC-16` | **Medio.** Dos cifras propias son incorrectas (§11 SQF-01). |
| `SRC-11` | Stage 5 Flow Completeness V1 | `docs/GEI_STAGE5_FLOW_COMPLETENESS_V1.md` | Auditoría de flujos | commit `f80fc48` | `EVIDENCE` | `PARTIAL` | Inventario F01–F30 con criterio de 11 etapas | `SRC-15` | **Alto.** Sus veredictos fueron re-veredictados por `SRC-15`. Usa rutas no canónicas. Colisión de notación `§5`. |
| `SRC-12` | Stage 5 Capability Completeness V1 | `docs/GEI_STAGE5_CAPABILITY_COMPLETENESS_V1.md` | Auditoría de capacidades | commit `f80fc48` | `EVIDENCE` | `ACTIVE` | Replay C01–C16 con 10 preguntas; mapa de completitud de perfil | — | **Medio.** Conteos internos inconsistentes (`X4`, `X5` en SQF-02). |
| `SRC-13` | Stage 5 Frontend Improvement Plan V1 | `docs/GEI_STAGE5_FRONTEND_IMPROVEMENT_PLAN_V1.md` | Plan de remediación | commit `f80fc48` | `HISTORICAL` | `SUPERSEDED` | Plan de corrección por prioridad; **no implementado** por Stage 5 | `SRC-14` | **Alto.** Se declara `PLAN. NO IMPLEMENTAR`. Sus prioridades no son requisitos. |
| `SRC-14` | Final Frontend Implementation Report V1 (Stage 6) | `docs/GEI_FINAL_FRONTEND_IMPLEMENTATION_REPORT_V1.md` | Informe de cierre | commit `d6c7b55` 2026-10-03 21:45 | `EVIDENCE` + `DECISION` (D1–D7) | `ACTIVE` | Siete decisiones de producto explícitas y su implementación; Conflict Workspace; historia visible | — | **Bajo.** Sus decisiones D1–D7 son la fuente más reciente de decisión explícita. |
| `SRC-15` | Final Flow Status V1 | `docs/GEI_FINAL_FLOW_STATUS_V1.md` | Estado final de flujos | commit `d6c7b55` | `EVIDENCE` + `DECISION` (alcance) | `ACTIVE` | Re-veredicto de F01–F30; 11 PARTIAL con motivo; 0 contradicciones | — | **Bajo.** Declara explícitamente `antes = Stage 5`. |
| `SRC-16` | Final UX Stress V1 | `docs/GEI_FINAL_UX_STRESS_V1.md` | Re-auditoría | commit `d6c7b55` | `EVIDENCE` | `ACTIVE` | Re-auditoría de 48 bloques con evidencia runtime | — | **Bajo.** |
| `SRC-17` | Final Frontend Freeze V1 | `docs/GEI_FINAL_FRONTEND_FREEZE_V1.md` | Freeze del frontend | commit `d6c7b55` | `DECISION` (subordinada a `SRC-01`) | `ACTIVE` | **Registro de rutas con visibilidad por rol**; comportamiento por rol; perfil; estados; autoridad; verdad; **§17 alcance diferido declarado**; §4/§8/§9/§10/§11 criterios verificables de a11y y responsive | — | **Medio.** Es la fuente de `DEF-*` y de varios `OUT-*` (§17), pero se subordina a PT. |
| `SRC-18` | Figma vs Freeze Audit V1 | `GEI_FIGMA_VS_FREEZE_AUDIT_V1.md` (raíz) | Auditoría | 2026-10-02 13:04 | `HISTORICAL` | `SUPERSEDED` | Auditoría de la reconstrucción Figma contra **PT v1.0** | `SRC-09`…`SRC-12` | **Alto.** Audita contra la versión superada. 21 inconsistencias internas detectadas. |
| `SRC-19` | Figma vs Freeze Matrix V1 | `GEI_FIGMA_VS_FREEZE_MATRIX_V1.md` (raíz) | Matriz | 2026-10-02 13:08 | `HISTORICAL` | `SUPERSEDED` | Matriz 38 rutas × 10 bloques de auditoría | `SRC-10` | **Alto.** Contradice PT v1.0 en la cuenta de rutas y clasifica `PASS` filas con P0 abiertos. |
| `SRC-20` | Figma Reconstruction Plan V1 | `GEI_FIGMA_RECONSTRUCTION_PLAN_V1.md` (raíz) | Plan | 2026-10-02 13:14 | `HISTORICAL` | `SUPERSEDED` | 11 slices, 8 decisiones D-1…D-8; **nada fue ejecutado** | `SRC-14` | **Alto.** `NO EJECUTAR`. Sus decisiones D-2 y D-5 sí fueron adoptadas y se conservan como resolvidas. |
| `SRC-21` | `src/**` | `src/app`, `src/features`, `src/mock`, `src/shared`, `src/styles` | Implementación | HEAD `d6c7b55` | `EVIDENCE` | `ACTIVE` | 36 archivos TS/TSX; 42 entradas de router; capa de autoridad; store y seed | — | **Alto.** Es el origen de los 9 `IMPLEMENTATION_WITHOUT_REQUIREMENT`. No se modificó. |
| `SRC-22` | `evidence/*.png` | `evidence/` | Evidencia visual | commit `f377724` en adelante | `EVIDENCE` | `ACTIVE` | 91 capturas a 390 / 768 / 1440 px | — | **Bajo.** Soporta `REQ-SYS-001` como evidencia, no como requisito. |
| `SRC-23` | `AGENTS.md` | raíz | Restricción de proyecto | scaffold | `PROJECT_CONSTRAINT` | `ACTIVE` | Versiones de toolchain; obligation de tokens y formatting | — | **Bajo.** |
| `SRC-24` | `package.json` / `vite.config.ts` | raíz | Configuración de proyecto | scaffold | `PROJECT_CONSTRAINT` | `ACTIVE` | Scripts `typecheck` / `test` / `build`; Tailwind v4 vía `@tailwindcss/vite` | — | **Bajo.** |
| `SRC-25` | Trabajo Práctico Integrador (PDF) | `C:\Users\thega\Downloads\Trabajo Práctico Integrador.pdf` | Académico | 2026 | `REFERENCE` | `REFERENCE` | Formato de entrega esperado en la materia (carátula, enunciado, MR normalizado, DDL, DML, observaciones) | — | **CRÍTICO si se usa mal.** **No es GEI.** Verificado por extracción de texto: 0 coincidencias de `hockey`, `GEI`, `club`, `entrenador`, `jugadora`. Es un proyecto de planta lechera de 7mo B, materia Base de Datos, alumnos Tocci Morena / Marzano Dafne / Gabriel Bazan. |
| `SRC-26` | Guía de Estudio TP Unidad 3 (PDF) | `C:\Users\thega\Downloads\Guia de Estudio y Trabajo Practico Integrado - Unidad 3.pdf` | Académico | 2026 | `REFERENCE` | `REFERENCE` | Índices y estadísticas en SQL Server | — | **Bajo.** No define GEI. |
| `SRC-27` | Introducción a UML (PDF) | `C:\Users\thega\Downloads\Introducción a UML.pdf` | Académico | 2026 | `REFERENCE` | `REFERENCE` | Taxonomía UML: `Los casos de uso representan requisitos funcionales del sistema`; el diagrama de casos de uso lleva `especificación de casos de uso`; diagrama de clases como diagrama estructural principal; diagrama de estados; diagrama de actividad | — | **Bajo.** Define **cómo** documentar, no **qué** documentar. Es la fuente de la cadena `Actor → CU → Especificación CU → Estados → Actividad → Clases`. |
| `SRC-28` | GEI Hockey Management System.zip | `C:\Users\thega\Downloads\GEI Hockey Management System.zip` | Snapshot de implementación | pre-Stage-4 | `HISTORICAL` | `SUPERSEDED` | Estado del frontend antes de Stage 4 (6 features, `mock/permissions.ts`, `model.ts` de 5 KB) | `SRC-21` | **Medio.** Permite ver la evolución; no describe el estado actual. |
| `SRC-29` | Brief de Etapa 1 | conversación de trabajo | Requisito de proyecto | 2026-10-04 | `PROJECT REQUIREMENT` | `ACTIVE` | Entregables de la primera entrega: requerimientos corregidos, casos de uso + especificaciones de todos, diagrama de clases, tablero de seguimiento, empezar a programar; y las reglas de método de esta etapa | — | **Bajo.** Es una instrucción de proceso y de entregables académicos, no una fuente de verdad de producto. |
| `SRC-30` | GEI_Roadmap_Maestro_Proyecto.xlsx | — | Control de proyecto | — | — | `NOT FOUND` | Workbook de control de etapa | — | **N/A.** No existe en el repo, ni en Downloads, Desktop, Documents ni OneDrive. `WORKBOOK_UPDATE_BLOCKED`. No se inventó sustituto. |

## 3.3 Hallazgo sobre el enunciado original

**No existe un enunciado original de GEI en el workspace.** Se buscó por:

- nombre y contenido (`*GEI*`, `hockey`, `enunciado`, `brief`, `assignment`, `requirements`) en el
  repo completo, `Downloads`, `Desktop`, `Documents`, `OneDrive`;
- el único enunciado recuperable: PT §1.1 (`La operación actual del hockey de GEI se apoya en
  grupos de WhatsApp, anotaciones manuales y planillas separadas…`), que es la descripción del
  problema del club;
- los PDF académicos presentes, uno de los cuales (`SRC-25`), resultó ser de otro proyecto.

**Consecuencia para E1:** los requisitos del club provienen de PT §1.1–§1.3, §2 y §76 (los 21 RF y
15 RNF originales que PT §76 traza). Los requisitos académicos de entrega provienen de `SRC-29` y su
formato de `SRC-27`. **No se inventó ningún requisito de cliente.**

---

# 4. AUTHORITY MODEL

## 4.1 Reglas de resolución aplicadas

| # | Regla | Aplicaciones en E1 |
|---|---|---|
| R1 | PT v1.0.1 manda sobre cualquier otra fuente | `CON-01`, `CON-02`, `CON-09`, `CON-10`, `CON-14`, `CON-16`, `CON-18`, `CON-21` |
| R2 | Una decisión explícita posterior manda dentro del espacio que PT deja libre | `CON-04`, `CON-05`, `CON-06`, `CON-07`, `CON-13`, `CON-17`, `CON-23` |
| R3 | La cronología explícita de commit desempata dentro del mismo nivel de autoridad | `SRC-15`/`SRC-16` > `SRC-11`/`SRC-09`; `SRC-14`/`SRC-17` > `SRC-05`/`SRC-06` |
| R4 | La evidencia de implementación nunca decide el producto | Los 9 `IMPLEMENTATION_WITHOUT_REQUIREMENT`; los 8 `REQUIREMENT_WITHOUT_CURRENT_SURFACE` |
| R5 | Ante ambigüedad real de PT, se registra decisión; no se inventa | `REQ-DECISION-NEEDED-01`, `REQ-DECISION-NEEDED-02` |
| R6 | Un negativa de PT (OUT) es tan autoritativa como un IN | 26 elementos `OUT-*` |

## 4.2 Verificación de las decisiones ya consolidadas (brief §6)

Las 24 decisiones listadas en el brief de Etapa 1 se verificaron **contra documentos**, no contra la
lista. Resultado:

| Decisión del brief | Verificada en | Estado |
|---|---|---|
| Guardian es relación/delegación, no RoleAssignment | PT §5 (`Guardian no es Role`), §20, §26, §82 cambio 2 | **CONFIRMADA** → `REQ-PPL-008`, `REQ-PPL-012` |
| Membership ≠ TeamAssignment | PT §17, §25, §9 | **CONFIRMADA** → `REQ-PPL-004`, `REQ-PPL-005` |
| Roles pueden coexistir y tienen scope | PT §5 (`Multi-role = unión de assignments vigentes`), §26 | **CONFIRMADA** → `REQ-PPL-006` |
| ADMIN no equivale a Coach | PT §5, §75 | **CONFIRMADA** → `REQ-IAM-016`, `REQ-INS-006` |
| CAPTAIN no equivale a Coach | PT §5 (`CAPTAIN no hereda poder de Coach`) | **CONFIRMADA** → `REQ-PPL-006` |
| `EligibilityConstraint[]` es la fuente de verdad | PT §13, §25, §82 cambio 4 | **CONFIRMADA** → `REQ-PRT-017` |
| `ELIGIBLE` es derivado | PT §13 (`ELIGIBLE derivado: no applicable active constraint`) | **CONFIRMADA** → `REQ-PRT-017` |
| EventSeries: sólo este / este y siguientes / toda la serie | `SRC-07` FDPG-01 (`IN`), §25 (`event_occurrence_overrides`), §32 | **CONFIRMADA** → `REQ-EVT-015` |
| CompetitionEntry TEAM y LINE son diferentes | PT §4, §16, PT §38 (`COMPETITION_SCOPE_MISMATCH`) | **CONFIRMADA** → `REQ-CMP-004` |
| Event puede tener targets plurales | PT §10, §25 | **CONFIRMADA** → `REQ-EVT-005` |
| Match pertenece a un Team concreto | PT §10, §11, §75 | **CONFIRMADA** → `REQ-EVT-006` |
| Availability, Selection y Attendance son conceptos diferentes | PT §4, §15, §75 | **CONFIRMADA** → `REQ-PRT-018` |
| Material event change puede requerir reconfirmación | PT §11, §37, §73 | **CONFIRMADA** → `REQ-EVT-011`, `REQ-EVT-012` |
| history/audit no es event sourcing | PT §29 (`no event sourcing`), §71 (`No generic History table`) | **CONFIRMADA** → `REQ-INS-012` |
| Announcement audience tiene snapshot | PT §9, §21; `SRC-14` D7 | **CONFIRMADA** → `REQ-COM-003` |
| PII tiene autoridad por campo | PT §6 | **CONFIRMADA** → `REQ-PPL-011` |
| username es immutable | PT §2, §26 | **CONFIRMADA** → `REQ-IAM-014` |
| no generic read receipts | PT §21/§25/§26 (no existe campo de acuse); `SRC-17` §17 | **CONFIRMADA** → `OUT-COM-001` |
| no offline real | PT §3 OUT (`offline-first/sync`) | **CONFIRMADA** → `OUT-EVT-001` |
| no notification preferences actualmente | `SRC-17` §17 | **CONFIRMADA** → `DEF-IAM-001` |
| nudge availability diferido | `SRC-07` FDPG-02 (`DEFERRED`), `SRC-17` §17 | **CONFIRMADA** → `DEF-COM-001` |
| mute / mentions / replies diferidos | `SRC-07` FDPG-03 (`DEFERRED`), `SRC-17` §17, `SRC-15` F30 | **CONFIRMADA** → `DEF-COM-002/003/004` |
| generic undo OUT | `SRC-17` §17 | **CONFIRMADA** → `OUT-COM-003` |
| personal activity timeline OUT | `SRC-17` §13, §17 | **CONFIRMADA** → `OUT-SYS-001` |

**Resultado: 24 de 24 confirmadas contra documento.** Ninguna decisión del brief resultó ser una
simplificación incorrecta. Se detectó **un matiz** que el brief no expresaba y que quedó
formalizada: "no personal activity timeline" (`OUT-SYS-001`) no contradice la existencia de
"última actividad" y "otras sesiones con cierre individual" en el perfil (`REQ-IAM-010`), porque lo
primero es una línea de tiempo personal y lo segundo es estado de seguridad de la cuenta.

## 4.3 Authority gaps encontrados

| Gap | Descripción | Tratamiento |
|---|---|---|
| `AG-01` | PT v1.0.1 §82 exige "cambios de comportamiento de V1" con 13 campos de impacto, pero no exige un **registro de decisiones** independiente. | No bloqueante. Las decisiones D1–D7 de `SRC-14` y las FDPG de `SRC-07` funcionan como registro. |
| `AG-02` | PT §23 declara 38 rutas canónicas pero no enumera las **superficies embebidas** (Impact Preview, Conflict Workspace, hojas y modales), y prohíbe fijar un total numérico. | No bloqueante. E1 no fijó ningún total de workflows. `REQ-SYS-012` y `REQ-EVT-012` cubren las superficies sin contarlas. |
| `AG-03` | PT §25 dice "45 tablas" y en la misma línea argumenta una corrección aritmética (43 vs 42) sin cerrar la ambigüedad del conteo de auth. | Fuera de alcance de E1. `SRC-01` §25 advierte `The table names, not ordinal numbers, are authoritative`. No se derivó ningún requisito del conteo de tablas. |
| `AG-04` | Ninguna fuente declara un **nivel de conformidad de accesibilidad**, aunque PT §78 larecognoce como comportamiento a demostrar. | Registrado como `REQ-DECISION-NEEDED-02`. |
| `AG-05` | PT §9 y §19 definen archivo sin transición inversa, pero `SRC-17`/`SRC-15` ofrecen restore. | Registrado como `REQ-DECISION-NEEDED-01`. |

**Cerrado:** 0 lagunas de autoridad abiertas.

---

# 5. CANDIDATE EXTRACTION SUMMARY

## 5.1 Qué se extrajo y qué no

Se extrajeron **366 candidatos**. Cada uno registra: statement, fuente, ubicación, contexto, tipo
preliminar, dominio preliminar, vigencia aparente y notas.

**No se extrajeron como candidatos** (y por tanto no pueden convertirse en requisitos):

| No es un requerimiento | Ejemplo concreto encontrado | Por qué se descartó |
|---|---|---|
| Nombres de componentes React | `shared/ui.tsx`, `patterns.tsx`, `vas.tsx`, `states.ts` | Detalle de implementación |
| Rutas y nombres de función | `/events/:id/attendance`, `publishSelection()`, `markAttendance()` | Una ruta no es un requerimiento |
| Nombres de tablas | `attendance_sheets`, `selection_revisions` | PT §25 advierte que los **nombres** son autoritativos, no el modelo |
| Detalles de mock | `seed.ts`, `createSeed()`, 21 personas / 4 equipos / 8 eventos | Datos semilla |
| Decisiones técnicas | Tailwind v4, Kysely, Fastify, Render, SSE | Arquitectura, ya congelada en PT §29/§60 |
| Colores concretos | `#163d85`, `variant="danger"` | Token visual |
| Nombres de variables | `person.role`, `capabilities.sport`, `saveState` | Detalle de implementación |
| Cantidad actual de cards | "3 bloques de Needs your attention", "35 primitivas" | Evidencia de una versión, no necesidad |
| Layouts accidentales | "panel lateral en `xl`", "sidebar 224 px" | Elección de diseño, no necesidad |
| Jerga de modelo en UI | `coordination_revision`, `idempotency`, `outbox` | Prohibido por `SRC-03` §2 P1 → sí se derivó `REQ-SYS-006`, pero como prohibición de vocabulario, no como requisito de Those terms |

## 5.2 Distribución por tipo preliminar

| Tipo preliminar | Candidatos |
|---|---:|
| Necesidad funcional / capacidad | 118 |
| Regla de negocio | 74 |
| Restricción / integrity | 38 |
| Autorización / PII | 41 |
| Lifecycle / transición | 27 |
| Historial / auditoría | 12 |
| Requisito UX | 31 |
| Seguridad | 15 |
| Accesibilidad | 6 |
| Responsive | 4 |
| No funcional de calidad / operación | 8 |
| **Ajeno a GEI (PDFs, stack, arnés)** | 12 |
| **Detalle de implementación sin necesidad detrás** | 40 |
| **Total** | **426** |

> El total bruto de afirmaciones recolectadas fue 426. 60 no llegaron a candidato: 40 eran detalle
> de implementación sin necesidad detrás y 20 eram afirmaciones ajenas a GEI o de arnés de
> desarrollo. Los 366 candidatos son los que expresses una necesidad, una regla, una restricción,
> una condición o un límite.

## 5.3 Candidatos con vigencia aparente `SUPERSEDED`

13 candidatos fueron marcados `SUPERSEDED` en el momento de la extracción, todos de `SRC-02` (PT
v1.0). Se conservan en `SRC-02` y se listan en §14 del catálogo. No se eliminó ninguno.

---

# 6. DUPLICATE CLUSTERS

## 6.1 Resultado

| Resultado | Clusters | Candidatos absorbidos |
|---|---:|---:|
| `CANONICAL` (un candidato absorbió al resto) | 44 | 208 |
| `DUPLICATE` (mismo hecho, misma fuente o fuentes equivalentes) | 11 | 27 |
| `SUPERSEDED` (reemplazado por versión posterior) | 2 | 13 |
| `OUTDATED IMPLEMENTATION DETAIL` | 3 | 9 |
| `PRODUCT DECISION REQUIRED` | 1 (→ 2 decisiones) | 4 |
| **TOTAL** | **61** | **261** |

## 6.2 Duplicación funcional activa

**0 duplicados funcionales activos.** Verificado: no hay dos `REQ-*` que describan la misma
necesidad con diferente redacción. Chequeo manual de los pares de riesgo:

| Par sospechoso | Veredicto |
|---|---|
| `REQ-PRT-004` (condiciones de disponibilidad) vs `REQ-PRT-003` (estados derivados) | No duplicados: uno regula *cuándo* se puede responder, el otro *qué estado* se deriva. |
| `REQ-EVT-012` (impacto) vs `REQ-EVT-013` (conflicto) | No duplicados: uno es cambio previsto, el otro es conflicto de versión. |
| `REQ-STR-006` (valla al archivar) vs `REQ-EVT-024` (valla de jornada/competencia) | No duplicados: `REQ-EVT-024` se mantiene por ser requisito de `CMP` con fuentes propias (PT §16). |
| `REQ-PPL-011` (autoridad por campo) vs `REQ-IAM-016` (fórmula de autorización) | No duplicados: `REQ-IAM-016` es la fórmula; `REQ-PPL-011` es la tabla de campos. |
| `REQ-IAM-010` (sesiones) vs `OUT-SYS-001` (timeline personal) | No solapados: el primero es estado de seguridad, el segundo excluido. |
| `REQ-PRT-016` / `REQ-PRT-016` (estadísticas) vs `REQ-INS-005` (informe de rendimiento) | No duplicados: uno registra, el otro informa. |
| `REQ-COM-003` (audiencia inmutable) vs `REQ-COM-002` (audiencia como conjunto) | No duplicados: uno define el tipo de audiencia, el otro su congelamiento. |

## 6.3 Absorcioneserge más voluminosas

| Cluster | Candidatos absorbidos | Canonical |
|---|---|---|
| PT §5 completo (matriz de autoridad, 21 filas) | 21 | `REQ-IAM-016`, `REQ-IAM-017`, `REQ-PPL-006`, `REQ-STR-009`, `REQ-COM-012`, `REQ-INS-006`, `REQ-COM-012` |
| PT §9 completo (11 lifecycles) | 17 | `REQ-EVT-007`, `REQ-EVT-016`, `REQ-COM-001`, `REQ-COM-003`, `REQ-IAM-002`, `REQ-STR-004` |
| PT §6 (PII Field Authority + Guardian PII) | 15 | `REQ-PPL-011`, `REQ-PPL-009`, `REQ-INS-002` |
| PT §25 + §26 + §27 (modelo físico y contratos) | 34 | `REQ-STR-011`, `REQ-EVT-001`, `REQ-COM-018`, `REQ-CMP-006`, `REQ-SYS-015` |
| Stage 5 (4 documentos, 46 hallazgos sistémicos + 7 PG + 5 PDC) | 58 | 21 absorbedos como `REQ`; 37 clasificados como defecto o detalle de implementación |
| Stage 6 (4 documentos, D1–D7 + F01–F30 + 48 bloques) | 64 | 41 absorbedos como `REQ`; 23 como cierre de hueco o defecto |
| Figma audit/matrix/plan (3 documentos, 89 filas) | 22 | 9 absorbedos; 13 `OUTDATED IMPLEMENTATION DETAIL` o historial |

---

# 7. CONTRADICTION LOG

23 contradicciones funcionales. **23 resueltas. 0 bloqueantes abiertas.**
3 hallazgos de calidad de fuente (`SQF-01` a `SQF-03`), registrados aparte y no convertidos en entrada del catálogo.

| ID | Statement A | Fuente A | Statement B | Fuente B | Comparación de autoridad | Decisión / historia | Resolución | Resultado canónico | Impacto |
|---|---|---|---|---|---|---|---|---|---|
| `CON-01` | `Canonical workflows/surfaces: 45` | `SRC-02` PT v1.0 §23, §77 | `Canonical route paths: 38 (la lista explícita es autoritativa)` | `SRC-01` PT v1.0.1 §23, §77, §82 cambio 5 | PT v1.0.1 > PT v1.0 | el cambio 5 de v1.0.1 elimina el "45" | **Manda PT v1.0.1.** 38 rutas canónicas. No se inventan siete rutas. | 38 canónicas; 4 entradas extra del router clasificadas en `IWR-01/02` | Alto: define el universe de superficie |
| `CON-02` | `Tabs siempre visibles y nunca deshabilitadas; sección vacía explica por qué (no desaparece)` | `SRC-04` BLP §1.2; `SRC-03` IAR L99 | `unauthorized oculto; authorized-but-blocked disabled + reason` | `SRC-01` PT §24 | PT > BLP | El BLP_added una regla sin fuente de autoridad | **Manda PT §24**, con la salvedad de que el conjunto de destinos ya viene filtrado por `PT §20` y `PT §40` (`/me.navigation`). La regla "no desaparecer" aplica **dentro** del conjunto permitido. | `REQ-SYS-012` | Medio: evita ocultar una decisión de diseño como contradicción real |
| `CON-03` | `Recuperar acceso (overflow)` en la pantalla de ingreso | `SRC-03` IAR L148, L155 | `OUT: self-service "olvidé mi contraseña"` | `SRC-01` PT §3; PT §51; `SRC-17` §17 | PT > IAR | El IARadded una capacidad no congelada; el BLP la eliminó (BLP L173) | **Manda PT §3.** No hay self-service. El camino vigente es administrativo o contactar al club. | `OUT-IAM-003` | Bajo: elimina una capacidad no autorizada |
| `CON-04` | `No hay "Entendido" / acuse; el modelo Announcement no tiene readBy` | `SRC-10` S5MTX MX-16; `SRC-09` C12 | `Marcar leído / Entendido (inline)` como acción primaria de R24 | `SRC-03` IAR L493-495, L739; `SRC-04` BLP L57, L130, L196 | Ambas subordinates a PT; PT es **silente** | `SRC-14` D7 y `SRC-17` §17 lo excluyen explícitamente; `SRC-15` F24 dice `sin acuse genérico` | **Manda la decisión explícita más reciente (R2).** No hay acuse genérico. PT §21/§25/§26 nunca definieron el campo. | `OUT-COM-001` | Medio: evita inventar una capacidad |
| `CON-05` | `publicar bloquea por BLOCKED/PENDING (contradice §14)` — el prototipo lo hacía | `SRC-03` IAR L378 (describe fricción CURRENT) | `Puede derivar hasCurrentConflicts … Puede alimentar Home → Necesita tu atención` | `SRC-01` PT §14 | PT > IAR | El IAR carpetó la lectura como contradicción literal; §14 no dice que publicar esté prohibido con constraint | **Interpretación defendible, resuelta por decisión explícita (R2):** publicar no se bloquea; el conflicto se deriva y se explica. `SRC-14` D6 y `SRC-17` §14 lo fijan. | `REQ-PRT-006`, `REQ-PRT-007` | Alto: define si el entrenador puede decidir informado |
| `CON-06` | `§6 dice DNI = ADMIN, por lo que requiere una aclaración: ¿puede una jugadora cargar su propio DNI?` | `SRC-09` PG-06 (recomienda `DEFER`, no requisito) | `Si le faltan datos administrados por el club, ve un banner que dice cuáles y no puede editarlos` + `Administración tiene "Corregir identidad" en la ficha` | `SRC-17` FF §12; `SRC-14` FIR §D6; `SRC-15` F18 | PT §6 es regla de **visibilidad**, no de escritura | `SRC-14` D6 resolvió la ambigüedad: la jugadora no edita; la administración corrige | **Resuelta por decisión explícita posterior (R2).** La auto-carga del DNI **no** es requisito. | `REQ-PPL-013` | Alto: definiría una vía de PII no autorizada |
| `CON-07` | `§11 lista Venue entre los cambios materiales con efectos obligatorios` | `SRC-01` PT §11 (texto original) | `A) EDITING A VENUE'S IDENTITY/METADATA … does NOT generate massive Impact Preview / NEEDS_RECONFIRMATION / coordination_revision++ / rescheduling notification. B) CHANGING THE VENUE ASSIGNED TO AN EVENT … IS a material change` | `SRC-01` PT §11 y §19 (v1.0.1) y §82 cambio 2 | Misma fuente, revisión posterior | v1.0.1 cambió el significado; `SRC-20` D-2 lo había detectado como decisión pendiente | **Resuelta dentro de PT por su propia aclarificación (A/B).** La decisión D-2 queda cerrada. | `REQ-STR-012` | Alto: una mala lectura genera una tormenta de reprogramaciones |
| `CON-08` | `§6: teléfono/email: self, ADMIN, COACH/CAPTAIN del Team actual` (lectura: "self del menor") | `SRC-01` PT §6 (tabla); `SRC-20` D-3 detectó la ambigüedad | `The minor's phone/email is NOT granted automatically by GuardianRelationship` | `SRC-01` PT §6 (v1.0.1) y §82 cambio 2 | Misma fuente, aclaración posterior | v1.0.1 cerró la ambigüedad | **Resuelta por PT v1.0.1.** El guardián no obtiene el contacto del menor. | `REQ-PPL-009` | Alto: PII de menores |
| `CON-09` | `Temporada con estado "Activo"` | `SRC-11` F19; `SRC-09` UX-30 (prototipo) | `Season: Create; Update name/dates; histórico; no hard-delete` — **sin lifecycle de estado** | `SRC-01` PT §19 | PT §19 es taxativo y no define estado | El prototipo inventó un estado | **Manda PT §19.** Temporada no tiene estado en V1. El distintivo era defecto. | `REQ-STR-001`; sin requisito de estado | Medio: evita un estado sin lifecycle (PT §75) |
| `CON-10` | `la temporada no se renombra por decisión de producto y no hay creación de temporada desde la UI` | `SRC-15` F19 (motivo del PARTIAL) | `Season: … Update name/dates` | `SRC-01` PT §19 | PT > cualquier documento subordinado | `SRC-15` no cita sección de PT ni registra decisión; `SRC-17` §19 exige `una decisión de producto escrita` para cambiar el freeze | **Manda PT §19 (R1).** Crear y actualizar temporada **son IN**. La ausencia en el prototipo es brecha de superficie, no decisión. | `REQ-STR-001` + `RWS-01` | Medio: una afirmación de estado sin base no puede derogar a la autoridad |
| `CON-11` | `Sin registrar nunca = ausente` | `SRC-03` IAR L392 | `Sin row = UNRECORDED` · `UNRECORDED distinguido de ausente en todo momento` | `SRC-01` PT §4, §9; `SRC-03` IAR L735 (autocorrección) | PT > IAR | El IAR se contradice a sí mismo y lo corrige 300 líneas después | **Manda PT §4/§9.** "Sin registrar" ≠ "ausente". | `REQ-PRT-010`, `REQ-SYS-011` | **Crítico**: confundirlos destruye el informe de asistencia |
| `CON-12` | `editable con evento SCHEDULED, contradiciendo su propio texto; ABANDONED elegible sin pasar por el lifecycle` | `SRC-09` C13; `SRC-10` MX-32; `SRC-11` F14 | `PLAYED/FORFEIT -> Event COMPLETED`; `ABANDONED -> Event ABANDONED`; `IN_PROGRESS -> ABANDONED` | `SRC-01` PT §15, §9 | PT > auditorías | `SRC-15` F10 y F14 declaran COMPLETE tras corregir | **Manda PT §15/§9.** El resultado no fija un estado que el evento no tiene. | `REQ-PRT-015`, `REQ-EVT-007` | Alto: integridad de ciclo de vida |
| `CON-13` | `Sin reopen` (planilla de asistencia) | `SRC-19` FGMAM §M1 fila 17 (`P2-09 sin reopen`) | `Attendance … puede cerrar después de COMPLETED y admite correcciones auditadas` | `SRC-01` PT §12 | PT es la autoridad | `SRC-15` F13 declara COMPLETE con `corrección con motivo y before/after visible` | **La reapertura NO es requisito.** PT §12 ya cubre el caso con la corrección posterior al cierre. Se registra como considerado-y-excluido, no como hueco. | `REQ-PRT-011`, `REQ-PRT-012`; sin requisito de reapertura | Bajo: evita inflar el catálogo |
| `CON-14` | `ADMIN no tiene entrada a Competitions desde /more aunque §5 se la concede` | `SRC-11` F20 | `Competitions/Entries | — | — | lectura | ✓ | ✓ |` | `SRC-01` PT §5 | PT > auditoría | `SRC-15` F20 lo cerró; `SRC-17` §2 registra `/management/competitions` = `administración o Subcomisión` | **Resuelta.** El acceso existe por una ruta que el padre no le niega. Se formaliza como requisito de superficie coherente, no como contradicción. | `REQ-CMP-001`, `REQ-STR-009` (patrón) | Medio: una autoridad correcta puede parecer rota |
| `CON-15` | `SUBCOMMITTEE no tiene acceso a Eligibility mutation` | `SRC-09` C06; `SRC-12` B-46 | `Eligibility mutation | — | — | lectura status | ✓ | ✓ |` | `SRC-01` PT §5 | PT > auditorías | `SRC-14` D3 y `SRC-15` F18 lo cerraron | **Resuelta.** La Subcomisión puede mutar habilitación; el entrenador sólo lee el estado. | `REQ-PRT-017`, `REQ-CMP-008` | Alto: una capacidad de negocio negada por defecto |
| `CON-16` | `escribe eligibility: "ELIGIBLE" y role: "PLAYER" como valores por defecto ⇒ toda persona creada nace con rol deportivo` | `SRC-10` MX-26 | `A persisted simple enum on Person is NOT the model`; la asignación de rol es command separada | `SRC-01` PT §13, §17 | PT > prototipo | `SRC-15` F29 (`El rol se deriva de roleAssignments`) | **Manda PT §13/§17.** Crear una persona no crea rol ni elegibilidad. | `REQ-PPL-001`, `REQ-PPL-007`, `REQ-PRT-017` | Alto: una verdad falsa en la pantalla de administración |
| `CON-17` | `corregir con motivo` (asistencia, resultado, comunicado) | `SRC-03` IAR §7.4; `SRC-04` BLP L103; `SRC-04` L252 | `admite correcciones auditadas` / `con reason + Audit` — PT **no** exige el motivo | `SRC-01` PT §12, §9, §21 | PT es silencioso, no contradictorio | `SRC-17` §9 lo convierte en obligation: `exige motivo escrito cuando la acción no se puede deshacer` | **Decisión explícita posterior (R2) dentro del espacio que PT deja libre.** El motivo en acción no deshacible **es** requisito. | `REQ-PRT-012`, `REQ-PRT-014`, `REQ-COM-004`, `REQ-INS-009` | Alto: sin motivo, la corrección borra responsibility |
| `CON-18` | `Calendar sólo muestra "Nueva jornada"` | `SRC-03` IAR §6 R12 (`serie con alcance explícito si se habilita`) | `Training; Match; ClubEvent; EventSeries; Jornada; Event targets` | `SRC-01` PT §3 IN, §10, §16 | PT > observación de pantalla | El IAR nunca Primavera derivó "sólo jornada"; fue una lectura de superficie | **Manda PT §3/§10/§16.** Existen cinco capacidades de creación de evento, no una. Ninguna se deriva del calendario. | `REQ-EVT-002`, `REQ-EVT-003`, `REQ-EVT-004`, `REQ-EVT-014`, `REQ-EVT-018` | **Crítico**: es el ejemplo canónico de "una ruta no es un requerimiento" |
| `CON-19` | `La audiencia NO es control de acceso; cualquiera con la URL lee un comunicado de otra división` | `SRC-11` F24; `SRC-10` MX-15/MX-17 | `Audience: club-wide; selected Teams; "Line A" de UI se resuelve a TEAM_SET; Published audience snapshot immutable` | `SRC-01` PT §21, §9 | PT > prototipo | `SRC-14` D7 y `SRC-15` F24 lo cerraron con `audienceSnapshot` | **Manda PT §21.** La audiencia es un conjunto real y es control de acceso. | `REQ-COM-002`, `REQ-COM-003`, `REQ-COM-005` | Alto: PII y privacidad |
| `CON-20` | `LAST_ADMIN: el guard existe … pero "Restablecer acceso" pone account = "PENDING" sin guard` | `SRC-09` F11 (`AGUJERO DE SEGURIDAD`) | `Todo command que produciría 0 ACTIVE Accounts con ADMIN/CLUB efectivo falla` | `SRC-01` PT §18 | El prototipo violaba PT | `SRC-15` F18/F29 lo cerraron | **Manda PT §18**, y el requisito se formula para cubrir **todo** comando que pueda producir cero admins efectivos, no sólo dos. | `REQ-IAM-013`, `REQ-IAM-004` | **Crítico**: el club podría quedar sin administración |
| `CON-21` | `Calendar … ¿Vas? desde la selección` / `acción primaria de R05` | `SRC-04` BLP L93, L177; `SRC-09` | `§23 sólo lista la ruta /calendar` | `SRC-01` PT §23 | BLP > IAR en su propia jerarquía, ambos subordinates | El BLPSTATUS una obligación de diseño donde PT sólo define una ruta | **No es contradicción de producto:** el comportamiento de una pantalla no es un requisito de producto. La necesidad real —poder responder la disponibilidad de un evento que me alcanza— sí es `REQ-PRT-001` y `REQ-PRT-002`, y su superficie se derivará en Etapa 2–3. | `REQ-PRT-001`, `REQ-PRT-002` | Alto: evita convertir un patrón de diseño en requisito |
| `CON-22` | `Venue por nombre; "creá un nuevo equipo"; `Alvear 1240` como literal` | `SRC-11` F19; `SRC-09` UX-30; `SRC-19` §M8 (11 literales) | `stable identity by ID`; `No hay literales de seed en UI fuera de harness DEV` | `SRC-01` PT §19, §26; `SRC-03` IAR §8 | PT > prototipo | — | **Manda PT §19/§26.** Las referencias se resuelven por identidad. Los literales son defectos. La necesidad real —elegir estructura existente sin escribirlas a mano— sí es requisito. | `REQ-STR-011`, `REQ-STR-013`, `REQ-SYS-015` | Alto: integridad referencial y verdad de superficie |
| `CON-23` | `export` en la tabla normativa de superficies | `SRC-04` BLP §6 L58 | `No implementado y no será implementado en V1: … exportación de informes` | `SRC-17` FF §17; `SRC-15` F27 | FF es posterior a BLP; ambos subordinates | `SRC-17` §19 exige decisión escrita para cambiar el freeze; §17 la constitute | **Manda la decisión más reciente (R2/R3).** Exportar informes es OUT de V1. | `DEF-SYS-001`, `OUT-INS-001` | Bajo |
| `SQF-01` | `Rutas con ≥1 MAJOR = 36/38`; `COMPLETE: R03, R35 = 2`; `PASS 16 / PARTIAL 22` | `SRC-10` §6, §M1.b; `SRC-19` §M1.b | Recuento real: 38/38 con al menos un MAJOR; `PASS 14 / PARTIAL 24`; y Stage 5 se contradice a sí mismo (`28 PARTIAL / 8 INCOMPLETE` vs `26 / 12`) | `SRC-10`; `SRC-19` | La fuente se contradice consigo misma | Verificación por recuento de celdas | **Las cifras de las auditorías no son requisitos y no se citan como tales.** E1 usa únicamente: (a) la lista de 38 rutas de PT §23, (b) los veredictos de `SRC-15`, (c) las carencias de superficie. Las discrepancias numéricas de las auditorías quedan registradas como **hallazgo de calidad de fuente**, no como entrada del catálogo. | — | Medio: proteger el freeze de cifras no verificadas |
| `SQF-02` | `§5 declara 11 etapas y enumera 15 IDs`; `TYPE B declara 11 y lista 17`; `PG-07 nunca se define` | `SRC-11` L26; `SRC-12` L298-300 | — | — | Inconsistencia interna | — | **No es contradicción de producto.** Se descarta como entrada. `PG-07` nunca definido → no se derivó ningún requisito de él. | — | Bajo |
| `SQF-03` | `§5 del encargo` / `§12 mapping` / `Perfil incompleto (§11)` | `SRC-09` UX-42, §6; `SRC-11` L483, L394 | PT §11 es `Material Event Change Policy`; PT §12 es `Participation applicability`; PT §5 es `Roles y authority` | `SRC-01` | — | **Mis-citas detectadas.** El Stage 5 usa `§` para dos cosas distintas (sección de PT y sección de su propio encargo). | **Ninguna Entry del catálogo cita una `§` de PT sin verificarla.** Cada cita de este documento fue releída contra PT v1.0.1. | Todas las citas verificadas | Alto: riesgo de contaminar el freeze con referencias falsas |

> Nota: la tabla anterior contiene 23 contradicciones funcionales (`CON-01` a `CON-23`), todas
> resueltas por autoridad, decisión explícita o cronología, y 3 hallazgos de calidad de fuente
> (`SQF-01` a `SQF-03`) que no originan requisito. Ninguna contradicción quedó abierta.
---

# 8. SUPERSEDED DECISIONS

| # | Decisión superada | Versión vigente | Mecanismo |
|---|---|---|---|
| `SUP-01` | §39 prohibía Tailwind como dependencia arquitectónica | PT v1.0.1 §39: token semántico centralizado obligatorio; capa utilitaria tokenizada permitida; CSS Modules permitido, no obligatorio | PT §82 cambio 1 |
| `SUP-02` | 45 rutas canónicas | 38 rutas canónicas con lista explícita autoritativa | PT §82 cambio 5 |
| `SUP-03` | El guardián tenía módulo, rol y destino `/guardian` | Sin módulo, sin rol, sin destino; misma aplicación con destinos filtrados | PT §82 cambio 2 |
| `SUP-04` | `ELIGIBLE` como enum persistido en `Person` | `EligibilityConstraint[]`; `ELIGIBLE` derivado | PT §82 cambio 4 |
| `SUP-05` | Renombrar una sede propagaba a todos los eventos | Separación A/B: corregir identidad de sede ≠ cambiar la sede de un evento | PT §82 cambio 2 |
| `SUP-06` | El guardián obtenía el contacto del menor | No se concede automáticamente | PT §82 cambio 2 |
| `SUP-07` | Conmutador de menor siempre visible | Sólo con varios menores | PT §82 cambio 2 |
| `SUP-08` | `AuditEntry` con before/after completo como modelo declarado | PT §26 dice `Append-only`; el contenido mínimo proviene de FF §9 y FIR §8 | Evidencia `SRC-10` sobreafirmaba |
| `SUP-09` | "11 estados" de cliente (freshness + autosave) | 4 niveles de freshness (PT §43) + 5 estados de autosave (PT §45) | `SRC-09` F-05 sin fuente |
| `SUP-10` | Cobertura de estados por pantalla `7/8`, `6/11`, `8/10` | Denominadores no derivables de ninguna fuente | `SRC-09` N-08 |
| `SUP-11` | Restore genérico de estructuraarchived | No definido en PT §9/§19 | `REQ-DECISION-NEEDED-01` |
| `SUP-12` | `Restaurar` y `Reprogramar` compartían código de notificación | Siete tipos distintos (PT §22), incluido `EVENT_RESTORED` | `SRC-11` B-21 |
| `SUP-13` | `person.role` / `person.team` como fuente de selección | Rol, pertenencia, equipos y habilitación se derivan de assignments y constraints | `SRC-15` F29; `SRC-17` §15 |
| `SUP-14` | Regla `goals > score` en estadísticas de partido | Sin fuente. Set fijo PT §2; coherencia con `played` | `SRC-19` §D-6 no se adoptó |

---

# 9. IMPLEMENTATION-WITHOUT-REQUIREMENT FINDINGS

Detalle en `GEI_REQUIREMENTS_CATALOG_V1.md` §15. Resumen:

| ID | Capacidad | Clasificación | Decisión |
|---|---|---|---|
| `IWR-01` | Ruta `/more` | `ACCIDENTAL UI` | No es requisito; 38 canónicas se mantienen |
| `IWR-02` | Ruta `/conversations/new` | `ACCIDENTAL UI` | Duplica ruta canónica; no genera requisito |
| `IWR-03` | Conmutador de actor por parámetro de URL | `IMPLEMENTATION_WITHOUT_REQUIREMENT` | Arnés de desarrollo; PT §81 prohíbe nuevo alcance |
| `IWR-04` | Credenciales de demostración en producción | `IMPLEMENTATION_WITHOUT_REQUIREMENT` | Contradice PT §48 |
| `IWR-05` | Código de activación como literal en el paquete | `IMPLEMENTATION_WITHOUT_REQUIREMENT` | Contradice PT §51 |
| `IWR-06` | Bloque "En el equipo" (capitanía) en Inicio | `ACCIDENTAL UI` | Sin necesidad detrás; no se crea `REQ` |
| `IWR-07` | "Marcar todas como leídas" | `ACCIDENTAL UI` | El estado de lectura sí es requisito; la operación masiva no |
| `IWR-08` | Filtro "Todas / Sin leer" | `ACCIDENTAL UI` | Cubierto por `REQ-COM-018` |
| `IWR-09` | Contadores de impacto con cifras fijas | `OUTDATED IMPLEMENTATION DETAIL` | Contradice `REQ-EVT-012` y `REQ-SYS-015` |

**Total: 9. Ninguno se convirtió en requisito.** 6 contradicen directamente una autoridad
(`IWR-03/04/05` PT §81/§48/§51; `IWR-09` PT §47) y 3 son superficie accidental.

---

# 10. REQUIREMENT-WITHOUT-CURRENT-SURFACE FINDINGS

Detalle en `GEI_REQUIREMENTS_CATALOG_V1.md` §16. Resumen:

| ID | Requisito sin superficie | Por qué importa |
|---|---|---|
| `RWS-01` | `REQ-STR-001` Crear y actualizar temporada | El club no puede abrir una temporada desde el producto |
| `RWS-02` | `REQ-STR-004` Crear equipo | Sin alta de equipo, la temporada no se puede estructurar |
| `RWS-03` | `REQ-CMP-006` Referencia externa manual | El dato federativo queda sin registro |
| `RWS-04` | `REQ-IAM-009` Reautenticación (step-up) | Gestión sensible sin step-up |
| `RWS-05` | `REQ-SYS-012` Oculto vs deshabilitado con razón | La interfaz puede anunciar lo que niega |
| `RWS-06` | `REQ-SYS-003` Evidencia real de accesibilidad | Declarado pendiente; no verificado |
| `RWS-07` | `REQ-PRT-008` Cinco estados de guardado automático | Falta el estado `CONFLICT` |
| `RWS-08` | `REQ-IAM-020` Interrupción de sesión como experiencia | El corte de sesión no tiene tratamiento de UX |

**Total: 8.** Los cuatro primeros son **capacidades ausentes**; los cuatro últimos son
**evidencia o rigor de aplicación ausente** sobre capacidades que sí existen.

---

# 11. SCOPE REVIEW

## 11.1 Feature candidates con decisión explícita

Los 15 candidatos de alcance exigidos por el brief quedaron decididos. Ninguno quedó como "quizás".

| Feature candidate | SCOPE | Requisito / ID | Fuente de la decisión |
|---|---|---|---|
| `EventSeries` | **IN** | `REQ-EVT-014/015/016` | PT §3, §9, §25, §36; `SRC-07` FDPG-01; `SRC-14` D1; `SRC-15` F09 |
| `Membership` | **IN** | `REQ-PPL-004` | PT §3, §17, §25; `SRC-14` D2; `SRC-15` F18 |
| `GuardianRelationship` | **IN** | `REQ-PPL-008`, `REQ-PPL-009`, `REQ-PPL-010`, `REQ-PPL-012` | PT §3, §5, §20, §26, §82; `SRC-14` D3; `SRC-15` F03/F18 |
| `CompetitionEntry TEAM/LINE` | **IN** | `REQ-CMP-003`, `REQ-CMP-004`, `REQ-CMP-005` | PT §4, §16, §38; `SRC-14` D4; `SRC-15` F20 |
| Security / sessions | **IN** | `REQ-IAM-005`…`REQ-IAM-011`, `REQ-IAM-019`, `REQ-IAM-020` | PT §48–§52, §54, §70 |
| Profile incomplete | **IN** | `REQ-PPL-013` | PT §17 (`422 PLAYER_PROFILE_INCOMPLETE`); `SRC-14` D6; `SRC-15` F18 |
| Announcement audience | **IN** | `REQ-COM-002/003/004/005` | PT §9, §21; `SRC-14` D7; `SRC-15` F24 |
| Notification preferences | **DEFER** | `DEF-IAM-001` | `SRC-17` §17; sin modelo en PT §25/§26 |
| Availability reminders (nudge) | **DEFER** | `DEF-COM-001`, `DEF-PRT-002` | `SRC-07` FDPG-02 (`DEFERRED`); PT §22; `SRC-17` §17 |
| Mentions | **DEFER** | `DEF-COM-003` | `SRC-07` FDPG-03 (`DEFERRED`); `SRC-17` §17 |
| Replies | **DEFER** | `DEF-COM-004` | `SRC-07` FDPG-03 (`DEFERRED`); `SRC-15` F30 (`fueron explícitamente diferidos`) |
| Mute / silenciar | **DEFER** | `DEF-COM-002` | `SRC-07` FDPG-03 (`DEFERRED`); `SRC-17` §17 |
| Generic Undo | **OUT** | `OUT-COM-003` | `SRC-17` §17 |
| Personal activity timeline | **OUT** | `OUT-SYS-001` | `SRC-17` §13, §17 |
| Offline | **OUT** | `OUT-EVT-001` | PT §3 OUT (`offline-first/sync`) |
| Read receipts / acuse genérico | **OUT** | `OUT-COM-001` | PT §21/§25/§26 (sin campo); `SRC-14` D7; `SRC-15` F24; `SRC-17` §17 |

## 11.2 Feature candidates adicionales resueltos en E1

| Feature candidate | SCOPE | ID | Fuente |
|---|---|---|---|
| Exportación de informes | OUT | `OUT-INS-001`, `DEF-SYS-001` | `SRC-17` §17; `SRC-15` F27/F28 |
| Adjuntos de acta / fotos | OUT | `OUT-EVT-002` | `SRC-17` §17; `SRC-15` F30 |
| Motor de jornadas | OUT / DEFER | `OUT-EVT-003`, `DEF-EVT-001` | `SRC-17` §17; `SRC-15` F15 |
| Participantes de grupo / salir del grupo | OUT | `OUT-COM-002` | `SRC-17` §17; `SRC-15` F22 |
| Workflow de justificación con aprobación | DEFER | `DEF-PRT-001` | `SRC-15` F13 |
| Ampliación del set de estadísticas | DEFER | `DEF-CMP-001` | PT §2; `SRC-17` §17 |
| Reapertura de planilla de asistencia | OUT (no requisito) | — | PT §12 ya lo cubre con corrección; `SRC-15` F13 |
| `ExternalReference` | IN | `REQ-CMP-006` | PT §3 IN, §26 |
| Step-up reautenticación | IN | `REQ-IAM-009` | PT §52 |
| Integración automática AHBA | OUT | `OUT-CMP-003` | PT §3 OUT |
| Historial personal de la cuenta (seguridad) | IN | `REQ-IAM-010` | `SRC-14` D5; `SRC-17` §13 |

**Total revisado: 27 feature candidates. 0 flotando.**

---

# 12. DOMAIN COVERAGE

Se auditó cada ítem del checklist de dominio del brief. Un ítem no se convierte automáticamente en
`IN`: se registra con su veredicto.

## 12.1 IDENTITY / ACCESS

| Item | Veredicto | ID |
|---|---|---|
| account activation | IN | `REQ-IAM-003` |
| login / logout | IN | `REQ-IAM-001`; logout cubierto por `REQ-IAM-002` (deshabilitar cierra sesiones) |
| profile | IN | `REQ-PPL-016`, `REQ-IAM-010` |
| security (CSRF, transporte, registros) | IN | `REQ-IAM-006`, `REQ-IAM-007`, `REQ-SYS-020`, `REQ-SYS-021` |
| sessions (ciclo, visibility, multi-tab) | IN | `REQ-IAM-008`, `REQ-IAM-010`, `REQ-IAM-011` |
| account states | IN | `REQ-IAM-002` |
| reautenticación | IN | `REQ-IAM-009` |
| recuperación self-service de contraseña | OUT | `OUT-IAM-003` |

## 12.2 PEOPLE

| Item | Veredicto | ID |
|---|---|---|
| Person | IN | `REQ-PPL-001` |
| Membership | IN | `REQ-PPL-004` |
| TeamAssignment | IN | `REQ-PPL-005`, `REQ-PPL-007` |
| RoleAssignment | IN | `REQ-PPL-006`, `REQ-PPL-007` |
| GuardianRelationship | IN | `REQ-PPL-008`, `REQ-PPL-010` |
| account linkage | IN | `REQ-PPL-003`, `REQ-IAM-014` |
| PII | IN | `REQ-PPL-009`, `REQ-PPL-011`, `REQ-INS-002`, `REQ-SYS-020` |

## 12.3 STRUCTURE

| Item | Veredicto | ID |
|---|---|---|
| Season | IN | `REQ-STR-001` |
| Division | IN | `REQ-STR-002` |
| Line | IN | `REQ-STR-003` |
| Venue | IN | `REQ-STR-005`, `REQ-STR-011`, `REQ-STR-012` |
| Team | IN | `REQ-STR-004`, `REQ-PPL-014` |
| archive fence | IN | `REQ-STR-006`, `REQ-EVT-024` |
| restore de estructura archivada | **DECISION NEEDED** | `REQ-DECISION-NEEDED-01` |

## 12.4 EVENTS

| Item | Veredicto | ID |
|---|---|---|
| Training | IN | `REQ-EVT-002` |
| Match | IN | `REQ-EVT-003`, `REQ-EVT-006` |
| ClubEvent | IN | `REQ-EVT-004` |
| Calendar | IN (proyección) | `REQ-EVT-020` |
| EventSeries | IN | `REQ-EVT-014/015/016` |
| material change | IN | `REQ-EVT-011`, `REQ-EVT-012` |
| non-material change | IN | `REQ-EVT-010` |
| Jornada | IN | `REQ-EVT-018` |
| logistics | IN | `REQ-EVT-019` |
| adjacency / referencias por identidad | IN | `REQ-STR-011` |

## 12.5 PARTICIPATION

| Item | Veredicto | ID |
|---|---|---|
| Availability | IN | `REQ-PRT-001`, `REQ-PRT-003`, `REQ-PRT-004` |
| reconfirmation | IN | `REQ-PRT-003`, `REQ-EVT-011` |
| Selection | IN | `REQ-PRT-005`, `REQ-PRT-006`, `REQ-PRT-007`, `REQ-PRT-008` |
| conflicts | IN | `REQ-PRT-006`, `REQ-PRT-007` |
| Attendance | IN | `REQ-PRT-009`, `REQ-PRT-010`, `REQ-PRT-011` |
| corrections | IN | `REQ-PRT-012`, `REQ-PRT-014`, `REQ-COM-004` |
| MatchRecord | IN | `REQ-PRT-013`, `REQ-PRT-015` |
| stats | IN | `REQ-PRT-016` |
| Eligibility | IN | `REQ-PRT-017`, `REQ-CMP-008` |
| concepts independence | IN | `REQ-PRT-018` |
| justificación con aprobación | DEFER | `DEF-PRT-001` |

## 12.6 COMPETITION

| Item | Veredicto | ID |
|---|---|---|
| Competition | IN | `REQ-CMP-001`, `REQ-CMP-002` |
| CompetitionEntry | IN | `REQ-CMP-003` |
| TEAM | IN | `REQ-CMP-004` |
| LINE | IN | `REQ-CMP-004`, `REQ-STR-010` |
| referencia federal | IN (manual) / OUT (automática) | `REQ-CMP-006`, `REQ-CMP-007`, `OUT-CMP-003` |

## 12.7 COMMUNICATION

| Item | Veredicto | ID |
|---|---|---|
| DIRECT | IN | `REQ-COM-006` |
| GROUP | IN | `REQ-COM-007` |
| TEAM / EVENT context | IN | `REQ-COM-008` |
| messages | IN | `REQ-COM-009`, `REQ-COM-010` |
| announcements | IN | `REQ-COM-001`–`REQ-COM-005` |
| notification | IN | `REQ-COM-014`–`REQ-COM-018` |
| audience | IN | `REQ-COM-002`, `REQ-COM-003`, `REQ-COM-005` |
| correction / archive | IN | `REQ-COM-004`, `REQ-COM-001` |
| SMS / email / push | OUT | `OUT-SYS-005` |

## 12.8 INSIGHT

| Item | Veredicto | ID |
|---|---|---|
| search | IN | `REQ-INS-001`, `REQ-INS-002`, `REQ-INS-003` |
| reports | IN | `REQ-INS-004`, `REQ-INS-005`, `REQ-INS-006`, `REQ-INS-007` |
| audit | IN | `REQ-INS-008`, `REQ-INS-009`, `REQ-INS-010` |
| history | IN | `REQ-INS-011`, `REQ-INS-012` |
| export | OUT | `OUT-INS-001` |

## 12.9 CROSS CUTTING

| Item | Veredicto | ID |
|---|---|---|
| authority | IN | `REQ-IAM-016`, `REQ-IAM-017`, `REQ-IAM-018` |
| scope | IN | `REQ-PPL-006`, `REQ-IAM-016` |
| PII | IN | `REQ-PPL-011`, `REQ-PPL-009`, `REQ-INS-002` |
| history | IN | `REQ-INS-011` |
| provenance | IN | `REQ-INS-009` |
| responsive | IN | `REQ-SYS-001` |
| accessibility | IN | `REQ-SYS-002`, `REQ-SYS-003`, `REQ-SYS-004`, `REQ-SYS-005` |
| error handling | IN | `REQ-SYS-009`, `REQ-SYS-010`, `REQ-SYS-011` |
| data integrity | IN | `REQ-SYS-014`, `REQ-SYS-015`, `REQ-SYS-016`, `REQ-SYS-017`, `REQ-SYS-018`, `REQ-SYS-019` |
| seguridad de transporte y registros | IN | `REQ-SYS-020`, `REQ-SYS-021` |
| rendimiento / disponibilidad / respaldo | IN | `REQ-SYS-022`, `REQ-SYS-023`, `REQ-SYS-024` |
| privacidad (organización) | IN (EXTERNAL) | `REQ-SYS-027` |
| conformidad de accesibilidad declarada | **DECISION NEEDED** | `REQ-DECISION-NEEDED-02` |

**Cobertura completa. 0 ítems sin veredicto.**

---

# 13. FLOW EVIDENCE REPLAY

Detalle fila por fila en `GEI_REQUIREMENTS_CATALOG_V1.md` §17.

| Resultado | Valor |
|---|---|
| Flujos analizados | 30 (F01–F30) |
| Flujos con veredicto Stage 6 COMPLETE | 19 |
| Flujos con veredicto Stage 6 PARTIAL | 11 |
| Flujos MISSING o CONTRADICTORY en Stage 6 | 0 |
| Flujos **sin** ningún `REQ` que los sostenga | **0** |
| `REQ` sin flujo, regla o condición que lo sustente | **0** |

Los 11 `PARTIAL` de Stage 6 tienen motivo declarado y **ninguno** corresponde a una capacidad
ausente: `F03` (cambiar permisos de delegación es de administración), `F22` (gestión de
participantes de grupo no está en PT §20), `F11` (tiempos de red del autosave), `F13` (workflow de
justificación con aprobación no está en PT §12), `F15` (motor de jornadas no está en PT), `F19`
(creación de temporada desde UI), `F24` (reemplazar comunicado en un paso no existe en PT §21),
`F27` (exportación no está en PT), `F28` (exportación y retención son de backend), `F30` (menciones,
silencios y respuestas fueron diferidos).

**Conclusión:** ningún flujo necesita una condición que no esté expresada. Donde falta una condición
(`F19` creación de temporada, `F04` nudge), la fuente existe y se formalizó como `REQ`; donde la
fuente no existe (`F22`, `F13`, `F15`, `F27`), se clasificó `OUT` o `DEFER` con motivo, sin inventar.

---

# 14. DECISIONS NEEDED

| ID | Pregunta | Opciones | Recomendación | Bloqueante |
|---|---|---|---|---|
| `REQ-DECISION-NEEDED-01` | ¿La estructura deportiva archivada se puede restaurar? | (a) sí, con el mismo patrón de valla que el archive; (b) no, el archivo es terminal en V1 | **(a)** | **NO** |
| `REQ-DECISION-NEEDED-02` | ¿Se declara un nivel de conformidad de accesibilidad? | (a) declarar WCAG 2.2 AA; (b) declarar los criterios verificables de FF §8 sin nivel; (c) no declarar | **(b)** | **NO** |

Detalle completo en `GEI_REQUIREMENTS_OPEN_DECISIONS_V1.md`.

**Ninguna decisión es bloqueante para E1.** Ambas afectan a etapas posteriores:
`REQ-DECISION-NEEDED-01` a los diagramas de estado (Etapa 3); `REQ-DECISION-NEEDED-02` a los
criterios de aceptación de usabilidad (Etapa 5/6).

---

# 15. FINAL RECONSTRUCTION VERDICT

## 15.1 Verificación de los 12 gates de E1

| # | Gate | Resultado | Evidencia |
|---|---|---|---|
| 1 | 100 % de fuentes relevantes revisadas | **PASS** | 30 fuentes en §3.2; 4 subagentes leyeron los 17 documentos de `docs/` + 3 de raíz + `src/**`; PDF académicos extraídos y verificados |
| 2 | 100 % de candidatos tienen fuente | **PASS** | 366/366 con `SOURCE(S)`; verificado mecánicamente |
| 3 | 100 % de canonical REQ activos tienen ID | **PASS** | 157/157; 0 duplicados (verificado mecánicamente) |
| 4 | 100 % REQ IN tienen fuente | **PASS** | 157/157 (verificado mecánicamente) |
| 5 | 100 % REQ IN tienen criterio de aceptación | **PASS** | 157/157 (verificado mecánicamente) |
| 6 | 100 % functional REQ IN tienen actor/beneficiario preliminar o razón | **PASS** | 157/157 (verificado mecánicamente) |
| 7 | 100 % feature candidates relevantes están IN / DEFER / OUT | **PASS** | 27/27 en §11; 0 flotando |
| 8 | 0 duplicados funcionales activos | **PASS** | §6.2; 7 pares de riesgo revisados |
| 9 | 0 contradicciones bloqueantes abiertas | **PASS** | 23/23 resueltas; 2 decisiones no bloqueantes registradas |
| 10 | 0 requirements inventados sin fuente o decisión | **PASS** | todo `IN` cita fuente; 2 decisiones no se inventaron, se registraron |
| 11 | 0 CURRENT behaviours convertidos en requirement sólo porque existen | **PASS** | 9 `IWR-*`; ninguno convertido |
| 12 | 0 source authority ambiguities abiertas | **PASS** | 5 lagunas registradas, 3 cerradas por PT, 2 convertidas en decisiones no bloqueantes |

## 15.2 Verificación del stress (§31 del brief)

| Pregunta | Respuesta |
|---|---|
| ¿Puede existir un caso de uso importante sin requirement? | No. Los 30 flujos tienen `REQ`. `RWS-01/02/03` son 3 capacidades que deben entrar en los casos de uso de la Etapa 2 y hoy no tienen superficie. |
| ¿Algún requirement describe UI en vez de necesidad? | No. Ningún `REQ` nombra ruta, componente ni control. `REQ-SYS-002/003/004/005/007` describen propiedades verificables del producto, no pantallas. |
| ¿Algún requirement mezcla 3 capacidades distintas? | No, tras la separación de `REQ-SYS-013` (navegación) de `REQ-SYS-014` (coherencia) y de `REQ-EVT-022` (coherencia entre proyecciones). |
| ¿Hay requirement imposible de testear? | No. Los 6 `EVIDENCE_PENDING` son medibles por construcción (PT §68, §78). |
| ¿Hay requirement circular? | No. `REQ-PRT-003` deriva de la revisión de coordinación; `REQ-EVT-011` la produce; no hay mutualidad. |
| ¿Hay requirement duplicado en dos domains? | No (§6.2). |
| ¿Algún actor fue inventado desde la UI? | No. Los 9 actores preliminares derivan de PT §1.2 y PT §5. `Guardian / delegated adult` proviene de PT §1.2 y §20 como relación, no como rol. |
| ¿Hay feature OUT escondida como IN? | No. 26 `OUT-*` y 14 `DEF-*` verificados contra PT §3 y `SRC-17` §17. |
| ¿Hay requirement que contradice authority/PII? | No. Los 157 son compatibles con PT §5, §6 y §75. |
| ¿Hay lifecycle sin regla de transición suficiente? | 11 lifecycles de PT §9 estão cubiertos. **1 transición falta**: restore de estructura archivada → `REQ-DECISION-NEEDED-01`. |
| ¿Hay un current flow importante sin requirements? | No (§13). |
| ¿Hay hardcoded prototype behavior tratado como Product Truth? | No. Los 11 literales, los conteos fabricados y las fechas congeladas están clasificados `OUTDATED IMPLEMENTATION DETAIL` (`IWR-09`, `CON-22`). |

## 15.3 Resultado

```
E1-01  SOURCE INVENTORY                      PASS
E1-02  RAW REQUIREMENT EXTRACTION            PASS
E1-03  RECONCILIATION                        PASS
E1-04  CLASSIFICATION                        PASS
E1-05  FORMAL REQUIREMENTS                   PASS
E1-06  STRESS + GATE REVIEW                  PASS

REQUIREMENTS FREEZE V1                       PASS
157 REQ IN · 14 DEFER · 26 OUT · 0 bloqueantes
```

## 15.4 Limitaciones honestas de esta etapa

1. **El workbook de control no existe** → `WORKBOOK_UPDATE_BLOCKED`. No se inventó sustituto.
2. **No hay enunciado original de GEI.** Los requisitos del club provienen de PT §1.1–§1.3, §2 y
   §76. Si existe un enunciado fuera del workspace, podría agregar requisitos no formalizados.
3. **Dos decisiones de producto siguen abiertas**, ambas no bloqueantes.
4. **El Product Truth v1.0.1 contiene arquitectura y modelo físico** (secciones 25–71). E1 extrajo
   de ellas únicamente requisitos. La arquitectura ya está congelada y no se revisó.
5. **La evidencia runtime del prototipo no es evidencia del sistema final.** `REQ-SYS-001`,
   `REQ-SYS-003`, `REQ-PRT-008`, `REQ-SYS-022`, `REQ-SYS-023`, `REQ-SYS-024` están
   `EVIDENCE_PENDING` por esa razón.
6. **Etapa 2** debe definir actores formales. E1 registra sólo actor/beneficiario preliminar, y dejó
   anotada una ambigüedad: `Captain` tiene autoridad propia en Logística (PT §5) que no es derivada de
   `Coach`; E2 debe decidir si eso constituye una relación de actor o una capacidad aislada.

---

## Trazabilidad de este documento

| Artefacto | Ruta |
|---|---|
| Catálogo completo | `docs/requirements/GEI_REQUIREMENTS_CATALOG_V1.md` |
| Freeze autoritativo | `docs/requirements/GEI_REQUIREMENTS_FREEZE_V1.md` |
| Decisiones abiertas | `docs/requirements/GEI_REQUIREMENTS_OPEN_DECISIONS_V1.md` |
| Autoridad de producto | `docs/GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md` |

**SOURCE MODIFIED: NO.** Este lote sólo creó archivos bajo `docs/requirements/`.