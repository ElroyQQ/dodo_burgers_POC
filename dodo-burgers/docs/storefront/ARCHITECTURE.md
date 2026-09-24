# Storefront — categorical model

> Model-first (FRAMEWORK §2/§4). Intended specification for this component; the
> code realises it (see IMPLEMENTATION.md). Source of record: `index.html`.

## 1. Overview
The entire Dodo Burgers ordering experience: a fixed menu, a photo-driven burger
builder, an FAQ, and an in-memory cart drawer, all rendered client-side from
static data embedded in one file. **2026-09-24**: the page's navigation model
changed from vertical document scroll to a horizontal `.track` of fixed panels
(impeccable-skill redesign; see `PRODUCT.md`/`DESIGN.md`). This added one new,
purely-additive `Trn` family (scroll/track navigation) alongside the original
commerce morphisms below, which are untouched.

## 2. Why
Modeling this as one degenerate component (§7.1: `Loc` collapses to a single
process) makes explicit what's easy to assume otherwise reading the UI copy —
there is no backend, no persistence, and "Send to kitchen" transmits nothing.
The model's main job here is keeping that boundary honest as the site grows.

## 3. Core category
```mermaid
graph LR
    MENU["MenuItem[]"]
    BUILDER["BuilderOption[] (patty/bun/sauce/topping)"]
    FAQ["FaqEntry[]"]
    BUILD["BuildState"]
    CART["CartEntry[]"]
    DOM1["#menuGrid DOM"]
    DOM2["cart drawer DOM"]
    DOM3["#faqList DOM"]
    SVG["animated SVG preview"]

    MENU -->|"renderMenu (total)"| DOM1
    BUILDER -->|"renderBuilder (total)"| BUILD
    BUILD -->|"renderBuilderPreview (total)"| SVG
    BUILD -.->|"addToCart (partial)"| CART
    MENU -.->|"addToCart (partial)"| CART
    CART -->|"renderCart (total)"| DOM2
    FAQ -->|"renderFaq (total)"| DOM3

    SCROLL["track.scrollLeft"]
    CHASE["chase-bar DOM"]
    OSM(("openstreetmap.org (Loc)"))
    SCROLL -->|"updateProgress (total)"| CHASE
    OSM -.->|"Trm: iframe embed"| DOM4["Visit panel DOM"]

    style MENU fill:#4f8cf7,color:#fff
    style BUILDER fill:#4f8cf7,color:#fff
    style FAQ fill:#4f8cf7,color:#fff
    style BUILD fill:#4f8cf7,color:#fff
    style CART fill:#4f8cf7,color:#fff
    style SCROLL fill:#4f8cf7,color:#fff
    style DOM1 fill:#f7c04f,color:#000
    style DOM2 fill:#f7c04f,color:#000
    style DOM3 fill:#f7c04f,color:#000
    style DOM4 fill:#f7c04f,color:#000
    style SVG fill:#f7c04f,color:#000
    style CHASE fill:#f7c04f,color:#000
    style OSM fill:#e05252,color:#fff
```

## 4. Morphism table
| Morphism | Signature | Partiality | Semantics |
| --- | --- | --- | --- |
| `renderMenu` | `MenuItem[] → DOM(#menuGrid)` | Total | rebuilds the menu grid from `MENU` on every call |
| `renderBuilder` | `BuilderOption[] × BuildState → DOM(#builder) × total` | Total | rebuilds all four swatch rows and the build-lines list; deduces `total` |
| `renderPillRow` | `BuilderOption[] × BuildState → DOM(swatch row)` | Total | shared renderer for the single-select (patty/bun/sauce) and multi-select (topping) rows |
| `renderBuilderPreview` | `BuildState → SVG` | Total | deduces the animated illustration; diffs against `prevBuildKey` to pick which layer(s) animate |
| `renderFaq` | `FaqEntry[] → DOM(#faqList)` | Total | first entry renders `open` |
| `addToCart` | `CartEntry → CartEntry[]` | Partial | fires only on a menu item's or the builder's "Add to order" click |
| `renderCart` | `CartEntry[] → DOM(cart drawer) × cartTotal` | Total | deduces `cartTotal` from `cart` on every call |
| `money` | `number → string` | Total | `"$" + n.toFixed(2)` |
| `toast` | `string → DOM(#toast)` | Partial | fires only on add/submit/empty-submit actions |

