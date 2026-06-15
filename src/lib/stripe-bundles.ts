// Smart Suite — Unified Bundle Stripe Configuration
// Used by SmartSuper, SmartETF, SmartProperty

export function getStripeInstance() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Stripe = require('stripe')
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })
}

export const BUNDLES = {
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

export function bundleGrantsApp(bundleId: string, app: string): boolean {
  const bundle = BUNDLES[bundleId as BundleId]
  if (!bundle) return false
  return (bundle.apps as readonly string[]).includes(app)
}

export function getUpgradePaths(currentApps: string[]): typeof BUNDLES[BundleId][] {
  return Object.values(BUNDLES).filter(b => {
    const hasAllCurrent = currentApps.every(a => (b.apps as readonly string[]).includes(a))
    const hasMore = b.apps.length > currentApps.length
    return hasAllCurrent && hasMore
  })
}

export const ALL_PAID_PLANS = [
  'optimiser', 'retirement', 'optimiser_quarterly',
  'single_smartsuper', 'single_smartetf', 'single_smartproperty',
  'double_ss_se', 'double_ss_sp', 'double_se_sp',
  'triple_all',
]

export function hasAppAccess(subscription: {
  apps?: string[]
  plan?: string
  status?: string
} | null, app: string): boolean {
  if (!subscription) return false
  if (subscription.status !== 'active') return false

  // 1. Check apps array directly
  if (Array.isArray(subscription.apps) && subscription.apps.includes(app)) return true

  // 2. Triple bundle grants all apps
  if (subscription.plan === 'triple_all') return true

  // 3. Any recognised paid plan grants access (covers pre-Stripe setup period)
  if (subscription.plan && ALL_PAID_PLANS.includes(subscription.plan)) return true

  return false
}
