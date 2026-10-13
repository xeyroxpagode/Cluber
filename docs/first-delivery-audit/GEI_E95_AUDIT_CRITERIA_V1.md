# GEI E9.5 — CRITERIOS DE AUDITORÍA INTEGRAL V1

**Estado:** FIJADO ANTES DE AUDITAR (precondición de E9.5 §3)  
**Fecha:** 2026-10-13  
**Propósito:** Establecer el contrato de evaluación **antes** de ejecutar la auditoría, para evitar criterios retroactivos.

---

## 1. REQUISITOS OBLIGATORIOS DE LA CONSIGNA (Fuente primaria)

| ID | Requisito consigna | Fuente exacta | Archivo y sección | Regla verificable | Artefactos a los que aplica | Método de comprobación | Severidad de incumplimiento |
|----|-------------------|---------------|-------------------|-------------------|----------------------------|------------------------|----------------------------|
| C-01 | Requerimientos analizados y corregidos | Trabajo Práctico Integrador (1).md · líneas 5 | `$env:USERPROFILE\Downloads\Trabajo Práctico Integrador (1).md` · L5 | Existe catálogo de REQ con trazabilidad a necesidades reales; contradicciones resueltas | `GEI_REQUIREMENTS_CATALOG_V1.md`, `GEI_REQUIREMENTS_FREEZE_V1.md` | Revisión de 157 REQ IN: integridad, claridad, precisión, consistencia, ausencia de ambigüedad relevante | BLOCKING |
| C-02 | Diagramas de Casos de Uso listos | TP Integrador (1).md · L7 | `$env:USERPROFILE\Downloads\Trabajo Práctico Integrador (1).md` · L7 | Diagramas UCD completos con 8 actores, 102 CU, relaciones include/extend/generalization correctas | `GEI_USE_CASE_DIAGRAM_FREEZE_V1.md`, drawio sources, exports | Inspección visual + validación estructural (validador drawio + matriz E3) | BLOCKING |
| C-03 | Especificaciones básicas de TODOS los CU | TP Integrador (1).md · L7 | `$env:USERPROFILE\Downloads\Trabajo Práctico Integrador (1).md` · L7 | 102/102 CU tienen ficha con: nombre, descripción, actor, objetivo, pre/post, camino básico, alternativos, numeración, include/extend, resultado, reglas/errores | `GEI_USE_CASE_SPECIFICATION_FREEZE_V1.md`, 8 fichas dominio | Lectura semántica de 102 fichas (no solo existencia de secciones) | BLOCKING |
| C-04 | Diagrama de clases completo | TP Integrador (1).md · L8 | `$env:USERPROFILE\Downloads\Trabajo Práctico Integrador (1).md` · L8 | 37 clases canónicas + 9 vistas drawio con: nombre singular único, atributos, tipos, operaciones, firmas, constructores, asociaciones, multiplicidades, agregación, composición, generalización, dependencia | `GEI_CLASS_CATALOG_V1.md`, 9 drawio sources, exports PDF/PNG | Inspección visual + validación contra PT v1.0.1 + catálogo | BLOCKING |
| C-05 | Gestor de proyecto con seguimiento real | TP Integrador (1).md · L9 | `$env:USERPROFILE\Downloads\Trabajo Práctico Integrador (1).md` · L9 | Existe tablero en Trello/Jira/Notion/ClickUp con ítems trazables a REQ/CU | Evidencia externa (no en repo) | Verificación manual con el usuario; Linear NO está en la lista explícita | MAJOR (externo) |
| C-06 | Empezar a programar | TP Integrador (1).md · L10 | `$env:USERPROFILE\Downloads\Trabajo Práctico Integrador (1).md` · L10 | Evidencia real de frontend existente y commits accesibles | `src/**`, `package.json`, git history | Verificación de commits, estructura, typecheck/build | MAJOR |

---

## 2. CONVENCIONES ENSEÑADAS POR EL PROFESOR (Material de clase)

