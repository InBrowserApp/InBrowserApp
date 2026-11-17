import { act, cleanup, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { useHarImport } from "./use-har-import"
import { MAX_FILE_SIZE, parseHar } from "./core/parse"
import { exampleHar } from "./sample"

class FakeWorker {
  static instances: FakeWorker[] = []
  onmessage: ((event: { data: unknown }) => void) | null = null
  onerror: (() => void) | null = null
  terminate = vi.fn()
  postMessage = vi.fn()
  constructor() {
    FakeWorker.instances.push(this)
  }
}
const file = new File(["{}"], "network.har")
beforeEach(() => {
  FakeWorker.instances = []
  vi.stubGlobal("Worker", FakeWorker)
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

it("loads the example, clears it, and does not persist it", () => {
  const persist = vi.spyOn(Storage.prototype, "setItem")
  const { result } = renderHook(useHarImport)
  act(() => result.current.example("Example"))
  expect(result.current.capture?.entries).toHaveLength(9)
  expect(result.current.name).toBe("Example")
  expect(persist).not.toHaveBeenCalled()
  act(() => result.current.clear())
  expect(result.current.capture).toBeNull()
  expect(result.current.name).toBeNull()
  persist.mockRestore()
})
it("rejects large files before constructing a worker", () => {
  const { result } = renderHook(useHarImport)
  act(() => result.current.open({ size: MAX_FILE_SIZE + 1 } as File))
  expect(result.current.error).toBe("tooLarge")
  expect(FakeWorker.instances).toHaveLength(0)
})
it("reads files off-thread and terminates workers after success and on unmount", () => {
  const { result, unmount } = renderHook(useHarImport)
  act(() => result.current.open(file))
  const worker = FakeWorker.instances[0]!
  expect(result.current.loading).toBe(true)
  expect(worker.postMessage).toHaveBeenCalledWith(file)
  act(() => worker.onmessage!({ data: { capture: parseHar(exampleHar()) } }))
  expect(result.current.name).toBe("network.har")
  expect(result.current.capture?.entries).toHaveLength(9)
  expect(result.current.loading).toBe(false)
  expect(result.current.revision).toBe(1)
  expect(worker.terminate).toHaveBeenCalledOnce()
  act(() => result.current.open(file))
  unmount()
  expect(FakeWorker.instances[1]!.terminate).toHaveBeenCalledOnce()
})
it.each([
  "invalidJson",
  "invalidHar",
  "noValid",
  "tooMany",
  "other",
  undefined,
])(
  "reports worker parse errors %s without discarding a previous capture",
  (error) => {
    const { result } = renderHook(useHarImport)
    act(() => result.current.example("Existing"))
    act(() => result.current.open(file))
    act(() => FakeWorker.instances[0]!.onmessage!({ data: { error } }))
    expect(result.current.error).toBe(
      error === "other" || error === undefined ? "readFailed" : error
    )
    expect(result.current.name).toBe("Existing")
  }
)
it("handles worker startup and runtime errors", () => {
  const { result } = renderHook(useHarImport)
  act(() => result.current.open(file))
  act(() => FakeWorker.instances[0]!.onerror!())
  expect(result.current.error).toBe("readFailed")
  vi.stubGlobal(
    "Worker",
    class {
      constructor() {
        throw new Error("unavailable")
      }
    }
  )
  act(() => result.current.open(file))
  expect(result.current.error).toBe("readFailed")
  expect(result.current.loading).toBe(false)
})
it("cancels stale imports and ignores already queued worker callbacks", () => {
  const { result } = renderHook(useHarImport)
  act(() => result.current.open(file))
  const old = FakeWorker.instances[0]!
  act(() => result.current.open(new File(["{}"], "new.har")))
  expect(old.terminate).toHaveBeenCalledOnce()
  act(() => {
    old.onmessage!({ data: { capture: parseHar(exampleHar()) } })
    old.onerror!()
  })
  expect(result.current.name).toBeNull()
  expect(result.current.loading).toBe(true)
  act(() => result.current.clear())
  expect(FakeWorker.instances[1]!.terminate).toHaveBeenCalledOnce()
})
