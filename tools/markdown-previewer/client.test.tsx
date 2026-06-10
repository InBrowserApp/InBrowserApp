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

import MarkdownPreviewerClient from "./client"
import { STORAGE_KEYS } from "./constants"

const messages = {
  meta: {
    name: "Markdown Previewer",
    description:
      "Preview Markdown with a live outline, presentation themes, and export actions.",
  },
  editorTitle: "Markdown source",
  editorDescription:
    "Write, paste, or import Markdown. The preview updates as you type.",
  sourceLabel: "Markdown",
  sourcePlaceholder: "Write Markdown here…",
  importLabel: "Import file",
  loadSampleLabel: "Load sample",
  loadSampleConfirmMessage: "Replace draft?",
  clearLabel: "Clear",
  clearConfirmMessage: "Clear draft?",
  previewTitle: "Live preview",
  previewDescription:
    "Review the rendered document, tune the presentation, and export HTML.",
  themeLabel: "Theme",
  cleanThemeLabel: "Clean",
  slateThemeLabel: "Slate",
  sanitizeHtmlLabel: "Sanitize HTML",
  showOutlineLabel: "Show outline",
  wordsLabel: "Words",
  headingsLabel: "Headings",
  linksLabel: "Links",
  imagesLabel: "Images",
  readTimeLabel: "Read time",
  outlineTitle: "Outline",
  outlineDescription: "Jump between headings in the current document.",
  outlineEmptyTitle: "No headings yet",
  outlineEmptyDescription: "Add Markdown headings to build an outline.",
  previewEmptyTitle: "Nothing to preview yet",
  previewEmptyDescription:
    "Start typing in the editor or import a Markdown file to render a preview.",
  copyHtmlLabel: "Copy HTML",
  copiedLabel: "Copied",
  downloadHtmlLabel: "Download HTML",
  printLabel: "Print",
  untitledHeadingLabel: "Untitled",
} as const

beforeEach(() => {
  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => "blob:markdown-preview"),
      revokeObjectURL: vi.fn(),
    })
  )
  vi.stubGlobal(
    "confirm",
    vi.fn(() => true)
  )

  window.localStorage.clear()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function getMarkdownInput() {
  return screen.getByRole("textbox", {
    name: messages.sourceLabel,
  }) as HTMLTextAreaElement
}

function makeRect(top: number, height: number): DOMRect {
  return {
    bottom: top + height,
    height,
    left: 0,
    right: 640,
    top,
    width: 640,
    x: 0,
    y: top,
    toJSON: () => ({}),
  } as DOMRect
}

