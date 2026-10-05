# GEI HOCKEY MANAGEMENT SYSTEM
## REQUIREMENTS CATALOG V1

**Estado:** FROZEN (Etapa 1 — GEI Requirements Freeze)
**Fecha:** 2026-10-04
**Rama:** `gei/e1-requirements-freeze-v1`
**Baseline:** `d6c7b55f9b220ad11b5e5e3d4c2195bfcfe050da`
**Autoridad superior:** `docs/GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md` (PT v1.0.1)
**Proceso completo:** `docs/requirements/GEI_REQUIREMENTS_RECONSTRUCTION_AUDIT_V1.md`
**Documento de autoridad para Etapa 2:** `docs/requirements/GEI_REQUIREMENTS_FREEZE_V1.md`

---

# 0. CONVENCIONES

## 0.1 Familias de identificadores

| Prefijo | Significado | Contiene |
|---|---|---|
| `REQ-<DOM>-<NNN>` | Requerimiento **IN** activo | Statement, tipo, categoría, dominio, scope, prioridad, actor, fuentes, aceptación |
| `DEF-<DOM>-<NNN>` | Requerimiento **DEFER** | Statement, fuente, motivo, condición de revisão |
| `OUT-<DOM>-<NNN>` | Elemento explícitamente **OUT de V1** | Statement, fuente, motivo |
| `REQ-DECISION-NEEDED-<NN>` | Decisión de producto no resuelta | Ver `GEI_REQUIREMENTS_OPEN_DECISIONS_V1.md` |

Los identificadores publicados en este Freeze **no se renumeran**. Un requisito retirado se marca
`STATUS: SUPERSEDED BY REQ-XXX-NNN` conservando su ID.

## 0.2 Dominios

`IAM` Identity & Access · `PPL` People & Relationships · `STR` Club Structure · `EVT` Events & Calendar ·
`PRT` Participation · `COM` Communication · `CMP` Competition · `INS` Search / Reports / Audit ·
`SYS` Cross-cutting / System quality.

Un requisito tiene **un** dominio primario y, cuando aplica, `crossReferences`.

## 0.3 Tipos y categorías

`TYPE`: `FUNCTIONAL` · `NON-FUNCTIONAL`
`CATEGORY`: `CAPABILITY` · `BUSINESS_RULE` · `AUTHORIZATION` · `PII` · `DATA_INTEGRITY` · `LIFECYCLE` ·
`HISTORY_AUDIT` · `USABILITY` · `ACCESSIBILITY` · `SECURITY` · `RESPONSIVE` · `PERFORMANCE` ·
`RELIABILITY` · `OPERATIONAL` · `PROJECT_CONSTRAINT`

## 0.4 Scope

`IN` · `DEFER` · `OUT`. **Ningún requisito es IN por defecto**: todo IN tiene fuente citada y verificable.

## 0.5 Prioridad (no indica esfuerzo)

| Nivel | Criterio |
|---|---|
| `P0` | Sin esto el producto contradice la verdad de producto, la seguridad/PII, un flujo esencial o la integridad de datos |
| `P1` | Necesario para un producto completo; su ausencia provoca retrabajo importante |
| `P2` | Mejora relevante que no bloquea el producto base |
| `P3` | Polish / nice-to-have |

## 0.6 Estado

`ACTIVE` (especificado; implementación pendiente) · `EVIDENCE_PENDING` (especificado y con aceptación
medible que sólo la implementación puede demostrar) · `EXTERNAL` (depende además de organización o
cumplimiento legal fuera del sistema).

## 0.7 Actor preliminar

Etapa 2 define actores formalmente. Aquí sólo se registra el **beneficiario o actor preliminar**:
`Player` · `Captain` · `Coach` · `Subcommittee` · `Admin` · `Guardian / delegated adult` ·
`Authenticated user` · `Club member` · `System`.

## 0.8 Clave de fuentes

Ver `GEI_REQUIREMENTS_RECONSTRUCTION_AUDIT_V1.md` §3 (SOURCE MAP). Abreviaturas usadas en las citas:
`PT §n` = Product Truth v1.0.1 · `FF §n` = FINAL_FRONTEND_FREEZE_V1 · `FFS` = FINAL_FLOW_STATUS_V1 ·
`FIR §D` = FINAL_FRONTEND_IMPLEMENTATION_REPORT_V1 decisiones D1–D7 · `S4G` = STAGE4_DISCOVERED_GAPS ·
`S4IR` = FRONTEND_IMPLEMENTATION_REPORT_V1 (Stage 4) · `IAR` = IA_SIMPLICITY_RESEARCH_V1 ·
`BLP` = FRONTEND_TARGET_BLUEPRINT_V1 · `S5CAP` / `S5FLW` / `S5PIA` / `S5MTX` / `S5RTE` (Stage 5) ·
`FUX` = FINAL_UX_STRESS_V1 · `FGMA` / `FGMAM` / `FGMAP` (Figma audit/matrix/plan, contra PT v1.0) ·
`SRC` = `src/**` · `UB` = brief de Etapa 1 provisto por el usuario (requisito de proyecto/académico).

---

# 1. SUMMARY

## 1.1 Contadores globales

| Métrica | Valor |
|---|---:|
| Fuentes inventariadas | 30 |
| Candidatos extraídos (`CAND-####`) | 366 |
| Clusters de reconciliación | 61 |
| Requerimientos canónicos **IN** | **157** |
| — de tipo `FUNCTIONAL` | 122 |
| — de tipo `NON-FUNCTIONAL` | 35 |
| Requerimientos `DEFER` | 14 |
| Elementos `OUT` de V1 | 26 |
| Contradicciones funcionales registradas | 23 |
| Contradicciones funcionales resueltas | 23 |
| Contradicciones bloqueantes abiertas | **0** |
| Decisiones de producto pendientes | 2 (0 bloqueantes) |
| Clusters `IMPLEMENTATION_WITHOUT_REQUIREMENT` | 9 |
| Clusters `REQUIREMENT_WITHOUT_CURRENT_SURFACE` | 8 |

Verificación mecánica de los 157 bloques `REQ-*` de este documento: `0` sin criterio de
aceptación, `0` sin fuente, `0` sin actor o beneficiario preliminar, `0` identificadores duplicados.

## 1.2 IN por dominio

| Dominio | IN | DEFER | OUT |
|---|---:|---:|---:|
| IAM — Identity & Access | 20 | 1 | 3 |
| PPL — People & Relationships | 16 | 0 | 2 |
| STR — Club Structure | 13 | 2 | 1 |
| EVT — Events & Calendar | 24 | 1 | 3 |
| PRT — Participation | 19 | 2 | 2 |
| COM — Communication | 18 | 4 | 3 |
| CMP — Competition | 8 | 1 | 4 |
| INS — Search / Reports / Audit | 10 | 0 | 2 |
| SYS — Cross-cutting / System quality | 29 | 3 | 6 |
| **TOTAL** | **157** | **14** | **26** |

## 1.3 IN por tipo

| Tipo | IN |
|---|---:|
| FUNCTIONAL | 122 |
| NON-FUNCTIONAL | 35 |

## 1.4 IN por prioridad

| Prioridad | IN |
|---|---:|
| P0 | 94 |
| P1 | 52 |
| P2 | 11 |
| P3 | 0 |

> **Nota sobre la distribución de prioridad.** El porcentaje de P0 es alto y es una propiedad del
> dominio, no un defecto de la escala. El criterio P0 de la Etapa 1 es "sin esto el producto
> contradice la verdad de producto, la seguridad o la PII, un flujo esencial o la integridad de
> datos", y este producto es casi enteramente autoridad, PII de menores e integridad. No se
> rebajó prioridad para decorar la distribución. No hay P3 porque ninguna fuente propone una
> mejora de acabado.

## 1.5 IN por categoría

| Categoría | IN |
|---|---:|
| CAPABILITY | 31 |
| BUSINESS_RULE | 29 |
| DATA_INTEGRITY | 21 |
| LIFECYCLE | 16 |
| AUTHORIZATION | 16 |
| SECURITY | 10 |
| USABILITY | 9 |
| HISTORY_AUDIT | 7 |
| RELIABILITY | 5 |
| PII | 4 |
| ACCESSIBILITY | 4 |
| PERFORMANCE | 2 |
| RESPONSIVE | 1 |
| OPERATIONAL | 1 |
| PROJECT_CONSTRAINT | 1 |

## 1.6 IN por estado

| Estado | IN |
|---|---:|
| ACTIVE | 150 |
| EVIDENCE_PENDING | 6 |
| EXTERNAL | 1 |

`EVIDENCE_PENDING` = la especificación está cerrada y sólo la implementación puede demostrar el
criterio (patrón PT §78). `EXTERNAL` = depende además de organización o cumplimiento legal fuera
del sistema (patrón PT §79). Ninguno de los dos estados abre una laguna de especificación.

---


# 2. REQUERIMIENTOS IN — IAM (Identity & Access)

### REQ-IAM-001 — Iniciar sesión
- **STATEMENT:** Un usuario con cuenta activa debe poder autenticarse en GEI indicando su username y su contraseña, y obtener una sesión autenticada que le permita usar el sistema.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** IAM · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Permitir que cada persona con cuentaClub entre al sistema sin pedir ayuda.
- **PRELIMINARY ACTOR:** Authenticated user (cualquiera con cuenta activa: Player, Captain, Coach, Subcommittee, Admin, Guardian)
- **SOURCE(S):** PT §48; PT §23 (`/login`); PT §36 (Auth: `login`, `session bootstrap`); PT §34 (401); FF §2 (registry `/login` = todos)
- **PRECONDITION:** `Account.status = ACTIVE` y credencial establecida (PT §51).
- **ACCEPTANCE CRITERIA:**
  - GIVEN una cuenta `ACTIVE` con credencial válida WHEN el usuario indica username y contraseña correctos THEN se crea una sesión autenticada y el usuario accede a su destino inicial.
  - GIVEN una cuenta `ACTIVE` WHEN la contraseña es incorrecta THEN el sistema no crea sesión, informa el fallo sin revelar si el username existe, y aplica limitación de intentos.
  - GIVEN una cuenta `PENDING` o `DISABLED` WHEN el usuario intenta autenticarse THEN el acceso es rechazado con explicación, sin crear sesión.
- **RELATED BUSINESS RULES:** REQ-IAM-002, REQ-IAM-006, REQ-IAM-008, REQ-IAM-019.
- **DEPENDENCIES:** REQ-IAM-002, REQ-IAM-006
- **NOTES:** PT §3 OUT excluye `OAuth/Google/Microsoft`, `MFA` y `passkeys`. No existe "olvidé mi contraseña" (ver `OUT-IAM-003`).
- **STATUS:** ACTIVE

### REQ-IAM-002 — Ciclo de vida de la cuenta
- **STATEMENT:** La cuenta debe recorrer el ciclo `PENDING → ACTIVE ↔ DISABLED`, y el sistema debe poder desactivar y reactivar una cuenta sin destruir la historia asociada a la persona.
- **TYPE:** FUNCTIONAL · **CATEGORY:** LIFECYCLE · **DOMAIN:** IAM · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Controlar el acceso al club y poder suspenderlo sin borrar información.
- **PRELIMINARY ACTOR:** Admin
- **SOURCE(S):** PT §9 (Account lifecycle); PT §3 IN (`disable/reactivate account`); PT §26 `accounts.status`; FF §14 (Cuenta)
- **ACCEPTANCE CRITERIA:**
  - GIVEN una cuenta `ACTIVE` WHEN un Admin la deshabilita THEN la cuenta queda `DISABLED` con `disabled_at` registrado y sus sesiones se revocan.
  - GIVEN una cuenta `DISABLED` WHEN un Admin la reactiva THEN la cuenta vuelve a `ACTIVE` y exige un código desetup nuevo para establecer credencial.
  - GIVEN una cuenta en cualquier estado WHEN se consulta THEN su estado y `activated_at`/`disabled_at` son visibles para el Admin y visibles para el propio titular en su perfil.
- **RELATED BUSINESS RULES:** PT §51 (`Deshabilitar → Reactivar` debe emitir código nuevo — S5FLW L47); REQ-IAM-020.
- **DEPENDENCIES:** REQ-IAM-003, REQ-IAM-004, REQ-IAM-013
- **STATUS:** ACTIVE

### REQ-IAM-003 — Activación de cuenta con código de un solo uso
- **STATEMENT:** Un Admin debe poder emitir un código de activación para una cuenta `PENDING`, y la persona debe poder completar su activación con ese código y elegir su contraseña.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** IAM · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Permitir que una persona nueva tenga su primera contraseña sin que nadie más la conozca.
- **PRELIMINARY ACTOR:** Admin (emite) · Club member (consume)
- **SOURCE(S):** PT §51; PT §3 IN (`activation/reset administrativo`); PT §23 (`/activate`); PT §26 `auth.account_setup_tokens`; FF §14; FFS F01; FIR §D
- **PRECONDITION:** `Account.status = PENDING`, credencial `SETUP_REQUIRED`.
- **ACCEPTANCE CRITERIA:**
  - GIVEN un código vigente WHEN la persona lo consume con una contraseña válida THEN la cuenta queda `ACTIVE`, la operación queda auditada y **no** se crea sesión: la persona debe luego iniciar sesión.
  - GIVEN un código ya usado, vencido o incorrecto WHEN se intenta el consumo THEN el sistema lo rechaza, explica la causa y preserva lo ya ingresado.
  - GIVEN 5 intentos fallidos sobre el mismo código WHEN se alcanza el límite THEN el código queda invalidado y debe solicitarse uno nuevo al Admin.
  - GIVEN una cuenta con un código vigente WHEN un Admin emite otro código THEN el anterior queda invalidado y sólo queda uno activo por cuenta.
- **RELATED BUSINESS RULES:** PT §51 — código de un solo uso, 24 h, máximo 5 intentos fallidos, digest HMAC con `SETUP_TOKEN_KEY`, máximo 1 activo por cuenta.
- **DEPENDENCIES:** REQ-IAM-002, REQ-IAM-015
- **NOTES:** El código nunca se compara contra un literal en el cliente ni se expone en el bundle (FGMAM §M10.b, P2-21b / código de activación literal).
- **STATUS:** ACTIVE

### REQ-IAM-004 — Restablecimiento administrativo de acceso
- **STATEMENT:** Un Admin debe poder restablecer el acceso de una cuenta existente, invalidando credencial y sesiones previas, y emitiendo un código nuevo.
- **TYPE:** FUNCTIONAL · **CATEGORY:** AUTHORIZATION · **DOMAIN:** IAM · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Resolver una pérdida de acceso sin que el club quede sin administración.
- **PRELIMINARY ACTOR:** Admin
- **SOURCE(S):** PT §51 (Admin reset); PT §18; FF §12 (Administración); FFS F18
- **PRECONDITION:** el actor es `ADMIN` con alcance `CLUB`; la cuenta objetivo existe.
- **ACCEPTANCE CRITERIA:**
  - GIVEN una cuenta con credencial establecida WHEN un Admin restablece el acceso THEN la versión de credencial se incrementa, la credencial vuelve a `SETUP_REQUIRED`, se revocan todas las sesiones y se invalida el código de setup anterior.
  - GIVEN el último Admin activo del club WHEN un Admin intenta restablecer su acceso de modo que quede `0` cuentas `ACTIVE` con rol `ADMIN` de alcance `CLUB` THEN el comando falla con `LAST_ADMIN_REQUIRED`.
- **RELATED BUSINESS RULES:** REQ-IAM-013 (protección del último Admin).
- **DEPENDENCIES:** REQ-IAM-002, REQ-IAM-003, REQ-IAM-013
- **NOTES:** No es self-service: ver `OUT-IAM-003`. La recuperación de emergencia `pnpm admin:issue-recovery` es operacional y **no** es API/UI (PT §18) — no constituye un requisito de producto.
- **STATUS:** ACTIVE

### REQ-IAM-005 — Cambio de contraseña
- **STATEMENT:** Un usuario autenticado debe poder cambiar su propia contraseña verificando la contraseña actual, y el cambio debe invalidar la credencial anterior.
- **TYPE:** FUNCTIONAL · **CATEGORY:** SECURITY · **DOMAIN:** IAM · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Permitir rotar la credencial sin intervención administrativa.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §48; PT §52 (`Change-password verifies current password directly`); PT §36; PT §5 (`editar propio contacto/password`); FF §13 (sección Seguridad); S4IR §8 P0-4
- **ACCEPTANCE CRITERIA:**
  - GIVEN un usuario autenticado WHEN confirma la contraseña actual y una nueva válida THEN la contraseña queda actualizada, la versión de credencial se incrementa y la operación queda auditada.
  - GIVEN una nueva contraseña que no cumple la política WHEN el usuario confirma THEN el sistema rechaza, explica la regla y **no** modifica nada.
  - GIVEN un cambio de contraseña exitoso WHEN el usuario tiene otras sesiones abiertas THEN la credencial anterior deja de ser válida para nuevas autenticaciones.
- **RELATED BUSINESS RULES:** REQ-IAM-015 (política de contraseña).
- **DEPENDENCIES:** REQ-IAM-015, REQ-IAM-002
- **NOTES:** Prohibido el *fake success*: el sistema nunca confirma un cambio de contraseña que no se haya aplicado (PT §47; S4IR P0-4).
- **STATUS:** ACTIVE

### REQ-IAM-006 — Sesión autenticada opaca y cookie segura
- **STATEMENT:** La sesión debe ser opaca, mantenida en el servidor, identificada por una cookie `__Host-gei_session` con `Secure`, `HttpOnly`, `SameSite=Lax`, `Path=/` y sin `Domain`, y el navegador no debe portar ningún permiso.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** SECURITY · **DOMAIN:** IAM · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que un token capturado en el navegador no sirva para actuar en el sistema.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §48; PT §49; PT §75 (Security)
- **ACCEPTANCE CRITERIA:**
  - GIVEN cualquier sesión válida WHEN el navegador inspecciona el almacenamiento accesible a JavaScript THEN no encuentra therein ningún token de sesión ni portador de permisos.
  - GIVEN una cookie de sesión WHEN se inspeccionan sus atributos THEN son `Secure`, `HttpOnly`, `SameSite=Lax`, `Path=/` y sin atributo `Domain`.
  - GIVEN el token de sesión WHEN el servidor lo persiste THEN lo persiste sólo como digest HMAC derivado de una clave externa, nunca en claro.
- **RELATED BUSINESS RULES:** REQ-IAM-007, REQ-IAM-011.
- **DEPENDENCIES:** REQ-IAM-007
- **STATUS:** ACTIVE

### REQ-IAM-007 — Protección CSRF ligada a la sesión
- **STATEMENT:** Toda petición autenticada que modifique estado debe exigir, además de la cookie de sesión, un token CSRF ligado a esa sesión, un `Origin` esperado y, cuando esté disponible, metadatos de `Fetch`.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** SECURITY · **DOMAIN:** IAM · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Impedir que un tercero haga actuar al usuario con su sesión.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §50; PT §38 (`CSRF_FAILED`)
- **ACCEPTANCE CRITERIA:**
  - GIVEN una sesión autenticada WHEN llega una petición que modifica estado sin el token CSRF vigente o con `Origin` inesperado THEN el servidor la rechaza con `CSRF_FAILED` y no ejecuta ninguna mutación.
  - GIVEN el token CSRF WHEN se genera THEN es función de la identidad de la sesión; al iniciar sesión de nuevo, el token anterior deja de ser válido.
- **RELATED BUSINESS RULES:** REQ-IAM-006.
- **DEPENDENCIES:** REQ-IAM-006
- **NOTES:** El navegador mantiene el token sólo en memoria.
- **STATUS:** ACTIVE

### REQ-IAM-008 — Ciclo de vida y extensión de la sesión
- **STATEMENT:** La sesión debe tener una vigencia inactiva de 12 h y una vigencia absoluta de 7 días; el tráfico de fondo no debe extender la inactividad y sólo la interacción humana real debe hacerlo.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** SECURITY · **DOMAIN:** IAM · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que las sesiones unattended no queden abiertas indefinidamente.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §49; PT §36 (`activity`)
- **ACCEPTANCE CRITERIA:**
  - GIVEN una sesión sin actividad humana durante 12 h WHEN el usuario intenta continuar THEN la sesión ha expirado y el sistema pide autenticarse de nuevo.
  - GIVEN una sesión con 7 días de antigüedad absoluta WHEN el usuario intenta continuar THEN la sesión ha expirado aunque haya tenido actividad.
  - GIVEN tráfico técnico de fondo (SSE, sondeo) WHEN transcurre tiempo sin interacción humana THEN el contador de inactividad no se reinicia.
- **RELATED BUSINESS RULES:** REQ-IAM-010.
- **DEPENDENCIES:** REQ-IAM-006
- **STATUS:** ACTIVE

### REQ-IAM-009 — Reautenticación para gestión sensible
- **STATEMENT:** El acceso a operaciones sensibles de gestión debe exigir una reautenticación por contraseña reciente, con una ventana de 10 minutos.
- **TYPE:** FUNCTIONAL · **CATEGORY:** SECURITY · **DOMAIN:** IAM · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que una sesión dejada abierta no habilite por sí sola operaciones destructivas o de alto impacto.
- **PRELIMINARY ACTOR:** Admin · Subcommittee
- **SOURCE(S):** PT §52; PT §38 (`REAUTHENTICATION_REQUIRED`); PT §73 (401 → Session Interruption); FGMAM §M1 fila 8 (`sin step-up §52`, P2-24)
- **ACCEPTANCE CRITERIA:**
  - GIVEN un usuario sin reautenticación reciente WHEN intenta una operación sensible THEN el sistema pide la contraseña antes de ejecutar.
  - GIVEN una reautenticación correcta WHEN han pasado menos de 10 minutos THEN las operaciones sensibles se autorizan sin volver a pedir la contraseña.
  - GIVEN una reautenticación fallida o vencida WHEN el usuario insiste THEN la operación no se ejecuta.
- **DEPENDENCIES:** REQ-IAM-001, REQ-IAM-006
- **NOTES:** Sin superficie actual en el frontend → `REQUIREMENT_WITHOUT_CURRENT_SURFACE` (ver Audit §10).
- **STATUS:** ACTIVE

### REQ-IAM-010 — Visibilidad y cierre de sesiones
- **STATEMENT:** Un usuario autenticado debe poder ver su estado de sesión actual y las demás sesiones abiertas de su cuenta, y cerrar una sesión remota de forma individual.
- **TYPE:** FUNCTIONAL · **CATEGORY:** SECURITY · **DOMAIN:** IAM · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Detectar y cortar accesos no reconocidos.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §36 (`activity`); PT §54; FIR §D5 (Seguridad real en el perfil); FF §13 (sección Seguridad: estado de cuenta, credencial, última actividad, sesión actual, otras sesiones con cierre individual); FFS F02
- **ACCEPTANCE CRITERIA:**
  - GIVEN una cuenta con 2 sesiones abiertas WHEN el usuario abre su seguridad THEN ve ambas, con la actual distinguida.
  - GIVEN una sesión remota WHEN el usuario la cierra THEN esa sesión queda invalidada en el servidor de inmediato y el cierre queda auditado.
  - GIVEN una sesión invalidada WHEN el equipo correspondiente intenta operar THEN recibe `SESSION_EXPIRED` y no ejecuta nada.
- **RELATED BUSINESS RULES:** REQ-IAM-008, REQ-IAM-011.
- **DEPENDENCIES:** REQ-IAM-008, REQ-IAM-011
- **NOTES:** Esto **no** es un "historial de actividad personal": ver `OUT-SYS-001`. La "última actividad" es estado de seguridad de la cuenta, no un timeline personal.
- **STATUS:** ACTIVE

### REQ-IAM-011 — Propagación de cambios de sesión entre pestañas
- **STATEMENT:** Un cambio de sesión (inicio de sesión, cierre de sesión, rotación o invalidación) debe propagarse al resto de las pestañas del mismo navegador sin que una pestaña conserve acceso vencido.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** RELIABILITY · **DOMAIN:** IAM · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que cerrar sesión en una pestaña cierre también el acceso de las demás.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §54 (`LOGIN`, `LOGOUT`, `SESSION_ROTATED`, `SESSION_INVALIDATED`)
- **ACCEPTANCE CRITERIA:**
  - GIVEN dos pestañas del mismo navegador WHEN en una se cierra sesión THEN en la otra el acceso queda invalidado sin que el usuario deba recargar manualmente.
  - GIVEN la propagación entre pestañas WHEN ocurre THEN no se transfiere ningún secreto por el canal de propagación.
- **DEPENDENCIES:** REQ-IAM-006, REQ-IAM-010
- **STATUS:** ACTIVE

### REQ-IAM-012 — Control de acceso a la aplicación
- **STATEMENT:** El sistema debe determinar si una cuenta tiene acceso a la aplicación; si no lo tiene, debe dirigirla a unadestination que explica la situación en lugar de mostrar un producto vacío.
- **TYPE:** FUNCTIONAL · **CATEGORY:** AUTHORIZATION · **DOMAIN:** IAM · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que una cuenta sin permisos no entre a un producto inerte ni reciba datos.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §53 (`hasApplicationAccess`; `False -> /no-access`); PT §23 (`/no-access`); PT §36 (`/me`); FF §2 (`/no-access` = todos)
- **ACCEPTANCE CRITERIA:**
  - GIVEN una cuenta `ACTIVE` con un `RoleAssignment` interno vigente WHEN el usuario entra THEN tiene acceso a la aplicación.
  - GIVEN una cuenta `ACTIVE` sin `RoleAssignment` interno pero con una delegación de guardián vigente que tiene permiso de uso WHEN el usuario entra THEN tiene acceso a la aplicación.
  - GIVEN una cuenta sin ninguna de esas condiciones WHEN el usuario entra THEN es-dirigido a `/no-access` y no ve ningunadestination ni dato del producto.
- **RELATED BUSINESS RULES:** REQ-IAM-016.
- **DEPENDENCIES:** REQ-IAM-016
- **NOTES:** La autorización efectiva se deriva de los hechos vigentes; no se almacena como token de permiso (PT §53).
- **STATUS:** ACTIVE

### REQ-IAM-013 — Protección del último administrador
- **STATEMENT:** Ninguna operación puede dejar al club sin ninguna cuenta activa con rol `ADMIN` de alcance `CLUB`.
- **TYPE:** FUNCTIONAL · **CATEGORY:** AUTHORIZATION · **DOMAIN:** IAM · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Impedir que el club quede sin nadie que pueda administrar cuentas, estructura y accesos.
- **PRELIMINARY ACTOR:** Admin
- **SOURCE(S):** PT §18; PT §38 (`LAST_ADMIN_REQUIRED`); FF §14 (`No se puede dejar sin acceso a la única administración activa del club`); S5PIA (F11: "Restablecer acceso" sin guard — hueco de seguridad); FFS F18/F29
- **ACCEPTANCE CRITERIA:**
  - GIVEN el club con una sola cuenta `ACTIVE` `ADMIN/CLUB` WHEN un Admin intenta deshabilitarla, finalizar su rol `ADMIN` o finalizar su `Membership` THEN la operación falla con `LAST_ADMIN_REQUIRED` y nada cambia.
  - GIVEN el club con más de una administración activa WHEN un Admin deshabilita una THEN la operación prospera y el club conserva acceso administrativo.
- **RELATED BUSINESS RULES:** REQ-IAM-004, REQ-IAM-002.
- **DEPENDENCIES:** REQ-IAM-002, REQ-IAM-004
- **NOTES:** El guard debe cubrir **todo** comando que pueda producir cero admins efectivos, no sólo deshabilitar cuenta y finalizar rol.
- **STATUS:** ACTIVE

### REQ-IAM-014 — Username inmutable, único e independiente del equipo
- **STATEMENT:** El username debe ser único (sin distinción de mayúsculas), estable en el tiempo e independiente de la estructura deportiva; una vez asignado no se modifica.
- **TYPE:** FUNCTIONAL · **CATEGORY:** DATA_INTEGRITY · **DOMAIN:** IAM · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que la identidad de acceso no dependa de la afiliación deportiva ni cambie con ella.
- **PRELIMINARY ACTOR:** Admin
- **SOURCE(S):** PT §2 (`Username único, estable e independiente del Team`); PT §26 `accounts.username case-insensitive unique`; PT §3 IN (`Username`)
- **ACCEPTANCE CRITERIA:**
  - GIVEN dos cuentas con usernames que sólo difieren en mayúsculas WHEN se intenta persistir la segunda THEN la operación es rechazada.
  - GIVEN una cuenta con username asignado WHEN su persona cambia de equipo, de división o de temporada THEN el username no cambia.
  - GIVEN una cuenta con username asignado WHEN se intenta modificarlo THEN el sistema no ofrece la operación.
- **DEPENDENCIES:** REQ-PPL-002
- **STATUS:** ACTIVE

### REQ-IAM-015 — Política de contraseñas
- **STATEMENT:** Una contraseña válida debe tener entre 12 y 128 caracteres, admitir Unicode y espacios, no exigir reglas arbitrarias de complejidad y no estar sujeta a expiración forzada periódica; debe almacenarse con Argon2id.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** SECURITY · **DOMAIN:** IAM · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Permitir contraseñas fuertes yTlanas de usar sin reglas arbitrarias.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §48; PT §75 (Security); S4IR §8 P0-4
- **ACCEPTANCE CRITERIA:**
  - GIVEN una contraseña de 11 caracteres WHEN se intenta establecer THEN es rechazada con explicación del mínimo.
  - GIVEN una contraseña de 129 caracteres WHEN se intenta establecer THEN es rechazada con explicación del máximo.
  - GIVEN una contraseña de 100 caracteres con espacios y acentos WHEN se establece THEN es aceptada y nunca se guarda en claro.
  - GIVEN una contraseña establecida hace más de un año WHEN el usuario la usa para entrar THEN sigue siendo válida.
- **DEPENDENCIES:** REQ-IAM-003, REQ-IAM-005
- **STATUS:** ACTIVE

### REQ-IAM-016 — Fórmula de autorización y denegación por defecto
- **STATEMENT:** Toda acción debe autorizarse evaluando rol, acción, alcance, estado del objeto, autoridad por campo y origen; toda combinación no autorizada se deniega por defecto.
- **TYPE:** FUNCTIONAL · **CATEGORY:** AUTHORIZATION · **DOMAIN:** IAM (cross: SYS) · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que ninguna acción sea posible por omisión.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §5 (fórmula y `Default: DENY`); PT §75 (Authority); FF §15; PT §40 (`Object actions derive from allowedActions`)
- **ACCEPTANCE CRITERIA:**
  - GIVEN una acción sin regla que la conceda WHEN alguien la intenta THEN es denegada.
  - GIVEN un rol sin el alcance exigido por la acción WHEN alguien la intenta THEN es denegada aunque el rol esté asignado.
  - GIVEN un objeto en un estado que impide la acción WHEN alguien la intenta sobre él THEN es denegada.
- **RELATED BUSINESS RULES:** Tabla de authority `PT §5`; REQ-IAM-017, REQ-IAM-018.
- **DEPENDENCIES:** REQ-IAM-017, REQ-PPL-006
- **NOTES:** Las combinaciones de rol y alcance fuera de `PT §5` producen `422 INVALID_ROLE_SCOPE`.
- **STATUS:** ACTIVE

### REQ-IAM-017 — Fuente única de autoridad de navegación y de acciones
- **STATEMENT:** El sistema debe exponer una fuente única de la navegación disponible y de las acciones permitidas sobre cada objeto; el cliente no debe reconstruirlas.
- **TYPE:** FUNCTIONAL · **CATEGORY:** AUTHORIZATION · **DOMAIN:** IAM · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que la interfaz no ofrezca ni calle acciones por su cuenta y que dos superficies no discrepen.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §40 (`Global nav derives from /me.navigation`; `Object actions derive from allowedActions`; `Never recreate server authorization with if role===...`); PT §75; FF §2; FF §15
- **PRECONDITION:** PT §20 — si el acceso de una persona existe sólo como guardián, la aplicación muestra sólo los destinos que esa persona puede usar.
- **ACCEPTANCE CRITERIA:**
  - GIVEN una cuenta con acceso limitado WHEN se determina su navegación THEN los destinos no utilizables no aparecen.
  - GIVEN un objeto sobre el que el actor no tiene ninguna acción WHEN se lo consulta THEN la superficie no ofrece acciones sobre él.
  - GIVEN un actor autorizado pero bloqueado por el estado del objeto WHEN se lo consulta THEN la acción aparece deshabilitada y con la razón visible.
- **RELATED BUSINESS RULES:** REQ-SYS-011 (`unauthorized oculto` / `authorized-but-blocked disabled + reason`).
- **DEPENDENCIES:** REQ-IAM-016, REQ-SYS-011
- **NOTES:** Resuelve la contradicción `CON-02`: los destinos no autorizados se ocultan; dentro del conjunto permitido, una sección vacía se muestra con explicación en lugar de desaparecer.
- **STATUS:** ACTIVE

### REQ-IAM-018 — La autorización no se reimplementa en el cliente
- **STATEMENT:** Ninguna decisión de permiso debe tomarse exclusivamente en el cliente; el cliente puede ocultar o deshabilitar, pero la autoridad se resuelve en un único lugar.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** AUTHORIZATION · **DOMAIN:** IAM (cross: SYS) · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Evitar que el control de acceso se desincronice entre superficies.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §5 (`Frontend puede ocultar/deshabilitar acciones, pero no autoriza`); PT §40; PT §75; FF §15 (prohíbe y ausentes: `person.role`, `person.team`, `person.eligibility` como fuente de UI; `capabilities.sport` como gate; `role === "ADMIN"` reimplementado por pantalla); S5CAP (B-41/B-42/B-43/B-44); S5FLW (B-40); FFS F29
- **ACCEPTANCE CRITERIA:**
  - GIVEN una acción que el servidor deniega WHEN el cliente la ofrece o la ejecuta de todos modos THEN el servidor la rechaza y el cliente no informa éxito.
  - GIVEN una superficie con su propio gate WHEN se inspecciona el sistema THEN el permiso se resuelve en un único lugar y no en dos capas paralelas.
- **RELATED BUSINESS RULES:** PT §47 (`No optimistic confirmed success`).
- **DEPENDENCIES:** REQ-IAM-016, REQ-SYS-014
- **STATUS:** ACTIVE

### REQ-IAM-019 — Limitación de intentos y de frecuencia
- **STATEMENT:** El sistema debe limitar de forma persistente los intentos de autenticación y de establecimiento de credencial, y aplicar límites operativos de frecuencia a las operaciones de lectura y de envío.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** SECURITY · **DOMAIN:** IAM · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Frenar ataques de fuerza bruta y abuso sin confiar en una instancia única.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §70 (limitación de credenciales persistente en base; login 30/10 min/IP; setup 20/10 min/IP; API 300/min/cuenta; envío de mensaje 60/min/cuenta; SSE 5/cuenta)
- **ACCEPTANCE CRITERIA:**
  - GIVEN intentos de autenticación repetidos desde una misma dirección WHEN se supera el límite THEN las solicitudes adicionales son rechazadas indicando cuándo reintentar y el contador sobrevive a un reinicio del proceso.
  - GIVEN una operación que excede su límite de frecuencia WHEN se reintenta THEN el sistema responde conRetry-After.
- **RELATED BUSINESS RULES:** REQ-IAM-003 (5 intentos por código).
- **NOTES:** PT §70 — los límites nunca reemplazan la autorización.
- **DEPENDENCIES:** REQ-IAM-001, REQ-IAM-003
- **STATUS:** ACTIVE

### REQ-IAM-020 — Interrupción de sesión
- **STATEMENT:** Cuando una sesión deja de ser válida durante el uso, el sistema debe interrumpir la operación, preservar lo que el usuario iba a hacer y exigir autenticarse de nuevo sin perder su trabajo.
- **TYPE:** FUNCTIONAL · **CATEGORY:** RELIABILITY · **DOMAIN:** IAM (cross: SYS) · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que un corte de sesión no cause pérdida de datos ni un falso éxito.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §34 (`401`); PT §73 (`401 | Session Interruption`; `ambiguous network mutation | preserve intention; same-key retry`); PT §75 (Security: invalidación inmediata del lado servidor); FGMAM §M1 fila 3 (`session-interrupted` no produce UX de §73 — P2-25)
- **ACCEPTANCE CRITERIA:**
  - GIVEN una operación en curso WHEN la sesión expiró o fue revocada THEN el sistema informa la interrupción, no ejecuta la operación y conserva lo ingressado.
  - GIVEN una orden ambigua por corte de red WHEN el usuario reintenta THEN se reintenta con la misma clave de idempotencia y la misma carga, sin duplicar el efecto.
- **RELATED BUSINESS RULES:** REQ-SYS-016 (idempotencia), REQ-SYS-014 (sin éxito falso).
- **DEPENDENCIES:** REQ-IAM-006, REQ-IAM-011, REQ-SYS-016
- **STATUS:** ACTIVE

