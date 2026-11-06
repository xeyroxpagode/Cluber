# STAFF — GEI CURRENT UX ATLAS

## NOT PRESENT IN CURRENT — no hay superficie de «cuerpo técnico» en el producto actual

El modelo de dominio no tiene una entidad de staff. `src/mock/model.ts` define
`Person`, `RoleAssignment`, `TeamAssignment` y `Membership`; el rol `COACH`
es una **asignación de rol con alcance de equipo**, no un registro de cuerpo
técnico:

```ts
// src/mock/seed.ts — el entrenador es una persona más del club
{
  id: "coach",
  name: "Tomás Beltrán",
  roleAssignments: [
    { id: "coach-sexta", role: "COACH", scope: "TEAM", target: "sexta", … },
    { id: "coach-septima", role: "COACH", scope: "TEAM", target: "septima", … },
  ],
}
```

No hay ruta `/staff`, ni tab de staff en el detalle de equipo, ni sección de
staff en la ficha de persona.

## Dónde se ve el rol de entrenador, entonces

| Superficie | Cómo aparece |
| --- | --- |
| `EQ_TEAM_DETAIL_002_PERSONAS` | El entrenador aparece como persona más del equipo, con su rol y alcance en el detalle de la fila («Entrenador · Sexta A») |
| `EQ_PERSON_001_DETAIL_COACH` | La ficha pública de una persona lista sus roles; para el entrenador, «Entrenador · Sexta A» |
| `MGT_PERSON_004_ROLES` | La sección «Roles y alcance» de la ficha administrativa |
| `CAL_EVENT_DETAIL_001_SCHEDULED_COACH` | El panel «Operación pendiente» existe porque el actor `isCoachOfTeam` |
| `PRT_SELECTION_001_PUBLISHED` | La pantalla de convocatoria exige `canManageSelection`, que se cumple con rol COACH de equipo |
| `PRT_ATTENDANCE_001_OPEN` | La planilla exige `canManageAttendance` (rol COACH) |
| `PRT_MATCH_RECORD_002_EDITABLE` | El acta exige `canManageRecord` (rol COACH **y** evento MATCH) |

## Consecuencia observable

Las decisiones de la interfaz que differentiate al entrenador de la jugadora o
de la Subcomisión (botones de gestión, planillas, actas, convocatoria) se
derivan de `authority.isCoachOfTeam(teamId)` y de `coachTeamIds`, no de una
entidad de staff consultable. El único listado de entrenadores del producto
es la pestaña «Personas» del detalle de equipo, donde conviven con las
jugadoras.
