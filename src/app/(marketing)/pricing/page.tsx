import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Pricing — SmartProperty' }

const C = { forest: '#1A2F1A', gold: '#C9963A', goldDim: '#A67C2E', cream: '#F7F4EE', cream2: '#EDE8DF' }

const PLANS = [
  {
    name: 'Free preview',
    price: 0,
    period: 'forever',
    desc: 'See if this is right for you',
    highlight: false,
    cta: 'Start free',
    ctaHref: '/signup',
    features: [
      { label: 'Property analyser — gross yield only', included: true },
      { label: 'Full after-tax cash flow analysis', included: false },
      { label: 'ATO tax refund & negative gearing', included: false },
      { label: 'CGT planner', included: false },
      { label: 'Break-even rent & LVR', included: false },
      { label: 'Portfolio dashboard', included: false },
    ],
  },
  {
    name: 'Investor',
    price: 99,
    period: 'year',
    desc: 'For property investors with 1–10 properties',
    highlight: true,
    badge: 'MOST POPULAR',
    cta: 'Get Investor plan',
    ctaHref: '/signup',
    features: [
      { label: 'Full property analyser — all results', included: true },
      { label: 'After-tax cash flow, ATO refund & gearing', included: true },
      { label: 'CGT planner — sell now vs hold', included: true },
      { label: 'Scenario comparison — Bear/Base/Bull', included: true },
      { label: 'Rate stress tester', included: true },
      { label: 'IO vs P&I optimiser', included: true },
      { label: 'Hold vs sell modeller', included: true },
      { label: 'Portfolio dashboard — up to 10 properties', included: true },
      { label: 'AI explanation layer', included: true },
      { label: 'White-label broker PDF reports', included: false },
    ],
  },
  {
    name: 'Broker',
    price: 299,
    period: 'year',
    desc: 'For mortgage brokers, buyer\'s agents & accountants',
    highlight: false,
    cta: 'Get Broker plan',
    ctaHref: '/signup',
    features: [
      { label: 'Everything in Investor', included: true },
      { label: 'White-label client PDF reports', included: true },
      { label: 'Broker name & branding on reports', included: true },
      { label: 'Unlimited client portfolio dashboards', included: true },
      { label: 'Bulk analysis — up to 20 clients', included: true },
      { label: 'Priority support', included: true },
      { label: 'Smart Suite bundle discount', included: true },
    ],
  },
]

const FAQ = [
  { q: 'Why is the free plan so limited?', a: 'SmartProperty is a professional-grade tool that takes significant ongoing development to maintain ATO tax accuracy. The free preview lets you see the interface and enter your property details — subscribing unlocks the actual analysis you need to make investment decisions.' },
  { q: 'What does "after-tax cash flow" mean?', a: 'It\'s what a property actually costs you each week after your ATO tax refund from negative gearing. Most investors are surprised how different this is from the pre-tax number. This is the core metric you need to make a property decision.' },
  { q: 'Who is the Broker plan for?', a: 'Mortgage brokers, buyer\'s agents, and accountants who analyse properties for multiple clients. The Broker plan lets you generate white-label PDF reports with your own name and branding to share with clients.' },
  { q: 'Can I use this as part of the Smart Suite?', a: 'Yes — SmartProperty works alongside SmartSuper and SmartETF under one login. Bundle all three for $350/year (saving $100 vs buying separately).' },
  { q: 'Is this financial advice?', a: 'No. SmartProperty is a modelling tool providing general information only. Always consult a registered tax agent and licensed financial adviser before making investment decisions.' },
  { q: 'Can I cancel anytime?', a: 'Yes. Cancel anytime in settings. You keep access until the end of your annual subscription period.' },
]

