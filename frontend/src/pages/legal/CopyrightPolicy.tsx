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

export default function CopyrightPolicy() {
  const navigate = useNavigate()

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={18} />
        </button>
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Legal</p>
        <h1 className="text-white font-black text-3xl mb-2">Copyright Policy</h1>
        <p className="text-zinc-600 text-xs mb-8">June 2026</p>

        <Section title="Ownership & Authorization">
          <p>You may only upload music, lyrics, contracts, demos, masters and metadata that you own or are authorized to manage. You are responsible for the content you upload to MUSVORA and for ensuring you hold the necessary rights.</p>
        </Section>
        <Section title="MUSVORA Does Not Determine Ownership">
          <p>MUSVORA does not determine final legal ownership of any work. Our tools help you organize, document and protect your catalogue, but they do not certify, adjudicate or legally verify who owns a work. Ownership states are shown as <span className="text-white">Pending Verification</span> or <span className="text-white">Requires Confirmation</span>, never as certified or legally verified.</p>
        </Section>
        <Section title="Infringement & Content Removal">
          <p>MUSVORA may remove disputed or infringing content. If a work is the subject of a credible ownership dispute or infringement claim, we may restrict, hide or remove it while the matter is reviewed.</p>
        </Section>
        <Section title="Account Enforcement">
          <p>MUSVORA may suspend accounts for fraud, infringement, abuse or misuse of the platform. Repeated or serious violations may result in permanent removal.</p>
        </Section>
        <Section title="Reporting Infringement (DMCA)">
          <p>Copyright infringement claims and takedown requests are handled through our DMCA Policy. Please refer to that document for the notice-and-takedown procedure and counter-notice process.</p>
        </Section>
        <Section title="No Legal Advice">
          <p>MUSVORA does not provide legal advice. This policy is informational only. For questions about your rights, consult a qualified attorney.</p>
        </Section>
      </div>
    </AppShell>
  )
}
