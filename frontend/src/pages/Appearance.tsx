import { useState } from 'react'
import { ArrowLeft, Palette, Zap, Eye, Wind } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../layouts/AppShell'
import { useTheme, themes, type ThemeId } from '../lib/theme'
import { useMusicAura, type AuraSettings } from '../lib/aura'
import ListeningAtmospherePanel from '../components/personalization/ListeningAtmospherePanel'
import EmotionalOnboarding from '../components/onboarding/EmotionalOnboarding'

function SectionTitle({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon size={14} className="text-zinc-500" />
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{label}</p>
    </div>
  )
}

function ToggleRow({ label, desc, value, onChange }: { label: string; desc?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-white/5 last:border-0">
      <div>
        <p className="text-white text-sm font-medium">{label}</p>
        {desc && <p className="text-zinc-600 text-xs mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${value ? 'bg-white' : 'bg-white/15'}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all duration-200 ${value ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  )
}

function TriPicker({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="py-3.5 border-b border-white/5 last:border-0">
      <p className="text-white text-sm font-medium mb-3">{label}</p>
      <div className="flex gap-2">
        {options.map(o => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
              value === o ? 'bg-white text-black' : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

const accentPresets = [
  { label: 'Violet', hex: '#7c3aed' },
  { label: 'Blue', hex: '#2563eb' },
  { label: 'Amber', hex: '#d97706' },
  { label: 'Rose', hex: '#e11d48' },
  { label: 'Indigo', hex: '#6366f1' },
  { label: 'White', hex: '#e5e5e5' },
]

export default function Appearance() {
  const navigate = useNavigate()
  const { settings, currentTheme, setTheme, updateSettings } = useTheme()
  const { auraSettings, updateAuraSettings } = useMusicAura()
  const [onboardingOpen, setOnboardingOpen] = useState(false)

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>

        <div className="mb-8">
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold mb-1">MUSDO</p>
          <h1 className="text-white font-black text-3xl">Appearance</h1>
          <p className="text-zinc-600 text-sm mt-1">Make it yours. Every pixel.</p>
        </div>

        <div className="space-y-5">
          {/* Curated Personalization — sits above raw theme controls because it
              applies a holistic emotional identity in one tap. The panel ships
              its own card chrome (border + radius), so no wrapper here. The
              onboarding launcher lives inside the panel header. */}
          <ListeningAtmospherePanel onLaunchOnboarding={() => setOnboardingOpen(true)} />

          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <SectionTitle icon={Palette} label="Theme" />
            <div className="grid grid-cols-2 gap-3">
              {themes.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => setTheme(theme.id as ThemeId)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    currentTheme.id === theme.id
                      ? 'border-white/30 bg-white/8'
                      : 'border-white/8 bg-white/3 hover:border-white/15'
                  }`}
                >
                  <div className="flex gap-1.5 mb-3">
                    {theme.preview.map((color, i) => (
                      <div key={i} className="w-4 h-4 rounded-full border border-white/10" style={{ background: color }} />
                    ))}
                  </div>
                  <p className="text-white text-xs font-bold">{theme.name}</p>
                  <p className="text-zinc-600 text-[10px] mt-0.5 leading-tight">{theme.description}</p>
                  {currentTheme.id === theme.id && (
                    <div className="mt-2 w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <SectionTitle icon={Palette} label="Accent Color" />
            <div className="flex gap-3 flex-wrap">
              {accentPresets.map(c => (
                <button
                  key={c.hex}
                  onClick={() => updateSettings({ accentCustom: c.hex })}
                  title={c.label}
                  className={`w-10 h-10 rounded-xl transition-all ${
                    settings.accentCustom === c.hex ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110' : 'hover:scale-105'
                  }`}
                  style={{ background: c.hex }}
                />
              ))}
              <button
                onClick={() => updateSettings({ accentCustom: null })}
                className={`w-10 h-10 rounded-xl border border-white/20 text-zinc-500 text-xs transition-all hover:text-white ${
                  !settings.accentCustom ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''
                }`}
              >
                Auto
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <SectionTitle icon={Eye} label="Visual Style" />
            <TriPicker label="Blur Intensity" options={['low', 'medium', 'high']} value={settings.blurIntensity} onChange={v => updateSettings({ blurIntensity: v as 'low' | 'medium' | 'high' })} />
            <TriPicker label="Glow Intensity" options={['none', 'low', 'medium', 'high']} value={settings.glowIntensity} onChange={v => updateSettings({ glowIntensity: v as 'none' | 'low' | 'medium' | 'high' })} />
            <TriPicker label="Rounded UI" options={['sharp', 'medium', 'soft']} value={settings.roundedLevel} onChange={v => updateSettings({ roundedLevel: v as 'sharp' | 'medium' | 'soft' })} />
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <SectionTitle icon={Zap} label="Motion & Animation" />
            <TriPicker label="Motion Speed" options={['reduced', 'normal', 'expressive']} value={settings.motionIntensity} onChange={v => updateSettings({ motionIntensity: v as 'reduced' | 'normal' | 'expressive' })} />
            <ToggleRow label="Ambient Animation" desc="Subtle breathing effects on UI" value={settings.ambientAnimation} onChange={v => updateSettings({ ambientAnimation: v })} />
            <ToggleRow label="Cinematic Mode" desc="Edge lighting and depth effects" value={settings.cinematicMode} onChange={v => updateSettings({ cinematicMode: v })} />
            <ToggleRow label="Reduce Motion" desc="Minimize all movement (accessibility)" value={settings.reduceMotion} onChange={v => updateSettings({ reduceMotion: v })} />
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <SectionTitle icon={Wind} label="Music Aura" />
            <p className="text-zinc-600 text-xs mb-4 leading-relaxed">
              When music plays, MUSDO subtly shifts its atmosphere to match the genre, mood, and energy of the song.
            </p>
            <ToggleRow label="Adaptive Music Aura" desc="Shift background mood with the music" value={auraSettings.enabled} onChange={v => updateAuraSettings({ enabled: v })} />
            {auraSettings.enabled && (
              <>
                <TriPicker label="Aura Intensity" options={['low', 'medium', 'high']} value={auraSettings.intensity} onChange={v => updateAuraSettings({ intensity: v as AuraSettings['intensity'] })} />
                <ToggleRow label="Use Cover Art Colors" desc="Extract dominant color from artwork" value={auraSettings.useCoverColors} onChange={v => updateAuraSettings({ useCoverColors: v })} />
              </>
            )}
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <SectionTitle icon={Zap} label="Typography" />
            <div className="py-3.5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white text-sm font-medium">Font Scale</p>
                <span className="text-zinc-400 text-sm font-mono">{settings.fontScale.toFixed(1)}×</span>
              </div>
              <input
                type="range"
                min="0.85"
                max="1.25"
                step="0.05"
                value={settings.fontScale}
                onChange={e => updateSettings({ fontScale: parseFloat(e.target.value) })}
                className="w-full accent-white h-1 rounded-full bg-white/10"
              />
              <div className="flex justify-between text-[10px] text-zinc-700 mt-1">
                <span>Compact</span>
                <span>Default</span>
                <span>Large</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-zinc-800 text-[10px] mt-8 font-mono">
          Settings saved locally · Supabase sync coming soon
        </p>
      </div>

      <EmotionalOnboarding open={onboardingOpen} onClose={() => setOnboardingOpen(false)} />
    </AppShell>
  )
}
