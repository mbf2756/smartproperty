'use client'
import { useState } from 'react'
import { DashboardTopbar } from '@/components/DashboardTopbar'
import { fmtCurrency, fmtPct } from '@/lib/calculations'
import { LockedPage } from '@/components/PaywallOverlay'
import { useTier } from '@/hooks/useTier'

const C = { forest: '#1A2F1A', gold: '#C9963A', cream: '#F7F4EE', cream2: '#EDE8DF' }

interface Client {
  id: string
  name: string
  email: string
  phone: string
  income: number
  notes: string
  properties: {
    address: string
    value: number
    loanBalance: number
    weeklyRent: number
    interestRate: number
    nextReview: string
  }[]
  createdAt: string
}

const SAMPLE_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Alex & Sarah Thompson',
    email: 'alex.thompson@email.com',
    phone: '0412 345 678',
    income: 185000,
    notes: 'Looking to buy 2nd IP in 2025. Pre-approval up to $750k. Prefer Brisbane north side.',
    properties: [
      { address: '42 Kelvin Grove Rd, QLD 4059', value: 820000, loanBalance: 580000, weeklyRent: 650, interestRate: 6.2, nextReview: '2025-07-15' },
    ],
    createdAt: '2024-03-15',
  },
  {
    id: '2',
    name: 'Marcus Chen',
    email: 'marcus.chen@email.com',
    phone: '0423 456 789',
    income: 142000,
    notes: 'Fixed rate expires Aug 2025. Rate currently 5.2%. Will need to refi.',
    properties: [
      { address: '7/85 Brunswick St, QLD 4005', value: 680000, loanBalance: 520000, weeklyRent: 540, interestRate: 5.2, nextReview: '2025-08-01' },
      { address: '19 Kittyhawk Dr, QLD 4032', value: 760000, loanBalance: 610000, weeklyRent: 600, interestRate: 6.4, nextReview: '2025-09-30' },
    ],
    createdAt: '2024-01-22',
  },
  {
    id: '3',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '0434 567 890',
    income: 98000,
    notes: 'First IP purchase. Deposit ready $160k. Looking at Chermside/Aspley area.',
    properties: [],
    createdAt: '2024-11-10',
  },
]