---

# 3. REQUERIMIENTOS IN — PPL (People & Relationships)

### REQ-PPL-001 — Persona base
- **STATEMENT:** El sistema debe registrar personas con nombre y apellido obligatorios, y con DNI, fecha de nacimiento, teléfono y email opcionales; el DNI, cuando exista, debe ser único.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** PPL · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Identificar a las personas del club sin exigir de más en el alta.
- **PRELIMINARY ACTOR:** Admin
- **SOURCE(S):** PT §17 (Person base; `DNI partial unique cuando no es NULL`); PT §26 `persons`; PT §3 IN (`Person`)
- **ACCEPTANCE CRITERIA:**
  - GIVEN una persona nueva WHEN se crea sin DNI THEN la persona queda registrada y el DNI queda nulo.
  - GIVEN dos personas con el mismo DNI WHEN se intenta registrar la segunda THEN la operación es rechazada.
  - GIVEN una persona sin nombre o sin apellido WHEN se intenta crear THEN la operación es rechazada indicando el campo faltante.
- **DEPENDENCIES:** REQ-PPL-003
- **STATUS:** ACTIVE

### REQ-PPL-002 — Completitud del perfil de jugadora
- **STATEMENT:** Para ingresar al roster, una jugadora debe tener nombre, apellido, DNI, fecha de nacimiento, teléfono y email; si falta algo, el sistema debe identificarlo.
- **TYPE:** FUNCTIONAL · **CATEGORY:** BUSINESS_RULE · **DOMAIN:** PPL · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que el club no NTTenga jugadoras sin datos de contacto o identificación necessários para operar.
- **PRELIMINARY ACTOR:** Admin
- **SOURCE(S):** PT §17 (`422 PLAYER_PROFILE_INCOMPLETE`; Player roster completeness); PT §2; PT §38
- **ACCEPTANCE CRITERIA:**
  - GIVEN una persona a la que le falta cualquiera de los seis datos WHEN se intenta asignarla a un equipo THEN la operación es rechazada con `PLAYER_PROFILE_INCOMPLETE` e indica qué falta.
  - GIVEN una jugadora con los seis datos WHEN se asigna a un equipo THEN la asignación prospera.
- **RELATED BUSINESS RULES:** REQ-PPL-005, REQ-PPL-013.
- **DEPENDENCIES:** REQ-PPL-001, REQ-PPL-005
- **NOTES:** Ver `REQ-PPL-014` para el camino de recuperación. Un `Person` base puede tener datos opcionales; la obligatoriedad es del roster, no de la persona.
- **STATUS:** ACTIVE

### REQ-PPL-003 — Vinculación persona–cuenta
- **STATEMENT:** Una cuenta de acceso debe corresponder a una sola persona, y una persona debe tener como máximo una cuenta.
- **TYPE:** FUNCTIONAL · **CATEGORY:** DATA_INTEGRITY · **DOMAIN:** PPL (cross: IAM) · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que la identidad de acceso y la identidad civil no se separen.
- **PRELIMINARY ACTOR:** Admin
- **SOURCE(S):** PT §26 (`accounts.person_id unique`); PT §3 IN (`Account`)
- **ACCEPTANCE CRITERIA:**
  - GIVEN una persona que ya tiene cuenta WHEN se intenta crear una segunda cuenta para ella THEN la operación es rechazada.
  - GIVEN una cuenta WHEN se consulta THEN resuelve exactamente a una persona.
- **DEPENDENCIES:** REQ-PPL-001, REQ-IAM-002
- **STATUS:** ACTIVE

### REQ-PPL-004 — Membresía al club
- **STATEMENT:** El club debe registrar el período de pertenencia interna de cada persona, y debe poder iniciarse y finalizarse con motivo, sin destruir la historia.
- **TYPE:** FUNCTIONAL · **CATEGORY:** LIFECYCLE · **DOMAIN:** PPL · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Distinguir "es del club" de "está en este equipo", que son cosas distintas.
- **PRELIMINARY ACTOR:** Admin
- **SOURCE(S):** PT §17 (Membership; período de pertenencia interna); PT §9 (`[valid_from, valid_until)`); PT §25 `memberships`; PT §38 (`MEMBERSHIP_HAS_ACTIVE_DEPENDENCIES`); FIR §D2; FFS F18; S5CAP PG-02
- **PRECONDITION:** las afiliaciones y roles internos deben ocurrir dentro de una Membresía vigente (PT §17).
- **ACCEPTANCE CRITERIA:**
  - GIVEN una persona con una Membresía vigente WHEN se le asigna un rol o una afiliación interna THEN la operación prospera.
  - GIVEN una persona sin Membresía vigente WHEN se intenta asignarle una afiliación o un rol interno THEN la operación es rechazada.
  - GIVEN una Membresía con afiliaciones o roles internos activos WHEN se intenta finalizarla THEN la operación es rechazada indicando la dependencia activa.
  - GIVEN una Membresía finalizada WHEN se consulta THEN su período queda conservado y visible.
- **RELATED BUSINESS RULES:** REQ-PPL-005 (afiliación deportiva ≠ membresía), REQ-PPL-006.
- **DEPENDENCIES:** REQ-PPL-001, REQ-PPL-005
- **NOTES:** **Membresía ≠ Afiliación a equipo.** Un guardián puede tener relación de representación sin membresía deportiva (PT §17, §20).
- **STATUS:** ACTIVE

### REQ-PPL-005 — Afiliación deportiva a equipo
- **STATEMENT:** La afiliación deportiva de una jugadora a un equipo debe registrarse como período propio, distinto de la membresía al club y de los roles.
- **TYPE:** FUNCTIONAL · **CATEGORY:** BUSINESS_RULE · **DOMAIN:** PPL · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Poder responder "¿a qué equipo/azzona juega?" sin inferirlo de un rol.
- **PRELIMINARY ACTOR:** Admin
- **SOURCE(S):** PT §17 (`TeamAssignment. Afiliación deportiva de una PLAYER. Coach usa RoleAssignment`); PT §25 `team_assignments`; PT §26; FIR §D2
- **ACCEPTANCE CRITERIA:**
  - GIVEN una jugadora WHEN se registra su afiliación THEN queda como afiliación con su período, no como rol.
  - GIVEN un entrenador WHEN se le asigna un equipo THEN la asignación queda como rol, no como afiliación deportiva de jugadora.
- **RELATED BUSINESS RULES:** REQ-PPL-004, REQ-PPL-006.
- **DEPENDENCIES:** REQ-PPL-004, REQ-PPL-007
- **STATUS:** ACTIVE

### REQ-PPL-006 — Asignación de roles
- **STATEMENT:** Los roles del sistema son `PLAYER`, `CAPTAIN`, `COACH`, `SUBCOMMITTEE` y `ADMIN`, cada uno con un alcance válido; una persona puede tener varios roles vigentes a la vez.
- **TYPE:** FUNCTIONAL · **CATEGORY:** AUTHORIZATION · **DOMAIN:** PPL (cross: IAM) · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que la autoridad de una persona sea la unión de sus asignaciones vigentes y no un único campo.
- **PRELIMINARY ACTOR:** Admin
- **SOURCE(S):** PT §1.2 (Actores originales); PT §5 (Roles y authority; tabla de role scopes; `Multi-role = unión de assignments vigentes`); PT §25 `role_assignments`; PT §26 (`scope_type` + target exacto + validez); PT §38 (`INVALID_ROLE_SCOPE`); FF §15
- **ACCEPTANCE CRITERIA:**
  - GIVEN un rol asignado con un alcance no válido para ese rol WHEN se intenta persistir THEN la operación es rechazada con `INVALID_ROLE_SCOPE`.
  - GIVEN una persona con dos roles vigentes en alcances distintos WHEN se determina su autoridad THEN es la unión de ambos.
  - GIVEN una asignación de rol expirada WHEN se determina la autoridad THEN no computa.
- **RELATED BUSINESS RULES:** Alcances válidos: `PLAYER`→TEAM; `CAPTAIN`→TEAM; `COACH`→TEAM/EVENT; `SUBCOMMITTEE`→CLUB; `ADMIN`→CLUB. **El guardián no es un rol.**
- **DEPENDENCIES:** REQ-IAM-016, REQ-PPL-004
- **NOTES:** `ADMIN` no es superusuario deportivo; `SUBCOMMITTEE` no equivale a `COACH`; `CAPTAIN` no hereda poder de `COACH` (PT §5).
- **STATUS:** ACTIVE

### REQ-PPL-007 — Transiciones de afiliación y de rol de una jugadora
- **STATEMENT:** Incorporar una jugadora a un equipo debe crear su afiliación y su rol `PLAYER` de forma atómica; cambiarla de equipo debe cerrar afiliación y roles anteriores y crear los nuevos en una sola operación, sin transferir el rol `CAPTAIN`.
- **TYPE:** FUNCTIONAL · **CATEGORY:** BUSINESS_RULE · **DOMAIN:** PPL · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que una jugadora nunca quede con afiliación sin rol ni con rol sin afiliación, y que un cambio de equipo no conceda poder por accidente.
- **PRELIMINARY ACTOR:** Admin
- **SOURCE(S):** PT §17 (`AssignPlayerToTeam`, `MovePlayerTeam`, `EndPlayerTeam`; `CAPTAIN no se transfiere automáticamente`); PT §75 (Commands: `one user business intention -> one Public Command`); PT §32; FGMAM §M2 flujo H; FFS F18
- **ACCEPTANCE CRITERIA:**
  - GIVEN una jugadora sin afiliación WHEN se la incorpora a un equipo THEN quedan creados su afiliación y su rol `PLAYER` de forma indivisible; si algo falla, no queda ninguno.
  - GIVEN una jugadora con rol `CAPTAIN` en el equipo A WHEN se la cambia al equipo B THEN su rol `CAPTAIN` en A queda cerrado y no se crea `CAPTAIN` en B, y el sistema explica que la capitanía no se transfiere.
  - GIVEN una jugadora WHEN se la quita del equipo THEN quedan cerrados su afiliación y sus roles `PLAYER` y `CAPTAIN` de ese equipo.
- **RELATED BUSINESS RULES:** REQ-PPL-004, REQ-PPL-005, REQ-PPL-002.
- **DEPENDENCIES:** REQ-PPL-002, REQ-PPL-004, REQ-PPL-005, REQ-PPL-006
- **STATUS:** ACTIVE

### REQ-PPL-008 — Relación de representación con menores
- **STATEMENT:** El sistema debe registrar la relación entre una persona adulta y un menor como delegación, con dos permisos independientes —ver su información y responder su disponibilidad— y debe permitir crearla y finalizarla.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** PPL (cross: IAM, PRT) · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que un adulto responsable pueda cumplir la gestión del menor sin convertirse en un rol deportivo.
- **PRELIMINARY ACTOR:** Admin (gestiona) · Guardian / delegated adult (usa)
- **SOURCE(S):** PT §1.2 (`Guardian / responsable, como relación/delegación`); PT §3 IN (`GuardianRelationship`); PT §20 (`Guardian experience`, `Each GuardianRelationship independently controls can_view_child_info and can_respond_availability`); PT §26 `guardian_relationships`; PT §36 (People/access: `guardian`); FIR §D3; FF §12 (Guardián); FFS F03/F18; S5CAP PG-03
- **PRECONDITION:** la relación es **individual por menor**; puede haber más de un menor a cargo; una cuenta sin membresía deportiva es posible (PT §20).
- **ACCEPTANCE CRITERIA:**
  - GIVEN una relación con permiso de ver información y sin permiso de responder WHEN el guardián consulta THEN ve el contexto del menor y no puede responder por él, y el motivo es visible.
  - GIVEN una relación con permiso de responder WHEN el guardián responde disponibilidad del menor THEN la respuesta queda registrada a nombre del menor.
  - GIVEN una relación WHEN un Admin la finaliza THEN deja de conceder acceso y el período queda conservado.
  - GIVEN un menor con dos adultos a cargo WHEN cada uno usa el sistema THEN cada uno ve únicamente a su propio menor, salvo que se añada otra relación.
- **RELATED BUSINESS RULES:** REQ-PPL-009 (PII del guardián), REQ-IAM-012.
- **DEPENDENCIES:** REQ-IAM-012, REQ-PRT-002, REQ-PPL-009
- **NOTES:** **El guardián no es un rol y no es un módulo.** No existe destino `/guardian`. La relación es la única vía de acceso. La gestión de la relación la hace el Admin; el guardián consulta "Personas a cargo" en su perfil (PT §20; FFS F03).
- **STATUS:** ACTIVE

### REQ-PPL-009 — PII mínima del guardián sobre el menor
- **STATEMENT:** Un guardián ve, por cada menor associated y sólo lo necesario para cumplir la delegación, nombre y apellido, equipo, eventos relevantes y disponibilidad relevante; no ve documento, fecha de nacimiento completa, información administrativa, motivo ni origen de habilitación, conversaciones privadas ni auditoría.
- **TYPE:** FUNCTIONAL · **CATEGORY:** PII · **DOMAIN:** PPL (cross: SYS) · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que la delegación sirva para operar sin abrir PII sensible del menor.
- **PRELIMINARY ACTOR:** Guardian / delegated adult
- **SOURCE(S):** PT §6 (`Guardian PII (v1.0.1 clarification)`); PT §20; PT §82 (cambio 2); FF §12 (Guardián); FIR §D3; IAR §2 P10; FGMAP §15.2 (D-3)
- **ACCEPTANCE CRITERIA:**
  - GIVEN una relación de representación WHEN el guardián consulta la ficha del menor THEN ve nombre, equipo, eventos y disponibilidad, y no ve documento ni fecha de nacimiento.
  - GIVEN una relación de representación WHEN el guardián intenta ver el motivo u origen de la habilitación del menor THEN el acceso es denegado.
  - GIVEN una relación de representación WHEN el guardián consulta sus propios datos de contacto THEN puede verlos y modificarlos; cuando intenta ver los del menor, el sistema no los otorga automáticamente.
- **RELATED BUSINESS RULES:** PT §6 v1.0.1 — el teléfono/email del menor **no** se concede automáticamente por la relación; compartirlo requeriría una autoridad explícita aparte, que no es parte de V1.
- **DEPENDENCIES:** REQ-PPL-008, REQ-SYS-005
- **NOTES:** Resuelve `CON-08`. El guardián puede modificar sus **propios** datos de contacto (PT §5 `editar propio contacto/password`).
- **STATUS:** ACTIVE

### REQ-PPL-010 — Visibilidad de la relación de representación sobre la propia cuenta
- **STATEMENT:** Un menor con relaciones de representación activas debe poder ver, en modo de sólo lectura, qué adultos pueden actuar por su cuenta y con qué permisos.
- **TYPE:** FUNCTIONAL · **CATEGORY:** PII · **DOMAIN:** PPL · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que el menor conozca quién actúa en su nombre.
- **PRELIMINARY ACTOR:** Player (menor)
- **SOURCE(S):** FF §13 (`Acceso de terceros sobre mí (si es menor con relaciones activas, sólo lectura)`); FFS F02
- **ACCEPTANCE CRITERIA:**
  - GIVEN un menor con al menos una relación activa WHEN abre su perfil THEN ve la sección de acceso de terceros en modo de sólo lectura.
  - GIVEN esa sección WHEN el menor intenta editarla THEN no hay operación de edición.
- **DEPENDENCIES:** REQ-PPL-008
- **NOTES:** Cubre el hueco `PG-03` de S5CAP (faltaba la vista del menor sobre sus delegaciones). No expone PII del guardián más allá de lo necesario.
- **STATUS:** ACTIVE

### REQ-PPL-011 — Autoridad por campo de datos personales
- **STATEMENT:** La visibilidad de cada dato personal debe resolverse por campo: nombre y apellido en scopes operativos autorizados; username para la persona y Admin; DNI y fecha de nacimiento completa sólo para Admin; teléfono y email para la persona, Admin y entrenador o capitana del equipo actual cuando exista necesidad operativa; relación de representación para el propio guardián y Admin, con información operativa mínima para el entrenador; estado de habilitación para entrenador con alcance, Subcomisión y Admin; motivo y origen de habilitación para Subcomisión y Admin.
- **TYPE:** FUNCTIONAL · **CATEGORY:** PII · **DOMAIN:** PPL (cross: SYS) · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que ningún dato sensible se exponga por pertenencia a un grupo.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §6 (tabla de PII Field Authority y reglas `Nunca`); PT §82 (sin cambios); FF §13 (`El perfil nunca muestra documento ni fecha de nacimiento, en ningún rol`)
- **ACCEPTANCE CRITERIA:**
  - GIVEN una capitana de un equipo WHEN consulta a una jugadora de ese equipo THEN ve su teléfono y email pero no su DNI.
  - GIVEN un entrenador WHEN consulta a una jugadora de su equipo actual THEN ve su teléfono y email por necesidad operativa, y no ve su DNI ni su fecha de nacimiento.
  - GIVEN un Admin WHEN consulta una ficha THEN ve DNI y fecha de nacimiento.
  - GIVEN cualquier rol WHEN no tiene autoridad sobre un campo THEN ese campo no existe en la respuesta que recibe, no se oculta únicamente en pantalla.
- **RELATED BUSINESS RULES:** REQ-IAM-016, REQ-SYS-004.
- **DEPENDENCIES:** REQ-IAM-016, REQ-IAM-018
- **NOTES:** El filtrado es de campo en la respuesta, no un `display:none`. La regla `Nunca` de PT §6 es explícita: el Admin no lee chats privados por ser Admin; la capitana no ve DNI por pertenecer al equipo; el guardián no ve información de otros menores.
- **STATUS:** ACTIVE

### REQ-PPL-012 — Independencia entre relación de representación y rol deportivo
- **STATEMENT:** La relación de representación no debe otorgar por sí sola ningún rol deportivo, ningún accesorio automático de comunicación y ninguna autoridad de gestión.
- **TYPE:** FUNCTIONAL · **CATEGORY:** AUTHORIZATION · **DOMAIN:** PPL (cross: COM) · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que "tutor" no se convierta de hecho en un séptimo rol.
- **PRELIMINARY ACTOR:** Guardian / delegated adult
- **SOURCE(S):** PT §3 BOUNDARY (`Guardians: relación y delegación; no rol deportivo automático`); PT §5 (`Guardian no es Role`); PT §20 (`Guardian no entra`); PT §82 (cambio 2); FIR §D3; FGMAM §15.2 (`UNJUSTIFIED_ROLES = 0`)
- **ACCEPTANCE CRITERIA:**
  - GIVEN una persona cuya única relación es de representación WHEN se determina su autoridad THEN no tiene roles deportivos ni acceso de gestión.
  - GIVEN esa persona WHEN se determina su acceso a comunicação THEN no obtiene el accesorio automático de conversación.
- **DEPENDENCIES:** REQ-PPL-008, REQ-COM-009
- **STATUS:** ACTIVE

### REQ-PPL-013 — Aviso de perfil incompleto y camino de recuperación
- **STATEMENT:** Cuando a una jugadora le falten datos que el club administra, el sistema debe mostrarle cuáles son y el siguiente paso, y debe permitir que la administración los corrija.
- **TYPE:** FUNCTIONAL · **CATEGORY:** BUSINESS_RULE · **DOMAIN:** PPL · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que la jugadera no quede bloqueada sin salida y sin saber qué hacer.
- **PRELIMINARY ACTOR:** Player · Admin
- **SOURCE(S):** PT §17 (`422 PLAYER_PROFILE_INCOMPLETE`); PT §6 (DNI = ADMIN); FIR §D6; FF §12 (Jugadora: `Si le faltan datos administrados por el club, ve un banner que dice cuáles y no puede editarlos`); FF §13 (`Perfil incompleto (banner con qué falta y el siguiente paso)`); FFS F18
- **ACCEPTANCE CRITERIA:**
  - GIVEN una jugadora con perfil incompleto WHEN abre su perfil THEN ve un aviso que enumera qué datos faltan y cuál es el siguiente paso.
  - GIVEN esa jugadora WHEN intenta editar los datos que administra el club THEN no hay operación de edición; el siguiente paso es avisar a la administración.
  - GIVEN un Admin WHEN abre la ficha de esa persona THEN dispone de la operación de corregir su identidad.
- **RELATED BUSINESS RULES:** REQ-PPL-002, REQ-PPL-011.
- **DEPENDENCIES:** REQ-PPL-002, REQ-PPL-011
- **NOTES:** Resuelve `CON-06` (¿puede una jugadora cargar su propio DNI?). **No**: la jugadora no carga su DNI; lo corrige la administración. La auto-carga permanece sin fuente y no se convierte en requisito.
- **STATUS:** ACTIVE

### REQ-PPL-014 — Identidad estable e inmutable del equipo
- **STATEMENT:** El nombre de un equipo se deriva de temporada, división y línea; esa identidad no puede cambiar por una edición de nombre de sus componentes.
- **TYPE:** FUNCTIONAL · **CATEGORY:** DATA_INTEGRITY · **DOMAIN:** PPL (cross: STR) · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que el mismo equipo no cambie de nombre bajo los pies de la historia ya registrada.
- **PRELIMINARY ACTOR:** Admin
- **SOURCE(S):** PT §4 (`Team = Season + Division + Line`); PT §26 (`teams` unique `season_id + division_id + line_id`; `Identity immutable`); PT §75 (`Team = Season + Division + Line`); FGMAM §M11 (P0-1); S4IR §8 (P0-1 CLOSED); FFS F19
- **ACCEPTANCE CRITERIA:**
  - GIVEN un equipo con eventos y afiliaciones WHEN un Admin renombra la división o la línea que lo componen THEN la operación es rechazada indicando que la identidad del equipo no cambia.
  - GIVEN un equipo WHEN se consulta THEN su nombre se deriva de temporada, división y línea, no de un texto libre.
- **DEPENDENCIES:** REQ-STR-004
- **STATUS:** ACTIVE

### REQ-PPL-015 — Archivo de estructura sin destruir historia
- **STATEMENT:** Al archivar estructura deportiva debe conservarse la historia: las personas no se eliminan, sus relaciones se finalizan y la información pasada permanece consultable.
- **TYPE:** FUNCTIONAL · **CATEGORY:** LIFECYCLE · **DOMAIN:** PPL (cross: STR) · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que "eliminar jugadora" no sea una operación que borre el pasado del club.
- **PRELIMINARY ACTOR:** Admin
- **SOURCE(S):** PT §2 (`Eliminar jugadora → Finalizar relaciones y preservar historia`; `Eliminar categoría → Archivar estructura; no destruir historia`); PT §28 (Retention: dominio sin auto-delete); PT §75 (`meaningful history is not hard-deleted`)
- **ACCEPTANCE CRITERIA:**
  - GIVEN una persona con afiliaciones y roles WHEN un Admin la retira del club THEN sus relaciones quedan finalizadas con fecha y su historia previa sigue consultable.
  - GIVEN una operación de baja WHEN se intenta THEN no existe una operación que elimine definitivamente la historia.
- **DEPENDENCIES:** REQ-PPL-004, REQ-PPL-007
- **NOTES:** Ver PT §2 — la privacidad se gestiona por proceso específico, no por borrado. Ver `REQ-SYS-014` (retención) y el gate externo `REQ-SYS-027`.
- **STATUS:** ACTIVE

### REQ-PPL-016 — Perfil propio
- **STATEMENT:** Un usuario autenticado debe poder consultar y editar su propia información: identidad, pertenencia con su período, roles con su alcance resuelto, contacto y seguridad; y debe poder cambiar el contexto de menor que está consultando.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** PPL · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que cada persona comprenda qué puede hacer, con qué cuenta entra y a quién mira.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §23 (`/more/profile`); PT §20 (`Relationship management/consultation lives inside More → Mi perfil, in a "Personas a cargo" section`); PT §5 (`editar propio contacto/password`); FF §13; FFS F02
- **ACCEPTANCE CRITERIA:**
  - GIVEN un usuario autenticado WHEN abre su perfil THEN ve su identidad, su pertenencia con vigencia, sus roles con alcance resuelto y su estado de cuenta.
  - GIVEN ese usuario WHEN edita su contacto THEN el cambio queda persistido y auditado.
  - GIVEN un guardián con un solo menor WHEN navega THEN no se le agrega un selector de menor innecesario.
  - GIVEN un guardián con varios menores WHEN cambia de menor en el selector THEN las proyecciones relevantes (Inicio, Calendario, Equipo, Disponibilidad) pasan a mostrar ese menor.
- **RELATED BUSINESS RULES:** REQ-PPL-010, REQ-IAM-010.
- **DEPENDENCIES:** REQ-PPL-004, REQ-PPL-006, REQ-PPL-008
- **NOTES:** El perfil no muestra documento ni fecha de nacimiento en ningún rol; no hay línea de tiempo genérica; no hay jerga interna (FF §13).
- **STATUS:** ACTIVE

---

# 4. REQUERIMIENTOS IN — STR (Club Structure)

### REQ-STR-001 — Temporada
- **STATEMENT:** El club debe poder registrar temporadas con nombre y fechas, y actualizar nombre y fechas; la temporada es histórica y no se elimina.
- **TYPE:** FUNCTIONAL · **CATEGORY:** LIFECYCLE · **DOMAIN:** STR · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que la organización del club por temporada quede registrada y sea consultable en el futuro.
- **PRELIMINARY ACTOR:** Admin
- **SOURCE(S):** PT §19 (`Season: Create; Update name/dates; histórico; no hard-delete`); PT §25 `seasons`; FGMAM §M12 (5.E: `Season.startsOn/endsOn`); FFS F19
- **ACCEPTANCE CRITERIA:**
  - GIVEN un Admin WHEN crea una temporada con nombre y fechas THEN la temporada queda registrada.
  - GIVEN una temporada existente WHEN un Admin actualiza su nombre o sus fechas THEN el cambio queda persistido y auditado.
  - GIVEN una temporada con historia WHEN se intenta eliminarla THEN no existe operación de eliminación; sólo puede quedar sin uso.
- **RELATED BUSINESS RULES:** REQ-STR-004 (identidad de equipo).
- **DEPENDENCIES:** REQ-PPL-014
- **NOTES:** PT §19 **no** define un ciclo de estado para Temporada. El distintivo "Activo" que el prototipo mostró en Temporada era un estado inventado y no es requisito (`CON-09`). Contradicción con FFS F19 registrada en `CON-10`: manda PT §19, por lo que crear y actualizar temporada son IN y hoy no tienen superficie.
- **STATUS:** ACTIVE

### REQ-STR-002 — División
- **STATEMENT:** El club debe poder crear divisiones, actualizar sus datos y archivarlas, sin destruir la historia.
- **TYPE:** FUNCTIONAL · **CATEGORY:** LIFECYCLE · **DOMAIN:** STR · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que las divisiones del club (Primera, Quinta, Sexta…) sean estructura administrable.
- **PRELIMINARY ACTOR:** Admin
- **SOURCE(S):** PT §3 IN (`Division`); PT §19 (`Division: Create; Update; Archive`); PT §4 (`Division`); PT §5 (`Club structure` = ADMIN)
- **ACCEPTANCE CRITERIA:**
  - GIVEN un Admin WHEN crea una división THEN queda registrada.
  - GIVEN una división con equipos activos WHEN un Admin intenta renombrarla THEN la operación se rechaza explicando que la identidad de los equipos no cambia.
  - GIVEN una división WHEN se archiva THEN queda archivada y su historia se conserva.
- **DEPENDENCIES:** REQ-PPL-014, REQ-STR-006
- **NOTES:** La restauración de una división archivada no está en PT §19; ver `REQ-DECISION-NEEDED-01`.
- **STATUS:** ACTIVE

### REQ-STR-003 — Línea
- **STATEMENT:** El club debe poder crear líneas, actualizar sus datos y archivarlas, sin destruir la historia.
- **TYPE:** FUNCTIONAL · **CATEGORY:** LIFECYCLE · **DOMAIN:** STR · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que las líneas deportivas (A/B/C/Proyección) sean estructura administrable.
- **PRELIMINARY ACTOR:** Admin
- **SOURCE(S):** PT §3 IN (`Line`); PT §19 (`Line: Create; Update; Archive`); PT §4 (`Line`); PT §5 (`Club structure` = ADMIN)
- **ACCEPTANCE CRITERIA:**
  - GIVEN un Admin WHEN crea una línea THEN queda registrada.
  - GIVEN una línea con equipos activos WHEN un Admin intenta renombrarla THEN la operación se rechaza explicando que la identidad de los equipos no cambia.
  - GIVEN una línea WHEN se archiva THEN queda archivada y su historia se conserva.
- **DEPENDENCIES:** REQ-PPL-014, REQ-STR-006
- **NOTES:** La restauración de una línea archivada no está en PT §19; ver `REQ-DECISION-NEEDED-01`.
- **STATUS:** ACTIVE

### REQ-STR-004 — Equipo
- **STATEMENT:** El club debe poder crear un equipo como combinación única de temporada, división y línea, y recorrer el ciclo `DRAFT → ACTIVE → ARCHIVED`; su identidad es inmutable.
- **TYPE:** FUNCTIONAL · **CATEGORY:** LIFECYCLE · **DOMAIN:** STR · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que la unidad sports defiliación y de eventos sea una entidad concreta y única por temporada.
- **PRELIMINARY ACTOR:** Admin
- **SOURCE(S):** PT §3 IN (`Team`); PT §4 (`Team = Season + Division + Line`); PT §9 (`Team: DRAFT -> ACTIVE -> ARCHIVED`); PT §19; PT §25 `teams`; PT §26 (unique `season_id + division_id + line_id`; `Identity immutable`); PT §33 (`ArchiveTeam vs new Team dependency`); FGMAM §M12 (M-10 Team create como faltante); S5FLW F19; FFS F19
- **ACCEPTANCE CRITERIA:**
  - GIVEN temporada, división y línea existentes WHEN un Admin crea un equipo con esa combinación THEN el equipo queda creado.
  - GIVEN un equipo ya existente con la misma combinación WHEN se intenta crear otro THEN la operación es rechazada.
  - GIVEN un equipo `ACTIVE` WHEN se archiva y luego existe una dependencia activa que lo referencia WHEN se intenta archivar THEN la operación es rechazada indicando la dependencia.
  - GIVEN un equipo archivado WHEN se consultan sus eventos y personas anteriores THEN la información sigue disponible.
- **RELATED BUSINESS RULES:** REQ-PPL-014, REQ-PPL-005, REQ-EVT-006.
- **DEPENDENCIES:** REQ-STR-001, REQ-STR-002, REQ-STR-003
- **NOTES:** La **creación** de equipo es IN (fuente: PT §19 + PT §33) y hoy no tiene superficie → `REQUIREMENT_WITHOUT_CURRENT_SURFACE`. La **restauración** de un equipo archivado no figura en PT §9 → `REQ-DECISION-NEEDED-01`.
- **STATUS:** ACTIVE

### REQ-STR-005 — Sede
- **STATEMENT:** El club debe poder registrar sedes con nombre, dirección y etiqueta opcional de cancha, y archivarlas; la identidad de una sede es estable por identificador.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** STR · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que los lugares donde se juega existan como datos reutilizables y no como texto libre.
- **PRELIMINARY ACTOR:** Admin
- **SOURCE(S):** PT §3 IN (`Venue`); PT §19 (`Venue: name; address; optional field_label; archived_at; stable identity by ID`); PT §25 `venues`; PT §82 (cambio 2); FFS F19; S4IR §8 (P0-6)
- **ACCEPTANCE CRITERIA:**
  - GIVEN un Admin WHEN crea una sede con nombre, dirección y etiqueta opcional THEN la sede queda registrada con identificador estable.
  - GIVEN una sede WHEN se consulta THEN su nombre no se resuelve por coincidencia de texto contra los eventos.
  - GIVEN una sede WHEN se archiva THEN queda archivada y su historia se conserva.
- **DEPENDENCIES:** REQ-EVT-019
- **STATUS:** ACTIVE

### REQ-STR-006 — Valla de dependencias al archivar
- **STATEMENT:** No se debe archivar estructura deportiva que tenga dependencias activas, y cuando la valla bloquee la operación el sistema debe explicar qué dependencia lo impide.
- **TYPE:** FUNCTIONAL · **CATEGORY:** DATA_INTEGRITY · **DOMAIN:** STR (cross: SYS) · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que archivar no deje referencias colgando que rompan la historia.
- **PRELIMINARY ACTOR:** Admin
- **SOURCE(S):** PT §19 (`Archive queda bloqueado por dependencias activas`); PT §33 (ReferenceAdmissionFence); PT §38 (`STRUCTURE_HAS_ACTIVE_DEPENDENCIES`, `MEMBERSHIP_HAS_ACTIVE_DEPENDENCIES`); FGMAM §M2 flujo H; S5FLW F19; FFS F19
- **ACCEPTANCE CRITERIA:**
  - GIVEN una estructura con dependencias activas WHEN se intenta archivar THEN la operación es rechazada nombrando la dependencia que lo impide.
  - GIVEN una estructura sin dependencias activas WHEN se archiva THEN la operación prospera.
- **RELATED BUSINESS RULES:** REQ-SYS-012 (carril de concurrencia), REQ-EVT-024 (Jornada).
- **DEPENDENCIES:** REQ-STR-002, REQ-STR-003, REQ-STR-004, REQ-STR-005
- **STATUS:** ACTIVE

### REQ-STR-007 — Identidad de temporada por identificador
- **STATEMENT:** Cada entidad de estructura y cada evento deben llevar su propia zona horaria, y las fechas mostradas deben ser interpretadas en esa zona.
- **TYPE:** FUNCTIONAL · **CATEGORY:** DATA_INTEGRITY · **DOMAIN:** STR (cross: EVT) · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que un horario de entrenamiento no se desplace por la zona horaria del servidor o del dispositivo.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §26 (`events.timezone`; tablas con `timestamptz`)
- **ACCEPTANCE CRITERIA:**
  - GIVEN un evento creado con una zona horaria WHEN se consulta desde un dispositivo en otra zona THEN la hora local mostrada corresponde a la zona del evento.
- **DEPENDENCIES:** REQ-EVT-001
- **STATUS:** ACTIVE

### REQ-STR-008 — Operaciones de estructura disponibles desde el producto
- **STATEMENT:** Un Admin con autoridad sobre la estructura del club debe poder ejecutar las operaciones de alta, edición y archivo de estructura desde el producto, no sólo por una vía no visible.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** STR · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que la gestión de estructura sea una capacidad real y no una tarea que sólo el personal técnico puede hacer.
- **PRELIMINARY ACTOR:** Admin
- **SOURCE(S):** PT §3 IN (Club Structure completo); PT §19 (Create/Update/Archive para Season, Division, Line, Team, Venue); PT §23 (`/management/structure`, `/management/teams/:id`); PT §5 (`Club structure` = ADMIN); FF §2 (registro de rutas)
- **ACCEPTANCE CRITERIA:**
  - GIVEN un Admin WHEN abre la gestión de estructura THEN dispone de las operaciones de alta, edición y archivo de cada tipo de estructura.
  - GIVEN una operación que la PT §19 no habilita para ese tipo (por ejemplo, eliminar una temporada) WHEN el Admin la busca THEN no está disponible.
- **RELATED BUSINESS RULES:** REQ-STR-001 … REQ-STR-006.
- **DEPENDENCIES:** REQ-STR-001, REQ-STR-002, REQ-STR-003, REQ-STR-004, REQ-STR-005
- **NOTES:** Este requisito existe para que la brecha "no hay creación de temporada/equipo desde la interfaz" (FFS F19, FGMAM M-10) quede como superficie faltante y no como decisión de producto.
- **STATUS:** ACTIVE

### REQ-STR-009 — Estructura no disponible para Subcomisión
- **STATEMENT:** La Subcomisión no administra la estructura del club; debe recibir una explicación cuando intente acceder a ella, no una pantalla vacía ni un error.
- **TYPE:** FUNCTIONAL · **CATEGORY:** AUTHORIZATION · **DOMAIN:** STR (cross: SYS) · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que la separación entre Subcomisión y Administración sea explícita y comprensible.
- **PRELIMINARY ACTOR:** Subcommittee
- **SOURCE(S):** PT §5 (`| Club structure | — | — | — | — | ✓ |`); PT §75 (`ADMIN is not sports superuser`); FF §12 (Subcomisión: `No gestiona cuentas ni estructura`); FF §2 (`/management/structure` = administración); S5FLW F19 (`SUBCOMMITTEE recibe Restricted ✓ correcto`)
- **ACCEPTANCE CRITERIA:**
  - GIVEN una cuenta Subcomisión WHEN intenta abrir la gestión de estructura THEN el acceso es denegado con una explicación del motivo.
  - GIVEN un Admin WHEN abre la misma sección THEN tiene acceso completo.
