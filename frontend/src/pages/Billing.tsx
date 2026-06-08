import { useEffect, useState } from 'react'
import { ArrowLeft, CreditCard, Receipt, RefreshCw, ExternalLink, Loader2, Download } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AppShell from '../layouts/AppShell'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import { supabase } from '../lib/supabase'
import { useSubscription } from '../lib/useSubscription'
import { openCustomerPortal } from '../lib/billing'
import type { DbBillingInvoice, SubscriptionPlan, SubscriptionStatus } from '../types/database.types'

const PLAN_LABEL: Record<SubscriptionPlan, string> = {
  free: 'Free',
  premium: 'Premium',
  creator_pro: 'Creator Pro',
}

const PLAN_PRICE: Record<SubscriptionPlan, string> = {
  free: '$0 / month',
  premium: '$7.99 / month',
  creator_pro: '$14.99 / month',
}

function statusLabel(status: SubscriptionStatus, cancelAtPeriodEnd: boolean): string {
  if (cancelAtPeriodEnd) return 'Cancels at period end'
  switch (status) {
    case 'trialing': return 'Free trial'
    case 'active': return 'Active'
    case 'past_due': return 'Payment past due'
    case 'unpaid': return 'Unpaid'
    case 'paused': return 'Paused'
    case 'canceled': return 'Canceled'
    default: return 'Inactive'
  }
}

function fmtDate(d: Date | null): string {
  if (!d) return '—'
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function fmtAmount(cents: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency.toUpperCase() })
      .format((cents ?? 0) / 100)
  } catch {
    return `$${((cents ?? 0) / 100).toFixed(2)}`
  }
}

// A finalized invoice always carries a hosted receipt and/or PDF. Prefer the
// hosted page (it offers both view + download), fall back to the raw PDF.
function receiptUrl(inv: DbBillingInvoice): string | null {
  return inv.hosted_invoice_url || inv.invoice_pdf || null
}

// Wrap a CSV cell, escaping quotes and forcing text so spreadsheets don't
// mangle values. Returns an empty quoted string for null/undefined.
function csvCell(value: string | number | null | undefined): string {
  const s = value == null ? '' : String(value)
  return `"${s.replace(/"/g, '""')}"`
}

function buildInvoiceCsv(invoices: DbBillingInvoice[]): string {
  const header = [
    'Invoice ID', 'Date', 'Plan', 'Amount', 'Currency', 'Status', 'Receipt URL',
  ]
  const rows = invoices.map(inv => [
    csvCell(inv.id),
    csvCell(inv.created_at ? new Date(inv.created_at).toISOString().slice(0, 10) : ''),
    csvCell(inv.plan && inv.plan in PLAN_LABEL ? PLAN_LABEL[inv.plan as SubscriptionPlan] : 'Subscription'),
    csvCell(((inv.amount_total ?? 0) / 100).toFixed(2)),
    csvCell((inv.currency ?? 'usd').toUpperCase()),
    csvCell(inv.status ?? 'pending'),
    csvCell(receiptUrl(inv) ?? ''),
  ].join(','))
  return [header.map(csvCell).join(','), ...rows].join('\r\n')
}

