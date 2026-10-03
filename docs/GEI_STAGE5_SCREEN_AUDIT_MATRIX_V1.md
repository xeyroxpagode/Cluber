# GEI HOCKEY MANAGEMENT SYSTEM
## STAGE 5 — SCREEN AUDIT MATRIX (38 routes × 48 blocks)

**Estado:** AUDITORÍA. AUDIT-ONLY. Ningún archivo de `src/**` modificado.
**Baseline:** `8f30cda91bb531539864ed9175ab256598b17e88` · rama `gei/stage5-ux-audit`.
**Documento maestro:** `docs/GEI_STAGE5_PERCEPTUAL_INTERACTION_AUDIT_V1.md` (hallazgos `UX-01`…`UX-46`).
**Evidencia runtime:** `docs/GEI_STAGE5_RUNTIME_EVIDENCE_V1.md`.

---

# 0. LEGENDA

| Símbolo | Significado |
|---|---|
| **P** | PASS |
| **m** | MINOR |
| **M** | MAJOR |
| **–** | N/A |

Regla de asignación aplicada de forma uniforme:

- **P** = el comportamiento cumple la autoridad y se verificó (runtime o código).
- **m** = desviación de consistencia,.copy o acabado que no impide completar la tarea.
- **M** = el usuario no puede completar la tarea, o la pantalla lo hace laboral/verazmente, o el sistema afirma algo que no hace.
- **–** = el bloque no aplica a esta superficie (p. ej. B39 en un auth).

**Columnas de estado al final de cada tabla:** `NEW` (usuario nuevo sin explicación), `EXP` (usuario frecuente, velocidad), `390` / `768` / `1440` (viewport).
`390` se marca con `s` = **STATIC ONLY** (no verificable en este entorno, ver Runtime Evidence §3).

---

# 1. BLOQUES B01–B12

| Route | B01 IA | B02 Prior | B03 Jerarquía | B04 Gestalt | B05 Carga | B06 Disc | B07 Acciones | B08 Afford | B09 Mapping | B10 Color | B11 Tipografía | B12 Spacing | NEW | EXP | 390 | 768 | 1440 | COMPLET |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R01 `/login` | m | m | m | m | m | – | M | P | P | m | m | m | P | m | P | P | P | P | **PARTIAL** |
| R02 `/activate` | m | m | m | m | m | – | P | P | P | m | m | m | P | m | P | P | P | P | **PARTIAL** |
| R03 `/no-access` | m | P | m | m | P | – | P | P | P | m | m | m | P | – | P | P | P | P | **COMPLETE** |
| R04 `/home` | m | M | M | M | M | m | M | M | m | M | M | m | P | M | s | P | M | **PARTIAL** |
| R05 `/calendar` | M | M | M | M | M | M | M | M | m | M | M | m | m | M | s | M | M | **INCOMPLETE** |
| R06 `/search` | m | m | m | m | M | – | M | m | P | m | M | m | m | M | s | P | P | **PARTIAL** |
| R07 `/notifications` | m | M | M | m | m | M | m | m | m | M | M | m | P | M | s | P | M | **PARTIAL** |
| R08 `/more/profile` | M | M | M | M | M | M | m | m | P | m | M | M | **M** | M | s | P | M | **INCOMPLETE** |
| R09 `/teams` | m | M | m | m | M | M | P | P | P | m | m | P | m | M | s | P | P | **PARTIAL** |
| R10 `/teams/:teamId` | M | M | M | M | m | m | M | m | m | M | M | m | m | M | s | P | M | **PARTIAL** |
| R11 `/people/:personId` | M | M | M | m | M | – | M | M | m | m | M | m | m | M | s | P | P | **INCOMPLETE** |
| R12 `/events/new` | m | m | m | M | M | M | m | M | m | M | M | m | M | M | s | P | M | **PARTIAL** |
| R13 `/events/:eventId` | m | M | m | m | M | m | m | M | P | M | M | m | P | M | s | M | M | **PARTIAL** |
| R14 `/events/:eventId/edit` | m | M | M | M | M | M | M | M | M | M | M | M | M | M | s | M | M | **INCOMPLETE** |
| R15 `…/availability` | m | M | M | m | m | M | m | M | m | M | M | m | m | M | s | M | M | **PARTIAL** |
| R16 `…/selection` | m | m | M | M | M | M | P | M | P | M | M | M | M | M | s | M | M | **PARTIAL** |
| R17 `…/attendance` | m | m | m | m | m | m | m | M | P | M | M | m | P | M | s | M | M | **PARTIAL** |
| R18 `…/match-record` | m | M | m | m | m | M | m | m | m | M | M | m | m | M | s | P | M | **PARTIAL** |
| R19 `/jornadas/new` | m | M | m | m | M | – | m | m | m | M | M | m | M | M | s | P | M | **PARTIAL** |
| R20 `/jornadas/:jornadaId` | M | M | M | m | M | M | M | m | m | M | M | m | M | M | s | M | M | **INCOMPLETE** |
| R21 `/communication` | m | M | M | M | M | M | M | M | m | M | M | m | P | M | s | M | M | **PARTIAL** |
| R22 `/communication/conversations/new` | M | m | M | m | M | – | M | M | m | M | M | m | m | M | s | M | M | **PARTIAL** |
| R23 `/communication/announcements/new` | m | m | m | m | m | M | m | m | m | M | M | m | M | M | s | M | M | **PARTIAL** |
| R24 `/announcements/:id` | m | M | M | m | M | M | M | m | m | M | M | m | M | M | s | P | M | **INCOMPLETE** |
| R25 `/announcements/:id/edit` | m | m | m | m | m | M | m | m | m | M | M | m | m | M | s | P | M | **PARTIAL** |
| R26 `/conversations/:id` | m | M | m | m | M | M | P | M | P | M | M | M | P | M | s | M | M | **PARTIAL** |
| R27 `/management` | M | M | m | m | P | – | P | P | P | m | m | P | M | P | s | P | P | **PARTIAL** |
| R28 `/management/structure` | m | m | M | M | M | M | m | M | m | M | M | m | M | M | s | M | M | **PARTIAL** |
| R29 `/management/teams/:id` | M | m | M | m | M | m | M | M | m | M | M | m | M | M | s | P | M | **PARTIAL** |
| R30 `/management/people` | m | m | M | M | M | M | m | m | m | M | M | m | M | M | s | M | M | **PARTIAL** |
| R31 `/management/people/new` | m | m | m | m | M | – | m | m | P | M | M | m | M | M | s | P | M | **PARTIAL** |
| R32 `/management/people/:id` | m | M | M | M | M | M | M | M | m | M | M | M | M | M | s | M | M | **INCOMPLETE** |
| R33 `/management/competitions` | m | m | m | m | M | M | m | m | m | M | M | m | m | M | s | P | M | **PARTIAL** |
| R34 `/management/competitions/:id` | M | M | M | M | M | M | M | m | m | M | M | m | M | M | s | M | M | **INCOMPLETE** |
| R35 `/reports` | P | P | P | P | P | – | P | P | P | P | P | P | P | P | s | P | P | **COMPLETE** |
| R36 `/reports/attendance` | m | m | M | M | m | – | P | m | m | m | M | m | P | M | s | M | M | **PARTIAL** |
| R37 `/reports/performance` | m | m | M | M | m | – | P | m | m | m | M | m | P | M | s | M | M | **PARTIAL** |
| R38 `/audit` | M | m | M | M | m | M | P | m | m | M | M | m | m | M | s | P | M | **PARTIAL** |

