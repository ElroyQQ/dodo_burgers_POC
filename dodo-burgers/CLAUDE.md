# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single self-contained static website for "Dodo Burgers," a fictional Singapore burger restaurant. The whole site — markup, CSS, and JavaScript — lives in one file: `index.html`, plus a flat `images/` folder of photos it references by relative path. There is no build step, no package manager, and no dependencies to install. See [README.md](README.md) for the project-level overview, feature list, and full image credits.

## Running it

Open `index.html` directly in a browser (double-click it, or `open index.html` on macOS), or serve the folder (`python3 -m http.server`) if you want to sanity-check relative paths the way a real host would serve them. There is no dev server, bundler, linter, or test suite configured in this repo.

## Architecture

**Note:** this section describes the site's *current* (dark navy, horizontal-scroll, with login) structure. Points 1-9 of Session history below predate the redesign in point 10 and describe an earlier light/cream, vertical-scroll, footer-having version — kept as real history of the codebase, not a description of what's here now.

Everything is inline in `index.html` (no `<!DOCTYPE html>`/`<html>`/`<head>`/`<body>` wrapper — the file has always been served as a bare fragment and browsers tolerate it, but it's worth knowing if you're ever surprised by quirks-mode behavior):

1. **`<style>`** — all CSS. Dark navy / white alternating sections, one steel-blue accent — see [DESIGN.md](DESIGN.md) for the full system; this is not the light/cream/teal/coral original the file comments elsewhere might suggest.
2. **Markup** — a fixed `<header>` (logo, nav, and two `<details>` disclosures: Credits and the auth widget `#authBox`), then a horizontal `.track` of full-viewport panels (hero → Find the shop → why us → field log → menu → FAQ → builder), the cart drawer, and a fixed `.chase-bar` (chef-chasing-dodo scroll-progress animation). There is no footer — legal/credits live in the header's Credits disclosure.
3. **Three `<script>` blocks**, in order:
   - **Commerce/builder IIFE** — `MENU`, `BUILDER`, `FAQ` data; `cart`/`build` state; render functions (`renderMenu`, `renderBuilder`, `renderFaq`, `renderCart`); `toast()`; cart drawer open/close. No framework — render functions fully rebuild their target element on every state change. `renderPillRow` is a historical name still used internally — it renders clickable **photo swatches**, not text pills.
   - **Horizontal-track navigation IIFE** — wheel-to-sideways redirect, keyboard nav, anchor-link scrolling, `--header-h` `ResizeObserver`, and the chase-bar's scroll-progress animation. Explicitly written to be additive and not touch commerce/builder state.
   - **Auth IIFE** — login/signup/logout via `fetch("/api/login"|"/api/signup")` (see `functions/api/`), a `localStorage` flag (`dodoUserEmail`) for display-only session persistence across reloads. See "Auth" below for what this does and doesn't guarantee.

The cart itself is in-memory only (no backend) — it resets on page reload, and "Send to kitchen" just clears the cart and shows a toast rather than submitting an order anywhere; the login feature (see below) doesn't change this.

Fonts (Space Grotesk, Manrope, Space Mono) are loaded from Google Fonts via `<link>` tags at the top of the file.

## Auth (added 2026-09-24)

