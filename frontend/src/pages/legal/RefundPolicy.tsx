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

export default function RefundPolicy() {
  const navigate = useNavigate()

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={18} />
        </button>
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Legal</p>
        <h1 className="text-white font-black text-3xl mb-2">Refund Policy</h1>
        <p className="text-zinc-600 text-xs mb-8">Last updated: May 2026 · MVP Beta Version</p>

        <div className="rounded-2xl bg-amber-900/15 border border-amber-500/20 p-4 mb-6">
          <p className="text-zinc-500 text-xs">No real payments are processed in this MVP version. This policy applies to the future live platform.</p>
        </div>

        <Section title="Subscription Refunds">
          <p>Subscription fees are generally non-refundable once a billing period has started. Exceptions may be considered in cases of technical failure or billing error.</p>
          <p>Cancellation stops future charges but does not refund the current period.</p>
        </Section>
        <Section title="Verification Review Fee">
          <p>The $9.99 verification review fee is non-refundable. This fee covers the review process only and does not guarantee approval.</p>
        </Section>
        <Section title="Marketplace Transactions">
          <p>Completed license transactions are final. Refunds for marketplace purchases are only considered in cases of fraudulent listings or technical error on MUSDO's part.</p>
        </Section>
        <Section title="How to Request">
          <p>To request a refund consideration, contact MUSDO Support with your account email, transaction ID, and reason. Requests are reviewed within 5 business days.</p>
          <p>MUSDO reserves the right to deny refund requests not meeting policy criteria.</p>
        </Section>
        <Section title="Billing Note">
          <p>This policy does not override applicable consumer protection laws in your jurisdiction.</p>
        </Section>
      </div>
    </AppShell>
  )
}
