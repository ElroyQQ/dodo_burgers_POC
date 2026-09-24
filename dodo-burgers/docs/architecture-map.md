# Whole-system categorical map (Dat/Trn/Loc/Trm)

> Top-level architecture doc (§4). Names the four atoms, lists components (each
> linking to its ARCHITECTURE.md), reifies placement where it is a relation, and
> runs the §4.5 coherence checklist against the code. Detail lives in the linked
> component docs. Source of record: `index.html`.

## 1. Why
The whole site is one file with (as of 2026-09-24) exactly one real cross-`Loc`
transmission — an embedded map. The categorical model's main value is still
mostly negative: it keeps that one real `Trm` scoped and honest, and makes
explicit that nothing else here is a transmission, so any future claim of
"the order was sent" has to be checked against that fact rather than assumed.

## 2. The four atoms (at a glance)
**Dat** — `MENU`, `BUILDER` (patty/bun/sauce/topping), `FAQ` (all static, const),
plus mutable `cart` and `build` — all declared in `index.html`'s inline `<script>`.

**Trn** — `renderMenu`, `renderBuilder`, `renderPillRow`, `renderBuilderPreview`,
`renderFaq`, `addToCart`, `renderCart`, `money`, `toast`, `openDrawer`/`closeDrawer`
(commerce, `index.html:<script>`), plus `updateProgress`, `scrollToPanel`, a
wheel handler, and a keydown handler (track navigation, added 2026-09-24, a
second `<script>` in the same file — see [storefront/ARCHITECTURE.md](storefront/ARCHITECTURE.md) §5b).

**Loc** — two, as of 2026-09-24: the browser tab rendering the page (still the
only `Loc` for every commerce and navigation `Trn`, collapsed per §7.1); and
`openstreetmap.org`, reached only by the `Trm` below.

**Trm** — one, added 2026-09-24: an OpenStreetMap `<iframe>` embed in the
storefront's "Find the shop" panel (map tiles, one-way, read-only). No other
network request exists anywhere in the code; "Send to kitchen" still only
clears local state and shows a toast.

## 3. Components
| Component | Owned `Trn` | Built/active when | Doc |
| --- | --- | --- | --- |
| `storefront` | commerce family (`renderMenu` … `toast`) + track-navigation family (`updateProgress`, `scrollToPanel`, wheel/keydown handlers) | always | [storefront/ARCHITECTURE.md](storefront/ARCHITECTURE.md) |

## 4. Placement (only where runsAt is a relation, §4.2)
None — no `Dat` is placed at more than one `Loc`. (The map `Trm`'s far end is a
`Loc` with no `Dat` of ours on it — tiles flow in, nothing of ours flows out.)

## 5. Coherence checklist (§4.5 / §8) against the implementation
- [x] 1. Placement honesty — UI copy ("Send to kitchen") is fictional, matching the
      site's tone, but no code path claims a real transmission occurs.
- [x] 2. Transmission well-typing — the one real `Trm` (OpenStreetMap embed)
      carries only map tiles, asserts nothing about this site's own `Dat`, and
      the panel's address/hours text is realised independently so it stays
      correct if the `Trm` fails; see [storefront/ARCHITECTURE.md](storefront/ARCHITECTURE.md) §9.
- [x] 3. Placement totality — every commerce and navigation `Trn` runs in the
      single browser `Loc`; the one `Trm` is the only code that reaches the
      second `Loc`.
- [x] 4. Dependency mediation — vacuous; one component, no cross-component port.
- [x] 5. Composition soundness — `BuildState.total` and `cartTotal` are both
      deduced sums; verified in [storefront/IMPLEMENTATION.md](storefront/IMPLEMENTATION.md).
- [x] 6. runsAt is a relation — vacuous; one `Loc` only.

## 6. Modeling smells swept (§3)
No parallel objects (MENU and BUILDER options model genuinely different things —
pre-built combos vs. individual components — not the same object twice). Two
deduce-don't-store smells found and recorded in [suggestions.md](suggestions.md)
rather than silently left in place.
