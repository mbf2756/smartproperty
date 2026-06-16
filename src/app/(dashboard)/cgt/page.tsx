'use client'
import { useState, useMemo } from 'react'
import { DashboardTopbar } from '@/components/DashboardTopbar'
import { fmtCurrency, fmtPct, getMarginalRate } from '@/lib/calculations'
import { LockedPage } from '@/components/PaywallOverlay'
import { useTier } from '@/hooks/useTier'

const C = { forest: '#1A2F1A', gold: '#C9963A', cream: '#F7F4EE', cream2: '#EDE8DF' }
const S = {
  card: { background: 'white', borderRadius: 16, padding: '24px', border: '1px solid rgba(26,47,26,0.1)', marginBottom: 16 } as React.CSSProperties,
  label: { fontSize: 10, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'rgba(26,47,26,0.45)', marginBottom: 6, display: 'block' },
  input: { width: '100%', padding: '9px 12px', border: '1px solid rgba(26,47,26,0.15)', borderRadius: 9, fontFamily: 'monospace', fontSize: 13, color: '#1A2F1A', outline: 'none', boxSizing: 'border-box' as const },
}

const CURRENT_YEAR = new Date().getFullYear()

export default function CGTPage() {
  const { isPaid, checked } = useTier()
  const [purchasePrice, setPurchasePrice] = useState(780000)
  const [purchaseYear, setPurchaseYear]   = useState(2021)
  const [growthRate, setGrowthRate]       = useState(6)
  const [taxableIncome, setTaxableIncome] = useState(120000)
  const [loanBalance, setLoanBalance]     = useState(580000)
  const [improvements, setImprovements]   = useState(0)

  const yearsHeld    = CURRENT_YEAR - purchaseYear
  const marginalRate = getMarginalRate(taxableIncome)
  const costBase     = purchasePrice + improvements

  const scenarios = useMemo(() =>
    [0, 1, 2, 3, 5, 7, 10].map(extra => {
      const totalYears  = yearsHeld + extra
      const saleValue   = purchasePrice * Math.pow(1 + growthRate / 100, totalYears)
      const gain        = saleValue - costBase
      const discounted  = totalYears >= 1
      const taxableGain = discounted ? gain * 0.5 : gain
      const cgtPayable  = Math.max(taxableGain * marginalRate, 0)
      const netProceeds = saleValue - loanBalance - cgtPayable
      return { extra, totalYears, year: CURRENT_YEAR + extra, saleValue, gain, discounted, taxableGain, cgtPayable, netProceeds }
    }), [purchasePrice, purchaseYear, growthRate, taxableIncome, loanBalance, improvements, yearsHeld, marginalRate, costBase])

  const bestYear = scenarios.reduce((best, s) => s.netProceeds > best.netProceeds ? s : best, scenarios[0])

  if (checked && !isPaid) {
    return (
      <div>
        <DashboardTopbar title="CGT Planner" subtitle="Investor plan required" />
        <LockedPage title="CGT Scenario Planner" icon="↗" description="Compare selling now vs holding 1, 3, 5, 7 or 10 more years. The 50% CGT discount, your marginal rate impact, and exact net sale proceeds — all modelled for your property. Available on the Investor plan." plan="investor" />
      </div>
    )
  }

  return (
    <div>
      <DashboardTopbar title="CGT Planner" subtitle="Compare sell now vs hold scenarios with 50% CGT discount modelling" />
      <div style={{ padding: '28px 36px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
          <div>
            <div style={S.card}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Property details</div>
              {[
                { label: 'Purchase price', val: purchasePrice, set: setPurchasePrice, prefix: '$', step: 5000 },
                { label: 'Year purchased',  val: purchaseYear,  set: setPurchaseYear,  step: 1 },
                { label: 'Improvement costs', val: improvements, set: setImprovements, prefix: '$', step: 5000 },
                { label: 'Loan balance today', val: loanBalance, set: setLoanBalance, prefix: '$', step: 10000 },
                { label: 'Annual growth rate', val: growthRate, set: setGrowthRate, suffix: '%', step: 0.5 },
                { label: 'Your taxable income', val: taxableIncome, set: setTaxableIncome, prefix: '$', step: 5000 },
              ].map(f => (
                <div key={f.label} style={{ marginBottom: 12 }}>
                  <label style={S.label}>{f.label}</label>
                  <div style={{ position: 'relative' }}>
                    {f.prefix && <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 12 }}>{f.prefix}</span>}
                    <input type="number" value={f.val} onChange={e => f.set(+e.target.value)} step={f.step}
                      style={{ ...S.input, paddingLeft: f.prefix ? 22 : 12, paddingRight: f.suffix ? 28 : 12 }} />
                    {f.suffix && <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 12 }}>{f.suffix}</span>}
                  </div>
                </div>
              ))}
              <div style={{ fontSize: 11, color: 'rgba(26,47,26,0.5)', padding: '8px 10px', background: C.cream2, borderRadius: 8 }}>
                Marginal rate: <strong>{fmtPct(marginalRate * 100, 0)}</strong> · Held {yearsHeld} years
              </div>
            </div>

            <div style={{ background: C.forest, borderRadius: 14, padding: '18px 20px' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Best outcome</div>
              <div style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 700, color: C.gold }}>{fmtCurrency(bestYear.netProceeds)}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>Sell in {bestYear.year} ({bestYear.totalYears}yr hold)</div>
            </div>
          </div>

          <div>
            <div style={S.card}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Sale timing comparison · {growthRate}% growth</div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(26,47,26,0.08)' }}>
                    {['Sell in','Hold','Sale value','Capital gain','50% disc?','CGT payable','Net proceeds'].map(h => (
                      <th key={h} style={{ padding: '7px 10px', textAlign: 'right', fontSize: 9, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'rgba(26,47,26,0.4)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scenarios.map(s => {
                    const isBest = s.year === bestYear.year
                    return (
                      <tr key={s.year} style={{ background: isBest ? 'rgba(201,150,58,0.06)' : 'transparent', borderBottom: '1px solid rgba(26,47,26,0.04)' }}>
                        <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: isBest ? 700 : 500, color: isBest ? C.gold : C.forest, fontSize: 13 }}>{s.year} {isBest && '★'}</td>
                        <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', fontSize: 12, color: 'rgba(26,47,26,0.5)' }}>{s.totalYears}yr</td>
                        <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', fontSize: 12, color: C.forest }}>{fmtCurrency(s.saleValue)}</td>
                        <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', fontSize: 12, color: '#16A34A' }}>{fmtCurrency(s.gain)}</td>
                        <td style={{ padding: '9px 10px', textAlign: 'center', fontSize: 13 }}>{s.discounted ? '✓' : '✗'}</td>
                        <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', fontSize: 12, color: '#EF4444' }}>–{fmtCurrency(s.cgtPayable)}</td>
                        <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', fontSize: 12, fontWeight: isBest ? 700 : 500, color: isBest ? C.gold : C.forest }}>{fmtCurrency(s.netProceeds)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 11, color: 'rgba(26,47,26,0.35)', textAlign: 'center', marginTop: 8 }}>
              Estimates only. Does not account for main residence exemption. Consult a registered tax agent.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
