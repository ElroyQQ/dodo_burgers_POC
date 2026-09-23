# Storefront — implementation map

> The functor ARCHITECTURE.md → code. Each object/morphism → the file:symbol
> that realises it. Keep in sync WITH the code (§6.3): a new morphism gets a
> row here in the same change that adds its code.

## Objects (Dat) → code
| Object | Form / shape | Realised at | State |
| --- | --- | --- | --- |
| `MenuItem[]` | `{id,name,tag,veg,price,desc,img}[]` | `index.html:MENU` | built |
| `BuilderOption[]` | `{patty,bun,sauce,topping}`, each `{id,label,price,img}[]` | `index.html:BUILDER` | built |
| `FaqEntry[]` | `{q,a}[]` | `index.html:FAQ` | built |
| `CartEntry[]` | `{name,price,meta}[]` | `index.html:cart` | built |
| `BuildState` | `{patty,bun,sauce,toppings[],total}` | `index.html:build` | built |

## Morphisms (Trn / relations) → code
| Morphism | Signature | Realising code | State |
| --- | --- | --- | --- |
| `renderMenu` | `MenuItem[] → DOM` | `index.html:renderMenu` | built |
| `renderBuilder` | `BuilderOption[] × BuildState → DOM × total` | `index.html:renderBuilder` | built |
| `renderPillRow` | `BuilderOption[] × BuildState → DOM` | `index.html:renderPillRow` | built |
| `renderBuilderPreview` | `BuildState → SVG` | `index.html:renderBuilderPreview` | built |
| `renderFaq` | `FaqEntry[] → DOM` | `index.html:renderFaq` | built |
| `addToCart` | `CartEntry → CartEntry[]` | `index.html:addToCart` | built |
| `renderCart` | `CartEntry[] → DOM × total` | `index.html:renderCart` | built |
| `money` | `number → string` | `index.html:money` | built |
| `toast` | `string → DOM` | `index.html:toast` | built |
| `openDrawer` / `closeDrawer` | `() → DOM` | `index.html:openDrawer` / `index.html:closeDrawer` | built |

## Composition rules → where enforced
| Rule (ARCHITECTURE §6) | Enforced at | Tested at |
| --- | --- | --- |
| `BuildState.total = Σ selected prices` | `index.html:renderBuilder` | no automated tests — repo has no test suite |
| `cartTotal = Σ(entry.price)` | `index.html:renderCart` | no automated tests — repo has no test suite |

## Notes / divergences
None found at scaffold time (2026-09-23). No test suite exists in this repo
(confirmed in `CLAUDE.md`) — composition rules are enforced by code only, not
verified by tests.
