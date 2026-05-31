---
name: Governance Design System
description: How MUSVORA's two design systems coexist and how to add the new one
---

MUSVORA runs **two visual systems at once, on purpose** (user chose gradual migration):

1. **Dark-luxury (legacy):** OLED black, glassmorphism, violet accent. Tokens in
   `src/styles/index.css` (`--bg`, `--accent`, `--glass-*`, etc.). Every pre-existing
   screen uses this. Do NOT restyle these screens unless explicitly asked.

2. **Governance (new):** institutional dark mode (Linear/Stripe/Notion/Bloomberg).
   Navy `#001F3F` + subtle gold `#D4AF37` + matte black `#0A0A0A`, Inter / Inter Tight.
   Tokens in `src/styles/governance.css`, all prefixed `--gv-*` and **scoped to
   `[data-ds="governance"]`** so they never leak into legacy screens.

**How to apply:** new modules (Vault, Readiness, Ownership Confidence, Recovery,
Passport, AI Auditor, AI DJ) wrap their root in `<GovernanceScope>` and build with the
primitives in `src/components/governance/` (`Button`, `Card`, `Badge`, `StatTile`,
`SectionHeader`, `Wordmark`). Inter is loaded globally in `index.html` but only applied
inside the governance scope.

**Why scoped, not global:** the user explicitly rejected a global visual flip — legacy
screens must keep working as-is. Token scoping is what guarantees additive, non-breaking
migration. Green (`#27AE60`) is allowed here strictly as a status color, despite the
legacy "no green" preference — that rule only governs the dark-luxury brand surfaces.
