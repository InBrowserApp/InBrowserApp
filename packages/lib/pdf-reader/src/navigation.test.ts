import { expect, test, vi } from "vitest"
import type { PDFDocumentProxy } from "pdfjs-dist"
import { readOutline, renderThumbnail } from "./navigation"

test("keeps nested internal destinations and treats missing outlines as empty", async () => {
  const document = {
    getOutline: vi.fn().mockResolvedValue([
      {
        title: "Chapter",
        dest: "one",
        items: [{ title: "Section", dest: [2], items: [] }],
      },
    ]),
  } as unknown as PDFDocumentProxy
  expect(await readOutline(document)).toEqual([
    {
      title: "Chapter",
      destination: "one",
      children: [{ title: "Section", destination: [2], children: [] }],
    },
  ])
  vi.mocked(document.getOutline).mockResolvedValue(null!)
  expect(await readOutline(document)).toEqual([])
})

test("fits bounded thumbnails and cancels their active render tasks", async () => {
  const render = { promise: Promise.resolve(), cancel: vi.fn() }
  const page = {
    getViewport: vi.fn(({ scale }) => ({
      width: 595 * scale,
      height: 842 * scale,
    })),
    render: vi.fn().mockReturnValue(render),
  }
  const document = {
    getPage: vi.fn().mockResolvedValue(page),
  } as unknown as PDFDocumentProxy
  const canvas = window.document.createElement("canvas")
  await renderThumbnail(document, 2, canvas, new AbortController().signal)
  expect(canvas.width).toBeLessThanOrEqual(160)
  expect(canvas.height).toBeLessThanOrEqual(200)
  let finish!: () => void
  render.promise = new Promise((resolve) => {
    finish = resolve
  })
  const controller = new AbortController()
  const pending = renderThumbnail(document, 2, canvas, controller.signal)
  await vi.waitFor(() => expect(page.render).toHaveBeenCalledTimes(2))
  controller.abort()
  expect(render.cancel).toHaveBeenCalledOnce()
  finish()
  await expect(pending).rejects.toThrow(/abort/i)
  const prior = new AbortController()
  prior.abort()
  await expect(
    renderThumbnail(document, 1, canvas, prior.signal)
  ).rejects.toThrow(/abort/i)
})
