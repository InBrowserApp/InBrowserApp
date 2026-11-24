import { expect, test } from "vitest"

import { projectCompoundInterest } from "./compound-interest"

const example = {
  initialAmount: 10_000,
  monthlyContribution: 100,
  annualRate: 5,
  years: 10,
  frequency: "monthly",
  timing: "end",
} as const

test("projects the worked example and includes the starting point", () => {
  const rows = projectCompoundInterest(example)

  expect(rows).toHaveLength(11)
  expect(rows[0]).toEqual({
    year: 0,
    balance: 10_000,
    contributed: 10_000,
    interest: 0,
  })
  expect(rows[10]?.balance).toBeCloseTo(31_998.32, 2)
  expect(rows[10]?.contributed).toBe(22_000)
  expect(rows[10]?.interest).toBeCloseTo(9_998.32, 2)
})

test("converts quarterly compounding to an equivalent monthly rate", () => {
  const inputs = {
    ...example,
    frequency: "quarterly",
    annualRate: 12,
    years: 1,
  } as const
  const monthlyFactor = Math.pow(1.03, 1 / 3)
  let balance = inputs.initialAmount
  for (let month = 0; month < 12; month++) {
    balance = (balance + inputs.monthlyContribution) * monthlyFactor
  }

  const start = projectCompoundInterest({ ...inputs, timing: "start" })[1]!
  const end = projectCompoundInterest(inputs)[1]!
  expect(start.balance).toBeCloseTo(balance, 9)
  expect(start.balance).toBeGreaterThan(end.balance)
  expect(start.contributed).toBe(end.contributed)
})

test("keeps contributions exact at zero interest", () => {
  const rows = projectCompoundInterest({
    ...example,
    initialAmount: 0,
    monthlyContribution: 0.1,
    annualRate: 0,
    timing: "start",
  })

  expect(rows[10]).toEqual({
    year: 10,
    balance: 12,
    contributed: 12,
    interest: 0,
  })
})

test("reports a loss and keeps the last contribution at a complete annual loss", () => {
  const rows = projectCompoundInterest({
    ...example,
    annualRate: -100,
    frequency: "annually",
    years: 1,
  })

  expect(rows[1]).toEqual({
    year: 1,
    balance: 100,
    contributed: 11_200,
    interest: -11_100,
  })
})
