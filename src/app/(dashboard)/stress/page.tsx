import { DashboardTopbar } from '@/components/DashboardTopbar'
export default function Page() {
  return (
    <div>
      <DashboardTopbar title="Rate Stress Tester" subtitle="See your cash flow if rates rise by 0.5%, 1%, 1.5% or 2%" />
      <div style={{ padding: '48px 40px', maxWidth: 680 }}>
        <div style={{ background: '#1A2F1A', borderRadius: 20, padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⚠</div>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#C9963A', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Coming soon</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 12 }}>Rate Stress Tester</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 420, margin: '0 auto 24px' }}>
            How does your weekly cash flow change if rates rise 1%? 2%? Know your buffer before it matters — across your whole portfolio.
          </p>
          <div style={{ display: 'inline-block', padding: '8px 20px', borderRadius: 10, background: 'rgba(201,150,58,0.15)', border: '1px solid rgba(201,150,58,0.3)', fontSize: 12, color: '#C9963A', fontWeight: 600 }}>In development — available soon</div>
        </div>
      </div>
    </div>
  )
}
