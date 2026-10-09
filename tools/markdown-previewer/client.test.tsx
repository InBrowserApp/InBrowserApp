// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import MarkdownPreviewerClient from "./client"
import { STORAGE_KEYS, DEFAULT_MARKDOWN } from "./constants"
import { buildMarkdownPreview } from "./core/markdown-preview"
import catalog from "./messages/en.json"
import meta from "./meta/en.json"

const m = { ...catalog, meta }
class ParserWorker {
  static fail = false
  onmessage: ((event: { data: object }) => void) | null = null
  onerror: (() => void) | null = null
  terminated = false
  postMessage(data: { source: string; untitled: string; renderHtml: boolean }) {
    queueMicrotask(() => {
      if (this.terminated) return
      this.onmessage?.({
        data: ParserWorker.fail
          ? { error: true }
          : {
              preview: buildMarkdownPreview(
                data.source,
                data.untitled,
                data.renderHtml
              ),
            },
      })
    })
  }
  terminate() {
    this.terminated = true
  }
}
beforeEach(() => {
  ParserWorker.fail = false
  vi.stubGlobal("Worker", ParserWorker)
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    }
  )
  URL.createObjectURL = vi.fn(() => "blob:markdown-preview")
  URL.revokeObjectURL = vi.fn()
  vi.spyOn(window, "confirm").mockReturnValue(true)
  localStorage.clear()
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
const editor = () =>
  document.querySelector<HTMLTextAreaElement>(
    'textarea[name="markdown-source"]'
  )!
const frame = () => screen.getByTitle(m.previewTitle) as HTMLIFrameElement
const mount = () =>
  render(<MarkdownPreviewerClient messages={m} language="en" direction="ltr" />)
async function ready(text: string) {
  await waitFor(() => expect(frame().srcdoc).toContain(text))
}
function select(text: string, name = "private.md") {
  fireEvent.change(screen.getByLabelText(m.importLabel), {
    target: { files: [new File([text], name, { type: "text/markdown" })] },
  })
}

