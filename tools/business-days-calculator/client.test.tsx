import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import BusinessDaysCalculatorClient from "./client"
import { STORAGE_KEYS } from "./client/storage"

const messages = {
  meta: {
    name: "Business Days Calculator",
    description:
      "Count business days between dates and shift dates with custom weekends and holidays.",
  },
  rulesTitle: "Business Day Rules",
  selectionModeLabel: "Select by",
  weekendDaysLabel: "Weekend days",
  workingDaysLabel: "Working days",
  weekendHint: "Select which days are weekends.",
  workingHint: "Select which days are working days.",
  noWorkingDaysLabel: "No working days selected.",
  holidaysLabel: "Holidays",
  holidayPlaceholder: "2026-01-15 (YYYY-MM-DD), one per line",
  holidayHint: "Optional. Holidays on weekdays are excluded.",
  holidayNote: "Weekend holidays are already excluded by weekend settings.",
  invalidHolidaysLabel: "Invalid entries: {count}",
  countTitle: "Count Business Days",
  startDateLabel: "Start date",
  endDateLabel: "End date",
  includeEndpointsLabel: "Include start/end dates",
  rangeSwappedLabel:
    "End date is before start date; results use swapped dates.",
  businessDaysLabel: "Business days",
  totalDaysLabel: "Total days",
  weekendDaysCountLabel: "Weekend days",
  holidayDaysCountLabel: "Holidays (weekdays)",
  offsetTitle: "Add/Subtract Business Days",
  baseDateLabel: "Base date",
  businessDaysOffsetLabel: "Business days",
  includeStartLabel: "Count start date as day 1",
  addLabel: "Add",
  subtractLabel: "Subtract",
  resultDateLabel: "Date",
  copyLabel: "Copy",
  copiedLabel: "Copied",
  weekdaySunShort: "Sun",
  weekdayMonShort: "Mon",
  weekdayTueShort: "Tue",
  weekdayWedShort: "Wed",
  weekdayThuShort: "Thu",
  weekdayFriShort: "Fri",
  weekdaySatShort: "Sat",
} as const

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})

