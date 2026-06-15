'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole]         = useState('investor')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const router   = useRouter()
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) { setError(error.message); setLoading(false) }
    else { router.push('/dashboard'); router.refresh() }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F4F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 440, padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#00A888', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 2 }}>AU · PROPERTY</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#0F1E3C', letterSpacing: '-0.03em' }}>SmartProperty</div>
          </Link>
          <div style={{ fontSize: 15, color: 'rgba(15,30,60,0.5)', marginTop: 10 }}>Create your free account</div>
          <div style={{ fontSize: 12, color: 'rgba(15,30,60,0.35)', marginTop: 4 }}>No credit card required · 14-day trial</div>
        </div>

        <div style={{ background: 'white', borderRadius: 20, border: '1px solid rgba(15,30,60,0.1)', padding: 32 }}>
          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid rgba(232,93,93,0.25)', color: '#7F1D1D', fontSize: 13, padding: '10px 14px', borderRadius: 10 }}>
                {error}
              </div>
            )}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(15,30,60,0.5)', marginBottom: 6 }}>Full name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required
                style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(15,30,60,0.12)', borderRadius: 10, fontFamily: 'monospace', fontSize: 14, color: '#0F1E3C', outline: 'none', boxSizing: 'border-box' as const }}
                placeholder="Alex Smith" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(15,30,60,0.5)', marginBottom: 6 }}>Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(15,30,60,0.12)', borderRadius: 10, fontFamily: 'monospace', fontSize: 14, color: '#0F1E3C', outline: 'none', boxSizing: 'border-box' as const }}
                placeholder="you@example.com" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(15,30,60,0.5)', marginBottom: 6 }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(15,30,60,0.12)', borderRadius: 10, fontFamily: 'monospace', fontSize: 14, color: '#0F1E3C', outline: 'none', boxSizing: 'border-box' as const }}
                placeholder="Min. 8 characters" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(15,30,60,0.5)', marginBottom: 6 }}>I am a…</label>
              <select value={role} onChange={e => setRole(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(15,30,60,0.12)', borderRadius: 10, fontSize: 14, color: '#0F1E3C', outline: 'none', background: 'white', boxSizing: 'border-box' as const }}>
                <option value="investor">Property investor</option>
                <option value="broker">Mortgage broker</option>
                <option value="buyers_agent">Buyer&apos;s agent</option>
                <option value="accountant">Accountant / tax agent</option>
                <option value="adviser">Financial adviser</option>
              </select>
            </div>
            <button type="submit" disabled={loading}
              style={{ padding: '12px', borderRadius: 10, background: '#00D4AA', color: '#0F1E3C', fontWeight: 800, fontSize: 14, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 4 }}>
              {loading ? 'Creating account…' : 'Start free →'}
            </button>
          </form>
          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'rgba(15,30,60,0.45)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#0F1E3C', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </div>
        </div>

        <div style={{ marginTop: 16, textAlign: 'center', fontSize: 12, color: 'rgba(15,30,60,0.4)', padding: '12px', background: 'rgba(15,30,60,0.04)', borderRadius: 10 }}>
          Your SmartETF or SmartSuper login also works here
        </div>
        <div style={{ marginTop: 12, textAlign: 'center', fontSize: 11, color: 'rgba(15,30,60,0.3)', lineHeight: 1.6 }}>
          By signing up you agree to our Terms of Use and Privacy Policy.<br />
          General information only — not financial advice.
        </div>
      </div>
    </div>
  )
}