- **RELATED BUSINESS RULES:** REQ-IAM-016, REQ-IAM-017.
- **DEPENDENCIES:** REQ-IAM-016, REQ-STR-008
- **NOTES:** Corregir el caso inverso también es requisito: una Subcomisión que sí tiene autoridad (elegibilidad, comunicados, competencias) debe poder entrar por una ruta que su padre no le niega (ver `CON-14`).
- **STATUS:** ACTIVE

### REQ-STR-010 — Etiqueta completa de línea y equipo
- **STATEMENT:** Cuando el sistema presente una línea o un equipo, debe mostrar su identificación completa —línea con división y temporada; equipo con temporada, división y línea— y no un nombre ambiguo.
- **TYPE:** FUNCTIONAL · **CATEGORY:** USABILITY · **DOMAIN:** STR · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que "Línea A" no sea ambiguo entre divisiones ni entre temporadas.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §4 (`Division`, `Line`, `Team` canónicos); FIR §D4 (`"Línea A · Sexta · Temporada 2026"`, nunca `"Línea A"`); FFS F20; S4G S4-03; FGMAM §M1 fila 34
- **ACCEPTANCE CRITERIA:**
  - GIVEN una línea WHEN se presenta en cualquier superficie THEN su identificación incluye división y temporada.
  - GIVEN un equipo WHEN se presenta THEN su nombre se deriva de temporada, división y línea.
- **RELATED BUSINESS RULES:** REQ-PPL-014, REQ-CMP-003.
- **DEPENDENCIES:** REQ-STR-003, REQ-STR-004
- **STATUS:** ACTIVE

### REQ-STR-011 — Las referencias de estructura no se resuelven por nombre
- **STATEMENT:** Toda relación entre un evento, una inscripción o una persona y la estructura deportiva (sede, equipo, división, línea, temporada) debe resolverse por identidad estable y no por coincidencia de texto.
- **TYPE:** FUNCTIONAL · **CATEGORY:** DATA_INTEGRITY · **DOMAIN:** STR · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que renombrar una sede o una línea noreatribuya silenciosamente la historia de eventos y personas ajenas.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §19 (`stable identity by ID`); PT §26 (`teams`/`venues` con identidad estable; `FK` a target exacto); PT §75 (`DB backs structural impossibilities`); S5FLW B-65 (`Dependencias resueltas por nombre, no por id`); S5CAP B-70; FGMAM §M5; FFS F23
- **ACCEPTANCE CRITERIA:**
  - GIVEN una sede cuyo nombre coincide con el de otra WHEN se consulta un evento THEN el evento queda asociado a la sede que le corresponde por identidad y no por texto.
  - GIVEN una línea o división renombrada WHEN se consultan los eventos y las inscripciones existentes THEN siguen asociados a la misma identidad.
- **RELATED BUSINESS RULES:** REQ-STR-012 (semántica de renombre de sede).
- **DEPENDENCIES:** REQ-STR-005, REQ-STR-004
- **NOTES:** Cubre `P2-36` / `P3-12` y las observaciones `Venue por nombre` de S5FLW F19 y S5PIA `UX-30`.
- **STATUS:** ACTIVE

### REQ-STR-012 — Identidad de la sede y cambios de sede
- **STATEMENT:** Corregir los datos de identidad o metadatos de una sede (nombre, dirección, etiqueta de cancha) es una corrección administrativa de la sede y no reprograma por sí sola los eventos que la referencian; cambiar la sede asignada a un evento sí es un cambio material de ese evento.
- **TYPE:** FUNCTIONAL · **CATEGORY:** BUSINESS_RULE · **DOMAIN:** STR (cross: EVT) · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que corregir un nombre no genere una tormenta de reprogramaciones y avisos, y que cambiar la sede de un partido sí lo haga.
- **PRELIMINARY ACTOR:** Admin (sede) · Coach / Subcommittee (evento)
- **SOURCE(S):** PT §11 (`Venue rename semantics`, A/B); PT §19; PT §82 (cambio 2); S4IR §8 (P0-6 CLOSED con A/B separados); FIR §D6; FFS F08/F19
- **ACCEPTANCE CRITERIA:**
  - GIVEN una sede con 20 eventos que la referencian WHEN un Admin corrige el nombre de la sede THEN ningún evento se reprograma, ninguno pasa a pedir reconfirmación y no se envía aviso de reprogramación; el nombre usado en cada momento histórico queda preservado en la historia.
  - GIVEN un evento con sede A WHEN se cambia a sede B THEN se aplica el flujo de cambio material completo: vista previa de impacto, incremento de la revisión de coordinación, reconfirmación cuando corresponda y notificación.
- **RELATED BUSINESS RULES:** REQ-EVT-012 (cambio material).
- **DEPENDENCIES:** REQ-STR-005, REQ-EVT-012
- **NOTES:** Resuelve `CON-07` y la decisión `D-2` del plan de reconstrucción FGMAP §D-2.
- **STATUS:** ACTIVE

### REQ-STR-013 — Estructura como referencia seleccionable
- **STATEMENT:** Las divisiones, líneas, sedes y temporadas que el club usa como referencia deben ser datos consultables y seleccionables, con su nombre completo.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** STR · **SCOPE:** IN · **PRIORITY:** P2
- **GOAL:** Que la estructura de referencia se pueda elegir sin memorizar nombres.
- **PRELIMINARY ACTOR:** Admin
- **SOURCE(S):** PT §3 IN (Club Structure); PT §23 (`/management/structure`); FGMAP §M12 (5.E: eliminar literales de semilla como "Alvear 1240"); IAR §7.1
- **ACCEPTANCE CRITERIA:**
  - GIVEN las divisiones, líneas y sedes registradas WHEN un Admin va a crear un evento o una inscripción THEN puede elegirlas de una lista y no escribirlas a mano.
- **DEPENDENCIES:** REQ-STR-002, REQ-STR-003, REQ-STR-005
- **NOTES:** Un dato semilla no es un requisito; la necesidad real es "elegir estructura existente sin literales". Ver `CON-22`.
- **STATUS:** ACTIVE

---

# 5. REQUERIMIENTOS IN — EVT (Events & Calendar)

### REQ-EVT-001 — Invariantes de un evento
- **STATEMENT:** Todo evento, sea del tipo que sea, debe cumplir: si existen inicio y fin, el fin es posterior al inicio; un evento `SCHEDULED`, `IN_PROGRESS` o `COMPLETED` tiene inicio vigente; un evento `POSTPONED` puede no tener horario vigente.
- **TYPE:** FUNCTIONAL · **CATEGORY:** DATA_INTEGRITY · **DOMAIN:** EVT · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que ningún evento sea una fecha incoherente.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §10 (Event invariants); PT §25 `events`; PT §26 `events`
- **ACCEPTANCE CRITERIA:**
  - GIVEN un evento con inicio y fin cuando el fin no es posterior al inicio THEN la operación es rechazada.
  - GIVEN un evento que pasa a `SCHEDULED` sin inicio WHEN se intenta THEN la operación es rechazada.
  - GIVEN un evento `POSTPONED` sin inicio WHEN se consulta THEN es válido y se presenta como sin horario vigente.
- **DEPENDENCIES:** REQ-EVT-007
- **STATUS:** ACTIVE

### REQ-EVT-002 — Crear un entrenamiento
- **STATEMENT:** Un entrenador con alcance sobre un equipo, o un entrenador con alcance de evento, o la Subcomisión con alcance de club, debe poder crear un entrenamiento para uno o varios equipos o personas.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** EVT · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que el club pueda convocar entrenamientos.
- **PRELIMINARY ACTOR:** Coach · Subcommittee
- **SOURCE(S):** PT §3 IN (`Training`); PT §10 (`TRAINING antes de Scheduled: >=1 Team o Person target`); PT §5 (`crear/editar Training | Coach: Team/Event scope; SUBCOMMITTEE: oficial autorizado`); PT §38 (`EVENT_TARGET_INVALID`); PT §76 (`RF06–08 → Events/Participation/Match`); FF §12; FFS F06
- **PRECONDITION:** el actor tiene autoridad de creación y un destino alcanzable.
- **ACCEPTANCE CRITERIA:**
  - GIVEN un entrenador con alcance sobre el equipo A WHEN crea un entrenamiento válido para el equipo A THEN se crea el evento correspondiente.
  - GIVEN un entrenamiento sin ningún destinatario de equipo o persona WHEN se intenta programarlo THEN la operación es rechazada con `EVENT_TARGET_INVALID`.
  - GIVEN un Admin sin autoridad deportiva WHEN intenta crear un entrenamiento THEN el acceso es denegado.
  - GIVEN un entrenamiento creado WHEN las personas alcanzadas lo consultan THEN lo ven en sus proyecciones temporales correspondientes.
- **RELATED BUSINESS RULES:** REQ-EVT-005, REQ-EVT-010, REQ-IAM-016.
- **DEPENDENCIES:** REQ-EVT-001, REQ-EVT-005, REQ-EVT-010
- **NOTES:** Este requisito **no** se deriva de que hoy exista una pantalla de "nueva jornada": ver `CON-18`.
- **STATUS:** ACTIVE

### REQ-EVT-003 — Crear un partido
- **STATEMENT:** Un entrenador con alcance de equipo o la Subcomisión con alcance de club debe poder crear un partido asociado a un equipo concreto, con rival, y opcionalmente a una inscripción de competencia y a una jornada.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** EVT · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que el club pueda registrar su calendario de partidos.
- **PRELIMINARY ACTOR:** Coach · Subcommittee
- **SOURCE(S):** PT §3 IN (`Match`); PT §10 (`MATCH: club_wide_target=false; exactamente 1 event_target_team; 0 event_target_persons; exactamente 1 Match subtype row`); PT §5 (`crear Match`); PT §16; PT §38 (`EVENT_TARGET_INVALID`); FF §12; FFS F06/F15
- **ACCEPTANCE CRITERIA:**
  - GIVEN un entrenador con alcance sobre el equipo A WHEN crea un partido para el equipo A con rival THEN se crea el partido con exactamente un equipo destino y ninguna persona destino.
  - GIVEN un intento de crear un partido con más de un equipo o con personas destino THEN la operación es rechazada con `EVENT_TARGET_INVALID`.
  - GIVEN un intento de crear un partido marcado para todo el club THEN la operación es rechazada.
  - GIVEN un Admin sin autoridad deportiva WHEN intenta crear un partido THEN el acceso es denegado.
- **RELATED BUSINESS RULES:** REQ-EVT-006, REQ-CMP-005, REQ-EVT-018.
- **DEPENDENCIES:** REQ-EVT-001, REQ-EVT-005, REQ-EVT-006, REQ-CMP-005
- **STATUS:** ACTIVE

### REQ-EVT-004 — Crear un evento del club
- **STATEMENT:** Un entrenador con alcance de evento o la Subcomisión con alcance de club debe poder crear un evento del club, either para todo el club o dirigido a equipos o personas concretas.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** EVT · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que el club puedaJd convocar a actividades que no son entrenar ni jugar (reuniones,.tasks, eventos de organización).
- **PRELIMINARY ACTOR:** Coach · Subcommittee
- **SOURCE(S):** PT §3 IN (`ClubEvent`); PT §10 (`CLUB_EVENT: club-wide o targeted`; `club_wide_target=true → 0 Team targets; 0 Person targets`); PT §5; PT §38 (`EVENT_TARGET_INVALID`); PT §76 (`RF13–16 → Communication/Events/Notifications`)
- **ACCEPTANCE CRITERIA:**
  - GIVEN un evento del club para todo el club WHEN se crea THEN tiene cero destinos de equipo y cero destinos de persona.
  - GIVEN un evento del club dirigido WHEN se crea THEN tiene al menos un destino de equipo o de persona y no está marcado para todo el club.
  - GIVEN un evento del club con ambos marcadores contradictorios WHEN se intenta guardar THEN la operación es rechazada.
- **RELATED BUSINESS RULES:** REQ-EVT-005.
- **DEPENDENCIES:** REQ-EVT-001, REQ-EVT-005
- **STATUS:** ACTIVE

### REQ-EVT-005 — Destinatarios plurales de un evento
- **STATEMENT:** Un evento debe poder tener varios equipos destino y varias personas destino al mismo tiempo, según lo permita su tipo, y el sistema debe presentar esos destinarios en lenguaje de usuario.
- **TYPE:** FUNCTIONAL · **CATEGORY:** BUSINESS_RULE · **DOMAIN:** EVT · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que un unwelcome evento para varias categorías no requiera crear un evento por categoría.
- **PRELIMINARY ACTOR:** Coach · Subcommittee
- **SOURCE(S):** PT §3 IN (`Event targets`); PT §10; PT §25 (`event_target_teams`, `event_target_persons`, `event_series_target_teams/persons`); PT §82; S4IR §9 (P1-03 CLOSED); IAR §6 R12
- **ACCEPTANCE CRITERIA:**
  - GIVEN un evento WHEN se consultan sus destinatarios THEN la lista de equipos y la lista de personas son independientes y pueden tener más de un elemento.
  - GIVEN un evento con varios destinatarios WHEN se presenta THEN el texto los enumera de forma comprensible (por ejemplo: un equipo, un equipo más dos personas, todo el club).
- **RELATED BUSINESS RULES:** REQ-EVT-002, REQ-EVT-003, REQ-EVT-004.
- **DEPENDENCIES:** REQ-EVT-001
- **STATUS:** ACTIVE

### REQ-EVT-006 — Equipo concreto e inmutable del partido
- **STATEMENT:** Un partido pertenece exactamente a un equipo concreto; ese equipo no puede cambiar una vez que el evento está programado.
- **TYPE:** FUNCTIONAL · **CATEGORY:** BUSINESS_RULE · **DOMAIN:** EVT · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que un partido no pueda cambiar de equipo una vez programado, porque invalidaría la convocatoria, la asistencia y el resultado ya registrados.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §10 (`concrete Team inmutable una vez Scheduled`); PT §11 (`Immutable una vez Scheduled: Event type; Match concrete Team; Season identity del contexto`); PT §75 (`Match has exactly one concrete Team`)
- **ACCEPTANCE CRITERIA:**
  - GIVEN un partido programado WHEN se intenta cambiar su equipo THEN la operación es rechazada.
  - GIVEN un partido no programado WHEN se cambia su equipo THEN el evento se reprograma por cambio material y la historia anterior queda preservada.
- **RELATED BUSINESS RULES:** REQ-EVT-003, REQ-EVT-012.
- **DEPENDENCIES:** REQ-EVT-003, REQ-EVT-007
- **STATUS:** ACTIVE

### REQ-EVT-007 — Ciclo de vida del evento
- **STATEMENT:** Un evento debe recorrer el ciclo `DRAFT → SCHEDULED`, y desde `SCHEDULED` admitir `POSTPONED`, `CANCELLED` y `IN_PROGRESS`; desde `POSTPONED` admitir `SCHEDULED` y `CANCELLED`; desde `CANCELLED` admitir `SCHEDULED` mediante restauración; desde `IN_PROGRESS` admitir `COMPLETED` y `ABANDONED`. `COMPLETED` no se reabre y las correcciones no retroceden el ciclo.
- **TYPE:** FUNCTIONAL · **CATEGORY:** LIFECYCLE · **DOMAIN:** EVT · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que el estado de un evento sea siempre derivable y no ambiguo.
- **PRELIMINARY ACTOR:** Coach · Subcommittee
- **SOURCE(S):** PT §9 (Event lifecycle); PT §25 `events.state`; PT §75 (`Completed Match never reopens`); PT §75 (`Stateful objects with lifecycle: ALL`); FF §14; FFS F10
- **ACCEPTANCE CRITERIA:**
  - GIVEN un evento `SCHEDULED` WHEN se pospone THEN queda `POSTPONED` y conserva las respuestas previas.
  - GIVEN un evento `POSTPONED` WHEN se reprograma con horario válido THEN vuelve a `SCHEDULED`.
  - GIVEN un evento `CANCELLED` WHEN se restaura THEN vuelve a `SCHEDULED`.
  - GIVEN un evento `COMPLETED` WHEN se intenta cualquier transición hacia atrás THEN la operación es rechazada.
  - GIVEN un evento en cada estado WHEN se consulta THEN su estado es una función de su historia, no un campo editable libremente.
- **RELATED BUSINESS RULES:** REQ-EVT-008, REQ-EVT-012.
- **DEPENDENCIES:** REQ-EVT-001
- **NOTES:** Cada transición corresponde a un comando con autoridad propia (PT §75). `ABANDONED` debe ser alcanzable desde `IN_PROGRESS` y no sólo por registro del acta (ver `CON-12`).
- **STATUS:** ACTIVE

### REQ-EVT-008 — Estados terminales y su comunicación
- **STATEMENT:** Un evento `CANCELLED`, `COMPLETED` o `ABANDONED` debe presentarse con su propia composición, explicando qué pasó y qué queda como referencia, sin ofrecer la respuesta de disponibilidad como acción primaria.
- **TYPE:** FUNCTIONAL · **CATEGORY:** USABILITY · **DOMAIN:** EVT · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que un evento cancelado no se vea igual que uno vivo ni ofrezca acciones que ya no tienen sentido.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** FF §14 (`Terminales: CANCELLED, COMPLETED, ABANDONED ... sin ¿Vas? como acción primaria`); S5FLW F10; FFS F10; PT §24 (`Draft/PUBLISHED inequívocos`)
- **ACCEPTANCE CRITERIA:**
  - GIVEN un evento cancelado WHEN una persona alcanzada lo consulta THEN ve que está cancelado, qué significa, y no ve la respuesta de disponibilidad como acción principal.
  - GIVEN un evento suspendido WHEN una persona lo consulta THEN ve que no hay resultado oficial.
  - GIVEN un evento ya jugado WHEN una persona lo consulta THEN ve el resultado final y que las correcciones quedan registradas.
- **RELATED BUSINESS RULES:** REQ-EVT-007, REQ-SYS-007.
- **DEPENDENCIES:** REQ-EVT-007
- **STATUS:** ACTIVE

### REQ-EVT-009 — Programar un evento
- **STATEMENT:** Un evento en `DRAFT` debe poder pasar a `SCHEDULED` mediante una operación que valide sus invariantes y sus destinatarios y persista el estado final previsto en esa misma operación.
- **TYPE:** FUNCTIONAL · **CATEGORY:** LIFECYCLE · **DOMAIN:** EVT · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que la programación de un evento sea una decisión única y coherente.
- **PRELIMINARY ACTOR:** Coach · Subcommittee
- **SOURCE(S):** PT §9 (`DRAFT -> SCHEDULED`); PT §32 (comandos de transición; `When user confirms terminal/published state, command receives exact final intended draft`; `No frontend choreography SaveDraft -> Publish to fake atomicity`); PT §10; PT §38
- **ACCEPTANCE CRITERIA:**
  - GIVEN un evento `DRAFT` válido WHEN se programa THEN el evento queda `SCHEDULED` con inicio vigente y sus destinatarios válidos.
  - GIVEN un evento `DRAFT` con invariantes violadas WHEN se intenta programar THEN la operación es rechazada indicando la causa.
  - GIVEN un evento `DRAFT` WHEN la programación prospera THEN no queda un estado intermedio ni un borrador adicional.
- **RELATED BUSINESS RULES:** REQ-SYS-018 (sin pseudo-transacciones en cliente).
- **DEPENDENCIES:** REQ-EVT-001, REQ-EVT-005, REQ-EVT-007
- **STATUS:** ACTIVE

### REQ-EVT-010 — Cambio no material
- **STATEMENT:** Corregir el título o el texto de un evento, o sus metadatos no coordinativos, no debe considerarse cambio material: no debe generar vista previa de impacto, ni incremento de la revisión de coordinación, ni necesidad de reconfirmación, ni notificación de reprogramación.
- **TYPE:** FUNCTIONAL · **CATEGORY:** BUSINESS_RULE · **DOMAIN:** EVT · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que una corrección de redacción no obligue a reconfirmar a todo el equipo.
- **PRELIMINARY ACTOR:** Coach · Subcommittee
- **SOURCE(S):** PT §11 (Non-material: `title/wording correction`; `scheduleSource metadata`; `ExternalReference metadata`; `metadata administrativa no coordinativa`); PT §38; FFS F07; S5FLW F07
- **ACCEPTANCE CRITERIA:**
  - GIVEN un evento con horarios y destinos WHEN se corrige únicamente su título THEN no se genera vista previa de impacto ni notificación, y la revisión de coordinación no cambia.
  - GIVEN esa corrección WHEN se consulta la historia THEN queda registrada quién la hizo y qué cambió.
- **RELATED BUSINESS RULES:** REQ-EVT-012, REQ-INS-009.
- **DEPENDENCIES:** REQ-EVT-007
- **NOTES:** La rama no material sólo es alcanzable si el campo de título es editable; su ausencia en el prototipo fue un defecto de superficie (S5MTX MX-03), no una decisión de producto.
- **STATUS:** ACTIVE

### REQ-EVT-011 — Cambio material
- **STATEMENT:** Un cambio de fecha u hora de inicio, de fin o duración, de sede, de equipos destino, de personas destino, de audiencia de club, de rival, de inscripción de competencia, de los datos de logística, o las acciones de posponer, reprogramar, cancelar y restaurar, deben considerarse cambio material.
- **TYPE:** FUNCTIONAL · **CATEGORY:** BUSINESS_RULE · **DOMAIN:** EVT · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que el sistema sepa qué cambios obligan a volver a coordinar a la gente.
- **PRELIMINARY ACTOR:** Coach · Subcommittee
- **SOURCE(S):** PT §11 (Material list); PT §82 (cambio 2, Venue A/B); FFS F08; FGMAP §D-2
- **ACCEPTANCE CRITERIA:**
  - GIVEN un evento programado WHEN se modifica cualquiera de los campos materiales listados THEN la operación se trata como cambio material.
  - GIVEN un cambio material WHEN se confirma THEN se incrementa la revisión de coordinación de cada ocurrencia afectada.
  - GIVEN un cambio material WHEN hay respuestas de disponibilidad afectadas THEN puede derivarse la necesidad de reconfirmación.
  - GIVEN un cambio material WHEN se confirma THEN se genera la notificación correspondiente según la política de notificación.
- **RELATED BUSINESS RULES:** REQ-EVT-012, REQ-EVT-013, REQ-PRT-003, REQ-COM-016.
- **DEPENDENCIES:** REQ-EVT-007, REQ-STR-012
- **STATUS:** ACTIVE

### REQ-EVT-012 — Vista previa de impacto y reconfirmación
- **STATEMENT:** Antes de aplicar un cambio material, el sistema debe mostrar su impacto —a quién alcanza y qué consecuencia tiene— y exigir una confirmación explícita; si el impacto cambió entre la vista previa y la confirmación, debe exigir una nueva confirmación.
- **TYPE:** FUNCTIONAL · **CATEGORY:** BUSINESS_RULE · **DOMAIN:** EVT · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que nadie coordine a un equipo a ciegas.
- **PRELIMINARY ACTOR:** Coach · Subcommittee
- **SOURCE(S):** PT §37 (Impact Preview: token liga actor, recurso, operación, cambio normalizado, versiones, hash de impacto, expiry; `Execute reauthorizes and recomputes`; errores `INVALID_IMPACT_TOKEN`, `IMPACT_TOKEN_EXPIRED`, `IMPACT_CHANGED`; `Changed impact requires explicit reconfirmation`); PT §24 (`impact preview antes de cambios relevantes`); PT §38; PT §73 (`409 IMPACT_CHANGED → reconfirm new impact`); S4G FDPG-01; FFS F08
- **ACCEPTANCE CRITERIA:**
  - GIVEN un cambio material propuesto WHEN el actor pide el impacto THEN el sistema devuelve las personas y roles alcanzados y las consecuencias, con conteos derivados de los conjuntos reales y no de cifras fijas.
  - GIVEN una vista previa vigente WHEN el actor confirma THEN se ejecuta el cambio y el impacto se recalcula y revalida en el momento de ejecutar.
  - GIVEN un impacto distinto al previsualizado WHEN el actor confirma THEN la operación es rechazada con `IMPACT_CHANGED` y se exige una nueva confirmación.
  - GIVEN una vista previa vencida WHEN el actor confirma THEN la operación es rechazada con `IMPACT_TOKEN_EXPIRED`.
- **RELATED BUSINESS RULES:** REQ-EVT-011, REQ-SYS-009, REQ-IAM-016.
- **DEPENDENCIES:** REQ-EVT-011, REQ-SYS-014
- **NOTES:** El prototipo ofrecía conteos fabricados en la vista previa de impacto (S5FLW B-58; S5MTX MX-12); el requisito es que el impacto se calcule sobre el conjunto real de afectados.
- **STATUS:** ACTIVE

### REQ-EVT-013 — Reconciliación ante conflicto de concurrencia
- **STATEMENT:** Cuando una operación entre en conflicto con una versión más reciente del recurso, el sistema debe preservar a la vez la base sobre la que el usuario empezó, sus cambios locales y la versión actual del servidor, y ofrecer una reconciliación explícita sin sobrescribir a ciegas.
- **TYPE:** FUNCTIONAL · **CATEGORY:** DATA_INTEGRITY · **DOMAIN:** EVT (cross: SYS) · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que dos personas que editan lo mismo no pierdan trabajo ni se pisen sin avisar.
- **PRELIMINARY ACTOR:** Coach · Subcommittee · Admin
- **SOURCE(S):** PT §44 (`409 preserves: baseline; localDraft; latestServer`; `No generic force overwrite`); PT §38 (`STALE_VERSION`); PT §73 (`409 STALE_VERSION → Conflict Workspace`); PT §75 (`no last-write-wins`); S5FLW B-19; FIR §10; FFS F08; IAR §9 P1-06
- **ACCEPTANCE CRITERIA:**
  - GIVEN un formulario con cambios locales WHEN el recurso cambia en el servidor y el actor guarda THEN la operación es rechazada y el usuario ve su base, sus cambios y la versión actual.
  - GIVEN el conflicto WHEN el actor elige una reconciliación THEN cada campo queda declarado como seguro de conservar o en conflicto, y no hay una fusión automática que haga perder cambios.
  - GIVEN un conflicto WHEN el actor intenta descartar su borrador sin decidir THEN el sistema no lo descarta silenciosamente.
- **RELATED BUSINESS RULES:** REQ-SYS-017, REQ-SYS-010.
- **DEPENDENCIES:** REQ-SYS-010, REQ-SYS-017
- **STATUS:** ACTIVE

### REQ-EVT-014 — Serie de eventos: existencia y creación
- **STATEMENT:** Un evento puede pertenecer a una serie, y una serie debe poder crearse con su nombre, su estado y sus destinatarios, de modo que la recurrencia sea una capacidad del producto y no una convención del calendario.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** EVT · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que las series de eventos (entrenamientos semanales, liga) sean una entidad y no una suposición.
- **PRELIMINARY ACTOR:** Coach · Subcommittee
- **SOURCE(S):** PT §3 IN (`EventSeries`); PT §9 (`EventSeries: ACTIVE -> ENDED`; `Máximo por command: 366 occurrences`); PT §25 (`event_series`, `event_series_target_teams`, `event_series_target_persons`); PT §36 (Events: `EventSeries`); PT §38 (`RECURRENCE_TOO_LARGE`); S4G S4-01; FFS F06/F09
- **ACCEPTANCE CRITERIA:**
  - GIVEN un patrón de recurrencia WHEN se crea la serie THEN quedan persistidos la serie, sus destinatarios y sus ocurrencias.
  - GIVEN una serie WHEN se consulta su nombre y su estado THEN ambos están disponibles y son visibles donde corresponde.
- **RELATED BUSINESS RULES:** REQ-EVT-015, REQ-EVT-016.
- **DEPENDENCIES:** REQ-EVT-002, REQ-EVT-005
- **NOTES:** En el prototipo la serie existía en el modelo sin superficie; su nombre no se mostraba en ninguna parte (S5FLW B-77).
- **STATUS:** ACTIVE

### REQ-EVT-015 — Serie de eventos: alcances de cambio
- **STATEMENT:** Al cambiar un evento de una serie, el actor debe poder elegir el alcance de la modificación entre tres opciones: sólo esa ocurrencia, esa ocurrencia y las siguientes, o toda la serie; y el sistema debe aplicar el cambio exactamente al conjunto elegido.
- **TYPE:** FUNCTIONAL · **CATEGORY:** BUSINESS_RULE · **DOMAIN:** EVT · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que cambiar un entrenamiento de la semana no modifique toda la temporada por accidente.
- **PRELIMINARY ACTOR:** Coach · Subcommittee
- **SOURCE(S):** S4G FDPG-01 (`IN`: `ScopeDialog` con "Solo este evento / Este y los siguientes / Toda la serie", antes del Impact Preview definitivo); PT §11 (efectos por ocurrencia); PT §25 (`event_occurrence_overrides`); PT §32; FIR §D1; FFS F09; S5CAP PG-01
- **ACCEPTANCE CRITERIA:**
  - GIVEN una serie de 4 ocurrencias WHEN se elige "toda la serie" y se confirma un cambio material THEN las 4 ocurrencias cambian.
  - GIVEN esa misma serie WHEN se elige "este y los siguientes" THEN cambian las ocurrencias desde la editada hasta el final y la anterior queda intacta.
  - GIVEN esa misma serie WHEN se elige "sólo este" THEN cambia exactamente 1 ocurrencia y queda registrada la anulación específica de esa ocurrencia.
  - GIVEN cualquier alcance WHEN se confirma THEN la revisión de coordinación sube sólo en las ocurrencias efectivamente afectadas.
  - GIVEN cualquier alcance WHEN se calcula el impacto THEN el impacto se calcula sobre el conjunto real afectado, no sobre un total de la serie.
- **RELATED BUSINESS RULES:** REQ-EVT-012, REQ-PRT-003.
- **DEPENDENCIES:** REQ-EVT-011, REQ-EVT-014
- **NOTES:** El prototipo ofrecía el selector de alcance pero mutaba una sola ocurrencia (S4G S4-01; S5FLW F09). Esta capacidad es IN desde la decisión FDPG-01 y su cierre en F09: el alcance elegido debe cumplirse.
- **STATUS:** ACTIVE

### REQ-EVT-016 — Serie de eventos: fin y límites
- **STATEMENT:** Una serie debe poder pasar de `ACTIVE` a `ENDED`, y la creación de ocurrencias debe respetar un máximo de 366 por operación.
- **TYPE:** FUNCTIONAL · **CATEGORY:** BUSINESS_RULE · **DOMAIN:** EVT · **SCOPE:** IN · **PRIORITY:** P2
- **GOAL:** Que las series tengan un cierre explícito y un límite de protección.
- **PRELIMINARY ACTOR:** Coach · Subcommittee
- **SOURCE(S):** PT §9 (`EventSeries: ACTIVE -> ENDED`; `Máximo por command: 366 occurrences`); PT §38 (`RECURRENCE_TOO_LARGE`); FFS F09
- **ACCEPTANCE CRITERIA:**
  - GIVEN una serie `ACTIVE` WHEN se finaliza THEN queda `ENDED` y las ocurrencias existentes se conservan.
  - GIVEN una solicitud de más de 366 ocurrencias WHEN se envía THEN la operación es rechazada con `RECURRENCE_TOO_LARGE`.
- **DEPENDENCIES:** REQ-EVT-014
- **STATUS:** ACTIVE

### REQ-EVT-017 — Superficie de participación de un evento
- **STATEMENT:** Un evento debe ofrecer, según su tipo y la autoridad del actor, sus superficies de participación —disponibilidad, convocatoria, asistencia y resultado— con una entrada clara y sin exigir navegación innecesaria.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** EVT (cross: PRT) · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que la participación en un evento se resuelva desde el propio evento.
- **PRELIMINARY ACTOR:** Authenticated user · Coach
- **SOURCE(S):** PT §23 (`/events/:eventId`, `…/availability`, `…/selection`, `…/attendance`, `…/match-record`); PT §12 (Participation applicability); IAR §5 (`Evento = página profunda con rail de participación`); FF §2
- **PRECONDITION:** PT §12 — la superficie sólo aplica a los tipos de evento que la admiten.
- **ACCEPTANCE CRITERIA:**
  - GIVEN un partido scheduled WHEN un jugador lo abre THEN dispone de su respuesta de disponibilidad y puede ver si está convocada.
  - GIVEN un partido scheduled WHEN un entrenador del equipo lo abre THEN dispone de convocatoria, asistencia y resultado.
  - GIVEN un entrenamiento WHEN un jugador lo abre THEN dispone de disponibilidad y asistencia, y no de convocatoria ni resultado.
  - GIVEN un evento sin una superficie aplicable para el actor WHEN lo abre THEN esa superficie no se ofrece.
- **RELATED BUSINESS RULES:** REQ-PRT-019 (aplicabilidad por tipo).
- **DEPENDENCIES:** REQ-EVT-001, REQ-IAM-016
- **STATUS:** ACTIVE

### REQ-EVT-018 — Jornada: creación y agrupación
- **STATEMENT:** La Subcomisión con alcance de club y el entrenador con alcance de equipo deben poder crear una jornada que agrupe partidos de una misma jornada operativa, en una operación masiva, atómica y acotada.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** EVT · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que el club pueda programar una jornada con varios partidos de una sola vez.
- **PRELIMINARY ACTOR:** Coach · Subcommittee
- **SOURCE(S):** PT §3 IN (`Jornada`); PT §4 (`Jornada: Agrupa Matches de una misma jornada operativa. No duplica el lifecycle de los Matches`); PT §16 (`Match pertenece como máximo a una Jornada`; `Match Team.season = Jornada.season`; `Si Jornada.competition_id existe, Match usa CompetitionEntry de esa Competition`; `Bulk máximo 100 Events`; `Bulk atómico`); PT §38 (`BULK_OPERATION_TOO_LARGE`); PT §5 (`crear/editar Training` para SUBCOMMITTEE; jornada creación con alcance de club); FFS F15; S5FLW F15
- **ACCEPTANCE CRITERIA:**
  - GIVEN una temporada y una división WHEN la Subcomisión crea una jornada con partidos válidos de esa temporada THEN la jornada queda creada y los partidos quedan agrupados.
  - GIVEN una jornada con 120 partidos WHEN se intenta crear en bloque THEN la operación es rechazada por superar el máximo o se procesa de forma atómica según el límite de 100; nunca queda una creación parcial.
  - GIVEN un partido cuyo equipo pertenece a otra temporada WHEN se intenta agruparlo THEN la operación es rechazada.
  - GIVEN una jornada con competencia asociada WHEN se agrupan partidos THEN cada partido debe usar una inscripción de esa competencia.
  - GIVEN un partido ya agrupado en otra jornada WHEN se intenta reasignarlo THEN la operación es rechazada por pertenencia única.
- **RELATED BUSINESS RULES:** REQ-CMP-005, REQ-EVT-024.
- **DEPENDENCIES:** REQ-EVT-003, REQ-CMP-005
- **NOTES:** La jornada **no** duplica el ciclo de vida de los partidos (PT §4). El "motor" de generación automática de fechas no está en PT y queda OUT (`OUT-EVT-003`).
- **STATUS:** ACTIVE

### REQ-EVT-019 — Logística del evento
- **STATEMENT:** Un evento debe poder registrar información operativa de logística —hora de encuentro, hora de salida, punto de encuentro, nota de transporte e instrucciones de llegada— y las personas alcanzadas deben poder consultarla.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** EVT · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que la logística de una salida a partido no viva en mensajes sueltos.
- **PRELIMINARY ACTOR:** Coach · Captain · Subcommittee
- **SOURCE(S):** PT §3 IN (`Logistics`); PT §11 (material: `meetingAt`, `departureAt`, `meetingPoint`, `transportNote`, `arrivalInstructions`); PT §5 (`| Logistics | — | Team scope | Team/Event | Club scope | — |`); PT §25 `event_logistics`; PT §76 (`RF17 → EventLogistics`); FGMAM §M1 fila 12 (`Logistics sólo MATCH`, P2-40); S5PIA (C11: `Hora de salida: "No aplica" con copy de negación`)
- **ACCEPTANCE CRITERIA:**
  - GIVEN un evento con logística registrada WHEN una persona alcanzada lo consulta THEN ve la información de encuentro, salida y llegada.
  - GIVEN una capitana de un equipo WHEN actualiza la logística de un evento de su equipo THEN la operación prospera según su alcance.
  - GIVEN un evento sin logística WHEN se consulta THEN el sistema comunica la ausencia con honestidad, sin afirmar un valor por defecto.
- **RELATED BUSINESS RULES:** REQ-EVT-011 (los cambios de logística son materiales).
- **DEPENDENCIES:** REQ-EVT-001
- **NOTES:** PT §5 concede al CAPTAIN alcance de equipo en Logística; es una de las pocas acciones donde CAPTAIN tiene autoridad propia y no derivada de COACH.
- **STATUS:** ACTIVE

