// Smart Suite — Unified Bundle Stripe Configuration
// Used by SmartSuper, SmartETF, SmartProperty
// All price IDs come from environment variables — set in each app's Vercel project

export function getStripeInstance() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Stripe = require('stripe')
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })
}

// ─── Bundle definitions ───────────────────────────────────────────────────────
export const BUNDLES = {
  // Single app — $150/yr
  single_smartsuper: {
    id: 'single_smartsuper',
    label: 'SmartSuper',
    apps: ['smartsuper'],
    priceAud: 150,
    saving: null,
    priceId: process.env.STRIPE_PRICE_SINGLE_SMARTSUPER ?? '',
  },
  single_smartetf: {
    id: 'single_smartetf',
    label: 'SmartETF',
    apps: ['smartetf'],
    priceAud: 150,
    saving: null,
    priceId: process.env.STRIPE_PRICE_SINGLE_SMARTETF ?? '',
  },
  single_smartproperty: {
    id: 'single_smartproperty',
    label: 'SmartProperty',
    apps: ['smartproperty'],
    priceAud: 150,
    saving: null,
    priceId: process.env.STRIPE_PRICE_SINGLE_SMARTPROPERTY ?? '',
  },
  // Double app — $250/yr (save $50 vs 2× single)
  double_ss_se: {
    id: 'double_ss_se',
    label: 'SmartSuper + SmartETF',
    apps: ['smartsuper', 'smartetf'],
    priceAud: 250,
    saving: 50,
    priceId: process.env.STRIPE_PRICE_DOUBLE_SS_SE ?? '',
  },
  double_ss_sp: {
    id: 'double_ss_sp',
    label: 'SmartSuper + SmartProperty',
    apps: ['smartsuper', 'smartproperty'],
    priceAud: 250,
    saving: 50,
    priceId: process.env.STRIPE_PRICE_DOUBLE_SS_SP ?? '',
  },
  double_se_sp: {
    id: 'double_se_sp',
    label: 'SmartETF + SmartProperty',
    apps: ['smartetf', 'smartproperty'],
    priceAud: 250,
    saving: 50,
    priceId: process.env.STRIPE_PRICE_DOUBLE_SE_SP ?? '',
  },
  // Triple — $350/yr (save $100 vs 3× single)
  triple_all: {
    id: 'triple_all',
    label: 'Smart Suite — All 3 Apps',
    apps: ['smartsuper', 'smartetf', 'smartproperty'],
    priceAud: 350,
    saving: 100,
    priceId: process.env.STRIPE_PRICE_TRIPLE_ALL ?? '',
  },
} as const

export type BundleId = keyof typeof BUNDLES

// Helper: does a given bundle grant access to a specific app?
export function bundleGrantsApp(bundleId: string, app: string): boolean {
  const bundle = BUNDLES[bundleId as BundleId]
  if (!bundle) return false
  return (bundle.apps as readonly string[]).includes(app)
}

// Helper: find upgrade path from current bundle
export function getUpgradePaths(currentApps: string[]): typeof BUNDLES[BundleId][] {
  return Object.values(BUNDLES).filter(b => {
    // Must include all current apps plus at least one new one
    const hasAllCurrent = currentApps.every(a => (b.apps as readonly string[]).includes(a))
    const hasMore = b.apps.length > currentApps.length
    return hasAllCurrent && hasMore
  })
}

// Legacy SmartSuper plan names → treat as smartsuper access
export const LEGACY_PAID_PLANS = ['optimiser', 'retirement', 'optimiser_quarterly']

export function hasAppAccess(subscription: {
  apps?: string[]
  plan?: string
  status?: string
} | null, app: string): boolean {
  if (!subscription) return false
  if (subscription.status !== 'active') return false

  // New bundle system
  if (subscription.apps && subscription.apps.includes(app)) return true

  // Legacy: old SmartSuper plan names
  if (app === 'smartsuper' && subscription.plan && LEGACY_PAID_PLANS.includes(subscription.plan)) return true

  return false
}
