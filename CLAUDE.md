# CLAUDE.md

This directory is a workspace holding several independent projects, each in its own subfolder. There is no shared code, build step, or dependency between them — treat each subfolder as its own self-contained project and read *its own* `CLAUDE.md` before working in it; this file is just the index.

## Projects

- **[dodo-burgers/](dodo-burgers/CLAUDE.md)** — a static single-page website for a fictional Singapore burger restaurant ("Dodo Burgers"). Plain HTML/CSS/JS, no build step. Tracked in *this* directory's git repo.
- **[dividend-capture-analysis/](dividend-capture-analysis/CLAUDE.md)** — a Python research/backtesting tool for a dividend-capture trading strategy (GARCH-filtered Markov Monte Carlo simulation), with a generated HTML dashboard. Tracked in *this* directory's git repo.
- **[nuzzle-pet-care/](nuzzle-pet-care/CLAUDE.md)** — a static single-page website for a fictional remote pet-sitting company ("Nuzzle"). Plain HTML/CSS/JS, no build step. **This is its own separate git repository** (`github.com/ElroyQQ/nuzzle_pet_care_POC`, deployed live via GitHub Pages) that happens to live inside this folder tree — it is intentionally excluded from this directory's `.gitignore` and must never be `git add`ed from here. Always run git commands for it from inside `nuzzle-pet-care/`, not from this directory.

## Working across projects

- `cd` into the relevant subfolder before doing anything project-specific — commands run from here (like `git status`, `git add`) apply to *this* directory's repo, which only tracks `dodo-burgers/` and `dividend-capture-analysis/`.
- Don't move files between project folders without checking both projects' `CLAUDE.md`/`README.md` for references first — each site's image/asset paths are relative to its own folder.
- If a project here appears to reference a file that doesn't exist, check whether it was meant to be a sibling project's asset before assuming it's missing — see `nuzzle-pet-care/video/`'s history for an example of a file that had drifted to the wrong folder.
