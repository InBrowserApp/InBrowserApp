import { afterEach, beforeEach, expect, test, vi } from "vitest"
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
