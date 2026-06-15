'use client'
import { useState, useMemo } from 'react'
import { fmtCurrency, fmtPct, getMarginalRate } from '@/lib/calculations'
import { DashboardTopbar } from '@/components/DashboardTopbar'
import { ResultBox, ResultRow } from '@/components/ui/ResultBox'

const S = {
  card: { background: 'white', borderRadius: 16, padding: '24px', border: '1px solid rgba(15,30,60,0.1)', marginBottom: 16 } as React.CSSProperties,
  label: { display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'rgba(15,30,60,0.5)', marginBottom: 6 },
  sectionLabel: { fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'rgba(15,30,60,0.4)', marginBottom: 16 },
  input: { width: '100%', padding: '10px 14px', border: '1px solid rgba(15,30,60,0.12)', borderRadius: 10, fontFamily: 'monospace', fontSize: 14, color: '#0F1E3C', outline: 'none', boxSizing: 'border-box' as const },
  inputPrefix: { width: '100%', paddingLeft: 28, paddingRight: 14, paddingTop: 10, paddingBottom: 10, border: '1px solid rgba(15,30,60,0.12)', borderRadius: 10, fontFamily: 'monospace', fontSize: 14, color: '#0F1E3C', outline: 'none', boxSizing: 'border-box' as const },
  prefix: { position: 'absolute' as const, left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(15,30,60,0.4)', fontSize: 13, pointerEvents: 'none' as const },
  suffix: { position: 'absolute' as const, right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(15,30,60,0.4)', fontSize: 13, pointerEvents: 'none' as const },
}

const CURRENT_YEAR = 2025

export default function CGTPage() {
  const [purchasePrice, setPurchasePrice] = useState(780000)
  const [purchaseYear, setPurchaseYear]   = useState(2020)
  const [growthRate, setGrowthRate]       = useState(6)
  const [taxableIncome, setTaxableIncome] = useState(120000)
  const [loanBalance, setLoanBalance]     = useState(580000)
  const [improvements, setImprovements]   = useState(0)

  const yearsHeld = CURRENT_YEAR - purchaseYear
  const marginalRate = getMarginalRate(taxableIncome)
  const costBase = purchasePrice + improvements

  const scenarios = useMemo(() => {
    return [0, 1, 2, 3, 5, 7, 10].map(extra => {
      const totalYears = yearsHeld + extra
      const saleValue  = purchasePrice * Math.pow(1 + growthRate / 100, totalYears)
      const gain       = saleValue - costBase
      const discounted = totalYears >= 1
      const taxableGain = discounted ? gain * 0.5 : gain
      const cgtPayable  = Math.max(taxableGain * marginalRate, 0)
      const netProceeds = saleValue - loanBalance - cgtPayable
      return { extra, totalYears, year: CURRENT_YEAR + extra, saleValue, gain, discounted, taxableGain, cgtPayable, netProceeds }
    })
  }, [purchasePrice, purchaseYear, growthRate, taxableIncome, loanBalance, improvements, yearsHeld, costBase, marginalRate])

  const bestYear = scenarios.reduce((best, s) => s.netProceeds > best.netProceeds ? s : best, scenarios[0])

  return (
    <div>
      <DashboardTopbar title="CGT Planner" subtitle="Compare sell now vs hold scenarios with 50% CGT discount modelling" />

      <div style={{ padding: '32px 40px' }}>
        <div style={{ background: '#FFFBEB', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 12, padding: '12px 16px', marginBottom: 24, display: 'flex', gap: 10 }}>
          <span>⚠</span>
          <div style={{ fontSize: 13, color: '#78350F', lineHeight: 1.6 }}>
            <strong>ATO 50% CGT discount:</strong> Properties held for more than 12 months qualify for a 50% reduction in the taxable capital gain. Selling before 12 months means paying tax on the full gain. These calculations are estimates — consult a registered tax agent for your specific situation.
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 }}>

          {/* Inputs */}
          <div>
            <div style={S.card}>
              <div style={S.sectionLabel}>Property details</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={S.label}>Purchase price</label>
                  <div style={{ position: 'relative' }}>
                    <span style={S.prefix}>$</span>
                    <input type="number" value={purchasePrice} onChange={e => setPurchasePrice(+e.target.value)} step={5000} style={S.inputPrefix} />
                  </div>
                </div>
                <div>
                  <label style={S.label}>Year purchased</label>
                  <input type="number" value={purchaseYear} onChange={e => setPurchaseYear(+e.target.value)} step={1} min={2000} max={2025} style={S.input} />
                </div>
                <div>
                  <label style={S.label}>Improvement costs</label>
                  <div style={{ position: 'relative' }}>
                    <span style={S.prefix}>$</span>
                    <input type="number" value={improvements} onChange={e => setImprovements(+e.target.value)} step={5000} style={S.inputPrefix} />
                  </div>
                </div>
                <div>
                  <label style={S.label}>Current loan balance</label>
                  <div style={{ position: 'relative' }}>
                    <span style={S.prefix}>$</span>
                    <input type="number" value={loanBalance} onChange={e => setLoanBalance(+e.target.value)} step={5000} style={S.inputPrefix} />
                  </div>
                </div>
              </div>
            </div>

            <div style={S.card}>
              <div style={S.sectionLabel}>Growth & tax</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={S.label}>Annual growth rate</label>
                  <div style={{ position: 'relative' }}>
                    <input type="number" value={growthRate} onChange={e => setGrowthRate(+e.target.value)} step={0.5} style={S.input} />
                    <span style={S.suffix}>%</span>
                  </div>
                </div>
                <div>
                  <label style={S.label}>Your taxable income</label>
                  <div style={{ position: 'relative' }}>
                    <span style={S.prefix}>$</span>
                    <input type="number" value={taxableIncome} onChange={e => setTaxableIncome(+e.target.value)} step={5000} style={S.inputPrefix} />
                  </div>
                  <div style={{ marginTop: 6, fontSize: 11, color: '#065F46', background: 'rgba(0,212,170,0.08)', padding: '5px 10px', borderRadius: 8 }}>
                    Marginal rate: <strong>{fmtPct(marginalRate * 100, 0)}</strong> · Held {yearsHeld} years so far
                  </div>
                </div>
              </div>
            </div>

            <div style={{ ...S.card, background: '#0F1E3C' }}>
              <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#00D4AA', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>Best outcome</div>
              <div style={{ fontFamily: 'monospace', fontSize: 24, fontWeight: 700, color: '#00D4AA', marginBottom: 4 }}>{fmtCurrency(bestYear.netProceeds)}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                Net proceeds selling in <strong style={{ color: 'white' }}>{bestYear.year}</strong> ({bestYear.totalYears} yr hold)
              </div>
            </div>
          </div>

          {/* Scenarios */}
          <div>
            <div style={S.card}>
              <div style={S.sectionLabel}>Sale timing comparison · {growthRate}% annual growth</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(15,30,60,0.08)' }}>
                      {['Sell in', 'Hold', 'Sale value', 'Capital gain', '50% disc?', 'CGT payable', 'Net proceeds'].map(h => (
                        <th key={h} style={{ padding: '8px 12px', textAlign: 'right', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(15,30,60,0.4)', whiteSpace: 'nowrap' as const }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {scenarios.map(s => {
                      const isBest = s.year === bestYear.year
                      return (
                        <tr key={s.year} style={{ borderBottom: '1px solid rgba(15,30,60,0.05)', background: isBest ? 'rgba(0,212,170,0.05)' : 'transparent' }}>
                          <td style={{ padding: '10px 12px', fontWeight: isBest ? 700 : 500, color: isBest ? '#00A888' : '#0F1E3C', fontSize: 13, textAlign: 'right' }}>
                            {s.year} {isBest && '⭐'}
                          </td>
                          <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: 12, color: 'rgba(15,30,60,0.5)', textAlign: 'right' }}>{s.totalYears}yr</td>
                          <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: 13, color: '#0F1E3C', textAlign: 'right' }}>{fmtCurrency(s.saleValue)}</td>
                          <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: 13, color: '#00A888', textAlign: 'right' }}>{fmtCurrency(s.gain)}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'center', fontSize: 13 }}>{s.discounted ? '✓' : '✗'}</td>
                          <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: 13, color: '#EF4444', textAlign: 'right' }}>–{fmtCurrency(s.cgtPayable)}</td>
                          <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: 13, fontWeight: isBest ? 700 : 500, color: isBest ? '#00A888' : '#0F1E3C', textAlign: 'right' }}>
                            {fmtCurrency(s.netProceeds)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cost base breakdown */}
            <div style={S.card}>
              <div style={S.sectionLabel}>Cost base & today's snapshot</div>
              <ResultBox>
                <ResultRow label="Purchase price" value={fmtCurrency(purchasePrice)} />
                <ResultRow label="Improvement costs" value={fmtCurrency(improvements)} />
                <ResultRow label="Cost base" value={fmtCurrency(costBase)} highlight />
                <ResultRow label="Current loan balance" value={fmtCurrency(loanBalance)} accent="red" />
                <ResultRow label="Years held" value={`${yearsHeld} years`} />
                <ResultRow label="50% CGT discount eligible" value={yearsHeld >= 1 ? '✓ Yes (held > 12 months)' : '✗ Not yet'} accent={yearsHeld >= 1 ? 'teal' : 'red'} />
              </ResultBox>
            </div>

            <p style={{ fontSize: 11, color: 'rgba(15,30,60,0.35)', textAlign: 'center' }}>
              Estimates only. Does not account for main residence exemption, prior capital losses, or other CGT events. Consult a registered tax agent.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