Login/signup/logout backed by Cloudflare D1 — see `functions/api/{login,signup}.js`, `functions/api/_hash.js` (PBKDF2 + constant-time compare — **do not raise iterations above 100,000 without live-testing a real request against the actual deployment first**; 210,000 silently exceeded Cloudflare's per-request CPU limit and crashed every signup/login that reached it, see point 11), and `functions/api/_ratelimit.js` (D1-backed fixed-window limiter, no external service). `schema.sql` defines the `users` and `auth_attempts` tables, applied manually via `wrangler d1 execute` — there's no migration tool or automated apply step.

This is a **display-only** session: `setLoggedIn`/`setLoggedOut` toggle the header UI and a `localStorage` flag, but nothing server-side is ever re-verified from a stored token on later requests. No feature in this repo currently gates real behavior on being logged in (contrast with the `dodo-burgers-vercel-supabase` fork, which does — see `SESSION.md`).

## Image policy

**Every image on this site must be a real, freely-licensed photograph, edited as needed — never an illustration, drawing, or AI-generated image.** This was an explicit, repeated instruction from the project owner. When adding or changing imagery:
- Source from Pexels (Pexels License, free for commercial use) or another clearly free/CC0 source (e.g. Wikimedia Commons).
- Photo edits (cropping, color grading, compositing multiple photos together with Pillow/numpy) are fine and expected — the `images/hero.jpg` and `images/logo.jpg` files are original composites built this way.
- Record credits in the header's Credits disclosure in `index.html` and in [README.md](README.md#image-credits) when adding new sourced images.

**Two explicit exceptions**: (1) the "Your build" preview in the builder section (`renderBuilderPreview()`) is a generated SVG illustration, not a photo — it redraws per ingredient combination, which a fixed photo set can't do; it only animates the layer(s) that changed since the last render (diffed against `prevBuildKey`), each with a glow flash colored to the option just picked — see point 8 below for why. (2) the chase-bar's chef/dodo/burger icons (scroll-progress animation along the bottom of the viewport) — see [DESIGN.md](DESIGN.md#signature-component-the-chase-bar). Neither is license to reintroduce illustration elsewhere.

## Session history

Summary of the major changes made in the most recent working session, in order, for context on *why* the site looks the way it does:

1. **Initial build** — dark ocean/lagoon-themed site with hand-drawn SVG illustrations (a dodo mascot, burger cross-section art) and a fictional backstory (rediscovered aquatic dodo off Singapore's Tuas reclaimed land).
2. **Burgers → real photos** — replaced the illustrated SVG burgers with licensed Pexels photos per item, on explicit instruction to stop using illustrations for anything food-related.
3. **Singaporean copy pass** — rewrote copy (FAQ, menu descriptions, footer) with local flavor after researching real Singapore burger sites for tone (e.g. Fatboy's, Two Blur Guys, The Goodburger) — added sambal/salted-egg/laksa/chilli-crab menu language, a halal-certification FAQ, and Tuas Link MRT references. Re-themed the whole site from dark to a light/cream palette on request.
4. **Dodo illustration → real photo** — replaced the SVG dodo mascot with a photo composite: since no photos of a live dodo exist, sourced a CC0 photo of an actual museum plaster/wax dodo reconstruction (Muséum national d'Histoire naturelle, Paris) and composited it against a real sunset photo of a Singapore port. Iterated through a few treatments (a "pinned field-specimen photo" collage, a mangrove-habitat composite to look more "alive" than a museum piece) before landing on the current version.
5. **Interactive builder** — converted "Build Your Own" from text/radio pill buttons to a fully photo-driven picker: sourced 13 individual ingredient photos (3 patties, 3 buns, 3 sauces, 4 toppings) so each option is a clickable image swatch with a selected-state checkmark, instead of a text label.
6. **Dodo compositing refinement** — moved the dodo from a separate "pinned photo" overlay to directly swimming in the water of the hero photo, at a corrected (much smaller, believable) scale relative to the background pier/cranes. Then fixed the lighting: the dodo sits in the same backlit position as the photo's pier posts (foreground, between camera and the low sun), so it needed to read as a near-silhouette with a thin warm rim light — not an evenly-lit studio cutout. Built with a proper multiply/screen-blend lighting pipeline (numpy) rather than flat color tinting, which preserves the subject's texture instead of flattening it.
7. **Docs + "your build" preview** — added README.md and this session-history section; removed the Singlish "lah" from the hero headline (back to "Extinct in 1681. Back on the menu now."); replaced the static `images/builder.jpg` photo in the builder summary with a generated, animated SVG illustration (`renderBuilderPreview()`) that redraws from the current bun/patty/sauce/topping selection on every change — the one explicit exception to the photo-only image policy above.
8. **Builder preview animation fix** — the first version of `renderBuilderPreview()` gave every layer a cumulative `animation-delay` and replayed the whole stack on every single click. With ~10+ layers this meant the top bun (last in the stack) could sit invisible for over a second after any change, which read as a bug (a piece of the burger going missing), not a nice animation. Rewrote it to diff the new build state against `prevBuildKey` (the previous bun/patty/sauce/toppings) and only animate the layer(s) that actually changed — each pops in with a quick scale bounce plus a `glow-shape` flash colored to match the option just picked (e.g. switching to a red sauce flashes red), while everything unchanged renders instantly with no animation. First render (`prevBuildKey === null`) never animates, to avoid a flashy pop on page load.
9. **Moved into its own subfolder** — a later session reorganized the parent directory into a multi-project workspace: this site's files (`index.html`, `images/`, `README.md`, this `CLAUDE.md`) moved from the parent folder's top level into `dodo-burgers/` via `git mv` (full commit history preserved — `git log`/`git blame` still work back through the move), alongside a new sibling `dividend-capture-analysis/` project and a root-level `CLAUDE.md` indexing all three. The reorg commit was pushed to this repo's existing GitHub remote (`ElroyQQ/dodo_burgers_POC`), which predates this reorg and was untouched by it. No content/behavior changes to the site itself in this session — purely a file-location move. If a future session's notes reference a path directly under `.../Claude projects/` instead of `.../Claude projects/dodo-burgers/`, that's why.

**Everything below is a later session's work — the visual redesign and layout change it references are real and current; points 1-9 above were simply never rewritten to match afterward, per the note at the top of "Architecture."** Full detail, including the Vercel/Supabase fork this project spawned, lives in [`SESSION.md`](SESSION.md).

10. **Redesign + horizontal-scroll + login feature** — replaced the light/cream/teal/coral look with the current dark navy "Engineered Reveal" system (see [DESIGN.md](DESIGN.md)); converted from vertical to horizontal-scroll with the chase-bar; scaffolded `supercharge` (OpenSpec + `docs/` — see `docs/STATUS.md`); added the Cloudflare D1 login/signup/logout feature described in "Auth" above, including live-debugging a production incident where raising PBKDF2 iterations to OWASP's recommended 210,000 silently exceeded Cloudflare's CPU limit and crashed every signup — reverted to 100,000, the highest value confirmed safe by testing a real (not fake-email-short-circuited) request against the actual deployment.
11. **Docs reconciled, stray CI fixed** — an OpenSpec change modeled the login feature into `docs/auth/`; merging its PR surfaced an unrelated `Workers Builds` CI check that had been failing on every push since a leftover plain Cloudflare Worker (created by mistake before this project was redone as a Pages project) was still connected to this repo's GitHub integration. Fixed by deleting that stray Worker service in the Cloudflare dashboard — an account-level action outside agent reach — then verifying with an empty commit that the stray check no longer triggers at all.
12. **`SESSION.md` added** — a full project-history document covering both this repo and the `dodo-burgers-vercel-supabase` fork from the very first commit onward, kept byte-identical in both repos since neither has a session-log convention covering the other.

If asked to touch the hero image again, read the "Image policy" section above first, and know that getting the lighting/scale to match the background photo is the hard part — see point 6 for what worked. If asked to touch the builder preview animation again, read point 8 first — the diff-against-previous-state approach is load-bearing, don't regress to animating every layer on every render. If asked to touch auth again, read the "Auth" section above first — don't raise PBKDF2 iterations without live-testing.
