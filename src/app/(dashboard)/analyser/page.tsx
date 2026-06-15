'use client'
import { useState, useMemo } from 'react'
import { calculateProperty, fmtCurrency, fmtPct, getMarginalRate, DEFAULT_INPUTS } from '@/lib/calculations'
import type { PropertyInputs } from '@/types'
import { DashboardTopbar } from '@/components/DashboardTopbar'
import { ResultBox, ResultRow } from '@/components/ui/ResultBox'

const S = {
  card: { background: 'white', borderRadius: 16, padding: '24px', border: '1px solid rgba(26,47,26,0.1)', marginBottom: 16 } as React.CSSProperties,
  label: { display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'rgba(26,47,26,0.5)', marginBottom: 6 },
  sectionLabel: { fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'rgba(26,47,26,0.4)', marginBottom: 16 },
  input: { width: '100%', padding: '10px 14px', border: '1px solid rgba(26,47,26,0.12)', borderRadius: 10, fontFamily: 'monospace', fontSize: 14, color: '#1A2F1A', outline: 'none', boxSizing: 'border-box' as const },
  inputPrefix: { width: '100%', paddingLeft: 28, paddingRight: 14, paddingTop: 10, paddingBottom: 10, border: '1px solid rgba(26,47,26,0.12)', borderRadius: 10, fontFamily: 'monospace', fontSize: 14, color: '#1A2F1A', outline: 'none', boxSizing: 'border-box' as const },
  prefix: { position: 'absolute' as const, left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 13, pointerEvents: 'none' as const },
  suffix: { position: 'absolute' as const, right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 13, pointerEvents: 'none' as const },
}

function Alert({ variant, title, children }: { variant: 'danger' | 'warning' | 'success'; title: string; children: React.ReactNode }) {
  const cfg = {
    danger:  { bg: '#FEF2F2', border: 'rgba(232,93,93,0.25)', color: '#7F1D1D' },
    warning: { bg: '#FFFBEB', border: 'rgba(245,158,11,0.3)', color: '#78350F' },
    success: { bg: 'rgba(201,150,58,0.08)', border: 'rgba(201,150,58,0.25)', color: '#065F46' },
  }[variant]
  return (
    <div style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 12, padding: '12px 16px', marginBottom: 16, display: 'flex', gap: 10 }}>
      <span style={{ flexShrink: 0, marginTop: 1 }}>{ variant === 'success' ? '✓' : '⚠' }</span>
      <div style={{ color: cfg.color, fontSize: 13, lineHeight: 1.6 }}>
        <div style={{ fontWeight: 600, marginBottom: 2 }}>{title}</div>
        <div style={{ opacity: 0.85 }}>{children}</div>
      </div>
    </div>
  )
}

