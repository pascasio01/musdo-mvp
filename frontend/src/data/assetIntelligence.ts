/**
 * MUSVORA — Asset Intelligence (Elite Player V1).
 *
 * MOCK ONLY, SYNCHRONOUS. Derives ownership / licensing / readiness signals
 * deterministically from a `Song` so the cinematic Player can render Ownership,
 * Licensing and Intelligence panels for ANY song (including anonymous browsing)
 * without async loading, auth, or Vault coupling.
 *
 * AI data rules (see replit.md): all output is ASSISTANCE, not legal
 * determination. Use honest language (Suggested · Requires Confirmation ·
 * Potential). Never claim "Legally Verified" or "Certified Ownership".
 */
import type { Song } from '../types'
import { READINESS_ASSETS } from './readiness'

/** Player-scoped status tone (legacy dark-luxury — no green, no Spotify look). */
export type SignalTone = 'good' | 'warn' | 'risk' | 'info' | 'muted'

export interface StatusValue {
  value: string
  tone: SignalTone
}

export interface IntelligenceSignal {
  id: string
  label: string
  tone: SignalTone
  /** lucide icon key resolved in IntelligenceBar */
  icon: 'shield' | 'alert' | 'spark' | 'trend' | 'lock'
}

export interface OwnershipInsight {
  confidence: number
  status: StatusValue
  rightsHolder: StatusValue
  splitSheet: StatusValue
  copyright: StatusValue
  passport: StatusValue
  contributors: { name: string; percent: number }[]
  gaps: string[]
}

export interface LicensingInsight {
  available: boolean
  readiness: number
  marketplace: StatusValue
  opportunityMatch: number
  syncMatches: number
  commercialMatches: number
  pendingRequests: number
  suggestedMarkets: string[]
  recommendedAction: string
}

/* ── helpers ─────────────────────────────────────────────────── */

function seedFrom(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return h
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)))
}

export function scoreTone(score: number): SignalTone {
  if (score >= 80) return 'good'
  if (score >= 55) return 'warn'
  return 'risk'
}

function splitSum(song: Song): number | null {
  const split = song.credits?.royalty_split
  if (!split || split.length === 0) return null
  return split.reduce((a, s) => a + s.percent, 0)
}

/* ── readiness ───────────────────────────────────────────────── */

export function readinessScore(song: Song): number {
  const match = READINESS_ASSETS.find(a => a.title === song.title)
  if (match) return match.score
  let r = 40
  if (song.verified_rights_holder) r += 20
  if (song.human_verified) r += 15
  if (song.credits?.copyright_owner) r += 10
  if (song.licensing_status === 'available') r += 12
  return clamp(r)
}

/* ── ownership ───────────────────────────────────────────────── */

export function ownershipConfidence(song: Song): number {
  let c = 28
  if (song.verified_rights_holder) c += 34
  if (song.human_verified) c += 16
  const sum = splitSum(song)
  if (sum !== null) c += sum === 100 ? 18 : 8
  if (song.licensing_status === 'available') c += 6
  return clamp(c)
}

export function getOwnershipInsight(song: Song): OwnershipInsight {
  const confidence = ownershipConfidence(song)
  const sum = splitSum(song)

  const rightsHolder: StatusValue = song.verified_rights_holder
    ? { value: 'Verified', tone: 'good' }
    : { value: 'Unverified', tone: 'warn' }

  const splitSheet: StatusValue =
    sum === 100 && song.verified_rights_holder
      ? { value: 'Signed', tone: 'good' }
      : sum !== null
        ? { value: 'Partial', tone: 'warn' }
        : { value: 'Missing', tone: 'risk' }

  const copyright: StatusValue = song.verified_rights_holder
    ? { value: 'Registered', tone: 'good' }
    : { value: 'Pending', tone: 'warn' }

  const passport: StatusValue =
    song.human_verified && song.verified_rights_holder
      ? { value: 'Issued', tone: 'good' }
      : { value: 'Not Issued', tone: 'warn' }

  const contributors = (song.credits?.royalty_split ?? []).map(s => ({
    name: s.name,
    percent: s.percent,
  }))

  const gaps: string[] = []
  if (splitSheet.tone !== 'good') gaps.push('Confirm contributor splits and collect signatures')
  if (copyright.tone !== 'good') gaps.push('Register composition and document master rights')
  if (passport.tone !== 'good') gaps.push('Request human verification to issue the Passport')
  if (sum !== null && sum !== 100) gaps.push('Royalty split does not total 100% — review allocations')

  return {
    confidence,
    status: { value: `${confidence}`, tone: scoreTone(confidence) },
    rightsHolder,
    splitSheet,
    copyright,
    passport,
    contributors,
    gaps,
  }
}

