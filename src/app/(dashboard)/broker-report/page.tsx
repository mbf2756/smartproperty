'use client'
import { useState, useMemo } from 'react'
import { DashboardTopbar } from '@/components/DashboardTopbar'
import { calculateProperty, fmtCurrency, fmtPct, DEFAULT_INPUTS } from '@/lib/calculations'
import { LockedPage } from '@/components/PaywallOverlay'
import { useTier } from '@/hooks/useTier'
import type { PropertyInputs } from '@/types'

const C = { forest: '#1A2F1A', gold: '#C9963A', cream: '#F7F4EE', cream2: '#EDE8DF' }

export default function BrokerReportPage() {
  const { isBroker, checked } = useTier()

  const [clientName, setClientName]     = useState('')
  const [clientIncome, setClientIncome] = useState(120000)
  const [existingDebts, setExistingDebts] = useState(0)
  const [inputs, setInputs]             = useState<PropertyInputs>({ ...DEFAULT_INPUTS })
  const [brokerName, setBrokerName]     = useState('')
  const [brokerNotes, setBrokerNotes]   = useState('')

  const ioResults  = useMemo(() => calculateProperty({ ...inputs, loanType: 'IO', taxableIncome: clientIncome }), [inputs, clientIncome])
  const piResults  = useMemo(() => calculateProperty({ ...inputs, loanType: 'PI', taxableIncome: clientIncome }), [inputs, clientIncome])
  const splitIO    = useMemo(() => calculateProperty({ ...inputs, loanType: 'IO', purchasePrice: inputs.purchasePrice * 0.6, taxableIncome: clientIncome }), [inputs, clientIncome])

  const loanAmount    = inputs.purchasePrice * (1 - inputs.depositPercent / 100)
  const totalDebts    = loanAmount + existingDebts
  const dsr           = (ioResults.totalMortgage + existingDebts * 0.06) / clientIncome  // rough DSR

  const set = (k: keyof PropertyInputs) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setInputs(p => ({ ...p, [k]: +e.target.value }))

  if (checked && !isBroker) {
    return (
      <div>
        <DashboardTopbar title="Broker Opportunity Report" subtitle="Broker plan required" />
        <LockedPage title="Broker Opportunity Report" icon="📊"
          description="Enter a client's income, deposit and property details to generate a recommended loan structure comparison — IO, P&I and split loan — with pros, cons and cash flow for each. White-label PDF export included." plan="broker" />
      </div>
    )
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '9px 12px', border: '1px solid rgba(26,47,26,0.15)', borderRadius: 9, fontFamily: 'monospace', fontSize: 13, color: C.forest, outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(26,47,26,0.45)', marginBottom: 5, display: 'block' }

  const structures = [
    {
      label: 'Interest Only (IO)',
      icon: '⇒',
      color: '#3B82F6',
      results: ioResults,
      loanType: 'IO',
      pros: [
        'Lower weekly repayments — maximum cash flow',
        'Higher tax deductibility (full interest deductible)',
        'Greater flexibility to redeploy cash flow',
        `Tax refund of ${fmtCurrency(ioResults.taxRefund)}/yr`,
      ],
      cons: [
        'Loan balance does not reduce during IO period',
        'Higher total interest paid over loan life',
        'Revert to higher P&I repayments after IO period',
        'Less equity accumulation in short term',
      ],
      bestFor: 'Investors focused on cash flow and tax minimisation. Short-term hold strategy.',
    },
    {
      label: 'Principal & Interest (P&I)',
      icon: '📉',
      color: C.gold,
      results: piResults,
      loanType: 'PI',
      pros: [
        'Equity builds automatically with each repayment',
        'Lower total interest paid over loan life',
        'Forced saving mechanism',
        `Equity of ${fmtCurrency(inputs.purchasePrice * inputs.depositPercent / 100 + piResults.principalRepayment * 5)} after 5 years`,
      ],
      cons: [
        'Higher weekly repayments than IO',
        'Less cash flow available for other investments',
        `Higher weekly cost of ${fmtCurrency(piResults.weeklyAfterTaxCashFlow)}`,
      ],
      bestFor: 'Long-term wealth building. Investors who want to own the property outright.',
    },
    {
      label: 'Split Loan (60% IO / 40% P&I)',
      icon: '⚖️',
      color: '#16A34A',
      results: splitIO,
      loanType: 'IO',
      pros: [
        'Balance between cash flow and equity building',
        'Partial tax deductibility on IO portion',
        'Reduces refinance risk at IO period end',
        'Flexibility to adjust split over time',
      ],
      cons: [
        'More complex to manage',
        'Two loan accounts to monitor',
        'May incur additional fees',
      ],
      bestFor: 'Clients who want balance — some cash flow benefit with some equity accumulation.',
    },
  ]

  return (
    <div>
      <DashboardTopbar title="Broker Opportunity Report" subtitle="Recommended loan structures for your client" />
      <div style={{ padding: '24px 36px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>

          {/* Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: 'white', borderRadius: 14, padding: '18px', border: '1px solid rgba(26,47,26,0.1)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Report details</div>
              {[
                { label: 'Broker / adviser name', val: brokerName, set: setBrokerName, text: true },
                { label: 'Client name', val: clientName, set: setClientName, text: true },
              ].map(f => (
                <div key={f.label} style={{ marginBottom: 10 }}>
                  <label style={labelStyle}>{f.label}</label>
                  <input type="text" value={f.val} onChange={e => f.set(e.target.value)}
                    style={{ ...inputStyle, fontFamily: 'inherit' }} />
                </div>
              ))}
              <div style={{ marginBottom: 10 }}>
                <label style={labelStyle}>Adviser notes</label>
                <textarea value={brokerNotes} onChange={e => setBrokerNotes(e.target.value)} rows={3}
                  style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }} />
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: 14, padding: '18px', border: '1px solid rgba(26,47,26,0.1)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Client details</div>
              {[
                { label: 'Client annual income', val: clientIncome, set: setClientIncome, prefix: '$', step: 5000 },
                { label: 'Existing debt repayments /yr', val: existingDebts, set: setExistingDebts, prefix: '$', step: 1000 },
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
              {/* DSR indicator */}
              <div style={{ padding: '8px 10px', borderRadius: 8, background: dsr < 0.3 ? 'rgba(22,163,74,0.08)' : dsr < 0.4 ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${dsr < 0.3 ? 'rgba(22,163,74,0.2)' : dsr < 0.4 ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: dsr < 0.3 ? '#16A34A' : dsr < 0.4 ? '#D97706' : '#DC2626' }}>
                  Debt service ratio: {(dsr * 100).toFixed(1)}%
                </div>
                <div style={{ fontSize: 11, color: 'rgba(26,47,26,0.5)', marginTop: 2 }}>
                  {dsr < 0.3 ? 'Conservative — strong serviceability' : dsr < 0.4 ? 'Moderate — acceptable to most lenders' : 'High — may face serviceability constraints'}
                </div>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: 14, padding: '18px', border: '1px solid rgba(26,47,26,0.1)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Property details</div>
              {[
                { label: 'Purchase price', key: 'purchasePrice', prefix: '$', step: 10000 },
                { label: 'Deposit', key: 'depositPercent', suffix: '%', step: 5 },
                { label: 'Interest rate', key: 'interestRate', suffix: '%', step: 0.25 },
                { label: 'Weekly rent', key: 'weeklyRent', prefix: '$', step: 25 },
                { label: 'Hold years', key: 'holdYears', suffix: 'yrs', step: 1 },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 10 }}>
                  <label style={labelStyle}>{f.label}</label>
                  <div style={{ position: 'relative' }}>
                    {f.prefix && <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 12 }}>{f.prefix}</span>}
                    <input type="number" value={inputs[f.key as keyof PropertyInputs] as number} onChange={set(f.key as keyof PropertyInputs)} step={f.step}
                      style={{ ...inputStyle, paddingLeft: f.prefix ? 22 : 12, paddingRight: f.suffix ? 34 : 12 }} />
                    {f.suffix && <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 12 }}>{f.suffix}</span>}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => window.print()}
              style={{ padding: '12px', borderRadius: 12, background: C.forest, color: C.gold, fontWeight: 800, fontSize: 14, border: 'none', cursor: 'pointer' }}>
              🖨 Print / Save as PDF
            </button>
          </div>

          {/* Report output */}
          <div>
            {/* Report header */}
            <div style={{ background: C.forest, borderRadius: 16, padding: '24px 28px', marginBottom: 16 }}>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: C.gold, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>SmartProperty · Broker Report</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 8 }}>Loan Structure Analysis</div>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {clientName && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Client: <strong style={{ color: 'white' }}>{clientName}</strong></div>}
                {brokerName && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Adviser: <strong style={{ color: 'white' }}>{brokerName}</strong></div>}
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Property: <strong style={{ color: 'white' }}>{fmtCurrency(inputs.purchasePrice)}</strong></div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Date: <strong style={{ color: 'white' }}>{new Date().toLocaleDateString('en-AU')}</strong></div>
              </div>
            </div>

            {/* Structure comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
              {structures.map(s => (
                <div key={s.label} style={{ background: 'white', borderRadius: 14, padding: '18px', border: `1px solid rgba(26,47,26,0.1)` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 18 }}>{s.icon}</span>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.forest }}>{s.label}</div>
                  </div>

                  {/* Key number */}
                  <div style={{ background: C.cream, borderRadius: 10, padding: '12px', marginBottom: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: 'rgba(26,47,26,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>After-tax /wk</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 800, color: s.results.weeklyAfterTaxCashFlow >= 0 ? '#16A34A' : '#EF4444' }}>
                      {fmtCurrency(s.results.weeklyAfterTaxCashFlow)}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(26,47,26,0.45)', marginTop: 2 }}>ATO refund {fmtCurrency(s.results.taxRefund)}/yr</div>
                  </div>

                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Pros</div>
                    {s.pros.slice(0, 3).map(p => (
                      <div key={p} style={{ display: 'flex', gap: 5, marginBottom: 4, fontSize: 11, color: C.forest, lineHeight: 1.4 }}>
                        <span style={{ color: '#16A34A', flexShrink: 0 }}>✓</span>{p}
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Cons</div>
                    {s.cons.slice(0, 2).map(c => (
                      <div key={c} style={{ display: 'flex', gap: 5, marginBottom: 4, fontSize: 11, color: C.forest, lineHeight: 1.4 }}>
                        <span style={{ color: '#EF4444', flexShrink: 0 }}>–</span>{c}
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: '8px 10px', background: `${s.color}12`, borderRadius: 8, border: `1px solid ${s.color}25` }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Best for</div>
                    <div style={{ fontSize: 11, color: C.forest, lineHeight: 1.4 }}>{s.bestFor}</div>
                  </div>
                </div>
              ))}
            </div>

            {brokerNotes && (
              <div style={{ background: 'rgba(201,150,58,0.08)', borderRadius: 12, padding: '14px 18px', marginBottom: 16, border: '1px solid rgba(201,150,58,0.2)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.gold, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Adviser notes</div>
                <p style={{ fontSize: 13, color: C.forest, lineHeight: 1.6, margin: 0 }}>{brokerNotes}</p>
              </div>
            )}

            <p style={{ fontSize: 10, color: 'rgba(26,47,26,0.35)', lineHeight: 1.6 }}>
              Educational analysis only. Not a credit recommendation or financial product advice. Does not take into account the client's complete financial situation. Client should seek independent financial and credit advice before proceeding.
            </p>
          </div>
        </div>
      </div>
      <style>{`@media print { nav, header, aside { display: none !important; } }`}</style>
    </div>
  )
}
