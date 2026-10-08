# GEI HOCKEY MANAGEMENT SYSTEM
## USE CASE SPECIFICATION FREEZE V1

**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-07
**Etapa:** 5 — Especificaciones de TODOS los casos de uso
**Rama:** `gei/e5-use-case-specifications-freeze-v1`
**Baseline E4:** `d4baa1cb109dec3fafb915006585bf80318ae868`
**Resultado del gate:** **PASS** — ver §10

---

# 1. QUÉ ES ESTE FREEZE

Este documento es la **autoridad funcional de las especificaciones de casos de uso** de GEI a
partir de esta fecha. Declara qué está especificado, con qué plantilla, con qué cobertura y con
qué trazabilidad. **No duplica las 102 fichas**: cada una vive en su archivo de dominio.

| Documento | Rol |
|---|---|
| `docs/use-cases/specifications/GEI_UC_SPEC_{IAM,PPL,STR,EVT,PRT,COM,CMP,INS}_V1.md` | **Las 102 fichas de especificación.** Autoridad funcional por CU |
| `docs/use-cases/specifications/GEI_USE_CASE_SPECIFICATION_STANDARD_V1.md` | **Autoridad de forma**: plantilla académica obligatoria, numeración, reglas de contenido |
| `docs/use-cases/specifications/GEI_USE_CASE_SPECIFICATION_INDEX_V1.md` | Índice de 102 filas con conteos, prioridad y relaciones |
| `docs/use-cases/specifications/GEI_USE_CASE_SPEC_TRACEABILITY_V1.md` | UC→REQ, AC coverage 454/454, transversales |
| `docs/use-cases/specifications/GEI_USE_CASE_SPECIFICATION_RECONSTRUCTION_AUDIT_V1.md` | Proceso, evidencia y gate. No es autoridad |
| `docs/use-cases/specifications/evidence/GEI_UC_SPEC_VALIDATION_REPORT.txt` | Machine QA 32/32 |
| Este documento | **Freeze** |

Las autoridades de E1–E4 **siguen mandando** sobre su dominio: si una ficha contradice al
Requirements Freeze, al Actor Freeze, al Inventory Freeze o al Diagram Freeze V1.0.1, **manda la
autoridad previa** y la ficha se corrige por revisión.

# 2. PLANTILLA ACADÉMICA UTILIZADA

La estructura visible de cada ficha es la del **modelo del profesor** (consigna académica
transcrita en el brief de E5; el material original no está en el repo — SPEC-FEEDBACK-01, hereda
D-8):

> Nombre (`CASO DE USO: <UC-ID> · <Nombre>`) · Fecha de creación · Fechas de actualización ·
> Versión · Autores · Descripción · Actores · Precondiciones · Postcondiciones ·
> Puntos de Extensión · Prioridad · Camino básico · Camino alternativo.

Después de la ficha, un bloque separado `TRAZABILIDAD INTERNA GEI` registra Requirements,
authority source, scope, business rules, efectos de estado, includes/extends y notas — **sin**
reemplazar ni intercalar la plantilla académica. Convención de numeración del profesor respetada:
básico `1.` `2.` `3.`…; alternativas `X.Y` ligadas al paso básico `X`; subflujos `X.Y.Z` (0 usados).

# 3. COBERTURA

| Métrica | Valor |
|---|---:|
| CU especificados | **102 / 102** — 0 missing, 0 unknown, 0 duplicados |
| IAM · PPL · STR · EVT · PRT · COM · CMP · INS | 10 · 17 · 15 · 19 · 13 · 14 · 9 · 5 |
| Fichas con los 12 campos académicos completos | **102 / 102** (machine) + muestra académica 16/16 |
| Caminos básicos | 401 pasos · secuencialidad 102/102 · sin lenguaje de UI |
| Caminos alternativos | 299 ramas · 0 colgadas · 0 subflujos huérfanos · máx. 3 niveles |
| Prioridad | P0 55 · P1 40 · P2 7 · P3 0 (regla Standard §4) |
| Puntos de extensión | 2 CU base de `<<extend>>` (`UC-EVT-04`, `UC-EVT-16`); 100 «No posee.» |

# 4. ACTORES

Los **8 actores canónicos de E2**, sin ninguno nuevo: `ACT-ADMIN`, `ACT-SUBCOMMITTEE`,
`ACT-COACH`, `ACT-CAPTAIN`, `ACT-PLAYER`, `ACT-GUARDIAN`, `ACT-AUTHENTICATED` (abstracto),
`ACT-UNAUTHENTICATED`. Límites respetados en las 102 fichas: `ACT-ADMIN` sin autoridad deportiva;
`ACT-CAPTAIN` inicia sólo `UC-EVT-16`; `ACT-GUARDIAN` limitado a `CHILD`; sin actores técnicos.
`UNKNOWN_ACTOR = 0`.

# 5. MODELO DE RELACIONES E4 CONSUMIDO

Exactamente el set final de E4 V1.0.1, sin drift (`E4_RELATION_DRIFT = 0`):

