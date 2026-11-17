import { act, cleanup, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { useDatabase } from "./use-database"
import type { Request, ResponsePayload } from "./types"

class FakeWorker {
  static all: FakeWorker[] = []
  onmessage?: (event: MessageEvent) => void
  onerror?: (event: ErrorEvent) => void
  onmessageerror?: () => void
  postMessage = vi.fn<(request: Request) => void>()
  terminate = vi.fn()
  constructor() {
    FakeWorker.all.push(this)
  }
  reply(payload: ResponsePayload, id?: number) {
    this.onmessage?.({
      data: { ...payload, id: id ?? this.postMessage.mock.lastCall![0].id },
    } as MessageEvent)
  }
}
const file = new File(["database"], "test.db")
const metadata = { objects: [], version: "3.53.0" }
const data = { columns: ["value"], rows: [[1n]], truncated: false, elapsed: 1 }
beforeEach(() => {
  FakeWorker.all = []
  vi.stubGlobal("Worker", FakeWorker)
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

test("owns a worker per file, ignores stale replies and releases workers on close", async () => {
  const { result, rerender, unmount } = renderHook(
    ({ source }) => useDatabase(source),
    { initialProps: { source: null as File | null } }
  )
  expect(FakeWorker.all).toHaveLength(0)
  await act(() =>
    result.current.request({ kind: "query", sql: "SELECT 1", limit: 100 })
  )
  rerender({ source: file })
  const first = FakeWorker.all[0]!
  expect(result.current.busy).toBe("open")
  act(() => first.reply({ kind: "open", metadata }, -1))
  expect(result.current.metadata).toBeNull()
  act(() => first.reply({ kind: "open", metadata }))
  expect(result.current.metadata).toEqual(metadata)
  act(() => {
    void result.current.request({ kind: "query", sql: "SELECT 1", limit: 100 })
  })
  expect(result.current.busy).toBe("query")
  await act(() =>
    result.current.request({ kind: "query", sql: "SELECT 2", limit: 100 })
  )
  expect(first.postMessage).toHaveBeenCalledTimes(2)
  act(() => first.reply({ kind: "query", result: data }))
  expect(result.current.result).toEqual(data)
  rerender({ source: new File(["other"], "replacement.db") })
  expect(first.terminate).toHaveBeenCalledOnce()
  act(() => first.reply({ kind: "query", result: data }))
  expect(result.current.result).toBeNull()
  const second = FakeWorker.all[1]!
  act(() => second.reply({ kind: "open", metadata }))
  act(() => {
    void result.current.request({ kind: "structure", name: "t" })
  })
  const structure = {
    name: "t",
    columns: data,
    indexes: data,
    foreignKeys: data,
  }
  act(() => second.reply({ kind: "structure", structure }))
  expect(result.current.structure).toEqual(structure)
  rerender({ source: null })
  expect(second.terminate).toHaveBeenCalledOnce()
  expect(result.current.metadata).toBeNull()
  unmount()
})

test("cancels a long query and reopens the retained file before running again", async () => {
  const { result } = renderHook(() => useDatabase(file))
  const first = FakeWorker.all[0]!
  act(() => first.reply({ kind: "open", metadata }))
  let pending: Promise<unknown> | undefined
  act(() => {
    pending = result.current.request({
      kind: "query",
      sql: "SELECT 1",
      limit: 100,
    })
  })
  act(() => result.current.cancel())
  await expect(pending).resolves.toBeNull()
  expect(first.terminate).toHaveBeenCalledOnce()
  expect(result.current.error?.key).toBe("cancelled")
  act(() => {
    void result.current.request({ kind: "query", sql: "SELECT 2", limit: 100 })
  })
  const second = FakeWorker.all[1]!
  expect(second.postMessage.mock.lastCall![0]).toMatchObject({
    kind: "open",
    file,
  })
  await act(async () => second.reply({ kind: "open", metadata }))
  expect(second.postMessage.mock.lastCall![0]).toMatchObject({
    kind: "query",
    sql: "SELECT 2",
  })
  act(() => second.reply({ kind: "query", result: data }))
  expect(result.current.result).toEqual(data)
})

test("does not run a reopened query after file replacement, and aborts timeouts", async () => {
  vi.useFakeTimers()
  const { result, rerender } = renderHook(({ source }) => useDatabase(source), {
    initialProps: { source: file as File | null },
  })
  const first = FakeWorker.all[0]!
  act(() => first.reply({ kind: "open", metadata }))
  act(() => {
    void result.current.request({ kind: "query", sql: "SELECT 1", limit: 100 })
  })
  act(() => vi.advanceTimersByTime(10_000))
  expect(result.current.error?.key).toBe("timeout")
  act(() => {
    void result.current.request({ kind: "query", sql: "SELECT 2", limit: 100 })
  })
  const second = FakeWorker.all[1]!
  rerender({ source: null })
  await act(async () => second.reply({ kind: "open", metadata }))
  expect(second.postMessage).toHaveBeenCalledTimes(1)
  expect(second.terminate).toHaveBeenCalledOnce()
  expect(result.current.metadata).toBeNull()
})

test("surfaces SQL errors without dropping a usable connection, and releases failed opens", () => {
  const { result, rerender } = renderHook(({ source }) => useDatabase(source), {
    initialProps: { source: file },
  })
  const worker = FakeWorker.all[0]!
  act(() => worker.reply({ kind: "open", metadata }))
  act(() => {
    void result.current.request({
      kind: "query",
      sql: "SELECT missing",
      limit: 100,
    })
  })
  act(() =>
    worker.reply({
      kind: "error",
      error: "workerError",
      detail: "no such column: missing",
    })
  )
  expect(result.current.error?.detail).toContain("no such column")
  expect(worker.terminate).not.toHaveBeenCalled()
  rerender({ source: new File(["bad"], "bad.db") })
  const next = FakeWorker.all[1]!
  act(() => next.reply({ kind: "error", error: "invalid" }))
  expect(result.current.error?.key).toBe("invalid")
  expect(next.terminate).toHaveBeenCalledOnce()
})

test.each(["onerror", "onmessageerror"] as const)(
  "handles %s and ignores crashes from old sessions",
  (kind) => {
    const { result, rerender } = renderHook(
      ({ source }) => useDatabase(source),
      { initialProps: { source: file } }
    )
    const worker = FakeWorker.all[0]!
    const preventDefault = vi.fn()
    act(() => {
      if (kind === "onerror")
        worker.onerror?.({ preventDefault } as unknown as ErrorEvent)
      else worker.onmessageerror?.()
    })
    expect(result.current.error?.key).toBe("workerError")
    expect(worker.terminate).toHaveBeenCalledOnce()
    rerender({ source: new File(["other"], "next.db") })
    act(() => {
      if (kind === "onerror")
        worker.onerror?.({ preventDefault } as unknown as ErrorEvent)
      else worker.onmessageerror?.()
    })
    expect(result.current.error).toBeNull()
  }
)

test("handles unsupported Worker creation and postMessage failures", () => {
  vi.stubGlobal(
    "Worker",
    class {
      constructor() {
        throw new Error("not supported")
      }
    }
  )
  const first = renderHook(() => useDatabase(file))
  expect(first.result.current.error?.key).toBe("workerError")
  first.unmount()
  vi.stubGlobal("Worker", FakeWorker)
  vi.stubGlobal(
    "Worker",
    class extends FakeWorker {
      constructor() {
        super()
        this.postMessage.mockImplementation(() => {
          throw new Error("clone")
        })
      }
    }
  )
  const second = renderHook(() => useDatabase(file))
  expect(second.result.current.error?.key).toBe("workerError")
  expect(FakeWorker.all[0]!.terminate).toHaveBeenCalledOnce()
})
