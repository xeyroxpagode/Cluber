# GEI HOCKEY MANAGEMENT SYSTEM
## REQUIREMENTS OPEN DECISIONS V1

**Etapa:** 1 — Reconciliación de Requerimientos
**Estado:** 2 decisiones abiertas · **0 bloqueantes**
**Fecha:** 2026-10-04
**Rama:** `gei/e1-requirements-freeze-v1`

Este archivo existe sólo porque hay decisiones de producto que **no** pueden resolverse con la
evidencia disponible. No hay decisiones pendientes de redactar: hay decisiones que **nadie ha
tomado todavía** y que E1 no tiene autoridad para tomar.

**Ninguna de las dos bloquea el cierre de la Etapa 1.** Cada una tiene una etapa de destino.

| ID | Pregunta | Bloqueante | Etapa en que debe resolverse |
|---|---|---|---|
| `REQ-DECISION-NEEDED-01` | ¿La estructura deportiva archivada se puede restaurar? | **NO** | Antes de los diagramas de estado (**Etapa 3**) |
| `REQ-DECISION-NEEDED-02` | ¿Se declara un nivel de conformidad de accesibilidad? | **NO** | Antes de los contratos de pantalla (**Etapa 9**) |

---

# REQ-DECISION-NEEDED-01 — Restauración de estructura deportiva archivada

## Pregunta

Cuando una división, una línea, un equipo o una sede se archiva, ¿el club puede deshacer ese
archivo y devolver la estructura a su estado anterior, o el archivo es terminal en V1?

## Fuentes

| Fuente | Qué dice | Status |
|---|---|---|
| `PT §9` (Team) | `Team: DRAFT -> ACTIVE -> ARCHIVED` — **no hay transición de vuelta** | `AUTHORITATIVE` |
| `PT §19` (Division, Line, Venue) | `Division: Create; Update; Archive` — **no hay `Restore`** | `AUTHORITATIVE` |
| `PT §19` (Venue) | `archived_at` en el contrato de la sede, sin comando de restauración | `AUTHORITATIVE` |
| `PT §33` (ReferenceAdmissionFence) | La valla protege `archive/end/close` contra la creación de nuevas dependencias. **No menciona restore.** | `AUTHORITATIVE` |
| `PT §75` (Core invariants) | `transitions with command: ALL` · `Stateful objects with lifecycle: ALL` | `AUTHORITATIVE` |
| `PT §75` | `meaningful history is not hard-deleted` | `AUTHORITATIVE` |
| `PT §5` (Authority Matrix) | La columna de authority **no contiene ninguna fila de restore**. | `AUTHORITATIVE` |
| `SRC-17 FF §12` / `§14` (Final Frontend Freeze) | Congela el comportamiento del frontend. **No define un ciclo de vida de estructura** — su §14 cubre eventos, disponibilidad, asistencia, convocatoria, resultado, comunicado y cuenta, pero no temporada, división, línea, equipo ni sede. | `DECISION` |
| `SRC-15 FFS F19` | `Estructura: COMPLETE — Archivar y restaurar, valla de dependencia que explica por qué no se puede archivar…` | `EVIDENCE` |
| `SRC-15 FFS F19` (motivo del PARTIAL) | `la temporada no se renombra por decisión de producto y no hay creación de temporada desde la UI` | `EVIDENCE` |
| `SRC-11 S5FLW F19` (Stage 5) | `Sin restore. Archivar es irreversible desde la UI` — registrado como **gap** | `EVIDENCE` (superada en veredicto por `SRC-15`) |
| `SRC-19 FGMAM §M10.b` | Reporta `TeamAdmin`: `Toggle de estado ✅; fence de dependencias ✅; sin create/edit` | `HISTORICAL` |

## El problema exacto

El prototipo **ofrece restore** y Stage 5 lo marcó como gap; Stage 6 lo cerró declarándolo
implementado. Pero **ninguna autoridad define la transición**. PT §75 exige que *toda* transición
tenga comando y *toda* Entidad con lifecycle tenga uno. Por lo tanto hoy existe una transición en el
producto sin contrato que la autorice.

Esto es exactamente `IMPLEMENTATION_WITHOUT_REQUIREMENT` por el criterio de la Etapa 1, con una
particularidad: no es una capacidad accidental, es una capacidad **plausible y probablemente
necesaria**. Por eso no se clasificó como `ACCIDENTAL UI` ni se convirtió en `REQ`, y por eso no se
descartó.

## Opciones

| Opción | Descripción | Consecuencia |
|---|---|---|
| **(a) Restore en V1** | Toda estructura archivada (`Division`, `Line`, `Team`, `Venue`) puede restaurarse, con la misma valla de dependencias que protege el archivo, y con `RESTORE` como comando explícito con authority. `Season` **no** entra: PT §19 la declara histórica y sin estado. | Cierra el gap. Añade 1 transición a 4 ciclos de vida. Exige decidir la fila de authority del restore (probablemente `ADMIN` con alcance `CLUB`, coherente con `Club structure`) y el efecto sobre `ARCHIVED → ACTIVE`. |
| **(b) Archive terminal en V1** | El archivo es definitivo. El restore se elimina del producto. PT §9 y §19 se leen tal cual, sin cambio. | Cierra el gap por eliminación. Contradice `SRC-15 F19` (COMPLETE con restore), lo que obliga a reabrir ese veredicto. Riesgo: una temporada mal archivada deja al club sin estructura recuperable. |
| **(c) Restore sólo para `Team`** | Sólo el equipo se restaura; división, línea y sede quedan terminales. | Introduce una asimetría difícil de explicar al club y sin fuente que la justifique. **No recomendada.** |

