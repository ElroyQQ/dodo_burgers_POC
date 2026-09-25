# Storefront — implementation map

> The functor ARCHITECTURE.md → code. Each object/morphism → the file:symbol
> that realises it. Keep in sync WITH the code (§6.3): a new morphism gets a
> row here in the same change that adds its code.

## Objects (Dat) → code
| Object | Form / shape | Realised at | State |
| --- | --- | --- | --- |
| `MenuItem[]` | `{id,name,tag,veg,price,desc,img}[]` | `index.html:MENU` | built |
| `BuilderOption[]` | `{patty,bun,sauce,topping}`, each `{id,label,price,img}[]` | `index.html:BUILDER` | built |
| `FaqEntry[]` | `{q,a}[]` | `index.html:FAQ` | built |
| `CartEntry[]` | `{name,price,meta}[]` | `index.html:cart` | built |
| `BuildState` | `{patty,bun,sauce,toppings[],total}` | `index.html:build` | built |

## Morphisms (Trn / relations) → code
| Morphism | Signature | Realising code | State |
| --- | --- | --- | --- |
| `renderMenu` | `MenuItem[] → DOM` | `index.html:renderMenu` | built |
| `renderBuilder` | `BuilderOption[] × BuildState → DOM × total` | `index.html:renderBuilder` | built |
| `renderPillRow` | `BuilderOption[] × BuildState → DOM` | `index.html:renderPillRow` | built |
| `renderBuilderPreview` | `BuildState → SVG` | `index.html:renderBuilderPreview` | built |
| `renderFaq` | `FaqEntry[] → DOM` | `index.html:renderFaq` | built |
| `addToCart` | `CartEntry → CartEntry[]` | `index.html:addToCart` | built |
| `renderCart` | `CartEntry[] → DOM × total` | `index.html:renderCart` | built |
| `money` | `number → string` | `index.html:money` | built |
| `toast` | `string → DOM` | `index.html:toast` | built |
| `openDrawer` / `closeDrawer` | `() → DOM` | `index.html:openDrawer` / `index.html:closeDrawer` | built |

### Track navigation (added 2026-09-24, ARCHITECTURE §5b) — second `<script>` block
| Morphism | Signature | Realising code | State |
| --- | --- | --- | --- |
| `updateProgress` | `scrollLeft/scrollWidth → chase-bar --tx × .caught` | `index.html:updateProgress` (2nd script) | built |
| `scrollToPanel` | `panel id → track.scrollLeft` | `index.html:scrollToPanel` (2nd script) | built |
| wheel handler | `WheelEvent → track.scrollLeft` | `index.html` (`track.addEventListener("wheel", ...)`) | built |
| keydown handler | `KeyboardEvent → track.scrollBy/scrollTo` | `index.html` (`window.addEventListener("keydown", ...)`) | built |

### Auth panel (added 2026-09-24, reconciled 2026-09-25, ARCHITECTURE §5c) — third `<script>` block
| Morphism | Signature | Realising code | State |
| --- | --- | --- | --- |
| `setLoggedIn` / `setLoggedOut` | `email? → DOM(#authBox)` | `index.html:setLoggedIn` / `index.html:setLoggedOut` (3rd script) | built |
| auth form submit handler | `{mode,email,password} → fetch("/api/"+mode) ⊸` | `index.html` (3rd script, `form.addEventListener("submit", ...)`) | built |
| logout click handler | `() → localStorage.removeItem(...) ⊸` | `index.html` (3rd script, `logoutBtn.addEventListener("click", ...)`) | built |

## Composition rules → where enforced
| Rule (ARCHITECTURE §6) | Enforced at | Tested at |
| --- | --- | --- |
| `BuildState.total = Σ selected prices` | `index.html:renderBuilder` | no automated tests — repo has no test suite |
| `cartTotal = Σ(entry.price)` | `index.html:renderCart` | no automated tests — repo has no test suite |
| chase-bar position/caught-state = `f(scrollLeft, scrollWidth)` | `index.html:updateProgress` | manually verified live in-browser this session (exact `offsetLeft`/`scrollLeft` match at start/mid/end) — no automated tests |
| `localStorage.dodoUserEmail` written only on fetch success, cleared only on logout | `index.html` (3rd script, form `.then()` success branch; `logoutBtn` click handler) | manually verified (login → key set; logout → key cleared; failed login → key untouched) — no automated tests |

## Trm (ARCHITECTURE §7/§9)
| Trm | Carries | Realised at | State |
| --- | --- | --- | --- |
| OpenStreetMap embed | map tiles, one-way, read-only | `index.html` `#visit .visit-map iframe` (`src="https://www.openstreetmap.org/export/embed.html?..."`) | built |
| `POST /api/signup` (calls `auth.port_signup`) | request `{email,password}`, response `{ok,email}`/`{error}` | `index.html` (3rd script, `fetch("/api/signup")`) — server side: `functions/api/signup.js` (see `docs/auth/IMPLEMENTATION.md`) | built |
| `POST /api/login` (calls `auth.port_login`) | request `{email,password}`, response `{ok,email}`/`{error}` | `index.html` (3rd script, `fetch("/api/login")`) — server side: `functions/api/login.js` (see `docs/auth/IMPLEMENTATION.md`) | built |

## Notes / divergences
Scaffold-time note (2026-09-23) no longer complete: the 2026-09-24 redesign
added the track-navigation morphisms and the site's first `Trm` above; both
are reconciled here and in ARCHITECTURE.md as of this entry. **2026-09-25:**
the 2026-09-24 auth-panel addition (commits `415ca7b`…`f9ec787`) was built
without a model or session log at the time — reconciled retroactively in this
pass, alongside the new `docs/auth/` component tree. No test suite exists in
this repo (confirmed in `CLAUDE.md`) — all composition rules are enforced by
code and manual verification only, not automated tests.
