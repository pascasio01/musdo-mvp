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

export default function DMCA() {
  const navigate = useNavigate()

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={18} />
        </button>
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Legal</p>
        <h1 className="text-white font-black text-3xl mb-2">DMCA Policy</h1>
        <p className="text-zinc-600 text-xs mb-8">Digital Millennium Copyright Act · May 2026</p>

        <Section title="Overview">
          <p>MUSVORA respects intellectual property rights and expects users to do the same. We respond to valid DMCA takedown notices in accordance with applicable law.</p>
        </Section>
        <Section title="Filing a Takedown Notice">
          <p>To report copyright infringement, provide the following in writing to MUSVORA Legal:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Identification of the copyrighted work claimed to be infringed</li>
            <li>Identification of the infringing material and its location on MUSVORA</li>
            <li>Your contact information (name, address, phone, email)</li>
            <li>A statement of good faith belief that the use is unauthorized</li>
            <li>A statement of accuracy under penalty of perjury</li>
            <li>Your physical or electronic signature</li>
          </ul>
        </Section>
        <Section title="Counter-Notification">
          <p>If you believe content was removed in error, you may file a counter-notification with MUSVORA Legal containing the required statutory elements.</p>
        </Section>
        <Section title="Repeat Infringers">
          <p>MUSVORA will terminate accounts of users who are repeat copyright infringers in appropriate circumstances.</p>
        </Section>
        <Section title="Contact">
          <p>DMCA notices should be sent to MUSVORA Legal. Do not send general support queries to the DMCA contact.</p>
        </Section>
      </div>
    </AppShell>
  )
}
