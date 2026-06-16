'use client'
import { useState, useMemo } from 'react'
import { DashboardTopbar } from '@/components/DashboardTopbar'
import { fmtCurrency, getMarginalRate } from '@/lib/calculations'
import { LockedPage } from '@/components/PaywallOverlay'
import { useTier } from '@/hooks/useTier'

const C = { forest: '#1A2F1A', gold: '#C9963A', cream: '#F7F4EE', cream2: '#EDE8DF' }

const YEARS = [5, 10, 20]

export default function DebtRecyclePage() {
  const { isPaid, checked } = useTier()

  // Shared inputs
  const [income, setIncome]           = useState(120000)
  const [spareCash, setSpareCash]     = useState(20000)    // annual spare cash to invest
  const [homeloanBalance, setHomeloanBalance] = useState(500000)
  const [homeloanRate, setHomeloanRate] = useState(6.2)

  // Strategy A: Buy investment property
  const [propPrice, setPropPrice]     = useState(700000)
  const [propDeposit, setPropDeposit] = useState(20)
  const [propRate, setPropRate]       = useState(6.2)
  const [propGrowth, setPropGrowth]   = useState(6)
  const [propRent, setPropRent]       = useState(550)

  // Strategy B: ETF portfolio
  const [etfReturn, setEtfReturn]     = useState(8)
  const [etfDividendYield, setEtfDividendYield] = useState(3.5)

  // Strategy C: Debt recycle — pay off home loan + invest dividends
  const [recycleEtfReturn, setRecycleEtfReturn] = useState(8)

  const marginalRate = getMarginalRate(income)

  const results = useMemo(() => {
    return YEARS.map(years => {
      // Strategy A: Property
      const propLoan      = propPrice * (1 - propDeposit / 100)
      const propDeposit$  = propPrice * propDeposit / 100
      const propValueFV   = propPrice * Math.pow(1 + propGrowth / 100, years)
      const propEquity    = propValueFV - propLoan
      const annualRent    = propRent * 52 * 0.96
      const annualInterest = propLoan * (propRate / 100)
      const rentalLoss    = annualRent - annualInterest - 8000  // rough expenses
      const taxRefund     = rentalLoss < 0 ? Math.abs(rentalLoss) * marginalRate : 0
      const netAnnualCF   = annualRent - annualInterest - 8000 + taxRefund
      const cumulativeCF  = netAnnualCF * years
      const propNetWorth  = propEquity + cumulativeCF - propDeposit$ + (spareCash * years)  // spare cash still invested elsewhere

      // Strategy B: ETFs only (invest spare cash + deposit amount)
      const etfInitial    = propDeposit$  // same upfront as property deposit
      const etfAnnual     = spareCash
      const etfRate       = etfReturn / 100
      const etfFV         = etfInitial * Math.pow(1 + etfRate, years) +
        etfAnnual * ((Math.pow(1 + etfRate, years) - 1) / etfRate)
      // Tax on dividends
      const annualDividend = etfFV * (etfDividendYield / 100) / 2  // rough average
      const divTax         = annualDividend * marginalRate * years
      const etfNetWorth   = etfFV - divTax

      // Strategy C: Debt recycling
      // Pay spare cash into home loan, borrow it back to buy ETFs, deduct investment interest
      const recycleRate   = recycleEtfReturn / 100
      const recycleFV     = spareCash * years * Math.pow(1 + recycleRate, years / 2)  // simplified
      const interestSaved = homeloanBalance * (homeloanRate / 100) * 0.3 * years  // rough 30% faster paydown
      const recycleNetWorth = recycleFV + interestSaved

      // CGT on property sale
      const propCGT = (propValueFV - propPrice) * 0.5 * marginalRate
      const propAfterCGT = propNetWorth - propCGT

      return { years, propNetWorth: propAfterCGT, etfNetWorth, recycleNetWorth }
    })
  }, [income, spareCash, homeloanBalance, homeloanRate, propPrice, propDeposit, propRate, propGrowth, propRent, etfReturn, etfDividendYield, recycleEtfReturn, marginalRate])

  const strategies = [
    { key: 'propNetWorth', label: 'Strategy A: Buy Property', color: C.gold, icon: '🏠' },
    { key: 'etfNetWorth', label: 'Strategy B: Buy ETFs', color: '#86EFAC', icon: '📈' },
    { key: 'recycleNetWorth', label: 'Strategy C: Debt Recycle', color: '#93C5FD', icon: '♻️' },
  ]

  if (checked && !isPaid) {
    return (
      <div>
        <DashboardTopbar title="Debt Recycling Simulator" subtitle="Investor plan required" />
        <LockedPage title="Debt Recycling Simulator" icon="♻️"
          description="Should you buy property, invest in ETFs, or debt recycle? Compare all three strategies across 5, 10 and 20 years — showing net worth, tax outcomes and cash flow for each path." plan="investor" />
      </div>
    )
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '9px 12px', border: '1px solid rgba(26,47,26,0.15)', borderRadius: 9, fontFamily: 'monospace', fontSize: 13, color: C.forest, outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(26,47,26,0.45)', marginBottom: 5, display: 'block' }

  const max20 = Math.max(results[2].propNetWorth, results[2].etfNetWorth, results[2].recycleNetWorth)

  return (
    <div>
      <DashboardTopbar title="Debt Recycling Simulator" subtitle="Property vs ETFs vs Debt Recycle — 5, 10 and 20 year comparison" />
      <div style={{ padding: '24px 36px' }}>

        <div style={{ background: 'rgba(26,47,26,0.04)', border: '1px solid rgba(26,47,26,0.1)', borderRadius: 12, padding: '12px 18px', marginBottom: 20, fontSize: 13, color: C.forest, lineHeight: 1.6 }}>
          <strong>How this works:</strong> You have <strong>{fmtCurrency(spareCash)}/year</strong> of spare cash to invest. Compare the net worth outcome of buying a property, investing in ETFs, or debt recycling your home loan — after tax and over different time horizons.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>

          {/* Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: 'white', borderRadius: 14, padding: '18px', border: '1px solid rgba(26,47,26,0.1)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Your situation</div>
              {[
                { label: 'Annual income', val: income, set: setIncome, prefix: '$', step: 5000 },
                { label: 'Spare cash to invest /yr', val: spareCash, set: setSpareCash, prefix: '$', step: 1000 },
                { label: 'Home loan balance', val: homeloanBalance, set: setHomeloanBalance, prefix: '$', step: 10000 },
                { label: 'Home loan rate', val: homeloanRate, set: setHomeloanRate, suffix: '%', step: 0.25 },
              ].map(f => (
                <div key={f.label} style={{ marginBottom: 10 }}>
                  <label style={labelStyle}>{f.label}</label>
                  <div style={{ position: 'relative' }}>
                    {f.prefix && <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 12 }}>{f.prefix}</span>}
                    <input type="number" value={f.val} onChange={e => f.set(+e.target.value)} step={f.step}
                      style={{ ...inputStyle, paddingLeft: f.prefix ? 22 : 12, paddingRight: f.suffix ? 28 : 12 }} />
                    {f.suffix && <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 12 }}>{f.suffix}</span>}
                  </div>
                </div>
              ))}
              <div style={{ padding: '8px 10px', background: C.cream2, borderRadius: 8, fontSize: 11, color: 'rgba(26,47,26,0.55)' }}>
                Marginal rate: <strong>{(marginalRate * 100).toFixed(0)}%</strong> incl. Medicare levy
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: 14, padding: '18px', border: `1px solid rgba(201,150,58,0.25)` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>🏠 Strategy A: Property</div>
              {[
                { label: 'Purchase price', val: propPrice, set: setPropPrice, prefix: '$', step: 10000 },
                { label: 'Deposit', val: propDeposit, set: setPropDeposit, suffix: '%', step: 5 },
                { label: 'Interest rate', val: propRate, set: setPropRate, suffix: '%', step: 0.25 },
                { label: 'Growth rate /yr', val: propGrowth, set: setPropGrowth, suffix: '%', step: 0.5 },
                { label: 'Weekly rent', val: propRent, set: setPropRent, prefix: '$', step: 25 },
              ].map(f => (
                <div key={f.label} style={{ marginBottom: 10 }}>
                  <label style={labelStyle}>{f.label}</label>
                  <div style={{ position: 'relative' }}>
                    {f.prefix && <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 12 }}>{f.prefix}</span>}
                    <input type="number" value={f.val} onChange={e => f.set(+e.target.value)} step={f.step}
                      style={{ ...inputStyle, paddingLeft: f.prefix ? 22 : 12, paddingRight: f.suffix ? 28 : 12 }} />
                    {f.suffix && <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 12 }}>{f.suffix}</span>}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: 14, padding: '18px', border: '1px solid rgba(22,163,74,0.25)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>📈 Strategy B: ETFs</div>
              {[
                { label: 'Expected return /yr', val: etfReturn, set: setEtfReturn, suffix: '%', step: 0.5 },
                { label: 'Dividend yield', val: etfDividendYield, set: setEtfDividendYield, suffix: '%', step: 0.5 },
              ].map(f => (
                <div key={f.label} style={{ marginBottom: 10 }}>
                  <label style={labelStyle}>{f.label}</label>
                  <div style={{ position: 'relative' }}>
                    <input type="number" value={f.val} onChange={e => f.set(+e.target.value)} step={f.step}
                      style={{ ...inputStyle, paddingRight: 28 }} />
                    <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 12 }}>%</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: 14, padding: '18px', border: '1px solid rgba(147,197,253,0.4)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>♻️ Strategy C: Debt Recycle</div>
              <div style={{ marginBottom: 10 }}>
                <label style={labelStyle}>ETF return after recycling</label>
                <div style={{ position: 'relative' }}>
                  <input type="number" value={recycleEtfReturn} onChange={e => setRecycleEtfReturn(+e.target.value)} step={0.5}
                    style={{ ...inputStyle, paddingRight: 28 }} />
                  <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 12 }}>%</span>
                </div>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(26,47,26,0.5)', lineHeight: 1.5 }}>
                Pays extra into home loan to pay it off faster. Reborrowing for ETF investment makes interest tax-deductible.
              </div>
            </div>
          </div>

          {/* Results */}
          <div>
            {/* Comparison table */}
            <div style={{ background: 'white', borderRadius: 16, padding: '24px', border: '1px solid rgba(26,47,26,0.1)', marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Net worth comparison (after tax)</div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(26,47,26,0.08)' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(26,47,26,0.4)' }}>Strategy</th>
                    {YEARS.map(y => (
                      <th key={y} style={{ padding: '8px 12px', textAlign: 'right', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(26,47,26,0.4)' }}>{y} years</th>
                    ))}
                    <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(26,47,26,0.4)' }}>Winner</th>
                  </tr>
                </thead>
                <tbody>
                  {strategies.map(s => {
                    const vals = results.map(r => r[s.key as keyof typeof r] as number)
                    const best = Math.max(...vals.map((v, i) => results[i][s.key as keyof typeof results[0]] as number))
                    return (
                      <tr key={s.key} style={{ borderBottom: '1px solid rgba(26,47,26,0.05)' }}>
                        <td style={{ padding: '12px', fontSize: 13, fontWeight: 600, color: C.forest }}>
                          <span style={{ marginRight: 6 }}>{s.icon}</span>{s.label}
                        </td>
                        {results.map(r => {
                          const val = r[s.key as keyof typeof r] as number
                          const isMaxForYear = strategies.every(os => val >= (r[os.key as keyof typeof r] as number) - 1000)
                          return (
                            <td key={r.years} style={{ padding: '12px', textAlign: 'right', fontFamily: 'monospace', fontSize: 13, fontWeight: isMaxForYear ? 700 : 400, color: isMaxForYear ? s.color : C.forest }}>
                              {fmtCurrency(val)}
                              {isMaxForYear && <span style={{ fontSize: 10, marginLeft: 4 }}>★</span>}
                            </td>
                          )
                        })}
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Visual bars for 20yr */}
            <div style={{ background: 'white', borderRadius: 16, padding: '24px', border: '1px solid rgba(26,47,26,0.1)', marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>20-year net worth comparison</div>
              {strategies.map(s => {
                const val = results[2][s.key as keyof typeof results[2]] as number
                const pct = (val / max20) * 100
                return (
                  <div key={s.key} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.forest }}>{s.icon} {s.label}</span>
                      <span style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color: s.color }}>{fmtCurrency(val)}</span>
                    </div>
                    <div style={{ height: 8, background: 'rgba(26,47,26,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: s.color, borderRadius: 4 }} />
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ background: C.forest, borderRadius: 14, padding: '18px 22px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.gold, marginBottom: 10 }}>⚠ Important notes on this comparison</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  'Property results include CGT on sale at the 50% discount rate.',
                  'Debt recycling results are simplified — a full calculation requires a financial adviser.',
                  'ETF returns assume full reinvestment of dividends net of tax.',
                  'This does not account for lifestyle factors, liquidity needs or risk tolerance.',
                  'Past performance of property and ETFs does not guarantee future returns.',
                ].map((n, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
                    <span style={{ flexShrink: 0, color: C.gold }}>→</span>{n}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
