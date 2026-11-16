import { act, cleanup, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { convertInput } from "./core/convert"
import { useConversion } from "./use-conversion"
import type { ConversionRequest, WorkerResponse } from "./types"

const request: ConversionRequest = {
  input: "first",
  source: "auto",
  target: "utf-8",
  bom: "remove",
  lineEnding: "preserve",
}
const result = convertInput("first", request)
const workers: FakeWorker[] = []
class FakeWorker {
  onmessage: ((event: { data: WorkerResponse }) => void) | null = null
  onerror: ((event: { preventDefault: () => void }) => void) | null = null
  terminate = vi.fn()
  postMessage = vi.fn()
  constructor() {
    workers.push(this)
  }
}
const tick = () =>
  act(() => {
    vi.advanceTimersByTime(150)
  })

beforeEach(() => {
  workers.length = 0
  vi.useFakeTimers()
  vi.stubGlobal("Worker", FakeWorker)
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe("conversion worker lifecycle", () => {
  it("stays idle without input and debounces work", () => {
    const { result: state, rerender } = renderHook(useConversion, {
      initialProps: null as ConversionRequest | null,
    })
    expect(state.current).toEqual({
      loading: false,
      failed: false,
      result: null,
    })
    rerender(request)
    expect(state.current.loading).toBe(true)
    expect(workers).toHaveLength(0)
    tick()
    expect(workers[0]!.postMessage).toHaveBeenCalledWith(request)
  })
  it("invalidates a download immediately when settings change and ignores stale completions", () => {
    const { result: state, rerender } = renderHook(useConversion, {
      initialProps: request,
    })
    tick()
    act(() => workers[0]!.onmessage!({ data: { result } }))
    expect(state.current.result).toEqual(result)
    expect(workers[0]!.terminate).toHaveBeenCalled()
    rerender({ ...request, target: "gbk" })
    expect(state.current.result).toBeNull()
    expect(state.current.loading).toBe(true)
    expect(workers[0]!.terminate).toHaveBeenCalledTimes(2)
    act(() => workers[0]!.onmessage!({ data: { result } }))
    expect(state.current.result).toBeNull()
    tick()
    expect(workers).toHaveLength(2)
  })
  it("cancels a pending timer and terminates an active worker on clear or unmount", () => {
    const {
      rerender,
      unmount,
      result: state,
    } = renderHook(useConversion, {
      initialProps: request as ConversionRequest | null,
    })
    rerender(null)
    tick()
    expect(workers).toHaveLength(0)
    expect(state.current.loading).toBe(false)
    rerender(request)
    tick()
    unmount()
    expect(workers[0]!.terminate).toHaveBeenCalledOnce()
  })
  it("reports runtime errors without leaving a previous result available", () => {
    const { result: state } = renderHook(useConversion, {
      initialProps: request,
    })
    tick()
    const preventDefault = vi.fn()
    act(() => workers[0]!.onerror!({ preventDefault }))
    expect(preventDefault).toHaveBeenCalledOnce()
    expect(state.current).toEqual({
      result: null,
      failed: true,
      loading: false,
    })
  })
  it("handles explicit processing failures", () => {
    const { result: state } = renderHook(useConversion, {
      initialProps: request,
    })
    tick()
    act(() => workers[0]!.onmessage!({ data: { failed: true } }))
    expect(state.current.failed).toBe(true)
    expect(state.current.loading).toBe(false)
  })
  it("handles browsers where worker construction fails", () => {
    vi.stubGlobal(
      "Worker",
      class {
        constructor() {
          throw new Error("Worker unavailable")
        }
      }
    )
    const { result: state } = renderHook(useConversion, {
      initialProps: request,
    })
    tick()
    expect(state.current.failed).toBe(true)
  })
})
