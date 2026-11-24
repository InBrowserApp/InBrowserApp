const compoundingPeriods = {
  daily: 365,
  monthly: 12,
  quarterly: 4,
  semiannually: 2,
  annually: 1,
} as const

type Frequency = keyof typeof compoundingPeriods
type ContributionTiming = "start" | "end"

type ProjectionInputs = {
  initialAmount: number
  monthlyContribution: number
  annualRate: number
  years: number
  frequency: Frequency
  timing: ContributionTiming
}

type YearProjection = {
  year: number
  balance: number
  contributed: number
  interest: number
}

function projectCompoundInterest({
  initialAmount,
  monthlyContribution,
  annualRate,
  years,
  frequency,
  timing,
}: ProjectionInputs): YearProjection[] {
  const periods = compoundingPeriods[frequency]
  const monthlyLogGrowth =
    (Math.log1p(annualRate / (100 * periods)) * periods) / 12
  const monthlyRate = Math.expm1(monthlyLogGrowth)
  const depositGrowth = timing === "start" ? Math.exp(monthlyLogGrowth) : 1

  const projection = [
    {
      year: 0,
      balance: initialAmount,
      contributed: initialAmount,
      interest: 0,
    },
  ]

  for (let year = 1; year <= years; year++) {
    const months = year * 12
    const growth = Math.exp(monthlyLogGrowth * months)
    // The sum of the growth factors for all month-end contributions.
    const annuity =
      monthlyRate === 0
        ? months
        : Math.expm1(monthlyLogGrowth * months) / monthlyRate
    const contributed = initialAmount + monthlyContribution * months
    const balance =
      initialAmount * growth + monthlyContribution * (annuity * depositGrowth)

    projection.push({
      year,
      balance,
      contributed,
      interest: balance - contributed,
    })
  }

  return projection
}

export { projectCompoundInterest }
export type { ContributionTiming, Frequency, YearProjection }
