# MUSDO MVP

**The Human Music Infrastructure** — a premium music platform built by Pascasio Emmanuel Reynoso Reyes.

## Overview

MUSDO is a platform where:
- **Listeners** discover and playlist human-verified music
- **Composers** protect and vault demos, lyrics, and songs
- **Artists/Producers** license songs through the Marketplace

## Tech Stack

- React 18 + TypeScript
- Vite (port 5000)
- TailwindCSS (dark luxury, glassmorphism)
- React Router v6
- Supabase (Auth + Storage + PostgreSQL)

## Project Structure

```
frontend/
  src/
    components/   # Reusable UI components
    pages/        # Route pages
    layouts/      # AppShell layout
    lib/          # Supabase client, Auth context, Player context
    types/        # TypeScript interfaces
    data/         # Mock data for MVP
    styles/       # Global CSS
```

## Key Pages

| Route | Page |
|---|---|
| `/` | Landing |
| `/login` | Login |
| `/register` | Register (2-step) |
| `/home` | Home (discover, search) |
| `/player/:id` | Full-screen player |
| `/vault` | Composer Vault (demos, lyrics, passports) |
| `/upload` | Upload demo or lyrics |
| `/market` | License Marketplace |
| `/passport/:id` | Song Passport (ownership proof) |
| `/profile` | User Profile |
| `/dashboard` | Composer Analytics Dashboard |

## Environment Variables

Set in `frontend/.env`:

```
VITE_SUPABASE_URL=https://ykueethgvubvpdqsuthp.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## User Preferences

- Dark luxury aesthetic, OLED black background
- Mobile-first, glassmorphism design
- No green (no Spotify similarity)
- Premium native-app feel
- Clean TypeScript, separated components
- Do not delete: README.md, PROJECT.md, ROADMAP.md, UI-CONCEPT.md, SYSTEM-ARCHITECTURE.md, DATABASE-SCHEMA.md
