import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import Cuid2GeneratorClient from "./client"
import { CUID2_DEFAULT_LENGTH } from "./core/cuid2"

const messages = {
  meta: {
    name: "CUID2 Generator",
    description:
      "Generate secure, collision-resistant CUID2 IDs in your browser.",
  },
  optionsTitle: "Options",
  optionsDescription:
    "Set how many identifiers to generate in each batch and how long they should be.",
  countLabel: "Count",
  lengthLabel: "Length",
  resultsTitle: "Results",
  resultsDescription:
    "Each batch is generated locally in your browser so you can copy or download it immediately.",
  resultsPlaceholder: "Generated CUID2 IDs will appear here...",
  copyResultsLabel: "Copy result",
  copiedLabel: "Copied",
  downloadResultsLabel: "Download result",
  regenerateLabel: "Regenerate",
} as const

let byteOffset = 0

beforeEach(() => {
  byteOffset = 0

  const NativeURL = globalThis.URL

  class MockURL extends NativeURL {}

  Object.assign(MockURL, {
    createObjectURL: vi.fn(() => "blob:cuid2-results"),
    revokeObjectURL: vi.fn(),
  })

  vi.stubGlobal("URL", MockURL)
  window.localStorage.clear()

  vi.spyOn(globalThis.crypto, "getRandomValues").mockImplementation((array) => {
    const bytes = new Uint8Array(
      array.buffer,
      array.byteOffset,
      array.byteLength
    )

    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = (byteOffset + index) % 256
    }

    byteOffset = (byteOffset + bytes.length) % 256
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

describe("Cuid2GeneratorClient", () => {
  test("renders the default batch and download link", async () => {
    render(<Cuid2GeneratorClient messages={messages} />)

    expect(screen.getByLabelText(messages.countLabel)).toHaveProperty(
      "value",
      "5"
    )
    expect(screen.getByLabelText(messages.lengthLabel)).toHaveProperty(
      "value",
      String(CUID2_DEFAULT_LENGTH)
    )

    await waitFor(() => {
      const lines = getResultsTextarea().value.trim().split("\n")

      expect(lines).toHaveLength(5)
      expect(
        lines.every((value) => value.length === CUID2_DEFAULT_LENGTH)
      ).toBe(true)
    })

    expect(URL.createObjectURL).toHaveBeenCalled()
    expect(
      screen.getByRole("link", { name: messages.downloadResultsLabel })
    ).toHaveProperty("download", `cuid2-5x${CUID2_DEFAULT_LENGTH}.txt`)
  })

  test("updates the batch when count and length change", async () => {
    render(<Cuid2GeneratorClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.countLabel), {
      target: { value: "3" },
    })
    fireEvent.change(screen.getByLabelText(messages.lengthLabel), {
      target: { value: "10" },
    })

    await waitFor(() => {
      const lines = getResultsTextarea().value.trim().split("\n")

      expect(lines).toHaveLength(3)
      expect(lines.every((value) => value.length === 10)).toBe(true)
    })

    expect(window.localStorage.getItem("tools:cuid2-generator:count")).toBe("3")
    expect(window.localStorage.getItem("tools:cuid2-generator:length")).toBe(
      "10"
    )
  })

  test("restores saved settings from localStorage", async () => {
    window.localStorage.setItem("tools:cuid2-generator:count", "2")
    window.localStorage.setItem("tools:cuid2-generator:length", "8")

    render(<Cuid2GeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByLabelText(messages.countLabel)).toHaveProperty(
        "value",
        "2"
      )
      expect(screen.getByLabelText(messages.lengthLabel)).toHaveProperty(
        "value",
        "8"
      )
    })

    const lines = getResultsTextarea().value.trim().split("\n")
    expect(lines).toHaveLength(2)
    expect(lines.every((value) => value.length === 8)).toBe(true)
  })

  test("regenerates a fresh batch on demand", async () => {
    render(<Cuid2GeneratorClient messages={messages} />)

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
