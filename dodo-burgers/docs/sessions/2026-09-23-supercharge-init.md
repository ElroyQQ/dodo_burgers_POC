# 2026-09-23 — supercharge docs-tree scaffold (init)

## Decisions made
- Decomposed the repo into **one component**: `storefront` — the whole site is
  a single `index.html` file with no separable sub-boundaries (no server, no
  separate JS modules, no build step). No §3 consolidation was needed since
  there was only ever one candidate component.
- Modeled `Loc` as fully collapsed to one process (§7.1) — the browser tab. No
  `Trm` exists anywhere in this repo; every handoff is same-`Loc` (`Trn`).
- `graphify`'s code-only extraction produced an **empty graph** here — no
  `.js`/`.py`/etc. files exist for its tree-sitter grammars to parse, since
  this site's JS lives inline in `index.html`. Decomposition was done by
  direct reading of `index.html` and `CLAUDE.md`, not by community detection.

## Kept / discarded
- Kept the existing `CLAUDE.md` and `README.md` untouched — this docs-tree is
  additive, not a replacement for either.
- Discarded: nothing — there was only ever one candidate component, so no
  merge or split decision was needed.

## Open ends
- Two suggestions recorded in `storefront/suggestions.md` (deduce-don't-store
  on `BuildState.total`; a YAGNI array-of-one in `renderCart`) — not applied,
  backlog only.
- No automated test suite exists in this repo — composition rules
  (`BuildState.total`, `cartTotal`) are enforced by code only, not verified by
  tests. Flagged in `storefront/STATUS.md`, not acted on.

## Live execution state
None — this was a docs-only scaffold. No servers, jobs, or generated
artifacts outside `docs/`.

## Resume commands
```bash
cd dodo-burgers
openspec list --json          # confirm no in-flight changes exist
cat docs/STATUS.md            # system status roll-up
cat docs/storefront/STATUS.md # component status
```

Next `start` should read this file plus `docs/STATUS.md`, then proceed
normally — there is no in-flight OpenSpec change from this session, since
scaffolding the docs tree isn't itself a code change.