| ID | Convención | Fuente exacta | Archivo y sección | Regla verificable | Artefactos a los que aplica | Método de comprobación | Severidad de incumplimiento |
|----|------------|---------------|-------------------|-------------------|----------------------------|------------------------|----------------------------|
| P-01 | Actores como stick figures (shape=umlActor) | Veterinaria.drawio L128, L131; Concesionaria.drawio L7, L10, L13, L37; Teatro.drawio L7, L10, L13, L34, L37 | `diagrama veterinaria.drawio`, `diagrama concesionario.drawio`, `diagrama teatro.drawio` | Todos los actores representados con shape=umlActor, verticalLabelPosition=bottom | UCD drawio sources | Inspección XML drawio | MINOR |
| P-02 | Casos de uso como elipses (ellipse style) | Veterinaria.drawio L7, L10, L13, L33; Concesionaria.drawio L40, L43; Teatro.drawio L40, L43, L46 | Mismos archivos | Todos los CU son elipses con fontSize=11, whiteSpace=wrap, html=1 | UCD drawio sources | Inspección XML drawio | MINOR |
| P-03 | <<include>>: línea discontinua, flecha abierta desde base a incluido | Veterinaria L22, L27, L30, L45, L48, L51; Concesionaria L55, L58, L61, L76, L79, L82; Teatro L55, L58, L61, L82, L97, L100, L103, L118, L121, L124 | Mismos archivos | Edge style: `edgeStyle=none;dashed=1;endArrow=open;endFill=0;fontSize=10; value="<<include>>"`; source = base CU, target = incluido | UCD drawio sources | Inspección XML drawio | MAJOR (si invertido o faltante en CU obligatorios) |
| P-04 | <<extend>>: línea discontinua, flecha abierta desde extensión a base | Veterinaria L60, L78; Concesionaria L91, L97; Teatro L67, L73, L82 | Mismos archivos | Edge style: `edgeStyle=none;dashed=1;endArrow=open;endFill=0;fontSize=10; value="<<extend>>"`; source = extending CU, target = base CU | UCD drawio sources | Inspección XML drawio | MAJOR (si invertido o faltante en CU condicionales) |
| P-05 | Generalización de actores: línea sólida, flecha hueca (block, endFill=0) desde hijo a padre | Veterinaria L134, L137; Concesionaria L16, L26; Teatro L16, L25 | Mismos archivos | Edge style: `endArrow=block;endFill=0;endSize=12;startArrow=none`; source = actor especializado, target = actor general | UCD drawio sources | Inspección XML drawio | MAJOR (si dirección invierta) |
| P-06 | Asociación actor-CU: línea sólida sin flecha (endArrow=none) | Veterinaria L93, L98, L103, L108-126; Concesionaria L109-148; Teatro L127-159 | Mismos archivos | Edge style: `endArrow=none`; source = actor, target = CU (o exitX/exitY para layout) | UCD drawio sources | Inspección XML drawio | MINOR |
| P-07 | Límite del sistema (system boundary) | No explícito en drawio; convención UML estándar | Introducción a UML.pdf (no legible directo) | Caja punteada/continua que encierra CU, actores fuera | UCD drawio exports | Inspección visual PDF/PNG | MINOR |
| P-08 | Nombrado de CU: verbo + objeto (acción) | Veterinaria: "Gestionar clientes", "Crear cliente", "Registrar cobro"; Concesionaria: "Gestionar catálogo de autos", "Registrar venta"; Teatro: "Buscar espectáculo", "Comprar entrada" | Mismos archivos | Nombre del CU expresa objetivo funcional del actor | Catálogo CU + drawio | Lectura semántica | MINOR |
| P-09 | Clases: nombre singular, compartimento atributos y operaciones | Diagrama de clases.pdf (no legible) + ejemplos drawio clase | `Diagrama de clases.pdf` | Cada clase: nombre singular, atributos con tipo, operaciones con firma y retorno | GEI class drawio sources | Inspección visual + catálogo | MAJOR |
| P-10 | Multiplicidades en ambos extremos de asociación | Diagrama de clases.pdf + estándar UML | UML estándar | Toda asociación muestra multiplicidad en ambos extremos (ej. 1..*, 0..1) | GEI class drawio sources | Inspección visual | MAJOR |

---

## 3. REGLAS UML APLICABLES (Estándar + Material académico)

