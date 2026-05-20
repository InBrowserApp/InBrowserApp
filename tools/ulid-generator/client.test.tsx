import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import UlidGeneratorClient from "./client"
import { formatDateTimeLocalInput } from "./core/local-date"
import { ULID_LENGTH, ULID_MAX_TIMESTAMP_MS } from "./core/ulid"

const NOW_MS = Date.UTC(2026, 3, 15, 15, 20, 30, 123)

const messages = {
  meta: {
    name: "ULID Generator",
    description: "Generate ULIDs in your browser with optional timestamps.",
  },
  optionsTitle: "Options",
  optionsDescription:
    "Start with one ULID, then switch to batch mode when you need a sortable list.",
  generationModeLabel: "Generation Mode",
  generationModeDescription:
    "Single mode keeps the output focused; batch mode unlocks count and monotonic sorting.",
  generationSingleLabel: "Single",
  generationBatchLabel: "Batch",
  countLabel: "Count",
  countDescription: "Batch mode can generate 2 to 100 ULIDs at a time.",
  timestampModeLabel: "Timestamp mode",
  timestampModeDescription:
    "Use the current clock value or pin the ULID timestamp to a specific Unix millisecond.",
  timestampNowLabel: "Use current time",
  timestampCustomLabel: "Custom time",
  customDateTimeLabel: "Custom date/time",
  customUnixMillisecondsLabel: "Custom Unix milliseconds",
  setNowLabel: "Set to now",
  monotonicBatchLabel: "Monotonic batch",
  monotonicBatchDescription:
    "Keep IDs generated in the same millisecond sorted by incrementing the random segment within this batch.",
  timestampInvalid: "Invalid timestamp.",
  timestampOutOfRange:
    "Timestamp must be between {min} and {max} (Unix milliseconds).",
  resultsTitle: "Results",
  resultsDescription:
    "ULID values generated locally for the selected mode and timestamp.",
  resultsPlaceholder: "Generated ULIDs will appear here…",
  generatedAtLabel: "Generated with Unix milliseconds: {milliseconds}",
  copyResultsLabel: "Copy result",
  copiedLabel: "Copied",
  downloadResultsLabel: "Download",
  regenerateLabel: "Regenerate",
} as const

let byteOffset = 0

