import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  prefix?: string
  suffix?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, prefix, suffix, error, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide" style={{ color: 'rgba(15,30,60,0.5)' }}>
            {label}
            {hint && <span className="normal-case font-normal">{hint}</span>}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: 'rgba(15,30,60,0.4)' }}>
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full px-3.5 py-2.5 rounded-xl border border-black/10 font-mono text-sm',
              'focus:outline-none focus:border-teal focus:ring-2',
              'placeholder:text-navy/30',
              prefix && 'pl-7',
              suffix && 'pr-8',
              error && 'border-red-400 focus:border-red-400',
              className
            )}
            style={{ color: '#0F1E3C' }}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: 'rgba(15,30,60,0.4)' }}>
              {suffix}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

export function Select({ label, children, className, ...props }:
  React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs font-medium uppercase tracking-wide" style={{ color: 'rgba(15,30,60,0.5)' }}>{label}</label>
      )}
      <select
        className={cn(
          'w-full px-3.5 py-2.5 rounded-xl border border-black/10 text-sm bg-white',
          'focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20',
          className
        )}
        style={{ color: '#0F1E3C' }}
        {...props}
      >
        {children}
      </select>
    </div>
  )
}
