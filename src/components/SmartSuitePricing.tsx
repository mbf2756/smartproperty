'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// ─── Types ────────────────────────────────────────────────────────────────────
type App = 'smartsuper' | 'smartetf' | 'smartproperty'

interface Props {
  currentApp: App
  // Theme colours passed in from each app
  primaryColor: string    // e.g. '#0F1E3C' (SmartSuper), '#1A2F1A' (SmartProperty)
  accentColor: string     // e.g. '#00D4AA', '#C9963A'
  bgColor: string         // e.g. '#F5F4F0', '#F7F4EE'
}

const APP_LABELS: Record<App, string> = {
  smartsuper:    'SmartSuper',
  smartetf:      'SmartETF',
  smartproperty: 'SmartProperty',
}

const APP_DESCS: Record<App, string> = {
  smartsuper:    'Superannuation optimisation platform',
  smartetf:      'ASX ETF portfolio analyser',
  smartproperty: 'Property investment modelling',
}

// Bundle definitions (mirrors stripe-bundles.ts)
const BUNDLES = [
  // ── Single ──────────────────────────────────────────────────────────────────
  {
    id: 'single_smartsuper',
    apps: ['smartsuper'] as App[],
    label: 'SmartSuper',
    price: 150,
    saving: null as number | null,
    tier: 'single',
  },
  {
    id: 'single_smartetf',
    apps: ['smartetf'] as App[],
    label: 'SmartETF',
    price: 150,
    saving: null as number | null,
    tier: 'single',
  },
  {
    id: 'single_smartproperty',
    apps: ['smartproperty'] as App[],
    label: 'SmartProperty',
    price: 150,
    saving: null as number | null,
    tier: 'single',
  },
  // ── Double ──────────────────────────────────────────────────────────────────
  {
    id: 'double_ss_se',
    apps: ['smartsuper', 'smartetf'] as App[],
    label: 'SmartSuper + SmartETF',
    price: 250,
    saving: 50,
    tier: 'double',
  },
  {
    id: 'double_ss_sp',
    apps: ['smartsuper', 'smartproperty'] as App[],
    label: 'SmartSuper + SmartProperty',
    price: 250,
    saving: 50,
    tier: 'double',
  },
  {
    id: 'double_se_sp',
    apps: ['smartetf', 'smartproperty'] as App[],
    label: 'SmartETF + SmartProperty',
    price: 250,
    saving: 50,
    tier: 'double',
  },
  // ── Triple ───────────────────────────────────────────────────────────────────
  {
    id: 'triple_all',
    apps: ['smartsuper', 'smartetf', 'smartproperty'] as App[],
    label: 'All 3 — Complete Smart Suite',
    price: 350,
    saving: 100,
    tier: 'triple',
  },
]