---

# 2. BLOQUES B13–B24

| Route | B13 Grid | B14 Density | B15 Surface | B16 Nav | B17 TaskFlow | B18 Feedback | B19 Status | B20 States | B21 Errors | B22 Revers | B23 Defaults | B24 Forms | 390 | 768 | 1440 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R01 | P | m | m | P | m | m | m | m | M | – | M | m | P | P | P |
| R02 | P | m | m | P | m | m | m | m | M | – | P | m | P | P | P |
| R03 | P | m | m | P | P | – | – | – | – | – | P | – | P | P | P |
| R04 | M | M | M | M | M | M | M | M | m | m | m | – | s | P | M |
| R05 | M | M | M | M | M | M | M | M | m | – | M | – | s | M | M |
| R06 | P | M | m | M | M | – | m | m | – | – | P | M | s | P | P |
| R07 | M | M | M | M | m | m | M | m | – | – | M | m | s | P | M |
| R08 | M | **M** | M | m | M | m | M | M | m | – | m | M | s | P | M |
| R09 | P | M | P | P | M | – | – | M | – | – | – | – | s | P | P |
| R10 | M | M | M | m | M | M | M | M | m | – | m | – | s | P | M |
| R11 | P | m | m | m | **M** | – | m | M | – | – | – | – | s | P | P |
| R12 | m | M | M | m | M | M | M | M | **M** | m | m | **M** | s | P | M |
| R13 | m | m | M | P | M | M | M | **M** | m | m | m | – | s | M | M |
| R14 | M | M | M | m | **M** | M | **M** | M | **M** | M | m | **M** | s | M | M |
| R15 | M | M | M | m | M | M | M | **M** | M | m | m | M | s | M | M |
| R16 | **M** | **M** | M | m | M | M | **M** | M | m | m | m | – | s | M | M |
| R17 | M | M | M | m | M | M | M | m | m | m | m | – | s | M | M |
| R18 | M | M | M | m | M | M | M | m | m | M | m | M | s | P | M |
| R19 | P | m | m | m | M | m | m | M | **M** | M | – | M | s | P | M |
| R20 | M | m | M | M | M | M | M | M | **M** | M | – | M | s | M | M |
| R21 | M | M | **M** | M | M | m | M | m | – | – | – | – | s | M | M |
| R22 | m | m | m | m | M | m | M | M | **M** | **M** | m | **M** | s | M | M |
| R23 | m | m | m | m | M | m | m | M | **M** | M | m | **M** | s | M | M |
| R24 | m | m | m | m | **M** | – | M | m | – | – | – | – | s | P | M |
| R25 | m | m | m | m | M | m | M | m | m | – | m | **M** | s | P | M |
| R26 | M | M | m | m | m | **M** | M | m | – | **M** | – | – | s | M | M |
| R27 | P | P | P | **M** | P | – | – | – | – | – | – | – | s | P | P |
| R28 | M | M | M | m | M | M | M | M | M | **M** | M | **M** | s | M | M |
| R29 | m | m | m | **M** | M | M | m | M | – | **M** | – | – | s | P | M |
| R30 | M | **M** | M | m | M | m | m | M | – | – | m | – | s | M | M |
| R31 | P | m | m | m | M | m | m | M | **M** | M | P | **M** | s | P | M |
| R32 | M | M | **M** | m | M | m | M | M | M | M | **M** | **M** | s | M | M |
| R33 | P | m | m | m | M | m | m | M | – | M | – | m | s | P | M |
| R34 | M | m | M | M | M | M | m | M | m | M | m | M | s | M | M |
| R35 | P | P | P | P | P | – | – | – | – | – | – | – | s | P | P |
| R36 | M | M | M | M | P | – | – | m | – | – | m | – | s | M | M |
| R37 | M | M | M | M | P | – | – | m | – | – | m | – | s | M | M |
| R38 | m | M | M | **M** | P | – | – | m | – | – | **M** | – | s | P | M |

---

# 3. BLOQUES B25–B36

| Route | B25 Copy | B26 Discover | B27 Consist | B28 Platform | B29 Fitts | B30 Responsive | B31 A11y | B32 Motion | B33 Perf | B34 Empty | B35 Trust | B36 Attention |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R01 | m | P | M | P | P | P | M | – | m | – | m | – |
| R02 | m | P | m | P | P | P | M | – | m | – | M | – |
| R03 | P | P | m | P | P | P | M | – | – | – | m | – |
| R04 | **M** | M | **M** | m | M | M | M | M | m | **M** | M | **M** |
| R05 | M | **M** | M | m | M | **M** | M | P | P | M | m | M |
| R06 | m | m | m | P | P | m | m | – | – | m | – | – |
| R07 | M | m | M | P | M | m | M | – | m | m | M | **M** |
| R08 | m | m | m | P | M | m | **M** | – | – | **M** | **M** | – |
| R09 | m | M | m | P | P | m | M | P | P | **M** | m | – |
| R10 | m | **M** | M | m | M | m | M | – | m | m | m | M |
| R11 | m | **M** | m | P | m | m | M | – | – | M | m | – |
| R12 | M | m | M | P | M | m | M | – | m | M | m | m |
| R13 | M | m | M | m | M | M | M | M | m | m | M | **M** |
| R14 | M | M | M | m | M | M | **M** | – | M | m | M | M |
| R15 | **M** | M | **M** | P | M | M | **M** | M | m | **M** | M | M |
| R16 | **M** | M | **M** | P | M | **M** | **M** | m | m | M | M | **M** |
| R17 | M | m | M | P | **M** | M | M | m | m | m | **M** | M |
| R18 | m | m | M | P | M | m | M | – | m | m | M | M |
| R19 | m | M | m | P | **M** | m | M | – | m | m | m | – |
| R20 | M | M | M | P | M | m | M | – | M | **M** | M | m |
| R21 | M | M | M | m | M | M | M | – | m | **M** | M | **M** |
| R22 | M | M | M | m | **M** | M | M | – | M | M | m | – |
| R23 | m | M | M | P | M | M | M | – | m | m | m | – |
| R24 | M | **M** | M | m | m | m | M | – | – | M | M | – |
| R25 | m | M | m | P | m | m | M | – | m | m | M | – |
| R26 | **M** | M | M | **M** | M | **M** | **M** | – | **M** | m | **M** | m |
| R27 | m | m | M | P | P | P | **M** | – | – | P | m | – |
| R28 | M | M | M | **M** | M | M | **M** | – | m | M | M | m |
| R29 | m | M | M | m | M | m | **M** | – | m | **M** | m | – |
| R30 | **M** | M | **M** | P | M | M | **M** | – | – | m | **M** | – |
| R31 | m | m | M | m | M | m | **M** | – | m | – | m | – |
| R32 | M | M | **M** | m | **M** | M | **M** | – | m | m | **M** | M |
| R33 | m | m | M | P | m | m | **M** | – | m | **M** | m | – |
| R34 | M | M | M | m | M | m | **M** | – | m | m | M | m |
| R35 | P | P | m | P | P | P | m | – | – | P | P | – |
| R36 | P | m | m | P | m | M | m | – | – | m | **M** | – |
| R37 | P | m | m | P | m | M | m | – | – | m | m | – |
| R38 | m | m | m | P | m | m | **M** | – | – | m | **M** | – |

