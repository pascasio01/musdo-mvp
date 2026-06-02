---
name: MUSVORA AI as nav destination
description: AI is a centered fixed bottom-nav tab (not a floating FAB); how its panel state is decoupled and how the gold token resolves in the legacy-themed nav.
---

# MUSVORA AI is a navigation destination, not a floating button

Per the MUSVORA OS 2026 vision: the AI is the center of the app, so it lives as a
**fixed, centered tab** in the bottom nav (order: Home · Search · AI · Library · Vault),
in a reserved layout slot — never floating, never overlapping content.

## How it's wired
- Panel open/close state lives in `lib/aiPanel.tsx` (`AIPanelProvider` / `useAIPanel`),
  NOT inside any one component. `openPanel(triggerEl)` records the trigger so focus
  returns to it on close.
- `AppShell` mounts `AIPanelProvider` + renders `<MusvoraAIPanel/>`. `BottomNav`'s AI
  button calls `openPanel(e.currentTarget)`. The panel content/behavior is unchanged from
  the old FAB version — only the trigger moved.
- `AILogoMark` (the gold "M") is its own component, shared by the nav.

**Why decoupled:** the trigger (nav) and the panel (AppShell) are siblings; a context is
the only clean way for the nav to open a panel it doesn't own.

## Gold token outside GovernanceScope
The bottom nav renders in the **legacy** theme scope where `--gv-gold` is undefined (it's
scoped to `[data-ds="governance"]`). The AI button sets `data-ds="governance"` **directly
on the element** to resolve `--gv-*` tokens for itself + children.
**Do NOT** use `<GovernanceScope as="button">` for an interactive element: GovernanceScope
only forwards `children/as/className/style/fillBackground` — it silently DROPS `onClick`,
`type`, and `aria-*`, leaving the button inert.

## Motion
Breathing (`gvAiBreathe`) + internal light pulse (`gvAiPulse`) keyframes in
`governance.css`. Gated three ways: `@media (prefers-reduced-motion)`, the app's
`.reduce-motion` body class, and `settings.reduceMotion` (the animation classes simply
aren't applied). Keep all three in sync if you touch this.

## Known tradeoff
Profile was dropped from the bottom bar to honor the explicit 5-item spec. It's still a
working route but has no prominent global entry point — revisit if it becomes a real
access regression (candidate: avatar in the Home header).
