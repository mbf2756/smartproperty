import { cn } from '@/lib/utils'

export function ResultBox({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-xl p-5 space-y-1 mt-4', className)} style={{ background: '#0F1E3C' }}>
      <div className="text-[10px] font-medium uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Result</div>
      {children}
    </div>
  )
}

export function ResultRow({ label, value, accent, highlight }: {
  label: string; value: string; accent?: 'teal' | 'amber' | 'red'; highlight?: boolean
}) {
  const colors = { teal: '#00D4AA', amber: '#FBBF24', red: '#F87171' }
  return (
    <div className={cn(
      'flex justify-between items-center py-2 border-b last:border-0',
      highlight ? 'border-white/20 pt-3 mt-1' : 'border-white/5'
    )}>
      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)', fontWeight: highlight ? 600 : 400 }}>{label}</span>
      <span className="font-mono text-sm font-medium" style={{ color: accent ? colors[accent] : highlight ? 'white' : 'white' }}>
        {value}
      </span>
    </div>
  )
}
