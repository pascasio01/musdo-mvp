import { memo } from 'react'
import {
  ShieldCheck, FileSignature, Copyright, BadgeCheck, Users,
  ArrowRight, FileText, Radio, Megaphone, Inbox, Target,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Song } from '../../types'
import {
  getOwnershipInsight, getLicensingInsight,
  toneColor, toneSoft, scoreTone,
  type StatusValue, type SignalTone,
} from '../../data/assetIntelligence'

/* ── shared primitives ───────────────────────────────────────── */

function StatusPill({ status }: { status: StatusValue }) {
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
      style={{ background: toneSoft(status.tone), color: toneColor(status.tone) }}
    >
      {status.value}
    </span>
  )
}

function ScoreRing({ score, label }: { score: number; label: string }) {
  const tone: SignalTone = scoreTone(score)
  const color = toneColor(tone)
  const circ = 2 * Math.PI * 26
  const dash = (score / 100) * circ
  return (
    <div className="relative flex-shrink-0" style={{ width: 64, height: 64 }}>
      <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden>
        <circle cx="32" cy="32" r="26" fill="none" stroke="var(--border)" strokeWidth="5" />
        <circle
          cx="32" cy="32" r="26" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`} transform="rotate(-90 32 32)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-black leading-none tabular-nums" style={{ color: 'var(--text-primary)' }}>
          {score}
        </span>
        <span className="text-[7px] uppercase tracking-widest font-bold mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {label}
        </span>
      </div>
    </div>
  )
}

function ChipRow({ icon, label, status }: { icon: React.ReactNode; label: string; status: StatusValue }) {
  return (
    <div
      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
      style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-soft)' }}
    >
      <span style={{ color: 'var(--text-muted)' }} className="flex-shrink-0" aria-hidden>{icon}</span>
      <span className="flex-1 text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{label}</span>
      <StatusPill status={status} />
    </div>
  )
}

function StatTile({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div
      className="rounded-xl px-3 py-3"
      style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-soft)' }}
    >
      <span style={{ color: 'var(--text-muted)' }} aria-hidden>{icon}</span>
      <p className="text-lg font-black leading-none mt-2 tabular-nums" style={{ color: 'var(--text-primary)' }}>{value}</p>
      <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
    </div>
  )
}

function PanelDisclaimer({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] mt-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
      {children}
    </p>
  )
}

/* ── Ownership ───────────────────────────────────────────────── */

function OwnershipPanelImpl({ song }: { song: Song }) {
  const o = getOwnershipInsight(song)
  return (
    <div className="grid gap-3">
      {/* Confidence header */}
      <div
        className="flex items-center gap-4 rounded-2xl p-4"
        style={{ background: 'var(--glass-bg)', border: '1px solid var(--border)' }}
      >
        <ScoreRing score={o.confidence} label="confidence" />
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ color: 'var(--text-muted)' }}>
            Ownership Confidence
          </p>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {o.rightsHolder.value === 'Verified' ? 'Verified rights holder' : 'Awaiting verification'}
          </p>
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
            Requires Confirmation — a signal pending human verification.
          </p>
        </div>
      </div>

      <div className="grid gap-2">
        <ChipRow icon={<ShieldCheck size={15} />} label="Rights Holder" status={o.rightsHolder} />
        <ChipRow icon={<FileSignature size={15} />} label="Split Sheet" status={o.splitSheet} />
        <ChipRow icon={<Copyright size={15} />} label="Copyright" status={o.copyright} />
        <ChipRow icon={<BadgeCheck size={15} />} label="Passport" status={o.passport} />
      </div>

      {o.contributors.length > 0 && (
        <div className="rounded-2xl p-4" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-soft)' }}>
          <p className="text-[10px] uppercase tracking-widest font-bold mb-2.5 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
            <Users size={11} /> Contributors &amp; splits
          </p>
          <div className="grid gap-2">
            {o.contributors.map(c => (
              <div key={c.name} className="flex items-center gap-2.5">
                <span
                  className="grid place-items-center rounded-full flex-shrink-0 text-[10px] font-bold"
                  style={{ width: 26, height: 26, background: 'var(--glass-bg-medium)', color: 'var(--text-secondary)' }}
                >
                  {c.name.slice(0, 1).toUpperCase()}
                </span>
                <span className="flex-1 text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{c.name}</span>
                <span className="text-xs font-bold tabular-nums" style={{ color: 'var(--text-secondary)' }}>{c.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {o.gaps.length > 0 && (
        <div className="rounded-2xl p-4" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-soft)' }}>
          <p className="text-[10px] uppercase tracking-widest font-bold mb-2.5" style={{ color: 'var(--text-muted)' }}>
            To raise confidence
          </p>
          <div className="grid gap-1.5">
            {o.gaps.map((g, i) => (
              <div key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <ArrowRight size={13} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} aria-hidden />
                <span>{g}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <PanelDisclaimer>
        MUSVORA AI provides assistance, not legal determination. Ownership signals always require human confirmation.
      </PanelDisclaimer>
    </div>
  )
}

export const OwnershipPanel = memo(OwnershipPanelImpl)

/* ── Licensing ───────────────────────────────────────────────── */

function LicensingPanelImpl({ song }: { song: Song }) {
  const navigate = useNavigate()
  const l = getLicensingInsight(song)
  return (
    <div className="grid gap-3">
      {/* Readiness header */}
      <div
        className="flex items-center gap-4 rounded-2xl p-4"
        style={{ background: 'var(--glass-bg)', border: '1px solid var(--border)' }}
      >
        <ScoreRing score={l.readiness} label="readiness" />
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ color: 'var(--text-muted)' }}>
            Licensing Readiness
          </p>
          <StatusPill status={l.marketplace} />
          <p className="text-[11px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
            Opportunity match score {l.opportunityMatch}/100
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <StatTile icon={<Radio size={14} />} value={String(l.syncMatches)} label="Sync matches" />
        <StatTile icon={<Megaphone size={14} />} value={String(l.commercialMatches)} label="Commercial" />
        <StatTile icon={<Inbox size={14} />} value={String(l.pendingRequests)} label="Requests" />
      </div>

      <div className="rounded-2xl p-4" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-soft)' }}>
        <p className="text-[10px] uppercase tracking-widest font-bold mb-2.5" style={{ color: 'var(--text-muted)' }}>
          Suggested markets
        </p>
        <div className="flex flex-wrap gap-1.5">
          {l.suggestedMarkets.map(m => (
            <span
              key={m}
              className="text-[10px] px-2 py-1 rounded-full"
              style={{ background: 'var(--glass-bg-medium)', color: 'var(--text-secondary)', border: '1px solid var(--border-soft)' }}
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      <div
        className="flex items-start gap-2.5 rounded-2xl p-4"
        style={{ background: toneSoft('info'), border: '1px solid var(--border-soft)' }}
      >
        <Target size={15} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }} aria-hidden />
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-widest font-bold mb-0.5" style={{ color: 'var(--text-muted)' }}>
            Recommended action
          </p>
          <p className="text-xs" style={{ color: 'var(--text-primary)' }}>{l.recommendedAction}</p>
        </div>
      </div>

      <button
        onClick={() => navigate('/market')}
        className="w-full py-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
        style={
          l.available
            ? { background: 'var(--accent)', color: 'var(--text-inverse)', boxShadow: '0 8px 24px var(--accent-soft)' }
            : { background: 'var(--glass-bg)', border: '1px solid var(--border)', color: 'var(--text-primary)' }
        }
      >
        <FileText size={14} aria-hidden />
        {l.available ? 'Open Licensing Marketplace' : 'List this asset in the Marketplace'}
      </button>

      <PanelDisclaimer>
        Illustrative licensing intelligence using mock data. Figures are not financial advice or guaranteed earnings.
      </PanelDisclaimer>
    </div>
  )
}

export const LicensingPanel = memo(LicensingPanelImpl)
