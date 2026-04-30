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
  splitViewLabel: "Split view",
  previewOnlyLabel: "Preview only",
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
  previewEmptyDescription: "Switch back to split view and start typing.",
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

  test("switches to preview-only mode, toggles theme and outline, and restores split view", async () => {
    render(
      <MarkdownPreviewerClient
        messages={messages}
        language="en"
        direction="ltr"
      />
    )

    fireEvent.click(
      screen.getByRole("radio", { name: messages.previewOnlyLabel })
    )

    await waitFor(() => {
      expect(
        screen.queryByRole("textbox", { name: messages.sourceLabel })
      ).toBeNull()
    })

    fireEvent.click(
      screen.getByRole("radio", { name: messages.slateThemeLabel })
    )
    fireEvent.click(screen.getByLabelText(messages.showOutlineLabel))

    await waitFor(() => {
      expect(screen.queryByText(messages.outlineTitle)).toBeNull()
    })

    fireEvent.click(
      screen.getByRole("radio", { name: messages.splitViewLabel })
    )

    await waitFor(() => {
      expect(getMarkdownInput()).toBeTruthy()
    })
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
    window.localStorage.setItem(STORAGE_KEYS.previewMode, "preview")
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
      expect(
        screen.queryByRole("textbox", { name: messages.sourceLabel })
      ).toBeNull()
    })

    fireEvent.click(
      screen.getByRole("radio", { name: messages.splitViewLabel })
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
