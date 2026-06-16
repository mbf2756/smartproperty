'use client'
import { useState } from 'react'
import { DashboardTopbar } from '@/components/DashboardTopbar'
import { calculateProperty, fmtCurrency, fmtPct, DEFAULT_INPUTS } from '@/lib/calculations'
import type { PropertyInputs } from '@/types'
import { useTier } from '@/hooks/useTier'
import { LockedPage } from '@/components/PaywallOverlay'

const C = { forest: '#1A2F1A', gold: '#C9963A', cream: '#F7F4EE', cream2: '#EDE8DF' }

const SUGGESTED_QUESTIONS = [
  'Why is this property negatively geared?',
  'What does break-even rent mean for me?',
  'Should I choose IO or P&I for this property?',
  'How does negative gearing affect my tax return?',
  'Is this a good yield for Brisbane?',
  'What is the 50% CGT discount and do I qualify?',
  'How much deposit do I really need?',
  'What happens to my cash flow if rates rise 1%?',
]

export default function AIExplainPage() {

  const { isPaid, checked } = useTier()
  if (checked && !isPaid) {
    return (
      <div>
        <DashboardTopbar title="AI Explanation Layer" subtitle="Investor plan required" />
        <LockedPage title="AI Explanation Layer" icon="⚡" description="Ask plain-English questions about your property analysis. Why is this negatively geared? What does break-even rent mean? Answered using your actual numbers by Claude AI." plan="investor" />
      </div>
    )
  }

  const [inputs, setInputs] = useState<PropertyInputs>({ ...DEFAULT_INPUTS })
  const [question, setQuestion] = useState('')
  const [answer, setAnswer]   = useState('')
  const [loading, setLoading] = useState(false)
  const [asked, setAsked]     = useState(false)

  const results = calculateProperty(inputs)
  const isNeg   = results.taxableRentalLoss < 0

  async function askQuestion(q: string) {
    const finalQ = q || question
    if (!finalQ.trim()) return
    setLoading(true)
    setAsked(true)
    setAnswer('')
    setQuestion(finalQ)

    const context = `
Property: ${fmtCurrency(inputs.purchasePrice)} purchase · ${fmtCurrency(inputs.weeklyRent)}/wk rent · ${inputs.interestRate}% ${inputs.loanType}
Gross yield: ${fmtPct(results.grossYield)} · Net yield: ${fmtPct(results.netYield)} · LVR: ${fmtPct(results.lvr)}
Pre-tax cash flow: ${fmtCurrency(results.preTaxCashFlow)}/yr (${fmtCurrency(results.preTaxCashFlow/52)}/wk)
ATO tax refund: ${fmtCurrency(results.taxRefund)}/yr
After-tax cash flow: ${fmtCurrency(results.afterTaxCashFlow)}/yr (${fmtCurrency(results.weeklyAfterTaxCashFlow)}/wk)
Taxable rental ${isNeg ? 'loss' : 'profit'}: ${fmtCurrency(Math.abs(results.taxableRentalLoss))}
Break-even rent: ${fmtCurrency(results.breakEvenRent)}/wk
Investor income: ${fmtCurrency(inputs.taxableIncome)}/yr · Marginal rate: ${fmtPct(results.marginalRate * 100, 0)}
Projected value (${inputs.holdYears}yr): ${fmtCurrency(results.projectedValue)} · CGT payable: ${fmtCurrency(results.cgtPayable)}
`.trim()

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `You are an Australian property investment educator. Answer the following question in plain English using ONLY the property data provided. Be specific, use the actual numbers, keep it under 200 words, no jargon.

Property data:
${context}

Question: ${finalQ}`
          }]
        })
      })
      const data = await res.json()
      setAnswer(data.content?.[0]?.text || 'Unable to generate answer. Please try again.')
    } catch {
      setAnswer('Could not connect to AI. Please try again.')
    }
    setLoading(false)
  }

  const set = (k: keyof PropertyInputs) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputs(p => ({ ...p, [k]: +e.target.value }))

  return (
    <div>
      <DashboardTopbar title="AI Explanation Layer" subtitle="Ask plain-English questions about your property analysis" />
      <div style={{ padding: '28px 36px', maxWidth: 900 }}>

        {/* Property inputs */}
        <div style={{ background: 'white', borderRadius: 16, padding: '20px 24px', border: '1px solid rgba(26,47,26,0.1)', marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Your property (adjust to match yours)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {[
              { label: 'Purchase price', key: 'purchasePrice', prefix: '$', step: 10000 },
              { label: 'Weekly rent', key: 'weeklyRent', prefix: '$', step: 25 },
              { label: 'Interest rate', key: 'interestRate', suffix: '%', step: 0.25 },
              { label: 'Your income', key: 'taxableIncome', prefix: '$', step: 5000 },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'rgba(26,47,26,0.45)', marginBottom: 5, display: 'block' }}>{f.label}</label>
                <div style={{ position: 'relative' }}>
                  {f.prefix && <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 12 }}>{f.prefix}</span>}
                  <input type="number" value={inputs[f.key as keyof PropertyInputs] as number}
                    onChange={set(f.key as keyof PropertyInputs)} step={f.step}
                    style={{ width: '100%', padding: '9px 12px', paddingLeft: f.prefix ? 22 : 12, paddingRight: f.suffix ? 28 : 12, border: '1px solid rgba(26,47,26,0.15)', borderRadius: 9, fontFamily: 'monospace', fontSize: 13, color: C.forest, outline: 'none', boxSizing: 'border-box' as const }} />
                  {f.suffix && <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 12 }}>{f.suffix}</span>}
                </div>
              </div>
            ))}
          </div>
          {/* Quick stats */}
          <div style={{ display: 'flex', gap: 20, marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(26,47,26,0.06)', flexWrap: 'wrap' }}>
            {[
              { label: 'After-tax /wk', value: fmtCurrency(results.weeklyAfterTaxCashFlow), color: results.weeklyAfterTaxCashFlow >= 0 ? '#16A34A' : '#EF4444' },
              { label: 'Gross yield', value: fmtPct(results.grossYield), color: C.forest },
              { label: 'ATO refund', value: `${fmtCurrency(results.taxRefund)}/yr`, color: C.gold },
              { label: 'Break-even rent', value: `${fmtCurrency(results.breakEvenRent)}/wk`, color: C.forest },
              { label: isNeg ? 'Neg. geared' : 'Pos. geared', value: isNeg ? '↓' : '↑', color: isNeg ? '#F59E0B' : '#16A34A' },
            ].map(m => (
              <div key={m.label}>
                <div style={{ fontSize: 10, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{m.label}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Question input */}
        <div style={{ background: C.forest, borderRadius: 16, padding: '24px', marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.gold, marginBottom: 12 }}>⚡ Ask anything about your property</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && askQuestion(question)}
              placeholder="e.g. Why is this property negatively geared?"
              style={{ flex: 1, padding: '11px 16px', borderRadius: 10, border: 'none', fontFamily: 'inherit', fontSize: 14, color: C.forest, outline: 'none', background: 'white' }}
            />
            <button onClick={() => askQuestion(question)} disabled={loading || !question.trim()}
              style={{ padding: '11px 22px', borderRadius: 10, background: loading ? 'rgba(201,150,58,0.5)' : C.gold, color: C.forest, fontWeight: 800, fontSize: 13, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
              {loading ? 'Thinking…' : 'Ask →'}
            </button>
          </div>

          {/* Answer */}
          {asked && (
            <div style={{ marginTop: 16, padding: '16px', background: 'rgba(255,255,255,0.06)', borderRadius: 12, minHeight: 60 }}>
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.gold, fontSize: 13 }}>
                  <div style={{ width: 14, height: 14, border: `2px solid ${C.gold}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Analysing your property data…
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </div>
              ) : (
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.75, margin: 0 }}>{answer}</p>
              )}
            </div>
          )}
        </div>

        {/* Suggested questions */}
        <div style={{ background: 'white', borderRadius: 16, padding: '20px 24px', border: '1px solid rgba(26,47,26,0.1)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Suggested questions</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {SUGGESTED_QUESTIONS.map(q => (
              <button key={q} onClick={() => askQuestion(q)}
                style={{ padding: '10px 14px', borderRadius: 10, background: C.cream, border: '1px solid rgba(26,47,26,0.08)', cursor: 'pointer', textAlign: 'left', fontSize: 13, color: C.forest, transition: 'all 0.15s', fontFamily: 'inherit' }}>
                {q}
              </button>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 11, color: 'rgba(26,47,26,0.35)', textAlign: 'center', marginTop: 16 }}>
          AI explanations are educational only. Not financial advice. Powered by Claude.
        </p>
      </div>
    </div>
  )
}