describe("MarkdownPreviewerClient", () => {
  test("renders the default sample, preview metrics, and a download link", () => {
    render(
      <MarkdownPreviewerClient
        messages={messages}
        language="en"
        direction="ltr"
      />
    )

    expect(screen.getByText(messages.editorDescription)).toBeTruthy()
    expect(getMarkdownInput().value).toContain("# Product launch checklist")
    expect(screen.getByText(messages.previewDescription)).toBeTruthy()
    expect(screen.getByText(messages.outlineTitle)).toBeTruthy()
    expect(
      screen.getByRole("link", { name: messages.downloadHtmlLabel })
    ).toHaveProperty("href", "blob:markdown-preview")
    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  test("toggles theme and outline without hiding the editor", async () => {
    render(
      <MarkdownPreviewerClient
        messages={messages}
        language="en"
        direction="ltr"
      />
    )

    expect(
      screen.getAllByRole("radio").map((radio) => radio.textContent)
    ).toEqual([messages.cleanThemeLabel, messages.slateThemeLabel])

    fireEvent.click(
      screen.getByRole("radio", { name: messages.slateThemeLabel })
    )
    fireEvent.click(screen.getByLabelText(messages.showOutlineLabel))

    await waitFor(() => {
      expect(screen.queryByText(messages.outlineTitle)).toBeNull()
    })

    expect(getMarkdownInput()).toBeTruthy()
  })

  test("scrolls the preview region instead of the page from outline clicks", () => {
    const scrollToDescriptor = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "scrollTo"
    )
    const previewScrollTo = vi.fn()
    const pageScrollTo = vi
      .spyOn(window, "scrollTo")
      .mockImplementation(() => undefined)

    Object.defineProperty(HTMLElement.prototype, "scrollTo", {
      configurable: true,
      value: previewScrollTo,
    })

    try {
      render(
        <MarkdownPreviewerClient
          messages={messages}
          language="en"
          direction="ltr"
        />
      )

      const previewRegion = screen.getByRole("region", {
        name: messages.previewTitle,
      })

      Object.defineProperty(previewRegion, "scrollTop", {
        configurable: true,
        value: 24,
        writable: true,
      })

      vi.spyOn(
        HTMLElement.prototype,
        "getBoundingClientRect"
      ).mockImplementation(function getBoundingClientRect(this: HTMLElement) {
        if (this === previewRegion) {
          return makeRect(100, 480)
        }

        if (this.id === "release-plan") {
          return makeRect(360, 32)
        }

        return makeRect(0, 0)
      })

      fireEvent.click(screen.getByRole("button", { name: "Release plan" }))

      expect(previewScrollTo).toHaveBeenCalledWith(
        expect.objectContaining({
          top: 284,
        })
      )
      expect(pageScrollTo).not.toHaveBeenCalled()
    } finally {
      if (scrollToDescriptor) {
        Object.defineProperty(
          HTMLElement.prototype,
          "scrollTo",
          scrollToDescriptor
        )
      } else {
        Reflect.deleteProperty(HTMLElement.prototype, "scrollTo")
      }
    }
  })

  test("imports markdown from a selected file", async () => {
    render(
      <MarkdownPreviewerClient
        messages={messages}
        language="en"
        direction="ltr"
      />
    )

    const file = new File(["# Imported"], "draft.md", {
      type: "text/markdown",
    })

    fireEvent.change(screen.getByLabelText(messages.importLabel), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(getMarkdownInput().value).toBe("# Imported")
    })
  })

  test("keeps imported markdown when loading the sample is canceled", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false)

    render(
      <MarkdownPreviewerClient
        messages={messages}
        language="en"
        direction="ltr"
      />
    )

    const file = new File(["# Imported"], "draft.md", {
      type: "text/markdown",
    })

    fireEvent.change(screen.getByLabelText(messages.importLabel), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(getMarkdownInput().value).toBe("# Imported")
    })

    fireEvent.click(
      screen.getByRole("button", { name: messages.loadSampleLabel })
    )

    await waitFor(() => {
      expect(getMarkdownInput().value).toBe("# Imported")
    })

    expect(window.confirm).toHaveBeenCalledWith(
      messages.loadSampleConfirmMessage
    )
  })

  test("clears the editor and shows an empty preview state", async () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true)

    render(
      <MarkdownPreviewerClient
        messages={messages}
        language="en"
        direction="ltr"
      />
    )

    fireEvent.click(screen.getByRole("button", { name: messages.clearLabel }))

    await waitFor(() => {
      expect(getMarkdownInput().value).toBe("")
    })

    expect(screen.getByText(messages.previewEmptyTitle)).toBeTruthy()
    expect(
      screen.getByRole("button", { name: messages.downloadHtmlLabel })
    ).toHaveProperty("disabled", true)
    expect(confirmSpy).toHaveBeenCalledWith(messages.clearConfirmMessage)
  })

  test("keeps the draft when clear is canceled", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false)

    render(
      <MarkdownPreviewerClient
        messages={messages}
        language="en"
        direction="ltr"
      />
    )

    fireEvent.click(screen.getByRole("button", { name: messages.clearLabel }))

    await waitFor(() => {
      expect(getMarkdownInput().value).toContain("# Product launch checklist")
    })
  })

  test("restores persisted markdown and settings from local storage", async () => {
    window.localStorage.setItem(STORAGE_KEYS.markdown, "# Saved")
    window.localStorage.setItem(STORAGE_KEYS.previewTheme, "slate")
    window.localStorage.setItem(STORAGE_KEYS.sanitizeHtml, "false")
    window.localStorage.setItem(STORAGE_KEYS.showOutline, "false")

    render(
      <MarkdownPreviewerClient
        messages={messages}
        language="en"
        direction="ltr"
      />
    )

    await waitFor(() => {
      expect(getMarkdownInput().value).toBe("# Saved")
    })

    expect(
      screen.getByRole("radio", { name: messages.slateThemeLabel })
    ).toBeTruthy()
  })

  test("prints the exported HTML when a popup window is available", () => {
    render(
      <MarkdownPreviewerClient
        messages={messages}
        language="en"
        direction="ltr"
      />
    )

    const writeSpy = vi.fn()
    const openDocumentSpy = vi.fn()
    const closeDocumentSpy = vi.fn()
    const focusSpy = vi.fn()
    const printSpy = vi.fn()
    const closeSpy = vi.fn()
    const loadHandlers: Array<() => void> = []

    const printWindow = {
      document: {
        open: openDocumentSpy,
        write: writeSpy,
        close: closeDocumentSpy,
      },
      focus: focusSpy,
      print: printSpy,
      close: closeSpy,
      addEventListener: (event: string, handler: () => void) => {
        if (event === "load") {
          loadHandlers.push(handler)
        }
      },
      onafterprint: null as null | (() => void),
    }

    const openSpy = vi
      .spyOn(window, "open")
      .mockReturnValue(printWindow as unknown as Window)

    fireEvent.click(screen.getByRole("button", { name: messages.printLabel }))

    expect(openDocumentSpy).toHaveBeenCalled()
    expect(writeSpy.mock.calls[0]?.[0]).toContain("<!doctype html>")
    expect(writeSpy.mock.calls[0]?.[0]).toContain('<html lang="en" dir="ltr">')
    expect(focusSpy).toHaveBeenCalled()

    printWindow.onafterprint?.()
    expect(closeSpy).toHaveBeenCalled()

    loadHandlers.forEach((handler) => handler())
    expect(printSpy).toHaveBeenCalled()

    openSpy.mockRestore()
  })
})
