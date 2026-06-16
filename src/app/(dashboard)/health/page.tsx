'use client'
import { useMemo, useState } from 'react'
import { DashboardTopbar } from '@/components/DashboardTopbar'
import { calculateProperty, fmtCurrency, fmtPct, SAMPLE_PROPERTIES } from '@/lib/calculations'
import { scoreProperty } from '@/lib/scoring'
import { LockedPage } from '@/components/PaywallOverlay'
import { useTier } from '@/hooks/useTier'

const C = { forest: '#1A2F1A', gold: '#C9963A', cream: '#F7F4EE', cream2: '#EDE8DF' }

function RiskBadge({ level }: { level: 'low' | 'medium' | 'high' }) {
  const cfg = {
    low:    { bg: 'rgba(22,163,74,0.1)',  border: 'rgba(22,163,74,0.3)',  color: '#16A34A', label: 'Low risk' },
    medium: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', color: '#D97706', label: 'Medium risk' },
    high:   { bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)',  color: '#DC2626', label: 'High risk' },
  }[level]
  return (
    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}>
      {cfg.label}
    </span>
  )
}

export default function HealthPage() {
  const { isPaid, checked } = useTier()

  const portfolio = useMemo(() =>
    SAMPLE_PROPERTIES.map(p => {
      const results = calculateProperty(p.inputs)
      const score   = scoreProperty(p.inputs, results)
      return { ...p, results, score }
    }), [])

  // Portfolio-level metrics
  const totals = useMemo(() => {
    const totalValue   = portfolio.reduce((s, p) => s + p.inputs.purchasePrice, 0)
    const totalLoan    = portfolio.reduce((s, p) => s + p.inputs.purchasePrice * (1 - p.inputs.depositPercent / 100), 0)
    const totalEquity  = totalValue - totalLoan
    const totalCF      = portfolio.reduce((s, p) => s + p.results.afterTaxCashFlow, 0)
    const totalRefund  = portfolio.reduce((s, p) => s + p.results.taxRefund, 0)
    const avgLVR       = (totalLoan / totalValue) * 100
    const avgScore     = Math.round(portfolio.reduce((s, p) => s + p.score.overall, 0) / portfolio.length)
    const negGeared    = portfolio.filter(p => p.results.afterTaxCashFlow < 0).length
    const highLVR      = portfolio.filter(p => p.results.lvr > 80).length
    return { totalValue, totalLoan, totalEquity, totalCF, totalRefund, avgLVR, avgScore, negGeared, highLVR }
  }, [portfolio])

  // Portfolio-level risks
  const portfolioRisks: { label: string; level: 'low' | 'medium' | 'high'; detail: string }[] = []
  if (totals.avgLVR > 80)    portfolioRisks.push({ label: 'High average LVR', level: 'high', detail: `Average LVR is ${totals.avgLVR.toFixed(1)}% — limited buffer if values fall` })
  if (totals.totalCF < -30000) portfolioRisks.push({ label: 'High aggregate holding cost', level: 'high', detail: `Portfolio costs ${fmtCurrency(Math.abs(totals.totalCF))}/yr after tax` })
  if (totals.negGeared === portfolio.length) portfolioRisks.push({ label: 'All properties negatively geared', level: 'medium', detail: 'Entire portfolio depends on tax refunds and capital growth' })
  if (totals.avgLVR > 70 && totals.avgLVR <= 80) portfolioRisks.push({ label: 'Moderate LVR exposure', level: 'medium', detail: `Average LVR ${totals.avgLVR.toFixed(1)}% — watch for rate rises` })
  if (totals.totalCF > 0) portfolioRisks.push({ label: 'Portfolio cash flow positive', level: 'low', detail: 'Overall portfolio generates positive after-tax cash flow' })
  if (totals.avgLVR < 70)  portfolioRisks.push({ label: 'Conservative leverage', level: 'low', detail: 'Average LVR below 70% — strong equity buffer' })

  const healthColor =
    totals.avgScore >= 75 ? '#16A34A' :
    totals.avgScore >= 55 ? C.gold :
    '#EF4444'

  if (checked && !isPaid) {
    return (
      <div>
        <DashboardTopbar title="Portfolio Health Score" subtitle="Investor plan required" />
        <LockedPage title="Portfolio Health Score" icon="🩺"
          description="Get an overall health score across your entire property portfolio. Identifies risks like excessive debt, concentrated suburb exposure, high refinance risk and aggregate cash flow stress." plan="investor" />
      </div>
    )
  }

  return (
    <div>
      <DashboardTopbar title="Portfolio Health Score" subtitle="Overall risk and performance across all properties" />
      <div style={{ padding: '24px 36px' }}>

        {/* Portfolio score */}
        <div style={{ background: C.forest, borderRadius: 20, padding: '28px 36px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 40 }}>
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 56, fontWeight: 800, color: healthColor, lineHeight: 1 }}>{totals.avgScore}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>PORTFOLIO SCORE</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: healthColor, marginTop: 2 }}>
              {totals.avgScore >= 75 ? 'Healthy' : totals.avgScore >= 55 ? 'Moderate' : 'Needs attention'}
            </div>
          </div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'Total equity', value: fmtCurrency(totals.totalEquity), color: C.gold },
              { label: 'After-tax CF', value: `${fmtCurrency(totals.totalCF / 52)}/wk`, color: totals.totalCF >= 0 ? '#86EFAC' : '#FCA5A5' },
              { label: 'Avg LVR', value: fmtPct(totals.avgLVR), color: totals.avgLVR > 80 ? '#FCA5A5' : 'rgba(255,255,255,0.8)' },
              { label: 'ATO refunds', value: fmtCurrency(totals.totalRefund), color: C.gold },
            ].map(m => (
              <div key={m.label}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

          {/* Portfolio risks */}
          <div style={{ background: 'white', borderRadius: 16, padding: '24px', border: '1px solid rgba(26,47,26,0.1)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Portfolio risk assessment</div>
            {portfolioRisks.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderBottom: i < portfolioRisks.length - 1 ? '1px solid rgba(26,47,26,0.06)' : 'none' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.forest, marginBottom: 2 }}>{r.label}</div>
                  <div style={{ fontSize: 12, color: 'rgba(26,47,26,0.5)', lineHeight: 1.4 }}>{r.detail}</div>
                </div>
                <RiskBadge level={r.level} />
              </div>
            ))}
          </div>

          {/* Individual property scores */}
          <div style={{ background: 'white', borderRadius: 16, padding: '24px', border: '1px solid rgba(26,47,26,0.1)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Individual property scores</div>
            {portfolio.map(p => (
              <div key={p.id} style={{ padding: '12px 0', borderBottom: '1px solid rgba(26,47,26,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.forest }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(26,47,26,0.45)' }}>{p.address}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 800, color: p.score.color }}>{p.score.overall}</div>
                    <div style={{ fontSize: 10, color: p.score.color, fontWeight: 600 }}>{p.score.label}</div>
                  </div>
                </div>
                <div style={{ height: 5, background: 'rgba(26,47,26,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${p.score.overall}%`, background: p.score.color, borderRadius: 3 }} />
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                  <span style={{ fontSize: 11, color: 'rgba(26,47,26,0.45)' }}>Yield {fmtPct(p.results.grossYield)}</span>
                  <span style={{ fontSize: 11, color: p.results.weeklyAfterTaxCashFlow >= 0 ? '#16A34A' : '#EF4444' }}>{fmtCurrency(p.results.weeklyAfterTaxCashFlow)}/wk</span>
                  <span style={{ fontSize: 11, color: 'rgba(26,47,26,0.45)' }}>LVR {fmtPct(p.results.lvr)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div style={{ background: C.forest, borderRadius: 16, padding: '20px 24px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>💡 Portfolio recommendations</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              totals.avgLVR > 80 && 'Consider paying down the highest-LVR property first to reduce portfolio risk.',
              totals.negGeared === portfolio.length && 'All properties are negatively geared — ensure you have sufficient income buffer for rate rises.',
              totals.totalCF < -40000 && 'High aggregate holding cost. Review whether IO vs P&I is optimal across the portfolio.',
              'Run a rate stress test across all properties to see the impact of a 1-2% rate rise.',
              totals.totalEquity > 500000 && 'Strong equity position. Consider whether to leverage equity for the next acquisition.',
              'Review depreciation schedules annually — Div 40 assets reduce in value over time and schedules should be updated.',
            ].filter(Boolean).slice(0, 4).map((rec, i) => rec && (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(201,150,58,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 10, fontWeight: 700, color: C.gold, marginTop: 1 }}>{i + 1}</div>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{rec}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 11, color: 'rgba(26,47,26,0.35)', textAlign: 'center', marginTop: 14 }}>
          Portfolio health score uses sample data. Connect your real properties to get accurate results. General information only — not financial advice.
        </p>
      </div>
    </div>
  )
}
