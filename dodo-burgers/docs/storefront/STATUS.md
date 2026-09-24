# Storefront — status

> Reconciles ARCHITECTURE.md (intent) vs IMPLEMENTATION.md (code). Updated
> whenever code changes what is done (§6.5).

## Headline
Built and complete for its stated scope — a fully client-side ordering demo
with no backend. The only "gap" (no real order submission) is by design.

**2026-09-24 visual redesign**: full visual-identity replacement (impeccable
skill, user-pinned reference: engineeredarts.com) — dark navy/steel-blue
"engineered product launch" world replacing the earlier light/cream
teal-and-coral treatment. Visual/markup/CSS only; `MENU`, `BUILDER`, `FAQ`
data and every render/cart function in the `<script>` block are byte-for-byte
unchanged. New: `PRODUCT.md` and `DESIGN.md` at the repo root (impeccable's
product/design-system records). Also fixed two pre-existing bugs surfaced
during this redesign's QA pass (present before this session, unrelated to the
new visual system): no `<meta name="viewport">` tag meant every
`@media (max-width:…)` rule never fired on real mobile devices (browsers
defaulted to a 980px layout width); and the toast notification's hidden
`transform` didn't fully clear the viewport, leaving a sliver visible at the
bottom at all times.

**2026-09-24 follow-up: horizontal-scroll conversion**: same session, second
request — converted the page from vertical to horizontal scroll (8 fixed
`100vw` panels in a flex row; wheel input redirected to `scrollLeft`, with a
per-panel vertical-overflow fallback for short viewports; keyboard
arrow/Page/Home/End support; a bottom progress bar). The burger builder was
split into two panels (pick ingredients, then review/add) since a horizontal
panel has to fit one viewport. Added a new, explicitly-approved illustration
exception to the real-photo policy: a low-opacity line-art dodo + burger-patty
background motif (`currentColor`-based, re-themes per panel automatically).
New, purely additive `<script>` block handles track navigation; the original
commerce/render `<script>` block is still byte-for-byte unchanged. One real
bug found and fixed during QA: native `Element.scrollIntoView()` was
unreliable in this nested-scroll/scroll-snap setup (consistently landed one
panel short of the target) — nav-link/logo navigation now computes
`offsetLeft` and calls `track.scrollTo()` directly instead, verified exact.

## Completeness
| Object / morphism | State | Notes |
| --- | --- | --- |
| `renderMenu` | ✅ built | |
| `renderBuilder` | ✅ built | |
| `renderBuilderPreview` | ✅ built | diff-against-previous-state animation is load-bearing — see `CLAUDE.md` session history point 8; don't regress to animating every layer on every render |
| `renderFaq` | ✅ built | |
| `addToCart` / `renderCart` | ✅ built | in-memory only, resets on reload — intentional |
| `toast` | ✅ built | |

## Needs work
1. No automated tests exist for the composition rules (`BuildState.total`,
   `cartTotal`) — currently relies on manual/visual verification. Not
   currently planned; flagged for visibility only.

## Coherence
No §4.5 law is FAILing or advisory-only. See `ARCHITECTURE.md` §9 for the one
law worth restating explicitly (placement honesty re: "Send to kitchen").

## Where to dig
- Model: `ARCHITECTURE.md` · Code map: `IMPLEMENTATION.md`
- In flight: `openspec/changes/` (none as of scaffold) · Reviews: `reviews/` · Notes: `general/`
