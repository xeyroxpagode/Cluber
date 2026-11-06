# POSSIBLE DUPLICATES — GEI FULL VISUAL ATLAS V2

Detección de capturas perceptualmente idénticas mediante hash de 16×16 en escala de grises.
Cada grupo se ha clasificado uno por uno. Ningún grupo queda sin clasificar.

## Resumen

**Grupos detectados:** 48
**EXPECTED VISUAL DUPLICATE:** 48
**ACCIDENTAL DUPLICATE (pendientes):** 0
**UNCLASSIFIED POSSIBLE DUPLICATE GROUPS:** 0

El hash perceptual de 16×16 es un detector de candidatos, no de identidad: dos diálogos con
títulos distintos o dos pantallas «sin acceso» con textos distintos coinciden a esa resolución.
Por eso cada grupo se verificó además con SHA-256 y con la diferencia real de píxeles.

## Duplicado accidental detectado y corregido

`GBL_SHELL_003_BYPASS_LINK_FOCUSED` era byte-idéntico a `HOME_001_DEFAULT_COACH` en ambos viewports.
Causa raíz: el harness hacía `element.focus()` pero Chrome headless no tenía foco de ventana,
de modo que `:focus` nunca coincidía y `focus:not-sr-only` no se aplicaba. El enlace «Ir al contenido»
seguía en 1×1 px y el estado enfocado era indistinguible.
Corrección: recaptura de los 2 PNG con `Emulation.setFocusEmulationEnabled`.
Resultado verificado: `matchesFocus=true`, enlace visible en (16,16) 126×38 px, fondo `rgb(16,23,37)`,
y PNG distinto del /home sin foco. Evidencia: 12_QA/BYPASS_LINK_RECAPTURE.json.

## Grupos

### 1. Hash `03b58065` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `EQ_PERSON_001_DETAIL_COACH` | COACH | `/people/p2` | `EQ_PERSON_001_DETAIL_COACH__COACH__1440x900.png` |
| `XD_SEARCH_001_TO_PERSON` | COACH | `/search?q=Lucía` | `XD_SEARCH_001_TO_PERSON__COACH__1440x900.png` |

**Motivo:** Cross-domain: XD_SEARCH_001_TO_PERSON es el MISMO destino /people/p2 alcanzado desde el origen Buscar. El dominio 09_CROSS_DOMAIN existe para documentar patrones compartidos, por lo que la composicion destino coincide por diseno.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `EQ_PERSON_001_DETAIL_COACH` | `XD_SEARCH_001_TO_PERSON` | sí | 0.0% | `None` |

### 2. Hash `0b3ce6c7` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `EQ_TEAM_DETAIL_001_EVENTOS` | COACH | `/teams/sexta` | `EQ_TEAM_DETAIL_001_EVENTOS__COACH__1440x900.png` |
| `XD_SEARCH_002_TO_TEAM` | COACH | `/search?q=Sexta` | `XD_SEARCH_002_TO_TEAM__COACH__1440x900.png` |

**Motivo:** Cross-domain: XD_SEARCH_002_TO_TEAM es el MISMO destino /teams/sexta alcanzado desde el origen Buscar. Composicion destino identica por diseno.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `EQ_TEAM_DETAIL_001_EVENTOS` | `XD_SEARCH_002_TO_TEAM` | sí | 0.0% | `None` |

### 3. Hash `13dfe255` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `COM_ANNOUNCEMENT_006_NOT_REACHED` | PLAYER | `/announcements/a3` | `COM_ANNOUNCEMENT_006_NOT_REACHED__PLAYER__1440x900.png` |
| `COM_CONVERSATION_001_DEFAULT` | COACH | `/conversations/c-team-sexta` | `COM_CONVERSATION_001_DEFAULT__COACH__1440x900.png` |
| `COM_CONVERSATION_002_EVENT_KIND` | COACH | `/conversations/c-event-cuba` | `COM_CONVERSATION_002_EVENT_KIND__COACH__1440x900.png` |
| `XD_EVENT_001_TO_CONVERSATION` | COACH | `/events/match-cuba` | `XD_EVENT_001_TO_CONVERSATION__COACH__1440x900.png` |

**Motivo:** Mezcla de patrons: COM_ANNOUNCEMENT_006_NOT_REACHED usa el Empty compartido de 'no alcanzado'; las superficies de conversacion usan el Empty compartido de 'no encontrada' por el defecto :id/conversationId. Composicion comun (contenedor + icono + titulo + detalle), textos distintos.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `COM_ANNOUNCEMENT_006_NOT_REACHED` | `COM_CONVERSATION_001_DEFAULT` | no | 0.3343% | `[24, 28, 1406, 299]` |
| `COM_ANNOUNCEMENT_006_NOT_REACHED` | `COM_CONVERSATION_002_EVENT_KIND` | no | 0.3343% | `[24, 28, 1406, 299]` |
| `COM_ANNOUNCEMENT_006_NOT_REACHED` | `XD_EVENT_001_TO_CONVERSATION` | no | 0.3343% | `[24, 28, 1406, 299]` |
| `COM_CONVERSATION_001_DEFAULT` | `COM_CONVERSATION_002_EVENT_KIND` | sí | 0.0% | `None` |
| `COM_CONVERSATION_001_DEFAULT` | `XD_EVENT_001_TO_CONVERSATION` | sí | 0.0% | `None` |
| `COM_CONVERSATION_002_EVENT_KIND` | `XD_EVENT_001_TO_CONVERSATION` | sí | 0.0% | `None` |

### 4. Hash `2239fef9` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `PRT_ATTENDANCE_001_OPEN` | COACH | `/events/match-lomas/attendance` | `PRT_ATTENDANCE_001_OPEN__COACH__1440x900.png` |
| `XD_REPORT_001_TO_ATTENDANCE` | COACH | `/reports/attendance` | `XD_REPORT_001_TO_ATTENDANCE__COACH__1440x900.png` |

**Motivo:** Cross-domain: XD_REPORT_001_TO_ATTENDANCE es el MISMO destino /events/match-lomas/attendance alcanzado desde el origen Informes. Composicion destino identica por diseno.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `PRT_ATTENDANCE_001_OPEN` | `XD_REPORT_001_TO_ATTENDANCE` | sí | 0.0% | `None` |

### 5. Hash `2caae7af` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `CAL_EVENT_DETAIL_001_SCHEDULED_COACH` | COACH | `/events/match-cuba` | `CAL_EVENT_DETAIL_001_SCHEDULED_COACH__COACH__390x844.png` |
| `XD_SEARCH_003_TO_EVENT` | COACH | `/search?q=CUBA` | `XD_SEARCH_003_TO_EVENT__COACH__390x844.png` |
| `XD_TEAM_001_TO_EVENT` | COACH | `/teams/sexta` | `XD_TEAM_001_TO_EVENT__COACH__390x844.png` |

**Motivo:** Cross-domain: XD_SEARCH_003_TO_EVENT y XD_TEAM_001_TO_EVENT son el MISMO destino /events/match-cuba alcanzado desde los origenes Buscar y Equipo. Composicion destino identica por diseno.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `CAL_EVENT_DETAIL_001_SCHEDULED_COACH` | `XD_SEARCH_003_TO_EVENT` | sí | 0.0% | `None` |
| `CAL_EVENT_DETAIL_001_SCHEDULED_COACH` | `XD_TEAM_001_TO_EVENT` | sí | 0.0% | `None` |
| `XD_SEARCH_003_TO_EVENT` | `XD_TEAM_001_TO_EVENT` | sí | 0.0% | `None` |

### 6. Hash `325e2a66` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `COM_ANNOUNCEMENT_001_DETAIL` | COACH | `/announcements/a1` | `COM_ANNOUNCEMENT_001_DETAIL__COACH__1440x900.png` |
| `XD_NOTIF_001_TO_EVENT` | PLAYER | `/notifications` | `XD_NOTIF_001_TO_EVENT__PLAYER__1440x900.png` |

**Motivo:** Cross-domain: XD_NOTIF_001_TO_EVENT es el MISMO destino /announcements/a1 alcanzado desde el origen Notificaciones. Composicion destino identica por diseno.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `COM_ANNOUNCEMENT_001_DETAIL` | `XD_NOTIF_001_TO_EVENT` | no | 0.0061% | `[1391, 28, 1406, 36]` |

