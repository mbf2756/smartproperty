'use client'
import { useState, useMemo } from 'react'
import { DashboardTopbar } from '@/components/DashboardTopbar'
import { calculateProperty, fmtCurrency, fmtPct, DEFAULT_INPUTS } from '@/lib/calculations'
import { scoreProperty } from '@/lib/scoring'
import { LockedPage } from '@/components/PaywallOverlay'
import { useTier } from '@/hooks/useTier'
import type { PropertyInputs } from '@/types'

const C = { forest: '#1A2F1A', gold: '#C9963A', cream: '#F7F4EE', cream2: '#EDE8DF' }

function ScoreRing({ score, color, size = 120 }: { score: number; color: string; size?: number }) {
  const r = (size / 2) - 10
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(26,47,26,0.1)" strokeWidth={8} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={8}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dasharray 1s ease' }} />
      <text x={size/2} y={size/2 - 6} textAnchor="middle" fill={color}
        fontSize={size === 160 ? 36 : 24} fontWeight={700} fontFamily="monospace">
        {score}
      </text>
      <text x={size/2} y={size/2 + 14} textAnchor="middle" fill="rgba(26,47,26,0.4)"
        fontSize={10} fontWeight={600} fontFamily="sans-serif">
        OUT OF 100
      </text>
    </svg>
  )
}

function ComponentBar({ label, score, weight, detail }: { label: string; score: number; weight: number; detail: string }) {
  const color = score >= 75 ? '#16A34A' : score >= 50 ? '#C9963A' : '#EF4444'
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.forest }}>{label}</span>
          <span style={{ fontSize: 11, color: 'rgba(26,47,26,0.45)', marginLeft: 8 }}>{detail}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'rgba(26,47,26,0.4)' }}>weight {weight}%</span>
          <span style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color, minWidth: 28, textAlign: 'right' }}>{score}</span>
        </div>
      </div>
      <div style={{ height: 6, background: 'rgba(26,47,26,0.08)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 3, transition: 'width 0.8s ease' }} />
      </div>
    </div>
  )
}

