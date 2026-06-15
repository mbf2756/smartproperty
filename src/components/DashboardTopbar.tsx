'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const forest = '#1A2F1A'
const gold   = '#C9963A'
const cream  = '#F7F4EE'

export function DashboardTopbar({ title, subtitle, isPaid = false }: {
  title: string; subtitle?: string; isPaid?: boolean
}) {
  const pathname = usePathname()

  return (
    <div className="sticky top-0 z-10 px-8 py-3 flex items-center justify-between"
      style={{ background: cream, borderBottom: '1px solid rgba(26,47,26,0.1)' }}>

      <div>
        <h1 style={{ fontSize: 15, fontWeight: 600, color: forest }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 12, marginTop: 1, color: 'rgba(26,47,26,0.5)' }}>{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {/* Smart Suite switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10,
          background: forest, color: gold, fontSize: 12, fontWeight: 700 }}>
          <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
            <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
            <rect x="7" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
            <rect x="1" y="7" width="5" height="5" rx="1" stroke={gold} strokeWidth="1.3" fill="rgba(201,150,58,0.15)"/>
            <rect x="7" y="7" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
          </svg>
          Smart Suite
        </div>

        <a href="#" style={{ fontSize: 12, color: 'rgba(26,47,26,0.55)', textDecoration: 'none',
          padding: '7px 12px', borderRadius: 10, border: '1px solid rgba(26,47,26,0.12)' }}>
          SmartETF ↗
        </a>
        <a href="#" style={{ fontSize: 12, color: 'rgba(26,47,26,0.55)', textDecoration: 'none',
          padding: '7px 12px', borderRadius: 10, border: '1px solid rgba(26,47,26,0.12)' }}>
          SmartSuper ↗
        </a>

        <div style={{ width: 1, height: 22, background: 'rgba(26,47,26,0.1)' }} />

        <Link href="/settings" style={{ fontSize: 12, fontWeight: 600, color: forest, textDecoration: 'none',
          padding: '7px 12px', borderRadius: 10, border: '1.5px solid rgba(26,47,26,0.15)',
          display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
            <path d="M9.5 1.5a1.414 1.414 0 0 1 2 2L4 11H1.5V8.5L9.5 1.5z"
              stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Settings
        </Link>

        <Link href="/contact"
          style={{ fontSize: 12, fontWeight: 500, textDecoration: 'none',
            padding: '7px 12px', borderRadius: 10,
            border: '1px solid rgba(26,47,26,0.12)',
            color: pathname === '/contact' ? gold : 'rgba(26,47,26,0.55)' }}>
          Contact
        </Link>

        {!isPaid && (
          <Link href="/pricing" style={{ padding: '7px 14px', borderRadius: 10,
            background: gold, color: forest, fontSize: 12, fontWeight: 800, textDecoration: 'none' }}>
            Upgrade →
          </Link>
        )}

        <Link href="/login" style={{ display: 'flex', alignItems: 'center', gap: 5,
          padding: '7px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600,
          background: 'rgba(239,68,68,0.07)', color: '#B91C1C',
          border: '1px solid rgba(239,68,68,0.18)', textDecoration: 'none' }}>
          <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
            <path d="M5 1.5H2.5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1H5M9 9.5l2.5-3L9 3.5M11.5 6.5H5"
              stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sign out
        </Link>
      </div>
    </div>
  )
}
