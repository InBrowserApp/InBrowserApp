import { afterEach, expect, test, vi } from "vitest"
import { imageSession } from "./session"
class WorkerDouble {
  static instances: WorkerDouble[] = []
  onmessage?: (event: { data: unknown }) => void
  onerror?: (event: { message: string; preventDefault: () => void }) => void
  onmessageerror?: () => void
  terminate = vi.fn()
  postMessage = vi.fn()
  constructor() {
    WorkerDouble.instances.push(this)
  }
}
afterEach(() => {
  vi.unstubAllGlobals()
  WorkerDouble.instances = []
})
const file = new File(["bytes"], "image.png")

test("keeps a decoder for navigation, correlates requests and releases it on close", async () => {
  vi.stubGlobal("Worker", WorkerDouble)
  const controller = new AbortController()
  const session = imageSession(file, controller.signal)
  const worker = WorkerDouble.instances[0]!
  const opened = session.open()
  worker.onmessage!({ data: { id: 77, type: "rendered" } })
  worker.onmessage!({
    data: { id: 1, type: "opened", result: { info: { count: 2 } } },
  })
  expect(await opened).toEqual({ info: { count: 2 } })
  expect(worker.terminate).not.toHaveBeenCalled()
  const rendered = session.render(1)
  expect(worker.postMessage).toHaveBeenLastCalledWith({
    id: 2,
    type: "render",
    index: 1,
    jpeg: undefined,
    transform: undefined,
  })
  worker.onmessage!({
    data: { id: 2, type: "rendered", preview: { width: 123 } },
  })
  expect(await rendered).toEqual({ width: 123 })
  const pending = session.render(0)
  controller.abort()
  await expect(pending).rejects.toThrow(/abort/i)
  expect(worker.terminate).toHaveBeenCalledOnce()
  await expect(session.render(1)).rejects.toThrow("engineError")
})

test("reports failures, unexpected replies, crashes and deserialization errors", async () => {
  vi.stubGlobal("Worker", WorkerDouble)
  for (const mode of [
    "error",
    "unexpected-open",
    "unexpected-render",
    "crash",
    "bootstrap",
    "messageerror",
  ]) {
    const controller = new AbortController()
    const session = imageSession(file, controller.signal)
    const worker = WorkerDouble.instances.at(-1)!
    const pending =
      mode === "unexpected-render" ? session.render(0) : session.open()
    if (mode === "error")
      worker.onmessage!({
        data: { id: 1, type: "error", failure: "resourceLimit" },
      })
    if (mode === "unexpected-open")
      worker.onmessage!({ data: { id: 1, type: "rendered" } })
    if (mode === "unexpected-render")
      worker.onmessage!({ data: { id: 1, type: "opened" } })
    if (mode === "crash")
      worker.onerror!({ message: "out of memory", preventDefault: vi.fn() })
    if (mode === "bootstrap")
      worker.onerror!({
        message: "Failed to load module script",
        preventDefault: vi.fn(),
      })
    if (mode === "messageerror") worker.onmessageerror!()
    await expect(pending).rejects.toThrow(/resourceLimit|invalid|engineError/)
    controller.abort()
    expect(worker.terminate).toHaveBeenCalledOnce()
  }
})

test("cleans up failed posts and does not start an already aborted request", async () => {
  vi.stubGlobal(
    "Worker",
    class extends WorkerDouble {
      override postMessage = vi.fn(() => {
        throw new RangeError("allocation")
      })
    }
  )
  const controller = new AbortController()
  await expect(imageSession(file, controller.signal).open()).rejects.toThrow(
    "resourceLimit"
  )
  expect(WorkerDouble.instances[0]!.terminate).toHaveBeenCalledOnce()
  controller.abort()
  expect(() => imageSession(file, controller.signal)).toThrow(/abort/i)
  expect(WorkerDouble.instances).toHaveLength(1)
})

test("sends explicit JPEG options for both initial and selected images", async () => {
  vi.stubGlobal("Worker", WorkerDouble)
  const controller = new AbortController()
  const session = imageSession(file, controller.signal)
  const worker = WorkerDouble.instances[0]!
  const jpeg = { quality: 65, background: "#102030" }
  const opened = session.open(jpeg)
  expect(worker.postMessage).toHaveBeenLastCalledWith({
    id: 1,
    type: "open",
    file,
    jpeg,
  })
  worker.onmessage!({ data: { id: 1, type: "opened", result: {} } })
  await opened
  const rendered = session.render(2, jpeg)
  expect(worker.postMessage).toHaveBeenLastCalledWith({
    id: 2,
    type: "render",
    index: 2,
    jpeg,
    transform: undefined,
  })
  worker.onmessage!({ data: { id: 2, type: "rendered", preview: {} } })
  await rendered
  controller.abort()
})

test("inspects source pages before rendering and passes thumbnail transforms", async () => {
  vi.stubGlobal("Worker", WorkerDouble)
  const controller = new AbortController()
  const session = imageSession(file, controller.signal)
  const worker = WorkerDouble.instances[0]!
  const pending = session.inspect()
  expect(worker.postMessage).toHaveBeenLastCalledWith({
    id: 1,
    type: "inspect",
    file,
  })
  worker.onmessage!({ data: { id: 1, type: "inspected", info: { count: 3 } } })
  expect(await pending).toEqual({ count: 3 })
  const transform = { maxDimension: 192, rotation: 90 as const }
  const thumbnail = session.render(2, undefined, transform)
  expect(worker.postMessage).toHaveBeenLastCalledWith({
    id: 2,
    type: "render",
    index: 2,
    jpeg: undefined,
    transform,
  })
  worker.onmessage!({ data: { id: 2, type: "rendered", preview: {} } })
  await thumbnail
  const wrong = session.inspect()
  worker.onmessage!({ data: { id: 3, type: "rendered" } })
  await expect(wrong).rejects.toThrow("invalid")
  controller.abort()
})
