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

**2026-09-24 follow-ups (same day)**: (1) the background dodo/patty line-art
motif above was judged inaccurate and removed entirely, replaced with a
chase-bar animation (chef icon chasing a dodo icon along the bottom edge,
tied to scroll progress; dodo turns into a burger icon on reaching the last
panel) — chef/burger icons are the "Cook"/"Hamburger" icons by Delapouite via
game-icons.net (CC BY 3.0), credited in the footer. (2) Added a "Find the
shop" panel (position 2) with an embedded OpenStreetMap iframe — the repo's
first `Trm` (see ARCHITECTURE §7/§9, IMPLEMENTATION "Trm" table); footer
trimmed to credits-only and moved to just before the builder. (3) The builder
was merged back from two panels into one (picks + live summary/preview side
by side) after the two-panel split broke the live-update feedback loop; fixed
a real bug found in the process — the Double Dodo patty rendered as two
same-color rects touching/overlapping, reading as one slightly-thicker patty
instead of two.

**2026-09-24, later same day**: the footer panel described above no longer
exists. Legal/photo credits moved out of the horizontal scroll entirely, into
a small `<details class="credits">` disclosure in the fixed header ("Credits",
closed by default, ~11px) — an explicit request to keep that content out of
the track. Panel order is now: hero → visit → why → story → menu → faq →
builder (final).

**2026-09-24, same day (reconciled 2026-09-25): auth panel added.** A header
`<details>` panel (log in / sign up / log out), a third `<script>` block, and
a new `auth` component (Cloudflare Pages Functions + D1) — see
`docs/auth/ARCHITECTURE.md`. This was built and deployed same-day but never
modeled or logged at the time; this `STATUS.md` entry and the new `auth/`
doc tree are that retroactive reconciliation, done 2026-09-25 with no code
changes. Headline gap carried from `auth/STATUS.md`: no session/token is
issued — the panel's "logged in as X" state is a `localStorage` display cache
(see ARCHITECTURE.md §5c/§9), not enforced authentication.

## Completeness
| Object / morphism | State | Notes |
| --- | --- | --- |
| `renderMenu` | ✅ built | |
| `renderBuilder` | ✅ built | |
| `renderBuilderPreview` | ✅ built | diff-against-previous-state animation is load-bearing — see `CLAUDE.md` session history point 8; don't regress to animating every layer on every render. Double-patty layer now has a visible gap/seam (2026-09-24 fix) — don't let the two rects touch again |
| `renderFaq` | ✅ built | |
| `addToCart` / `renderCart` | ✅ built | in-memory only, resets on reload — intentional |
| `toast` | ✅ built | |
| `updateProgress` / `scrollToPanel` / wheel / keydown handlers | ✅ built | track-navigation Trn family, ARCHITECTURE §5b — added 2026-09-24, purely additive, second `<script>` block |
| `setLoggedIn` / `setLoggedOut` / auth form submit / logout handler | ✅ built | auth-panel Trn family, ARCHITECTURE §5c — added 2026-09-24, reconciled 2026-09-25, third `<script>` block; calls the `auth` component (see `docs/auth/STATUS.md`) |

## Needs work
1. No automated tests exist for the composition rules (`BuildState.total`,
   `cartTotal`) — currently relies on manual/visual verification. Not
   currently planned; flagged for visibility only.

## Coherence
No §4.5 law is FAILing or advisory-only. Law 2 (transmission well-typing) now
has a real, non-vacuous case — the OpenStreetMap `Trm` — and passes (see
`ARCHITECTURE.md` §7/§9: read-only, degrades gracefully). See `ARCHITECTURE.md`
§9 for the one law worth restating explicitly (placement honesty re: "Send to
kitchen").

## Where to dig
- Model: `ARCHITECTURE.md` · Code map: `IMPLEMENTATION.md`
- In flight: `openspec/changes/` (none as of scaffold) · Reviews: `reviews/` · Notes: `general/`
