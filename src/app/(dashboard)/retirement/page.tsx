'use client'
import { useState, useMemo } from 'react'
import { DashboardTopbar } from '@/components/DashboardTopbar'
import { fmtCurrency, fmtPct } from '@/lib/calculations'
import { LockedPage } from '@/components/PaywallOverlay'
import { useTier } from '@/hooks/useTier'

const C = { forest: '#1A2F1A', gold: '#C9963A', cream: '#F7F4EE', cream2: '#EDE8DF' }

export default function RetirementPage() {
  const { isPaid, checked } = useTier()

  // Current situation
  const [currentAge, setCurrentAge]         = useState(38)
  const [retireAge, setRetireAge]           = useState(60)
  const [currentIncome, setCurrentIncome]   = useState(120000)
  const [superBalance, setSuperBalance]     = useState(180000)
  const [superContribRate, setSuperContribRate] = useState(11.5)  // SG rate
  const [extraSuperContrib, setExtraSuperContrib] = useState(10000)
  const [etfBalance, setEtfBalance]         = useState(50000)
  const [etfMonthlyContrib, setEtfMonthlyContrib] = useState(500)
  const [etfGrowthRate, setEtfGrowthRate]   = useState(8)

  // Property
  const [propertyValue, setPropertyValue]   = useState(850000)
  const [loanBalance, setLoanBalance]       = useState(680000)
  const [weeklyRent, setWeeklyRent]         = useState(650)
  const [propertyGrowthRate, setPropertyGrowthRate] = useState(6)
  const [annualAfterTaxCF, setAnnualAfterTaxCF] = useState(-9300)  // from analyser

  const yearsToRetire = retireAge - currentAge
  const superGrowthRate = 0.07  // assumed net-of-fees return

  const projection = useMemo(() => {
    const yrs = yearsToRetire

    // Super projection
    const annualSuperContrib = (currentIncome * superContribRate / 100) + extraSuperContrib
    const superFV = superBalance * Math.pow(1 + superGrowthRate, yrs) +
      annualSuperContrib * ((Math.pow(1 + superGrowthRate, yrs) - 1) / superGrowthRate)

    // ETF projection
    const annualETF = etfMonthlyContrib * 12
    const etfRate   = etfGrowthRate / 100
    const etfFV     = etfBalance * Math.pow(1 + etfRate, yrs) +
      annualETF * ((Math.pow(1 + etfRate, yrs) - 1) / etfRate)

    // Property at retirement
    const propertyFV = propertyValue * Math.pow(1 + propertyGrowthRate / 100, yrs)
    const propertyEquityFV = propertyFV - loanBalance  // simplified (loan roughly same if IO)
    const rentAtRetirement = weeklyRent * 52 * Math.pow(1.03, yrs)  // 3% rent growth

    // Total net worth at retirement
    const totalNetWorth = superFV + etfFV + propertyEquityFV

    // Income in retirement (4% drawdown rule + rent)
    const superIncome  = superFV * 0.04
    const etfIncome    = etfFV * 0.04
    const totalPassiveIncome = superIncome + etfIncome + rentAtRetirement

    // Cumulative property holding cost over hold period
    const cumulativePropCost = annualAfterTaxCF * yrs

    // Year-by-year for chart
    const yearlyData = Array.from({ length: yrs + 1 }, (_, i) => {
      const superY = superBalance * Math.pow(1 + superGrowthRate, i) +
        annualSuperContrib * ((Math.pow(1 + superGrowthRate, i) - 1) / superGrowthRate)
      const etfY = etfBalance * Math.pow(1 + etfRate, i) +
        annualETF * ((Math.pow(1 + etfRate, i) - 1) / etfRate)
      const propY = propertyValue * Math.pow(1 + propertyGrowthRate / 100, i) - loanBalance
      return { year: i, age: currentAge + i, super: superY, etf: etfY, property: Math.max(0, propY), total: superY + etfY + Math.max(0, propY) }
    }).filter(d => [0, 5, 10, 15, 20, yrs].includes(d.year))

    return { superFV, etfFV, propertyFV, propertyEquityFV, rentAtRetirement, totalNetWorth, superIncome, etfIncome, totalPassiveIncome, cumulativePropCost, yearlyData }
  }, [currentAge, retireAge, currentIncome, superBalance, superContribRate, extraSuperContrib, etfBalance, etfMonthlyContrib, etfGrowthRate, propertyValue, loanBalance, weeklyRent, propertyGrowthRate, annualAfterTaxCF, yearsToRetire, superGrowthRate])

  if (checked && !isPaid) {
    return (
      <div>
        <DashboardTopbar title="Retirement Impact" subtitle="Investor plan required" />
        <LockedPage title="Retirement Impact Simulator" icon="🌅"
          description="See how buying this property affects your retirement. Combines property equity, super balance, and ETF portfolio to show your total net worth and passive income at retirement age. Unique to the Smart Suite." plan="investor" />
      </div>
    )
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '9px 12px', border: '1px solid rgba(26,47,26,0.15)', borderRadius: 9, fontFamily: 'monospace', fontSize: 13, color: C.forest, outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(26,47,26,0.45)', marginBottom: 5, display: 'block' }

  const maxTotal = Math.max(...projection.yearlyData.map(d => d.total))

  return (
    <div>
      <DashboardTopbar title="Retirement Impact Simulator" subtitle="How does this property affect your retirement?" />
      <div style={{ padding: '24px 36px' }}>

        {/* Smart Suite callout */}
        <div style={{ background: 'rgba(201,150,58,0.08)', border: '1px solid rgba(201,150,58,0.2)', borderRadius: 12, padding: '12px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20 }}>🔗</span>
          <div style={{ fontSize: 13, color: C.forest, lineHeight: 1.5 }}>
            <strong>Smart Suite crossover:</strong> This tool combines property (SmartProperty), super (SmartSuper) and ETFs (SmartETF) to show your complete retirement picture. Enter your balances from all three platforms for the most accurate projection.
          </div>
        </div>

        {/* Retirement summary */}
        <div style={{ background: C.forest, borderRadius: 20, padding: '24px 32px', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: C.gold, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>At age {retireAge} · in {yearsToRetire} years</div>
              <div style={{ fontFamily: 'monospace', fontSize: 36, fontWeight: 800, color: C.gold }}>{fmtCurrency(projection.totalNetWorth)}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Estimated total net worth</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Estimated passive income /yr</div>
              <div style={{ fontFamily: 'monospace', fontSize: 28, fontWeight: 700, color: '#86EFAC' }}>{fmtCurrency(projection.totalPassiveIncome)}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{fmtCurrency(projection.totalPassiveIncome / 52)}/wk · 4% drawdown + rent</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { label: 'Super balance', value: fmtCurrency(projection.superFV), income: `${fmtCurrency(projection.superIncome)}/yr income`, color: '#93C5FD' },
              { label: 'ETF portfolio', value: fmtCurrency(projection.etfFV), income: `${fmtCurrency(projection.etfIncome)}/yr income`, color: '#86EFAC' },
              { label: 'Property equity', value: fmtCurrency(projection.propertyEquityFV), income: `${fmtCurrency(projection.rentAtRetirement)}/yr rent`, color: C.gold },
            ].map(m => (
              <div key={m.label} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{m.income}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>

          {/* Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: 'white', borderRadius: 16, padding: '18px', border: '1px solid rgba(26,47,26,0.1)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Your situation</div>
              {[
                { label: 'Current age', val: currentAge, set: setCurrentAge, step: 1 },
                { label: 'Target retirement age', val: retireAge, set: setRetireAge, step: 1 },
                { label: 'Current income', val: currentIncome, set: setCurrentIncome, prefix: '$', step: 5000 },
              ].map(f => (
                <div key={f.label} style={{ marginBottom: 10 }}>
                  <label style={labelStyle}>{f.label}</label>
                  <div style={{ position: 'relative' }}>
                    {f.prefix && <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 12 }}>{f.prefix}</span>}
                    <input type="number" value={f.val} onChange={e => f.set(+e.target.value)} step={f.step}
                      style={{ ...inputStyle, paddingLeft: f.prefix ? 22 : 12 }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: 16, padding: '18px', border: '1px solid rgba(93,155,181,0.2)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Superannuation (SmartSuper)</div>
              {[
                { label: 'Current super balance', val: superBalance, set: setSuperBalance, prefix: '$', step: 5000 },
                { label: 'SG contribution rate', val: superContribRate, set: setSuperContribRate, suffix: '%', step: 0.5 },
                { label: 'Extra concessional /yr', val: extraSuperContrib, set: setExtraSuperContrib, prefix: '$', step: 1000 },
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

            <div style={{ background: 'white', borderRadius: 16, padding: '18px', border: '1px solid rgba(22,163,74,0.2)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>ETF portfolio (SmartETF)</div>
              {[
                { label: 'Current ETF balance', val: etfBalance, set: setEtfBalance, prefix: '$', step: 5000 },
                { label: 'Monthly contribution', val: etfMonthlyContrib, set: setEtfMonthlyContrib, prefix: '$', step: 100 },
                { label: 'Expected return /yr', val: etfGrowthRate, set: setEtfGrowthRate, suffix: '%', step: 0.5 },
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

            <div style={{ background: 'white', borderRadius: 16, padding: '18px', border: `1px solid rgba(201,150,58,0.2)` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Property (SmartProperty)</div>
              {[
                { label: 'Property value', val: propertyValue, set: setPropertyValue, prefix: '$', step: 10000 },
                { label: 'Current loan balance', val: loanBalance, set: setLoanBalance, prefix: '$', step: 10000 },
                { label: 'Weekly rent', val: weeklyRent, set: setWeeklyRent, prefix: '$', step: 25 },
                { label: 'Growth rate /yr', val: propertyGrowthRate, set: setPropertyGrowthRate, suffix: '%', step: 0.5 },
                { label: 'After-tax CF /yr', val: annualAfterTaxCF, set: setAnnualAfterTaxCF, prefix: '$', step: 1000 },
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
          </div>

          {/* Results */}
          <div>
            {/* Net worth growth chart */}
            <div style={{ background: 'white', borderRadius: 16, padding: '24px', border: '1px solid rgba(26,47,26,0.1)', marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Net worth growth to retirement</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 160, marginBottom: 8 }}>
                {projection.yearlyData.map(d => {
                  const superH    = (d.super / maxTotal) * 140
                  const etfH      = (d.etf / maxTotal) * 140
                  const propH     = (d.property / maxTotal) * 140
                  return (
                    <div key={d.year} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ fontSize: 9, color: 'rgba(26,47,26,0.5)', fontFamily: 'monospace', textAlign: 'center' }}>
                        {fmtCurrency(d.total).replace('$', '$')}
                      </div>
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: 140 }}>
                        <div style={{ width: '100%', height: superH, background: '#93C5FD' }} />
                        <div style={{ width: '100%', height: etfH, background: '#86EFAC' }} />
                        <div style={{ width: '100%', height: propH, background: C.gold, borderRadius: '0 0 3px 3px' }} />
                      </div>
                      <div style={{ fontSize: 9, color: 'rgba(26,47,26,0.45)', textAlign: 'center' }}>
                        <div>Yr {d.year}</div>
                        <div>Age {d.age}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                {[{ label: 'Super', color: '#93C5FD' }, { label: 'ETFs', color: '#86EFAC' }, { label: 'Property', color: C.gold }].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(26,47,26,0.6)' }}>
                    <div style={{ width: 12, height: 12, background: l.color, borderRadius: 2 }} /> {l.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones table */}
            <div style={{ background: 'white', borderRadius: 16, padding: '24px', border: '1px solid rgba(26,47,26,0.1)', marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Wealth milestones</div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(26,47,26,0.08)' }}>
                    {['Year / Age', 'Super', 'ETFs', 'Property equity', 'Total net worth'].map(h => (
                      <th key={h} style={{ padding: '7px 10px', textAlign: 'right', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(26,47,26,0.4)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {projection.yearlyData.map(d => {
                    const isRetire = d.year === yearsToRetire
                    return (
                      <tr key={d.year} style={{ background: isRetire ? 'rgba(201,150,58,0.07)' : 'transparent', borderBottom: '1px solid rgba(26,47,26,0.04)' }}>
                        <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: isRetire ? 700 : 500, color: isRetire ? C.gold : C.forest, fontSize: 13 }}>
                          Yr {d.year} · Age {d.age}{isRetire ? ' 🎯' : ''}
                        </td>
                        <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', fontSize: 12, color: '#3B82F6' }}>{fmtCurrency(d.super)}</td>
                        <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', fontSize: 12, color: '#16A34A' }}>{fmtCurrency(d.etf)}</td>
                        <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', fontSize: 12, color: C.gold }}>{fmtCurrency(d.property)}</td>
                        <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', fontSize: 13, fontWeight: isRetire ? 700 : 500, color: isRetire ? C.gold : C.forest }}>{fmtCurrency(d.total)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Property's contribution */}
            <div style={{ background: 'rgba(201,150,58,0.08)', borderRadius: 14, padding: '18px 20px', border: '1px solid rgba(201,150,58,0.2)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.gold, marginBottom: 8 }}>🏠 Property's contribution to your retirement</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(26,47,26,0.45)', marginBottom: 3 }}>Equity at retirement</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: C.forest }}>{fmtCurrency(projection.propertyEquityFV)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(26,47,26,0.45)', marginBottom: 3 }}>Annual rent at retirement</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: '#16A34A' }}>{fmtCurrency(projection.rentAtRetirement)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(26,47,26,0.45)', marginBottom: 3 }}>Total holding cost</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: '#EF4444' }}>{fmtCurrency(projection.cumulativePropCost)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p style={{ fontSize: 11, color: 'rgba(26,47,26,0.35)', textAlign: 'center', marginTop: 16 }}>
          Projections are estimates only. Assumes constant returns and growth rates. Super accessed via preservation rules. Not financial advice — consult a licensed financial adviser.
        </p>
      </div>
    </div>
  )
}
