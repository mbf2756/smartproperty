'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const NAV = [
  { group: 'Free tools', items: [
    { href: '/dashboard',  label: 'Portfolio overview',    icon: '⬡', paid: false },
    { href: '/analyser',   label: 'Property analyser',     icon: '⌂', paid: false },
    { href: '/cgt',        label: 'CGT planner',           icon: '↗', paid: false },
  ]},
  { group: 'Subscriber tools', items: [
    { href: '/analyser',   label: 'Scenario comparison',   icon: '⇄', paid: true, badge: 'NEW' },
    { href: '/portfolio',  label: 'Multi-property view',   icon: '📈', paid: true },
    { href: '/cgt',        label: 'Hold vs sell modeller', icon: '🎯', paid: true },
    { href: '/analyser',   label: 'Broker client reports', icon: '📄', paid: true },
    { href: '/analyser',   label: 'Rate stress tester',    icon: '⚠',  paid: true, badge: '!' },
    { href: '/analyser',   label: 'IO vs P&I optimiser',   icon: '⇒', paid: true },
    { href: '/settings',   label: 'AI explanation layer',  icon: '⚡', paid: true },
  ]},
]

const ALL_PAID_PLANS = [
  'optimiser', 'retirement', 'optimiser_quarterly',
  'single_smartsuper', 'single_smartetf', 'single_smartproperty',
  'double_ss_se', 'double_ss_sp', 'double_se_sp',
  'triple_all',
]

function checkAccess(sub: { apps?: string[]; plan?: string; status?: string } | null): boolean {
  if (!sub || sub.status !== 'active') return false
  if (Array.isArray(sub.apps) && sub.apps.includes('smartproperty')) return true
  if (sub.plan === 'triple_all') return true
  if (sub.plan && ALL_PAID_PLANS.includes(sub.plan)) return true
  return false
}

export function Sidebar() {
  const pathname = usePathname()
  const [isPaid, setIsPaid]   = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    async function loadSub() {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setChecked(true); return }
        const { data } = await supabase
          .from('subscriptions')
          .select('plan, apps, bundle, status')
          .eq('user_id', user.id)
          .single()
        setIsPaid(checkAccess(data))
      } catch (e) {
        console.error('Sidebar sub check:', e)
      }
      setChecked(true)
    }
    loadSub()
  }, [])

  const bg      = '#1A2F1A'
  const gold    = '#C9963A'
  const goldDim = '#A67C2E'
  const sage    = '#7A9B7A'

  return (
    <nav className="w-[220px] min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-50"
      style={{ backgroundColor: bg }}>

      {/* Logo */}
      <Link href="/dashboard" style={{ textDecoration: 'none' }}>
        <div className="px-5 pt-6 pb-4 transition-opacity hover:opacity-80"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: gold, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 2 }}>
            AU · PROPERTY
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            SmartProperty
          </div>
          <div style={{ fontSize: 11, marginTop: 1, color: sage }}>
            Investment Modelling
          </div>
        </div>
      </Link>

      {/* Nav */}
      <div className="py-2 flex-1 overflow-y-auto">
        {NAV.map(group => (
          <div key={group.group}>
            <div className="px-5 pt-4 pb-1"
              style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(122,155,122,0.55)' }}>
              {group.group}
            </div>

            {group.items.map((item: { href: string; label: string; icon: string; paid: boolean; badge?: string }) => {
              const active = pathname === item.href
              const locked = item.paid && !isPaid
              const dest   = locked ? '/pricing' : item.href

              return (
                <Link key={item.label} href={dest}
                  className="flex items-center gap-2.5 px-5 py-[9px] text-[13px] transition-all"
                  style={{
                    color:      active ? gold : locked ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.65)',
                    background: active ? 'rgba(201,150,58,0.12)' : 'transparent',
                    borderLeft: active ? `2px solid ${gold}` : '2px solid transparent',
                    fontWeight: active ? 600 : 400,
                    textDecoration: 'none',
                  }}>
                  <span style={{ width: 16, textAlign: 'center', fontSize: 13, flexShrink: 0, opacity: locked ? 0.4 : 1 }}>
                    {item.icon}
                  </span>
                  <span style={{ flex: 1, opacity: locked ? 0.55 : 1 }}>{item.label}</span>
                  {locked && <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>🔒</span>}
                  {!locked && item.badge && (
                    <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 20, fontWeight: 700, background: goldDim, color: '#fff' }}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}

            {group.group === 'Subscriber tools' && !isPaid && checked && (
              <Link href="/pricing"
                className="mx-4 mt-2 mb-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-[11px] font-semibold transition-all hover:opacity-90"
                style={{ background: 'rgba(201,150,58,0.12)', color: gold, textDecoration: 'none', border: '1px solid rgba(201,150,58,0.2)' }}>
                Unlock all tools →
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2 mb-3">
          <span style={{
            fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20,
            background: isPaid ? 'rgba(201,150,58,0.15)' : 'rgba(255,255,255,0.08)',
            color:      isPaid ? gold : sage,
          }}>
            {!checked ? '…' : isPaid ? 'Subscriber ✓' : 'Free plan'}
          </span>
          {checked && !isPaid && (
            <Link href="/pricing" style={{ fontSize: 11, fontWeight: 600, color: gold, textDecoration: 'none' }}>
              Upgrade →
            </Link>
          )}
        </div>

        <Link href="/login"
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 10,
            fontSize: 12, fontWeight: 600, color: '#FCA5A5', textDecoration: 'none',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
          }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
            <path d="M5 1.5H2.5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1H5M9 9.5l2.5-3L9 3.5M11.5 6.5H5"
              stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sign out
        </Link>

        <p style={{ fontSize: 10, color: 'rgba(122,155,122,0.4)', lineHeight: 1.6, marginTop: 10 }}>
          General information only. Not financial advice.
        </p>
      </div>
    </nav>
  )
}
