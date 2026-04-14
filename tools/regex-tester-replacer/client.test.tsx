import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test } from "vitest"

import RegexTesterReplacerClient from "./client"
import { STORAGE_KEYS } from "./constants"

const messages = {
  meta: {
    name: "Regex Tester & Replacer",
    description: "Test regular expressions and preview replacements.",
  },
  sourceTitle: "Test text",
  sourceDescription: "Paste text to search and replace against.",
  sourceTextLabel: "Test text",
  sourceTextPlaceholder: "Paste text here",
  loadSample: "Load sample",
  clearText: "Clear text",
  patternTitle: "Pattern",
  patternDescription: "Tune the expression, replacement, and flags.",
  patternLabel: "Regular expression",
  patternPlaceholder: "#(\\d+)-([A-Z]+)",
  replacementLabel: "Replacement",
  replacementPlaceholder: "ID:$1 Code:$2",
  replacementHint: "Use $1 and $<name> references in replacements.",
  flagsLabel: "Flags",
  flagsHint: "Choose how the expression should run against the text.",
  globalFlagLabel: "Global",
  ignoreCaseFlagLabel: "Ignore case",
  multilineFlagLabel: "Multiline",
  dotAllFlagLabel: "Dot matches newline",
  unicodeFlagLabel: "Unicode",
  stickyFlagLabel: "Sticky",
  invalidPatternLabel: "Invalid pattern: {message}",
  summaryTitle: "Summary",
  summaryDescription: "Review what the current pattern is doing.",
  summaryEmpty: "Add both a pattern and some text to see results.",
  matchesCountLabel: "Matches: {count}",
  groupsCountLabel: "Capturing groups: {count}",
  zeroLengthCountLabel: "Zero-length matches: {count}",
  resultsTitle: "Results",
  resultsDescription:
    "Switch between preview, matches, and replacement output.",
  resultViewLabel: "Result view",
  previewTabLabel: "Preview",
  matchesTabLabel: "Matches",
  replaceTabLabel: "Replace",
  previewEmpty: "Nothing to preview yet.",
  previewTruncatedLabel: "Preview limited to the first {count} characters.",
  matchesEmpty: "No matches found.",
  matchesTruncatedLabel: "Showing the first {count} matches.",
  matchIndexLabel: "Match {count}",
  matchRangeLabel: "Range {start}-{end}",
  matchEmptyLabel: "(empty)",
  capturedGroupsLabel: "Captured groups",
  namedGroupsLabel: "Named groups",
  replaceOutputEmpty: "Replacement output will appear here.",
  copyLabel: "Copy",
  copiedLabel: "Copied",
  downloadLabel: "Download",
} as const

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(cleanup)

describe("RegexTesterReplacerClient", () => {
  test("renders sample defaults and replacement output", async () => {
    render(<RegexTesterReplacerClient messages={messages} />)

    expect(
      (
        screen.getByRole("textbox", {
          name: messages.sourceTextLabel,
        }) as HTMLTextAreaElement
      ).value
    ).toContain("Order #123-ABC")

    fireEvent.click(screen.getByText(messages.replaceTabLabel))

    await waitFor(() => {
      expect(
        (
          screen.getByRole("textbox", {
            name: messages.replaceTabLabel,
          }) as HTMLTextAreaElement
        ).value
      ).toContain("ID:123 Code:ABC")
    })
  })

  test("loads from local storage", async () => {
    window.localStorage.setItem(STORAGE_KEYS.sourceText, "hello 123")
    window.localStorage.setItem(STORAGE_KEYS.pattern, "\\d+")
    window.localStorage.setItem(STORAGE_KEYS.replacement, "num")
    window.localStorage.setItem(STORAGE_KEYS.flags, JSON.stringify(["g"]))
    window.localStorage.setItem(STORAGE_KEYS.activeResultView, "replace")

    render(<RegexTesterReplacerClient messages={messages} />)

    await waitFor(() => {
      expect(
        (
          screen.getByRole("textbox", {
            name: messages.sourceTextLabel,
          }) as HTMLTextAreaElement
        ).value
      ).toBe("hello 123")
      expect(
        (
          screen.getByRole("textbox", {
            name: messages.replaceTabLabel,
          }) as HTMLTextAreaElement
        ).value
      ).toBe("hello num")
    })
  })

  test("shows invalid pattern feedback", async () => {
    render(<RegexTesterReplacerClient messages={messages} />)

    fireEvent.change(
      screen.getByRole("textbox", { name: messages.patternLabel }),
      {
        target: { value: "(" },
      }
    )

    await waitFor(() => {
      expect(document.body.textContent).toContain("Invalid pattern:")
    })
  })

  test("loads the sample and clears the text", async () => {
    render(<RegexTesterReplacerClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.clearText }))

    await waitFor(() => {
      expect(
        (
          screen.getByRole("textbox", {
            name: messages.sourceTextLabel,
          }) as HTMLTextAreaElement
        ).value
      ).toBe("")
    })

    fireEvent.click(screen.getByRole("button", { name: messages.loadSample }))

    await waitFor(() => {
      expect(
        (
          screen.getByRole("textbox", {
            name: messages.sourceTextLabel,
          }) as HTMLTextAreaElement
        ).value
      ).toContain("Order #123-ABC")
    })
  })

  test("persists source text edits", async () => {
    render(<RegexTesterReplacerClient messages={messages} />)

    fireEvent.change(
      screen.getByRole("textbox", { name: messages.sourceTextLabel }),
      {
        target: { value: "Article 42" },
      }
    )

    await waitFor(() => {
      expect(window.localStorage.getItem(STORAGE_KEYS.sourceText)).toBe(
        "Article 42"
      )
    })
  })
})
