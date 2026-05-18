import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import UuidV4BulkGeneratorClient from "./client"
import { UUID_V4_BULK_DEFAULT_COUNT } from "./core/uuid-v4-bulk"

const messages = {
  meta: {
    name: "UUID v4 Bulk Generator",
    description: "Generate random UUID v4 identifiers in your browser.",
  },
  optionsTitle: "Options",
  optionsDescription: "Choose how many UUID v4 values to generate.",
  countLabel: "Count",
  countHelp: "Generate between 1 and 1000 UUIDs in a single batch.",
  resultsTitle: "Results",
  resultsDescription: "Generated UUIDs stay local to your browser.",
  resultsPlaceholder: "Generated UUID v4 values will appear here…",
  copyResultsLabel: "Copy UUIDs",
  copiedLabel: "Copied",
  downloadResultsLabel: "Download result",
  regenerateLabel: "Regenerate",
  generationError: "Secure random UUID generation is unavailable.",
} as const

let uuidIndex = 0

beforeEach(() => {
  uuidIndex = 0

  const NativeURL = globalThis.URL

  class MockURL extends NativeURL {}

  Object.assign(MockURL, {
    createObjectURL: vi.fn(() => "blob:uuid-v4-bulk-results"),
    revokeObjectURL: vi.fn(),
  })

  vi.stubGlobal("URL", MockURL)
  window.localStorage.clear()

  vi.spyOn(globalThis.crypto, "randomUUID").mockImplementation(() => {
    uuidIndex += 1
    return `00000000-0000-4000-8000-${String(uuidIndex).padStart(12, "0")}`
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

describe("UuidV4BulkGeneratorClient", () => {
  test("renders the default batch and download link", async () => {
    render(<UuidV4BulkGeneratorClient messages={messages} />)

    const countInput = screen.getByLabelText(messages.countLabel)

    expect(countInput).toHaveProperty(
      "value",
      String(UUID_V4_BULK_DEFAULT_COUNT)
    )
    expect(countInput).toHaveProperty("name", "uuid-count")
    expect(countInput.getAttribute("autocomplete")).toBe("off")

    await waitFor(() => {
      const lines = getResultsTextarea().value.trim().split("\n")

      expect(lines).toHaveLength(UUID_V4_BULK_DEFAULT_COUNT)
      expect(lines[0]).toBe("00000000-0000-4000-8000-000000000001")
    })

    expect(URL.createObjectURL).toHaveBeenCalled()
    expect(getResultsTextarea().className).toContain("overflow-y-auto")
    expect(
      screen.getByRole("link", { name: messages.downloadResultsLabel })
    ).toHaveProperty("download", `uuid-v4-${UUID_V4_BULK_DEFAULT_COUNT}.txt`)
  })

  test("updates and persists the requested count", async () => {
    render(<UuidV4BulkGeneratorClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.countLabel), {
      target: { value: "3" },
    })

    await waitFor(() => {
      const lines = getResultsTextarea().value.trim().split("\n")

      expect(lines).toHaveLength(3)
    })

    expect(
      window.localStorage.getItem("tools:uuid-v4-bulk-generator:count")
    ).toBe("3")
  })

  test("restores saved count from localStorage", async () => {
    window.localStorage.setItem("tools:uuid-v4-bulk-generator:count", "2")

    render(<UuidV4BulkGeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByLabelText(messages.countLabel)).toHaveProperty(
        "value",
        "2"
      )
    })

    expect(getResultsTextarea().value.trim().split("\n")).toHaveLength(2)
  })

  test("regenerates a fresh batch on demand", async () => {
    render(<UuidV4BulkGeneratorClient messages={messages} />)

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

  test("shows an error when secure UUID generation is unavailable", async () => {
    vi.spyOn(globalThis.crypto, "randomUUID").mockImplementation(() => {
      throw new Error("blocked")
    })

    render(<UuidV4BulkGeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByText(messages.generationError)).toBeTruthy()
      expect(getResultsTextarea().value).toBe("")
    })

    expect(screen.getByRole("alert").getAttribute("aria-live")).toBe("polite")
    expect(
      screen.getByRole("button", { name: messages.downloadResultsLabel })
    ).toHaveProperty("disabled", true)
  })
})
