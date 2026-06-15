export interface PropertyInputs {
  purchasePrice: number
  depositPercent: number
  stampDuty: number
  legalCosts: number
  otherUpfront: number
  interestRate: number
  loanTermYears: number
  loanType: 'IO' | 'PI'
  weeklyRent: number
  vacancyRate: number
  councilRates: number
  waterRates: number
  insurance: number
  propertyManagement: number
  maintenance: number
  strataFees: number
  otherExpenses: number
  taxableIncome: number
  buildingDepreciation: number
  contentDepreciation: number
  capitalGrowthRate: number
  holdYears: number
}

export interface PropertyResults {
  totalUpfront: number
  lvr: number
  grossRentalIncome: number
  netRentalIncome: number
  totalExpenses: number
  interestExpense: number
  principalRepayment: number
  totalMortgage: number
  preTaxCashFlow: number
  taxableRentalLoss: number
  taxRefund: number
  afterTaxCashFlow: number
  weeklyAfterTaxCashFlow: number
  grossYield: number
  netYield: number
  cashOnCashReturn: number
  projectedValue: number
  capitalGain: number
  cgtDiscountApplied: boolean
  taxableGain: number
  cgtPayable: number
  netProceeds: number
  breakEvenRent: number
  marginalRate: number
}

export interface SavedProperty {
  id: string
  name: string
  address: string
  inputs: PropertyInputs
  results: PropertyResults
  createdAt: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id?: string
  stripe_subscription_id?: string
  plan: 'free' | 'investor' | 'advisor'
  status: 'active' | 'cancelled' | 'past_due' | 'trialing'
  current_period_end?: string
  cancel_at_period_end: boolean
}

export interface SavedCalculation {
  id: string
  user_id: string
  module: string
  label?: string
  inputs: Record<string, unknown>
  results: Record<string, unknown>
  notes?: string
  created_at: string
}

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  role?: 'investor' | 'broker' | 'buyers_agent' | 'accountant' | 'adviser'
  created_at: string
}
