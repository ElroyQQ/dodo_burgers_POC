# Auth — suggestions (category-theory derived)

> Deduced from ARCHITECTURE.md by FRAMEWORK rules. Each cites its rule and
> names the concrete change. Not applied — a backlog.

| # | Rule (§) | Smell found | Proposed change | Payoff |
| --- | --- | --- | --- | --- |
| 1 | §5 One source of truth | the two `validate` placements (ARCHITECTURE §7) define the email/password contract independently — browser HTML5 (`minlength="6"`, no max, native `type="email"` check) vs. Worker (`EMAIL_RE`, 6–200 chars) — and have already drifted (client never enforces the 200-char max; client's built-in email check isn't the same pattern as `EMAIL_RE`) | derive both from one declared source — e.g. embed the same regex/bounds as a small shared `<script>` constant read by both the form's client-side pre-check and (conceptually) documented as the contract `signup.js` enforces — the two placements can still exist (that duplication is intentional, §7.2), but the *values* shouldn't be hand-copied in two places | the server-side check stays the actual gate either way (this is UX-only, not a security fix), but a future bound change (e.g. raising the max password length) won't silently desync from the client-side hint |

## Detail

### 1. Client/server validation bound drift
`index.html`'s `#authPassword` input declares `minlength="6"` and no maximum;
`functions/api/signup.js`'s `EMAIL_RE` and `password.length < 6 || > 200`
check is the real gate. These are two honest placements of one `validate`
morphism (§7.2, ARCHITECTURE §7) — not a smell by themselves — but the
*bounds themselves* are two independently hand-maintained numbers with no
shared source, which is the §5 "one source of truth" smell: if the server
bound ever changes, the client hint has no mechanism forcing it to follow.
Low priority — the client-side copy is UX-only and the server enforces the
real contract regardless — but cheap to fix if this file is touched again.
