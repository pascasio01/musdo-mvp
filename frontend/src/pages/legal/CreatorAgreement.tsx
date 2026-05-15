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

export default function CreatorAgreement() {
  const navigate = useNavigate()

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={18} />
        </button>
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Legal</p>
        <h1 className="text-white font-black text-3xl mb-2">Creator Agreement</h1>
        <p className="text-zinc-600 text-xs mb-8">Last updated: May 2026 · MVP Beta Version</p>

        <div className="rounded-2xl bg-amber-900/15 border border-amber-500/20 p-4 mb-6">
          <p className="text-zinc-500 text-xs">This is a draft agreement. It should be reviewed by a qualified attorney before public launch. This is not legal advice.</p>
        </div>

        <Section title="1. Creator Eligibility">
          <p>To publish content on the MUSDO marketplace, creators must complete the verification process and meet minimum eligibility requirements.</p>
        </Section>
        <Section title="2. Content Ownership">
          <p>By uploading content, you affirm that you own all rights to that content or have authorization from the rights holder. MUSDO takes no ownership of your content.</p>
        </Section>
        <Section title="3. License Grants">
          <p>When you list a song for licensing on MUSDO, you grant MUSDO a limited, non-exclusive license to display and facilitate the licensing of that song.</p>
          <p>You control the license types offered (exclusive, non-exclusive, sync, publishing). MUSDO is not a party to the license agreement between creator and buyer.</p>
        </Section>
        <Section title="4. Revenue Split">
          <p>Creators receive 90% of marketplace license fees. MUSDO retains 10% as a platform fee, before payment processor fees apply.</p>
          <p>Revenue tracking in the current MVP is for display purposes only. Actual payouts require full payment integration at launch.</p>
        </Section>
        <Section title="5. Human Verification">
          <p>The Human Verified badge indicates that content was verified as human-created through MUSDO's review process. MUSDO does not warrant the absence of AI assistance in any content.</p>
        </Section>
        <Section title="6. Content Removal">
          <p>MUSDO may remove content that violates these terms, applicable law, or third-party rights.</p>
        </Section>
        <Section title="7. Disclaimers">
          <p>MUSDO does not guarantee income, streams, licensing success, copyright validity, or legal protection. Licensing agreements should be reviewed by a qualified attorney.</p>
        </Section>
      </div>
    </AppShell>
  )
}