| ID | Regla UML | Fuente | Regla verificable | Artefactos | Método | Severidad |
|----|-----------|--------|-------------------|------------|--------|-----------|
| U-01 | <<include>>: caso de uso base **siempre** ejecuta el incluido | UML 2.5 §18.1.3 + Veterinaria/Concesionaria/Teatro | Flecha desde base → incluido; base no tiene sentido sin incluido | UCD | Verificar dirección flecha | MAJOR |
| U-02 | <<extend>>: caso de uso extendido **puede** ejecutar la extensión bajo condición | UML 2.5 §18.1.3 + ejemplos clase | Flecha desde extensión → base; punto de extensión identificable | UCD | Verificar dirección flecha | MAJOR |
| U-03 | Generalización: hijo hereda comportamiento del padre | UML 2.5 §9.9.7 + ejemplos | Flecha hueca desde hijo → padre | UCD (actores) | Verificar dirección | MAJOR |
| U-04 | Asociación navegable: flecha indica navegabilidad | UML 2.5 §11.5.3 | Si hay flecha, navegabilidad en esa dirección; si no, bidireccional o no especificada | Diagramas de clases | Inspección visual | MINOR |
| U-05 | Agregación (rombo hueco): parte puede existir sin todo | UML 2.5 §11.5.3 | Rombo hueco en extremo del todo | Diagramas de clases | Inspección visual | MINOR |
| U-06 | Composición (rombo lleno): parte no existe sin todo | UML 2.5 §11.5.3 | Rombo lleno en extremo del todo | Diagramas de clases | Inspección visual | MINOR |
| U-07 | Dependencia (línea discontinua flecha abierta): uso temporal | UML 2.5 §7.8.4 | Línea discontinua con flecha abierta | Diagramas de clases | Inspección visual | MINOR |
| U-08 | Estado inicial: círculo negro relleno | UML 2.5 §15.3.4 | Círculo negro pequeño | Diagramas de estados | Inspección visual | MINOR |
| U-09 | Estado final: círculo con borde doble | UML 2.5 §15.3.5 | Círculo concéntrico | Diagramas de estados | Inspección visual | MINOR |
| U-10 | Transición: línea sólida con flecha, etiqueta evento[guard]/acción | UML 2.5 §15.3.12 | Formato: evento [guard] / acción | Diagramas de estados | Inspección visual | MAJOR |
| U-11 | Actividad: inicio (círculo negro), fin (círculo doble), decisión (rombo), fork/join (barra gruesa) | UML 2.5 §16.2 | Símbolos correctos | Diagramas de actividad | Inspección visual | MAJOR |

---

## 4. CONTRATOS FUNCIONALES VIGENTES DE GEI (Product Truth v1.0.1)

| ID | Contrato | Fuente PT | Regla verificable | Artefactos | Método | Severidad |
|----|----------|-----------|-------------------|------------|--------|-----------|
| PT-01 | Division es estable entre temporadas (no tiene seasonId) | PT §4 L223-234, PT §26, PT §19 | Division NO tiene seasonId; Team = Season + Division + Line | Class model, E8 relaciones | Verificar R-10 no existe / Division sin seasonId | BLOCKING (si contradice) |
| PT-02 | Team es entidad concreta de temporada: identidad = Season + Division + Line | PT §4 L229-234, PT §19 | Team.unique = season_id + division_id + line_id | Class model, DB schema | Verificar unicidad compuesta | BLOCKING |
| PT-03 | Role scopes válidos: PLAYER/CAPTAIN=TEAM, COACH=TEAM/EVENT, SUBCOMMITTEE/ADMIN=CLUB | PT §5 L299-309 | NO existe scope LINE para RoleAssignment; combinación inválida → 422 INVALID_ROLE_SCOPE | Class model, E8 relaciones | Verificar R-07 no existe / VO-09 | BLOCKING (si contradice) |
| PT-04 | Guardian es relación (GuardianRelationship), NO rol | PT §1.2 L56, PT §5 L289, PT §20 L876-885 | No hay rol GUARDIAN; acceso vía delegación con flags independientes | Actor model, UC specs | Verificar ACT-GUARDIAN no tiene rol deportivo | MAJOR |
| PT-05 | ADMIN no es superusuario deportivo | PT §5 L337, Authority Matrix | ADMIN no tiene autoridad en: Selection, Attendance, MatchRecord, Logistics (Team/Event scope) | UC catalog, specs | Verificar matriz autoridad | MAJOR |
| PT-06 | CAPTAIN no hereda poder de COACH | PT §5 L339 | CAPTAIN solo TEAM scope; no puede crear/editar Training/Match | UC catalog | Verificar UC-EVT | MAJOR |
| PT-07 | Event lifecycle: DRAFT → SCHEDULED → {POSTPONED, CANCELLED, IN_PROGRESS} → {COMPLETED, ABANDONED} | PT §9 L459-476 | Transiciones permitidas y prohibidas según matriz | State diagrams E6 | Verificar TR y PROH | MAJOR |
| PT-08 | Match: IN_PROGRESS → ABANDONED; COMPLETED no reabre | PT §9 L473-476 | No transición COMPLETED → * | State diagrams | Verificar PROH | MAJOR |
| PT-09 | Availability: persistido YES/MAYBE/NO; derivado NO_RESPONSE/NEEDS_RECONFIRMATION | PT §12 L517-520, L618-621 | POSTPONED conserva, no acepta nuevas | UC specs, State diagrams | Verificar SM-AVAILABILITY-01 | MINOR |
| PT-10 | Selection: DRAFT (mutable) → PUBLISHED (inmutable); republicar = nueva revisión | PT §9 L487-489, PT §14 L677-686 | No reescritura retroactiva; conflictos derivados | UC specs, Class model | Verificar SelectionRevision | MAJOR |
| PT-11 | MatchRecord: DRAFT → FINAL (terminal); corrección explícita separada | PT §9 L508-512 | FINAL solo corrige, no retrocede lifecycle | State diagrams | Verificar SM-MATCHRECORD-01 | MAJOR |
| PT-12 | Communication entitlement automático: PLAYER, CAPTAIN, COACH; Guardian NO | PT §20 L869-874 | GuardianRelationship no da acceso a conversaciones | UC specs, Class model | Verificar UC-COM | MAJOR |

