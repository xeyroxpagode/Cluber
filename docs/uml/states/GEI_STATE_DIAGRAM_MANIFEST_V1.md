# GEI HOCKEY MANAGEMENT SYSTEM
## STATE DIAGRAM MANIFEST V1

**Etapa:** 6 — Diagramas de estados
**Estado:** COMPLETO
**Fecha:** 2026-10-07
**Rama:** `gei/e6-state-diagrams-freeze-v1`
**Baseline:** `01ee760388e27592d007c1c6f539e9204aefbf62`

---

# 1. INVENTARIO DE DIAGRAMAS GENERADOS

| SM-ID | Nombre Archivo (.drawio) | Objeto | Dominio | PNG Export | PDF Export |
|---|---|---|---|---|---|
| `SM-ACCOUNT-01` | `SM-ACCOUNT-01__Account_Lifecycle.drawio` | Account | IAM | ✅ 82 KB | ✅ 55 KB |
| `SM-TEAM-01` | `SM-TEAM-01__Team_Lifecycle.drawio` | Team | STR | ✅ 106 KB | ✅ 47 KB |
| `SM-DIVISION-01` | `SM-DIVISION-01__Division_Lifecycle.drawio` | Division | STR | ✅ 99 KB | ✅ 46 KB |
| `SM-LINE-01` | `SM-LINE-01__Line_Lifecycle.drawio` | Line | STR | ✅ 101 KB | ✅ 45 KB |
| `SM-VENUE-01` | `SM-VENUE-01__Venue_Lifecycle.drawio` | Venue | STR | ✅ 105 KB | ✅ 45 KB |
| `SM-EVENT-01` | `SM-EVENT-01__Event_Lifecycle.drawio` | Event | EVT | ✅ 270 KB | ✅ 67 KB |
| `SM-EVENTSERIES-01` | `SM-EVENTSERIES-01__EventSeries_Lifecycle.drawio` | EventSeries | EVT | ✅ 103 KB | ✅ 56 KB |
| `SM-AVAILABILITY-01` | `SM-AVAILABILITY-01__Availability_State_Model.drawio` | Availability | PRT | ✅ 195 KB | ✅ 58 KB |
| `SM-SELECTIONREV-01` | `SM-SELECTIONREV-01__SelectionRevision_Lifecycle.drawio` | SelectionRevision | PRT | ✅ 104 KB | ✅ 55 KB |
| `SM-ATTENDANCEENTRY-01` | `SM-ATTENDANCEENTRY-01__AttendanceEntry_State_Model.drawio` | AttendanceEntry | PRT | ✅ 125 KB | ✅ 61 KB |
| `SM-MATCHRECORD-01` | `SM-MATCHRECORD-01__MatchRecord_Lifecycle.drawio` | MatchRecord | PRT | ✅ 119 KB | ✅ 55 KB |
| `SM-ELIGIBILITY-01` | `SM-ELIGIBILITY-01__EligibilityConstraint_State_Model.drawio` | EligibilityConstraint | PRT | ✅ 113 KB | ✅ 62 KB |
| `SM-ANNOUNCEMENT-01` | `SM-ANNOUNCEMENT-01__Announcement_Lifecycle.drawio` | Announcement | COM | ✅ 134 KB | ✅ 58 KB |
| `SM-CONVERSATION-GROUP-01` | `SM-CONVERSATION-GROUP-01__Conversation_GROUP_Lifecycle.drawio` | Conversation (GROUP) | COM | ✅ 101 KB | ✅ 59 KB |
| `SM-MESSAGE-01` | `SM-MESSAGE-01__Message_Lifecycle.drawio` | Message | COM | ✅ 111 KB | ✅ 56 KB |
| `SM-COMPETITION-01` | `SM-COMPETITION-01__Competition_Lifecycle.drawio` | Competition | CMP | ✅ 83 KB | ✅ 56 KB |
| `SM-COMPETITIONENTRY-01` | `SM-COMPETITIONENTRY-01__CompetitionEntry_Lifecycle.drawio` | CompetitionEntry | CMP | ✅ 118 KB | ✅ 62 KB |

**Total:** 17 diagramas · 17 archivos `.drawio` fuente · 17 PNG · 17 PDF

---

# 2. UBICACIONES

| Tipo | Ruta |
|---|---|
| **Fuente autoritativa (editable)** | `docs/uml/states/source/` |
| **Export PNG (revisión visual)** | `docs/uml/states/export/png/` |
| **Export PDF (entrega académica)** | `docs/uml/states/export/pdf/` |
| **Evidencia QA** | `docs/uml/states/evidence/` |

---

# 3. HERRAMIENTAS DE GENERACIÓN

| Componente | Ubicación | Descripción |
|---|---|---|
| Generador principal | `scripts/state-diagrams/generate-state-diagrams.mjs` | Genera 17 archivos `.drawio` XML válidos |
| CLI draw.io | `C:\Program Files\WindowsApps\draw.io.draw.ioDiagrams_32.3.0.0_x64__1zh33159kp73c\app\draw.io.exe` | Export PNG/PDF validado |
| Validador XML | `scripts/state-diagrams/validate-state-diagrams.mjs` | Verifica estructura XML, IDs únicos, endpoints, waypoints |

---

# 4. VALIDACIONES REALIZADAS

