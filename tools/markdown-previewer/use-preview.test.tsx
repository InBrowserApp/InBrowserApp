// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import { usePreview } from "./use-preview"
import { buildMarkdownPreview } from "./core/markdown-preview"

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})
test("a replaced worker cannot restore private content or an old failure", () => {
  const workers: WorkerDouble[] = []
  class WorkerDouble {
    onmessage: ((event: { data: object }) => void) | null = null
    onerror: (() => void) | null = null
    terminate = vi.fn()
    postMessage() {}
    constructor() {
      workers.push(this)
    }
    finish(source: string) {
      this.onmessage?.({
        data: { preview: buildMarkdownPreview(source, "Untitled") },
      })
    }
  }
  vi.stubGlobal("Worker", WorkerDouble)
  const { result, rerender } = renderHook(
    ({ source }) => usePreview(source, "Untitled", true),
    { initialProps: { source: "# Private" } }
  )
  rerender({ source: "# Public" })
  expect(workers[0]!.terminate).toHaveBeenCalled()
  act(() => workers[1]!.finish("# Public"))
  act(() => {
    workers[0]!.finish("# Private")
    workers[0]!.onerror?.()
  })
  expect(result.current.preview?.documentTitle).toBe("Public")
  expect(result.current.error).toBe(false)
  expect(result.current.preview?.toc[0]?.id).toBe("markdown-public")
})
test("reports a worker startup failure without crashing the editor", () => {
  vi.stubGlobal(
    "Worker",
    class {
      constructor() {
        throw new Error("unavailable")
      }
    }
  )
  const { result } = renderHook(() => usePreview("# Draft", "Untitled", true))
  expect(result.current.error).toBe(true)
  expect(result.current.pending).toBe(false)
})

test("disposes one-shot workers on success, runtime failure, and message deserialization failure", () => {
  const workers: WorkerDouble[] = []
  class WorkerDouble {
    onmessage: ((event: { data: object }) => void) | null = null
    onerror: (() => void) | null = null
    onmessageerror: (() => void) | null = null
    terminate = vi.fn()
    postMessage() {}
    constructor() {
      workers.push(this)
    }
  }
  vi.stubGlobal("Worker", WorkerDouble)
  const { result, rerender } = renderHook(
    ({ source }) => usePreview(source, "Untitled", true),
    { initialProps: { source: "# First" } }
  )
  act(() =>
    workers[0]!.onmessage?.({
      data: { preview: buildMarkdownPreview("# First", "Untitled") },
    })
  )
  expect(workers[0]!.terminate).toHaveBeenCalledTimes(1)
  rerender({ source: "# Second" })
  act(() => workers[1]!.onerror?.())
  expect(result.current.error).toBe(true)
  expect(result.current.pending).toBe(false)
  expect(workers[1]!.terminate).toHaveBeenCalledTimes(1)
  rerender({ source: "# Third" })
  act(() => workers[2]!.onmessageerror?.())
  expect(result.current.error).toBe(true)
  expect(result.current.pending).toBe(false)
  expect(workers[2]!.terminate).toHaveBeenCalledTimes(1)
})
