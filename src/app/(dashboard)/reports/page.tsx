'use client'
import { useState } from 'react'
import { DashboardTopbar } from '@/components/DashboardTopbar'
import { calculateProperty, fmtCurrency, fmtPct, DEFAULT_INPUTS } from '@/lib/calculations'
import type { PropertyInputs } from '@/types'

const C = { forest: '#1A2F1A', gold: '#C9963A', cream: '#F7F4EE', cream2: '#EDE8DF' }

export default function ReportsPage() {
  const [inputs, setInputs]         = useState<PropertyInputs>({ ...DEFAULT_INPUTS })
  const [propName, setPropName]     = useState('42 Kelvin Grove Rd, QLD 4059')
  const [brokerName, setBrokerName] = useState('')
  const [clientName, setClientName] = useState('')
  const [notes, setNotes]           = useState('')

  const results = calculateProperty(inputs)
  const set = (k: keyof PropertyInputs) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputs(p => ({ ...p, [k]: +e.target.value }))

  return (
    <div>
      <DashboardTopbar title="Broker Client Reports" subtitle="Generate a professional property analysis report to share with clients" />
      <div style={{ padding: '28px 36px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 }}>

          {/* Left — inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1px solid rgba(26,47,26,0.1)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Report details</div>
              {[
                { label: 'Property address',       val: propName,    set: setPropName },
                { label: 'Broker / adviser name',  val: brokerName,  set: setBrokerName },
                { label: 'Client name',            val: clientName,  set: setClientName },
              ].map(f => (
                <div key={f.label} style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'rgba(26,47,26,0.45)', marginBottom: 5, display: 'block' }}>{f.label}</label>
                  <input type="text" value={f.val} onChange={e => f.set(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid rgba(26,47,26,0.15)', borderRadius: 9, fontSize: 13, color: C.forest, outline: 'none', boxSizing: 'border-box' as const }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'rgba(26,47,26,0.45)', marginBottom: 5, display: 'block' }}>Notes for client</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Any additional notes..."
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid rgba(26,47,26,0.15)', borderRadius: 9, fontSize: 13, color: C.forest, outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' as const }} />
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1px solid rgba(26,47,26,0.1)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Property inputs</div>
              {[
                { label: 'Purchase price', key: 'purchasePrice', prefix: '$', step: 10000 },
                { label: 'Weekly rent',    key: 'weeklyRent',    prefix: '$', step: 25 },
                { label: 'Interest rate',  key: 'interestRate',  suffix: '%', step: 0.25 },
                { label: 'Deposit',        key: 'depositPercent',suffix: '%', step: 5 },
                { label: 'Client income',  key: 'taxableIncome', prefix: '$', step: 5000 },
                { label: 'Hold period',    key: 'holdYears',     suffix: 'yrs', step: 1 },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'rgba(26,47,26,0.45)', marginBottom: 5, display: 'block' }}>{f.label}</label>
                  <div style={{ position: 'relative' }}>
                    {f.prefix && <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 12 }}>{f.prefix}</span>}
                    <input type="number" value={inputs[f.key as keyof PropertyInputs] as number} onChange={set(f.key as keyof PropertyInputs)} step={f.step}
                      style={{ width: '100%', padding: '8px 12px', paddingLeft: f.prefix ? 22 : 12, paddingRight: f.suffix ? 36 : 12, border: '1px solid rgba(26,47,26,0.15)', borderRadius: 9, fontFamily: 'monospace', fontSize: 13, color: C.forest, outline: 'none', boxSizing: 'border-box' as const }} />
                    {f.suffix && <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 12 }}>{f.suffix}</span>}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => window.print()}
              style={{ padding: '14px', borderRadius: 12, background: C.forest, color: C.gold, fontWeight: 800, fontSize: 14, border: 'none', cursor: 'pointer' }}>
              🖨 Print / Save as PDF
            </button>
            <p style={{ fontSize: 11, color: 'rgba(26,47,26,0.4)', textAlign: 'center', marginTop: -8 }}>
              Use browser Print → Save as PDF to download
            </p>
          </div>

          {/* Right — report preview */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid rgba(26,47,26,0.1)', overflow: 'hidden' }}>
            <div style={{ background: C.forest, padding: '28px 32px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: C.gold, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>AU · PROPERTY</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 2 }}>SmartProperty</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 16 }}>Property Investment Analysis</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.gold }}>{propName || 'Property Address'}</div>
              <div style={{ display: 'flex', gap: 24, marginTop: 8, flexWrap: 'wrap' as const }}>
                {clientName  && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Prepared for: <strong style={{ color: 'white' }}>{clientName}</strong></div>}
                {brokerName  && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Adviser: <strong style={{ color: 'white' }}>{brokerName}</strong></div>}
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Date: <strong style={{ color: 'white' }}>{new Date().toLocaleDateString('en-AU')}</strong></div>
              </div>
            </div>

            <div style={{ padding: '28px 32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
                {[
                  { label: 'After-tax /wk', value: fmtCurrency(results.weeklyAfterTaxCashFlow), color: results.weeklyAfterTaxCashFlow >= 0 ? '#16A34A' : '#EF4444' },
                  { label: 'Gross yield',   value: fmtPct(results.grossYield),                  color: C.forest },
                  { label: 'ATO refund /yr',value: fmtCurrency(results.taxRefund),               color: C.gold },
                  { label: 'LVR',           value: fmtPct(results.lvr),                          color: results.lvr > 80 ? '#F59E0B' : C.forest },
                ].map(m => (
                  <div key={m.label} style={{ background: C.cream, borderRadius: 10, padding: '14px' }}>
                    <div style={{ fontSize: 10, color: 'rgba(26,47,26,0.45)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 4 }}>{m.label}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: m.color }}>{m.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: C.forest, borderRadius: 12, padding: '18px 20px', marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 12, fontWeight: 700 }}>Annual cash flow</div>
                {[
                  { label: 'Gross rental income', value: fmtCurrency(results.grossRentalIncome),   color: '#E8B86D' },
                  { label: 'Total expenses',       value: `–${fmtCurrency(results.totalExpenses)}`, color: '#F87171' },
                  { label: 'Interest expense',     value: `–${fmtCurrency(results.interestExpense)}`, color: '#F87171' },
                  { label: 'Pre-tax cash flow',    value: fmtCurrency(results.preTaxCashFlow),      color: results.preTaxCashFlow >= 0 ? '#22C55E' : '#F87171', bold: true },
                  { label: 'ATO tax refund',       value: fmtCurrency(results.taxRefund),           color: '#E8B86D' },
                  { label: 'After-tax cash flow',  value: `${fmtCurrency(results.afterTaxCashFlow)}/yr`, color: results.afterTaxCashFlow >= 0 ? '#22C55E' : '#F87171', bold: true },
                ].map((r, i) => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: r.bold ? 600 : 400 }}>{r.label}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: r.bold ? 700 : 500, color: r.color }}>{r.value}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                {[
                  { title: 'Upfront costs', rows: [
                    { label: 'Deposit',       value: fmtCurrency(inputs.purchasePrice * inputs.depositPercent / 100) },
                    { label: 'Stamp duty',    value: fmtCurrency(inputs.stampDuty) },
                    { label: 'Total required',value: fmtCurrency(results.totalUpfront), bold: true },
                  ]},
                  { title: `CGT projection (${inputs.holdYears}yr)`, rows: [
                    { label: 'Projected value', value: fmtCurrency(results.projectedValue) },
                    { label: 'CGT payable',     value: fmtCurrency(results.cgtPayable) },
                    { label: 'Net proceeds',    value: fmtCurrency(results.netProceeds), bold: true },
                  ]},
                ].map(section => (
                  <div key={section.title} style={{ background: C.cream, borderRadius: 12, padding: '16px' }}>
                    <div style={{ fontSize: 11, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 10, fontWeight: 700 }}>{section.title}</div>
                    {section.rows.map(r => (
                      <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(26,47,26,0.06)' }}>
                        <span style={{ fontSize: 12, color: 'rgba(26,47,26,0.55)' }}>{r.label}</span>
                        <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: r.bold ? 700 : 500, color: C.forest }}>{r.value}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {notes && (
                <div style={{ background: 'rgba(201,150,58,0.08)', borderRadius: 10, padding: '14px 16px', marginBottom: 16, border: '1px solid rgba(201,150,58,0.2)' }}>
                  <div style={{ fontSize: 10, color: C.gold, textTransform: 'uppercase' as const, letterSpacing: '0.08em', fontWeight: 700, marginBottom: 6 }}>Adviser notes</div>
                  <p style={{ fontSize: 13, color: C.forest, lineHeight: 1.6, margin: 0 }}>{notes}</p>
                </div>
              )}

              <p style={{ fontSize: 10, color: 'rgba(26,47,26,0.35)', lineHeight: 1.6, borderTop: '1px solid rgba(26,47,26,0.08)', paddingTop: 12, margin: 0 }}>
                General information only — not financial product advice. Tax calculations use ATO 2024-25 rates and are estimates only. Always consult a licensed financial adviser and registered tax agent.
              </p>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media print { nav, header { display: none !important; } }`}</style>
    </div>
  )
}