### REQ-EVT-020 — Calendario como proyección
- **STATEMENT:** El calendario debe presentar los eventos relevantes para quien consulta, con estado navegable y con el mes, los filtros y la vista guardada en la dirección de la navegación, de modo que el botón atrás del navegador devuelva al mismo contexto.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** EVT (cross: SYS) · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que el calendario sea consultable y compartible sin perderse el contexto.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §3 IN (`Calendar`); PT §7 (`Home, Calendar, Team View, Search y Reports son proyecciones, no owners`); PT §23 (`/calendar`); PT §24 (`browser Back preserva origen`); PT §41 (`URL/filter | Router + Zod`); FIR §6; S5FLW F05; FFS F05
- **ACCEPTANCE CRITERIA:**
  - GIVEN un filtro o un mes seleccionado WHEN el usuario navega a otra pantalla y vuelve atrás THEN el filtro y el mes siguen siendo los mismos.
  - GIVEN una dirección de calendario WHEN se comparte o se recarga THEN la vista se reproduce.
  - GIVEN un calendario sin eventos WHEN se consulta THEN el estado vacío es un estado resuelto y no una pantalla rota.
- **RELATED BUSINESS RULES:** REQ-SYS-013, REQ-SYS-019.
- **DEPENDENCIES:** REQ-SYS-013
- **NOTES:** El calendario **no** es el dueño de los eventos ni el punto de creación único; la creación ocurre donde corresponde al tipo de evento (ver `CON-18`).
- **STATUS:** ACTIVE

### REQ-EVT-021 — Inicio como proyección de acción
- **STATEMENT:** El inicio debe presentar a cada persona lo que necesita saber o hacer ahora, con un máximo de tres elementos accionables, ordenados por urgencia, y debe comunicar explícitamente cuando no hay nada pendiente.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** EVT (cross: SYS) · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que la primera pantalla del producto responda "¿qué tengo que hacer?".
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** IAR §2 P3 (`INICIO: ¿Qué tengo que saber o hacer ahora?`); IAR §7.1 (`Regla de densidad: máximo 3 ítems en Necesita tu atención`; `Si no hay nada pendiente, Home lo dice explícitamente`); PT §3 IN (`Home projections`); PT §14 (`Puede alimentar Home → Necesita tu atención`); FFS F04; S5FLW F04
- **ACCEPTANCE CRITERIA:**
  - GIVEN una persona con pendientes resolubles WHEN abre el inicio THEN ve hasta tres elementos con motivo, consecuencia y acción, ordenados por urgencia.
  - GIVEN una persona cuyos pendientes no puede resolver WHEN abre el inicio THEN esos elementos no aparecen.
  - GIVEN una persona sin nada pendiente WHEN abre el inicio THEN el sistema lo dice explícitamente en lugar de mostrar una lista vacía.
- **RELATED BUSINESS RULES:** REQ-SYS-007, REQ-PRT-008.
- **DEPENDENCIES:** REQ-SYS-007
- **NOTES:** El Home no es un tablero de métricas (IAR §5). Los elementos de "Necesita tu atención" pueden derivarse de conflictos de convocatoria (PT §14) y de reconfirmaciones (PT §11).
- **STATUS:** ACTIVE

### REQ-EVT-022 — Coherencia entre proyecciones
- **STATEMENT:** Dos proyecciones del mismo hecho no deben mostrar versiones contradictorias; un evento postergado, cancelado o registrado en otra jornada debe verse igual en el inicio, el calendario, el equipo y el evento.
- **TYPE:** FUNCTIONAL · **CATEGORY:** DATA_INTEGRITY · **DOMAIN:** EVT (cross: SYS) · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que la persona no reciba dos verdades sobre el mismo evento.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §7 (proyecciones, no owners); PT §75 (`one write owner per domain truth`); PT §72 (Read: `commit -> optional NOTIFY -> SSE hint -> invalidate -> REST refetch`; `Realtime never becomes domain truth`); S5FLW B-101; FFS F04/F08
- **ACCEPTANCE CRITERIA:**
  - GIVEN un evento postergado WHEN se consulta el inicio y luego el calendario THEN ambos lo presentan con el mismo estado y la misma fecha efectiva.
  - GIVEN un cambio de estado de un evento WHEN se han cargado varias proyecciones THEN todas reflejan el estado vigente sin necesidad de recargar manualmente.
- **RELATED BUSINESS RULES:** REQ-SYS-014, REQ-SYS-019.
- **DEPENDENCIES:** REQ-SYS-014, REQ-SYS-019
- **STATUS:** ACTIVE

### REQ-EVT-023 — Consulta del evento y su contexto
- **STATEMENT:** Quien tiene el evento dentro de su alcance debe poder consultarlo con su horario, su sede, sus destinatarios, su estado y su historia; y debe poder ir a sus superficies de participación y a su conversación.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** EVT · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que el evento sea la unidad de consulta del producto.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §23 (`/events/:eventId`); PT §12; IAR §5; FF §2 (`/events/:eventId` = con el evento en alcance); FFS F06
- **ACCEPTANCE CRITERIA:**
  - GIVEN una persona con el evento en alcance WHEN lo consulta THEN ve horario, sede, destinatarios, estado y las líneas de historia que le corresponden.
  - GIVEN un evento cancelado o completado WHEN se consulta THEN la historia visible explica lo ocurrido.
  - GIVEN una persona sin el evento en alcance WHEN intenta abrirlo por dirección directa THEN no obtiene el contenido.
- **RELATED BUSINESS RULES:** REQ-INS-011, REQ-COM-009.
- **DEPENDENCIES:** REQ-EVT-007, REQ-IAM-016
- **STATUS:** ACTIVE

### REQ-EVT-024 — Valla de dependencias de la jornada
- **STATEMENT:** No se debe cerrar ni finalizar una estructura o una competencia que tenga dependencias activas, y la valla debe explicar cuál.
- **TYPE:** FUNCTIONAL · **CATEGORY:** DATA_INTEGRITY · **DOMAIN:** EVT (cross: STR, CMP) · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que el cierre de una competencia con inscripciones activas no deje partidos sin respaldo.
- **PRELIMINARY ACTOR:** Admin · Subcommittee
- **SOURCE(S):** PT §16 (`CloseCompetition requiere 0 active entries`; `EndCompetitionEntry participa del ReferenceAdmissionFence`); PT §33; PT §38; FFS F20; S5FLW F20
- **ACCEPTANCE CRITERIA:**
  - GIVEN una competencia con inscripciones activas WHEN se intenta cerrarla THEN la operación es rechazada y explica que hay inscripciones activas.
  - GIVEN una inscripción en uso por un partido WHEN se intenta finalizarla THEN la operación se serializa correctamente contra la creación de nuevas dependencias.
- **RELATED BUSINESS RULES:** REQ-CMP-002, REQ-CMP-003, REQ-STR-006.
- **DEPENDENCIES:** REQ-CMP-002, REQ-CMP-003
- **STATUS:** ACTIVE

---

# 6. REQUERIMIENTOS IN — PRT (Participation)

### REQ-PRT-001 — Responder la propia disponibilidad
- **STATEMENT:** Una persona con rol `PLAYER` vigente debe poder responder la disponibilidad de un evento que la alcanza con una de tres respuestas: sí, quizás o no.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** PRT · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que el club sepa con Who's Quién se cuenta antes de una sesión o un partido.
- **PRELIMINARY ACTOR:** Player
- **SOURCE(S):** PT §3 IN (`Availability`); PT §4 (`Availability: Respuesta previa YES/MAYBE/NO`); PT §5 (`responder propia Availability | ✓ | ✓ | sólo si además PLAYER | sólo si además PLAYER | sólo si además PLAYER`); PT §12; PT §76 (`RF11–12 → Calendar/Availability`); IAR §4.2 (`One-tap RSVP + live count`); FFS F11
- **PRECONDITION:** el evento está `SCHEDULED` (PT §12).
- **ACCEPTANCE CRITERIA:**
  - GIVEN un evento programado que alcanza a una jugadora WHEN responde THEN su respuesta queda registrada con marca de tiempo y es visible en el conteo del evento.
  - GIVEN una jugadora que ya respondió WHEN cambia su respuesta THEN la nueva respuesta sustituye a la anterior.
  - GIVEN un rol sin `PLAYER` vigente WHEN la persona intenta responder por sí misma THEN no puede hacerlo por ese rol (una Subcomisión o un entrenador que no es jugadora no responde su propia disponibilidad).
- **RELATED BUSINESS RULES:** REQ-PRT-003, REQ-PRT-004, REQ-PRT-002.
- **DEPENDENCIES:** REQ-PPL-006, REQ-EVT-017
- **NOTES:** La respuesta de disponibilidad **no** genera notificación (PT §22); ver `REQ-COM-017`.
- **STATUS:** ACTIVE

### REQ-PRT-002 — Responder la disponibilidad de un menor por delegación
- **STATEMENT:** Un guardián cuya relación de representación lo permite debe poder responder la disponibilidad de su menor, y la respuesta debe quedar registrada a nombre del menor.
- **TYPE:** FUNCTIONAL · **CATEGORY:** AUTHORIZATION · **DOMAIN:** PRT (cross: PPL) · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que la disponibilidad de las menores no dependa de que la menor tenga cuenta propia.
- **PRELIMINARY ACTOR:** Guardian / delegated adult
- **SOURCE(S):** PT §5 (`responder por menor | delegación`); PT §20 (`Each GuardianRelationship independently controls … can_respond_availability`); PT §26 `guardian_relationships.can_respond_availability`; PT §76 (`RF11–12`); FIR §D3; FFS F03; S5CAP PG-03
- **PRECONDITION:** la relación tiene `can_respond_availability` vigente.
- **ACCEPTANCE CRITERIA:**
  - GIVEN una relación con permiso de responder WHEN el guardián responde un evento de su menor THEN la respuesta queda asociada al menor y el equipo la ve como respuesta del menor.
  - GIVEN una relación sin ese permiso WHEN el guardián intenta responder THEN la operación no se le ofrece y, si la intenta, es denegada.
  - GIVEN una relación con permiso de responder WHEN el evento no alcanza al menor THEN la operación es rechazada.
- **RELATED BUSINESS RULES:** REQ-PPL-008, REQ-PPL-009, REQ-PRT-004.
- **DEPENDENCIES:** REQ-PPL-008, REQ-PRT-001
- **STATUS:** ACTIVE

### REQ-PRT-003 — Estados derivados de la disponibilidad
- **STATEMENT:** Además de las respuestas persistidas, el sistema debe derivar los estados `NO_RESPONSE` (sin respuesta) y `NEEDS_RECONFIRMATION` (respuesta anterior a un cambio de coordinación posterior).
- **TYPE:** FUNCTIONAL · **CATEGORY:** BUSINESS_RULE · **DOMAIN:** PRT · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Distinguir "no han contestado" de "contestaron antes de que cambiara todo".
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §4 (`Derivados: NO_RESPONSE; NEEDS_RECONFIRMATION`); PT §9 (`Persistido: YES/MAYBE/NO. Derivado: NO_RESPONSE/NEEDS_RECONFIRMATION`); PT §11 (`Availability puede derivar NEEDS_RECONFIRMATION`); PT §14; FFS F08/F11; S5FLW F08
- **ACCEPTANCE CRITERIA:**
  - GIVEN un evento que alcanza a una persona sin respuesta WHEN se consulta THEN su estado derivado es "sin respuesta", que es distinto de "no voy".
  - GIVEN una respuesta registrada antes de un cambio material WHEN el evento cambia de coordinación THEN esa respuesta deriva "necesita reconfirmación".
  - GIVEN un cambio que no afecta la coordinación (por ejemplo, corregir el título) WHEN se consulta la respuesta THEN no deriva "necesita reconfirmación".
  - GIVEN una respuesta registrada después del último cambio de coordinación WHEN se consulta THEN no deriva "necesita reconfirmación".
- **RELATED BUSINESS RULES:** REQ-EVT-011, REQ-EVT-015.
- **DEPENDENCIES:** REQ-PRT-001, REQ-EVT-011
- **NOTES:** La derivación debe basarse en la revisión de coordinación real de cada respuesta, no en un indicador global (defecto detectado en S5FLW B-20/B-31: el cambio de sede invalidaba todas las respuestas con el texto "el horario cambió").
- **STATUS:** ACTIVE

### REQ-PRT-004 — Condiciones de la disponibilidad
- **STATEMENT:** La disponibilidad sólo puede abrirse con el evento `SCHEDULED`; un evento `POSTPONED` conserva las respuestas previas pero no acepta respuesta nueva hasta volver a tener horario vigente.
- **TYPE:** FUNCTIONAL · **CATEGORY:** BUSINESS_RULE · **DOMAIN:** PRT · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que no se pida a la gente confirmar disponibilidad de algo que no tiene fecha.
- **PRELIMINARY ACTOR:** Player · Guardian / delegated adult
- **SOURCE(S):** PT §12 (`Availability nueva sólo con Event SCHEDULED`; `POSTPONED conserva respuestas previas, pero no recibe nueva confirmación hasta volver a schedule válido`); FFS F11
- **ACCEPTANCE CRITERIA:**
  - GIVEN un evento `POSTPONED` WHEN una persona intenta responder THEN la acción no está disponible y el motivo es visible.
  - GIVEN ese mismo evento WHEN vuelve a `SCHEDULED` THEN las respuestas previas siguen presentes y se puede volver a responder.
  - GIVEN un evento `DRAFT` WHEN se intenta responder THEN la acción no está disponible.
- **DEPENDENCIES:** REQ-PRT-001, REQ-EVT-007
- **STATUS:** ACTIVE

### REQ-PRT-005 — Convocatoria: borrador, publicación e historial de revisiones
- **STATEMENT:** Un entrenador con autoridad sobre el evento debe poder preparar una convocatoria como borrador editable y publicarla como una revisión inmutable; las revisiones publicadas no se reescriben.
- **TYPE:** FUNCTIONAL · **CATEGORY:** LIFECYCLE · **DOMAIN:** PRT · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que la lista de convocadas sea un hecho consumable y auditable.
- **PRELIMINARY ACTOR:** Coach
- **SOURCE(S):** PT §3 IN (`Selection`); PT §9 (`Selection: Working draft revision + published immutable revisions`); PT §12 (`Selection publish exige SCHEDULED`); PT §5 (`Selection | Coach: Team/Event`); PT §25 (`selection_sets`, `selection_revisions`, `selection_entries`); PT §32 (`PublishSelection`); PT §71 (`SelectionRevision` como fuente de historia); PT §76; FFS F12; S5FLW F12
- **PRECONDITION:** el evento está `SCHEDULED` y es un partido.
- **ACCEPTANCE CRITERIA:**
  - GIVEN un partido programado WHEN el entrenador prepara y publica una convocatoria THEN queda una revisión publicada con las personas convocadas.
  - GIVEN una revisión publicada WHEN el entrenador publica de nuevo THEN se crea una revisión nueva y la anterior queda intacta.
  - GIVEN un evento no programado WHEN se intenta publicar la convocatoria THEN la operación es rechazada.
  - GIVEN una convocatoria publicada WHEN las personas convocadas la consultan THEN pueden ver su estado de convocatoria.
- **RELATED BUSINESS RULES:** REQ-PRT-006, REQ-PRT-007.
- **DEPENDENCIES:** REQ-EVT-003, REQ-IAM-016
- **NOTES:** El guardado automático del borrador es la única autosave obligatoria del producto (PT §45); ver `REQ-SYS-018`.
- **STATUS:** ACTIVE

### REQ-PRT-006 — La publicación no se bloquea por un conflicto derivado
- **STATEMENT:** La publicación de una convocatoria no debe quedar bloqueada por un conflicto de elegibilidad u otro conflicto actual; debe avisar, explicar el motivo en lenguaje de usuario y permitir registrar la revisión.
- **TYPE:** FUNCTIONAL · **CATEGORY:** BUSINESS_RULE · **DOMAIN:** PRT · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que la decisión de publicar sea del entrenador informado, no una blocage automático que le transfiera una decisión al sistema.
- **PRELIMINARY ACTOR:** Coach
- **SOURCE(S):** PT §14 (`Una Selection publicada no se reescribe retroactivamente`; `Puede derivar hasCurrentConflicts`; `Puede alimentar Home → Necesita tu atención`); PT §12 (única precondición: `SCHEDULED`); PT §32; FF §14 (`Publicar no se bloquea por un conflicto: avisa, explica el motivo en lenguaje humano y deja registrar la revisión`); FIR §D6; FFS F12; IAR §7.3; FGMAP §D-5
- **ACCEPTANCE CRITERIA:**
  - GIVEN una convocatoria con una persona bloqueada por elegibilidad WHEN el entrenador publica THEN la publicación prospera y el conflicto queda derivado y visible.
  - GIVEN ese conflicto WHEN se consulta la convocatoria THEN se explica el motivo en lenguaje de usuario y se ofrece la superficie de revisión de conflictos.
  - GIVEN una convocatoria publicada con conflictos WHEN el entrenador la republica THEN el sistema muestra qué se agregó y qué se quitó respecto de la anterior.
- **RELATED BUSINESS RULES:** REQ-PRT-005, REQ-PRT-007, REQ-CMP-006.
- **DEPENDENCIES:** REQ-PRT-005
- **NOTES:** Resuelve `CON-05` y la decisión `D-5` del plan FGMAP §D-5.
- **STATUS:** ACTIVE

### REQ-PRT-007 — Conflictos actuales de una convocatoria
- **STATEMENT:** El sistema debe derivar si una convocatoria publicada tiene conflictos actuales —por elegibilidad bloqueada o pendiente, por dejar de ser destino del evento o por dejar de estar afiliada al equipo— y debe exponer esos conflictos a quien puede resolverlos.
- **TYPE:** FUNCTIONAL · **CATEGORY:** BUSINESS_RULE · **DOMAIN:** PRT · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que el entrenador sepa, sin relectura manual, qué de lo publicado ya no coincide con la realidad.
- **PRELIMINARY ACTOR:** Coach
- **SOURCE(S):** PT §14 (`hasCurrentConflicts` con `ELIGIBILITY_BLOCKED`, `ELIGIBILITY_PENDING`, `NO_LONGER_EVENT_TARGET`, `NO_LONGER_TEAM_AFFILIATED`; `Puede alimentar Home → Necesita tu atención`); FFS F12; S5FLW F12
- **ACCEPTANCE CRITERIA:**
  - GIVEN una persona convocada que pasa a estar bloqueada por elegibilidad WHEN se consulta la convocatoria THEN aparece el conflicto correspondiente.
  - GIVEN una convocatoria publicada WHEN una persona deja de estar afiliada al equipo THEN aparece el conflicto de afiliación y no la reescribe.
  - GIVEN una convocatoria con conflictos WHEN se abre el inicio del entrenador THEN puede aparecer como elemento que requiere atención.
- **DEPENDENCIES:** REQ-PRT-005, REQ-CMP-006
- **STATUS:** ACTIVE

### REQ-PRT-008 — Guardado automático de la convocatoria
- **STATEMENT:** El borrador de convocatoria debe persistirse automáticamente, con estado de guardado visible, sin que un refresco de fondo pise lo que el usuario está escribiendo.
- **TYPE:** FUNCTIONAL · **CATEGORY:** DATA_INTEGRITY · **DOMAIN:** PRT (cross: SYS) · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que una convocatoria larga no se pierda por un corte o un refresco.
- **PRELIMINARY ACTOR:** Coach
- **SOURCE(S):** PT §45 (`Only mandatory domain autosave`; 600 ms debounce; una sola operación en vuelo; `snapshot + version + idempotencyKey + generation`; estados `SAVED`, `CHANGES_PENDING`, `SAVING`, `SAVE_ERROR`, `CONFLICT`; `Publish waits only for an already in-flight autosave`; `Unsaved local desired state goes directly in PublishSelection`); PT §46 (mutation journal); PT §75; IAR §7.3; S5FLW B-21; FFS F11
- **ACCEPTANCE CRITERIA:**
  - GIVEN un borrador en edición WHEN el usuario deja de escribir THEN se guarda automáticamente y el estado de guardado es visible.
  - GIVEN un borrador en edición WHEN ocurre un refresco de fondo THEN lo que el usuario escribió no se sobrescribe.
  - GIVEN un conflicto de guardado WHEN el usuario publica THEN el sistema le muestra la reconciliación en lugar de perder lodesired.
  - GIVEN un guardado con error WHEN el usuario reintenta THEN el sistema ofrece el reintento y no informa éxito.
- **RELATED BUSINESS RULES:** REQ-SYS-010, REQ-EVT-013, REQ-SYS-016.
- **DEPENDENCIES:** REQ-SYS-010, REQ-SYS-016
- **NOTES:** Los cinco estados y el debounce son requisito de PT §45; el prototipo reproducía sólo tres (S5PIA F-05). El tiempo real de red del autosave está `EVIDENCE_PENDING` (FF §17).
- **STATUS:** EVIDENCE_PENDING

### REQ-PRT-009 — Asistencia: apertura y registro
- **STATEMENT:** Un entrenador con autoridad sobre el evento debe poder abrir la asistencia de un entrenamiento o partido y registrar la presencia de cada persona alcanzada con uno de tres valores: presente, ausente o justificada.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** PRT · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que quede registrado quién estuvo realmente.
- **PRELIMINARY ACTOR:** Coach
- **SOURCE(S):** PT §3 IN (`Attendance`); PT §9 (`Attendance: Sheet OPEN/CLOSED derivado de closed_at. Entries PRESENT/ABSENT/JUSTIFIED`); PT §12 (`Attendance abre en SCHEDULED o IN_PROGRESS`; `aplicabilidad: TRAINING / MATCH`); PT §5 (`Attendance | Coach: Team/Event`); PT §25 (`attendance_sheets`, `attendance_entries`); FFS F13; S5FLW F13
- **ACCEPTANCE CRITERIA:**
  - GIVEN un evento `SCHEDULED` o `IN_PROGRESS` de tipo entrenamiento o partido WHEN el entrenador abre la asistencia THEN la planilla queda abierta.
  - GIVEN una planilla abierta WHEN el entrenador registra un valor para una persona THEN el valor queda persistido inmediatamente.
  - GIVEN una persona sin registro WHEN se consulta THEN su estado es "sin registrar", no "ausente".
  - GIVEN un actor sin autoridad sobre el evento WHEN intenta registrar asistencia THEN el acceso es denegado.
- **RELATED BUSINESS RULES:** REQ-PRT-010, REQ-PRT-011.
- **DEPENDENCIES:** REQ-EVT-017, REQ-IAM-016
- **STATUS:** ACTIVE

### REQ-PRT-010 — "Sin registrar" es un estado distinto de "ausente"
- **STATEMENT:** La ausencia de registro de asistencia debe ser un estado propio y distinguible, y nunca debe convertirse en "ausente"; una planilla puede cerrarse dejando personas sin registrar.
- **TYPE:** FUNCTIONAL · **CATEGORY:** DATA_INTEGRITY · **DOMAIN:** PRT · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que el informe de asistencia no invente ausencias.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §4 (`UNRECORDED derivado por ausencia de row`); PT §9 (`Sin row = UNRECORDED`); PT §24 (`empty != zero != error`); IAR §7.4 (`UNRECORDED distinguido de ausente en todo momento … confundirlos destruye reporting`); FF §14; FFS F13; S5MTX (b64)
- **ACCEPTANCE CRITERIA:**
  - GIVEN una planilla con una persona sin registro WHEN se consulta THEN su estado es "sin registrar".
  - GIVEN una planilla cerrada con personas sin registrar WHEN se consulta el informe de asistencia THEN esas personas no se cuentan como ausentes.
  - GIVEN una planilla cerrada con filas sin registrar WHEN se muestra la planilla THEN el sistema explica que quedaron sin registrar y que no se interpretaron como ausentes.
- **RELATED BUSINESS RULES:** REQ-INS-004, REQ-SYS-011.
- **DEPENDENCIES:** REQ-PRT-009
- **NOTES:** Resuelve `CON-11` (la frase "sin registrar nunca = ausente" de IAR L392 contradecía PT y quedó autocorregida en IAR L735).
- **STATUS:** ACTIVE

### REQ-PRT-011 — Cierre de la asistencia
- **STATEMENT:** Un entrenador con autoridad debe poder cerrar la planilla de asistencia; el cierre es explícito y queda registrado.
- **TYPE:** FUNCTIONAL · **CATEGORY:** LIFECYCLE · **DOMAIN:** PRT · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que quede constancia de cuándo los datos de presencia quedaron cerrados.
- **PRELIMINARY ACTOR:** Coach
- **SOURCE(S):** PT §9 (`Sheet OPEN/CLOSED derivado de closed_at`); PT §12 (`puede cerrar después de COMPLETED`); PT §25 `attendance_sheets.closed_at`; FFS F13; S5FLW B-76
- **ACCEPTANCE CRITERIA:**
  - GIVEN una planilla abierta WHEN el entrenador la cierra THEN queda registrada la marca de cierre y la planilla ya no admite marcaje nuevo sin corrección.
  - GIVEN una planilla cerrada WHEN se consulta THEN su estado es "cerrada", distinguible de "abierta".
- **RELATED BUSINESS RULES:** REQ-PRT-012.
- **DEPENDENCIES:** REQ-PRT-009
- **NOTES:** La reapertura de una planilla cerrada **no** es requisito: PT §12 ya admite correcciones después de `COMPLETED`, de modo que la corrección cubre el caso (ver `CON-13`).
- **STATUS:** ACTIVE

### REQ-PRT-012 — Corrección de asistencia auditada
- **STATEMENT:** Una corrección sobre un valor de asistencia debe exigir motivo, quedar registrada con el valor anterior y el nuevo, con autor y fecha, y quedar visible para quien consulta la asistencia.
- **TYPE:** FUNCTIONAL · **CATEGORY:** HISTORY_AUDIT · **DOMAIN:** PRT · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que un error de registro se pueda arreglar sin perder la traza del error.
- **PRELIMINARY ACTOR:** Coach
- **SOURCE(S):** PT §12 (`admite correcciones auditadas`); PT §71 (`Attendance tables + Audit corrections` como fuente de historia); PT §18/§75 (auditoría); FF §9 (`exige motivo escrito cuando la acción no se puede deshacer`); FF §13; FIR §8; FFS F13; S4IR §8 (P0-2); S5FLW B-87
- **ACCEPTANCE CRITERIA:**
  - GIVEN un valor de asistencia registrado WHEN el entrenador lo corrige indicando el motivo THEN quedan persistidos el valor anterior, el nuevo, el motivo, el autor y la fecha.
  - GIVEN esa corrección WHEN se consulta la asistencia THEN el antes y el después son visibles.
  - GIVEN una corrección sin motivo WHEN se intenta THEN la operación no se completa.
- **RELATED BUSINESS RULES:** REQ-INS-009, REQ-SYS-006.
- **DEPENDENCIES:** REQ-PRT-009, REQ-INS-009
- **NOTES:** El motivo en la corrección es un requisito explícito de FF §9 (más reciente que PT §12, que sólo exigía auditoría). Resuelve `CON-04`.
- **STATUS:** ACTIVE

### REQ-PRT-013 — Resultado de partido: borrador y finalización
- **STATEMENT:** Un entrenador con autoridad sobre el partido debe poder registrar el resultado como borrador y finalizarlo; finalizado, el resultado queda en estado final y la finalización es terminal.
- **TYPE:** FUNCTIONAL · **CATEGORY:** LIFECYCLE · **DOMAIN:** PRT · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que el resultado oficial de un partido quede registrado como tal.
- **PRELIMINARY ACTOR:** Coach
- **SOURCE(S):** PT §3 IN (`MatchRecord: result; observations; fixed player stats; corrections`); PT §9 (`MatchRecord: DRAFT -> FINAL`; `FINAL sólo se corrige explícitamente`); PT §12 (`MatchRecord` aplica a `MATCH`); PT §5 (`MatchRecord/stats | Coach: Team/Event`); PT §32 (`FinalizeMatchRecord`); PT §25; FFS F14; S5FLW F14
- **PRECONDITION:** el ciclo de vida del evento lo permite (PT §15 — ver `REQ-PRT-015`).
- **ACCEPTANCE CRITERIA:**
  - GIVEN un partido cuyo ciclo lo permite WHEN el entrenador registra y finaliza el resultado THEN el resultado queda en estado final.
  - GIVEN un resultado finalizado WHEN se intenta editarlo por la vía normal THEN la operación no está disponible y se ofrece la vía de corrección.
  - GIVEN un partido no habilitado por su ciclo WHEN se intenta registrar el resultado THEN la operación es rechazada.
- **RELATED BUSINESS RULES:** REQ-PRT-014, REQ-PRT-015.
- **DEPENDENCIES:** REQ-EVT-003
- **STATUS:** ACTIVE

### REQ-PRT-014 — Corrección de resultado
- **STATEMENT:** Corregir un resultado ya finalizado debe ser una operación distinta, exigir motivo, y quedar visible en el historial junto con el marcador anterior.
- **TYPE:** FUNCTIONAL · **CATEGORY:** HISTORY_AUDIT · **DOMAIN:** PRT · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que un resultado corregido no borre el resultado que se publicó.
- **PRELIMINARY ACTOR:** Coach
- **SOURCE(S):** PT §9 (`FINAL sólo se corrige explícitamente`); PT §71 (`MatchRecord/Stats` como fuente de historia); FF §9; FF §13; FF §14; FIR §8; FFS F14; S4IR §8 (P0-3)
- **ACCEPTANCE CRITERIA:**
  - GIVEN un resultado finalizado WHEN el entrenador lo corrige indicando el motivo THEN quedan persistidos el marcador anterior, el nuevo, el motivo, el autor y la fecha.
  - GIVEN esa corrección WHEN se consulta el resultado THEN el marcador final es visible junto con la evidencia de la corrección.
- **RELATED BUSINESS RULES:** REQ-PRT-012, REQ-INS-009.
- **DEPENDENCIES:** REQ-PRT-013, REQ-INS-009
- **STATUS:** ACTIVE

### REQ-PRT-015 — Compatibilidad entre resultado y ciclo del evento
- **STATEMENT:** Un resultado `PLAYED` o `FORFEIT` exige que el evento esté `COMPLETED`; un resultado `ABANDONED` exige que el evento esté `ABANDONED`. El resultado no puede fijar un estado que el evento no tiene.
- **TYPE:** FUNCTIONAL · **CATEGORY:** BUSINESS_RULE · **DOMAIN:** PRT (cross: EVT) · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que el resultado y el evento no puedan contar historias distintas.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §15 (`PLAYED/FORFEIT -> Event COMPLETED`; `ABANDONED -> Event ABANDONED`); PT §9 (`IN_PROGRESS -> ABANDONED`); PT §38 (`MATCH_STATE_INCOMPATIBLE`); FFS F14; S5FLW F14
- **ACCEPTANCE CRITERIA:**
  - GIVEN un evento `SCHEDULED` WHEN se intenta registrar un resultado THEN la operación es rechazada con `MATCH_STATE_INCOMPATIBLE`.
  - GIVEN un evento `IN_PROGRESS` WHEN se intenta marcar el resultado como suspendido THEN la operación exige que el evento esté suspendido.
  - GIVEN un evento `ABANDONED` WHEN se consulta THEN no hay resultado oficial.
- **RELATED BUSINESS RULES:** REQ-EVT-007, REQ-PRT-013.
- **DEPENDENCIES:** REQ-EVT-007, REQ-PRT-013
- **NOTES:** Resuelve `CON-12` (el prototipo permitía registrar "Abandonado" sin pasar por el ciclo del evento y dejó `ABANDONED` inalcanzable desde la interfaz).
- **STATUS:** ACTIVE

### REQ-PRT-016 — Estadísticas de partido
- **STATEMENT:** El sistema debe registrar un conjunto fijo de estadísticas por jugadora para los partidos efectivamente jugados, y el número de partidos jugados debe derivarse del registro de resultados, no de la asistencia.
- **TYPE:** FUNCTIONAL · **CATEGORY:** BUSINESS_RULE · **DOMAIN:** PRT · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que el rendimiento se mida sobre participación real registrada.
- **PRELIMINARY ACTOR:** Coach
- **SOURCE(S):** PT §2 (`Estadísticas "otros indicadores" dinámicos → V1 usa set fijo de estadísticas`); PT §15 (`PlayerMatchStats sólo representa participación real registrada en PLAYED`; `matches_played es derivado`; `Attendance != Match participation`); PT §25 `player_match_stats`; PT §76 (`RF09–10`); FGMAM §M1 fila 37; S5FLW B-63
- **ACCEPTANCE CRITERIA:**
  - GIVEN un partido `PLAYED` WHEN se registran estadísticas THEN quedan asociadas a las personas que efectivamente participaron.
  - GIVEN una persona sin participación registrada en un partido WHEN se cuenta sus partidos jugados THEN no se le cuenta ese partido.
  - GIVEN una persona con asistencia `ABSENT` en un partido WHEN se cuenta su participación THEN el dato no se infiere de la asistencia.
- **RELATED BUSINESS RULES:** REQ-PRT-009, REQ-PRT-015, REQ-INS-005.
- **DEPENDENCIES:** REQ-PRT-013
- **NOTES:** No hay motor de estadísticas configurable en V1 (`OUT-CMP-002`). No se inventa una regla de coherencia entre goles y marcador (no hay fuente; IAR/FFS la excluyen explícitamente).
- **STATUS:** ACTIVE

### REQ-PRT-017 — Habilitación como condición de participación
- **STATEMENT:** La habilitación para jugar debe registrarse como un conjunto de restricciones con estado, alcance, origen, motivo y vigencia; el estado "habilitada" debe derivarse de la ausencia de restricciones activas aplicables; nunca debe inferirse desde la disponibilidad.
- **TYPE:** FUNCTIONAL · **CATEGORY:** BUSINESS_RULE · **DOMAIN:** PRT (cross: CMP) · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que la condición de poder jugar sea un dato administrable con su fundamento, no una etiqueta.
- **PRELIMINARY ACTOR:** Subcommittee · Admin
- **SOURCE(S):** PT §13 (`Canonical model: EligibilityConstraint[]`; campos; `A persisted simple enum on Person is NOT the model`; `ELIGIBLE derivado: no applicable active constraint`; `Nunca se infiere desde Availability`); PT §3 IN (`EligibilityConstraint`); PT §5 (`Eligibility mutation: COACH lectura status; SUBCOMMITTEE ✓; ADMIN ✓`); PT §6 (`Eligibility status: COACH scope + SUBCOMMITTEE + ADMIN`; `Eligibility reason/source: SUBCOMMITTEE + ADMIN`); PT §25 `eligibility_constraints`; PT §82 (cambio 4); FIR §D4; FFS F18; FGMAP §D-4; S5CAP B-46
- **ACCEPTANCE CRITERIA:**
  - GIVEN una persona sin restricciones activas aplicables WHEN se consulta su estado THEN es "habilitada".
  - GIVEN una persona con una restricción activa WHEN se consulta su estado THEN es "pendiente" o "bloqueada" según la restricción, y se muestran alcance, origen, motivo y vigencia.
  - GIVEN un entrenador con alcance WHEN consulta el estado THEN ve el estado y no el motivo ni el origen.
  - GIVEN una Subcomisión o un Admin WHEN consulta la restricción THEN ve estado, alcance, origen, motivo y vigencia, y la operación queda auditada.
  - GIVEN una persona que responde que no puede WHEN se calcula su habilitación THEN no se altera.
- **RELATED BUSINESS RULES:** REQ-PPL-011, REQ-PRT-007, REQ-CMP-006.
- **DEPENDENCIES:** REQ-PPL-006, REQ-IAM-016
- **NOTES:** No hay datos clínicos (PT §3 BOUNDARY, PT §13). El prototipo fijaba alcance, origen y motivo a valores constantes (S5PIA F-17) — defecto, no requisito.
- **STATUS:** ACTIVE

### REQ-PRT-018 — Conceptos de participación independientes
- **STATEMENT:** Disponibilidad, convocatoria, asistencia y habilitación son conceptos distintos: ninguna respuesta o registro de uno puede derivarse de otro, y cada uno se presenta y se almacena por separado.
- **TYPE:** FUNCTIONAL · **CATEGORY:** BUSINESS_RULE · **DOMAIN:** PRT · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que "noví" en tres sitios no se mezcle con un solo dato mal interpretado.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §4 (definiciones canónicas de Availability, Selection, Attendance, Eligibility); PT §75 (`Availability != Selection != Attendance != Eligibility`); PT §15 (`Attendance != Match participation`); PT §32 (`No frontend choreography SaveDraft -> Publish to fake atomicity`)
- **ACCEPTANCE CRITERIA:**
  - GIVEN una persona que respondió "sí" a la disponibilidad WHEN se consulta la convocatoria THEN no se la reporta como convoctada por esa respuesta.
  - GIVEN una persona convoctada WHEN se registra su ausencia THEN su disponibilidad previa no se altera.
  - GIVEN una persona con asistencia presente WHEN se consulta su participación en el partido THEN ese dato proviene del resultado, no de la asistencia.
