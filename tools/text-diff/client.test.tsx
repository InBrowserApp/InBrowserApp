import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import TextDiffClient from "./client"
import {
  DEFAULT_MODIFIED_TEXT,
  DEFAULT_ORIGINAL_TEXT,
  STORAGE_KEYS,
} from "./constants"

const messages = {
  meta: {
    name: "Text Diff",
    description:
      "Compare two drafts side by side, inspect changed lines, and export a clean unified diff without leaving the browser.",
  },
  inputTitle: "Compare two drafts before you merge, publish, or review",
  inputDescription:
    "Paste two text versions to inspect line edits, spot inserted or removed content, and export a compact diff from the browser.",
  originalLabel: "Original text",
  modifiedLabel: "Modified text",
  originalPlaceholder:
    "Paste the original paragraph, config, changelog, or code sample…",
  modifiedPlaceholder: "Paste the revised version you want to compare…",
  textStatsLabel: "{lines} lines · {chars} chars",
  importOriginalLabel: "Import original",
  importModifiedLabel: "Import modified",
  swapTextsLabel: "Swap texts",
  loadSampleLabel: "Load sample",
  clearTextsLabel: "Clear texts",
  optionsTitle: "Comparison options",
  optionsDescription:
    "Tune how the matcher treats case, whitespace, and unchanged rows.",
  viewModeLabel: "View mode",
  sideBySideLabel: "Side by side",
  unifiedLabel: "Unified",
  hideUnchangedLabel: "Hide unchanged rows",
  ignoreCaseLabel: "Ignore case changes",
  ignoreWhitespaceLabel: "Ignore whitespace changes",
  summaryTitle: "At a glance",
  summaryDescription:
    "These totals show how much stayed stable, changed in place, or moved in and out.",
  unchangedLabel: "Unchanged",
  changedLabel: "Changed",
  addedLabel: "Added",
  removedLabel: "Removed",
  resultsTitle: "Diff result",
  resultsDescription:
    "Review the highlighted rows in your preferred layout, then copy or download a unified diff.",
  copyDiffLabel: "Copy diff",
  copiedLabel: "Copied",
  downloadDiffLabel: "Download diff",
  emptyStateTitle: "Paste two text versions to start comparing",
  emptyStateDescription:
    "The diff view will line up both drafts, mark inserts and removals, and keep line numbers aligned for review.",
  noChangesTitle: "No visible differences with the current options",
  noChangesDescription:
    "The matcher found the same content after applying your compare settings.",
  originalLegendLabel: "Original",
  modifiedLegendLabel: "Modified",
} as const

afterEach(() => {
  window.localStorage.clear()
  cleanup()
})

describe("TextDiffClient", () => {
  test("renders the empty state by default", () => {
    render(<TextDiffClient messages={messages} />)

    expect(screen.getByText(messages.emptyStateTitle)).toBeTruthy()

    const textareas = screen.getAllByRole("textbox") as HTMLTextAreaElement[]

    expect(textareas[0]?.value).toBe("")
    expect(textareas[1]?.value).toBe("")
  })

  test("loads sample text into both editors", async () => {
    render(<TextDiffClient messages={messages} />)

    fireEvent.click(screen.getByText(messages.loadSampleLabel))

    await waitFor(() => {
      expect(
        (screen.getAllByRole("textbox") as HTMLTextAreaElement[])[0]?.value
      ).toBe(DEFAULT_ORIGINAL_TEXT)
    })

    const textareas = screen.getAllByRole("textbox") as HTMLTextAreaElement[]

    expect(textareas[1]?.value).toBe(DEFAULT_MODIFIED_TEXT)
    expect(screen.getByText(messages.resultsTitle)).toBeTruthy()
  })

  test("restores text and settings from local storage", async () => {
    window.localStorage.setItem(STORAGE_KEYS.originalText, "alpha")
    window.localStorage.setItem(STORAGE_KEYS.modifiedText, "ALPHA")
    window.localStorage.setItem(
      STORAGE_KEYS.settings,
      JSON.stringify({
        compareOptions: {
          ignoreCase: true,
          ignoreWhitespace: false,
        },
        viewMode: "unified",
        hideUnchanged: true,
      })
    )

    render(<TextDiffClient messages={messages} />)

    await waitFor(() => {
      expect(
        (screen.getAllByRole("textbox") as HTMLTextAreaElement[])[0]?.value
      ).toBe("alpha")
    })

    expect(
      (screen.getAllByRole("textbox") as HTMLTextAreaElement[])[1]?.value
    ).toBe("ALPHA")
    expect(
      screen
        .getByRole("radio", { name: messages.unifiedLabel })
        .getAttribute("data-state")
    ).toBe("on")
    expect(
      screen
        .getByLabelText(messages.hideUnchangedLabel)
        .getAttribute("data-state")
    ).toBe("checked")
    expect(screen.getByText(messages.noChangesTitle)).toBeTruthy()
    expect(window.localStorage.getItem(STORAGE_KEYS.originalText)).toBe("alpha")
    expect(window.localStorage.getItem(STORAGE_KEYS.modifiedText)).toBe("ALPHA")
  })
})
