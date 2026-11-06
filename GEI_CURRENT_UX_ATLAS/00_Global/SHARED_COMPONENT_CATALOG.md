# SHARED COMPONENT CATALOG — GEI CURRENT UX ATLAS

Primitives compartidos observados en la aplicación real, con sus variantes, tamaños,
estados y motion. La **configuración de cada instancia** vive en el `surface-map.md`
de la surface donde aparece; acá está la definición del primitive y dónde se usa.

Fuente de verdad del código: `src/shared/ui.tsx`, `src/shared/patterns.tsx`,
`src/shared/vas.tsx`, `src/shared/states.ts`.

## Botones y acciones

| Primitive | Source | Variantes observadas | Aparece en | Renderizado en el código | Motion |
| --- | --- | --- | --- | --- | --- |
| `Button` | `src/shared/ui.tsx` | quiet, primary, secondary, danger | 24 surfaces | sí (88 renderizados) | transition-colors duration-micro (120 ms) ease-gei |
| `IconButton` | `src/shared/ui.tsx` | — | 1 surfaces | sí (2 renderizados) | transition-colors duration-micro (120 ms) ease-gei |
| `TextLink` | `src/shared/ui.tsx` | — | 1 surfaces | sí (5 renderizados) | transition-colors duration-micro (120 ms) ease-gei |
| `BackLink` | `src/shared/ui.tsx` | — | 0 surfaces | NO PRESENT IN CURRENT | — |

## Filas y superficies

| Primitive | Source | Variantes observadas | Aparece en | Renderizado en el código | Motion |
| --- | --- | --- | --- | --- | --- |
| `RowLink` | `src/shared/ui.tsx` | — | 29 surfaces | sí (29 renderizados) | — |
| `RowStatic` | `src/shared/ui.tsx` | — | 19 surfaces | sí (48 renderizados) | — |
| `Surface` | `src/shared/ui.tsx` | — | 15 surfaces | sí (48 renderizados) | — |
| `OpenGroup` | `src/shared/ui.tsx` | — | 0 surfaces | NO PRESENT IN CURRENT | — |
| `Empty` | `src/shared/ui.tsx` | — | 35 surfaces | sí (40 renderizados) | — |
| `Banner` | `src/shared/ui.tsx` | — | 13 surfaces | sí (43 renderizados) | — |
| `KeyValue` | `src/shared/ui.tsx` | — | 2 surfaces | sí (5 renderizados) | — |
| `MetaRow` | `src/shared/ui.tsx` | — | 2 surfaces | sí (1 render) | — |
| `Avatar` | `src/shared/ui.tsx` | — | 1 surfaces | sí (8 renderizados) | — |
| `DataTable` | `src/shared/ui.tsx` | — | 0 surfaces | NO PRESENT IN CURRENT | — |
| `StickyActionBar` | `src/shared/ui.tsx` | — | 0 surfaces | NO PRESENT IN CURRENT | — |

## Estado y etiquetas

| Primitive | Source | Variantes observadas | Aparece en | Renderizado en el código | Motion |
| --- | --- | --- | --- | --- | --- |
| `StateBadge` | `src/shared/ui.tsx` | — | 7 surfaces | sí (20 renderizados) | — |
| `Tag` | `src/shared/ui.tsx` | — | 4 surfaces | sí (8 renderizados) | — |
| `UnreadMark` | `src/shared/ui.tsx` | — | 0 surfaces | NO PRESENT IN CURRENT | — |
| `StatusText` | `src/shared/patterns.tsx` | — | 0 surfaces | NO PRESENT IN CURRENT | — |
| `StateBanner` | `src/shared/patterns.tsx` | — | 0 surfaces | importado, no renderizado | — |

## Navegación y filtros

| Primitive | Source | Variantes observadas | Aparece en | Renderizado en el código | Motion |
| --- | --- | --- | --- | --- | --- |
| `TabBar` | `src/shared/ui.tsx` | — | 3 surfaces | sí (3 renderizados) | transition-colors duration-micro (120 ms) |
| `SegmentedControl` | `src/shared/ui.tsx` | — | 2 surfaces | sí (2 renderizados) | transition-colors duration-micro (120 ms) |
| `FilterChip` | `src/shared/ui.tsx` | — | 2 surfaces | sí (1 render) | transition-colors duration-micro (120 ms) |
| `Expander` | `src/shared/ui.tsx` | — | 0 surfaces | importado, no renderizado | rotate-180 del chevron, transition-transform duration-micro |
| `FilterBar` | `src/shared/patterns.tsx` | — | 0 surfaces | NO PRESENT IN CURRENT | — |

## Formularios

| Primitive | Source | Variantes observadas | Aparece en | Renderizado en el código | Motion |
| --- | --- | --- | --- | --- | --- |
| `Field` | `src/shared/ui.tsx` | — | 15 surfaces | sí (3 renderizados) | — |
| `TextField` | `src/shared/ui.tsx` | — | 11 surfaces | sí (40 renderizados) | — |
| `TextArea` | `src/shared/ui.tsx` | — | 4 surfaces | sí (8 renderizados) | — |
| `Select` | `src/shared/ui.tsx` | — | 8 surfaces | sí (14 renderizados) | — |
| `Checkbox` | `src/shared/ui.tsx` | — | 0 surfaces | NO PRESENT IN CURRENT | — |
| `RadioGroup` | `—` | — | 5 surfaces | sí (4 renderizados) | transition-colors duration-micro; el icono busy usa animate-spin |

## Overlays