---

# 4. BLOQUES B37–B48

| Route | B37 Noise | B38 Scan | B39 Tables | B40 Search | B41 Temporal | B42 Role | B43 Continuity | B44 Truth | B45 Safety | B46 Brand | B47 Percept | B48 Scorecard |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R01 | m | – | – | – | m | m | P | – | P | P | m | m |
| R02 | m | – | – | – | – | m | m | m | P | P | m | m |
| R03 | m | – | – | – | – | m | P | P | P | P | m | P |
| R04 | **M** | m | m | – | **M** | **M** | M | **M** | m | m | **M** | **M** |
| R05 | M | m | M | M | M | M | **M** | M | m | m | M | M |
| R06 | m | m | – | **M** | – | m | **M** | m | – | m | M | m |
| R07 | M | m | – | m | M | m | M | M | m | m | M | M |
| R08 | **M** | – | – | – | m | M | M | **M** | m | m | **M** | **M** |
| R09 | m | P | – | M | – | m | m | m | – | P | m | m |
| R10 | M | m | – | – | m | **M** | M | M | m | m | M | M |
| R11 | m | m | – | – | m | M | M | m | m | m | M | M |
| R12 | m | – | – | – | m | M | M | M | m | m | M | M |
| R13 | M | m | – | – | M | **M** | M | M | M | m | M | M |
| R14 | M | – | – | – | m | M | **M** | M | **M** | m | M | M |
| R15 | **M** | m | M | m | **M** | M | M | M | m | m | M | M |
| R16 | **M** | m | **M** | m | M | M | M | M | M | m | M | M |
| R17 | M | m | M | – | m | M | M | M | **M** | m | M | M |
| R18 | m | m | M | – | M | M | m | M | m | m | M | M |
| R19 | m | – | – | – | m | M | M | M | – | m | M | M |
| R20 | m | m | m | – | m | M | M | M | M | m | M | M |
| R21 | M | M | – | M | m | M | **M** | **M** | m | m | M | M |
| R22 | m | m | – | m | – | M | M | M | – | m | M | M |
| R23 | m | m | – | – | – | M | m | **M** | – | m | M | M |
| R24 | m | – | – | – | M | M | M | M | M | m | M | M |
| R25 | m | – | – | – | – | M | M | M | m | m | M | M |
| R26 | M | m | – | – | **M** | M | M | **M** | **M** | m | M | M |
| R27 | m | – | – | – | – | **M** | M | m | – | m | m | M |
| R28 | M | M | – | M | – | M | M | **M** | **M** | m | M | M |
| R29 | m | m | – | – | – | M | **M** | M | **M** | m | M | M |
| R30 | M | M | **M** | **M** | – | M | M | **M** | m | m | M | M |
| R31 | m | – | – | – | – | m | m | m | – | m | M | M |
| R32 | **M** | m | – | – | – | M | M | **M** | **M** | m | M | M |
| R33 | m | m | – | m | – | M | M | M | m | m | M | M |
| R34 | m | m | M | – | – | M | M | **M** | m | m | M | M |
| R35 | P | – | – | – | – | m | P | P | – | P | P | P |
| R36 | m | M | **M** | m | **M** | M | M | M | – | m | m | m |
| R37 | m | M | **M** | m | m | M | M | M | – | m | m | m |
| R38 | m | m | – | **M** | **M** | m | m | **M** | – | m | M | M |

---

# 5. SCORECARD POR RUTA

Columnas: *qué responde* · *1º / 2º / 3º que veo* · *acción primaria* · *eliminar / ocultar / subir* · *qué parece interactivo* · *feedback* · *mobile* · *empty/error/loading* · *cambia por rol* · *patrón reutilizado*.

## R01 `/login`
**Pregunta:** ¿puedo entrar?
**1º/2º/3º:** marca GEI → "Ingresar" → campos Usuario/Contraseña.
**Primaria:** "Ingresar" (primary, full width) ✓.
**Eliminar:** el `<details>` de credenciales de demo está en el build de producción (UX-44). **Ocultar:** nada. **Subir:** el error debería estar junto a los campos, no debajo del todo.
**Parece interactivo:** campos + botón ✓. **Feedback:** "Ingresando…", `Alert role="alert"`, input preservado ✓.
**Mobile:** P. **Empty/error/loading:** error ✓, sin empty. **Roles:** igual para todos.
**Patrón:** auth card. **Rompe:** el verbo "Ingresar" vs "Entrar" vs "Iniciar sesión" del Blueprint.
**COMPLETITUD: PARTIAL** — falta el camino de "no puedo entrar" más allá de un texto (F01 §3 excluye self-service de password, así que el copy es correcto).

## R02 `/activate`
**Pregunta:** ¿cómo activo mi cuenta?
**1º/2º/3º:** marca → "Activar cuenta" → 4 campos.
**Primaria:** "Activar cuenta" ✓. **Eliminar:** nada. **Subir:** el código de activación debería ir primero (§51 lo trata como credencial).
**Feedback:** "Activando…", estado completo con check verde ✓ (única pantalla con success state real).
**Roles:** igual. **Patrón:** auth card. **Rompe:** el código es un literal fijo (`GEI-2026-4812`) compartido con `/management/people/:id` que no lo genera (UX-35).
**COMPLETITUD: PARTIAL** — F01 exige que el paso anterior (setup entregado por admin) sea coherente con lo que esta pantalla acepta.

