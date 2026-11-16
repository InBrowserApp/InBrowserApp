import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import RegexTesterReplacerClient from "./client"
import { analyzeRegex } from "./core/regex-tester-replacer"
import { STORAGE_KEYS } from "./constants"

import type {
  RegexAnalysisWorkerRequest,
  RegexAnalysisWorkerResponse,
} from "./client/regex-analysis-types"

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
  analysisLoadingLabel: "Checking the pattern…",
  analysisTimeoutLabel:
    "The pattern took too long to run. Shorten it or the test text and try again.",
  analysisFailedLabel: "Could not complete regex analysis. Please try again.",
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

type WorkerListener = (event: MessageEvent<RegexAnalysisWorkerResponse>) => void

class MockWorker {
  static autoRespond = true
  static instances: MockWorker[] = []

  private readonly messageListeners = new Set<WorkerListener>()

  request: RegexAnalysisWorkerRequest | null = null
  terminated = false

  constructor(_url: URL, _options: WorkerOptions) {
    MockWorker.instances.push(this)
  }

  addEventListener(type: string, listener: WorkerListener) {
    if (type === "message") {
      this.messageListeners.add(listener)
    }
  }

  removeEventListener(type: string, listener: WorkerListener) {
    if (type === "message") {
      this.messageListeners.delete(listener)
    }
  }

  postMessage(request: RegexAnalysisWorkerRequest) {
    this.request = request

    if (MockWorker.autoRespond) {
      queueMicrotask(() => {
        this.emitMessage({
          ok: true,
          analysis: analyzeRegex(
            request.sourceText,
            request.pattern,
            request.flags,
            request.replacement,
            {
              matchLimit: request.matchLimit,
              previewLimit: request.previewLimit,
            }
          ),
        })
      })
    }
  }

  terminate() {
    this.terminated = true
  }

  emitMessage(data: RegexAnalysisWorkerResponse) {
    for (const listener of this.messageListeners) {
      listener({ data } as MessageEvent<RegexAnalysisWorkerResponse>)
    }
  }
}

beforeEach(() => {
  MockWorker.autoRespond = true
  MockWorker.instances = []
  vi.stubGlobal("Worker", MockWorker as unknown as typeof Worker)
  window.localStorage.clear()
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

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

    await waitFor(() => {
      expect(screen.getByText("Matches: 2")).toBeTruthy()
    })

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

  test("ignores a result from a cancelled analysis", async () => {
    MockWorker.autoRespond = false
    render(<RegexTesterReplacerClient messages={messages} />)

    await waitFor(() => {
      expect(MockWorker.instances).toHaveLength(1)
    })

    const oldWorker = MockWorker.instances[0]!
    const oldRequest = oldWorker.request!

    fireEvent.change(
      screen.getByRole("textbox", { name: messages.sourceTextLabel }),
      { target: { value: "Order #999-XYZ" } }
    )

    await waitFor(() => {
      expect(MockWorker.instances).toHaveLength(2)
    })

    const currentWorker = MockWorker.instances[1]!
    const currentRequest = currentWorker.request!

    expect(oldWorker.terminated).toBe(true)
    expect(currentRequest.sourceText).toBe("Order #999-XYZ")

    oldWorker.emitMessage({
      ok: true,
      analysis: analyzeRegex(
        oldRequest.sourceText,
        oldRequest.pattern,
        oldRequest.flags,
        oldRequest.replacement
      ),
    })
    expect(screen.getByRole("status").textContent).toBe(
      messages.analysisLoadingLabel
    )

    currentWorker.emitMessage({
      ok: true,
      analysis: analyzeRegex(
        currentRequest.sourceText,
        currentRequest.pattern,
        currentRequest.flags,
        currentRequest.replacement
      ),
    })

    await waitFor(() => {
      expect(screen.getByText("Matches: 1")).toBeTruthy()
    })

    fireEvent.click(screen.getByText(messages.replaceTabLabel))

    await waitFor(() => {
      expect(
        (
          screen.getByRole("textbox", {
            name: messages.replaceTabLabel,
          }) as HTMLTextAreaElement
        ).value
      ).toBe("Order ID:999 Code:XYZ")
    })
  })
})
