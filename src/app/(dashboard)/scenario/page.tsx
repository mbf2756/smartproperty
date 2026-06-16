'use client'
import { useState, useMemo } from 'react'
import { DashboardTopbar } from '@/components/DashboardTopbar'
import { calculateProperty, fmtCurrency, fmtPct, DEFAULT_INPUTS } from '@/lib/calculations'
import type { PropertyInputs } from '@/types'

const C = { forest: '#1A2F1A', gold: '#C9963A', cream: '#F7F4EE', cream2: '#EDE8DF' }
const S = {
  card: { background: 'white', borderRadius: 16, padding: '24px', border: '1px solid rgba(26,47,26,0.1)' } as React.CSSProperties,
  label: { fontSize: 10, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'rgba(26,47,26,0.45)', marginBottom: 6, display: 'block' },
  input: { width: '100%', padding: '9px 12px', border: '1px solid rgba(26,47,26,0.15)', borderRadius: 9, fontFamily: 'monospace', fontSize: 13, color: '#1A2F1A', outline: 'none', boxSizing: 'border-box' as const },
}

const SCENARIOS = [
  { label: 'Bear', growthRate: 2,   interestRate: 7.5, color: '#EF4444' },
  { label: 'Base', growthRate: 5.5, interestRate: 6.2, color: '#C9963A' },
  { label: 'Bull', growthRate: 9,   interestRate: 5.5, color: '#22C55E' },
]

export default function ScenarioPage() {
  const [inputs, setInputs] = useState<PropertyInputs>({ ...DEFAULT_INPUTS })
  const [loanType, setLoanType] = useState<'IO' | 'PI'>('PI')

  const results = useMemo(() =>
    SCENARIOS.map(s => ({
      ...s,
      pi: calculateProperty({ ...inputs, loanType: 'PI', interestRate: s.interestRate, capitalGrowthRate: s.growthRate }),
      io: calculateProperty({ ...inputs, loanType: 'IO', interestRate: s.interestRate, capitalGrowthRate: s.growthRate }),
    })), [inputs])

  const set = (k: keyof PropertyInputs) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputs(p => ({ ...p, [k]: +e.target.value }))

  return (
    <div>
      <DashboardTopbar title="Scenario Comparison" subtitle="Bear / Base / Bull · IO vs P&I · side by side" />
      <div style={{ padding: '28px 36px' }}>
        <div style={{ ...S.card, marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Property inputs</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
            {[
              { label: 'Purchase price', key: 'purchasePrice', prefix: '$', step: 10000 },
              { label: 'Weekly rent', key: 'weeklyRent', prefix: '$', step: 25 },
              { label: 'Deposit', key: 'depositPercent', suffix: '%', step: 5 },
              { label: 'Your income', key: 'taxableIncome', prefix: '$', step: 5000 },
              { label: 'Hold years', key: 'holdYears', step: 1 },
            ].map(f => (
              <div key={f.key}>
                <label style={S.label}>{f.label}</label>
                <div style={{ position: 'relative' }}>
                  {f.prefix && <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 12 }}>{f.prefix}</span>}
                  <input type="number" value={inputs[f.key as keyof PropertyInputs] as number} onChange={set(f.key as keyof PropertyInputs)} step={f.step}
                    style={{ ...S.input, paddingLeft: f.prefix ? 22 : 12, paddingRight: f.suffix ? 28 : 12 }} />
                  {f.suffix && <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 12 }}>{f.suffix}</span>}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ ...S.label, marginBottom: 0 }}>Loan type:</span>
            {(['IO', 'PI'] as const).map(t => (
              <button key={t} onClick={() => setLoanType(t)}
                style={{ padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                  background: loanType === t ? C.forest : C.cream2, color: loanType === t ? C.gold : C.forest }}>
                {t === 'IO' ? 'Interest Only' : 'Principal & Interest'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
          {results.map(r => {
            const res = loanType === 'IO' ? r.io : r.pi
            return (
              <div key={r.label} style={{ ...S.card, border: `2px solid ${r.color}30` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: r.color }} />
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.forest }}>{r.label} Case</div>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(26,47,26,0.45)', marginBottom: 14 }}>
                  Growth {r.growthRate}% · Rate {r.interestRate}% · {loanType}
                </div>
                <div style={{ background: C.forest, borderRadius: 12, padding: '16px' }}>
                  {[
                    { label: 'After-tax /wk', value: fmtCurrency(res.weeklyAfterTaxCashFlow), accent: res.weeklyAfterTaxCashFlow >= 0 ? '#22C55E' : '#F87171' },
                    { label: 'ATO refund /yr', value: fmtCurrency(res.taxRefund), accent: '#E8B86D' },
                    { label: 'Gross yield', value: fmtPct(res.grossYield), accent: 'white' },
                    { label: 'Net yield', value: fmtPct(res.netYield), accent: 'white' },
                    { label: 'LVR', value: fmtPct(res.lvr), accent: 'white' },
                    { label: `Value in ${inputs.holdYears}yr`, value: fmtCurrency(res.projectedValue), accent: '#E8B86D' },
                    { label: 'Capital gain', value: fmtCurrency(res.capitalGain), accent: '#22C55E' },
                    { label: 'CGT payable', value: fmtCurrency(res.cgtPayable), accent: '#F87171' },
                    { label: 'Net proceeds', value: fmtCurrency(res.netProceeds), accent: '#E8B86D' },
                  ].map((m, i) => (
                    <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < 8 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{m.label}</span>
                      <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: m.accent }}>{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ ...S.card }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>IO vs P&I — Base case comparison</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[results[1].io, results[1].pi].map((res, i) => (
              <div key={i} style={{ background: C.cream, borderRadius: 12, padding: '16px' }}>
                <div style={{ fontWeight: 700, color: C.forest, marginBottom: 12, fontSize: 14 }}>{i === 0 ? 'Interest Only' : 'Principal & Interest'}</div>
                {[
                  { label: 'Weekly after-tax cost', value: fmtCurrency(res.weeklyAfterTaxCashFlow) },
                  { label: 'Annual mortgage', value: fmtCurrency(res.totalMortgage) },
                  { label: 'Interest expense', value: fmtCurrency(res.interestExpense) },
                  { label: 'Principal repayment', value: fmtCurrency(res.principalRepayment) },
                  { label: 'ATO tax refund', value: fmtCurrency(res.taxRefund) },
                ].map(m => (
                  <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(26,47,26,0.06)' }}>
                    <span style={{ fontSize: 12, color: 'rgba(26,47,26,0.55)' }}>{m.label}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: C.forest }}>{m.value}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <p style={{ fontSize: 11, color: 'rgba(26,47,26,0.35)', textAlign: 'center', marginTop: 16 }}>General information only. Not financial advice.</p>
      </div>
    </div>
  )
}
