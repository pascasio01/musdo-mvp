import { useMode } from '../lib/mode'
import { Headphones, Mic2, ShieldCheck } from 'lucide-react'

export default function ModeSwitcher() {
  const { mode, setMode, isOwner } = useMode()

  const options = [
    { value: 'listener', icon: Headphones, label: 'Listener' },
    { value: 'creator', icon: Mic2, label: 'Creator' },
    ...(isOwner ? [{ value: 'owner', icon: ShieldCheck, label: 'Owner' }] : []),
  ] as const

  return (
    <div className="flex items-center gap-1 rounded-2xl bg-white/5 border border-white/10 p-1">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setMode(value as typeof mode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            mode === value
              ? 'bg-white text-black'
              : 'text-zinc-500 hover:text-white'
          }`}
        >
          <Icon size={12} />
          {label}
        </button>
      ))}
    </div>
  )
}