describe("Markdown reading and editing", () => {
  test("retains the sample, live source editing, theme, export, and collapsible outline", async () => {
    mount()
    await ready("Product launch checklist")
    expect(editor().value).toBe(DEFAULT_MARKDOWN)
    fireEvent.change(editor(), {
      target: { value: "# Draft\n\nPasted **text**." },
    })
    await ready("<strong>text</strong>")
    expect(localStorage.getItem(STORAGE_KEYS.markdown)).toContain("# Draft")
    expect(
      await screen.findByRole("link", { name: m.downloadHtmlLabel })
    ).toHaveProperty("href", "blob:markdown-preview")
    fireEvent.click(screen.getByRole("radio", { name: m.slateThemeLabel }))
    expect(localStorage.getItem(STORAGE_KEYS.previewTheme)).toBe("slate")
    fireEvent.click(screen.getByLabelText(m.showOutlineLabel))
    expect(
      screen.getByRole("navigation", { name: m.outlineTitle })
    ).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: "Draft" }))
    expect(screen.queryByRole("navigation")).toBeNull()
    const initial = frame()
    fireEvent.click(screen.getByRole("radio", { name: m.read }))
    expect(screen.queryByRole("textbox", { name: m.sourceLabel })).toBeNull()
    fireEvent.click(screen.getByRole("radio", { name: m.edit }))
    expect(frame()).toBe(initial)
    fireEvent.click(screen.getByLabelText(m.wide))
    fireEvent.click(screen.getByLabelText(m.zoomIn))
    expect(screen.getByLabelText(m.zoom)).toHaveProperty("value", "125")
    fireEvent.click(screen.getByLabelText(m.resetZoom))
    expect(screen.getByLabelText(m.zoom)).toHaveProperty("value", "100")
  })

  test("reads and edits a private file only in memory, restores the saved draft on close", async () => {
    localStorage.setItem(STORAGE_KEYS.markdown, "# Saved private draft")
    mount()
    await ready("Saved private draft")
    select("# Local private file")
    await ready("Local private file")
    expect(screen.queryByRole("textbox", { name: m.sourceLabel })).toBeNull()
    expect(localStorage.getItem(STORAGE_KEYS.markdown)).toBe(
      "# Saved private draft"
    )
    fireEvent.click(screen.getByRole("radio", { name: m.edit }))
    fireEvent.change(editor(), { target: { value: "# Unsaved local edit" } })
    await ready("Unsaved local edit")
    expect(localStorage.getItem(STORAGE_KEYS.markdown)).toBe(
      "# Saved private draft"
    )
    vi.mocked(window.confirm).mockReturnValueOnce(false)
    select("# Replacement")
    expect(editor().value).toBe("# Unsaved local edit")
    fireEvent.click(screen.getByLabelText(m.close))
    await ready("Saved private draft")
    expect(window.confirm).toHaveBeenCalledWith(m.replaceEditedConfirm)
    expect(editor().value).toBe("# Saved private draft")
  })

  test("replaces read-only files without prompting and accepts a drop", async () => {
    mount()
    await ready("Product launch checklist")
    const file = new File(["# Dropped"], "readme.mdown")
    fireEvent.drop(
      document.querySelector("[data-tool='markdown-previewer']")!,
      { dataTransfer: { files: [file] } }
    )
    await ready("Dropped")
    select("# Replacement", "readme.markdown")
    await ready("Replacement")
    expect(window.confirm).not.toHaveBeenCalled()
    fireEvent.click(screen.getByLabelText(m.close))
    await ready("Product launch checklist")
  })

  test("clears with confirmation, can load a sample, and escapes optional inline HTML", async () => {
    mount()
    await ready("Product launch checklist")
    vi.mocked(window.confirm).mockReturnValueOnce(false)
    fireEvent.click(screen.getByRole("button", { name: m.clearLabel }))
    expect(editor().value).toBe(DEFAULT_MARKDOWN)
    fireEvent.click(screen.getByRole("button", { name: m.clearLabel }))
    await waitFor(() =>
      expect(screen.getByText(m.previewEmptyDescription)).toBeTruthy()
    )
    expect(localStorage.getItem(STORAGE_KEYS.markdown)).toBe("")
    vi.mocked(window.confirm).mockReturnValueOnce(false)
    fireEvent.click(screen.getByRole("button", { name: m.loadSampleLabel }))
    expect(editor().value).toBe("")
    fireEvent.click(screen.getByRole("button", { name: m.loadSampleLabel }))
    await ready("Product launch checklist")
    fireEvent.change(editor(), {
      target: { value: "# HTML\n\n<b>bold</b><img src='https://bad.test/a'>" },
    })
    await ready("<b>bold</b>")
    expect(frame().srcdoc).not.toContain("https://bad.test")
    fireEvent.click(screen.getByLabelText(m.renderHtmlLabel))
    await ready("&lt;b&gt;bold&lt;/b&gt;")
    expect(frame().srcdoc).not.toContain("<b>bold</b>")
  })

  test("handles unsupported, empty, and invalid text without losing the current document", async () => {
    mount()
    await ready("Product launch checklist")
    fireEvent.change(screen.getByLabelText(m.importLabel), {
      target: { files: [new File(["bad"], "archive.zip")] },
    })
    expect(screen.getByText(m.unsupported)).toBeTruthy()
    select("\0binary")
    await waitFor(() => expect(screen.getByText(m.encodingFailed)).toBeTruthy())
    expect(editor().value).toBe(DEFAULT_MARKDOWN)
    select("")
    await waitFor(() =>
      expect(screen.getByText(m.previewEmptyDescription)).toBeTruthy()
    )
    expect(
      screen.getByRole("button", { name: m.downloadHtmlLabel })
    ).toHaveProperty("disabled", true)
  })

  test("reports parser failure and retries without discarding source", async () => {
    ParserWorker.fail = true
    mount()
    await waitFor(() => expect(screen.getByText(m.previewFailed)).toBeTruthy())
    expect(editor().value).toBe(DEFAULT_MARKDOWN)
    ParserWorker.fail = false
    fireEvent.click(screen.getByRole("button", { name: m.retry }))
    await ready("Product launch checklist")
  })

  test("restores legacy draft preferences and tolerates storage failure", async () => {
    localStorage.setItem(STORAGE_KEYS.previewTheme, "slate")
    localStorage.setItem(STORAGE_KEYS.showOutline, "true")
    mount()
    await ready("Product launch checklist")
    expect(
      screen
        .getByRole("radio", { name: m.slateThemeLabel })
        .getAttribute("aria-checked")
    ).toBe("true")
    fireEvent.keyDown(screen.getByRole("navigation"), { key: "Escape" })
    expect(document.activeElement).toBe(
      screen.getByLabelText(m.showOutlineLabel)
    )
    cleanup()
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked")
    })
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("full")
    })
    mount()
    await ready("Product launch checklist")
    expect(screen.getByText(m.storageFailed)).toBeTruthy()
  })

  test.each(["during close", "after close"])(
    "prints sanitized HTML when loading finishes %s and handles a blocked popup",
    async (timing) => {
      mount()
      await ready("Product launch checklist")
      const load: Array<() => void> = []
      const popup = {
        opener: window,
        document: {
          open: vi.fn(),
          write: vi.fn(),
          close: vi.fn(() => {
            if (timing === "during close") load.forEach((fn) => fn())
          }),
        },
        focus: vi.fn(),
        print: vi.fn(),
        close: vi.fn(),
        onafterprint: null as null | (() => void),
        addEventListener: (_: string, fn: () => void) => load.push(fn),
      }
      vi.spyOn(window, "open")
        .mockReturnValueOnce(null)
        .mockReturnValue(popup as unknown as Window)
      fireEvent.click(screen.getByRole("button", { name: m.printLabel }))
      fireEvent.click(screen.getByRole("button", { name: m.printLabel }))
      expect(popup.document.write.mock.calls[0]?.[0]).toContain(
        "script-src 'none'"
      )
      expect(popup.opener).toBeNull()
      if (timing === "after close") load.forEach((fn) => fn())
      expect(popup.print).toHaveBeenCalledTimes(1)
      popup.onafterprint?.()
      expect(popup.close).toHaveBeenCalled()
    }
  )
})