---

## 5. CRITERIOS DE LEGIBILIDAD Y PRESENTACIÓN

| ID | Criterio | Fuente | Regla verificable | Artefactos | Método | Severidad |
|----|----------|--------|-------------------|------------|--------|-----------|
| L-01 | Diagramas UCD legibles: sin solapamientos excesivos, layout ordenado | Ejemplos profesor (Veterinaria, Concesionaria, Teatro) | Espaciado razonable, actores a izquierda, CU agrupados por dominio | UCD exports PDF/PNG | Inspección visual | MINOR |
| L-02 | Diagramas de clases legibles: 9 vistas por dominio, no todo en uno | GEI_CLASS_DIAGRAM_MANIFEST_V1.md | 9 diagramas: CL-00 (overview), CL-CMP, CL-COM, CL-EVT, CL-IAM, CL-INS, CL-PPL, CL-PRT, CL-STR | Class drawio sources + exports | Conteo + inspección | MINOR |
| L-03 | Especificaciones CU: redacción natural, comprensible por profesor sin contexto interno | Consigna "especificaciones básicas" | Texto describe interacción actor-sistema, no implementación | 8 fichas E5 | Lectura semántica muestra | MAJOR (si artificial/confusa) |
| L-04 | Nombres técnicos consistentes: PT v1.0.1 terminology | PT §4 L221-278 | Division, Line, Team, Competition, CompetitionEntry, Jornada, etc. | Todos los docs | Búsqueda de términos no canónicos | MINOR |
| L-05 | Exportaciones PDF/PNG existen para todos los diagramas obligatorios | E4/E6/E7/E8 freeze manifests | Cada drawio source tiene export PDF y PNG en export/ | export/pdf/, export/png/ | Verificación existencia | MINOR |

---

## 6. DEFINICIÓN DE ERROR REAL (Qué SÍ es error)

| Categoría | Definición | Ejemplos |
|-----------|------------|----------|
| **Contradicción con autoridad** | Documento afirma X pero Product Truth / Consigna / UML estándar dicen ¬X | R-07 scope LINE, R-10 Division→Season |
| **Incumplimiento consigna** | Falta artefacto obligatorio para 15/10 | Sin diagrama de clases, sin specs de CU |
| **Violación UML semántica** | Símbolo UML usado con significado opuesto a estándar | <<include>> con flecha invertida, generalización invertida |
| **Inconsistencia interna** | Dos documentos GEI se contradicen sin justificación | E6 dice 62 transiciones, detalle suma 65 |
| **Información inventada** | Elemento sin fuente en REQ/PT/consigna | CU sin REQ, clase sin justificación, relación sin soporte |
| **Ambigüedad operativa** | Texto que cambiaría la implementación según interpretación | "El sistema gestiona..." sin especificar qué/quién/cuándo |

---

