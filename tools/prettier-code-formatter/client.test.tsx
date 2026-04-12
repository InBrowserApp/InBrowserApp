import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import PrettierCodeFormatterClient from "./client"
import {
  DEFAULT_SOURCE_CODE,
  LARGE_PRETTIER_INPUT_THRESHOLD,
  STORAGE_KEYS,
} from "./client/constants"
import { formatCodeWithPrettierWorker } from "./client/prettier-worker-client"

vi.mock("./client/prettier-worker-client", () => ({
  formatCodeWithPrettierWorker: vi.fn(),
}))

const mockedFormatCodeWithPrettierWorker = vi.mocked(
  formatCodeWithPrettierWorker
)

const messages = {
  meta: {
    name: "Prettier Code Formatter",
    description:
      "Format JavaScript, TypeScript, JSON, HTML, CSS, Markdown, YAML, GraphQL, and related files with Prettier directly in your browser.",
  },
  inputLabel: "Source code",
  inputDescription:
    "Paste JavaScript, TypeScript, JSON, HTML, CSS, Markdown, YAML, GraphQL, or related files and format them in the browser with Prettier.",
  inputPlaceholder: "Paste your code here...",
  outputLabel: "Formatted output",
  outputDescription:
    "The preview uses the selected Prettier parser and options below.",
  outputEmptyDescription:
    "Paste or import source code on the left to preview the formatted output here.",
  formattingLabel: "Formatting code...",
  formatErrorLabel: "Could not format this input",
  optionsLabel: "Formatting options",
  optionsDescription:
    "Choose the parser and style rules without editing the source by hand.",
  languageLabel: "Language",
  printWidthLabel: "Print width",
  tabWidthLabel: "Tab width",
  indentationLegend: "Indentation",
  styleLegend: "Style",
  useTabsLabel: "Use tabs",
  semicolonsLabel: "Semicolons",
  singleQuotesLabel: "Single quotes",
  trailingCommaLabel: "Trailing commas",
  trailingCommaNoneLabel: "None",
  trailingCommaEs5Label: "ES5",
  trailingCommaAllLabel: "All",
  useSampleLabel: "Use sample",
  clearLabel: "Clear",
  importFromFileLabel: "Import from file",
  formatNowLabel: "Format now",
  formatPausedHint:
    "Large input detected. Automatic formatting is paused to keep editing responsive.",
  copyFormattedLabel: "Copy formatted code",
  copiedLabel: "Copied",
  downloadFormattedLabel: "Download formatted file",
} as const

