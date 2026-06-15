'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { group: 'Free tools', items: [
    { href: '/dashboard',   label: 'Portfolio overview',   icon: '⬡',  paid: false },
    { href: '/analyser',    label: 'Property analyser',    icon: '⌂',  paid: false },
    { href: '/cgt',         label: 'CGT planner',          icon: '↗',  paid: false },
  ]},
  { group: 'Subscriber tools', items: [
    { href: '/analyser',    label: 'Scenario comparison',  icon: '⇄',  paid: true, badge: 'NEW' },
    { href: '/portfolio',   label: 'Multi-property view',  icon: '📈', paid: true },
    { href: '/cgt',         label: 'Hold vs sell modeller',icon: '🎯', paid: true },
    { href: '/analyser',    label: 'Broker client reports',icon: '📄', paid: true },
    { href: '/analyser',    label: 'Rate stress tester',   icon: '⚠',  paid: true, badge: '!' },
    { href: '/analyser',    label: 'IO vs P&I optimiser',  icon: '⇒',  paid: true },
    { href: '/settings',    label: 'AI explanation layer', icon: '⚡', paid: true },
  ]},
]

interface Props {
  isPaid?: boolean
}

export function Sidebar({ isPaid = false }: Props) {
  const pathname = usePathname()

  return (
    <nav className="w-[220px] min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-50"
      style={{ backgroundColor: '#0F1E3C' }}>

      {/* Logo */}
      <Link href="/dashboard" style={{ textDecoration: 'none' }}>
        <div className="px-5 pt-6 pb-4 transition-opacity hover:opacity-80"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer' }}>
          <div className="font-mono text-[10px] tracking-[0.15em] uppercase mb-0.5" style={{ color: '#00D4AA' }}>
            AU · PROPERTY
          </div>
          <div className="text-[19px] font-semibold tracking-tight" style={{ color: '#FFFFFF' }}>
            SmartProperty
          </div>
          <div className="text-[11px] mt-0.5" style={{ color: '#8A9BB5' }}>
            Investment Modelling
          </div>
        </div>
      </Link>

      {/* Nav */}
      <div className="py-2 flex-1 overflow-y-auto">
        {NAV.map(group => (
          <div key={group.group}>
            <div className="px-5 pt-4 pb-1 text-[10px] font-medium uppercase tracking-[0.1em]"
              style={{ color: 'rgba(138,155,181,0.55)' }}>
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
                    color:      active ? '#00D4AA' : locked ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.65)',
                    background: active ? 'rgba(0,212,170,0.1)' : 'transparent',
                    borderLeft: active ? '2px solid #00D4AA' : '2px solid transparent',
                    fontWeight: active ? 500 : 400,
                    textDecoration: 'none',
                  }}>
                  <span className="w-4 text-center text-sm flex-shrink-0" style={{ opacity: locked ? 0.45 : 1 }}>
                    {item.icon}
                  </span>
                  <span className="flex-1" style={{ opacity: locked ? 0.6 : 1 }}>{item.label}</span>
                  {locked && <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>🔒</span>}
                  {!locked && item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                      style={{ background: '#F5A623', color: '#0F1E3C' }}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}

            {group.group === 'Subscriber tools' && !isPaid && (
              <Link href="/pricing"
                className="mx-4 mt-2 mb-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-[11px] font-semibold transition-all hover:opacity-90"
                style={{ background: 'rgba(0,212,170,0.12)', color: '#00D4AA', textDecoration: 'none' }}>
                Unlock all tools →
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{
              background: isPaid ? 'rgba(0,212,170,0.15)' : 'rgba(255,255,255,0.08)',
              color:      isPaid ? '#00D4AA' : '#8A9BB5',
            }}>
            {isPaid ? 'Subscriber ✓' : 'Free plan'}
          </span>
          {!isPaid && (
            <Link href="/pricing" className="text-[11px] font-semibold hover:underline" style={{ color: '#00D4AA', textDecoration: 'none' }}>
              Upgrade →
            </Link>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Link href="/login"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 12px', borderRadius: 10, width: '100%',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              color: '#FCA5A5', textAlign: 'left',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              textDecoration: 'none',
            }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
              <path d="M5 1.5H2.5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1H5M9 9.5l2.5-3L9 3.5M11.5 6.5H5"
                stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sign out
          </Link>
        </div>

        <p className="text-[10px] leading-relaxed mt-3" style={{ color: 'rgba(138,155,181,0.35)' }}>
          General information only. Not financial advice.
        </p>
      </div>
    </nav>
  )
}
