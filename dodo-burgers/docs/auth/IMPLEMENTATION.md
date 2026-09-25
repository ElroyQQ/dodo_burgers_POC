# Auth — implementation map

> The functor ARCHITECTURE.md → code. Each object/morphism → the file:symbol
> that realises it. Keep in sync WITH the code (§6.3): a new morphism gets a
> row here in the same change that adds its code.

## Objects (Dat) → code
| Object | Form / shape | Realised at | State |
| --- | --- | --- | --- |
| `User` | `{id, email, password_hash, salt, created_at}` | `schema.sql:users` (D1 table) | built |
| `AuthAttempt` | `{key, count, window_start}` | `schema.sql:auth_attempts` (D1 table) | built |

## Morphisms (Trn / relations) → code
| Morphism | Signature | Realising code | State |
| --- | --- | --- | --- |
| `signup` | `Credentials → User ⊸` | `functions/api/signup.js:onRequestPost` | built |
| `login` | `Credentials → 𝔹 ⊸` | `functions/api/login.js:onRequestPost` | built |
| `hashPassword` | `(𝕊, 𝕊?) → {hash, salt}` | `functions/api/_hash.js:hashPassword` | built |
| `timingSafeEqual` | `(𝕊, 𝕊) → 𝔹` | `functions/api/_hash.js:timingSafeEqual` | built |
| `checkRateLimit` | `(key, limit, window) → 𝔹` | `functions/api/_ratelimit.js:checkRateLimit` | built |
| `clientIp` | `Request → 𝕊` | `functions/api/_ratelimit.js:clientIp` | built |

## Composition rules → where enforced
| Rule (ARCHITECTURE §6) | Enforced at | Tested at |
| --- | --- | --- |
| `signup = insert ∘ hashPassword` (raw password never stored) | `functions/api/signup.js:onRequestPost` | no automated tests — manually verified (DB row inspected, only `password_hash`/`salt` present) |
| `login` match iff `timingSafeEqual(hashPassword(password, user.salt).hash, user.password_hash)` | `functions/api/login.js:onRequestPost` | no automated tests — manually verified live against the deployed D1 instance (correct password accepted, wrong password + unknown email both 401 with identical body) |
| `users.email` unique, DB-enforced | `schema.sql:users` (`UNIQUE NOT NULL`) + `functions/api/signup.js:onRequestPost` (catch → 409) | manually verified (signing up the same email twice → 409, no overwrite) |
| rate limit: login 10/60s/IP, signup 5/3600s/IP | `functions/api/_ratelimit.js:checkRateLimit`, called from `functions/api/login.js` and `functions/api/signup.js` | manually verified live (429 after threshold reached) — no automated tests |
| `validate` placed twice (browser + Worker) | `index.html` (`#authEmail`/`#authPassword` `required`/`minlength`, storefront component) + `functions/api/signup.js:onRequestPost` (`EMAIL_RE`, length 6–200) | manually verified — server-side check independently rejects malformed input even with the client constraint bypassed (devtools) |
| PBKDF2 iterations = 100,000 (Note: exception, ARCHITECTURE §6 rule 5) | `functions/api/_hash.js:hashPassword` | confirmed live: 210,000 iterations threw `"Worker threw exception"` (Cloudflare Pages Functions CPU-time limit); 100,000 verified to complete |

## Trm (ARCHITECTURE §7/§9, ports)
| Trm | Carries | Realised at | State |
| --- | --- | --- | --- |
| `POST /api/signup` | request: `Credentials` · response: `User`-derived `{ok,email}` or `{error}` | `functions/api/signup.js:onRequestPost`; called from `index.html` (storefront's auth-panel form submit handler) | built |
| `POST /api/login` | request: `Credentials` · response: `{ok,email}` or `{error}` | `functions/api/login.js:onRequestPost`; called from `index.html` (storefront's auth-panel form submit handler) | built |

## Notes / divergences
**Retroactive reconciliation (2026-09-25):** this component was built
2026-09-24 (commits `415ca7b`…`f9ec787`) but never modeled or logged at the
time — the prior session's `end` pass closed clean before this work happened.
No code changed in this reconciliation pass; only these docs were added/updated.

**No `Session` `Dat`** — see ARCHITECTURE.md §9. `login`/`signup` issue no
token or cookie; the client's `localStorage.dodoUserEmail` (storefront
component) is a display-only cache of the last successful response's email,
not a verified session. Flagged in `STATUS.md`, not modeled as a law failure
since nothing currently depends on it for authorization.

`_headers`'s CSP (`connect-src 'self'`) already permits same-origin `fetch`
calls to `/api/*` — no config gap there.
