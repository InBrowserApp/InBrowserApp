import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"

import DateAgeCalculator from "./client"
import messages from "./messages/en.json"

function tab(name: string) {
  fireEvent.mouseDown(screen.getByRole("tab", { name }), {
    button: 0,
    ctrlKey: false,
  })
}

function input(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } })
}

function result(name: string) {
  return screen.getByRole("status", { name }).textContent
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] })
  vi.setSystemTime(new Date(2025, 1, 28, 12))
  render(<DateAgeCalculator lang="en" messages={messages} />)
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

test("counts leap-day crossings, keeps entered dates across tabs, and clears missing results", () => {
  expect(result(messages.differenceResult)).toBe("7")
  input(messages.startDate, "2024-03-01")
  input(messages.endDate, "2024-02-28")
  expect(result(messages.differenceResult)).toBe("2")

  tab(messages.offsetTab)
  tab(messages.differenceTab)
  expect(screen.getByLabelText(messages.startDate)).toHaveProperty(
    "value",
    "2024-03-01"
  )
  expect(result(messages.differenceResult)).toBe("2")

  input(messages.endDate, "")
  expect(result(messages.differenceResult)).toBe("—")
  input(messages.endDate, "2024-03-01")
  expect(result(messages.differenceResult)).toBe("0")
})

test("shows both offset dates and recovers from invalid counts and boundary shifts", () => {
  tab(messages.offsetTab)
  input(messages.baseDate, "2024-03-01")
  input(messages.dayCount, "1")
  expect(result(messages.afterResult)).toBe("2024-03-02")
  expect(result(messages.beforeResult)).toBe("2024-02-29")

  input(messages.baseDate, "0001-01-01")
  expect(result(messages.beforeResult)).toBe(messages.outOfRange)

  input(messages.baseDate, "9999-12-31")
  expect(result(messages.afterResult)).toBe(messages.outOfRange)
  expect(result(messages.beforeResult)).toBe("9999-12-30")

  input(messages.dayCount, "-1")
  expect(screen.getByText(messages.invalidDayCount)).toBeTruthy()
  expect(result(messages.beforeResult)).toBe("—")
  input(messages.dayCount, "")
  expect(screen.queryByText(messages.invalidDayCount)).toBeNull()
  input(messages.dayCount, "0")
  expect(result(messages.afterResult)).toBe("9999-12-31")
})

test("uses the device's current date, rejects future birthdays, and refreshes after focus", () => {
  tab(messages.ageTab)
  expect(screen.getByLabelText(messages.today)).toHaveProperty(
    "value",
    "2025-02-28"
  )
  expect(result(messages.ageResult)).toBe("—")

  input(messages.birthDate, "2025-03-01")
  expect(screen.getByText(messages.futureBirthDate)).toBeTruthy()
  expect(result(messages.ageResult)).toBe("—")
  input(messages.birthDate, "2000-02-29")
  expect(result(messages.ageResult)).toBe("25")

  input(messages.birthDate, "2000-03-01")
  expect(result(messages.ageResult)).toBe("24")
  vi.setSystemTime(new Date(2025, 2, 1, 12))
  act(() => window.dispatchEvent(new Event("focus")))
  expect(result(messages.ageResult)).toBe("25")
})
