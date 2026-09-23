# System implementation map

> Whole-system functor architecture-map.md → code, deduced from the component
> IMPLEMENTATION.md files. System-level rows only.

## Components → code root
| Component | Code root | Model | Code map |
| --- | --- | --- | --- |
| storefront | `index.html` | [storefront/ARCHITECTURE.md](storefront/ARCHITECTURE.md) | [storefront/IMPLEMENTATION.md](storefront/IMPLEMENTATION.md) |

## Shared objects (one Dat, DataLocs in ≥2 components)
None — single-component repo.

## Inter-component transmissions / ports (Trm)
None — single-component repo, and no `Trm` exists even within the component.

## System entry points
| Entry | Trn triggered | Code |
| --- | --- | --- |
| Page load | `renderMenu`, `renderBuilder`, `renderFaq`, `renderCart` | `index.html:<script>` (IIFE tail call) |
| Click `.add-btn` on a menu card | `addToCart` → `renderCart` | `index.html:renderMenu` (listener attached per card) |
| Click a builder swatch | `renderBuilder` (re-render + total recompute) | `index.html:renderPillRow` (listener attached per swatch) |
| Click "Add to order" (builder) | `addToCart` → `renderCart`, `toast`, `openDrawer` | `index.html` (`addBuild` click handler) |
| Click "Send to kitchen" | `toast`, cart reset, `renderCart` | `index.html` (`submitOrder` click handler) |

## Divergences (system-level)
None found at scaffold time (2026-09-23).
