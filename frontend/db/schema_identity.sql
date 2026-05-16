-- ============================================================================
-- MUSDO Identity + Social Layer — Supabase Schema
-- ----------------------------------------------------------------------------
-- Strict separation between PUBLIC identity (alias, bio, aura, playlists,
-- emotional tags) and PRIVATE identity (legal name, publishing entity, IPI,
-- tax id, payout currency).
--
-- Public surfaces NEVER expose anything from `private_identity`. Access is
-- restricted via RLS to: the owner themselves, parties to an active license
-- (joined separately), and the supreme_owner / admin roles.
-- ============================================================================

-- ─── Extensions ──────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─── 1. profiles (extends existing) ──────────────────────────────────────────
-- Assumes a `profiles` table already exists. We only ADD the public-identity
-- columns we need without rewriting the table.
alter table if exists public.profiles
  add column if not exists handle text unique,
  add column if not exists header_image_url text,
  add column if not exists profile_aura text default 'velvet_violet'
    check (profile_aura in (
      'velvet_violet','midnight_blue','amber_warmth',
      'crimson_dusk','forest_dawn','pearl_neutral'
    )),
  add column if not exists accent_color text,
  add column if not exists emotional_status text,
  add column if not exists emotional_tags text[] default '{}'::text[];

-- ─── 2. creator_identity (PUBLIC FACING extras) ──────────────────────────────
create table if not exists public.creator_identity (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  tagline text,
  dominant_moods text[] default '{}'::text[],
  prime_hour text check (prime_hour in ('morning','afternoon','evening','late_night')),
  texture text check (texture in ('minimal','organic','layered','cinematic','raw')),
  updated_at timestamptz not null default now()
);

-- ─── 3. private_identity (PRIVATE — legal / publishing / payout) ─────────────
-- This table is intentionally separate from profiles so RLS can lock it down
-- independently. Never join it into a public profile API response.
create table if not exists public.private_identity (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  legal_name text not null,
  legal_email citext,
  publishing_entity text,
  pro text check (pro in ('ASCAP','BMI','SESAC','SACM','SGAE','SOCAN','OTHER')),
  ipi_number text,
  tax_id text,
  payout_currency text default 'USD',
  ownership_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── 4. follows (resonance graph) ────────────────────────────────────────────
create table if not exists public.follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  resonance_score numeric(3,2) check (resonance_score between 0 and 1),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);
create index if not exists follows_following_idx on public.follows(following_id);
create index if not exists follows_follower_idx on public.follows(follower_id);

-- ─── 5. playlists ────────────────────────────────────────────────────────────
create table if not exists public.playlists (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  subtitle text,
  cover_url text,
  atmosphere text,
  mood_signature text[] default '{}'::text[],
  accent_color text,
  track_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.playlist_visibility (
  playlist_id uuid primary key references public.playlists(id) on delete cascade,
  visibility text not null default 'public'
    check (visibility in ('public','unlisted','followers_only','private','creator_only'))
);

-- ─── 6. user_settings (privacy + customization) ──────────────────────────────
create table if not exists public.user_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  -- privacy
  hide_listening_activity boolean not null default false,
  hide_recently_played boolean not null default false,
  private_session boolean not null default false,
  hidden_identity boolean not null default false,
  hide_social_counts boolean not null default false,
  allow_licensing_dms boolean not null default true,
  -- customization
  listening_mode text not null default 'public'
    check (listening_mode in ('public','private_session','invisible')),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- creator_identity: anyone can SELECT (public), only owner can write.
alter table public.creator_identity enable row level security;
drop policy if exists "creator_identity_select_all" on public.creator_identity;
drop policy if exists "creator_identity_self_write" on public.creator_identity;
create policy "creator_identity_select_all" on public.creator_identity
  for select using (true);
create policy "creator_identity_self_write" on public.creator_identity
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- private_identity: ONLY the owner or admin/supreme_owner. Never public.
alter table public.private_identity enable row level security;
drop policy if exists "private_identity_self_only" on public.private_identity;
drop policy if exists "private_identity_admin" on public.private_identity;
create policy "private_identity_self_only" on public.private_identity
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "private_identity_admin" on public.private_identity
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin','supreme_owner')
    )
  );

-- follows: anyone can read (resonance is public); only follower can write.
alter table public.follows enable row level security;
drop policy if exists "follows_read_all" on public.follows;
drop policy if exists "follows_self_write" on public.follows;
create policy "follows_read_all" on public.follows for select using (true);
create policy "follows_self_write" on public.follows
  for all using (auth.uid() = follower_id) with check (auth.uid() = follower_id);

-- playlists: visibility-aware read; only owner writes.
alter table public.playlists enable row level security;
alter table public.playlist_visibility enable row level security;
drop policy if exists "playlists_visibility_read" on public.playlists;
drop policy if exists "playlists_self_write" on public.playlists;
drop policy if exists "playlist_visibility_read" on public.playlist_visibility;
drop policy if exists "playlist_visibility_self_write" on public.playlist_visibility;

create policy "playlists_visibility_read" on public.playlists
  for select using (
    -- owner always sees
    auth.uid() = owner_id
    or exists (
      select 1 from public.playlist_visibility v
      where v.playlist_id = playlists.id
        and (
          v.visibility in ('public','unlisted')
          or (v.visibility = 'followers_only' and exists (
            select 1 from public.follows f
            where f.follower_id = auth.uid() and f.following_id = playlists.owner_id
          ))
        )
    )
  );
create policy "playlists_self_write" on public.playlists
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "playlist_visibility_read" on public.playlist_visibility
  for select using (true);
create policy "playlist_visibility_self_write" on public.playlist_visibility
  for all using (
    exists (select 1 from public.playlists p where p.id = playlist_id and p.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.playlists p where p.id = playlist_id and p.owner_id = auth.uid())
  );

-- user_settings: strictly self.
alter table public.user_settings enable row level security;
drop policy if exists "user_settings_self_only" on public.user_settings;
create policy "user_settings_self_only" on public.user_settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- VIEWS — public-safe surfaces
-- ============================================================================

-- public_identity view: alias / bio / aura / signature WITHOUT legal data.
-- Frontend should query this view, never the raw private_identity table.
create or replace view public.public_identity as
select
  p.id              as user_id,
  p.username        as alias,
  p.handle,
  p.bio,
  p.avatar_url,
  p.header_image_url,
  p.profile_aura    as aura,
  p.accent_color,
  p.emotional_status,
  p.emotional_tags,
  p.verified_artist,
  p.human_verified  as verified_human,
  ci.tagline,
  ci.dominant_moods,
  ci.prime_hour,
  ci.texture
from public.profiles p
left join public.creator_identity ci on ci.user_id = p.id
where coalesce(
  (select us.hidden_identity from public.user_settings us where us.user_id = p.id),
  false
) = false;
