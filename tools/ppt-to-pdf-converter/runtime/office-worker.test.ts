import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { loadAssets } from "./load-assets"
import { preflight } from "../core/preflight"
import { validatePdf } from "../core/validate-pdf"
import { ConversionError } from "../core/errors"
import "./office-worker"

vi.mock("./load-assets", () => ({ loadAssets: vi.fn() }))
vi.mock("../core/preflight", () => ({ preflight: vi.fn() }))
vi.mock("../core/validate-pdf", () => ({ validatePdf: vi.fn() }))
let worker: FakeWorker
class FakeWorker {
  onmessage?: (event: { data: unknown }) => Promise<void>
  onerror?: () => void
  terminate = vi.fn()
  postMessage = vi.fn()
  constructor() {
    // oxlint-disable-next-line typescript/no-this-alias
    worker = this
  }
}
const post = vi.fn()
const assets: Awaited<ReturnType<typeof loadAssets>> = {
  engine: "/engine.js",
  binary: new ArrayBuffer(1),
  archive: new ArrayBuffer(1),
  fonts: [new ArrayBuffer(1), new ArrayBuffer(1), new ArrayBuffer(1)],
}
const input = new ArrayBuffer(10)
async function start() {
  await self.onmessage!(new MessageEvent("message", { data: input }))
}
beforeEach(() => {
  vi.resetAllMocks()
  vi.stubGlobal("Worker", FakeWorker)
  vi.stubGlobal("postMessage", post)
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:engine")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  vi.mocked(loadAssets).mockResolvedValue(assets)
  vi.mocked(preflight).mockReturnValue({ pages: 3, images: [] })
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
test("preflights before asset download, transfers the input, and validates before publishing bytes", async () => {
  await start()
  expect(preflight).toHaveBeenCalledWith(input)
  expect(vi.mocked(preflight)).toHaveBeenCalledBefore(vi.mocked(loadAssets))
  expect(worker.postMessage).toHaveBeenCalledWith(
    expect.objectContaining({ input, assets }),
    [input, assets.binary, assets.archive, ...assets.fonts]
  )
  await worker.onmessage!({ data: { type: "progress", stage: "converting" } })
  expect(post).toHaveBeenLastCalledWith({
    type: "progress",
    stage: "converting",
  })
  const result = { type: "result", bytes: new ArrayBuffer(10), pages: 3 }
  await worker.onmessage!({ data: result })
  expect(validatePdf).toHaveBeenCalledWith(result.bytes, 3)
  expect(post).toHaveBeenLastCalledWith(result, { transfer: [result.bytes] })
  expect(worker.terminate).toHaveBeenCalledOnce()
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:engine")
  const count = post.mock.calls.length
  await worker.onmessage!({ data: { type: "progress", stage: "converting" } })
  expect(post).toHaveBeenCalledTimes(count)
})
test("does not download engine assets for an unreadable presentation", async () => {
  vi.mocked(preflight).mockImplementationOnce(() => {
    throw new ConversionError("protected")
  })
  await start()
  expect(loadAssets).not.toHaveBeenCalled()
  expect(post).toHaveBeenLastCalledWith({ type: "error", code: "protected" })
})
test.each([
  [new Error("fetch failed"), "engineUnavailable"],
  [new RangeError("allocation failed"), "resource"],
])("reports asset initialization failure", async (error, code) => {
  vi.mocked(loadAssets).mockRejectedValueOnce(error)
  await start()
  expect(post).toHaveBeenLastCalledWith({ type: "error", code })
})
test.each([
  { documentResourceBlocked: true },
  { type: "error", code: "unsupported" },
])("rejects unavailable content and terminates the engine", async (data) => {
  await start()
  await worker.onmessage!({ data })
  expect(post).toHaveBeenLastCalledWith({ type: "error", code: "unsupported" })
  expect(worker.terminate).toHaveBeenCalledOnce()
})
test("rejects a partial PDF before passing it back to the page", async () => {
  vi.mocked(validatePdf).mockRejectedValueOnce(
    new ConversionError("unsupported")
  )
  await start()
  await worker.onmessage!({
    data: { type: "result", bytes: new ArrayBuffer(1), pages: 10 },
  })
  expect(post).toHaveBeenLastCalledWith({ type: "error", code: "unsupported" })
  expect(worker.terminate).toHaveBeenCalledOnce()
})
test("handles worker startup errors", async () => {
  await start()
  worker.onerror!()
  expect(post).toHaveBeenLastCalledWith({
    type: "error",
    code: "engineUnavailable",
  })
  expect(worker.terminate).toHaveBeenCalledOnce()
})

test.each([false, true])(
  "does not publish a PDF when a blocked resource is reported during validation (reject=%s)",
  async (reject) => {
    let finish!: () => void
    vi.mocked(validatePdf).mockImplementationOnce(
      () =>
        new Promise((resolve, fail) => {
          finish = () => (reject ? fail(new Error("late failure")) : resolve())
        })
    )
    await start()
    const result = worker.onmessage!({
      data: { type: "result", bytes: new ArrayBuffer(1), pages: 3 },
    })
    await worker.onmessage!({ data: { documentResourceBlocked: true } })
    const count = post.mock.calls.length
    finish()
    await result
    expect(post).toHaveBeenCalledTimes(count)
    expect(post).toHaveBeenLastCalledWith({
      type: "error",
      code: "unsupported",
    })
  }
)