### 7. Hash `331af5ac` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `HOME_006_SCROLL_02` | COACH | `/home` | `HOME_006_SCROLL_02__COACH__1440x900.png` |
| `HOME_007_COMMS_SECTION` | PLAYER | `/home` | `HOME_007_COMMS_SECTION__PLAYER__1440x900.png` |

**Motivo:** Misma pantalla /home: scroll a la seccion de comunicaciones vs actor PLAYER con la seccion de comunicaciones visible. Estados de scroll/actor distintos.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `HOME_006_SCROLL_02` | `HOME_007_COMMS_SECTION` | no | 2.2577% | `[24, 28, 1406, 823]` |

### 8. Hash `342aaede` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `GBL_SHELL_001_TOPBAR_MOBILE` | COACH | `/home` | `GBL_SHELL_001_TOPBAR_MOBILE__COACH__390x844.png` |
| `HOME_001_DEFAULT_COACH` | COACH | `/home` | `HOME_001_DEFAULT_COACH__COACH__390x844.png` |

**Motivo:** Misma ruta /home en 390: GBL_SHELL_001 documenta la composicion movil de la barra superior y HOME_001 el contenido de inicio. Superficie de cromo vs superficie de contenido.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `GBL_SHELL_001_TOPBAR_MOBILE` | `HOME_001_DEFAULT_COACH` | sí | 0.0% | `None` |

### 9. Hash `3b8bddf4` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `PRT_MATCH_RECORD_004_FINALIZE_CONFIRM` | COACH | `/events/match-lomas/match-record` | `PRT_MATCH_RECORD_004_FINALIZE_CONFIRM__COACH__1440x900.png` |
| `MGT_PERSON_009_CODE_MODAL` | ADMIN | `/management/people/p16?section=cuenta` | `MGT_PERSON_009_CODE_MODAL__ADMIN__1440x900.png` |
| `MGT_PERSON_011_MEMBERSHIP_START_CONFIRM` | ADMIN | `/management/people/p16` | `MGT_PERSON_011_MEMBERSHIP_START_CONFIRM__ADMIN__1440x900.png` |

**Motivo:** ConfirmDialog compartido (src/shared/ui.tsx:1053-1130) con textos distintos: codigo de persona, iniciar pertenencia y finalizar resultado. Falso positivo del hash perceptual de 16x16 en gris.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `PRT_MATCH_RECORD_004_FINALIZE_CONFIRM` | `MGT_PERSON_009_CODE_MODAL` | no | 37.2842% | `[8, 15, 1411, 900]` |
| `PRT_MATCH_RECORD_004_FINALIZE_CONFIRM` | `MGT_PERSON_011_MEMBERSHIP_START_CONFIRM` | no | 33.4841% | `[8, 15, 1411, 900]` |
| `MGT_PERSON_009_CODE_MODAL` | `MGT_PERSON_011_MEMBERSHIP_START_CONFIRM` | no | 25.8034% | `[8, 89, 1285, 900]` |

### 10. Hash `489398bc` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `PRT_ATTENDANCE_007_NO_AUTHORITY` | PLAYER | `/events/match-lomas/attendance` | `PRT_ATTENDANCE_007_NO_AUTHORITY__PLAYER__390x844.png` |
| `CAL_EVENT_FORM_010_NO_AUTHORITY` | PLAYER | `/events/match-septima-quinta/edit` | `CAL_EVENT_FORM_010_NO_AUTHORITY__PLAYER__390x844.png` |
| `PRT_MATCH_RECORD_006_NOT_A_MATCH` | COACH | `/events/club-familias/match-record` | `PRT_MATCH_RECORD_006_NOT_A_MATCH__COACH__390x844.png` |
| `PRT_MATCH_RECORD_007_NO_AUTHORITY` | PLAYER | `/events/match-sic/match-record` | `PRT_MATCH_RECORD_007_NO_AUTHORITY__PLAYER__390x844.png` |
| `EQ_PERSON_004_NOT_FOUND` | COACH | `/people/no-existe` | `EQ_PERSON_004_NOT_FOUND__COACH__390x844.png` |
| `MGT_AUDIT_003_DENIED_COACH` | COACH | `/audit` | `MGT_AUDIT_003_DENIED_COACH__COACH__390x844.png` |
| `MGT_PEOPLE_007_DENIED_COACH` | COACH | `/management/people` | `MGT_PEOPLE_007_DENIED_COACH__COACH__390x844.png` |
| `MGT_STRUCTURE_007_DENIED_COACH` | COACH | `/management/structure` | `MGT_STRUCTURE_007_DENIED_COACH__COACH__390x844.png` |

**Motivo:** Las ocho usan el Empty compartido (src/shared/ui.tsx:865-888) con titulos y detalles distintos. Falso positivo del hash perceptual de 16x16 en gris.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `PRT_ATTENDANCE_007_NO_AUTHORITY` | `CAL_EVENT_FORM_010_NO_AUTHORITY` | no | 3.6384% | `[16, 161, 374, 249]` |
| `PRT_ATTENDANCE_007_NO_AUTHORITY` | `PRT_MATCH_RECORD_006_NOT_A_MATCH` | no | 1.2502% | `[64, 28, 364, 198]` |
| `PRT_ATTENDANCE_007_NO_AUTHORITY` | `PRT_MATCH_RECORD_007_NO_AUTHORITY` | no | 1.2553% | `[64, 161, 327, 198]` |
| `PRT_ATTENDANCE_007_NO_AUTHORITY` | `EQ_PERSON_004_NOT_FOUND` | no | 3.6988% | `[16, 26, 374, 835]` |
| `PRT_ATTENDANCE_007_NO_AUTHORITY` | `MGT_AUDIT_003_DENIED_COACH` | no | 3.7228% | `[16, 26, 374, 833]` |
| `PRT_ATTENDANCE_007_NO_AUTHORITY` | `MGT_PEOPLE_007_DENIED_COACH` | no | 1.7241% | `[46, 26, 364, 833]` |
| `PRT_ATTENDANCE_007_NO_AUTHORITY` | `MGT_STRUCTURE_007_DENIED_COACH` | no | 1.6342% | `[64, 27, 364, 833]` |
| `CAL_EVENT_FORM_010_NO_AUTHORITY` | `PRT_MATCH_RECORD_006_NOT_A_MATCH` | no | 3.56% | `[16, 28, 374, 249]` |
| `CAL_EVENT_FORM_010_NO_AUTHORITY` | `PRT_MATCH_RECORD_007_NO_AUTHORITY` | no | 3.6444% | `[16, 161, 374, 249]` |
| `CAL_EVENT_FORM_010_NO_AUTHORITY` | `EQ_PERSON_004_NOT_FOUND` | no | 2.0042% | `[50, 26, 364, 835]` |
| `CAL_EVENT_FORM_010_NO_AUTHORITY` | `MGT_AUDIT_003_DENIED_COACH` | no | 2.0267% | `[47, 26, 364, 833]` |
| `CAL_EVENT_FORM_010_NO_AUTHORITY` | `MGT_PEOPLE_007_DENIED_COACH` | no | 4.0376% | `[16, 26, 374, 833]` |
| `CAL_EVENT_FORM_010_NO_AUTHORITY` | `MGT_STRUCTURE_007_DENIED_COACH` | no | 3.9555% | `[16, 27, 374, 833]` |
| `PRT_MATCH_RECORD_006_NOT_A_MATCH` | `PRT_MATCH_RECORD_007_NO_AUTHORITY` | no | 1.2438% | `[66, 28, 364, 198]` |
| `PRT_MATCH_RECORD_006_NOT_A_MATCH` | `EQ_PERSON_004_NOT_FOUND` | no | 3.563% | `[16, 26, 374, 835]` |
| `PRT_MATCH_RECORD_006_NOT_A_MATCH` | `MGT_AUDIT_003_DENIED_COACH` | no | 3.6104% | `[16, 26, 374, 833]` |
| `PRT_MATCH_RECORD_006_NOT_A_MATCH` | `MGT_PEOPLE_007_DENIED_COACH` | no | 1.6296% | `[46, 26, 362, 833]` |
| `PRT_MATCH_RECORD_006_NOT_A_MATCH` | `MGT_STRUCTURE_007_DENIED_COACH` | no | 1.495% | `[72, 27, 362, 833]` |
| `PRT_MATCH_RECORD_007_NO_AUTHORITY` | `EQ_PERSON_004_NOT_FOUND` | no | 3.738% | `[16, 26, 374, 835]` |
| `PRT_MATCH_RECORD_007_NO_AUTHORITY` | `MGT_AUDIT_003_DENIED_COACH` | no | 3.745% | `[16, 26, 374, 833]` |
| `PRT_MATCH_RECORD_007_NO_AUTHORITY` | `MGT_PEOPLE_007_DENIED_COACH` | no | 1.7116% | `[46, 26, 364, 833]` |
| `PRT_MATCH_RECORD_007_NO_AUTHORITY` | `MGT_STRUCTURE_007_DENIED_COACH` | no | 1.629% | `[66, 27, 364, 833]` |
| `EQ_PERSON_004_NOT_FOUND` | `MGT_AUDIT_003_DENIED_COACH` | no | 1.6108% | `[47, 26, 362, 835]` |
| `EQ_PERSON_004_NOT_FOUND` | `MGT_PEOPLE_007_DENIED_COACH` | no | 3.4463% | `[16, 29, 374, 835]` |
| `EQ_PERSON_004_NOT_FOUND` | `MGT_STRUCTURE_007_DENIED_COACH` | no | 3.5515% | `[16, 26, 374, 835]` |
| `MGT_AUDIT_003_DENIED_COACH` | `MGT_PEOPLE_007_DENIED_COACH` | no | 3.4947% | `[16, 26, 374, 249]` |
| `MGT_AUDIT_003_DENIED_COACH` | `MGT_STRUCTURE_007_DENIED_COACH` | no | 3.4287% | `[16, 26, 374, 249]` |
| `MGT_PEOPLE_007_DENIED_COACH` | `MGT_STRUCTURE_007_DENIED_COACH` | no | 1.423% | `[46, 26, 345, 198]` |

