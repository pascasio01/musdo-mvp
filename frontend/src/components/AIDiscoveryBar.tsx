import { useState, useEffect, useRef } from 'react'
import { Sparkles, Search, X, ChevronRight } from 'lucide-react'
import { moodChips, musicScenes, getAIResults, discoveryPlaceholders, type AIResult } from '../data/aiMockData'

export default function AIDiscoveryBar() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [activeMood, setActiveMood] = useState<string | null>(null)
  const [results, setResults] = useState<AIResult[]>([])
  const [thinking, setThinking] = useState(false)
  const [activeScene, setActiveScene] = useState<string | null>(null)
  const [placeholder, setPlaceholder] = useState(discoveryPlaceholders[0])
  const inputRef = useRef<HTMLInputElement>(null)
  const placeholderIdx = useRef(0)

  useEffect(() => {
    const t = setInterval(() => {
      if (!focused && !query) {
        placeholderIdx.current = (placeholderIdx.current + 1) % discoveryPlaceholders.length
        setPlaceholder(discoveryPlaceholders[placeholderIdx.current])
      }
    }, 3200)
    return () => clearInterval(t)
  }, [focused, query])

  const runSearch = (q: string) => {
    if (!q.trim()) { setResults([]); return }
    setThinking(true)
    setTimeout(() => {
      setResults(getAIResults(q))
      setThinking(false)
    }, 680)
  }

  const selectMood = (mood: string) => {
    setActiveMood(mood === activeMood ? null : mood)
    setQuery(mood === activeMood ? '' : mood)
    if (mood !== activeMood) runSearch(mood)
    else setResults([])
  }

  const selectScene = (id: string) => {
    setActiveScene(id === activeScene ? null : id)
  }

  const handleInput = (v: string) => {
    setQuery(v)
    setActiveMood(null)
    if (v.length > 2) runSearch(v)
    else setResults([])
  }

  const clear = () => {
    setQuery('')
    setActiveMood(null)
    setResults([])
    inputRef.current?.focus()
  }

  const typeIcon = (type: AIResult['type']) => {
    if (type === 'song') return '♪'
    if (type === 'playlist') return '◈'
    if (type === 'creator') return '◉'
    return '◆'
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={13} className="text-violet-400" strokeWidth={1.5} />
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">MUSDO AI Discovery</p>
      </div>

      <div className={`relative rounded-2xl transition-all duration-300 ${focused ? 'ring-1 ring-white/15' : ''}`}>
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10">
          <Search size={15} className="text-zinc-600 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => handleInput(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-white text-sm placeholder-zinc-700 outline-none transition-all duration-500"
          />
          {thinking && (
            <div className="w-4 h-4 rounded-full border border-violet-500/40 border-t-violet-400 animate-spin flex-shrink-0" />
          )}
          {query && !thinking && (
            <button onClick={clear} className="text-zinc-600 hover:text-zinc-400 transition-colors flex-shrink-0">
              <X size={14} />
            </button>
          )}
        </div>

        {results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-zinc-950 border border-white/10 overflow-hidden z-20 shadow-2xl">
            <div className="px-4 py-2.5 border-b border-white/5">
              <p className="text-[10px] text-zinc-600 uppercase tracking-wider font-bold">AI matched {results.length} results</p>
            </div>
            {results.map(r => (
              <button key={r.id} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${r.gradient} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-xs">{typeIcon(r.type)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{r.title}</p>
                  <p className="text-zinc-600 text-xs truncate">{r.subtitle}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {r.tags.slice(0, 1).map(tag => (
                    <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-500 border border-white/5">{tag}</span>
                  ))}
                </div>
                <ChevronRight size={13} className="text-zinc-700 flex-shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide mt-3">
        {moodChips.map(mood => (
          <button
            key={mood}
            onClick={() => selectMood(mood)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 ${
              activeMood === mood
                ? 'bg-violet-600 text-white border border-violet-500'
                : 'bg-white/5 border border-white/8 text-zinc-500 hover:text-zinc-300 hover:border-white/15'
            }`}
          >
            {mood}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3">
        {musicScenes.map(scene => (
          <button
            key={scene.id}
            onClick={() => selectScene(scene.id)}
            className={`relative rounded-xl p-3 bg-gradient-to-br ${scene.gradient} border text-left transition-all duration-200 overflow-hidden ${
              activeScene === scene.id ? 'border-white/20 scale-[0.98]' : 'border-white/5 hover:border-white/12'
            }`}
          >
            <div className="text-lg mb-1">{scene.icon}</div>
            <p className="text-white text-[10px] font-bold leading-tight">{scene.name}</p>
            <p className="text-zinc-500 text-[9px] mt-0.5 leading-tight line-clamp-2">{scene.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
