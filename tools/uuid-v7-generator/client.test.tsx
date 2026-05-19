import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import UuidV7GeneratorClient from "./client"
import { formatDateTimeLocalInput } from "./core/local-date"
import { UUID_V7_MAX_TIMESTAMP_MS, parseUuidV7Timestamp } from "./core/uuid-v7"

const messages = {
  meta: {
    name: "UUID v7 Generator",
    description: "Generate timestamp-sortable UUID v7 identifiers.",
  },
  optionsTitle: "Options",
  optionsDescription: "Generate one UUID v7 identifier or a local batch.",
  modeLabel: "Mode",
  singleModeLabel: "Single",
  batchModeLabel: "Batch",
  countLabel: "Count",
  countDescription: "Batch mode can generate 2 to 100 UUIDs at a time.",
  timestampModeLabel: "Timestamp mode",
  timestampModeDescription:
    "Use the current clock value or pin the UUID v7 timestamp to a specific Unix millisecond.",
  timestampNowLabel: "Use current time",
  timestampCustomLabel: "Custom time",
  customDateTimeLabel: "Custom date/time",
  customUnixMillisecondsLabel: "Custom Unix milliseconds",
  setNowLabel: "Set to now",
  timestampInvalid: "Invalid timestamp.",
  timestampOutOfRange:
    "Timestamp must be between {min} and {max} (Unix milliseconds).",
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
  return screen.getByRole("textbox", {
    name: messages.resultsTitle,
  }) as HTMLTextAreaElement
}

function getModeOption(name: string) {
  return screen.getByRole("radio", { name })
}

