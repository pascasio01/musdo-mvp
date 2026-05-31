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

export default function UserContentPolicy() {
  const navigate = useNavigate()

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-8">
        <button onClick={() => navigate(-1)} aria-label="Back" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={18} />
        </button>
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Legal</p>
        <h1 className="text-white font-black text-3xl mb-2">User Content Policy</h1>
        <p className="text-zinc-600 text-xs mb-8">Last updated: May 2026 · MVP Beta Version</p>

        <div className="rounded-2xl bg-amber-900/15 border border-amber-500/20 p-4 mb-6">
          <p className="text-zinc-500 text-xs leading-relaxed">This is a draft policy for MVP purposes. It is not legal advice and should be reviewed by a qualified attorney before public launch.</p>
        </div>

        <Section title="1. Scope">
          <p>This policy governs all content you upload, store, or manage on MUSVORA — including songs, masters, demos, stems, lyrics, contracts, split sheets, metadata, and any supporting documentation.</p>
        </Section>
        <Section title="2. You Are Responsible for Your Content">
          <p>You are solely responsible for the accuracy of everything you upload, including works, contracts, lyrics, demos, splits, and metadata. MUSVORA does not verify, correct, or guarantee the accuracy of user-provided information.</p>
        </Section>
        <Section title="3. Ownership & Authorization">
          <p>You must only upload content that you own or are explicitly authorized to manage. By uploading, you represent that you hold the necessary rights or permissions for every asset and every contributor listed.</p>
          <p>Do not upload works you do not own or control.</p>
        </Section>
        <Section title="4. Prohibited Content">
          <p>Do not upload content that infringes third-party rights, misrepresents authorship or rights status, contains illegal material, or violates applicable law or MUSVORA policies.</p>
        </Section>
        <Section title="5. Content Removal">
          <p>MUSVORA may remove disputed, infringing, or non-compliant content at its discretion, with or without prior notice, to protect rights holders and the integrity of the platform.</p>
        </Section>
        <Section title="6. Account Suspension">
          <p>MUSVORA may suspend or terminate accounts engaged in fraud, infringement, misrepresentation, or abuse. Severe or repeated violations may be escalated to appropriate authorities.</p>
        </Section>
        <Section title="7. No Determination of Ownership">
          <p>MUSVORA provides tools to organize and document ownership but does not determine final legal ownership, resolve disputes, or certify copyright. Ownership confidence indicators are informational only.</p>
        </Section>
        <Section title="8. Handling Sensitive Documents">
          <p>Contracts and private agreements are sensitive. Do not share private contracts outside trusted parties, and review documents carefully before uploading or distributing them.</p>
        </Section>
        <Section title="9. Contact">
          <p>Questions about this policy or content disputes may be directed to MUSVORA Support.</p>
        </Section>
      </div>
    </AppShell>
  )
}
