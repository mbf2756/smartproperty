'use client'
import { useState, useMemo } from 'react'
import { DashboardTopbar } from '@/components/DashboardTopbar'
import { fmtCurrency, fmtPct, getMarginalRate } from '@/lib/calculations'
import { useTier } from '@/hooks/useTier'
import { LockedPage } from '@/components/PaywallOverlay'

const C = { forest: '#1A2F1A', gold: '#C9963A', cream: '#F7F4EE', cream2: '#EDE8DF' }
const S = {
  card: { background: 'white', borderRadius: 16, padding: '24px', border: '1px solid rgba(26,47,26,0.1)' } as React.CSSProperties,
  label: { fontSize: 10, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'rgba(26,47,26,0.45)', marginBottom: 6, display: 'block' },
  input: { width: '100%', padding: '9px 12px', border: '1px solid rgba(26,47,26,0.15)', borderRadius: 9, fontFamily: 'monospace', fontSize: 13, color: C.forest, outline: 'none', boxSizing: 'border-box' as const },
}

const HOLD_YEARS = [0, 1, 2, 3, 5, 7, 10, 15, 20]

export default function HoldSellPage() {

  const { isPaid, checked } = useTier()
  if (checked && !isPaid) {
    return (
      <div>
        <DashboardTopbar title="Hold vs Sell Modeller" subtitle="Investor plan required" />
        <LockedPage title="Hold vs Sell Modeller" icon="🎯" description="Model net sale proceeds for selling now versus holding 1, 3, 5, 7, 10, 15 or 20 more years — with CGT and cumulative holding costs all factored in." plan="investor" />
      </div>
    )
  }

  const [purchasePrice, setPurchasePrice] = useState(850000)
  const [purchaseYear, setPurchaseYear]   = useState(2021)
  const [growthRate, setGrowthRate]       = useState(6)
  const [taxableIncome, setTaxableIncome] = useState(120000)
  const [loanBalance, setLoanBalance]     = useState(650000)
  const [improvements, setImprovements]   = useState(0)
  const [annualCF, setAnnualCF]           = useState(-9000) // after-tax cash flow per year (negative = cost)

  const currentYear = new Date().getFullYear()
  const yearsHeld   = currentYear - purchaseYear
  const marginalRate = getMarginalRate(taxableIncome)
  const costBase    = purchasePrice + improvements

  const scenarios = useMemo(() =>
    HOLD_YEARS.map(extra => {
      const totalYears = yearsHeld + extra
      const saleValue  = purchasePrice * Math.pow(1 + growthRate / 100, totalYears)
      const gain       = saleValue - costBase
      const discounted = totalYears >= 1
      const taxableGain = discounted ? gain * 0.5 : gain
      const cgtPayable  = Math.max(taxableGain * marginalRate, 0)
      const netProceeds = saleValue - loanBalance - cgtPayable
      const totalCFCost = annualCF * extra // cumulative holding cost from now
      const netPosition = netProceeds + totalCFCost
      return { extra, totalYears, year: currentYear + extra, saleValue, gain, discounted, taxableGain, cgtPayable, netProceeds, totalCFCost, netPosition }
    }), [purchasePrice, purchaseYear, growthRate, taxableIncome, loanBalance, improvements, annualCF, yearsHeld, marginalRate, costBase])

  const bestYear = scenarios.reduce((best, s) => s.netPosition > best.netPosition ? s : best, scenarios[0])

  return (
    <div>
      <DashboardTopbar title="Hold vs Sell Modeller" subtitle="Compare net proceeds across multiple future sale dates" />
      <div style={{ padding: '28px 36px' }}>

        {/* Inputs */}
        <div style={{ ...S.card, marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Property details</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {[
              { label: 'Purchase price', val: purchasePrice, set: setPurchasePrice, prefix: '$', step: 10000 },
              { label: 'Year purchased', val: purchaseYear, set: setPurchaseYear, step: 1 },
              { label: 'Loan balance today', val: loanBalance, set: setLoanBalance, prefix: '$', step: 10000 },
              { label: 'Improvement costs', val: improvements, set: setImprovements, prefix: '$', step: 5000 },
              { label: 'Annual growth rate', val: growthRate, set: setGrowthRate, suffix: '%', step: 0.5 },
              { label: 'Your taxable income', val: taxableIncome, set: setTaxableIncome, prefix: '$', step: 5000 },
              { label: 'After-tax CF /yr', val: annualCF, set: setAnnualCF, prefix: '$', step: 1000 },
              { label: 'Years held so far', val: yearsHeld, set: () => {}, step: 1, readonly: true },
            ].map(f => (
              <div key={f.label}>
                <label style={S.label}>{f.label}</label>
                <div style={{ position: 'relative' }}>
                  {f.prefix && <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 12 }}>{f.prefix}</span>}
                  <input type="number" value={f.val} onChange={e => !f.readonly && f.set(+e.target.value)} step={f.step} readOnly={f.readonly}
                    style={{ ...S.input, paddingLeft: f.prefix ? 22 : 12, paddingRight: f.suffix ? 28 : 12, background: f.readonly ? C.cream2 : 'white' }} />
                  {f.suffix && <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 12 }}>{f.suffix}</span>}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: 'rgba(26,47,26,0.5)' }}>
            Marginal rate: <strong>{fmtPct(marginalRate * 100, 0)}</strong> · 50% CGT discount applies if held &gt;12 months
          </div>
        </div>

        {/* Best outcome */}
        <div style={{ background: C.forest, borderRadius: 16, padding: '20px 28px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Optimal sale year</div>
            <div style={{ fontFamily: 'monospace', fontSize: 28, fontWeight: 700, color: C.gold }}>{bestYear.year}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>Hold {bestYear.extra} more years · Net position {fmtCurrency(bestYear.netPosition)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Net proceeds at sale</div>
            <div style={{ fontFamily: 'monospace', fontSize: 28, fontWeight: 700, color: '#22C55E' }}>{fmtCurrency(bestYear.netProceeds)}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>After CGT {fmtCurrency(bestYear.cgtPayable)} · Loan {fmtCurrency(loanBalance)}</div>
          </div>
        </div>

        {/* Comparison table */}
        <div style={{ ...S.card }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Sale timing comparison</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(26,47,26,0.08)' }}>
                {['Sell in', 'Hold', 'Sale value', 'Capital gain', '50% disc?', 'CGT payable', 'Net proceeds', 'Holding cost', 'Net position'].map(h => (
                  <th key={h} style={{ padding: '7px 10px', textAlign: 'right', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(26,47,26,0.4)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scenarios.map(s => {
                const isBest = s.year === bestYear.year
                return (
                  <tr key={s.year} style={{ background: isBest ? 'rgba(201,150,58,0.07)' : 'transparent', borderBottom: '1px solid rgba(26,47,26,0.04)' }}>
                    <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: isBest ? 700 : 500, color: isBest ? C.gold : C.forest, fontSize: 13 }}>{s.year} {isBest && '★'}</td>
                    <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', fontSize: 12, color: 'rgba(26,47,26,0.5)' }}>{s.extra}yr</td>
                    <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', fontSize: 12, color: C.forest }}>{fmtCurrency(s.saleValue)}</td>
                    <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', fontSize: 12, color: '#16A34A' }}>{fmtCurrency(s.gain)}</td>
                    <td style={{ padding: '9px 10px', textAlign: 'center', fontSize: 13 }}>{s.discounted ? '✓' : '✗'}</td>
                    <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', fontSize: 12, color: '#EF4444' }}>–{fmtCurrency(s.cgtPayable)}</td>
                    <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', fontSize: 12, fontWeight: isBest ? 700 : 500, color: isBest ? C.gold : C.forest }}>{fmtCurrency(s.netProceeds)}</td>
                    <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', fontSize: 12, color: s.totalCFCost < 0 ? '#EF4444' : '#16A34A' }}>{s.extra === 0 ? '—' : fmtCurrency(s.totalCFCost)}</td>
                    <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', fontSize: 12, fontWeight: isBest ? 700 : 500, color: isBest ? '#22C55E' : C.forest }}>{fmtCurrency(s.netPosition)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div style={{ marginTop: 10, fontSize: 11, color: 'rgba(26,47,26,0.4)', lineHeight: 1.6 }}>
            Net position = Net proceeds after CGT + cumulative holding cost from today. Holding cost uses your current annual after-tax cash flow.
          </div>
        </div>

        <p style={{ fontSize: 11, color: 'rgba(26,47,26,0.35)', textAlign: 'center', marginTop: 16 }}>
          Estimates only. Does not account for main residence exemption or prior capital losses. Consult a registered tax agent.
        </p>
      </div>
    </div>
  )
}