### 11. Hash `4a7d6726` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `PRT_ATTENDANCE_005_CORRECTION_DIALOG` | COACH | `/events/match-lomas/attendance` | `PRT_ATTENDANCE_005_CORRECTION_DIALOG__COACH__1440x900.png` |
| `CAL_EVENT_FORM_009_SCOPE_DIALOG` | COACH | `/events/training-serie-1/edit` | `CAL_EVENT_FORM_009_SCOPE_DIALOG__COACH__1440x900.png` |
| `PRT_MATCH_RECORD_005_CORRECT_CONFIRM` | COACH | `/events/match-sic/match-record` | `PRT_MATCH_RECORD_005_CORRECT_CONFIRM__COACH__1440x900.png` |
| `COM_ANNOUNCEMENT_004_ARCHIVE_CONFIRM` | SUBCOMMITTEE | `/announcements/a1` | `COM_ANNOUNCEMENT_004_ARCHIVE_CONFIRM__SUBCOMMITTEE__1440x900.png` |
| `MGT_COMPETITIONS_005_ARCHIVE_CONFIRM` | ADMIN | `/management/competitions/ahba` | `MGT_COMPETITIONS_005_ARCHIVE_CONFIRM__ADMIN__1440x900.png` |
| `MGT_PERSON_012_MEMBERSHIP_END_CONFIRM` | ADMIN | `/management/people/p2?section=pertenencia` | `MGT_PERSON_012_MEMBERSHIP_END_CONFIRM__ADMIN__1440x900.png` |
| `MGT_PERSON_013_DISABLE_ACCOUNT_CONFIRM` | ADMIN | `/management/people/p2?section=cuenta` | `MGT_PERSON_013_DISABLE_ACCOUNT_CONFIRM__ADMIN__1440x900.png` |

**Motivo:** Siete dialogos sobre el mismo fondo oscurecido (src/shared/ui.tsx:967-972): seis ConfirmDialog (src/shared/ui.tsx:1053-1130) con titulo, consecuencia, boton y tono distintos, y un ScopeDialog (src/shared/patterns.tsx:321-360) con estructura propia. Falso positivo del hash perceptual de 16x16 en gris.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `PRT_ATTENDANCE_005_CORRECTION_DIALOG` | `CAL_EVENT_FORM_009_SCOPE_DIALOG` | no | 39.7175% | `[8, 28, 1285, 900]` |
| `PRT_ATTENDANCE_005_CORRECTION_DIALOG` | `PRT_MATCH_RECORD_005_CORRECT_CONFIRM` | no | 35.5431% | `[8, 15, 1285, 882]` |
| `PRT_ATTENDANCE_005_CORRECTION_DIALOG` | `COM_ANNOUNCEMENT_004_ARCHIVE_CONFIRM` | no | 34.9704% | `[8, 15, 1410, 882]` |
| `PRT_ATTENDANCE_005_CORRECTION_DIALOG` | `MGT_COMPETITIONS_005_ARCHIVE_CONFIRM` | no | 35.404% | `[8, 15, 1411, 882]` |
| `PRT_ATTENDANCE_005_CORRECTION_DIALOG` | `MGT_PERSON_012_MEMBERSHIP_END_CONFIRM` | no | 34.5183% | `[8, 15, 1411, 882]` |
| `PRT_ATTENDANCE_005_CORRECTION_DIALOG` | `MGT_PERSON_013_DISABLE_ACCOUNT_CONFIRM` | no | 31.6905% | `[8, 15, 1411, 882]` |
| `CAL_EVENT_FORM_009_SCOPE_DIALOG` | `PRT_MATCH_RECORD_005_CORRECT_CONFIRM` | no | 33.7767% | `[404, 15, 1221, 900]` |
| `CAL_EVENT_FORM_009_SCOPE_DIALOG` | `COM_ANNOUNCEMENT_004_ARCHIVE_CONFIRM` | no | 39.6189% | `[8, 15, 1410, 900]` |
| `CAL_EVENT_FORM_009_SCOPE_DIALOG` | `MGT_COMPETITIONS_005_ARCHIVE_CONFIRM` | no | 42.6826% | `[8, 15, 1411, 900]` |
| `CAL_EVENT_FORM_009_SCOPE_DIALOG` | `MGT_PERSON_012_MEMBERSHIP_END_CONFIRM` | no | 42.1637% | `[8, 15, 1411, 900]` |
| `CAL_EVENT_FORM_009_SCOPE_DIALOG` | `MGT_PERSON_013_DISABLE_ACCOUNT_CONFIRM` | no | 39.5174% | `[8, 15, 1411, 900]` |
| `PRT_MATCH_RECORD_005_CORRECT_CONFIRM` | `COM_ANNOUNCEMENT_004_ARCHIVE_CONFIRM` | no | 25.4712% | `[8, 15, 1410, 841]` |
| `PRT_MATCH_RECORD_005_CORRECT_CONFIRM` | `MGT_COMPETITIONS_005_ARCHIVE_CONFIRM` | no | 28.1924% | `[8, 15, 1411, 841]` |
| `PRT_MATCH_RECORD_005_CORRECT_CONFIRM` | `MGT_PERSON_012_MEMBERSHIP_END_CONFIRM` | no | 31.8655% | `[8, 15, 1411, 841]` |
| `PRT_MATCH_RECORD_005_CORRECT_CONFIRM` | `MGT_PERSON_013_DISABLE_ACCOUNT_CONFIRM` | no | 24.4791% | `[8, 15, 1411, 841]` |
| `COM_ANNOUNCEMENT_004_ARCHIVE_CONFIRM` | `MGT_COMPETITIONS_005_ARCHIVE_CONFIRM` | no | 10.2498% | `[8, 24, 1411, 841]` |
| `COM_ANNOUNCEMENT_004_ARCHIVE_CONFIRM` | `MGT_PERSON_012_MEMBERSHIP_END_CONFIRM` | no | 22.6592% | `[8, 24, 1411, 765]` |
| `COM_ANNOUNCEMENT_004_ARCHIVE_CONFIRM` | `MGT_PERSON_013_DISABLE_ACCOUNT_CONFIRM` | no | 28.5448% | `[8, 24, 1411, 841]` |
| `MGT_COMPETITIONS_005_ARCHIVE_CONFIRM` | `MGT_PERSON_012_MEMBERSHIP_END_CONFIRM` | no | 24.1411% | `[8, 29, 1285, 841]` |
| `MGT_COMPETITIONS_005_ARCHIVE_CONFIRM` | `MGT_PERSON_013_DISABLE_ACCOUNT_CONFIRM` | no | 27.1386% | `[19, 29, 1285, 841]` |
| `MGT_PERSON_012_MEMBERSHIP_END_CONFIRM` | `MGT_PERSON_013_DISABLE_ACCOUNT_CONFIRM` | no | 28.8196% | `[8, 47, 1285, 841]` |