beforeEach(() => {
  byteOffset = 0

  vi.spyOn(Date, "now").mockReturnValue(NOW_MS)

  const NativeURL = globalThis.URL

  class MockURL extends NativeURL {}

  Object.assign(MockURL, {
    createObjectURL: vi.fn(() => "blob:ulid-results"),
    revokeObjectURL: vi.fn(),
  })

  vi.stubGlobal("URL", MockURL)
  window.localStorage.clear()

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

describe("UlidGeneratorClient", () => {
  test("renders the default single result and download link", async () => {
    render(<UlidGeneratorClient messages={messages} language="en" />)

    expect(
      screen
        .getByRole("radio", { name: messages.generationSingleLabel })
        .getAttribute("aria-checked")
    ).toBe("true")
    expect(screen.queryByLabelText(messages.countLabel)).toBeNull()
    expect(screen.queryByLabelText(messages.monotonicBatchLabel)).toBeNull()

    await waitFor(() => {
      const lines = getResultsTextarea().value.trim().split("\n")

      expect(lines).toHaveLength(1)
      expect(lines.every((value) => value.length === ULID_LENGTH)).toBe(true)
    })

    expect(
      screen.getByText("Generated with Unix milliseconds: 1,776,266,430,123")
    ).toBeTruthy()
    expect(
      screen.getByRole("link", { name: messages.downloadResultsLabel })
    ).toHaveProperty("download", `ulid-${NOW_MS}.txt`)
  })

  test("switches to a monotonic batch", async () => {
    render(<UlidGeneratorClient messages={messages} language="en" />)

    fireEvent.click(
      screen.getByRole("radio", { name: messages.generationBatchLabel })
    )

    expect(screen.getByLabelText(messages.countLabel)).toHaveProperty(
      "value",
      "5"
    )
    expect(
      screen
        .getByLabelText(messages.monotonicBatchLabel)
        .getAttribute("aria-checked")
    ).toBe("true")

    await waitFor(() => {
      const lines = getResultsTextarea().value.trim().split("\n")

      expect(lines).toHaveLength(5)
      expect(lines.every((value) => value.length === ULID_LENGTH)).toBe(true)
      expect(lines).toEqual([...lines].sort())
    })

    expect(
      screen.getByRole("link", { name: messages.downloadResultsLabel })
    ).toHaveProperty("download", `ulid-5-${NOW_MS}.txt`)
  })

  test("switches to a custom unix millisecond timestamp", async () => {
    render(<UlidGeneratorClient messages={messages} language="en" />)

    fireEvent.click(
      screen.getByRole("radio", { name: messages.timestampCustomLabel })
    )
    fireEvent.change(
      screen.getByLabelText(messages.customUnixMillisecondsLabel),
      {
        target: { value: "1234" },
      }
    )

    await waitFor(() => {
      expect(
        screen.getByText("Generated with Unix milliseconds: 1,234")
      ).toBeTruthy()
    })

    expect(screen.getByLabelText(messages.customDateTimeLabel)).toHaveProperty(
      "value",
      formatDateTimeLocalInput(1234)
    )
  })

  test("updates count, datetime, monotonic mode, and set-now controls", async () => {
    render(<UlidGeneratorClient messages={messages} language="en" />)

    fireEvent.click(
      screen.getByRole("radio", { name: messages.generationBatchLabel })
    )
    fireEvent.change(screen.getByLabelText(messages.countLabel), {
      target: { value: "3" },
    })
    fireEvent.click(
      screen.getByRole("radio", { name: messages.timestampCustomLabel })
    )
    fireEvent.change(screen.getByLabelText(messages.customDateTimeLabel), {
      target: { value: "1970-01-01T00:00:02.345" },
    })
    fireEvent.click(screen.getByLabelText(messages.monotonicBatchLabel))

    await waitFor(() => {
      const lines = getResultsTextarea().value.trim().split("\n")

      expect(lines).toHaveLength(3)
      expect(
        screen.getByLabelText(messages.customUnixMillisecondsLabel)
      ).toHaveProperty(
        "value",
        String(new Date(1970, 0, 1, 0, 0, 2, 345).getTime())
      )
      expect(
        screen
          .getByLabelText(messages.monotonicBatchLabel)
          .getAttribute("aria-checked")
      ).toBe("false")
    })

    fireEvent.click(screen.getByRole("button", { name: messages.setNowLabel }))

    await waitFor(() => {
      expect(
        screen.getByLabelText(messages.customUnixMillisecondsLabel)
      ).toHaveProperty("value", String(NOW_MS))
    })
  })

  test("shows an error and clears output for invalid custom timestamps", async () => {
    render(<UlidGeneratorClient messages={messages} language="en" />)

    fireEvent.click(
      screen.getByRole("radio", { name: messages.timestampCustomLabel })
    )
    fireEvent.change(
      screen.getByLabelText(messages.customUnixMillisecondsLabel),
      {
        target: { value: String(ULID_MAX_TIMESTAMP_MS + 1) },
      }
    )

    await waitFor(() => {
      expect(
        screen.getByText(
          `Timestamp must be between 0 and ${ULID_MAX_TIMESTAMP_MS} (Unix milliseconds).`
        )
      ).toBeTruthy()
      expect(getResultsTextarea().value).toBe("")
    })

    expect(
      screen.getByRole("button", { name: messages.downloadResultsLabel })
    ).toHaveProperty("disabled", true)
  })

  test("restores saved settings from localStorage", async () => {
    window.localStorage.setItem("tools:ulid-generator:generation-mode", "batch")
    window.localStorage.setItem("tools:ulid-generator:count", "2")
    window.localStorage.setItem("tools:ulid-generator:timestamp-mode", "custom")
    window.localStorage.setItem(
      "tools:ulid-generator:custom-date-time",
      "2026-04-15T08:30:45.123"
    )
    window.localStorage.setItem(
      "tools:ulid-generator:custom-unix-milliseconds",
      "12345"
    )
    window.localStorage.setItem("tools:ulid-generator:monotonic-batch", "false")

    render(<UlidGeneratorClient messages={messages} language="en" />)

    await waitFor(() => {
      expect(
        screen
          .getByRole("radio", { name: messages.generationBatchLabel })
          .getAttribute("aria-checked")
      ).toBe("true")
      expect(screen.getByLabelText(messages.countLabel)).toHaveProperty(
        "value",
        "2"
      )
      expect(
        screen.getByLabelText(messages.customUnixMillisecondsLabel)
      ).toHaveProperty("value", "12345")
      expect(
        screen
          .getByLabelText(messages.monotonicBatchLabel)
          .getAttribute("aria-checked")
      ).toBe("false")
    })

    const lines = getResultsTextarea().value.trim().split("\n")
    expect(lines).toHaveLength(2)
  })

  test("regenerates a fresh batch on demand", async () => {
    render(<UlidGeneratorClient messages={messages} language="en" />)

    await waitFor(() => {
      expect(getResultsTextarea().value).not.toBe("")
    })

    const previousOutput = getResultsTextarea().value

    fireEvent.click(
      screen.getByRole("button", { name: messages.regenerateLabel })
    )

    await waitFor(() => {
      expect(getResultsTextarea().value).not.toBe(previousOutput)
    })
  })
})
