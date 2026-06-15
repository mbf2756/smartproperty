import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Pricing' }

const FREE_FEATURES = [
  { label: 'Property acquisition analyser — full cash flow model', star: true },
  { label: 'CGT planner with 50% discount modelling', star: false },
  { label: 'Portfolio overview — up to 3 properties', star: false },
  { label: 'ATO 2024-25 marginal tax rates', star: false },
  { label: 'Negative gearing & depreciation (Div 40/43)', star: false },
  { label: 'Break-even rent & LVR calculator', star: false },
]

const PAID_FEATURES = [
  { label: 'Everything in Free', bold: false },
  { label: 'Scenario comparison — IO vs P&I, bull/base/bear', bold: true },
  { label: 'Multi-property portfolio — up to 10 properties', bold: true },
  { label: 'Rate stress tester — model rate rises', bold: true },
  { label: 'AI explanation layer — plain-English analysis', bold: true },
  { label: 'Broker client PDF reports (white-label)', bold: true },
  { label: 'Hold vs sell optimiser with CGT modelling', bold: false },
  { label: 'Saved calculations history', bold: false },
  { label: 'Smart Suite bundle discount', bold: false },
]

const FAQ = [
  { q: 'Can I try before subscribing?', a: 'Yes — the free plan includes the full property analyser, CGT planner, and portfolio overview with no time limit. Upgrade when you\'re ready for advanced modelling.' },
  { q: 'What\'s the difference between monthly and yearly?', a: 'Same features. Yearly works out to $24/month (vs $29/month) — a 17% saving. Most users choose yearly.' },
  { q: 'Is this financial advice?', a: 'No. SmartProperty provides modelling tools and general information — not financial advice. Always consult a registered tax agent and licensed financial adviser.' },
  { q: 'Can I use this as a mortgage broker?', a: 'Yes. The Advisor plan includes white-label PDF reports you can share with clients. Contact us for team pricing.' },
  { q: 'Does the Smart Suite bundle give a discount?', a: 'Yes — subscribing to any two or more Smart Suite products (SmartETF, SmartSuper, SmartProperty) gives 20% off all products.' },
  { q: 'Can I cancel anytime?', a: 'Yes. Cancel via account settings at any time. You retain access until the end of your billing period.' },
]