## 5. Functors
One functor of note — the builder pipeline: `BuilderOption[] × click-event →
BuildState → (DOM, SVG)`. No status state machine or strategy resolver exists;
the whole flow is a single render-on-change loop with no server round-trip.

### 5b. Track navigation (added 2026-09-24, second `<script>` block)
A second, independent functor, added by the redesign and never touching the
objects above: `track.scrollLeft → (chase-bar transform, panel visibility)`.
| Morphism | Signature | Partiality | Semantics |
| --- | --- | --- | --- |
| `updateProgress` | `track.scrollLeft × track.scrollWidth → chase-bar --tx × .caught` | Total | deduces chef/dodo/burger X position and the dodo→burger "caught" swap purely from scroll position; nothing about chase state is stored independently |
| `scrollToPanel` | `panel id → track.scrollLeft` | Partial | fires on nav-link/logo click; uses `track.scrollTo({left: el.offsetLeft})` directly — `Element.scrollIntoView` was tried first and found unreliable (lands one panel short) in this nested-scroll/scroll-snap layout |
| wheel handler | `WheelEvent → track.scrollLeft` | Partial | redirects vertical wheel input to horizontal scroll, deferring to a panel's own `.panel-inner` vertical scroll first when that panel doesn't fully fit the viewport |
| keydown handler | `KeyboardEvent → track.scrollBy/scrollTo` | Partial | Arrow/Page/Home/End move one panel or jump to an end |

## 6. Composition rules
1. `invariant: BuildState.total = patty.price + bun.price + sauce.price + Σ(topping.price)` — enforced in `renderBuilder`.
2. `invariant: cartTotal = Σ(entry.price for entry in cart)` — enforced in `renderCart`.
3. `deduction: renderBuilderPreview's shape/color = f(BuildState, prevBuildKey)` — pure function of current selections plus the diff against the previous state; nothing about the illustration is stored independently of `BuildState`.
4. `deduction: chase-bar dodo/chef/burger position and caught-state = f(track.scrollLeft, track.scrollWidth)` — pure function of scroll position (§5b); no chase-progress value is stored outside the scroll position itself.

## 7. Atoms owned (FRAMEWORK §4)
**Trn** — the commerce morphism table (§4) plus the track-navigation morphisms (§5b); realising code `index.html:<script>` (commerce IIFE) and `index.html`'s second, additive `<script>` (navigation).
**Loc** — two, as of 2026-09-24: the browser tab rendering the page (still the only `Loc` for every commerce morphism, collapsed per §7.1); and `openstreetmap.org`'s tile/embed server, reached only by the "Find the shop" panel's `<iframe>`.
**Trm** — one real one, added 2026-09-24: the OpenStreetMap `<iframe src="https://www.openstreetmap.org/export/embed.html?...">` in the Visit panel — a genuine cross-`Loc` transmission (the site's first). It is one-way, read-only (map tiles in, nothing out), and the surrounding address/hours text is realised independently so the panel stays meaningful if this `Trm` fails (see Law 1 note below). Every other handoff (click → state mutation → re-render, including the chase-bar and cart) is still same-`Loc`, i.e. `Trn`, not `Trm`. "Send to kitchen" is still a same-`Loc` state reset (`cart = []`), never a network call.
**Placements (§4.2)** — none; no `Dat` runs in more than one `Loc`.

## 8. Bridges to other components (ports)
None — this is the only component in the repo.

## 9. Coherence notes
Law 6 (runsAt is a relation) stays vacuously satisfied — no `Dat` here is
placed at more than one `Loc`. Law 2 (transmission well-typing) now has a real
case to check, not a vacuous one: the OpenStreetMap `Trm` (§7) carries only
map-tile imagery, asserts nothing about the site's own `Dat`, and its failure
mode is handled — the panel's address/hours `Dat` is realised in plain text
outside the iframe, plus a fallback link, so the panel stays useful if the
`Trm` never completes. The law worth restating for future readers is still Law
1 (placement honesty): the UI must never imply the order reaches a real
kitchen. `toast("Order sent to the kitchen — thank you!")` is intentional
fiction matching the site's tone — a future change adding real ordering would
need a genuine `Trm` here, not just new copy (exactly the kind the map now
demonstrates the shape of).
