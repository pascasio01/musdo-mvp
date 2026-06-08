---
name: Dark Luxury Glass System 2026
description: How premium glass is layered in MUSVORA and the light-mode token trap to avoid.
---

# Dark Luxury Glass System

Premium frosted-glass visual layer applied across surfaces (Home, Search, Discovery,
Vault, AI Core, Login, Settings). Two token families:

- Legacy/global: `.glass`, `.glass-strong`, `.glass-luxe` + `--glass-*` / `--glass-luxe-*`
  / `--glass-highlight` / `--glass-shadow` tokens in `index.css`. Unscoped → usable on any page.
- Governance-scoped: `.gv-glass` + `--gv-glass-*` tokens in `governance.css`, only inside `[data-ds="governance"]`.

Recipe for a glass surface: translucent bg + `backdrop-filter: blur(30–34px) saturate(140–150%)`
+ `box-shadow: <soft shadow>, inset 0 1px 0 0 <highlight>` (the inset top line IS the
"internal reflection"). `.glass-luxe` also adds a `::before` diagonal sheen.

**Why the inset highlight matters:** it is the cheap, always-on internal reflection;
prefer it over extra pseudo-elements on small/repeated cards.

## Light-mode token trap (caused a flagged regression)

`--glass-luxe-*`, `--glass-highlight`, `--glass-shadow` are tuned for dark mode
(white-on-dark). They are NOT defined by the ThemeProvider's injected vars, so without
an explicit override they keep dark values in light theme → glass goes near-invisible.

**How to apply:** any NEW global (unscoped) glass token must also get a light override
under `html[data-color-scheme="light"] { … }` in `index.css`. Governance glass already
has light overrides in its own scope; legacy/luxe must be done separately.

## Ambient depth

`AppShell` renders an always-on, ultra-subtle dynamic background (drifting radial
gradients using `--ambient-1/2/3`). Motion is gated by `settings.ambientAnimation &&
!settings.reduceMotion`. Login has its own ambient blobs — keep them token-driven
(`--ambient-*`), never hardcoded Tailwind color utilities (token-discipline rule).

**Accepted tradeoff:** many small `backdrop-filter` surfaces add mobile GPU cost. This
is an explicit product decision by the owner ("blur everywhere"); do not silently strip it.
