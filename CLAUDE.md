# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single self-contained static website for "Dodo Burgers," a fictional Singapore burger restaurant. The whole site — markup, CSS, and JavaScript — lives in one file: `index.html`. There is no build step, no package manager, and no dependencies to install.

## Running it

Open `index.html` directly in a browser (double-click it, or `open index.html` on macOS). There is no dev server, bundler, linter, or test suite configured in this repo.

## Architecture

Everything is inline in `index.html`, in three blocks in this order:

1. **`<style>`** — all CSS, using custom properties defined on `:root` (colors like `--lagoon-900`, `--bio-400`, `--coral-500`) for the ocean/lagoon color scheme. The site commits to a single dark theme (no light-mode variant).
2. **Markup** — header/nav, hero section with an inline SVG dodo illustration, a "field log" story section, a menu grid, a burger builder, an FAQ, and a footer, followed by the cart drawer/overlay markup.
3. **`<script>`** — a single IIFE containing all interactivity, with no external JS libraries:
   - `MENU`, `BUILDER` (patty/bun/sauce/topping options), and `FAQ` are static data arrays/objects near the top of the script — edit these to change menu items, prices, or FAQ copy.
   - `cart` (array) and `build` (object) hold the running state for the order cart and the burger-builder selections, respectively.
   - Render functions (`renderMenu`, `renderBuilder`, `renderFaq`, `renderCart`, `renderPillRow`) rebuild their DOM section from the data/state above; there is no framework or virtual DOM, so these fully re-render their target element on every state change.
   - The cart is in-memory only (no `localStorage`/backend) — it resets on page reload, and "Send to kitchen" just clears the cart and shows a toast rather than submitting anywhere.

Fonts (Fredoka, Manrope, Space Mono) are loaded from Google Fonts via `<link>` tags at the top of the file.