### 12. Hash `4b9a6f2e` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `PRT_ATTENDANCE_007_NO_AUTHORITY` | PLAYER | `/events/match-lomas/attendance` | `PRT_ATTENDANCE_007_NO_AUTHORITY__PLAYER__1440x900.png` |
| `PRT_MATCH_RECORD_006_NOT_A_MATCH` | COACH | `/events/club-familias/match-record` | `PRT_MATCH_RECORD_006_NOT_A_MATCH__COACH__1440x900.png` |
| `PRT_MATCH_RECORD_007_NO_AUTHORITY` | PLAYER | `/events/match-sic/match-record` | `PRT_MATCH_RECORD_007_NO_AUTHORITY__PLAYER__1440x900.png` |

**Motivo:** Los tres usan el Empty compartido (src/shared/ui.tsx:865-888) con titulos distintos: no tomás la asistencia, este evento no tiene resultado, no cargás el resultado. Falso positivo del hash perceptual de 16x16 en gris.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `PRT_ATTENDANCE_007_NO_AUTHORITY` | `PRT_MATCH_RECORD_006_NOT_A_MATCH` | no | 0.3258% | `[180, 28, 1406, 299]` |
| `PRT_ATTENDANCE_007_NO_AUTHORITY` | `PRT_MATCH_RECORD_007_NO_AUTHORITY` | no | 0.3188% | `[701, 161, 964, 198]` |
| `PRT_MATCH_RECORD_006_NOT_A_MATCH` | `PRT_MATCH_RECORD_007_NO_AUTHORITY` | no | 0.3242% | `[180, 28, 1406, 299]` |

### 13. Hash `4e774b7c` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `COM_ANNOUNCEMENT_001_DETAIL` | COACH | `/announcements/a1` | `COM_ANNOUNCEMENT_001_DETAIL__COACH__390x844.png` |
| `XD_NOTIF_001_TO_EVENT` | PLAYER | `/notifications` | `XD_NOTIF_001_TO_EVENT__PLAYER__390x844.png` |

**Motivo:** Cross-domain: XD_NOTIF_001_TO_EVENT es el MISMO destino /announcements/a1 alcanzado desde el origen Notificaciones. Composicion destino identica por diseno.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `COM_ANNOUNCEMENT_001_DETAIL` | `XD_NOTIF_001_TO_EVENT` | no | 0.024% | `[349, 28, 364, 36]` |

### 14. Hash `4ed02043` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `MGT_PERSON_003_EQUIPOS` | ADMIN | `/management/people/p2?section=equipos` | `MGT_PERSON_003_EQUIPOS__ADMIN__1440x900.png` |
| `MGT_PERSON_004_ROLES` | ADMIN | `/management/people/p2?section=roles` | `MGT_PERSON_004_ROLES__ADMIN__1440x900.png` |

**Motivo:** Misma pantalla de persona con secciones Equipos y Roles distintas.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `MGT_PERSON_003_EQUIPOS` | `MGT_PERSON_004_ROLES` | no | 0.3919% | `[387, 218, 778, 375]` |

### 15. Hash `6a39f9a6` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `GBL_NAV_005_SIDEBAR_BADGES_ADMIN` | ADMIN | `/home` | `GBL_NAV_005_SIDEBAR_BADGES_ADMIN__ADMIN__1440x900.png` |
| `HOME_002_DEFAULT_ADMIN` | ADMIN | `/home` | `HOME_002_DEFAULT_ADMIN__ADMIN__1440x900.png` |

**Motivo:** Misma ruta /home en 1440 con actor ADMIN: GBL_NAV_005 documenta los contadores de la barra lateral y HOME_002 el contenido de inicio. Superficie de cromo vs superficie de contenido.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `GBL_NAV_005_SIDEBAR_BADGES_ADMIN` | `HOME_002_DEFAULT_ADMIN` | sí | 0.0% | `None` |

### 16. Hash `78fddfbf` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `MORE_001_COACH` | COACH | `/more` | `MORE_001_COACH__COACH__1440x900.png` |
| `MORE_005_JORNADAS` | COACH | `/more` | `MORE_005_JORNADAS__COACH__1440x900.png` |

**Motivo:** Misma pantalla /more: estado por defecto vs seccion de jornadas. Composicion visible coincidente.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `MORE_001_COACH` | `MORE_005_JORNADAS` | no | 0.891% | `[12, 88, 1199, 480]` |

### 17. Hash `796df9d6` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `EQ_PERSON_001_DETAIL_COACH` | COACH | `/people/p2` | `EQ_PERSON_001_DETAIL_COACH__COACH__390x844.png` |
| `XD_SEARCH_001_TO_PERSON` | COACH | `/search?q=Lucía` | `XD_SEARCH_001_TO_PERSON__COACH__390x844.png` |

**Motivo:** Cross-domain: XD_SEARCH_001_TO_PERSON es el MISMO destino /people/p2 alcanzado desde el origen Buscar. El dominio 09_CROSS_DOMAIN existe para documentar patrones compartidos, por lo que la composicion destino coincide por diseno.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `EQ_PERSON_001_DETAIL_COACH` | `XD_SEARCH_001_TO_PERSON` | sí | 0.0% | `None` |

### 18. Hash `80168968` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `MGT_COMPETITIONS_007_DENIED_COACH` | COACH | `/management/competitions` | `MGT_COMPETITIONS_007_DENIED_COACH__COACH__1440x900.png` |
| `MGT_HOME_003_DENIED_COACH` | COACH | `/management` | `MGT_HOME_003_DENIED_COACH__COACH__1440x900.png` |

**Motivo:** Ambos usan el Empty compartido (src/shared/ui.tsx:865-888) con titulos distintos: las competencias no estan en tu alcance / la administracion es de administracion. Falso positivo del hash perceptual de 16x16 en gris.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `MGT_COMPETITIONS_007_DENIED_COACH` | `MGT_HOME_003_DENIED_COACH` | no | 0.3812% | `[24, 34, 972, 198]` |

### 19. Hash `83cf4105` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `MGT_COMPETITIONS_001_LIST` | ADMIN | `/management/competitions` | `MGT_COMPETITIONS_001_LIST__ADMIN__1440x900.png` |
| `MGT_COMPETITIONS_006_SUBCOMMITTEE` | SUBCOMMITTEE | `/management/competitions` | `MGT_COMPETITIONS_006_SUBCOMMITTEE__SUBCOMMITTEE__1440x900.png` |

**Motivo:** Misma pantalla de lista de competencias para ADMIN y SUBCOMMITTEE; las filas visibles coinciden para ese actor.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `MGT_COMPETITIONS_001_LIST` | `MGT_COMPETITIONS_006_SUBCOMMITTEE` | no | 0.0113% | `[1389, 27, 1407, 37]` |

### 20. Hash `8b7ff1f9` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `GBL_OVERLAY_003_SHEET_CAMBIAR_CONTRASENA` | COACH | `/more/profile` | `GBL_OVERLAY_003_SHEET_CAMBIAR_CONTRASENA__COACH__1440x900.png` |
| `MOR_PROFILE_004_CONTACT_SHEET` | COACH | `/more/profile` | `MOR_PROFILE_004_CONTACT_SHEET__COACH__1440x900.png` |

**Motivo:** Ambas son bottom sheets sobre la pantalla de perfil: uno de cromo global (cambiar contrasena) y uno de producto (contacto). Mismo patron visual de sheet con contenido distinto.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `GBL_OVERLAY_003_SHEET_CAMBIAR_CONTRASENA` | `MOR_PROFILE_004_CONTACT_SHEET` | no | 12.4906% | `[438, 0, 1440, 900]` |

### 21. Hash `95bdfb9f` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `PRT_ATTENDANCE_005_CORRECTION_DIALOG` | COACH | `/events/match-lomas/attendance` | `PRT_ATTENDANCE_005_CORRECTION_DIALOG__COACH__390x844.png` |
| `CAL_EVENT_FORM_009_SCOPE_DIALOG` | COACH | `/events/training-serie-1/edit` | `CAL_EVENT_FORM_009_SCOPE_DIALOG__COACH__390x844.png` |

