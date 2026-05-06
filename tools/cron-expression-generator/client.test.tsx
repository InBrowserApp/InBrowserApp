import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import CronExpressionGeneratorClient from "./client"
import messages from "./messages/en.json"

const STORAGE_KEY = "tools:cron-expression-generator:expression"

function renderClient() {
  return render(
    <CronExpressionGeneratorClient language="en" messages={messages} />
  )
}

function getCard(title: string) {
  const titleElement = screen
    .getAllByText((_, element) => {
      return (
        element?.getAttribute("data-slot") === "card-title" &&
        element.textContent?.startsWith(title)
      )
    })
    .at(0)
  const card = titleElement?.closest('[data-slot="card"]')

  if (!card) {
    throw new Error(`Card not found: ${title}`)
  }

  return within(card as HTMLElement)
}

function getExpression() {
  const expression = screen
    .getAllByText(/^(\*|[\d*/, -])+$/)
    .find((element) => element.tagName.toLowerCase() === "code")

  return expression?.textContent
}

describe("CronExpressionGeneratorClient", () => {
  beforeEach(() => {
    window.localStorage.clear()
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    })
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  test("renders default output, field cards, and next run previews", () => {
    renderClient()

    expect(screen.getByText("* * * * *")).toBeTruthy()
    expect(screen.getByText(messages.output.noteTitle)).toBeTruthy()
    expect(screen.getByText(messages.fields.title)).toBeTruthy()
    expect(screen.getByText(messages.nextRuns.title)).toBeTruthy()
    expect(screen.getAllByRole("row").length).toBeGreaterThan(1)
  })

  test("copies the generated expression", async () => {
    renderClient()

    fireEvent.click(screen.getByRole("button", { name: messages.actions.copy }))

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("* * * * *")
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: messages.actions.copied })
      ).toBeTruthy()
    })
  })

  test("applies presets and persists the resulting expression", async () => {
    renderClient()

    fireEvent.click(
      screen.getByRole("button", {
        name: messages.presets.items.dailyNoon,
      })
    )

    await waitFor(() => {
      expect(screen.getByText("0 12 * * *")).toBeTruthy()
    })
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("0 12 * * *")
  })

  test("restores stored expressions and shows impossible schedules as empty", async () => {
    window.localStorage.setItem(STORAGE_KEY, "0 0 31 2 *")

    renderClient()

    await waitFor(() => {
      expect(screen.getByText("0 0 31 2 *")).toBeTruthy()
    })
    expect(screen.getByText(messages.nextRuns.emptyTitle)).toBeTruthy()
  })

  test("updates interval, specific, and range field modes", async () => {
    renderClient()

    const hourCard = getCard(messages.fields.labels.hour)
    fireEvent.click(
      hourCard.getByRole("radio", { name: messages.fields.interval })
    )
    fireEvent.change(
      hourCard.getByRole("spinbutton", {
        name: messages.fields.intervalPrefix,
      }),
      { target: { value: "6" } }
    )

    await waitFor(() => {
      expect(screen.getByText("* */6 * * *")).toBeTruthy()
    })

    const minuteCard = getCard(messages.fields.labels.minute)
    fireEvent.click(
      minuteCard.getByRole("radio", { name: messages.fields.specific })
    )
    fireEvent.click(minuteCard.getByRole("checkbox", { name: "5" }))

    await waitFor(() => {
      expect(screen.getByText("5 */6 * * *")).toBeTruthy()
    })

    const monthCard = getCard(messages.fields.labels.month)
    fireEvent.click(
      monthCard.getByRole("radio", { name: messages.fields.range })
    )

    await waitFor(() => {
      expect(screen.getByText("5 */6 * 1-12 *")).toBeTruthy()
    })
  })

  test("reset returns to every-minute scheduling", async () => {
    renderClient()

    fireEvent.click(
      screen.getByRole("button", {
        name: messages.presets.items.weekdayMorning,
      })
    )
    await waitFor(() => {
      expect(screen.getByText("0 9 * * 1-5")).toBeTruthy()
    })

    fireEvent.click(
      screen.getByRole("button", { name: messages.actions.reset })
    )

    await waitFor(() => {
      expect(getExpression()).toBe("* * * * *")
    })
  })
})
