import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SmartProperty — Model any property decision in minutes.',
  description: "Australia's independent property investment modelling platform. Free cash flow analyser, negative gearing calculator, CGT planner.",
}

// Colour tokens
const C = {
  forest:      '#1A2F1A',
  forestMid:   '#243524',
  forestLight: '#2E4A2E',
  gold:        '#C9963A',
  goldDim:     '#A67C2E',
  goldLight:   '#E8B86D',
  cream:       '#F7F4EE',
  cream2:      '#EDE8DF',
  sage:        '#7A9B7A',
  white:       '#FFFFFF',
}

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: C.cream, fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* NAV */}
      <nav style={{ background: C.cream, padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, borderBottom: `1px solid rgba(26,47,26,0.08)` }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: C.goldDim, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 2 }}>AU · PROPERTY</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.forest, letterSpacing: '-0.03em' }}>SmartProperty</div>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Link href="/pricing" style={{ fontSize: 13, color: 'rgba(26,47,26,0.55)', textDecoration: 'none', padding: '8px 14px', fontWeight: 500 }}>Pricing</Link>
          <Link href="/contact" style={{ fontSize: 13, color: 'rgba(26,47,26,0.55)', textDecoration: 'none', padding: '8px 14px', fontWeight: 500 }}>Contact</Link>
          <a href="#" style={{ fontSize: 13, color: 'rgba(26,47,26,0.4)', textDecoration: 'none', padding: '8px 14px', fontWeight: 500 }}>SmartETF</a>
          <a href="#" style={{ fontSize: 13, color: 'rgba(26,47,26,0.4)', textDecoration: 'none', padding: '8px 14px', fontWeight: 500 }}>SmartSuper</a>
          <Link href="/login" style={{ fontSize: 13, color: C.forest, textDecoration: 'none', padding: '9px 18px', borderRadius: 9, fontWeight: 600, border: `1.5px solid rgba(26,47,26,0.2)`, background: C.white, marginLeft: 8 }}>Sign in</Link>
          <Link href="/signup" style={{ fontSize: 13, color: C.forest, textDecoration: 'none', padding: '10px 20px', borderRadius: 9, fontWeight: 800, background: C.gold, marginLeft: 4 }}>Start free →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: C.forest, padding: '80px 40px 70px', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle texture */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'radial-gradient(circle at 2px 2px, #C9963A 1px, transparent 0)',
          backgroundSize: '40px 40px' }} />
        {/* Glow */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(201,150,58,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 420px', gap: 60, alignItems: 'center', position: 'relative' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(201,150,58,0.12)', border: '1px solid rgba(201,150,58,0.25)', borderRadius: 20, padding: '5px 12px', marginBottom: 28 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.gold }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: C.goldLight, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Independent · No agent bias</span>
            </div>

            <h1 style={{ fontSize: 52, fontWeight: 900, color: C.white, letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: 22 }}>
              Know your numbers<br />
              <span style={{ color: C.gold }}>before you sign.</span><br />
              <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.35)', fontSize: 38 }}>Every property. Every scenario.</span>
            </h1>

            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
              SmartProperty gives you ATO-accurate cash flow, negative gearing, and CGT modelling — the same analysis a good accountant would run, free in under 3 minutes.
            </p>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 22 }}>
              <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 32px', background: C.gold, color: C.forest, fontWeight: 800, fontSize: 16, borderRadius: 12, textDecoration: 'none', letterSpacing: '-0.02em' }}>
                Analyse a property free →
              </Link>
              <Link href="/pricing" style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontWeight: 500 }}>
                See all tools ↓
              </Link>
            </div>

            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' as const }}>
              {['Free analyser', 'No credit card', 'ATO 2024-25 rates'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <circle cx="6.5" cy="6.5" r="6" stroke={C.gold} strokeWidth="1.2"/>
                    <path d="M4 6.5l2 2 3-3" stroke={C.gold} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Property card preview */}
          <div style={{ background: C.cream, borderRadius: 24, padding: 28, boxShadow: '0 24px 64px rgba(0,0,0,0.3)', border: `1px solid rgba(201,150,58,0.15)` }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(26,47,26,0.45)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 18 }}>
              Example · $850k Brisbane house · $120k salary
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
              {[
                { label: 'After-tax cost', value: '-$178/wk', color: '#C0392B' },
                { label: 'Gross yield', value: '3.97%', color: C.forest },
                { label: 'Tax refund', value: '$8,140/yr', color: C.goldDim },
                { label: 'LVR', value: '80%', color: C.forest },
              ].map(m => (
                <div key={m.label} style={{ background: C.cream2, borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ fontSize: 10, color: 'rgba(26,47,26,0.45)', marginBottom: 4, textTransform: 'uppercase' as const, letterSpacing: '0.06em', fontWeight: 600 }}>{m.label}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: m.color }}>{m.value}</div>
                </div>
              ))}
            </div>

            <div style={{ background: C.forest, borderRadius: 12, padding: '14px 16px', marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 8, fontWeight: 600 }}>Annual cash flow</div>
              {[
                { label: 'Gross rental income', value: '+$33,800', pos: true },
                { label: 'Expenses + interest', value: '-$64,780', pos: false },
                { label: 'Pre-tax cash flow', value: '-$30,980', pos: false },
                { label: 'ATO tax refund', value: '+$8,140', pos: true },
              ].map((r, i) => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{r.label}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, color: r.pos ? C.goldLight : '#F87171' }}>{r.value}</span>
                </div>
              ))}
            </div>

            <div style={{ padding: '10px 12px', background: 'rgba(201,150,58,0.1)', borderRadius: 9, border: `1px solid rgba(201,150,58,0.2)`, display: 'flex', gap: 8 }}>
              <span style={{ fontSize: 12 }}>💡</span>
              <div style={{ fontSize: 11, color: C.goldDim, lineHeight: 1.5 }}>
                Negatively geared by <strong>$178/week</strong> after tax refund. Break-even rent: <strong>$730/wk</strong>. 10-year equity gain: <strong>$522k</strong>.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: C.cream2, padding: '44px 40px', borderBottom: `1px solid rgba(26,47,26,0.08)` }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { value: '$10.7T', label: 'Australian residential property', sub: 'Investors deserve better modelling tools' },
            { value: '$3–5k', label: 'Typical accountant fee per acquisition', sub: 'SmartProperty from $29/month' },
            { value: '3 min', label: 'Average analysis time', sub: 'vs hours of manual spreadsheet work' },
            { value: '2024-25', label: 'ATO tax rates built in', sub: 'Div 40 & 43, negative gearing, CGT' },
          ].map((s, i) => (
            <div key={s.value} style={{ textAlign: 'center', padding: '8px 16px', borderRight: i < 3 ? `1px solid rgba(26,47,26,0.1)` : 'none' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 30, fontWeight: 700, color: C.forest, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 6 }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.forest, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: 'rgba(26,47,26,0.45)', lineHeight: 1.4 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* THE PROBLEM */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.goldDim, textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 16 }}>The problem</div>
        <h2 style={{ fontSize: 34, fontWeight: 800, color: C.forest, letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 20 }}>
          Investors spend $3,000 in accountant fees to model a single acquisition.<br />
          <span style={{ color: 'rgba(26,47,26,0.3)', fontWeight: 400, fontSize: 28 }}>And still don't see all the scenarios.</span>
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(26,47,26,0.6)', lineHeight: 1.75 }}>
          SmartProperty combines ATO-accurate tax logic with real-world scenario comparison — so you can make better decisions before you sign.
        </p>
      </section>

      {/* TOOLS GRID */}
      <section style={{ background: C.white, padding: '72px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.goldDim, textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 12 }}>7 tools · 3 free</div>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: C.forest, letterSpacing: '-0.03em', marginBottom: 10 }}>Everything your property investment needs.</h2>
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.35)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 12 }}>Free tools</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 32 }}>
            {[
              { icon: '⌂', title: 'Property acquisition analyser', desc: 'Gross yield, net yield, after-tax cash flow, break-even rent, LVR — live as you type.' },
              { icon: '↗', title: 'CGT planner', desc: 'Compare sell now vs hold X years with 50% CGT discount modelling and net proceeds.' },
              { icon: '⬡', title: 'Portfolio overview', desc: 'All properties at a glance — total equity, combined cash flow, tax refunds, 10-year projection.' },
            ].map(t => (
              <div key={t.title} style={{ background: C.cream, borderRadius: 16, padding: 22, border: `1px solid rgba(26,47,26,0.08)`, position: 'relative' as const }}>
                <div style={{ position: 'absolute', top: 14, right: 14, fontSize: 9, fontWeight: 700, color: C.goldDim, background: 'rgba(201,150,58,0.12)', padding: '2px 7px', borderRadius: 20, border: `1px solid rgba(201,150,58,0.2)` }}>FREE</div>
                <div style={{ fontSize: 20, marginBottom: 10 }}>{t.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.forest, marginBottom: 6 }}>{t.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(26,47,26,0.55)', lineHeight: 1.6 }}>{t.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(26,47,26,0.35)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 12 }}>Subscriber tools — from $29/month</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {[
              { icon: '⇄', title: 'Scenario comparison', desc: 'IO vs P&I, bull/base/bear, different hold periods — side by side.', hot: true },
              { icon: '📈', title: 'Multi-property view', desc: 'Up to 10 properties. Aggregate equity, cash flow, and portfolio CGT.', hot: false },
              { icon: '📄', title: 'Broker client reports', desc: 'White-label PDF exports for mortgage brokers and buyer\'s agents.', hot: false },
              { icon: '⚡', title: 'AI explanation layer', desc: 'Plain-English explanation of your numbers — why it\'s negatively geared and what it means.', hot: false },
            ].map(t => (
              <div key={t.title} style={{ background: t.hot ? C.forest : C.cream, borderRadius: 16, padding: 22, position: 'relative' as const }}>
                {t.hot && <div style={{ position: 'absolute', top: 14, right: 14, fontSize: 9, fontWeight: 700, color: C.forest, background: C.gold, padding: '2px 7px', borderRadius: 20 }}>POPULAR</div>}
                <div style={{ fontSize: 20, marginBottom: 10 }}>{t.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: t.hot ? C.white : C.forest, marginBottom: 6 }}>{t.title}</div>
                <div style={{ fontSize: 12, color: t.hot ? 'rgba(255,255,255,0.5)' : 'rgba(26,47,26,0.55)', lineHeight: 1.6 }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '72px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: C.forest, letterSpacing: '-0.03em' }}>Up and running in 3 minutes</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, position: 'relative' as const }}>
          <div style={{ position: 'absolute', top: 27, left: '18%', right: '18%', height: 1,
            background: `repeating-linear-gradient(90deg, ${C.gold} 0, ${C.gold} 8px, transparent 8px, transparent 16px)` }} />
          {[
            { step: '01', title: 'Create your free account', desc: 'No credit card. Email and password. 30 seconds.' },
            { step: '02', title: 'Enter property details', desc: 'Purchase price, loan, rent, and your income. We pre-fill typical Australian costs.' },
            { step: '03', title: 'See your numbers', desc: 'Cash flow, yield, tax refund, CGT, break-even — personalised, live.' },
          ].map(s => (
            <div key={s.step} style={{ textAlign: 'center', padding: '0 28px', position: 'relative' as const, zIndex: 1 }}>
              <div style={{ width: 54, height: 54, borderRadius: '50%', background: C.forest, color: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontSize: 13, fontWeight: 700, margin: '0 auto 18px', border: `3px solid ${C.cream}` }}>
                {s.step}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.forest, marginBottom: 7 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(26,47,26,0.5)', lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SMART SUITE BANNER */}
      <section style={{ background: C.forest, padding: '56px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: C.gold, letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: 8 }}>Smart Suite</div>
            <h3 style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: '-0.03em', marginBottom: 12 }}>One login. Three powerful platforms.</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 480 }}>
              SmartProperty sits alongside SmartETF (ASX ETF analyser) and SmartSuper (super optimisation). One account, bundled pricing, one investment picture.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
            {[
              { name: 'SmartETF', desc: 'ASX ETF analysis & portfolios', active: false },
              { name: 'SmartSuper', desc: 'Super optimisation platform', active: false },
              { name: 'SmartProperty', desc: 'Property investment modelling', active: true },
            ].map(p => (
              <div key={p.name} style={{ padding: '12px 18px', borderRadius: 12, minWidth: 240, display: 'flex', alignItems: 'center', gap: 12,
                background: p.active ? 'rgba(201,150,58,0.15)' : 'rgba(255,255,255,0.05)',
                border: p.active ? `1px solid rgba(201,150,58,0.35)` : '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.active ? C.gold : 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: p.active ? C.gold : 'rgba(255,255,255,0.7)' }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{p.desc}</div>
                </div>
                {p.active && <div style={{ marginLeft: 'auto', fontSize: 10, color: C.gold, fontWeight: 700 }}>CURRENT ✓</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 600, margin: '0 auto', padding: '80px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 34, fontWeight: 800, color: C.forest, letterSpacing: '-0.03em', marginBottom: 16 }}>
          Stop guessing. Start modelling.
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(26,47,26,0.55)', lineHeight: 1.7, marginBottom: 32 }}>
          Analyse your next property acquisition in under 5 minutes — free.
        </p>
        <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 36px', background: C.forest, color: C.gold, fontWeight: 800, fontSize: 16, borderRadius: 12, textDecoration: 'none' }}>
          Get started free →
        </Link>
        <div style={{ marginTop: 16, fontSize: 12, color: 'rgba(26,47,26,0.35)' }}>No credit card · No AFSL · Educational modelling tool</div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: C.forest, padding: '48px 40px 28px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: C.gold, letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: 4 }}>AU · PROPERTY</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.white, marginBottom: 4 }}>SmartProperty</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginBottom: 12 }}>Brisbane, Australia</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', lineHeight: 1.6, maxWidth: 280 }}>
                Part of the Smart Suite alongside{' '}
                <a href="#" style={{ color: 'rgba(201,150,58,0.6)', textDecoration: 'none' }}>SmartETF</a> and{' '}
                <a href="#" style={{ color: 'rgba(201,150,58,0.6)', textDecoration: 'none' }}>SmartSuper</a>.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 32 }}>
              {[
                { label: 'Tools', links: [{ t: 'Property analyser', h: '/analyser' }, { t: 'CGT planner', h: '/cgt' }, { t: 'Portfolio', h: '/portfolio' }, { t: 'Pricing', h: '/pricing' }] },
                { label: 'Smart Suite', links: [{ t: 'SmartETF', h: '#' }, { t: 'SmartSuper', h: '#' }, { t: 'Bundle pricing', h: '/pricing' }] },
                { label: 'Support', links: [{ t: 'Contact', h: '/contact' }, { t: 'Privacy policy', h: '#' }, { t: 'Terms', h: '#' }] },
              ].map(col => (
                <div key={col.label}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 10 }}>{col.label}</div>
                  {col.links.map(l => (
                    <div key={l.t} style={{ marginBottom: 7 }}>
                      <Link href={l.h} style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>{l.t}</Link>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 22, fontSize: 11, color: 'rgba(255,255,255,0.2)', lineHeight: 1.7 }}>
            SmartProperty provides general financial information and modelling only — not financial product advice. Always consult a registered tax agent and licensed financial adviser. Calculations use ATO 2024-25 tax rates and are estimates only.
          </div>
        </div>
      </footer>
    </div>
  )
}