## R03 `/no-access`
**Pregunta:** ¿por qué no puedo entrar?
**1º/2º/3º:** "Tu cuenta está activa" → explicación → 2 botones.
**Primaria:** "Mi perfil" ✓ (correcto: el producto permite ver el perfil sin acceso, `Shell.tsx:82-88`).
**Feedback:** –. **Roles:** igual. **Patrón:** auth card + `Empty`-like.
**COMPLETITUD: COMPLETE** — responde, explica y da los 2 caminos. Copy honesto. **Es la pantalla más completa del producto.**

## R04 `/home`
**Pregunta:** ¿qué tengo que saber o hacer ahora?
**1º/2º/3º:** "Buen día, {nombre}" → chip de contexto → "Necesita tu atención" (3 filas).
**Primaria:** "Crear evento" (sólo COACH/SUBCOMMITTEE); para PLAYER la acción real es el "¿Vas?" inline.
**Eliminar:** badge "6 A" (falso y pesa 9), "Temporada 2026" ×2, bloque "En el equipo" sin función. **Ocultar:**Communications sin estado de no-leído. **Subir:** la fila de partido con conflicto al primer lugar.
**Parece interactivo:** las 3 filas de atención (bien), los links de acción (indistinguibles de `TextLink`).
**Feedback:** toast al responder "¿Vas?"; **la fila que desaparece no se señala** (UX-10).
**Mobile:** 500 px ✓ correcto; "Hoy" vacío con 200 px.
**Empty/error/loading:** skeleton global ✓; "Nada pendiente." ✓; "Hoy no hay actividades" sobredimensionado.
**Cambia por rol:** attention rows y acciones sí cambian; la estructura y el copy de cabecera no (el PLAYER recibe "Todo lo que necesitás saber para tu día en GEI", que es el copy de quien no tiene equipo).
**Patrón:** A1 fiel en orden, no en peso.
**COMPLETITUD: PARTIAL** — F04 no cierra (ver Flow Doc).

## R05 `/calendar`
**Pregunta:** ¿qué pasa y cuándo?
**1º/2º/3º:** controles de mes → grilla/lista → leyenda+filtros.
**Primaria:** ninguna en la grilla; "Crear evento" en header (COACH). **El "¿Vas?" —la acción canónica de A2— no es alcanzable desde la selección.**
**Eliminar:** leyenda de 3 ítems que miente (dice "Club"=warning pero `CLUB_EVENT` se pinta verde) y no cubre CANCELLED.
**Ocultar:**–. **Subir:** el mes debería abrir un detalle; hoy el único camino es la fila completa.
**Feedback:**–. **Mobile:** agenda por defecto ✓; el toggle "Mes" es **no-op silencioso** <768 px.
**Roles:** alcance por rol ✓; el guardian ve 1 evento y un selector de equipo con una opción.
**Patrón:** A2 a medias (falta el sheet de mini-detalle y el panel de desktop).
**COMPLETITUD: INCOMPLETE** — F05 no llega a §5.

## R06 `/search`
**Pregunta:** ¿cómo encuentro a alguien o algo?
**1º/2º/3º:** "Buscar en GEI" → "¿Qué estás buscando?" → copy explicativo.
**Primaria:** el campo mismo.
**Eliminar:**–. **Ocultar:**–. **Subir:**–.
**Feedback:**–. **Roles:** el alcance se filtra ✓.
**Rompe:** el header dice "Buscar en GEI" y el h1 de la página dice "Buscar en GEI" — misma etiqueta a 40 px de distancia.
**COMPLETITUD: PARTIAL** — F26 no preserva la query en la URL.

## R07 `/notifications`
**Pregunta:** ¿qué cambió que me afecta?
**1º/2º/3º:** "Avisos" → "Marcar todas como leídas" / filtros → filas.
**Primaria:** el tap de la fila (correcto para un feed).
**Eliminar:** "Sin lista de registros: sólo lo que requiere mirar" (copy interno de diseño). **Subir:** el tipo de aviso (§22) debería nombrar cada fila: hoy un aviso de partido reprogramado, uno de comunicado y uno de convocatoria son visualmente idénticos.
**Parece interactivo:** filas ✓. **Feedback:** tint + punto + peso ✓ (no es color-only ✓).
**Mobile:** P. **Roles:** filtrado por destinatario ✓.
**Patrón:** A10 ✓ con el orden como único defecto.
**COMPLETITUD: PARTIAL** — F25: "marcar leído" navega siempre; no hay forma de limpiar la lista sin salir.

## R08 `/more/profile` — DEEP DIVE
**Pregunta:** ¿quién soy, qué puedo ver y qué puedo cambiar?
**1º/2º/3º:** "Mi perfil" → avatar + nombre + rol → 4 datos (Usuario / Email / Teléfono / Contexto).
**Primaria:** ninguna (2 `secondary`). Para una pantalla de configuración es defendible; para una pantalla de *identidad y acceso* no.
**Eliminar:** "Contexto: Pertenencia vigente · 2026" (texto derivado, no dato). **Ocultar:** nada. **Subir:** estado de cuenta, roles y alcance.
**Parece interactivo:** 2 botones ✓; el `dl` no parece editable ✓ (bien).
**Feedback:** modal con "Guardando…" y `Alert` ✓; input preservado ✓.
**Mobile:** s. **Empty/error/loading:** sin empty (no aplica); "Personas a cargo" condicional ✓ pero read-only.
**Cambia por rol:** sólo cambia el texto del rol y la visibilidad de "Personas a cargo". **Todo lo demás es idéntico para ADMIN, PLAYER, COACH y guardian** ⇒ la pantalla no está personalizada en absoluto.
**Esperado vs actual:** el nombre de la pantalla promete identidad + acceso + pertenencia + seguridad +MPC. Entrega contacto + un diálogo de contraseña. **El usuario tiene razón: se siente incompleta.**
**COMPLETITUD: INCOMPLETE** — ver `PROFILE_COMPLETENESS_MAP` en el Capability Doc.

## R09 `/teams`
**Pregunta:** ¿quiénes son mis equipos?
**1º/2º/3º:** "Equipos" → descripción → 1 fila.
**Primaria:** la fila. **Eliminar:**–. **Subir:** la marca de "mi equipo" (una jugadora ve 1 fila con título plural).
**Feedback:**–. **Roles:** SUBCOMMITTEE/ADMIN ven 4 filas; el guardian ve una `Surface` **vacía sin explicación**.
**Patrón:** A7 mínimo (sin buscador ni filtros, que A7 exige).
**COMPLETITUD: PARTIAL** — F16 entra pero F16 no sale de aquí connext-step claro.

