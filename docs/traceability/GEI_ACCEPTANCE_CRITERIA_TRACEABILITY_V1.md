# GEI — Acceptance Criteria Traceability V1

> **Etapa:** E9-03 · **Estado:** FROZEN con E9 · **Fuente estructural:** `GEI_TRACEABILITY_LEDGER_V1.csv`.
> Normaliza la limitación conocida de E5 (cobertura por REQ) a cobertura **contextual REQ × CU**: cada AC declara a qué CU aplica realmente, sin suponer que aplica a todos los CU del REQ.

**Formato canónico de AC ID:** E5 no numera los AC como `AC-XXX`; la referencia individual de la fuente es el ordinal dentro del REQ: **`REQ-<DOM>-<NNN> AC n`** (formato usado literalmente en las fichas E5, p. ej. "REQ-COM-007 AC 4" en UC-COM-12). E9 adopta ese formato como ID estable.

**Cobertura global:** 454/454 AC contabilizados = 418 con ≥1 CU aplicable (arista `APPLIES_TO`) + 36 transversales/N.A. con razón registrada.
**Cobertura contextual REQ × CU:** cada arista AC→CU proviene de E5 §2 (ficha) ∪ E5 §3 (matriz E3); la granularidad por paso es una limitación documentada de E5 (los AC se representan a nivel de sección: camino básico/alternativo/bloque de trazabilidad).

## Criterios — 454 AC

