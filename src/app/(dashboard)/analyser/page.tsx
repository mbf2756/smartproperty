'use client'
import { useState, useMemo, useEffect } from 'react'
import { calculateProperty, fmtCurrency, fmtPct, getMarginalRate, DEFAULT_INPUTS } from '@/lib/calculations'
import type { PropertyInputs } from '@/types'
import { DashboardTopbar } from '@/components/DashboardTopbar'
import { ResultBox, ResultRow } from '@/components/ui/ResultBox'
import Link from 'next/link'

const C = { forest: '#1A2F1A', gold: '#C9963A', cream: '#F7F4EE', cream2: '#EDE8DF' }

const ALL_PAID_PLANS = [
  'optimiser','retirement','optimiser_quarterly',
  'single_smartsuper','single_smartetf','single_smartproperty',
  'double_ss_se','double_ss_sp','double_se_sp','triple_all','investor','broker',
]

const S = {
  card: { background: 'white', borderRadius: 16, padding: '24px', border: '1px solid rgba(26,47,26,0.1)', marginBottom: 16 } as React.CSSProperties,
  label: { display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'rgba(26,47,26,0.5)', marginBottom: 6 },
  sectionLabel: { fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'rgba(26,47,26,0.4)', marginBottom: 16 },
  input: { width: '100%', padding: '10px 14px', border: '1px solid rgba(26,47,26,0.12)', borderRadius: 10, fontFamily: 'monospace', fontSize: 14, color: '#1A2F1A', outline: 'none', boxSizing: 'border-box' as const },
}

function BlurredMetric({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{ background: 'white', borderRadius: 14, padding: '16px 18px', border: '1px solid rgba(26,47,26,0.1)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(26,47,26,0.4)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 700, color: '#1A2F1A', filter: 'blur(6px)', userSelect: 'none' }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: 'rgba(26,47,26,0.4)', marginTop: 3, filter: 'blur(4px)', userSelect: 'none' }}>{sub}</div>}
    </div>
  )
}

function UpgradePrompt() {
  return (
    <div style={{ background: C.forest, borderRadius: 16, padding: '28px', textAlign: 'center', marginBottom: 16 }}>
      <div style={{ fontSize: 24, marginBottom: 10 }}>🔒</div>
      <div style={{ fontFamily: 'monospace', fontSize: 10, color: C.gold, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>Investor plan required</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 8 }}>Unlock your full analysis</div>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 20, maxWidth: 320, margin: '0 auto 20px' }}>
        After-tax cash flow, ATO tax refund, negative gearing benefit, break-even rent, CGT projection and all other results are available on the Investor plan.
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/pricing" style={{ padding: '11px 28px', background: C.gold, color: C.forest, borderRadius: 10, fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
          Get Investor plan — $99/yr →
        </Link>
        <Link href="/pricing" style={{ padding: '11px 18px', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.55)', borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>
          See all plans
        </Link>
      </div>
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 14 }}>14-day free trial · Cancel anytime · ATO 2024-25 rates</p>
    </div>
  )
}