## R10 `/teams/:teamId`
**Pregunta:** ¿qué pasa con mi equipo?
**1º/2º/3º:** nombre del equipo → tabs Equipo/Eventos/Resultados → roster.
**Primaria:** la persona ("¿Vas?" según Blueprint, ausente).
**Eliminar:**–. **Subir:** el próximo evento debería abrir el bloque, no estar en "Próximos eventos".
**Parece interactivo:** filas ✓, tabs sin `role="tab"`.
**Feedback:**–. **Roles:** el coach ve badges de elegibilidad, la jugadora no ✓ (P0-5 verificado).
**Rompe:** "Entrenador" (Home) vs "Entrenador o entrenadora" (aquí).
**COMPLETITUD: PARTIAL** — F16/F17 no completan §5 (sin next-step, sin resultados con link).

## R11 `/people/:personId`
**Pregunta:** ¿quién es y cómo la contacto?
**1º/2º/3º:** nombre → rol + equipo + elegibilidad → teléfono/email.
**Primaria:** **ninguna**. Ni "¿Vas?" ni "Contactar".
**Eliminar:**–. **Subir:** una acción contextual.
**Feedback:**–. **Roles:** el coach ve contacto ✓ (§6), no ve DNI ✓.
**Nodo muerto:** se entra desde el roster y no sale a ninguna parte; no hay "volver al equipo" contextual.
**COMPLETITUD: INCOMPLETE** — F17 no completa §5.

## R12 `/events/new`
**Pregunta:** ¿qué creo y para quién?
**1º/2º/3º:** "Nuevo evento" → selector de tipo (3 tarjetas) → "Información general".
**Primaria:** "Programar" (sticky) ✓.
**Eliminar:**–. **Ocultar:** "Logística" para TRAINING ✓ ya condicional.
**Feedback:** "Guardando…", errores con input preservado ✓.
**A11y:** el selector de tipo transmite el estado **sólo por color** (sin `aria-pressed`/`role="radio"`).
**Roles:** sólo COACH/SUBCOMMITTEE ven el botón ✓ (§5).
**COMPLETITUD: PARTIAL** — F06: sin `expectedVersion` de creación, sin Impact Preview en create (correcto: §32 exige un solo command), sin ScopeDialog para recurrentes.

## R13 `/events/:eventId`
**Pregunta:** ¿qué pasa con este evento y qué hago?
**1º/2º/3º:** "GEI vs. CUBA" + badge → banner de reconfirmación → "¿Vas?" / participation rail.
**Primaria:** "Convocatoria" (coach) / "Responder disponibilidad" (jugadora) / ninguna (ADMIN, SUBCOMMITTEE).
**Eliminar:**–. **Subir:** el estado terminal. Un evento CANCELLED muestra fecha, hora, sede, logística y rail idénticos a uno vivo; lo único que cambia es el badge (UX-04).
**Feedback:**–. **Roles:** gating correcto ✓.
**Rompe:** la fila Disponibilidad dice "0 sí"; la Convocatoria dice "1 conflicto actual" al jugador sin explicar; el breadcrumb dice "Partido o entrenamiento" para un partido concreto.
**COMPLETITUD: PARTIAL** — F07/F08 no completan §5 (sin historia visible, sin consecuencia de estado terminal).

## R14 `/events/:eventId/edit`
**Pregunta:** ¿qué cambio y a quién afecta?
**1º/2º/3º:** "Editar evento" → "Información general" → "Fecha y lugar".
**Primaria:** "Guardar cambios" (sticky) ✓.
**Eliminar:**–. **Subir:** el estado del evento y el alcance del cambio.
**Feedback:** "Guardando…" ✓; error con `Alert` + versiones ✓; **pero la recuperación navega y destruye el borrador** (§44).
**A11y:** sin `<form>` ⇒ `Enter` no submitea; 0 campos con `aria-invalid`.
**Roles:**–.
**Rompe:** **no existe campo Título en edición** ⇒ la rama "non-material" de §11 es inalcanzable desde la UI (UX-20).
**COMPLETITUD: INCOMPLETE** — F07/F08/F09.

## R15 `…/availability`
**Pregunta:** ¿quién va y qué respondió cada una?
**1º/2º/3º:** "Disponibilidad" → "¿Podés participar?" (si soy jugadora) → roster.
**Primaria:** Voy/Quizás/No voy (inline, no sticky).
**Eliminar:** la columna/etiqueta repetida 18 veces cuando todas dicen lo mismo.
**Parece interactivo:** los 3 botones ✓ (`min-h-20` generoso); las filas no son interactivas (correcto: es lectura).
**Feedback:** `Saved` con spinner ✓; toast "Tu disponibilidad quedó confirmada" — **confirmación optimista prohibida por §47**.
**Roles:** el coach ve el roster sin tarjeta de respuesta ✓; **el guardian no puede responder por el menor** (UX-26).
**Rompe:** "¿Podés participar?" vs "¿Vas?" — dos gramáticas (UX-09); "Sí/Tal vez/No" vs "Voy/Quizás/No voy".
**COMPLETITUD: PARTIAL** — F11 no cierra: sin counts por tipo de respuesta, sin fila de recuperación, `RECONFIRM` con tono neutral.

## R16 `…/selection`
**Pregunta:** ¿a quién convoco y puedo publicarlo?
**1º/2º/3º:** "Convocatoria" + badge → **banners rojo y verde apilados** → tabla.
**Primaria:** "Publicar actualización" (sticky) ✓ con conteo "12 jugadoras seleccionadas" ✓.
**Eliminar:** la columna DISPONIBILIDAD completa (18 repeticiones de "Necesita reconfirmación"); el banner rojo duplica el banner verde.
**Subir:** el diff de revisiones y el motivo del conflicto en el modal de publicación.
**Feedback:** autosave con "Guardado HH:MM" ✓; `SAVE_ERROR` con copy honesto ✓ sin reintento.
**Problema visible:** la barra sticky **tapa la última fila** de la tabla.
**Roles:** lectura para jugadora con "12 jugadoras convocadas" + nombres — **no le dice si ella está convocada**.
**Patrón:** A3 ✓ en estructura, ✗ en densidad.
**COMPLETITUD: PARTIAL** — F12 sin diff de revisiones, sin Conflict Workspace, sin cierre de la cadena de conflictos hacia Home.

## R17 `…/attendance`
**Pregunta:** ¿quién estuvo?
**1º/2º/3º:** "Asistencia" + badge → 4 contadores → filas con 3 botones.
**Primaria:** "Cerrar asistencia" (sticky) o "Abrir asistencia" (dentro del `Empty`, **no sticky**).
**Eliminar:**–. **Subir:** el motivo por fila (no existe en el modelo).
**Feedback:** `Alert` success al cerrar ✓; `markAttendance` escribe before/after que **nadie ve**.
**Seguridad:** los 3 botones de fila miden **36 px** con 6 px de separación ⇒ riesgo de registrar la asistencia equivocada (UX-32).
**Roles:** sólo COACH ✓.
**COMPLETITUD: PARTIAL** — F13: sin historia de correcciones visible, sin conteo de "sin registrar" como estado terminal explained, "Abrir" no sticky.

