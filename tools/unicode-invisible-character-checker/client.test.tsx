import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import UnicodeInvisibleCharacterCheckerClient from "./client"

const messages = {
  meta: {
    name: "Unicode Invisible Character Checker",
    description:
      "Find zero-width, bidi control, and stealth whitespace characters.",
  },
  inputTitle: "Scan a draft for hidden Unicode characters",
  inputDescription:
    "Paste text to surface invisible characters before they leak into production.",
  inputPlaceholder:
    "Paste text, email copy, code samples, or imported content…",
  loadSample: "Load sample",
  clearText: "Clear text",
  filtersTitle: "Detection filters",
  filtersDescription: "Focus on the categories you want to inspect.",
  selectAll: "Select all",
  resetFilters: "Reset filters",
  zeroWidthLabel: "Zero-width",
  bidiControlLabel: "Bidi control",
  spaceLikeLabel: "Special spaces",
  formatLabel: "Format controls",
  emptyStateTitle: "Paste text to start scanning",
  emptyStateDescription:
    "The checker will flag invisible characters, show where they appear, and prepare a cleaned copy.",
  resultsTitle: "Results",
  resultsDescription:
    "See what was detected, copy a cleaned version, or inspect each finding.",
  findingsCountLabel: "{count} findings",
  cleanLengthLabel: "{count} visible characters",
  activeFiltersLabel: "{count} active categories",
  noIssuesLabel: "No invisible characters in the selected categories.",
  cleanedTitle: "Cleaned text",
  annotatedTitle: "Annotated preview",
  copyLabel: "Copy",
  copiedLabel: "Copied",
  downloadCleaned: "Download cleaned text",
  downloadAnnotated: "Download annotated preview",
  findingsTableTitle: "Findings",
  indexLabel: "Index",
  lineLabel: "Line",
  columnLabel: "Column",
  codeLabel: "Code",
  nameLabel: "Name",
  categoryLabel: "Category",
  previewLabel: "Preview",
} as const

afterEach(() => {
  window.localStorage.clear()
  cleanup()
})

describe("UnicodeInvisibleCharacterCheckerClient", () => {
  test("renders an empty state by default", () => {
    render(<UnicodeInvisibleCharacterCheckerClient messages={messages} />)

    expect(screen.getByText(messages.emptyStateTitle)).toBeTruthy()
    expect(
      (screen.getByLabelText(messages.inputPlaceholder) as HTMLTextAreaElement)
        .value
    ).toBe("")
  })

  test("loads sample text and shows findings", async () => {
    render(<UnicodeInvisibleCharacterCheckerClient messages={messages} />)

    fireEvent.click(screen.getByText(messages.loadSample))

    await waitFor(() => {
      expect(screen.getByText("6 findings")).toBeTruthy()
    })

    expect(screen.getByText("Zero-width: 1")).toBeTruthy()
    expect(screen.getByText("Bidi control: 2")).toBeTruthy()
    expect(screen.getByText("Special spaces: 2")).toBeTruthy()
    expect(screen.getByText("Format controls: 1")).toBeTruthy()

    const textareas = screen.getAllByRole("textbox") as HTMLTextAreaElement[]

    expect(textareas[1]?.value).toBe(
      "HelloWorld\nPrice:123USD\nOrderID: 42\nDirection/LTRRTL"
    )
    expect(textareas[2]?.value).toContain("[[ZWSP]]")
  })

  test("filters matches by category", async () => {
    render(<UnicodeInvisibleCharacterCheckerClient messages={messages} />)

    fireEvent.click(screen.getByText(messages.loadSample))

    await waitFor(() => {
      expect(screen.getByText("6 findings")).toBeTruthy()
    })

    fireEvent.click(screen.getByLabelText(messages.zeroWidthLabel))
    fireEvent.click(screen.getByLabelText(messages.spaceLikeLabel))
    fireEvent.click(screen.getByLabelText(messages.formatLabel))

    await waitFor(() => {
      expect(screen.getByText("2 findings")).toBeTruthy()
    })

    expect(screen.getByText("Bidi control: 2")).toBeTruthy()
    expect(screen.queryByText("Zero-width: 1")).toBeNull()
  })

  test("restores text and selected categories from local storage", async () => {
    window.localStorage.setItem(
      "tools:unicode-invisible-character-checker:text",
      "Alpha\u200B"
    )
    window.localStorage.setItem(
      "tools:unicode-invisible-character-checker:categories",
      JSON.stringify(["zero-width"])
    )

    render(<UnicodeInvisibleCharacterCheckerClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByText("1 findings")).toBeTruthy()
    })

    expect(
      (screen.getByLabelText(messages.inputPlaceholder) as HTMLTextAreaElement)
        .value
    ).toBe("Alpha\u200B")
    expect(screen.getByText("1 active categories")).toBeTruthy()
  })

  test("scans whitespace-only input instead of showing the empty state", async () => {
    render(<UnicodeInvisibleCharacterCheckerClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.inputPlaceholder), {
      target: { value: "\u00A0" },
    })

    await waitFor(() => {
      expect(screen.getByText("1 findings")).toBeTruthy()
    })

    expect(screen.queryByText(messages.emptyStateTitle)).toBeNull()
    expect(screen.getByText("Special spaces: 1")).toBeTruthy()
  })
})
