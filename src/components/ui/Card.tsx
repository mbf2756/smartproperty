import { cn } from '@/lib/utils'

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-white rounded-xl border border-black/10 p-6', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('text-[11px] font-medium text-navy/50 uppercase tracking-widest mb-1.5', className)}>
      {children}
    </div>
  )
}

export function StatCard({ label, value, sub, accent }: {
  label: string; value: string; sub?: string; accent?: boolean
}) {
  return (
    <div className="bg-white rounded-xl border border-black/10 p-5">
      <div className="text-[11px] font-medium uppercase tracking-widest mb-1" style={{ color: 'rgba(15,30,60,0.45)' }}>{label}</div>
      <div className="font-mono text-2xl font-medium tracking-tight" style={{ color: accent ? '#00D4AA' : '#0F1E3C' }}>
        {value}
      </div>
      {sub && <div className="text-xs mt-0.5" style={{ color: 'rgba(15,30,60,0.45)' }}>{sub}</div>}
    </div>
  )
}
