'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { calculateProperty, fmtCurrency, fmtPct, SAMPLE_PROPERTIES } from '@/lib/calculations'
import { DashboardTopbar } from '@/components/DashboardTopbar'
import { ResultBox, ResultRow } from '@/components/ui/ResultBox'
import { useTier } from '@/hooks/useTier'
import { LockedPage } from '@/components/PaywallOverlay'

export default function PortfolioPage() {

  const { isPaid, checked } = useTier()
  if (checked && !isPaid) {
    return (
      <div>
        <DashboardTopbar title="Multi-property View" subtitle="Investor plan required" />
        <LockedPage title="Multi-property View" icon="📈" description="Track up to 10 investment properties. Aggregate equity, total cash flow, combined tax refunds, and 10-year portfolio growth projection — all in one view." plan="investor" />
      </div>
    )
  }

  const [properties, setProperties] = useState(SAMPLE_PROPERTIES)

  const portfolio = useMemo(() =>
    properties.map(p => ({ ...p, results: calculateProperty(p.inputs) })),
    [properties]
  )

  const totals = useMemo(() => {
    const totalValue    = portfolio.reduce((s, p) => s + p.inputs.purchasePrice, 0)
    const totalLoan     = portfolio.reduce((s, p) => s + p.inputs.purchasePrice * (1 - p.inputs.depositPercent / 100), 0)
    const totalEquity   = totalValue - totalLoan
    const totalCF       = portfolio.reduce((s, p) => s + p.results.afterTaxCashFlow, 0)
    const totalRefund   = portfolio.reduce((s, p) => s + p.results.taxRefund, 0)
    const totalRent     = portfolio.reduce((s, p) => s + p.results.grossRentalIncome, 0)
    const totalGrowth   = portfolio.reduce((s, p) => s + p.results.projectedValue, 0)
    const totalCGT      = portfolio.reduce((s, p) => s + p.results.cgtPayable, 0)
    return { totalValue, totalLoan, totalEquity, totalCF, totalRefund, totalRent, totalGrowth, totalCGT }
  }, [portfolio])

  const remove = (id: string) => setProperties(p => p.filter(x => x.id !== id))

  const S = {
    card: { background: 'white', borderRadius: 16, padding: '24px', border: '1px solid rgba(26,47,26,0.1)', marginBottom: 16 } as React.CSSProperties,
    sectionLabel: { fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'rgba(26,47,26,0.4)', marginBottom: 16 },
  }

  return (
    <div>
      <DashboardTopbar title="Multi-property portfolio" subtitle={`${portfolio.length} properties · Sample data`} />

      <div style={{ padding: '32px 40px', maxWidth: 1200 }}>

        {/* Aggregate stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Total value', value: fmtCurrency(totals.totalValue), sub: `${portfolio.length} properties`, acc: false },
            { label: 'Total equity', value: fmtCurrency(totals.totalEquity), sub: `LVR avg ${fmtPct(totals.totalLoan / totals.totalValue * 100)}`, acc: false },
            { label: 'After-tax CF', value: `${fmtCurrency(totals.totalCF / 52)}/wk`, sub: `${fmtCurrency(totals.totalCF)}/yr`, acc: totals.totalCF >= 0 },
            { label: 'Total ATO refunds', value: fmtCurrency(totals.totalRefund), sub: 'per year', acc: true },
          ].map(m => (
            <div key={m.label} style={{ background: 'white', borderRadius: 14, padding: '18px', border: '1px solid rgba(26,47,26,0.1)' }}>
              <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(26,47,26,0.4)', marginBottom: 6 }}>{m.label}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 700, color: m.acc ? '#A67C2E' : '#1A2F1A' }}>{m.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(26,47,26,0.4)', marginTop: 3 }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Growth banner */}
        <div style={{ background: '#1A2F1A', borderRadius: 16, padding: '22px 28px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#C9963A', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>10-year portfolio projection</div>
            <div style={{ fontFamily: 'monospace', fontSize: 28, fontWeight: 700, color: '#C9963A' }}>{fmtCurrency(totals.totalGrowth)}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Projected value · CGT payable ≈ {fmtCurrency(totals.totalCGT)} if sold</div>
          </div>
          <Link href="/cgt" style={{ padding: '12px 20px', borderRadius: 12, background: 'rgba(201,150,58,0.12)', color: '#C9963A', fontWeight: 700, fontSize: 13, textDecoration: 'none', border: '1px solid rgba(201,150,58,0.2)', whiteSpace: 'nowrap' }}>
            CGT planner →
          </Link>
        </div>

        {/* Property cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
          {portfolio.map(p => (
            <div key={p.id} style={S.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1A2F1A' }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(26,47,26,0.45)', marginTop: 2 }}>{p.address}</div>
                </div>
                <button onClick={() => remove(p.id)}
                  style={{ background: 'rgba(239,68,68,0.08)', border: 'none', borderRadius: 8, padding: '4px 8px', fontSize: 11, color: '#EF4444', cursor: 'pointer' }}>
                  ✕
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                {[
                  { label: 'Value', value: fmtCurrency(p.inputs.purchasePrice), accent: false },
                  { label: 'Yield', value: fmtPct(p.results.grossYield), accent: false },
                  { label: '/week', value: fmtCurrency(p.results.weeklyAfterTaxCashFlow), accent: p.results.weeklyAfterTaxCashFlow >= 0 },
                ].map(m => (
                  <div key={m.label} style={{ background: '#F7F4EE', borderRadius: 8, padding: '8px 10px' }}>
                    <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(26,47,26,0.4)', marginBottom: 2 }}>{m.label}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: m.accent ? '#A67C2E' : p.results.weeklyAfterTaxCashFlow < 0 && m.label === '/week' ? '#EF4444' : '#1A2F1A' }}>{m.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(26,47,26,0.5)', paddingTop: 10, borderTop: '1px solid rgba(26,47,26,0.06)' }}>
                <span style={{ color: p.results.afterTaxCashFlow < 0 ? '#F59E0B' : '#A67C2E', fontWeight: 600 }}>
                  {p.results.afterTaxCashFlow < 0 ? '↓ Neg. geared' : '↑ Pos. geared'}
                </span>
                <span>LVR {fmtPct(p.results.lvr)}</span>
                <span style={{ color: '#A67C2E' }}>Refund {fmtCurrency(p.results.taxRefund)}/yr</span>
              </div>
            </div>
          ))}

          {/* Add card */}
          <Link href="/analyser" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'white', borderRadius: 16, border: '2px dashed rgba(26,47,26,0.15)', textDecoration: 'none', gap: 10, color: 'rgba(26,47,26,0.4)', minHeight: 180 }}>
            <div style={{ fontSize: 28, lineHeight: 1 }}>+</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Add another property</div>
            <div style={{ fontSize: 11 }}>Analyse a new acquisition</div>
          </Link>
        </div>

        {/* Portfolio summary */}
        <div style={S.card}>
          <div style={S.sectionLabel}>Portfolio aggregate cashflow</div>
          <ResultBox>
            <ResultRow label="Total gross rental income" value={fmtCurrency(totals.totalRent)} accent="gold" />
            <ResultRow label="Total ATO tax refunds" value={fmtCurrency(totals.totalRefund)} accent="gold" />
            <ResultRow label="Total after-tax cash flow (annual)" value={fmtCurrency(totals.totalCF)} highlight accent={totals.totalCF >= 0 ? 'gold' : 'red'} />
            <ResultRow label="After-tax cash flow (weekly)" value={`${fmtCurrency(totals.totalCF / 52)}/wk`} accent={totals.totalCF >= 0 ? 'gold' : 'amber'} />
          </ResultBox>
        </div>

        <p style={{ fontSize: 11, color: 'rgba(26,47,26,0.35)', textAlign: 'center' }}>
          Sample data shown. Sign up to save and track your real portfolio. General information only — not financial advice.
        </p>
      </div>
    </div>
  )
}