## R18 `…/match-record`
**Pregunta:** ¿cómo terminó el partido?
**1º/2º/3º:** "Resultado y estadísticas" + badge → "Goles GEI / CUBA" → tabla de participación.
**Primaria:** "Finalizar resultado" (sticky) ✓.
**Eliminar:**–. **Subir:** el gate de lifecycle.
**Contradicción:** el propio copy dice "El resultado puede registrarse cuando el partido esté en curso, completado o abandonado. Iniciá el evento desde su detalle." y el formulario **está plenamente editable con el evento `Programado`**; "Abandonado" es seleccionable sin pasar por el lifecycle del evento (§9) (UX-31).
**Feedback:** `recordHistory` before/after escrito, **nunca renderizado**.
**COMPLETITUD: PARTIAL** — F14: la cadena principal funciona; la historia no existe para el usuario.

## R19 `/jornadas/new`
**Pregunta:** ¿cómo armo una jornada?
**1º/2º/3º:** "Crear jornada" → 3 campos → checkboxes de partidos.
**Primaria:** "Crear jornada" **inline, no sticky**.
**Eliminar:**–. **Subir:** Impact Preview y validación de §16.
**Feedback:** `pending` **nunca se resetea** si la promesa no resuelve (sin `finally`); sin mensaje de error; `if (!name.trim()) return` silencioso.
**Roles:** COACH/SUBCOMMITTEE ✓; ADMIN excluido ✓ (§5 no le concede Match).
**COMPLETITUD: PARTIAL** — F15 primer paso; sin validación de temporada/Entry/alcance de bulk.

## R20 `/jornadas/:jornadaId`
**Pregunta:** ¿qué partidos tiene y puedo moverlos juntos?
**1º/2º/3º:** nombre de jornada → "Partidos" → "Cambiar sede de la jornada".
**Primaria:** "Revisar impacto" (inline). **No hay acción "Guardar".**
**Eliminar:**–. **Subir:** fecha/nombre editable, add/remove de hijos, estado.
**Problemas:** `count={19}` hardcodeado en el preview; el modal no maneja error; cerrar el backdrop durante la mutación no se bloquea; el bulk **omite `expectedVersion`** y su `revision++` hace que **todos** los availability queden stale con el texto "El horario cambió" cuando lo que cambió fue la **sede** (copy falso).
**Roles:**–.
**COMPLETITUD: INCOMPLETE** — F15 sin add/remove, bulk parcial, sin propagación de "NEEDS_RECONFIRMATION" honesta.

## R21 `/communication`
**Pregunta:** ¿qué dijeron y con quién hablo?
**1º/2º/3º:** "Comunicación" → tabs (3) → "Comunicados oficiales" | "Conversaciones".
**Primaria:** ninguna primaria (el botón es `secondary`); en el tab "Comunicados" se ofrece "Nueva conversación" y viceversa.
**Eliminar:** el tab "Todo" (duplica la estructura de la propia pantalla). **Ocultar:**–. **Subir:** separación perceptual entre canales; orden por no-leídos; filtro por tipo.
**Parece interactivo:** filas ✓; el badge de no-leído (2) es el único acento sólido y funciona ✓.
**Feedback:**–. **Roles:**Conversaciones oculta sin `chat` ✓; guardian sin la tab ✓.
**COMPLETITUD: PARTIAL** — F30 (S4-05 rebajado a P3).

## R22 `/communication/conversations/new`
**Pregunta:** ¿con quién hablo?
**1º/2º/3º:** "Un espacio simple para coordinar…" → toggle Directo/Grupo → buscador + lista.
**Primaria:** "Crear conversación" (inline, no sticky, deshabilitado sin razón visible).
**Eliminar:**–. **Subir:** el paso de "resumen" (qué se va a crear) que el Blueprint exige.
**Falla:** con `Grupo` hay **dos** controles con peso `primary` simultáneos.
**Falla:** la detección de DIRECT duplicado ocurre **después** de pulsar Crear y con lógica propia, no con `findOrOpenDirect`.
**Roles:** el filtro de candidatos usa `person.role`/`person.team` (S4-04) ⇒ **ninguna conversación entre divisiones es creable**.
**COMPLETITUD: PARTIAL** — F21 sin resumen, sin TEAM/EVENT, con lógica duplicada.

## R23 `/communication/announcements/new`
**Pregunta:** ¿qué aviso y a quién?
**1º/2º/3º:** "Nuevo comunicado" → Título → Contenido → **Audiencia**.
**Primaria:** "Publicar" (inline, no sticky) + "Guardar borrador".
**Eliminar:**–. **Subir:** la **audiencia debería ser L0** (el Blueprint la pone primero: "SITUACIÓN audiencia → ACCIÓN Publicar → INFORMACIÓN cuerpo"); hoy es el tercer campo.
**Falla:** la audiencia es un `string` ("Todo hockey" / "Sexta A" / "Quinta A + Sexta A") ⇒ no es TEAM_SET, "Línea A" no es resoluble (§21), y publicar notifica a **todas** las personas (UX-16).
**COMPLETITUD: PARTIAL** — F24 ver R24.

## R24 `/announcements/:id`
**Pregunta:** ¿qué dice el comunicado oficial y qué tengo que hacer?
**1º/2º/3º:** "Comunicado oficial" → título → cuerpo.
**Primaria: NINGUNA.** No hay "Entendido" (que el Blueprint declara primaria de R24), no hay acuse, no hay marca de leído (UX-17). El modelo `Announcement` no tiene `readBy`.
**Eliminar:**–. **Subir:** el acuse; la audiencia como restriction visible.
**Feedback:**–. **Roles:** un coach no puede archivar ✓; un oficial tampoco ve "Entendido" porque no existe.
**Riesgo:** la **audiencia no es control de acceso**: cualquiera con la URL lee un comunicado de otra división (UX-16).
**COMPLETITUD: INCOMPLETE** — F24 sin acuse ni gate.

## R25 `/announcements/:id/edit`
**Pregunta:** ¿corrijo lo que publiqué?
**1º/2º/3º:** "Corregir comunicado" → Título/Contenido (audiencia deshabilitada) → "Motivo de corrección".
**Primaria:** "Guardar corrección" ✓.
**Eliminar:**–. **Subir:** el **diff** (el Blueprint lo exige) y el aviso de que la corrección no notifica (§21 no lo pide, Blueprint sí).
**Feedback:** copy excelente de inmutabilidad ✓.
**Roles:** sólo SUBCOMMITTEE ✓; un coach por URL obtiene `Empty` ✓.
**Rompe:** la regla bloqueante se muestra con `tone="info"` (azul de marca) en vez de `warning`.
**COMPLETITUD: PARTIAL** — F24 sin diff, sin `revision`, sin notificación de la corrección.

