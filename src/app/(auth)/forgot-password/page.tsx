'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 380, padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#A67C2E', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 2 }}>AU · PROPERTY</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#1A2F1A', letterSpacing: '-0.03em' }}>SmartProperty</div>
          </Link>
          <div style={{ fontSize: 15, color: 'rgba(26,47,26,0.5)', marginTop: 10 }}>Reset your password</div>
        </div>
        <div style={{ background: 'white', borderRadius: 20, border: '1px solid rgba(26,47,26,0.1)', padding: 32 }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>✉️</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1A2F1A', marginBottom: 6 }}>Check your email</div>
              <div style={{ fontSize: 13, color: 'rgba(26,47,26,0.5)', lineHeight: 1.6 }}>We sent a password reset link to {email}</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(26,47,26,0.5)', marginBottom: 6 }}>Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(26,47,26,0.12)', borderRadius: 10, fontFamily: 'monospace', fontSize: 14, color: '#1A2F1A', outline: 'none', boxSizing: 'border-box' as const }}
                  placeholder="you@example.com" />
              </div>
              <button onClick={() => setSent(true)}
                style={{ padding: '12px', borderRadius: 10, background: '#1A2F1A', color: 'white', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>
                Send reset link
              </button>
            </div>
          )}
          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'rgba(26,47,26,0.45)' }}>
            <Link href="/login" style={{ color: '#1A2F1A', textDecoration: 'none', fontWeight: 600 }}>Back to sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
