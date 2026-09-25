# Whole-system categorical map (Dat/Trn/Loc/Trm)

> Top-level architecture doc (§4). Names the four atoms, lists components (each
> linking to its ARCHITECTURE.md), reifies placement where it is a relation, and
> runs the §4.5 coherence checklist against the code. Detail lives in the linked
> component docs. Source of record: `index.html`.

## 1. Why
As of 2026-09-24 the repo has grown from one file with a single real cross-`Loc`
transmission into two components: the original client-only `storefront`, and a
new `auth` backend (Cloudflare Pages Functions + D1). The categorical model's
job has grown to match — it now also has to keep the boundary between "the
client's cached display of who's logged in" and "an actual verified session"
honest, since `auth` issues no session token and it would be easy for a future
change to silently start trusting the client cache as if it were one.

## 2. The four atoms (at a glance)
**Dat** — `MENU`, `BUILDER` (patty/bun/sauce/topping), `FAQ` (all static, const),
plus mutable `cart` and `build` (storefront, `index.html`'s inline `<script>`);
`User` and `AuthAttempt` (auth, D1 tables `users`/`auth_attempts`,
`schema.sql`); `localStorage.dodoUserEmail` (storefront, a display-only cache
of `User.email` — see §4 Placement).

**Trn** — `renderMenu`, `renderBuilder`, `renderPillRow`, `renderBuilderPreview`,
`renderFaq`, `addToCart`, `renderCart`, `money`, `toast`, `openDrawer`/`closeDrawer`
(commerce, `index.html:<script>`), plus `updateProgress`, `scrollToPanel`, a
wheel handler, and a keydown handler (track navigation, added 2026-09-24, a
second `<script>` — see [storefront/ARCHITECTURE.md](storefront/ARCHITECTURE.md) §5b),
plus `setLoggedIn`/`setLoggedOut` and the form submit/logout handlers (auth
panel, third `<script>`, §5c) — all owned by `storefront`. Owned by `auth`:
`signup`, `login`, `hashPassword`, `timingSafeEqual`, `checkRateLimit`,
`clientIp` (`functions/api/`) — see [auth/ARCHITECTURE.md](auth/ARCHITECTURE.md).

**Loc** — three, as of 2026-09-24: the browser tab rendering the page (still
the only `Loc` for every commerce/navigation/auth-panel `Trn`, collapsed per
§7.1 on the `storefront` side); `openstreetmap.org`, reached only by the map
`Trm`; and the `auth` component's Cloudflare Worker + bound D1 database
(`dodo_burgers_db`), modeled as one `Loc` per the D1-binding granularity note
in [auth/ARCHITECTURE.md](auth/ARCHITECTURE.md) §7.

**Trm** — three, as of 2026-09-24: an OpenStreetMap `<iframe>` embed in the
storefront's "Find the shop" panel (map tiles, one-way, read-only); and
`POST /api/signup` / `POST /api/login` (request/response pairs, browser ↔
Worker) — see [auth/ARCHITECTURE.md](auth/ARCHITECTURE.md) §7. "Send to
kitchen" still only clears local state and shows a toast — no network call.

## 3. Components
| Component | Owned `Trn` | Built/active when | Doc |
| --- | --- | --- | --- |
| `storefront` | commerce family (`renderMenu` … `toast`) + track-navigation family (`updateProgress`, `scrollToPanel`, wheel/keydown handlers) + auth-panel family (`setLoggedIn`/`setLoggedOut`, form/logout handlers) | always | [storefront/ARCHITECTURE.md](storefront/ARCHITECTURE.md) |
| `auth` | `signup`, `login`, `hashPassword`, `timingSafeEqual`, `checkRateLimit`, `clientIp` | always (Cloudflare Pages Functions, request-triggered) | [auth/ARCHITECTURE.md](auth/ARCHITECTURE.md) |

## 4. Placement (only where runsAt is a relation, §4.2)
| `Trn`/`Dat` | placements | why it matters |
| --- | --- | --- |
| `User.email` | `DataLoc` @ `auth` (D1 `users` table, authoritative) + `DataLoc` @ `storefront` (`localStorage.dodoUserEmail`, client display cache) | the classic client-server placement (§7.2 — "Resource has two DataLocs, authoritative at Server, a copy at Client"); the client copy **must never be read as proof of identity**, only as a UX display cache — no `Trm` carries a signed session, so nothing verifies the client's copy is even still valid |
| `validate` (email/password) | `TrnLoc` @ `storefront` (`index.html` HTML5 `required`/`minlength`, UX only) + `TrnLoc` @ `auth` (`EMAIL_RE` + length check, the real gate) | the other §7.2 textbook case — "validation that runs twice is honest," not a redundancy; see [auth/ARCHITECTURE.md](auth/ARCHITECTURE.md) §7 |

## 5. Coherence checklist (§4.5 / §8) against the implementation
- [x] 1. Placement honesty — UI copy ("Send to kitchen") is fictional, matching the
      site's tone, but no code path claims a real transmission occurs. `auth`'s
      `login`/`signup` read `password_hash`/`salt` materialised in D1 at the
      same `Loc` they run at; the only cross-`Loc` input arrives via the
      request-body `Trm`. No teleport.
- [x] 2. Transmission well-typing — all three real `Trm`s are typed and cross a
      real boundary, materialised at both ends: the OpenStreetMap embed
      (carries only map tiles, asserts nothing about this site's own `Dat`,
      degrades gracefully — see [storefront/ARCHITECTURE.md](storefront/ARCHITECTURE.md) §9);
      and `POST /api/{login,signup}` (carry typed `Credentials`/`Result`,
      each end degrades to an error message on failure rather than hanging).
- [x] 3. Placement totality — every commerce/navigation/auth-panel `Trn` runs
      in the single browser `Loc`; every `auth` `Trn` runs in the Worker
      `Loc`; the three `Trm`s are the only code that crosses between them.
- [x] 4. Dependency mediation — now non-vacuous: `storefront` `depends-on`
      `auth`, mediated entirely by `port_signup`/`port_login`
      ([IMPLEMENTATION.md](IMPLEMENTATION.md) ports table) — nothing in
      `index.html` reaches D1 or the Worker directly.
- [x] 5. Composition soundness — `BuildState.total` and `cartTotal` are both
      deduced sums (storefront); `auth`'s unique-email, timing-safe-compare,
      and rate-limit invariants are each verified live against the deployed
      D1 instance — see the linked component IMPLEMENTATION.md files.
- [x] 6. runsAt is a relation — now non-vacuous: `validate` (§4 above) is
      placed twice, a genuine multi-placement case, not assumed single-valued.

## 6. Modeling smells swept (§3)
No parallel objects (MENU and BUILDER options model genuinely different things —
pre-built combos vs. individual components — not the same object twice; nor
are `login` and `signup` parallel objects — both consume one `Credentials`
shape, distinguished by which morphism/endpoint receives it). Two
deduce-don't-store smells found in `storefront` and one one-source-of-truth
smell found in `auth` (validation bounds hand-duplicated across `Loc`s) are
recorded in [suggestions.md](suggestions.md) rather than silently left in
place. `User.email`'s client-side copy is modeled as a `Placement` (§4 above),
not a second object — the correct move per §3 rather than a shadow `Dat`.
