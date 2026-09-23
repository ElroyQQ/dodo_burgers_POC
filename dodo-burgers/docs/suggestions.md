# System suggestions (roll-up)

> Roll-up of every `<component>/suggestions.md`, highest payoff first. Detail
> lives in the linked file.

| # | Component | Rule (§) | Smell | Proposed change |
| --- | --- | --- | --- | --- |
| 1 | storefront | §5 Deduce-don't-store | `BuildState.total` stored during render, not computed at point of use | compute inline in the `addBuild` click handler instead of reading a cached `build.total` |
| 2 | storefront | §5 YAGNI | `totalEls` array-of-one in `renderCart` | collapse to a direct `document.getElementById("cartTotal")` reference |

Detail: [storefront/suggestions.md](storefront/suggestions.md)

## System-wide reductions
None — single-component repo, no cross-component consolidation is possible.
