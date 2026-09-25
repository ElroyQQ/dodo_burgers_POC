# Review — auth-init

> Ran after building (retroactively — the code shipped 2026-09-24, this
> review runs against it 2026-09-25 during doc reconciliation). Checks the
> component against FRAMEWORK §4.5. Not a prose review.

## Coherence laws
- [x] 1. Placement honesty — `login`/`signup` run entirely at the Worker `Loc`;
      `password_hash`/`salt` are materialised in D1 at that same `Loc`; the only
      cross-`Loc` input (`Credentials`) arrives via the request-body `Trm`. No
      data teleport.
- [x] 2. Transmission well-typing — both `Trm`s (`POST /api/signup`,
      `POST /api/login`) are typed (`carries: Credentials` / `Result`) and
      cross a real boundary (browser ↔ Worker), materialised at both ends.
- [x] 3. Placement totality — every `TrnLoc` (Worker) and the one `TrmCmp`
      pair have all projections defined; no dangling placement.
- [x] 4. Dependency mediation — `storefront`'s dependency on `auth` is
      mediated entirely by `port_signup`/`port_login`; `index.html` never
      reaches D1 or the Worker filesystem directly.
- [x] 5. Composition soundness — unique-email, timing-safe-compare, and
      rate-limit invariants each verified live against the deployed D1
      instance (see `IMPLEMENTATION.md`'s "Tested at" column).
- [x] 6. `runsAt` is a relation — non-vacuous: `validate` (email/password) has
      two `TrnLoc`s, browser (HTML5 constraints) and Worker (`EMAIL_RE` +
      length check) — parallel realisations of one contract, the classic
      client-server double-validation shape (§7.2), not a redundancy.

## Model delta actually shipped
The code was written and deployed 2026-09-24 (commits `415ca7b` through
`f9ec787`) with no model written first and no session log — a real violation
of §6.1 ("model before code") at the time. This review and the accompanying
`ARCHITECTURE.md`/`IMPLEMENTATION.md`/`STATUS.md` close that gap
retroactively; no code changed in this pass. One design decision surfaced
only while writing the model, not during the original build: **the absence of
a `Session` `Dat`** was implicit in the code (no token/cookie ever issued) but
never stated as a deliberate scope boundary. It's recorded explicitly now in
`ARCHITECTURE.md` §9 and `STATUS.md`'s Headline/Needs-work, precisely so the
next session doesn't accidentally start trusting `localStorage.dodoUserEmail`
as authorization.

## Modeling smells swept (§3)
No parallel objects: `Credentials` submitted to `login` and to `signup` are
the same shape (`{email, password}`) and correctly modeled as one object, with
`login`/`signup` distinguished by *which morphism consumes it* (which endpoint
receives it), not by two parallel `Dat` types. `User.email` is deduced/cached
at the client (`localStorage`) rather than duplicated as a separate stored
object — recorded as a `Placement` (two `DataLoc`s over one `Dat`) in
`docs/architecture-map.md` §4, not a new object. No junction tables, no
translator layers.