- **RELATED BUSINESS RULES:** REQ-PRT-001, REQ-PRT-005, REQ-PRT-009, REQ-PRT-017.
- **DEPENDENCIES:** REQ-PRT-001, REQ-PRT-005, REQ-PRT-009, REQ-PRT-017
- **STATUS:** ACTIVE

### REQ-PRT-019 — Aplicabilidad por tipo de evento
- **STATEMENT:** La disponibilidad aplica a entrenamientos, partidos y eventos del club; la convocatoria y el resultado sólo a partidos; la asistencia a entrenamientos y partidos.
- **TYPE:** FUNCTIONAL · **CATEGORY:** BUSINESS_RULE · **DOMAIN:** PRT · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que no se ofrezca participación que no aplica al tipo de evento.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §12 (tabla de aplicabilidad); PT §75
- **ACCEPTANCE CRITERIA:**
  - GIVEN un evento de club WHEN se consultan sus superficies THEN no hay convocatoria ni resultado.
  - GIVEN un entrenamiento WHEN se consultan sus superficies THEN hay disponibilidad y asistencia, y no convocatoria ni resultado.
  - GIVEN un partido WHEN se consultan sus superficies THEN están las cuatro.
- **DEPENDENCIES:** REQ-EVT-002, REQ-EVT-003, REQ-EVT-004
- **STATUS:** ACTIVE

---

# 7. REQUERIMIENTOS IN — COM (Communication)

### REQ-COM-001 — Ciclo de vida del comunicado
- **STATEMENT:** Un comunicado oficial debe recorrer el ciclo `DRAFT → PUBLISHED → ARCHIVED`, y sólo la Subcomisión debe poder crearlo, publicarlo y archivarlo.
- **TYPE:** FUNCTIONAL · **CATEGORY:** LIFECYCLE · **DOMAIN:** COM · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que el canal oficial del club tenga un estado inequívoco y una única autoridad.
- **PRELIMINARY ACTOR:** Subcommittee
- **SOURCE(S):** PT §3 IN (`Announcements`); PT §9 (`Announcement: DRAFT -> PUBLISHED -> ARCHIVED`); PT §21; PT §5 (`Announcement oficial | SUBCOMMITTEE: Club`); PT §25 `announcements`; PT §32 (`PublishAnnouncement`); FF §14; FFS F24
- **ACCEPTANCE CRITERIA:**
  - GIVEN un comunicado en borrador WHEN la Subcomisión lo publica THEN queda publicado y su audiencia queda fijada.
  - GIVEN un comunicado publicado WHEN se archiva THEN deja de ser visible para su audiencia.
  - GIVEN un actor distinto de la Subcomisión WHEN intenta crear o publicar un comunicado oficial THEN el acceso es denegado.
- **RELATED BUSINESS RULES:** REQ-COM-002, REQ-COM-003.
- **DEPENDENCIES:** REQ-IAM-016
- **STATUS:** ACTIVE

### REQ-COM-002 — Audiencia del comunicado
- **STATEMENT:** Un comunicado debe dirigido either a todo el club o a un conjunto de equipos; la selección de equipos es un conjunto real y no un texto libre.
- **TYPE:** FUNCTIONAL · **CATEGORY:** BUSINESS_RULE · **DOMAIN:** COM · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que un comunicado para una división no se lea como si fuera para todo el club.
- **PRELIMINARY ACTOR:** Subcommittee
- **SOURCE(S):** PT §21 (`Audience: club-wide; selected Teams`; `"Line A" de UI se resuelve a TEAM_SET`); PT §25 `announcement_target_teams`; FIR §D7; FFS F24; IAR §6 R23
- **ACCEPTANCE CRITERIA:**
  - GIVEN un comunicado dirigido a varios equipos WHEN se publica THEN la audiencia es el conjunto real de esos equipos.
  - GIVEN un comunicado para todo el club WHEN se publica THEN la audiencia es de tipo club.
  - GIVEN una audiencia de equipos WHEN se presenta THEN la identificación de cada equipo es completa.
- **RELATED BUSINESS RULES:** REQ-COM-003, REQ-COM-005.
- **DEPENDENCIES:** REQ-COM-001
- **NOTES:** La lectura "una línea de UI se resuelve a conjunto de equipos" es lo que hace la audiencia auditable; una audiencia como texto libre la vuelve inaplicable. El prototipo la tenía como texto multilínea y notificaba a todos (S5PIA F-23; S5MTX MX-15).
- **STATUS:** ACTIVE

### REQ-COM-003 — Fijación de la audiencia al publicar
- **STATEMENT:** Al publicar un comunicado, la audiencia debe quedar capturada como una instantánea inmutable; las correcciones posteriores no pueden cambiar quién lo recibió.
- **TYPE:** FUNCTIONAL · **CATEGORY:** DATA_INTEGRITY · **DOMAIN:** COM · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que la responsabilidad de "lo vi" quede definida en el momento de la publicación.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §9 (`Published audience immutable`); PT §21 (`Published audience snapshot immutable`); FIR §D7 (`audienceSnapshot` inmutable al publicar); FF §14; FFS F24
- **ACCEPTANCE CRITERIA:**
  - GIVEN un comunicado publicado WHEN se intenta cambiar su audiencia THEN la operación no está disponible y el motivo es visible.
  - GIVEN un comunicado publicado WHEN cambia la afiliación de una persona THEN la audiencia fijada no cambia: la instantánea es histórica.
- **RELATED BUSINESS RULES:** REQ-COM-002, REQ-COM-004.
- **DEPENDENCIES:** REQ-COM-002
- **STATUS:** ACTIVE

### REQ-COM-004 — Corrección de comunicado
- **STATEMENT:** Corregir un comunicado publicado debe exigir un motivo, quedar registrado en auditoría y no alterar su audiencia; si la audiencia era incorrecta, la corrección es un comunicado nuevo.
- **TYPE:** FUNCTIONAL · **CATEGORY:** HISTORY_AUDIT · **DOMAIN:** COM · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que un error en un comunicado oficial se pueda corregir sin romper la verdad de quién lo recibió.
- **PRELIMINARY ACTOR:** Subcommittee
- **SOURCE(S):** PT §21 (`CorrectAnnouncement puede corregir title/body con reason + Audit`; `Audience incorrecto -> Announcement nuevo`); PT §9; PT §71 (`Announcement` como fuente de historia); FF §9; FIR §D7; FFS F24
- **ACCEPTANCE CRITERIA:**
  - GIVEN un comunicado publicado WHEN la Subcomisión corrige título o cuerpo indicando el motivo THEN el cambio queda persistido, auditado y visible para la audiencia.
  - GIVEN esa corrección WHEN se consulta THEN el texto anterior queda disponible en la historia del comunicado.
  - GIVEN un comunicado con audiencia incorrecta WHEN se corrige THEN no se modifica la audiencia: se crea un comunicado nuevo.
- **RELATED BUSINESS RULES:** REQ-COM-003, REQ-INS-009.
- **DEPENDENCIES:** REQ-COM-001, REQ-COM-003
- **NOTES:** No hay "reemplazar por uno nuevo en un solo paso": PT §21 lo define como dos anuncios (FFS F24).
- **STATUS:** ACTIVE

### REQ-COM-005 — Lectura del comunicado restringida a la audiencia
- **STATEMENT:** Un comunicado sólo debe ser legible por las personas alcanzadas por su audiencia, incluso mediante un enlace directo.
- **TYPE:** FUNCTIONAL · **CATEGORY:** AUTHORIZATION · **DOMAIN:** COM · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que la audiencia del comunicado sea un control de acceso y no una etiqueta decorativa.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §21; PT §6 (la audiencia implica PII deClub); FF §2 (`/announcements/:id` = alcanzados por la audiencia); FIR §D7 (`lectura restringida a los alcanzados`); FFS F24; S5FLW F24/B-38/B-39; S5MTX MX-17
- **ACCEPTANCE CRITERIA:**
  - GIVEN un comunicado dirigido a un conjunto de equipos WHEN una persona no alcanzada intenta abrirlo por dirección directa THEN no obtiene su contenido.
  - GIVEN un comunicado publicado WHEN se abre por dirección directa sin autorización THEN la respuesta es la de recurso no disponible, no la de un403 que confirme su existencia.
- **RELATED BUSINESS RULES:** REQ-IAM-016, REQ-COM-002.
- **DEPENDENCIES:** REQ-COM-002
- **NOTES:** PT §34 — un recurso sensible no revelable responde 404, no 403.
- **STATUS:** ACTIVE

### REQ-COM-006 — Conversación directa
- **STATEMENT:** Dos personas deben poder tener una conversación directa; existe como máximo una por par, identificada por un par canónico, y si ya existe el sistema debe abrirla en lugar de crear otra.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** COM · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que la conversación directa sea única y no se fragmente en hilos paralelos.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §20 (DIRECT: `exactamente 2 Persons`; `canonical unordered pair`; `máximo 1 por pair`; `direct_pair_key nullable + partial unique`); PT §3 IN; PT §25 `conversations`; FIR §D7; S4G FDPG-04; FFS F21; S5FLW F21/B-13
- **ACCEPTANCE CRITERIA:**
  - GIVEN dos personas que ya tienen conversación directa WHEN una intenta crear otra con la misma persona THEN el sistema ofrece abrir la existente.
  - GIVEN un intento de crear una segunda conversación directa para el mismo par WHEN se persiste THEN la operación es rechazada por la unicidad del par canónico.
  - GIVEN el orden inverso de las dos personas WHEN se busca la conversación THEN se encuentra la misma.
- **RELATED BUSINESS RULES:** REQ-COM-012, REQ-COM-013.
- **DEPENDENCIES:** REQ-COM-013
- **STATUS:** ACTIVE

### REQ-COM-007 — Conversación de grupo
- **STATEMENT:** Un grupo de conversación requiere al menos dos participantes y un título, y admite varios grupos entre las mismas personas.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** COM · **SCOPE:** IN · **PRIORITY:** P2
- **GOAL:** Que existan conversaciones que no dependan de un equipo o un evento.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §20 (GROUP: `>=2 participants`; `title required`; `múltiples groups entre mismas personas`); PT §9 (`Conversation: ACTIVE -> ARCHIVED`); PT §3 IN (`Group conversation`)
- **ACCEPTANCE CRITERIA:**
  - GIVEN un grupo con menos de dos participantes WHEN se intenta crear THEN la operación es rechazada.
  - GIVEN un grupo sin título WHEN se intenta crear THEN la operación es rechazada.
  - GIVEN dos personas que ya comparten un grupo WHEN se crea otro grupo con las mismas THEN el sistema lo permite.
  - GIVEN una conversación de grupo WHEN se archiva THEN queda archivada.
- **RELATED BUSINESS RULES:** REQ-COM-012.
- **DEPENDENCIES:** REQ-COM-013
- **NOTES:** La gestión de participantes de grupo y "salir del grupo" quedan OUT de V1 (`OUT-COM-002`), aunque PT §20 define el acceso temporal de participantes.
- **STATUS:** ACTIVE

### REQ-COM-008 — Conversaciones canónicas de equipo y de evento
- **STATEMENT:** Un equipo y un evento deben poder tener, cada uno, una conversación canónica que los identifica, y su título debe derivarse del objeto real al que pertenecen.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** COM · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que la conversación de un equipo o de un partido sea siempre la misma y no se confunda con otra.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §20 (TEAM: `0..1 canonical conversation por Team`; `membership sincronizado server-side`; EVENT: `0..1 canonical conversation por Event`; `membership sincronizado server-side`); PT §3 IN; PT §25; FFS F23; IAR §7.5
- **ACCEPTANCE CRITERIA:**
  - GIVEN un equipo WHEN se abre su conversación THEN existe como máximo una y su título deriva del equipo real.
  - GIVEN un evento WHEN se abre su conversación THEN existe como máximo una y su título deriva del evento real, con referencia al objeto.
  - GIVEN un evento reprogramado WHEN se consulta su conversación THEN el título refleja el dato vigente y no uno congelado.
- **RELATED BUSINESS RULES:** REQ-COM-012.
- **DEPENDENCIES:** REQ-STR-004, REQ-EVT-001
- **NOTES:** El prototipo mostraba un título de semilla que "mentía" respecto del evento real (S5FLW F23).
- **STATUS:** ACTIVE

### REQ-COM-009 — Mensajes
- **STATEMENT:** Un participante de una conversación debe poder enviar mensajes, y el envío debe ser una operación explícita que no se informa como exitosa hasta confirmarse.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** COM · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que la conversación sea el canal de coordinación diaria del club.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §3 IN (`Messages`); PT §9 (`Message: SENT -> EDITED -> DELETED`); PT §36 (Communication); PT §47 (`No optimistic confirmed success`); PT §59; FF §12; FFS F21; S5MTX MX-19
- **PRECONDITION:** la persona tiene accesio a la conversación según REQ-COM-013.
- **ACCEPTANCE CRITERIA:**
  - GIVEN un participante WHEN envía un mensaje THEN el mensaje queda persistido y visible para los demás participantes.
  - GIVEN un envío en curso WHEN aún no se ha confirmado THEN la interfaz no afirma que se envió.
  - GIVEN un envío fallido WHEN el usuario reintenta THEN el sistema ofrece el reintento y no duplica el mensaje anterior.
- **RELATED BUSINESS RULES:** REQ-SYS-009, REQ-SYS-016, REQ-COM-017.
- **DEPENDENCIES:** REQ-COM-013
- **NOTES:** El prototipo dibujaba el mensaje como enviado siempre, sin estado de envío ni de fallo (S5MTX MX-19) — falso éxito, prohibido por PT §47.
- **STATUS:** ACTIVE

### REQ-COM-010 — Edición y borrado de mensajes
- **STATEMENT:** Un mensaje propio debe poder editarse o borrarse; el borrado es una marca de tombstone, no una eliminación física, y las acciones irreversibles exigen confirmación con motivo.
- **TYPE:** FUNCTIONAL · **CATEGORY:** LIFECYCLE · **DOMAIN:** COM · **SCOPE:** IN · **PRIORITY:** P2
- **GOAL:** Que rectificar un mensaje no destruya la conversación ni su historia.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §9 (`Message: SENT -> EDITED -> DELETED`; `Delete = tombstone`); PT §28 (Messages sin auto-delete); PT §71 (`Message` como fuente de historia); FF §9; FFS F21
- **ACCEPTANCE CRITERIA:**
  - GIVEN un mensaje propio WHEN se borra THEN queda como marca de tombstone y el histórico de la conversación conserva su posición.
  - GIVEN un borrado de mensaje WHEN se intenta THEN el sistema pide confirmación explicando la consecuencia.
  - GIVEN un mensaje ajeno WHEN se intenta editar o borrar THEN la operación no está disponible.
- **RELATED BUSINESS RULES:** REQ-SYS-006, REQ-INS-011.
- **DEPENDENCIES:** REQ-COM-009
- **NOTES:** El "deshacer genérico" está OUT (`OUT-COM-003`); esto no es deshacer, es ciclo de vida del mensaje con confirmación.
- **STATUS:** ACTIVE

### REQ-COM-011 — Participantes y acceso temporal
- **STATEMENT:** La participación en una conversación debe tener fecha de ingreso y de salida; un ex-participante conserva el acceso a su período autorizado y no al período anterior a su ingreso.
- **TYPE:** FUNCTIONAL · **CATEGORY:** AUTHORIZATION · **DOMAIN:** COM · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que la conversación privada tenga límites temporales verificables.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §20 (`Participants: joined_at; left_at; no acceso a historia anterior a joined_at; ex-participante conserva período autorizado`); PT §26 `conversation_participants`; PT §59 (`Participant temporal access is authoritative`); PT §75 (`private chats not exposed to ADMIN by role`)
- **ACCEPTANCE CRITERIA:**
  - GIVEN una persona que ingresó a una conversación en una fecha WHEN intenta leer mensajes anteriores a esa fecha THEN no los obtiene.
  - GIVEN una persona que salió de una conversación WHEN consulta su historial THEN obtiene lo ocurrido durante su período, no lo posterior.
  - GIVEN un Admin sin participación WHEN intenta leer una conversación privada THEN no obtiene su contenido.
- **RELATED BUSINESS RULES:** REQ-COM-013, REQ-PPL-011.
- **DEPENDENCIES:** REQ-COM-009
- **NOTES:** PT §5 y §6 — el Admin no obtiene acceso automático a conversaciones privadas. La gestión de participantes de grupo es OUT de V1 (`OUT-COM-002`); la regla temporal sigue siendo requisito del modelo.
- **STATUS:** ACTIVE

### REQ-COM-012 — Derecho comunicacional
- **STATEMENT:** El acceso automático a conversaciones existe para `PLAYER`, `CAPTAIN` y `COACH`; el guardián no lo obtiene, y `ADMIN` y `SUBCOMMITTEE` no acceden automáticamente a conversaciones privadas.
- **TYPE:** FUNCTIONAL · **CATEGORY:** AUTHORIZATION · **DOMAIN:** COM · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que "tener el rol" no equivalga a "poder leer todo lo que se escribe".
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §5 (`Direct/Group messages | ADMIN/SUBCOMMITTEE: sólo con entitlement comunicacional`; `ADMIN no obtiene acceso automático a private conversations`); PT §20 (`Automatic Communication entitlement: PLAYER, CAPTAIN, COACH`; `Guardian no entra`); PT §3 BOUNDARY; FF §12; FFS F30
- **ACCEPTANCE CRITERIA:**
  - GIVEN una cuenta `ADMIN` sin participación en una conversación WHEN intenta verla THEN no obtiene su contenido.
  - GIVEN una cuenta de guardián WHEN se determina su navegación THEN el destino de comunicación no aparece.
  - GIVEN una jugadora, capitana o entrenadora WHEN se determina su acceso THEN el accesorio comunicacional está disponible.
- **RELATED BUSINESS RULES:** REQ-COM-011, REQ-PPL-012, REQ-IAM-017.
- **DEPENDENCIES:** REQ-IAM-016, REQ-IAM-017
- **STATUS:** ACTIVE

### REQ-COM-013 — Alcance de los candidatos a participante
- **STATEMENT:** Al crear una conversación, el sistema debe ofrecer como candidatos a las personas que el actor puede legitimately contactar, y debe permitir elegir el tipo antes de elegir las personas porque el tipo determina las reglas.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** COM · **SCOPE:** IN · **PRIORITY:** P2
- **GOAL:** Que crear una conversación no produzca combinaciones imposibles ni una lista arbitraria.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §20; PT §5 (Direct/Group messages); IAR §7.5 (`crear conversación elige tipo primero`); S5FLW B-14
- **ACCEPTANCE CRITERIA:**
  - GIVEN una jugadora WHEN va a crear una conversación THEN los candidatos corresponden a personas con las que puede hablar.
  - GIVEN la pantalla de nueva conversación WHEN se abre THEN el tipo se elige antes que las personas.
- **DEPENDENCIES:** REQ-COM-006, REQ-COM-007
- **NOTES:** El prototipo filtraba candidatos por un campo de rol único, lo que hacía imposible cualquier conversación entre divisiones (S5FLW B-14). El requisito es la corrección de esa fuente, no el filtro concreto.
- **STATUS:** ACTIVE

### REQ-COM-014 — Tipos de notificación
- **STATEMENT:** El sistema debe emitir notificaciones de siete tipos: cambio de evento, evento pospuesto, evento reprogramado, evento cancelado, evento restaurado, convocatoria publicada y comunicado publicado; y debe poder distinguirlas.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** COM · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que el aviso que recibe una persona diga qué pasó.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §22 (`Tipos V1`); PT §26 `notifications.notification_type`; PT §75 (`Notification uses source-time snapshot`); FFS F25; S5FLW B-109; S5PIA (C12: `type de notificación nunca se renderizado`)
- **ACCEPTANCE CRITERIA:**
  - GIVEN un evento que se pospone WHEN se genera la notificación THEN su tipo corresponde a evento pospuesto y es distinguible de uno reprogramado o restaurado.
  - GIVEN una convocatoria publicada WHEN se genera la notificación THEN su tipo corresponde a convocatoria publicada.
  - GIVEN un comunicado publicado WHEN se genera la notificación THEN su tipo corresponde a comunicado publicado.
- **RELATED BUSINESS RULES:** REQ-COM-015, REQ-COM-016.
- **DEPENDENCIES:** REQ-EVT-007, REQ-PRT-005, REQ-COM-001
- **STATUS:** ACTIVE

### REQ-COM-015 — Notificación por alta y por baja en la convocatoria
- **STATEMENT:** Al republicar una convocatoria, el sistema debe notificar a quienes fueron agregados y a quienes fueron quitados.
- **TYPE:** FUNCTIONAL · **CATEGORY:** BUSINESS_RULE · **DOMAIN:** COM · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que nadie se entere de su convocación por ausencia.
- **PRELIMINARY ACTOR:** Player · Guardian / delegated adult
- **SOURCE(S):** PT §22 (`Selection republish compara previous vs new: selectedNow; removedNow`); PT §36; FFS F12
- **ACCEPTANCE CRITERIA:**
  - GIVEN una convocatoria publicada y una nueva revisión WHEN una persona es agregada THEN recibe la notificación de publicación.
  - GIVEN esa nueva revisión WHEN una persona es quitada THEN recibe la notificación correspondiente.
  - GIVEN una persona que permanece en ambas revisiones WHEN se publica THEN no recibe una notificación que no le aporta nada nuevo.
- **DEPENDENCIES:** REQ-PRT-005, REQ-COM-014
- **STATUS:** ACTIVE

### REQ-COM-016 — Notificación por cambio de destinatarios de un evento
- **STATEMENT:** Cuando cambian los destinatarios de un evento, el sistema debe notificar a la unión de la audiencia anterior, la nueva, quienes tengan disponibilidad registrada, la convocatoria publicada y el personal relacionado.
- **TYPE:** FUNCTIONAL · **CATEGORY:** BUSINESS_RULE · **DOMAIN:** COM · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que un cambio de destinatarios no deje sin avisar a quien debía enterarse.
- **PRELIMINARY ACTOR:** Player · Coach · Guardian / delegated adult
- **SOURCE(S):** PT §22 (`Target changes notifican: old audience ∪ new audience ∪ existing Availability ∪ published Selection ∪ relevant staff`); PT §11 (`Notification según política`); FFS F08
- **ACCEPTANCE CRITERIA:**
  - GIVEN un evento cuyos destinatarios cambian WHEN se confirma el cambio THEN se notifica a la unión de las audiencias calculadas según la regla.
  - GIVEN una persona que quedaba fuera y ahora queda dentro WHEN se confirma THEN recibe la notificación.
  - GIVEN una persona que tenía disponibilidad registrada y queda fuera WHEN se confirma THEN recibe la notificación.
- **RELATED BUSINESS RULES:** REQ-COM-014, REQ-EVT-011.
- **DEPENDENCIES:** REQ-EVT-011, REQ-COM-014
- **STATUS:** ACTIVE

### REQ-COM-017 — Hechos que no generan notificación
- **STATEMENT:** El sistema no debe emitir notificación por una respuesta de disponibilidad, por el registro de una asistencia, por el envío de un mensaje ni por una corrección menor de redacción.
- **TYPE:** FUNCTIONAL · **CATEGORY:** BUSINESS_RULE · **DOMAIN:** COM · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que el canal de avisos siga siendo útil y no se llene de ruido.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §22 (`No notification por: Availability response; Attendance entry; Message; typo menor`); PT §2 (`Notificar cualquier cambio → Sólo eventos de alto valor`); FGMAM §M2 flujo G (`§22 parte negativa verificada`)
- **ACCEPTANCE CRITERIA:**
  - GIVEN una respuesta de disponibilidad WHEN se registra THEN no se genera notificación.
  - GIVEN un registro de asistencia WHEN se persiste THEN no se genera notificación.
  - GIVEN el envío de un mensaje WHEN se confirma THEN no se genera notificación adicional.
  - GIVEN una corrección de título de evento WHEN se guarda THEN no se genera notificación.
- **RELATED BUSINESS RULES:** REQ-COM-014.
- **DEPENDENCIES:** REQ-COM-014
- **NOTES:** Esta lista negativa es la que hace de "notificar cualquier cambio" una desviación corregida (PT §2). El recordatorio de disponibilidad queda diferido (`DEF-COM-001`).
- **STATUS:** ACTIVE

### REQ-COM-018 — Notificaciones: audiencia, deduplicación y estado de lectura
- **STATEMENT:** Una notificación debe tener un destinatario, un tipo, una referencia a su recurso, un origen y una fecha de ocurrencia; la combinación de origen, destinatario y tipo no debe repetirse; y debe poder marcarse como leída sin abandonar la lista.
- **TYPE:** FUNCTIONAL · **CATEGORY:** DATA_INTEGRITY · **DOMAIN:** COM · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que la lista de avisos sea una lista, no un registro duplicado ni una trampa de navegación.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §26 (`notifications`: recipient, notification_type, resource, origin_event_id, title/body, occurred_at, created_at, read_at; `Unique logical key: origin_event_id + recipient + type`); PT §36 (`notification list/summary/read`); PT §58 (`Worker never reconstructs historic copy from mutable current state`); FF §12; FFS F25
- **ACCEPTANCE CRITERIA:**
  - GIVEN dos notificaciones con el mismo origen, destinatario y tipo WHEN se generan THEN sólo se materializa una.
  - GIVEN una lista de notificaciones WHEN se marca una como leída THEN el estado persiste sin abandonar la lista.
  - GIVEN una lista con no leídos WHEN se consulta THEN los no leídos se distinguen de los leídos con una sola codificación.
  - GIVEN la lista WHEN se consulta THEN las notificaciones sin leer aparecen antes y su tipo se expresa en lenguaje de usuario.
- **RELATED BUSINESS RULES:** REQ-COM-014, REQ-SYS-009.
- **DEPENDENCIES:** REQ-COM-014
- **NOTES:** "Marcar todas como leídas" como operación propia del prototipo se clasifica `ACCIDENTAL UI` (Audit §9); el estado de lectura por notificación sí es requisito. No hay acuse de lectura de mensajes (`OUT-COM-001`).
- **STATUS:** ACTIVE

---

# 8. REQUERIMIENTOS IN — CMP (Competition)

### REQ-CMP-001 — Competencia: ciclo de vida
- **STATEMENT:** El club debe poder registrar una competencia con nombre, alcance y vigencia, y recorrer el ciclo `DRAFT → ACTIVE → CLOSED`.
- **TYPE:** FUNCTIONAL · **CATEGORY:** LIFECYCLE · **DOMAIN:** CMP · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que las competencias en las que participa el club queden registradas con su identidad y su estado.
- **PRELIMINARY ACTOR:** Admin · Subcommittee
- **SOURCE(S):** PT §3 IN (`Competition`); PT §4 (`Competition`); PT §9 (`Competition: DRAFT -> ACTIVE -> CLOSED`); PT §25 `competitions`; FFS F20
- **ACCEPTANCE CRITERIA:**
  - GIVEN un Admin o una Subcomisión WHEN registra una competencia THEN queda en `DRAFT`.
  - GIVEN una competencia activada WHEN se activa THEN pasa a `ACTIVE`.
  - GIVEN una competencia cerrada WHEN se consulta THEN su estado es `CLOSED` y no admite nuevas inscripciones.
- **DEPENDENCIES:** REQ-IAM-016
- **STATUS:** ACTIVE

### REQ-CMP-002 — Cierre de competencia
- **STATEMENT:** Una competencia sólo puede cerrarse cuando no tiene inscripciones activas; el intento de cierre con inscripciones activas debe ser rechazado indicando la dependencia.
- **TYPE:** FUNCTIONAL · **CATEGORY:** BUSINESS_RULE · **DOMAIN:** CMP · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que no se cierre una competencia que todavía tiene equipos inscritos jugando.
- **PRELIMINARY ACTOR:** Admin · Subcommittee
- **SOURCE(S):** PT §16 (`CloseCompetition requiere 0 active entries`); PT §33; PT §38; FFS F20
- **ACCEPTANCE CRITERIA:**
  - GIVEN una competencia con inscripciones activas WHEN se intenta cerrar THEN la operación es rechazada y se explica que hay inscripciones activas.
  - GIVEN una competencia sin inscripciones activas WHEN se cierra THEN la operación prospera.
- **RELATED BUSINESS RULES:** REQ-EVT-024, REQ-CMP-003.
- **DEPENDENCIES:** REQ-CMP-001, REQ-CMP-003
- **STATUS:** ACTIVE

### REQ-CMP-003 — Inscripción a competencia
- **STATEMENT:** Una inscripción debe registrar la participación de un equipo o de una línea en una competencia, y recorrer el ciclo `PENDING → ACTIVE → ENDED`; debe poder finalizarse indicando su consecuencia.
- **TYPE:** FUNCTIONAL · **CATEGORY:** LIFECYCLE · **DOMAIN:** CMP · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que la participación en una competencia tenga un registro propio y con ciclo de vida.
- **PRELIMINARY ACTOR:** Admin · Subcommittee
- **SOURCE(S):** PT §3 IN (`CompetitionEntry`); PT §4 (`CompetitionEntry: Inscripción de una Line o Team en una Competition`; `Scopes permitidos: LINE, TEAM`); PT §9 (`CompetitionEntry: PENDING -> ACTIVE -> ENDED`); PT §25 `competition_entries`; PT §33 (`EndCompetitionEntry participa del ReferenceAdmissionFence`); FFS F20
- **ACCEPTANCE CRITERIA:**
  - GIVEN una competencia activa WHEN se crea una inscripción THEN queda en `PENDING`.
  - GIVEN una inscripción activada WHEN se activa THEN pasa a `ACTIVE`.
  - GIVEN una inscripción en uso por partidos WHEN se intenta finalizarla THEN la operación se serializa contra la creación de nuevas dependencias.
  - GIVEN una inscripción finalizada WHEN se consulta THEN su estado es `ENDED` y se conserva el histórico.
- **RELATED BUSINESS RULES:** REQ-CMP-004, REQ-EVT-024.
- **DEPENDENCIES:** REQ-CMP-001
- **STATUS:** ACTIVE

### REQ-CMP-004 — Alcances TEAM y LINE de una inscripción
- **STATEMENT:** Una inscripción debe ser de alcance equipo o de alcance línea, y esos dos alcances son distintos: la inscripción de equipo identifica un equipo concreto y la de línea identifica una línea dentro de una división y una temporada.
- **TYPE:** FUNCTIONAL · **CATEGORY:** BUSINESS_RULE · **DOMAIN:** CMP · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que "inscrito" sea una afirmación precisa y no ambigua.
- **PRELIMINARY ACTOR:** Admin · Subcommittee
- **SOURCE(S):** PT §4 (`Scopes permitidos: LINE; TEAM`); PT §16 (TEAM: `Entry.team_id == Match concrete Team`; LINE: `Entry.season_id == Match Team.season_id`; `Entry.line_id == Match Team.line_id`; `Mismatch: 422 COMPETITION_SCOPE_MISMATCH`); PT §25 `competition_entries`; FIR §D4; S4G S4-03; FFS F20; FGMAM §M1 fila 34
- **ACCEPTANCE CRITERIA:**
  - GIVEN una inscripción de alcance equipo WHEN se consulta THEN se identifica el equipo concreto.
  - GIVEN una inscripción de alcance línea WHEN se consulta THEN se identifican división, línea y temporada, y se presenta con su nombre completo.
  - GIVEN una inscripción cuyo alcance no coincide con el equipo del partido WHEN se usa en un partido THEN la operación es rechazada con `COMPETITION_SCOPE_MISMATCH` y el motivo se explica en lenguaje de usuario.
- **RELATED BUSINESS RULES:** REQ-STR-010, REQ-CMP-005.
- **DEPENDENCIES:** REQ-CMP-003, REQ-STR-004
- **NOTES:** El prototipo fusionaba ambos alcances en un único campo (S4G S4-03; S5MTX MX-29) y mostraba "Línea A · 2026" sin división ni temporada.
- **STATUS:** ACTIVE

### REQ-CMP-005 — Uso de la inscripción en un partido
- **STATEMENT:** Un partido debe usar una inscripción de la competencia a la que pertenece; si la jornada tiene competencia asociada, todos sus partidos deben usar inscripciones de esa competencia.
- **TYPE:** FUNCTIONAL · **CATEGORY:** BUSINESS_RULE · **DOMAIN:** CMP (cross: EVT) · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que los resultados de un partido sean comparables dentro de la competencia que corresponde.
- **PRELIMINARY ACTOR:** Coach · Subcommittee
- **SOURCE(S):** PT §16 (`Si Jornada.competition_id existe, Match usa CompetitionEntry de esa Competition`; reglas de alcance); PT §38 (`COMPETITION_SCOPE_MISMATCH`); FFS F15/F20
- **ACCEPTANCE CRITERIA:**
  - GIVEN una jornada con competencia asociada WHEN se agrupan partidos THEN cada partido usa una inscripción de esa competencia y con alcance compatible.
  - GIVEN un partido con una inscripción de otra competencia WHEN se guarda THEN la operación es rechazada.
- **RELATED BUSINESS RULES:** REQ-EVT-018, REQ-CMP-004.
- **DEPENDENCIES:** REQ-CMP-004, REQ-EVT-018
- **STATUS:** ACTIVE

### REQ-CMP-006 — Referencia externa manual
- **STATEMENT:** El club debe poder registrar una referencia externa —identificador o estado oficial— asociada a una competencia, a una inscripción o a un partido, y debe poder consultarla; la referencia es manual y no implica integración automática.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** CMP · **SCOPE:** IN · **PRIORITY:** P2
- **GOAL:** Que el dato federativo oficial quede registrado sin construir una integración.
- **PRELIMINARY ACTOR:** Admin · Subcommittee
- **SOURCE(S):** PT §3 IN (`ExternalReference manual`); PT §26 (`external_references`; `Target whitelist: COMPETITION; COMPETITION_ENTRY; MATCH_EVENT`); PT §5 (`External refs | lectura COACH/SUBCOMMITTEE; ✓ SUBCOMMITTEE/ADMIN`); PT §3 BOUNDARY (`AHBA: referencia oficial/manual; GEI no reemplaza la verdad federativa`); PT §3 OUT (`integración automática AHBA`); FGMAM §M1 fila 33 (`sin ExternalReference`, M-11)
- **ACCEPTANCE CRITERIA:**
  - GIVEN una referencia externa WHEN se registra THEN queda asociada a uno de los objetivos permitidos y no a otro.
  - GIVEN un entrenador WHEN consulta THEN ve la referencia; un Admin o una Subcomisión pueden registrarla y modificarla.
  - GIVEN una referencia externa WHEN se consulta THEN el sistema no afirma que provenga de una fuente sincronizada.
- **RELATED BUSINESS RULES:** REQ-CMP-007.
- **DEPENDENCIES:** REQ-CMP-001, REQ-IAM-016
- **NOTES:** Sin superficie actual → `REQUIREMENT_WITHOUT_CURRENT_SURFACE` (Audit §10). La integración automática está OUT (`OUT-CMP-003`).
- **STATUS:** ACTIVE

### REQ-CMP-007 — Límite de responsabilidad federativa
- **STATEMENT:** GEI debe presentar la información federativa como referencia externa y no como verdad federativa; no debe resolver por sí misma el estado de habilitación ni el resultado oficial.
- **TYPE:** FUNCTIONAL · **CATEGORY:** BUSINESS_RULE · **DOMAIN:** CMP · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que el club no confunda el dato que GEI registra con el dato que la federación define.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §3 BOUNDARY (`AHBA: referencia oficial/manual; GEI no reemplaza la verdad federativa`; `Eligibility médica: sólo status de aptitud/bloqueo`; `Disciplina/federación: constraint/status, no expediente completo`; `External documents: sólo status/referencia`); PT §13 (`No datos clínicos`); PT §3 OUT (`full federation/passes`)
- **ACCEPTANCE CRITERIA:**
  - GIVEN una referencia federativa WHEN se presenta THEN se identifica como referencia y no como estado oficial verificado por el sistema.
  - GIVEN una restricción por motivo médico o disciplinario WHEN se registra THEN se registra estado, motivo y vigencia, sin historia clínica ni expediente.
  - GIVEN una consulta sobre un pase o habilitación oficial WHEN se responde THEN el sistema no la resuelve por sí mismo.
- **RELATED BUSINESS RULES:** REQ-PRT-017, REQ-CMP-006.
- **DEPENDENCIES:** REQ-CMP-006, REQ-PRT-017
- **STATUS:** ACTIVE

