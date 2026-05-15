import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import UuidV7GeneratorClient from "./client"

const messages = {
  meta: {
    name: "UUID v7 Generator",
    description: "Generate timestamp-sortable UUID v7 identifiers.",
  },
  optionsTitle: "Options",
  optionsDescription: "Choose how many UUID v7 identifiers to generate.",
  countLabel: "Count",
  countDescription: "Generate between 1 and 100 UUIDs in one batch.",
  resultsTitle: "Generated UUIDs",
  resultsDescription: "UUID v7 values are generated locally in your browser.",
  resultsPlaceholder: "Generated UUID v7 values will appear here...",
  batchSummaryLabel: "Batch summary",
  versionLabel: "Version",
  timestampLabel: "Timestamp",
  timestampMillisecondsLabel: "Unix milliseconds",
  generatedCountLabel: "Generated",
  unavailableLabel: "Unavailable",
  copyResultsLabel: "Copy UUIDs",
  copiedLabel: "Copied",
  downloadResultsLabel: "Download result",
  regenerateLabel: "Regenerate",
} as const

let byteOffset = 0
let nowMs = 1_700_000_000_000

beforeEach(() => {
  byteOffset = 0
  nowMs = 1_700_000_000_000

  const NativeURL = globalThis.URL

  class MockURL extends NativeURL {}

  Object.assign(MockURL, {
    createObjectURL: vi.fn(() => "blob:uuid-v7-results"),
    revokeObjectURL: vi.fn(),
  })

  vi.stubGlobal("URL", MockURL)
  window.localStorage.clear()
  vi.spyOn(Date, "now").mockImplementation(() => nowMs)
  vi.spyOn(globalThis.crypto, "getRandomValues").mockImplementation((array) => {
    const values = array as Uint8Array

    for (let index = 0; index < values.length; index += 1) {
      values[index] = (byteOffset + index) % 256
    }

    byteOffset = (byteOffset + values.length) % 256
    return array
  })
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function getResultsTextarea() {
  return screen.getByLabelText(messages.resultsTitle) as HTMLTextAreaElement
}

describe("UuidV7GeneratorClient", () => {
  test("renders defaults and generates ten UUID v7 identifiers", async () => {
    render(<UuidV7GeneratorClient messages={messages} />)

    expect(screen.getByLabelText(messages.countLabel)).toHaveProperty(
      "value",
      "10"
    )

    await waitFor(() => {
      const lines = getResultsTextarea().value.trim().split("\n")

      expect(lines).toHaveLength(10)
      expect(
        lines.every((value) =>
          /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u.test(
            value
          )
        )
      ).toBe(true)
    })

    expect(screen.getByLabelText(messages.batchSummaryLabel)).toBeTruthy()
    expect(screen.getByText("UUID v7")).toBeTruthy()
    expect(screen.getByText("1700000000000")).toBeTruthy()
    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  test("persists changed count and regenerates a smaller batch", async () => {
    render(<UuidV7GeneratorClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.countLabel), {
      target: { value: "3" },
    })

    await waitFor(() => {
      expect(window.localStorage.getItem("tools:uuid-v7-generator:count")).toBe(
        "3"
      )
      expect(getResultsTextarea().value.trim().split("\n")).toHaveLength(3)
    })
  })

  test("restores saved count from localStorage", async () => {
    window.localStorage.setItem("tools:uuid-v7-generator:count", "2")

    render(<UuidV7GeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByLabelText(messages.countLabel)).toHaveProperty(
        "value",
        "2"
      )
      expect(getResultsTextarea().value.trim().split("\n")).toHaveLength(2)
    })
  })

  test("regenerates a fresh batch when the button is clicked", async () => {
    render(<UuidV7GeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(getResultsTextarea().value).not.toBe("")
    })

    const before = getResultsTextarea().value
    nowMs += 1

    fireEvent.click(screen.getByText(messages.regenerateLabel))

    await waitFor(() => {
      expect(getResultsTextarea().value).not.toBe(before)
      expect(screen.getByText("1700000000001")).toBeTruthy()
    })
  })

  test("exposes generated UUIDs as a downloadable text file", async () => {
    render(<UuidV7GeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(getResultsTextarea().value).not.toBe("")
    })

    const downloadLink = screen.getByRole("link", {
      name: messages.downloadResultsLabel,
    })

    expect(downloadLink.getAttribute("href")).toBe("blob:uuid-v7-results")
    expect(downloadLink.getAttribute("download")).toBe("uuid-v7-10.txt")
  })
})