## Impacto

| Dominio afectado | Impacto |
|---|---|
| `STR` | 4 ciclos de vida (`Division`, `Line`, `Team`, `Venue`)_md_gain_1 transición cada uno, o ninguno |
| `IAM` / `AUTHORIZATION` | 1 fila nueva en la matriz de authority, o ninguna |
| `INS` / `HISTORY_AUDIT` | La restauración debe quedar auditada (`REQ-INS-009`) y, si hay historia asociada, ser visible |
| `EVT` | Si un `Team` se restaura, los eventos que dependían de él vuelven a ser alcanzables: hay que definir si su estado operativo se revive o queda histórico |
| `CMP` | Si una `Line` o `Division` se restaura, las inscripciones de competencia que dependían de ella |
| Diagramas | **Etapa 3**: 4 diagramas de estado cambian |
| Clases | **Etapa 6**: la transición aparece en el modelo |

## Recomendación

**(a) Restore en V1, sólo para `Division`, `Line`, `Team` y `Venue`, con `Season` excluida.**

Motivo: la valla de dependencias de `REQ-STR-006` ya existe y ya sabe enumerar qué bloquea. El
restore con la misma valla no introduce una capacidad nueva sino la simétrica de una que ya está
requerida. Y `PT §75` (`meaningful history is not hard-deleted`) construye el argumento de que una
decisión estructural equivocada debe ser corregible, no definitiva — igual que una corrección de
asistencia es corregible y una de resultado final también.

Contra-argumento honesto: PT no lo pide, y añadirlo es ampliar alcance. Por eso se registra como
decisión y no como requerimiento.

## Ámbito de la decisión

- **Dominios:** `STR`, `IAM`, `INS`, `EVT`, `CMP`
- **Actores futuros afectados:** `Admin` (y posiblemente `Subcommittee`, si se leiera
  `Eligible: ` — **hoy `Subcommittee` no administra estructura**, PT §5, así que el restore sería de
  `Admin`)
- **Casos de uso futuros afectados:** los de gestión de estructura (`REQ-STR-002`, `REQ-STR-003`,
  `REQ-STR-004`, `REQ-STR-005`)
- **Requerimientoscatalogados que esperarían esta decisión:** ninguno queda bloqueado; `DEF-STR-001`
  y `DEF-STR-002` se convierten en `REQ` si se elige (a)

---

# REQ-DECISION-NEEDED-02 — Nivel de conformidad de accesibilidad

## Pregunta

¿GEI declara un nivel de conformidad de accesibilidad (por ejemplo, WCAG 2.2 AA) como compromiso de
producto, o el producto se compromete únicamente a un conjunto de criterios verificables propios?

## Fuentes

| Fuente | Qué dice | Status |
|---|---|---|
| `PT §78` (Evidence Pending) | `actual accessibility behavior` está entre las cosas que **la implementación debe demostrar** | `AUTHORITATIVE` |
| `PT §1.3` / `§76` (RNF) | `intuitive UI \| UX/S23` como owner del RNF | `AUTHORITATIVE` |
| `SRC-17 FF §8` | Criterios concretos y verificables: `BUTTON: 44 px`; `TAB: role="tablist" con aria-selected, navegación por flechas y foco gestionado`; `TOGGLE: aria-pressed y estado visible con fondo, no sólo con color`; `SELECT: control de 44 px con label persistente y error asociado`; `MENU: role="menu", Escape para cerrar, clic afuera para cerrar, foco al primer ítem`; `DIALOG: trampa de foco, Escape, bloqueo de scroll, foco inicial en el primer control útil y no en "Cerrar"`; `Objetivo táctil mínimo: 44 px` | `DECISION` |
| `SRC-17 FF §4` | `Todo estado se escribe en texto. El color acompaña, nunca sustituye. Con forced-colors los badges conservan borde` | `DECISION` |
| `SRC-17 FF §10` | `prefers-reduced-motion apaga todo` | `DECISION` |
| `SRC-17 FF §9` | Campo con error asociado, foco al primer error, estado sucio, confirmación al descartar | `DECISION` |
| `SRC-17 FF §17` | `Pendiente de evidencia y declarado: zoom 200 %, axe y lector de pantalla… No se declaran PASS` | `DECISION` |
| `SRC-03 IAR §2 P4` | `Página autoexplicativa en 5 segundos` | `DECISION` |
| `SRC-09 S5PIA N-03` | `aria-live = 0; role="tab" = 0; 0 aria-* en management.tsx; aria-invalid = 0` | `EVIDENCE` |
| `SRC-09 S5PIA` (nota del análisis) | Señala explícitamente que **PT no contiene ninguna regla de accesibilidad** y que el paquete de diseño tampoco | `EVIDENCE` |

