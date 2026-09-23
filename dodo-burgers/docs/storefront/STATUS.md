# Storefront — status

> Reconciles ARCHITECTURE.md (intent) vs IMPLEMENTATION.md (code). Updated
> whenever code changes what is done (§6.5).

## Headline
Built and complete for its stated scope — a fully client-side ordering demo
with no backend. The only "gap" (no real order submission) is by design.

## Completeness
| Object / morphism | State | Notes |
| --- | --- | --- |
| `renderMenu` | ✅ built | |
| `renderBuilder` | ✅ built | |
| `renderBuilderPreview` | ✅ built | diff-against-previous-state animation is load-bearing — see `CLAUDE.md` session history point 8; don't regress to animating every layer on every render |
| `renderFaq` | ✅ built | |
| `addToCart` / `renderCart` | ✅ built | in-memory only, resets on reload — intentional |
| `toast` | ✅ built | |

## Needs work
1. No automated tests exist for the composition rules (`BuildState.total`,
   `cartTotal`) — currently relies on manual/visual verification. Not
   currently planned; flagged for visibility only.

## Coherence
No §4.5 law is FAILing or advisory-only. See `ARCHITECTURE.md` §9 for the one
law worth restating explicitly (placement honesty re: "Send to kitchen").

## Where to dig
- Model: `ARCHITECTURE.md` · Code map: `IMPLEMENTATION.md`
- In flight: `openspec/changes/` (none as of scaffold) · Reviews: `reviews/` · Notes: `general/`
