// src/app/api/stripe/create-checkout/route.ts
// Drop this file into SmartSuper, SmartETF, and SmartProperty — identical across all 3
// Each app's Vercel env vars provide the price IDs

import { getStripeInstance, BUNDLES, type BundleId } from '@/lib/stripe-bundles'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { bundleId, couponCode } = await request.json()

    // Validate bundle
    const bundle = BUNDLES[bundleId as BundleId]
    if (!bundle) {
      return NextResponse.json({ error: `Unknown bundle: ${bundleId}` }, { status: 400 })
    }

    // Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    // Validate price ID exists
    if (!bundle.priceId) {
      console.error(`Price ID missing for bundle: ${bundleId}`)
      return NextResponse.json(
        { error: `Stripe not configured for this bundle. Please contact support.` },
        { status: 503 }
      )
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 503 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://smartproperty-delta.vercel.app'
    const stripe = getStripeInstance()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessionParams: any = {
      payment_method_types: ['card'],
      line_items: [{ price: bundle.priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${appUrl}/dashboard?upgraded=true&bundle=${bundleId}`,
      cancel_url: `${appUrl}/pricing`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        bundleId,
        apps: bundle.apps.join(','),
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          bundleId,
          apps: bundle.apps.join(','),
        },
      },
      allow_promotion_codes: true,
    }

    // Apply coupon code if provided
    if (couponCode) {
      try {
        const promoCodes = await stripe.promotionCodes.list({ code: couponCode, active: true, limit: 1 })
        if (promoCodes.data.length > 0) {
          sessionParams.discounts = [{ promotion_code: promoCodes.data[0].id }]
          delete sessionParams.allow_promotion_codes
        } else {
          return NextResponse.json({ error: 'Coupon code not found or expired.' }, { status: 400 })
        }
      } catch (err) {
        console.error('Coupon error:', err)
        return NextResponse.json({ error: 'Could not apply coupon.' }, { status: 400 })
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams)
    return NextResponse.json({ url: session.url })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Stripe checkout error:', message)
    return NextResponse.json({ error: `Stripe error: ${message}` }, { status: 500 })
  }
}