beforeEach(() => {
  const NativeURL = globalThis.URL

  class MockURL extends NativeURL {}

  Object.assign(MockURL, {
    createObjectURL: vi.fn(() => "blob:formatted-code"),
    revokeObjectURL: vi.fn(),
  })

  vi.stubGlobal("URL", MockURL)
  window.localStorage.clear()

  mockedFormatCodeWithPrettierWorker.mockImplementation(async (request) => {
    if (request.code === "{") {
      throw new Error("Unexpected end of JSON input")
    }

    if (request.code === "trigger-string-error") {
      throw "format failed"
    }

    return `formatted:${request.language}\n${request.code.trim()}`
  })
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

function getSourceTextarea() {
  return screen.getByRole("textbox", {
    name: messages.inputLabel,
  }) as HTMLTextAreaElement
}

function getOutputRegion() {
  return screen.getByRole("region", {
    name: messages.outputLabel,
  })
}

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

describe("PrettierCodeFormatterClient", () => {
  test("renders the default sample and formatted output", async () => {
    render(<PrettierCodeFormatterClient messages={messages} />)

    expect(screen.getByText(messages.inputDescription)).toBeTruthy()
    expect(screen.getByText(messages.outputDescription)).toBeTruthy()
    expect(getSourceTextarea().value).toBe(DEFAULT_SOURCE_CODE)

    await waitFor(() => {
      expect(getOutputRegion().textContent).toContain("formatted:javascript")
    })

    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  test("hydrates cached source code from local storage on mount", async () => {
    window.localStorage.setItem(STORAGE_KEYS.sourceCode, "const cached=1")

    render(<PrettierCodeFormatterClient messages={messages} />)

    await waitFor(() => {
      expect(getSourceTextarea().value).toBe("const cached=1")
    })

    await waitFor(() => {
      expect(getOutputRegion().textContent).toContain("const cached=1")
    })
  })

  test("shows formatter errors in the output region and disables export actions", async () => {
    render(<PrettierCodeFormatterClient messages={messages} />)

    fireEvent.change(getSourceTextarea(), {
      target: { value: "{" },
    })

    await waitFor(() => {
      expect(getOutputRegion().textContent).toContain(messages.formatErrorLabel)
    })

    expect(getOutputRegion().textContent).toContain(
      "Unexpected end of JSON input"
    )
    expect(
      screen.getByRole("button", { name: messages.copyFormattedLabel })
    ).toHaveProperty("disabled", true)
    expect(
      screen.getByRole("button", { name: messages.downloadFormattedLabel })
    ).toHaveProperty("disabled", true)
  })

  test("imports a file and auto-detects the prettier language from its extension", async () => {
    render(<PrettierCodeFormatterClient messages={messages} />)

    const file = new File(["const answer=42"], "demo.ts", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(getSourceTextarea().value).toBe("const answer=42")
    })

    await waitFor(() => {
      expect(getOutputRegion().textContent).toContain("formatted:typescript")
    })
  })

  test("replaces the sample when the selected language changes", async () => {
    render(<PrettierCodeFormatterClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("combobox", { name: messages.languageLabel })
    )
    fireEvent.click(screen.getByRole("option", { name: "TypeScript" }))

    await waitFor(() => {
      expect(getSourceTextarea().value).toContain("type User =")
    })

    await waitFor(() => {
      expect(getOutputRegion().textContent).toContain("formatted:typescript")
    })
  })

  test("ignores empty file selections", async () => {
    render(<PrettierCodeFormatterClient messages={messages} />)

    const initialValue = getSourceTextarea().value

    fireEvent.change(getFileInput(), {
      target: { files: [] },
    })

    await waitFor(() => {
      expect(getSourceTextarea().value).toBe(initialValue)
    })
  })

  test("stores source code and formatting options in local storage", async () => {
    render(<PrettierCodeFormatterClient messages={messages} />)

    fireEvent.change(getSourceTextarea(), {
      target: { value: "const next=1" },
    })

    await waitFor(() => {
      expect(window.localStorage.getItem(STORAGE_KEYS.sourceCode)).toBe(
        "const next=1"
      )
    })

    expect(window.localStorage.getItem(STORAGE_KEYS.formatOptions)).toContain(
      '"language":"javascript"'
    )
  })

  test("pauses auto-formatting for large input until format now is clicked", async () => {
    render(<PrettierCodeFormatterClient messages={messages} />)

    const largeInput = `${"x".repeat(LARGE_PRETTIER_INPUT_THRESHOLD)} demo`

    fireEvent.change(getSourceTextarea(), {
      target: { value: largeInput },
    })

    expect(screen.getByText(messages.formatPausedHint)).toBeTruthy()

    const formatNowButton = screen.getByRole("button", {
      name: messages.formatNowLabel,
    })

    expect(getOutputRegion().textContent).not.toContain(largeInput)

    fireEvent.click(formatNowButton)

    await waitFor(() => {
      expect(getOutputRegion().textContent).toContain(largeInput)
    })
  })

  test("clears the current source and returns the output to its empty state", async () => {
    render(<PrettierCodeFormatterClient messages={messages} />)

    await waitFor(() => {
      expect(getOutputRegion().textContent).toContain("formatted:javascript")
    })

    fireEvent.click(screen.getByRole("button", { name: messages.clearLabel }))

    await waitFor(() => {
      expect(getSourceTextarea().value).toBe("")
    })

    expect(
      within(getOutputRegion()).getByText(messages.outputEmptyDescription)
    ).toBeTruthy()

    await waitFor(() => {
      expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:formatted-code")
    })
  })

  test("resets the current language sample and format options", async () => {
    render(<PrettierCodeFormatterClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("button", { name: messages.useSampleLabel })
    )

    await waitFor(() => {
      expect(getSourceTextarea().value).toBe(DEFAULT_SOURCE_CODE)
    })

    expect(window.localStorage.getItem(STORAGE_KEYS.formatOptions)).toContain(
      '"trailingComma":"es5"'
    )
  })

  test("falls back to the generic error label for non-Error rejections", async () => {
    render(<PrettierCodeFormatterClient messages={messages} />)

    fireEvent.change(getSourceTextarea(), {
      target: { value: "trigger-string-error" },
    })

    await waitFor(() => {
      expect(getOutputRegion().textContent).toContain(messages.formatErrorLabel)
    })
  })
})