describe("BusinessDaysCalculatorClient", () => {
  test("restores persisted state and derives count plus offset results", async () => {
    window.localStorage.setItem(STORAGE_KEYS.startDate, "2026-04-20")
    window.localStorage.setItem(STORAGE_KEYS.endDate, "2026-04-26")
    window.localStorage.setItem(STORAGE_KEYS.baseDate, "2026-04-20")
    window.localStorage.setItem(STORAGE_KEYS.dayOffset, "3")
    window.localStorage.setItem(STORAGE_KEYS.includeEndpoints, "true")
    window.localStorage.setItem(STORAGE_KEYS.includeStart, "false")
    window.localStorage.setItem(STORAGE_KEYS.weekdayMode, "weekend")
    window.localStorage.setItem(
      STORAGE_KEYS.weekendDays,
      JSON.stringify([0, 6])
    )
    window.localStorage.setItem(STORAGE_KEYS.holidayInput, "2026-04-22")

    render(<BusinessDaysCalculatorClient messages={messages} />)

    const countCard = screen.getByTestId("business-days-count-card")
    const offsetCard = screen.getByTestId("business-days-offset-card")

    await waitFor(() => {
      expect(within(countCard).getByLabelText("Start date")).toHaveProperty(
        "value",
        "2026-04-20"
      )
    })

    expect(
      within(countCard).getByTestId("business-days-result").textContent
    ).toBe("4")
    expect(within(countCard).getByTestId("total-days-result").textContent).toBe(
      "7"
    )
    expect(within(offsetCard).getByTestId("add-date-result").textContent).toBe(
      "2026-04-24"
    )
    expect(
      within(offsetCard).getByTestId("subtract-date-result").textContent
    ).toBe("2026-04-15")
  })

  test("switches to working-day mode and recalculates from selected working days", async () => {
    window.localStorage.setItem(STORAGE_KEYS.startDate, "2026-04-20")
    window.localStorage.setItem(STORAGE_KEYS.endDate, "2026-04-26")
    window.localStorage.setItem(STORAGE_KEYS.baseDate, "2026-04-20")
    window.localStorage.setItem(STORAGE_KEYS.dayOffset, "2")
    window.localStorage.setItem(
      STORAGE_KEYS.weekendDays,
      JSON.stringify([0, 6])
    )

    render(<BusinessDaysCalculatorClient messages={messages} />)

    const rulesCard = screen.getByTestId("business-days-rules-card")
    const countCard = screen.getByTestId("business-days-count-card")

    await waitFor(() => {
      expect(within(countCard).getByLabelText("Start date")).toHaveProperty(
        "value",
        "2026-04-20"
      )
    })

    fireEvent.click(
      within(rulesCard).getByRole("radio", { name: "Working days" })
    )
    fireEvent.click(within(rulesCard).getByTestId("weekday-toggle-5"))

    await waitFor(() => {
      expect(
        within(countCard).getByTestId("business-days-result").textContent
      ).toBe("4")
      expect(
        within(rulesCard).queryByText("No working days selected.")
      ).toBeNull()
    })
  })

  test("shows invalid holiday feedback and no-working-days guardrails", async () => {
    window.localStorage.setItem(STORAGE_KEYS.startDate, "2026-04-20")
    window.localStorage.setItem(STORAGE_KEYS.endDate, "2026-04-20")
    window.localStorage.setItem(STORAGE_KEYS.baseDate, "2026-04-20")

    render(<BusinessDaysCalculatorClient messages={messages} />)

    const rulesCard = screen.getByTestId("business-days-rules-card")
    const offsetCard = screen.getByTestId("business-days-offset-card")

    await waitFor(() => {
      expect(within(rulesCard).getByTestId("holiday-input")).toBeTruthy()
    })

    fireEvent.change(within(rulesCard).getByTestId("holiday-input"), {
      target: { value: "invalid\n2026-04-25" },
    })

    for (let index = 1; index <= 5; index += 1) {
      fireEvent.click(within(rulesCard).getByTestId(`weekday-toggle-${index}`))
    }

    await waitFor(() => {
      expect(screen.getByText("Invalid entries: 1")).toBeTruthy()
      expect(screen.getAllByText("No working days selected.")).toHaveLength(2)
      expect(within(offsetCard).getAllByText("—")).toHaveLength(2)
    })
  })

  test("handles reversed ranges and start-inclusive offsets", async () => {
    window.localStorage.setItem(STORAGE_KEYS.startDate, "2026-04-26")
    window.localStorage.setItem(STORAGE_KEYS.endDate, "2026-04-20")
    window.localStorage.setItem(STORAGE_KEYS.baseDate, "2026-04-20")
    window.localStorage.setItem(STORAGE_KEYS.dayOffset, "1")
    window.localStorage.setItem(STORAGE_KEYS.includeStart, "true")

    render(<BusinessDaysCalculatorClient messages={messages} />)

    const countCard = screen.getByTestId("business-days-count-card")
    const offsetCard = screen.getByTestId("business-days-offset-card")

    await waitFor(() => {
      expect(screen.getByText(messages.rangeSwappedLabel)).toBeTruthy()
      expect(
        within(offsetCard).getByTestId("add-date-result").textContent
      ).toBe("2026-04-20")
      expect(
        within(offsetCard).getByTestId("subtract-date-result").textContent
      ).toBe("2026-04-20")
    })

    fireEvent.click(
      within(countCard).getByRole("switch", {
        name: "Include start/end dates",
      })
    )

    await waitFor(() => {
      expect(
        within(countCard).getByTestId("business-days-result").textContent
      ).toBe("4")
    })
  })

  test("updates direct date and offset inputs", async () => {
    window.localStorage.setItem(STORAGE_KEYS.startDate, "2026-04-20")
    window.localStorage.setItem(STORAGE_KEYS.endDate, "2026-04-26")
    window.localStorage.setItem(STORAGE_KEYS.baseDate, "2026-04-20")
    window.localStorage.setItem(STORAGE_KEYS.dayOffset, "2")

    render(<BusinessDaysCalculatorClient messages={messages} />)

    const countCard = screen.getByTestId("business-days-count-card")
    const offsetCard = screen.getByTestId("business-days-offset-card")

    await waitFor(() => {
      expect(
        within(countCard).getByTestId("business-days-result").textContent
      ).toBe("5")
    })

    fireEvent.change(within(countCard).getByTestId("start-date-input"), {
      target: { value: "2026-04-21" },
    })
    fireEvent.change(within(countCard).getByTestId("end-date-input"), {
      target: { value: "2026-04-24" },
    })
    fireEvent.change(within(offsetCard).getByTestId("base-date-input"), {
      target: { value: "2026-04-23" },
    })
    fireEvent.change(
      within(offsetCard).getByTestId("business-days-offset-input"),
      {
        target: { value: "-4" },
      }
    )

    await waitFor(() => {
      expect(
        within(countCard).getByTestId("business-days-result").textContent
      ).toBe("4")
      expect(
        within(offsetCard).getByTestId("add-date-result").textContent
      ).toBe("2026-04-23")
      expect(
        within(offsetCard).getByTestId("subtract-date-result").textContent
      ).toBe("2026-04-23")
    })
  })
})
