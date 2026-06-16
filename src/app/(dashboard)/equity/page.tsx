'use client'
import { useState, useMemo } from 'react'
import { DashboardTopbar } from '@/components/DashboardTopbar'
import { fmtCurrency, fmtPct, DEFAULT_INPUTS } from '@/lib/calculations'
import { LockedPage } from '@/components/PaywallOverlay'
import { useTier } from '@/hooks/useTier'

const C = { forest: '#1A2F1A', gold: '#C9963A', cream: '#F7F4EE', cream2: '#EDE8DF' }

const MILESTONES = [1, 2, 3, 5, 7, 10, 15, 20]

export default function EquityPage() {
  const { isPaid, checked } = useTier()
  const [purchasePrice, setPurchasePrice] = useState(DEFAULT_INPUTS.purchasePrice)
  const [depositPct, setDepositPct]       = useState(DEFAULT_INPUTS.depositPercent)
  const [interestRate, setInterestRate]   = useState(DEFAULT_INPUTS.interestRate)
  const [loanType, setLoanType]           = useState<'IO' | 'PI'>('PI')
  const [loanTermYears, setLoanTermYears] = useState(30)
  const [growthRate, setGrowthRate]       = useState(DEFAULT_INPUTS.capitalGrowthRate)
  const [weeklyRent, setWeeklyRent]       = useState(DEFAULT_INPUTS.weeklyRent)
  const [rentGrowthRate, setRentGrowthRate] = useState(3)
  const [taxableIncome, setTaxableIncome] = useState(DEFAULT_INPUTS.taxableIncome)

  const loanAmount = purchasePrice * (1 - depositPct / 100)
  const annualRate = interestRate / 100

  const timeline = useMemo(() => {
    return MILESTONES.map(year => {
      // Property value
      const value = purchasePrice * Math.pow(1 + growthRate / 100, year)

      // Loan balance remaining
      let loanBalance = loanAmount
      if (loanType === 'PI') {
        const monthlyRate = annualRate / 12
        const n = loanTermYears * 12
        if (monthlyRate > 0) {
          const mp = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
          const monthsPaid = year * 12
          loanBalance = loanAmount * Math.pow(1 + monthlyRate, monthsPaid) - mp * ((Math.pow(1 + monthlyRate, monthsPaid) - 1) / monthlyRate)
          loanBalance = Math.max(0, loanBalance)
        }
      }

      const equity = value - loanBalance
      const lvr    = (loanBalance / value) * 100
      const equityGrowth = equity - (purchasePrice * depositPct / 100)

      // Annual rental income at year N (with rent growth)
      const annualRent = weeklyRent * 52 * Math.pow(1 + rentGrowthRate / 100, year)

      // Cumulative equity multiple
      const initialEquity = purchasePrice * depositPct / 100
      const equityMultiple = equity / initialEquity

      return { year, value, loanBalance, equity, lvr, equityGrowth, annualRent, equityMultiple }
    })
  }, [purchasePrice, depositPct, loanAmount, annualRate, loanType, loanTermYears, growthRate, weeklyRent, rentGrowthRate, taxableIncome])

  const maxEquity = Math.max(...timeline.map(t => t.equity))
  const initialEquity = purchasePrice * depositPct / 100

  if (checked && !isPaid) {
    return (
      <div>
        <DashboardTopbar title="Equity Growth Timeline" subtitle="Investor plan required" />
        <LockedPage title="Equity Growth Timeline" icon="📈"
          description="See your property's value, loan balance and equity at years 1, 2, 3, 5, 7, 10, 15 and 20. Includes rent growth projection and equity multiple calculation. Investors care about equity more than yield." plan="investor" />
      </div>
    )
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '9px 12px', border: '1px solid rgba(26,47,26,0.15)', borderRadius: 9, fontFamily: 'monospace', fontSize: 13, color: C.forest, outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(26,47,26,0.45)', marginBottom: 5, display: 'block' }

  const last = timeline[timeline.length - 1]

  return (
    <div>
      <DashboardTopbar title="Equity Growth Timeline" subtitle="Value, loan balance and equity year by year" />
      <div style={{ padding: '24px 36px' }}>

        {/* Summary banner */}
        <div style={{ background: C.forest, borderRadius: 16, padding: '22px 28px', marginBottom: 20, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {[
            { label: 'Initial equity (deposit)', value: fmtCurrency(initialEquity), color: 'rgba(255,255,255,0.7)' },
            { label: `Equity in ${last.year} years`, value: fmtCurrency(last.equity), color: C.gold },
            { label: 'Equity growth', value: fmtCurrency(last.equityGrowth), color: '#86EFAC' },
            { label: 'Equity multiple', value: `${last.equityMultiple.toFixed(1)}×`, color: C.gold },
          ].map(m => (
            <div key={m.label}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 700, color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>

          {/* Inputs */}
          <div>
            <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1px solid rgba(26,47,26,0.1)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Property details</div>
              {[
                { label: 'Purchase price', val: purchasePrice, set: setPurchasePrice, prefix: '$', step: 10000 },
                { label: 'Deposit', val: depositPct, set: setDepositPct, suffix: '%', step: 5 },
                { label: 'Interest rate', val: interestRate, set: setInterestRate, suffix: '%', step: 0.25 },
                { label: 'Loan term', val: loanTermYears, set: setLoanTermYears, suffix: 'yrs', step: 1 },
                { label: 'Capital growth rate', val: growthRate, set: setGrowthRate, suffix: '%', step: 0.5 },
                { label: 'Weekly rent (current)', val: weeklyRent, set: setWeeklyRent, prefix: '$', step: 25 },
                { label: 'Annual rent growth', val: rentGrowthRate, set: setRentGrowthRate, suffix: '%', step: 0.5 },
              ].map(f => (
                <div key={f.label} style={{ marginBottom: 10 }}>
                  <label style={labelStyle}>{f.label}</label>
                  <div style={{ position: 'relative' }}>
                    {f.prefix && <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 12 }}>{f.prefix}</span>}
                    <input type="number" value={f.val} onChange={e => f.set(+e.target.value)} step={f.step}
                      style={{ ...inputStyle, paddingLeft: f.prefix ? 22 : 12, paddingRight: f.suffix ? 34 : 12 }} />
                    {f.suffix && <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 12 }}>{f.suffix}</span>}
                  </div>
                </div>
              ))}
              <div>
                <label style={labelStyle}>Loan type</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['IO', 'PI'] as const).map(t => (
                    <button key={t} onClick={() => setLoanType(t)}
                      style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                        background: loanType === t ? C.forest : C.cream2, color: loanType === t ? C.gold : 'rgba(26,47,26,0.6)' }}>
                      {t === 'IO' ? 'Interest Only' : 'P&I'}
                    </button>
                  ))}
                </div>
                {loanType === 'IO' && <div style={{ marginTop: 6, fontSize: 11, color: '#F59E0B', background: 'rgba(245,158,11,0.08)', padding: '5px 8px', borderRadius: 6 }}>IO: loan balance stays fixed</div>}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            {/* Visual equity bars */}
            <div style={{ background: 'white', borderRadius: 16, padding: '24px', border: '1px solid rgba(26,47,26,0.1)', marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Equity vs loan balance over time</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 140 }}>
                {timeline.map(t => {
                  const totalH = 120
                  const maxVal = Math.max(...timeline.map(x => x.value))
                  const valueH = (t.value / maxVal) * totalH
                  const loanH  = (t.loanBalance / maxVal) * totalH
                  const equityH = valueH - loanH
                  return (
                    <div key={t.year} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ fontSize: 9, color: C.gold, fontWeight: 700, fontFamily: 'monospace' }}>{fmtCurrency(t.equity, 0).replace('$', '$')}</div>
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: totalH }}>
                        <div style={{ width: '100%', height: equityH, background: C.gold, borderRadius: '3px 3px 0 0', opacity: 0.85 }} />
                        <div style={{ width: '100%', height: loanH, background: 'rgba(26,47,26,0.25)' }} />
                      </div>
                      <div style={{ fontSize: 9, color: 'rgba(26,47,26,0.45)', fontWeight: 600 }}>yr {t.year}</div>
                    </div>
                  )
                })}
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 10, justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(26,47,26,0.6)' }}>
                  <div style={{ width: 12, height: 12, background: C.gold, borderRadius: 2 }} /> Equity
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(26,47,26,0.6)' }}>
                  <div style={{ width: 12, height: 12, background: 'rgba(26,47,26,0.25)', borderRadius: 2 }} /> Loan balance
                </div>
              </div>
            </div>

            {/* Data table */}
            <div style={{ background: 'white', borderRadius: 16, padding: '24px', border: '1px solid rgba(26,47,26,0.1)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Year-by-year breakdown</div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(26,47,26,0.08)' }}>
                    {['Year', 'Property value', 'Loan balance', 'Equity', 'LVR', 'Annual rent', 'Equity multiple'].map(h => (
                      <th key={h} style={{ padding: '7px 10px', textAlign: 'right', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(26,47,26,0.4)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeline.map((t, i) => {
                    const isKeyMilestone = t.year === 10 || t.year === 20
                    return (
                      <tr key={t.year} style={{ background: isKeyMilestone ? 'rgba(201,150,58,0.05)' : 'transparent', borderBottom: '1px solid rgba(26,47,26,0.04)' }}>
                        <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: isKeyMilestone ? 700 : 500, color: isKeyMilestone ? C.gold : C.forest, fontSize: 13 }}>
                          {t.year}{isKeyMilestone ? ' ★' : ''}
                        </td>
                        <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', fontSize: 12, color: C.forest }}>{fmtCurrency(t.value)}</td>
                        <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', fontSize: 12, color: 'rgba(26,47,26,0.6)' }}>{fmtCurrency(t.loanBalance)}</td>
                        <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: C.gold }}>{fmtCurrency(t.equity)}</td>
                        <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', fontSize: 12, color: t.lvr < 60 ? '#16A34A' : t.lvr < 80 ? C.forest : '#EF4444' }}>{fmtPct(t.lvr)}</td>
                        <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', fontSize: 12, color: '#16A34A' }}>{fmtCurrency(t.annualRent)}</td>
                        <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: t.equityMultiple >= 2 ? '#16A34A' : C.forest }}>
                          {t.equityMultiple.toFixed(1)}×
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <div style={{ marginTop: 12, fontSize: 11, color: 'rgba(26,47,26,0.4)', lineHeight: 1.6 }}>
                Equity multiple = total equity ÷ initial deposit. Assumes constant interest rate and steady capital growth. Loan balance uses standard amortisation formula.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
