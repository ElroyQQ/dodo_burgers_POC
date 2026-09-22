# CLAUDE.md

This directory is a workspace holding several independent projects, each in its own subfolder. There is no shared code, build step, or dependency between them — treat each subfolder as its own self-contained project and read *its own* `CLAUDE.md` before working in it; this file is just the index.

## Projects

- **[dodo-burgers/](dodo-burgers/CLAUDE.md)** — a static single-page website for a fictional Singapore burger restaurant ("Dodo Burgers"). Plain HTML/CSS/JS, no build step. Tracked in *this* directory's git repo (`github.com/ElroyQQ/dodo_burgers_POC`).
- **[dividend-capture-analysis/](dividend-capture-analysis/CLAUDE.md)** — a Python research/backtesting tool for a dividend-capture trading strategy (GARCH-filtered Markov Monte Carlo simulation), with a generated HTML dashboard. **Its own separate git repository** (`github.com/ElroyQQ/dividend-capture-analysis`) — excluded from this directory's `.gitignore`, never `git add`ed from here.
- **[nuzzle-pet-care/](nuzzle-pet-care/CLAUDE.md)** — a static single-page website for a fictional remote pet-sitting company ("Nuzzle"). Plain HTML/CSS/JS, no build step. **Its own separate git repository** (`github.com/ElroyQQ/nuzzle_pet_care_POC`, deployed live via GitHub Pages) — same rule as above.

## Working across projects

- `cd` into the relevant subfolder before doing anything project-specific — commands run from here (like `git status`, `git add`) apply to *this* directory's repo, which only tracks `dodo-burgers/`. `dividend-capture-analysis/` and `nuzzle-pet-care/` are separate repos; always run their git commands from inside their own folders.
- Don't move files between project folders without checking both projects' `CLAUDE.md`/`README.md` for references first — each site's image/asset paths are relative to its own folder.
- If a project here appears to reference a file that doesn't exist, check whether it was meant to be a sibling project's asset before assuming it's missing — see `nuzzle-pet-care/video/`'s history for an example of a file that had drifted to the wrong folder.
