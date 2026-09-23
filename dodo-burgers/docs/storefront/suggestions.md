# Storefront — suggestions (category-theory derived)

> Deduced from ARCHITECTURE.md by FRAMEWORK rules. Each cites its rule and
> names the concrete change. Not applied — a backlog.

| # | Rule (§) | Smell found | Proposed change | Payoff |
| --- | --- | --- | --- | --- |
| 1 | §5 Deduce-don't-store | `renderBuilder` computes `total` then assigns it onto `build.total`, a mutable field on the same state object it was deduced from | return `total` from `renderBuilder` (or recompute inline in the `addBuild` click handler) instead of storing it back onto `BuildState` | `BuildState`'s own fields stay the only source of truth for selections; `total` stays visibly derived, not a field that could go stale if a mutation path ever skips `renderBuilder` |
| 2 | §5 YAGNI | `renderCart` wraps the single `#cartTotal` element in a one-item array (`totalEls`) and iterates it with `forEach` | collapse to a direct `document.getElementById("cartTotal").textContent = money(total)` | removes an abstraction built for multiple total-display elements that don't exist |

## Detail

### 1. `BuildState.total` as a stored deduction
`index.html:renderBuilder` computes `total` from the four current selections,
then does `build.total = total;` before calling `renderBuilderPreview()`. The
`addBuild` click handler later reads `build.total` to build the cart entry.
Because `build.total` is written during render rather than computed at the
point of use, a future code path that mutates `build.patty`/`build.bun`/etc.
without calling `renderBuilder` first would leave `build.total` stale —
currently impossible, since every mutation path goes through `renderBuilder`,
but the field exists as a stored copy of a deducible value with no explicit
reconciliation mechanism (§5).

### 2. `totalEls` array-of-one
`index.html:renderCart` declares `var totalEls = [document.getElementById("cartTotal")];`
and later `totalEls.forEach(function(el){ el.textContent = money(total); });`.
Only one element (`#cartTotal`) exists in the cart drawer; the array-and-forEach
shape only pays for itself once a second total display exists elsewhere on the
page. Per §5 YAGNI, remove the array until a genuine second call site appears.