## El problema exacto

Hay un conjunto sólido y verificable de criterios de accesibilidad, con fuente explícita en la
decisión de diseño más reciente. **Pero ninguna fuente declara un nivel de conformidad.** Sin nivel
declarado:

1. no hay forma de saber si el producto "cumple accesibilidad";
2. no hay criterio de aceptación cerrado para la auditoría de conformance;
3. `REQ-SYS-003` queda con criterios enumerados pero sin techo.

E1 **no inventó** un nivel. Declarar "WCAG 2.2 AA" sin fuente sería exactamente el tipo de
requisito sin fuente que el brief prohíbe.

## Opciones

| Opción | Descripción | Consecuencia |
|---|---|---|
| **(a) Declarar WCAG 2.2 AA** | Compromiso de nivel, verificable con auditoría automática y manual. | Cierra el techo. Obliga a ampliar el alcance de `REQ-SYS-002/003/004/005` considerably: WCAG incluye navegación por teclado completa, landmarks, nombres accesibles, contraste mínimo medible, reflow a 320 px, y mucho más. **Añade alcance no evaluado hoy.** |
| **(b) Criterios propios verificables, sin nivel** | El compromiso es exactamente el conjunto de `FF §4`, `FF §8`, `FF §9`, `FF §10` y `REQ-SYS-002`, cada uno con criterio de aceptación closed. | Cierra el techo con lo que ya está decidido y auditado. No promete más de lo que las fuentes respaldan. No cierra "conformidad" en el sentido normativo. |
| **(c) No declarar nada** | Se deja sólo la evidencia pendiente de `FF §17`. | Deja `REQ-SYS-003` sin criterio de cierre verificable. **No recomendada.** |

## Recomendación

**(b) Criterios propios verificables, sin declarar nivel de conformidad en V1.**

Motivo: las tres fuentes que hablan de accesibilidad (PT §78, `FF §8/§9/§10`, `SRC-09`) coinciden en
un conjunto concreto y medible, y ninguna nombra un nivel. Declarar un nivel sería ampliar el
alcance sin fuente, que es lo que E1 prohíbe. Y la opción (b) es honesta: el club obtiene
garantías comprobables hoy y no una promesa de conformidad que nadie ha medido.

Si el club quiere la opción (a), es una decisión legítima — pero debeiry----
tomarse **explícitamente** y debe abrir la ampliación de `REQ-SYS-002` a `REQ-SYS-005` antes de la
Etapa 9, no después.

## Impacto

| Elemento | Con (b) — recomendado | Con (a) |
|---|---|---|
| `REQ-SYS-002` | Objetivo táctil 44 px, medido | Ídem + criterios de contraste y reflow |
| `REQ-SYS-003` | Semántica, foco, teclado en los controles declarados | + navegación por teclado completa, landmarks, nombres accesibles |
| `REQ-SYS-004` | Movimiento causal y `prefers-reduced-motion` | Ídem + criterios de animación |
| `REQ-SYS-005` | Estado en texto, alto contraste | Ídem + contraste mínimo medible en texto y componentes |
| Verificación | Zoom 200 %, auditoría automática, lector de pantalla (`DEF-SYS-002`) | Ídem + informe de conformidad |
| Esfuerzo | El ya previsto | Por estimar; **no evaluado en E1** |
| Riesgo | El club no puede afirmar "cumplimos una norma de accesibilidad" | Se promete más de lo que las fuentes respaldan |

## Ámbito de la decisión

- **Dominios:** `SYS` (transversal); afecta a todos los dominios que producen superficie
- **Actores futuros afectados:** todos los que usan el producto, conTCGcsatención particular a
  `Guardian / delegated adult` y a `Coach` en la cancha
- **Casos de uso futuros afectados:** ninguno cambia; cambian los **criterios de aceptación** de
  los casos que producen superficie
- **Requerimientoscatalogados que esperarían esta decisión:** `REQ-SYS-002`, `REQ-SYS-003`,
  `REQ-SYS-004`, `REQ-SYS-005`, `DEF-SYS-002`

---

# NOTAS DE CIERRE

1. **Ambas decisiones son no bloqueantes por construcción.** Ninguna impide cerrar la Etapa 1,
   ninguna contradice una autoridad vigente, y ninguna afecta a un requerimiento ya emitido: los
   requerimientos afectados ya están IN con los criterios que las fuentes sí respaldan.
2. **Ninguna se resolvió por inferencia.** Si E1 hubiera deducted cualquiera de las dos, habría
   añadido un requisito sin fuente. Se registrationson.
3. **Pt §82 aplica.** Si alguna de las dos se decide, la que cambie comportamiento de V1 requiere
   revisar la sección correspondiente de `PT v1.0.1` antes de modificar el catálogo.
4. **Alcance de esta etapa.** E1 no toma decisiones de producto. Su producto es la verdad funcional sobre
   la cual se construirán actores, casos de uso, diagramas, trazabilidad, arquitectura de
   información, contratos de pantalla, experiencia final, arquitectura y backend.