import { cleanup, renderHook, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { usePreview } from "./use-preview"
import { loadPdf } from "./pdfjs"

vi.mock("./pdfjs", () => ({ loadPdf: vi.fn() }))
const getPage = vi.fn()
const destroy = vi.fn(async () => {})
const cancel = vi.fn()
const rendering = vi.fn()
const file = new File(["pdf"], "document.pdf")

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    {} as CanvasRenderingContext2D
  )
  vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue(
    "data:image/png;base64,preview"
  )
  rendering.mockReturnValue({ promise: Promise.resolve(), cancel })
  getPage.mockResolvedValue({
    getViewport: () => ({ width: 612, height: 792 }),
    render: rendering,
  })
  vi.mocked(loadPdf).mockReturnValue({
    promise: Promise.resolve({ getPage }),
    destroy,
  } as unknown as ReturnType<typeof loadPdf>)
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.clearAllMocks()
})

test("loads and renders requested PDF pages, disposing their document resources", async () => {
  const { result, rerender } = renderHook(
    ({ page }) => usePreview(file, page),
    { initialProps: { page: 1 } }
  )
  expect(result.current.loading).toBe(true)
  await waitFor(() =>
    expect(result.current.url).toBe("data:image/png;base64,preview")
  )
  expect(getPage).toHaveBeenCalledWith(1)
  expect(destroy).toHaveBeenCalled()
  rerender({ page: 2 })
  expect(result.current.loading).toBe(true)
  await waitFor(() => expect(getPage).toHaveBeenCalledWith(2))
  await waitFor(() => expect(result.current.loading).toBe(false))
})

test("returns no image without a file and reports rendering failures", async () => {
  const empty = renderHook(() => usePreview(null, 1))
  expect(empty.result.current).toEqual({
    url: "",
    error: false,
    loading: false,
  })
  empty.unmount()
  vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValueOnce(null)
  const broken = renderHook(() => usePreview(file, 1))
  await waitFor(() => expect(broken.result.current.error).toBe(true))
  expect(broken.result.current.url).toBe("")
})

test("cancels in-flight rendering and ignores late results", async () => {
  let resolve!: () => void
  rendering.mockReturnValueOnce({
    promise: new Promise<void>((r) => {
      resolve = r
    }),
    cancel,
  })
  const { unmount } = renderHook(() => usePreview(file, 1))
  await waitFor(() => expect(rendering).toHaveBeenCalled())
  unmount()
  expect(cancel).toHaveBeenCalledOnce()
  resolve()
  await waitFor(() => expect(destroy).toHaveBeenCalled())
})

test("does not create a PDF task if the file is removed before it finishes reading", async () => {
  let resolve!: (value: ArrayBuffer) => void
  const slow = {
    arrayBuffer: () =>
      new Promise<ArrayBuffer>((r) => {
        resolve = r
      }),
  } as File
  const { unmount } = renderHook(() => usePreview(slow, 1))
  unmount()
  resolve(new ArrayBuffer(0))
  await new Promise((r) => setTimeout(r, 10))
  expect(loadPdf).not.toHaveBeenCalled()
})