export default function AnalyserPage() {
  const [inputs, setInputs] = useState<PropertyInputs>(DEFAULT_INPUTS)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiText, setAiText] = useState('')
  const [aiVisible, setAiVisible] = useState(false)

  const results = useMemo(() => calculateProperty(inputs), [inputs])
  const set = (k: keyof PropertyInputs) => (v: number) => setInputs(p => ({ ...p, [k]: v }))
  const setStr = (k: keyof PropertyInputs) => (v: string) => setInputs(p => ({ ...p, [k]: v }))

  const isNeg = results.taxableRentalLoss < 0
  const marginalPct = fmtPct(results.marginalRate * 100, 0)

  async function askAI() {
    setAiVisible(true)
    setAiLoading(true)
    setAiText('')
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `You are an Australian property investment educator. Explain this property analysis in plain English — 150 words max, no jargon, use the actual numbers.

Purchase: ${fmtCurrency(inputs.purchasePrice)} · Rent: ${fmtCurrency(inputs.weeklyRent)}/wk · Rate: ${inputs.interestRate}% ${inputs.loanType}
Gross yield: ${fmtPct(results.grossYield)} · Net yield: ${fmtPct(results.netYield)} · LVR: ${fmtPct(results.lvr)}
Annual interest: ${fmtCurrency(results.interestExpense)} · Total expenses: ${fmtCurrency(results.totalExpenses)}
Rental income: ${fmtCurrency(results.grossRentalIncome)} · Pre-tax CF: ${fmtCurrency(results.preTaxCashFlow)}/yr
Taxable rental ${isNeg ? 'loss' : 'profit'}: ${fmtCurrency(Math.abs(results.taxableRentalLoss))} · Tax refund: ${fmtCurrency(results.taxRefund)}
After-tax CF: ${fmtCurrency(results.afterTaxCashFlow)}/yr · ${fmtCurrency(results.weeklyAfterTaxCashFlow)}/wk
Break-even rent: ${fmtCurrency(results.breakEvenRent)}/wk

Explain why this property is ${isNeg ? 'negatively geared' : 'positively geared'}, what the tax refund means practically, and the break-even rent.`,
          }],
        }),
      })
      const data = await res.json()
      setAiText(data.content?.[0]?.text || 'Unable to generate explanation.')
    } catch {
      setAiText('Unable to load AI explanation. Please try again.')
    }
    setAiLoading(false)
  }

  return (
    <div>
      <DashboardTopbar title="Property Analyser" subtitle="Model acquisition cash flows, tax outcomes, and returns" isPaid={false} />

      <div style={{ padding: '32px 40px' }}>
        {isNeg ? (
          <Alert variant="warning" title="Negatively geared property">
            This property costs <strong>{fmtCurrency(Math.abs(results.preTaxCashFlow / 52))}/wk</strong> out of pocket before tax.
            After the ATO refund of <strong>{fmtCurrency(results.taxRefund)}/yr</strong>, your net cost is <strong>{fmtCurrency(Math.abs(results.weeklyAfterTaxCashFlow))}/wk</strong>.
          </Alert>
        ) : (
          <Alert variant="success" title="Positively geared property">
            This property generates <strong>{fmtCurrency(results.weeklyAfterTaxCashFlow)}/wk</strong> after tax — it pays for itself and then some.
          </Alert>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24 }}>

          {/* INPUTS */}
          <div>
            {/* Purchase */}
            <div style={S.card}>
              <div style={S.sectionLabel}>Purchase details</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={S.label}>Purchase Price</label>
                  <div style={{ position: 'relative' }}>
                    <span style={S.prefix}>$</span>
                    <input type="number" value={inputs.purchasePrice} onChange={e => set('purchasePrice')(+e.target.value)} step={5000} style={S.inputPrefix} />
                  </div>
                </div>
                <div>
                  <label style={S.label}>Deposit</label>
                  <div style={{ position: 'relative' }}>
                    <input type="number" value={inputs.depositPercent} onChange={e => set('depositPercent')(+e.target.value)} step={5} style={S.input} />
                    <span style={S.suffix}>%</span>
                  </div>
                </div>
                <div>
                  <label style={S.label}>Stamp Duty</label>
                  <div style={{ position: 'relative' }}>
                    <span style={S.prefix}>$</span>
                    <input type="number" value={inputs.stampDuty} onChange={e => set('stampDuty')(+e.target.value)} step={500} style={S.inputPrefix} />
                  </div>
                </div>
                <div>
                  <label style={S.label}>Legal costs</label>
                  <div style={{ position: 'relative' }}>
                    <span style={S.prefix}>$</span>
                    <input type="number" value={inputs.legalCosts} onChange={e => set('legalCosts')(+e.target.value)} step={100} style={S.inputPrefix} />
                  </div>
                </div>
                <div>
                  <label style={S.label}>Other upfront</label>
                  <div style={{ position: 'relative' }}>
                    <span style={S.prefix}>$</span>
                    <input type="number" value={inputs.otherUpfront} onChange={e => set('otherUpfront')(+e.target.value)} step={100} style={S.inputPrefix} />
                  </div>
                </div>
              </div>
            </div>

            {/* Loan */}
            <div style={S.card}>
              <div style={S.sectionLabel}>Loan details</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={S.label}>Loan type</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {(['IO', 'PI'] as const).map(t => (
                      <button key={t} onClick={() => setStr('loanType')(t)}
                        style={{ flex: 1, padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none',
                          background: inputs.loanType === t ? '#1A2F1A' : '#F7F4EE',
                          color: inputs.loanType === t ? '#C9963A' : 'rgba(26,47,26,0.6)',
                        }}>
                        {t === 'IO' ? 'Interest Only' : 'P&I'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={S.label}>Interest Rate</label>
                  <div style={{ position: 'relative' }}>
                    <input type="number" value={inputs.interestRate} onChange={e => set('interestRate')(+e.target.value)} step={0.1} style={S.input} />
                    <span style={S.suffix}>%</span>
                  </div>
                </div>
                <div>
                  <label style={S.label}>Loan term</label>
                  <div style={{ position: 'relative' }}>
                    <input type="number" value={inputs.loanTermYears} onChange={e => set('loanTermYears')(+e.target.value)} step={1} style={S.input} />
                    <span style={S.suffix}>yrs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Income */}
            <div style={S.card}>
              <div style={S.sectionLabel}>Rental income</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={S.label}>Weekly rent</label>
                  <div style={{ position: 'relative' }}>
                    <span style={S.prefix}>$</span>
                    <input type="number" value={inputs.weeklyRent} onChange={e => set('weeklyRent')(+e.target.value)} step={25} style={S.inputPrefix} />
                  </div>
                </div>
                <div>
                  <label style={S.label}>Vacancy rate</label>
                  <div style={{ position: 'relative' }}>
                    <input type="number" value={inputs.vacancyRate} onChange={e => set('vacancyRate')(+e.target.value)} step={1} style={S.input} />
                    <span style={S.suffix}>%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expenses */}
            <div style={S.card}>
              <div style={S.sectionLabel}>Annual expenses</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  { label: 'Council rates', key: 'councilRates' as const },
                  { label: 'Water rates', key: 'waterRates' as const },
                  { label: 'Insurance', key: 'insurance' as const },
                  { label: 'Maintenance', key: 'maintenance' as const },
                  { label: 'Strata fees', key: 'strataFees' as const },
                  { label: 'Other', key: 'otherExpenses' as const },
                ].map(f => (
                  <div key={f.key}>
                    <label style={S.label}>{f.label}</label>
                    <div style={{ position: 'relative' }}>
                      <span style={S.prefix}>$</span>
                      <input type="number" value={inputs[f.key] as number} onChange={e => set(f.key)(+e.target.value)} step={100} style={S.inputPrefix} />
                    </div>
                  </div>
                ))}
                <div>
                  <label style={S.label}>Prop. management</label>
                  <div style={{ position: 'relative' }}>
                    <input type="number" value={inputs.propertyManagement} onChange={e => set('propertyManagement')(+e.target.value)} step={0.5} style={S.input} />
                    <span style={S.suffix}>%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tax */}
            <div style={S.card}>
              <div style={S.sectionLabel}>Tax & depreciation</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={S.label}>Your taxable income (excl. property)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={S.prefix}>$</span>
                    <input type="number" value={inputs.taxableIncome} onChange={e => set('taxableIncome')(+e.target.value)} step={5000} style={S.inputPrefix} />
                  </div>
                  <div style={{ marginTop: 6, fontSize: 11, color: '#065F46', background: 'rgba(201,150,58,0.08)', padding: '5px 10px', borderRadius: 8 }}>
                    Marginal rate: <strong>{marginalPct}</strong> (incl. Medicare levy)
                  </div>
                </div>
                <div>
                  <label style={S.label}>Building dep. (Div 43)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={S.prefix}>$</span>
                    <input type="number" value={inputs.buildingDepreciation} onChange={e => set('buildingDepreciation')(+e.target.value)} step={500} style={S.inputPrefix} />
                  </div>
                </div>
                <div>
                  <label style={S.label}>Plant & equip (Div 40)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={S.prefix}>$</span>
                    <input type="number" value={inputs.contentDepreciation} onChange={e => set('contentDepreciation')(+e.target.value)} step={500} style={S.inputPrefix} />
                  </div>
                </div>
              </div>
            </div>

            {/* Growth */}
            <div style={S.card}>
              <div style={S.sectionLabel}>Growth & CGT</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={S.label}>Capital growth rate</label>
                  <div style={{ position: 'relative' }}>
                    <input type="number" value={inputs.capitalGrowthRate} onChange={e => set('capitalGrowthRate')(+e.target.value)} step={0.5} style={S.input} />
                    <span style={S.suffix}>%</span>
                  </div>
                </div>
                <div>
                  <label style={S.label}>Hold period</label>
                  <div style={{ position: 'relative' }}>
                    <input type="number" value={inputs.holdYears} onChange={e => set('holdYears')(+e.target.value)} step={1} min={1} style={S.input} />
                    <span style={S.suffix}>yrs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RESULTS */}
          <div>
            {/* Key metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'After-tax / week', value: fmtCurrency(results.weeklyAfterTaxCashFlow), accent: results.weeklyAfterTaxCashFlow >= 0, sub: isNeg ? 'Neg. geared' : 'Pos. geared' },
                { label: 'Gross yield', value: fmtPct(results.grossYield), accent: false, sub: `Net ${fmtPct(results.netYield)}` },
                { label: 'LVR', value: fmtPct(results.lvr), accent: results.lvr <= 80, sub: `Loan ${fmtCurrency(inputs.purchasePrice * (1 - inputs.depositPercent / 100))}` },
                { label: 'ATO refund', value: fmtCurrency(results.taxRefund), accent: true, sub: 'per year' },
              ].map(m => (
                <div key={m.label} style={{ background: 'white', borderRadius: 14, padding: '16px 18px', border: '1px solid rgba(26,47,26,0.1)' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(26,47,26,0.4)', marginBottom: 6 }}>{m.label}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 700, color: m.accent ? '#A67C2E' : '#EF4444', letterSpacing: '-0.02em' }}>{m.value}</div>
                  <div style={{ fontSize: 10, color: 'rgba(26,47,26,0.4)', marginTop: 3 }}>{m.sub}</div>
                </div>
              ))}
            </div>

            {/* Cash flow */}
            <div style={S.card}>
              <div style={S.sectionLabel}>Annual cash flow breakdown</div>
              <ResultBox>
                <ResultRow label="Gross rental income" value={fmtCurrency(results.grossRentalIncome)} accent="gold" />
                <ResultRow label="Total expenses" value={`–${fmtCurrency(results.totalExpenses)}`} accent="red" />
                <ResultRow label="Net rental income" value={fmtCurrency(results.netRentalIncome)} />
                <ResultRow label="Interest expense" value={`–${fmtCurrency(results.interestExpense)}`} accent="red" />
                {inputs.loanType === 'PI' && <ResultRow label="Principal repayment" value={`–${fmtCurrency(results.principalRepayment)}`} />}
                <ResultRow label="Pre-tax cash flow" value={fmtCurrency(results.preTaxCashFlow)} highlight accent={results.preTaxCashFlow >= 0 ? 'gold' : 'red'} />
                <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', margin: '8px 0 4px' }} />
                <ResultRow label={`Bldg depreciation (Div 43)`} value={`–${fmtCurrency(inputs.buildingDepreciation)}`} />
                <ResultRow label="Plant dep. (Div 40)" value={`–${fmtCurrency(inputs.contentDepreciation)}`} />
                <ResultRow label={isNeg ? 'Rental loss (deductible)' : 'Taxable rental profit'} value={fmtCurrency(Math.abs(results.taxableRentalLoss))} accent={isNeg ? 'gold' : 'amber'} />
                <ResultRow label="ATO tax refund" value={fmtCurrency(results.taxRefund)} accent="gold" />
                <ResultRow label="After-tax cash flow" value={`${fmtCurrency(results.afterTaxCashFlow)}/yr`} highlight accent={results.afterTaxCashFlow >= 0 ? 'gold' : 'red'} />
              </ResultBox>
            </div>

            {/* Upfront & yields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 0 }}>
              <div style={S.card}>
                <div style={S.sectionLabel}>Upfront costs</div>
                <ResultBox>
                  <ResultRow label="Deposit" value={fmtCurrency(inputs.purchasePrice * inputs.depositPercent / 100)} />
                  <ResultRow label="Stamp duty" value={fmtCurrency(inputs.stampDuty)} />
                  <ResultRow label="Legal / other" value={fmtCurrency(inputs.legalCosts + inputs.otherUpfront)} />
                  <ResultRow label="Total cash required" value={fmtCurrency(results.totalUpfront)} highlight />
                </ResultBox>
              </div>
              <div style={S.card}>
                <div style={S.sectionLabel}>Returns & serviceability</div>
                <ResultBox>
                  <ResultRow label="Gross yield" value={fmtPct(results.grossYield)} />
                  <ResultRow label="Net yield" value={fmtPct(results.netYield)} />
                  <ResultRow label="Cash-on-cash return" value={fmtPct(results.cashOnCashReturn)} accent={results.cashOnCashReturn >= 0 ? 'gold' : 'red'} />
                  <ResultRow label="Break-even rent" value={`${fmtCurrency(results.breakEvenRent)}/wk`} accent="amber" />
                </ResultBox>
              </div>
            </div>

            {/* CGT */}
            <div style={{ ...S.card, marginTop: 16 }}>
              <div style={S.sectionLabel}>CGT projection — hold {inputs.holdYears} years at {inputs.capitalGrowthRate}% growth</div>
              <ResultBox>
                <ResultRow label="Projected value" value={fmtCurrency(results.projectedValue)} accent="gold" />
                <ResultRow label="Capital gain" value={fmtCurrency(results.capitalGain)} />
                <ResultRow label="50% CGT discount applied" value={results.cgtDiscountApplied ? '✓ Yes' : '✗ No'} accent={results.cgtDiscountApplied ? 'gold' : 'amber'} />
                <ResultRow label="Taxable gain" value={fmtCurrency(results.taxableGain)} />
                <ResultRow label="CGT payable" value={`–${fmtCurrency(results.cgtPayable)}`} accent="red" />
                <ResultRow label="Net sale proceeds" value={fmtCurrency(results.netProceeds)} highlight accent={results.netProceeds >= 0 ? 'gold' : 'red'} />
              </ResultBox>
            </div>

            {/* AI explanation */}
            <div style={{ background: '#1A2F1A', borderRadius: 16, padding: '22px', marginTop: 16, border: '1px solid rgba(201,150,58,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#C9963A', marginBottom: 2 }}>⚡ AI Explanation</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Plain-English explanation of your specific numbers</div>
                </div>
                <button onClick={askAI} disabled={aiLoading}
                  style={{ padding: '8px 16px', borderRadius: 10, background: aiLoading ? 'rgba(201,150,58,0.3)' : '#C9963A', color: '#1A2F1A', fontWeight: 700, fontSize: 12, border: 'none', cursor: aiLoading ? 'not-allowed' : 'pointer' }}>
                  {aiLoading ? 'Thinking…' : aiVisible ? 'Refresh' : 'Explain this property'}
                </button>
              </div>
              {!aiVisible && <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Click to get a plain-English explanation of why this property is {isNeg ? 'negatively geared' : 'positively geared'} and what it means for you.</p>}
              {aiVisible && aiLoading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#C9963A', fontSize: 13 }}>
                  <div style={{ width: 14, height: 14, border: '2px solid #C9963A', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Analysing your numbers…
                </div>
              )}
              {aiVisible && !aiLoading && aiText && (
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, margin: 0 }}>{aiText}</p>
              )}
            </div>

            <p style={{ fontSize: 11, color: 'rgba(26,47,26,0.35)', marginTop: 16, textAlign: 'center' }}>
              General information only. Not financial or tax advice. Consult a registered tax agent and licensed financial adviser.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
