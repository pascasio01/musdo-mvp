import { ArrowLeft } from 'lucide-react'
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

export default function LicensingDisclaimer() {
  const navigate = useNavigate()

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={18} />
        </button>
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Legal</p>
        <h1 className="text-white font-black text-3xl mb-2">Licensing Disclaimer</h1>
        <p className="text-zinc-600 text-xs mb-8">May 2026</p>

        <Section title="Platform Role">
          <p>MUSVORA is a technology platform that facilitates connections between creators and licensees. MUSVORA is not a music publisher, record label, or legal intermediary.</p>
        </Section>
        <Section title="License Scope">
          <p>License agreements on MUSVORA are between the creator (rights holder) and the licensee (buyer). MUSVORA facilitates but is not a party to these agreements.</p>
          <p>MUSVORA does not verify the legal validity, completeness, or enforceability of any license agreement facilitated through the platform.</p>
        </Section>
        <Section title="No Legal Advice">
          <p>Nothing on MUSVORA constitutes legal advice. Licensing agreements can have significant legal implications. Both creators and licensees are strongly advised to consult a qualified music attorney before executing significant licensing transactions.</p>
        </Section>
        <Section title="Copyright Validity">
          <p>MUSVORA does not guarantee that listed songs are free of third-party claims. The Human Verified badge confirms human-created content but does not constitute legal copyright certification.</p>
        </Section>
        <Section title="Dispute Resolution">
          <p>Licensing disputes are between the creator and licensee. MUSVORA may assist in good faith but is not obligated to arbitrate or resolve licensing disputes.</p>
        </Section>
      </div>
    </AppShell>
  )
}
