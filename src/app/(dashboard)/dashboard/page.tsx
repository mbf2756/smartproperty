'use client'
import Link from 'next/link'
import { DashboardTopbar } from '@/components/DashboardTopbar'
import { calculateProperty, fmtCurrency, fmtPct, SAMPLE_PROPERTIES } from '@/lib/calculations'

const portfolio = SAMPLE_PROPERTIES.map(p => ({
  ...p,
  results: calculateProperty(p.inputs),
}))

const totalValue = portfolio.reduce((s, p) => s + p.inputs.purchasePrice, 0)
const totalLoan  = portfolio.reduce((s, p) => s + p.inputs.purchasePrice * (1 - p.inputs.depositPercent / 100), 0)
const totalEquity = totalValue - totalLoan
const totalCF    = portfolio.reduce((s, p) => s + p.results.afterTaxCashFlow, 0)
const totalRefund = portfolio.reduce((s, p) => s + p.results.taxRefund, 0)
const totalProjected = portfolio.reduce((s, p) => s + p.results.projectedValue, 0)

const S = {
  card: { background: 'white', borderRadius: 16, padding: '24px', border: '1px solid rgba(15,30,60,0.1)' } as React.CSSProperties,
  sectionLabel: { fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'rgba(15,30,60,0.4)', marginBottom: 16 },
}

export default function DashboardPage() {
  return (
    <div>
      <DashboardTopbar title="Portfolio overview" subtitle={`${portfolio.length} properties · Sample data`} isPaid={false} />

      <div style={{ padding: '32px 40px', maxWidth: 1100 }}>

        {/* Summary stat row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'Portfolio value', value: fmtCurrency(totalValue), sub: `${portfolio.length} properties`, accent: false },
            { label: 'Total equity', value: fmtCurrency(totalEquity), sub: `LVR avg ${fmtPct((totalLoan / totalValue) * 100)}`, accent: false },
            { label: 'After-tax cash flow', value: `${fmtCurrency(totalCF / 52)}/wk`, sub: `${fmtCurrency(totalCF)}/yr`, accent: totalCF >= 0 },
            { label: 'Total ATO refunds', value: fmtCurrency(totalRefund), sub: 'per year', accent: true },
          ].map(m => (
            <div key={m.label} style={S.card}>
              <div style={S.sectionLabel}>{m.label}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 700, color: m.accent ? '#00A888' : '#0F1E3C', letterSpacing: '-0.02em' }}>{m.value}</div>
              {m.sub && <div style={{ fontSize: 11, color: 'rgba(15,30,60,0.4)', marginTop: 3 }}>{m.sub}</div>}
            </div>
          ))}
        </div>

        {/* Growth projection */}
        <div style={{ background: '#0F1E3C', borderRadius: 16, padding: '22px 28px', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#00D4AA', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>10-year projection · avg 6% growth</div>
            <div style={{ fontFamily: 'monospace', fontSize: 30, fontWeight: 700, color: '#00D4AA', letterSpacing: '-0.03em' }}>{fmtCurrency(totalProjected)}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Projected portfolio value · CGT not yet modelled</div>
          </div>
          <Link href="/cgt" style={{ padding: '12px 20px', borderRadius: 12, background: 'rgba(0,212,170,0.12)', color: '#00D4AA', fontWeight: 700, fontSize: 13, textDecoration: 'none', whiteSpace: 'nowrap', border: '1px solid rgba(0,212,170,0.2)' }}>
            Model CGT scenarios →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
          {/* Properties */}
          <div style={S.card}>
            <div style={{ ...S.sectionLabel, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Properties</span>
              <Link href="/portfolio" style={{ fontSize: 11, color: '#00A888', textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {portfolio.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#F5F4F0', borderRadius: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F1E3C' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(15,30,60,0.45)', marginTop: 1 }}>{p.address}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: p.results.afterTaxCashFlow >= 0 ? '#00A888' : '#EF4444' }}>
                      {fmtCurrency(p.results.weeklyAfterTaxCashFlow)}/wk
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(15,30,60,0.4)', marginTop: 1 }}>{fmtPct(p.results.grossYield)} yield</div>
                  </div>
                </div>
              ))}
              <Link href="/analyser" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', background: 'rgba(0,212,170,0.08)', borderRadius: 10, fontSize: 12, fontWeight: 600, color: '#00A888', textDecoration: 'none', border: '1px dashed rgba(0,212,170,0.3)' }}>
                + Analyse another property
              </Link>
            </div>
          </div>

          {/* Quick access tools */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={S.sectionLabel}>Tools</div>
            {[
              { icon: '⌂', label: 'Property Analyser', desc: 'Model a new acquisition — cash flow, yield, tax', href: '/analyser', teal: false },
              { icon: '↗', label: 'CGT Planner', desc: 'Compare sell now vs hold scenarios', href: '/cgt', teal: false },
              { icon: '📈', label: 'Multi-property view', desc: 'Full portfolio dashboard with charts', href: '/portfolio', teal: true },
            ].map(t => (
              <Link key={t.href} href={t.href} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', background: t.teal ? '#0F1E3C' : 'white', borderRadius: 14, border: t.teal ? 'none' : '1px solid rgba(15,30,60,0.1)', textDecoration: 'none' }}>
                <div style={{ fontSize: 20, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.teal ? 'rgba(0,212,170,0.15)' : '#F5F4F0', borderRadius: 10, flexShrink: 0 }}>{t.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: t.teal ? 'white' : '#0F1E3C' }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: t.teal ? 'rgba(255,255,255,0.45)' : 'rgba(15,30,60,0.5)', marginTop: 2 }}>{t.desc}</div>
                </div>
                <div style={{ fontSize: 14, color: t.teal ? '#00D4AA' : 'rgba(15,30,60,0.3)' }}>→</div>
              </Link>
            ))}

            {/* Upgrade prompt */}
            <div style={{ padding: '16px 18px', background: 'rgba(0,212,170,0.06)', borderRadius: 14, border: '1px solid rgba(0,212,170,0.2)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#065F46', marginBottom: 4 }}>🔒 Subscriber tools locked</div>
              <div style={{ fontSize: 11, color: 'rgba(15,30,60,0.5)', marginBottom: 10, lineHeight: 1.5 }}>Scenario comparison, broker reports, AI explanations, rate stress tester and more.</div>
              <Link href="/pricing" style={{ display: 'inline-block', padding: '7px 14px', background: '#00D4AA', borderRadius: 8, fontSize: 11, fontWeight: 700, color: '#0F1E3C', textDecoration: 'none' }}>
                Upgrade — from $29/month →
              </Link>
            </div>
          </div>
        </div>

        <p style={{ fontSize: 11, color: 'rgba(15,30,60,0.3)', textAlign: 'center' }}>
          Sample portfolio shown. Sign up to save and track your real properties. General information only — not financial advice.
        </p>
      </div>
    </div>
  )
}