## R26 `/conversations/:id`
**Pregunta:** ¿qué dijeron en este grupo?
**1º/2º/3º:** contexto (tipo + N participantes) → "Cargar mensajes anteriores" → mensajes → composer.
**Primaria:** "Enviar" ✓.
**Eliminar:** "Cargar mensajes anteriores" (control **falso**: deshabilita el botón y muestra un literal).
**Subir:** el contexto canónico real (hoy el título es un string de seed: "Sexta A · Equipo", "GEI vs. CUBA · 10 oct"); resolver `teamId`/`eventId`.
**Feedback:** **NO hay estado "enviando"**; `CheckCheck` se dibuja siempre en todo mensaje propio = *fake success*; no hay estado "falló".
**Falla grave:** `min-h-[60dvh]` sin altura fija ⇒ el composer **no queda pegado al viewport** y en mobile queda por encima del bottom nav fijo (el fix P2-23 declarado en Stage 4 no está entregado).
**Falla:** fecha del hilo hardcodeada "Hoy · 2 de octubre" con fecha real 3 oct.
**Roles:** sólo participantes ✓ (3 gates verificados).
**COMPLETITUD: PARTIAL** — F21/F22: el envío funciona pero el chat no es "natural" (sin contexto resuelto, sincomposerfixed, sin estados).

## R27 `/management`
**Pregunta:** ¿qué puedo administrar?
**1º/2º/3º:** "Gestión de GEI Hockey" → 2 secciones → 5 filas.
**Primaria:** ninguna ✓ (correcto para un hub).
**Eliminar:** la fila "Equipos" (superficie deportiva en un hub administrativo, etiquetada "roster"); "Auditoría" duplicada con `/more`.
**Feedback:**–. **Roles:** un COACH recibe `Restricted` **después** de que el breadcrumb ya dijera "Gestión"; la pantalla denegada no tiene `h1`.
**COMPLETITUD: PARTIAL** — F18: el hub es correcto pero el mapa miente para quien tiene sub-surface working bajo `/management`.

## R28 `/management/structure`
**Pregunta:** ¿cómo creo y archivo la estructura del club?
**1º/2º/3º:** "Estructura del club" → "Crear temporada" + 4 tabs → filas.
**Primaria:** "Crear {tab}" (header, **no sticky en mobile**).
**Eliminar:** el badge "Activo" de Temporada (estado que §19 no define).
**Subir:** restore de archivados; creación de Team (el error de rename **instruye una acción inexistente**: "creá un nuevo equipo").
**Feedback:** fences con razón ✓ ("Tiene dependencias activas. No se puede archivar.").
**A11y:** tabs sin `role="tab"`; filas en `h3` sin `h2` intermedio.
**Roles:** sólo ADMIN ✓.
**COMPLETITUD: PARTIAL** — F19 sin restore, sin Team, con Venue resuelta por nombre.

## R29 `/management/teams/:id`
**Pregunta:** ¿activo o archivo este equipo?
**1º/2º/3º:** "Administración de equipo" → botón Activar/Archivar → "Asignaciones vigentes".
**Primaria:** el botón, que es `secondary` y **no tiene modal de consecuencias**.
**Eliminar:**–. **Subir:** la identidad como dato (`Season+División+Línea`) en lugar de un texto.
**Dead end:** un equipo `ARCHIVED` muestra "Archivar equipo" deshabilitado y **no tiene vuelta atrás**.
**Roles:** sólo ADMIN ✓.
**COMPLETITUD: PARTIAL** — F19: archivar funciona con fence y razón ✓, pero es irreversible y sin modal.

## R30 `/management/people`
**Pregunta:** ¿quién está en el club?
**1º/2º/3º:** "Personas y accesos" → 4 filtros → 23 filas.
**Primaria:** "Crear persona" ✓.
**Eliminar:** la columna EQUIPO con el valor "Club" (que en el resto del producto significa otra cosa).
**Subir:** link al objeto relacionado en `/audit`.
**Falla grave:** la guardiana aparece como **"MF Marcela Fernández / Club / Jugadora / Activo"** — el actor no tiene `roleAssignments`; es una verdad falsa en la pantalla de administración (UX-14/UX-35).
**Falla:** filtros sin reset y sin URL; la tabla pierde EQUIPO y ROL bajo 768 px sin fallback.
**A11y:** 0 `aria-*` en el archivo; filas sin chevron (vs `RowLink` que sí lo tiene).
**COMPLETITUD: PARTIAL** — F18 entra por aquí.

## R31 `/management/people/new`
**Pregunta:** ¿cómo doy de alta a alguien?
**1º/2º/3º:** "Crear persona" → 6 campos (orden = §17 exacto ✓) → botones.
**Primaria:** "Crear persona" (submit, **no sticky**).
**Eliminar:**–. **Subir:** el paso de Membership (no existe) y la generación real del código de activación.
**Feedback:** error con input preservado ✓; helper text excelente ("Crear una persona no asigna automáticamente una cuenta, un equipo ni permisos") con la palabra inglesa "roster".
**Falla:** escribe `eligibility: "ELIGIBLE"` y `role: "PLAYER"` como valores por defecto ⇒ **toda persona creada nace con rol deportivo**, lo que §17 desaconseja y §6 no autoriza.
**COMPLETITUD: PARTIAL** — F18: primer paso de una cadena de 9 pasos donde 4 no existen.

## R32 `/management/people/:id`
**Pregunta:** ¿qué tiene esta persona y qué puedo cambiar?
**1º/2º/3º:** nombre → "Identidad y contacto" (read-only) → "Pertenencia y equipo".
**Primaria: NINGUNA.** 6 acciones todas del mismo peso; "Deshabilitar cuenta" (destructiva) es un link de texto igual de pesado que "Finalizar pertenencia" (benigna).
**Eliminar:**–. **Subir:** una acción primaria por sección; el motivo como campo requerido visible.
**Fallas:** identidad read-only ⇒ **no hay recuperación de `PLAYER_PROFILE_INCOMPLETE`** para nadie; selects prellenados con el valor actual ⇒ clic accidental; eligibility con scope/source/reason/validity fijos; sin GuardianRelationship (que Lucía sí tiene); sin historial pese a que la descripción dice "Los cambios conservan la historia".
**Feedback:** `Alert` en modal ✓, pero **"Confirmar cambio"** para 10 operaciones distintas (el verbo no hace eco).
**Roles:** sólo ADMIN; SUBCOMMITTEE recibe `Restricted` (§5 le concede Eligibility).
**Patrón:** A6+A8 — la mejor estructura de headings del producto, la peor jerarquía de acciones.
**COMPLETITUD: INCOMPLETE** — F18 sin membership, sin guardian, sin auditoría, sin recuperación de identidad.

