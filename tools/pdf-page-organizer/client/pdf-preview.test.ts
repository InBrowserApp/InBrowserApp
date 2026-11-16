import { afterEach, describe, expect, test, vi } from "vitest"

import { renderPdfPagePreviews } from "./pdf-preview"

const { getDocument } = vi.hoisted(() => ({ getDocument: vi.fn() }))
vi.mock("pdfjs-dist", () => ({
  GlobalWorkerOptions: { workerSrc: "" },
  getDocument,
}))

afterEach(() => vi.restoreAllMocks())

describe("renderPdfPagePreviews", () => {
  test("renders unrotated source pixels so the organizer applies rotation exactly once", async () => {
    const getViewport = vi.fn(({ scale, rotation }) => ({
      width: (rotation === 0 ? 300 : 420) * scale,
      height: (rotation === 0 ? 420 : 300) * scale,
    }))
    const cleanup = vi.fn()
    const render = vi.fn(() => ({ promise: Promise.resolve() }))
    const destroy = vi.fn()
    getDocument.mockReturnValue({
      promise: Promise.resolve({
        numPages: 1,
        getPage: vi.fn().mockResolvedValue({ getViewport, cleanup, render }),
        destroy,
      }),
    })
    const context = { fillStyle: "", fillRect: vi.fn() }
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      context as unknown as CanvasRenderingContext2D
    )
    vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue(
      "data:image/jpeg;base64,test"
    )

    const previews = await renderPdfPagePreviews(
      new File(["pdf"], "rotated.pdf")
    )

    expect(
      getViewport.mock.calls.every(([options]) => options.rotation === 0)
    ).toBe(true)
    expect(previews).toEqual([
      {
        dataUrl: "data:image/jpeg;base64,test",
        width: 214,
        height: 300,
        pageNumber: 1,
      },
    ])
    expect(render).toHaveBeenCalledOnce()
    expect(cleanup).toHaveBeenCalledOnce()
    expect(destroy).toHaveBeenCalledOnce()
  })
})