export default function ClientsPage() {
  const { isBroker, checked } = useTier()
  const [clients, setClients] = useState<Client[]>(SAMPLE_CLIENTS)
  const [selected, setSelected] = useState<Client | null>(SAMPLE_CLIENTS[0])
  const [showAdd, setShowAdd]   = useState(false)
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', income: 0, notes: '' })

  function addClient() {
    if (!newClient.name) return
    const c: Client = { ...newClient, id: Date.now().toString(), properties: [], createdAt: new Date().toISOString().split('T')[0] }
    setClients(p => [c, ...p])
    setSelected(c)
    setShowAdd(false)
    setNewClient({ name: '', email: '', phone: '', income: 0, notes: '' })
  }

  if (checked && !isBroker) {
    return (
      <div>
        <DashboardTopbar title="Client CRM" subtitle="Broker plan required" />
        <LockedPage title="Client CRM Lite" icon="👥"
          description="Store client details, properties, loan information and notes. Revisit annually for refinance conversations. Generate annual review reports for each client. Broker plan required." plan="broker" />
      </div>
    )
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 12px', border: '1px solid rgba(26,47,26,0.15)', borderRadius: 9, fontFamily: 'inherit', fontSize: 13, color: C.forest, outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(26,47,26,0.45)', marginBottom: 4, display: 'block' }

  // Alert: upcoming reviews within 90 days
  const today = new Date()
  const alerts = clients.flatMap(c =>
    c.properties.filter(p => {
      const d = new Date(p.nextReview)
      const diff = (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      return diff >= 0 && diff <= 90
    }).map(p => ({ client: c.name, address: p.address, date: p.nextReview, rate: p.interestRate }))
  )

  return (
    <div>
      <DashboardTopbar title="Client CRM" subtitle={`${clients.length} clients · ${alerts.length} upcoming reviews`} />
      <div style={{ padding: '20px 28px' }}>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 12, padding: '12px 16px', marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>⏰ Upcoming reviews (next 90 days)</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {alerts.map((a, i) => (
                <div key={i} style={{ padding: '6px 12px', background: 'rgba(245,158,11,0.1)', borderRadius: 8, fontSize: 12, color: '#92400E' }}>
                  <strong>{a.client}</strong> · {a.address.split(',')[0]} · {a.date} · {a.rate}% rate
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16 }}>

          {/* Client list */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Clients</div>
              <button onClick={() => setShowAdd(true)}
                style={{ padding: '5px 12px', background: C.forest, color: C.gold, border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                + Add
              </button>
            </div>

            {showAdd && (
              <div style={{ background: 'white', borderRadius: 12, padding: '14px', border: '1px solid rgba(26,47,26,0.15)', marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.forest, marginBottom: 10 }}>New client</div>
                {[
                  { label: 'Full name', key: 'name', type: 'text' },
                  { label: 'Email', key: 'email', type: 'email' },
                  { label: 'Phone', key: 'phone', type: 'text' },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 8 }}>
                    <label style={labelStyle}>{f.label}</label>
                    <input type={f.type} value={newClient[f.key as keyof typeof newClient] as string}
                      onChange={e => setNewClient(p => ({ ...p, [f.key]: e.target.value }))}
                      style={inputStyle} />
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={addClient} style={{ flex: 1, padding: '7px', background: C.forest, color: C.gold, border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Save</button>
                  <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: '7px', background: C.cream2, color: C.forest, border: 'none', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {clients.map(c => (
                <button key={c.id} onClick={() => setSelected(c)}
                  style={{ padding: '10px 12px', background: selected?.id === c.id ? C.forest : 'white', border: `1px solid ${selected?.id === c.id ? 'transparent' : 'rgba(26,47,26,0.1)'}`, borderRadius: 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: selected?.id === c.id ? C.gold : C.forest }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: selected?.id === c.id ? 'rgba(255,255,255,0.45)' : 'rgba(26,47,26,0.45)', marginTop: 2 }}>
                    {c.properties.length} {c.properties.length === 1 ? 'property' : 'properties'} · {fmtCurrency(c.income)}/yr
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Client detail */}
          {selected && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Client header */}
              <div style={{ background: C.forest, borderRadius: 16, padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontFamily: 'monospace', fontSize: 10, color: C.gold, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Client profile</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 4 }}>{selected.name}</div>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>📧 {selected.email}</span>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>📱 {selected.phone}</span>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>💰 {fmtCurrency(selected.income)}/yr income</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <a href={`/broker-report`} style={{ padding: '8px 14px', background: C.gold, color: C.forest, borderRadius: 9, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                      Generate report →
                    </a>
                  </div>
                </div>
                {selected.notes && (
                  <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(255,255,255,0.07)', borderRadius: 10, fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
                    📝 {selected.notes}
                  </div>
                )}
              </div>

              {/* Properties */}
              {selected.properties.length > 0 ? (
                <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1px solid rgba(26,47,26,0.1)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Properties</div>
                  {selected.properties.map((p, i) => {
                    const equity = p.value - p.loanBalance
                    const lvr    = (p.loanBalance / p.value) * 100
                    const yield_ = (p.weeklyRent * 52 * 0.96 / p.value) * 100
                    const daysToReview = Math.round((new Date(p.nextReview).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                    return (
                      <div key={i} style={{ padding: '14px 0', borderBottom: i < selected.properties.length - 1 ? '1px solid rgba(26,47,26,0.06)' : 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: C.forest }}>{p.address}</div>
                            <div style={{ fontSize: 12, color: 'rgba(26,47,26,0.45)', marginTop: 2 }}>
                              Next review: {p.nextReview}
                              {daysToReview <= 90 && (
                                <span style={{ marginLeft: 8, padding: '2px 8px', background: 'rgba(245,158,11,0.12)', color: '#D97706', borderRadius: 20, fontSize: 10, fontWeight: 700 }}>
                                  {daysToReview} days
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                          {[
                            { label: 'Value', value: fmtCurrency(p.value), color: C.forest },
                            { label: 'Loan', value: fmtCurrency(p.loanBalance), color: 'rgba(26,47,26,0.7)' },
                            { label: 'Equity', value: fmtCurrency(equity), color: C.gold },
                            { label: 'LVR', value: fmtPct(lvr), color: lvr > 80 ? '#D97706' : C.forest },
                            { label: 'Rate', value: `${p.interestRate}%`, color: C.forest },
                          ].map(m => (
                            <div key={m.label} style={{ background: C.cream, borderRadius: 8, padding: '8px 10px' }}>
                              <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(26,47,26,0.4)', marginBottom: 2 }}>{m.label}</div>
                              <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: m.color }}>{m.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div style={{ background: 'white', borderRadius: 16, padding: '32px', border: '2px dashed rgba(26,47,26,0.12)', textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>🏠</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(26,47,26,0.5)', marginBottom: 6 }}>No properties yet</div>
                  <div style={{ fontSize: 12, color: 'rgba(26,47,26,0.4)' }}>Use the Property Analyser to model a property, then add it here.</div>
                </div>
              )}

              {/* Portfolio summary */}
              {selected.properties.length > 1 && (
                <div style={{ background: C.cream2, borderRadius: 14, padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 10, color: 'rgba(26,47,26,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Total portfolio value</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: C.forest }}>{fmtCurrency(selected.properties.reduce((s, p) => s + p.value, 0))}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: 'rgba(26,47,26,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Total equity</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: C.gold }}>{fmtCurrency(selected.properties.reduce((s, p) => s + p.value - p.loanBalance, 0))}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: 'rgba(26,47,26,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Total weekly rent</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: '#16A34A' }}>{fmtCurrency(selected.properties.reduce((s, p) => s + p.weeklyRent, 0))}/wk</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
