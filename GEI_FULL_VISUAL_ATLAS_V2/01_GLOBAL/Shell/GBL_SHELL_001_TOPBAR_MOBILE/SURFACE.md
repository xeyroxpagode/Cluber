# Surface GBL_SHELL_001_TOPBAR_MOBILE

Domain: Global
Subdomain: Shell

Route: /home

Actor(s): COACH

VIEWPORT STATUS:

390×844:
CAPTURED — `GBL_SHELL_001_TOPBAR_MOBILE__COACH__390x844.png`

1440×900:
N/A — CURRENT does not render this surface at this viewport

reason:
La composición «topbar móvil» (marca GEI + contexto de ruta en una línea + buscar como icono 44×44) no existe en 1440 px: la marca tiene `lg:hidden` (src/app/Shell.tsx:113-121), el bloque de contexto móvil tiene `lg:hidden` (src/app/Shell.tsx:129-133), el buscar como texto tiene `hidden ... sm:inline-flex` y el icono `sm:hidden` (src/app/Shell.tsx:135-152).

current behavior:
Runtime verificado a 1440×900: marca GEI display=none; contexto móvil display=none; contexto de escritorio display=block; buscar como texto display=flex con atajo ⌘K; buscar como icono display=none. La barra superior sí existe, pero con otra composición.

alternate surface/route if applicable:
GBL_SHELL_002_TOPBAR_DESKTOP — misma ruta /home, actor COACH, viewport 1440×900.


Current state: AUTHENTICATED · sin avisos sin leer

Journey(s): Home → Event → Availability → response

Entry path: /home

Visible sections: See surface-map-legacy.md or source component.

Primary action: Navigation to route destination.

Secondary actions: Context-dependent per role and state.

Overlay: no

Lifecycle state: AUTHENTICATED · sin avisos sin leer

Authority condition: Actor-dependent access per authority.ts rules.

PII condition: PII fields (DNI, birth, contact) restricted by canViewDni/canViewBirth/canViewContact.

Scroll position: top

Evidence type: SEEDED_RUNTIME

Notes: Reorganized from GEI_CURRENT_UX_ATLAS. Source: 00_Global. Original surface map: surface-map-legacy.md.
