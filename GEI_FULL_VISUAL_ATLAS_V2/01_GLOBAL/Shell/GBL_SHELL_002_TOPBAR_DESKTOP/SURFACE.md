# Surface GBL_SHELL_002_TOPBAR_DESKTOP

Domain: Global
Subdomain: Shell

Route: /home

Actor(s): COACH

VIEWPORT STATUS:

390×844:
N/A — CURRENT does not render this surface at this viewport

reason:
La composición «topbar escritorio» (sin marca GEI, micro-etiqueta Hockey + contexto en dos líneas, buscar como texto con atajo ⌘K) no existe en 390 px: el contexto de escritorio está en `hidden ... lg:block` (src/app/Shell.tsx:123-128) y el buscar como texto en `hidden ... sm:inline-flex` (src/app/Shell.tsx:136-145).

current behavior:
Runtime verificado a 390×844: marca GEI display=flex; contexto de escritorio display=none; contexto móvil display=block; buscar como texto display=none; buscar como icono display=flex. La barra superior sí existe, pero con la composición móvil.

alternate surface/route if applicable:
GBL_SHELL_001_TOPBAR_MOBILE — misma ruta /home, actor COACH, viewport 390×844.

1440×900:
CAPTURED — `GBL_SHELL_002_TOPBAR_DESKTOP__COACH__1440x900.png`


Current state: AUTHENTICATED

Journey(s): Home → Event → Availability → response

Entry path: /home

Visible sections: See surface-map-legacy.md or source component.

Primary action: Navigation to route destination.

Secondary actions: Context-dependent per role and state.

Overlay: no

Lifecycle state: AUTHENTICATED

Authority condition: Actor-dependent access per authority.ts rules.

PII condition: PII fields (DNI, birth, contact) restricted by canViewDni/canViewBirth/canViewContact.

Scroll position: top

Evidence type: SEEDED_RUNTIME

Notes: Reorganized from GEI_CURRENT_UX_ATLAS. Source: 00_Global. Original surface map: surface-map-legacy.md.