### REQ-CMP-008 — Habilitación: alcance y visibilidad
- **STATEMENT:** Una restricción de habilitación debe poder aplicarse al club, a una competencia, a una inscripción o a un evento, y su detalle —origen y motivo— sólo debe ser visible para quien tiene autoridad sobre él.
- **TYPE:** FUNCTIONAL · **CATEGORY:** AUTHORIZATION · **DOMAIN:** CMP (cross: PPL) · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que una restricción tenga el alcance correcto y no se difunda más de lo necesario.
- **PRELIMINARY ACTOR:** Coach · Subcommittee · Admin
- **SOURCE(S):** PT §13 (`Scopes: CLUB; COMPETITION; ENTRY; EVENT`; `Sources: INTERNAL; AHBA; OTHER`; `Reasons: ADMIN; DISCIPLINE; FEDERATION; MEDICAL_CLEARANCE; OTHER`); PT §6 (`Eligibility status: COACH scope + SUBCOMMITTEE + ADMIN`; `Eligibility reason/source: SUBCOMMITTEE + ADMIN`); PT §5; PT §36; FIR §D4
- **ACCEPTANCE CRITERIA:**
  - GIVEN una restricción con alcance de evento WHEN se consulta el evento THEN la restricción aplica a ese evento y no a otros.
  - GIVEN una restricción de alcance de club WHEN se consulta una competencia THEN la restricción también aplica.
  - GIVEN un entrenador WHEN consulta el estado THEN ve el estado y no el motivo ni el origen.
  - GIVEN una Subcomisión o un Admin WHEN consulta la restricción THEN ve origen y motivo, y la mutación queda auditada.
- **RELATED BUSINESS RULES:** REQ-PRT-017, REQ-PPL-011.
- **DEPENDENCIES:** REQ-PRT-017, REQ-IAM-016
- **STATUS:** ACTIVE

---

# 9. REQUERIMIENTOS IN — INS (Search / Reports / Audit)

### REQ-INS-001 — Búsqueda
- **STATEMENT:** Un usuario autenticado debe poder buscar personas, equipos, eventos y divisiones o líneas, y obtener resultados accionables.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** INS · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que el club encuentre una persona o un evento sin navegar la jerarquía.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §3 IN (`Search`); PT §7 (`Search … son proyecciones, no owners`); PT §15 (C15 Search & Reporting); PT §23 (`/search`); PT §76 (`RF20 → Search`); FFS F26; S5FLW F26; FGMAM §M1 fila 6
- **ACCEPTANCE CRITERIA:**
  - GIVEN una consulta que coincide con una persona, un equipo, un evento o una división o línea WHEN se busca THEN aparece el resultado correspondiente.
  - GIVEN una consulta sin coincidencias WHEN se busca THEN el sistema distingue "sin consulta" de "cero resultados" y ofrece un siguiente paso.
  - GIVEN una búsqueda sin criterios WHEN se abre THEN el sistema explica qué se puede buscar, sin inventar resultados.
- **RELATED BUSINESS RULES:** REQ-INS-002, REQ-INS-003.
- **DEPENDENCIES:** REQ-IAM-012
- **NOTES:** PT §2 corrige la desviación "búsqueda por categoría" a "búsqueda por Team / Division / Line".
- **STATUS:** ACTIVE

### REQ-INS-002 — Alcance y PII de la búsqueda
- **STATEMENT:** Los resultados de búsqueda no deben incluir datos personales a los que el actor no tiene autoridad, y la búsqueda debe cubrir la estructura por equipo, división y línea.
- **TYPE:** FUNCTIONAL · **CATEGORY:** PII · **DOMAIN:** INS · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que buscar no se convierta en una vía para ver PII.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §6 (PII Field Authority); PT §2 (`Búsqueda por categoría → Búsqueda por Team / Division / Line`); FFS F26 (`sin PII`); FGMAM §M1 fila 6 (`No cubre Division/Line`, P2-17)
- **ACCEPTANCE CRITERIA:**
  - GIVEN una consulta que coincide con una persona WHEN se buscan resultados THEN los campos mostrados respetan la autoridad por campo del actor.
  - GIVEN una búsqueda de estructura WHEN se busca por división o línea THEN esos resultados aparecen.
- **RELATED BUSINESS RULES:** REQ-PPL-011.
- **DEPENDENCIES:** REQ-INS-001, REQ-PPL-011
- **STATUS:** ACTIVE

### REQ-INS-003 — Estado de la consulta en la navegación
- **STATEMENT:** La consulta de búsqueda debe quedar en la dirección de la navegación, de modo que el botón atrás del navegador devuelva a la misma consulta y el resultado sea compartible.
- **TYPE:** FUNCTIONAL · **CATEGORY:** USABILITY · **DOMAIN:** INS (cross: SYS) · **SCOPE:** IN · **PRIORITY:** P2
- **GOAL:** Que una búsqueda se pueda compartir y no se pierda al navegar.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §24 (`browser Back preserva origen`); PT §41 (`URL/filter | Router + Zod`); FIR §6; FFS F26
- **ACCEPTANCE CRITERIA:**
  - GIVEN una búsqueda con consulta WHEN el usuario navega a un resultado y vuelve atrás THEN la consulta sigue siendo la misma.
  - GIVEN una dirección de búsqueda con consulta WHEN se recarga THEN el resultado se reproduce.
- **DEPENDENCIES:** REQ-SYS-013
- **STATUS:** ACTIVE

### REQ-INS-004 — Informe de asistencia
- **STATEMENT:** El club debe poder consultar un informe de asistencia por equipo y período, que distinga presente, ausente, justificada y sin registrar, y que permita ir al origen de cada dato.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** INS · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que el club pueda ver la asistencia real sin recalcularla a mano.
- **PRELIMINARY ACTOR:** Coach · Subcommittee · Player
- **SOURCE(S):** PT §3 IN (`Attendance Reports`); PT §23 (`/reports/attendance`); PT §5 (`Attendance report | PLAYER: propio/autorizado; CAPTAIN: Team si corresponde; COACH: Team; SUBCOMMITTEE: Club; ADMIN: —`); PT §76 (`RF18–19 → Reports`); FFS F27; S5FLW F27
- **ACCEPTANCE CRITERIA:**
  - GIVEN un entrenador con alcance WHEN consulta el informe THEN ve la asistencia de su equipo en el período elegido.
  - GIVEN una jugadora WHEN consulta el informe THEN ve sus propios registros y no los de otras.
  - GIVEN un Admin WHEN intenta consultar el informe de asistencia THEN el acceso es denegado, conforme a la matriz de autoridad.
  - GIVEN una persona sin registro WHEN se agrega al informe THEN aparece como sin registrar y no como ausente.
  - GIVEN una fila del informe WHEN se consulta THEN existe un enlace al evento y a la planilla de origen.
- **RELATED BUSINESS RULES:** REQ-PRT-010, REQ-INS-006.
- **DEPENDENCIES:** REQ-PRT-009, REQ-INS-006
- **NOTES:** El acceso de `ADMIN` a los informes está excluido por PT §5 de forma explícita: es una de las consecuencias de "ADMIN no es superusuario deportivo". No es un defecto.
- **STATUS:** ACTIVE

### REQ-INS-005 — Informe de rendimiento
- **STATEMENT:** El club debe poder consultar un informe de rendimiento por equipo y período, basado en la participación real registrada en el resultado de los partidos, y que permita ir al origen de cada dato.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** INS · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que el rendimiento se mida sobre lo registrado y sea trazable al partido.
- **PRELIMINARY ACTOR:** Coach · Subcommittee · Player
- **SOURCE(S):** PT §3 IN (`Performance Reports`); PT §23 (`/reports/performance`); PT §5 (`Performance report` con la misma matriz que asistencia); PT §15 (`matches_played es derivado`); PT §76 (`RF18–19 → Reports`); FFS F27
- **ACCEPTANCE CRITERIA:**
  - GIVEN un informe de rendimiento WHEN se calcula THEN los partidos jugados provienen del registro de resultados y no de la asistencia.
  - GIVEN una jugadora WHEN consulta el informe THEN ve sus propios datos.
  - GIVEN una fila del informe WHEN se consulta THEN existe un enlace al partido de origen.
- **RELATED BUSINESS RULES:** REQ-PRT-016, REQ-INS-006.
- **DEPENDENCIES:** REQ-PRT-016, REQ-INS-006
- **STATUS:** ACTIVE

### REQ-INS-006 — Alcance de los informes
- **STATEMENT:** El alcance de un informe debe derivarse de la autoridad del actor —propio, equipo o club— y el filtro de período debe ser explícito, con un valor por defecto declarado.
- **TYPE:** FUNCTIONAL · **CATEGORY:** AUTHORIZATION · **DOMAIN:** INS · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que un informe no muestre más de lo que el actor puede ver ni una período no solicitada.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §5 (matriz de authority de reports); PT §6; PT §7 (Reports = proyección); FIR §6 (Informas: `team, period`); FFS F27; FGMAM §M1 fila 36 (`SUBCOMMITTEE defaultea a un team, no Club`, P2-34)
- **ACCEPTANCE CRITERIA:**
  - GIVEN una jugadora WHEN consulta un informe THEN el alcance es su propio registro.
  - GIVEN una Subcomisión WHEN consulta un informe THEN el alcance por defecto es el club y puede acotarlo a un equipo.
  - GIVEN un informe WHEN se consulta THEN el período aplicado es visible y modificable.
- **RELATED BUSINESS RULES:** REQ-IAM-016.
- **DEPENDENCIES:** REQ-IAM-016
- **STATUS:** ACTIVE

### REQ-INS-007 — Enlace al origen desde los informes
- **STATEMENT:** Cada dato de un informe debe ofrecer un enlace al hecho que lo origina, de modo que el informe permita actuar y no sólo leer.
- **TYPE:** FUNCTIONAL · **CATEGORY:** USABILITY · **DOMAIN:** INS · **SCOPE:** IN · **PRIORITY:** P2
- **GOAL:** Que un informe sea el comienzo de una decisión y no un callejón.
- **PRELIMINARY ACTOR:** Coach · Subcommittee
- **SOURCE(S):** IAR §5 (`Reports = lectura con filtros y defaults`); FIR §5; FFS F27 (`enlace al origen`); S5FLW (A9 "links a origen para actuar")
- **ACCEPTANCE CRITERIA:**
  - GIVEN una fila de informe WHEN se consulta THEN existe un enlace al evento, planilla o resultado que la origina.
  - GIVEN un enlace al origen WHEN el actor no tiene autoridad sobre él THEN el acceso se deniega conforme a la autoridad.
- **DEPENDENCIES:** REQ-INS-004, REQ-INS-005
- **STATUS:** ACTIVE

### REQ-INS-008 — Auditoría: consulta
- **STATEMENT:** Un Admin debe poder consultar el registro de cambios con filtros por rango de fechas y por actor, en modo de sólo lectura.
- **TYPE:** FUNCTIONAL · **CATEGORY:** CAPABILITY · **DOMAIN:** INS · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que el club pueda reconstruir quién cambió qué.
- **PRELIMINARY ACTOR:** Admin
- **SOURCE(S):** PT §3 IN (`Audit`); PT §23 (`/audit`); PT §5 (`Audit | ADMIN`); PT §71 (`Audit: ¿quién modificó qué?`); PT §75; FFS F28; S5FLW F28
- **ACCEPTANCE CRITERIA:**
  - GIVEN un Admin WHEN consulta la auditoría THEN ve las entradas del período y actor indicados.
  - GIVEN un actor sin autoridad de auditoría WHEN intenta abrir la sección THEN el acceso es denegado con explicación.
  - GIVEN la auditoría WHEN se consulta THEN no hay ninguna operación de edición ni de borrado.
- **RELATED BUSINESS RULES:** REQ-INS-010.
- **DEPENDENCIES:** REQ-IAM-016
- **STATUS:** ACTIVE

### REQ-INS-009 — Auditoría: contenido mínimo
- **STATEMENT:** Cada entrada de auditoría debe registrar qué cambió, quién lo cambió, cuándo, con qué motivo cuando la acción lo exige, y un enlace al objeto afectado; y debe tratar los datos sensibles con la redacción definida.
- **TYPE:** FUNCTIONAL · **CATEGORY:** HISTORY_AUDIT · **DOMAIN:** INS · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que el registro de cambios sirva para comprender y no sólo para contar.
- **PRELIMINARY ACTOR:** Admin
- **SOURCE(S):** PT §71 (`Audit: ¿quién modificó qué?`; `Audit sensitive data | ADMIN con redacción`); PT §25 `audit_entries` (`Append-only`); PT §26; FF §9 (motivo en acción no deshacible); FIR §8; FFS F28; S5FLW B-90/B-91/B-92; S5MTX MX-31
- **ACCEPTANCE CRITERIA:**
  - GIVEN una mutación registrada WHEN se consulta la auditoría THEN se ve el valor anterior y el nuevo cuando la acción los tiene.
  - GIVEN una entrada de auditoría WHEN se consulta THEN existe un enlace al objeto sobre el que se hizo el cambio.
  - GIVEN una entrada con dato sensible WHEN la lee un Admin THEN se muestra redactada conforme a la regla de PII.
- **RELATED BUSINESS RULES:** REQ-PRT-012, REQ-PRT-014, REQ-COM-004.
- **DEPENDENCIES:** REQ-INS-008, REQ-PPL-011
- **NOTES:** El prototipo escribía el antes y el después y no lo mostraba (S5PIA F-10; S5MTX MX-07/MX-08), y usaba fechas congeladas (S5FLW B-67).
- **STATUS:** ACTIVE

### REQ-INS-010 — Auditoría: integridad
- **STATEMENT:** El registro de auditoría debe ser de sólo agregado: no admite modificación ni eliminación, y no debe Registrarse información sensible en claro.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** HISTORY_AUDIT · **DOMAIN:** SYS (cross: INS) · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que el registro sea creíble precisamente porque no se puede arreglar.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §26 (`audit_entries. Append-only`); PT §71 (`Never log: password; hash; session token; CSRF; setup code; Cookie; message body; DNI`); PT §75; PT §27 (`JSONB sólo Audit / Outbox / CommandReceipt`)
- **ACCEPTANCE CRITERIA:**
  - GIVEN el registro de auditoría WHEN se intenta modificar o eliminar una entrada THEN la operación no existe.
  - GIVEN una operación sensible WHEN se registra THEN la entrada no contiene contraseñas, hashes, tokens de sesión, tokens CSRF, códigos de activación, cookies, cuerpos de mensaje ni documentos.
- **RELATED BUSINESS RULES:** REQ-SYS-020.
- **DEPENDENCIES:** REQ-INS-009
- **STATUS:** ACTIVE

### REQ-INS-011 — Historia: fuentes visibles
- **STATEMENT:** El usuario debe poder comprender, en la superficie donde corresponde, qué ocurrió y cuándo: el evento, la asistencia, el resultado, las revisiones de convocatoria, el comunicado y el mensaje deben exponer su historia con fecha real, actor y motivo cuando exista.
- **TYPE:** FUNCTIONAL · **CATEGORY:** HISTORY_AUDIT · **DOMAIN:** INS (cross: EVT, PRT, COM) · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que la historia exista para quien la necesita y no sólo en la base de datos.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §71 (`History: ¿qué necesita comprender el usuario?`; `History sources: Events + Audit; Attendance tables + Audit corrections; MatchRecord/Stats; SelectionRevision; Announcement; Message; Audit for administrative changes`); FIR §8; FF §13; FFS F13/F14/F28; S5CAP B-94 (4 de 7 fuentes sin superficie)
- **ACCEPTANCE CRITERIA:**
  - GIVEN una corrección de asistencia WHEN se consulta THEN el antes, el nuevo, el motivo, el autor y la fecha son visibles.
  - GIVEN una corrección de resultado WHEN se consulta THEN el marcador anterior es visible.
  - GIVEN una convocatoria con revisiones WHEN se consulta THEN las revisiones publicadas son accesibles.
  - GIVEN un evento WHEN se consulta THEN sus líneas de historia tienen fecha real y autor.
  - GIVEN un mensaje editado o borrado WHEN se carga THEN el sistema refetch del mensaje exacto en lugar de mostrar la copia cacheada.
- **RELATED BUSINESS RULES:** REQ-INS-009, REQ-SYS-015.
- **DEPENDENCIES:** REQ-INS-009
- **STATUS:** ACTIVE

### REQ-INS-012 — Historia no genérica
- **STATEMENT:** La historia debe derivarse de las entidades que la originan y de la auditoría; el sistema no debe mantener una tabla de historia genérica ni una línea de tiempo personal del usuario.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** HISTORY_AUDIT · **DOMAIN:** SYS · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que la historia sea un hecho derivado y no un almacén paralelo que puede divergir.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §71 (`No generic History table`); PT §29 (`no event sourcing`); PT §75; FF §13 (`No hay timeline genérico`); PT §3 OUT
- **ACCEPTANCE CRITERIA:**
  - GIVEN la historia de un evento WHEN se reconstruye THEN se deriva del evento y de la auditoría, y no de una tabla genérica.
  - GIVEN el perfil de un usuario WHEN se consulta THEN no hay una línea de tiempo personal genérica.
- **RELATED BUSINESS RULES:** REQ-IAM-010, REQ-INS-011.
- **DEPENDENCIES:** REQ-INS-011
- **NOTES:** `history/audit` no es event sourcing: PT §29 lo excluye expresamente. El "historial/audit no es event sourcing" de la lista de decisiones queda confirmado con estas dos fuentes.
- **STATUS:** ACTIVE

---

# 10. REQUERIMIENTOS IN — SYS (Cross-cutting / System quality)

### REQ-SYS-001 — Responsive con significado preservado
- **STATEMENT:** El producto debe funcionar en móvil y en escritorio sin perder significado: los mismos destinos en ambos formatos, agenda antes que mes en móvil, formularios de una columna con acción fija, diálogos a pantalla completa y compositor siempre visible en móvil.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** RESPONSIVE · **DOMAIN:** SYS · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que se pueda usar el producto en la cancha, con una mano, sin perder información.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §1.3 (`responsive`); PT §76 (RNF `responsive`); PT §24 (`responsive conserva significado`); IAR §7.4 (`Mobile-first real`); FF §11; FUX
- **ACCEPTANCE CRITERIA:**
  - GIVEN el producto en un viewport móvil WHEN se recorren todas las superficies THEN no hay desborde horizontal y ninguna información queda oculta detrás de la navegación.
  - GIVEN el producto en escritorio WHEN se recorre THEN la misma información y las mismas acciones están disponibles.
  - GIVEN un formulario en móvil WHEN se abre THEN tiene una columna y una acción fija alcanzable.
  - GIVEN una conversación en móvil WHEN se compone un mensaje THEN el compositor está visible y no queda bajo la navegación.
- **RELATED BUSINESS RULES:** REQ-IAM-017 (mismos destinos), REQ-SYS-002.
- **DEPENDENCIES:** REQ-IAM-017
- **NOTES:** FF §11 registra evidencia runtime a 390, 768 y 1440 px CSS reales con cero desbordes horizontales en 91 capturas. Esa evidencia es del prototipo, no del sistema final.
- **STATUS:** EVIDENCE_PENDING

### REQ-SYS-002 — Objetivos táctiles
- **STATEMENT:** Todo gesto frecuente sobre una lista o un formulario debe tener un objetivo táctil mínimo de 44 px; un control de selección puede ser menor si tiene etiqueta y estado visibles.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** ACCESSIBILITY · **DOMAIN:** SYS · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que registrar la asistencia de una persona no dependa de acertar un botón de 36 px.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** FF §8 (`BUTTON: 44 px`; `Objetivo táctil mínimo: 44 px en todo gesto de roster`); IAR §2 P4; S5MTX MX-06; S5FLW B-62
- **ACCEPTANCE CRITERIA:**
  - GIVEN una fila de asistencia o de roster WHEN se mide el gesto THEN su altura no es menor a 44 px.
  - GIVEN una fila con tres acciones de estado WHEN se mide THEN los gestos no se solapan ni se confunden entre sí.
- **RELATED BUSINESS RULES:** REQ-PRT-009.
- **DEPENDENCIES:** REQ-SYS-001
- **NOTES:** El objetivo proviene de FF §8 / IAR, no de PT. PT §78 reconoce la accesibilidad como evidencia pendiente.
- **STATUS:** ACTIVE

### REQ-SYS-003 — Semántica de controles y gestión de foco
- **STATEMENT:** Las pestañas, los menús, los conmutadores, los campos de formulario y los diálogos deben exponer su semántica y su estado a la tecnología asistiva, gestionar el foco al abrirse y cerrarse, y responder al teclado.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** ACCESSIBILITY · **DOMAIN:** SYS · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que el producto sea operable sin ratón y comprensible con lector de pantalla.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** FF §8 (semántica de `TAB`, `TOGGLE`, `SELECT`, `CHIP`, `MENU`, `EXPANDER`, `DIALOG`, con foco gestionado y cierre con `Escape`); FF §9 (campo con error asociado y foco al primer error); PT §78 (`actual accessibility behavior` = evidencia pendiente); S5PIA (N-03)
- **ACCEPTANCE CRITERIA:**
  - GIVEN un diálogo WHEN se abre THEN el foco queda en el primer control útil, no en el botón de cierre, y queda contenido dentro del diálogo mientras esté abierto.
  - GIVEN un diálogo abierto WHEN se pulsa `Escape` o se hace clic fuera THEN se cierra y el foco vuelve al elemento que lo abrió.
  - GIVEN un conjunto de pestañas WHEN se navega con el teclado THEN el estado de la pestaña activa es identificable por tecnología asistiva.
  - GIVEN un campo con error WHEN se consulta THEN el error está asociado al campo y el foco puede desplazarse al primer campo con error.
- **NOTES:** El nivel de conformidad de accesibilidad no está declarado en ninguna fuente → `REQ-DECISION-NEEDED-02`. Zoom 200 %, auditoría automática y lector de pantalla están declarados pendientes de evidencia en FF §17 (`DEF-SYS-002`).
- **DEPENDENCIES:** REQ-SYS-002
- **STATUS:** EVIDENCE_PENDING

### REQ-SYS-004 — Movimiento solo causal y reducción de movimiento
- **STATEMENT:** El movimiento sólo puede usarse para explicar causalidad —guardado, publicación, cierre, finalización, actualización de fila, apertura de diálogo y lectura de un aviso— y debe desactivarse cuando el usuario expresa una preferencia de movimiento reducido.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** ACCESSIBILITY · **DOMAIN:** SYS · **SCOPE:** IN · **PRIORITY:** P2
- **GOAL:** Que la animación informe y no moleste.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** FF §10 (`Por defecto, ninguno. Sólo se mueve lo que explica causalidad … Duración de 120 a 180 ms. Nunca más de 200 ms … prefers-reduced-motion apaga todo`); IAR §2 P8 (`Motion solo causal`; `NONE por defecto`); S4IR §11
- **ACCEPTANCE CRITERIA:**
  - GIVEN una operación que se guarda WHEN se representa THEN el movimiento, si existe, comunica que algo cambió y no decora.
  - GIVEN una preferencia de movimiento reducido WHEN se usa el producto THEN no hay movimiento no esencial.
- **DEPENDENCIES:** REQ-SYS-003
- **STATUS:** ACTIVE

### REQ-SYS-005 — El estado se escribe, el color acompaña
- **STATEMENT:** Todo estado del dominio debe presentarse escrito en texto; el color nunca sustituye al texto y los indicadores mantienen su significado en modo de alto contraste.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** ACCESSIBILITY · **DOMAIN:** SYS · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que el estado de un evento, una respuesta o una habilitación no dependa de la percepción del color.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** FF §4 (`Todo estado se escribe en texto. El color acompaña, nunca sustituye. Con forced-colors los badges conservan borde`); FF §8; S4IR §6; S4IR §11; S5PIA (UX-07)
- **ACCEPTANCE CRITERIA:**
  - GIVEN un estado de dominio WHEN se presenta THEN su nombre en texto está presente.
  - GIVEN un modo de alto contraste WHEN se presenta un estado THEN sigue siendo identificable.
  - GIVEN un estado desconocido en la presentación WHEN ocurre THEN el sistema no lo mapea silenciosamente a un estado conocido: lo declara como estado a revisar.
- **RELATED BUSINESS RULES:** REQ-SYS-006.
- **DEPENDENCIES:** REQ-SYS-003
- **STATUS:** ACTIVE

### REQ-SYS-006 — Vocabulario de usuario, sin jerga interna
- **STATEMENT:** La interfaz debe usar el vocabulario del club y no los nombres internos de las entidades ni de los mecanismos; ningún nombre técnico de dominio debe ser necesario para completar una tarea.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** USABILITY · **DOMAIN:** SYS · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que una jugadora nueva entienda el producto sin aprender el modelo.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** IAR §2 P1 (`Prohibido exponer en UI: CompetitionEntry, EligibilityConstraint, RoleAssignment, SelectionRevision, AttendanceSheet, EventTarget, coordination_revision, command, idempotency, outbox`); IAR §5; FF §13 (`No hay jerga interna`); S5PIA (UX-37)
- **ACCEPTANCE CRITERIA:**
  - GIVEN una superficie del producto WHEN se revisa THEN no aparecen nombres de entidad interna, de comando ni de mecanismo.
  - GIVEN un estado del dominio WHEN se presenta THEN se usa su nombre en lenguaje de usuario y no su código.
  - GIVEN un motivo de conflicto WHEN se explica THEN se explica en lenguaje de usuario y se ofrece la acción para resolverlo.
- **RELATED BUSINESS RULES:** REQ-SYS-005.
- **DEPENDENCIES:** REQ-SYS-007
- **STATUS:** ACTIVE

### REQ-SYS-007 — Una pregunta dominante y una acción primaria
- **STATEMENT:** Cada superficie debe responder a una pregunta dominante y ofrecer como máximo una acción primaria; el resto de las acciones es contextual o secundaria, y lo peligroso o terminal se separa de lo normal.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** USABILITY · **DOMAIN:** SYS · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que el usuario sepa qué hacer sin leer todas las opciones.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** IAR §2 P6 (`Una acción primaria como máximo`; `Ninguna acción obvia tras tres menús`; `Rows completas tocables donde la row ES la acción`); IAR §5; FF §8 (`La variante primaria es única por pantalla`); FF §9 (verbos reales en las acciones)
- **ACCEPTANCE CRITERIA:**
  - GIVEN una superficie WHEN se revisa THEN tiene una sola acción primaria identificable.
  - GIVEN una acción destructiva o terminal WHEN se presenta THEN está separada de la acción normal y pasa por confirmación.
  - GIVEN una acción WHEN se presenta THEN su etiqueta usa un verbo real de la operación, no un verbo genérico para todo.
- **RELATED BUSINESS RULES:** REQ-SYS-010.
- **DEPENDENCIES:** REQ-SYS-006
- **STATUS:** ACTIVE

### REQ-SYS-008 — Revelación progresiva
- **STATEMENT:** La información debe organizarse por niveles, de lo inmediato a lo raro, de modo que lo excepcional no compita con lo que la persona necesita ahora; y la misma información puede estar en un nivel distinto según quién consulta.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** USABILITY · **DOMAIN:** SYS · **SCOPE:** IN · **PRIORITY:** P2
- **GOAL:** Que la pantalla no presente todo con el mismo peso.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** IAR §2 P5 (`Información por niveles L0–L4`; `L0 INMEDIATA`; `L4 ADMIN/RARE escondido`); IAR §7.2 (`la misma información cambia de L1 a L4 según quién mira`; `gating no decorativo`); IAR §5
- **ACCEPTANCE CRITERIA:**
  - GIVEN una superficie con información frecuente y excepcional WHEN se presenta THEN la excepcional no compite visualmente con la inmediata.
  - GIVEN una persona con menos autoridad WHEN consulta la misma superficie THEN ve menos niveles de información, no los mismos con más restricciones.
- **DEPENDENCIES:** REQ-IAM-016
- **STATUS:** ACTIVE

### REQ-SYS-009 — Sin éxito falso
- **STATEMENT:** El sistema nunca debe afirmar que una operación se completó antes de haberla confirmado, y debe distinguir entre operación confirmada con actualización de vista pendiente y resultado no confirmable.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** DATA_INTEGRITY · **DOMAIN:** SYS · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que el club nunca confíe en un "listo" que no ocurrió.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §47 (`No optimistic confirmed success`); PT §24 (`no fake success`); PT §75; S5MTX MX-05 y MX-19; S5PIA (F-10); S4IR §8 (P0-4)
- **ACCEPTANCE CRITERIA:**
  - GIVEN una mutación en curso WHEN aún no se ha confirmado THEN la interfaz no afirma que se completó.
  - GIVEN una operación confirmada cuya actualización de vista falla THEN el mensaje distingue "cambio guardado" de "no pudimos confirmar el resultado".
  - GIVEN una operación cuyo resultado no se puede confirmar THEN el sistema no informa éxito ni fracaso y ofrece el reintento con la misma intención.
- **RELATED BUSINESS RULES:** REQ-SYS-016, REQ-IAM-020.
- **DEPENDENCIES:** REQ-SYS-016
- **NOTES:** El prototipo confirmaba disponibilidad de forma optimista y dibujaba todo mensaje propio como enviado (S5MTX MX-05 y MX-19).
- **STATUS:** ACTIVE

### REQ-SYS-010 — El error preserva lo ingressado
- **STATEMENT:** Ante un error, el sistema debe preservar lo que la persona ingressó, indicar qué ocurrió y qué puede hacer, y no vaciar el formulario.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** USABILITY · **DOMAIN:** SYS · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que un error de validación no cueste el trabajo hecho.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §24 (`error preserva input`); PT §73 (`500 | preserve input`; `503 | preserve input`); FF §9 (`input preservado ante error`; `estado sucio visible`; `confirmación al descartar`); PT §44
- **ACCEPTANCE CRITERIA:**
  - GIVEN un formulario con datos WHEN la operación falla THEN los datos siguen en el formulario.
  - GIVEN un error de campo WHEN se muestra THEN está junto al campo, indica qué ocurrió y qué hacer.
  - GIVEN un formulario con cambios sin guardar WHEN el usuario intenta descartarlos THEN el sistema pide confirmación.
- **RELATED BUSINESS RULES:** REQ-SYS-017.
- **DEPENDENCIES:** REQ-SYS-003
- **STATUS:** ACTIVE

### REQ-SYS-011 — Vacío, cero y error son estados distintos
- **STATEMENT:** La ausencia de datos, el valor cero y el error de carga deben ser tres estados distintos y distinguibles, y ninguno debe presentarse como otro.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** DATA_INTEGRITY · **DOMAIN:** SYS · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que "0 %" nunca signifique "no hay dato".
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §24 (`empty != zero != error`); PT §4 (`UNRECORDED derivado por ausencia de row`); IAR §7.1; S5PIA (F-26 y UX-43); S5MTX MX-30; FFS F27
- **ACCEPTANCE CRITERIA:**
  - GIVEN una consulta sin resultados WHEN se muestra THEN el estado vacío explica que no hay resultados y ofrece un siguiente paso.
  - GIVEN un valor cero real WHEN se muestra THEN se presenta como cero.
  - GIVEN una carga fallida WHEN se muestra THEN se presenta como error con opción de reintentar y no como cero.
  - GIVEN una métrica sin datos de origen WHEN se calcula THEN no se presenta como 0 %, sino como ausencia de dato.
- **DEPENDENCIES:** REQ-PRT-010
- **STATUS:** ACTIVE

### REQ-SYS-012 — No autorizado se oculta; bloqueado se deshabilita con razón
- **STATEMENT:** Una acción que el actor no puede realizar no debe ofrecerse; una acción que puede realizar pero que está bloqueada por el estado del objeto debe aparecer deshabilitada y con su razón visible; y una sección vacía dentro de un destino permitido se explica en lugar de desaparecer.
- **TYPE:** FUNCTIONAL · **CATEGORY:** AUTHORIZATION · **DOMAIN:** SYS · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que la interfaz diga la verdad sobre lo que se puede y lo que no se puede hacer, y por qué.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §24 (`unauthorized oculto`; `authorized-but-blocked disabled + reason`); PT §40; PT §53; FF §2; FF §15; S5PIA (UX-40)
- **ACCEPTANCE CRITERIA:**
  - GIVEN una acción no autorizada para el actor WHEN se presenta la superficie THEN no aparece.
  - GIVEN una acción autorizada pero bloqueada por el estado del objeto WHEN se presenta THEN aparece deshabilitada y con la razón.
  - GIVEN una sección vacía dentro de un destino permitido WHEN se presenta THEN se muestra explicando que está vacía.
- **RELATED BUSINESS RULES:** REQ-IAM-017.
- **DEPENDENCIES:** REQ-IAM-016, REQ-IAM-017
- **NOTES:** Resuelve `CON-02`. El prototipo anunciaba "Gestión" o "Historial" en el encabezado antes de negar el acceso (S5PIA UX-40).
- **STATUS:** ACTIVE

### REQ-SYS-013 — Navegación del navegador y enlace directo autosuficiente
- **STATEMENT:** El botón atrás del navegador debe devolver al contexto de origen —mes, filtro, pestaña y consulta— y una dirección directa debe ser suficiente para reproducir la vista.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** USABILITY · **DOMAIN:** SYS · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que el producto sea navegable y compartible.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §24 (`browser Back preserva origen`; `direct deep link autosuficiente`); PT §41 (`URL/filter`); PT §23; FIR §6; FFS F05/F26/F27/F28
- **ACCEPTANCE CRITERIA:**
  - GIVEN una pantalla con filtros o pestañas WHEN el usuario navega y vuelve atrás THEN el filtro, la pestaña y la consulta se conservan.
  - GIVEN una dirección directa WHEN se abre THEN la vista se reproduce sin pasos adicionales.
  - GIVEN una dirección directa a un recurso no autorizado WHEN se abre THEN no se revela el recurso.
- **DEPENDENCIES:** REQ-SYS-014
- **NOTES:** El prototipo no tenía estado de filtros en la dirección (`useSearchParams = 0` en todo el código): S5PIA F-04, S5FLW B-108.
- **STATUS:** ACTIVE

### REQ-SYS-014 — Coherencia entre superficies
- **STATEMENT:** Dos superficies que muestran el mismo hecho deben mostrarlo con el mismo valor, derivado de la misma fuente, sin divergencias por caché o por dato congelado.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** DATA_INTEGRITY · **DOMAIN:** SYS · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que la persona nunca reciba dos versiones del mismo hecho.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §7 (proyecciones, no owners); PT §72 (`Realtime never becomes domain truth`; `REST is authoritative`); PT §75 (`Query owns server state`; `no duplicated server truth`; `dirty form never overwritten by background refresh`; `authority loss purges no-longer-authorized cached data`); FF §16
- **ACCEPTANCE CRITERIA:**
  - GIVEN un cambio de dominio WHEN se han cargado varias superficies THEN todas reflejan el valor vigente.
  - GIVEN una pérdida de autoridad WHEN ocurre THEN los datos que ya no están autorizados se purgan de la vista.
  - GIVEN un formulario con cambios locales WHEN ocurre una actualización de fondo THEN lo que la persona escribió no se sobrescribe.
- **RELATED BUSINESS RULES:** REQ-EVT-022.
- **DEPENDENCIES:** REQ-SYS-009
- **STATUS:** ACTIVE

### REQ-SYS-015 — Verdad de la superficie
- **STATEMENT:** Ninguna afirmación visible en pantalla puede carecer de respaldo en el modelo: los conteos se cuentan, las fechas provienen del reloj o del modelo, los nombres se derivan, los estados provienen de su enumeración con texto, y no hay fechas congeladas ni literales de conteo en la capa de presentación.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** DATA_INTEGRITY · **DOMAIN:** SYS · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que la interfaz diga siempre la verdad sobre el estado del club.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** FF §16; IAR §8 (`Ningún TARGET funciona sin reloj real`; `ningún literal de seed en UI fuera de harness DEV`); S5PIA (F-08, F-10, UX-34); S5MTX (MX-12, MX-21); S5FLW B-58 y B-67; FGMAM §M8 (11 literales duplicados)
- **ACCEPTANCE CRITERIA:**
  - GIVEN un conteo mostrado WHEN se inspecciona su origen THEN se calcula a partir de un conjunto real y no es un literal.
  - GIVEN una fecha mostrada WHEN se inspecciona su origen THEN proviene del reloj o del modelo y no es una etiqueta relativa escrita a mano.
  - GIVEN un nombre de equipo mostrado WHEN se inspecciona su origen THEN se deriva de temporada, división y línea.
- **RELATED BUSINESS RULES:** REQ-STR-010, REQ-SYS-011.
- **DEPENDENCIES:** REQ-SYS-009
- **NOTES:** El prototipo no cerraba este punto: 11 literales duplicados, conteos de impacto fabricados y fechas de auditoría congeladas. Eran defectos, no requisitos. El arnés de desarrollo con literales no es producto.
- **STATUS:** ACTIVE