| Primitive | Source | Variantes observadas | Aparece en | Renderizado en el código | Motion |
| --- | --- | --- | --- | --- | --- |
| `Modal` | `src/shared/ui.tsx` | quiet | 19 surfaces | sí (12 renderizados) | sin animación de entrada: montaje/desmontaje |
| `Sheet` | `src/shared/ui.tsx` | — | 4 surfaces | sí (4 renderizados) | sin animación de entrada: montaje/desmontaje |
| `ConfirmDialog` | `src/shared/ui.tsx` | quiet | 1 surfaces | sí (16 renderizados) | — |
| `Menu` | `src/shared/ui.tsx` | — | 2 surfaces | sí (3 renderizados) | sin animación de entrada: montaje/desmontaje |
| `ScopeDialog` | `src/shared/patterns.tsx` | — | 1 surfaces | sí (1 render) | — |
| `TerminalConfirm` | `src/shared/patterns.tsx` | tone:danger | 0 surfaces | NO PRESENT IN CURRENT | — |

## Feedback

| Primitive | Source | Variantes observadas | Aparece en | Renderizado en el código | Motion |
| --- | --- | --- | --- | --- | --- |
| `SavedState` | `src/shared/ui.tsx` | — | 0 surfaces | NO PRESENT IN CURRENT | transition-colors duration-micro; el icono busy usa animate-spin |
| `Toast` | `src/shared/ui.tsx` | — | 2 surfaces | sí (1 render) | sin animación: montaje/desmontaje a los 3800 ms |

## Gramática compartida

| Primitive | Source | Variantes observadas | Aparece en | Renderizado en el código | Motion |
| --- | --- | --- | --- | --- | --- |
| `PageContextHeader` | `src/shared/patterns.tsx` | — | 24 surfaces | sí (36 renderizados) | — |
| `SectionHeader` | `src/shared/patterns.tsx` | — | 3 surfaces | sí (22 renderizados) | — |
| `DetailSection` | `src/shared/patterns.tsx` | — | 11 surfaces | sí (34 renderizados) | — |
| `FormSection` | `src/shared/patterns.tsx` | — | 0 surfaces | NO PRESENT IN CURRENT | — |
| `ImpactPreview` | `src/shared/patterns.tsx` | — | 0 surfaces | sí (3 renderizados) | — |
| `TimelineEntry` | `src/shared/patterns.tsx` | — | 6 surfaces | sí (1 render) | — |
| `HistoryList` | `src/shared/patterns.tsx` | — | 6 surfaces | sí (8 renderizados) | — |
| `StateBanner` | `src/shared/patterns.tsx` | — | 0 surfaces | importado, no renderizado | — |

## Dominio

| Primitive | Source | Variantes observadas | Aparece en | Renderizado en el código | Motion |
| --- | --- | --- | --- | --- | --- |
| `VasControl` | `src/shared/vas.tsx` | — | 6 surfaces | sí (4 renderizados) | — |
| `VasCompact` | `src/shared/vas.tsx` | — | 0 surfaces | importado, no renderizado | — |

## Primitives exportados que no aparecen en ninguna surface capturada

- `StateBanner` (src/shared/patterns.tsx) — importado en las features pero nunca renderizado
- `StatusText` (src/shared/patterns.tsx) — exportado y no referenciado por ninguna feature
- `FormSection` (src/shared/patterns.tsx) — exportado y no referenciado por ninguna feature
- `FilterBar` (src/shared/patterns.tsx) — exportado y no referenciado por ninguna feature
- `TerminalConfirm` (src/shared/patterns.tsx) — exportado y no referenciado por ninguna feature
- `UnreadMark` (src/shared/ui.tsx) — exportado y no referenciado por ninguna feature
- `Expander` (src/shared/ui.tsx) — importado en las features pero nunca renderizado
- `Checkbox` (src/shared/ui.tsx) — exportado y no referenciado por ninguna feature
- `OpenGroup` (src/shared/ui.tsx) — exportado y no referenciado por ninguna feature
- `SavedState` (src/shared/ui.tsx) — exportado y no referenciado por ninguna feature
- `BackLink` (src/shared/ui.tsx) — exportado y no referenciado por ninguna feature
- `StickyActionBar` (src/shared/ui.tsx) — exportado y no referenciado por ninguna feature
- `DataTable` (src/shared/ui.tsx) — exportado y no referenciado por ninguna feature
- `VasCompact` (src/shared/vas.tsx) — importado en las features pero nunca renderizado

## Fuentes de los primitives

- `src/shared/patterns.tsx`: `PageContextHeader`, `SectionHeader`, `StateBanner`, `StatusText`, `DetailSection`, `FormSection`, `ImpactPreview`, `TimelineEntry`, `HistoryList`, `FilterBar`, `ScopeDialog`, `TerminalConfirm`
- `src/shared/ui.tsx`: `Button`, `IconButton`, `RowLink`, `RowStatic`, `StateBadge`, `Tag`, `UnreadMark`, `TabBar`, `SegmentedControl`, `FilterChip`, `Expander`, `Menu`, `Field`, `TextField`, `TextArea`, `Select`, `Checkbox`, `Surface`, `OpenGroup`, `Banner`, `Empty`, `Modal`, `Sheet`, `ConfirmDialog`, `SavedState`, `Toast`, `Avatar`, `MetaRow`, `TextLink`, `BackLink`, `StickyActionBar`, `DataTable`, `KeyValue`
- `src/shared/vas.tsx`: `VasControl`, `VasCompact`
