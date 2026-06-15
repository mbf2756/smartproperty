'use client'
import { useState } from 'react'
import { DashboardTopbar } from '@/components/DashboardTopbar'

export default function SettingsPage() {
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [saved, setSaved]       = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  async function openBillingPortal() {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert(data.error || 'Could not open billing portal.')
    } catch {
      alert('Could not open billing portal.')
    }
    setPortalLoading(false)
  }

  const S = {
    card: { background: 'white', borderRadius: 16, padding: '28px', border: '1px solid rgba(15,30,60,0.1)', marginBottom: 16 } as React.CSSProperties,
    label: { display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'rgba(15,30,60,0.5)', marginBottom: 6 },
    input: { width: '100%', padding: '10px 14px', border: '1px solid rgba(15,30,60,0.12)', borderRadius: 10, fontFamily: 'monospace', fontSize: 14, color: '#0F1E3C', outline: 'none', boxSizing: 'border-box' as const },
    sectionLabel: { fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'rgba(15,30,60,0.4)', marginBottom: 18 },
  }

  return (
    <div>
      <DashboardTopbar title="Settings" subtitle="Account and subscription management" />

      <div style={{ padding: '32px 40px', maxWidth: 680 }}>

        {/* Profile */}
        <div style={S.card}>
          <div style={S.sectionLabel}>Profile</div>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={S.label}>Full name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Alex Smith" style={S.input} />
              </div>
              <div>
                <label style={S.label}>Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={S.input} />
              </div>
            </div>
            <div>
              <label style={S.label}>Role</label>
              <select style={{ ...S.input, background: 'white' }}>
                <option>Property investor</option>
                <option>Mortgage broker</option>
                <option>Buyer&apos;s agent</option>
                <option>Accountant / tax agent</option>
                <option>Financial adviser</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button type="submit"
                style={{ padding: '9px 20px', borderRadius: 10, background: '#0F1E3C', color: '#00D4AA', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}>
                Save changes
              </button>
              {saved && <span style={{ fontSize: 12, color: '#00A888', fontWeight: 600 }}>✓ Saved</span>}
            </div>
          </form>
        </div>

        {/* Password */}
        <div style={S.card}>
          <div style={S.sectionLabel}>Password</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={S.label}>Current password</label>
              <input type="password" placeholder="••••••••" style={S.input} />
            </div>
            <div>
              <label style={S.label}>New password</label>
              <input type="password" placeholder="Min. 8 characters" style={S.input} />
            </div>
          </div>
          <button style={{ padding: '9px 20px', borderRadius: 10, background: '#F5F4F0', color: '#0F1E3C', fontWeight: 700, fontSize: 13, border: '1px solid rgba(15,30,60,0.12)', cursor: 'pointer' }}>
            Update password
          </button>
        </div>

        {/* Subscription */}
        <div style={S.card}>
          <div style={S.sectionLabel}>Subscription</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#F5F4F0', borderRadius: 12, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F1E3C' }}>Free plan</div>
              <div style={{ fontSize: 12, color: 'rgba(15,30,60,0.5)', marginTop: 2 }}>3 tools included · Upgrade to unlock all features</div>
            </div>
            <a href="/pricing" style={{ padding: '8px 16px', background: '#00D4AA', borderRadius: 10, fontSize: 13, fontWeight: 800, color: '#0F1E3C', textDecoration: 'none' }}>
              Upgrade →
            </a>
          </div>
          <button onClick={openBillingPortal} disabled={portalLoading}
            style={{ padding: '9px 20px', borderRadius: 10, background: '#F5F4F0', color: '#0F1E3C', fontWeight: 600, fontSize: 13, border: '1px solid rgba(15,30,60,0.12)', cursor: portalLoading ? 'not-allowed' : 'pointer', opacity: portalLoading ? 0.6 : 1 }}>
            {portalLoading ? 'Opening…' : 'Manage billing & invoices →'}
          </button>
        </div>

        {/* Smart Suite */}
        <div style={{ ...S.card, background: '#0F1E3C' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#00D4AA', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>Smart Suite</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 6 }}>One login. Three platforms.</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 16 }}>
            Your SmartProperty account works across SmartETF and SmartSuper. Bundle all three and save 20%.
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {['SmartETF', 'SmartSuper'].map(name => (
              <a key={name} href="#" style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
                Go to {name} ↗
              </a>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div style={{ ...S.card, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.03)' }}>
          <div style={{ ...S.sectionLabel, color: '#B91C1C' }}>Account</div>
          <div style={{ fontSize: 13, color: 'rgba(15,30,60,0.5)', marginBottom: 12, lineHeight: 1.5 }}>
            Deleting your account is permanent and removes all saved properties and calculations.
          </div>
          <button style={{ padding: '8px 16px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', color: '#B91C1C', fontWeight: 600, fontSize: 12, border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer' }}>
            Delete account
          </button>
        </div>
      </div>
    </div>
  )
}
