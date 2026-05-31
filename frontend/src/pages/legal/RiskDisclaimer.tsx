import { ArrowLeft, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../../layouts/AppShell'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-white font-bold text-base mb-2">{title}</h2>
      <div className="text-zinc-400 text-sm leading-relaxed space-y-2">{children}</div>
    </div>
  )
}

export default function RiskDisclaimer() {
  const navigate = useNavigate()

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={18} />
        </button>
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Legal</p>
        <h1 className="text-white font-black text-3xl mb-2">Risk Disclaimer</h1>
        <p className="text-zinc-600 text-xs mb-8">May 2026</p>

        <div className="rounded-2xl bg-red-900/15 border border-red-500/20 p-4 mb-6 flex gap-3">
          <AlertTriangle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-zinc-400 text-xs leading-relaxed">
            Please read this disclaimer carefully before using MUSVORA for commercial or legal purposes.
          </p>
        </div>

        <Section title="Platform Limitations">
          <p>MUSVORA provides tools for music protection and licensing. However, MUSVORA does not guarantee legal protection, copyright enforcement, income, royalties, or commercial success.</p>
        </Section>
        <Section title="No Income Guarantee">
          <p>Using MUSVORA does not guarantee that your music will be discovered, licensed, or generate income. Results vary significantly by creator, genre, quality, and market factors outside MUSVORA's control.</p>
        </Section>
        <Section title="Copyright Risk">
          <p>Song Passports and timestamps provided by MUSVORA are not equivalent to formal copyright registration. They serve as evidence of creation date and may support but do not replace legal copyright protection.</p>
          <p>For formal copyright registration, consult the copyright office in your jurisdiction.</p>
        </Section>
        <Section title="Beta Platform Risk">
          <p>MUSVORA is currently in MVP/Beta. Features may change, be removed, or malfunction. MUSVORA does not guarantee uninterrupted service or data preservation.</p>
        </Section>
        <Section title="Liability">
          <p>To the maximum extent permitted by applicable law, MUSVORA's liability is limited. MUSVORA is not liable for indirect, incidental, consequential, or punitive damages.</p>
        </Section>
        <Section title="Jurisdiction">
          <p>Users are responsible for compliance with applicable laws in their jurisdiction regarding music rights, licensing, and income reporting.</p>
        </Section>
      </div>
    </AppShell>
  )
}
