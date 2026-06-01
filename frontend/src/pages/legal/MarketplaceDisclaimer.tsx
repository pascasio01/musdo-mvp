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

export default function MarketplaceDisclaimer() {
  const navigate = useNavigate()

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={18} />
        </button>
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Legal</p>
        <h1 className="text-white font-black text-3xl mb-2">Marketplace Disclaimer</h1>
        <p className="text-zinc-600 text-xs mb-8">June 2026</p>

        <Section title="Platform Role">
          <p>The MUSVORA Marketplace is a technology platform that helps creators and licensees connect. MUSVORA is not a music publisher, record label, broker or party to any transaction between users.</p>
        </Section>
        <Section title="Explicit Agreements Required">
          <p>Marketplace transactions require explicit license agreements. A listing, message, preview or expression of interest is not a license. Rights are granted only through a clear agreement between the rights holder and the licensee.</p>
        </Section>
        <Section title="Authorship Is Not Transferred Automatically">
          <p>Buying or licensing a song does not automatically transfer authorship. Authorship and underlying rights transfer only when a signed written agreement expressly says so. Absent such an agreement, the original creator retains authorship.</p>
        </Section>
        <Section title="No Revenue Guarantees">
          <p>MUSVORA does not guarantee revenue recovery, licensing income, placements or any financial outcome. Readiness scores, opportunity matches and recovery suggestions are informational and never a promise of earnings.</p>
        </Section>
        <Section title="No Ownership Determination">
          <p>MUSVORA does not determine final legal ownership and does not verify the legal validity or enforceability of any agreement facilitated through the platform.</p>
        </Section>
        <Section title="Translations">
          <p>Translation features are provided for convenience only. In the event of any discrepancy, the original signed language of a document or agreement controls.</p>
        </Section>
        <Section title="No Legal Advice">
          <p>Nothing in the Marketplace constitutes legal advice. Both creators and licensees are strongly advised to consult a qualified music attorney before executing significant transactions.</p>
        </Section>
      </div>
    </AppShell>
  )
}
