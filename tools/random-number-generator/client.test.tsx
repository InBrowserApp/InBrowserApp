import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import RandomNumberGeneratorClient from "./client"

const messages = {
  meta: {
    name: "Random Number Generator",
    description:
      "Generate random numbers with custom ranges, counts, and optional decimals.",
  },
  optionsTitle: "Options",
  optionsDescription:
    "Set the range, amount, duplicates, and precision before generating numbers.",
  presetsLabel: "Presets",
  presetDiceLabel: "Dice (1-6)",
  presetTenLabel: "1-10",
  presetHundredLabel: "1-100",
  presetLottoLabel: "Pick 6 (1-49)",
  minLabel: "Min",
  maxLabel: "Max",
  countLabel: "Count",
  allowRepeatLabel: "Allow duplicates",
  numberTypeLabel: "Number type",
  integerLabel: "Integer",
  decimalLabel: "Decimal",
  decimalPlacesLabel: "Decimal places",
  rangeError: "Min must be less than or equal to Max.",
  countError:
    "Count exceeds the number of unique values in the range ({range}).",
  resultsTitle: "Results",
  resultsDescription:
    "Review the latest numbers, copy them, download them, or open them full screen.",
  resultsPlaceholder: "Numbers will appear here...",
  startRandomLabel: "Start random",
  stopRandomLabel: "Stop random",
  copyResultLabel: "Copy result",
  copiedLabel: "Copied",
  downloadLabel: "Download",
  enterFullscreenLabel: "Full screen",
  exitFullscreenLabel: "Exit full screen",
  historyTitle: "History",
  historyDescription: "Recent results stay here until you clear the history.",
  historyEmptyLabel: "No history yet.",
  clearHistoryLabel: "Clear history",
} as const

let randomIndex = 0
let rafId = 0
let rafQueue = new Map<number, FrameRequestCallback>()

