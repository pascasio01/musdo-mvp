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

export default function Terms() {
  const navigate = useNavigate()

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={18} />
        </button>
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Legal</p>
        <h1 className="text-white font-black text-3xl mb-2">Terms of Service</h1>
        <p className="text-zinc-600 text-xs mb-8">Last updated: May 2026 · MVP Beta Version</p>

        <div className="rounded-2xl bg-amber-900/15 border border-amber-500/20 p-4 mb-6">
          <p className="text-zinc-500 text-xs leading-relaxed">This is not legal advice. These terms are in draft form for the MVP. They should be reviewed by a qualified attorney before public launch.</p>
        </div>

        <Section title="1. Acceptance of Terms">
          <p>By accessing or using MUSVORA, you agree to be bound by these Terms of Service. If you do not agree, do not use the platform.</p>
        </Section>
        <Section title="2. Platform Description">
          <p>MUSVORA is a technology platform designed for music discovery, creator protection, and licensing. MUSVORA is not a label, publisher, or legal rights authority.</p>
        </Section>
        <Section title="3. User Responsibilities">
          <p>Users are solely responsible for content they upload. By uploading content, you represent that you own or have the rights to that content.</p>
          <p>You agree not to upload content that infringes on third-party rights, violates applicable law, or violates MUSVORA community standards.</p>
        </Section>
        <Section title="4. Content Removal">
          <p>MUSVORA may remove content that violates these Terms, applicable law, or the rights of third parties, without prior notice.</p>
        </Section>
        <Section title="5. Limitation of Liability">
          <p>MUSVORA does not guarantee income, success, copyright validity, legal outcomes, or royalty collection. Platform tools are provided as-is during MVP/beta.</p>
          <p>To the maximum extent permitted by law, MUSVORA's liability is limited to the amount paid by the user in the preceding 30 days.</p>
        </Section>
        <Section title="6. Changes to Terms">
          <p>MUSVORA reserves the right to modify these terms at any time. Continued use of the platform constitutes acceptance of updated terms.</p>
        </Section>
        <Section title="7. Contact">
          <p>Questions about these terms may be directed to MUSVORA Support.</p>
        </Section>
      </div>
    </AppShell>
  )
}
