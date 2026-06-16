'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const NAV = [
  { group: 'Preview (free)', items: [
    { href: '/analyser', label: 'Property analyser', icon: '⌂', tier: 'free' },
  ]},
  { group: 'Investor — $99/yr', items: [
    { href: '/dashboard',  label: 'Portfolio overview',    icon: '⬡', tier: 'investor' },
    { href: '/cgt',        label: 'CGT planner',           icon: '↗', tier: 'investor' },
    { href: '/scenario',   label: 'Scenario comparison',   icon: '⇄', tier: 'investor', badge: 'NEW' },
    { href: '/portfolio',  label: 'Multi-property view',   icon: '📈', tier: 'investor' },
    { href: '/hold-sell',  label: 'Hold vs sell modeller', icon: '🎯', tier: 'investor' },
    { href: '/stress',     label: 'Rate stress tester',    icon: '⚠',  tier: 'investor' },
    { href: '/io-pi',      label: 'IO vs P&I optimiser',   icon: '⇒', tier: 'investor' },
    { href: '/ai-explain', label: 'AI explanation layer',  icon: '⚡', tier: 'investor' },
  ]},
  { group: 'Broker — $299/yr', items: [
    { href: '/reports',    label: 'Client PDF reports',    icon: '📄', tier: 'broker' },
    { href: '/portfolio',  label: 'Unlimited portfolios',  icon: '🏢', tier: 'broker' },
  ]},
]

const ALL_PAID_PLANS = [
  'optimiser', 'retirement', 'optimiser_quarterly',
  'single_smartsuper', 'single_smartetf', 'single_smartproperty',
  'double_ss_se', 'double_ss_sp', 'double_se_sp',
  'triple_all',
  'investor', 'broker',
]

const BROKER_PLANS = ['broker']

function checkAccess(sub: { apps?: string[]; plan?: string; status?: string } | null): 'broker' | 'investor' | 'free' {
  if (!sub || sub.status !== 'active') return 'free'
  const plan = sub.plan ?? ''
  if (BROKER_PLANS.includes(plan)) return 'broker'
  if (Array.isArray(sub.apps) && sub.apps.includes('smartproperty')) return 'investor'
  if (ALL_PAID_PLANS.includes(plan)) return 'investor'
  return 'free'
}

export function Sidebar() {
  const pathname = usePathname()
  const [tier, setTier]       = useState<'broker' | 'investor' | 'free'>('free')
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
        setTier(checkAccess(data))
      } catch (e) {
        console.error('Sidebar sub check:', e)
      }
      setChecked(true)
    }
    loadSub()
  }, [])

  const isPaid   = tier !== 'free'
  const isBroker = tier === 'broker'

  const bg      = '#1A2F1A'
  const gold    = '#C9963A'
  const goldDim = '#A67C2E'
  const sage    = '#7A9B7A'

  function canAccess(itemTier: string) {
    if (itemTier === 'free') return true
    if (itemTier === 'investor') return isPaid
    if (itemTier === 'broker') return isBroker
    return false
  }

  return (
    <nav className="w-[220px] min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-50"
      style={{ backgroundColor: bg }}>

      {/* Logo */}
      <Link href={isPaid ? '/dashboard' : '/analyser'} style={{ textDecoration: 'none' }}>
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
        {NAV.map(group => {
          // Hide broker group from non-broker paid users unless they can access
          const groupVisible = group.group.startsWith('Broker') ? (isBroker || !checked) : true
          if (!groupVisible && tier === 'investor') return null

          return (
            <div key={group.group}>
              <div className="px-5 pt-4 pb-1"
                style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(122,155,122,0.55)' }}>
                {group.group}
              </div>

              {group.items.map((item: { href: string; label: string; icon: string; tier: string; badge?: string }) => {
                const active   = pathname === item.href
                const locked   = !canAccess(item.tier)
                const dest     = locked ? '/pricing' : item.href
                const brokerLocked = item.tier === 'broker' && !isBroker

                return (
                  <Link key={`${item.href}-${item.label}`} href={dest}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 20px', fontSize: 13, textDecoration: 'none',
                      transition: 'all 0.15s', marginBottom: 1,
                      color:      active ? gold : locked ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.7)',
                      background: active ? 'rgba(201,150,58,0.12)' : 'transparent',
                      borderLeft: active ? `2px solid ${gold}` : '2px solid transparent',
                      fontWeight: active ? 600 : 400,
                    }}>
                    <span style={{ width: 16, textAlign: 'center', fontSize: 13, flexShrink: 0, opacity: locked ? 0.35 : 1 }}>
                      {item.icon}
                    </span>
                    <span style={{ flex: 1, lineHeight: 1.35, opacity: locked ? 0.5 : 1 }}>
                      {item.label}
                    </span>
                    {locked && <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.18)', flexShrink: 0 }}>🔒</span>}
                    {!locked && item.badge && (
                      <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 20, fontWeight: 700, background: goldDim, color: '#fff', flexShrink: 0 }}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          )
        })}

        {/* Upgrade CTA */}
        {checked && !isPaid && (
          <div style={{ margin: '12px 14px 4px' }}>
            <Link href="/pricing"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '10px', borderRadius: 10, marginBottom: 6,
                fontSize: 12, fontWeight: 700, textDecoration: 'none',
                background: 'rgba(201,150,58,0.15)', color: gold,
                border: '1px solid rgba(201,150,58,0.25)',
              }}>
              Investor — $99/yr →
            </Link>
            <Link href="/pricing"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '8px', borderRadius: 10,
                fontSize: 11, fontWeight: 600, textDecoration: 'none',
                background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
              Broker — $299/yr →
            </Link>
          </div>
        )}

        {checked && isPaid && !isBroker && (
          <div style={{ margin: '8px 14px 4px' }}>
            <Link href="/pricing"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '8px', borderRadius: 10,
                fontSize: 11, fontWeight: 600, textDecoration: 'none',
                background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
              Upgrade to Broker →
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20,
            background: isBroker ? 'rgba(201,150,58,0.2)' : isPaid ? 'rgba(201,150,58,0.12)' : 'rgba(255,255,255,0.07)',
            color: isPaid ? gold : sage,
          }}>
            {!checked ? '…' : isBroker ? 'Broker ✓' : isPaid ? 'Investor ✓' : 'Free preview'}
          </span>
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
