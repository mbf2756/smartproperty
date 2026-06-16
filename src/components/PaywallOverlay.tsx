'use client'
import Link from 'next/link'

const C = { forest: '#1A2F1A', gold: '#C9963A', cream: '#F7F4EE' }

interface Props {
  plan: 'investor' | 'broker'
  message?: string
}

export function PaywallOverlay({ plan, message }: Props) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 10,
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      background: 'rgba(247,244,238,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: 16,
    }}>
      <div style={{ textAlign: 'center', padding: '28px 32px', maxWidth: 320 }}>
        <div style={{ fontSize: 28, marginBottom: 10 }}>🔒</div>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: C.gold, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
          {plan === 'broker' ? 'Broker plan' : 'Investor plan'}
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.forest, marginBottom: 8 }}>
          {message || 'Subscribe to unlock'}
        </div>
        <div style={{ fontSize: 13, color: 'rgba(26,47,26,0.55)', marginBottom: 20, lineHeight: 1.6 }}>
          {plan === 'broker'
            ? 'White-label PDF reports are available on the Broker plan — $299/year.'
            : 'Full analysis tools from $99/year. Cancel anytime.'}
        </div>
        <Link href="/pricing"
          style={{ display: 'inline-block', padding: '10px 24px', background: C.forest, color: C.gold, borderRadius: 10, fontSize: 13, fontWeight: 800, textDecoration: 'none' }}>
          View plans →
        </Link>
      </div>
    </div>
  )
}

export function LockedPage({ title, icon, description, plan = 'investor' }: {
  title: string; icon: string; description: string; plan?: 'investor' | 'broker'
}) {
  return (
    <div style={{ padding: '48px 40px', maxWidth: 680 }}>
      <div style={{ background: C.forest, borderRadius: 20, padding: '44px', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 14 }}>{icon}</div>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: C.gold, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>
          {plan === 'broker' ? 'Broker plan required' : 'Investor plan required'}
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 10, letterSpacing: '-0.02em' }}>{title}</h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 400, margin: '0 auto 24px' }}>{description}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/pricing"
            style={{ padding: '10px 24px', background: C.gold, color: C.forest, borderRadius: 10, fontSize: 13, fontWeight: 800, textDecoration: 'none' }}>
            {plan === 'broker' ? 'Get Broker plan →' : 'Get Investor plan →'}
          </Link>
          <Link href="/analyser"
            style={{ padding: '10px 24px', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)' }}>
            Back to analyser
          </Link>
        </div>
      </div>
    </div>
  )
}