## 4.1 Validación Mecánica (XML/Draw.io)

| Check | Resultado |
|---|---|
| XML bien formado | ✅ 17/17 |
| `<mxfile>` · `<diagram>` · `<mxGraphModel>` presentes | ✅ 17/17 |
| IDs `mxCell` únicos | ✅ 0 duplicados |
| `parent` · `source`/`target` válidos | ✅ 0 rotos |
| Sin `NaN` / `Infinity` en geometrías | ✅ 0 casos |
| `<Array as="points">` con `<mxPoint>` reales | ✅ 17/17 |
| Escape correcto de atributos XML | ✅ 17/17 |
| Coordenadas finitas | ✅ 17/17 |
| Labels editables | ✅ 17/17 |
| Conectores editables | ✅ 17/17 |

## 4.2 Validación de Carga/Export Draw.io (CLI Real)

| Check | Resultado |
|---|---|
| draw.io carga el archivo (exit code 0) | ✅ 17/17 |
| draw.io exporta a PNG | ✅ 17/17 |
| draw.io exporta a PDF | ✅ 17/17 |
| PNG tamaño > 10 KB (contenido real) | ✅ 17/17 |
| PDF tamaño > 10 KB (contenido real) | ✅ 17/17 |

## 4.3 QA Visual Real (Inspección PNG Renderizado)

| Diagrama | Inicio Identificable | Estados Legibles | Transiciones Visibles | Dirección Correcta | Condiciones Legibles | Sin Clipping | Sin Solape Texto | Veredicto |
|---|---|---|---|---|---|---|---|---|
| `SM-ACCOUNT-01` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** |
| `SM-TEAM-01` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** |
| `SM-DIVISION-01` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** |
| `SM-LINE-01` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** |
| `SM-VENUE-01` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** |
| `SM-EVENT-01` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** |
| `SM-EVENTSERIES-01` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** |
| `SM-AVAILABILITY-01` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** |
| `SM-SELECTIONREV-01` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** |
| `SM-ATTENDANCEENTRY-01` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** |
| `SM-MATCHRECORD-01` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** |
| `SM-ELIGIBILITY-01` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** |
| `SM-ANNOUNCEMENT-01` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** |
| `SM-CONVERSATION-GROUP-01` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** |
| `SM-MESSAGE-01` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** |
| `SM-COMPETITION-01` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** |
| `SM-COMPETITIONENTRY-01` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** |

**Resultado Global: 17/17 PASS**

---

# 5. CONVENCIONES DE NOMBRE

| Elemento | Convención | Ejemplo |
|---|---|---|
| Archivo fuente | `SM-<OBJECT>-<NN>__<Nombre_Descriptivo>.drawio` | `SM-ACCOUNT-01__Account_Lifecycle.drawio` |
| Export PNG | Mismo nombre base `.png` | `SM-ACCOUNT-01__Account_Lifecycle.png` |
| Export PDF | Mismo nombre base `.pdf` | `SM-ACCOUNT-01__Account_Lifecycle.pdf` |
| ID Estado | `s1`, `s2`, `s3`... | Estados persistidos |
| ID Estado Derivado | `d1`, `d2`... | Estados derivados (dashed) |
| ID Inicial | `init` | Pseudoestado inicial |
| ID Edge | `edge_<n>` | Transiciones |
| ID Nota Prohibidas | `mxCell_<uuid>` | Texto de transiciones prohibidas |

---

# 6. ESTILOS VISUALES APLICADOS

| Elemento | Estilo |
|---|---|
| Estado persistido | `rounded=1;fillColor=#FFFFFF;strokeColor=#1A1A1A;fontSize=11;fontFamily=Helvetica;` |
| Estado derivado | Igual + `dashed=1;fillColor=#F5F5F5;` |
| Inicio (pseudoestado) | `ellipse;fillColor=#1A1A1A;strokeColor=#1A1A1A;` (círculo negro sólido 24px) |
| Transición | `edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;html=1;fontSize=11;fontFamily=Helvetica;strokeColor=#1A1A1A;` |
| Self-loop | Waypoints en `(-60,-80)` y `(60,-80)` para bucle visible |
| Etiqueta transición | `html=1;fontSize=11;fontFamily=Helvetica;align=center;verticalAlign=middle;` |
| Nota prohibiciones | `rounded=1;fillColor=#FFF8E1;strokeColor=#F57F17;fontSize=10;fontFamily=Helvetica;strokeWidth=1;dashed=1;` |
| Título diagrama | `fontSize=14;fontFamily=Helvetica;fontStyle=1;align=center;` |
| Página | A4 Landscape `1169 × 827` |

---

# 7. NOTACIÓN UML RESPETADA

| Elemento UML | Representación |
|---|---|
| Inicio | Círculo negro sólido (pseudoestado inicial) |
| Estado | Rectángulo redondeado con nombre + descripción |
| Transición | Línea sólida con flecha direccional |
| Etiqueta transición | `evento [condición] / efecto` (omitir inexistentes) |
| Estado derivado | Rectángulo redondeado punteado (dashed) + fondo gris claro |
| Transiciones prohibidas | **NO dibujadas como flechas**; documentadas en nota amarilla |
| Pseudonodo final | **NO usado** (objetos persisten para historial/auditoría) |

---

**Fin del Manifest de Diagramas de Estados V1.**