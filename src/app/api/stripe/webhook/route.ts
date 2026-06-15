// src/app/api/stripe/webhook/route.ts
// Drop this into SmartSuper, SmartETF, and SmartProperty — identical across all 3

import { getStripeInstance } from '@/lib/stripe-bundles'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.text()
  const sig = (await headers()).get('stripe-signature')!
  const stripe = getStripeInstance()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const { createClient } = await import('@supabase/supabase-js')
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  switch (event.type) {

    case 'checkout.session.completed': {
      const session = event.data.object
      const userId   = session.metadata?.userId
      const bundleId = session.metadata?.bundleId
      const apps     = session.metadata?.apps?.split(',') ?? []

      if (!userId) break

      // Determine bundle tier label
      const appCount = apps.length
      const bundle = appCount >= 3 ? 'triple' : appCount === 2 ? 'double' : 'single'

      await supabaseAdmin.from('subscriptions').update({
        stripe_customer_id:     session.customer,
        stripe_subscription_id: session.subscription,
        plan:    bundleId ?? 'bundle',   // keep for legacy compat
        apps:    apps,                   // NEW: array of active apps
        bundle:  bundle,
        status:  'active',
        updated_at: new Date().toISOString(),
      }).eq('user_id', userId)

      console.log(`✓ Subscription activated: user=${userId} bundle=${bundle} apps=${apps.join(',')}`)
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object
      // Apps array comes from subscription metadata
      const apps = sub.metadata?.apps?.split(',').filter(Boolean) ?? []
      const appCount = apps.length
      const bundle = appCount >= 3 ? 'triple' : appCount === 2 ? 'double' : appCount === 1 ? 'single' : 'none'

      const updatePayload: Record<string, unknown> = {
        status: sub.status,
        current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
        cancel_at_period_end: sub.cancel_at_period_end,
        updated_at: new Date().toISOString(),
      }
      if (apps.length > 0) {
        updatePayload.apps   = apps
        updatePayload.bundle = bundle
      }

      await supabaseAdmin.from('subscriptions')
        .update(updatePayload)
        .eq('stripe_subscription_id', sub.id)
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object
      await supabaseAdmin.from('subscriptions').update({
        plan:   'free',
        apps:   [],
        bundle: 'none',
        status: 'active',   // keep row active but downgraded
        updated_at: new Date().toISOString(),
      }).eq('stripe_subscription_id', sub.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}