export default function AnalyserPage() {
  const [inputs, setInputs]   = useState<PropertyInputs>(DEFAULT_INPUTS)
  const [isPaid, setIsPaid]   = useState(false)
  const [checked, setChecked] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiText, setAiText]   = useState('')
  const [aiVisible, setAiVisible] = useState(false)

  const results = useMemo(() => calculateProperty(inputs), [inputs])
  const set = (k: keyof PropertyInputs) => (v: number) => setInputs(p => ({ ...p, [k]: v }))
  const setStr = (k: keyof PropertyInputs) => (v: string) => setInputs(p => ({ ...p, [k]: v }))

  const isNeg = results.taxableRentalLoss < 0

  useEffect(() => {
    async function load() {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setChecked(true); return }
        const { data } = await supabase.from('subscriptions').select('plan,apps,status').eq('user_id', user.id).single()
        if (data && data.status === 'active') {
          const plan = data.plan ?? ''
          const apps: string[] = data.apps ?? []
          setIsPaid(ALL_PAID_PLANS.includes(plan) || apps.includes('smartproperty'))
        }
      } catch {}
      setChecked(true)
    }
    load()
  }, [])

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
            content: `Australian property investment educator. Plain English, 150 words max, use actual numbers.
Property: ${fmtCurrency(inputs.purchasePrice)} · Rent: ${fmtCurrency(inputs.weeklyRent)}/wk · Rate: ${inputs.interestRate}% ${inputs.loanType}
Gross yield: ${fmtPct(results.grossYield)} · Net yield: ${fmtPct(results.netYield)} · LVR: ${fmtPct(results.lvr)}
Pre-tax CF: ${fmtCurrency(results.preTaxCashFlow)}/yr · ATO refund: ${fmtCurrency(results.taxRefund)}/yr
After-tax CF: ${fmtCurrency(results.afterTaxCashFlow)}/yr (${fmtCurrency(results.weeklyAfterTaxCashFlow)}/wk)
Break-even rent: ${fmtCurrency(results.breakEvenRent)}/wk · Marginal rate: ${fmtPct(results.marginalRate * 100, 0)}
Explain why this property is ${isNeg ? 'negatively geared' : 'positively geared'} and what it means practically.`,
          }]
        })
      })
      const data = await res.json()
      setAiText(data.content?.[0]?.text || 'Unable to generate explanation.')
    } catch {
      setAiText('Could not connect. Please try again.')
    }
    setAiLoading(false)
  }

  return (
    <div>
      <DashboardTopbar
        title="Property Analyser"
        subtitle={isPaid ? 'Full analysis — ATO 2024-25 rates' : 'Preview — subscribe for full results'}
      />

      <div style={{ padding: '28px 36px' }}>
        {/* Free preview banner */}
        {checked && !isPaid && (
          <div style={{ background: 'rgba(201,150,58,0.08)', border: '1px solid rgba(201,150,58,0.25)', borderRadius: 12, padding: '12px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ fontSize: 13, color: C.forest }}>
              <strong>Free preview:</strong> Gross yield shown. Subscribe to unlock after-tax cash flow, tax refund, CGT, break-even rent and all other results.
            </div>
            <Link href="/pricing" style={{ padding: '8px 18px', background: C.forest, color: C.gold, borderRadius: 9, fontSize: 12, fontWeight: 800, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Unlock — $99/yr →
            </Link>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 24 }}>
          {/* INPUTS — always visible */}
          <div>
            {/* Purchase */}
            <div style={S.card}>
              <div style={S.sectionLabel}>Purchase details</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={S.label}>Purchase Price</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 13 }}>$</span>
                    <input type="number" value={inputs.purchasePrice} onChange={e => set('purchasePrice')(+e.target.value)} step={5000} style={{ ...S.input, paddingLeft: 24 }} />
                  </div>
                </div>
                <div>
                  <label style={S.label}>Deposit</label>
                  <div style={{ position: 'relative' }}>
                    <input type="number" value={inputs.depositPercent} onChange={e => set('depositPercent')(+e.target.value)} step={5} style={{ ...S.input, paddingRight: 28 }} />
                    <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 13 }}>%</span>
                  </div>
                </div>
                <div>
                  <label style={S.label}>Stamp Duty</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 13 }}>$</span>
                    <input type="number" value={inputs.stampDuty} onChange={e => set('stampDuty')(+e.target.value)} step={500} style={{ ...S.input, paddingLeft: 24 }} />
                  </div>
                </div>
                <div>
                  <label style={S.label}>Legal costs</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 13 }}>$</span>
                    <input type="number" value={inputs.legalCosts} onChange={e => set('legalCosts')(+e.target.value)} step={100} style={{ ...S.input, paddingLeft: 24 }} />
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
                          background: inputs.loanType === t ? C.forest : C.cream2,
                          color: inputs.loanType === t ? C.gold : 'rgba(26,47,26,0.6)' }}>
                        {t === 'IO' ? 'Interest Only' : 'P&I'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={S.label}>Interest Rate</label>
                  <div style={{ position: 'relative' }}>
                    <input type="number" value={inputs.interestRate} onChange={e => set('interestRate')(+e.target.value)} step={0.1} style={{ ...S.input, paddingRight: 28 }} />
                    <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 13 }}>%</span>
                  </div>
                </div>
                <div>
                  <label style={S.label}>Loan term</label>
                  <div style={{ position: 'relative' }}>
                    <input type="number" value={inputs.loanTermYears} onChange={e => set('loanTermYears')(+e.target.value)} step={1} style={{ ...S.input, paddingRight: 34 }} />
                    <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 13 }}>yrs</span>
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
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 13 }}>$</span>
                    <input type="number" value={inputs.weeklyRent} onChange={e => set('weeklyRent')(+e.target.value)} step={25} style={{ ...S.input, paddingLeft: 24 }} />
                  </div>
                </div>
                <div>
                  <label style={S.label}>Vacancy rate</label>
                  <div style={{ position: 'relative' }}>
                    <input type="number" value={inputs.vacancyRate} onChange={e => set('vacancyRate')(+e.target.value)} step={1} style={{ ...S.input, paddingRight: 28 }} />
                    <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 13 }}>%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tax — only shown to paid */}
            {isPaid && (
              <div style={S.card}>
                <div style={S.sectionLabel}>Tax & depreciation</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={S.label}>Your taxable income (excl. property)</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 13 }}>$</span>
                      <input type="number" value={inputs.taxableIncome} onChange={e => set('taxableIncome')(+e.target.value)} step={5000} style={{ ...S.input, paddingLeft: 24 }} />
                    </div>
                    <div style={{ marginTop: 6, fontSize: 11, color: '#065F46', background: 'rgba(0,180,100,0.08)', padding: '5px 10px', borderRadius: 8 }}>
                      Marginal rate: <strong>{fmtPct(getMarginalRate(inputs.taxableIncome) * 100, 0)}</strong> (incl. Medicare levy)
                    </div>
                  </div>
                  <div>
                    <label style={S.label}>Building dep. (Div 43)</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 13 }}>$</span>
                      <input type="number" value={inputs.buildingDepreciation} onChange={e => set('buildingDepreciation')(+e.target.value)} step={500} style={{ ...S.input, paddingLeft: 24 }} />
                    </div>
                  </div>
                  <div>
                    <label style={S.label}>Plant & equip (Div 40)</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 13 }}>$</span>
                      <input type="number" value={inputs.contentDepreciation} onChange={e => set('contentDepreciation')(+e.target.value)} step={500} style={{ ...S.input, paddingLeft: 24 }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Growth — only shown to paid */}
            {isPaid && (
              <div style={S.card}>
                <div style={S.sectionLabel}>Growth & CGT</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={S.label}>Capital growth rate</label>
                    <div style={{ position: 'relative' }}>
                      <input type="number" value={inputs.capitalGrowthRate} onChange={e => set('capitalGrowthRate')(+e.target.value)} step={0.5} style={{ ...S.input, paddingRight: 28 }} />
                      <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 13 }}>%</span>
                    </div>
                  </div>
                  <div>
                    <label style={S.label}>Hold period</label>
                    <div style={{ position: 'relative' }}>
                      <input type="number" value={inputs.holdYears} onChange={e => set('holdYears')(+e.target.value)} step={1} min={1} style={{ ...S.input, paddingRight: 34 }} />
                      <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 13 }}>yrs</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RESULTS */}
          <div>
            {/* Key metrics row — gross yield always visible, rest blurred for free */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
              {/* Gross yield — always visible */}
              <div style={{ background: 'white', borderRadius: 14, padding: '16px 18px', border: '1px solid rgba(26,47,26,0.1)', gridColumn: '1' }}>
                <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(26,47,26,0.4)', marginBottom: 6 }}>Gross yield</div>
                <div style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 700, color: C.forest }}>{fmtPct(results.grossYield)}</div>
                <div style={{ fontSize: 10, color: 'rgba(26,47,26,0.4)', marginTop: 3 }}>Net {fmtPct(results.netYield)}</div>
              </div>

              {isPaid ? (
                <>
                  <div style={{ background: 'white', borderRadius: 14, padding: '16px 18px', border: '1px solid rgba(26,47,26,0.1)' }}>
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(26,47,26,0.4)', marginBottom: 6 }}>After-tax /wk</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 700, color: results.weeklyAfterTaxCashFlow >= 0 ? '#16A34A' : '#EF4444' }}>{fmtCurrency(results.weeklyAfterTaxCashFlow)}</div>
                    <div style={{ fontSize: 10, color: 'rgba(26,47,26,0.4)', marginTop: 3 }}>{isNeg ? 'Neg. geared' : 'Pos. geared'}</div>
                  </div>
                  <div style={{ background: 'white', borderRadius: 14, padding: '16px 18px', border: '1px solid rgba(26,47,26,0.1)' }}>
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(26,47,26,0.4)', marginBottom: 6 }}>ATO Refund</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 700, color: C.gold }}>{fmtCurrency(results.taxRefund)}</div>
                    <div style={{ fontSize: 10, color: 'rgba(26,47,26,0.4)', marginTop: 3 }}>per year</div>
                  </div>
                  <div style={{ background: 'white', borderRadius: 14, padding: '16px 18px', border: '1px solid rgba(26,47,26,0.1)' }}>
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(26,47,26,0.4)', marginBottom: 6 }}>LVR</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 700, color: results.lvr > 80 ? '#F59E0B' : C.forest }}>{fmtPct(results.lvr)}</div>
                    <div style={{ fontSize: 10, color: 'rgba(26,47,26,0.4)', marginTop: 3 }}>Loan {fmtCurrency(inputs.purchasePrice * (1 - inputs.depositPercent / 100))}</div>
                  </div>
                </>
              ) : (
                <>
                  <BlurredMetric label="After-tax /wk" value="-$178/wk" sub="Neg. geared" />
                  <BlurredMetric label="ATO Refund" value="$8,140/yr" sub="per year" />
                  <BlurredMetric label="LVR" value="80.00%" sub="Loan $680,000" />
                </>
              )}
            </div>

            {/* Upgrade prompt for free users */}
            {checked && !isPaid && <UpgradePrompt />}

            {/* Full results for paid users */}
            {isPaid && (
              <>
                {isNeg && (
                  <div style={{ background: '#FFFBEB', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 12, padding: '12px 16px', marginBottom: 16, display: 'flex', gap: 10 }}>
                    <span style={{ flexShrink: 0 }}>⚠</span>
                    <div style={{ fontSize: 13, color: '#78350F', lineHeight: 1.6 }}>
                      <strong>Negatively geared.</strong> Costs <strong>{fmtCurrency(Math.abs(results.preTaxCashFlow / 52))}/wk</strong> before tax.
                      After ATO refund of <strong>{fmtCurrency(results.taxRefund)}/yr</strong>, net cost is <strong>{fmtCurrency(Math.abs(results.weeklyAfterTaxCashFlow))}/wk</strong>.
                    </div>
                  </div>
                )}

                <div style={S.card}>
                  <div style={S.sectionLabel}>Annual cash flow breakdown</div>
                  <ResultBox>
                    <ResultRow label="Gross rental income" value={fmtCurrency(results.grossRentalIncome)} accent="gold" />
                    <ResultRow label="Total expenses" value={`–${fmtCurrency(results.totalExpenses)}`} accent="red" />
                    <ResultRow label="Interest expense" value={`–${fmtCurrency(results.interestExpense)}`} accent="red" />
                    {inputs.loanType === 'PI' && <ResultRow label="Principal repayment" value={`–${fmtCurrency(results.principalRepayment)}`} />}
                    <ResultRow label="Pre-tax cash flow" value={fmtCurrency(results.preTaxCashFlow)} highlight accent={results.preTaxCashFlow >= 0 ? 'gold' : 'red'} />
                    <ResultRow label="Bldg depreciation (Div 43)" value={`–${fmtCurrency(inputs.buildingDepreciation)}`} />
                    <ResultRow label="Plant dep. (Div 40)" value={`–${fmtCurrency(inputs.contentDepreciation)}`} />
                    <ResultRow label={isNeg ? 'Rental loss (deductible)' : 'Taxable rental profit'} value={fmtCurrency(Math.abs(results.taxableRentalLoss))} accent={isNeg ? 'gold' : 'amber'} />
                    <ResultRow label="ATO tax refund" value={fmtCurrency(results.taxRefund)} accent="gold" />
                    <ResultRow label="After-tax cash flow" value={`${fmtCurrency(results.afterTaxCashFlow)}/yr`} highlight accent={results.afterTaxCashFlow >= 0 ? 'gold' : 'red'} />
                  </ResultBox>
                </div>

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
                    <div style={S.sectionLabel}>Returns</div>
                    <ResultBox>
                      <ResultRow label="Gross yield" value={fmtPct(results.grossYield)} />
                      <ResultRow label="Net yield" value={fmtPct(results.netYield)} />
                      <ResultRow label="Cash-on-cash return" value={fmtPct(results.cashOnCashReturn)} accent={results.cashOnCashReturn >= 0 ? 'gold' : 'red'} />
                      <ResultRow label="Break-even rent" value={`${fmtCurrency(results.breakEvenRent)}/wk`} accent="amber" />
                    </ResultBox>
                  </div>
                </div>

                <div style={{ ...S.card, marginTop: 16 }}>
                  <div style={S.sectionLabel}>CGT projection — hold {inputs.holdYears} years at {inputs.capitalGrowthRate}% growth</div>
                  <ResultBox>
                    <ResultRow label="Projected value" value={fmtCurrency(results.projectedValue)} accent="gold" />
                    <ResultRow label="Capital gain" value={fmtCurrency(results.capitalGain)} />
                    <ResultRow label="50% CGT discount" value={results.cgtDiscountApplied ? '✓ Applied' : '✗ Not applied'} accent={results.cgtDiscountApplied ? 'gold' : 'red'} />
                    <ResultRow label="Taxable gain" value={fmtCurrency(results.taxableGain)} />
                    <ResultRow label="CGT payable" value={`–${fmtCurrency(results.cgtPayable)}`} accent="red" />
                    <ResultRow label="Net sale proceeds" value={fmtCurrency(results.netProceeds)} highlight accent={results.netProceeds >= 0 ? 'gold' : 'red'} />
                  </ResultBox>
                </div>

                {/* AI Explanation */}
                <div style={{ background: C.forest, borderRadius: 16, padding: '22px', marginTop: 16, border: '1px solid rgba(201,150,58,0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.gold, marginBottom: 2 }}>⚡ AI Explanation</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Plain-English explanation of your specific numbers</div>
                    </div>
                    <button onClick={askAI} disabled={aiLoading}
                      style={{ padding: '8px 16px', borderRadius: 10, background: aiLoading ? 'rgba(201,150,58,0.3)' : C.gold, color: C.forest, fontWeight: 700, fontSize: 12, border: 'none', cursor: aiLoading ? 'not-allowed' : 'pointer' }}>
                      {aiLoading ? 'Thinking…' : aiVisible ? 'Refresh' : 'Explain this property'}
                    </button>
                  </div>
                  {!aiVisible && <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Click to get a plain-English explanation of why this property is {isNeg ? 'negatively geared' : 'positively geared'}.</p>}
                  {aiVisible && aiLoading && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.gold, fontSize: 13 }}>
                      <div style={{ width: 14, height: 14, border: `2px solid ${C.gold}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      Analysing…
                      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                    </div>
                  )}
                  {aiVisible && !aiLoading && aiText && (
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, margin: 0 }}>{aiText}</p>
                  )}
                </div>
              </>
            )}

            <p style={{ fontSize: 11, color: 'rgba(26,47,26,0.35)', marginTop: 16, textAlign: 'center' }}>
              General information only. Not financial or tax advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
