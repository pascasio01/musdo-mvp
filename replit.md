# MUSVORA

**Music Asset Operating System** — a premium platform that transforms songs, compositions, masters, lyrics and rights into verifiable, protected and monetizable music assets. Built by Pascasio Emmanuel Reynoso Reyes.

> MUSVORA is **not** a music player and **not** a social network. It is infrastructure for music assets — closer to a professional bank for a creator's catalogue than an entertainment app.

## Core Philosophy

Every musical work flows through these layers, in order (never reversed):

1. **Vault** — professional digital custody
2. **Readiness** — how prepared the asset is to generate income
3. **Ownership Confidence** — verified contributors, splits, contracts
4. **Recovery** — surfacing potential revenue opportunities
5. **Passport** — portable ownership proof
6. **Licensing** — monetization

Guiding question before adding any feature: *does this increase the protection, readiness, ownership, or monetization of the music asset?* If no, it is not built.

## Overview

MUSVORA serves:
- **Listeners** discover and playlist human-verified music
- **Composers** vault and protect demos, lyrics, masters, stems and rights
- **Artists/Producers** license songs through the Marketplace

## Tech Stack

- React 18 + TypeScript
- Vite (port 5000)
- TailwindCSS
- React Router v6
- Supabase (Auth + Storage + PostgreSQL)

## Project Structure

```
frontend/
  src/
    components/
      governance/   # MUSVORA Governance Design System primitives (new modules)
      identity/     # Identity + social layer components
    pages/          # Route pages
    layouts/        # AppShell layout
    lib/            # Supabase client, Auth/Player/Identity contexts
    types/          # TypeScript interfaces
    data/           # Mock data for MVP
    styles/         # index.css (dark-luxury) + governance.css (governance tokens)
  db/               # Supabase SQL schemas
```

## Design System (gradual migration — IMPORTANT)

Two visual systems coexist intentionally:

1. **Dark-luxury (legacy):** OLED black, glassmorphism, violet accent. Tokens in `src/styles/index.css`. All existing screens keep this look. **Do not restyle existing screens** unless explicitly asked.

2. **MUSVORA Governance Design System (new):** institutional dark mode inspired by Linear / Stripe / Notion / Bloomberg. Deep navy (`#001F3F`) trust tones, subtle gold (`#D4AF37`) accents, matte black (`#0A0A0A`) base, Inter / Inter Tight typography, enterprise hierarchy. Tokens in `src/styles/governance.css`, scoped to `[data-ds="governance"]`.

   - New modules opt in by wrapping their root in `<GovernanceScope>` (`src/components/governance/`).
   - Primitives available: `Wordmark`, `Button`, `Card`, `Badge`, `StatTile`, `SectionHeader`.
   - Governance palette: matte black `#0A0A0A`, white `#FFFFFF`, navy `#001F3F`, gold `#D4AF37`, green `#27AE60`, red `#E74C3C`, yellow `#F39C12`.

Migration is gradual: build new modules in governance, leave legacy screens working, migrate older screens later only when requested.

## Future Modules (architecture prepared, not yet implemented)

Vault · Readiness Center · Ownership Confidence (+ Ownership Graph) · Recovery Center · Passport · AI Auditor · AI DJ.

The AI never composes or makes legal decisions automatically — it audits, flags risks, suggests, and prepares documents, always requiring human confirmation.

## Key Pages

| Route | Page |
|---|---|
| `/` | Landing |
| `/login` | Login |
| `/register` | Register (2-step) |
| `/home` | Home (discover, search) |
| `/player/:id` | Full-screen player |
| `/vault` | Composer Vault |
| `/upload` | Upload demo or lyrics |
| `/market` | License Marketplace |
| `/passport/:id` | Song Passport |
| `/profile` | User Profile |
| `/dashboard` | Composer Analytics Dashboard |

## Environment Variables

Set in `frontend/.env`:

```
VITE_SUPABASE_URL=https://ykueethgvubvpdqsuthp.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Engineering Conventions

- **Never rename `musdo-*` storage identifiers.** localStorage keys, the Supabase `storageKey`/client header, and the service-worker cache namespace all use the `musdo-` prefix. These are persistence keys, not branding — renaming them logs users out and wipes saved settings. Brand text was migrated MUSDO→MUSVORA in UI/metadata only.
- Clean TypeScript, separated components, no hardcoded colors (use design tokens / CSS vars).

## User Preferences

- Premium, professional, native-app feel (institutional, not entertainment)
- Mobile-first
- No green/Spotify similarity in the legacy dark-luxury surfaces (note: the governance system intentionally uses green `#27AE60` strictly as a status color, never as brand)
- Incremental, non-destructive changes — never rebuild from scratch, never delete existing functionality, never change business logic without justification
- One sprint at a time
- Do not delete: README.md, PROJECT.md, ROADMAP.md, UI-CONCEPT.md, SYSTEM-ARCHITECTURE.md, DATABASE-SCHEMA.md
