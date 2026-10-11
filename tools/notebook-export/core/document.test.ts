// @vitest-environment jsdom
import { beforeEach, expect, test, vi } from "vitest"
import { notebookDocument } from "./document"
import { notebookMarkdown } from "./markdown"
import type { Notebook } from "@workspace/notebook"
import m from "../messages/en.json"

const images = vi.hoisted(() => ({ readableImage: vi.fn() }))
vi.mock("@workspace/web-document", async (original) => ({
  ...(await original<object>()),
  ...images,
}))
beforeEach(() => images.readableImage.mockReset().mockResolvedValue(true))
const cell = (html: string): Notebook["cells"][number] => ({
  kind: "markdown",
  html,
  attachments: {},
  count: null,
  outputs: [],
})

test("builds offline HTML and Markdown with safe links, notes, headings and cached embedded images", async () => {
  const notebook: Notebook = {
    cells: [
      cell(
        '<h1>Title</h1><p><a href="#Title">Jump</a> <a href="https://example.com/">Visit</a><a href="javascript:alert(1)">Bad</a></p><script>alert(1)</script><img src="data:image/png;base64,AA=="><img alt="Second" src="data:image/png;base64,AA==">'
      ),
    ],
  }
  const result = await notebookDocument(
    notebook,
    "<Report 世界>",
    new AbortController().signal,
    m
  )
  const doc = result.document
  expect(doc.title).toBe("<Report 世界>")
  expect(doc.querySelector("script,iframe,object,embed")).toBeNull()
  expect(
    doc
      .querySelector('meta[http-equiv="Content-Security-Policy"]')!
      .getAttribute("content")
  ).toContain("default-src 'none'")
  const links = [...doc.querySelectorAll("a[href]")]
  expect(links).toHaveLength(2)
  expect(links[0]!.getAttribute("href")).toBe("#" + doc.querySelector("h1")!.id)
  expect(links[1]!.getAttribute("rel")).toBe("noopener noreferrer")
  expect(links[1]!.getAttribute("target")).toBe("_blank")
  expect(result.preview.html).toContain("data-web-link=")
  expect(result.preview.html).not.toContain(m.safePreview)
  expect(doc.querySelector("[data-web-link]")).toBeNull()
  expect(images.readableImage).toHaveBeenCalledTimes(1)
  expect(result.file.type).toBe("text/html;charset=utf-8")
  expect(result.notes).toEqual([m.safePreview, m.layoutNotice])
  expect(notebookMarkdown(doc)).toContain(
    "[Jump](#" + doc.querySelector("h1")!.id + ")"
  )
  expect(doc.body.textContent).toContain(m.safePreview)
})

test("identifies missing/remote resources, unsupported output and unreadable included images", async () => {
  images.readableImage.mockResolvedValue(false)
  const unknown = {
    ...cell("<p>Unknown cell source</p>"),
    kind: "unknownCell" as const,
  }
  const notebook: Notebook = {
    cells: [
      cell(
        '<img src="local.png"><img src="https://example.com/remote.png"><img alt="Broken plot" src="data:image/png;base64,AA=="><img src="data:image/png;base64,AA==">'
      ),
      unknown,
    ],
  }
  const result = await notebookDocument(
    notebook,
    "Unavailable",
    new AbortController().signal,
    m
  )
  expect(result.notes).toEqual([
    m.safePreview,
    m.layoutNotice,
    m.localResources,
    m.remoteResources,
    m.limited,
    m.imageUnavailable,
  ])
  expect(result.document.querySelector("img[src]")).toBeNull()
  expect(result.document.body.textContent).toContain(
    "Broken plot · " + m.imageUnavailable
  )
  expect(result.document.body.textContent).toContain(m.unsupportedCell)
  expect(images.readableImage).toHaveBeenCalledTimes(1)
})

test("exports an empty notebook with the no-content message and respects cancellation", async () => {
  const controller = new AbortController()
  const result = await notebookDocument(
    { cells: [] },
    "Empty",
    controller.signal,
    m
  )
  expect(result.document.body.textContent).toContain(m.noContent)
  controller.abort()
  await expect(
    notebookDocument({ cells: [] }, "Cancelled", controller.signal, m)
  ).rejects.toMatchObject({ name: "AbortError" })
})
