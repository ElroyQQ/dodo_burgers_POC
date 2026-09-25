# System implementation map

> Whole-system functor architecture-map.md → code, deduced from the component
> IMPLEMENTATION.md files. System-level rows only.

## Components → code root
| Component | Code root | Model | Code map |
| --- | --- | --- | --- |
| storefront | `index.html` | [storefront/ARCHITECTURE.md](storefront/ARCHITECTURE.md) | [storefront/IMPLEMENTATION.md](storefront/IMPLEMENTATION.md) |
| auth | `functions/api/`, `schema.sql`, `wrangler.toml` | [auth/ARCHITECTURE.md](auth/ARCHITECTURE.md) | [auth/IMPLEMENTATION.md](auth/IMPLEMENTATION.md) |

## Shared objects (one Dat, DataLocs in ≥2 components)
| Object | Authoritative at | Also read by | Realised at |
| --- | --- | --- | --- |
| `User.email` | `auth` (D1 `users` table) | `storefront` — display-only cache, never treated as authoritative | `schema.sql:users` (auth) / `index.html:localStorage.dodoUserEmail` (storefront, not tied — a cache, not a second source of truth) |

## Inter-component transmissions / ports (Trm)
| Port | Carries | c_from → c_to | Realising code |
| --- | --- | --- | --- |
| `port_signup` | `Credentials` (req) / `User`-derived `Result` (resp) | storefront (Client) → auth (Worker) | `index.html` (3rd script, `fetch`) → `functions/api/signup.js:onRequestPost` |
| `port_login` | `Credentials` (req) / `𝔹`-derived `Result` (resp) | storefront (Client) → auth (Worker) | `index.html` (3rd script, `fetch`) → `functions/api/login.js:onRequestPost` |

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
| Submit the auth form (log in / sign up) | `port_login`/`port_signup` → `setLoggedIn`, `localStorage` write | `index.html` (3rd script, form submit handler) → `functions/api/{login,signup}.js` | — added 2026-09-24, reconciled 2026-09-25 |
| Click "Log out" | `setLoggedOut`, `localStorage` clear (no network call) | `index.html` (3rd script, `logoutBtn` click handler) — added 2026-09-24, reconciled 2026-09-25 |
| `POST /api/login` or `/api/signup` reaches the Worker | `checkRateLimit` → `login`/`signup` → `hashPassword`/`timingSafeEqual` | `functions/api/login.js:onRequestPost` / `functions/api/signup.js:onRequestPost` — added 2026-09-24, reconciled 2026-09-25 |

## Divergences (system-level)
None found at scaffold time (2026-09-23). 2026-09-24: the horizontal-scroll
redesign added a second entry-point family (above) and the repo's first `Trm`
(storefront/IMPLEMENTATION.md); reconciled same-day, no divergence open.
**2026-09-25:** found and closed a real divergence — the auth feature (also
built 2026-09-24, commits `415ca7b`…`f9ec787`) had shipped a second component
(`auth`, above) with no model, no IMPLEMENTATION/STATUS rows, and no session
log; `docs/auth/` and the rows above are that reconciliation. No divergence
open as of this entry.
