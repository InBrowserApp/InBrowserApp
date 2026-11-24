import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test } from "vitest"

import Calculator from "./client"
import german from "./messages/de.json"
import english from "./messages/en.json"

afterEach(cleanup)

function change(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } })
}

function projectedBalance() {
  return document.querySelector("dd[aria-live]")?.textContent
}

test("updates results immediately and can restore the example", () => {
  render(<Calculator lang="en" messages={english} />)

  expect(projectedBalance()).toBe("31,998.32")

  change(english.timing, "start")
  expect(projectedBalance()).toBe("32,063.02")

  change(english.frequency, "annually")
  expect(projectedBalance()).toBe("31,788.15")

  fireEvent.click(screen.getByRole("button", { name: english.reset }))
  expect(projectedBalance()).toBe("31,998.32")
})

test("clearing a required rate hides old results until a valid rate is entered", () => {
  render(<Calculator lang="en" messages={english} />)

  change(english.annualRate, "")
  expect(projectedBalance()).toBeUndefined()
  expect(screen.getByText(english.rateError)).toBeTruthy()

  change(english.annualRate, "0")
  expect(projectedBalance()).toBe("22,000.00")

  change(english.initialAmount, "")
  expect(projectedBalance()).toBe("12,000.00")
})

test("uses the selected language to read amounts and format the result", () => {
  render(<Calculator lang="de" messages={german} />)

  change(german.initialAmount, "1.234,56")
  change(german.monthlyContribution, "0")
  change(german.annualRate, "2,5")
  change(german.frequency, "annually")
  change(german.years, "1")
  expect(projectedBalance()).toBe("1.265,42")

  change(german.monthlyContribution, "-10")
  expect(screen.getByText(german.amountError)).toBeTruthy()
  change(german.monthlyContribution, "0")

  change(german.years, "1,5")
  expect(screen.getByText(german.yearsError)).toBeTruthy()
})

test("offers recovery when a projection exceeds numeric precision", () => {
  render(<Calculator lang="en" messages={english} />)

  change(english.initialAmount, "1.7e308")
  expect(screen.getByText(english.resultError)).toBeTruthy()

  change(english.initialAmount, "1e20")
  expect(projectedBalance()).toBe("1.65E20")
})