## 7. QUÉ NO ES ERROR (No modificar por esto)

| Categoría | Ejemplos |
|-----------|----------|
| Preferencia de nombres válidos | "Registrar cobro" vs "Procesar pago" si ambos correctos |
| Cantidad de diagramas distinta a ejemplos | Profesor usa 1 UCD; GEI usa 13 por dominio |
| Mayor profundidad documental que la solicitada | 102 CU vs menos en ejemplos; 37 clases vs menos en ejemplos |
| Decisiones de diseño alternativas igualmente correctas | Herencia vs discriminación si ambas justificadas (CLASS-DECISION-01) |
| Ausencia de funcionalidades OUT de alcance | No contabilidad, no OAuth, no MFA (PT §11 OUT) |
| Falta de backend terminado cuando solo se exige "programación iniciada" | Consigna no exige backend completo |

---

## 8. CLASIFICACIÓN DE SEVERIDAD

| Nivel | Definición | Acción requerida |
|-------|------------|------------------|
| **BLOCKING** | Incumplimiento académico obligatorio O contradicción funcional/UML que invalida el modelo | Corrección obligatoria antes de PASS |
| **MAJOR** | Error sustantivo de comportamiento, autoridad, estructura o interpretación que requiere corrección | Corrección focalizada; revalidar trazabilidad |
| **MINOR** | Problema documental o visual real que no invalida el modelo | Erratas / corrección cosmética si sencilla |
| **INFO** | Observación, deuda aceptada, propuesta de mejora | Registrar; no bloquea |

---

## 9. CONDICIONES PARA APROBAR CADA ÁREA

| Área | Condición PASS |
|------|----------------|
| **Requerimientos (E1)** | 157 REQ IN íntegros; 0 contradicciones funcionales abiertas; 0 ambigüedades que cambian implementación; trazabilidad a fuentes |
| **Actores (E2)** | 8 actores con autoridad verificada; 0 concesiones indebidas (ADMIN deportivo, CAPTAIN→COACH, Guardian rol); matriz E2 coherente |
| **Casos de Uso (E3/E4)** | 102 CU canónicos; nombres como acción; actor correcto; include/extend/generalization válidos; correspondencia catálogo↔diagramas; 0 dependencias UML falsas |
| **Especificaciones (E5)** | 102/102 fichas completas semánticamente; pre/post condicionales; camino básico + alternativos; numeración/retorno; include/extend referenciados; coherencia con diagrama |
| **Estados (E6)** | 17 máquinas con fuente REQ; 65 transiciones reales respaldadas; transiciones permitidas/prohibidas según PT; 0 transiciones inventadas |
| **Actividades (E7)** | 102 CU evaluados: 40 DIRECT + 5 COMPOSITE + 57 SIMPLE_NOT_SELECTED; fork/join solo con paralelismo real; coherencia E5/E6 |
| **Clases (E8)** | 37 clases canónicas + 9 vistas; atributos/tipos/operaciones; multiplicidades ambos extremos; relaciones justificadas; R-07 y R-10 resueltos; coherencia entre vistas |
| **Trazabilidad (E9)** | Ledger 3.929 relaciones; 0 colgantes; 0 inventadas; REQ→CU→SPEC→SM/AD→CLASS completo; anomalías E9 resueltas o en Change Control |
| **Entrega 15/10 (Académica)** | A/B/C documentales listos; D (gestor proyecto) pendiente confirmación Linear; E (programación) con evidencia real |

---

## 10. METODOLOGÍA DE COMPROBACIÓN

1. **Evidencia documental**: Leer fuente primaria (PT, consigna, ejemplos profesor) → extraer regla → verificar en artefacto GEI
2. **Validación mecánica**: Ejecutar validadores existentes (`validate_traceability.mjs`, `build_matrices.mjs`, drawio validation)
3. **Revisión semántica**: Lectura razonada de muestras representativas (no solo conteos)
4. **Inspección visual**: Abrir exports PDF/PNG de diagramas obligatorios
5. **Cross-check**: Verificar que correcciones en un artefacto no rompen trazabilidad en otro

---

## 11. VERSIONADO DE CRITERIOS

Si durante la auditoría aparece una autoridad genuina omitida:
- Crear versión V2 de este documento
- Justificar la adición con fuente exacta
- Re-evaluar hallazgos afectados

**Este documento queda FIJADO en V1 antes de iniciar la evaluación.**