export default function PricingPage() {
  return (
    <div style={{ minHeight: '100vh', background: C.cream, fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Nav */}
      <nav style={{ background: C.cream, padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, borderBottom: `1px solid rgba(26,47,26,0.08)` }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: C.goldDim, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 2 }}>AU · PROPERTY</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.forest, letterSpacing: '-0.03em' }}>SmartProperty</div>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Link href="/" style={{ fontSize: 13, color: `rgba(26,47,26,0.55)`, textDecoration: 'none', padding: '8px 14px' }}>Home</Link>
          <Link href="/contact" style={{ fontSize: 13, color: `rgba(26,47,26,0.55)`, textDecoration: 'none', padding: '8px 14px' }}>Contact</Link>
          <Link href="/login" style={{ fontSize: 13, color: C.forest, textDecoration: 'none', padding: '9px 18px', borderRadius: 9, fontWeight: 600, border: `1.5px solid rgba(26,47,26,0.2)`, background: 'white', marginLeft: 8 }}>Sign in</Link>
          <Link href="/signup" style={{ fontSize: 13, color: C.forest, textDecoration: 'none', padding: '10px 20px', borderRadius: 9, fontWeight: 800, background: C.gold, marginLeft: 4 }}>Try free →</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '64px 40px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.goldDim, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Pricing</div>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: C.forest, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 16 }}>
            Built for serious property investors.<br />
            <span style={{ color: C.goldDim, fontWeight: 500, fontSize: 32 }}>And the brokers who advise them.</span>
          </h1>
          <p style={{ fontSize: 16, color: `rgba(26,47,26,0.55)`, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            A $900k property decision deserves better than a spreadsheet.
            SmartProperty gives you ATO-accurate modelling — no accountant required.
          </p>
        </div>

        {/* Plans */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 52 }}>
          {PLANS.map(plan => (
            <div key={plan.name} style={{
              borderRadius: 20, padding: '28px',
              background: plan.highlight ? C.forest : 'white',
              border: plan.highlight ? 'none' : `1px solid rgba(26,47,26,0.1)`,
              position: 'relative',
              boxShadow: plan.highlight ? '0 20px 60px rgba(26,47,26,0.25)' : 'none',
            }}>
              {plan.badge && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: C.gold, color: C.forest, fontSize: 10, fontWeight: 800, padding: '4px 14px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                  {plan.badge}
                </div>
              )}

              <div style={{ fontSize: 11, fontWeight: 700, color: plan.highlight ? 'rgba(255,255,255,0.4)' : 'rgba(26,47,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                {plan.name}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 38, fontWeight: 700, color: plan.highlight ? C.gold : C.forest }}>
                  ${plan.price}
                </span>
                <span style={{ fontSize: 13, color: plan.highlight ? 'rgba(255,255,255,0.4)' : 'rgba(26,47,26,0.4)' }}>/{plan.period}</span>
              </div>

              <p style={{ fontSize: 13, color: plan.highlight ? 'rgba(255,255,255,0.5)' : 'rgba(26,47,26,0.5)', marginBottom: 22, lineHeight: 1.5 }}>
                {plan.desc}
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 9 }}>
                {plan.features.map(f => (
                  <li key={f.label} style={{ display: 'flex', gap: 9, fontSize: 13, color: f.included ? (plan.highlight ? 'rgba(255,255,255,0.85)' : C.forest) : (plan.highlight ? 'rgba(255,255,255,0.25)' : 'rgba(26,47,26,0.3)'), alignItems: 'flex-start' }}>
                    <span style={{ flexShrink: 0, marginTop: 1, fontSize: 14 }}>{f.included ? '✓' : '–'}</span>
                    <span style={{ textDecoration: f.included ? 'none' : 'none' }}>{f.label}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.ctaHref}
                style={{
                  display: 'block', textAlign: 'center', padding: '12px', borderRadius: 12, textDecoration: 'none',
                  fontSize: 14, fontWeight: 800,
                  background: plan.highlight ? C.gold : C.forest,
                  color: plan.highlight ? C.forest : C.gold,
                }}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Smart Suite bundle */}
        <div style={{ background: C.forest, borderRadius: 20, padding: '32px 36px', marginBottom: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40 }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: C.gold, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>Smart Suite bundle</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '-0.03em', marginBottom: 8 }}>
              Add SmartSuper + SmartETF and save $100/year.
            </h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, maxWidth: 420 }}>
              All three platforms — SmartProperty, SmartSuper and SmartETF — under one login for $350/year.
              That's $97 less than buying them separately.
            </p>
          </div>
          <div style={{ flexShrink: 0, textAlign: 'center' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 36, fontWeight: 800, color: C.gold, marginBottom: 4 }}>$350</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>/year · all 3 apps</div>
            <Link href="/pricing" style={{ display: 'inline-block', padding: '11px 28px', background: C.gold, color: C.forest, borderRadius: 10, fontSize: 13, fontWeight: 800, textDecoration: 'none' }}>
              Get bundle →
            </Link>
          </div>
        </div>

        {/* What you actually get */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: C.forest, letterSpacing: '-0.03em', textAlign: 'center', marginBottom: 8 }}>What the Investor plan actually gives you</h2>
          <p style={{ fontSize: 15, color: 'rgba(26,47,26,0.5)', textAlign: 'center', marginBottom: 32 }}>The numbers a good accountant would run on your acquisition — instantly.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { icon: '💸', title: 'After-tax cash flow', desc: 'Exactly what the property costs per week after your ATO tax refund from negative gearing. The number that actually matters.' },
              { icon: '🏛', title: 'ATO-accurate tax logic', desc: 'Negative gearing, Div 40 plant depreciation, Div 43 building depreciation, and 2024-25 marginal tax rates including Medicare levy.' },
              { icon: '↗', title: 'CGT scenario planning', desc: 'Compare selling now vs holding. The 50% CGT discount, your marginal rate impact, and exact net sale proceeds modelled over any time horizon.' },
              { icon: '⇄', title: 'Scenario comparison', desc: 'Bear, base and bull growth cases side by side. IO vs P&I. Multiple hold periods. See which scenario works best for your strategy.' },
              { icon: '⚠', title: 'Rate stress testing', desc: 'If rates rise 1% or 2%, what happens to your weekly cash flow? Know your buffer before you commit.' },
              { icon: '⚡', title: 'AI explanation layer', desc: 'Ask plain-English questions about your property. Why is it negatively geared? What does break-even rent mean? Answered using your actual numbers.' },
            ].map(f => (
              <div key={f.title} style={{ background: 'white', borderRadius: 16, padding: '22px', border: `1px solid rgba(26,47,26,0.08)` }}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.forest, marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(26,47,26,0.55)', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Broker section */}
        <div style={{ background: 'white', borderRadius: 20, padding: '36px', border: `1px solid rgba(26,47,26,0.1)`, marginBottom: 56 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.goldDim, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>For mortgage brokers</div>
              <h3 style={{ fontSize: 26, fontWeight: 800, color: C.forest, letterSpacing: '-0.03em', marginBottom: 12 }}>
                Stop sending clients spreadsheets. Send them a professional report.
              </h3>
              <p style={{ fontSize: 14, color: 'rgba(26,47,26,0.55)', lineHeight: 1.7, marginBottom: 20 }}>
                The Broker plan lets you generate white-label PDF reports with your name, branding, and analysis. Add adviser notes. Send to clients directly. Works for any Australian residential investment property.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['White-label PDF reports with your branding', 'Adviser notes section on every report', 'Unlimited client portfolios', 'Bulk analysis for up to 20 clients', 'All Investor tools included'].map(f => (
                  <li key={f} style={{ display: 'flex', gap: 8, fontSize: 14, color: C.forest, alignItems: 'center' }}>
                    <span style={{ color: C.gold, fontWeight: 700 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" style={{ display: 'inline-block', padding: '12px 28px', background: C.forest, color: C.gold, borderRadius: 12, fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
                Get Broker plan — $299/yr →
              </Link>
            </div>
            <div style={{ background: C.cream, borderRadius: 16, padding: '24px' }}>
              <div style={{ background: C.forest, borderRadius: 12, padding: '16px 20px', marginBottom: 16 }}>
                <div style={{ fontFamily: 'monospace', fontSize: 10, color: C.gold, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>SmartProperty · Client Report</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 2 }}>42 Kelvin Grove Rd, QLD 4059</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Prepared for: Alex & Sarah Smith · Adviser: Jane Brown · {new Date().toLocaleDateString('en-AU')}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                {[
                  { label: 'After-tax /wk', value: '-$178', color: '#EF4444' },
                  { label: 'Gross yield', value: '3.97%', color: C.forest },
                  { label: 'ATO refund', value: '$8,140', color: C.goldDim },
                  { label: 'LVR', value: '80%', color: C.forest },
                ].map(m => (
                  <div key={m.label} style={{ background: 'white', borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(26,47,26,0.4)', marginBottom: 3 }}>{m.label}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: m.color }}>{m.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(201,150,58,0.1)', borderRadius: 8, padding: '10px 12px', fontSize: 11, color: C.goldDim, lineHeight: 1.5, border: '1px solid rgba(201,150,58,0.2)' }}>
                <strong>Adviser notes:</strong> Based on current rental market data for Kelvin Grove, this property is negatively geared by $178/wk after tax. Recommend IO loan to maximise cash flow buffer.
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: C.forest, letterSpacing: '-0.03em', textAlign: 'center', marginBottom: 32 }}>Common questions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {FAQ.map(f => (
              <div key={f.q} style={{ background: 'white', borderRadius: 14, padding: '20px', border: `1px solid rgba(26,47,26,0.08)` }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.forest, marginBottom: 8 }}>{f.q}</div>
                <div style={{ fontSize: 13, color: 'rgba(26,47,26,0.6)', lineHeight: 1.6 }}>{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: C.forest, padding: '40px 40px 24px', marginTop: 64 }}>
        <div style={{ maxWidth: 1060, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
