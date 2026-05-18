import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import UuidV6GeneratorClient from "./client"

const NOW_MS = Date.UTC(2026, 3, 15, 15, 20, 30, 123)
const UUID_V6_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-6[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u

const messages = {
  meta: {
    name: "UUID v6 Generator",
    description: "Generate UUID v6 identifiers in your browser.",
  },
  optionsTitle: "Options",
  optionsDescription: "Configure UUID v6 generation.",
  countLabel: "Count",
  timestampModeLabel: "Timestamp mode",
  timestampNowLabel: "Use current time",
  timestampCustomLabel: "Custom time",
  customDateTimeLabel: "Custom date/time",
  customUnixMillisecondsLabel: "Custom Unix milliseconds",
  setNowLabel: "Set to now",
  nodeModeLabel: "Node ID mode",
  nodeRandomLabel: "Random private node",
  nodeCustomLabel: "Custom node",
  customNodeLabel: "Custom node ID",
  customNodeDescription: "Use a 48-bit node ID.",
  clockSequenceModeLabel: "Clock sequence mode",
  clockSequenceRandomLabel: "Random sequence",
  clockSequenceCustomLabel: "Custom sequence",
  customClockSequenceLabel: "Custom clock sequence",
  customClockSequenceDescription: "Use an integer from 0 to 16383.",
  timestampInvalid: "Enter a valid timestamp.",
  timestampOutOfRange:
    "Timestamp must be between {min} and {max} Unix milliseconds.",
  nodeInvalid: "Enter a valid 48-bit node ID.",
  clockSequenceInvalid: "Clock sequence must be an integer from 0 to {max}.",
  resultsTitle: "Results",
  resultsDescription: "UUIDs are generated in-browser.",
  resultsPlaceholder: "Generated UUID v6 values will appear here...",
  generatedAtLabel: "Generated with Unix time: {milliseconds}",
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
    createObjectURL: vi.fn(() => "blob:uuid-v6-results"),
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

describe("UuidV6GeneratorClient", () => {
  test("renders the default UUID v6 batch and download link", async () => {
    render(<UuidV6GeneratorClient messages={messages} />)

    expect(screen.getByLabelText(messages.countLabel)).toHaveProperty(
      "value",
      "5"
    )

    await waitFor(() => {
      const lines = getResultsTextarea().value.trim().split("\n")

      expect(lines).toHaveLength(5)
      expect(lines.every((value) => UUID_V6_PATTERN.test(value))).toBe(true)
    })

    expect(
      screen.getByText("Generated with Unix time: 1776266430123")
    ).toBeTruthy()
    expect(
      screen.getByRole("link", { name: messages.downloadResultsLabel })
    ).toHaveProperty("download", "uuid-v6-5-1776266430123.txt")
  })

  test("supports deterministic custom node and clock sequence fields", async () => {
    render(<UuidV6GeneratorClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("radio", { name: messages.nodeCustomLabel })
    )
    fireEvent.click(
      screen.getByRole("radio", { name: messages.clockSequenceCustomLabel })
    )
    fireEvent.change(screen.getByLabelText(messages.customNodeLabel), {
      target: { value: "02:00:00:00:00:01" },
    })
    fireEvent.change(screen.getByLabelText(messages.customClockSequenceLabel), {
      target: { value: "1" },
    })

    await waitFor(() => {
      const lines = getResultsTextarea().value.trim().split("\n")

      expect(lines).toHaveLength(5)
      expect(lines.every((value) => value.endsWith("-020000000001"))).toBe(true)
      expect(lines.every((value) => value.split("-")[3] === "8001")).toBe(true)
    })
  })

  test("shows validation errors and disables download for invalid custom nodes", async () => {
    render(<UuidV6GeneratorClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("radio", { name: messages.nodeCustomLabel })
    )
    fireEvent.change(screen.getByLabelText(messages.customNodeLabel), {
      target: { value: "not-a-node" },
    })

    await waitFor(() => {
      expect(screen.getAllByText(messages.nodeInvalid).length).toBeGreaterThan(
        0
      )
      expect(getResultsTextarea().value).toBe("")
    })

    expect(
      screen.getByRole("button", { name: messages.downloadResultsLabel })
    ).toHaveProperty("disabled", true)
  })

  test("restores saved settings from localStorage", async () => {
    window.localStorage.setItem("tools:uuid-v6-generator:count", "2")
    window.localStorage.setItem(
      "tools:uuid-v6-generator:timestamp-mode",
      "custom"
    )
    window.localStorage.setItem(
      "tools:uuid-v6-generator:custom-unix-milliseconds",
      "0"
    )
    window.localStorage.setItem("tools:uuid-v6-generator:node-mode", "custom")
    window.localStorage.setItem(
      "tools:uuid-v6-generator:custom-node",
      "02:00:00:00:00:02"
    )
    window.localStorage.setItem(
      "tools:uuid-v6-generator:clock-sequence-mode",
      "custom"
    )
    window.localStorage.setItem(
      "tools:uuid-v6-generator:custom-clock-sequence",
      "2"
    )

    render(<UuidV6GeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByLabelText(messages.countLabel)).toHaveProperty(
        "value",
        "2"
      )
      expect(
        screen.getByLabelText(messages.customUnixMillisecondsLabel)
      ).toHaveProperty("value", "0")
      expect(screen.getByLabelText(messages.customNodeLabel)).toHaveProperty(
        "value",
        "02:00:00:00:00:02"
      )
    })

    const lines = getResultsTextarea().value.trim().split("\n")
    expect(lines).toHaveLength(2)
    expect(lines.every((value) => value.endsWith("-020000000002"))).toBe(true)
  })
})
