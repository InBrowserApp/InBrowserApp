import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import JsonDiffPathClient from "./client"
import {
  DEFAULT_MODIFIED_TEXT,
  DEFAULT_ORIGINAL_TEXT,
  LARGE_JSON_INPUT_THRESHOLD,
  STORAGE_KEYS,
} from "./client/constants"

const messages = {
  meta: {
    name: "JSON Diff Path",
    description:
      "Compare two JSON documents and generate path-based diffs with JSON Pointer paths and RFC 6902 JSON Patch output.",
  },
  toolbarLabel: "Compare controls",
  swapLabel: "Swap",
  formatJsonLabel: "Format JSON",
  useSampleLabel: "Use sample",
  clearLabel: "Clear",
  compareNowLabel: "Compare now",
  largeCompareHint:
    "Large JSON detected. Automatic comparison is paused to keep typing responsive. Click Compare now to refresh results.",
  originalJsonLabel: "Original JSON",
  originalJsonDescription:
    "Paste the baseline JSON document here. This version is treated as the source when paths and patch operations are generated.",
  originalJsonPlaceholder: "Paste original JSON...",
  modifiedJsonLabel: "Modified JSON",
  modifiedJsonDescription:
    "Paste the updated JSON document here. Added, removed, and replaced paths are calculated against the original input.",
  modifiedJsonPlaceholder: "Paste modified JSON...",
  invalidOriginalJsonLabel: "Invalid original JSON",
  invalidModifiedJsonLabel: "Invalid modified JSON",
  resultLabel: "Diff results",
  resultDescription:
    "Inspect filtered path records or switch to RFC 6902 JSON Patch output without recomputing the comparison.",
  filtersLabel: "Operation filters",
  addLabel: "Add",
  removeLabel: "Remove",
  replaceLabel: "Replace",
  resultModeLabel: "Result mode",
  pathsTabLabel: "Path list",
  patchTabLabel: "JSON Patch",
  showingChangesLabel: "Showing {count} of {total} changes",
  noChangesLabel: "No changes for the current filters",
  resultEmptyDescription:
    "Enter valid JSON in both editors to compare structural changes",
  copyResultLabel: "Copy result",
  copiedLabel: "Copied",
  downloadJsonLabel: "Download JSON",
} as const

beforeEach(() => {
  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => "blob:json-diff-result"),
      revokeObjectURL: vi.fn(),
    })
  )

  window.localStorage.clear()
})

afterEach(cleanup)

function getOriginalInput() {
  return screen.getByRole("textbox", {
    name: messages.originalJsonLabel,
  }) as HTMLTextAreaElement
}

function getModifiedInput() {
  return screen.getByRole("textbox", {
    name: messages.modifiedJsonLabel,
  }) as HTMLTextAreaElement
}

function getResultRegion() {
  return screen.getByRole("region", {
    name: messages.resultLabel,
  })
}