describe("UuidV7GeneratorClient", () => {
  test("renders defaults and generates a single UUID v7 identifier", async () => {
    render(<UuidV7GeneratorClient messages={messages} language="en" />)

    expect(
      getModeOption(messages.singleModeLabel).getAttribute("data-state")
    ).toBe("on")
    expect(screen.queryByLabelText(messages.countLabel)).toBeNull()
    expect(
      getModeOption(messages.timestampNowLabel).getAttribute("data-state")
    ).toBe("on")
    expect(
      screen.queryByLabelText(messages.customUnixMillisecondsLabel)
    ).toBeNull()
    expect(getResultsTextarea().getAttribute("rows")).toBe("5")

    await waitFor(() => {
      const lines = getResultsTextarea().value.trim().split("\n")

      expect(lines).toHaveLength(1)
      expect(
        /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u.test(
          lines[0]!
        )
      ).toBe(true)
    })

    expect(
      screen.getByRole("group", { name: messages.resultsTitle })
    ).toBeTruthy()
    expect(screen.getByText("UUID v7")).toBeTruthy()
    expect(screen.getByText("1700000000000")).toBeTruthy()
    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  test("switches to batch mode and generates ten UUID v7 identifiers", async () => {
    render(<UuidV7GeneratorClient messages={messages} language="en" />)

    fireEvent.click(getModeOption(messages.batchModeLabel))

    await waitFor(() =>
      expect(screen.getByLabelText(messages.countLabel)).toHaveProperty(
        "value",
        "10"
      )
    )
    expect(
      (screen.getByLabelText(messages.countLabel) as HTMLInputElement).min
    ).toBe("2")
    expect(getResultsTextarea().getAttribute("rows")).toBe("12")
    expect(
      screen.getByRole("group", { name: messages.batchSummaryLabel })
    ).toBeTruthy()

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
  })

  test("persists changed count and regenerates a smaller batch", async () => {
    render(<UuidV7GeneratorClient messages={messages} language="en" />)

    fireEvent.click(getModeOption(messages.batchModeLabel))

    fireEvent.change(screen.getByLabelText(messages.countLabel), {
      target: { value: "3" },
    })

    await waitFor(() => {
      expect(window.localStorage.getItem("tools:uuid-v7-generator:mode")).toBe(
        "batch"
      )
      expect(window.localStorage.getItem("tools:uuid-v7-generator:count")).toBe(
        "3"
      )
      expect(getResultsTextarea().value.trim().split("\n")).toHaveLength(3)
    })
  })

  test("restores saved count from localStorage", async () => {
    window.localStorage.setItem("tools:uuid-v7-generator:count", "2")
    window.localStorage.setItem("tools:uuid-v7-generator:mode", "batch")

    render(<UuidV7GeneratorClient messages={messages} language="en" />)

    await waitFor(() => {
      expect(screen.getByLabelText(messages.countLabel)).toHaveProperty(
        "value",
        "2"
      )
      expect(getResultsTextarea().value.trim().split("\n")).toHaveLength(2)
    })
  })

  test("treats a legacy saved count above one as batch mode", async () => {
    window.localStorage.setItem("tools:uuid-v7-generator:count", "3")

    render(<UuidV7GeneratorClient messages={messages} language="en" />)

    await waitFor(() => {
      expect(screen.getByLabelText(messages.countLabel)).toHaveProperty(
        "value",
        "3"
      )
      expect(getResultsTextarea().value.trim().split("\n")).toHaveLength(3)
      expect(window.localStorage.getItem("tools:uuid-v7-generator:mode")).toBe(
        "batch"
      )
    })
  })

  test("keeps batch count at two or more", async () => {
    render(<UuidV7GeneratorClient messages={messages} language="en" />)

    fireEvent.click(getModeOption(messages.batchModeLabel))
    fireEvent.change(screen.getByLabelText(messages.countLabel), {
      target: { value: "1" },
    })

    await waitFor(() => {
      expect(screen.getByLabelText(messages.countLabel)).toHaveProperty(
        "value",
        "2"
      )
      expect(getResultsTextarea().value.trim().split("\n")).toHaveLength(2)
    })
  })

  test("switches back to single mode while preserving the batch count", async () => {
    render(<UuidV7GeneratorClient messages={messages} language="en" />)

    fireEvent.click(getModeOption(messages.batchModeLabel))
    fireEvent.change(screen.getByLabelText(messages.countLabel), {
      target: { value: "4" },
    })

    await waitFor(() => {
      expect(getResultsTextarea().value.trim().split("\n")).toHaveLength(4)
    })

    fireEvent.click(getModeOption(messages.singleModeLabel))

    await waitFor(() => {
      expect(screen.queryByLabelText(messages.countLabel)).toBeNull()
      expect(getResultsTextarea().value.trim().split("\n")).toHaveLength(1)
      expect(window.localStorage.getItem("tools:uuid-v7-generator:count")).toBe(
        "4"
      )
    })
  })

  test("regenerates a fresh batch when the button is clicked", async () => {
    render(<UuidV7GeneratorClient messages={messages} language="en" />)

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
    render(<UuidV7GeneratorClient messages={messages} language="en" />)

    await waitFor(() => {
      expect(getResultsTextarea().value).not.toBe("")
    })

    const downloadLink = screen.getByRole("link", {
      name: messages.downloadResultsLabel,
    })

    expect(downloadLink.getAttribute("href")).toBe("blob:uuid-v7-results")
    expect(downloadLink.getAttribute("download")).toBe(
      "uuid-v7-1700000000000.txt"
    )
  })

  test("uses a custom Unix millisecond timestamp", async () => {
    render(<UuidV7GeneratorClient messages={messages} language="en" />)

    fireEvent.click(getModeOption(messages.timestampCustomLabel))
    fireEvent.change(
      screen.getByLabelText(messages.customUnixMillisecondsLabel),
      {
        target: { value: "1234" },
      }
    )

    await waitFor(() => {
      const [uuid] = getResultsTextarea().value.trim().split("\n")

      expect(parseUuidV7Timestamp(uuid!)).toBe(1234)
      expect(screen.getByText("1234")).toBeTruthy()
      expect(
        screen.getByLabelText(messages.customDateTimeLabel)
      ).toHaveProperty("value", formatDateTimeLocalInput(1234))
    })
  })

  test("syncs custom datetime input, restores now, and persists timestamp settings", async () => {
    render(<UuidV7GeneratorClient messages={messages} language="en" />)

    fireEvent.click(getModeOption(messages.timestampCustomLabel))
    fireEvent.change(screen.getByLabelText(messages.customDateTimeLabel), {
      target: { value: "1970-01-01T00:00:02.345" },
    })

    await waitFor(() => {
      expect(
        screen.getByLabelText(messages.customUnixMillisecondsLabel)
      ).toHaveProperty(
        "value",
        String(new Date(1970, 0, 1, 0, 0, 2, 345).getTime())
      )
      expect(
        window.localStorage.getItem("tools:uuid-v7-generator:timestamp-mode")
      ).toBe("custom")
    })

    fireEvent.click(screen.getByRole("button", { name: messages.setNowLabel }))

    await waitFor(() => {
      expect(
        screen.getByLabelText(messages.customUnixMillisecondsLabel)
      ).toHaveProperty("value", String(nowMs))
    })
  })

  test("shows an error and clears output for invalid custom timestamps", async () => {
    render(<UuidV7GeneratorClient messages={messages} language="en" />)

    fireEvent.click(getModeOption(messages.timestampCustomLabel))
    fireEvent.change(
      screen.getByLabelText(messages.customUnixMillisecondsLabel),
      {
        target: { value: String(UUID_V7_MAX_TIMESTAMP_MS + 1) },
      }
    )

    await waitFor(() => {
      expect(
        screen.getByText(
          `Timestamp must be between 0 and ${UUID_V7_MAX_TIMESTAMP_MS} (Unix milliseconds).`
        )
      ).toBeTruthy()
      expect(getResultsTextarea().value).toBe("")
    })

    expect(
      screen.getByRole("button", { name: messages.downloadResultsLabel })
    ).toHaveProperty("disabled", true)
  })

  test("restores saved custom timestamp settings", async () => {
    window.localStorage.setItem(
      "tools:uuid-v7-generator:timestamp-mode",
      "custom"
    )
    window.localStorage.setItem(
      "tools:uuid-v7-generator:custom-date-time",
      "2026-04-15T08:30:45.123"
    )
    window.localStorage.setItem(
      "tools:uuid-v7-generator:custom-unix-milliseconds",
      "12345"
    )

    render(<UuidV7GeneratorClient messages={messages} language="en" />)

    await waitFor(() => {
      expect(
        getModeOption(messages.timestampCustomLabel).getAttribute("data-state")
      ).toBe("on")
      expect(
        screen.getByLabelText(messages.customUnixMillisecondsLabel)
      ).toHaveProperty("value", "12345")
      expect(parseUuidV7Timestamp(getResultsTextarea().value.trim())).toBe(
        12345
      )
    })
  })
})
