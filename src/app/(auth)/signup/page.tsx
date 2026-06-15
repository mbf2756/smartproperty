'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole]         = useState('investor')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)
  const router = useRouter()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not connect. Please check your configuration.')
    }

    setLoading(false)
  }

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid rgba(26,47,26,0.12)', borderRadius: 10, fontFamily: 'monospace', fontSize: 14, color: '#1A2F1A', outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'rgba(26,47,26,0.5)', marginBottom: 6 }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 440, padding: '0 24px' }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#A67C2E', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: 2 }}>AU · PROPERTY</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#1A2F1A', letterSpacing: '-0.03em' }}>SmartProperty</div>
          </Link>
          <div style={{ fontSize: 15, color: 'rgba(26,47,26,0.5)', marginTop: 10 }}>Create your free account</div>
          <div style={{ fontSize: 12, color: 'rgba(26,47,26,0.35)', marginTop: 4 }}>No credit card required · 14-day trial</div>
        </div>

        <div style={{ background: 'white', borderRadius: 20, border: '1px solid rgba(26,47,26,0.1)', padding: 32 }}>

          {success ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1A2F1A', marginBottom: 8 }}>Account created!</div>
              <div style={{ fontSize: 13, color: 'rgba(26,47,26,0.5)', lineHeight: 1.6 }}>
                Check your email to confirm your account, then you&apos;ll be redirected to your dashboard.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {error && (
                <div style={{ background: '#FEF2F2', border: '1px solid rgba(232,93,93,0.25)', color: '#7F1D1D', fontSize: 13, padding: '12px 14px', borderRadius: 10, lineHeight: 1.5 }}>
                  {error}
                </div>
              )}
              <div>
                <label style={labelStyle}>Full name</label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="Alex Smith" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} placeholder="Min. 8 characters" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>I am a…</label>
                <select value={role} onChange={e => setRole(e.target.value)} style={{ ...inputStyle, background: 'white' }}>
                  <option value="investor">Property investor</option>
                  <option value="broker">Mortgage broker</option>
                  <option value="buyers_agent">Buyer&apos;s agent</option>
                  <option value="accountant">Accountant / tax agent</option>
                  <option value="adviser">Financial adviser</option>
                </select>
              </div>
              <button
                type="submit" disabled={loading}
                style={{ padding: '12px', borderRadius: 10, background: '#C9963A', color: '#1A2F1A', fontWeight: 800, fontSize: 14, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 4 }}>
                {loading ? 'Creating account…' : 'Start free →'}
              </button>
            </form>
          )}

          {!success && (
            <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'rgba(26,47,26,0.45)' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#1A2F1A', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
            </div>
          )}
        </div>

        <div style={{ marginTop: 16, textAlign: 'center', fontSize: 12, color: 'rgba(26,47,26,0.4)', padding: '12px', background: 'rgba(26,47,26,0.04)', borderRadius: 10 }}>
          Your SmartETF or SmartSuper login also works here
        </div>
        <div style={{ marginTop: 12, textAlign: 'center', fontSize: 11, color: 'rgba(26,47,26,0.3)', lineHeight: 1.6 }}>
          By signing up you agree to our Terms of Use and Privacy Policy.<br />
          General information only — not financial advice.
        </div>
      </div>
    </div>
  )
}
