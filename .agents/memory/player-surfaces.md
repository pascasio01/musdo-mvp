---
name: MUSVORA player surfaces
description: Two distinct "player" screens exist — don't confuse them when adding features.
---

# Two player surfaces

MUSVORA has **two separate player screens** that look related but are not:

1. **Cinematic music Player** — `/player/:id` (`src/pages/Player.tsx`).
   - Audience: listening experience. Uses **legacy dark-luxury tokens** (`var(--text-primary)`, `--glass-bg`, `--accent`, `--critical`), NOT GovernanceScope.
   - Data is **synchronous mock**, works for anonymous browsing. Per-song ownership/licensing/readiness/intelligence is derived in `src/data/assetIntelligence.ts`.
   - Tabs: Now Playing · Lyrics · Ownership · Licensing · Metadata. Cover/title/timeline/transport are persistent above the tab content.

2. **Governance Review player** — `/review/:id` (`src/pages/Review.tsx`).
   - Audience: institutional asset review. Uses **Governance DS** (GovernanceScope, navy/gold).
   - Data is **async**, loaded via `loadReviewAsset` in `src/services/governancePlayer.ts`, tied to auth/Vault.

**Why:** building player intelligence twice / styling the wrong one is the easy mistake. The cinematic player must stay legacy-token + sync + no-green; the Review player stays governance + async + Vault-backed.

**How to apply:** for music-listening / mini-player work → edit the cinematic Player and reuse `assetIntelligence.ts`. For Vault asset-governance work → edit Review and reuse `governancePlayer.ts`.
