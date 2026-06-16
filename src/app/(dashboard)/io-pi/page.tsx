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

export default function IOPIPage() {
  const [inputs, setInputs] = useState<PropertyInputs>({ ...DEFAULT_INPUTS })
  const set = (k: keyof PropertyInputs) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputs(p => ({ ...p, [k]: +e.target.value }))

  const io = useMemo(() => calculateProperty({ ...inputs, loanType: 'IO' }), [inputs])
  const pi = useMemo(() => calculateProperty({ ...inputs, loanType: 'PI' }), [inputs])

  const ioAnnualSaving = pi.totalMortgage - io.totalMortgage
  const piEquityBuilt  = pi.principalRepayment * inputs.holdYears

  const metrics = [
    { label: 'Weekly after-tax cost',   io: fmtCurrency(io.weeklyAfterTaxCashFlow),   pi: fmtCurrency(pi.weeklyAfterTaxCashFlow) },
    { label: 'Annual interest',          io: fmtCurrency(io.interestExpense),           pi: fmtCurrency(pi.interestExpense) },
    { label: 'Annual principal',         io: fmtCurrency(io.principalRepayment),        pi: fmtCurrency(pi.principalRepayment) },
    { label: 'Total annual mortgage',    io: fmtCurrency(io.totalMortgage),             pi: fmtCurrency(pi.totalMortgage) },
    { label: 'ATO tax refund /yr',       io: fmtCurrency(io.taxRefund),                 pi: fmtCurrency(pi.taxRefund) },
    { label: 'Gross yield',              io: fmtPct(io.grossYield),                     pi: fmtPct(pi.grossYield) },
    { label: 'Net yield',                io: fmtPct(io.netYield),                       pi: fmtPct(pi.netYield) },
    { label: 'Cash-on-cash return',      io: fmtPct(io.cashOnCashReturn),               pi: fmtPct(pi.cashOnCashReturn) },
    { label: 'Break-even rent',          io: `${fmtCurrency(io.breakEvenRent)}/wk`,    pi: `${fmtCurrency(pi.breakEvenRent)}/wk` },
    { label: `Net proceeds (${inputs.holdYears}yr)`, io: fmtCurrency(io.netProceeds), pi: fmtCurrency(pi.netProceeds) },
  ]

  return (
    <div>
      <DashboardTopbar title="IO vs P&I Optimiser" subtitle="Interest-only vs principal & interest — full comparison" />
      <div style={{ padding: '28px 36px' }}>
        <div style={{ ...S.card, marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Property details</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
            {[
              { label: 'Purchase price', key: 'purchasePrice', prefix: '$', step: 10000 },
              { label: 'Interest rate', key: 'interestRate', suffix: '%', step: 0.25 },
              { label: 'Weekly rent', key: 'weeklyRent', prefix: '$', step: 25 },
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
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div style={{ background: C.forest, borderRadius: 14, padding: '20px 24px' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>IO saves annually</div>
            <div style={{ fontFamily: 'monospace', fontSize: 26, fontWeight: 700, color: C.gold }}>{fmtCurrency(ioAnnualSaving)}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>Lower repayments each year vs P&I</div>
          </div>
          <div style={{ background: C.forest, borderRadius: 14, padding: '20px 24px' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>P&I equity built in {inputs.holdYears}yr</div>
            <div style={{ fontFamily: 'monospace', fontSize: 26, fontWeight: 700, color: '#22C55E' }}>{fmtCurrency(piEquityBuilt)}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>Principal repaid over hold period</div>
          </div>
        </div>

        <div style={{ ...S.card }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', paddingBottom: 10, borderBottom: '1px solid rgba(26,47,26,0.1)' }}>Metric</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.forest, textTransform: 'uppercase', letterSpacing: '0.08em', paddingBottom: 10, borderBottom: '1px solid rgba(26,47,26,0.1)', textAlign: 'right' }}>Interest Only</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.forest, textTransform: 'uppercase', letterSpacing: '0.08em', paddingBottom: 10, borderBottom: '1px solid rgba(26,47,26,0.1)', textAlign: 'right' }}>P&I</div>
          </div>
          {metrics.map((m, i) => (
            <div key={m.label} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 0, padding: '9px 0', borderBottom: i < metrics.length - 1 ? '1px solid rgba(26,47,26,0.05)' : 'none' }}>
              <div style={{ fontSize: 12, color: 'rgba(26,47,26,0.6)' }}>{m.label}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: C.forest, textAlign: 'right' }}>{m.io}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: C.forest, textAlign: 'right' }}>{m.pi}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, padding: '14px 18px', background: 'rgba(201,150,58,0.08)', borderRadius: 12, border: '1px solid rgba(201,150,58,0.2)', fontSize: 13, color: C.forest, lineHeight: 1.6 }}>
          <strong>Strategy note:</strong> IO is typically used by investors focused on maximising tax deductions and cash flow flexibility. P&I builds equity faster but has higher repayments. Consult a licensed financial adviser to determine which suits your strategy.
        </div>
        <p style={{ fontSize: 11, color: 'rgba(26,47,26,0.35)', textAlign: 'center', marginTop: 16 }}>General information only. Not financial advice.</p>
      </div>
    </div>
  )
}