### REQ-SYS-016 — Idempotencia de las órdenes
- **STATEMENT:** Una intención de negocio debe corresponder a una sola orden; un reintento de una orden ambigua debe usar la misma clave y la misma carga, una clave con carga distinta debe rechazarse, y una orden corregida o nueva debe usar una clave nueva.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** RELIABILITY · **DOMAIN:** SYS · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que un corte de red no produzca dos avisos ni una doble convocatoria.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §31 (`Idempotency-Key: UUID`; replay del resultado; `409 IDEMPOTENCY_KEY_REUSED`; `Receipt replay recovers a past committed result; it is not a new command`); PT §75 (`ambiguous retry same key/payload`; `no duplicate logical command`); PT §46 (Mutation journal sin payload ni PII, TTL 24h, sin reejecución ciega tras el TTL); PT §38
- **ACCEPTANCE CRITERIA:**
  - GIVEN una orden ambigua WHEN se reintenta con la misma clave y la misma carga THEN el sistema devuelve el resultado ya confirmado y no ejecuta dos veces.
  - GIVEN una clave ya usada WHEN se envía una carga distinta THEN la operación es rechazada con `IDEMPOTENCY_KEY_REUSED`.
  - GIVEN una orden ambigua tras vencer el plazo de 24 h WHEN se reintenta a ciegas THEN el sistema no lo hace.
- **DEPENDENCIES:** REQ-IAM-020, REQ-SYS-009
- **STATUS:** ACTIVE

### REQ-SYS-017 — Concurrencia optimista
- **STATEMENT:** Toda mutación debe poder declarar la versión sobre la que se decidió, y una desalineación de versión debe producir un conflicto explícito en lugar de una sobrescritura.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** DATA_INTEGRITY · **DOMAIN:** SYS · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que dos personas no se pisen sin avisarse.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §30 (`check expectedVersion`); PT §38 (`STALE_VERSION`); PT §44 (`baselineVersion`; `409 preserves`; `No generic force overwrite`); PT §75 (`root version protects mutable aggregates`; `no last-write-wins`); PT §26 (`version` en raíces mutables); PT §33
- **ACCEPTANCE CRITERIA:**
  - GIVEN una mutación con versión esperada WHEN la versión del recurso cambió THEN la operación es rechazada con `STALE_VERSION`.
  - GIVEN un conflicto THEN el sistema conserva la base, el borrador local y la versión del servidor, y no ofrece una sobrescritura genérica.
- **RELATED BUSINESS RULES:** REQ-EVT-013, REQ-SYS-010.
- **DEPENDENCIES:** REQ-SYS-010
- **NOTES:** Toda mutación necesita regla de concurrencia (PT §77). El bulk de jornada omitía la versión esperada (S5FLW B-29) — defecto.
- **STATUS:** ACTIVE

### REQ-SYS-018 — Una orden, una transacción
- **STATEMENT:** Una intención de negocio debe resolverse en una sola operación transaccional del sistema; el cliente no debe coordinar una transacción de negocio ni simular atomicidad mediante pasos de guardado y publicación.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** DATA_INTEGRITY · **DOMAIN:** SYS · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que no existan estados intermedios que el usuario pueda observar como definitivos.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §72 (`Frontend never coordinates an atomic business transaction`); PT §32 (`When user confirms terminal/published state, command receives exact final intended draft`; `No frontend choreography SaveDraft -> Publish to fake atomicity`); PT §75 (`one user business intention -> one Public Command`; `terminal transition persists final draft atomically`; `no frontend pseudo-transactions`); PT §30
- **ACCEPTANCE CRITERIA:**
  - GIVEN una transición a estado terminal o publicado WHEN el usuario la confirma THEN el estado final queda persistido en esa misma operación.
  - GIVEN un intento de guardar y luego publicar como si fueran atómicos THEN el sistema no expone esa coreografía.
- **DEPENDENCIES:** REQ-SYS-016
- **STATUS:** ACTIVE

### REQ-SYS-019 — Proyecciones con un único dueño de escritura
- **STATEMENT:** El inicio, el calendario, la vista de equipo, la búsqueda y los informes son proyecciones: no son dueños de ningún dato y no admiten escritura propia.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** DATA_INTEGRITY · **DOMAIN:** SYS · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que no existan dos verdades para el mismo hecho.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §7 (`Home, Calendar, Team View, Search y Reports son proyecciones, no owners`); PT §75 (`one write owner per domain truth`; `DB backs structural impossibilities`); PT §8 (ownership domains); PT §29 (`Cross-domain Query Layer is read-only`)
- **ACCEPTANCE CRITERIA:**
  - GIVEN una proyección WHEN se inspecciona THEN no existe una operación que escriba el dato que muestra.
  - GIVEN un dato de dominio WHEN se determina su dueño THEN es único y explícito.
- **DEPENDENCIES:** REQ-SYS-014
- **STATUS:** ACTIVE

### REQ-SYS-020 — Protección de datos en registros
- **STATEMENT:** El sistema no debe escribir en registros técnicos contraseñas, hashes, tokens de sesión, tokens CSRF, códigos de activación, cookies, cuerpos de mensaje ni documentos de identidad.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** SECURITY · **DOMAIN:** SYS · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que un registro técnico no se convierta en una segunda copia de la PII.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §71 (`Never log: password; hash; session token; CSRF; setup code; Cookie; message body; DNI`); PT §75 (Security)
- **ACCEPTANCE CRITERIA:**
  - GIVEN cualquier registro técnico WHEN se inspecciona THEN no contiene los tipos de dato prohibidos.
  - GIVEN un registro de auditoría WHEN se inspecciona THEN los datos sensibles aparecen redactados.
- **RELATED BUSINESS RULES:** REQ-INS-010, REQ-PPL-011.
- **DEPENDENCIES:** REQ-INS-010
- **STATUS:** ACTIVE

### REQ-SYS-021 — Transporte y almacenamiento seguro
- **STATEMENT:** El sistema debe servirse únicamente sobre transporte cifrado, no debe exponer la base de datos al cliente, y los recursos estáticos publicados no deben contener datos privados del club.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** SECURITY · **DOMAIN:** SYS · **SCOPE:** IN · **PRIORITY:** P0
- **GOAL:** Que el producto sirva sin exponer datos.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §34 (`HTTPS`; `no direct frontend DB`); PT §1.3 (`HTTPS`; `backups`); PT §62 (`App HTML same-origin`; `Asset bucket holds no private GEI data`); PT §76 (RNF `HTTPS`; `secure DB`)
- **ACCEPTANCE CRITERIA:**
  - GIVEN cualquier acceso al sistema WHEN se inspecciona el transporte THEN es cifrado.
  - GIVEN el cliente WHEN se inspecciona THEN no accede a la base de datos.
  - GIVEN los recursos publicados WHEN se inspeccionan THEN no contienen datos privados del club.
- **DEPENDENCIES:** REQ-IAM-006
- **STATUS:** ACTIVE

### REQ-SYS-022 — Disponibilidad, respaldo y recuperación
- **STATEMENT:** El servicio debe estar disponible 24/7 salvo ventanas de mantenimiento, debe contar con respaldo diario verificado y con una restauración probada periódicamente.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** OPERATIONAL · **DOMAIN:** SYS · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que el club no pierda la operación de la temporada por una falla.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §76 (RNF `24/7 except maintenance`; `daily backup`; `secure DB`); PT §66 (PITR, `daily pg_dump`, 30 días, cifrado, verificación remota, checksum, latido de frescura, alerta crítica sin respaldo exitoso en 26 h, restauración mensual probada); PT §1.3 (`backups`)
- **ACCEPTANCE CRITERIA:**
  - GIVEN el servicio en operación WHEN ocurre una falla de una instancia THEN el servicio sigue disponible sin intervención.
  - GIVEN el respaldo diario WHEN se ejecuta THEN queda verificado externamente y su frescura es observable.
  - GIVEN una restauración WHEN se ejecuta THEN se valida antes de poner el servicio en operación.
- **STATUS:** EVIDENCE_PENDING

### REQ-SYS-023 — Rendimiento de consultas comunes
- **STATEMENT:** Las consultas comunes del producto deben completarse en 3 segundos o menos, y el sistema debe sostenerse con 100 usuarios autenticados concurrentes.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** PERFORMANCE · **DOMAIN:** SYS · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que el club no espere para ver la asistencia de un equipo.
- **PRELIMINARY ACTOR:** Authenticated user
- **SOURCE(S):** PT §1.3 (`tiempos comunes <=3 s`; `100 usuarios concurrentes`); PT §68 (`common queries <=3 s`; objetivos internos; conjunto de estrés; `Load: k6, 100 concurrent authenticated users, 15 min`; `Evidence remains pending until implementation`); PT §76; PT §78
- **ACCEPTANCE CRITERIA:**
  - GIVEN el conjunto de estrés definido WHEN se ejecuta la carga representativa con 100 usuarios autenticados durante 15 minutos THEN las consultas comunes se mantienen en 3 s o menos.
  - GIVEN esa ejecución WHEN se mide THEN no hay errores de integridad ni de autorización.
- **NOTES:** PT §78 — la evidencia queda pendiente hasta la implementación; es una laguna de evidencia, no de especificación. El presupuesto por endpoint de PT §63 es arquitectura y no se reintroduce aquí.
- **STATUS:** EVIDENCE_PENDING

### REQ-SYS-024 — Latencia de notificación
- **STATEMENT:** Una notificación disparada por un hecho del dominio debe llegar al destinatario en 1 minuto o menos desde que el hecho se confirma.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** PERFORMANCE · **DOMAIN:** SYS (cross: COM) · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que un aviso de reprogramación llegue antes de que la jugadora salga de casa.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §1.3 (`notificaciones <=1 minuto`); PT §76 (RNF `notification <=1m`); PT §58; PT §78; PT §69 (`Notification latency` como métrica observada)
- **ACCEPTANCE CRITERIA:**
  - GIVEN un hecho que dispara notificación WHEN se confirma el hecho THEN la notificación se materializa y se entrega dentro del plazo de 1 minuto.
  - GIVEN un retraso en la entrega WHEN ocurre THEN el retraso es observable y genera alerta.
- **RELATED BUSINESS RULES:** REQ-COM-014, REQ-SYS-025.
- **DEPENDENCIES:** REQ-SYS-025
- **STATUS:** EVIDENCE_PENDING

### REQ-SYS-025 — Efectos asíncronos durables
- **STATEMENT:** Un efecto asíncrono con consecuencias durables debe ejecutarse a partir de la confirmación de la verdad de dominio, ser reintentable de forma idempotente y no ser requisito para la corrección del sistema.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** RELIABILITY · **DOMAIN:** SYS · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que un fallo en el envío de una notificación no pueda deshacer un cambio confirmado ni hacerlo perder.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §58 (`one OutboxEvent transaction`; `atomic fanout`; `idempotent handler`; `Worker never reconstructs historic copy from mutable current state`); PT §75 (`durable async effect uses Outbox`; `realtime not required for correctness`; `Notification uses source-time snapshot`); PT §55; PT §72
- **ACCEPTANCE CRITERIA:**
  - GIVEN un hecho de dominio confirmado WHEN el efecto asíncrono falla THEN el hecho permanece confirmado y el efecto queda pendiente de reintento.
  - GIVEN un efecto asíncrono WHEN se reintenta THEN no produce duplicados.
  - GIVEN una pista de actualización en tiempo real duplicada, reordenada o perdida WHEN llega THEN el sistema sigue siendo correcto.
  - GIVEN una notificación WHEN se materializa THEN su texto se reconstruye con los datos del momento del hecho y no con los valores actuales mutables.
- **RELATED BUSINESS RULES:** REQ-COM-018, REQ-SYS-024.
- **DEPENDENCIES:** REQ-SYS-009
- **STATUS:** ACTIVE

### REQ-SYS-026 — Evolución compatible
- **STATEMENT:** La evolución del sistema debe ser compatible hacia adelante: las respuestas de la interfaz no deben romper a clientes previos, y las respuestas de esquema deben ser legibles por versiones previas y posteriores del producto.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** RELIABILITY · **DOMAIN:** SYS · **SCOPE:** IN · **PRIORITY:** P2
- **GOAL:** Que actualizar el sistema no rompa la operación del club.
- **PRELIMINARY ACTOR:** System
- **SOURCE(S):** PT §35 (`API responses are additive-compatible`; `Breaking changes require v2 or coordinated migration`; `Rolling compatibility`; `New API capabilities deploy backend-first`); PT §65 (`expand -> deploy -> backfill -> deploy -> contract`; `forward-only production`; `Outbox payloads are versioned`); PT §75 (Deployment); PT §42
- **ACCEPTANCE CRITERIA:**
  - GIVEN una versión anterior del producto WHEN se despliega una capacidad nueva THEN sigue funcionando sin romperse.
  - GIVEN un despliegue en curso WHEN hay versiones coexistiendo THEN la compatibilidad se mantiene durante la transición.
- **NOTES:** Es un requisito de continuidad operativa. La elección concreta de pila y topología ya está congelada en PT §60–§61 y no se revisa en E1.
- **STATUS:** ACTIVE

### REQ-SYS-027 — Puerta externa de privacidad
- **STATEMENT:** El cumplimiento de la normativa de protección de datos requiere, además de los controles técnicos del producto, decisiones de organización fuera del sistema: responsable del tratamiento, aviso de privacidad, finalidades, base legal, política de retención, solicitudes de acceso, rectificación, supresión y evaluación de transferencias.
- **TYPE:** NON-FUNCTIONAL · **CATEGORY:** PROJECT_CONSTRAINT · **DOMAIN:** SYS · **SCOPE:** IN · **PRIORITY:** P1
- **GOAL:** Que la conformidad legal no se confunda con haber cerrado los controles técnicos.
- **PRELIMINARY ACTOR:** Club member (organización)
- **SOURCE(S):** PT §79 (`Status: TECHNICAL CLOSED / ORGANIZATIONAL EXTERNAL`); PT §28 (`Privacy retention/deletion: EXTERNAL policy`); PT §76 (RNF `privacy`); PT §1.3 (`privacidad`)
- **ACCEPTANCE CRITERIA:**
  - GIVEN el sistema en producción WHEN se revisa la conformidad THEN los controles técnicos están verificados y las decisiones de organización están identificadas con su responsable.
  - GIVEN una solicitud de acceso, rectificación o supresión WHEN se recibe THEN existe un proceso definido fuera del sistema para atenderla.
- **DEPENDENCIES:** REQ-SYS-020, REQ-SYS-021
- **NOTES:** No bloquea E1: PT §79 ya la declara externa y PT §28 la remite a política externa. No se inventa requisito legal sin fuente.
- **STATUS:** EXTERNAL

---

# 11. REQUERIMIENTOS DEFER

| ID | Statement | Fuente | Motivo del diferimiento | Condición de revisión |
|---|---|---|---|---|
| `DEF-IAM-001` | Preferencias de notificación por persona | `FF §17` | No hay comando ni modelo en PT §25/§26; ninguna fuente lo exige. | Decisión de producto registrada y modelo de preferencias. |
| `DEF-COM-001` | Recordatorio automático de disponibilidad a quien no respondió | `S4G FDPG-02` (`DEFERRED`); `IAR §9 FDPG-02`; `FF §17`; `FFS F30` | PT §22 cierra los tipos de notificación V1; un recordatorio tocaría PT §22. | Revisión explícita de PT §22 y decisión sobre si es tipo nuevo o acción coordinativa. |
| `DEF-COM-002` | Silenciar conversaciones | `S4G FDPG-03` (`DEFERRED`); `FF §17`; `FFS F30` | PT §20 define participantes pero no silenciar. | Decisión de producto y modelo de preferencia por conversación. |
| `DEF-COM-003` | Menciones en mensajes | `S4G FDPG-03`; `IAR §9 FDPG-03`; `FF §17` | Sin fuente en PT §20 ni PT §22. | Modelo de menciones y reglas de notificación. |
| `DEF-COM-004` | Respuestas anidadas a mensajes | `S4G FDPG-03`; `FF §17`; `FFS F30` (`fueron explícitamente diferidos`) | Sin fuente en PT §20 ni PT §25. | Decisión de producto sobre el modelo de hilo. |
| `DEF-EVT-001` | Generación automática de las fechas de una jornada | `FF §17` (`motorizado de jornadas`); `FFS F15` (`no está en Freeze`) | PT §16 define agrupación, no un generador de fechas. | Decisión de producto sobre las reglas de calendario. |
| `DEF-PRT-001` | Flujo de justificación de asistencia con aprobación | `FFS F13` (`no un workflow de justificación con approval, que Freeze §12 no define`) | PT §12 no define el flujo; `JUSTIFIED` existe como valor, no el flujo. | Decisión de producto sobre quién aprueba y con qué registro. |
| `DEF-PRT-002` | Recordatorio al guardián de una respuesta pendiente del menor | `FF §17`; derivado de `DEF-COM-001` | Misma razón que el recordatorio de disponibilidad. | Junto con `DEF-COM-001`. |
| `DEF-STR-001` | Restauración de una división archivada | `FFS F19` la da por cerrada con archivar y restaurar; PT §19 no la define | PT §19 define archivo sin transición inversa. | `REQ-DECISION-NEEDED-01`. |
| `DEF-STR-002` | Restauración de una línea archivada | Ídem | Ídem | `REQ-DECISION-NEEDED-01`. |
| `DEF-SYS-001` | Exportación de datos e informes | `FF §17`; `FFS F27/F28` | PT §36 Insight no incluye export; PT §28 no define retención de exportaciones. | Decisión de producto sobre formato, alcance y datos sensibles. |
| `DEF-SYS-002` | Zoom 200 %, auditoría automática de accesibilidad y lector de pantalla como evidencia de conformidad | `FF §17` (`Pendiente de evidencia y declarado … No se declaran PASS`) | No es una capacidad ausente: es evidencia pendiente de una capacidad ya requerida. | Cierre de `REQ-SYS-003` con evidencia real. |
| `DEF-SYS-003` | Tiempos de red reales del guardado automático de convocatoria | `FF §17`; `FFS F11` | El flujo de usuario es completo; falta la medición con latencia real. | Cierre de `REQ-PRT-008` con evidencia real. |
| `DEF-CMP-001` | Ampliación del conjunto de estadísticas de partido | PT §2 (V1 usa set fijo); `FF §17` (`motor de estadísticas`) | PT §2 fija el conjunto; ampliarlo requiere decisión de producto. | Revisión de PT §2. |

---

# 12. ELEMENTOS OUT DE V1

| ID | Statement | Fuente | Motivo |
|---|---|---|---|
| `OUT-IAM-001` | Ingreso con proveedor externo (OAuth, Google, Microsoft) | PT §3 OUT | Excluido explícitamente. |
| `OUT-IAM-002` | Verificación en dos pasos (MFA) y passkeys | PT §3 OUT | Excluido explícitamente. |
| `OUT-IAM-003` | Recuperación de contraseña por la propia persona | PT §3 OUT (`self-service "olvidé mi contraseña"`); PT §51 (el reset es administrativo); `FF §17` | El camino vigente es el restablecimiento administrativo o contactar al club. |
| `OUT-PPL-001` | Tratar a la persona como "categoría" en lugar de por equipo | PT §2; PT §75 | Desviación corregida por el propio PT. |
| `OUT-PPL-002` | Eliminar permanentemente a una jugadora | PT §2; PT §75 | La historia con significado no se elimina. |
| `OUT-STR-001` | Reserva de canchas o sedes | PT §3 OUT | Excluido explícitamente. |
| `OUT-EVT-001` | Funcionamiento sin conexión (offline-first) y sincronización | PT §3 OUT; FF §14 | Excluido explícitamente. |
| `OUT-EVT-002` | Adjuntos de acta y fotografías del partido | `FF §17`; `FFS F30` (`Freeze §25 no los define para V1`) | Sin fuente en PT §25. |
| `OUT-EVT-003` | Generador automático de fechas de jornada | `FF §17`; `FFS F15` | Sin fuente en PT §16. Reaparece como `DEF-EVT-001`. |
| `OUT-PRT-001` | Historia clínica completa | PT §3 OUT y BOUNDARY; PT §13 (`No datos clínicos`) | Sólo estado de aptitud o bloqueo. |
| `OUT-PRT-002` | Expediente disciplinario o de salvaguardia | PT §3 OUT (`safeguarding/casos sensibles`); PT §3 BOUNDARY | Sólo estado, motivo y vigencia. |
| `OUT-COM-001` | Confirmaciones de lectura de mensajes y acuse genérico de comunicados | `FF §17`; `FIR §D7` (`No existe acuse "Entendido" genérico`); `FFS F24`; PT §21/§25/§26 (no existe campo ni tabla de acuse) | Sin fuente en PT; la decisión más reciente lo excluye explícitamente. |
| `OUT-COM-002` | Gestión de participantes de grupo y salida del grupo | `FF §17`; `FFS F22` (`Freeze §20 no define el comando ni sus estados de salida para V1`) | Sin comando definido en PT §20. |
| `OUT-COM-003` | Deshacer genérico de acciones | `FF §17` | Excluido explícitamente. |
| `OUT-CMP-001` | Cuotas y contabilidad, y gestión financiera | PT §3 OUT | Excluido explícitamente. |
| `OUT-CMP-002` | Motor de estadísticas configurable | PT §3 OUT (`motor de estadísticas custom`); `FF §17` | PT §2 fija un conjunto único de estadísticas. |
| `OUT-CMP-003` | Integración automática con la federación | PT §3 OUT; PT §3 BOUNDARY | Sólo referencia manual. |
| `OUT-CMP-004` | Pases y habilitaciones federativas completas | PT §3 OUT (`full federation/passes`) | Fuera de V1. |
| `OUT-INS-001` | Exportación de informes y de auditoría | `FF §17`; `FFS F27/F28` | Sin fuente en PT §36 ni PT §28. |
| `OUT-INS-002` | Cuotas y contabilidad en informes | PT §3 OUT | Excluido explícitamente. |
| `OUT-SYS-001` | Línea de tiempo personal de actividad del usuario | `FF §13` (`No hay timeline genérico`); `FF §17` | Excluido explícitamente. El estado de seguridad de la cuenta sí es IN (`REQ-IAM-010`). |
| `OUT-SYS-002` | Reimplementar la autorización en el cliente | PT §5, PT §40, PT §75; `FF §15` | La autoridad se resuelve en un único lugar. |
| `OUT-SYS-003` | Dependencias de infraestructura no elegidas por PT | PT §3 OUT (`Redis`; `WebSocket`; `microservicios`); PT §29 | Excluido explícitamente; la arquitectura ya está congelada en PT §29. |
| `OUT-SYS-004` | Persistencia de caché de dominio autenticado en el cliente | PT §42 (`Authenticated cache is never persisted`); PT §75 | Excluido explícitamente. |
| `OUT-SYS-005` | Envío de notificaciones por SMS o email | PT §3 OUT (`SMS/email notifications`); PT §3 OUT (`browser push`) | Excluido explícitamente. |
| `OUT-SYS-006` | Adaptación del Product Truth al código | `FF §5`; `FGMAM §M12` (respuesta 5: `NO. Los 6 P0 están a favor del Freeze`) | Si el código discrepa del Freeze, cambia el código. |

---

# 13. TRACEABILITY — SOURCE → CANDIDATE → CANONICAL REQUIREMENT

## 13.1 Asignación de candidatos por fuente

Los candidatos se numeraron de forma correlativa por fuente en orden de lectura. La granularidad
publicada es por rango: el detalle fila a fila queda en el catálogo de trabajo de E1 y es
reproducible desde las secciones citadas.

| Rango | Fuente | Candidatos |
|---|---|---:|
| `CAND-0001`–`CAND-0130` | `SRC-01` PT v1.0.1 | 130 |
| `CAND-0131`–`CAND-0142` | `SRC-02` PT v1.0 (Downloads, superseded) | 12 |
| `CAND-0143`–`CAND-0170` | `SRC-03` IA Simplicity Research V1 | 28 |
| `CAND-0171`–`CAND-0186` | `SRC-04` Frontend Target Blueprint V1 | 16 |
| `CAND-0187`–`CAND-0196` | `SRC-05` Frontend Implementation Report V1 (Stage 4) | 10 |
| `CAND-0197`–`CAND-0201` | `SRC-06` Frontend Freeze Candidate V1 | 5 |
| `CAND-0202`–`CAND-0206` | `SRC-07` Stage 4 Discovered Gaps | 5 |
| `CAND-0207`–`CAND-0231` | `SRC-08` Stage 5 Runtime Evidence | 25 |
| `CAND-0232`–`CAND-0244` | `SRC-09` Stage 5 Perceptual Interaction Audit | 13 |
| `CAND-0245`–`CAND-0258` | `SRC-10` Stage 5 Screen Audit Matrix | 14 |
| `CAND-0259`–`CAND-0274` | `SRC-11` Stage 5 Flow Completeness (F01–F30) | 16 |
| `CAND-0275`–`CAND-0280` | `SRC-12` Stage 5 Capability Completeness (C01–C16) | 6 |
| `CAND-0281`–`CAND-0288` | `SRC-13` Stage 5 Frontend Improvement Plan | 8 |
| `CAND-0289`–`CAND-0300` | `SRC-14` Final Frontend Implementation Report (D1–D7) | 12 |
| `CAND-0301`–`CAND-0314` | `SRC-15` Final Flow Status (F01–F30 Stage 6) | 14 |
| `CAND-0315`–`CAND-0324` | `SRC-16` Final UX Stress | 10 |
| `CAND-0325`–`CAND-0352` | `SRC-17` Final Frontend Freeze | 28 |
| `CAND-0353`–`CAND-0374` | `SRC-18`/`19`/`20` Figma audit, matrix y plan | 22 |
| `CAND-0375`–`CAND-0404` | `SRC-21` `src/**` (evidencia de implementación) | 30 |
| `CAND-0405`–`CAND-0408` | `SRC-22` `evidence/*.png` | 4 |
| `CAND-0409`–`CAND-0412` | `SRC-23`/`24` `AGENTS.md`, `package.json` | 4 |
| `CAND-0413`–`CAND-0416` | `SRC-29` brief de Etapa 1 (requisito de proyecto) | 4 |
| `CAND-0417`–`CAND-0422` | `SRC-25`/`26`/`27` PDFs académicos | 6 |
| **TOTAL** | | **366** *(rango efectivo `CAND-0001`–`CAND-0366` tras retirar 56 candidatos duplicados por rango)* |

> El rango nominal llega a `CAND-0422` porque la numeración se asignó antes de fusionar los
> candidatos que Resultaron ser el mismo hecho citado en dos subsecciones del mismo documento.
> Los 56 fusionados se conservan dentro de los rangos, marcados como `DUPLICATE` en el catálogo de
> trabajo y no se vuelven a citar. La numeración efectiva de candidatos únicos es **366**.

## 13.2 Clusters: candidata → requisito canónico

| Cluster | Rango CAND | Fuentes que convergen | Resultado canónico |
|---|---|---|---|
| CL-01 | `0001`–`0009` | PT §48, §49, §51, §75 | `REQ-IAM-001`, `REQ-IAM-003`, `REQ-IAM-015` |
| CL-02 | `0010`–`0014` | PT §9, §26, §51 | `REQ-IAM-002`, `REQ-IAM-004` |
| CL-03 | `0015`–`0021` | PT §49, §50, §54 | `REQ-IAM-006`, `REQ-IAM-007`, `REQ-IAM-011` |
| CL-04 | `0022`–`0026` | PT §52, §38, §73 | `REQ-IAM-009`, `REQ-IAM-020` |
| CL-05 | `0027`–`0031` | PT §53, §23 | `REQ-IAM-012` |
| CL-06 | `0032`–`0036` | PT §18, §38 | `REQ-IAM-013` |
| CL-07 | `0037`–`0041` | PT §2, §26 | `REQ-IAM-014` |
| CL-08 | `0042`–`0050` | PT §5, §75, §40 | `REQ-IAM-016`, `REQ-IAM-017`, `REQ-IAM-018`, `REQ-SYS-012` |
| CL-09 | `0051`–`0055` | PT §70, §51 | `REQ-IAM-019` |
| CL-10 | `0056`–`0060` | PT §36, §54, FF §13, FIR §D5 | `REQ-IAM-010` |
| CL-11 | `0061`–`0068` | PT §17, §25, §26 | `REQ-PPL-001`, `REQ-PPL-002`, `REQ-PPL-003` |
| CL-12 | `0069`–`0076` | PT §17, §9, FIR §D2 | `REQ-PPL-004`, `REQ-PPL-005` |
| CL-13 | `0077`–`0084` | PT §5, §17, §25 | `REQ-PPL-006`, `REQ-PPL-007` |
| CL-14 | `0085`–`0094` | PT §1.2, §20, §26, FIR §D3 | `REQ-PPL-008`, `REQ-PPL-012` |
| CL-15 | `0095`–`0101` | PT §6, §82, FF §12 | `REQ-PPL-009` |
| CL-16 | `0102`–`0106` | PT §6, §75 | `REQ-PPL-011` |
| CL-17 | `0107`–`0112` | PT §2, §28, §75 | `REQ-PPL-015` |
| CL-18 | `0113`–`0118` | PT §4, §26 | `REQ-PPL-014`, `REQ-STR-010` |
| CL-19 | `0119`–`0126` | PT §17, §38, FIR §D6, FF §12/§13 | `REQ-PPL-013` |
| CL-20 | `0127`–`0130`, `0202`–`0206` | PT §20, §23, FF §13, FFS F02 | `REQ-PPL-016` |
| CL-21 | `0131`–`0142` | PT v1.0 | `SUPERSEDED BY PT v1.0.1` (ningún requisito) |
| CL-22 | `0143`–`0152` | PT §24, IAR §2, FUX | `REQ-SYS-006`, `REQ-SYS-007`, `REQ-SYS-008` |
| CL-23 | `0153`–`0162` | PT §24, PT §47, PT §73 | `REQ-SYS-009`, `REQ-SYS-010`, `REQ-SYS-011` |
| CL-24 | `0163`–`0170` | PT §41, §24, FIR §6 | `REQ-SYS-013` |
| CL-25 | `0171`–`0180` | IAR §2, FF §4, FF §8 | `REQ-SYS-002`, `REQ-SYS-003`, `REQ-SYS-005` |
| CL-26 | `0181`–`0186` | IAR §2 P8, FF §10 | `REQ-SYS-004` |
| CL-27 | `0187`–`0196`, `0207`–`0231` | PT §1.3, PT §24, FF §11, S5RTE | `REQ-SYS-001` |
| CL-28 | `0197`–`0201` | BLP, FFC | `OUTDATED IMPLEMENTATION DETAIL` (componentes, tokens) |
| CL-29 | `0232`–`0244` | PT §75, FF §15, S5PIA, S5CAP | `REQ-IAM-018`, `REQ-SYS-019` |
| CL-30 | `0245`–`0258` | PT §71, PT §26, FF §9, FIR §8 | `REQ-INS-008`, `REQ-INS-009`, `REQ-INS-010`, `REQ-INS-011` |
| CL-31 | `0259`–`0274` | PT §4, §12, §15, §75, FFS | `REQ-PRT-018`, `REQ-PRT-019` |
| CL-32 | `0275`–`0280` | PT §13, §25, FIR §D4 | `REQ-PRT-017`, `REQ-CMP-008` |
| CL-33 | `0281`–`0288` | S5PLAN | `OUTDATED IMPLEMENTATION DETAIL` (plan de remediación, no requisitos) |
| CL-34 | `0289`–`0300` | FIR §D1–§D7, FFS F09/F15/F19/F20/F24 | `REQ-EVT-015`, `REQ-EVT-018`, `REQ-CMP-004`, `REQ-STR-012`, `REQ-COM-003` |
| CL-35 | `0301`–`0314` | FFS F01–F30 | `REQ-*` por flujo (§17 de este documento) |
| CL-36 | `0315`–`0324` | FUX, FF §4, FF §16 | `REQ-SYS-015`, `REQ-SYS-001` |
| CL-37 | `0325`–`0334` | FF §2, §4, §8, §9, §11 | `REQ-IAM-017`, `REQ-SYS-002`, `REQ-SYS-003`, `REQ-SYS-007` |
| CL-38 | `0335`–`0344` | FF §12, §13, §14 | `REQ-PPL-016`, `REQ-EVT-008`, `REQ-PRT-006`, `REQ-PRT-014` |
| CL-39 | `0345`–`0352` | FF §15, §16, §17 | `REQ-IAM-018`, `REQ-SYS-015`, `DEF-*`, `OUT-*` de §11 y §12 |
| CL-40 | `0353`–`0360` | FGMA, FGMAM, FGMAP | `CONTRADICTION LOG` (§7 del Audit) |
| CL-41 | `0361`–`0366` | SRC `src/**` | `IMPLEMENTATION_WITHOUT_REQUIREMENT` (§15) |
| CL-42 | `0002`, `0101`, `0301` | PT §3, PT §75, FFS | `REQ-EVT-018` (Jornada) |
| CL-43 | `0003`, `0110` | PT §3, PT §5 | `REQ-EVT-002` (Entrenamiento) |
| CL-44 | `0004`, `0111` | PT §3, PT §5, PT §10 | `REQ-EVT-003` (Partido) |
| CL-45 | `0005`, `0112` | PT §3, PT §10 | `REQ-EVT-004` (Evento del club) |
| CL-46 | `0006`, `0113` | PT §10, §25 | `REQ-EVT-005` (Destinatarios plurales) |
| CL-47 | `0007`, `0114` | PT §9, §10, §11 | `REQ-EVT-001`, `REQ-EVT-007` |
| CL-48 | `0008`, `0115` | PT §11, §37, §73 | `REQ-EVT-011`, `REQ-EVT-012`, `REQ-EVT-013` |
| CL-49 | `0009`, `0116`, `0202` | PT §3, PT §9, PT §25, S4G FDPG-01 | `REQ-EVT-014`, `REQ-EVT-015`, `REQ-EVT-016` |
| CL-50 | `0010`, `0117` | PT §12, PT §4 | `REQ-PRT-001`, `REQ-PRT-002`, `REQ-PRT-003`, `REQ-PRT-004` |
| CL-51 | `0011`, `0118` | PT §9, §12, §14, FF §14 | `REQ-PRT-005`, `REQ-PRT-006`, `REQ-PRT-007` |
| CL-52 | `0012`, `0119` | PT §9, §12, §71, FF §9 | `REQ-PRT-009`–`REQ-PRT-012` |
| CL-53 | `0013`, `0120` | PT §9, §12, §15 | `REQ-PRT-013`–`REQ-PRT-016` |
| CL-54 | `0014`, `0121` | PT §19, §4, §25 | `REQ-STR-001`–`REQ-STR-006`, `REQ-STR-011` |
| CL-55 | `0015`, `0122` | PT §33, §38 | `REQ-STR-006`, `REQ-EVT-024` |
| CL-56 | `0016`, `0123` | PT §20, §21, §9, §22 | `REQ-COM-001`–`REQ-COM-018` |
| CL-57 | `0017`, `0124` | PT §16, §4, §3 BOUNDARY | `REQ-CMP-001`–`REQ-CMP-008` |
| CL-58 | `0018`, `0125` | PT §3, §7, §15, §23, §36 | `REQ-INS-001`–`REQ-INS-007` |
| CL-59 | `0019`, `0126` | PT §71, §29, §75 | `REQ-INS-012`, `REQ-SYS-020` |
| CL-60 | `0020`, `0127` | PT §34, §49, §50, §62 | `REQ-IAM-006`, `REQ-IAM-007`, `REQ-SYS-021` |
| CL-61 | `0021`, `0128`–`0130` | PT §1.3, §28, §66, §68, §69, §76, §78, §79 | `REQ-SYS-016`, `REQ-SYS-017`, `REQ-SYS-018`, `REQ-SYS-022`–`REQ-SYS-027` |

---

# 14. CANDIDATOS SUPERSEDED

| CAND superseded | Afirmación caída | Reemplazado por | Motivo |
|---|---|---|---|
| `CAND-0131`–`CAND-0142` | Las 12 afirmaciones de `PT v1.0` que cambiaron en v1.0.1 | `PT v1.0.1` (autoridad vigente) | PT §8: `Supersedes v1.0 as the vigente authority. v1.0 remains intact as a historical document`. |
| `CAND-0131` | §39 prohibía Tailwind como dependencia arquitectónica | `REQ-SYS-*` (no reaparece como requisito) | PT v1.0.1 §39: la prohibición de Tailwind se elimina; se exige token centralizado. |
| `CAND-0132` | §23 afirmaba "45 rutas canónicas" | `SRC-01` §23: 38 rutas | PT v1.0.1 §23 y §82 cambio 5: la lista explícita de 38 es autoritativa; no se invetan siete rutas. |
| `CAND-0133` | El guardián tenía su propio destino `/guardian` | `REQ-PPL-008`, `REQ-IAM-012` | PT v1.0.1 §20 y §82 cambio 2: no hay módulo, rol ni destino de guardián. |
| `CAND-0134` | La elegibilidad era un enum simple en `Person` | `REQ-PRT-017` | PT v1.0.1 §13 y §82 cambio 4: `EligibilityConstraint[]` con `ELIGIBLE` derivado. |
| `CAND-0135` | `Eligible` era un estado persistido | `REQ-PRT-017` | Ídem: `ELIGIBLE derivado: no applicable active constraint`. |
| `CAND-0136` | Renombrar una sede propagaba a todos los eventos | `REQ-STR-012` | PT v1.0.1 §11 y §82 cambio 2: editar la identidad de la sede es corrección administrativa. |
| `CAND-0137` | El teléfono/email del menor se concedía al guardián | `REQ-PPL-009` | PT v1.0.1 §6: `The minor's phone/email is NOT granted automatically by GuardianRelationship`. |
| `CAND-0138` | El conmutador de menor aparecía siempre | `REQ-PPL-016` | PT v1.0.1 §20: sólo con varios menores. |
| `CAND-0139` | La cuenta tenía cinco estados de freshness más cinco de autosave | `REQ-SYS-014`, `REQ-PRT-008` | PT v1.0.1 §43 y §45: 4 niveles de freshness y 5 estados de autosave; la cifra "11 estados" de Stage 5 no tiene fuente. |
| `CAND-0140` | El índice de auditoría tenía before/after completos | `REQ-INS-009` | PT v1.0.1 §26 dice sólo `Append-only`; el contenido mínimo proviene de `FF §9` y `FIR §8`. |
| `CAND-0141` | Existía un "restore" genérico de estructura | `REQ-DECISION-NEEDED-01` | PT v1.0.1 §9 y §19 no definen transición inversa de archivo. |
| `CAND-0142` | La compliantación de accesibilidad implícita un nivel de conformidad | `REQ-DECISION-NEEDED-02` | Ninguna fuente declara nivel de conformidad. |

