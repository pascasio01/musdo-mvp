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

export default function SecurityPolicy() {
  const navigate = useNavigate()

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-8">
        <button onClick={() => navigate(-1)} aria-label="Back" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={18} />
        </button>
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Legal</p>
        <h1 className="text-white font-black text-3xl mb-2">Security Policy</h1>
        <p className="text-zinc-600 text-xs mb-8">Last updated: May 2026 · MVP Beta Version</p>

        <div className="rounded-2xl bg-amber-900/15 border border-amber-500/20 p-4 mb-6">
          <p className="text-zinc-500 text-xs leading-relaxed">This document describes MUSVORA's security foundation. Some controls are implemented today and others are planned as the platform matures. It is not a warranty of absolute security.</p>
        </div>

        <Section title="1. Our Approach">
          <p>MUSVORA treats music assets as sensitive infrastructure. We aim to apply industry-standard controls and to be accurate about what is implemented today versus what is planned.</p>
        </Section>
        <Section title="2. Data in Transit">
          <p>Connections to MUSVORA are encrypted in transit using HTTPS/TLS. This protects data moving between your device and our service providers.</p>
        </Section>
        <Section title="3. Data at Rest">
          <p>Account data and uploaded assets are stored with our infrastructure providers (such as Supabase PostgreSQL and Storage), where data is encrypted at rest by the provider.</p>
          <p>MUSVORA does not currently provide end-to-end encryption. We do not claim end-to-end encryption.</p>
        </Section>
        <Section title="4. Access Controls">
          <p>MUSVORA uses role-based access and database row-level security so that users can access their own data and privileged actions are restricted. Administrative and service credentials are never exposed to the client application.</p>
        </Section>
        <Section title="5. Audit Logs">
          <p>Selected security-relevant events may be logged to support accountability and review. Expanded, user-visible audit history is part of the planned security foundation.</p>
        </Section>
        <Section title="6. Secure File Handling">
          <p>Uploaded files are handled through access-controlled storage with scoped permissions. Hardening of file scanning and validation is part of the planned security foundation.</p>
        </Section>
        <Section title="7. Planned / Security Foundation">
          <p>The following are planned or in progress and are not guaranteed to be active today: two-factor authentication, expanded audit history, rate limiting, automated file scanning, and additional intrusion monitoring.</p>
        </Section>
        <Section title="8. Your Responsibilities">
          <p>Use a strong, unique password and keep your credentials private. Do not share private contracts outside trusted parties. We recommend legal review before signing licenses or executing significant agreements.</p>
        </Section>
        <Section title="9. Reporting a Vulnerability">
          <p>If you discover a security issue, please contact MUSVORA Support so we can investigate. We appreciate responsible disclosure.</p>
        </Section>
      </div>
    </AppShell>
  )
}
