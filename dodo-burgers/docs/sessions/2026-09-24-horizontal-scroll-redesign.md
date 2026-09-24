# 2026-09-24 — horizontal-scroll redesign, chase animation, Visit Us panel

## 0. Continuation brief
Current state: storefront is fully built and deployed. The site was fully
visually redesigned (impeccable skill) from a light/cream vertical-scroll
page into a dark, horizontal-scroll "engineered product launch" world, with
a chef-chases-dodo chase-bar animation, a live-map "Find the shop" panel, and
a merged builder+live-summary panel. Everything is committed and pushed;
GitHub Pages is live and green.
Next step: none pending from this session. If resumed, start by asking the
user what's next — there is no open thread.
Resume command/check: `open https://elroyqq.github.io/dodo_burgers_POC/`

## 1. Work completed
- **Full visual redesign** (impeccable skill, user-pinned reference:
  engineeredarts.com): dark navy/steel-blue "engineered product launch"
  world replacing the earlier light/cream teal-and-coral treatment.
  New `PRODUCT.md` and `DESIGN.md` at the repo root.
- **Horizontal-scroll conversion**: page rebuilt as a `.track` of fixed
  `100vw` panels; wheel input redirected to horizontal scroll with a
  per-panel vertical-overflow safety net; keyboard Arrow/Page/Home/End
  support; nav-link/logo navigation via `track.scrollTo({left: el.offsetLeft})`
  (native `Element.scrollIntoView` was tried first and found unreliable —
  consistently landed one panel short in this nested-scroll/scroll-snap
  setup).
- **Chase-bar animation**: a chef icon chasing a dodo icon along the bottom
  edge, position driven purely by scroll progress; the dodo has a shrinking
  head-start gap so it reads as a real chase, and turns into a burger icon
  (with a fixed side-by-side gap, not an overlap) once the chef reaches it at
  the last panel. Went through three iterations: hand-drawn chef (rejected,
  "not distinctive enough") → real "Cook" icon from game-icons.net →
  hand-drawn burger (rejected, "doesn't look enough like a burger") → real
  "Hamburger" icon from game-icons.net. Both credited (CC BY 3.0, Delapouite)
  in the footer and in `PRODUCT.md`/`DESIGN.md`.
- **Background motif removed**: an earlier low-opacity line-art dodo/patty
  background pattern was built, then removed same-day as "inaccurate" —
  fully superseded by the chase-bar above.
- **"Find the shop" panel** (position 2): address, hours, transit directions,
  and a live OpenStreetMap `<iframe>` embed centered near Tuas Link MRT —
  the repo's first real network dependency / `Trm`. Text is realised
  independent of the iframe so the panel stays useful if the map fails to
  load; a plain "Open in OpenStreetMap" link is the fallback. Footer trimmed
  to credits-only and relocated to just before the builder panel.
