import Link from 'next/link'
import type { Metadata } from 'next'
import { SmartSuitePricing } from '@/components/SmartSuitePricing'

export const metadata: Metadata = { title: 'Pricing — SmartProperty' }

const C = {
  forest: '#1A2F1A',
  gold:   '#C9963A',
  cream:  '#F7F4EE',
  cream2: '#EDE8DF',
}

const FREE_FEATURES = [
  'Property acquisition analyser — full cash flow model',
  'CGT planner with 50% discount modelling',
  'Portfolio overview — up to 3 properties',
  'ATO 2024-25 marginal tax rates',
  'Negative gearing & depreciation (Div 40/43)',
  'Break-even rent & LVR calculator',
]

export default function PricingPage() {
  return (
    <div style={{ minHeight: '100vh', background: C.cream, fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Nav */}
      <nav style={{ background: C.cream, padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, borderBottom: `1px solid rgba(26,47,26,0.08)` }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: C.gold, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 2 }}>AU · PROPERTY</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.forest, letterSpacing: '-0.03em' }}>SmartProperty</div>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Link href="/" style={{ fontSize: 13, color: `rgba(26,47,26,0.55)`, textDecoration: 'none', padding: '8px 14px' }}>Home</Link>
          <Link href="/contact" style={{ fontSize: 13, color: `rgba(26,47,26,0.55)`, textDecoration: 'none', padding: '8px 14px' }}>Contact</Link>
          <Link href="/login" style={{ fontSize: 13, color: C.forest, textDecoration: 'none', padding: '9px 18px', borderRadius: 9, fontWeight: 600, border: `1.5px solid rgba(26,47,26,0.2)`, background: 'white', marginLeft: 8 }}>Sign in</Link>
          <Link href="/signup" style={{ fontSize: 13, color: C.forest, textDecoration: 'none', padding: '10px 20px', borderRadius: 9, fontWeight: 800, background: C.gold, marginLeft: 4 }}>Start free →</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '64px 40px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Smart Suite pricing</div>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: C.forest, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 16 }}>
            One app or all three.<br />You choose.
          </h1>
          <p style={{ fontSize: 16, color: `rgba(26,47,26,0.55)`, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            SmartProperty is part of the Smart Suite alongside SmartSuper and SmartETF.
            Subscribe to one app or bundle them together and save.
          </p>
        </div>

        {/* Free tier */}
        <div style={{ background: 'white', borderRadius: 20, padding: '28px', border: `1px solid rgba(26,47,26,0.1)`, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: `rgba(26,47,26,0.4)`, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Free — always</div>
              <div style={{ fontFamily: 'monospace', fontSize: 32, fontWeight: 700, color: C.forest }}>$0<span style={{ fontSize: 14, fontWeight: 500, color: `rgba(26,47,26,0.4)` }}>/forever</span></div>
              <div style={{ fontSize: 13, color: `rgba(26,47,26,0.5)`, marginTop: 4 }}>No credit card. No time limit.</div>
            </div>
            <Link href="/signup" style={{ padding: '10px 20px', borderRadius: 12, border: `1.5px solid rgba(26,47,26,0.15)`, fontSize: 13, fontWeight: 700, color: C.forest, textDecoration: 'none' }}>
              Get started free
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {FREE_FEATURES.map(f => (
              <div key={f} style={{ display: 'flex', gap: 8, fontSize: 13, color: C.forest, alignItems: 'flex-start' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="7" cy="7" r="6.5" stroke={C.gold} strokeWidth="1.2"/>
                  <path d="M4.5 7l2 2 3-3" stroke={C.gold} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Paid — bundle selector */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: `rgba(26,47,26,0.4)`, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
            Subscriber plans — from $150/year · includes all subscriber tools
          </div>
          <SmartSuitePricing
            currentApp="smartproperty"
            primaryColor={C.forest}
            accentColor={C.gold}
            bgColor={C.cream}
          />
        </div>

      </div>

      {/* Footer */}
      <footer style={{ background: C.forest, padding: '32px 40px', marginTop: 40 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: C.gold, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 4 }}>AU · PROPERTY</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'white' }}>SmartProperty</div>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', maxWidth: 500, textAlign: 'right', lineHeight: 1.7 }}>
            General information only — not financial product advice. Consult a registered tax agent and licensed financial adviser.
          </div>
        </div>
      </footer>
    </div>
  )
}