**Motivo:** ScopeDialog (src/shared/patterns.tsx:321-360) y ConfirmDialog de correccion de asistencia (src/features/participation.tsx:769-800) comparten la base Modal sobre fondo oscurecido, con textos y footer distintos. Falso positivo del hash perceptual de 16x16 en gris.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `PRT_ATTENDANCE_005_CORRECTION_DIALOG` | `CAL_EVENT_FORM_009_SCOPE_DIALOG` | no | 52.5428% | `[0, 0, 390, 828]` |

### 22. Hash `a64581d6` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `MGT_AUDIT_003_DENIED_COACH` | COACH | `/audit` | `MGT_AUDIT_003_DENIED_COACH__COACH__1440x900.png` |
| `MGT_PEOPLE_007_DENIED_COACH` | COACH | `/management/people` | `MGT_PEOPLE_007_DENIED_COACH__COACH__1440x900.png` |
| `MGT_STRUCTURE_007_DENIED_COACH` | COACH | `/management/structure` | `MGT_STRUCTURE_007_DENIED_COACH__COACH__1440x900.png` |

**Motivo:** Las tres usan el Empty compartido (src/shared/ui.tsx:865-888) con titulos distintos: el historial es de administracion, las personas las administra el club, la estructura la administra el club. Falso positivo del hash perceptual de 16x16 en gris.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `MGT_AUDIT_003_DENIED_COACH` | `MGT_PEOPLE_007_DENIED_COACH` | no | 0.3827% | `[26, 34, 994, 198]` |
| `MGT_AUDIT_003_DENIED_COACH` | `MGT_STRUCTURE_007_DENIED_COACH` | no | 0.3701% | `[26, 34, 994, 198]` |
| `MGT_PEOPLE_007_DENIED_COACH` | `MGT_STRUCTURE_007_DENIED_COACH` | no | 0.3614% | `[26, 34, 982, 198]` |

### 23. Hash `aa42f415` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `COM_CONVERSATION_001_DEFAULT` | COACH | `/conversations/c-team-sexta` | `COM_CONVERSATION_001_DEFAULT__COACH__390x844.png` |
| `COM_CONVERSATION_002_EVENT_KIND` | COACH | `/conversations/c-event-cuba` | `COM_CONVERSATION_002_EVENT_KIND__COACH__390x844.png` |
| `XD_EVENT_001_TO_CONVERSATION` | COACH | `/events/match-cuba` | `XD_EVENT_001_TO_CONVERSATION__COACH__390x844.png` |

**Motivo:** Cross-domain mas defecto CURRENT: las tres superficies apuntan al destino conversacion, pero el router declara /conversations/:id (src/app/App.tsx:76) mientras el componente lee useParams().conversationId (src/features/communication.tsx:363-365). conversationId queda undefined, la conversacion nunca se resuelve y las tres renderizan el Empty 'Esa conversacion ya no existe' (src/features/communication.tsx:383-391). Estados semanticos distintos (team / event / notificacion) con composicion CURRENT identica.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `COM_CONVERSATION_001_DEFAULT` | `COM_CONVERSATION_002_EVENT_KIND` | sí | 0.0% | `None` |
| `COM_CONVERSATION_001_DEFAULT` | `XD_EVENT_001_TO_CONVERSATION` | sí | 0.0% | `None` |
| `COM_CONVERSATION_002_EVENT_KIND` | `XD_EVENT_001_TO_CONVERSATION` | sí | 0.0% | `None` |

### 24. Hash `afc7ffa5` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `CAL_EVENT_DETAIL_001_SCHEDULED_COACH` | COACH | `/events/match-cuba` | `CAL_EVENT_DETAIL_001_SCHEDULED_COACH__COACH__1440x900.png` |
| `XD_SEARCH_003_TO_EVENT` | COACH | `/search?q=CUBA` | `XD_SEARCH_003_TO_EVENT__COACH__1440x900.png` |
| `XD_TEAM_001_TO_EVENT` | COACH | `/teams/sexta` | `XD_TEAM_001_TO_EVENT__COACH__1440x900.png` |

**Motivo:** Cross-domain: XD_SEARCH_003_TO_EVENT y XD_TEAM_001_TO_EVENT son el MISMO destino /events/match-cuba alcanzado desde los origenes Buscar y Equipo. Composicion destino identica por diseno.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `CAL_EVENT_DETAIL_001_SCHEDULED_COACH` | `XD_SEARCH_003_TO_EVENT` | sí | 0.0% | `None` |
| `CAL_EVENT_DETAIL_001_SCHEDULED_COACH` | `XD_TEAM_001_TO_EVENT` | sí | 0.0% | `None` |
| `XD_SEARCH_003_TO_EVENT` | `XD_TEAM_001_TO_EVENT` | sí | 0.0% | `None` |

### 25. Hash `b0839317` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO` | COACH | `/events/match-cuba` | `GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO__COACH__1440x900.png` |
| `CAL_EVENT_DETAIL_004_HISTORY_MODAL` | COACH | `/events/match-cuba` | `CAL_EVENT_DETAIL_004_HISTORY_MODAL__COACH__1440x900.png` |
| `CAL_EVENT_FORM_007_EDIT_DISCARD_CONFIRM` | COACH | `/events/match-cuba/edit` | `CAL_EVENT_FORM_007_EDIT_DISCARD_CONFIRM__COACH__1440x900.png` |
| `CAL_JORNADA_004_IMPACT_MODAL` | COACH | `/jornadas/j1` | `CAL_JORNADA_004_IMPACT_MODAL__COACH__1440x900.png` |

