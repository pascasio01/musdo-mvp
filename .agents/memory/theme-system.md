---
name: Theme system
description: How MUSVORA themes are applied and the stale-CSS-var pitfall when adding new modes.
---

# Theme system

Themes live in `frontend/src/lib/theme.tsx`. Each theme is a `ThemeConfig` whose `vars` map is injected onto `document.documentElement` via inline `style.setProperty`. Persistence key is `musdo-theme-v1` (do NOT rename — `musdo-*` rule).

## Stale inline CSS var pitfall
`applyVars` sets vars as **inline** styles on `<html>`. Inline styles are never cleared between theme switches, so any var a theme sets but the next theme omits will **leak** (the old value persists).

**Rule:** every new theme must define the FULL var set, OR `applyVars` must re-assert that var unconditionally on every run.

**How to apply:** brand/status tokens (`--trust-navy`, `--value-gold`, `--success`, `--warning`, `--critical`) are re-asserted unconditionally in `applyVars` for exactly this reason (e.g. Light Professional's `--value-gold: #B88A00` must not linger when switching to a dark mode). `:root` in `index.css` only holds static fallbacks for first paint.

## System Auto
`themeId: 'system'` is not a static palette — `resolveTheme()` maps it to `institutional` (dark) or `light-pro` (light) via `matchMedia('(prefers-color-scheme: dark)')`. A `change` listener in `ThemeProvider` re-applies live, but only while `themeId === 'system'` (cleaned up otherwise). `currentTheme` stays the `'system'` config for picker highlight; applied vars come from the resolved theme.

## Light mode
Light themes set `colorScheme: 'light'` → `applyVars` sets `html[data-color-scheme="light"]`, which activates the Tailwind-class override block in `index.css` (sits outside `@layer` so it wins the cascade).

## Governance Design System is theme-aware via token overrides
`applyVars` also sets `root.dataset.theme = resolvedTheme.id`. Governance `--gv-*` tokens are hardcoded (Institutional Dark) in the base `[data-ds='governance']` block in `governance.css`; theme adaptation is done with MORE-SPECIFIC override blocks that only redefine surfaces/text/borders/shadows: `html[data-theme='pure-oled'] [data-ds='governance']` (true black) and `html[data-color-scheme='light'] [data-ds='governance']` (enterprise light). Brand/status accents (navy, gold, success/warning/danger) stay constant across themes on purpose. **Rule:** when adding a new governance token consumed by primitives, define it in the base block AND ensure light/oled overrides don't leave it visually wrong (gold is deepened to `#9a7d28` in light for legibility). System Auto needs no special case — `applyVars` feeds the resolved theme into both `data-theme` and `data-color-scheme`.
