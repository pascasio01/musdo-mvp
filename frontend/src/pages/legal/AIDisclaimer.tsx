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

export default function AIDisclaimer() {
  const navigate = useNavigate()

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={18} />
        </button>
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Legal</p>
        <h1 className="text-white font-black text-3xl mb-2">AI Disclaimer</h1>
        <p className="text-zinc-600 text-xs mb-8">May 2026</p>

        <Section title="Use of AI on MUSVORA">
          <p>MUSVORA may use AI tools internally for recommendations, content review assistance, analytics, and platform suggestions. AI suggestions are reviewed by humans before any action is taken.</p>
        </Section>
        <Section title="AI Limitations">
          <p>AI tools used by MUSVORA have inherent limitations. They may produce errors, biases, or incorrect suggestions. MUSVORA does not rely solely on AI for content moderation or verification decisions.</p>
        </Section>
        <Section title="Human Verified Badge">
          <p>The Human Verified badge is applied based on a human review process. MUSVORA uses this badge to indicate content that has passed a human review, not a technically definitive AI-detection test.</p>
          <p>AI detection technology is imperfect. MUSVORA makes no absolute claim about the absence of AI assistance in verified content.</p>
        </Section>
        <Section title="AI-Generated Content Policy">
          <p>Content generated primarily by AI without meaningful human creative contribution is not eligible for the Human Verified badge and may be ineligible for certain marketplace features.</p>
        </Section>
        <Section title="Future AI Features">
          <p>Future AI features such as recommendations, adaptive UI, and analytics are planned. These features will be governed by this disclaimer and updated as features launch.</p>
        </Section>
        <Section title="No AI Authority">
          <p>No AI system has authority to modify owner permissions, delete platform data, change billing, or take administrative actions on MUSVORA. AI tools are advisory only.</p>
        </Section>
        <Section title="Suggestions Only — Human Review Required">
          <p>AI features on MUSVORA provide suggestions only and require human review before any decision is made. AI output is assistance, not a determination, and must always be confirmed by a person.</p>
          <p>The AI Contract Checker reviews documents to flag potential gaps; it does not replace legal counsel and does not certify that a document is legally valid. Consult a qualified attorney for legal review.</p>
        </Section>
      </div>
    </AppShell>
  )
}
