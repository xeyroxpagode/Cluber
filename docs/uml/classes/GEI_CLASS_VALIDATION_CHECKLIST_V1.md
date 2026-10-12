# GEI HOCKEY MANAGEMENT SYSTEM
## CLASS VALIDATION CHECKLIST V1

**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-12
**Etapa:** 8 — Modelo de clases completo (E8 cierre)
**Rama:** `gei/e8-complete-class-model-freeze-v1`
**Baseline:** `GEI_CLASS_CATALOG_V1.md` + `GEI_CLASS_ATTRIBUTES_V1.md` + `GEI_CLASS_OPERATION_MATRIX_V1.md` + `GEI_CLASS_RELATIONSHIP_MATRIX_V1.md` + `GEI_CLASS_TRACEABILITY_MATRIX_V1.md` + `GEI_CLASS_DIAGRAM_MANIFEST_V1.md`

Todos los resultados provienen de comprobaciones **ejecutadas** (PowerShell + `System.Xml.XmlDocument`, CLI draw.io MSIX 32.4.1.0, inspección visual de los 9 PNG finales). Ningún PASS es declarativo.

---

# 1. VALIDACIÓN MECÁNICA (manifiesto §4.3)

| Check | Resultado ejecutado | Veredicto |
|---|---|---|
| XML_ERROR | `XmlDocument.Load` 9/9 sin excepciones | **0 · PASS** |
| DUPLICATE_CLASS_ID | IDs `mxCell` únicos por archivo, 9/9 | **0 · PASS** |
| RELATION_WITHOUT_SOURCE | `source`/`target` de los 61 edges resuelven a IDs existentes, 9/9 | **0 · PASS** |
| MISSING_MULTIPLICITY | Labels de multiplicidad en extremos solo en PPL/STR/IAM/CMP; EVT/PRT/COM/INS las codifican en compartimentos (`[0..*]`, `[0..1]`) y notas. Sin pérdida de información. Desviación aceptada **D1** | **Desviación D1** |
| FALSE_COMPOSITION | Composición solo donde el manifiesto la exige (R-19, R-20, R-23, R-29, R-32, R-35 + R-01/R-46 composition-like); marcadores `comp*` verificados visualmente junto a sus edges | **0 · PASS** |
| CLASS_WITHOUT_SOURCE | Cobertura 37/37 clases CL-01..CL-37 en los 9 diagramas (inventario ejecutado) | **0 · PASS** |
| CLASS_WITHOUT_OWNER_VIEW | 37/37 con vista propietaria o referencia según diseño del manifiesto §3 (`Person` es `<<ref>>` en IAM/PPL/COM/INS por §3.2/§3.3) | **0 · PASS** |
| ATTRIBUTE_WITHOUT_TYPE | 491 líneas de atributo/operación en celdas canónicas revisadas; 0 sin firma de tipo | **0 · PASS** |
| DRAWIO_LOAD_FAILURE | Los 18 exports fueron generados por draw.io 32.4.1.0 CLI desde las fuentes finales (carga real 9/9) | **0 · PASS** |
| WAYPOINTS_INVÁLIDOS | 0 `mxPoint` con coordenadas vacías en los 9 archivos (chequeo añadido tras hallar 11 en E8) | **0 · PASS** |

---

# 2. VALIDACIÓN SEMÁNTICA

| Check | Resultado ejecutado | Veredicto |
|---|---|---|
| Clases canónicas 37/37 | Inventario por archivo: IAM(Person ref, Account, Membership + 4 VO + 1 enum), PPL(3 assoc + refs + 3 enums), STR(5 + 2 enums), EVT(11 + 4 enums), PRT(9 + EligibilityPolicy + 10 enums), COM(6 + DirectPairKey + 5 enums + 3 refs añadidas), CMP(3 + 3 enums + 4 refs), INS(AuditEntry + 3 services + 1 ref) | **37/37 · PASS** |
| Enumeraciones cerradas | EventType=TRAINING/MATCH/CLUB_EVENT; RoleType=5 roles (PLAYER/CAPTAIN/COACH/SUBCOMMITTEE/ADMIN); ScopeType=CLUB/TEAM/EVENT/LINE — verificados en XML | **PASS** |
| Decisiones de catálogo | CLASS-DECISION-01..06 respetadas (Match discriminado, sin herencia; CompetitionEntry por scope; Conversation por tipo) | **PASS** |
| Correcciones contra Relationship Matrix | PPL lbl6 `1`→`0..*` (R-06); IAM lbl2 `0..1`→`1` (R-01); COM: 5 edges re-apuntados a refs de manifiesto R-44–R-49 | **PASS** |

---

# 3. EXPORTACIÓN (§4.1 — firmas verificadas por lectura de bytes)

Herramienta: `draw.io.exe` MSIX `draw.io.draw.ioDiagrams_32.4.1.0_x64__1zh33159kp73c`, flags `-x -f png|pdf -o`. PNG firma `89 50 4E 47`, PDF firma `%PDF-`, todos tamaño > 0.

