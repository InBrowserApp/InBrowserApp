import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { openArchive, failure } from "./open-document"
import m from "./messages/en.json"
const mock = vi.hoisted(() => ({ prepare: vi.fn() }))
vi.mock("@workspace/web-document", () => ({ prepareWebDocument: mock.prepare }))
let worker: FakeWorker
class FakeWorker {
  onmessage: ((event: MessageEvent) => void) | null = null
  onerror: (() => void) | null = null
  onmessageerror: (() => void) | null = null
  terminate = vi.fn()
  postMessage = vi.fn()
  constructor() {
    // oxlint-disable-next-line no-this-alias
    worker = this
  }
}
const file = new File(["archive"], "report.mht")
beforeEach(() => {
  vi.stubGlobal("Worker", FakeWorker)
  mock.prepare.mockReturnValue({
    html: "safe",
    outline: [],
    title: "Report",
    notes: {},
    empty: false,
  })
})
afterEach(() => vi.unstubAllGlobals())

test("disposes completed workers and sanitizes output before returning it", async () => {
  const opening = openArchive(file, new AbortController().signal, m)
  expect(worker.postMessage).toHaveBeenCalledWith(file)
  worker.onmessage!({
    data: {
      result: {
        source: "raw",
        location: "https://example.org",
        archiveNotes: {},
      },
    },
  } as MessageEvent)
  const result = await opening
  expect(result.html).toBe("safe")
  expect(result.location).toBe("https://example.org")
  expect(mock.prepare).toHaveBeenCalledWith("raw", {
    emptyText: m.noContent,
    headingText: m.documentBody,
  })
  expect(worker.terminate).toHaveBeenCalledOnce()
  const unreadable = openArchive(file, new AbortController().signal, m)
  worker.onmessageerror!()
  await expect(unreadable).rejects.toThrow("invalid")
  expect(worker.terminate).toHaveBeenCalledOnce()
})

test("termination cancels opening and an already aborted signal creates no work", async () => {
  const controller = new AbortController()
  const opening = openArchive(file, controller.signal, m)
  controller.abort()
  await expect(opening).rejects.toThrow(/abort/i)
  expect(worker.terminate).toHaveBeenCalledOnce()
  await expect(openArchive(file, controller.signal, m)).rejects.toThrow(
    /abort/i
  )
})

test("propagates parser and worker errors and always cleans up", async () => {
  for (const error of ["structure", "email", "resourceLimit"]) {
    const opening = openArchive(file, new AbortController().signal, m)
    worker.onmessage!({ data: { error } } as MessageEvent)
    await expect(opening).rejects.toThrow(error)
    expect(worker.terminate).toHaveBeenCalledOnce()
  }
  const opening = openArchive(file, new AbortController().signal, m)
  worker.onerror!()
  await expect(opening).rejects.toThrow("invalid")
  expect(worker.terminate).toHaveBeenCalledOnce()
})

test("classifies errors accurately", () => {
  expect(failure(new RangeError())).toBe("resourceLimit")
  expect(failure(new Error("memory allocation"))).toBe("resourceLimit")
  expect(failure(new Error("resourceLimit"))).toBe("resourceLimit")
  expect(failure(new Error("email"))).toBe("email")
  expect(failure(new Error("structure"))).toBe("structure")
  expect(failure(null)).toBe("invalid")
})
