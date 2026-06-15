import type { PropertyInputs, PropertyResults } from '@/types'

// ATO 2024-25 marginal tax rates incl. Medicare levy 2%
export function getMarginalRate(income: number): number {
  if (income <= 18200)  return 0
  if (income <= 45000)  return 0.21   // 0.19 + 0.02
  if (income <= 135000) return 0.345  // 0.325 + 0.02
  if (income <= 190000) return 0.39   // 0.37 + 0.02
  return 0.47                          // 0.45 + 0.02
}

export function fmtCurrency(n: number, decimals = 0): string {
  const abs = Math.abs(n)
  const formatted = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(abs)
  return n < 0 ? `-${formatted}` : formatted
}

export function fmtPct(n: number, dp = 2): string {
  return `${n.toFixed(dp)}%`
}

export function calculateProperty(inputs: PropertyInputs): PropertyResults {
  const deposit    = (inputs.purchasePrice * inputs.depositPercent) / 100
  const loanAmount = inputs.purchasePrice - deposit
  const lvr        = (loanAmount / inputs.purchasePrice) * 100
  const totalUpfront = deposit + inputs.stampDuty + inputs.legalCosts + inputs.otherUpfront

  // Annual rent
  const grossRentalIncome = inputs.weeklyRent * 52 * (1 - inputs.vacancyRate / 100)

  // Annual expenses (excl. mortgage)
  const pmFee = (grossRentalIncome * inputs.propertyManagement) / 100
  const totalExpenses = inputs.councilRates + inputs.waterRates + inputs.insurance +
    pmFee + inputs.maintenance + inputs.strataFees + inputs.otherExpenses

  // Mortgage
  const annualRate = inputs.interestRate / 100
  const interestExpense = loanAmount * annualRate
  let principalRepayment = 0

  if (inputs.loanType === 'PI') {
    const monthlyRate = annualRate / 12
    const n = inputs.loanTermYears * 12
    const mp = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, n)) /
               (Math.pow(1 + monthlyRate, n) - 1)
    principalRepayment = mp * 12 - interestExpense
  }

  const totalMortgage = interestExpense + principalRepayment
  const netRentalIncome = grossRentalIncome - totalExpenses
  const preTaxCashFlow  = netRentalIncome - totalMortgage

  // ATO deductions
  const totalDeductions = interestExpense + totalExpenses +
    inputs.buildingDepreciation + inputs.contentDepreciation
  const taxableRentalLoss = grossRentalIncome - totalDeductions

  const marginalRate = getMarginalRate(inputs.taxableIncome)
  const taxRefund    = taxableRentalLoss < 0
    ? Math.abs(taxableRentalLoss) * marginalRate
    : 0

  const afterTaxCashFlow      = preTaxCashFlow + taxRefund
  const weeklyAfterTaxCashFlow = afterTaxCashFlow / 52

  // Yields
  const grossYield      = (grossRentalIncome / inputs.purchasePrice) * 100
  const netYield        = (netRentalIncome / inputs.purchasePrice) * 100
  const cashOnCashReturn = totalUpfront > 0 ? (afterTaxCashFlow / totalUpfront) * 100 : 0

  // CGT projection
  const projectedValue   = inputs.purchasePrice * Math.pow(1 + inputs.capitalGrowthRate / 100, inputs.holdYears)
  const capitalGain      = projectedValue - inputs.purchasePrice
  const cgtDiscountApplied = inputs.holdYears >= 1
  const taxableGain      = cgtDiscountApplied ? capitalGain * 0.5 : capitalGain
  const cgtPayable       = taxableGain > 0 ? taxableGain * marginalRate : 0
  const netProceeds      = projectedValue - loanAmount - cgtPayable

  const breakEvenRent = (totalExpenses + interestExpense - taxRefund) / 52 / (1 - inputs.vacancyRate / 100)

  return {
    totalUpfront, lvr, grossRentalIncome, netRentalIncome, totalExpenses,
    interestExpense, principalRepayment, totalMortgage, preTaxCashFlow,
    taxableRentalLoss, taxRefund, afterTaxCashFlow, weeklyAfterTaxCashFlow,
    grossYield, netYield, cashOnCashReturn, projectedValue, capitalGain,
    cgtDiscountApplied, taxableGain, cgtPayable, netProceeds, breakEvenRent,
    marginalRate,
  }
}

export const DEFAULT_INPUTS: PropertyInputs = {
  purchasePrice: 850000,
  depositPercent: 20,
  stampDuty: 34000,
  legalCosts: 2500,
  otherUpfront: 1500,
  interestRate: 6.2,
  loanTermYears: 30,
  loanType: 'PI',
  weeklyRent: 650,
  vacancyRate: 4,
  councilRates: 2200,
  waterRates: 900,
  insurance: 1800,
  propertyManagement: 8,
  maintenance: 2000,
  strataFees: 0,
  otherExpenses: 500,
  taxableIncome: 120000,
  buildingDepreciation: 6000,
  contentDepreciation: 2000,
  capitalGrowthRate: 6,
  holdYears: 10,
}

// Sample portfolio for demo
export const SAMPLE_PROPERTIES: Array<{ id: string; name: string; address: string; inputs: PropertyInputs }> = [
  {
    id: '1',
    name: 'Kelvin Grove Townhouse',
    address: '42 Kelvin Grove Rd, QLD 4059',
    inputs: { ...DEFAULT_INPUTS, purchasePrice: 780000, weeklyRent: 620, capitalGrowthRate: 6.5 },
  },
  {
    id: '2',
    name: 'New Farm Apartment',
    address: '7/85 Brunswick St, QLD 4005',
    inputs: { ...DEFAULT_INPUTS, purchasePrice: 650000, weeklyRent: 540, strataFees: 4800, buildingDepreciation: 8000 },
  },
  {
    id: '3',
    name: 'Chermside House',
    address: '19 Kittyhawk Dr, QLD 4032',
    inputs: { ...DEFAULT_INPUTS, purchasePrice: 950000, weeklyRent: 720, capitalGrowthRate: 5.5 },
  },
]
