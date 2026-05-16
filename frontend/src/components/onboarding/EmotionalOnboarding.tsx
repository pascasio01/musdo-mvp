import { memo, useState, useEffect, useRef } from 'react'
import { X, ArrowRight, Sparkles } from 'lucide-react'
import { usePersonalization } from '../../lib/personalization'
import { listeningPersonalities } from '../../data/listeningPersonalities'
import type { ListeningPersonalityId } from '../../types/personalization'

const ZERO_SCORES = (): Record<ListeningPersonalityId, number> => ({
  warm_listener: 0, studio_listener: 0, night_listener: 0,
  cinematic_listener: 0, dominican_nights: 0,
})

function addWeights(
  scores: Record<ListeningPersonalityId, number>,
  weights: Partial<Record<ListeningPersonalityId, number>>,
): Record<ListeningPersonalityId, number> {
  const next = { ...scores }
  for (const k of Object.keys(weights) as ListeningPersonalityId[]) {
    next[k] = (next[k] ?? 0) + (weights[k] ?? 0)
  }
  return next
}

function pickWinner(scores: Record<ListeningPersonalityId, number>): ListeningPersonalityId {
  let bestId: ListeningPersonalityId = 'warm_listener'
  let bestScore = -1
  for (const id of Object.keys(scores) as ListeningPersonalityId[]) {
    if (scores[id] > bestScore) { bestScore = scores[id]; bestId = id }
  }
  return bestId
}

/**
 * Emotional Onboarding — 4 questions about *atmosphere*, never about genres.
 *
 * Each answer carries a weight for one or more Listening Personalities.
 * After Q4 we tally the votes and apply the winning personality atomically.
 */

type PersonalityScore = Record<ListeningPersonalityId, number>

interface Choice {
  label: string
  /** How strongly each option votes for each personality */
  weights: Partial<PersonalityScore>
}

interface Question {
  id: string
  prompt: string
  choices: Choice[]
}

const QUESTIONS: Question[] = [
  {
    id: 'atmosphere',
    prompt: 'What atmosphere feels like you?',
    choices: [
      { label: 'Warm and intimate',     weights: { warm_listener: 2, dominican_nights: 1 } },
      { label: 'Cool and cinematic',    weights: { cinematic_listener: 2, night_listener: 1 } },
      { label: 'Tropical and romantic', weights: { dominican_nights: 2, warm_listener: 1 } },
      { label: 'Quiet and clean',       weights: { studio_listener: 2 } },
    ],
  },
  {
    id: 'night',
    prompt: 'How do you usually listen at night?',
    choices: [
      { label: 'Lights low, music close',    weights: { night_listener: 2, warm_listener: 1 } },
      { label: 'Just the music, nothing else', weights: { studio_listener: 2 } },
      { label: 'Like a movie playing',         weights: { cinematic_listener: 2 } },
      { label: 'Tropical, slow, romantic',     weights: { dominican_nights: 2 } },
    ],
  },
  {
    id: 'environment',
    prompt: 'What kind of musical environment do you enjoy?',
    choices: [
      { label: 'Intimate and close',     weights: { warm_listener: 2, night_listener: 1 } },
      { label: 'Studio reference, flat', weights: { studio_listener: 2 } },
      { label: 'Wide and open',          weights: { cinematic_listener: 1, dominican_nights: 1 } },
      { label: 'Cinematic theater',      weights: { cinematic_listener: 2 } },
    ],
  },
  {
    id: 'preference',
    prompt: 'Do you prefer intimate or cinematic listening?',
    choices: [
      { label: 'Intimate',  weights: { warm_listener: 2, night_listener: 1, dominican_nights: 1 } },
      { label: 'Cinematic', weights: { cinematic_listener: 2, studio_listener: 1 } },
    ],
  },
]

interface Props { open: boolean; onClose: () => void }

