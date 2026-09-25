# Auth — status

> Reconciles ARCHITECTURE.md (intent) vs IMPLEMENTATION.md (code). Updated
> whenever code changes what is done (§6.5).

## Headline
Built and working: signup/login backed by Cloudflare D1, rate-limited, with
hardened password hashing. **Headline gap: no session/token is issued** — the
client's "logged in as X" state is an unauthenticated display flag, not
enforced auth. Not a live bug (nothing is gated behind it yet), but the next
feature that wants real per-user behavior needs a `Session` `Dat` first.

## Completeness
| Object / morphism | State | Notes |
| --- | --- | --- |
| `User` (D1 `users`) | ✅ built | |
| `AuthAttempt` (D1 `auth_attempts`) | ✅ built | |
| `signup` | ✅ built | rate-limited, validated, unique-email enforced at the DB |
| `login` | ✅ built | generic 401 on both no-such-user and wrong-password |
| `hashPassword` / `timingSafeEqual` | ✅ built | PBKDF2 100k iterations — see Note below |
| `checkRateLimit` / `clientIp` | ✅ built | fixed-window, D1-backed, no extra service |
| `Session` / auth token | ⬜ unbuilt | not modeled — see Headline; no OpenSpec change in flight for it |

## Needs work
1. **No session/token.** If a future feature needs to gate access (saved
   builds, order history, anything per-user), add a real `Session` `Dat` and a
   signed `Trm` (cookie or bearer token) — do not extend
   `localStorage.dodoUserEmail` to authorize anything; it currently proves
   nothing.
2. **No automated tests** (repo-wide gap — matches `storefront/STATUS.md`).
   All composition rules above are verified manually/live only.
3. PBKDF2 at 100,000 iterations, below OWASP's 210,000 minimum — a documented,
   deliberate platform-CPU-limit tradeoff (ARCHITECTURE §6 rule 5), not an
   oversight. Revisit only if Cloudflare Pages Functions' CPU-time limit
   changes.

## Coherence
No §4.5 law is FAILing. Laws 1/2/4/6 are all non-vacuous and passing here —
see ARCHITECTURE.md §9 for the walkthrough, including the `validate`
double-placement (Law 6) and the mediated `storefront → auth` dependency
(Law 4). The missing-`Session` gap above is an absent feature, not a law
violation — nothing teleports or is mistyped; the capability simply doesn't
exist yet.

## Where to dig
- Model: `ARCHITECTURE.md` · Code map: `IMPLEMENTATION.md`
- In flight: `openspec/changes/` (none) · Reviews: `reviews/` · Notes: `general/`