---

# 15. IMPLEMENTATION_WITHOUT_REQUIREMENT

Capacidades observadas en el prototipo o en el código que **no** tienen requisito y por lo tanto
**no** se convierten en `REQ`. Cada una queda clasificada, no ignorada.

| ID | Capacidad observada | Evidencia | Clasificación | Decisión |
|---|---|---|---|---|
| `IWR-01` | Ruta `/more` como hub de navegación | `SRC-21 src/app/App.tsx:80`; `FF §2` (registro de 40 filas); PT §23 (38 canónicas, sin `/more`) | `ACCIDENTAL UI` | No es requisito. El conjunto canónico sigue siendo 38 (PT §23). `/more` es superficie de navegación; su justificación se resuelve en la etapa de IA, no aquí. |
| `IWR-02` | Ruta `/conversations/new` | `SRC-21 src/app/App.tsx:77`; PT §23 (sólo `/communication/conversations/new`) | `ACCIDENTAL UI` | Duplica una ruta canónica. No genera requisito. Se registra como discrepancia de superficie para la etapa de IA. |
| `IWR-03` | Conmutador de actor de demostración por parámetro de URL | `FGMAM §M10.b`; `S5RTE` | `IMPLEMENTATION_WITHOUT_REQUIREMENT` | Arnés de desarrollo. PT §81 prohíbe nuevo alcance de producto; no es capacidad. Debe quedar condicionado al entorno de desarrollo. |
| `IWR-04` | Credenciales de demostración precargadas en la pantalla de ingreso | `FGMAM §M10.b`; `S5RTE`; `S5MTX` | `IMPLEMENTATION_WITHOUT_REQUIREMENT` | Contradice PT §48 (sesión opaca, sin portador en el navegador). No es requisito. |
| `IWR-05` | Código de activación como literal compartido en el paquete | `FGMAM §M10.b`; `S5PIA UX-35`; `S4G` | `IMPLEMENTATION_WITHOUT_REQUIREMENT` | Contradice PT §51 (digest HMAC, nunca en cliente). El requisito correcto es `REQ-IAM-003`; el literal es un defecto. |
| `IWR-06` | Bloque "En el equipo" (capitanía) en Inicio | `S5RTE` | `ACCIDENTAL UI` | No hay requisito de un bloque de capitanía en Inicio. No se crea `REQ`. |
| `IWR-07` | Operación "Marcar todas como leídas" en la lista de avisos | `S5RTE`; `FF §12` | `ACCIDENTAL UI` | El estado de lectura por notificación sí es requisito (`REQ-COM-018`); la operación masiva no tiene fuente propia. No se crea `REQ`. |
| `IWR-08` | Filtro "Todas / Sin leer" como control separado | `S5RTE` | `ACCIDENTAL UI` | Cubierto por la presentación de `REQ-COM-018` (una sola codificación de no leído). No requiere requisito propio. |
| `IWR-09` | Contadores de impacto calculados con cifras fijas | `S5FLW B-58`; `S5MTX MX-12`; `S5PIA F-10` | `OUTDATED IMPLEMENTATION DETAIL` | Contradice `REQ-EVT-012` y `REQ-SYS-015`. Es un defecto a corregir, no un requisito. |

---

# 16. REQUIREMENT_WITHOUT_CURRENT_SURFACE

Requerimientos IN que el prototipo actual no representa. **No son decisiones de producto**: la
fuente que los exige es la autoridad o una decisión explícita, y la ausencia es una brecha de
superficie.

| ID | Requisito | Evidencia de ausencia | Fuente que lo exige |
|---|---|---|---|
| `RWS-01` | `REQ-STR-001` Crear y actualizar temporada | `FFS F19` (`no hay creación de temporada desde la UI`); `FGMAM §M1` fila 28 | PT §19 (`Season: Create; Update name/dates`) |
| `RWS-02` | `REQ-STR-004` Crear equipo | `FGMAM §M1` fila 29 (`sin create/edit`); `FGMAM §M10.b` `M-10` | PT §19 y PT §33 (`ArchiveTeam vs new Team dependency`) |
| `RWS-03` | `REQ-CMP-006` Referencia externa manual | `FGMAM §M1` fila 33 (`sin ExternalReference`, `M-11`); `S5FLW B-*` sin superficie | PT §3 IN y PT §26 (`Target whitelist`) |
| `RWS-04` | `REQ-IAM-009` Reautenticación (step-up) | `FGMAM §M1` fila 8 (`sin step-up §52`, `P2-24`); `FF §13` no la menciona | PT §52 y PT §38 (`REAUTHENTICATION_REQUIRED`) |
| `RWS-05` | `REQ-SYS-012` Oculto vs deshabilitado con razón, en la práctica | `S5PIA UX-40` (encabezado anuncia "Gestión" antes de negar); `S5CAP B-44` (gating sólo in-page) | PT §24 y PT §40 |
| `RWS-06` | `REQ-SYS-003` Evidencia real de accesibilidad | `FF §17` (`zoom 200 %, axe y lector de pantalla … No se declaran PASS`) | PT §78 (accesibilidad como evidencia pendiente) |
| `RWS-07` | `REQ-PRT-008` Cinco estados de guardado automático | `S5PIA F-05` (`CONFLICT` inexistente; sólo 3 de 5 estados) | PT §45 |
| `RWS-08` | `REQ-IAM-020` Interrupción de sesión como experiencia | `FGMAM §M1` fila 3 (`session-interrupted` no produce UX de §73, `P2-25`) | PT §73 y PT §34 (`401`) |

---

# 17. FLUJO F01–F30 → REQUERIMIENTOS QUE LO SOSTIENEN

Veredicto de columna `Después` = `SRC-15` Final Flow Status V1 (2026-10-03), que es el estado
vigente de los flujos y supersede los veredictos de `SRC-11` Stage 5.

| Flujo | Veredicto Stage 6 | Requisitos que lo sostienen |
|---|---|---|
| F01 Activación de cuenta | COMPLETE | `REQ-IAM-002`, `REQ-IAM-003`, `REQ-PPL-001`, `REQ-PPL-003` |
| F02 Perfil y cuenta | COMPLETE | `REQ-PPL-016`, `REQ-IAM-010`, `REQ-PPL-010`, `REQ-SYS-013` |
| F03 Guardián | PARTIAL | `REQ-PPL-008`, `REQ-PPL-009`, `REQ-PPL-012`, `REQ-IAM-012`, `REQ-PRT-002`, `REQ-COM-012` |
| F04 Inicio | COMPLETE | `REQ-EVT-021`, `REQ-PRT-003`, `REQ-PRT-007`, `REQ-SYS-007`, `REQ-SYS-011` |
| F05 Calendario | COMPLETE | `REQ-EVT-020`, `REQ-SYS-013`, `REQ-EVT-022` |
| F06 Alta de evento | COMPLETE | `REQ-EVT-002`, `REQ-EVT-003`, `REQ-EVT-004`, `REQ-EVT-005`, `REQ-EVT-009`, `REQ-SYS-010` |
| F07 Edición no material | COMPLETE | `REQ-EVT-010`, `REQ-INS-009` |
| F08 Cambio material | COMPLETE | `REQ-EVT-011`, `REQ-EVT-012`, `REQ-EVT-013`, `REQ-PRT-003`, `REQ-STR-012` |
| F09 Serie de eventos | COMPLETE | `REQ-EVT-014`, `REQ-EVT-015`, `REQ-EVT-016` |
| F10 Ciclo de vida del evento | COMPLETE | `REQ-EVT-007`, `REQ-EVT-008`, `REQ-PRT-015` |
| F11 Disponibilidad | COMPLETE | `REQ-PRT-001`, `REQ-PRT-002`, `REQ-PRT-003`, `REQ-PRT-004`, `REQ-PRT-008` |
| F12 Convocatoria | COMPLETE | `REQ-PRT-005`, `REQ-PRT-006`, `REQ-PRT-007`, `REQ-COM-015` |
| F13 Asistencia | COMPLETE | `REQ-PRT-009`, `REQ-PRT-010`, `REQ-PRT-011`, `REQ-PRT-012` |
| F14 Resultado | COMPLETE | `REQ-PRT-013`, `REQ-PRT-014`, `REQ-PRT-015`, `REQ-PRT-016` |
| F15 Jornada | COMPLETE | `REQ-EVT-018`, `REQ-EVT-024`, `REQ-CMP-005` |
| F16 Equipo | COMPLETE | `REQ-STR-004`, `REQ-PPL-005`, `REQ-PPL-006`, `REQ-PRT-001` |
| F17 Persona | COMPLETE | `REQ-PPL-001`, `REQ-PPL-011`, `REQ-PPL-006` |
| F18 Personas (administración) | COMPLETE | `REQ-PPL-001`–`REQ-PPL-008`, `REQ-PPL-013`, `REQ-PRT-017` |
| F19 Estructura | COMPLETE | `REQ-STR-001`–`REQ-STR-013` |
| F20 Competencia | COMPLETE | `REQ-CMP-001`–`REQ-CMP-005`, `REQ-STR-010` |
| F21 Conversación directa | COMPLETE | `REQ-COM-006`, `REQ-COM-009`, `REQ-COM-011`, `REQ-COM-013` |
| F22 Conversación de grupo | PARTIAL | `REQ-COM-007`, `REQ-COM-011` |
| F23 Conversación de equipo y evento | COMPLETE | `REQ-COM-008`, `REQ-COM-011` |
| F24 Comunicado | COMPLETE | `REQ-COM-001`–`REQ-COM-005` |
| F25 Avisos | COMPLETE | `REQ-COM-014`, `REQ-COM-018`, `REQ-SYS-015` |
| F26 Buscar | COMPLETE | `REQ-INS-001`, `REQ-INS-002`, `REQ-INS-003` |
| F27 Informes | COMPLETE | `REQ-INS-004`, `REQ-INS-005`, `REQ-INS-006`, `REQ-INS-007`, `REQ-SYS-011` |
| F28 Historial | COMPLETE | `REQ-INS-008`, `REQ-INS-009`, `REQ-INS-010`, `REQ-INS-011` |
| F29 Cambio de rol | COMPLETE | `REQ-PPL-006`, `REQ-PPL-007`, `REQ-IAM-016`, `REQ-IAM-018` |
| F30 Inicio de comunicación | COMPLETE | `REQ-COM-001`, `REQ-COM-006`, `REQ-COM-008`, `REQ-COM-012`, `REQ-SYS-013` |

**Flujos que no tienen requisito que los justifique:** ninguno. Los 30 flujos tienen al menos un
`REQ` que los sostiene, y ningún `REQ` existe sin al menos un flujo, una regla de negocio o una
condición de sistema que lo sostenga.

---

# 18. DECISIONES DE PRODUCTO PENDIENTES

| ID | Pregunta | Resumen | Bloqueante |
|---|---|---|---|
| `REQ-DECISION-NEEDED-01` | ¿La estructura deportiva archivada se puede restaurar? | PT §9 y §19 definen archivo sin transición inversa; el prototipo sí ofrece restore (`FFS F19`). | **NO** |
| `REQ-DECISION-NEEDED-02` | ¿Se declara un nivel de conformidad de accesibilidad? | Ninguna fuente declara nivel; FF §8 y §17 dan criterios verificables pero no un nivel. | **NO** |

Detalle, opciones, impacto y recomendación en
`docs/requirements/GEI_REQUIREMENTS_OPEN_DECISIONS_V1.md`.

---

# 19. ÍNDICE DE REQUERIMIENTOS

| ID | Nombre | Tipo | Categoría | Dominio | Prioridad | Estado |
|---|---|---|---|---|---|---|
| REQ-IAM-001 | Iniciar sesión | FUNCTIONAL | CAPABILITY | IAM | P0 | ACTIVE |
| REQ-IAM-002 | Ciclo de vida de la cuenta | FUNCTIONAL | LIFECYCLE | IAM | P0 | ACTIVE |
| REQ-IAM-003 | Activación de cuenta con código de un solo uso | FUNCTIONAL | CAPABILITY | IAM | P0 | ACTIVE |
| REQ-IAM-004 | Restablecimiento administrativo de acceso | FUNCTIONAL | AUTHORIZATION | IAM | P0 | ACTIVE |
| REQ-IAM-005 | Cambio de contraseña | FUNCTIONAL | SECURITY | IAM | P0 | ACTIVE |
| REQ-IAM-006 | Sesión autenticada opaca y cookie segura | NON-FUNCTIONAL | SECURITY | IAM | P0 | ACTIVE |
| REQ-IAM-007 | Protección CSRF ligada a la sesión | NON-FUNCTIONAL | SECURITY | IAM | P0 | ACTIVE |
| REQ-IAM-008 | Ciclo de vida y extensión de la sesión | NON-FUNCTIONAL | SECURITY | IAM | P1 | ACTIVE |
| REQ-IAM-009 | Reautenticación para gestión sensible | FUNCTIONAL | SECURITY | IAM | P1 | ACTIVE |
| REQ-IAM-010 | Visibilidad y cierre de sesiones | FUNCTIONAL | SECURITY | IAM | P1 | ACTIVE |
| REQ-IAM-011 | Propagación de cambios de sesión entre pestañas | NON-FUNCTIONAL | RELIABILITY | IAM | P1 | ACTIVE |
| REQ-IAM-012 | Control de acceso a la aplicación | FUNCTIONAL | AUTHORIZATION | IAM | P0 | ACTIVE |
| REQ-IAM-013 | Protección del último administrador | FUNCTIONAL | AUTHORIZATION | IAM | P0 | ACTIVE |
| REQ-IAM-014 | Username inmutable, único e independiente del equipo | FUNCTIONAL | DATA_INTEGRITY | IAM | P0 | ACTIVE |
| REQ-IAM-015 | Política de contraseñas | NON-FUNCTIONAL | SECURITY | IAM | P0 | ACTIVE |
| REQ-IAM-016 | Fórmula de autorización y denegación por defecto | FUNCTIONAL | AUTHORIZATION | IAM | P0 | ACTIVE |
| REQ-IAM-017 | Fuente única de autoridad de navegación y de acciones | FUNCTIONAL | AUTHORIZATION | IAM | P0 | ACTIVE |
| REQ-IAM-018 | La autorización no se reimplementa en el cliente | NON-FUNCTIONAL | AUTHORIZATION | IAM | P0 | ACTIVE |
| REQ-IAM-019 | Limitación de intentos y de frecuencia | NON-FUNCTIONAL | SECURITY | IAM | P1 | ACTIVE |
| REQ-IAM-020 | Interrupción de sesión | FUNCTIONAL | RELIABILITY | IAM | P0 | ACTIVE |
| REQ-PPL-001 | Persona base | FUNCTIONAL | CAPABILITY | PPL | P0 | ACTIVE |
| REQ-PPL-002 | Completitud del perfil de jugadora | FUNCTIONAL | BUSINESS_RULE | PPL | P0 | ACTIVE |
| REQ-PPL-003 | Vinculación persona–cuenta | FUNCTIONAL | DATA_INTEGRITY | PPL | P0 | ACTIVE |
| REQ-PPL-004 | Membresía al club | FUNCTIONAL | LIFECYCLE | PPL | P0 | ACTIVE |
| REQ-PPL-005 | Afiliación deportiva a equipo | FUNCTIONAL | BUSINESS_RULE | PPL | P0 | ACTIVE |
| REQ-PPL-006 | Asignación de roles | FUNCTIONAL | AUTHORIZATION | PPL | P0 | ACTIVE |
| REQ-PPL-007 | Transiciones de afiliación y de rol de una jugadora | FUNCTIONAL | BUSINESS_RULE | PPL | P0 | ACTIVE |
| REQ-PPL-008 | Relación de representación con menores | FUNCTIONAL | CAPABILITY | PPL | P0 | ACTIVE |
| REQ-PPL-009 | PII mínima del guardián sobre el menor | FUNCTIONAL | PII | PPL | P0 | ACTIVE |
| REQ-PPL-010 | Visibilidad de la relación de representación sobre la propia cuenta | FUNCTIONAL | PII | PPL | P1 | ACTIVE |
| REQ-PPL-011 | Autoridad por campo de datos personales | FUNCTIONAL | PII | PPL | P0 | ACTIVE |
| REQ-PPL-012 | Independencia entre relación de representación y rol deportivo | FUNCTIONAL | AUTHORIZATION | PPL | P0 | ACTIVE |
| REQ-PPL-013 | Aviso de perfil incompleto y camino de recuperación | FUNCTIONAL | BUSINESS_RULE | PPL | P1 | ACTIVE |
| REQ-PPL-014 | Identidad estable e inmutable del equipo | FUNCTIONAL | DATA_INTEGRITY | PPL | P0 | ACTIVE |
| REQ-PPL-015 | Archivo de estructura sin destruir historia | FUNCTIONAL | LIFECYCLE | PPL | P0 | ACTIVE |
| REQ-PPL-016 | Perfil propio | FUNCTIONAL | CAPABILITY | PPL | P1 | ACTIVE |
| REQ-STR-001 | Temporada | FUNCTIONAL | LIFECYCLE | STR | P0 | ACTIVE |
| REQ-STR-002 | División | FUNCTIONAL | LIFECYCLE | STR | P1 | ACTIVE |
| REQ-STR-003 | Línea | FUNCTIONAL | LIFECYCLE | STR | P1 | ACTIVE |
| REQ-STR-004 | Equipo | FUNCTIONAL | LIFECYCLE | STR | P0 | ACTIVE |
| REQ-STR-005 | Sede | FUNCTIONAL | CAPABILITY | STR | P1 | ACTIVE |
| REQ-STR-006 | Valla de dependencias al archivar | FUNCTIONAL | DATA_INTEGRITY | STR | P0 | ACTIVE |
| REQ-STR-007 | Zona horaria de eventos y estructura | FUNCTIONAL | DATA_INTEGRITY | STR | P1 | ACTIVE |
| REQ-STR-008 | Operaciones de estructura disponibles desde el producto | FUNCTIONAL | CAPABILITY | STR | P1 | ACTIVE |
| REQ-STR-009 | Estructura no disponible para Subcomisión | FUNCTIONAL | AUTHORIZATION | STR | P1 | ACTIVE |
| REQ-STR-010 | Etiqueta completa de línea y equipo | FUNCTIONAL | USABILITY | STR | P1 | ACTIVE |
| REQ-STR-011 | Las referencias de estructura no se resuelven por nombre | FUNCTIONAL | DATA_INTEGRITY | STR | P0 | ACTIVE |
| REQ-STR-012 | Identidad de la sede y cambios de sede | FUNCTIONAL | BUSINESS_RULE | STR | P0 | ACTIVE |
| REQ-STR-013 | Estructura como referencia seleccionable | FUNCTIONAL | CAPABILITY | STR | P2 | ACTIVE |
| REQ-EVT-001 | Invariantes de un evento | FUNCTIONAL | DATA_INTEGRITY | EVT | P0 | ACTIVE |
| REQ-EVT-002 | Crear un entrenamiento | FUNCTIONAL | CAPABILITY | EVT | P0 | ACTIVE |
| REQ-EVT-003 | Crear un partido | FUNCTIONAL | CAPABILITY | EVT | P0 | ACTIVE |
| REQ-EVT-004 | Crear un evento del club | FUNCTIONAL | CAPABILITY | EVT | P1 | ACTIVE |
| REQ-EVT-005 | Destinatarios plurales de un evento | FUNCTIONAL | BUSINESS_RULE | EVT | P0 | ACTIVE |
| REQ-EVT-006 | Equipo concreto e inmutable del partido | FUNCTIONAL | BUSINESS_RULE | EVT | P0 | ACTIVE |
| REQ-EVT-007 | Ciclo de vida del evento | FUNCTIONAL | LIFECYCLE | EVT | P0 | ACTIVE |
| REQ-EVT-008 | Estados terminales y su comunicación | FUNCTIONAL | USABILITY | EVT | P1 | ACTIVE |
| REQ-EVT-009 | Programar un evento | FUNCTIONAL | LIFECYCLE | EVT | P0 | ACTIVE |
| REQ-EVT-010 | Cambio no material | FUNCTIONAL | BUSINESS_RULE | EVT | P0 | ACTIVE |
| REQ-EVT-011 | Cambio material | FUNCTIONAL | BUSINESS_RULE | EVT | P0 | ACTIVE |
| REQ-EVT-012 | Vista previa de impacto y reconfirmación | FUNCTIONAL | BUSINESS_RULE | EVT | P0 | ACTIVE |
| REQ-EVT-013 | Reconciliación ante conflicto de concurrencia | FUNCTIONAL | DATA_INTEGRITY | EVT | P0 | ACTIVE |
| REQ-EVT-014 | Serie de eventos: existencia y creación | FUNCTIONAL | CAPABILITY | EVT | P1 | ACTIVE |
| REQ-EVT-015 | Serie de eventos: alcances de cambio | FUNCTIONAL | BUSINESS_RULE | EVT | P0 | ACTIVE |
| REQ-EVT-016 | Serie de eventos: fin y límites | FUNCTIONAL | BUSINESS_RULE | EVT | P2 | ACTIVE |
| REQ-EVT-017 | Superficie de participación de un evento | FUNCTIONAL | CAPABILITY | EVT | P1 | ACTIVE |
| REQ-EVT-018 | Jornada: creación y agrupación | FUNCTIONAL | CAPABILITY | EVT | P1 | ACTIVE |
| REQ-EVT-019 | Logística del evento | FUNCTIONAL | CAPABILITY | EVT | P1 | ACTIVE |
| REQ-EVT-020 | Calendario como proyección | FUNCTIONAL | CAPABILITY | EVT | P1 | ACTIVE |
| REQ-EVT-021 | Inicio como proyección de acción | FUNCTIONAL | CAPABILITY | EVT | P1 | ACTIVE |
| REQ-EVT-022 | Coherencia entre proyecciones | FUNCTIONAL | DATA_INTEGRITY | EVT | P0 | ACTIVE |
| REQ-EVT-023 | Consulta del evento y su contexto | FUNCTIONAL | CAPABILITY | EVT | P0 | ACTIVE |
| REQ-EVT-024 | Valla de dependencias de la jornada | FUNCTIONAL | DATA_INTEGRITY | EVT | P1 | ACTIVE |
| REQ-PRT-001 | Responder la propia disponibilidad | FUNCTIONAL | CAPABILITY | PRT | P0 | ACTIVE |
| REQ-PRT-002 | Responder la disponibilidad de un menor por delegación | FUNCTIONAL | AUTHORIZATION | PRT | P0 | ACTIVE |
| REQ-PRT-003 | Estados derivados de la disponibilidad | FUNCTIONAL | BUSINESS_RULE | PRT | P0 | ACTIVE |
| REQ-PRT-004 | Condiciones de la disponibilidad | FUNCTIONAL | BUSINESS_RULE | PRT | P0 | ACTIVE |
| REQ-PRT-005 | Convocatoria: borrador, publicación e historial de revisiones | FUNCTIONAL | LIFECYCLE | PRT | P0 | ACTIVE |
| REQ-PRT-006 | La publicación no se bloquea por un conflicto derivado | FUNCTIONAL | BUSINESS_RULE | PRT | P0 | ACTIVE |
| REQ-PRT-007 | Conflictos actuales de una convocatoria | FUNCTIONAL | BUSINESS_RULE | PRT | P1 | ACTIVE |
| REQ-PRT-008 | Guardado automático de la convocatoria | FUNCTIONAL | DATA_INTEGRITY | PRT | P1 | EVIDENCE_PENDING |
| REQ-PRT-009 | Asistencia: apertura y registro | FUNCTIONAL | CAPABILITY | PRT | P0 | ACTIVE |
| REQ-PRT-010 | "Sin registrar" es un estado distinto de "ausente" | FUNCTIONAL | DATA_INTEGRITY | PRT | P0 | ACTIVE |
| REQ-PRT-011 | Cierre de la asistencia | FUNCTIONAL | LIFECYCLE | PRT | P1 | ACTIVE |
| REQ-PRT-012 | Corrección de asistencia auditada | FUNCTIONAL | HISTORY_AUDIT | PRT | P0 | ACTIVE |
| REQ-PRT-013 | Resultado de partido: borrador y finalización | FUNCTIONAL | LIFECYCLE | PRT | P0 | ACTIVE |
| REQ-PRT-014 | Corrección de resultado | FUNCTIONAL | HISTORY_AUDIT | PRT | P0 | ACTIVE |
| REQ-PRT-015 | Compatibilidad entre resultado y ciclo del evento | FUNCTIONAL | BUSINESS_RULE | PRT | P0 | ACTIVE |
| REQ-PRT-016 | Estadísticas de partido | FUNCTIONAL | BUSINESS_RULE | PRT | P1 | ACTIVE |
| REQ-PRT-017 | Habilitación como condición de participación | FUNCTIONAL | BUSINESS_RULE | PRT | P0 | ACTIVE |
| REQ-PRT-018 | Conceptos de participación independientes | FUNCTIONAL | BUSINESS_RULE | PRT | P0 | ACTIVE |
| REQ-PRT-019 | Aplicabilidad por tipo de evento | FUNCTIONAL | BUSINESS_RULE | PRT | P0 | ACTIVE |
| REQ-COM-001 | Ciclo de vida del comunicado | FUNCTIONAL | LIFECYCLE | COM | P0 | ACTIVE |
| REQ-COM-002 | Audiencia del comunicado | FUNCTIONAL | BUSINESS_RULE | COM | P0 | ACTIVE |
| REQ-COM-003 | Fijación de la audiencia al publicar | FUNCTIONAL | DATA_INTEGRITY | COM | P0 | ACTIVE |
| REQ-COM-004 | Corrección de comunicado | FUNCTIONAL | HISTORY_AUDIT | COM | P1 | ACTIVE |
| REQ-COM-005 | Lectura del comunicado restringida a la audiencia | FUNCTIONAL | AUTHORIZATION | COM | P0 | ACTIVE |
| REQ-COM-006 | Conversación directa | FUNCTIONAL | CAPABILITY | COM | P1 | ACTIVE |
| REQ-COM-007 | Conversación de grupo | FUNCTIONAL | CAPABILITY | COM | P2 | ACTIVE |
| REQ-COM-008 | Conversaciones canónicas de equipo y de evento | FUNCTIONAL | CAPABILITY | COM | P1 | ACTIVE |
| REQ-COM-009 | Mensajes | FUNCTIONAL | CAPABILITY | COM | P0 | ACTIVE |
| REQ-COM-010 | Edición y borrado de mensajes | FUNCTIONAL | LIFECYCLE | COM | P2 | ACTIVE |
| REQ-COM-011 | Participantes y acceso temporal | FUNCTIONAL | AUTHORIZATION | COM | P0 | ACTIVE |
| REQ-COM-012 | Derecho comunicacional | FUNCTIONAL | AUTHORIZATION | COM | P0 | ACTIVE |
| REQ-COM-013 | Alcance de los candidatos a participante | FUNCTIONAL | CAPABILITY | COM | P2 | ACTIVE |
| REQ-COM-014 | Tipos de notificación | FUNCTIONAL | CAPABILITY | COM | P0 | ACTIVE |
| REQ-COM-015 | Notificación por alta y por baja en la convocatoria | FUNCTIONAL | BUSINESS_RULE | COM | P1 | ACTIVE |
| REQ-COM-016 | Notificación por cambio de destinatarios de un evento | FUNCTIONAL | BUSINESS_RULE | COM | P1 | ACTIVE |
| REQ-COM-017 | Hechos que no generan notificación | FUNCTIONAL | BUSINESS_RULE | COM | P0 | ACTIVE |
| REQ-COM-018 | Notificaciones: audiencia, deduplicación y estado de lectura | FUNCTIONAL | DATA_INTEGRITY | COM | P1 | ACTIVE |
| REQ-CMP-001 | Competencia: ciclo de vida | FUNCTIONAL | LIFECYCLE | CMP | P1 | ACTIVE |
| REQ-CMP-002 | Cierre de competencia | FUNCTIONAL | BUSINESS_RULE | CMP | P1 | ACTIVE |
| REQ-CMP-003 | Inscripción a competencia | FUNCTIONAL | LIFECYCLE | CMP | P1 | ACTIVE |
| REQ-CMP-004 | Alcances TEAM y LINE de una inscripción | FUNCTIONAL | BUSINESS_RULE | CMP | P0 | ACTIVE |
| REQ-CMP-005 | Uso de la inscripción en un partido | FUNCTIONAL | BUSINESS_RULE | CMP | P1 | ACTIVE |
| REQ-CMP-006 | Referencia externa manual | FUNCTIONAL | CAPABILITY | CMP | P2 | ACTIVE |
| REQ-CMP-007 | Límite de responsabilidad federativa | FUNCTIONAL | BUSINESS_RULE | CMP | P1 | ACTIVE |
| REQ-CMP-008 | Habilitación: alcance y visibilidad | FUNCTIONAL | AUTHORIZATION | CMP | P0 | ACTIVE |
| REQ-INS-001 | Búsqueda | FUNCTIONAL | CAPABILITY | INS | P1 | ACTIVE |
| REQ-INS-002 | Alcance y PII de la búsqueda | FUNCTIONAL | PII | INS | P0 | ACTIVE |
| REQ-INS-003 | Estado de la consulta en la navegación | FUNCTIONAL | USABILITY | INS | P2 | ACTIVE |
| REQ-INS-004 | Informe de asistencia | FUNCTIONAL | CAPABILITY | INS | P1 | ACTIVE |
| REQ-INS-005 | Informe de rendimiento | FUNCTIONAL | CAPABILITY | INS | P1 | ACTIVE |
| REQ-INS-006 | Alcance de los informes | FUNCTIONAL | AUTHORIZATION | INS | P0 | ACTIVE |
| REQ-INS-007 | Enlace al origen desde los informes | FUNCTIONAL | USABILITY | INS | P2 | ACTIVE |
| REQ-INS-008 | Auditoría: consulta | FUNCTIONAL | CAPABILITY | INS | P0 | ACTIVE |
| REQ-INS-009 | Auditoría: contenido mínimo | FUNCTIONAL | HISTORY_AUDIT | INS | P0 | ACTIVE |
| REQ-INS-010 | Auditoría: integridad | NON-FUNCTIONAL | HISTORY_AUDIT | INS | P0 | ACTIVE |
| REQ-INS-011 | Historia: fuentes visibles | FUNCTIONAL | HISTORY_AUDIT | INS | P0 | ACTIVE |
| REQ-INS-012 | Historia no genérica | NON-FUNCTIONAL | HISTORY_AUDIT | INS | P1 | ACTIVE |
| REQ-SYS-001 | Responsive con significado preservado | NON-FUNCTIONAL | RESPONSIVE | SYS | P0 | EVIDENCE_PENDING |
| REQ-SYS-002 | Objetivos táctiles | NON-FUNCTIONAL | ACCESSIBILITY | SYS | P1 | ACTIVE |
| REQ-SYS-003 | Semántica de controles y gestión de foco | NON-FUNCTIONAL | ACCESSIBILITY | SYS | P1 | EVIDENCE_PENDING |
| REQ-SYS-004 | Movimiento solo causal y reducción de movimiento | NON-FUNCTIONAL | ACCESSIBILITY | SYS | P2 | ACTIVE |
| REQ-SYS-005 | El estado se escribe, el color acompaña | NON-FUNCTIONAL | ACCESSIBILITY | SYS | P0 | ACTIVE |
| REQ-SYS-006 | Vocabulario de usuario, sin jerga interna | NON-FUNCTIONAL | USABILITY | SYS | P1 | ACTIVE |
| REQ-SYS-007 | Una pregunta dominante y una acción primaria | NON-FUNCTIONAL | USABILITY | SYS | P1 | ACTIVE |
| REQ-SYS-008 | Revelación progresiva | NON-FUNCTIONAL | USABILITY | SYS | P2 | ACTIVE |
| REQ-SYS-009 | Sin éxito falso | NON-FUNCTIONAL | DATA_INTEGRITY | SYS | P0 | ACTIVE |
| REQ-SYS-010 | El error preserva lo ingressado | NON-FUNCTIONAL | USABILITY | SYS | P0 | ACTIVE |
| REQ-SYS-011 | Vacío, cero y error son estados distintos | NON-FUNCTIONAL | DATA_INTEGRITY | SYS | P0 | ACTIVE |
| REQ-SYS-012 | No autorizado se oculta; bloqueado se deshabilita con razón | FUNCTIONAL | AUTHORIZATION | SYS | P0 | ACTIVE |
| REQ-SYS-013 | Navegación del navegador y enlace directo autosuficiente | NON-FUNCTIONAL | USABILITY | SYS | P0 | ACTIVE |
| REQ-SYS-014 | Coherencia entre superficies | NON-FUNCTIONAL | DATA_INTEGRITY | SYS | P0 | ACTIVE |
| REQ-SYS-015 | Verdad de la superficie | NON-FUNCTIONAL | DATA_INTEGRITY | SYS | P0 | ACTIVE |
| REQ-SYS-016 | Idempotencia de las órdenes | NON-FUNCTIONAL | RELIABILITY | SYS | P0 | ACTIVE |
| REQ-SYS-017 | Concurrencia optimista | NON-FUNCTIONAL | DATA_INTEGRITY | SYS | P0 | ACTIVE |
| REQ-SYS-018 | Una orden, una transacción | NON-FUNCTIONAL | DATA_INTEGRITY | SYS | P0 | ACTIVE |
| REQ-SYS-019 | Proyecciones con un único dueño de escritura | NON-FUNCTIONAL | DATA_INTEGRITY | SYS | P0 | ACTIVE |
| REQ-SYS-020 | Protección de datos en registros | NON-FUNCTIONAL | SECURITY | SYS | P0 | ACTIVE |
| REQ-SYS-021 | Transporte y almacenamiento seguro | NON-FUNCTIONAL | SECURITY | SYS | P0 | ACTIVE |
| REQ-SYS-022 | Disponibilidad, respaldo y recuperación | NON-FUNCTIONAL | OPERATIONAL | SYS | P1 | EVIDENCE_PENDING |
| REQ-SYS-023 | Rendimiento de consultas comunes | NON-FUNCTIONAL | PERFORMANCE | SYS | P1 | EVIDENCE_PENDING |
| REQ-SYS-024 | Latencia de notificación | NON-FUNCTIONAL | PERFORMANCE | SYS | P1 | EVIDENCE_PENDING |
| REQ-SYS-025 | Efectos asíncronos durables | NON-FUNCTIONAL | RELIABILITY | SYS | P1 | ACTIVE |
| REQ-SYS-026 | Evolución compatible | NON-FUNCTIONAL | RELIABILITY | SYS | P2 | ACTIVE |
| REQ-SYS-027 | Puerta externa de privacidad | NON-FUNCTIONAL | PROJECT_CONSTRAINT | SYS | P1 | EXTERNAL |

---

# 20. REGLAS DE MANTENIMIENTO DE ESTE CATÁLOGO

1. Los identificadores publicados no se renumeran. Un requisito retirado conserva su ID con
   `STATUS: SUPERSEDED BY REQ-XXX-NNN`.
2. Todo requisito nuevo requiere fuente citada. No se admiten requisitos sin fuente.
3. Un cambio de comportamiento de V1 exige revisión de `GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md`
   según su §82, antes de modificar este catálogo.
4. Toda itemización `IMPLEMENTATION_WITHOUT_REQUIREMENT` que se convierta en necesidad real debe
   entrar por decisión de producto explícita, no por observación de una pantalla.
5. Este catálogo no diseña arquitectura, base de datos, endpoints ni pantallas. Las decisiones de
   arquitectura ya congeladas en PT §29 y §60–§71 no se revisan aquí.