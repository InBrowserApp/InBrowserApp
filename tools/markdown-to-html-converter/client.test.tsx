// @vitest-environment jsdom
// DOMPurify (3.4.8+) walks the DOM with createNodeIterator, which happy-dom
// does not implement faithfully, so sanitize() mangles its output there
// (keeps unsafe attributes, drops safe tags). This client renders sanitized
// HTML, so the test runs under jsdom for parity with real browsers. See #965.
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import MarkdownToHtmlConverterClient from "./client"

const messages = {
  meta: {
    name: "Markdown to HTML Converter",
    description: "Convert Markdown into HTML.",
  },
  markdownLabel: "Markdown",
  markdownDescription: "Draft Markdown and import text files.",
  markdownPlaceholder: "Enter Markdown here...",
  importFromFileLabel: "Import from file",
  loadSampleLabel: "Load sample",
  sampleMarkdown: `# Launch notes

Markdown stays easy to write, and HTML gives you final markup you can ship.

## This sample includes

- headings
- emphasis and **strong text**
- lists and links

> Toggle sanitization when you need to inspect the raw fragment.

[Read the docs](https://www.markdownguide.org/)`,
  resetLabel: "Reset",
  outputLabel: "Rendered HTML",
  outputDescription: "Preview the rendered fragment and inspect the source.",
  sanitizeLabel: "Sanitize output",
  sanitizeDescription: "Remove unsafe tags and attributes before export.",
  previewLabel: "Preview",
  previewDescription: "Sandboxed preview of the generated fragment.",
  emptyTitle: "No HTML yet",
  emptyDescription: "Type or import Markdown to generate output.",
  charactersLabel: "Chars",
  linesLabel: "Lines",
  copyHtmlLabel: "Copy HTML",
  copiedLabel: "Copied",
  downloadHtmlLabel: "Download HTML",
  printHtmlLabel: "Print HTML",
} as const

describe("MarkdownToHtmlConverterClient", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  test("shows an empty state before markdown is entered", () => {
    render(<MarkdownToHtmlConverterClient lang="en" messages={messages} />)

    expect(screen.getAllByText("No HTML yet")).toHaveLength(2)

    const downloadButton = screen.getByRole("button", {
      name: "Download HTML",
    }) as HTMLButtonElement
    expect(downloadButton.disabled).toBe(true)

    const printButton = screen.getByRole("button", {
      name: "Print HTML",
    }) as HTMLButtonElement
    expect(printButton.disabled).toBe(true)
  })

  test("loads the sample markdown and generates downloadable html", async () => {
    render(<MarkdownToHtmlConverterClient lang="en" messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: "Load sample" }))

    await waitFor(() => {
      expect(
        screen
          .getByRole("region", { name: "Rendered HTML" })
          .querySelector(".hljs")
      ).toBeTruthy()
      expect(
        (
          screen.getByRole("textbox", {
            name: "Markdown",
          }) as HTMLTextAreaElement
        ).value
      ).toContain("# Launch notes")
    })

    const downloadLink = screen.getByRole("link", { name: "Download HTML" })
    expect(downloadLink.getAttribute("download")).toBe("markdown.html")
    expect(downloadLink.getAttribute("href")).toMatch(/^blob:/)
  })

  test("sanitizes html by default and exposes raw html when toggled off", async () => {
    render(<MarkdownToHtmlConverterClient lang="en" messages={messages} />)

    fireEvent.change(screen.getByRole("textbox", { name: "Markdown" }), {
      target: {
        value: '# Heading\n\n<img src="x" onerror="alert(1)">',
      },
    })

    await waitFor(() => {
      const htmlSource = document.querySelector("pre code")
      expect(htmlSource?.textContent?.includes("onerror")).toBe(false)
    })

    fireEvent.click(screen.getByRole("switch", { name: "Sanitize output" }))

    await waitFor(() => {
      const htmlSource = document.querySelector("pre code")
      expect(htmlSource?.textContent?.includes("onerror")).toBe(true)
    })
  })

  test("imports markdown from a file", async () => {
    render(<MarkdownToHtmlConverterClient lang="en" messages={messages} />)

    expect(
      screen.getAllByRole("button", { name: "Import from file" })
    ).toHaveLength(1)

    const file = new File(["# Imported"], "notes.md", {
      type: "text/markdown",
    })

    fireEvent.change(document.querySelector('input[type="file"]')!, {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(
        (
          screen.getByRole("textbox", {
            name: "Markdown",
          }) as HTMLTextAreaElement
        ).value
      ).toBe("# Imported")
    })
  })

  test("prints the preview document when requested", async () => {
    render(<MarkdownToHtmlConverterClient lang="en" messages={messages} />)

    fireEvent.change(screen.getByRole("textbox", { name: "Markdown" }), {
      target: { value: "# Print me" },
    })

    const printFrame = screen.getByTitle("Print HTML") as HTMLIFrameElement

    await waitFor(() => {
      expect(printFrame.getAttribute("srcdoc")).toContain("<h1>Print me</h1>")
    })

    expect(printFrame.getAttribute("sandbox")).toBe(
      "allow-modals allow-same-origin"
    )

    const printWindow = printFrame.contentWindow!
    const focus = vi.fn()
    const print = vi.fn()

    Object.defineProperties(printWindow, {
      focus: { configurable: true, value: focus },
      print: { configurable: true, value: print },
    })

    fireEvent.click(screen.getByRole("button", { name: "Print HTML" }))

    expect(focus).toHaveBeenCalled()
    expect(print).toHaveBeenCalled()
  })
})
