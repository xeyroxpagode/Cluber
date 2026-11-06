# Surface GBL_NAV_006_SCROLL_02

Domain: Global
Subdomain: Navigation

Route: /home

Actor(s): ADMIN

VIEWPORT STATUS:

390×844:
N/A — CURRENT does not render this surface at this viewport

reason:
La superficie documenta el scroll propio de la columna de destinos de escritorio (overflow-y:auto con altura limitada, src/app/Shell.tsx:185). A 390 px no existe esa columna, por lo que la superficie no existe.

current behavior:
Runtime verificado a 390×844: sidebar display=none, scrollHeight=0, clientHeight=0. El scroll del documento sí existe en mobile, pero es una composición distinta (no la barra lateral) y ya está documentada por las superficies de scroll de HOME.

alternate surface/route if applicable:
HOME_006_SCROLL_02 — scroll de /home en 1440×900.

1440×900:
CAPTURED — `GBL_NAV_006_SCROLL_02__ADMIN__1440x900.png`


Current state: AUTHENTICATED · página desplazada 900 px

Journey(s): Home → Event → Availability → response

Entry path: /home

Visible sections: See surface-map-legacy.md or source component.

Primary action: Navigation to route destination.

Secondary actions: Context-dependent per role and state.

Overlay: no

Lifecycle state: AUTHENTICATED · página desplazada 900 px

Authority condition: Actor-dependent access per authority.ts rules.

PII condition: PII fields (DNI, birth, contact) restricted by canViewDni/canViewBirth/canViewContact.

Scroll position: top

Evidence type: SEEDED_RUNTIME

Notes: Reorganized from GEI_CURRENT_UX_ATLAS. Source: 00_Global. Original surface map: surface-map-legacy.md.