| AC | REQ | CU aplicables | Representación | Paso/Sección spec (E5) | Estado/Transición | Actividad (E7) | Clase/Op (E8) | Resultado |
|---|---|---|---|---|---|---|---|---|
| REQ-CMP-001 AC 1 | REQ-CMP-001 | UC-CMP-01, UC-CMP-02 | BASIC_STEP | Camino básico | → DRAFT | AD-CMP-01 | Competition op:Competition.activate(), Competitio… | ACCOUNTED |
| REQ-CMP-001 AC 2 | REQ-CMP-001 | UC-CMP-01, UC-CMP-02 | BASIC_STEP | Camino básico | → ACTIVE | AD-CMP-01 | Competition op:Competition.activate(), Competitio… | ACCOUNTED |
| REQ-CMP-001 AC 3 | REQ-CMP-001 | UC-CMP-01, UC-CMP-02 | ALTERNATIVE | Camino alternativo | — | AD-CMP-01 | Competition op:Competition.activate(), Competitio… | ACCOUNTED |
| REQ-CMP-002 AC 1 | REQ-CMP-002 | UC-CMP-03 | ALTERNATIVE | Camino alternativo | — | AD-CMP-01 | Competition op:Competition.close() | ACCOUNTED |
| REQ-CMP-002 AC 2 | REQ-CMP-002 | UC-CMP-03 | BASIC_STEP | Camino básico | — | AD-CMP-01 | Competition op:Competition.close() | ACCOUNTED |
| REQ-CMP-003 AC 1 | REQ-CMP-003 | UC-CMP-02, UC-CMP-04, UC-CMP-05, UC-CMP-06, UC-CMP-07 | BASIC_STEP | Camino básico | → PENDING | AD-CMP-01 | CompetitionEntry op:CompetitionEntry.activate(), … | ACCOUNTED |
| REQ-CMP-003 AC 2 | REQ-CMP-003 | UC-CMP-02, UC-CMP-04, UC-CMP-05, UC-CMP-06, UC-CMP-07 | BASIC_STEP | Camino básico | → ACTIVE | AD-CMP-01 | CompetitionEntry op:CompetitionEntry.activate(), … | ACCOUNTED |
| REQ-CMP-003 AC 3 | REQ-CMP-003 | UC-CMP-02, UC-CMP-04, UC-CMP-05, UC-CMP-06, UC-CMP-07 | BASIC_STEP | Camino básico | — | AD-CMP-01 | CompetitionEntry op:CompetitionEntry.activate(), … | ACCOUNTED |
| REQ-CMP-003 AC 4 | REQ-CMP-003 | UC-CMP-02, UC-CMP-04, UC-CMP-05, UC-CMP-06, UC-CMP-07 | BASIC_STEP | Camino básico | — | AD-CMP-01 | CompetitionEntry op:CompetitionEntry.activate(), … | ACCOUNTED |
| REQ-CMP-004 AC 1 | REQ-CMP-004 | UC-CMP-04, UC-CMP-05, UC-CMP-06 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-CMP-01 | CompetitionEntry op:CompetitionEntry.CompetitionE… | ACCOUNTED |
| REQ-CMP-004 AC 2 | REQ-CMP-004 | UC-CMP-04, UC-CMP-05, UC-CMP-06 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-CMP-01 | CompetitionEntry op:CompetitionEntry.CompetitionE… | ACCOUNTED |
| REQ-CMP-004 AC 3 | REQ-CMP-004 | UC-CMP-04, UC-CMP-05, UC-CMP-06 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-CMP-01 | CompetitionEntry op:CompetitionEntry.CompetitionE… | ACCOUNTED |
| REQ-CMP-005 AC 1 | REQ-CMP-005 | UC-CMP-04, UC-CMP-05, UC-CMP-06, UC-EVT-02, UC-EVT-15 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-CMP-01, AD-EVT-02, AD-EVT-04 | CompetitionEntry op:CompetitionEntry.activate(), … | ACCOUNTED |
| REQ-CMP-005 AC 2 | REQ-CMP-005 | UC-CMP-04, UC-CMP-05, UC-CMP-06, UC-EVT-02, UC-EVT-15 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-CMP-01, AD-EVT-02, AD-EVT-04 | CompetitionEntry op:CompetitionEntry.activate(), … | ACCOUNTED |
| REQ-CMP-006 AC 1 | REQ-CMP-006 | UC-CMP-01, UC-CMP-08, UC-CMP-09 | BASIC_STEP | Camino básico | — | AD-CMP-01 | ExternalReference op:Competition.addExternalRefer… | ACCOUNTED |
| REQ-CMP-006 AC 2 | REQ-CMP-006 | UC-CMP-01, UC-CMP-08, UC-CMP-09 | BASIC_STEP | Camino básico | — | AD-CMP-01 | ExternalReference op:Competition.addExternalRefer… | ACCOUNTED |
| REQ-CMP-006 AC 3 | REQ-CMP-006 | UC-CMP-01, UC-CMP-08, UC-CMP-09 | BASIC_STEP | Camino básico | — | AD-CMP-01 | ExternalReference op:Competition.addExternalRefer… | ACCOUNTED |
| REQ-CMP-007 AC 1 | REQ-CMP-007 | UC-CMP-08, UC-CMP-09, UC-PRT-12, UC-PRT-13 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | ExternalReference | ACCOUNTED |
| REQ-CMP-007 AC 2 | REQ-CMP-007 | UC-CMP-08, UC-CMP-09, UC-PRT-12, UC-PRT-13 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | ExternalReference | ACCOUNTED |
| REQ-CMP-007 AC 3 | REQ-CMP-007 | UC-CMP-08, UC-CMP-09, UC-PRT-12, UC-PRT-13 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | ExternalReference | ACCOUNTED |
| REQ-CMP-008 AC 1 | REQ-CMP-008 | UC-CMP-09, UC-PRT-12, UC-PRT-13 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | EligibilityConstraint | ACCOUNTED |
| REQ-CMP-008 AC 2 | REQ-CMP-008 | UC-CMP-09, UC-PRT-12, UC-PRT-13 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | EligibilityConstraint | ACCOUNTED |
| REQ-CMP-008 AC 3 | REQ-CMP-008 | UC-CMP-09, UC-PRT-12, UC-PRT-13 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | EligibilityConstraint | ACCOUNTED |
| REQ-CMP-008 AC 4 | REQ-CMP-008 | UC-CMP-09, UC-PRT-12, UC-PRT-13 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | EligibilityConstraint | ACCOUNTED |
| REQ-COM-001 AC 1 | REQ-COM-001 | UC-COM-01, UC-COM-02, UC-COM-04 | BASIC_STEP | Camino básico | — | AD-COM-01 | Announcement op:Announcement.Announcement(title, … | ACCOUNTED |
| REQ-COM-001 AC 2 | REQ-COM-001 | UC-COM-01, UC-COM-02, UC-COM-04 | BASIC_STEP | Camino básico | — | AD-COM-01 | Announcement op:Announcement.Announcement(title, … | ACCOUNTED |
| REQ-COM-001 AC 3 | REQ-COM-001 | UC-COM-01, UC-COM-02, UC-COM-04 | ALTERNATIVE | Camino alternativo | — | AD-COM-01 | Announcement op:Announcement.Announcement(title, … | ACCOUNTED |
| REQ-COM-002 AC 1 | REQ-COM-002 | UC-COM-01, UC-COM-02 | BASIC_STEP | Camino básico | — | AD-COM-01 | Announcement, AnnouncementTargetTeam op:Announcem… | ACCOUNTED |
| REQ-COM-002 AC 2 | REQ-COM-002 | UC-COM-01, UC-COM-02 | BASIC_STEP | Camino básico | — | AD-COM-01 | Announcement, AnnouncementTargetTeam op:Announcem… | ACCOUNTED |
| REQ-COM-002 AC 3 | REQ-COM-002 | UC-COM-01, UC-COM-02 | BASIC_STEP | Camino básico | — | AD-COM-01 | Announcement, AnnouncementTargetTeam op:Announcem… | ACCOUNTED |
| REQ-COM-003 AC 1 | REQ-COM-003 | UC-COM-02, UC-COM-03, UC-COM-05 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-COM-01 | Announcement, AnnouncementTargetTeam op:Announcem… | ACCOUNTED |
| REQ-COM-003 AC 2 | REQ-COM-003 | UC-COM-02, UC-COM-03, UC-COM-05 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-COM-01 | Announcement, AnnouncementTargetTeam op:Announcem… | ACCOUNTED |
| REQ-COM-004 AC 1 | REQ-COM-004 | UC-COM-03 | BASIC_STEP | Camino básico | — | AD-COM-01 | Announcement op:Announcement.archive(subcommittee… | ACCOUNTED |
| REQ-COM-004 AC 2 | REQ-COM-004 | UC-COM-03 | BASIC_STEP | Camino básico | — | AD-COM-01 | Announcement op:Announcement.archive(subcommittee… | ACCOUNTED |
| REQ-COM-004 AC 3 | REQ-COM-004 | UC-COM-03 | BASIC_STEP | Camino básico | — | AD-COM-01 | Announcement op:Announcement.archive(subcommittee… | ACCOUNTED |
| REQ-COM-005 AC 1 | REQ-COM-005 | UC-COM-02, UC-COM-05 | ALTERNATIVE | Camino alternativo | — | AD-COM-01 | Announcement op:Announcement.isAccessibleBy(perso… | ACCOUNTED |
| REQ-COM-005 AC 2 | REQ-COM-005 | UC-COM-02, UC-COM-05 | BASIC_STEP | Camino básico | — | AD-COM-01 | Announcement op:Announcement.isAccessibleBy(perso… | ACCOUNTED |
| REQ-COM-006 AC 1 | REQ-COM-006 | UC-COM-06, UC-COM-08 | BASIC_STEP | Camino básico | — | — | Conversation op:Conversation.Conversation(type, t… | ACCOUNTED |
| REQ-COM-006 AC 2 | REQ-COM-006 | UC-COM-06, UC-COM-08 | ALTERNATIVE | Camino alternativo | — | — | Conversation op:Conversation.Conversation(type, t… | ACCOUNTED |
| REQ-COM-006 AC 3 | REQ-COM-006 | UC-COM-06, UC-COM-08 | BASIC_STEP | Camino básico | — | — | Conversation op:Conversation.Conversation(type, t… | ACCOUNTED |
| REQ-COM-007 AC 1 | REQ-COM-007 | UC-COM-07, UC-COM-12 | ALTERNATIVE | Camino alternativo | — | — | Conversation op:Conversation.archive(participantP… | ACCOUNTED |
| REQ-COM-007 AC 2 | REQ-COM-007 | UC-COM-07, UC-COM-12 | ALTERNATIVE | Camino alternativo | — | — | Conversation op:Conversation.archive(participantP… | ACCOUNTED |
| REQ-COM-007 AC 3 | REQ-COM-007 | UC-COM-07, UC-COM-12 | BASIC_STEP | Camino básico | — | — | Conversation op:Conversation.archive(participantP… | ACCOUNTED |
| REQ-COM-007 AC 4 | REQ-COM-007 | UC-COM-07, UC-COM-12 | BASIC_STEP | Camino básico | — | — | Conversation op:Conversation.archive(participantP… | ACCOUNTED |
| REQ-COM-008 AC 1 | REQ-COM-008 | UC-COM-08 | BASIC_STEP | Camino básico | — | — | Conversation op:Conversation.Conversation(type, t… | ACCOUNTED |
| REQ-COM-008 AC 2 | REQ-COM-008 | UC-COM-08 | BASIC_STEP | Camino básico | — | — | Conversation op:Conversation.Conversation(type, t… | ACCOUNTED |
| REQ-COM-008 AC 3 | REQ-COM-008 | UC-COM-08 | BASIC_STEP | Camino básico | — | — | Conversation op:Conversation.Conversation(type, t… | ACCOUNTED |
| REQ-COM-009 AC 1 | REQ-COM-009 | UC-COM-09 | BASIC_STEP | Camino básico | — | — | Message op:Message.Message(conversationId, author… | ACCOUNTED |
| REQ-COM-009 AC 2 | REQ-COM-009 | UC-COM-09 | BASIC_STEP | Camino básico | — | — | Message op:Message.Message(conversationId, author… | ACCOUNTED |
| REQ-COM-009 AC 3 | REQ-COM-009 | UC-COM-09 | BASIC_STEP | Camino básico | — | — | Message op:Message.Message(conversationId, author… | ACCOUNTED |
| REQ-COM-010 AC 1 | REQ-COM-010 | UC-COM-10, UC-COM-11 | BASIC_STEP | Camino básico | — | — | Message op:Message.delete(authorPersonId, reason)… | ACCOUNTED |
| REQ-COM-010 AC 2 | REQ-COM-010 | UC-COM-10, UC-COM-11 | BASIC_STEP | Camino básico | — | — | Message op:Message.delete(authorPersonId, reason)… | ACCOUNTED |
| REQ-COM-010 AC 3 | REQ-COM-010 | UC-COM-10, UC-COM-11 | ALTERNATIVE | Camino alternativo | — | — | Message op:Message.delete(authorPersonId, reason)… | ACCOUNTED |
| REQ-COM-011 AC 1 | REQ-COM-011 | UC-COM-08, UC-COM-09, UC-COM-12 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | ConversationParticipant op:Conversation.addPartic… | ACCOUNTED |
| REQ-COM-011 AC 2 | REQ-COM-011 | UC-COM-08, UC-COM-09, UC-COM-12 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | ConversationParticipant op:Conversation.addPartic… | ACCOUNTED |
| REQ-COM-011 AC 3 | REQ-COM-011 | UC-COM-08, UC-COM-09, UC-COM-12 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | ConversationParticipant op:Conversation.addPartic… | ACCOUNTED |
| REQ-COM-012 AC 1 | REQ-COM-012 | UC-COM-06, UC-COM-07, UC-COM-08, UC-COM-09, UC-PPL-11, UC-PPL-13 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | Conversation op:Conversation.hasCommunicationEnti… | ACCOUNTED |
| REQ-COM-012 AC 2 | REQ-COM-012 | UC-COM-06, UC-COM-07, UC-COM-08, UC-COM-09, UC-PPL-11, UC-PPL-13 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | Conversation op:Conversation.hasCommunicationEnti… | ACCOUNTED |
| REQ-COM-012 AC 3 | REQ-COM-012 | UC-COM-06, UC-COM-07, UC-COM-08, UC-COM-09, UC-PPL-11, UC-PPL-13 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | Conversation op:Conversation.hasCommunicationEnti… | ACCOUNTED |
| REQ-COM-013 AC 1 | REQ-COM-013 | UC-COM-06, UC-COM-07, UC-COM-08 | BASIC_STEP | Camino básico | — | — | — | ACCOUNTED |
| REQ-COM-013 AC 2 | REQ-COM-013 | UC-COM-06, UC-COM-07, UC-COM-08 | BASIC_STEP | Camino básico | — | — | — | ACCOUNTED |
| REQ-COM-014 AC 1 | REQ-COM-014 | UC-COM-02, UC-COM-13, UC-EVT-05, UC-EVT-06, UC-EVT-07, UC-EVT-08 (+1) | CROSS_CUTTING | Transversal (CROSS_CUTTING — respetada por la ficha sin pas… | — | AD-COM-01, AD-EVT-03, AD-PRT-02 | Notification op:Notification.Notification(recipie… | ACCOUNTED |
| REQ-COM-014 AC 2 | REQ-COM-014 | UC-COM-02, UC-COM-13, UC-EVT-05, UC-EVT-06, UC-EVT-07, UC-EVT-08 (+1) | CROSS_CUTTING | Transversal (CROSS_CUTTING — respetada por la ficha sin pas… | — | AD-COM-01, AD-EVT-03, AD-PRT-02 | Notification op:Notification.Notification(recipie… | ACCOUNTED |
| REQ-COM-014 AC 3 | REQ-COM-014 | UC-COM-02, UC-COM-13, UC-EVT-05, UC-EVT-06, UC-EVT-07, UC-EVT-08 (+1) | CROSS_CUTTING | Transversal (CROSS_CUTTING — respetada por la ficha sin pas… | — | AD-COM-01, AD-EVT-03, AD-PRT-02 | Notification op:Notification.Notification(recipie… | ACCOUNTED |
| REQ-COM-015 AC 1 | REQ-COM-015 | UC-COM-13, UC-PRT-03 | BASIC_STEP | Camino básico | — | AD-PRT-02 | Notification op:Notification.Notification(recipie… | ACCOUNTED |
| REQ-COM-015 AC 2 | REQ-COM-015 | UC-COM-13, UC-PRT-03 | BASIC_STEP | Camino básico | — | AD-PRT-02 | Notification op:Notification.Notification(recipie… | ACCOUNTED |
| REQ-COM-015 AC 3 | REQ-COM-015 | UC-COM-13, UC-PRT-03 | BASIC_STEP | Camino básico | — | AD-PRT-02 | Notification op:Notification.Notification(recipie… | ACCOUNTED |
| REQ-COM-016 AC 1 | REQ-COM-016 | UC-COM-13, UC-EVT-01, UC-EVT-04, UC-EVT-13 | BASIC_STEP | Camino básico | — | AD-EVT-02, AD-EVT-01 | Notification op:Notification.Notification(recipie… | ACCOUNTED |
| REQ-COM-016 AC 2 | REQ-COM-016 | UC-COM-13, UC-EVT-01, UC-EVT-04, UC-EVT-13 | BASIC_STEP | Camino básico | — | AD-EVT-02, AD-EVT-01 | Notification op:Notification.Notification(recipie… | ACCOUNTED |
| REQ-COM-016 AC 3 | REQ-COM-016 | UC-COM-13, UC-EVT-01, UC-EVT-04, UC-EVT-13 | BASIC_STEP | Camino básico | — | AD-EVT-02, AD-EVT-01 | Notification op:Notification.Notification(recipie… | ACCOUNTED |
| REQ-COM-017 AC 1 | REQ-COM-017 | UC-COM-09, UC-COM-13, UC-PRT-01, UC-PRT-05, UC-PRT-07 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-PRT-01, AD-PRT-03 | Notification | ACCOUNTED |
| REQ-COM-017 AC 2 | REQ-COM-017 | UC-COM-09, UC-COM-13, UC-PRT-01, UC-PRT-05, UC-PRT-07 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-PRT-01, AD-PRT-03 | Notification | ACCOUNTED |
| REQ-COM-017 AC 3 | REQ-COM-017 | UC-COM-09, UC-COM-13, UC-PRT-01, UC-PRT-05, UC-PRT-07 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-PRT-01, AD-PRT-03 | Notification | ACCOUNTED |
| REQ-COM-017 AC 4 | REQ-COM-017 | UC-COM-09, UC-COM-13, UC-PRT-01, UC-PRT-05, UC-PRT-07 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-PRT-01, AD-PRT-03 | Notification | ACCOUNTED |
| REQ-COM-018 AC 1 | REQ-COM-018 | UC-COM-13, UC-COM-14 | BASIC_STEP | Camino básico | — | — | Notification op:Notification.markRead(), Notifica… | ACCOUNTED |
| REQ-COM-018 AC 2 | REQ-COM-018 | UC-COM-13, UC-COM-14 | BASIC_STEP | Camino básico | — | — | Notification op:Notification.markRead(), Notifica… | ACCOUNTED |
| REQ-COM-018 AC 3 | REQ-COM-018 | UC-COM-13, UC-COM-14 | BASIC_STEP | Camino básico | — | — | Notification op:Notification.markRead(), Notifica… | ACCOUNTED |
| REQ-COM-018 AC 4 | REQ-COM-018 | UC-COM-13, UC-COM-14 | BASIC_STEP | Camino básico | — | — | Notification op:Notification.markRead(), Notifica… | ACCOUNTED |
| REQ-EVT-001 AC 1 | REQ-EVT-001 | UC-EVT-01, UC-EVT-02, UC-EVT-03, UC-EVT-04, UC-EVT-13, UC-EVT-15 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-02, AD-EVT-01, AD-EVT-04 | Event op:Event.validateInvariants | ACCOUNTED |
| REQ-EVT-001 AC 2 | REQ-EVT-001 | UC-EVT-01, UC-EVT-02, UC-EVT-03, UC-EVT-04, UC-EVT-13, UC-EVT-15 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-02, AD-EVT-01, AD-EVT-04 | Event op:Event.validateInvariants | ACCOUNTED |
| REQ-EVT-001 AC 3 | REQ-EVT-001 | UC-EVT-01, UC-EVT-02, UC-EVT-03, UC-EVT-04, UC-EVT-13, UC-EVT-15 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-02, AD-EVT-01, AD-EVT-04 | Event op:Event.validateInvariants | ACCOUNTED |
| REQ-EVT-002 AC 1 | REQ-EVT-002 | UC-EVT-01 | BASIC_STEP | Camino básico | — | AD-EVT-02 | Event, EventTargetTeam, EventTargetPerson op:Even… | ACCOUNTED |
| REQ-EVT-002 AC 2 | REQ-EVT-002 | UC-EVT-01 | ALTERNATIVE | Camino alternativo | — | AD-EVT-02 | Event, EventTargetTeam, EventTargetPerson op:Even… | ACCOUNTED |
| REQ-EVT-002 AC 3 | REQ-EVT-002 | UC-EVT-01 | ALTERNATIVE | Camino alternativo | — | AD-EVT-02 | Event, EventTargetTeam, EventTargetPerson op:Even… | ACCOUNTED |
| REQ-EVT-002 AC 4 | REQ-EVT-002 | UC-EVT-01 | BASIC_STEP | Camino básico | — | AD-EVT-02 | Event, EventTargetTeam, EventTargetPerson op:Even… | ACCOUNTED |
| REQ-EVT-003 AC 1 | REQ-EVT-003 | UC-EVT-02, UC-EVT-15 | BASIC_STEP | Camino básico | — | AD-EVT-02, AD-EVT-04 | Event, EventTargetTeam op:Event.Event(type, title… | ACCOUNTED |
| REQ-EVT-003 AC 2 | REQ-EVT-003 | UC-EVT-02, UC-EVT-15 | ALTERNATIVE | Camino alternativo | — | AD-EVT-02, AD-EVT-04 | Event, EventTargetTeam op:Event.Event(type, title… | ACCOUNTED |
| REQ-EVT-003 AC 3 | REQ-EVT-003 | UC-EVT-02, UC-EVT-15 | ALTERNATIVE | Camino alternativo | — | AD-EVT-02, AD-EVT-04 | Event, EventTargetTeam op:Event.Event(type, title… | ACCOUNTED |
| REQ-EVT-003 AC 4 | REQ-EVT-003 | UC-EVT-02, UC-EVT-15 | ALTERNATIVE | Camino alternativo | — | AD-EVT-02, AD-EVT-04 | Event, EventTargetTeam op:Event.Event(type, title… | ACCOUNTED |
| REQ-EVT-004 AC 1 | REQ-EVT-004 | UC-EVT-03 | BASIC_STEP | Camino básico | — | AD-EVT-02 | Event, EventTargetTeam, EventTargetPerson op:Even… | ACCOUNTED |
| REQ-EVT-004 AC 2 | REQ-EVT-004 | UC-EVT-03 | BASIC_STEP | Camino básico | — | AD-EVT-02 | Event, EventTargetTeam, EventTargetPerson op:Even… | ACCOUNTED |
| REQ-EVT-004 AC 3 | REQ-EVT-004 | UC-EVT-03 | ALTERNATIVE | Camino alternativo | — | AD-EVT-02 | Event, EventTargetTeam, EventTargetPerson op:Even… | ACCOUNTED |
| REQ-EVT-005 AC 1 | REQ-EVT-005 | UC-EVT-01, UC-EVT-02, UC-EVT-03, UC-EVT-13 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-02 | Event, EventTargetTeam, EventTargetPerson op:Even… | ACCOUNTED |
| REQ-EVT-005 AC 2 | REQ-EVT-005 | UC-EVT-01, UC-EVT-02, UC-EVT-03, UC-EVT-13 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-02 | Event, EventTargetTeam, EventTargetPerson op:Even… | ACCOUNTED |
| REQ-EVT-006 AC 1 | REQ-EVT-006 | UC-EVT-02, UC-EVT-04 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-02, AD-EVT-01 | Event op:Event.getConcreteTeam, Event.resume(newS… | ACCOUNTED |
| REQ-EVT-006 AC 2 | REQ-EVT-006 | UC-EVT-02, UC-EVT-04 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-02, AD-EVT-01 | Event op:Event.getConcreteTeam, Event.resume(newS… | ACCOUNTED |
| REQ-EVT-007 AC 1 | REQ-EVT-007 | UC-EVT-01, UC-EVT-02, UC-EVT-05, UC-EVT-06, UC-EVT-07, UC-EVT-08 (+2) | BASIC_STEP | Camino básico | → POSTPONED | AD-EVT-02, AD-EVT-03, AD-PRT-04 | Event op:Event.cancel(reason) | ACCOUNTED |
| REQ-EVT-007 AC 2 | REQ-EVT-007 | UC-EVT-01, UC-EVT-02, UC-EVT-05, UC-EVT-06, UC-EVT-07, UC-EVT-08 (+2) | BASIC_STEP | Camino básico | → SCHEDULED | AD-EVT-02, AD-EVT-03, AD-PRT-04 | Event op:Event.cancel(reason) | ACCOUNTED |
| REQ-EVT-007 AC 3 | REQ-EVT-007 | UC-EVT-01, UC-EVT-02, UC-EVT-05, UC-EVT-06, UC-EVT-07, UC-EVT-08 (+2) | BASIC_STEP | Camino básico | → SCHEDULED | AD-EVT-02, AD-EVT-03, AD-PRT-04 | Event op:Event.cancel(reason) | ACCOUNTED |
| REQ-EVT-007 AC 4 | REQ-EVT-007 | UC-EVT-01, UC-EVT-02, UC-EVT-05, UC-EVT-06, UC-EVT-07, UC-EVT-08 (+2) | ALTERNATIVE | Camino alternativo | — | AD-EVT-02, AD-EVT-03, AD-PRT-04 | Event op:Event.cancel(reason) | ACCOUNTED |
| REQ-EVT-007 AC 5 | REQ-EVT-007 | UC-EVT-01, UC-EVT-02, UC-EVT-05, UC-EVT-06, UC-EVT-07, UC-EVT-08 (+2) | BASIC_STEP | Camino básico | — | AD-EVT-02, AD-EVT-03, AD-PRT-04 | Event op:Event.cancel(reason) | ACCOUNTED |
| REQ-EVT-008 AC 1 | REQ-EVT-008 | UC-EVT-05, UC-EVT-07, UC-EVT-09, UC-EVT-10, UC-EVT-16, UC-EVT-17 (+2) | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-03, AD-PRT-04, AD-EVT-01 | Event op:Event.cancel(reason), Event.restore() | ACCOUNTED |
| REQ-EVT-008 AC 2 | REQ-EVT-008 | UC-EVT-05, UC-EVT-07, UC-EVT-09, UC-EVT-10, UC-EVT-16, UC-EVT-17 (+2) | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-03, AD-PRT-04, AD-EVT-01 | Event op:Event.cancel(reason), Event.restore() | ACCOUNTED |
| REQ-EVT-008 AC 3 | REQ-EVT-008 | UC-EVT-05, UC-EVT-07, UC-EVT-09, UC-EVT-10, UC-EVT-16, UC-EVT-17 (+2) | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-03, AD-PRT-04, AD-EVT-01 | Event op:Event.cancel(reason), Event.restore() | ACCOUNTED |
| REQ-EVT-009 AC 1 | REQ-EVT-009 | UC-EVT-01, UC-EVT-02, UC-EVT-03 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | → SCHEDULED | AD-EVT-02 | Event op:Event.schedule(startAt, endAt, venueId?) | ACCOUNTED |
| REQ-EVT-009 AC 2 | REQ-EVT-009 | UC-EVT-01, UC-EVT-02, UC-EVT-03 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-02 | Event op:Event.schedule(startAt, endAt, venueId?) | ACCOUNTED |
| REQ-EVT-009 AC 3 | REQ-EVT-009 | UC-EVT-01, UC-EVT-02, UC-EVT-03 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-02 | Event op:Event.schedule(startAt, endAt, venueId?) | ACCOUNTED |
| REQ-EVT-010 AC 1 | REQ-EVT-010 | UC-EVT-04 | BASIC_STEP | Camino básico | — | AD-EVT-01 | Event op:Event.editNonMaterial(title?, metadata) | ACCOUNTED |
| REQ-EVT-010 AC 2 | REQ-EVT-010 | UC-EVT-04 | BASIC_STEP | Camino básico | — | AD-EVT-01 | Event op:Event.editNonMaterial(title?, metadata) | ACCOUNTED |
| REQ-EVT-011 AC 1 | REQ-EVT-011 | UC-EVT-04, UC-EVT-05, UC-EVT-07, UC-EVT-08, UC-EVT-11, UC-EVT-16 (+1) | BASIC_STEP | Camino básico | — | AD-EVT-01, AD-EVT-03 | Event op:Event.executeMaterialChange(token, confi… | ACCOUNTED |
| REQ-EVT-011 AC 2 | REQ-EVT-011 | UC-EVT-04, UC-EVT-05, UC-EVT-07, UC-EVT-08, UC-EVT-11, UC-EVT-16 (+1) | BASIC_STEP | Camino básico | — | AD-EVT-01, AD-EVT-03 | Event op:Event.executeMaterialChange(token, confi… | ACCOUNTED |
| REQ-EVT-011 AC 3 | REQ-EVT-011 | UC-EVT-04, UC-EVT-05, UC-EVT-07, UC-EVT-08, UC-EVT-11, UC-EVT-16 (+1) | BASIC_STEP | Camino básico | — | AD-EVT-01, AD-EVT-03 | Event op:Event.executeMaterialChange(token, confi… | ACCOUNTED |
| REQ-EVT-011 AC 4 | REQ-EVT-011 | UC-EVT-04, UC-EVT-05, UC-EVT-07, UC-EVT-08, UC-EVT-11, UC-EVT-16 (+1) | BASIC_STEP | Camino básico | — | AD-EVT-01, AD-EVT-03 | Event op:Event.executeMaterialChange(token, confi… | ACCOUNTED |
| REQ-EVT-012 AC 1 | REQ-EVT-012 | UC-EVT-04, UC-EVT-11 | BASIC_STEP | Camino básico | — | AD-EVT-01 | Event op:Event.executeMaterialChange(token, confi… | ACCOUNTED |
| REQ-EVT-012 AC 2 | REQ-EVT-012 | UC-EVT-04, UC-EVT-11 | BASIC_STEP | Camino básico | — | AD-EVT-01 | Event op:Event.executeMaterialChange(token, confi… | ACCOUNTED |
| REQ-EVT-012 AC 3 | REQ-EVT-012 | UC-EVT-04, UC-EVT-11 | ALTERNATIVE | Camino alternativo | — | AD-EVT-01 | Event op:Event.executeMaterialChange(token, confi… | ACCOUNTED |
| REQ-EVT-012 AC 4 | REQ-EVT-012 | UC-EVT-04, UC-EVT-11 | ALTERNATIVE | Camino alternativo | — | AD-EVT-01 | Event op:Event.executeMaterialChange(token, confi… | ACCOUNTED |
| REQ-EVT-013 AC 1 | REQ-EVT-013 | UC-EVT-04, UC-EVT-12 | ALTERNATIVE | Camino alternativo | — | AD-EVT-01 | Event op:Event.resolveConcurrencyConflict(baseVer… | ACCOUNTED |
| REQ-EVT-013 AC 2 | REQ-EVT-013 | UC-EVT-04, UC-EVT-12 | BASIC_STEP | Camino básico | — | AD-EVT-01 | Event op:Event.resolveConcurrencyConflict(baseVer… | ACCOUNTED |
| REQ-EVT-013 AC 3 | REQ-EVT-013 | UC-EVT-04, UC-EVT-12 | BASIC_STEP | Camino básico | — | AD-EVT-01 | Event op:Event.resolveConcurrencyConflict(baseVer… | ACCOUNTED |
| REQ-EVT-014 AC 1 | REQ-EVT-014 | UC-EVT-13 | BASIC_STEP | Camino básico | — | — | EventSeries op:EventSeries.EventSeries(name, recu… | ACCOUNTED |
| REQ-EVT-014 AC 2 | REQ-EVT-014 | UC-EVT-13 | BASIC_STEP | Camino básico | — | — | EventSeries op:EventSeries.EventSeries(name, recu… | ACCOUNTED |
| REQ-EVT-015 AC 1 | REQ-EVT-015 | UC-EVT-04 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-01 | EventSeries, EventOccurrenceOverride op:EventSeri… | ACCOUNTED |
| REQ-EVT-015 AC 2 | REQ-EVT-015 | UC-EVT-04 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-01 | EventSeries, EventOccurrenceOverride op:EventSeri… | ACCOUNTED |
| REQ-EVT-015 AC 3 | REQ-EVT-015 | UC-EVT-04 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-01 | EventSeries, EventOccurrenceOverride op:EventSeri… | ACCOUNTED |
| REQ-EVT-015 AC 4 | REQ-EVT-015 | UC-EVT-04 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-01 | EventSeries, EventOccurrenceOverride op:EventSeri… | ACCOUNTED |
| REQ-EVT-015 AC 5 | REQ-EVT-015 | UC-EVT-04 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-01 | EventSeries, EventOccurrenceOverride op:EventSeri… | ACCOUNTED |
| REQ-EVT-016 AC 1 | REQ-EVT-016 | UC-EVT-13, UC-EVT-14 | BASIC_STEP | Camino básico | → ENDED | — | EventSeries op:EventSeries.end() | ACCOUNTED |
| REQ-EVT-016 AC 2 | REQ-EVT-016 | UC-EVT-13, UC-EVT-14 | ALTERNATIVE | Camino alternativo | — | — | EventSeries op:EventSeries.end() | ACCOUNTED |
| REQ-EVT-017 AC 1 | REQ-EVT-017 | UC-EVT-03, UC-EVT-19, UC-PRT-01, UC-PRT-02, UC-PRT-05, UC-PRT-08 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-02, AD-PRT-01, AD-PRT-02 (+2) | — | ACCOUNTED |
| REQ-EVT-017 AC 2 | REQ-EVT-017 | UC-EVT-03, UC-EVT-19, UC-PRT-01, UC-PRT-02, UC-PRT-05, UC-PRT-08 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-02, AD-PRT-01, AD-PRT-02 (+2) | — | ACCOUNTED |
| REQ-EVT-017 AC 3 | REQ-EVT-017 | UC-EVT-03, UC-EVT-19, UC-PRT-01, UC-PRT-02, UC-PRT-05, UC-PRT-08 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-02, AD-PRT-01, AD-PRT-02 (+2) | — | ACCOUNTED |
| REQ-EVT-017 AC 4 | REQ-EVT-017 | UC-EVT-03, UC-EVT-19, UC-PRT-01, UC-PRT-02, UC-PRT-05, UC-PRT-08 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-02, AD-PRT-01, AD-PRT-02 (+2) | — | ACCOUNTED |
| REQ-EVT-018 AC 1 | REQ-EVT-018 | UC-EVT-15 | BASIC_STEP | Camino básico | — | AD-EVT-04 | Jornada op:Jornada.addMatch(matchId), Jornada.bul… | ACCOUNTED |
| REQ-EVT-018 AC 2 | REQ-EVT-018 | UC-EVT-15 | ALTERNATIVE | Camino alternativo | — | AD-EVT-04 | Jornada op:Jornada.addMatch(matchId), Jornada.bul… | ACCOUNTED |
| REQ-EVT-018 AC 3 | REQ-EVT-018 | UC-EVT-15 | ALTERNATIVE | Camino alternativo | — | AD-EVT-04 | Jornada op:Jornada.addMatch(matchId), Jornada.bul… | ACCOUNTED |
| REQ-EVT-018 AC 4 | REQ-EVT-018 | UC-EVT-15 | BASIC_STEP | Camino básico | — | AD-EVT-04 | Jornada op:Jornada.addMatch(matchId), Jornada.bul… | ACCOUNTED |
| REQ-EVT-018 AC 5 | REQ-EVT-018 | UC-EVT-15 | ALTERNATIVE | Camino alternativo | — | AD-EVT-04 | Jornada op:Jornada.addMatch(matchId), Jornada.bul… | ACCOUNTED |
| REQ-EVT-019 AC 1 | REQ-EVT-019 | UC-EVT-16, UC-EVT-19 | BASIC_STEP | Camino básico | — | AD-EVT-01 | EventLogistics op:Event.updateLogistics(logistics… | ACCOUNTED |
| REQ-EVT-019 AC 2 | REQ-EVT-019 | UC-EVT-16, UC-EVT-19 | BASIC_STEP | Camino básico | — | AD-EVT-01 | EventLogistics op:Event.updateLogistics(logistics… | ACCOUNTED |
| REQ-EVT-019 AC 3 | REQ-EVT-019 | UC-EVT-16, UC-EVT-19 | BASIC_STEP | Camino básico | — | AD-EVT-01 | EventLogistics op:Event.updateLogistics(logistics… | ACCOUNTED |
| REQ-EVT-020 AC 1 | REQ-EVT-020 | UC-EVT-17 | BASIC_STEP | Camino básico | — | — | — | ACCOUNTED |
| REQ-EVT-020 AC 2 | REQ-EVT-020 | UC-EVT-17 | BASIC_STEP | Camino básico | — | — | — | ACCOUNTED |
| REQ-EVT-020 AC 3 | REQ-EVT-020 | UC-EVT-17 | BASIC_STEP | Camino básico | — | — | — | ACCOUNTED |
| REQ-EVT-021 AC 1 | REQ-EVT-021 | UC-EVT-18, UC-PRT-04 | BASIC_STEP | Camino básico | — | AD-PRT-02 | — | ACCOUNTED |
| REQ-EVT-021 AC 2 | REQ-EVT-021 | UC-EVT-18, UC-PRT-04 | BASIC_STEP | Camino básico | — | AD-PRT-02 | — | ACCOUNTED |
| REQ-EVT-021 AC 3 | REQ-EVT-021 | UC-EVT-18, UC-PRT-04 | BASIC_STEP | Camino básico | — | AD-PRT-02 | — | ACCOUNTED |
| REQ-EVT-022 AC 1 | REQ-EVT-022 | UC-EVT-17, UC-EVT-18, UC-EVT-19 | CROSS_CUTTING | Transversal (CROSS_CUTTING — respetada por la ficha sin pas… | — | — | — | ACCOUNTED |
| REQ-EVT-022 AC 2 | REQ-EVT-022 | UC-EVT-17, UC-EVT-18, UC-EVT-19 | CROSS_CUTTING | Transversal (CROSS_CUTTING — respetada por la ficha sin pas… | — | — | — | ACCOUNTED |
| REQ-EVT-023 AC 1 | REQ-EVT-023 | UC-EVT-19 | BASIC_STEP | Camino básico | — | — | — | ACCOUNTED |
| REQ-EVT-023 AC 2 | REQ-EVT-023 | UC-EVT-19 | BASIC_STEP | Camino básico | — | — | — | ACCOUNTED |
| REQ-EVT-023 AC 3 | REQ-EVT-023 | UC-EVT-19 | ALTERNATIVE | Camino alternativo | — | — | — | ACCOUNTED |
| REQ-EVT-024 AC 1 | REQ-EVT-024 | UC-CMP-03, UC-CMP-06, UC-CMP-07, UC-EVT-07, UC-EVT-15, UC-STR-15 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-CMP-01, AD-EVT-03, AD-EVT-04 | Jornada op:Jornada.bulkScheduleMatches(matches) | ACCOUNTED |
| REQ-EVT-024 AC 2 | REQ-EVT-024 | UC-CMP-03, UC-CMP-06, UC-CMP-07, UC-EVT-07, UC-EVT-15, UC-STR-15 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-CMP-01, AD-EVT-03, AD-EVT-04 | Jornada op:Jornada.bulkScheduleMatches(matches) | ACCOUNTED |
| REQ-IAM-001 AC 1 | REQ-IAM-001 | UC-IAM-01, UC-IAM-09 | BASIC_STEP | Camino básico | — | AD-IAM-01, AD-CMP-01, AD-IAM-02 (+2) | Account op:Account.createSession(csrfKey), Accoun… | ACCOUNTED |
| REQ-IAM-001 AC 2 | REQ-IAM-001 | UC-IAM-01, UC-IAM-09 | ALTERNATIVE | Camino alternativo | — | AD-IAM-01, AD-CMP-01, AD-IAM-02 (+2) | Account op:Account.createSession(csrfKey), Accoun… | ACCOUNTED |
| REQ-IAM-001 AC 3 | REQ-IAM-001 | UC-IAM-01, UC-IAM-09 | ALTERNATIVE | Camino alternativo | — | AD-IAM-01, AD-CMP-01, AD-IAM-02 (+2) | Account op:Account.createSession(csrfKey), Accoun… | ACCOUNTED |
| REQ-IAM-002 AC 1 | REQ-IAM-002 | UC-IAM-02, UC-IAM-03, UC-IAM-04 | BASIC_STEP | Camino básico | → DISABLED | AD-IAM-02 | Account op:Account.disable(adminPersonId), Accoun… | ACCOUNTED |
| REQ-IAM-002 AC 2 | REQ-IAM-002 | UC-IAM-02, UC-IAM-03, UC-IAM-04 | BASIC_STEP | Camino básico | → ACTIVE | AD-IAM-02 | Account op:Account.disable(adminPersonId), Accoun… | ACCOUNTED |
| REQ-IAM-002 AC 3 | REQ-IAM-002 | UC-IAM-02, UC-IAM-03, UC-IAM-04 | BASIC_STEP | Camino básico | — | AD-IAM-02 | Account op:Account.disable(adminPersonId), Accoun… | ACCOUNTED |
| REQ-IAM-003 AC 1 | REQ-IAM-003 | UC-IAM-03, UC-IAM-04, UC-IAM-05, UC-PPL-03 | BASIC_STEP | Camino básico | → ACTIVE | AD-IAM-02, AD-PPL-01 | Account op:Account.activate(code), Account.issueS… | ACCOUNTED |
| REQ-IAM-003 AC 2 | REQ-IAM-003 | UC-IAM-03, UC-IAM-04, UC-IAM-05, UC-PPL-03 | ALTERNATIVE | Camino alternativo | — | AD-IAM-02, AD-PPL-01 | Account op:Account.activate(code), Account.issueS… | ACCOUNTED |
| REQ-IAM-003 AC 3 | REQ-IAM-003 | UC-IAM-03, UC-IAM-04, UC-IAM-05, UC-PPL-03 | ALTERNATIVE | Camino alternativo | — | AD-IAM-02, AD-PPL-01 | Account op:Account.activate(code), Account.issueS… | ACCOUNTED |
| REQ-IAM-003 AC 4 | REQ-IAM-003 | UC-IAM-03, UC-IAM-04, UC-IAM-05, UC-PPL-03 | ALTERNATIVE | Camino alternativo | — | AD-IAM-02, AD-PPL-01 | Account op:Account.activate(code), Account.issueS… | ACCOUNTED |
| REQ-IAM-004 AC 1 | REQ-IAM-004 | UC-IAM-05 | BASIC_STEP | Camino básico | → SETUP_REQUIRED | AD-IAM-02 | — op:Account.issueSetupToken(adminPersonId), Acco… | ACCOUNTED |
| REQ-IAM-004 AC 2 | REQ-IAM-004 | UC-IAM-05 | ALTERNATIVE | Camino alternativo | — | AD-IAM-02 | — op:Account.issueSetupToken(adminPersonId), Acco… | ACCOUNTED |
| REQ-IAM-005 AC 1 | REQ-IAM-005 | UC-IAM-06 | BASIC_STEP | Camino básico | — | — | Account op:Account.changePassword(currentPassword… | ACCOUNTED |
| REQ-IAM-005 AC 2 | REQ-IAM-005 | UC-IAM-06 | ALTERNATIVE | Camino alternativo | — | — | Account op:Account.changePassword(currentPassword… | ACCOUNTED |
| REQ-IAM-005 AC 3 | REQ-IAM-005 | UC-IAM-06 | BASIC_STEP | Camino básico | — | — | Account op:Account.changePassword(currentPassword… | ACCOUNTED |
| REQ-IAM-006 AC 1 | REQ-IAM-006 | UC-IAM-01 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-IAM-01 | — op:Account.createSession(csrfKey) | ACCOUNTED |
| REQ-IAM-006 AC 2 | REQ-IAM-006 | UC-IAM-01 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-IAM-01 | — op:Account.createSession(csrfKey) | ACCOUNTED |
| REQ-IAM-006 AC 3 | REQ-IAM-006 | UC-IAM-01 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-IAM-01 | — op:Account.createSession(csrfKey) | ACCOUNTED |
| REQ-IAM-007 AC 1 | REQ-IAM-007 | — | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — op:Account.revokeSession(sessionId) | TRANSVERSAL |
| REQ-IAM-007 AC 2 | REQ-IAM-007 | — | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — op:Account.revokeSession(sessionId) | TRANSVERSAL |
| REQ-IAM-008 AC 1 | REQ-IAM-008 | UC-IAM-01, UC-IAM-07, UC-IAM-08 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-IAM-01 | — | ACCOUNTED |
| REQ-IAM-008 AC 2 | REQ-IAM-008 | UC-IAM-01, UC-IAM-07, UC-IAM-08 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-IAM-01 | — | ACCOUNTED |
| REQ-IAM-008 AC 3 | REQ-IAM-008 | UC-IAM-01, UC-IAM-07, UC-IAM-08 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-IAM-01 | — | ACCOUNTED |
| REQ-IAM-009 AC 1 | REQ-IAM-009 | UC-IAM-09 | BASIC_STEP | Camino básico | — | AD-CMP-01, AD-IAM-02, AD-PPL-01 (+1) | — | ACCOUNTED |
| REQ-IAM-009 AC 2 | REQ-IAM-009 | UC-IAM-09 | BASIC_STEP | Camino básico | — | AD-CMP-01, AD-IAM-02, AD-PPL-01 (+1) | — | ACCOUNTED |
| REQ-IAM-009 AC 3 | REQ-IAM-009 | UC-IAM-09 | ALTERNATIVE | Camino alternativo | — | AD-CMP-01, AD-IAM-02, AD-PPL-01 (+1) | — | ACCOUNTED |
| REQ-IAM-010 AC 1 | REQ-IAM-010 | UC-IAM-07, UC-IAM-08 | BASIC_STEP | Camino básico | — | — | — op:Account.revokeSession(sessionId) | ACCOUNTED |
| REQ-IAM-010 AC 2 | REQ-IAM-010 | UC-IAM-07, UC-IAM-08 | BASIC_STEP | Camino básico | — | — | — op:Account.revokeSession(sessionId) | ACCOUNTED |
| REQ-IAM-010 AC 3 | REQ-IAM-010 | UC-IAM-07, UC-IAM-08 | BASIC_STEP | Camino básico | — | — | — op:Account.revokeSession(sessionId) | ACCOUNTED |
| REQ-IAM-011 AC 1 | REQ-IAM-011 | UC-IAM-08 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | ACCOUNTED |
| REQ-IAM-011 AC 2 | REQ-IAM-011 | UC-IAM-08 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | ACCOUNTED |
| REQ-IAM-012 AC 1 | REQ-IAM-012 | UC-IAM-01, UC-PPL-11, UC-PPL-16 | CROSS_CUTTING | Transversal (CROSS_CUTTING — respetada por la ficha sin pas… | — | AD-IAM-01 | — | ACCOUNTED |
| REQ-IAM-012 AC 2 | REQ-IAM-012 | UC-IAM-01, UC-PPL-11, UC-PPL-16 | CROSS_CUTTING | Transversal (CROSS_CUTTING — respetada por la ficha sin pas… | — | AD-IAM-01 | — | ACCOUNTED |
| REQ-IAM-012 AC 3 | REQ-IAM-012 | UC-IAM-01, UC-PPL-11, UC-PPL-16 | CROSS_CUTTING | Transversal (CROSS_CUTTING — respetada por la ficha sin pas… | — | AD-IAM-01 | — | ACCOUNTED |
| REQ-IAM-013 AC 1 | REQ-IAM-013 | UC-IAM-02, UC-IAM-05, UC-IAM-09, UC-PPL-09, UC-PPL-10 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-IAM-02, AD-CMP-01, AD-PPL-01 (+1) | Account, RoleAssignment op:Account.disable(adminP… | ACCOUNTED |
| REQ-IAM-013 AC 2 | REQ-IAM-013 | UC-IAM-02, UC-IAM-05, UC-IAM-09, UC-PPL-09, UC-PPL-10 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-IAM-02, AD-CMP-01, AD-PPL-01 (+1) | Account, RoleAssignment op:Account.disable(adminP… | ACCOUNTED |
| REQ-IAM-014 AC 1 | REQ-IAM-014 | UC-IAM-03, UC-PPL-01, UC-PPL-03 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-IAM-02, AD-PPL-01 | Account | ACCOUNTED |
| REQ-IAM-014 AC 2 | REQ-IAM-014 | UC-IAM-03, UC-PPL-01, UC-PPL-03 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-IAM-02, AD-PPL-01 | Account | ACCOUNTED |
| REQ-IAM-014 AC 3 | REQ-IAM-014 | UC-IAM-03, UC-PPL-01, UC-PPL-03 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-IAM-02, AD-PPL-01 | Account | ACCOUNTED |
| REQ-IAM-015 AC 1 | REQ-IAM-015 | UC-IAM-05, UC-IAM-06, UC-IAM-09 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-IAM-02, AD-CMP-01, AD-PPL-01 (+1) | — | ACCOUNTED |
| REQ-IAM-015 AC 2 | REQ-IAM-015 | UC-IAM-05, UC-IAM-06, UC-IAM-09 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-IAM-02, AD-CMP-01, AD-PPL-01 (+1) | — | ACCOUNTED |
| REQ-IAM-015 AC 3 | REQ-IAM-015 | UC-IAM-05, UC-IAM-06, UC-IAM-09 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-IAM-02, AD-CMP-01, AD-PPL-01 (+1) | — | ACCOUNTED |
| REQ-IAM-015 AC 4 | REQ-IAM-015 | UC-IAM-05, UC-IAM-06, UC-IAM-09 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-IAM-02, AD-CMP-01, AD-PPL-01 (+1) | — | ACCOUNTED |
| REQ-IAM-016 AC 1 | REQ-IAM-016 | UC-EVT-11, UC-PPL-09 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-01 | — | ACCOUNTED |
| REQ-IAM-016 AC 2 | REQ-IAM-016 | UC-EVT-11, UC-PPL-09 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-01 | — | ACCOUNTED |
| REQ-IAM-016 AC 3 | REQ-IAM-016 | UC-EVT-11, UC-PPL-09 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-01 | — | ACCOUNTED |
| REQ-IAM-017 AC 1 | REQ-IAM-017 | — | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | TRANSVERSAL |
| REQ-IAM-017 AC 2 | REQ-IAM-017 | — | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | TRANSVERSAL |
| REQ-IAM-017 AC 3 | REQ-IAM-017 | — | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | TRANSVERSAL |
| REQ-IAM-018 AC 1 | REQ-IAM-018 | — | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | TRANSVERSAL |
| REQ-IAM-018 AC 2 | REQ-IAM-018 | — | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | TRANSVERSAL |
| REQ-IAM-019 AC 1 | REQ-IAM-019 | UC-IAM-01, UC-IAM-06 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-IAM-01 | — | ACCOUNTED |
| REQ-IAM-019 AC 2 | REQ-IAM-019 | UC-IAM-01, UC-IAM-06 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-IAM-01 | — | ACCOUNTED |
| REQ-IAM-020 AC 1 | REQ-IAM-020 | UC-IAM-10 | BASIC_STEP | Camino básico | — | — | — | ACCOUNTED |
| REQ-IAM-020 AC 2 | REQ-IAM-020 | UC-IAM-10 | ALTERNATIVE | Camino alternativo | — | — | — | ACCOUNTED |
| REQ-INS-001 AC 1 | REQ-INS-001 | UC-INS-01 | BASIC_STEP | Camino básico | — | — | — | ACCOUNTED |
| REQ-INS-001 AC 2 | REQ-INS-001 | UC-INS-01 | BASIC_STEP | Camino básico | — | — | — | ACCOUNTED |
| REQ-INS-001 AC 3 | REQ-INS-001 | UC-INS-01 | BASIC_STEP | Camino básico | — | — | — | ACCOUNTED |
| REQ-INS-002 AC 1 | REQ-INS-002 | UC-INS-01 | BASIC_STEP | Camino básico | — | — | — | ACCOUNTED |
| REQ-INS-002 AC 2 | REQ-INS-002 | UC-INS-01 | BASIC_STEP | Camino básico | — | — | — | ACCOUNTED |
| REQ-INS-003 AC 1 | REQ-INS-003 | UC-INS-01 | BASIC_STEP | Camino básico | — | — | — | ACCOUNTED |
| REQ-INS-003 AC 2 | REQ-INS-003 | UC-INS-01 | BASIC_STEP | Camino básico | — | — | — | ACCOUNTED |
| REQ-INS-004 AC 1 | REQ-INS-004 | UC-INS-02 | BASIC_STEP | Camino básico | — | — | — | ACCOUNTED |
| REQ-INS-004 AC 2 | REQ-INS-004 | UC-INS-02 | BASIC_STEP | Camino básico | — | — | — | ACCOUNTED |
| REQ-INS-004 AC 3 | REQ-INS-004 | UC-INS-02 | ALTERNATIVE | Camino alternativo | — | — | — | ACCOUNTED |
| REQ-INS-004 AC 4 | REQ-INS-004 | UC-INS-02 | BASIC_STEP | Camino básico | — | — | — | ACCOUNTED |
| REQ-INS-004 AC 5 | REQ-INS-004 | UC-INS-02 | BASIC_STEP | Camino básico | — | — | — | ACCOUNTED |
| REQ-INS-005 AC 1 | REQ-INS-005 | UC-INS-03, UC-PRT-09 | BASIC_STEP | Camino básico | — | AD-PRT-04 | PlayerMatchStats | ACCOUNTED |
| REQ-INS-005 AC 2 | REQ-INS-005 | UC-INS-03, UC-PRT-09 | BASIC_STEP | Camino básico | — | AD-PRT-04 | PlayerMatchStats | ACCOUNTED |
| REQ-INS-005 AC 3 | REQ-INS-005 | UC-INS-03, UC-PRT-09 | BASIC_STEP | Camino básico | — | AD-PRT-04 | PlayerMatchStats | ACCOUNTED |
| REQ-INS-006 AC 1 | REQ-INS-006 | UC-INS-02, UC-INS-03 | BASIC_STEP | Camino básico | — | — | — | ACCOUNTED |
| REQ-INS-006 AC 2 | REQ-INS-006 | UC-INS-02, UC-INS-03 | BASIC_STEP | Camino básico | — | — | — | ACCOUNTED |
| REQ-INS-006 AC 3 | REQ-INS-006 | UC-INS-02, UC-INS-03 | BASIC_STEP | Camino básico | — | — | — | ACCOUNTED |
| REQ-INS-007 AC 1 | REQ-INS-007 | UC-INS-02, UC-INS-03 | BASIC_STEP | Camino básico | — | — | — | ACCOUNTED |
| REQ-INS-007 AC 2 | REQ-INS-007 | UC-INS-02, UC-INS-03 | ALTERNATIVE | Camino alternativo | — | — | — | ACCOUNTED |
| REQ-INS-008 AC 1 | REQ-INS-008 | UC-INS-05 | BASIC_STEP | Camino básico | — | — | AuditEntry op:AuditEntry.AuditEntry(actorPersonId… | ACCOUNTED |
| REQ-INS-008 AC 2 | REQ-INS-008 | UC-INS-05 | ALTERNATIVE | Camino alternativo | — | — | AuditEntry op:AuditEntry.AuditEntry(actorPersonId… | ACCOUNTED |
| REQ-INS-008 AC 3 | REQ-INS-008 | UC-INS-05 | BASIC_STEP | Camino básico | — | — | AuditEntry op:AuditEntry.AuditEntry(actorPersonId… | ACCOUNTED |
| REQ-INS-009 AC 1 | REQ-INS-009 | UC-COM-03, UC-EVT-16, UC-IAM-08, UC-INS-04, UC-INS-05, UC-PPL-07 (+3) | BASIC_STEP | Camino básico | — | AD-COM-01, AD-EVT-01, AD-PPL-02 (+2) | AuditEntry op:AuditEntry.AuditEntry(actorPersonId… | ACCOUNTED |
| REQ-INS-009 AC 2 | REQ-INS-009 | UC-COM-03, UC-EVT-16, UC-IAM-08, UC-INS-04, UC-INS-05, UC-PPL-07 (+3) | BASIC_STEP | Camino básico | — | AD-COM-01, AD-EVT-01, AD-PPL-02 (+2) | AuditEntry op:AuditEntry.AuditEntry(actorPersonId… | ACCOUNTED |
| REQ-INS-009 AC 3 | REQ-INS-009 | UC-COM-03, UC-EVT-16, UC-IAM-08, UC-INS-04, UC-INS-05, UC-PPL-07 (+3) | BASIC_STEP | Camino básico | — | AD-COM-01, AD-EVT-01, AD-PPL-02 (+2) | AuditEntry op:AuditEntry.AuditEntry(actorPersonId… | ACCOUNTED |
| REQ-INS-010 AC 1 | REQ-INS-010 | UC-INS-05 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | AuditEntry op:AuditEntry.AuditEntry(actorPersonId… | ACCOUNTED |
| REQ-INS-010 AC 2 | REQ-INS-010 | UC-INS-05 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | AuditEntry op:AuditEntry.AuditEntry(actorPersonId… | ACCOUNTED |
| REQ-INS-011 AC 1 | REQ-INS-011 | UC-COM-03, UC-COM-10, UC-EVT-19, UC-INS-04, UC-PRT-03, UC-PRT-07 (+1) | BASIC_STEP | Camino básico | — | AD-COM-01, AD-PRT-02, AD-PRT-03 (+1) | AuditEntry | ACCOUNTED |
| REQ-INS-011 AC 2 | REQ-INS-011 | UC-COM-03, UC-COM-10, UC-EVT-19, UC-INS-04, UC-PRT-03, UC-PRT-07 (+1) | BASIC_STEP | Camino básico | — | AD-COM-01, AD-PRT-02, AD-PRT-03 (+1) | AuditEntry | ACCOUNTED |
| REQ-INS-011 AC 3 | REQ-INS-011 | UC-COM-03, UC-COM-10, UC-EVT-19, UC-INS-04, UC-PRT-03, UC-PRT-07 (+1) | BASIC_STEP | Camino básico | — | AD-COM-01, AD-PRT-02, AD-PRT-03 (+1) | AuditEntry | ACCOUNTED |
| REQ-INS-011 AC 4 | REQ-INS-011 | UC-COM-03, UC-COM-10, UC-EVT-19, UC-INS-04, UC-PRT-03, UC-PRT-07 (+1) | BASIC_STEP | Camino básico | — | AD-COM-01, AD-PRT-02, AD-PRT-03 (+1) | AuditEntry | ACCOUNTED |
| REQ-INS-011 AC 5 | REQ-INS-011 | UC-COM-03, UC-COM-10, UC-EVT-19, UC-INS-04, UC-PRT-03, UC-PRT-07 (+1) | BASIC_STEP | Camino básico | — | AD-COM-01, AD-PRT-02, AD-PRT-03 (+1) | AuditEntry | ACCOUNTED |
| REQ-INS-012 AC 1 | REQ-INS-012 | UC-INS-04 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | ACCOUNTED |
| REQ-INS-012 AC 2 | REQ-INS-012 | UC-INS-04 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | ACCOUNTED |
| REQ-PPL-001 AC 1 | REQ-PPL-001 | UC-PPL-01 | BASIC_STEP | Camino básico | → DNI | AD-PPL-01 | Person op:Person.Person() | ACCOUNTED |
| REQ-PPL-001 AC 2 | REQ-PPL-001 | UC-PPL-01 | ALTERNATIVE | Camino alternativo | — | AD-PPL-01 | Person op:Person.Person() | ACCOUNTED |
| REQ-PPL-001 AC 3 | REQ-PPL-001 | UC-PPL-01 | ALTERNATIVE | Camino alternativo | — | AD-PPL-01 | Person op:Person.Person() | ACCOUNTED |
| REQ-PPL-002 AC 1 | REQ-PPL-002 | UC-PPL-02, UC-PPL-06, UC-PPL-15 | ALTERNATIVE | Camino alternativo | — | AD-PPL-02 | Person op:Person.completePlayerProfile(dni, birth… | ACCOUNTED |
| REQ-PPL-002 AC 2 | REQ-PPL-002 | UC-PPL-02, UC-PPL-06, UC-PPL-15 | BASIC_STEP | Camino básico | — | AD-PPL-02 | Person op:Person.completePlayerProfile(dni, birth… | ACCOUNTED |
| REQ-PPL-003 AC 1 | REQ-PPL-003 | UC-IAM-04, UC-PPL-03 | ALTERNATIVE | Camino alternativo | — | AD-IAM-02, AD-PPL-01 | Account op:Account.Account(personId, username) | ACCOUNTED |
| REQ-PPL-003 AC 2 | REQ-PPL-003 | UC-IAM-04, UC-PPL-03 | BASIC_STEP | Camino básico | — | AD-IAM-02, AD-PPL-01 | Account op:Account.Account(personId, username) | ACCOUNTED |
| REQ-PPL-004 AC 1 | REQ-PPL-004 | UC-COM-06, UC-COM-09, UC-PPL-04, UC-PPL-05, UC-PPL-06, UC-PPL-08 | BASIC_STEP | Camino básico | — | AD-PPL-01, AD-PPL-02 | Membership op:Membership.end(validUntil), Members… | ACCOUNTED |
| REQ-PPL-004 AC 2 | REQ-PPL-004 | UC-COM-06, UC-COM-09, UC-PPL-04, UC-PPL-05, UC-PPL-06, UC-PPL-08 | ALTERNATIVE | Camino alternativo | — | AD-PPL-01, AD-PPL-02 | Membership op:Membership.end(validUntil), Members… | ACCOUNTED |
| REQ-PPL-004 AC 3 | REQ-PPL-004 | UC-COM-06, UC-COM-09, UC-PPL-04, UC-PPL-05, UC-PPL-06, UC-PPL-08 | ALTERNATIVE | Camino alternativo | — | AD-PPL-01, AD-PPL-02 | Membership op:Membership.end(validUntil), Members… | ACCOUNTED |
| REQ-PPL-004 AC 4 | REQ-PPL-004 | UC-COM-06, UC-COM-09, UC-PPL-04, UC-PPL-05, UC-PPL-06, UC-PPL-08 | BASIC_STEP | Camino básico | — | AD-PPL-01, AD-PPL-02 | Membership op:Membership.end(validUntil), Members… | ACCOUNTED |
| REQ-PPL-005 AC 1 | REQ-PPL-005 | UC-PPL-06, UC-PPL-07 | BASIC_STEP | Camino básico | — | AD-PPL-02 | TeamAssignment op:TeamAssignment.TeamAssignment(p… | ACCOUNTED |
| REQ-PPL-005 AC 2 | REQ-PPL-005 | UC-PPL-06, UC-PPL-07 | BASIC_STEP | Camino básico | — | AD-PPL-02 | TeamAssignment op:TeamAssignment.TeamAssignment(p… | ACCOUNTED |
| REQ-PPL-006 AC 1 | REQ-PPL-006 | UC-PPL-05, UC-PPL-06, UC-PPL-09, UC-PPL-10, UC-PPL-16 | ALTERNATIVE | Camino alternativo | — | AD-PPL-02 | RoleAssignment op:RoleAssignment.isValidScope, Ro… | ACCOUNTED |
| REQ-PPL-006 AC 2 | REQ-PPL-006 | UC-PPL-05, UC-PPL-06, UC-PPL-09, UC-PPL-10, UC-PPL-16 | BASIC_STEP | Camino básico | — | AD-PPL-02 | RoleAssignment op:RoleAssignment.isValidScope, Ro… | ACCOUNTED |
| REQ-PPL-006 AC 3 | REQ-PPL-006 | UC-PPL-05, UC-PPL-06, UC-PPL-09, UC-PPL-10, UC-PPL-16 | BASIC_STEP | Camino básico | — | AD-PPL-02 | RoleAssignment op:RoleAssignment.isValidScope, Ro… | ACCOUNTED |
| REQ-PPL-007 AC 1 | REQ-PPL-007 | UC-PPL-06, UC-PPL-07, UC-PPL-08, UC-PPL-10 | ALTERNATIVE | Camino alternativo | — | AD-PPL-02 | TeamAssignment op:TeamAssignment.end(validUntil) | ACCOUNTED |
| REQ-PPL-007 AC 2 | REQ-PPL-007 | UC-PPL-06, UC-PPL-07, UC-PPL-08, UC-PPL-10 | ALTERNATIVE | Camino alternativo | → CAPTAIN | AD-PPL-02 | TeamAssignment op:TeamAssignment.end(validUntil) | ACCOUNTED |
| REQ-PPL-007 AC 3 | REQ-PPL-007 | UC-PPL-06, UC-PPL-07, UC-PPL-08, UC-PPL-10 | BASIC_STEP | Camino básico | — | AD-PPL-02 | TeamAssignment op:TeamAssignment.end(validUntil) | ACCOUNTED |
| REQ-PPL-008 AC 1 | REQ-PPL-008 | UC-PPL-11, UC-PPL-12, UC-PPL-13, UC-PPL-14 | BASIC_STEP | Camino básico | — | — | GuardianRelationship op:GuardianRelationship.end(… | ACCOUNTED |
| REQ-PPL-008 AC 2 | REQ-PPL-008 | UC-PPL-11, UC-PPL-12, UC-PPL-13, UC-PPL-14 | BASIC_STEP | Camino básico | — | — | GuardianRelationship op:GuardianRelationship.end(… | ACCOUNTED |
| REQ-PPL-008 AC 3 | REQ-PPL-008 | UC-PPL-11, UC-PPL-12, UC-PPL-13, UC-PPL-14 | BASIC_STEP | Camino básico | — | — | GuardianRelationship op:GuardianRelationship.end(… | ACCOUNTED |
| REQ-PPL-008 AC 4 | REQ-PPL-008 | UC-PPL-11, UC-PPL-12, UC-PPL-13, UC-PPL-14 | BASIC_STEP | Camino básico | — | — | GuardianRelationship op:GuardianRelationship.end(… | ACCOUNTED |
| REQ-PPL-009 AC 1 | REQ-PPL-009 | UC-PPL-11, UC-PPL-13, UC-PPL-17 | BASIC_STEP | Camino básico | — | — | GuardianRelationship op:GuardianRelationship.gran… | ACCOUNTED |
| REQ-PPL-009 AC 2 | REQ-PPL-009 | UC-PPL-11, UC-PPL-13, UC-PPL-17 | ALTERNATIVE | Camino alternativo | — | — | GuardianRelationship op:GuardianRelationship.gran… | ACCOUNTED |
| REQ-PPL-009 AC 3 | REQ-PPL-009 | UC-PPL-11, UC-PPL-13, UC-PPL-17 | BASIC_STEP | Camino básico | — | — | GuardianRelationship op:GuardianRelationship.gran… | ACCOUNTED |
| REQ-PPL-010 AC 1 | REQ-PPL-010 | UC-PPL-14 | BASIC_STEP | Camino básico | — | — | RoleAssignment op:RoleAssignment.end(validUntil) | ACCOUNTED |
| REQ-PPL-010 AC 2 | REQ-PPL-010 | UC-PPL-14 | BASIC_STEP | Camino básico | — | — | RoleAssignment op:RoleAssignment.end(validUntil) | ACCOUNTED |
| REQ-PPL-011 AC 1 | REQ-PPL-011 | UC-COM-05, UC-EVT-19, UC-INS-01, UC-INS-05, UC-PPL-01, UC-PPL-02 (+5) | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-PPL-01, AD-PPL-02, AD-PRT-02 | Person, GuardianRelationship | ACCOUNTED |
| REQ-PPL-011 AC 2 | REQ-PPL-011 | UC-COM-05, UC-EVT-19, UC-INS-01, UC-INS-05, UC-PPL-01, UC-PPL-02 (+5) | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-PPL-01, AD-PPL-02, AD-PRT-02 | Person, GuardianRelationship | ACCOUNTED |
| REQ-PPL-011 AC 3 | REQ-PPL-011 | UC-COM-05, UC-EVT-19, UC-INS-01, UC-INS-05, UC-PPL-01, UC-PPL-02 (+5) | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-PPL-01, AD-PPL-02, AD-PRT-02 | Person, GuardianRelationship | ACCOUNTED |
| REQ-PPL-011 AC 4 | REQ-PPL-011 | UC-COM-05, UC-EVT-19, UC-INS-01, UC-INS-05, UC-PPL-01, UC-PPL-02 (+5) | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-PPL-01, AD-PPL-02, AD-PRT-02 | Person, GuardianRelationship | ACCOUNTED |
| REQ-PPL-012 AC 1 | REQ-PPL-012 | UC-COM-06, UC-PPL-09, UC-PPL-11, UC-PPL-12, UC-PRT-01 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-PRT-01 | — | ACCOUNTED |
| REQ-PPL-012 AC 2 | REQ-PPL-012 | UC-COM-06, UC-PPL-09, UC-PPL-11, UC-PPL-12, UC-PRT-01 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-PRT-01 | — | ACCOUNTED |
| REQ-PPL-013 AC 1 | REQ-PPL-013 | UC-PPL-02, UC-PPL-15 | BASIC_STEP | Camino básico | — | AD-PPL-02 | — op:Person.updateIdentity(firstName, lastName) | ACCOUNTED |
| REQ-PPL-013 AC 2 | REQ-PPL-013 | UC-PPL-02, UC-PPL-15 | BASIC_STEP | Camino básico | — | AD-PPL-02 | — op:Person.updateIdentity(firstName, lastName) | ACCOUNTED |
| REQ-PPL-013 AC 3 | REQ-PPL-013 | UC-PPL-02, UC-PPL-15 | BASIC_STEP | Camino básico | — | AD-PPL-02 | — op:Person.updateIdentity(firstName, lastName) | ACCOUNTED |
| REQ-PPL-014 AC 1 | REQ-PPL-014 | UC-STR-02, UC-STR-03, UC-STR-04, UC-STR-07, UC-STR-09, UC-STR-10 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | Team op:Division.updateName(name), Team.name | ACCOUNTED |
| REQ-PPL-014 AC 2 | REQ-PPL-014 | UC-STR-02, UC-STR-03, UC-STR-04, UC-STR-07, UC-STR-09, UC-STR-10 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | Team op:Division.updateName(name), Team.name | ACCOUNTED |
| REQ-PPL-015 AC 1 | REQ-PPL-015 | UC-CMP-03, UC-CMP-07, UC-COM-04, UC-COM-11, UC-EVT-14, UC-INS-04 (+11) | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-CMP-01, AD-COM-01, AD-PPL-01 (+1) | Membership, TeamAssignment op:Membership.end(vali… | ACCOUNTED |
| REQ-PPL-015 AC 2 | REQ-PPL-015 | UC-CMP-03, UC-CMP-07, UC-COM-04, UC-COM-11, UC-EVT-14, UC-INS-04 (+11) | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-CMP-01, AD-COM-01, AD-PPL-01 (+1) | Membership, TeamAssignment op:Membership.end(vali… | ACCOUNTED |
| REQ-PPL-016 AC 1 | REQ-PPL-016 | UC-PPL-04, UC-PPL-16, UC-PPL-17 | BASIC_STEP | Camino básico | — | AD-PPL-01 | — | ACCOUNTED |
| REQ-PPL-016 AC 2 | REQ-PPL-016 | UC-PPL-04, UC-PPL-16, UC-PPL-17 | BASIC_STEP | Camino básico | — | AD-PPL-01 | — | ACCOUNTED |
| REQ-PPL-016 AC 3 | REQ-PPL-016 | UC-PPL-04, UC-PPL-16, UC-PPL-17 | BASIC_STEP | Camino básico | — | AD-PPL-01 | — | ACCOUNTED |
| REQ-PPL-016 AC 4 | REQ-PPL-016 | UC-PPL-04, UC-PPL-16, UC-PPL-17 | BASIC_STEP | Camino básico | — | AD-PPL-01 | — | ACCOUNTED |
| REQ-PRT-001 AC 1 | REQ-PRT-001 | UC-PRT-01 | BASIC_STEP | Camino básico | — | AD-PRT-01 | Availability op:Availability.Availability(eventId… | ACCOUNTED |
| REQ-PRT-001 AC 2 | REQ-PRT-001 | UC-PRT-01 | BASIC_STEP | Camino básico | — | AD-PRT-01 | Availability op:Availability.Availability(eventId… | ACCOUNTED |
| REQ-PRT-001 AC 3 | REQ-PRT-001 | UC-PRT-01 | BASIC_STEP | Camino básico | — | AD-PRT-01 | Availability op:Availability.Availability(eventId… | ACCOUNTED |
| REQ-PRT-002 AC 1 | REQ-PRT-002 | UC-PRT-01 | BASIC_STEP | Camino básico | — | AD-PRT-01 | Availability op:Availability.Availability(eventId… | ACCOUNTED |
| REQ-PRT-002 AC 2 | REQ-PRT-002 | UC-PRT-01 | BASIC_STEP | Camino básico | — | AD-PRT-01 | Availability op:Availability.Availability(eventId… | ACCOUNTED |
| REQ-PRT-002 AC 3 | REQ-PRT-002 | UC-PRT-01 | ALTERNATIVE | Camino alternativo | — | AD-PRT-01 | Availability op:Availability.Availability(eventId… | ACCOUNTED |
| REQ-PRT-003 AC 1 | REQ-PRT-003 | UC-EVT-04, UC-EVT-05, UC-EVT-06, UC-EVT-18, UC-PRT-01, UC-PRT-04 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-01, AD-EVT-03, AD-PRT-01 (+1) | Availability op:Availability.needsReconfirmation | ACCOUNTED |
| REQ-PRT-003 AC 2 | REQ-PRT-003 | UC-EVT-04, UC-EVT-05, UC-EVT-06, UC-EVT-18, UC-PRT-01, UC-PRT-04 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-01, AD-EVT-03, AD-PRT-01 (+1) | Availability op:Availability.needsReconfirmation | ACCOUNTED |
| REQ-PRT-003 AC 3 | REQ-PRT-003 | UC-EVT-04, UC-EVT-05, UC-EVT-06, UC-EVT-18, UC-PRT-01, UC-PRT-04 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-01, AD-EVT-03, AD-PRT-01 (+1) | Availability op:Availability.needsReconfirmation | ACCOUNTED |
| REQ-PRT-003 AC 4 | REQ-PRT-003 | UC-EVT-04, UC-EVT-05, UC-EVT-06, UC-EVT-18, UC-PRT-01, UC-PRT-04 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-01, AD-EVT-03, AD-PRT-01 (+1) | Availability op:Availability.needsReconfirmation | ACCOUNTED |
| REQ-PRT-004 AC 1 | REQ-PRT-004 | UC-EVT-05, UC-EVT-06, UC-EVT-07, UC-EVT-08, UC-PRT-01 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-03, AD-PRT-01 | Event, Availability op:Event.acceptsAvailability | ACCOUNTED |
| REQ-PRT-004 AC 2 | REQ-PRT-004 | UC-EVT-05, UC-EVT-06, UC-EVT-07, UC-EVT-08, UC-PRT-01 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-03, AD-PRT-01 | Event, Availability op:Event.acceptsAvailability | ACCOUNTED |
| REQ-PRT-004 AC 3 | REQ-PRT-004 | UC-EVT-05, UC-EVT-06, UC-EVT-07, UC-EVT-08, UC-PRT-01 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-03, AD-PRT-01 | Event, Availability op:Event.acceptsAvailability | ACCOUNTED |
| REQ-PRT-005 AC 1 | REQ-PRT-005 | UC-INS-04, UC-PRT-02, UC-PRT-03 | BASIC_STEP | Camino básico | — | AD-PRT-02 | Selection, SelectionRevision, SelectionEntry op:S… | ACCOUNTED |
| REQ-PRT-005 AC 2 | REQ-PRT-005 | UC-INS-04, UC-PRT-02, UC-PRT-03 | BASIC_STEP | Camino básico | — | AD-PRT-02 | Selection, SelectionRevision, SelectionEntry op:S… | ACCOUNTED |
| REQ-PRT-005 AC 3 | REQ-PRT-005 | UC-INS-04, UC-PRT-02, UC-PRT-03 | ALTERNATIVE | Camino alternativo | — | AD-PRT-02 | Selection, SelectionRevision, SelectionEntry op:S… | ACCOUNTED |
| REQ-PRT-005 AC 4 | REQ-PRT-005 | UC-INS-04, UC-PRT-02, UC-PRT-03 | BASIC_STEP | Camino básico | — | AD-PRT-02 | Selection, SelectionRevision, SelectionEntry op:S… | ACCOUNTED |
| REQ-PRT-006 AC 1 | REQ-PRT-006 | UC-PRT-03, UC-PRT-04 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-PRT-02 | SelectionRevision op:Selection.publishDraft(coach… | ACCOUNTED |
| REQ-PRT-006 AC 2 | REQ-PRT-006 | UC-PRT-03, UC-PRT-04 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-PRT-02 | SelectionRevision op:Selection.publishDraft(coach… | ACCOUNTED |
| REQ-PRT-006 AC 3 | REQ-PRT-006 | UC-PRT-03, UC-PRT-04 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-PRT-02 | SelectionRevision op:Selection.publishDraft(coach… | ACCOUNTED |
| REQ-PRT-007 AC 1 | REQ-PRT-007 | UC-EVT-18, UC-PRT-04 | BASIC_STEP | Camino básico | — | AD-PRT-02 | — | ACCOUNTED |
| REQ-PRT-007 AC 2 | REQ-PRT-007 | UC-EVT-18, UC-PRT-04 | BASIC_STEP | Camino básico | — | AD-PRT-02 | — | ACCOUNTED |
| REQ-PRT-007 AC 3 | REQ-PRT-007 | UC-EVT-18, UC-PRT-04 | BASIC_STEP | Camino básico | — | AD-PRT-02 | — | ACCOUNTED |
| REQ-PRT-008 AC 1 | REQ-PRT-008 | UC-PRT-02, UC-PRT-03 | CROSS_CUTTING | Transversal (CROSS_CUTTING — respetada por la ficha sin pas… | — | AD-PRT-02 | Selection, SelectionRevision op:Selection.getOrCr… | ACCOUNTED |
| REQ-PRT-008 AC 2 | REQ-PRT-008 | UC-PRT-02, UC-PRT-03 | CROSS_CUTTING | Transversal (CROSS_CUTTING — respetada por la ficha sin pas… | — | AD-PRT-02 | Selection, SelectionRevision op:Selection.getOrCr… | ACCOUNTED |
| REQ-PRT-008 AC 3 | REQ-PRT-008 | UC-PRT-02, UC-PRT-03 | CROSS_CUTTING | Transversal (CROSS_CUTTING — respetada por la ficha sin pas… | — | AD-PRT-02 | Selection, SelectionRevision op:Selection.getOrCr… | ACCOUNTED |
| REQ-PRT-008 AC 4 | REQ-PRT-008 | UC-PRT-02, UC-PRT-03 | CROSS_CUTTING | Transversal (CROSS_CUTTING — respetada por la ficha sin pas… | — | AD-PRT-02 | Selection, SelectionRevision op:Selection.getOrCr… | ACCOUNTED |
| REQ-PRT-009 AC 1 | REQ-PRT-009 | UC-PRT-05, UC-PRT-06 | BASIC_STEP | Camino básico | — | AD-PRT-03 | AttendanceSheet, AttendanceEntry op:AttendanceEnt… | ACCOUNTED |
| REQ-PRT-009 AC 2 | REQ-PRT-009 | UC-PRT-05, UC-PRT-06 | BASIC_STEP | Camino básico | — | AD-PRT-03 | AttendanceSheet, AttendanceEntry op:AttendanceEnt… | ACCOUNTED |
| REQ-PRT-009 AC 3 | REQ-PRT-009 | UC-PRT-05, UC-PRT-06 | BASIC_STEP | Camino básico | — | AD-PRT-03 | AttendanceSheet, AttendanceEntry op:AttendanceEnt… | ACCOUNTED |
| REQ-PRT-009 AC 4 | REQ-PRT-009 | UC-PRT-05, UC-PRT-06 | ALTERNATIVE | Camino alternativo | — | AD-PRT-03 | AttendanceSheet, AttendanceEntry op:AttendanceEnt… | ACCOUNTED |
| REQ-PRT-010 AC 1 | REQ-PRT-010 | UC-INS-02, UC-PRT-05 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-PRT-03 | AttendanceSheet, AttendanceEntry op:AttendanceShe… | ACCOUNTED |
| REQ-PRT-010 AC 2 | REQ-PRT-010 | UC-INS-02, UC-PRT-05 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-PRT-03 | AttendanceSheet, AttendanceEntry op:AttendanceShe… | ACCOUNTED |
| REQ-PRT-010 AC 3 | REQ-PRT-010 | UC-INS-02, UC-PRT-05 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-PRT-03 | AttendanceSheet, AttendanceEntry op:AttendanceShe… | ACCOUNTED |
| REQ-PRT-011 AC 1 | REQ-PRT-011 | UC-EVT-09, UC-PRT-06 | ALTERNATIVE | Camino alternativo | — | AD-PRT-04, AD-PRT-03 | AttendanceSheet op:AttendanceSheet.close(coachPer… | ACCOUNTED |
| REQ-PRT-011 AC 2 | REQ-PRT-011 | UC-EVT-09, UC-PRT-06 | BASIC_STEP | Camino básico | — | AD-PRT-04, AD-PRT-03 | AttendanceSheet op:AttendanceSheet.close(coachPer… | ACCOUNTED |
| REQ-PRT-012 AC 1 | REQ-PRT-012 | UC-INS-02, UC-PRT-06, UC-PRT-07 | BASIC_STEP | Camino básico | — | AD-PRT-03 | AttendanceEntry op:AttendanceEntry.correct(newVal… | ACCOUNTED |
| REQ-PRT-012 AC 2 | REQ-PRT-012 | UC-INS-02, UC-PRT-06, UC-PRT-07 | BASIC_STEP | Camino básico | — | AD-PRT-03 | AttendanceEntry op:AttendanceEntry.correct(newVal… | ACCOUNTED |
| REQ-PRT-012 AC 3 | REQ-PRT-012 | UC-INS-02, UC-PRT-06, UC-PRT-07 | BASIC_STEP | Camino básico | — | AD-PRT-03 | AttendanceEntry op:AttendanceEntry.correct(newVal… | ACCOUNTED |
| REQ-PRT-013 AC 1 | REQ-PRT-013 | UC-EVT-09, UC-INS-03, UC-PRT-08, UC-PRT-09, UC-PRT-10 | BASIC_STEP | Camino básico | — | AD-PRT-04 | MatchRecord op:MatchRecord.MatchRecord(matchId), … | ACCOUNTED |
| REQ-PRT-013 AC 2 | REQ-PRT-013 | UC-EVT-09, UC-INS-03, UC-PRT-08, UC-PRT-09, UC-PRT-10 | ALTERNATIVE | Camino alternativo | — | AD-PRT-04 | MatchRecord op:MatchRecord.MatchRecord(matchId), … | ACCOUNTED |
| REQ-PRT-013 AC 3 | REQ-PRT-013 | UC-EVT-09, UC-INS-03, UC-PRT-08, UC-PRT-09, UC-PRT-10 | ALTERNATIVE | Camino alternativo | — | AD-PRT-04 | MatchRecord op:MatchRecord.MatchRecord(matchId), … | ACCOUNTED |
| REQ-PRT-014 AC 1 | REQ-PRT-014 | UC-INS-03, UC-PRT-09, UC-PRT-10 | BASIC_STEP | Camino básico | — | AD-PRT-04 | MatchRecord op:MatchRecord.correct(resultType, ho… | ACCOUNTED |
| REQ-PRT-014 AC 2 | REQ-PRT-014 | UC-INS-03, UC-PRT-09, UC-PRT-10 | BASIC_STEP | Camino básico | — | AD-PRT-04 | MatchRecord op:MatchRecord.correct(resultType, ho… | ACCOUNTED |
| REQ-PRT-015 AC 1 | REQ-PRT-015 | UC-EVT-09, UC-EVT-10, UC-PRT-08, UC-PRT-09, UC-PRT-11 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-PRT-04 | MatchRecord op:MatchRecord.finalize(coachPersonId… | ACCOUNTED |
| REQ-PRT-015 AC 2 | REQ-PRT-015 | UC-EVT-09, UC-EVT-10, UC-PRT-08, UC-PRT-09, UC-PRT-11 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-PRT-04 | MatchRecord op:MatchRecord.finalize(coachPersonId… | ACCOUNTED |
| REQ-PRT-015 AC 3 | REQ-PRT-015 | UC-EVT-09, UC-EVT-10, UC-PRT-08, UC-PRT-09, UC-PRT-11 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-PRT-04 | MatchRecord op:MatchRecord.finalize(coachPersonId… | ACCOUNTED |
| REQ-PRT-016 AC 1 | REQ-PRT-016 | UC-EVT-10, UC-INS-03, UC-PRT-08, UC-PRT-09, UC-PRT-11 | BASIC_STEP | Camino básico | — | AD-PRT-04 | PlayerMatchStats op:MatchRecord.addPlayerStats(pe… | ACCOUNTED |
| REQ-PRT-016 AC 2 | REQ-PRT-016 | UC-EVT-10, UC-INS-03, UC-PRT-08, UC-PRT-09, UC-PRT-11 | BASIC_STEP | Camino básico | — | AD-PRT-04 | PlayerMatchStats op:MatchRecord.addPlayerStats(pe… | ACCOUNTED |
| REQ-PRT-016 AC 3 | REQ-PRT-016 | UC-EVT-10, UC-INS-03, UC-PRT-08, UC-PRT-09, UC-PRT-11 | BASIC_STEP | Camino básico | — | AD-PRT-04 | PlayerMatchStats op:MatchRecord.addPlayerStats(pe… | ACCOUNTED |
| REQ-PRT-017 AC 1 | REQ-PRT-017 | UC-PRT-04, UC-PRT-12, UC-PRT-13 | BASIC_STEP | Camino básico | — | AD-PRT-02 | EligibilityConstraint op:EligibilityConstraint.de… | ACCOUNTED |
| REQ-PRT-017 AC 2 | REQ-PRT-017 | UC-PRT-04, UC-PRT-12, UC-PRT-13 | BASIC_STEP | Camino básico | — | AD-PRT-02 | EligibilityConstraint op:EligibilityConstraint.de… | ACCOUNTED |
| REQ-PRT-017 AC 3 | REQ-PRT-017 | UC-PRT-04, UC-PRT-12, UC-PRT-13 | BASIC_STEP | Camino básico | — | AD-PRT-02 | EligibilityConstraint op:EligibilityConstraint.de… | ACCOUNTED |
| REQ-PRT-017 AC 4 | REQ-PRT-017 | UC-PRT-04, UC-PRT-12, UC-PRT-13 | BASIC_STEP | Camino básico | — | AD-PRT-02 | EligibilityConstraint op:EligibilityConstraint.de… | ACCOUNTED |
| REQ-PRT-017 AC 5 | REQ-PRT-017 | UC-PRT-04, UC-PRT-12, UC-PRT-13 | BASIC_STEP | Camino básico | — | AD-PRT-02 | EligibilityConstraint op:EligibilityConstraint.de… | ACCOUNTED |
| REQ-PRT-018 AC 1 | REQ-PRT-018 | UC-PRT-01, UC-PRT-04, UC-PRT-13 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-PRT-01, AD-PRT-02 | — | ACCOUNTED |
| REQ-PRT-018 AC 2 | REQ-PRT-018 | UC-PRT-01, UC-PRT-04, UC-PRT-13 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-PRT-01, AD-PRT-02 | — | ACCOUNTED |
| REQ-PRT-018 AC 3 | REQ-PRT-018 | UC-PRT-01, UC-PRT-04, UC-PRT-13 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-PRT-01, AD-PRT-02 | — | ACCOUNTED |
| REQ-PRT-019 AC 1 | REQ-PRT-019 | UC-PRT-01, UC-PRT-05, UC-PRT-08 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-PRT-01, AD-PRT-03, AD-PRT-04 | — | ACCOUNTED |
| REQ-PRT-019 AC 2 | REQ-PRT-019 | UC-PRT-01, UC-PRT-05, UC-PRT-08 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-PRT-01, AD-PRT-03, AD-PRT-04 | — | ACCOUNTED |
| REQ-PRT-019 AC 3 | REQ-PRT-019 | UC-PRT-01, UC-PRT-05, UC-PRT-08 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-PRT-01, AD-PRT-03, AD-PRT-04 | — | ACCOUNTED |
| REQ-STR-001 AC 1 | REQ-STR-001 | UC-STR-01, UC-STR-02 | BASIC_STEP | Camino básico | — | — | Season op:Season.Season(name, startDate, endDate)… | ACCOUNTED |
| REQ-STR-001 AC 2 | REQ-STR-001 | UC-STR-01, UC-STR-02 | BASIC_STEP | Camino básico | — | — | Season op:Season.Season(name, startDate, endDate)… | ACCOUNTED |
| REQ-STR-001 AC 3 | REQ-STR-001 | UC-STR-01, UC-STR-02 | BASIC_STEP | Camino básico | — | — | Season op:Season.Season(name, startDate, endDate)… | ACCOUNTED |
| REQ-STR-002 AC 1 | REQ-STR-002 | UC-STR-03, UC-STR-04, UC-STR-05 | BASIC_STEP | Camino básico | — | — | Division op:Division.archive(), Division.Division… | ACCOUNTED |
| REQ-STR-002 AC 2 | REQ-STR-002 | UC-STR-03, UC-STR-04, UC-STR-05 | ALTERNATIVE | Camino alternativo | — | — | Division op:Division.archive(), Division.Division… | ACCOUNTED |
| REQ-STR-002 AC 3 | REQ-STR-002 | UC-STR-03, UC-STR-04, UC-STR-05 | BASIC_STEP | Camino básico | — | — | Division op:Division.archive(), Division.Division… | ACCOUNTED |
| REQ-STR-003 AC 1 | REQ-STR-003 | UC-STR-06, UC-STR-07, UC-STR-08 | BASIC_STEP | Camino básico | — | — | Line op:Line.archive(), Line.Line(divisionId, nam… | ACCOUNTED |
| REQ-STR-003 AC 2 | REQ-STR-003 | UC-STR-06, UC-STR-07, UC-STR-08 | ALTERNATIVE | Camino alternativo | — | — | Line op:Line.archive(), Line.Line(divisionId, nam… | ACCOUNTED |
| REQ-STR-003 AC 3 | REQ-STR-003 | UC-STR-06, UC-STR-07, UC-STR-08 | BASIC_STEP | Camino básico | — | — | Line op:Line.archive(), Line.Line(divisionId, nam… | ACCOUNTED |
| REQ-STR-004 AC 1 | REQ-STR-004 | UC-PPL-06, UC-STR-09, UC-STR-10, UC-STR-11, UC-STR-12 | BASIC_STEP | Camino básico | — | AD-PPL-02 | Team op:Team.activate(), Team.archive(), Team.Tea… | ACCOUNTED |
| REQ-STR-004 AC 2 | REQ-STR-004 | UC-PPL-06, UC-STR-09, UC-STR-10, UC-STR-11, UC-STR-12 | ALTERNATIVE | Camino alternativo | — | AD-PPL-02 | Team op:Team.activate(), Team.archive(), Team.Tea… | ACCOUNTED |
| REQ-STR-004 AC 3 | REQ-STR-004 | UC-PPL-06, UC-STR-09, UC-STR-10, UC-STR-11, UC-STR-12 | ALTERNATIVE | Camino alternativo | — | AD-PPL-02 | Team op:Team.activate(), Team.archive(), Team.Tea… | ACCOUNTED |
| REQ-STR-004 AC 4 | REQ-STR-004 | UC-PPL-06, UC-STR-09, UC-STR-10, UC-STR-11, UC-STR-12 | BASIC_STEP | Camino básico | — | AD-PPL-02 | Team op:Team.activate(), Team.archive(), Team.Tea… | ACCOUNTED |
| REQ-STR-005 AC 1 | REQ-STR-005 | UC-STR-13, UC-STR-14, UC-STR-15 | BASIC_STEP | Camino básico | — | — | Venue op:Venue.archive(), Venue.Venue(name, addre… | ACCOUNTED |
| REQ-STR-005 AC 2 | REQ-STR-005 | UC-STR-13, UC-STR-14, UC-STR-15 | BASIC_STEP | Camino básico | — | — | Venue op:Venue.archive(), Venue.Venue(name, addre… | ACCOUNTED |
| REQ-STR-005 AC 3 | REQ-STR-005 | UC-STR-13, UC-STR-14, UC-STR-15 | BASIC_STEP | Camino básico | — | — | Venue op:Venue.archive(), Venue.Venue(name, addre… | ACCOUNTED |
| REQ-STR-006 AC 1 | REQ-STR-006 | UC-STR-05, UC-STR-08, UC-STR-12, UC-STR-15 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | Division, Line, Team (+1) op:Division.archive(), … | ACCOUNTED |
| REQ-STR-006 AC 2 | REQ-STR-006 | UC-STR-05, UC-STR-08, UC-STR-12, UC-STR-15 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | Division, Line, Team (+1) op:Division.archive(), … | ACCOUNTED |
| REQ-STR-007 AC 1 | REQ-STR-007 | UC-EVT-17, UC-EVT-19 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | ACCOUNTED |
| REQ-STR-008 AC 1 | REQ-STR-008 | UC-STR-01, UC-STR-02, UC-STR-03, UC-STR-04, UC-STR-05, UC-STR-06 (+9) | BASIC_STEP | Camino básico | — | — | — | ACCOUNTED |
| REQ-STR-008 AC 2 | REQ-STR-008 | UC-STR-01, UC-STR-02, UC-STR-03, UC-STR-04, UC-STR-05, UC-STR-06 (+9) | ALTERNATIVE | Camino alternativo | — | — | — | ACCOUNTED |
| REQ-STR-009 AC 1 | REQ-STR-009 | — | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | TRANSVERSAL |
| REQ-STR-009 AC 2 | REQ-STR-009 | — | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | TRANSVERSAL |
| REQ-STR-010 AC 1 | REQ-STR-010 | UC-CMP-04, UC-CMP-05, UC-EVT-19, UC-INS-01, UC-PPL-16, UC-STR-04 (+2) | CROSS_CUTTING | Transversal (CROSS_CUTTING — respetada por la ficha sin pas… | — | AD-CMP-01 | Line op:Line.getFullLabel(season) | ACCOUNTED |
| REQ-STR-010 AC 2 | REQ-STR-010 | UC-CMP-04, UC-CMP-05, UC-EVT-19, UC-INS-01, UC-PPL-16, UC-STR-04 (+2) | CROSS_CUTTING | Transversal (CROSS_CUTTING — respetada por la ficha sin pas… | — | AD-CMP-01 | Line op:Line.getFullLabel(season) | ACCOUNTED |
| REQ-STR-011 AC 1 | REQ-STR-011 | UC-EVT-04, UC-STR-01, UC-STR-02, UC-STR-04, UC-STR-06, UC-STR-07 (+2) | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-01 | Team, Venue op:Venue.correctMetadata(name?, addre… | ACCOUNTED |
| REQ-STR-011 AC 2 | REQ-STR-011 | UC-EVT-04, UC-STR-01, UC-STR-02, UC-STR-04, UC-STR-06, UC-STR-07 (+2) | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-01 | Team, Venue op:Venue.correctMetadata(name?, addre… | ACCOUNTED |
| REQ-STR-012 AC 1 | REQ-STR-012 | UC-EVT-01, UC-EVT-04, UC-EVT-16, UC-EVT-19, UC-STR-14 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-02, AD-EVT-01 | Venue op:Venue.correctMetadata(name?, address?, f… | ACCOUNTED |
| REQ-STR-012 AC 2 | REQ-STR-012 | UC-EVT-01, UC-EVT-04, UC-EVT-16, UC-EVT-19, UC-STR-14 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-02, AD-EVT-01 | Venue op:Venue.correctMetadata(name?, address?, f… | ACCOUNTED |
| REQ-STR-013 AC 1 | REQ-STR-013 | UC-COM-01, UC-EVT-01, UC-EVT-02, UC-EVT-03, UC-STR-09, UC-STR-13 | CROSS_CUTTING | Transversal (CROSS_CUTTING — respetada por la ficha sin pas… | — | AD-COM-01, AD-EVT-02 | — | ACCOUNTED |
| REQ-SYS-001 AC 1 | REQ-SYS-001 | — | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | TRANSVERSAL |
| REQ-SYS-001 AC 2 | REQ-SYS-001 | — | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | TRANSVERSAL |
| REQ-SYS-001 AC 3 | REQ-SYS-001 | — | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | TRANSVERSAL |
| REQ-SYS-001 AC 4 | REQ-SYS-001 | — | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | TRANSVERSAL |
| REQ-SYS-002 AC 1 | REQ-SYS-002 | — | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | TRANSVERSAL |
| REQ-SYS-002 AC 2 | REQ-SYS-002 | — | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | TRANSVERSAL |
| REQ-SYS-003 AC 1 | REQ-SYS-003 | — | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | TRANSVERSAL |
| REQ-SYS-003 AC 2 | REQ-SYS-003 | — | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | TRANSVERSAL |
| REQ-SYS-003 AC 3 | REQ-SYS-003 | — | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | TRANSVERSAL |
| REQ-SYS-003 AC 4 | REQ-SYS-003 | — | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | TRANSVERSAL |
| REQ-SYS-004 AC 1 | REQ-SYS-004 | — | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | TRANSVERSAL |
| REQ-SYS-004 AC 2 | REQ-SYS-004 | — | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | TRANSVERSAL |
| REQ-SYS-005 AC 1 | REQ-SYS-005 | — | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | TRANSVERSAL |
| REQ-SYS-005 AC 2 | REQ-SYS-005 | — | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | TRANSVERSAL |
| REQ-SYS-005 AC 3 | REQ-SYS-005 | — | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | TRANSVERSAL |
| REQ-SYS-006 AC 1 | REQ-SYS-006 | UC-COM-03, UC-PRT-07, UC-PRT-10 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-COM-01, AD-PRT-03, AD-PRT-04 | — | ACCOUNTED |
| REQ-SYS-006 AC 2 | REQ-SYS-006 | UC-COM-03, UC-PRT-07, UC-PRT-10 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-COM-01, AD-PRT-03, AD-PRT-04 | — | ACCOUNTED |
| REQ-SYS-006 AC 3 | REQ-SYS-006 | UC-COM-03, UC-PRT-07, UC-PRT-10 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-COM-01, AD-PRT-03, AD-PRT-04 | — | ACCOUNTED |
| REQ-SYS-007 AC 1 | REQ-SYS-007 | UC-COM-01, UC-COM-11, UC-EVT-18 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-COM-01 | — | ACCOUNTED |
| REQ-SYS-007 AC 2 | REQ-SYS-007 | UC-COM-01, UC-COM-11, UC-EVT-18 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-COM-01 | — | ACCOUNTED |
| REQ-SYS-007 AC 3 | REQ-SYS-007 | UC-COM-01, UC-COM-11, UC-EVT-18 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-COM-01 | — | ACCOUNTED |
| REQ-SYS-008 AC 1 | REQ-SYS-008 | — | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | TRANSVERSAL |
| REQ-SYS-008 AC 2 | REQ-SYS-008 | — | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | TRANSVERSAL |
| REQ-SYS-009 AC 1 | REQ-SYS-009 | UC-EVT-11, UC-IAM-06 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-01 | — | ACCOUNTED |
| REQ-SYS-009 AC 2 | REQ-SYS-009 | UC-EVT-11, UC-IAM-06 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-01 | — | ACCOUNTED |
| REQ-SYS-009 AC 3 | REQ-SYS-009 | UC-EVT-11, UC-IAM-06 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-01 | — | ACCOUNTED |
| REQ-SYS-010 AC 1 | REQ-SYS-010 | UC-EVT-12, UC-IAM-10, UC-PPL-15, UC-PPL-17 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-01 | — | ACCOUNTED |
| REQ-SYS-010 AC 2 | REQ-SYS-010 | UC-EVT-12, UC-IAM-10, UC-PPL-15, UC-PPL-17 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-01 | — | ACCOUNTED |
| REQ-SYS-010 AC 3 | REQ-SYS-010 | UC-EVT-12, UC-IAM-10, UC-PPL-15, UC-PPL-17 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-01 | — | ACCOUNTED |
| REQ-SYS-011 AC 1 | REQ-SYS-011 | UC-EVT-18, UC-INS-01, UC-INS-02 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | ACCOUNTED |
| REQ-SYS-011 AC 2 | REQ-SYS-011 | UC-EVT-18, UC-INS-01, UC-INS-02 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | ACCOUNTED |
| REQ-SYS-011 AC 3 | REQ-SYS-011 | UC-EVT-18, UC-INS-01, UC-INS-02 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | ACCOUNTED |
| REQ-SYS-011 AC 4 | REQ-SYS-011 | UC-EVT-18, UC-INS-01, UC-INS-02 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | ACCOUNTED |
| REQ-SYS-012 AC 1 | REQ-SYS-012 | UC-COM-05, UC-EVT-17 | CROSS_CUTTING | Transversal (CROSS_CUTTING — respetada por la ficha sin pas… | — | — | — | ACCOUNTED |
| REQ-SYS-012 AC 2 | REQ-SYS-012 | UC-COM-05, UC-EVT-17 | CROSS_CUTTING | Transversal (CROSS_CUTTING — respetada por la ficha sin pas… | — | — | — | ACCOUNTED |
| REQ-SYS-012 AC 3 | REQ-SYS-012 | UC-COM-05, UC-EVT-17 | CROSS_CUTTING | Transversal (CROSS_CUTTING — respetada por la ficha sin pas… | — | — | — | ACCOUNTED |
| REQ-SYS-013 AC 1 | REQ-SYS-013 | UC-COM-13, UC-COM-14, UC-EVT-17, UC-INS-01 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | ACCOUNTED |
| REQ-SYS-013 AC 2 | REQ-SYS-013 | UC-COM-13, UC-COM-14, UC-EVT-17, UC-INS-01 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | ACCOUNTED |
| REQ-SYS-013 AC 3 | REQ-SYS-013 | UC-COM-13, UC-COM-14, UC-EVT-17, UC-INS-01 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | ACCOUNTED |
| REQ-SYS-014 AC 1 | REQ-SYS-014 | UC-EVT-17, UC-EVT-18, UC-EVT-19 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | ACCOUNTED |
| REQ-SYS-014 AC 2 | REQ-SYS-014 | UC-EVT-17, UC-EVT-18, UC-EVT-19 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | ACCOUNTED |
| REQ-SYS-014 AC 3 | REQ-SYS-014 | UC-EVT-17, UC-EVT-18, UC-EVT-19 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | ACCOUNTED |
| REQ-SYS-015 AC 1 | REQ-SYS-015 | UC-CMP-09, UC-COM-13, UC-EVT-11 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-01 | — | ACCOUNTED |
| REQ-SYS-015 AC 2 | REQ-SYS-015 | UC-CMP-09, UC-COM-13, UC-EVT-11 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-01 | — | ACCOUNTED |
| REQ-SYS-015 AC 3 | REQ-SYS-015 | UC-CMP-09, UC-COM-13, UC-EVT-11 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-01 | — | ACCOUNTED |
| REQ-SYS-016 AC 1 | REQ-SYS-016 | UC-COM-09, UC-IAM-10 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | ACCOUNTED |
| REQ-SYS-016 AC 2 | REQ-SYS-016 | UC-COM-09, UC-IAM-10 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | ACCOUNTED |
| REQ-SYS-016 AC 3 | REQ-SYS-016 | UC-COM-09, UC-IAM-10 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | ACCOUNTED |
| REQ-SYS-017 AC 1 | REQ-SYS-017 | UC-EVT-04, UC-EVT-12 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-01 | — | ACCOUNTED |
| REQ-SYS-017 AC 2 | REQ-SYS-017 | UC-EVT-04, UC-EVT-12 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-EVT-01 | — | ACCOUNTED |
| REQ-SYS-018 AC 1 | REQ-SYS-018 | UC-CMP-07, UC-EVT-01, UC-EVT-02, UC-EVT-03, UC-EVT-15, UC-PPL-06 (+2) | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-CMP-01, AD-EVT-02, AD-EVT-04 (+2) | — | ACCOUNTED |
| REQ-SYS-018 AC 2 | REQ-SYS-018 | UC-CMP-07, UC-EVT-01, UC-EVT-02, UC-EVT-03, UC-EVT-15, UC-PPL-06 (+2) | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | AD-CMP-01, AD-EVT-02, AD-EVT-04 (+2) | — | ACCOUNTED |
| REQ-SYS-019 AC 1 | REQ-SYS-019 | UC-EVT-17, UC-EVT-18, UC-INS-01 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | ACCOUNTED |
| REQ-SYS-019 AC 2 | REQ-SYS-019 | UC-EVT-17, UC-EVT-18, UC-INS-01 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | ACCOUNTED |
| REQ-SYS-020 AC 1 | REQ-SYS-020 | UC-INS-05 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | ACCOUNTED |
| REQ-SYS-020 AC 2 | REQ-SYS-020 | UC-INS-05 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | ACCOUNTED |
| REQ-SYS-021 AC 1 | REQ-SYS-021 | — | NOT_APPLICABLE_WITH_REASON | NOT_APPLICABLE_WITH_REASON (sin representación en ficha) | — | — | — | N_A_JUSTIFIED |
| REQ-SYS-021 AC 2 | REQ-SYS-021 | — | NOT_APPLICABLE_WITH_REASON | NOT_APPLICABLE_WITH_REASON (sin representación en ficha) | — | — | — | N_A_JUSTIFIED |
| REQ-SYS-021 AC 3 | REQ-SYS-021 | — | NOT_APPLICABLE_WITH_REASON | NOT_APPLICABLE_WITH_REASON (sin representación en ficha) | — | — | — | N_A_JUSTIFIED |
| REQ-SYS-022 AC 1 | REQ-SYS-022 | — | NOT_APPLICABLE_WITH_REASON | NOT_APPLICABLE_WITH_REASON (sin representación en ficha) | — | — | — | N_A_JUSTIFIED |
| REQ-SYS-022 AC 2 | REQ-SYS-022 | — | NOT_APPLICABLE_WITH_REASON | NOT_APPLICABLE_WITH_REASON (sin representación en ficha) | — | — | — | N_A_JUSTIFIED |
| REQ-SYS-022 AC 3 | REQ-SYS-022 | — | NOT_APPLICABLE_WITH_REASON | NOT_APPLICABLE_WITH_REASON (sin representación en ficha) | — | — | — | N_A_JUSTIFIED |
| REQ-SYS-023 AC 1 | REQ-SYS-023 | UC-EVT-17, UC-INS-01 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | ACCOUNTED |
| REQ-SYS-023 AC 2 | REQ-SYS-023 | UC-EVT-17, UC-INS-01 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | ACCOUNTED |
| REQ-SYS-024 AC 1 | REQ-SYS-024 | UC-COM-13 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | ACCOUNTED |
| REQ-SYS-024 AC 2 | REQ-SYS-024 | UC-COM-13 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | ACCOUNTED |
| REQ-SYS-025 AC 1 | REQ-SYS-025 | UC-COM-13 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | ACCOUNTED |
| REQ-SYS-025 AC 2 | REQ-SYS-025 | UC-COM-13 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | ACCOUNTED |
| REQ-SYS-025 AC 3 | REQ-SYS-025 | UC-COM-13 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | ACCOUNTED |
| REQ-SYS-025 AC 4 | REQ-SYS-025 | UC-COM-13 | BUSINESS_RULE | TRAZABILIDAD INTERNA GEI · Business rules (bloque de trazab… | — | — | — | ACCOUNTED |
| REQ-SYS-026 AC 1 | REQ-SYS-026 | — | NOT_APPLICABLE_WITH_REASON | NOT_APPLICABLE_WITH_REASON (sin representación en ficha) | — | — | — | N_A_JUSTIFIED |
| REQ-SYS-026 AC 2 | REQ-SYS-026 | — | NOT_APPLICABLE_WITH_REASON | NOT_APPLICABLE_WITH_REASON (sin representación en ficha) | — | — | — | N_A_JUSTIFIED |
| REQ-SYS-027 AC 1 | REQ-SYS-027 | — | NOT_APPLICABLE_WITH_REASON | NOT_APPLICABLE_WITH_REASON (sin representación en ficha) | — | — | — | N_A_JUSTIFIED |
| REQ-SYS-027 AC 2 | REQ-SYS-027 | — | NOT_APPLICABLE_WITH_REASON | NOT_APPLICABLE_WITH_REASON (sin representación en ficha) | — | — | — | N_A_JUSTIFIED |

## Limitaciones y equivalencias registradas (heredadas de E5)

1. **SPEC-FEEDBACK-02 (E5):** 13 REQ tienen CU mapeados sólo por matriz E3 (§3) sin fila de ficha E5 §2: REQ-SYS-025→UC-COM-13, REQ-PRT-005→UC-INS-04, REQ-SYS-023→UC-EVT-17, REQ-SYS-018→UC-EVT-02/03/UC-PPL-06, REQ-SYS-014→UC-EVT-18/19, REQ-COM-003→UC-COM-05, REQ-PRT-003→UC-PRT-04, REQ-EVT-017→UC-PRT-08, REQ-STR-008→UC-STR-04/07, REQ-STR-010→UC-PPL-16, REQ-STR-013→UC-EVT-02, REQ-IAM-013→UC-IAM-09, REQ-PPL-012→UC-COM-06. Sus AC aplican a esos CU con evidencia de matriz; la atribución NO es falsa, es de segundo orden.
2. **14 REQ transversales sin ficha individual** (AC con CU=— y razón): REQ-IAM-007/017/018, REQ-STR-009, REQ-SYS-001–005/008/021/022/026/027. Registrados como reglas internas en bloques de trazabilidad de las fichas aplicables (evidencia E5 §4).
3. **AC↔paso:** E5 no registra mapeo AC→paso numerado; la representación es a nivel de sección (BASIC_STEP→camino básico, ALTERNATIVE→camino alternativo, BUSINESS_RULE→bloque de trazabilidad, CROSS_CUTTING→transversal). Registrado como limitación, no como hueco.
4. **0 AC desconocidos · 0 AC aplicables sin representación · 0 atribuciones falsas:** verificado por `validate_traceability.mjs` (UNACCOUNTED_APPLICABLE_AC=0, UNKNOWN_AC=0). Los pares AC→CU de matriz-only (punto 1) se marcan en el ledger con evidencia "E5 §2∪§3".