| Diagrama | PNG bytes | PDF bytes | Página |
|---|---|---|---|
| CL-00__GEI_Domain_Overview | 284232 | 60959 | 1169x827 |
| CL-IAM-01__Identity_Access | 406283 | 82081 | 1169x827 |
| CL-PPL-01__People_Relationships | 452156 | 77458 | 1169x827 |
| CL-STR-01__Club_Structure | 431796 | 62565 | 1169x827 |
| CL-EVT-01__Events_Calendar | 797690 | 106645 | 1169x1210 |
| CL-PRT-01__Participation | 907734 | 95418 | 1169x1420 |
| CL-COM-01__Communication | 810568 | 109947 | 1169x1220 |
| CL-CMP-01__Competition | 528092 | 95659 | 1169x980 |
| CL-INS-01__Insight_Integrity | 541679 | 93248 | 1169x935 |

**Total: PNG 9/9 · PDF 9/9 · correspondencia 1:1 con las fuentes finales.**

---

# 4. QA VISUAL (§4.2 — inspección real de los 9 PNG finales)

Criterios por lámina: nombres correctos; atributos con tipos y visibilidad; operaciones con firmas; multiplicidades junto al extremo correcto; tipos de relación correctos; cero solapamientos graves; cero texto cortado; cero etiquetas flotantes; cero conectores atravesando texto; sin elementos invisibles ni fuera de página.

| Lámina | Veredicto | Observaciones |
|---|---|---|
| CL-00 | **PASS** | 9 paquetes incl. INFRA; solo nombres (regla 2.1); labels R cortos; rutas por corredores |
| CL-IAM-01 | **PASS** | Labels `1`/`0..*` sobre bordes, sin pisar texto |
| CL-PPL-01 | **PASS** | Tras corregir overlap Guardian/RoleAssignment y labels flotantes |
| CL-STR-01 | **PASS** | Tras corregir overlap Venue/Team y conectores sobre headers |
| CL-EVT-01 | **PASS** | Tras ampliar página y reubicar serie/targets/enums |
| CL-PRT-01 | **PASS** | Tras ampliar página, reroute attentry-person y eliminar diagonal |
| CL-COM-01 | **PASS** | Tras añadir refs Team/Person/Event y re-apuntar 5 edges |
| CL-CMP-01 | **PASS** | Tras corregir hops, labels y vía superior extref-comp |
| CL-INS-01 | **PASS** | Tras corregir ruta audit-person y solapes de notas |

**QA visual: 9/9 PASS.** Detalle + hallazgos en `evidence/E8_QA_VISUAL_REPORT_V1.md`.

---

# 5. HALLAZGOS CORREGIDOS EN E8 (causas compartidas, lugar único: `Temp/opencode/fix-e8-*.ps1`)

1. Entidades XML corruptas (`<<`, `>>`, `&` sueltos) en 8 fuentes → escape mecánico + `XmlDocument` round-trip.
2. CL-00 no conforme a manifiesto §3.1 (definiciones duplicadas, sin INFRA) → reescrito: 9 paquetes, solo nombres, relaciones R-nn.
3. Celdas `lbl*`/`comp*` con `relative=1` colapsadas a la esquina → geometría absoluta.
4. Cajas con altura fija menor que el contenido (p. ej. Event L45 en 400px) → alturas por `líneas×14/15+pad`, páginas ampliadas donde hizo falta.
5. Edges con auto-routing cruzando texto → waypoints por corredores libres + `edgeStyle=orthogonalEdgeStyle` explícito en todos los edges.
6. 11 waypoints inválidos (`mxPoint` con coordenada vacía por despliegue de arrays en PowerShell) → conjuntos válidos de 0/2/3 puntos + chequeo `badPoints`.
7. COM: 5 edges apuntaban a proxies (`conversation→announcement`, `conversation→message`, `message→notification`, `notification→announcement`, `notification→message`) → re-apuntados a `Team`/`Person`/`Event` (refs exigidas por manifiesto §3.7, R-44–R-49); `rel-ann-snapshot` → `team-ref` (R-42, dependency).
8. Cardinalidades contra matriz: PPL lbl6 `1`→`0..*` (R-06); IAM lbl2 `0..1`→`1` (R-01).

---

# 6. DESVIACIONES ACEPTADAS

- **D1:** labels de multiplicidad en extremos solo en PPL/STR/IAM/CMP; en EVT/PRT/COM/INS la cardinalidad vive en los compartimentos y notas. Sin pérdida de información.
- **D2:** STR `rel-event-venue` termina en caja `Team` (la vista STR no incluye caja `Event`; el manifiesto no la lista como ref de STR). Extremos numéricos `0..*`/`0..1` conformes a R-15.
- **D3:** PRT `rel-elig-person` termina en `Availability` (la vista PRT no incluye caja `Person`). Relación R-37 documentada en la matriz; edge preservado como fue authored.
- **D4:** COM `rel-conv-event` original (`conversation→message`) eliminado como edge independiente y re-apuntado a `event-ref`: la matriz R-41–R-49 no contiene relación Conversation→Message. Mejora, no pérdida.
- **D5:** `Person` sin vista propietaria completa (referencia en IAM/PPL/COM/INS), según diseño del manifiesto §3.2/§3.3.

No se creará `GEI_CLASS_MODEL_OPEN_DECISIONS_V1.md`: no quedan decisiones funcionales pendientes (D1–D5 son desviaciones de representación aceptadas, no decisiones abiertas).

---

**Fin del Checklist V1.**
