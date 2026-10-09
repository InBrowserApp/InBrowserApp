import { act, cleanup, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { useDocument } from "./use-document"
import catalog from "./messages/en.json"
import meta from "./meta/en.json"

const m = { ...catalog, meta }
class ControlledReader {
  static readers: ControlledReader[] = []
  static throws = false
  result: ArrayBuffer | null = null
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  abort = vi.fn()
  constructor() {
    ControlledReader.readers.push(this)
  }
  readAsArrayBuffer() {
    if (ControlledReader.throws) throw new Error("unavailable")
  }
  finish(text: string) {
    this.result = new TextEncoder().encode(text).buffer
    this.onload?.()
  }
}
beforeEach(() => {
  localStorage.clear()
  ControlledReader.readers = []
  ControlledReader.throws = false
  vi.stubGlobal("FileReader", ControlledReader)
  vi.stubGlobal(
    "confirm",
    vi.fn(() => true)
  )
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
const file = (name = "readme.md") => new File(["text"], name)

test("cancels pending reads and ignores old completion/error events after replacement or close", () => {
  const { result, unmount } = renderHook(() => useDocument(m))
  act(() => result.current.open(file("first.md")))
  const first = ControlledReader.readers[0]!
  act(() => result.current.open(file("second.md")))
  const second = ControlledReader.readers[1]!
  expect(first.abort).toHaveBeenCalled()
  act(() => {
    first.finish("# Stale")
    first.onerror?.()
  })
  expect(result.current.file).toBeNull()
  act(() => result.current.cancel())
  act(() => second.finish("# Canceled"))
  expect(result.current.file).toBeNull()
  expect(result.current.error).toBe("")
  act(() => result.current.open(file("third.md")))
  const third = ControlledReader.readers[2]!
  act(() => result.current.open(null))
  act(() => third.finish("# Closed"))
  expect(result.current.file).toBeNull()
  act(() => result.current.open(file()))
  unmount()
  expect(ControlledReader.readers[3]!.abort).toHaveBeenCalled()
})

test("reports actual read failures, including synchronous resource errors, and preserves the draft", () => {
  const { result } = renderHook(() => useDocument(m))
  act(() => result.current.change("# Keep draft"))
  act(() => result.current.open(file()))
  act(() => ControlledReader.readers[0]!.onerror?.())
  expect(result.current.error).toBe(m.openFailed)
  ControlledReader.throws = true
  act(() => result.current.open(file()))
  expect(result.current.error).toBe(m.openFailed)
  expect(result.current.loading).toBe(false)
  expect(result.current.markdown).toBe("# Keep draft")
})

test("decodes UTF-16 BOMs and rejects invalid UTF-8 without applying a partial document", () => {
  const { result } = renderHook(() => useDocument(m))
  for (const bytes of [
    [255, 254, 35, 0, 32, 0, 65, 0],
    [254, 255, 0, 35, 0, 32, 0, 65],
  ]) {
    act(() => result.current.open(file()))
    const current = ControlledReader.readers.at(-1)!
    act(() => {
      current.result = new Uint8Array(bytes).buffer
      current.onload?.()
    })
    expect(result.current.markdown).toBe("# A")
  }
  act(() => result.current.open(file()))
  const current = ControlledReader.readers.at(-1)!
  act(() => {
    current.result = new Uint8Array([255, 255]).buffer
    current.onload?.()
  })
  expect(result.current.error).toBe(m.encodingFailed)
  expect(result.current.markdown).toBe("# A")
})

test("releases settled reader buffers and distinguishes resource exhaustion from invalid text", () => {
  const { result } = renderHook(() => useDocument(m))
  act(() => result.current.open(file()))
  const completed = ControlledReader.readers[0]!
  act(() => completed.finish("# Loaded"))
  act(() => result.current.open(file()))
  expect(completed.abort).not.toHaveBeenCalled()
  const failed = ControlledReader.readers[1]!
  act(() => failed.onerror?.())
  act(() => result.current.open(file()))
  expect(failed.abort).not.toHaveBeenCalled()
  const constrained = ControlledReader.readers[2]!
  constrained.result = new ArrayBuffer(0)
  vi.spyOn(TextDecoder.prototype, "decode").mockImplementation(() => {
    throw new RangeError("allocation failed")
  })
  act(() => constrained.onload?.())
  expect(result.current.error).toBe(m.openFailed)
  expect(result.current.markdown).toBe("# Loaded")
  act(() => result.current.open(null))
  expect(constrained.abort).not.toHaveBeenCalled()
})
