import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import KsuidGeneratorClient from "./client"
import { formatDateTimeLocalInput } from "./core/local-date"
import { KSUID_EPOCH_SECONDS, KSUID_LENGTH } from "./core/ksuid"

const NOW_MS = Date.UTC(2026, 3, 15, 15, 20, 30)

const messages = {
  meta: {
    name: "KSUID Generator",
    description: "Generate KSUIDs in your browser with optional timestamps.",
  },
  optionsTitle: "Options",
  countLabel: "Count",
  timestampModeLabel: "Timestamp mode",
  timestampNowLabel: "Use current time",
  timestampCustomLabel: "Custom time",
  customDateTimeLabel: "Custom date/time",
  customUnixSecondsLabel: "Custom Unix seconds",
  setNowLabel: "Set to now",
  ksuidEpochLabel: "KSUID epoch: 2014-05-13T16:53:20Z",
  timestampInvalid: "Invalid timestamp.",
  timestampOutOfRange:
    "Timestamp must be between {min} and {max} (Unix seconds).",
  resultsTitle: "Results",
  resultsPlaceholder: "Generated KSUIDs will appear here...",
  generatedAtLabel: "Generated with Unix time: {seconds}",
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
    createObjectURL: vi.fn(() => "blob:ksuid-results"),
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

describe("KsuidGeneratorClient", () => {
  test("renders the default batch and download link", async () => {
    render(<KsuidGeneratorClient messages={messages} language="en" />)

    expect(screen.getByLabelText(messages.countLabel)).toHaveProperty(
      "value",
      "5"
    )

    await waitFor(() => {
      const lines = getResultsTextarea().value.trim().split("\n")

      expect(lines).toHaveLength(5)
      expect(lines.every((value) => value.length === KSUID_LENGTH)).toBe(true)
    })

    expect(
      screen.getByText("Generated with Unix time: 1,776,266,430")
    ).toBeTruthy()
    expect(
      screen.getByRole("link", { name: messages.downloadResultsLabel })
    ).toHaveProperty("download", "ksuid-5-1776266430.txt")
  })

  test("switches to a custom unix timestamp", async () => {
    render(<KsuidGeneratorClient messages={messages} language="en" />)

    fireEvent.click(
      screen.getByRole("radio", { name: messages.timestampCustomLabel })
    )
    fireEvent.change(screen.getByLabelText(messages.customUnixSecondsLabel), {
      target: { value: String(KSUID_EPOCH_SECONDS + 60) },
    })

    await waitFor(() => {
      expect(
        screen.getByText(
          `Generated with Unix time: ${new Intl.NumberFormat("en").format(KSUID_EPOCH_SECONDS + 60)}`
        )
      ).toBeTruthy()
    })

    expect(screen.getByLabelText(messages.customDateTimeLabel)).toHaveProperty(
      "value",
      formatDateTimeLocalInput((KSUID_EPOCH_SECONDS + 60) * 1000)
    )
  })

  test("shows an error and clears output for invalid custom timestamps", async () => {
    render(<KsuidGeneratorClient messages={messages} language="en" />)

    fireEvent.click(
      screen.getByRole("radio", { name: messages.timestampCustomLabel })
    )
    fireEvent.change(screen.getByLabelText(messages.customUnixSecondsLabel), {
      target: { value: String(KSUID_EPOCH_SECONDS - 1) },
    })

    await waitFor(() => {
      expect(
        screen.getByText(
          `Timestamp must be between ${KSUID_EPOCH_SECONDS} and ${
            KSUID_EPOCH_SECONDS + 0xffff_ffff
          } (Unix seconds).`
        )
      ).toBeTruthy()
      expect(getResultsTextarea().value).toBe("")
    })

    expect(
      screen.getByRole("button", { name: messages.downloadResultsLabel })
    ).toHaveProperty("disabled", true)
  })

  test("restores saved settings from localStorage", async () => {
    window.localStorage.setItem("tools:ksuid-generator:count", "2")
    window.localStorage.setItem(
      "tools:ksuid-generator:timestamp-mode",
      "custom"
    )
    window.localStorage.setItem(
      "tools:ksuid-generator:custom-date-time",
      "2014-05-13T16:55:20"
    )
    window.localStorage.setItem(
      "tools:ksuid-generator:custom-unix-seconds",
      String(KSUID_EPOCH_SECONDS + 120)
    )

    render(<KsuidGeneratorClient messages={messages} language="en" />)

    await waitFor(() => {
      expect(screen.getByLabelText(messages.countLabel)).toHaveProperty(
        "value",
        "2"
      )
      expect(
        screen.getByLabelText(messages.customUnixSecondsLabel)
      ).toHaveProperty("value", String(KSUID_EPOCH_SECONDS + 120))
    })

    const lines = getResultsTextarea().value.trim().split("\n")
    expect(lines).toHaveLength(2)
  })

  test("regenerates a fresh batch on demand", async () => {
    render(<KsuidGeneratorClient messages={messages} language="en" />)

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
