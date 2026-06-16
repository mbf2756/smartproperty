'use client'
import { useState, useMemo } from 'react'
import { DashboardTopbar } from '@/components/DashboardTopbar'
import { fmtCurrency, fmtPct } from '@/lib/calculations'
import { LockedPage } from '@/components/PaywallOverlay'
import { useTier } from '@/hooks/useTier'

const C = { forest: '#1A2F1A', gold: '#C9963A', cream: '#F7F4EE', cream2: '#EDE8DF' }

interface ClientLoan {
  id: string
  clientName: string
  propertyAddress: string
  loanBalance: number
  currentRate: number
  loanType: 'IO' | 'PI' | 'Fixed'
  fixedExpiry?: string        // date fixed rate expires
  originalLoanAmount: number
  propertyValue: number
  yearsRemaining: number
}

const SAMPLE_LOANS: ClientLoan[] = [
  { id: '1', clientName: 'Alex Thompson',  propertyAddress: '42 Kelvin Grove Rd',   loanBalance: 580000, currentRate: 7.2,  loanType: 'Fixed', fixedExpiry: '2025-08-15', originalLoanAmount: 640000, propertyValue: 820000, yearsRemaining: 27 },
  { id: '2', clientName: 'Marcus Chen',    propertyAddress: '7/85 Brunswick St',    loanBalance: 520000, currentRate: 6.9,  loanType: 'IO',    originalLoanAmount: 560000, propertyValue: 680000, yearsRemaining: 24 },
  { id: '3', clientName: 'Marcus Chen',    propertyAddress: '19 Kittyhawk Dr',      loanBalance: 610000, currentRate: 6.4,  loanType: 'PI',    originalLoanAmount: 650000, propertyValue: 760000, yearsRemaining: 28 },
  { id: '4', clientName: 'Priya Sharma',   propertyAddress: '33 Ashgrove Ave',      loanBalance: 480000, currentRate: 7.45, loanType: 'Fixed', fixedExpiry: '2025-06-30', originalLoanAmount: 500000, propertyValue: 620000, yearsRemaining: 26 },
  { id: '5', clientName: 'David Wu',       propertyAddress: '12 Paddington St',     loanBalance: 720000, currentRate: 6.2,  loanType: 'PI',    originalLoanAmount: 750000, propertyValue: 1050000, yearsRemaining: 25 },
  { id: '6', clientName: 'Sandra Mills',   propertyAddress: '5/20 New Farm Rd',     loanBalance: 390000, currentRate: 7.1,  loanType: 'IO',    originalLoanAmount: 420000, propertyValue: 550000, yearsRemaining: 22 },
]

const MARKET_RATE = 6.09  // current competitive rate

