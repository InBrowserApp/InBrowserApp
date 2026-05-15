import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import UuidV1GeneratorClient from "./client"

const NOW_MS = Date.UTC(2026, 0, 2, 3, 4, 5, 678)

const messages = {
  meta: {
    name: "UUID v1 Generator",
    description: "Generate time-based UUID v1 identifiers in your browser.",
  },
  optionsTitle: "Options",
  optionsDescription:
    "Start with one UUID, then switch to batch mode when you need a list.",
  modeLabel: "Generation Mode",
  modeDescription:
    "Single mode keeps the output focused; batch mode unlocks the count setting.",
  singleModeLabel: "Single",
  batchModeLabel: "Batch",
  countLabel: "Count",
  countDescription: "Batch mode can generate 2 to 100 UUIDs at a time.",
  macAddressLabel: "MAC Address",
  macAddressDescription:
    "A locally administered random address is used by default.",
  randomMacAddressLabel: "Randomize MAC address",
  clockSequenceLabel: "Clock Sequence",
  clockSequenceDescription: "A 14-bit value used to avoid collisions.",
  randomClockSequenceLabel: "Randomize clock sequence",
  macAddressRequired: "Enter a MAC address.",
  macAddressInvalid: "Use 12 hexadecimal digits, with optional separators.",
  resultsTitle: "Results",
  resultsDescription:
    "UUID v1 values generated locally for the selected mode and node settings.",
  resultsPlaceholder: "Generated UUID v1 values will appear here...",
  generatedAtLabel: "Generated at: {time}",
  copyResultsLabel: "Copy UUIDs",
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
    createObjectURL: vi.fn(() => "blob:uuid-v1-results"),
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

async function waitForOutputLines(count: number) {
  await waitFor(() => {
    const lines = getResultsTextarea().value.trim().split("\n")

    expect(lines).toHaveLength(count)
    expect(lines.every((line) => /^[\da-f-]{36}$/u.test(line))).toBe(true)
  })

  return getResultsTextarea().value.trim().split("\n")
}

describe("UuidV1GeneratorClient", () => {
  test("renders a default single UUID and download link", async () => {
    render(<UuidV1GeneratorClient messages={messages} language="en" />)

    const lines = await waitForOutputLines(1)

    expect(
      (
        screen.getByRole("radio", {
          name: messages.singleModeLabel,
        }) as HTMLElement
      ).dataset.state
    ).toBe("on")
    expect(screen.queryByLabelText(messages.countLabel)).toBeNull()
    expect(screen.getByLabelText(messages.macAddressLabel)).toHaveProperty(
      "value",
      "02:01:02:03:04:05"
    )
    expect(lines[0]!.endsWith("020102030405")).toBe(true)
    expect(screen.getByText(/Generated at:/u)).toBeTruthy()
    expect(
      screen.getByRole("link", { name: messages.downloadResultsLabel })
    ).toHaveProperty("download", `uuid-v1-${NOW_MS}.txt`)
  })

  test("switches to batch mode and applies the batch count", async () => {
    render(<UuidV1GeneratorClient messages={messages} language="en" />)

    fireEvent.click(
      screen.getByRole("radio", { name: messages.batchModeLabel })
    )

    await waitForOutputLines(10)

    const countInput = screen.getByLabelText(messages.countLabel)

    expect(countInput).toHaveProperty("value", "10")

    fireEvent.change(countInput, {
      target: { value: "3" },
    })

    const lines = await waitForOutputLines(3)

    expect(lines.every((line) => line.endsWith("020102030405"))).toBe(true)
    expect(
      screen.getByRole("link", { name: messages.downloadResultsLabel })
    ).toHaveProperty("download", `uuid-v1-batch-3-${NOW_MS}.txt`)
  })

  test("restores legacy saved counts as batch mode", async () => {
    window.localStorage.setItem("tools:uuid-v1-generator:count", "5")

    render(<UuidV1GeneratorClient messages={messages} language="en" />)

    await waitForOutputLines(5)

    expect(
      (
        screen.getByRole("radio", {
          name: messages.batchModeLabel,
        }) as HTMLElement
      ).dataset.state
    ).toBe("on")
    expect(screen.getByLabelText(messages.countLabel)).toHaveProperty(
      "value",
      "5"
    )
  })

  test("restores explicit single mode while preserving the saved batch count", async () => {
    window.localStorage.setItem(
      "tools:uuid-v1-generator:generation-mode",
      "single"
    )
    window.localStorage.setItem("tools:uuid-v1-generator:count", "8")

    render(<UuidV1GeneratorClient messages={messages} language="en" />)

    await waitForOutputLines(1)

    expect(
      (
        screen.getByRole("radio", {
          name: messages.singleModeLabel,
        }) as HTMLElement
      ).dataset.state
    ).toBe("on")
    expect(screen.queryByLabelText(messages.countLabel)).toBeNull()

    fireEvent.click(
      screen.getByRole("radio", { name: messages.batchModeLabel })
    )

    await waitForOutputLines(8)

    expect(screen.getByLabelText(messages.countLabel)).toHaveProperty(
      "value",
      "8"
    )
  })

  test("normalizes a flexible MAC address on blur", async () => {
    render(<UuidV1GeneratorClient messages={messages} language="en" />)

    const macAddressInput = screen.getByLabelText(messages.macAddressLabel)

    fireEvent.change(macAddressInput, {
      target: { value: "11-22-33-44-55-66" },
    })
    fireEvent.blur(macAddressInput)

    await waitFor(() => {
      expect(macAddressInput).toHaveProperty("value", "11:22:33:44:55:66")
    })

    const lines = await waitForOutputLines(1)
    expect(lines[0]!.endsWith("112233445566")).toBe(true)
  })

  test("shows an error and clears output for invalid MAC addresses", async () => {
    render(<UuidV1GeneratorClient messages={messages} language="en" />)

    await waitForOutputLines(1)

    fireEvent.change(screen.getByLabelText(messages.macAddressLabel), {
      target: { value: "not-a-mac" },
    })

    await waitFor(() => {
      expect(screen.getByText(messages.macAddressInvalid)).toBeTruthy()
      expect(getResultsTextarea().value).toBe("")
    })

    expect(
      screen.getByRole("button", { name: messages.downloadResultsLabel })
    ).toHaveProperty("disabled", true)
  })

  test("restores saved settings from localStorage", async () => {
    window.localStorage.setItem(
      "tools:uuid-v1-generator:generation-mode",
      "batch"
    )
    window.localStorage.setItem("tools:uuid-v1-generator:count", "2")
    window.localStorage.setItem(
      "tools:uuid-v1-generator:mac-address",
      "AA-BB-CC-DD-EE-FF"
    )
    window.localStorage.setItem("tools:uuid-v1-generator:clock-sequence", "42")

    render(<UuidV1GeneratorClient messages={messages} language="en" />)

    await waitFor(() => {
      expect(screen.getByLabelText(messages.countLabel)).toHaveProperty(
        "value",
        "2"
      )
      expect(screen.getByLabelText(messages.macAddressLabel)).toHaveProperty(
        "value",
        "AA:BB:CC:DD:EE:FF"
      )
      expect(screen.getByLabelText(messages.clockSequenceLabel)).toHaveProperty(
        "value",
        "42"
      )
    })

    const lines = await waitForOutputLines(2)
    expect(lines.every((line) => line.endsWith("aabbccddeeff"))).toBe(true)
  })

  test("randomizes node settings and regenerates on demand", async () => {
    render(<UuidV1GeneratorClient messages={messages} language="en" />)

    const previousLines = await waitForOutputLines(1)

    fireEvent.click(
      screen.getByRole("button", {
        name: messages.randomMacAddressLabel,
      })
    )

    await waitFor(() => {
      expect(screen.getByLabelText(messages.macAddressLabel)).toHaveProperty(
        "value",
        "0A:09:0A:0B:0C:0D"
      )
    })

    fireEvent.click(
      screen.getByRole("button", { name: messages.regenerateLabel })
    )

    await waitFor(() => {
      expect(getResultsTextarea().value.trim().split("\n")).not.toEqual(
        previousLines
      )
    })
  })
})