| # | Relación | Representación en fichas |
|---|---|---|
| 1–3 | `UC-EVT-05/07/08 → UC-EVT-11` `<<include>>` | Paso del camino básico: «GEI ejecuta UC-EVT-11 … <<include>>» |
| 4 | `UC-EVT-11 → UC-EVT-04` `[MATERIAL_CHANGE]` | Punto de extensión + camino alternativo |
| 5 | `UC-EVT-12 → UC-EVT-04` `[STALE_VERSION]` | Punto de extensión + camino alternativo |
| 6 | `UC-EVT-11 → UC-EVT-16` `[MATERIAL_CHANGE]` | Punto de extensión + camino alternativo |

`INC-01` (reautenticación): **regla transversal condicional, 0 aristas UML**. Representada como
alternativa de autorización en los 38 CU de gestión sensible del inventario E3, derivando a
`UC-IAM-09` con `REAUTHENTICATION_REQUIRED` sin repetir su camino. `EXT-02..06` = SIBLING: sin
arista. 9 relaciones rechazadas de E3: 0 dibujadas, 0 referidas como relación.

# 6. TRAZABILIDAD Y COBERTURA DE AC

| Métrica | Valor |
|---|---:|
| Filas UC→REQ | 444 (172 rotuladas `(ficha E3)`: REQ presente en la ficha del CU sin par directo en la matriz) |
| REQ con mapeo UC | 133 · REQ transversales/NF con razón | 24 |
| **AC contabilizados** | **454 / 454** |
| **UNACCOUNTED_AC** | **0** |
| REQ desconocidos / UC sin REQ | 0 / 0 |

Regla de representación y evidencia completa en `GEI_USE_CASE_SPEC_TRACEABILITY_V1.md` §5.

# 7. DECISIONES ABIERTAS

**0 bloqueantes para E5.** No se crea documento de decisiones nuevas. Heredadas sin cambio:
`UC-DECISION-01/02` (fuera del inventario), `ACTOR-DECISION-01` (a), `ACTOR-DECISION-02` (a),
`REQ-DECISION-NEEDED-01/02`, D-9 (heredada de E2, no bloqueante), SPEC-FEEDBACK-01/P3 (autores,
global) y SPEC-FEEDBACK-02/P3 (asimetría matriz directa/inversa, rotulada).

# 8. QUÉ ALIMENTA ESTE FREEZE

| Consumidor | Qué toma | Qué NO debe tomar |
|---|---|---|
| **E6 — Diagramas de estados** | Las transiciones registradas en postcondiciones y trazabilidad (§11 del Audit): `Event`, `Account`, `Team`, `Competition`, `CompetitionEntry`, `Attendance`, `MatchRecord`, `Announcement`, `Conversation`, `EventSeries` y cierres con fecha | No debe derivar estados de `src/**` ni inventar transiciones inversas (estructura archivada es terminal en V1) |
| **E7 — Trazabilidad** | Index + Traceability ya emitidos: UC→REQ→AC con representación | No debe re-derivar la prioridad con otra regla |
| Implementación / UX / IA (etapas 8–11) | Fichas autosuficientes: autoridad, precondiciones, caminos, alternativas con códigos canónicos, efectos | No debe tratar la ficha como diseño de UI; los entry points son E10 |

# 9. CAMBIO DE ESTE FREEZE

Sólo con decisión de producto escrita o nueva versión de E1/E2/E3/E4 cuando la autoridad lo
requiera, corrigiendo las fichas afectadas y re-ejecutando
`node scripts/validate-use-case-specs.mjs` (debe dar PASS) y
`node scripts/generate-use-case-spec-artifacts.mjs` (Index + Traceability se regeneran).

# 10. RESULTADO DEL GATE

| Criterio | Resultado |
|---|---|
| 102/102 specs · 0 missing · 0 unknown · 0 duplicados | **PASS** |
| 100 % con estructura académica completa (12 campos) | **PASS** |
| 100 % caminos básicos secuenciales | **PASS** |
| 100 % alternativas contra pasos válidos · ≤3 niveles | **PASS** |
| 100 % AC accounted · `UNACCOUNTED_AC = 0` | **PASS** |
| 0 UI inventada · 0 actores inventados · 0 capacidades inventadas | **PASS** |
| 0 authority drift · 0 relation drift · 0 name drift · 0 priority mismatch | **PASS** |
| 0 decisiones bloqueantes | **PASS** |
| Cross-domain PASS · academic sample 16/16 · machine QA 32/32 | **PASS** |
| `src/**` sin cambios · freezes E1–E4 intactos | **PASS** |

```
E5-01 … E5-07:  PASS
USE CASE SPECIFICATION FREEZE V1:  FROZEN · PASS
```

**Siguiente etapa: E6 — Diagramas de Estados. NO INICIADA.**

---

**SOURCE MODIFIED: NO.** `src/**`, `docs/requirements/**`, `docs/actors/**`, `docs/uml/**` y los
artefactos E3 existentes sin cambios. Este lote crea `docs/use-cases/specifications/**`,
`scripts/validate-use-case-specs.mjs`, `scripts/generate-use-case-spec-artifacts.mjs`,
`scripts/lib/ucspeclib.mjs` y actualiza el workbook de control.
