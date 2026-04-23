import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import HtmlToMarkdownConverterClient from "./client"
import { DEFAULT_UI_STATE, STORAGE_KEYS } from "./client/constants"
import { convertHtmlToMarkdown } from "./core/html-to-markdown"

const messages = {
  toolbarLabel: "Conversion controls",
  importFromFileLabel: "Import from file",
  useSampleLabel: "Use sample",
  clearLabel: "Clear",
  inputLabel: "HTML input",
  inputDescription:
    "Paste raw HTML or import an .html, .htm, or .txt file from this device.",
  inputPlaceholder: "Paste HTML here...",
  optionsTitle: "Markdown style",
  optionsDescription:
    "Choose the heading, list, and code block format that best matches your target Markdown flavor.",
  headingStyleLabel: "Headings",
  headingStyleAtxLabel: "ATX (# Heading)",
  headingStyleSetextLabel: "Setext (Heading + underline)",
  bulletStyleLabel: "Bullets",
  bulletStyleDashLabel: "Dash (-)",
  bulletStyleAsteriskLabel: "Asterisk (*)",
  bulletStylePlusLabel: "Plus (+)",
  codeBlockStyleLabel: "Code blocks",
  codeBlockStyleFencedLabel: "Fenced triple backticks",
  codeBlockStyleIndentedLabel: "Indented blocks",
  outputLabel: "Markdown output",
  outputDescription:
    "The converted Markdown updates automatically as you edit the HTML.",
  outputEmptyDescription: "Paste or import HTML to generate Markdown.",
  copyMarkdownLabel: "Copy Markdown",
  downloadMarkdownLabel: "Download Markdown",
  copiedLabel: "Copied",
  conversionErrorTitle: "The HTML could not be converted.",
} as const

beforeEach(() => {
  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => "blob:converted-markdown"),
      revokeObjectURL: vi.fn(),
    })
  )

  window.localStorage.clear()
})

afterEach(cleanup)

function getHtmlInput() {
  return screen.getByRole("textbox", {
    name: messages.inputLabel,
  }) as HTMLTextAreaElement
}

function getMarkdownOutput() {
  return screen.getByRole("region", {
    name: messages.outputLabel,
  })
}

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

