'use client'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { hasAppAccess } from '@/lib/stripe-bundles'

interface SubscriptionRow {
  id: string
  user_id: string
  plan?: string
  apps?: string[]
  bundle?: string
  status: string
  current_period_end?: string
  cancel_at_period_end?: boolean
  stripe_customer_id?: string
  stripe_subscription_id?: string
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionRow | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { createClient: cc } = await import('@/lib/supabase/client')
        const supabase = cc()
        const { data } = await supabase
          .from('subscriptions')
          .select('*')
          .single()
        if (data) setSubscription(data as SubscriptionRow)
      } catch (e) {
        console.error('useSubscription error:', e)
      }
      setLoading(false)
    }
    load()
  }, [])

  const isPaid = hasAppAccess(subscription, 'smartproperty')

  function canAccess(feature: string): boolean {
    if (isPaid) return true
    return ['property_analyser', 'cgt_planner', 'portfolio_overview'].includes(feature)
  }

  return { subscription, loading, canAccess, isPaid }
}
