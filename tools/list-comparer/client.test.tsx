import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import ListComparerClient from "./client"
import { DEFAULT_OPTIONS, STORAGE_KEYS } from "./constants"

const messages = {
  meta: {
    name: "List Comparer",
    description: "Compare two lists and export the exact result set you need.",
  },
  inputTitle: "Compare two lists before you sync or clean them up",
  inputDescription:
    "Paste two item sets, then inspect overlap, one-sided entries, and duplicates without leaving the browser.",
  listALabel: "List A",
  listBLabel: "List B",
  listStatsLabel: "{total} rows · {unique} unique",
  listAPlaceholder: "Paste source A…",
  listBPlaceholder: "Paste source B…",
  swapLists: "Swap lists",
  loadSample: "Load sample",
  clearLists: "Clear lists",
  optionsTitle: "Comparison options",
  optionsDescription:
    "Control how input is split and normalized before the comparison runs.",
  delimiterLabel: "Split items by",
  customDelimiterLabel: "Custom delimiter",
  trimItemsLabel: "Trim whitespace around each item",
  ignoreCaseLabel: "Ignore case differences",
  omitEmptyItemsLabel: "Skip empty rows",
  sortResultsLabel: "Sort result sets",
  delimiterNewlineLabel: "New line",
  delimiterCommaLabel: "Comma",
  delimiterTabLabel: "Tab",
  delimiterCustomLabel: "Custom",
  summaryTitle: "At a glance",
  summaryDescription:
    "Use the counts below to understand how much will match, drop out, or need deduping.",
  sharedLabel: "Shared",
  leftOnlyLabel: "Only in A",
  rightOnlyLabel: "Only in B",
  allUniqueLabel: "All unique",
  leftDuplicatesLabel: "A duplicates",
  rightDuplicatesLabel: "B duplicates",
  resultsTitle: "Result sets",
  resultsDescription:
    "Switch between each set, then copy or download exactly the slice you need.",
  activeCountLabel: "{count} rows in the active result",
  resultModeLabel: "Result set",
  emptyStateTitle: "Paste at least one list to start comparing",
  emptyStateDescription:
    "The comparer will build shared, one-sided, unique, and duplicate result sets from your input.",
  noItemsLabel: "No rows in this result set.",
  copyLabel: "Copy",
  copiedLabel: "Copied",
  downloadLabel: "Download result",
} as const

afterEach(() => {
  window.localStorage.clear()
  cleanup()
})

describe("ListComparerClient", () => {
  test("renders an empty state by default", () => {
    render(<ListComparerClient messages={messages} />)

    expect(screen.getByText(messages.emptyStateTitle)).toBeTruthy()
    expect(screen.getByLabelText(messages.listALabel)).toBeTruthy()
    expect(screen.getByLabelText(messages.listBLabel)).toBeTruthy()
  })

  test("loads sample data and shows the shared result set", async () => {
    render(<ListComparerClient messages={messages} />)

    fireEvent.click(screen.getByText(messages.loadSample))

    await waitFor(() => {
      expect(screen.getByText("3 rows in the active result")).toBeTruthy()
    })

    expect(screen.getByText("Shared (3)")).toBeTruthy()
    expect(screen.getByText("Only in A (2)")).toBeTruthy()
    expect(screen.getByText("Only in B (2)")).toBeTruthy()
    expect(screen.getByText("All unique (7)")).toBeTruthy()

    const textareas = screen.getAllByRole("textbox") as HTMLTextAreaElement[]

    expect(textareas[2]?.value).toBe("banana\nkiwi\napple")
  })

  test("swaps the two lists", async () => {
    render(<ListComparerClient messages={messages} />)

    const textareas = screen.getAllByRole("textbox") as HTMLTextAreaElement[]

    fireEvent.change(textareas[0]!, {
      target: { value: "left" },
    })
    fireEvent.change(textareas[1]!, {
      target: { value: "right" },
    })
    fireEvent.click(screen.getByText(messages.swapLists))

    await waitFor(() => {
      expect(textareas[0]?.value).toBe("right")
    })

    expect(textareas[1]?.value).toBe("left")
  })

  test("restores stored options and the active result from local storage", async () => {
    window.localStorage.setItem(STORAGE_KEYS.leftText, "A\nA")
    window.localStorage.setItem(STORAGE_KEYS.rightText, "a")
    window.localStorage.setItem(
      STORAGE_KEYS.options,
      JSON.stringify({
        ...DEFAULT_OPTIONS,
        ignoreCase: true,
      })
    )
    window.localStorage.setItem(STORAGE_KEYS.activeResult, "left-duplicates")

    render(<ListComparerClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByText("A duplicates (1)")).toBeTruthy()
    })

    expect(
      (screen.getAllByRole("textbox") as HTMLTextAreaElement[])[2]?.value
    ).toBe("A\t2")
  })
})
