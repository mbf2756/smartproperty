'use client'
import { useState, useMemo } from 'react'
import { DashboardTopbar } from '@/components/DashboardTopbar'
import { calculateProperty, fmtCurrency, fmtPct, SAMPLE_PROPERTIES } from '@/lib/calculations'
import { scoreProperty } from '@/lib/scoring'
import { LockedPage } from '@/components/PaywallOverlay'
import { useTier } from '@/hooks/useTier'

const C = { forest: '#1A2F1A', gold: '#C9963A', cream: '#F7F4EE', cream2: '#EDE8DF' }

const CURRENT_YEAR = new Date().getFullYear()

// Simulated prior-year data for comparison (5% less on everything)
function getPriorYear(inputs: typeof SAMPLE_PROPERTIES[0]['inputs']) {
  return calculateProperty({
    ...inputs,
    purchasePrice: inputs.purchasePrice * 0.95,
    weeklyRent: inputs.weeklyRent * 0.97,
    interestRate: inputs.interestRate + 0.25,
  })
}

export default function AnnualReviewPage() {
  const { isPaid, checked } = useTier()
  const [selectedProperty, setSelectedProperty] = useState(0)
  const [reviewYear, setReviewYear] = useState(CURRENT_YEAR)
  const [estimatedValue, setEstimatedValue] = useState(SAMPLE_PROPERTIES[0].inputs.purchasePrice * 1.07)
  const [currentRent, setCurrentRent] = useState(SAMPLE_PROPERTIES[0].inputs.weeklyRent)
  const [currentRate, setCurrentRate] = useState(SAMPLE_PROPERTIES[0].inputs.interestRate)

  const property = SAMPLE_PROPERTIES[selectedProperty]

  const currentInputs = useMemo(() => ({
    ...property.inputs,
    purchasePrice: estimatedValue,
    weeklyRent: currentRent,
    interestRate: currentRate,
  }), [property, estimatedValue, currentRent, currentRate])

  const currentResults = useMemo(() => calculateProperty(currentInputs), [currentInputs])
  const priorResults   = useMemo(() => getPriorYear(property.inputs), [property])
  const currentScore   = useMemo(() => scoreProperty(currentInputs, currentResults), [currentInputs, currentResults])

  const valueGrowth   = estimatedValue - property.inputs.purchasePrice
  const valueGrowthPct = (valueGrowth / property.inputs.purchasePrice) * 100
  const rentChange    = currentRent - property.inputs.weeklyRent
  const cfChange      = currentResults.weeklyAfterTaxCashFlow - priorResults.weeklyAfterTaxCashFlow

  if (checked && !isPaid) {
    return (
      <div>
        <DashboardTopbar title="Annual Portfolio Review" subtitle="Investor plan required" />
        <LockedPage title="Annual Portfolio Review" icon="📅"
          description="Generate a full year-end review for each property: updated equity, estimated valuation, year-on-year cash flow comparison, and updated investment score. Know exactly where each property stands each year." plan="investor" />
      </div>
    )
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '9px 12px', border: '1px solid rgba(26,47,26,0.15)', borderRadius: 9, fontFamily: 'monospace', fontSize: 13, color: C.forest, outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(26,47,26,0.45)', marginBottom: 5, display: 'block' }

  return (
    <div>
      <DashboardTopbar title="Annual Portfolio Review" subtitle={`${reviewYear} year-end review`} />
      <div style={{ padding: '24px 36px' }}>

        {/* Property selector */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {SAMPLE_PROPERTIES.map((p, i) => (
            <button key={p.id} onClick={() => {
              setSelectedProperty(i)
              setEstimatedValue(p.inputs.purchasePrice * 1.07)
              setCurrentRent(p.inputs.weeklyRent)
              setCurrentRate(p.inputs.interestRate)
            }}
              style={{ padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
                background: selectedProperty === i ? C.forest : 'white',
                color: selectedProperty === i ? C.gold : C.forest,
                boxShadow: selectedProperty === i ? 'none' : '0 1px 3px rgba(0,0,0,0.08)' }}>
              {p.name}
            </button>
          ))}
          <select value={reviewYear} onChange={e => setReviewYear(+e.target.value)}
            style={{ marginLeft: 'auto', padding: '8px 12px', borderRadius: 10, border: '1px solid rgba(26,47,26,0.15)', fontSize: 12, color: C.forest, background: 'white', cursor: 'pointer' }}>
            {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button onClick={() => window.print()}
            style={{ padding: '8px 16px', borderRadius: 10, background: C.forest, color: C.gold, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            🖨 Print / PDF
          </button>
        </div>

        {/* Review header */}
        <div style={{ background: C.forest, borderRadius: 20, padding: '24px 32px', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: C.gold, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>
                {reviewYear} Annual Review
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 4 }}>{property.name}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{property.address}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Investment Score</div>
              <div style={{ fontFamily: 'monospace', fontSize: 40, fontWeight: 800, color: currentScore.color, lineHeight: 1 }}>{currentScore.overall}</div>
              <div style={{ fontSize: 12, color: currentScore.color, fontWeight: 600 }}>{currentScore.label}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 20 }}>
            {[
              { label: 'Estimated value', value: fmtCurrency(estimatedValue), change: `+${valueGrowthPct.toFixed(1)}% vs purchase`, changeColor: '#86EFAC' },
              { label: 'Current equity', value: fmtCurrency(currentResults.netProceeds + currentInputs.purchasePrice * (1 - currentInputs.depositPercent / 100)), change: `LVR ${fmtPct(currentResults.lvr)}`, changeColor: 'rgba(255,255,255,0.5)' },
              { label: 'After-tax /wk', value: fmtCurrency(currentResults.weeklyAfterTaxCashFlow), change: `${cfChange >= 0 ? '+' : ''}${fmtCurrency(cfChange)} vs last yr`, changeColor: cfChange >= 0 ? '#86EFAC' : '#FCA5A5' },
              { label: 'ATO refund', value: fmtCurrency(currentResults.taxRefund), change: 'For this financial year', changeColor: 'rgba(255,255,255,0.5)' },
            ].map(m => (
              <div key={m.label} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px' }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: C.gold }}>{m.value}</div>
                <div style={{ fontSize: 11, color: m.changeColor, marginTop: 3 }}>{m.change}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>

          {/* Updated inputs */}
          <div>
            <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1px solid rgba(26,47,26,0.1)', marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Update current figures</div>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Estimated current value</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 12 }}>$</span>
                  <input type="number" value={estimatedValue} onChange={e => setEstimatedValue(+e.target.value)} step={5000}
                    style={{ ...inputStyle, paddingLeft: 22 }} />
                </div>
                <div style={{ fontSize: 11, color: valueGrowth >= 0 ? '#16A34A' : '#EF4444', marginTop: 4 }}>
                  {valueGrowth >= 0 ? '+' : ''}{fmtCurrency(valueGrowth)} ({valueGrowthPct.toFixed(1)}%) vs purchase price
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Current weekly rent</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 12 }}>$</span>
                  <input type="number" value={currentRent} onChange={e => setCurrentRent(+e.target.value)} step={10}
                    style={{ ...inputStyle, paddingLeft: 22 }} />
                </div>
                {rentChange !== 0 && (
                  <div style={{ fontSize: 11, color: rentChange > 0 ? '#16A34A' : '#EF4444', marginTop: 4 }}>
                    {rentChange > 0 ? '+' : ''}{fmtCurrency(rentChange)}/wk vs original
                  </div>
                )}
              </div>
              <div>
                <label style={labelStyle}>Current interest rate</label>
                <div style={{ position: 'relative' }}>
                  <input type="number" value={currentRate} onChange={e => setCurrentRate(+e.target.value)} step={0.1}
                    style={{ ...inputStyle, paddingRight: 28 }} />
                  <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 12 }}>%</span>
                </div>
              </div>
            </div>

            {/* Score breakdown mini */}
            <div style={{ background: 'white', borderRadius: 16, padding: '18px', border: '1px solid rgba(26,47,26,0.1)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Score breakdown</div>
              {Object.entries(currentScore.components).map(([key, comp]) => (
                <div key={key} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: C.forest }}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: comp.score >= 70 ? '#16A34A' : comp.score >= 45 ? C.gold : '#EF4444' }}>{comp.score}</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(26,47,26,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${comp.score}%`, background: comp.score >= 70 ? '#16A34A' : comp.score >= 45 ? C.gold : '#EF4444', borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Year-on-year comparison */}
          <div>
            <div style={{ background: 'white', borderRadius: 16, padding: '22px', border: '1px solid rgba(26,47,26,0.1)', marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                Year-on-year comparison — {reviewYear - 1} vs {reviewYear}
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(26,47,26,0.08)' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(26,47,26,0.4)' }}>Metric</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(26,47,26,0.4)' }}>{reviewYear - 1}</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(26,47,26,0.4)' }}>{reviewYear}</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(26,47,26,0.4)' }}>Change</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Gross yield',         prior: fmtPct(priorResults.grossYield),                    curr: fmtPct(currentResults.grossYield),                    delta: currentResults.grossYield - priorResults.grossYield,         fmt: (v: number) => `${v > 0 ? '+' : ''}${v.toFixed(2)}%` },
                    { label: 'Gross rental income', prior: fmtCurrency(priorResults.grossRentalIncome),        curr: fmtCurrency(currentResults.grossRentalIncome),        delta: currentResults.grossRentalIncome - priorResults.grossRentalIncome, fmt: (v: number) => `${v > 0 ? '+' : ''}${fmtCurrency(v)}` },
                    { label: 'Interest expense',    prior: fmtCurrency(priorResults.interestExpense),          curr: fmtCurrency(currentResults.interestExpense),          delta: currentResults.interestExpense - priorResults.interestExpense,  fmt: (v: number) => `${v > 0 ? '+' : ''}${fmtCurrency(v)}` },
                    { label: 'Pre-tax cash flow',   prior: fmtCurrency(priorResults.preTaxCashFlow),           curr: fmtCurrency(currentResults.preTaxCashFlow),           delta: currentResults.preTaxCashFlow - priorResults.preTaxCashFlow,    fmt: (v: number) => `${v > 0 ? '+' : ''}${fmtCurrency(v)}` },
                    { label: 'ATO refund',          prior: fmtCurrency(priorResults.taxRefund),                curr: fmtCurrency(currentResults.taxRefund),                delta: currentResults.taxRefund - priorResults.taxRefund,              fmt: (v: number) => `${v > 0 ? '+' : ''}${fmtCurrency(v)}` },
                    { label: 'After-tax /wk',       prior: `${fmtCurrency(priorResults.weeklyAfterTaxCashFlow)}/wk`, curr: `${fmtCurrency(currentResults.weeklyAfterTaxCashFlow)}/wk`, delta: currentResults.weeklyAfterTaxCashFlow - priorResults.weeklyAfterTaxCashFlow, fmt: (v: number) => `${v > 0 ? '+' : ''}${fmtCurrency(v)}/wk` },
                    { label: 'LVR',                 prior: fmtPct(priorResults.lvr),                          curr: fmtPct(currentResults.lvr),                          delta: currentResults.lvr - priorResults.lvr,                          fmt: (v: number) => `${v > 0 ? '+' : ''}${v.toFixed(1)}%` },
                    { label: 'Break-even rent',     prior: `${fmtCurrency(priorResults.breakEvenRent)}/wk`,   curr: `${fmtCurrency(currentResults.breakEvenRent)}/wk`,   delta: currentResults.breakEvenRent - priorResults.breakEvenRent,      fmt: (v: number) => `${v > 0 ? '+' : ''}${fmtCurrency(v)}/wk` },
                  ].map((row, i) => {
                    const good = row.label.includes('refund') || row.label.includes('yield') || row.label.includes('rental income') ? row.delta > 0 : row.label.includes('interest') || row.label.includes('LVR') || row.label.includes('break-even') ? row.delta < 0 : row.delta > 0
                    return (
                      <tr key={row.label} style={{ borderBottom: '1px solid rgba(26,47,26,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(26,47,26,0.015)' }}>
                        <td style={{ padding: '9px 12px', fontSize: 13, color: C.forest }}>{row.label}</td>
                        <td style={{ padding: '9px 12px', textAlign: 'right', fontFamily: 'monospace', fontSize: 12, color: 'rgba(26,47,26,0.5)' }}>{row.prior}</td>
                        <td style={{ padding: '9px 12px', textAlign: 'right', fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: C.forest }}>{row.curr}</td>
                        <td style={{ padding: '9px 12px', textAlign: 'right', fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: good ? '#16A34A' : Math.abs(row.delta) < 0.01 ? 'rgba(26,47,26,0.4)' : '#EF4444' }}>
                          {row.fmt(row.delta)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Strengths, risks, actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ background: 'white', borderRadius: 14, padding: '18px', border: '1px solid rgba(22,163,74,0.15)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>✓ Highlights this year</div>
                {currentScore.strengths.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 7, marginBottom: 6, fontSize: 12, color: C.forest, lineHeight: 1.4 }}>
                    <span style={{ color: '#16A34A', flexShrink: 0 }}>✓</span>{s}
                  </div>
                ))}
              </div>
              <div style={{ background: 'white', borderRadius: 14, padding: '18px', border: '1px solid rgba(239,68,68,0.15)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>⚠ Watch points</div>
                {currentScore.risks.length > 0
                  ? currentScore.risks.map((r, i) => (
                    <div key={i} style={{ display: 'flex', gap: 7, marginBottom: 6, fontSize: 12, color: C.forest, lineHeight: 1.4 }}>
                      <span style={{ color: '#EF4444', flexShrink: 0 }}>⚠</span>{r}
                    </div>
                  ))
                  : <div style={{ fontSize: 12, color: 'rgba(26,47,26,0.45)' }}>No significant risks identified.</div>
                }
              </div>
            </div>

            <div style={{ background: C.forest, borderRadius: 14, padding: '16px 20px', marginTop: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>💡 Recommended actions for {reviewYear + 1}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  currentRate > 6.5 && `Review your interest rate — ${currentRate}% may be above current market. Consider refinancing.`,
                  currentResults.weeklyAfterTaxCashFlow < -400 && 'High holding cost — check if IO structure is still optimal for your cash flow.',
                  rentChange === 0 && 'Consider a rent review — rents in most markets have increased 5-10% over the past year.',
                  currentScore.overall < 60 && 'Investment score has declined — review growth assumptions and consider whether to hold or sell.',
                  currentResults.lvr < 70 && 'Strong equity position — consider whether to access equity for next investment.',
                  currentResults.taxRefund > 10000 && `Ensure you have a PAYG withholding variation in place to receive your $${Math.round(currentResults.taxRefund / 26)}/fortnight tax benefit upfront.`,
                ].filter(Boolean).slice(0, 4).map((action, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(201,150,58,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 9, fontWeight: 700, color: C.gold, marginTop: 1 }}>{i + 1}</div>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p style={{ fontSize: 11, color: 'rgba(26,47,26,0.35)', textAlign: 'center', marginTop: 16 }}>
          Annual review uses estimated figures. Valuations should be verified with a registered valuer or sales agent. Not financial advice.
        </p>
      </div>
      <style>{`@media print { nav, header { display: none !important; } }`}</style>
    </div>
  )
}
