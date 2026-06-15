import { cn } from '@/lib/utils'

export function ResultBox({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-xl p-5 space-y-1 mt-4', className)} style={{ background: '#1A2F1A' }}>
      <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, color: 'rgba(255,255,255,0.35)' }}>Result</div>
      {children}
    </div>
  )
}

export function ResultRow({ label, value, accent, highlight }: {
  label: string; value: string; accent?: 'gold' | 'amber' | 'red'; highlight?: boolean
}) {
  const colors = { gold: '#E8B86D', amber: '#FBBF24', red: '#F87171' }
  return (
    <div className={cn(
      'flex justify-between items-center py-2 border-b last:border-0',
      highlight ? 'border-white/20 pt-3 mt-1' : 'border-white/5'
    )}>
      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: highlight ? 600 : 400 }}>{label}</span>
      <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 500,
        color: accent ? colors[accent] : highlight ? 'white' : 'rgba(255,255,255,0.85)' }}>
        {value}
      </span>
    </div>
  )
}
