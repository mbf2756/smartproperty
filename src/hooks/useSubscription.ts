'use client'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { Subscription } from '@/types'

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('subscriptions')
      .select('*')
      .single()
      .then(({ data }) => {
        if (data) setSubscription(data as Subscription)
        setLoading(false)
      })
  }, [])

  function canAccess(feature: string): boolean {
    if (!subscription || subscription.plan === 'free') {
      return ['property_analyser', 'cgt_planner', 'portfolio_overview'].includes(feature)
    }
    if (subscription.plan === 'advisor') return true
    // investor plan
    return [
      'property_analyser', 'cgt_planner', 'portfolio_overview',
      'scenario_comparison', 'multi_property', 'rate_stress_test',
      'ai_explanation', 'saved_calculations', 'broker_reports',
    ].includes(feature)
  }

  const isPaid = !!subscription && subscription.plan !== 'free'

  return { subscription, loading, canAccess, isPaid }
}