- **Builder merged back into one panel**: was briefly split into a
  pick-ingredients panel and a separate "your build" summary panel (a
  horizontal panel has to fit one viewport); merged back on request once
  that split broke the live "watch it build" feedback the picker depends on.
  Now: 2×2 ingredient-pick grid + live preview/summary/total side by side,
  the true last panel (pays off with the chase-bar's "caught" moment).
- **Real bug found and fixed**: the Double Dodo patty rendered as two
  same-color rects touching/overlapping, reading as one slightly-thicker
  patty rather than two. Added a visible gap and a shadow seam.
- **Two pre-existing bugs found and fixed** (present before this session,
  unrelated to the redesign): missing `<meta name="viewport">` meant every
  `@media` rule silently never fired on real phones; the toast notification's
  hidden `transform` never fully cleared the viewport.
- **Docs reconciliation** (this `end` pass): added the track-navigation `Trn`
  family and the OpenStreetMap `Trm` to `storefront/ARCHITECTURE.md`,
  `storefront/IMPLEMENTATION.md`, root `docs/IMPLEMENTATION.md`,
  `docs/architecture-map.md`, and `docs/storefront/STATUS.md` — this was
  drift accumulated mid-session (new `<script>` block and a new `Trm` never
  got model rows when they were built) and is now closed.
- Zero changes to the original commerce `<script>` block (`MENU`, `BUILDER`,
  `FAQ` data, cart, render functions) throughout the entire session except
  the one deliberate double-patty geometry fix noted above.

## 2. Decisions
| Decision | Verdict | Why |
| --- | --- | --- |
| "AI-made" generic redesign vs. unique/bold direction | discarded AI-made, kept engineeredarts.com-pinned direction | user reversed the request mid-session before any AI-made build happened |
| Illustrated background motif (dodo silhouette + patty strip) | built, then discarded | user judged it "inaccurate"; replaced with the chase-bar concept instead |
| Chase-bar icons: hand-drawn vs. sourced | sourced (game-icons.net, CC BY 3.0) | hand-drawn chef and burger were both rejected as not distinctive enough |
| Builder as one panel vs. two panels | one panel (reverted from two) | two panels fit the one-viewport-per-panel rule but broke the live-preview feedback loop; user asked for it back |
| Google Maps vs. OpenStreetMap for the Visit panel | OpenStreetMap | no API key, no Google branding/tracking; fits the site's no-dependency posture better |
| Visit/footer panel position | Visit Us at position 2, footer (credits-only) moved to just before the builder | keeps "your build" as the true last panel (ties to the chase-bar payoff) while still giving the map an early, prominent slot |

## 3. Tests, checks, benchmarks
| Check | Result | What it proved |
| --- | --- | --- |
| `impeccable detect --json index.html` (final run) | 19 advisory-only findings, 0 warnings | no blocking design-quality issues; advisories are literal font-size/color values off the documented DESIGN.md ramp, disclosed as a known, non-blocking gap |
| Live `getComputedStyle` checks on scoped CSS vars | confirmed correct light/dark values despite 2 detector false positives | the detector can't trace CSS-custom-property cascade through selector-scoped overrides; both false positives suppressed via `impeccable hooks ignore-value ... --file index.html` with disclosed reasons |
| Manual click-through of every builder option (patty/bun/sauce/topping) via direct DOM `.click()` + SVG diff | all options change the rendered preview; Double Dodo's change was present but visually merged into a "thicker single patty" until fixed | found the real double-patty bug reported in this thread |
| `track.scrollTo` vs `Element.scrollIntoView` for panel-jump navigation | `scrollIntoView` lands ~1 panel short every time; direct `scrollTo({left: offsetLeft})` lands exact | root-caused and fixed the nav-link/logo navigation bug |
| `supercharge-drift` (`drift-check.sh`) | `0 dead / 0 refs`, before and after doc reconciliation | no dead doc rows |
| `gh run list` / `gh api repos/.../pages` | latest deploy `success`, Pages `"status":"built"` | GitHub Pages is live at the current commit |

## 4. Live handoff state
| Type | Handle / location | State | Inspect / resume | Stop / cleanup |
| --- | --- | --- | --- | --- |
| branch | `main` (repo root, tracks `dodo-burgers/`) | clean, pushed | `git status` | none |
| remote | `github.com/ElroyQQ/dodo_burgers_POC` | in sync with local `main` @ `39407f2` | `git log origin/main --oneline -1` | none |
| GitHub Pages | https://elroyqq.github.io/dodo_burgers_POC/ | built, live | open the URL | none |
| local dev server | `python3 -m http.server 8743` in `dodo-burgers/` | stopped (killed after each test round) | `ps aux \| grep http.server` (expect nothing) | none — none running |
| scratch files | `/tmp/motif_test*.html`, `/tmp/hero_*`, `/tmp/d*.json` | deleted during the session | n/a | already cleaned up |

## 5. In-flight changes (from OpenSpec)
None. `openspec list --json` → `{"changes": []}`. This session's work went
through the impeccable skill's own direction-contract/build-phase flow
(appropriate for a design-heavy task), not OpenSpec propose/apply — worth
noting for the next session rather than treating as an oversight.

## 6. Open items
| Priority | Item | Doc/code reference | Next action | Done when |
| --- | --- | --- | --- | --- |
| P2 | 19 advisory `design-system-font-size`/`design-system-color` findings | `dodo-burgers/index.html`, `DESIGN.md` frontmatter | either expand DESIGN.md's documented type/color ramp to match the real fine-grained UI-text scale, or accept as-is | `impeccable detect --json index.html` shows 0 advisories, or the gap is explicitly accepted and this row is closed |
| P3 | No automated test suite | `dodo-burgers/index.html` | none planned; flagged for visibility only (unchanged from scaffold) | n/a — accepted gap |

## 7. Architecture / model changes
Two real model changes this session, both reconciled in this `end` pass (see
§8): (1) a new `Trn` family for track/scroll navigation
(`storefront/ARCHITECTURE.md` §5b) — purely additive, second `<script>`
block, never touches the commerce `Dat`/`Trn`; (2) the repo's first real
`Trm` — an OpenStreetMap iframe embed — meaning `Loc` is no longer a single
collapsed process (now two: the browser tab, and openstreetmap.org) and Law 2
(transmission well-typing) went from vacuous to a real, passing check.
No `Dat` changed. No coherence law is failing.

## 8. Docs reconciled
| Doc | Change |
| --- | --- |
| `dodo-burgers/PRODUCT.md` | new brand commitments/exceptions: image-policy exceptions for the chase-bar icons and (briefly) the discarded background motif; the OpenStreetMap dependency exception |
| `dodo-burgers/DESIGN.md` | new file this session: full design-system record (colors, type, layout, components) for the redesign; later revised for the horizontal-scroll layout, the chase-bar, and the merged builder panel |
| `docs/storefront/ARCHITECTURE.md` | added §5b (track-navigation functor), composition rule 4 (chase-bar deduction), updated §7 (two `Loc`, one real `Trm`), §9 (Law 2 now non-vacuous), diagram |
| `docs/storefront/IMPLEMENTATION.md` | added track-navigation morphism rows, a chase-bar composition-rule row, a new "Trm" table |
| `docs/storefront/STATUS.md` | appended this session's changes (redesign, horizontal-scroll, motif removal/chase-bar, Visit panel, builder merge + patty fix); updated Completeness and Coherence sections |
| `docs/IMPLEMENTATION.md` (root) | added three new system entry points (wheel, keyboard, nav-link/logo click) |
| `docs/architecture-map.md` (root) | updated §1/§2/§3/§4/§5 to reflect the new `Trn` family, the second `Loc`, and the one real `Trm` |

## 9. Drift check
`supercharge-drift` → `0 dead / 0 refs`, both before and after the doc
reconciliation above.

## 10. Files changed
`dodo-burgers/index.html`, `dodo-burgers/PRODUCT.md`, `dodo-burgers/DESIGN.md`
(new), `dodo-burgers/.gitignore` (new), `dodo-burgers/.impeccable/config.json`
(new — shared detector ignores), `dodo-burgers/.impeccable/surfaces/index-html.md`
(new — direction contract), `dodo-burgers/images/hero-wide.jpg` (new —
re-graded hero crop), `docs/storefront/STATUS.md`, `docs/storefront/ARCHITECTURE.md`,
`docs/storefront/IMPLEMENTATION.md`, `docs/IMPLEMENTATION.md`,
`docs/architecture-map.md`. Commits: `574bf1f`, `5a6d472`, `de30b6d`, `39407f2`
(all pushed to `origin/main`).
