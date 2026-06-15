'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [form, setForm]       = useState({ name: '', email: '', category: 'general', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) setSuccess(true)
      else setError(data.error || 'Something went wrong. Please try again.')
    } catch {
      setError('Could not send message. Please try again.')
    }
    setLoading(false)
  }

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid rgba(26,47,26,0.12)', borderRadius: 10, fontSize: 14, color: '#1A2F1A', outline: 'none', background: 'white', boxSizing: 'border-box' as const }
  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'rgba(26,47,26,0.5)', marginBottom: 6 }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EE', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <nav style={{ background: '#F7F4EE', padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(26,47,26,0.06)', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#A67C2E', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 2 }}>AU · PROPERTY</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#1A2F1A', letterSpacing: '-0.03em' }}>SmartProperty</div>
        </Link>
        <div style={{ display: 'flex', gap: 4 }}>
          <Link href="/pricing" style={{ fontSize: 13, color: 'rgba(26,47,26,0.55)', textDecoration: 'none', padding: '8px 14px', fontWeight: 500 }}>Pricing</Link>
          <Link href="/login" style={{ fontSize: 13, color: '#1A2F1A', textDecoration: 'none', padding: '9px 18px', borderRadius: 9, fontWeight: 600, border: '1.5px solid rgba(26,47,26,0.2)', background: 'white' }}>Sign in</Link>
          <Link href="/signup" style={{ fontSize: 13, color: '#1A2F1A', textDecoration: 'none', padding: '10px 20px', borderRadius: 9, fontWeight: 800, background: '#C9963A', marginLeft: 4 }}>Start free →</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '64px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#A67C2E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Contact</div>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: '#1A2F1A', letterSpacing: '-0.03em', marginBottom: 12 }}>Get in touch</h1>
          <p style={{ fontSize: 15, color: 'rgba(26,47,26,0.5)', lineHeight: 1.6 }}>
            Questions about SmartProperty, the Smart Suite, or broker pricing? We&apos;re based in Brisbane, Australia.
          </p>
        </div>

        {success ? (
          <div style={{ background: 'white', borderRadius: 20, border: '1px solid rgba(26,47,26,0.1)', padding: '48px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✉️</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1A2F1A', marginBottom: 8 }}>Message sent!</div>
            <div style={{ fontSize: 14, color: 'rgba(26,47,26,0.5)', lineHeight: 1.6 }}>
              We&apos;ll get back to you within 1–2 business days (AEST).
            </div>
            <button onClick={() => setSuccess(false)}
              style={{ marginTop: 20, padding: '10px 20px', borderRadius: 10, background: '#F7F4EE', border: '1px solid rgba(26,47,26,0.12)', fontSize: 13, color: '#1A2F1A', cursor: 'pointer', fontWeight: 600 }}>
              Send another message
            </button>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: 20, border: '1px solid rgba(26,47,26,0.1)', padding: 32 }}>
            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid rgba(232,93,93,0.25)', color: '#7F1D1D', fontSize: 13, padding: '10px 14px', borderRadius: 10, marginBottom: 16 }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Your name</label>
                  <input type="text" value={form.name} onChange={set('name')} required placeholder="Alex Smith" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Email address</label>
                  <input type="email" value={form.email} onChange={set('email')} required placeholder="you@example.com" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <select value={form.category} onChange={set('category')} style={inputStyle}>
                  <option value="general">General enquiry</option>
                  <option value="product">Product question</option>
                  <option value="broker">Mortgage broker / advisor pricing</option>
                  <option value="bundle">Smart Suite bundle pricing</option>
                  <option value="billing">Billing or subscription</option>
                  <option value="bug">Report a bug</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Subject</label>
                <input type="text" value={form.subject} onChange={set('subject')} placeholder="What's this about?" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Message</label>
                <textarea rows={5} value={form.message} onChange={set('message')} required placeholder="How can we help?"
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
              </div>
              <button type="submit" disabled={loading}
                style={{ padding: '12px', borderRadius: 10, background: '#1A2F1A', color: '#C9963A', fontWeight: 800, fontSize: 14, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Sending…' : 'Send message →'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
