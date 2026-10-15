# GEI Actor Model Freeze V1.1

| Actor | Name | Boundary |
| --- | --- | --- |
| ACT-UNAUTHENTICATED | Persona no autenticada | Persona externa que interactúa con GEI sin sesión; puede autenticarse o consumir un código de un solo uso; sin fuente de autoridad de dominio. |
| ACT-AUTHENTICATED | Persona autenticada | Actor abstracto no instanciable: capacidad común de toda persona con Account ACTIVE y sesión vigente; no concede acceso a la aplicación por sí solo. |
| ACT-PLAYER | Jugadora | Persona con RoleAssignment PLAYER vigente sobre un equipo dentro de Membership vigente; responde su propia disponibilidad. |
| ACT-CAPTAIN | Capitana | Persona con RoleAssignment CAPTAIN vigente; actor independiente con autoridad propia sobre la logística de su equipo (scope TEAM). |
| ACT-COACH | Entrenador/a | Persona con RoleAssignment COACH vigente (scope TEAM o EVENT); autoridad deportiva sobre eventos, convocatoria, asistencia y resultado. |
| ACT-SUBCOMMITTEE | Subcomisión de hockey | Persona con RoleAssignment SUBCOMMITTEE vigente (scope CLUB); autoridad oficial: comunicados, competencias. |
| ACT-ADMIN | Administración del club | Persona con RoleAssignment ADMIN vigente (scope CLUB); autoridad administrativa sobre identidad, cuentas, estructura y auditoría; sin autoridad deportiva. |

Exactly seven actors are active. ACT-AUTHENTICATED is abstract. Effective roles are PLAYER, CAPTAIN, COACH, SUBCOMMITTEE and ADMIN.
