'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const router       = useRouter()
  const searchParams = useSearchParams()
  const supabase     = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else { router.push(searchParams.get('redirectTo') ?? '/dashboard'); router.refresh() }
  }

  return (
    <div style={{ background: 'white', borderRadius: 20, border: '1px solid rgba(15,30,60,0.1)', padding: 32 }}>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid rgba(232,93,93,0.25)', color: '#7F1D1D', fontSize: 13, padding: '10px 14px', borderRadius: 10 }}>
            {error}
          </div>
        )}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(15,30,60,0.5)', marginBottom: 6 }}>Email address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email"
            style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(15,30,60,0.12)', borderRadius: 10, fontFamily: 'monospace', fontSize: 14, color: '#0F1E3C', outline: 'none', boxSizing: 'border-box' as const }}
            placeholder="you@example.com" />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(15,30,60,0.5)', marginBottom: 6 }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password"
            style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(15,30,60,0.12)', borderRadius: 10, fontFamily: 'monospace', fontSize: 14, color: '#0F1E3C', outline: 'none', boxSizing: 'border-box' as const }}
            placeholder="••••••••" />
        </div>
        <button type="submit" disabled={loading}
          style={{ padding: '12px', borderRadius: 10, background: '#0F1E3C', color: 'white', fontWeight: 700, fontSize: 14, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 4 }}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'rgba(15,30,60,0.45)' }}>
        <Link href="/forgot-password" style={{ color: 'rgba(15,30,60,0.55)', textDecoration: 'none' }}>Forgot password?</Link>
        <span style={{ margin: '0 8px' }}>·</span>
        <Link href="/signup" style={{ color: '#0F1E3C', textDecoration: 'none', fontWeight: 600 }}>Create account</Link>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F5F4F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#00A888', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 2 }}>AU · PROPERTY</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#0F1E3C', letterSpacing: '-0.03em' }}>SmartProperty</div>
          </Link>
          <div style={{ fontSize: 15, color: 'rgba(15,30,60,0.5)', marginTop: 10 }}>Sign in to your account</div>
        </div>
        <Suspense fallback={<div style={{ background: 'white', borderRadius: 20, padding: 32, border: '1px solid rgba(15,30,60,0.1)' }}>Loading…</div>}>
          <LoginForm />
        </Suspense>
        <div style={{ marginTop: 16, textAlign: 'center', fontSize: 12, color: 'rgba(15,30,60,0.4)', padding: '12px', background: 'rgba(15,30,60,0.04)', borderRadius: 10 }}>
          Your SmartETF or SmartSuper login also works here
        </div>
      </div>
    </div>
  )
}
