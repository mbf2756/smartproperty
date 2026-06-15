'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {
  title: string
  subtitle?: string
  isPaid?: boolean
}

export function DashboardTopbar({ title, subtitle, isPaid = false }: Props) {
  const pathname = usePathname()

  return (
    <div className="bg-white sticky top-0 z-10 px-8 py-3 flex items-center justify-between"
      style={{ borderBottom: '1px solid rgba(15,30,60,0.08)' }}>

      <div>
        <h1 className="text-[15px] font-semibold" style={{ color: '#0F1E3C' }}>{title}</h1>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: 'rgba(15,30,60,0.5)' }}>{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {/* Smart Suite switcher */}
        <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold"
          style={{ background: '#0F1E3C', color: '#00D4AA', border: '1.5px solid #0F1E3C' }}>
          <svg width="12" height="12" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
            <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
            <rect x="7" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
            <rect x="1" y="7" width="5" height="5" rx="1" stroke="#00D4AA" strokeWidth="1.3" fill="rgba(0,212,170,0.15)"/>
            <rect x="7" y="7" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
          </svg>
          Smart Suite
        </div>
        <a href="#" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all hover:bg-black/5"
          style={{ border: '1px solid rgba(15,30,60,0.12)', color: 'rgba(15,30,60,0.6)' }}>
          SmartETF ↗
        </a>
        <a href="#" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all hover:bg-black/5"
          style={{ border: '1px solid rgba(15,30,60,0.12)', color: 'rgba(15,30,60,0.6)' }}>
          SmartSuper ↗
        </a>

        <div style={{ width: 1, height: 22, background: 'rgba(15,30,60,0.1)' }} />

        <Link href="/settings"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-black/5"
          style={{ border: '1.5px solid rgba(15,30,60,0.15)', color: '#0F1E3C' }}>
          <svg width="12" height="12" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
            <path d="M9.5 1.5a1.414 1.414 0 0 1 2 2L4 11H1.5V8.5L9.5 1.5z"
              stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Settings
        </Link>

        <Link href="/contact"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all hover:bg-black/5"
          style={{
            border: '1px solid rgba(15,30,60,0.12)',
            color: pathname === '/contact' ? '#00A888' : 'rgba(15,30,60,0.6)',
          }}>
          Contact
        </Link>

        {!isPaid && (
          <Link href="/pricing"
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
            style={{ background: '#00D4AA', color: '#0F1E3C' }}>
            Upgrade →
          </Link>
        )}

        <Link href="/login"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-red-50"
          style={{
            background: 'rgba(239,68,68,0.07)', color: '#B91C1C',
            border: '1px solid rgba(239,68,68,0.18)',
          }}>
          <svg width="12" height="12" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
            <path d="M5 1.5H2.5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1H5M9 9.5l2.5-3L9 3.5M11.5 6.5H5"
              stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sign out
        </Link>
      </div>
    </div>
  )
}
