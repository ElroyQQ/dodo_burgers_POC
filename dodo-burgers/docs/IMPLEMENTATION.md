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
| Mouse wheel / trackpad | `updateProgress` (chase-bar), possibly `track.scrollLeft` | `index.html` (2nd script, wheel handler) — added 2026-09-24 |
| Arrow / Page / Home / End keys | `track.scrollBy`/`scrollTo` → `updateProgress` | `index.html` (2nd script, keydown handler) — added 2026-09-24 |
| Click a nav link or the logo | `scrollToPanel` → `updateProgress` | `index.html` (2nd script, `a[href^="#"]` click handler) — added 2026-09-24 |

## Divergences (system-level)
None found at scaffold time (2026-09-23). 2026-09-24: the horizontal-scroll
redesign added a second entry-point family (above) and the repo's first `Trm`
(storefront/IMPLEMENTATION.md); reconciled same-day, no divergence open.
