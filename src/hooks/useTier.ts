'use client'
import { useEffect, useState } from 'react'

const ALL_PAID_PLANS = [
  'optimiser','retirement','optimiser_quarterly',
  'single_smartsuper','single_smartetf','single_smartproperty',
  'double_ss_se','double_ss_sp','double_se_sp','triple_all',
  'investor','broker',
]
const BROKER_PLANS = ['broker']

export type Tier = 'broker' | 'investor' | 'free'

export function useTier() {
  const [tier, setTier]     = useState<Tier>('free')
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setChecked(true); return }
        const { data } = await supabase
          .from('subscriptions')
          .select('plan,apps,status')
          .eq('user_id', user.id)
          .single()
        if (data?.status === 'active') {
          const plan = data.plan ?? ''
          const apps: string[] = data.apps ?? []
          if (BROKER_PLANS.includes(plan)) { setTier('broker'); }
          else if (ALL_PAID_PLANS.includes(plan) || apps.includes('smartproperty')) { setTier('investor'); }
        }
      } catch {}
      setChecked(true)
    }
    load()
  }, [])

  return { tier, checked, isPaid: tier !== 'free', isBroker: tier === 'broker' }
}