export default function Billing() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()
  const sub = useSubscription()
  const [params, setParams] = useSearchParams()
  const [invoices, setInvoices] = useState<DbBillingInvoice[]>([])
  const [invoicesLoading, setInvoicesLoading] = useState(true)
  const [portalBusy, setPortalBusy] = useState(false)
  const [exportBusy, setExportBusy] = useState(false)

  // Returning from Stripe Checkout: confirm + pull fresh state.
  useEffect(() => {
    const checkout = params.get('checkout')
    if (checkout === 'success') {
      toast.success('Subscription confirmed. Welcome aboard.')
      sub.refresh()
      params.delete('checkout')
      setParams(params, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let active = true
    if (!user) { setInvoices([]); setInvoicesLoading(false); return }
    setInvoicesLoading(true)
    supabase
      .from('billing_invoices')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(24)
      .then(({ data }) => {
        if (!active) return
        setInvoices((data as DbBillingInvoice[] | null) ?? [])
        setInvoicesLoading(false)
      })
    return () => { active = false }
  }, [user])

  const openPortal = async () => {
    setPortalBusy(true)
    const res = await openCustomerPortal()
    if (!res.ok) {
      toast.error(res.error === 'no_customer'
        ? 'No billing account yet. Start a plan to manage billing.'
        : 'Could not open billing. Please try again.')
      setPortalBusy(false)
    }
  }

  const exportCsv = async () => {
    if (!user || exportBusy) return
    setExportBusy(true)
    // Export the FULL history, not just the page slice shown above. Page in
    // chunks so users with long histories get a complete file.
    const all: DbBillingInvoice[] = []
    const PAGE = 1000
    let from = 0
    let failed = false
    for (;;) {
      const { data, error } = await supabase
        .from('billing_invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(from, from + PAGE - 1)
      if (error) { failed = true; break }
      const batch = (data as DbBillingInvoice[] | null) ?? []
      all.push(...batch)
      if (batch.length < PAGE) break
      from += PAGE
    }
    if (failed) {
      toast.error('Could not export payment history. Please try again.')
      setExportBusy(false)
      return
    }
    if (all.length === 0) {
      toast.error('No payment history to export yet.')
      setExportBusy(false)
      return
    }
    const csv = buildInvoiceCsv(all)
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `musvora-payment-history-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`Exported ${all.length} ${all.length === 1 ? 'invoice' : 'invoices'}.`)
    setExportBusy(false)
  }

  const plan = sub.plan
  const paid = sub.isPaid
  const renewalDate = sub.isTrialing ? sub.trialEnd : sub.currentPeriodEnd

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>

        <h1 className="text-white font-black text-3xl mb-8">Billing</h1>

        {/* Current plan */}
        <div className="rounded-3xl bg-gradient-to-br from-violet-950/60 to-zinc-900 border border-violet-500/20 p-6 mb-6">
          <div className="flex items-center justify-between mb-1">
            <p className="text-zinc-500 text-xs uppercase tracking-wider">Current Plan</p>
            {sub.loading ? (
              <Loader2 size={14} className="text-zinc-500 animate-spin" />
            ) : (
              <span className="text-[11px] font-semibold text-zinc-300 bg-white/10 border border-white/10 rounded-full px-2.5 py-0.5">
                {statusLabel(sub.status, sub.cancelAtPeriodEnd)}
              </span>
            )}
          </div>
          <h2 className="text-white font-black text-2xl mb-1">{PLAN_LABEL[plan]}</h2>
          <p className="text-zinc-400 text-sm mb-4">
            {PLAN_PRICE[plan]}
            {paid && renewalDate && (
              <> · {sub.cancelAtPeriodEnd ? 'Ends' : sub.isTrialing ? 'Trial ends' : 'Renews'} {fmtDate(renewalDate)}</>
            )}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/pricing')}
              className="flex-1 py-3 rounded-2xl bg-white text-black text-sm font-bold hover:opacity-90 transition-opacity"
            >
              {paid ? 'Change Plan' : 'Upgrade'}
            </button>
            {paid && (
              <button
                onClick={openPortal}
                disabled={portalBusy}
                className="flex-1 py-3 rounded-2xl bg-white/10 border border-white/10 text-white text-sm font-semibold hover:bg-white/15 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {portalBusy ? <Loader2 size={15} className="animate-spin" /> : 'Manage'}
              </button>
            )}
          </div>
        </div>

        {/* Payment method — managed by Stripe, never stored by MUSVORA */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={16} className="text-zinc-500" />
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Payment Method</p>
          </div>
          <p className="text-zinc-500 text-sm leading-relaxed mb-4">
            Payment methods are managed securely by Stripe. MUSVORA never stores your card details.
          </p>
          <button
            onClick={openPortal}
            disabled={portalBusy || !sub.hasCustomer}
            className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-zinc-300 text-sm font-semibold hover:bg-white/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {portalBusy ? <Loader2 size={15} className="animate-spin" /> : (<>Manage in Stripe <ExternalLink size={13} /></>)}
          </button>
          {!sub.hasCustomer && (
            <p className="text-zinc-600 text-xs mt-3">Start a paid plan to add a payment method.</p>
          )}
        </div>

        {/* Real payment history */}
        <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden mb-6">
          <div className="px-5 pt-5 pb-3 flex items-center gap-2 border-b border-white/5">
            <Receipt size={16} className="text-zinc-500" />
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Payment History</p>
            {invoices.length > 0 && (
              <button
                onClick={exportCsv}
                disabled={exportBusy}
                className="ml-auto flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 py-1 transition-colors disabled:opacity-60"
              >
                {exportBusy ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />} Export CSV
              </button>
            )}
          </div>
          {invoicesLoading ? (
            <div className="px-5 py-8 flex items-center justify-center">
              <Loader2 size={18} className="text-zinc-600 animate-spin" />
            </div>
          ) : invoices.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-zinc-500 text-sm">No payments yet.</p>
              <p className="text-zinc-600 text-xs mt-1">Your invoices will appear here after your first charge.</p>
            </div>
          ) : (
            invoices.map(inv => {
              const planName = inv.plan && inv.plan in PLAN_LABEL
                ? PLAN_LABEL[inv.plan as SubscriptionPlan]
                : 'Subscription'
              const receipt = receiptUrl(inv)
              const row = (
                <>
                  <div className="flex-1">
                    <p className="text-white text-sm font-semibold">{planName}</p>
                    <p className="text-zinc-600 text-xs">{fmtDate(inv.created_at ? new Date(inv.created_at) : null)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{fmtAmount(inv.amount_total, inv.currency)}</p>
                    <p className={`text-xs ${inv.status === 'paid' ? 'text-green-400' : 'text-zinc-500'}`}>
                      {inv.status ?? 'pending'}
                    </p>
                  </div>
                  {receipt
                    ? <ExternalLink size={14} className="text-zinc-700" />
                    : <span className="text-zinc-700 text-[10px] uppercase tracking-wide">No receipt</span>}
                </>
              )
              return receipt ? (
                <a
                  key={inv.id}
                  href={receipt}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                >
                  {row}
                </a>
              ) : (
                <div key={inv.id} className="flex items-center gap-3 px-5 py-4 border-b border-white/5 last:border-0">
                  {row}
                </div>
              )
            })
          )}
        </div>

        <p className="text-zinc-600 text-xs mb-6 px-1 leading-relaxed">
          Stripe emails you a receipt automatically after each successful payment, sent to your billing
          email and showing the real amount charged. Update your billing email anytime via Manage in Stripe.
        </p>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw size={16} className="text-zinc-500" />
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Refund Request</p>
          </div>
          <p className="text-zinc-500 text-sm mb-4 leading-relaxed">
            Refund requests are reviewed by the MUSVORA Team. See our Refund Policy for eligibility.
          </p>
          <button
            onClick={() => navigate('/refund-policy')}
            className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 text-sm font-semibold hover:bg-white/10 transition-colors"
          >
            View Refund Policy
          </button>
        </div>
      </div>
    </AppShell>
  )
}
