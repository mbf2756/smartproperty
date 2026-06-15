import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SmartProperty — Model any property decision in minutes.',
  description: "Australia's independent property investment modelling platform. Free cash flow analyser, negative gearing calculator, CGT planner — no agent bias, no commissions.",
}

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F5F4F0', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* NAV — exact SmartSuper pattern */}
      <nav style={{ background: '#F5F4F0', padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid rgba(15,30,60,0.06)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#00A888', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 2 }}>AU · PROPERTY</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#0F1E3C', letterSpacing: '-0.03em' }}>SmartProperty</div>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Link href="/pricing" style={{ fontSize: 13, color: 'rgba(15,30,60,0.55)', textDecoration: 'none', padding: '8px 14px', fontWeight: 500 }}>Pricing</Link>
          <Link href="/contact" style={{ fontSize: 13, color: 'rgba(15,30,60,0.55)', textDecoration: 'none', padding: '8px 14px', fontWeight: 500 }}>Contact</Link>
          {/* Smart Suite links */}
          <a href="#" style={{ fontSize: 13, color: 'rgba(15,30,60,0.4)', textDecoration: 'none', padding: '8px 14px', fontWeight: 500 }}>SmartETF</a>
          <a href="#" style={{ fontSize: 13, color: 'rgba(15,30,60,0.4)', textDecoration: 'none', padding: '8px 14px', fontWeight: 500 }}>SmartSuper</a>
          <Link href="/login" style={{ fontSize: 13, color: '#0F1E3C', textDecoration: 'none', padding: '9px 18px', borderRadius: 9, fontWeight: 600, border: '1.5px solid rgba(15,30,60,0.2)', background: 'white', marginLeft: 8 }}>Sign in</Link>
          <Link href="/signup" style={{ fontSize: 13, color: '#0F1E3C', textDecoration: 'none', padding: '10px 20px', borderRadius: 9, fontWeight: 800, background: '#00D4AA', marginLeft: 4 }}>Start free →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 40px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.25)', borderRadius: 20, padding: '5px 12px', marginBottom: 28 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00D4AA' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#065F46', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Independent · No agent bias</span>
            </div>
            <h1 style={{ fontSize: 52, fontWeight: 900, color: '#0F1E3C', letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: 22 }}>
              Know your numbers<br />
              <span style={{ color: '#00A888' }}>before you sign.</span><br />
              <span style={{ fontWeight: 400, color: 'rgba(15,30,60,0.35)', fontSize: 42 }}>Every property. Every scenario.</span>
            </h1>
            <p style={{ fontSize: 17, color: 'rgba(15,30,60,0.6)', lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
              SmartProperty gives you the same analysis a good accountant would run on your investment property — free, in under 3 minutes, with ATO-accurate tax calculations.
            </p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 22 }}>
              <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 32px', background: '#0F1E3C', color: '#00D4AA', fontWeight: 800, fontSize: 16, borderRadius: 12, textDecoration: 'none', letterSpacing: '-0.02em' }}>
                Analyse a property free →
              </Link>
              <Link href="/pricing" style={{ fontSize: 14, color: 'rgba(15,30,60,0.5)', textDecoration: 'none', fontWeight: 500 }}>
                See all tools ↓
              </Link>
            </div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' as const }}>
              {['Free analyser', 'No credit card', '3 minutes to model'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(15,30,60,0.45)', fontWeight: 500 }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <circle cx="6.5" cy="6.5" r="6" stroke="#00D4AA" strokeWidth="1.2"/>
                    <path d="M4 6.5l2 2 3-3" stroke="#00D4AA" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Property card preview */}
          <div style={{ background: 'white', borderRadius: 24, padding: '28px', boxShadow: '0 20px 60px rgba(15,30,60,0.1)', border: '1px solid rgba(15,30,60,0.06)' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(15,30,60,0.4)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 18 }}>Example analysis · $850k Brisbane house · $120k salary</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
              {[
                { label: 'After-tax cost', value: '-$178/wk', color: '#EF4444' },
                { label: 'Gross yield', value: '3.97%', color: '#0F1E3C' },
                { label: 'Tax refund', value: '$8,140/yr', color: '#00A888' },
                { label: 'LVR', value: '80%', color: '#0F1E3C' },
              ].map(m => (
                <div key={m.label} style={{ background: '#F5F4F0', borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ fontSize: 10, color: 'rgba(15,30,60,0.45)', marginBottom: 4, textTransform: 'uppercase' as const, letterSpacing: '0.06em', fontWeight: 600 }}>{m.label}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: m.color }}>{m.value}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#0F1E3C', borderRadius: 12, padding: '14px 16px', marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 8, fontWeight: 600 }}>Annual cash flow breakdown</div>
              {[
                { label: 'Gross rental income', value: '+$33,800' },
                { label: 'Expenses + interest', value: '-$64,780' },
                { label: 'Pre-tax cash flow', value: '-$30,980' },
                { label: 'ATO tax refund', value: '+$8,140' },
              ].map((r, i) => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>{r.label}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, color: r.value.startsWith('+') ? '#00D4AA' : '#F87171' }}>{r.value}</span>
                </div>
              ))}
            </div>

            <div style={{ padding: '10px 12px', background: 'rgba(0,212,170,0.08)', borderRadius: 9, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 12 }}>💡</span>
              <div style={{ fontSize: 11, color: '#065F46', lineHeight: 1.5 }}>
                Negatively geared by <strong>$178/week</strong> after the ATO refund. Break-even rent is <strong>$730/wk</strong>. 10-year projected equity gain: <strong>$522k</strong>.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section style={{ background: '#0F1E3C', padding: '44px 40px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { value: '$10.7T', label: 'Australian residential property market', sub: 'Most investors rely on spreadsheets or guesswork' },
            { value: '$3–5k', label: 'Typical accountant fee per acquisition', sub: 'SmartProperty from $29/month' },
            { value: '3 min', label: 'Average analysis time', sub: 'vs hours of manual spreadsheet work' },
            { value: '2024-25', label: 'ATO tax rates built in', sub: 'Div 40 & 43 depreciation, marginal rates' },
          ].map((s, i) => (
            <div key={s.value} style={{ textAlign: 'center', padding: '8px 16px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 30, fontWeight: 700, color: '#00D4AA', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 6 }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'white', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* THE HOOK */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#00A888', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 16 }}>The problem</div>
        <h2 style={{ fontSize: 34, fontWeight: 800, color: '#0F1E3C', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 20 }}>
          The typical investor spends $3,000 in accountant fees<br />
          to model a single property acquisition.<br />
          <span style={{ color: 'rgba(15,30,60,0.3)', fontWeight: 400, fontSize: 28 }}>And still doesn't see all the scenarios.</span>
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(15,30,60,0.6)', lineHeight: 1.75 }}>
          Australian property investors deserve the same modelling quality that accountants and buyer's agents use — available instantly, without the fee. SmartProperty combines ATO-accurate tax logic (negative gearing, Div 40/43 depreciation, CGT) with real-world scenario comparison so you can make better decisions before you sign.
        </p>
      </section>

      {/* TOOLS GRID */}
      <section style={{ background: 'white', padding: '72px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#00A888', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 12 }}>7 tools · 3 free</div>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: '#0F1E3C', letterSpacing: '-0.03em', marginBottom: 10 }}>Everything your property investment needs.</h2>
            <p style={{ fontSize: 15, color: 'rgba(15,30,60,0.5)', maxWidth: 440, margin: '0 auto' }}>Start free. Upgrade when you need to model more.</p>
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(15,30,60,0.35)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 12 }}>Free tools</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 32 }}>
            {[
              { icon: '⌂', title: 'Property acquisition analyser', desc: 'Enter purchase price, rent, loan details, and income. Get gross yield, net yield, after-tax cash flow, break-even rent, and LVR — live as you type.' },
              { icon: '↗', title: 'CGT planner', desc: 'Compare sell now vs hold X years. Model the 50% CGT discount, marginal rate impact on your gain, and exact net proceeds at every hold period.' },
              { icon: '⬡', title: 'Portfolio overview', desc: 'See all your properties at a glance. Total equity, total after-tax cash flow, combined tax refunds, and 10-year growth projection.' },
            ].map(t => (
              <div key={t.title} style={{ background: '#F5F4F0', borderRadius: 16, padding: '22px', border: '1px solid rgba(15,30,60,0.06)', position: 'relative' as const }}>
                <div style={{ position: 'absolute', top: 14, right: 14, fontSize: 9, fontWeight: 700, color: '#065F46', background: 'rgba(0,212,170,0.15)', padding: '2px 7px', borderRadius: 20 }}>FREE</div>
                <div style={{ fontSize: 20, marginBottom: 10 }}>{t.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F1E3C', marginBottom: 6 }}>{t.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(15,30,60,0.55)', lineHeight: 1.6 }}>{t.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(15,30,60,0.35)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 12 }}>Subscriber tools — from $29/month</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {[
              { icon: '⇄', title: 'Scenario comparison', desc: 'Side-by-side: IO vs P&I, base vs bull vs bear market, different hold periods — all at once.', hot: true },
              { icon: '📈', title: 'Multi-property modelling', desc: 'Model up to 10 properties simultaneously. Aggregate cash flow, equity, and portfolio-level CGT.', hot: false },
              { icon: '📄', title: 'Broker client reports', desc: 'White-label PDF exports for mortgage brokers and buyer\'s agents to share with clients.', hot: false },
              { icon: '⚡', title: 'AI explanation layer', desc: 'Ask "why is this negatively geared?" in plain English. AI explains your specific numbers without jargon.', hot: false },
            ].map(t => (
              <div key={t.title} style={{ background: t.hot ? '#0F1E3C' : '#F5F4F0', borderRadius: 16, padding: '22px', border: 'none', position: 'relative' as const }}>
                {t.hot && <div style={{ position: 'absolute', top: 14, right: 14, fontSize: 9, fontWeight: 700, color: '#0F1E3C', background: '#00D4AA', padding: '2px 7px', borderRadius: 20 }}>POPULAR</div>}
                <div style={{ fontSize: 20, marginBottom: 10 }}>{t.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: t.hot ? 'white' : '#0F1E3C', marginBottom: 6 }}>{t.title}</div>
                <div style={{ fontSize: 12, color: t.hot ? 'rgba(255,255,255,0.5)' : 'rgba(15,30,60,0.55)', lineHeight: 1.6 }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '72px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0F1E3C', letterSpacing: '-0.03em' }}>Up and running in 3 minutes</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, position: 'relative' as const }}>
          <div style={{ position: 'absolute', top: 27, left: '18%', right: '18%', height: 1, background: 'repeating-linear-gradient(90deg, #00D4AA 0, #00D4AA 8px, transparent 8px, transparent 16px)' }} />
          {[
            { step: '01', title: 'Create your free account', desc: 'No credit card. Email and password. 30 seconds.' },
            { step: '02', title: 'Enter property details', desc: 'Purchase price, loan, rent, and your income. We calculate stamp duty.' },
            { step: '03', title: 'See your numbers', desc: 'Cash flow, yield, tax refund, CGT, break-even — personalised, live.' },
          ].map(s => (
            <div key={s.step} style={{ textAlign: 'center', padding: '0 28px', position: 'relative' as const, zIndex: 1 }}>
              <div style={{ width: 54, height: 54, borderRadius: '50%', background: '#0F1E3C', color: '#00D4AA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontSize: 13, fontWeight: 700, margin: '0 auto 18px', border: '3px solid #F5F4F0' }}>
                {s.step}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0F1E3C', marginBottom: 7 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(15,30,60,0.5)', lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SMART SUITE BANNER */}
      <section style={{ background: '#0F1E3C', padding: '56px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#00D4AA', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: 8 }}>Smart Suite</div>
            <h3 style={{ fontSize: 28, fontWeight: 800, color: 'white', letterSpacing: '-0.03em', marginBottom: 12 }}>One login. Three powerful platforms.</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 480 }}>
              SmartProperty is part of the Smart Suite — alongside SmartETF (ASX ETF portfolio analyser) and SmartSuper (superannuation optimisation). One account gives you access to all three, with bundle pricing available.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
            {[
              { name: 'SmartETF', desc: 'ASX ETF analysis & portfolios', active: false },
              { name: 'SmartSuper', desc: 'Super optimisation platform', active: false },
              { name: 'SmartProperty', desc: 'Property investment modelling', active: true },
            ].map(p => (
              <div key={p.name} style={{
                padding: '12px 18px', borderRadius: 12,
                background: p.active ? 'rgba(0,212,170,0.15)' : 'rgba(255,255,255,0.05)',
                border: p.active ? '1px solid rgba(0,212,170,0.35)' : '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', gap: 12, minWidth: 240,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.active ? '#00D4AA' : 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: p.active ? '#00D4AA' : 'rgba(255,255,255,0.7)' }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{p.desc}</div>
                </div>
                {p.active && <div style={{ marginLeft: 'auto', fontSize: 10, color: '#00D4AA', fontWeight: 700 }}>CURRENT ✓</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 600, margin: '0 auto', padding: '80px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 34, fontWeight: 800, color: '#0F1E3C', letterSpacing: '-0.03em', marginBottom: 16 }}>
          Stop guessing. Start modelling.
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(15,30,60,0.55)', lineHeight: 1.7, marginBottom: 32 }}>
          Analyse your next property acquisition in under 5 minutes — free.
        </p>
        <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 36px', background: '#0F1E3C', color: '#00D4AA', fontWeight: 800, fontSize: 16, borderRadius: 12, textDecoration: 'none', letterSpacing: '-0.02em' }}>
          Get started free →
        </Link>
        <div style={{ marginTop: 16, fontSize: 12, color: 'rgba(15,30,60,0.35)' }}>No credit card · No AFSL · Educational modelling tool</div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0F1E3C', padding: '48px 40px 28px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#00D4AA', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: 4 }}>AU · PROPERTY</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'white', marginBottom: 4, letterSpacing: '-0.02em' }}>SmartProperty</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginBottom: 12 }}>Brisbane, Australia</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', lineHeight: 1.6, maxWidth: 280 }}>
                Part of the Smart Suite alongside{' '}
                <a href="#" style={{ color: 'rgba(0,212,170,0.6)', textDecoration: 'none' }}>SmartETF</a> and{' '}
                <a href="#" style={{ color: 'rgba(0,212,170,0.6)', textDecoration: 'none' }}>SmartSuper</a>.
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
            SmartProperty provides general financial information and modelling only — not financial product advice. It does not take into account your personal financial objectives, situation, or needs. Before acting on any information, consider whether it is appropriate for your circumstances. SmartProperty is not an Australian Financial Services licensee. Calculations use ATO 2024-25 tax rates and are estimates only. Always consult a registered tax agent and licensed financial adviser.
          </div>
        </div>
      </footer>
    </div>
  )
}