function getOpportunities(loan: ClientLoan) {
  const ops: { type: string; priority: 'high' | 'medium' | 'low'; saving?: number; detail: string }[] = []
  const lvr = (loan.loanBalance / loan.propertyValue) * 100
  const rateDiff = loan.currentRate - MARKET_RATE
  const annualSaving = loan.loanBalance * (rateDiff / 100)

  // High rate
  if (rateDiff >= 0.75) ops.push({ type: 'High rate', priority: 'high', saving: annualSaving, detail: `${loan.currentRate}% vs market ${MARKET_RATE}% — save ${fmtCurrency(annualSaving)}/yr` })
  else if (rateDiff >= 0.4) ops.push({ type: 'Above-market rate', priority: 'medium', saving: annualSaving, detail: `${loan.currentRate}% is ${rateDiff.toFixed(2)}% above current market rates` })

  // Expiring fixed
  if (loan.fixedExpiry) {
    const daysToExpiry = Math.round((new Date(loan.fixedExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (daysToExpiry <= 90)  ops.push({ type: 'Fixed rate expiring', priority: 'high', detail: `Fixed rate expires ${loan.fixedExpiry} (${daysToExpiry} days) — will revert to SVR` })
    else if (daysToExpiry <= 180) ops.push({ type: 'Fixed rate expiring soon', priority: 'medium', detail: `Fixed rate expires ${loan.fixedExpiry} — start conversations now` })
  }

  // High LVR opportunity (may have improved)
  if (lvr < 70 && loan.originalLoanAmount / loan.propertyValue > 0.8) {
    ops.push({ type: 'LVR improved', priority: 'medium', detail: `LVR now ${fmtPct(lvr)} — may qualify for better rate tier or remove LMI` })
  }

  // High LVR risk
  if (lvr > 80) ops.push({ type: 'High LVR', priority: 'medium', detail: `LVR ${fmtPct(lvr)} — limited refinancing options, may need equity injection` })

  // IO reset risk
  if (loan.loanType === 'IO' && loan.yearsRemaining < 25) {
    ops.push({ type: 'IO period watch', priority: 'low', detail: 'Interest-only period may expire — check IO term and plan P&I transition' })
  }

  return ops
}

export default function RefinancePage() {
  const { isBroker, checked } = useTier()
  const [loans, setLoans]         = useState<ClientLoan[]>(SAMPLE_LOANS)
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium'>('all')
  const [newLoan, setNewLoan]     = useState<Partial<ClientLoan>>({})
  const [showAdd, setShowAdd]     = useState(false)

  const loansWithOps = useMemo(() =>
    loans.map(l => ({ ...l, opportunities: getOpportunities(l) }))
      .filter(l => {
        if (filterPriority === 'all') return true
        return l.opportunities.some(o => o.priority === filterPriority)
      })
      .sort((a, b) => {
        const priorityScore = (ops: ReturnType<typeof getOpportunities>) =>
          ops.filter(o => o.priority === 'high').length * 3 + ops.filter(o => o.priority === 'medium').length
        return priorityScore(b.opportunities) - priorityScore(a.opportunities)
      }),
    [loans, filterPriority]
  )

  const totalHighPriority = loans.reduce((s, l) => s + getOpportunities(l).filter(o => o.priority === 'high').length, 0)
  const totalPotentialSaving = loans.reduce((s, l) => {
    const ops = getOpportunities(l)
    return s + ops.reduce((ss, o) => ss + (o.saving ?? 0), 0)
  }, 0)

  if (checked && !isBroker) {
    return (
      <div>
        <DashboardTopbar title="Refinance Engine" subtitle="Broker plan required" />
        <LockedPage title="Refinance Opportunity Engine" icon="🔍"
          description="Automatically identify refinancing opportunities across your entire client portfolio. High rates, expiring fixed loans, improved LVR positions and IO reset risks — all surfaced in one dashboard. Becomes a powerful lead generation and retention tool." plan="broker" />
      </div>
    )
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 12px', border: '1px solid rgba(26,47,26,0.15)', borderRadius: 9, fontFamily: 'monospace', fontSize: 13, color: C.forest, outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(26,47,26,0.45)', marginBottom: 4, display: 'block' }

  return (
    <div>
      <DashboardTopbar title="Refinance Opportunity Engine" subtitle={`${totalHighPriority} high-priority leads · ${fmtCurrency(totalPotentialSaving)}/yr potential saving`} />
      <div style={{ padding: '20px 28px' }}>

        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Total clients', value: `${[...new Set(loans.map(l => l.clientName))].length}`, sub: `${loans.length} loans tracked`, color: C.forest },
            { label: 'High priority leads', value: `${totalHighPriority}`, sub: 'Action now', color: '#EF4444' },
            { label: 'Potential saving', value: fmtCurrency(totalPotentialSaving), sub: 'across portfolio /yr', color: '#16A34A' },
            { label: 'Expiring fixed', value: `${loans.filter(l => l.fixedExpiry).length}`, sub: 'within 6 months', color: '#F59E0B' },
          ].map(m => (
            <div key={m.label} style={{ background: 'white', borderRadius: 14, padding: '16px', border: '1px solid rgba(26,47,26,0.1)' }}>
              <div style={{ fontSize: 10, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 700, color: m.color }}>{m.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(26,47,26,0.45)', marginTop: 2 }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Filter + Add */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { key: 'all', label: 'All loans' },
              { key: 'high', label: '🔴 High priority' },
              { key: 'medium', label: '🟡 Medium priority' },
            ].map(f => (
              <button key={f.key} onClick={() => setFilterPriority(f.key as typeof filterPriority)}
                style={{ padding: '7px 14px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
                  background: filterPriority === f.key ? C.forest : 'white',
                  color: filterPriority === f.key ? C.gold : C.forest,
                  boxShadow: filterPriority === f.key ? 'none' : '0 1px 3px rgba(0,0,0,0.07)' }}>
                {f.label}
              </button>
            ))}
          </div>
          <button onClick={() => setShowAdd(true)}
            style={{ padding: '8px 16px', background: C.forest, color: C.gold, border: 'none', borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            + Add loan
          </button>
        </div>

        {/* Loan cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {loansWithOps.map(loan => {
            const highOps   = loan.opportunities.filter(o => o.priority === 'high')
            const medOps    = loan.opportunities.filter(o => o.priority === 'medium')
            const lowOps    = loan.opportunities.filter(o => o.priority === 'low')
            const lvr       = (loan.loanBalance / loan.propertyValue) * 100
            const urgency   = highOps.length > 0 ? 'high' : medOps.length > 0 ? 'medium' : 'low'
            const borderColor = urgency === 'high' ? 'rgba(239,68,68,0.3)' : urgency === 'medium' ? 'rgba(245,158,11,0.3)' : 'rgba(26,47,26,0.1)'

            return (
              <div key={loan.id} style={{ background: 'white', borderRadius: 14, padding: '16px 20px', border: `1px solid ${borderColor}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.forest }}>{loan.clientName}</div>
                      {highOps.length > 0 && <span style={{ padding: '2px 8px', background: 'rgba(239,68,68,0.1)', color: '#DC2626', borderRadius: 20, fontSize: 10, fontWeight: 700 }}>🔴 {highOps.length} URGENT</span>}
                      {highOps.length === 0 && medOps.length > 0 && <span style={{ padding: '2px 8px', background: 'rgba(245,158,11,0.1)', color: '#D97706', borderRadius: 20, fontSize: 10, fontWeight: 700 }}>🟡 {medOps.length} REVIEW</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(26,47,26,0.5)' }}>{loan.propertyAddress} · {loan.loanType} loan</div>
                  </div>
                  <button style={{ padding: '7px 14px', background: urgency === 'high' ? '#EF4444' : C.forest, color: 'white', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                    Contact client →
                  </button>
                </div>

                {/* Loan stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 12 }}>
                  {[
                    { label: 'Loan balance', value: fmtCurrency(loan.loanBalance), color: C.forest },
                    { label: 'Current rate', value: `${loan.currentRate}%`, color: loan.currentRate - MARKET_RATE >= 0.75 ? '#EF4444' : loan.currentRate - MARKET_RATE >= 0.4 ? '#D97706' : '#16A34A' },
                    { label: 'Property value', value: fmtCurrency(loan.propertyValue), color: C.forest },
                    { label: 'LVR', value: fmtPct(lvr), color: lvr > 80 ? '#D97706' : '#16A34A' },
                    { label: loan.fixedExpiry ? 'Fixed expiry' : 'Loan type', value: loan.fixedExpiry ?? loan.loanType, color: loan.fixedExpiry ? '#D97706' : C.forest },
                  ].map(s => (
                    <div key={s.label} style={{ background: C.cream, borderRadius: 8, padding: '8px 10px' }}>
                      <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(26,47,26,0.4)', marginBottom: 2 }}>{s.label}</div>
                      <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: s.color }}>{s.value}</div>
                    </div>
                  ))}
                </div>

                {/* Opportunities */}
                {loan.opportunities.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {loan.opportunities.map((op, i) => (
                      <div key={i} style={{
                        padding: '6px 12px', borderRadius: 8, fontSize: 12, lineHeight: 1.4,
                        background: op.priority === 'high' ? 'rgba(239,68,68,0.08)' : op.priority === 'medium' ? 'rgba(245,158,11,0.08)' : 'rgba(26,47,26,0.04)',
                        border: `1px solid ${op.priority === 'high' ? 'rgba(239,68,68,0.2)' : op.priority === 'medium' ? 'rgba(245,158,11,0.2)' : 'rgba(26,47,26,0.1)'}`,
                        color: op.priority === 'high' ? '#DC2626' : op.priority === 'medium' ? '#D97706' : 'rgba(26,47,26,0.6)',
                      }}>
                        <strong>{op.type}</strong>{op.detail ? ` — ${op.detail}` : ''}
                      </div>
                    ))}
                  </div>
                )}

                {loan.opportunities.length === 0 && (
                  <div style={{ fontSize: 12, color: '#16A34A' }}>✓ No immediate refinance opportunities identified</div>
                )}
              </div>
            )
          })}
        </div>

        {/* Market rate reference */}
        <div style={{ background: C.forest, borderRadius: 14, padding: '16px 20px', marginTop: 16, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Current benchmark rate</div>
            <div style={{ fontFamily: 'monospace', fontSize: 24, fontWeight: 700, color: C.gold }}>{MARKET_RATE}%</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Best available investment loan rate (indicative)</div>
          </div>
          <div style={{ flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
            Loans more than 0.75% above this rate are flagged as high priority. Loans 0.4-0.75% above are medium priority.
            Update the benchmark rate as market conditions change.
          </div>
        </div>

        <p style={{ fontSize: 11, color: 'rgba(26,47,26,0.35)', textAlign: 'center', marginTop: 14 }}>
          Educational tool only. Not a credit recommendation. Always assess individual client circumstances before recommending refinancing.
        </p>
      </div>
    </div>
  )
}