export default function PricingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EE', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Nav */}
      <nav style={{ background: '#F7F4EE', padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid rgba(26,47,26,0.06)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#A67C2E', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 2 }}>AU · PROPERTY</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#1A2F1A', letterSpacing: '-0.03em' }}>SmartProperty</div>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Link href="/" style={{ fontSize: 13, color: 'rgba(26,47,26,0.55)', textDecoration: 'none', padding: '8px 14px', fontWeight: 500 }}>Home</Link>
          <Link href="/contact" style={{ fontSize: 13, color: 'rgba(26,47,26,0.55)', textDecoration: 'none', padding: '8px 14px', fontWeight: 500 }}>Contact</Link>
          <Link href="/login" style={{ fontSize: 13, color: '#1A2F1A', textDecoration: 'none', padding: '9px 18px', borderRadius: 9, fontWeight: 600, border: '1.5px solid rgba(26,47,26,0.2)', background: 'white', marginLeft: 8 }}>Sign in</Link>
          <Link href="/signup" style={{ fontSize: 13, color: '#1A2F1A', textDecoration: 'none', padding: '10px 20px', borderRadius: 9, fontWeight: 800, background: '#C9963A', marginLeft: 4 }}>Start free →</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '64px 40px' }}>

        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#A67C2E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Simple pricing</div>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: '#1A2F1A', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 16 }}>
            Less than one hour of accountant time.
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(26,47,26,0.55)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            Model unlimited properties free. Upgrade for scenario comparison, broker reports, and the AI explanation layer.
          </p>
        </div>

        {/* Plans */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 56 }}>
          {/* Free */}
          <div style={{ background: 'white', borderRadius: 20, padding: '28px', border: '1px solid rgba(26,47,26,0.1)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Free</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 36, fontWeight: 700, color: '#1A2F1A' }}>$0</span>
              <span style={{ fontSize: 13, color: 'rgba(26,47,26,0.4)' }}>/month</span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(26,47,26,0.5)', marginBottom: 20, lineHeight: 1.5 }}>No credit card. No time limit.</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {FREE_FEATURES.map(f => (
                <li key={f.label} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#1A2F1A' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                    <circle cx="7" cy="7" r="6.5" stroke="#C9963A" strokeWidth="1.2"/>
                    <path d="M4.5 7l2 2 3-3" stroke="#C9963A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {f.label}
                </li>
              ))}
            </ul>
            <Link href="/signup" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: 12, border: '1.5px solid rgba(26,47,26,0.15)', fontSize: 14, fontWeight: 700, color: '#1A2F1A', textDecoration: 'none' }}>
              Get started free
            </Link>
          </div>

          {/* Investor */}
          <div style={{ background: '#1A2F1A', borderRadius: 20, padding: '28px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#C9963A', color: '#1A2F1A', fontSize: 10, fontWeight: 800, padding: '4px 12px', borderRadius: 20, whiteSpace: 'nowrap' }}>MOST POPULAR</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Investor</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 36, fontWeight: 700, color: '#C9963A' }}>$29</span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>/month</span>
            </div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>or $288/year ($24/mo — save 17%)</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 20, lineHeight: 1.5 }}>For investors with 1–5 properties.</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {PAID_FEATURES.map(f => (
                <li key={f.label} style={{ display: 'flex', gap: 8, fontSize: 13, color: f.bold ? 'white' : 'rgba(255,255,255,0.6)', fontWeight: f.bold ? 600 : 400 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                    <circle cx="7" cy="7" r="6.5" stroke="#C9963A" strokeWidth="1.2"/>
                    <path d="M4.5 7l2 2 3-3" stroke="#C9963A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {f.label}
                </li>
              ))}
            </ul>
            <Link href="/signup" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: 12, background: '#C9963A', fontSize: 14, fontWeight: 800, color: '#1A2F1A', textDecoration: 'none' }}>
              Start free trial →
            </Link>
          </div>

          {/* Advisor */}
          <div style={{ background: 'white', borderRadius: 20, padding: '28px', border: '1px solid rgba(26,47,26,0.1)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Advisor</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 36, fontWeight: 700, color: '#1A2F1A' }}>$199</span>
              <span style={{ fontSize: 13, color: 'rgba(26,47,26,0.4)' }}>/month</span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(26,47,26,0.5)', marginBottom: 20, lineHeight: 1.5 }}>For mortgage brokers, buyer's agents & accountants.</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Everything in Investor', 'Team seats (up to 5 users)', 'White-label PDF client reports', 'API access', 'SmartETF + SmartSuper bundle', 'Dedicated account manager'].map(f => (
                <li key={f} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#1A2F1A' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                    <circle cx="7" cy="7" r="6.5" stroke="#C9963A" strokeWidth="1.2"/>
                    <path d="M4.5 7l2 2 3-3" stroke="#C9963A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/contact" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: 12, border: '1.5px solid rgba(26,47,26,0.15)', fontSize: 14, fontWeight: 700, color: '#1A2F1A', textDecoration: 'none' }}>
              Contact us
            </Link>
          </div>
        </div>

        {/* Smart Suite bundle */}
        <div style={{ background: '#1A2F1A', borderRadius: 20, padding: '32px', marginBottom: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40 }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#C9963A', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>Smart Suite bundle</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '-0.03em', marginBottom: 8 }}>Save 20% across all three platforms.</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, maxWidth: 420 }}>Subscribe to any two or more of SmartETF, SmartSuper, and SmartProperty and save 20% on all products. One login, bundled billing.</p>
          </div>
          <div style={{ flexShrink: 0, textAlign: 'center' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {['SmartETF', 'SmartSuper', 'SmartProperty'].map((n, i) => (
                <div key={n} style={{ padding: '8px 14px', borderRadius: 10, background: i === 2 ? 'rgba(201,150,58,0.2)' : 'rgba(255,255,255,0.05)', border: i === 2 ? '1px solid rgba(201,150,58,0.4)' : '1px solid rgba(255,255,255,0.1)', fontSize: 12, fontWeight: 700, color: i === 2 ? '#C9963A' : 'rgba(255,255,255,0.5)' }}>
                  {n}
                </div>
              ))}
            </div>
            <Link href="/contact" style={{ display: 'inline-block', padding: '10px 24px', background: '#C9963A', borderRadius: 10, fontSize: 13, fontWeight: 800, color: '#1A2F1A', textDecoration: 'none' }}>
              Get bundle pricing →
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1A2F1A', letterSpacing: '-0.03em', textAlign: 'center', marginBottom: 36 }}>Frequently asked questions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {FAQ.map(f => (
              <div key={f.q} style={{ background: 'white', borderRadius: 14, padding: '20px', border: '1px solid rgba(26,47,26,0.08)' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1A2F1A', marginBottom: 8 }}>{f.q}</div>
                <div style={{ fontSize: 13, color: 'rgba(26,47,26,0.6)', lineHeight: 1.6 }}>{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: '#1A2F1A', padding: '40px 40px 24px', marginTop: 64 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#C9963A', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 4 }}>AU · PROPERTY</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>SmartProperty</div>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', lineHeight: 1.7, maxWidth: 500, textAlign: 'right' }}>
            General information only — not financial product advice. Consult a registered tax agent and licensed financial adviser before making investment decisions.
          </div>
        </div>
      </footer>
    </div>
  )
}