/* ── licensing ───────────────────────────────────────────────── */

function marketplaceStatus(song: Song): StatusValue {
  switch (song.licensing_status) {
    case 'available': return { value: 'Listed', tone: 'good' }
    case 'sold': return { value: 'Licensed', tone: 'good' }
    case 'licensing_only': return { value: 'Licensing Only', tone: 'good' }
    case 'pending': return { value: 'Pending', tone: 'warn' }
    case 'private':
    default: return { value: 'Private', tone: 'muted' }
  }
}

const MARKET_BY_GENRE: { match: RegExp; markets: string[] }[] = [
  { match: /bachata|salsa|merengue|latin/i, markets: ['Sync · TV & Film', 'Dance & Live Events', 'Latin Editorial Playlists'] },
  { match: /pop/i, markets: ['Sync · Advertising', 'Streaming Playlists', 'Social & Short-Form'] },
  { match: /urban|trap|reggaeton/i, markets: ['Sync · Streaming Series', 'Brand Campaigns', 'Club & DJ Pools'] },
]

function suggestedMarkets(song: Song): string[] {
  const found = MARKET_BY_GENRE.find(m => m.match.test(song.genre ?? ''))
  return found ? found.markets : ['Sync · TV & Film', 'Streaming Playlists', 'Brand Campaigns']
}

export function getLicensingInsight(song: Song): LicensingInsight {
  const available = song.licensing_status === 'available'
  const readiness = readinessScore(song)
  const confidence = ownershipConfidence(song)
  const seed = seedFrom(song.id)

  const opportunityMatch = clamp(readiness * 0.5 + confidence * 0.45 + (available ? 5 : 0))
  const syncMatches = available ? 1 + (seed % 4) : 0
  const commercialMatches = available ? seed % 3 : 0
  const pendingRequests = available ? seed % 3 : 0

  let recommendedAction: string
  if (!available) recommendedAction = 'List this asset in the Marketplace to surface licensing opportunities'
  else if (confidence < 75) recommendedAction = 'Confirm ownership before accepting licensing offers'
  else recommendedAction = 'Ready to receive licensing offers'

  return {
    available,
    readiness,
    marketplace: marketplaceStatus(song),
    opportunityMatch,
    syncMatches,
    commercialMatches,
    pendingRequests,
    suggestedMarkets: suggestedMarkets(song),
    recommendedAction,
  }
}

/* ── intelligence signals (discrete, while playing) ──────────── */

export function getIntelligenceSignals(song: Song): IntelligenceSignal[] {
  const o = getOwnershipInsight(song)
  const l = getLicensingInsight(song)
  const readiness = l.readiness
  const signals: IntelligenceSignal[] = []

  if (l.available && o.confidence >= 75 && readiness >= 80) {
    signals.push({ id: 'monetize', label: 'Ready for monetization', tone: 'good', icon: 'trend' })
  }
  if (o.splitSheet.tone !== 'good') {
    signals.push({ id: 'splits', label: 'Ownership incomplete — confirm splits', tone: 'warn', icon: 'alert' })
  }
  if (o.copyright.tone !== 'good') {
    signals.push({ id: 'copyright', label: 'Copyright registration pending', tone: 'warn', icon: 'alert' })
  }
  if (l.available && l.syncMatches > 0) {
    signals.push({
      id: 'sync',
      label: `${l.syncMatches} licensing ${l.syncMatches === 1 ? 'opportunity' : 'opportunities'} found`,
      tone: 'info',
      icon: 'spark',
    })
  }
  if (readiness >= 80) {
    signals.push({ id: 'readiness', label: 'Readiness strong — distribution ready', tone: 'good', icon: 'shield' })
  }
  if (o.passport.tone === 'good') {
    signals.push({ id: 'passport', label: 'Passport issued — portable proof ready', tone: 'good', icon: 'shield' })
  }
  if (signals.length === 0) {
    signals.push({ id: 'vault', label: 'Asset secured in your Vault', tone: 'muted', icon: 'lock' })
  }
  return signals
}

/* ── tone → legacy CSS var (no green on legacy surfaces) ─────── */

export function toneColor(tone: SignalTone): string {
  switch (tone) {
    case 'good': return 'var(--accent)'
    case 'warn': return 'var(--warning)'
    case 'risk': return 'var(--critical)'
    case 'info': return 'var(--text-secondary)'
    case 'muted':
    default: return 'var(--text-muted)'
  }
}

export function toneSoft(tone: SignalTone): string {
  return `color-mix(in srgb, ${toneColor(tone)} 14%, transparent)`
}
