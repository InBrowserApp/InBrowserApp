import { act, cleanup, renderHook } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import { useReader } from "./use-reader"
import type { Response } from "./types"
class FakeWorker {
  static all: FakeWorker[] = []
  onmessage?: (event: { data: Response }) => void
  onerror?: (event: { preventDefault: () => void; message: string }) => void
  onmessageerror?: () => void
  postMessage = vi.fn()
  terminate = vi.fn()
  constructor() {
    FakeWorker.all.push(this)
  }
}
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  FakeWorker.all = []
})
const file = () => new File(["one\ntwo"], "read.log")
const view = (id: number) => ({
  id,
  metadata: { encoding: "utf-8", lines: 2, sections: 1 },
  section: {
    index: 0,
    start: 0,
    end: 7,
    rows: [{ line: 1, offset: 0, text: "one", continued: false }],
  },
})
const last = () => FakeWorker.all.at(-1)!

test("retains only current file/request results and releases workers on replacement, error and close", () => {
  vi.stubGlobal("Worker", FakeWorker)
  const { result, rerender, unmount } = renderHook(
    ({ source, encoding }) => useReader(source, encoding),
    { initialProps: { source: file() as File | null, encoding: "auto" } }
  )
  const first = last()
  expect(result.current.busy).toBe(true)
  expect(first.postMessage).toHaveBeenCalledWith(
    expect.objectContaining({ kind: "open", encoding: "auto" })
  )
  act(() => first.onmessage?.({ data: view(1) }))
  expect(result.current.view?.metadata.lines).toBe(2)
  act(() =>
    result.current.request({
      kind: "search",
      query: "z",
      from: 0,
      direction: 1,
    })
  )
  act(() => first.onmessage?.({ data: { ...view(1), match: null } }))
  expect(result.current.busy).toBe(true)
  act(() =>
    first.onmessage?.({
      data: {
        ...view(2),
        match: null,
        section: { index: 9, start: 0, end: 0, rows: [] },
      },
    })
  )
  expect(result.current.view?.section.index).toBe(0)
  expect(result.current.view?.match).toBeNull()
  rerender({ source: file(), encoding: "auto" })
  expect(first.terminate).toHaveBeenCalled()
  act(() => first.onmessage?.({ data: view(3) }))
  expect(result.current.view).toBeNull()
  const second = last()
  act(() => second.onmessage?.({ data: { id: 3, error: "binary" } }))
  expect(result.current.error).toBe("binary")
  expect(second.terminate).toHaveBeenCalled()
  act(() => result.current.request({ kind: "end" }))
  rerender({ source: file(), encoding: "windows-1252" })
  const third = last()
  expect(third.postMessage).toHaveBeenCalledWith(
    expect.objectContaining({ encoding: "windows-1252" })
  )
  rerender({ source: null, encoding: "auto" })
  expect(third.terminate).toHaveBeenCalled()
  expect(result.current.view).toBeNull()
  unmount()
})

test("reports worker creation, communication and resource failures and ignores retired worker errors", () => {
  vi.stubGlobal("Worker", FakeWorker)
  const { result, rerender } = renderHook(
    ({ source }) => useReader(source, "auto"),
    { initialProps: { source: file() } }
  )
  const old = last()
  const prevented = vi.fn()
  rerender({ source: file() })
  act(() => old.onerror?.({ message: "memory", preventDefault: prevented }))
  expect(result.current.error).toBeNull()
  act(() => last().onerror?.({ message: "memory", preventDefault: prevented }))
  expect(result.current.error).toBe("resourceLimit")
  expect(prevented).toHaveBeenCalled()
  rerender({ source: file() })
  act(() => last().onmessageerror?.())
  expect(result.current.error).toBe("readError")
  rerender({ source: file() })
  last().postMessage.mockImplementation(() => {
    throw new RangeError("memory")
  })
  act(() => result.current.request({ kind: "end" }))
  expect(result.current.error).toBe("resourceLimit")
  vi.stubGlobal(
    "Worker",
    class {
      constructor() {
        throw new Error("unavailable")
      }
    }
  )
  rerender({ source: file() })
  expect(result.current.error).toBe("readError")
})

test("rejects unsupported extensions without creating a worker and preserves successful empty results", () => {
  vi.stubGlobal("Worker", FakeWorker)
  const { result, rerender } = renderHook(
    ({ source }) => useReader(source, "auto"),
    { initialProps: { source: new File(["text"], "file.zip") } }
  )
  expect(result.current.error).toBe("unsupported")
  expect(FakeWorker.all).toHaveLength(0)
  rerender({ source: file() })
  act(() => last().onmessage?.({ data: { ...view(1), match: null } }))
  expect(result.current.view?.match).toBeNull()
})
