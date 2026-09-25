# System suggestions (roll-up)

> Roll-up of every `<component>/suggestions.md`, highest payoff first. Detail
> lives in the linked file.

| # | Component | Rule (§) | Smell | Proposed change |
| --- | --- | --- | --- | --- |
| 1 | storefront | §5 Deduce-don't-store | `BuildState.total` stored during render, not computed at point of use | compute inline in the `addBuild` click handler instead of reading a cached `build.total` |
| 2 | storefront | §5 YAGNI | `totalEls` array-of-one in `renderCart` | collapse to a direct `document.getElementById("cartTotal")` reference |
| 3 | auth | §5 One source of truth | client (`index.html`) and server (`functions/api/signup.js`) hand-duplicate the email/password validation bounds, and have already drifted (client has no max length, doesn't mirror the email regex) | derive both from one declared source instead of two hand-copied numbers |

Detail: [storefront/suggestions.md](storefront/suggestions.md) · [auth/suggestions.md](auth/suggestions.md)

## System-wide reductions
None yet with two components. Checked at the 2026-09-25 auth reconciliation:
`storefront`'s commerce/`Credentials`-shaped data and `auth`'s `Credentials`/
`User` are not candidates — they share no objects, so there's nothing to
collapse (§3 only applies when two "objects" turn out to be the same category
with different morphism sets, which isn't the case here).