**Motivo:** Todos son dialogos modales sobre el mismo fondo oscurecido (src/shared/ui.tsx:967-972). Cada uno tiene cuerpo, titulo y accion distintos: historial de evento, descartar cambios de edicion, impacto de jornada y catalogo de overlay. Falso positivo del hash perceptual de 16x16 en gris.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO` | `CAL_EVENT_DETAIL_004_HISTORY_MODAL` | sí | 0.0% | `None` |
| `GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO` | `CAL_EVENT_FORM_007_EDIT_DISCARD_CONFIRM` | no | 35.4709% | `[8, 51, 1220, 900]` |
| `GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO` | `CAL_JORNADA_004_IMPACT_MODAL` | no | 30.4445% | `[19, 0, 1221, 841]` |
| `CAL_EVENT_DETAIL_004_HISTORY_MODAL` | `CAL_EVENT_FORM_007_EDIT_DISCARD_CONFIRM` | no | 35.4709% | `[8, 51, 1220, 900]` |
| `CAL_EVENT_DETAIL_004_HISTORY_MODAL` | `CAL_JORNADA_004_IMPACT_MODAL` | no | 30.4445% | `[19, 0, 1221, 841]` |
| `CAL_EVENT_FORM_007_EDIT_DISCARD_CONFIRM` | `CAL_JORNADA_004_IMPACT_MODAL` | no | 30.3025% | `[8, 0, 1221, 900]` |

### 26. Hash `b23634fc` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `MGT_COMPETITIONS_001_LIST` | ADMIN | `/management/competitions` | `MGT_COMPETITIONS_001_LIST__ADMIN__390x844.png` |
| `MGT_COMPETITIONS_006_SUBCOMMITTEE` | SUBCOMMITTEE | `/management/competitions` | `MGT_COMPETITIONS_006_SUBCOMMITTEE__SUBCOMMITTEE__390x844.png` |

**Motivo:** Misma pantalla de lista de competencias para ADMIN y SUBCOMMITTEE; las filas visibles coinciden para ese actor.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `MGT_COMPETITIONS_001_LIST` | `MGT_COMPETITIONS_006_SUBCOMMITTEE` | no | 0.0447% | `[347, 27, 365, 37]` |

### 27. Hash `b5667f19` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `PRT_ATTENDANCE_001_OPEN` | COACH | `/events/match-lomas/attendance` | `PRT_ATTENDANCE_001_OPEN__COACH__390x844.png` |
| `XD_REPORT_001_TO_ATTENDANCE` | COACH | `/reports/attendance` | `XD_REPORT_001_TO_ATTENDANCE__COACH__390x844.png` |

**Motivo:** Cross-domain: XD_REPORT_001_TO_ATTENDANCE es el MISMO destino /events/match-lomas/attendance alcanzado desde el origen Informes. Composicion destino identica por diseno.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `PRT_ATTENDANCE_001_OPEN` | `XD_REPORT_001_TO_ATTENDANCE` | sí | 0.0% | `None` |

### 28. Hash `bab85953` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `CAL_EVENT_DETAIL_005_IN_PROGRESS` | COACH | `/events/match-lomas` | `CAL_EVENT_DETAIL_005_IN_PROGRESS__COACH__1440x900.png` |
| `XD_HOME_001_TO_EVENT` | COACH | `/home` | `XD_HOME_001_TO_EVENT__COACH__1440x900.png` |

**Motivo:** Cross-domain: XD_HOME_001_TO_EVENT es el MISMO destino /events/match-lomas alcanzado desde el origen Home. Composicion destino identica por diseno.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `CAL_EVENT_DETAIL_005_IN_PROGRESS` | `XD_HOME_001_TO_EVENT` | sí | 0.0% | `None` |

### 29. Hash `bde7bb7e` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `CAL_JORNADA_003_READ_ONLY` | PLAYER | `/jornadas/j1` | `CAL_JORNADA_003_READ_ONLY__PLAYER__1440x900.png` |
| `XD_COMPETITION_001_TO_JORNADA` | ADMIN | `/management/competitions/ahba` | `XD_COMPETITION_001_TO_JORNADA__ADMIN__1440x900.png` |

**Motivo:** Cross-domain: XD_COMPETITION_001_TO_JORNADA es el MISMO destino /jornadas/j1 alcanzado desde el origen Competencias. La vista de solo-lectura del PLAYER y el acceso del ADMIN coinciden en la composicion visible.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `CAL_JORNADA_003_READ_ONLY` | `XD_COMPETITION_001_TO_JORNADA` | no | 0.1285% | `[24, 20, 1407, 301]` |

### 30. Hash `bf1e9d88` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `PRT_MATCH_RECORD_005_CORRECT_CONFIRM` | COACH | `/events/match-sic/match-record` | `PRT_MATCH_RECORD_005_CORRECT_CONFIRM__COACH__390x844.png` |
| `COM_ANNOUNCEMENT_004_ARCHIVE_CONFIRM` | SUBCOMMITTEE | `/announcements/a1` | `COM_ANNOUNCEMENT_004_ARCHIVE_CONFIRM__SUBCOMMITTEE__390x844.png` |
| `MGT_COMPETITIONS_005_ARCHIVE_CONFIRM` | ADMIN | `/management/competitions/ahba` | `MGT_COMPETITIONS_005_ARCHIVE_CONFIRM__ADMIN__390x844.png` |
| `MGT_PERSON_012_MEMBERSHIP_END_CONFIRM` | ADMIN | `/management/people/p2?section=pertenencia` | `MGT_PERSON_012_MEMBERSHIP_END_CONFIRM__ADMIN__390x844.png` |
| `MGT_PERSON_013_DISABLE_ACCOUNT_CONFIRM` | ADMIN | `/management/people/p2?section=cuenta` | `MGT_PERSON_013_DISABLE_ACCOUNT_CONFIRM__ADMIN__390x844.png` |

**Motivo:** Los cinco reutilizan ConfirmDialog (src/shared/ui.tsx:1053-1130) sobre el mismo fondo oscurecido, con titulo, consecuencia, boton y tono distintos. Falso positivo del hash perceptual de 16x16 en gris.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `PRT_MATCH_RECORD_005_CORRECT_CONFIRM` | `COM_ANNOUNCEMENT_004_ARCHIVE_CONFIRM` | no | 40.7887% | `[11, 0, 378, 828]` |
| `PRT_MATCH_RECORD_005_CORRECT_CONFIRM` | `MGT_COMPETITIONS_005_ARCHIVE_CONFIRM` | no | 39.8074% | `[12, 0, 378, 828]` |
| `PRT_MATCH_RECORD_005_CORRECT_CONFIRM` | `MGT_PERSON_012_MEMBERSHIP_END_CONFIRM` | no | 44.6181% | `[0, 0, 390, 828]` |
| `PRT_MATCH_RECORD_005_CORRECT_CONFIRM` | `MGT_PERSON_013_DISABLE_ACCOUNT_CONFIRM` | no | 33.2039% | `[11, 0, 390, 828]` |
| `COM_ANNOUNCEMENT_004_ARCHIVE_CONFIRM` | `MGT_COMPETITIONS_005_ARCHIVE_CONFIRM` | no | 20.7656% | `[11, 0, 378, 828]` |
| `COM_ANNOUNCEMENT_004_ARCHIVE_CONFIRM` | `MGT_PERSON_012_MEMBERSHIP_END_CONFIRM` | no | 27.874% | `[0, 22, 390, 828]` |
| `COM_ANNOUNCEMENT_004_ARCHIVE_CONFIRM` | `MGT_PERSON_013_DISABLE_ACCOUNT_CONFIRM` | no | 35.1291% | `[11, 0, 390, 828]` |
| `MGT_COMPETITIONS_005_ARCHIVE_CONFIRM` | `MGT_PERSON_012_MEMBERSHIP_END_CONFIRM` | no | 26.7542% | `[0, 0, 390, 828]` |
| `MGT_COMPETITIONS_005_ARCHIVE_CONFIRM` | `MGT_PERSON_013_DISABLE_ACCOUNT_CONFIRM` | no | 35.1817% | `[11, 0, 390, 828]` |
| `MGT_PERSON_012_MEMBERSHIP_END_CONFIRM` | `MGT_PERSON_013_DISABLE_ACCOUNT_CONFIRM` | no | 37.8023% | `[0, 0, 390, 828]` |

### 31. Hash `bf71bce4` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `GBL_NAV_002_BOTTOMNAV_ACTIVE_CALENDAR` | COACH | `/calendar` | `GBL_NAV_002_BOTTOMNAV_ACTIVE_CALENDAR__COACH__390x844.png` |
| `CAL_CALENDAR_001_AGENDA` | COACH | `/calendar?view=agenda` | `CAL_CALENDAR_001_AGENDA__COACH__390x844.png` |
| `CAL_CALENDAR_004_AGENDA_EVENT_SELECTED` | COACH | `/calendar?view=agenda&event=match-cuba` | `CAL_CALENDAR_004_AGENDA_EVENT_SELECTED__COACH__390x844.png` |

**Motivo:** En 390 la vista por defecto de /calendar ES Agenda (src/features/overview.tsx:525). CAL_CALENDAR_001 y CAL_CALENDAR_004 comparten la misma composicion visible porque en la vista Agenda la fila no se resalta (src/features/overview.tsx:624-630 -> src/shared/ui.tsx:134-156) y el panel contextual con el evento seleccionado queda apilado DEBAJO del pliegue en 390 (src/features/overview.tsx:700-735); a 1440 las dos capturas SI difieren. Estados semanticos distintos (sin evento seleccionado / evento seleccionado) con misma composicion visible a 390.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `GBL_NAV_002_BOTTOMNAV_ACTIVE_CALENDAR` | `CAL_CALENDAR_001_AGENDA` | sí | 0.0% | `None` |
| `GBL_NAV_002_BOTTOMNAV_ACTIVE_CALENDAR` | `CAL_CALENDAR_004_AGENDA_EVENT_SELECTED` | sí | 0.0% | `None` |
| `CAL_CALENDAR_001_AGENDA` | `CAL_CALENDAR_004_AGENDA_EVENT_SELECTED` | sí | 0.0% | `None` |

### 32. Hash `bf767541` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `PRT_MATCH_RECORD_004_FINALIZE_CONFIRM` | COACH | `/events/match-lomas/match-record` | `PRT_MATCH_RECORD_004_FINALIZE_CONFIRM__COACH__390x844.png` |
| `MGT_PERSON_011_MEMBERSHIP_START_CONFIRM` | ADMIN | `/management/people/p16` | `MGT_PERSON_011_MEMBERSHIP_START_CONFIRM__ADMIN__390x844.png` |

**Motivo:** ConfirmDialog compartido (src/shared/ui.tsx:1053-1130) con textos distintos: finalizar resultado e iniciar pertenencia. Falso positivo del hash perceptual de 16x16 en gris.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `PRT_MATCH_RECORD_004_FINALIZE_CONFIRM` | `MGT_PERSON_011_MEMBERSHIP_START_CONFIRM` | no | 44.7381% | `[11, 15, 390, 830]` |

### 33. Hash `c0442c7c` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `EQ_TEAM_DETAIL_004_OUT_OF_SCOPE` | PLAYER | `/teams/quinta` | `EQ_TEAM_DETAIL_004_OUT_OF_SCOPE__PLAYER__1440x900.png` |
| `EQ_TEAM_DETAIL_005_QUERY_ONLY` | PLAYER | `/teams/septima` | `EQ_TEAM_DETAIL_005_QUERY_ONLY__PLAYER__1440x900.png` |

**Motivo:** Misma pantalla de detalle de equipo para PLAYER con alcance distinto (fuera de alcance vs solo consulta). Composicion visible coincidente.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `EQ_TEAM_DETAIL_004_OUT_OF_SCOPE` | `EQ_TEAM_DETAIL_005_QUERY_ONLY` | no | 0.2305% | `[320, 141, 623, 277]` |

### 34. Hash `c5bedeb2` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `EQ_TEAM_DETAIL_001_EVENTOS` | COACH | `/teams/sexta` | `EQ_TEAM_DETAIL_001_EVENTOS__COACH__390x844.png` |
| `XD_SEARCH_002_TO_TEAM` | COACH | `/search?q=Sexta` | `XD_SEARCH_002_TO_TEAM__COACH__390x844.png` |

**Motivo:** Cross-domain: XD_SEARCH_002_TO_TEAM es el MISMO destino /teams/sexta alcanzado desde el origen Buscar. Composicion destino identica por diseno.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `EQ_TEAM_DETAIL_001_EVENTOS` | `XD_SEARCH_002_TO_TEAM` | sí | 0.0% | `None` |

### 35. Hash `c8509ecd` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `CAL_CALENDAR_002_MONTH` | COACH | `/calendar?view=month` | `CAL_CALENDAR_002_MONTH__COACH__390x844.png` |
| `CAL_CALENDAR_003_MONTH_EVENT_SELECTED` | COACH | `/calendar?view=month&event=match-cuba` | `CAL_CALENDAR_003_MONTH_EVENT_SELECTED__COACH__390x844.png` |

**Motivo:** En 390 el chip seleccionado existe en el DOM (src/features/overview.tsx:596-603) pero queda en y=947, por debajo del pliegue de 844 px, y su outline no se pinta (outline-style:none en runtime). El panel contextual con el detalle queda apilado debajo de la matriz (src/features/overview.tsx:700-735). El estado semantico 'evento seleccionado' no produce diferencia visible en el viewport de 390; a 1440 las capturas SI difieren.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `CAL_CALENDAR_002_MONTH` | `CAL_CALENDAR_003_MONTH_EVENT_SELECTED` | sí | 0.0% | `None` |

### 36. Hash `cb44a85b` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `COM_COMM_003_COMUNICADOS_SUBCOMMITTEE` | SUBCOMMITTEE | `/communication?tab=comunicados` | `COM_COMM_003_COMUNICADOS_SUBCOMMITTEE__SUBCOMMITTEE__1440x900.png` |
| `COM_COMM_004_NO_CHAT_ADMIN` | ADMIN | `/communication` | `COM_COMM_004_NO_CHAT_ADMIN__ADMIN__1440x900.png` |

**Motivo:** Misma pantalla /communication: pestana de comunicados para SUBCOMMITTEE vs pantalla sin chat para ADMIN. Composicion visible coincidente.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `COM_COMM_003_COMUNICADOS_SUBCOMMITTEE` | `COM_COMM_004_NO_CHAT_ADMIN` | no | 0.0113% | `[1389, 27, 1407, 37]` |

### 37. Hash `d10d421b` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `CAL_EVENT_DETAIL_005_IN_PROGRESS` | COACH | `/events/match-lomas` | `CAL_EVENT_DETAIL_005_IN_PROGRESS__COACH__390x844.png` |
| `XD_HOME_001_TO_EVENT` | COACH | `/home` | `XD_HOME_001_TO_EVENT__COACH__390x844.png` |

**Motivo:** Cross-domain: XD_HOME_001_TO_EVENT es el MISMO destino /events/match-lomas alcanzado desde el origen Home. Composicion destino identica por diseno.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `CAL_EVENT_DETAIL_005_IN_PROGRESS` | `XD_HOME_001_TO_EVENT` | sí | 0.0% | `None` |

### 38. Hash `d292a6fc` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `EQ_TEAM_DETAIL_004_OUT_OF_SCOPE` | PLAYER | `/teams/quinta` | `EQ_TEAM_DETAIL_004_OUT_OF_SCOPE__PLAYER__390x844.png` |
| `EQ_TEAM_DETAIL_005_QUERY_ONLY` | PLAYER | `/teams/septima` | `EQ_TEAM_DETAIL_005_QUERY_ONLY__PLAYER__390x844.png` |

**Motivo:** Misma pantalla de detalle de equipo para PLAYER con alcance distinto (fuera de alcance vs solo consulta). Composicion visible coincidente.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `EQ_TEAM_DETAIL_004_OUT_OF_SCOPE` | `EQ_TEAM_DETAIL_005_QUERY_ONLY` | no | 0.9075% | `[16, 141, 319, 311]` |

### 39. Hash `d4e95ddf` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `MORE_001_COACH` | COACH | `/more` | `MORE_001_COACH__COACH__390x844.png` |
| `MORE_004_PLAYER` | PLAYER | `/more` | `MORE_004_PLAYER__PLAYER__390x844.png` |
| `MORE_005_JORNADAS` | COACH | `/more` | `MORE_005_JORNADAS__COACH__390x844.png` |

**Motivo:** Misma pantalla /more en estado por defecto para COACH, PLAYER y la seccion de jornadas. Secciones distintas con composicion visible coincidente.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `MORE_001_COACH` | `MORE_004_PLAYER` | no | 0.024% | `[349, 28, 364, 36]` |
| `MORE_001_COACH` | `MORE_005_JORNADAS` | sí | 0.0% | `None` |
| `MORE_004_PLAYER` | `MORE_005_JORNADAS` | no | 0.024% | `[349, 28, 364, 36]` |

### 40. Hash `d7016027` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `GBL_NAV_001_SIDEBAR_ACTIVE_CALENDAR` | COACH | `/calendar` | `GBL_NAV_001_SIDEBAR_ACTIVE_CALENDAR__COACH__1440x900.png` |
| `CAL_CALENDAR_002_MONTH` | COACH | `/calendar?view=month` | `CAL_CALENDAR_002_MONTH__COACH__1440x900.png` |

**Motivo:** GBL_NAV_001 documenta el cromo de la barra lateral sobre la ruta /calendar; CAL_CALENDAR_002 documenta la vista Mes. En 1440 la vista por defecto de /calendar ES Mes (window.innerWidth >= 1024, src/features/overview.tsx:525), de modo que ambas capturas son la misma pagina. Superficie de cromo vs superficie de contenido.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `GBL_NAV_001_SIDEBAR_ACTIVE_CALENDAR` | `CAL_CALENDAR_002_MONTH` | sí | 0.0% | `None` |

### 41. Hash `da29b68d` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `COM_COMM_003_COMUNICADOS_SUBCOMMITTEE` | SUBCOMMITTEE | `/communication?tab=comunicados` | `COM_COMM_003_COMUNICADOS_SUBCOMMITTEE__SUBCOMMITTEE__390x844.png` |
| `COM_COMM_004_NO_CHAT_ADMIN` | ADMIN | `/communication` | `COM_COMM_004_NO_CHAT_ADMIN__ADMIN__390x844.png` |

**Motivo:** Misma pantalla /communication: pestana de comunicados para SUBCOMMITTEE vs pantalla sin chat para ADMIN. Composicion visible coincidente.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `COM_COMM_003_COMUNICADOS_SUBCOMMITTEE` | `COM_COMM_004_NO_CHAT_ADMIN` | no | 0.0447% | `[347, 27, 365, 37]` |

### 42. Hash `dc05cc85` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `CAL_EVENT_DETAIL_011_OFFICIAL_COORDINATION` | SUBCOMMITTEE | `/events/match-cuba` | `CAL_EVENT_DETAIL_011_OFFICIAL_COORDINATION__SUBCOMMITTEE__390x844.png` |
| `CAL_EVENT_DETAIL_014_PLAYER_NOT_INVITED` | SUBCOMMITTEE | `/events/match-cuba` | `CAL_EVENT_DETAIL_014_PLAYER_NOT_INVITED__SUBCOMMITTEE__390x844.png` |

**Motivo:** CURRENT no tiene rama visual de 'no invitado': la unica condicion de convocatoria es meInvited (src/features/events.tsx:308), y para SUBCOMMITTEE es false en ambos casos (no esta en event.published, src/mock/seed.ts:170-174), con canRespondOwn false (src/mock/authority.ts:116-122). Ambos estados renderizan el mismo detalle (src/features/events.tsx:481-503 y 568-590). Estados semanticos distintos con composicion CURRENT identica.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `CAL_EVENT_DETAIL_011_OFFICIAL_COORDINATION` | `CAL_EVENT_DETAIL_014_PLAYER_NOT_INVITED` | sí | 0.0% | `None` |

### 43. Hash `df0ab369` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `CAL_EVENT_DETAIL_011_OFFICIAL_COORDINATION` | SUBCOMMITTEE | `/events/match-cuba` | `CAL_EVENT_DETAIL_011_OFFICIAL_COORDINATION__SUBCOMMITTEE__1440x900.png` |
| `CAL_EVENT_DETAIL_014_PLAYER_NOT_INVITED` | SUBCOMMITTEE | `/events/match-cuba` | `CAL_EVENT_DETAIL_014_PLAYER_NOT_INVITED__SUBCOMMITTEE__1440x900.png` |

**Motivo:** CURRENT no tiene rama visual de 'no invitado': la unica condicion de convocatoria es meInvited (src/features/events.tsx:308), y para SUBCOMMITTEE es false en ambos casos (no esta en event.published, src/mock/seed.ts:170-174), con canRespondOwn false (src/mock/authority.ts:116-122). Ambos estados renderizan el mismo detalle (src/features/events.tsx:481-503 y 568-590). Estados semanticos distintos con composicion CURRENT identica.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `CAL_EVENT_DETAIL_011_OFFICIAL_COORDINATION` | `CAL_EVENT_DETAIL_014_PLAYER_NOT_INVITED` | sí | 0.0% | `None` |

### 44. Hash `e4773a84` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `MGT_COMPETITIONS_003_CREATE_MODAL` | ADMIN | `/management/competitions` | `MGT_COMPETITIONS_003_CREATE_MODAL__ADMIN__1440x900.png` |
| `MGT_COMPETITIONS_004_EDIT_MODAL` | ADMIN | `/management/competitions/ahba` | `MGT_COMPETITIONS_004_EDIT_MODAL__ADMIN__1440x900.png` |

**Motivo:** Mismo modal de competencia (src/features/management.tsx) en vacio y pre-cargado. La diferencia real son los valores de los campos, dentro de la caja del modal.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `MGT_COMPETITIONS_003_CREATE_MODAL` | `MGT_COMPETITIONS_004_EDIT_MODAL` | no | 8.5572% | `[379, 87, 1285, 844]` |

### 45. Hash `ee4d9544` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `GBL_NAV_004_SIDEBAR_BADGES_COACH` | COACH | `/home` | `GBL_NAV_004_SIDEBAR_BADGES_COACH__COACH__1440x900.png` |
| `GBL_SHELL_002_TOPBAR_DESKTOP` | COACH | `/home` | `GBL_SHELL_002_TOPBAR_DESKTOP__COACH__1440x900.png` |
| `HOME_001_DEFAULT_COACH` | COACH | `/home` | `HOME_001_DEFAULT_COACH__COACH__1440x900.png` |

**Motivo:** Las tres superficies comparten la ruta /home en 1440: GBL_NAV_004 documenta los contadores de la barra lateral, GBL_SHELL_002 la composicion de la barra superior y HOME_001 el contenido de inicio. El cromo forma parte de la pagina, por lo que la composicion visible coincide. Superficies de cromo vs superficie de contenido.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `GBL_NAV_004_SIDEBAR_BADGES_COACH` | `GBL_SHELL_002_TOPBAR_DESKTOP` | sí | 0.0% | `None` |
| `GBL_NAV_004_SIDEBAR_BADGES_COACH` | `HOME_001_DEFAULT_COACH` | sí | 0.0% | `None` |
| `GBL_SHELL_002_TOPBAR_DESKTOP` | `HOME_001_DEFAULT_COACH` | sí | 0.0% | `None` |

### 46. Hash `f7b3c24c` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO` | COACH | `/events/match-cuba` | `GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO__COACH__390x844.png` |
| `CAL_EVENT_DETAIL_004_HISTORY_MODAL` | COACH | `/events/match-cuba` | `CAL_EVENT_DETAIL_004_HISTORY_MODAL__COACH__390x844.png` |
| `CAL_EVENT_FORM_007_EDIT_DISCARD_CONFIRM` | COACH | `/events/match-cuba/edit` | `CAL_EVENT_FORM_007_EDIT_DISCARD_CONFIRM__COACH__390x844.png` |
| `CAL_JORNADA_004_IMPACT_MODAL` | COACH | `/jornadas/j1` | `CAL_JORNADA_004_IMPACT_MODAL__COACH__390x844.png` |

