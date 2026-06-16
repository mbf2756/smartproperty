'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DashboardTopbar } from '@/components/DashboardTopbar'
import { calculateProperty, fmtCurrency, fmtPct, SAMPLE_PROPERTIES } from '@/lib/calculations'
import { LockedPage } from '@/components/PaywallOverlay'

const ALL_PAID_PLANS = ['optimiser','retirement','optimiser_quarterly','single_smartsuper','single_smartetf','single_smartproperty','double_ss_se','double_ss_sp','double_se_sp','triple_all','investor','broker']

const portfolio = SAMPLE_PROPERTIES.map(p => ({ ...p, results: calculateProperty(p.inputs) }))
const totalValue  = portfolio.reduce((s, p) => s + p.inputs.purchasePrice, 0)
const totalLoan   = portfolio.reduce((s, p) => s + p.inputs.purchasePrice * (1 - p.inputs.depositPercent / 100), 0)
const totalEquity = totalValue - totalLoan
const totalCF     = portfolio.reduce((s, p) => s + p.results.afterTaxCashFlow, 0)
const totalRefund = portfolio.reduce((s, p) => s + p.results.taxRefund, 0)
const totalProj   = portfolio.reduce((s, p) => s + p.results.projectedValue, 0)

const C = { forest: '#1A2F1A', gold: '#C9963A', cream: '#F7F4EE', cream2: '#EDE8DF' }

export default function DashboardPage() {
  const [isPaid, setIsPaid]   = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setChecked(true); return }
        const { data } = await supabase.from('subscriptions').select('plan,apps,status').eq('user_id', user.id).single()
        if (data?.status === 'active') {
          setIsPaid(ALL_PAID_PLANS.includes(data.plan ?? '') || (data.apps ?? []).includes('smartproperty'))
        }
      } catch {}
      setChecked(true)
    }
    load()
  }, [])

  if (checked && !isPaid) {
    return (
      <div>
        <DashboardTopbar title="Portfolio overview" subtitle="Investor plan required" />
        <LockedPage
          title="Portfolio Dashboard"
          icon="⬡"
          description="Track up to 10 investment properties in one view. Total equity, aggregate cash flow, combined ATO tax refunds, and 10-year growth projection. Available on the Investor plan."
          plan="investor"
        />
      </div>
    )
  }

  return (
    <div>
      <DashboardTopbar title="Portfolio overview" subtitle={`${portfolio.length} properties · Sample data`} />
      <div style={{ padding: '32px 40px', maxWidth: 1100 }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'Portfolio value', value: fmtCurrency(totalValue), sub: `${portfolio.length} properties` },
            { label: 'Total equity', value: fmtCurrency(totalEquity), sub: `LVR avg ${fmtPct(totalLoan / totalValue * 100)}` },
            { label: 'After-tax CF', value: `${fmtCurrency(totalCF / 52)}/wk`, sub: `${fmtCurrency(totalCF)}/yr`, accent: totalCF >= 0 },
            { label: 'ATO refunds', value: fmtCurrency(totalRefund), sub: 'per year', accent: true },
          ].map(m => (
            <div key={m.label} style={{ background: 'white', borderRadius: 14, padding: '18px', border: '1px solid rgba(26,47,26,0.1)' }}>
              <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(26,47,26,0.4)', marginBottom: 6 }}>{m.label}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 700, color: m.accent ? C.gold : C.forest }}>{m.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(26,47,26,0.4)', marginTop: 3 }}>{m.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ background: C.forest, borderRadius: 16, padding: '22px 28px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: C.gold, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>10-year projection · avg 6% growth</div>
            <div style={{ fontFamily: 'monospace', fontSize: 28, fontWeight: 700, color: C.gold }}>{fmtCurrency(totalProj)}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Projected portfolio value</div>
          </div>
          <Link href="/cgt" style={{ padding: '11px 20px', borderRadius: 12, background: 'rgba(201,150,58,0.15)', color: C.gold, fontWeight: 700, fontSize: 13, textDecoration: 'none', border: '1px solid rgba(201,150,58,0.25)' }}>
            CGT planner →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
          {portfolio.map(p => (
            <div key={p.id} style={{ background: 'white', borderRadius: 14, padding: '18px', border: '1px solid rgba(26,47,26,0.1)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.forest, marginBottom: 2 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: 'rgba(26,47,26,0.45)', marginBottom: 12 }}>{p.address}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                <div style={{ background: C.cream, borderRadius: 8, padding: '8px' }}>
                  <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(26,47,26,0.4)', marginBottom: 2 }}>Value</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: C.forest }}>{fmtCurrency(p.inputs.purchasePrice)}</div>
                </div>
                <div style={{ background: C.cream, borderRadius: 8, padding: '8px' }}>
                  <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(26,47,26,0.4)', marginBottom: 2 }}>Yield</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: C.forest }}>{fmtPct(p.results.grossYield)}</div>
                </div>
                <div style={{ background: C.cream, borderRadius: 8, padding: '8px' }}>
                  <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(26,47,26,0.4)', marginBottom: 2 }}>/wk</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: p.results.weeklyAfterTaxCashFlow >= 0 ? '#16A34A' : '#EF4444' }}>{fmtCurrency(p.results.weeklyAfterTaxCashFlow)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Link href="/analyser" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'white', borderRadius: 14, border: `2px dashed rgba(26,47,26,0.15)`, textDecoration: 'none', fontSize: 13, fontWeight: 600, color: 'rgba(26,47,26,0.45)' }}>
          + Analyse another property
        </Link>
        <p style={{ fontSize: 11, color: 'rgba(26,47,26,0.35)', textAlign: 'center', marginTop: 16 }}>Sample data shown. Sign up to save your real properties.</p>
      </div>
    </div>
  )
}
