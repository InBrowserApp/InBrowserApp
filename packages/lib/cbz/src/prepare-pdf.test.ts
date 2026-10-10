import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { preparePdf } from "./prepare-pdf"

class WorkerMock {
  static current: WorkerMock
  onmessage!: (event: { data: unknown }) => void
  onerror!: (event: { message: string; preventDefault: () => void }) => void
  onmessageerror!: () => void
  postMessage = vi.fn()
  terminate = vi.fn()
  constructor() {
    WorkerMock.current = this
  }
}
beforeEach(() => vi.stubGlobal("Worker", WorkerMock))
afterEach(() => vi.unstubAllGlobals())
const file = new File(["zip"], "book.cbz")
test("delivers progress and PDF bytes, then terminates its worker", async () => {
  const controller = new AbortController()
  const progress = vi.fn()
  const pending = preparePdf(file, controller.signal, progress)
  const worker = WorkerMock.current
  expect(worker.postMessage).toHaveBeenCalledWith(file)
  const update = { page: 1, total: 2, name: "page1.png", saving: false }
  worker.onmessage({ data: { type: "progress", progress: update } })
  expect(progress).toHaveBeenCalledWith(update)
  const result = { pdf: new Blob(["pdf"]), names: ["page1.png"] }
  worker.onmessage({ data: { type: "result", result } })
  expect(await pending).toBe(result)
  expect(worker.terminate).toHaveBeenCalledOnce()
  controller.abort()
  worker.onmessage({ data: { type: "progress", progress: update } })
  expect(progress).toHaveBeenCalledOnce()
  expect(worker.terminate).toHaveBeenCalledOnce()
})
test("immediately terminates cancelled conversion and ignores late output", async () => {
  const controller = new AbortController()
  const pending = preparePdf(file, controller.signal, vi.fn())
  const worker = WorkerMock.current
  controller.abort()
  await expect(pending).rejects.toThrow(/abort/i)
  expect(worker.terminate).toHaveBeenCalledOnce()
  worker.onmessage({
    data: { type: "result", result: { pdf: new Blob(), names: [] } },
  })
  expect(() => preparePdf(file, controller.signal, vi.fn())).toThrow(/abort/i)
})
test("retains failed-page details without exposing a result", async () => {
  const pending = preparePdf(file, new AbortController().signal, vi.fn())
  WorkerMock.current.onmessage({
    data: {
      type: "error",
      error: { code: "damagedPage", page: 5, name: "章/5.png" },
    },
  })
  await expect(pending).rejects.toMatchObject({
    detail: { code: "damagedPage", page: 5, name: "章/5.png" },
  })
  expect(WorkerMock.current.terminate).toHaveBeenCalledOnce()
})
test.each(["launch", "post", "error", "decode", "resource"])(
  "cleans up worker %s failures",
  async (kind) => {
    if (kind === "launch")
      vi.stubGlobal(
        "Worker",
        class {
          constructor() {
            throw new Error("disabled")
          }
        }
      )
    if (kind === "post")
      vi.stubGlobal(
        "Worker",
        class extends WorkerMock {
          constructor() {
            super()
            this.postMessage.mockImplementation(() => {
              throw new Error("clone")
            })
          }
        }
      )
    const pending = preparePdf(file, new AbortController().signal, vi.fn())
    if (kind === "error" || kind === "resource")
      WorkerMock.current.onerror({
        message: kind === "resource" ? "out of memory" : "load",
        preventDefault: vi.fn(),
      })
    if (kind === "decode") WorkerMock.current.onmessageerror()
    await expect(pending).rejects.toMatchObject({
      detail: {
        code: kind === "resource" ? "resourceLimit" : "engineUnavailable",
      },
    })
    if (kind !== "launch")
      expect(WorkerMock.current.terminate).toHaveBeenCalledOnce()
  }
)