**Motivo:** Todos son dialogos modales sobre el mismo fondo oscurecido (src/shared/ui.tsx:967-972). Cada uno tiene cuerpo, titulo y accion distintos: historial de evento, descartar cambios de edicion, impacto de jornada y catalogo de overlay. Falso positivo del hash perceptual de 16x16 en gris.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO` | `CAL_EVENT_DETAIL_004_HISTORY_MODAL` | sí | 0.0% | `None` |
| `GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO` | `CAL_EVENT_FORM_007_EDIT_DISCARD_CONFIRM` | no | 60.6693% | `[0, 0, 390, 828]` |
| `GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO` | `CAL_JORNADA_004_IMPACT_MODAL` | no | 60.3123% | `[0, 0, 390, 813]` |
| `CAL_EVENT_DETAIL_004_HISTORY_MODAL` | `CAL_EVENT_FORM_007_EDIT_DISCARD_CONFIRM` | no | 60.6693% | `[0, 0, 390, 828]` |
| `CAL_EVENT_DETAIL_004_HISTORY_MODAL` | `CAL_JORNADA_004_IMPACT_MODAL` | no | 60.3123% | `[0, 0, 390, 813]` |
| `CAL_EVENT_FORM_007_EDIT_DISCARD_CONFIRM` | `CAL_JORNADA_004_IMPACT_MODAL` | no | 55.1018% | `[0, 0, 390, 828]` |

### 47. Hash `fd721316` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `GBL_NAV_003_BOTTOMNAV_ACTIVE_COMMUNICATION` | COACH | `/communication` | `GBL_NAV_003_BOTTOMNAV_ACTIVE_COMMUNICATION__COACH__390x844.png` |
| `COM_COMM_001_CONVERSACIONES` | COACH | `/communication` | `COM_COMM_001_CONVERSACIONES__COACH__390x844.png` |

**Motivo:** GBL_NAV_003 documenta el cromo de la bottom nav sobre la ruta /communication; COM_COMM_001 documenta la lista de conversaciones. Misma ruta y misma pagina: superficie de cromo vs superficie de contenido.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `GBL_NAV_003_BOTTOMNAV_ACTIVE_COMMUNICATION` | `COM_COMM_001_CONVERSACIONES` | sí | 0.0% | `None` |

### 48. Hash `fe30e797` — EXPECTED VISUAL DUPLICATE

| Surface ID | Actor | Route | File |
| --- | --- | --- | --- |
| `EQ_TEAMS_002_LIST_PLAYER` | PLAYER | `/teams` | `EQ_TEAMS_002_LIST_PLAYER__PLAYER__390x844.png` |
| `EQ_TEAMS_004_LIST_CAPTAIN` | CAPTAIN | `/teams` | `EQ_TEAMS_004_LIST_CAPTAIN__CAPTAIN__390x844.png` |

**Motivo:** Misma pantalla /teams para PLAYER y CAPTAIN; el conjunto de equipos visibles coincide para esos actores.

Diferencia real de píxeles por par:

| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |
| --- | --- | --- | --- | --- |
| `EQ_TEAMS_002_LIST_PLAYER` | `EQ_TEAMS_004_LIST_CAPTAIN` | no | 0.0322% | `[348, 28, 364, 36]` |

## Cierre

**UNCLASSIFIED POSSIBLE DUPLICATE GROUPS: 0**

No se borró ninguna captura. Las 48 coincidencias son duplicados visuales esperados:
el mismo destino alcanzado desde orígenes distintos (patrones compartidos), la misma página
documentada por sus superficies de cromo, y familias de modales y de estados vacíos que
comparten plantilla pero no contenido.