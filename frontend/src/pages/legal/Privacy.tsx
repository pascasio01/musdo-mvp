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

export default function Privacy() {
  const navigate = useNavigate()

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={18} />
        </button>
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Legal</p>
        <h1 className="text-white font-black text-3xl mb-2">Privacy Policy</h1>
        <p className="text-zinc-600 text-xs mb-8">Last updated: May 2026 · MVP Beta Version</p>

        <div className="rounded-2xl bg-amber-900/15 border border-amber-500/20 p-4 mb-6">
          <p className="text-zinc-500 text-xs">This is a draft privacy policy for MVP purposes. It should be reviewed by a qualified attorney before public launch.</p>
        </div>

        <Section title="1. Data We Collect">
          <p>We collect account information (email, username), usage data (streams, actions), uploaded content metadata, and device/session information.</p>
        </Section>
        <Section title="2. How We Use Data">
          <p>Data is used to provide and improve the platform, process authentication, facilitate licensing, and communicate important updates.</p>
          <p>We do not sell your personal data to third parties.</p>
        </Section>
        <Section title="3. Verification Data">
          <p>Creator verification information including legal name, government ID, and social links are stored securely. Legal identity is never displayed publicly. Only artist name and badges appear on public profiles.</p>
        </Section>
        <Section title="4. Data Storage">
          <p>Data is stored via Supabase (PostgreSQL) with row-level security. Audio files and assets are stored in Supabase Storage with access controls.</p>
        </Section>
        <Section title="5. Data Retention">
          <p>You may request deletion of your account and associated data. Some data may be retained for legal compliance, dispute resolution, or audit requirements.</p>
        </Section>
        <Section title="6. Third-Party Services">
          <p>MUSDO may use third-party services for authentication, storage, payments, and analytics. These services have their own privacy policies.</p>
        </Section>
        <Section title="7. Contact">
          <p>Privacy questions can be directed to MUSDO Support.</p>
        </Section>
      </div>
    </AppShell>
  )
}
