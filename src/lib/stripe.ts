// Stripe is lazily required at runtime to avoid build-time env var errors
export function getStripeInstance() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Stripe = require('stripe')
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })
}

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: ['property_analyser', 'cgt_planner', 'portfolio_overview'],
  },
  investor: {
    name: 'Investor',
    monthlyPrice: 29,
    yearlyPrice: 288,  // $24/mo
    monthlyPriceId: process.env.STRIPE_PRICE_INVESTOR_MONTHLY ?? '',
    yearlyPriceId:  process.env.STRIPE_PRICE_INVESTOR_YEARLY  ?? '',
    features: [
      'property_analyser', 'cgt_planner', 'portfolio_overview',
      'scenario_comparison', 'multi_property', 'rate_stress_test',
      'ai_explanation', 'saved_calculations',
    ],
  },
  advisor: {
    name: 'Advisor',
    monthlyPrice: 199,
    yearlyPrice: 1990,
    monthlyPriceId: process.env.STRIPE_PRICE_ADVISOR_MONTHLY ?? '',
    yearlyPriceId:  process.env.STRIPE_PRICE_ADVISOR_YEARLY  ?? '',
    features: ['all'],
  },
} as const

export type PlanKey = keyof typeof PLANS