describe("JsonDiffPathClient", () => {
  test("renders the sample documents and initial path-based diff output", () => {
    render(<JsonDiffPathClient messages={messages} />)

    expect(getOriginalInput().value).toBe(DEFAULT_ORIGINAL_TEXT)
    expect(getModifiedInput().value).toBe(DEFAULT_MODIFIED_TEXT)
    expect(screen.getByText("Showing 4 of 4 changes")).toBeTruthy()
    expect(getResultRegion().textContent).toContain("$.active")
    expect(getResultRegion().textContent).toContain("$.region")
    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  test("shows an input error state and disables result actions", () => {
    render(<JsonDiffPathClient messages={messages} />)

    fireEvent.change(getOriginalInput(), {
      target: { value: "{" },
    })

    expect(screen.getByText(/Invalid original JSON:/)).toBeTruthy()
    expect(getResultRegion().textContent).toContain(
      messages.resultEmptyDescription
    )
    expect(
      screen.getByRole("button", { name: messages.copyResultLabel })
    ).toHaveProperty("disabled", true)
    expect(
      screen.getByRole("button", { name: messages.downloadJsonLabel })
    ).toHaveProperty("disabled", true)
  })

  test("swaps the inputs and formats both JSON editors", async () => {
    render(<JsonDiffPathClient messages={messages} />)

    fireEvent.change(getOriginalInput(), {
      target: { value: '{"b":1}' },
    })
    fireEvent.change(getModifiedInput(), {
      target: { value: '{"a":2}' },
    })
    fireEvent.click(screen.getByRole("button", { name: messages.swapLabel }))

    await waitFor(() => {
      expect(getOriginalInput().value).toBe('{"a":2}')
      expect(getModifiedInput().value).toBe('{"b":1}')
    })

    fireEvent.click(
      screen.getByRole("button", { name: messages.formatJsonLabel })
    )

    await waitFor(() => {
      expect(getOriginalInput().value).toBe('{\n  "a": 2\n}')
      expect(getModifiedInput().value).toBe('{\n  "b": 1\n}')
    })
  })

  test("can clear the tool and restore the sample content", async () => {
    render(<JsonDiffPathClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.clearLabel }))

    await waitFor(() => {
      expect(getOriginalInput().value).toBe("")
      expect(getModifiedInput().value).toBe("")
    })

    expect(getResultRegion().textContent).toContain(
      messages.resultEmptyDescription
    )

    fireEvent.click(
      screen.getByRole("button", { name: messages.useSampleLabel })
    )

    await waitFor(() => {
      expect(getOriginalInput().value).toBe(DEFAULT_ORIGINAL_TEXT)
      expect(getModifiedInput().value).toBe(DEFAULT_MODIFIED_TEXT)
      expect(getResultRegion().textContent).toContain("$.active")
    })
  })

  test("restores persisted inputs, filters, and result mode from local storage", () => {
    window.localStorage.setItem(STORAGE_KEYS.originalText, '{"version":1}')
    window.localStorage.setItem(
      STORAGE_KEYS.modifiedText,
      '{"version":1,"region":"iad"}'
    )
    window.localStorage.setItem(
      STORAGE_KEYS.selectedOperations,
      JSON.stringify(["add"])
    )
    window.localStorage.setItem(STORAGE_KEYS.activeResultMode, "patch")

    render(<JsonDiffPathClient messages={messages} />)

    expect(getOriginalInput().value).toBe('{"version":1}')
    expect(getModifiedInput().value).toBe('{"version":1,"region":"iad"}')
    expect(screen.getByText("Showing 1 of 1 changes")).toBeTruthy()
    expect(getResultRegion().textContent).toContain('"path": "/region"')
    expect(getResultRegion().textContent).not.toContain('"pointer"')
  })

  test("ignores invalid persisted operation filters and falls back to defaults", () => {
    window.localStorage.setItem(
      STORAGE_KEYS.selectedOperations,
      JSON.stringify(["invalid"])
    )
    window.localStorage.setItem(STORAGE_KEYS.activeResultMode, "unknown")

    render(<JsonDiffPathClient messages={messages} />)

    expect(screen.getByText("Showing 4 of 4 changes")).toBeTruthy()
    expect(getResultRegion().textContent).toContain("$.region")
  })

  test("pauses automatic comparison for large JSON until compare now is clicked", async () => {
    render(<JsonDiffPathClient messages={messages} />)

    const largePayload = "x".repeat(LARGE_JSON_INPUT_THRESHOLD)
    const largeOriginal = JSON.stringify({ payload: largePayload })
    const largeModified = JSON.stringify({
      payload: largePayload,
      marker: true,
    })

    fireEvent.change(getOriginalInput(), {
      target: { value: largeOriginal },
    })
    fireEvent.change(getModifiedInput(), {
      target: { value: largeModified },
    })

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: messages.compareNowLabel })
      ).toBeTruthy()
    })

    expect(getResultRegion().textContent).not.toContain("$.marker")

    fireEvent.click(
      screen.getByRole("button", { name: messages.compareNowLabel })
    )

    await waitFor(() => {
      expect(getResultRegion().textContent).toContain("$.marker")
    })
  })
})