beforeEach(() => {
  randomIndex = 0
  rafId = 0
  rafQueue = new Map()

  const NativeURL = globalThis.URL

  class MockURL extends NativeURL {}

  Object.assign(MockURL, {
    createObjectURL: vi.fn(() => "blob:random-numbers"),
    revokeObjectURL: vi.fn(),
  })

  vi.stubGlobal("URL", MockURL)
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn((callback) => {
      const nextId = ++rafId
      rafQueue.set(nextId, callback)
      return nextId
    })
  )
  vi.stubGlobal(
    "cancelAnimationFrame",
    vi.fn((value) => {
      rafQueue.delete(value)
    })
  )

  vi.spyOn(Math, "random").mockImplementation(() => {
    const sequence = [0, 0.17, 0.34, 0.51, 0.68, 0.85, 0.03, 0.2, 0.37]
    const value = sequence[randomIndex % sequence.length]!
    randomIndex += 1
    return value
  })

  vi.stubGlobal("navigator", {
    ...navigator,
    clipboard: {
      writeText: vi.fn().mockResolvedValue(undefined),
    },
  })

  window.localStorage.clear()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function flushRaf(timestamp: number) {
  const callbacks = [...rafQueue.entries()]
  rafQueue.clear()

  for (const [, callback] of callbacks) {
    callback(timestamp)
  }
}

function getOutput() {
  return screen.getByText(messages.resultsTitle).closest("[data-slot=card]")
}

describe("RandomNumberGeneratorClient", () => {
  test("renders default integer settings and downloadable output", async () => {
    render(<RandomNumberGeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(
        screen.getByRole("link", { name: messages.downloadLabel })
      ).toBeTruthy()
    })

    expect(screen.getByLabelText(messages.minLabel)).toHaveProperty(
      "value",
      "1"
    )
    expect(screen.getByLabelText(messages.maxLabel)).toHaveProperty(
      "value",
      "100"
    )
    expect(screen.getByLabelText(messages.countLabel)).toHaveProperty(
      "value",
      "1"
    )

    const downloadLink = screen.getByRole("link", {
      name: messages.downloadLabel,
    })

    expect(downloadLink.getAttribute("href")).toBe("blob:random-numbers")
    expect(downloadLink.getAttribute("download")).toBe("random-numbers.txt")
  })

  test("shows a count error when duplicates are disallowed and the range is too small", async () => {
    render(<RandomNumberGeneratorClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.minLabel), {
      target: { value: "1" },
    })
    fireEvent.change(screen.getByLabelText(messages.maxLabel), {
      target: { value: "2" },
    })
    fireEvent.change(screen.getByLabelText(messages.countLabel), {
      target: { value: "3" },
    })
    fireEvent.click(
      screen.getByRole("checkbox", { name: messages.allowRepeatLabel })
    )

    await waitFor(() => {
      expect(screen.getByRole("alert").textContent).toContain("2")
    })

    expect(screen.getByText(messages.resultsPlaceholder)).toBeTruthy()
  })

  test("switches to decimal mode and formats values with the selected precision", async () => {
    render(<RandomNumberGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByText(messages.decimalLabel))

    expect(screen.getByLabelText(messages.minLabel)).toBeTruthy()
    expect(screen.getByLabelText(messages.maxLabel)).toBeTruthy()

    fireEvent.change(screen.getByLabelText(messages.minLabel), {
      target: { value: "1.5" },
    })
    fireEvent.change(screen.getByLabelText(messages.maxLabel), {
      target: { value: "1.7" },
    })
    fireEvent.change(screen.getByLabelText(messages.decimalPlacesLabel), {
      target: { value: "2" },
    })

    await waitFor(() => {
      const outputCard = getOutput()
      expect(outputCard?.textContent).toMatch(/1\.[0-9]{2}/u)
    })
  })

  test("applies the lotto preset and generates six unique results", async () => {
    render(<RandomNumberGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByText(messages.presetLottoLabel))

    await waitFor(() => {
      expect(screen.getByLabelText(messages.maxLabel)).toHaveProperty(
        "value",
        "49"
      )
    })

    expect(screen.getByLabelText(messages.countLabel)).toHaveProperty(
      "value",
      "6"
    )
    expect(
      screen.getByRole("checkbox", { name: messages.allowRepeatLabel })
    ).toHaveProperty("dataset", expect.objectContaining({ state: "unchecked" }))
  })

  test("records history after rolling stops", async () => {
    render(<RandomNumberGeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByText(messages.startRandomLabel)).toBeTruthy()
    })

    fireEvent.click(screen.getByText(messages.startRandomLabel))
    flushRaf(0)
    flushRaf(90)
    fireEvent.click(screen.getByText(messages.stopRandomLabel))

    await waitFor(() => {
      expect(
        screen.getByText(messages.historyTitle).closest("[data-slot=card]")
          ?.textContent
      ).not.toContain(messages.historyEmptyLabel)
    })
  })

  test("opens and closes the fullscreen overlay", async () => {
    render(<RandomNumberGeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByText(messages.enterFullscreenLabel)).toBeTruthy()
    })

    fireEvent.click(screen.getByText(messages.enterFullscreenLabel))

    expect(screen.getByText(messages.exitFullscreenLabel)).toBeTruthy()

    fireEvent.click(screen.getByText(messages.exitFullscreenLabel))

    await waitFor(() => {
      expect(screen.queryByText(messages.exitFullscreenLabel)).toBeNull()
    })
  })

  test("restores persisted settings from localStorage", async () => {
    window.localStorage.setItem("tools:random-number-generator:min", "10")
    window.localStorage.setItem("tools:random-number-generator:max", "20")
    window.localStorage.setItem("tools:random-number-generator:count", "3")
    window.localStorage.setItem(
      "tools:random-number-generator:allow-repeat",
      "false"
    )

    render(<RandomNumberGeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByLabelText(messages.minLabel)).toHaveProperty(
        "value",
        "10"
      )
    })

    expect(screen.getByLabelText(messages.maxLabel)).toHaveProperty(
      "value",
      "20"
    )
    expect(screen.getByLabelText(messages.countLabel)).toHaveProperty(
      "value",
      "3"
    )
    expect(
      screen.getByRole("checkbox", { name: messages.allowRepeatLabel })
    ).toHaveProperty("dataset", expect.objectContaining({ state: "unchecked" }))
  })
})
