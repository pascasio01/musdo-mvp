import { useState, useRef } from 'react'
import { Upload as UploadIcon, Music, FileText, Image, Check, ArrowLeft, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../layouts/AppShell'

type UploadMode = 'demo' | 'lyrics' | null

export default function Upload() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<UploadMode>(null)
  const [title, setTitle] = useState('')
  const [genre, setGenre] = useState('')
  const [bpm, setBpm] = useState('')
  const [key, setKey] = useState('')
  const [notes, setNotes] = useState('')
  const [lyrics, setLyrics] = useState('')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [visibility, setVisibility] = useState<'private' | 'public' | 'licensing_only'>('private')
  const [submitted, setSubmitted] = useState(false)
  const audioRef = useRef<HTMLInputElement>(null)
  const coverRef = useRef<HTMLInputElement>(null)

  const genres = ['Bachata', 'Latin Pop', 'Romantic Bachata', 'Modern Bachata', 'Urban', 'Fusion', 'Pop', 'R&B']
  const keys = ['C', 'Cm', 'D', 'Dm', 'E', 'Em', 'F', 'Fm', 'G', 'Gm', 'A', 'Am', 'B', 'Bm']

  const inputStyle = { background: 'var(--glass-bg)' }
  const inputClass = 'w-full p-4 rounded-2xl border border-theme text-primary placeholder-zinc-600 outline-none transition-colors text-sm'
  const labelClass = 'text-xs text-muted uppercase tracking-wider font-medium block mb-2'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <AppShell>
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 rounded-3xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center mb-6">
            <Check size={32} className="text-teal-400" aria-hidden />
          </div>
          <h2 className="text-primary font-black text-3xl mb-2">
            {mode === 'demo' ? 'Demo Uploaded' : 'Lyrics Saved'}
          </h2>
          <p className="text-muted mb-8 max-w-xs leading-relaxed">
            {mode === 'demo'
              ? 'Your demo is now secured in your Vault. A Song Passport will be generated.'
              : 'Your lyrics are timestamp-protected and secured in the Vault.'
            }
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={() => navigate('/vault')}
              className="w-full py-4 rounded-2xl font-bold hover:opacity-90 transition-opacity"
              style={{ background: 'var(--text-primary)', color: 'var(--text-inverse)' }}
            >
              Go to Vault
            </button>
            <button
              onClick={() => { setSubmitted(false); setMode(null); setTitle('') }}
              className="w-full py-4 rounded-2xl border border-theme text-primary font-semibold hover:bg-glass-medium transition-colors"
              style={{ background: 'var(--glass-bg)' }}
            >
              Upload Another
            </button>
          </div>
        </div>
      </AppShell>
    )
  }

  if (!mode) {
    return (
      <AppShell>
        <div className="px-5 pt-14">
          <p className="text-muted text-xs uppercase tracking-widest font-semibold mb-1">Composer</p>
          <h1 className="text-primary text-3xl font-black mb-2">Upload</h1>
          <p className="text-muted text-sm mb-10">Protect and publish your music.</p>

          <div className="space-y-4">
            <button
              onClick={() => setMode('demo')}
              className="w-full rounded-3xl border border-theme p-6 text-left transition-all group hover:border-glass"
              style={{ background: 'var(--glass-bg)' }}
            >
              <div
                className="w-14 h-14 rounded-2xl border flex items-center justify-center mb-4 group-hover:scale-105 transition-transform"
                style={{ background: 'rgba(124,58,237,0.1)', borderColor: 'rgba(124,58,237,0.2)' }}
              >
                <Music size={24} className="text-violet-400" aria-hidden />
              </div>
              <h2 className="text-primary font-bold text-xl mb-1">Upload Demo</h2>
              <p className="text-muted text-sm">MP3, WAV or voice recordings. Your demo gets protected and timestamped automatically.</p>
            </button>

            <button
              onClick={() => setMode('lyrics')}
              className="w-full rounded-3xl border border-theme p-6 text-left transition-all group hover:border-glass"
              style={{ background: 'var(--glass-bg)' }}
            >
              <div
                className="w-14 h-14 rounded-2xl border flex items-center justify-center mb-4 group-hover:scale-105 transition-transform"
                style={{ background: 'rgba(37,99,235,0.1)', borderColor: 'rgba(37,99,235,0.2)' }}
              >
                <FileText size={24} className="text-blue-400" aria-hidden />
              </div>
              <h2 className="text-primary font-bold text-xl mb-1">Upload Lyrics</h2>
              <p className="text-muted text-sm">Write or paste your lyrics. They get locked with a timestamp proof for IP protection.</p>
            </button>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="px-5 pt-14">
        <button
          onClick={() => setMode(null)}
          className="flex items-center gap-2 text-muted hover:text-primary transition-colors mb-8"
          aria-label="Back to upload selection"
        >
          <ArrowLeft size={18} aria-hidden />
          <span className="text-sm">Back</span>
        </button>

        <h1 className="text-primary text-2xl font-black mb-1">
          {mode === 'demo' ? 'Upload Demo' : 'Upload Lyrics'}
        </h1>
        <p className="text-muted text-sm mb-8">
          {mode === 'demo' ? 'Protected in your Vault. Timestamped automatically.' : 'Your lyrics, secured with proof of creation.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>Song Title *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="Give your song a name…"
              className={inputClass}
              style={inputStyle}
            />
          </div>

          {mode === 'demo' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Genre</label>
                  <select
                    value={genre}
                    onChange={e => setGenre(e.target.value)}
                    className={`${inputClass} appearance-none`}
                    style={inputStyle}
                  >
                    <option value="">Select genre</option>
                    {genres.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Key</label>
                  <select
                    value={key}
                    onChange={e => setKey(e.target.value)}
                    className={`${inputClass} appearance-none`}
                    style={inputStyle}
                  >
                    <option value="">Key</option>
                    {keys.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>BPM</label>
                <input
                  type="number"
                  value={bpm}
                  onChange={e => setBpm(e.target.value)}
                  placeholder="e.g. 128"
                  min={40}
                  max={300}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              <div>
                <label className={labelClass}>Audio File</label>
                <input ref={audioRef} type="file" accept="audio/*" onChange={e => setAudioFile(e.target.files?.[0] ?? null)} className="hidden" />
                <button
                  type="button"
                  onClick={() => audioRef.current?.click()}
                  className="w-full py-8 rounded-2xl border border-dashed border-theme flex flex-col items-center gap-2 hover:border-glass transition-all"
                  style={{ background: 'var(--glass-subtle)' }}
                >
                  {audioFile ? (
                    <>
                      <Music size={24} className="text-violet-400" aria-hidden />
                      <span className="text-primary text-sm font-medium">{audioFile.name}</span>
                      <span className="text-muted text-xs">{(audioFile.size / 1024 / 1024).toFixed(1)} MB</span>
                    </>
                  ) : (
                    <>
                      <UploadIcon size={24} className="text-muted" aria-hidden />
                      <span className="text-secondary text-sm">Tap to upload audio</span>
                      <span className="text-muted text-xs">MP3, WAV, FLAC supported</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <label className={labelClass}>Cover Art (optional)</label>
                <input ref={coverRef} type="file" accept="image/*" onChange={e => setCoverFile(e.target.files?.[0] ?? null)} className="hidden" />
                <button
                  type="button"
                  onClick={() => coverRef.current?.click()}
                  className="w-full py-6 rounded-2xl border border-dashed border-theme flex items-center justify-center gap-3 hover:border-glass transition-all"
                  style={{ background: 'var(--glass-subtle)' }}
                >
                  <Image size={20} className="text-muted" aria-hidden />
                  <span className="text-secondary text-sm">{coverFile ? coverFile.name : 'Upload cover image'}</span>
                  {coverFile && (
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); setCoverFile(null) }}
                      aria-label="Remove cover"
                    >
                      <X size={16} className="text-muted" aria-hidden />
                    </button>
                  )}
                </button>
              </div>

              <div>
                <label className={labelClass}>Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Production notes, status, collaborators…"
                  rows={3}
                  className={`${inputClass} resize-none`}
                  style={inputStyle}
                />
              </div>
            </>
          )}

          {mode === 'lyrics' && (
            <div>
              <label className={labelClass}>Lyrics *</label>
              <textarea
                value={lyrics}
                onChange={e => setLyrics(e.target.value)}
                required
                placeholder="Write or paste your lyrics here…"
                rows={12}
                className={`${inputClass} resize-none font-mono leading-relaxed`}
                style={inputStyle}
              />
            </div>
          )}

          <div>
            <label className={labelClass}>Visibility</label>
            <div className="grid grid-cols-3 gap-2" role="group" aria-label="Visibility options">
              {[
                { value: 'private', label: 'Private' },
                { value: 'licensing_only', label: 'License Only' },
                { value: 'public', label: 'Public' },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={visibility === opt.value}
                  onClick={() => setVisibility(opt.value as typeof visibility)}
                  className="py-3 rounded-2xl text-xs font-semibold transition-all"
                  style={
                    visibility === opt.value
                      ? { background: 'var(--text-primary)', color: 'var(--text-inverse)', border: '1px solid transparent' }
                      : { background: 'var(--glass-bg)', border: '1px solid var(--border)', color: 'var(--text-muted)' }
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl font-bold text-base hover:opacity-90 transition-opacity mt-2"
            style={{ background: 'var(--text-primary)', color: 'var(--text-inverse)' }}
          >
            {mode === 'demo' ? 'Protect & Upload Demo' : 'Save & Protect Lyrics'}
          </button>
        </form>
      </div>
    </AppShell>
  )
}