// ─── Checkout button ─────────────────────────────────────────────────────────
function CheckoutButton({ bundleId, label, price, accent, primary }: {
  bundleId: string; label: string; price: number; accent: string; primary: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleClick() {
    setLoading(true)
    setError('')
    try {
      const res  = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bundleId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else if (data.error?.includes('Unauthorised') || data.error?.includes('401')) {
        router.push('/login?redirectTo=/pricing')
      } else {
        setError(data.error || 'Something went wrong.')
      }
    } catch {
      setError('Could not connect. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        style={{
          width: '100%', padding: '12px', borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
          background: accent, color: primary, fontWeight: 800, fontSize: 14, opacity: loading ? 0.7 : 1,
          transition: 'opacity 0.15s',
        }}
      >
        {loading ? 'Redirecting to checkout…' : `Subscribe — $${price}/yr →`}
      </button>
      {error && <p style={{ fontSize: 11, color: '#DC2626', marginTop: 6, textAlign: 'center' }}>{error}</p>}
    </div>
  )
}

// ─── Main pricing component ───────────────────────────────────────────────────
export function SmartSuitePricing({ currentApp, primaryColor, accentColor, bgColor }: Props) {
  const [selectedApps, setSelectedApps] = useState<App[]>([currentApp])

  // Find the best matching bundle for selected apps
  const matchingBundle = BUNDLES.find(b =>
    b.apps.length === selectedApps.length &&
    selectedApps.every(a => b.apps.includes(a))
  )

  function toggleApp(app: App) {
    setSelectedApps(prev =>
      prev.includes(app) ? prev.filter(a => a !== app) : [...prev, app]
    )
  }

  const singlePrice = 150
  const fullPrice   = selectedApps.length * singlePrice
  const bundlePrice = matchingBundle?.price ?? fullPrice
  const saving      = fullPrice - bundlePrice

  const allApps: App[] = ['smartsuper', 'smartetf', 'smartproperty']

  return (
    <div>
      {/* ── App selector ──────────────────────────────────────────────────── */}
      <div style={{ background: 'white', borderRadius: 20, padding: '28px', border: `1px solid rgba(0,0,0,0.08)`, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: primaryColor, marginBottom: 6 }}>
          Build your bundle
        </div>
        <div style={{ fontSize: 12, color: `${primaryColor}88`, marginBottom: 20, lineHeight: 1.5 }}>
          Select the tools you want. Price updates automatically. You can add more apps later.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
          {allApps.map(app => {
            const selected = selectedApps.includes(app)
            const isCurrent = app === currentApp
            return (
              <button
                key={app}
                onClick={() => !isCurrent && toggleApp(app)}
                style={{
                  padding: '16px 12px', borderRadius: 14, border: 'none', cursor: isCurrent ? 'default' : 'pointer',
                  background: selected ? primaryColor : `${primaryColor}0A`,
                  transition: 'all 0.15s', textAlign: 'left',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: selected ? accentColor : primaryColor, marginBottom: 4 }}>
                  {APP_LABELS[app]}
                  {isCurrent && <span style={{ fontSize: 9, marginLeft: 6, background: accentColor, color: primaryColor, padding: '1px 6px', borderRadius: 10, fontWeight: 800 }}>CURRENT</span>}
                </div>
                <div style={{ fontSize: 11, color: selected ? 'rgba(255,255,255,0.55)' : `${primaryColor}66`, lineHeight: 1.4 }}>
                  {APP_DESCS[app]}
                </div>
                {selected && (
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', background: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4l2 2 3-3" stroke={primaryColor} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span style={{ fontSize: 10, color: accentColor, fontWeight: 600 }}>Selected</span>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Price summary */}
        <div style={{ background: primaryColor, borderRadius: 14, padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, fontWeight: 600 }}>
                {selectedApps.length === 1 ? 'Single app' : selectedApps.length === 2 ? 'Double bundle' : 'Complete Smart Suite'}
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: accentColor, fontFamily: 'monospace', letterSpacing: '-0.02em' }}>
                ${bundlePrice}<span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.5)' }}>/year</span>
              </div>
              {saving > 0 && (
                <div style={{ fontSize: 12, color: accentColor, marginTop: 4, fontWeight: 600 }}>
                  ✓ Save ${saving}/yr vs buying separately
                </div>
              )}
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                ~${(bundlePrice / 12).toFixed(2)}/month · Cancel anytime
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Apps included:</div>
              {selectedApps.map(a => (
                <div key={a} style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>✓ {APP_LABELS[a]}</div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            {matchingBundle ? (
              <CheckoutButton
                bundleId={matchingBundle.id}
                label={matchingBundle.label}
                price={matchingBundle.price}
                accent={accentColor}
                primary={primaryColor}
              />
            ) : (
              <div style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.5)', padding: '10px' }}>
                Select your apps above to continue
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── All bundles reference table ─────────────────────────────────────── */}
      <div style={{ background: 'white', borderRadius: 20, padding: '24px', border: `1px solid rgba(0,0,0,0.08)`, marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: `${primaryColor}66`, marginBottom: 16 }}>All pricing options</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {BUNDLES.map((b, i) => {
            const isBest   = b.id === 'triple_all'
            const isMatch  = matchingBundle?.id === b.id
            return (
              <div key={b.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 14px', borderRadius: 10, marginBottom: 4,
                background: isMatch ? `${primaryColor}0D` : isBest ? `${accentColor}12` : 'transparent',
                border: isMatch ? `1.5px solid ${primaryColor}30` : isBest ? `1.5px solid ${accentColor}40` : '1.5px solid transparent',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: isMatch || isBest ? 700 : 500, color: primaryColor }}>
                    {b.label}
                    {isBest && <span style={{ fontSize: 9, marginLeft: 8, background: accentColor, color: primaryColor, padding: '1px 6px', borderRadius: 10, fontWeight: 800 }}>BEST VALUE</span>}
                    {isMatch && !isBest && <span style={{ fontSize: 9, marginLeft: 8, color: `${primaryColor}88` }}>← your selection</span>}
                  </div>
                  <div style={{ fontSize: 11, color: `${primaryColor}55`, marginTop: 2 }}>
                    {b.apps.map(a => APP_LABELS[a as App]).join(' · ')}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 700, color: primaryColor }}>${b.price}/yr</div>
                  {b.saving && (
                    <div style={{ fontSize: 10, color: accentColor === '#C9963A' ? '#A67C2E' : '#059669', fontWeight: 600 }}>Save ${b.saving}</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <div style={{ background: 'white', borderRadius: 20, padding: '24px', border: `1px solid rgba(0,0,0,0.08)` }}>
        <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: `${primaryColor}66`, marginBottom: 16 }}>Common questions</div>
        {[
          { q: 'Can I add a second app later?', a: 'Yes — if you start with one app and want to add another, contact us and we\'ll apply the bundle discount to your remaining subscription period. You\'ll only pay the difference.' },
          { q: 'Does one login work across all apps?', a: 'Yes. Your email and password works on SmartSuper, SmartETF, and SmartProperty. Access is automatic based on your bundle.' },
          { q: 'Can I cancel anytime?', a: 'Yes. Cancel in settings at any time. You keep access until the end of your annual period. No questions asked.' },
          { q: 'What payment methods are accepted?', a: 'Visa, Mastercard, and AMEX via Stripe. All transactions are in AUD.' },
          { q: 'Is this financial advice?', a: 'No. All Smart Suite tools provide educational modelling only. Always consult a licensed financial adviser and registered tax agent for advice specific to your situation.' },
        ].map(f => (
          <div key={f.q} style={{ paddingBottom: 14, marginBottom: 14, borderBottom: `1px solid rgba(0,0,0,0.06)` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: primaryColor, marginBottom: 5 }}>{f.q}</div>
            <div style={{ fontSize: 12, color: `${primaryColor}77`, lineHeight: 1.6 }}>{f.a}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