function EmotionalOnboardingImpl({ open, onClose }: Props) {
  const { applyPersonality } = usePersonalization()
  const [step, setStep] = useState(0)
  const [scores, setScores] = useState<PersonalityScore>(ZERO_SCORES)
  const [winnerId, setWinnerId] = useState<ListeningPersonalityId | null>(null)

  // Focus management — capture previous focus on open, restore on close.
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Reset whenever the modal opens
  useEffect(() => {
    if (open) {
      setStep(0)
      setWinnerId(null)
      setScores(ZERO_SCORES())
      previousFocusRef.current = (document.activeElement as HTMLElement) ?? null
      // Defer to next tick so the dialog has mounted
      requestAnimationFrame(() => {
        dialogRef.current?.querySelector<HTMLElement>('button')?.focus()
      })
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus()
      previousFocusRef.current = null
    }
  }, [open])

  // ESC + minimal focus trap (Tab/Shift+Tab cycles within the dialog)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab' || !dialogRef.current) return
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last  = focusables[focusables.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (e.shiftKey && active === first)        { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && active === last)   { e.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const onPick = (choice: Choice) => {
    // Compute the next scores synchronously from the closure (no double-count).
    const next = addWeights(scores, choice.weights)
    setScores(next)
    if (step + 1 < QUESTIONS.length) {
      setStep(s => s + 1)
    } else {
      setWinnerId(pickWinner(next))
    }
  }

  const onAccept = () => {
    if (!winnerId) return
    applyPersonality(winnerId)
    onClose()
  }

  const q = QUESTIONS[step]
  const winner = winnerId ? listeningPersonalities[winnerId] : null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      role="dialog" aria-modal="true" aria-label="Emotional Onboarding"
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-md rounded-3xl overflow-hidden"
        style={{
          background: 'var(--card-elevated, #1c1c1c)',
          border: '1px solid var(--border)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close onboarding"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: 'var(--glass-bg-medium, rgba(255,255,255,0.06))', color: 'var(--text-muted)' }}
        >
          <X size={16} />
        </button>

        {/* Progress dots */}
        {!winner && (
          <div className="flex justify-center gap-1.5 pt-6">
            {QUESTIONS.map((_, i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full transition-colors"
                style={{ background: i <= step ? 'var(--accent)' : 'var(--border)' }}
              />
            ))}
          </div>
        )}

        <div className="px-7 pt-5 pb-7">
          {!winner ? (
            <>
              <p className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: 'var(--text-muted)' }}>
                Step {step + 1} of {QUESTIONS.length}
              </p>
              <h2 className="text-xl font-black leading-tight mb-5" style={{ color: 'var(--text-primary)' }}>
                {q.prompt}
              </h2>
              <div className="space-y-2">
                {q.choices.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => onPick(c)}
                    className="w-full text-left px-4 py-3.5 rounded-xl transition-all flex items-center justify-between group"
                    style={{
                      background: 'var(--glass-bg-medium, rgba(255,255,255,0.04))',
                      border: '1px solid var(--border-soft)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <span className="text-[13px] font-semibold">{c.label}</span>
                    <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center pt-2">
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
              >
                <Sparkles size={20} />
              </div>
              <p className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: 'var(--text-muted)' }}>
                Your Listening Personality
              </p>
              <h2 className="text-2xl font-black leading-tight mb-2" style={{ color: 'var(--text-primary)' }}>
                {winner.label}
              </h2>
              <p className="text-[13px] leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                {winner.desc}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => { setStep(0); setWinnerId(null); setScores(ZERO_SCORES()) }}
                  className="flex-1 py-3 rounded-xl font-semibold text-[13px] transition-colors"
                  style={{
                    background: 'var(--glass-bg-medium, rgba(255,255,255,0.06))',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-soft)',
                  }}
                >
                  Start over
                </button>
                <button
                  onClick={onAccept}
                  className="flex-1 py-3 rounded-xl font-bold text-[13px] transition-colors"
                  style={{ background: 'var(--text-primary)', color: 'var(--text-inverse)' }}
                >
                  Use this profile
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-[10px] pb-4 px-7" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
          You can change every choice in Appearance &rarr; Listening Atmosphere.
        </p>
      </div>
    </div>
  )
}

export const EmotionalOnboarding = memo(EmotionalOnboardingImpl)
export default EmotionalOnboarding
