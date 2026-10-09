// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import { useReadingPosition } from "./use-reading-position"

let resize: () => void
const disconnect = vi.fn()
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  delete (document as Partial<Document>).caretPositionFromPoint
  delete (Range.prototype as Partial<Range>).getBoundingClientRect
  document.body.innerHTML = ""
})

function reader() {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: () => void) {
        resize = callback
      }
      observe() {}
      disconnect = disconnect
    }
  )
  vi.stubGlobal("innerWidth", 1000)
  vi.stubGlobal("innerHeight", 600)
  vi.stubGlobal("scrollY", 0)
  document.body.innerHTML = "<p>First passage</p><p>Next passage</p>"
  const first = document.querySelectorAll("p")[0]!.firstChild!
  const next = document.querySelectorAll("p")[1]!.firstChild!
  let visible = first
  const tops = new Map<Node, number>([
    [first, 8],
    [next, 608],
  ])
  document.caretPositionFromPoint = vi.fn(() => ({
    offsetNode: visible,
    offset: 2,
    getClientRect: () => null,
  }))
  Object.defineProperty(Range.prototype, "getBoundingClientRect", {
    configurable: true,
    value(this: Range) {
      const top = tops.get(this.startContainer)! - window.scrollY
      return { top, bottom: top + 20, left: 0 } as DOMRect
    },
  })
  const scroll = vi.spyOn(window, "scrollBy").mockImplementation((_x, y) => {
    vi.stubGlobal("scrollY", window.scrollY + Number(y))
  })
  const hook = renderHook(({ doc }) => useReadingPosition(doc), {
    initialProps: { doc: document as Document | null },
  })
  return {
    ...hook,
    first,
    next,
    tops,
    scroll,
    readNext: (emitScroll = true) => {
      visible = next
      vi.stubGlobal("scrollY", tops.get(next)! - 8)
      if (emitScroll) window.dispatchEvent(new Event("scroll"))
    },
  }
}

test("retains the visible character when a resize scroll event arrives before resize", () => {
  const { tops, first, scroll } = reader()
  tops.set(first, 1408)
  vi.stubGlobal("innerWidth", 320)
  act(() => window.dispatchEvent(new Event("scroll")))
  expect(scroll).toHaveBeenLastCalledWith(0, 1400)
  act(() => window.dispatchEvent(new Event("resize")))
  expect(window.scrollY).toBe(1400)
  tops.set(first, 8)
  vi.stubGlobal("innerWidth", 1000)
  act(() => window.dispatchEvent(new Event("resize")))
  expect(window.scrollY).toBe(0)
})

test("tracks deliberate scrolling and later body reflows", () => {
  const { tops, next, readNext } = reader()
  act(readNext)
  tops.set(next, 2008)
  act(() => resize())
  expect(window.scrollY).toBe(2000)
})

test("preserves the last visible passage while an outline hides the frame", () => {
  const { tops, first, result, scroll } = reader()
  const captured = document.caretPositionFromPoint!
  vi.stubGlobal("innerWidth", 0)
  tops.set(first, 0)
  vi.mocked(captured).mockClear()
  act(() => {
    window.dispatchEvent(new Event("resize"))
    window.dispatchEvent(new Event("scroll"))
    resize()
    result.current.preserve(() => tops.set(first, 3008))
  })
  expect(scroll).not.toHaveBeenCalled()
  expect(captured).not.toHaveBeenCalled()
  vi.stubGlobal("innerWidth", 320)
  act(() => window.dispatchEvent(new Event("resize")))
  expect(window.scrollY).toBe(3000)
})

test("keeps zoom anchored and accepts explicit navigation before resize callbacks", () => {
  const { result, tops, first, next, readNext } = reader()
  act(() => result.current.preserve(() => tops.set(first, 308)))
  expect(window.scrollY).toBe(300)
  act(() => {
    result.current.navigate(() => readNext(false))
    resize()
  })
  expect(window.scrollY).toBe(tops.get(next)! - 8)
})

test("releases old listeners and starts replacement documents without the old anchor", () => {
  const { rerender, tops, first, scroll } = reader()
  const remove = vi.spyOn(window, "removeEventListener")
  rerender({ doc: null })
  expect(disconnect).toHaveBeenCalled()
  expect(remove).toHaveBeenCalledWith("resize", expect.any(Function))
  expect(remove).toHaveBeenCalledWith("scroll", expect.any(Function))
  tops.set(first, 508)
  act(() => window.dispatchEvent(new Event("resize")))
  expect(scroll).not.toHaveBeenCalled()
  rerender({ doc: document })
  act(() => resize())
  expect(window.scrollY).toBe(0)
})

test("ignores a hidden frame even when its window retains its previous dimensions", () => {
  const { tops, first, scroll } = reader()
  const frame = document.createElement("iframe")
  vi.spyOn(window, "frameElement", "get").mockReturnValue(frame)
  const frameWidth = vi.spyOn(frame, "clientWidth", "get").mockReturnValue(0)
  tops.set(first, 1008)
  act(() => {
    resize()
    window.dispatchEvent(new Event("scroll"))
  })
  expect(scroll).not.toHaveBeenCalled()
  frameWidth.mockReturnValue(320)
  act(() => resize())
  expect(window.scrollY).toBe(1000)
})

test("keeps the pre-resize passage when changing zoom before resize is delivered", () => {
  const { tops, first, result } = reader()
  tops.set(first, 1008)
  vi.stubGlobal("innerWidth", 320)
  act(() => result.current.preserve(() => tops.set(first, 1308)))
  expect(window.scrollY).toBe(1300)
})