describe("HtmlToMarkdownConverterClient", () => {
  test("renders the default example and its converted Markdown output", () => {
    render(<HtmlToMarkdownConverterClient messages={messages} />)

    const htmlInput = getHtmlInput()
    const markdownOutput = getMarkdownOutput()
    const expectedResult = convertHtmlToMarkdown(DEFAULT_UI_STATE.htmlText, {
      headingStyle: DEFAULT_UI_STATE.headingStyle,
      bulletListMarker: DEFAULT_UI_STATE.bulletListMarker,
      codeBlockStyle: DEFAULT_UI_STATE.codeBlockStyle,
    })

    expect(screen.getByText(messages.inputDescription)).toBeTruthy()
    expect(screen.getByText(messages.outputDescription)).toBeTruthy()
    expect(htmlInput.value).toBe(DEFAULT_UI_STATE.htmlText)
    expect(markdownOutput.textContent).toBe(
      expectedResult.state === "converted" ? expectedResult.markdown : ""
    )
    expect(markdownOutput.querySelector(".hljs")).toBeTruthy()
    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  test("shows an empty state and disables export actions after clearing the input", () => {
    render(<HtmlToMarkdownConverterClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.clearLabel }))

    const markdownOutput = getMarkdownOutput()

    expect(getHtmlInput().value).toBe("")
    expect(markdownOutput.textContent).toContain(
      messages.outputEmptyDescription
    )
    expect(markdownOutput.querySelector(".hljs")).toBeNull()
    expect(
      screen.getByRole("button", { name: messages.copyMarkdownLabel })
    ).toHaveProperty("disabled", true)
    expect(
      screen.getByRole("button", { name: messages.downloadMarkdownLabel })
    ).toHaveProperty("disabled", true)
  })

  test("restores the sample input after clearing", () => {
    render(<HtmlToMarkdownConverterClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.clearLabel }))
    fireEvent.click(
      screen.getByRole("button", { name: messages.useSampleLabel })
    )

    expect(getHtmlInput().value).toBe(DEFAULT_UI_STATE.htmlText)
    expect(getMarkdownOutput().textContent).toContain("Release checklist")
  })

  test("clicking the import button forwards to the hidden file input", () => {
    render(<HtmlToMarkdownConverterClient messages={messages} />)

    const fileInput = getFileInput()
    const clickSpy = vi.spyOn(fileInput, "click")

    fireEvent.click(
      screen.getByRole("button", { name: messages.importFromFileLabel })
    )

    expect(clickSpy).toHaveBeenCalled()

    clickSpy.mockRestore()
  })

  test("ignores file changes when no file is selected", () => {
    render(<HtmlToMarkdownConverterClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: { files: [] },
    })

    expect(getHtmlInput().value).toBe(DEFAULT_UI_STATE.htmlText)
  })

  test("imports HTML from a selected file", async () => {
    render(<HtmlToMarkdownConverterClient messages={messages} />)

    const file = new File(["<h1>Imported</h1><p>Hello</p>"], "demo.html", {
      type: "text/html",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(getHtmlInput().value).toBe("<h1>Imported</h1><p>Hello</p>")
    })

    expect(getMarkdownOutput().textContent).toBe("# Imported\n\nHello")
  })

  test("restores the last stored input and format options", () => {
    window.localStorage.setItem(
      STORAGE_KEYS.htmlText,
      "<h1>Saved</h1><ul><li>One</li></ul>"
    )
    window.localStorage.setItem(STORAGE_KEYS.headingStyle, "setext")
    window.localStorage.setItem(STORAGE_KEYS.bulletListMarker, "*")
    window.localStorage.setItem(STORAGE_KEYS.codeBlockStyle, "indented")

    render(<HtmlToMarkdownConverterClient messages={messages} />)

    expect(getHtmlInput().value).toBe("<h1>Saved</h1><ul><li>One</li></ul>")
    expect(getMarkdownOutput().textContent).toContain("Saved\n=====")
    expect(getMarkdownOutput().textContent).toContain("*   One")
    expect(
      screen.getByRole("link", { name: messages.downloadMarkdownLabel })
    ).toBeTruthy()
  })

  test("ignores invalid stored format options", () => {
    window.localStorage.setItem(STORAGE_KEYS.htmlText, "<h1>Saved</h1>")
    window.localStorage.setItem(STORAGE_KEYS.headingStyle, "unknown")
    window.localStorage.setItem(STORAGE_KEYS.bulletListMarker, "•")
    window.localStorage.setItem(STORAGE_KEYS.codeBlockStyle, "blocks")

    render(<HtmlToMarkdownConverterClient messages={messages} />)

    expect(getMarkdownOutput().textContent).toBe("# Saved")
  })

  test("persists edits to local storage", () => {
    render(<HtmlToMarkdownConverterClient messages={messages} />)

    fireEvent.change(getHtmlInput(), {
      target: { value: "<h2>Persisted</h2>" },
    })

    expect(window.localStorage.getItem(STORAGE_KEYS.htmlText)).toBe(
      "<h2>Persisted</h2>"
    )
  })

  test("revokes the previous download URL when output becomes empty", () => {
    render(<HtmlToMarkdownConverterClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.clearLabel }))

    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:converted-markdown")
  })

  test("renders the conversion controls with three style selectors", () => {
    render(<HtmlToMarkdownConverterClient messages={messages} />)

    expect(screen.getByText(messages.optionsTitle)).toBeTruthy()
    expect(
      screen.getByRole("combobox", { name: messages.headingStyleLabel })
    ).toBeTruthy()
    expect(
      screen.getByRole("combobox", { name: messages.bulletStyleLabel })
    ).toBeTruthy()
    expect(
      screen.getByRole("combobox", { name: messages.codeBlockStyleLabel })
    ).toBeTruthy()

    const toolbar = screen.getByLabelText(messages.toolbarLabel)
    expect(
      within(toolbar).getByRole("button", {
        name: messages.importFromFileLabel,
      })
    ).toBeTruthy()
  })
})
