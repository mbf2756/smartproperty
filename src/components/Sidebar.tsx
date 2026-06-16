'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const NAV = [
  { group: 'Preview (free)', items: [
    { href: '/analyser',      label: 'Property analyser',        icon: '⌂',  tier: 'free' },
  ]},
  { group: 'Investor — $99/yr', items: [
    { href: '/score',         label: 'Investment Score',          icon: '🏆', tier: 'investor', badge: 'NEW' },
    { href: '/analyser',      label: 'Full property analyser',    icon: '📊', tier: 'investor' },
    { href: '/cgt',           label: 'CGT planner',               icon: '↗',  tier: 'investor' },
    { href: '/equity',        label: 'Equity growth timeline',    icon: '📈', tier: 'investor' },
    { href: '/scenario',      label: 'Scenario comparison',       icon: '⇄',  tier: 'investor' },
    { href: '/stress',        label: 'Rate stress tester',        icon: '⚠',  tier: 'investor' },
    { href: '/io-pi',         label: 'IO vs P&I optimiser',       icon: '⇒',  tier: 'investor' },
    { href: '/hold-sell',     label: 'Hold vs sell modeller',     icon: '🎯', tier: 'investor' },
    { href: '/retirement',    label: 'Retirement impact',         icon: '🌅', tier: 'investor', badge: 'NEW' },
    { href: '/debt-recycle',  label: 'Debt recycling',            icon: '♻️', tier: 'investor', badge: 'NEW' },
    { href: '/annual-review', label: 'Annual portfolio review',   icon: '📅', tier: 'investor', badge: 'NEW' },
    { href: '/dashboard',     label: 'Portfolio overview',        icon: '⬡',  tier: 'investor' },
    { href: '/health',        label: 'Portfolio health score',    icon: '🩺', tier: 'investor' },
    { href: '/ai-explain',    label: 'AI explanation layer',      icon: '⚡', tier: 'investor' },
  ]},
  { group: 'Broker — $299/yr', items: [
    { href: '/reports',       label: 'Client PDF reports',        icon: '📄', tier: 'broker' },
    { href: '/broker-report', label: 'Opportunity report',        icon: '📊', tier: 'broker', badge: 'NEW' },
    { href: '/refinance',     label: 'Refinance engine',          icon: '🔍', tier: 'broker', badge: 'NEW' },
    { href: '/clients',       label: 'Client CRM',                icon: '👥', tier: 'broker', badge: 'NEW' },
    { href: '/portfolio',     label: 'Unlimited portfolios',      icon: '🏢', tier: 'broker' },
  ]},
]

const ALL_PAID_PLANS = [
  'optimiser','retirement','optimiser_quarterly',
  'single_smartsuper','single_smartetf','single_smartproperty',
  'double_ss_se','double_ss_sp','double_se_sp','triple_all',
  'investor','broker',
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
    <nav style={{ width: 230, minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 50, backgroundColor: bg, overflowY: 'auto' }}>

      {/* Logo */}
      <Link href={isPaid ? '/score' : '/analyser'} style={{ textDecoration: 'none', flexShrink: 0 }}>
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: gold, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 2 }}>AU · PROPERTY</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}>SmartProperty</div>
          <div style={{ fontSize: 11, marginTop: 1, color: sage }}>Investment Modelling</div>
        </div>
      </Link>

      {/* Nav */}
      <div style={{ flex: 1, padding: '8px 0' }}>
        {NAV.map(group => {
          if (group.group.startsWith('Broker') && tier === 'investor') return null
          return (
            <div key={group.group}>
              <div style={{ padding: '10px 16px 3px', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(122,155,122,0.5)' }}>
                {group.group}
              </div>
              {group.items.map((item: { href: string; label: string; icon: string; tier: string; badge?: string }) => {
                const active = pathname === item.href
                const locked = !canAccess(item.tier)
                const dest   = locked ? '/pricing' : item.href
                return (
                  <Link key={`${item.href}-${item.label}`} href={dest}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '6px 14px', fontSize: 12, textDecoration: 'none',
                      transition: 'all 0.15s', marginBottom: 1,
                      color:      active ? gold : locked ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.7)',
                      background: active ? 'rgba(201,150,58,0.12)' : 'transparent',
                      borderLeft: active ? `2px solid ${gold}` : '2px solid transparent',
                      fontWeight: active ? 600 : 400,
                    }}>
                    <span style={{ width: 15, textAlign: 'center', fontSize: 11, flexShrink: 0, opacity: locked ? 0.25 : 1 }}>{item.icon}</span>
                    <span style={{ flex: 1, lineHeight: 1.3, opacity: locked ? 0.4 : 1 }}>{item.label}</span>
                    {locked && <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.12)', flexShrink: 0 }}>🔒</span>}
                    {!locked && item.badge && (
                      <span style={{ fontSize: 8, padding: '1px 5px', borderRadius: 20, fontWeight: 700, background: goldDim, color: '#fff', flexShrink: 0 }}>{item.badge}</span>
                    )}
                  </Link>
                )
              })}
            </div>
          )
        })}

        {/* Upgrade CTAs */}
        {checked && !isPaid && (
          <div style={{ margin: '10px 12px 4px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Link href="/pricing" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', borderRadius: 9, fontSize: 11, fontWeight: 700, textDecoration: 'none', background: 'rgba(201,150,58,0.15)', color: gold, border: '1px solid rgba(201,150,58,0.25)' }}>
              Investor — $99/yr →
            </Link>
            <Link href="/pricing" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', borderRadius: 9, fontSize: 10, fontWeight: 600, textDecoration: 'none', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
              Broker — $299/yr →
            </Link>
          </div>
        )}
        {checked && isPaid && !isBroker && (
          <div style={{ margin: '6px 12px 4px' }}>
            <Link href="/pricing" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', borderRadius: 9, fontSize: 10, fontWeight: 600, textDecoration: 'none', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.28)', border: '1px solid rgba(255,255,255,0.07)' }}>
              Upgrade to Broker →
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 20,
            background: isBroker ? 'rgba(201,150,58,0.2)' : isPaid ? 'rgba(201,150,58,0.12)' : 'rgba(255,255,255,0.07)',
            color: isPaid ? gold : sage }}>
            {!checked ? '…' : isBroker ? 'Broker ✓' : isPaid ? 'Investor ✓' : 'Free preview'}
          </span>
        </div>
        <Link href="/login" style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 10px', borderRadius: 9, fontSize: 11, fontWeight: 600, color: '#FCA5A5', textDecoration: 'none', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.18)' }}>
          <svg width="11" height="11" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
            <path d="M5 1.5H2.5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1H5M9 9.5l2.5-3L9 3.5M11.5 6.5H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sign out
        </Link>
        <p style={{ fontSize: 9, color: 'rgba(122,155,122,0.3)', lineHeight: 1.6, marginTop: 7 }}>General information only. Not financial advice.</p>
      </div>
    </nav>
  )
}
