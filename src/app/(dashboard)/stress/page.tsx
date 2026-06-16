'use client'
import { useState, useMemo } from 'react'
import { DashboardTopbar } from '@/components/DashboardTopbar'
import { calculateProperty, fmtCurrency, fmtPct, DEFAULT_INPUTS } from '@/lib/calculations'
import type { PropertyInputs } from '@/types'
import { useTier } from '@/hooks/useTier'
import { LockedPage } from '@/components/PaywallOverlay'

const C = { forest: '#1A2F1A', gold: '#C9963A', cream: '#F7F4EE', cream2: '#EDE8DF' }
const S = {
  card: { background: 'white', borderRadius: 16, padding: '24px', border: '1px solid rgba(26,47,26,0.1)' } as React.CSSProperties,
  label: { fontSize: 10, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'rgba(26,47,26,0.45)', marginBottom: 6, display: 'block' },
  input: { width: '100%', padding: '9px 12px', border: '1px solid rgba(26,47,26,0.15)', borderRadius: 9, fontFamily: 'monospace', fontSize: 13, color: C.forest, outline: 'none', boxSizing: 'border-box' as const },
}

const RATE_RISES = [0, 0.5, 1.0, 1.5, 2.0, 3.0]

export default function StressPage() {

  const { isPaid, checked } = useTier()
  if (checked && !isPaid) {
    return (
      <div>
        <DashboardTopbar title="Rate Stress Tester" subtitle="Investor plan required" />
        <LockedPage title="Rate Stress Tester" icon="⚠" description="See exactly how your weekly after-tax cash flow changes if interest rates rise by 0.5%, 1%, 1.5%, 2% or 3%. Know your buffer before you commit to a purchase." plan="investor" />
      </div>
    )
  }

  const [inputs, setInputs] = useState<PropertyInputs>({ ...DEFAULT_INPUTS })

  const results = useMemo(() =>
    RATE_RISES.map(rise => ({
      rise,
      rate: inputs.interestRate + rise,
      result: calculateProperty({ ...inputs, interestRate: inputs.interestRate + rise }),
    })), [inputs])

  const base = results[0].result
  const set = (k: keyof PropertyInputs) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputs(p => ({ ...p, [k]: +e.target.value }))

  return (
    <div>
      <DashboardTopbar title="Rate Stress Tester" subtitle="See how cash flow changes if interest rates rise" />
      <div style={{ padding: '28px 36px' }}>

        {/* Inputs */}
        <div style={{ ...S.card, marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Property details</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
            {[
              { label: 'Purchase price', key: 'purchasePrice', prefix: '$', step: 10000 },
              { label: 'Current rate', key: 'interestRate', suffix: '%', step: 0.25 },
              { label: 'Weekly rent', key: 'weeklyRent', prefix: '$', step: 25 },
              { label: 'Your income', key: 'taxableIncome', prefix: '$', step: 5000 },
              { label: 'Deposit', key: 'depositPercent', suffix: '%', step: 5 },
            ].map(f => (
              <div key={f.key}>
                <label style={S.label}>{f.label}</label>
                <div style={{ position: 'relative' }}>
                  {f.prefix && <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 12 }}>{f.prefix}</span>}
                  <input type="number" value={inputs[f.key as keyof PropertyInputs] as number}
                    onChange={set(f.key as keyof PropertyInputs)} step={f.step}
                    style={{ ...S.input, paddingLeft: f.prefix ? 22 : 12, paddingRight: f.suffix ? 28 : 12 }} />
                  {f.suffix && <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 12 }}>{f.suffix}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stress test table */}
        <div style={{ ...S.card, marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
            Rate stress test — current rate {inputs.interestRate}%
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(26,47,26,0.08)' }}>
                {['Rate rise', 'New rate', 'After-tax /wk', 'Change /wk', 'Annual impact', 'ATO refund', 'Break-even rent'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'right', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(26,47,26,0.4)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => {
                const weeklyChange = r.result.weeklyAfterTaxCashFlow - base.weeklyAfterTaxCashFlow
                const isBase = r.rise === 0
                const isCritical = r.result.weeklyAfterTaxCashFlow < -500
                return (
                  <tr key={r.rise} style={{ background: isBase ? 'rgba(201,150,58,0.06)' : isCritical ? 'rgba(239,68,68,0.04)' : 'transparent', borderBottom: '1px solid rgba(26,47,26,0.05)' }}>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: isBase ? 700 : 500, color: C.forest, fontSize: 13 }}>
                      {isBase ? 'Current' : `+${r.rise}%`}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'monospace', fontSize: 13, color: C.forest }}>
                      {r.rate.toFixed(2)}%
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'monospace', fontSize: 13, fontWeight: 600, color: r.result.weeklyAfterTaxCashFlow >= 0 ? '#16A34A' : '#EF4444' }}>
                      {fmtCurrency(r.result.weeklyAfterTaxCashFlow)}/wk
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'monospace', fontSize: 13, color: weeklyChange <= 0 ? '#EF4444' : '#16A34A' }}>
                      {isBase ? '—' : `${fmtCurrency(weeklyChange)}/wk`}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'monospace', fontSize: 13, color: weeklyChange <= 0 ? '#EF4444' : '#16A34A' }}>
                      {isBase ? '—' : fmtCurrency(weeklyChange * 52)}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'monospace', fontSize: 13, color: C.gold }}>
                      {fmtCurrency(r.result.taxRefund)}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'monospace', fontSize: 13, color: C.forest }}>
                      {fmtCurrency(r.result.breakEvenRent)}/wk
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Visual bar */}
        <div style={{ ...S.card }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
            Weekly after-tax cash flow by rate
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 120 }}>
            {results.map(r => {
              const val = r.result.weeklyAfterTaxCashFlow
              const maxAbs = Math.max(...results.map(x => Math.abs(x.result.weeklyAfterTaxCashFlow)))
              const pct = Math.abs(val) / maxAbs
              const isNeg = val < 0
              return (
                <div key={r.rise} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ fontSize: 10, fontFamily: 'monospace', color: isNeg ? '#EF4444' : '#16A34A', fontWeight: 600 }}>
                    {fmtCurrency(val)}
                  </div>
                  <div style={{ width: '100%', height: `${Math.max(pct * 80, 4)}px`, borderRadius: 4, background: isNeg ? '#EF4444' : '#16A34A', opacity: 0.7 + (r.rise === 0 ? 0.3 : 0) }} />
                  <div style={{ fontSize: 10, color: 'rgba(26,47,26,0.5)', fontWeight: r.rise === 0 ? 700 : 400 }}>
                    {r.rise === 0 ? 'Now' : `+${r.rise}%`}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <p style={{ fontSize: 11, color: 'rgba(26,47,26,0.35)', textAlign: 'center', marginTop: 16 }}>
          General information only. Not financial advice.
        </p>
      </div>
    </div>
  )
}
