import { cleanup, fireEvent, render } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import { ReaderFrame } from "./reader-frame"
const reading = vi.hoisted(() => ({
  preserve: vi.fn((change: () => void) => change()),
  navigate: vi.fn((change: () => void) => change()),
  scroll: vi.fn(),
}))
vi.mock("@workspace/ui/lib/use-reading-position", () => ({
  useReadingPosition: () => reading,
}))
vi.mock("@workspace/ui/lib/scroll-reading-target", () => ({
  scrollReadingTarget: reading.scroll,
}))
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.clearAllMocks()
})
test("reader preserves reflow, navigates in its own frame, and closes focus mode with Escape", () => {
  const props = {
    html: "",
    title: "Text",
    zoom: 100,
    wrap: false,
    revision: 1,
  }
  const { container, rerender, unmount } = render(
    <dialog>
      <ReaderFrame {...props} />
    </dialog>
  )
  const frame = container.querySelector("iframe")!
  const doc = frame.contentDocument!
  Object.defineProperty(doc.defaultView!, "frameElement", { value: frame })
  doc.body.innerHTML = '<pre id="line-1">first</pre><mark>found</mark>'
  const line = doc.getElementById("line-1")!
  const mark = doc.querySelector("mark")!
  const focus = vi.spyOn(mark, "focus")
  const scrollBy = vi.spyOn(doc.defaultView!, "scrollBy")
  const scrollTo = vi.spyOn(doc.defaultView!, "scrollTo")
  vi.spyOn(mark, "getBoundingClientRect").mockReturnValue({
    left: -20,
    right: 30,
  } as DOMRect)
  fireEvent.load(frame)
  expect(reading.preserve).toHaveBeenCalled()
  expect(doc.documentElement.style.fontSize).toBe("14px")
  rerender(
    <dialog>
      <ReaderFrame {...props} zoom={125} wrap target={1} />
    </dialog>
  )
  expect(doc.documentElement.style.fontSize).toBe("17.5px")
  expect(doc.documentElement.hasAttribute("data-wrap")).toBe(true)
  expect(reading.scroll).toHaveBeenLastCalledWith(doc, mark)
  expect(scrollBy).toHaveBeenLastCalledWith(-36, 0)
  expect(focus).toHaveBeenLastCalledWith({ preventScroll: true })
  focus.mockClear()
  rerender(
    <dialog>
      <ReaderFrame {...props} target={1} focus={false} />
    </dialog>
  )
  expect(focus).not.toHaveBeenCalled()
  scrollBy.mockClear()
  vi.mocked(mark.getBoundingClientRect).mockReturnValue({
    left: 20,
    right: 30,
  } as DOMRect)
  rerender(
    <dialog>
      <ReaderFrame {...props} target={1} revision={2} />
    </dialog>
  )
  expect(scrollBy).not.toHaveBeenCalled()
  rerender(
    <dialog>
      <ReaderFrame {...props} target={1} end />
    </dialog>
  )
  expect(scrollTo).toHaveBeenCalledWith(
    doc.documentElement.scrollWidth,
    doc.documentElement.scrollHeight
  )
  mark.remove()
  rerender(
    <dialog>
      <ReaderFrame {...props} target={1} revision={3} />
    </dialog>
  )
  expect(reading.scroll).toHaveBeenLastCalledWith(doc, line)
  const count = reading.navigate.mock.calls.length
  rerender(
    <dialog>
      <ReaderFrame {...props} target={9} revision={4} />
    </dialog>
  )
  expect(reading.navigate).toHaveBeenCalledTimes(count)
  const dialog = container.querySelector("dialog")!
  const close = vi.fn()
  Object.defineProperty(dialog, "requestClose", { value: close })
  const modal = vi.spyOn(dialog, "matches").mockReturnValue(false)
  fireEvent.keyDown(doc, { key: "Enter" })
  fireEvent.keyDown(doc, { key: "Escape" })
  expect(close).not.toHaveBeenCalled()
  modal.mockReturnValue(true)
  const blocked = new KeyboardEvent("keydown", {
    key: "Escape",
    cancelable: true,
  })
  blocked.preventDefault()
  doc.dispatchEvent(blocked)
  expect(close).not.toHaveBeenCalled()
  fireEvent.keyDown(doc, { key: "Escape" })
  expect(close).toHaveBeenCalledOnce()
  const remove = vi.spyOn(doc, "removeEventListener")
  unmount()
  expect(remove).toHaveBeenCalledWith("keydown", expect.any(Function))
})