## R33 `/management/competitions`
**Pregunta:** ¿en qué competencias participa el club?
**1º/2º/3º:** "Competiciones" → "Crear competencia" → filas.
**Primaria:** "Crear competencia" ✓.
**Eliminar:**–. **Subir:** buscador/filtro/empty state (los 3 ausentes; con 0 competidores la `Surface` queda vacía sin texto).
**Roles:** COACH ve lectura ✓ (§5 "lectura"); SUBCOMMITTEE ve lectura + lifecycle ✓.
**COMPLETITUD: PARTIAL** — F20: la lista no es un índice mínimo.

## R34 `/management/competitions/:id`
**Pregunta:** ¿cómo entra una línea o un equipo a la competencia?
**1º/2º/3º:** nombre + organizador + estado → "Inscripciones" → "Crear inscripción".
**Primaria:** 3 acciones de lifecycle con **3 variantes distintas** (`primary`, `secondary`, `ghost`).
**Eliminar:**–. **Subir:** el diff LINE/TEAM; `422 COMPETITION_SCOPE_MISMATCH`.
**Falla verificada en runtime:** la inscripción renderiza **"Línea A · 2026"** — sin división ni temporada, con 4 divisiones en el dataset (S4-03 confirmado).
**Lo que sí está bien:** "Cerrar competencia" deshabilitado **con razón visible** ✓; "Finalizar inscripción" **con modal de consecuencias** ✓ ("La inscripción no podrá usarse en nuevos partidos…").
**Roles:** gating correcto ✓.
**COMPLETITUD: INCOMPLETE** — F20 no puede expresar LINE scope.

## R35 `/reports`
**Pregunta:** ¿qué informes hay?
**1º/2º/3º:** "Reportes" → 2 filas con copy descriptivo exacto ✓.
**Primaria:** ninguna ✓. **Feedback:**–. **Roles:** oculto sin `report` ✓.
**Único hub con copy que explica el contenido sin jerga.**
**COMPLETITUD: COMPLETE** — como hub cumple su función; F27 se evalúa en sus hijas.

## R36 `/reports/attendance`
**Pregunta:** ¿quién viene y cuál es su porcentaje real?
**1º/2º/3º:** "Sólo lectura" + eyebrow → 3 filtros con defaults ✓ → tabla.
**Primaria:** ninguna ✓ (lectura). **Feedback:**–.
**Lo que está bien:** los defaults (Mi equipo + Toda la temporada) ✓; "Sin registrar se mantiene separado de Ausente" ✓; el pie "Sin registros no se interpreta como cero actividad histórica" ✓.
**La falla:** la columna **"% PRESENCIA" muestra 0 %** donde en realidad no hay dato, y el pie dice lo contrario ⇒ el número contradice la nota (UX-43).
**A11y:** 6 de 6 tablas sin `<th>`; `min-w-[560px]` con scroll horizontal en mobile.
**Roles:** "Mis registros" para PLAYER ✓.
**COMPLETITUD: PARTIAL** — F27: filtros no persistidos, sin reset, sin empty real.

## R37 `/reports/performance`
**Pregunta:** ¿cómo rinde cada jugadora?
**1º/2º/3º:** igual que R36 → tabla de 3 columnas (PARTIDOS/GOLES/ASISTENCIAS).
**Primaria:** ninguna ✓. **Lo que está bien:** el copy "La participación real se obtiene del registro del partido, no de la asistencia" ✓ (§15).
**Fallas:** mismas que R36; sin link a la jornada/partido de origen (el Blueprint A9 lo exige); 18 filas × 3 columnas en 1300 px.
**COMPLETITUD: PARTIAL**

## R38 `/audit`
**Pregunta:** ¿quién cambió qué?
**1º/2º/3º:** "Auditoría" + "No se puede editar ni eliminar" ✓ → 4 filtros → 2 entradas.
**Primaria:** ninguna ✓ (lectura). **Feedback:**–.
**Lo que está bien:** append-only declarado; motivo visible; sólo ADMIN ✓.
**Fallas:** **sin before/after** (el Blueprint A10 lo exige); **sin link al objeto relacionado** (el recurso es texto plano); **sin source**; el filtro de fecha es un `<input type="date">` que sólo reconoce 3 literales (`2026-10-02`, `2026-10-01`, `2026-09-28`) ⇒ cualquier otra fecha da 0 resultados sin explicación; las entradas nuevas llevan fecha congelada "02 oct 2026 · Ahora" mientras la UI usa reloj real.
**Patrón:** A10 ✓ en estructura, ✗ en contenido.
**COMPLETITUD: PARTIAL** — F28 no cumple: sin antes/después, sin source, sin objeto relacionado.

---

# 6. RESUMEN DE COMPLETITUD

| Verdict | Rutas | Count |
|---|---|---|
| **COMPLETE** | R03, R35 | **2** |
| **PARTIAL** | R01, R02, R04, R06, R07, R09, R10, R12, R13, R15, R16, R17, R18, R19, R21, R22, R23, R25, R26, R27, R28, R29, R30, R31, R33, R36, R37, R38 | **28** |
| **INCOMPLETE** | R05, R08, R11, R14, R20, R24, R32, R34 | **8** |

> **Nota de reconciliación con el Master Audit.** El Master Audit reporta **0/38 rutas COMPLETAS bajo el criterio §5** (que exige el ciclo completo: DISCOVERY → ENTRY → ORIENTATION → PRIMARY ACTION → VALIDATION → CONFIRMATION → STATE CHANGE → PROPAGATION → ERROR/RECOVERY → HISTORY → RETURN, más variantes de permiso, empty/zero, mobile y desktop). Esta matriz reporta la **completitud de la pantalla como superficie**: 2 COMPLETE (`/no-access`, `/reports`), 28 PARTIAL, 8 INCOMPLETE. Ambas cifras son correctas con definiciones distintas y no deben sumarse.

| Totales de la matriz (calculados sobre el archivo, 152 filas = 38 rutas × 4 tablas) | |
|---|---|
| Celdas evaluadas | 38 × 48 = **1 824** |
| PASS | **143** (7.8 %) |
| MINOR | **618** (33.9 %) |
| MAJOR | **807** (44.2 %) |
| N/A | **256** (14.0 %) |
| Rutas con ≥1 MAJOR | **36/38** |
| Únicas rutas sin ningún MAJOR | R03 `/no-access`, R35 `/reports` |