# Whole-system categorical map (Dat/Trn/Loc/Trm)

> Top-level architecture doc (§4). Names the four atoms, lists components (each
> linking to its ARCHITECTURE.md), reifies placement where it is a relation, and
> runs the §4.5 coherence checklist against the code. Detail lives in the linked
> component docs. Source of record: `index.html`.

## 1. Why
The whole site is one file with no server, so the categorical model's main value
here is negative: it makes explicit that there is no `Trm` anywhere in this repo,
so any future claim of "the order was sent" has to be checked against that fact
rather than assumed.

## 2. The four atoms (at a glance)
**Dat** — `MENU`, `BUILDER` (patty/bun/sauce/topping), `FAQ` (all static, const),
plus mutable `cart` and `build` — all declared in `index.html`'s inline `<script>`.

**Trn** — `renderMenu`, `renderBuilder`, `renderPillRow`, `renderBuilderPreview`,
`renderFaq`, `addToCart`, `renderCart`, `money`, `toast`, `openDrawer`/`closeDrawer`
— all in `index.html:<script>`.

**Loc** — one: the browser tab rendering the page. Collapses to a single process
(§7.1) — there is no server-side `Loc`.

**Trm** — none at this scale. No network request exists anywhere in the code;
"Send to kitchen" only clears local state and shows a toast.

## 3. Components
| Component | Owned `Trn` | Built/active when | Doc |
| --- | --- | --- | --- |
| `storefront` | `renderMenu`, `renderBuilder`, `renderPillRow`, `renderBuilderPreview`, `renderFaq`, `addToCart`, `renderCart`, `money`, `toast` | always | [storefront/ARCHITECTURE.md](storefront/ARCHITECTURE.md) |

## 4. Placement (only where runsAt is a relation, §4.2)
None — a single `Loc` means nothing here is placed more than once.

## 5. Coherence checklist (§4.5 / §8) against the implementation
- [x] 1. Placement honesty — UI copy ("Send to kitchen") is fictional, matching the
      site's tone, but no code path claims a real transmission occurs.
- [x] 2. Transmission well-typing — vacuous; no `Trm` exists to type-check.
- [x] 3. Placement totality — every `Trn` runs in the single browser `Loc`.
- [x] 4. Dependency mediation — vacuous; one component, no cross-component port.
- [x] 5. Composition soundness — `BuildState.total` and `cartTotal` are both
      deduced sums; verified in [storefront/IMPLEMENTATION.md](storefront/IMPLEMENTATION.md).
- [x] 6. runsAt is a relation — vacuous; one `Loc` only.

## 6. Modeling smells swept (§3)
No parallel objects (MENU and BUILDER options model genuinely different things —
pre-built combos vs. individual components — not the same object twice). Two
deduce-don't-store smells found and recorded in [suggestions.md](suggestions.md)
rather than silently left in place.
