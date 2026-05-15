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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <AppShell>
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 rounded-3xl bg-green-500/15 border border-green-500/30 flex items-center justify-center mb-6">
            <Check size={32} className="text-green-400" />
          </div>
          <h2 className="text-white font-black text-3xl mb-2">
            {mode === 'demo' ? 'Demo Uploaded' : 'Lyrics Saved'}
          </h2>
          <p className="text-zinc-500 mb-8 max-w-xs">
            {mode === 'demo'
              ? 'Your demo is now secured in your Vault. A Song Passport will be generated.'
              : 'Your lyrics are timestamp-protected and secured in the Vault.'
            }
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={() => navigate('/vault')}
              className="w-full py-4 rounded-2xl bg-white text-black font-bold hover:opacity-90 transition-opacity"
            >
              Go to Vault
            </button>
            <button
              onClick={() => { setSubmitted(false); setMode(null); setTitle(''); }}
              className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors"
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
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-1">Composer</p>
          <h1 className="text-white text-3xl font-black mb-2">Upload</h1>
          <p className="text-zinc-600 text-sm mb-10">Protect and publish your music.</p>

          <div className="space-y-4">
            <button
              onClick={() => setMode('demo')}
              className="w-full rounded-3xl bg-white/5 border border-white/10 p-6 text-left hover:bg-white/8 hover:border-white/20 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-violet-900/40 border border-violet-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Music size={24} className="text-violet-400" />
              </div>
              <h2 className="text-white font-bold text-xl mb-1">Upload Demo</h2>
              <p className="text-zinc-500 text-sm">MP3, WAV or voice recordings. Your demo gets protected and timestamped automatically.</p>
            </button>

            <button
              onClick={() => setMode('lyrics')}
              className="w-full rounded-3xl bg-white/5 border border-white/10 p-6 text-left hover:bg-white/8 hover:border-white/20 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-900/40 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <FileText size={24} className="text-blue-400" />
              </div>
              <h2 className="text-white font-bold text-xl mb-1">Upload Lyrics</h2>
              <p className="text-zinc-500 text-sm">Write or paste your lyrics. They get locked with a timestamp proof for IP protection.</p>
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
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>

        <h1 className="text-white text-2xl font-black mb-1">
          {mode === 'demo' ? 'Upload Demo' : 'Upload Lyrics'}
        </h1>
        <p className="text-zinc-600 text-sm mb-8">
          {mode === 'demo' ? 'Protected in your Vault. Timestamped automatically.' : 'Your lyrics, secured with proof of creation.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">Song Title *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="Give your song a name..."
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-700 outline-none focus:border-white/20 transition-colors"
            />
          </div>

          {mode === 'demo' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">Genre</label>
                  <select
                    value={genre}
                    onChange={e => setGenre(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-white/20 appearance-none"
                  >
                    <option value="" className="bg-zinc-900">Select genre</option>
                    {genres.map(g => <option key={g} value={g} className="bg-zinc-900">{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">Key</label>
                  <select
                    value={key}
                    onChange={e => setKey(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-white/20 appearance-none"
                  >
                    <option value="" className="bg-zinc-900">Key</option>
                    {keys.map(k => <option key={k} value={k} className="bg-zinc-900">{k}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">BPM</label>
                <input
                  type="number"
                  value={bpm}
                  onChange={e => setBpm(e.target.value)}
                  placeholder="e.g. 128"
                  min={40}
                  max={300}
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-700 outline-none focus:border-white/20 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">Audio File</label>
                <input ref={audioRef} type="file" accept="audio/*" onChange={e => setAudioFile(e.target.files?.[0] ?? null)} className="hidden" />
                <button
                  type="button"
                  onClick={() => audioRef.current?.click()}
                  className="w-full py-8 rounded-2xl border border-dashed border-white/15 flex flex-col items-center gap-2 hover:border-white/25 hover:bg-white/3 transition-all"
                >
                  {audioFile ? (
                    <>
                      <Music size={24} className="text-violet-400" />
                      <span className="text-white text-sm font-medium">{audioFile.name}</span>
                      <span className="text-zinc-600 text-xs">{(audioFile.size / 1024 / 1024).toFixed(1)} MB</span>
                    </>
                  ) : (
                    <>
                      <UploadIcon size={24} className="text-zinc-600" />
                      <span className="text-zinc-500 text-sm">Tap to upload audio</span>
                      <span className="text-zinc-700 text-xs">MP3, WAV, FLAC supported</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">Cover Art (optional)</label>
                <input ref={coverRef} type="file" accept="image/*" onChange={e => setCoverFile(e.target.files?.[0] ?? null)} className="hidden" />
                <button
                  type="button"
                  onClick={() => coverRef.current?.click()}
                  className="w-full py-6 rounded-2xl border border-dashed border-white/15 flex items-center justify-center gap-3 hover:border-white/25 hover:bg-white/3 transition-all"
                >
                  <Image size={20} className="text-zinc-600" />
                  <span className="text-zinc-500 text-sm">{coverFile ? coverFile.name : 'Upload cover image'}</span>
                  {coverFile && <button type="button" onClick={e => { e.stopPropagation(); setCoverFile(null) }}><X size={16} className="text-zinc-500" /></button>}
                </button>
              </div>

              <div>
                <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Production notes, status, collaborators..."
                  rows={3}
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-700 outline-none focus:border-white/20 resize-none transition-colors"
                />
              </div>
            </>
          )}

          {mode === 'lyrics' && (
            <div>
              <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">Lyrics *</label>
              <textarea
                value={lyrics}
                onChange={e => setLyrics(e.target.value)}
                required
                placeholder="Write or paste your lyrics here..."
                rows={12}
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-700 outline-none focus:border-white/20 resize-none font-mono text-sm leading-relaxed transition-colors"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-3">Visibility</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'private', label: 'Private' },
                { value: 'licensing_only', label: 'License Only' },
                { value: 'public', label: 'Public' },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setVisibility(opt.value as typeof visibility)}
                  className={`py-3 rounded-2xl text-xs font-semibold transition-all border ${
                    visibility === opt.value
                      ? 'bg-white text-black border-white'
                      : 'bg-white/5 border-white/10 text-zinc-500 hover:border-white/20'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-white text-black font-bold text-base hover:opacity-90 transition-opacity mt-2"
          >
            {mode === 'demo' ? 'Protect & Upload Demo' : 'Save & Protect Lyrics'}
          </button>
        </form>
      </div>
    </AppShell>
  )
}
