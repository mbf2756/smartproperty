import type { PropertyInputs, PropertyResults } from '@/types'

export interface ScoreBreakdown {
  overall: number
  label: 'Excellent' | 'Strong' | 'Good' | 'Moderate' | 'Weak'
  color: string
  components: {
    yield:         { score: number; label: string; weight: number }
    cashflow:      { score: number; label: string; weight: number }
    lvr:           { score: number; label: string; weight: number }
    holdingCost:   { score: number; label: string; weight: number }
    growthPotential:{ score: number; label: string; weight: number }
    vacancyRisk:   { score: number; label: string; weight: number }
    equityGrowth:  { score: number; label: string; weight: number }
  }
  strengths: string[]
  risks: string[]
  recommendations: string[]
}

// Weights must sum to 100
const WEIGHTS = {
  yield:          15,
  cashflow:       25,
  lvr:            15,
  holdingCost:    15,
  growthPotential:15,
  vacancyRisk:    10,
  equityGrowth:   5,
}

function clamp(v: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, v))
}

export function scoreProperty(inputs: PropertyInputs, results: PropertyResults): ScoreBreakdown {

  // ── 1. Gross yield score (0-100) ─────────────────────────────────────
  // <3% = poor, 3-4% = fair, 4-5% = good, 5-6% = great, >6% = excellent
  const yieldScore = clamp(
    results.grossYield < 3   ? (results.grossYield / 3) * 40 :
    results.grossYield < 4   ? 40 + (results.grossYield - 3) * 20 :
    results.grossYield < 5   ? 60 + (results.grossYield - 4) * 20 :
    results.grossYield < 6   ? 80 + (results.grossYield - 5) * 15 :
    95
  )
  const yieldLabel =
    results.grossYield >= 5.5 ? 'Excellent yield' :
    results.grossYield >= 4.5 ? 'Strong yield' :
    results.grossYield >= 3.5 ? 'Moderate yield' :
    'Below-average yield'

  // ── 2. After-tax cash flow score ─────────────────────────────────────
  // Weekly after-tax cost: positive = great, -$0-$150 = fine, -$150-$300 = ok, >-$300 = risky
  const wkCF = results.weeklyAfterTaxCashFlow
  const cashflowScore = clamp(
    wkCF >= 0         ? 100 :
    wkCF >= -50       ? 90 :
    wkCF >= -100      ? 78 :
    wkCF >= -200      ? 62 :
    wkCF >= -300      ? 45 :
    wkCF >= -500      ? 28 :
    10
  )
  const cashflowLabel =
    wkCF >= 0    ? 'Positively geared' :
    wkCF >= -100 ? 'Low holding cost' :
    wkCF >= -250 ? 'Moderate holding cost' :
    wkCF >= -400 ? 'High holding cost' :
    'Very high holding cost'

  // ── 3. LVR risk score ─────────────────────────────────────────────────
  // <70% = great, 70-80% = fine, 80-90% = risky, >90% = very risky
  const lvrScore = clamp(
    results.lvr < 60  ? 100 :
    results.lvr < 70  ? 90 :
    results.lvr < 80  ? 75 :
    results.lvr < 85  ? 55 :
    results.lvr < 90  ? 35 :
    15
  )
  const lvrLabel =
    results.lvr < 70 ? 'Conservative LVR' :
    results.lvr < 80 ? 'Standard LVR' :
    results.lvr < 90 ? 'High LVR' :
    'Very high LVR'

  // ── 4. Holding cost as % of income ───────────────────────────────────
  // After-tax annual cost vs taxable income
  const annualCostPct = Math.abs(Math.min(results.afterTaxCashFlow, 0)) / inputs.taxableIncome * 100
  const holdingCostScore = clamp(
    results.afterTaxCashFlow >= 0  ? 100 :
    annualCostPct < 2   ? 90 :
    annualCostPct < 5   ? 75 :
    annualCostPct < 10  ? 55 :
    annualCostPct < 15  ? 35 :
    15
  )
  const holdingCostLabel =
    results.afterTaxCashFlow >= 0 ? 'Self-funding' :
    annualCostPct < 5  ? 'Manageable holding cost' :
    annualCostPct < 10 ? 'Moderate income impact' :
    'Significant income impact'

  // ── 5. Growth potential (based on growth rate input) ─────────────────
  const growthScore = clamp(
    inputs.capitalGrowthRate >= 8  ? 95 :
    inputs.capitalGrowthRate >= 6  ? 80 :
    inputs.capitalGrowthRate >= 4  ? 60 :
    inputs.capitalGrowthRate >= 2  ? 40 :
    20
  )
  const growthLabel =
    inputs.capitalGrowthRate >= 7 ? 'High growth suburb' :
    inputs.capitalGrowthRate >= 5 ? 'Moderate growth suburb' :
    inputs.capitalGrowthRate >= 3 ? 'Low growth suburb' :
    'Minimal growth expected'

  // ── 6. Vacancy risk ───────────────────────────────────────────────────
  const vacancyScore = clamp(
    inputs.vacancyRate <= 2  ? 100 :
    inputs.vacancyRate <= 4  ? 85 :
    inputs.vacancyRate <= 6  ? 65 :
    inputs.vacancyRate <= 8  ? 45 :
    25
  )
  const vacancyLabel =
    inputs.vacancyRate <= 2 ? 'Very low vacancy risk' :
    inputs.vacancyRate <= 4 ? 'Low vacancy risk' :
    inputs.vacancyRate <= 6 ? 'Moderate vacancy risk' :
    'High vacancy risk'

  // ── 7. Equity growth (projected 10yr equity vs upfront cost) ─────────
  const equityGrowth10yr = results.projectedValue - inputs.purchasePrice
  const equityMultiple   = equityGrowth10yr / results.totalUpfront
  const equityScore = clamp(
    equityMultiple >= 4 ? 100 :
    equityMultiple >= 3 ? 85 :
    equityMultiple >= 2 ? 70 :
    equityMultiple >= 1 ? 50 :
    30
  )
  const equityLabel =
    equityMultiple >= 3 ? 'Excellent equity growth' :
    equityMultiple >= 2 ? 'Strong equity growth' :
    equityMultiple >= 1 ? 'Moderate equity growth' :
    'Limited equity growth'

  // ── Weighted overall score ────────────────────────────────────────────
  const overall = Math.round(
    (yieldScore       * WEIGHTS.yield          / 100) +
    (cashflowScore    * WEIGHTS.cashflow        / 100) +
    (lvrScore         * WEIGHTS.lvr             / 100) +
    (holdingCostScore * WEIGHTS.holdingCost     / 100) +
    (growthScore      * WEIGHTS.growthPotential / 100) +
    (vacancyScore     * WEIGHTS.vacancyRisk     / 100) +
    (equityScore      * WEIGHTS.equityGrowth    / 100)
  )

  const label: ScoreBreakdown['label'] =
    overall >= 80 ? 'Excellent' :
    overall >= 65 ? 'Strong' :
    overall >= 50 ? 'Good' :
    overall >= 35 ? 'Moderate' :
    'Weak'

  const color =
    overall >= 80 ? '#16A34A' :
    overall >= 65 ? '#65A30D' :
    overall >= 50 ? '#C9963A' :
    overall >= 35 ? '#EA580C' :
    '#DC2626'

  // ── Strengths ─────────────────────────────────────────────────────────
  const strengths: string[] = []
  if (results.grossYield >= 4.5)          strengths.push(`Strong gross yield of ${results.grossYield.toFixed(2)}%`)
  if (results.weeklyAfterTaxCashFlow >= -100) strengths.push(results.weeklyAfterTaxCashFlow >= 0 ? 'Positively geared — property pays for itself' : `Low after-tax cost of only $${Math.abs(Math.round(results.weeklyAfterTaxCashFlow))}/wk`)
  if (results.taxRefund > 8000)            strengths.push(`Substantial ATO tax refund of $${Math.round(results.taxRefund).toLocaleString()}/yr`)
  if (results.lvr < 75)                    strengths.push(`Conservative LVR of ${results.lvr.toFixed(1)}% — good equity buffer`)
  if (inputs.capitalGrowthRate >= 6)       strengths.push(`${inputs.capitalGrowthRate}% growth assumption — strong capital upside`)
  if (inputs.vacancyRate <= 3)             strengths.push('Low vacancy risk in this area')
  if (equityMultiple >= 2.5)              strengths.push(`Equity projected to grow ${equityMultiple.toFixed(1)}× your upfront investment over ${inputs.holdYears} years`)

  // ── Risks ─────────────────────────────────────────────────────────────
  const risks: string[] = []
  if (results.weeklyAfterTaxCashFlow < -300) risks.push(`High holding cost of $${Math.abs(Math.round(results.weeklyAfterTaxCashFlow))}/wk — ensure income can sustain this`)
  if (results.lvr > 85)                   risks.push(`High LVR of ${results.lvr.toFixed(1)}% — limited equity buffer if values fall`)
  if (results.grossYield < 3.5)           risks.push(`Low gross yield of ${results.grossYield.toFixed(2)}% — heavily reliant on capital growth`)
  if (inputs.vacancyRate > 5)             risks.push('Elevated vacancy risk — cashflow more variable')
  if (annualCostPct > 10)                 risks.push(`Holding cost is ${annualCostPct.toFixed(0)}% of your income — rate rises could be stressful`)
  if (inputs.capitalGrowthRate < 4)       risks.push('Low growth assumption — returns depend heavily on yield')
  if (results.breakEvenRent > inputs.weeklyRent * 1.15) risks.push(`Break-even rent ($${Math.round(results.breakEvenRent)}/wk) is well above current rent — limited buffer`)

  // ── Recommendations ───────────────────────────────────────────────────
  const recommendations: string[] = []
  if (results.lvr > 80)     recommendations.push('Consider a larger deposit to reduce LVR below 80% and avoid LMI')
  if (results.weeklyAfterTaxCashFlow < -400) recommendations.push('Stress-test your cash flow at +1.5% and +2% interest rates before committing')
  if (inputs.buildingDepreciation === 0) recommendations.push('Commission a depreciation schedule — could unlock $4,000-$10,000+ in additional deductions')
  if (inputs.loanType === 'PI' && results.weeklyAfterTaxCashFlow < -200) recommendations.push('Consider Interest Only for first 5 years to reduce weekly cash flow pressure')
  recommendations.push('Verify growth rate assumption against recent sales data for this suburb')

  return {
    overall,
    label,
    color,
    components: {
      yield:          { score: Math.round(yieldScore),       label: yieldLabel,       weight: WEIGHTS.yield },
      cashflow:       { score: Math.round(cashflowScore),    label: cashflowLabel,    weight: WEIGHTS.cashflow },
      lvr:            { score: Math.round(lvrScore),         label: lvrLabel,         weight: WEIGHTS.lvr },
      holdingCost:    { score: Math.round(holdingCostScore), label: holdingCostLabel, weight: WEIGHTS.holdingCost },
      growthPotential:{ score: Math.round(growthScore),      label: growthLabel,      weight: WEIGHTS.growthPotential },
      vacancyRisk:    { score: Math.round(vacancyScore),     label: vacancyLabel,     weight: WEIGHTS.vacancyRisk },
      equityGrowth:   { score: Math.round(equityScore),      label: equityLabel,      weight: WEIGHTS.equityGrowth },
    },
    strengths: strengths.slice(0, 4),
    risks:     risks.slice(0, 4),
    recommendations: recommendations.slice(0, 4),
  }
}
