import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { renderPdfPagePreviews } from "./pdf-preview"

const { getDocument } = vi.hoisted(() => ({ getDocument: vi.fn() }))
vi.mock("pdfjs-dist", () => ({
  GlobalWorkerOptions: {},
  getDocument,
}))

beforeEach(() => {
  getDocument.mockReset()
})
afterEach(() => vi.restoreAllMocks())

const file = () => new File(["pdf"], "document.pdf")

test("renders a preview and releases its PDF.js loading task", async () => {
  const page = {
    getViewport: () => ({ width: 200, height: 100 }),
    render: vi.fn(() => ({ promise: Promise.resolve() })),
    cleanup: vi.fn(),
  }
  const task = {
    promise: Promise.resolve({ numPages: 1, getPage: async () => page }),
    destroy: vi.fn(),
  }
  getDocument.mockReturnValue(task)
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    fillRect: vi.fn(),
  } as unknown as CanvasRenderingContext2D)
  vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue(
    "data:image/jpeg;base64,preview"
  )

  expect(await renderPdfPagePreviews(file())).toEqual([
    {
      dataUrl: "data:image/jpeg;base64,preview",
      height: 100,
      pageNumber: 1,
      width: 200,
    },
  ])
  expect(page.cleanup).toHaveBeenCalledOnce()
  expect(task.destroy).toHaveBeenCalledOnce()
})

test("releases the loading task when PDF parsing fails", async () => {
  const task = {
    promise: Promise.reject(new Error("Invalid PDF")),
    destroy: vi.fn(),
  }
  getDocument.mockReturnValue(task)

  await expect(renderPdfPagePreviews(file())).rejects.toThrow("Invalid PDF")
  expect(task.destroy).toHaveBeenCalledOnce()
})

test("releases the loading task once when preview rendering is canceled", async () => {
  const controller = new AbortController()
  const task = {
    promise: Promise.resolve({ numPages: 1 }),
    destroy: vi.fn(),
  }
  getDocument.mockImplementation(() => {
    controller.abort()
    return task
  })

  await expect(
    renderPdfPagePreviews(file(), controller.signal)
  ).rejects.toThrow("Rendering aborted")
  expect(task.destroy).toHaveBeenCalledOnce()
})

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
      destroy,
      promise: Promise.resolve({
        numPages: 1,
        getPage: vi.fn().mockResolvedValue({ getViewport, cleanup, render }),
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