export default function ScorePage() {
  const { isPaid, checked } = useTier()
  const [inputs, setInputs] = useState<PropertyInputs>({ ...DEFAULT_INPUTS })
  const [address, setAddress] = useState('42 Kelvin Grove Rd, QLD 4059')

  const results = useMemo(() => calculateProperty(inputs), [inputs])
  const score   = useMemo(() => scoreProperty(inputs, results), [inputs, results])

  const set = (k: keyof PropertyInputs) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setInputs(p => ({ ...p, [k]: isNaN(+e.target.value) ? e.target.value : +e.target.value }))

  if (checked && !isPaid) {
    return (
      <div>
        <DashboardTopbar title="Property Investment Score" subtitle="Investor plan required" />
        <LockedPage title="Property Investment Score" icon="🏆"
          description="Get a 0-100 investment score for any Australian residential property — with breakdown across 7 factors: yield, cash flow, LVR risk, holding cost, growth potential, vacancy risk and equity growth. Includes strengths, risks and recommendations." plan="investor" />
      </div>
    )
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '9px 12px', border: '1px solid rgba(26,47,26,0.15)', borderRadius: 9, fontFamily: 'monospace', fontSize: 13, color: C.forest, outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(26,47,26,0.45)', marginBottom: 5, display: 'block' }

  return (
    <div>
      <DashboardTopbar title="Property Investment Score" subtitle="0–100 investment quality rating across 7 factors" />
      <div style={{ padding: '24px 36px' }}>

        {/* Hero score banner */}
        <div style={{ background: C.forest, borderRadius: 20, padding: '28px 36px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 40 }}>
          <ScoreRing score={score.overall} color={score.color} size={160} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: score.color, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
              Investment Score
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: 'white', letterSpacing: '-0.03em', marginBottom: 4 }}>
              {score.overall}/100 — <span style={{ color: score.color }}>{score.label}</span>
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>{address || 'Property address'}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {score.strengths.slice(0, 3).map(s => (
                <div key={s} style={{ padding: '5px 12px', background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.3)', borderRadius: 20, fontSize: 12, color: '#86EFAC' }}>
                  ✓ {s}
                </div>
              ))}
              {score.risks.slice(0, 2).map(r => (
                <div key={r} style={{ padding: '5px 12px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 20, fontSize: 12, color: '#FCA5A5' }}>
                  ⚠ {r}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20 }}>

          {/* Inputs */}
          <div>
            <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1px solid rgba(26,47,26,0.1)', marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Property details</div>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Property address</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="42 Smith St, Brisbane QLD" style={{ ...inputStyle, fontFamily: 'inherit' }} />
              </div>
              {[
                { label: 'Purchase price', key: 'purchasePrice', prefix: '$', step: 5000 },
                { label: 'Deposit', key: 'depositPercent', suffix: '%', step: 5 },
                { label: 'Weekly rent', key: 'weeklyRent', prefix: '$', step: 25 },
                { label: 'Interest rate', key: 'interestRate', suffix: '%', step: 0.25 },
                { label: 'Your income', key: 'taxableIncome', prefix: '$', step: 5000 },
                { label: 'Vacancy rate', key: 'vacancyRate', suffix: '%', step: 1 },
                { label: 'Growth rate', key: 'capitalGrowthRate', suffix: '%', step: 0.5 },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 10 }}>
                  <label style={labelStyle}>{f.label}</label>
                  <div style={{ position: 'relative' }}>
                    {f.prefix && <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 12 }}>{f.prefix}</span>}
                    <input type="number" value={inputs[f.key as keyof PropertyInputs] as number} onChange={set(f.key as keyof PropertyInputs)} step={f.step}
                      style={{ ...inputStyle, paddingLeft: f.prefix ? 22 : 12, paddingRight: f.suffix ? 28 : 12 }} />
                    {f.suffix && <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,47,26,0.4)', fontSize: 12 }}>{f.suffix}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick stats */}
            <div style={{ background: 'white', borderRadius: 16, padding: '16px 20px', border: '1px solid rgba(26,47,26,0.1)' }}>
              {[
                { label: 'After-tax /wk', value: fmtCurrency(results.weeklyAfterTaxCashFlow), color: results.weeklyAfterTaxCashFlow >= 0 ? '#16A34A' : '#EF4444' },
                { label: 'Gross yield', value: fmtPct(results.grossYield), color: C.forest },
                { label: 'ATO refund /yr', value: fmtCurrency(results.taxRefund), color: C.gold },
                { label: 'LVR', value: fmtPct(results.lvr), color: results.lvr > 80 ? '#F59E0B' : C.forest },
              ].map((m, i) => (
                <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 3 ? '1px solid rgba(26,47,26,0.05)' : 'none' }}>
                  <span style={{ fontSize: 12, color: 'rgba(26,47,26,0.5)' }}>{m.label}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: m.color }}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Score breakdown */}
          <div>
            {/* Score components */}
            <div style={{ background: 'white', borderRadius: 16, padding: '24px', border: '1px solid rgba(26,47,26,0.1)', marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18 }}>Score breakdown</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
                {Object.entries(score.components).map(([key, comp]) => (
                  <ComponentBar key={key}
                    label={key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                    score={comp.score} weight={comp.weight} detail={comp.label} />
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              {/* Strengths */}
              <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1px solid rgba(22,163,74,0.2)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>✓ Strengths</div>
                {score.strengths.length > 0
                  ? score.strengths.map(s => (
                    <div key={s} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                      <span style={{ color: '#16A34A', flexShrink: 0, marginTop: 1 }}>✓</span>
                      <span style={{ fontSize: 13, color: C.forest, lineHeight: 1.4 }}>{s}</span>
                    </div>
                  ))
                  : <div style={{ fontSize: 13, color: 'rgba(26,47,26,0.45)' }}>No significant strengths identified at these inputs.</div>
                }
              </div>

              {/* Risks */}
              <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1px solid rgba(239,68,68,0.2)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>⚠ Risks</div>
                {score.risks.length > 0
                  ? score.risks.map(r => (
                    <div key={r} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                      <span style={{ color: '#EF4444', flexShrink: 0, marginTop: 1 }}>⚠</span>
                      <span style={{ fontSize: 13, color: C.forest, lineHeight: 1.4 }}>{r}</span>
                    </div>
                  ))
                  : <div style={{ fontSize: 13, color: 'rgba(26,47,26,0.45)' }}>No major risks identified at these inputs.</div>
                }
              </div>
            </div>

            {/* Recommendations */}
            <div style={{ background: C.forest, borderRadius: 16, padding: '20px 24px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>💡 Recommendations</div>
              {score.recommendations.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(201,150,58,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 10, fontWeight: 700, color: C.gold, marginTop: 1 }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{r}</span>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 11, color: 'rgba(26,47,26,0.35)', textAlign: 'center', marginTop: 14 }}>
              Investment scores are indicative only. Not financial advice. Growth rate is user-estimated — verify against recent suburb data.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
