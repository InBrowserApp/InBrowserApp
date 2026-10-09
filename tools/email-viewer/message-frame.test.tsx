import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import { MessageFrame } from "./message-frame"
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

test("keeps the visible passage in place when scaling without rebuilding HTML", () => {
  const { rerender, unmount } = render(
    <MessageFrame html="<p>Message</p>" title="Message" size={16} />
  )
  const frame = screen.getByTitle("Message") as HTMLIFrameElement
  const document = frame.contentDocument!
  document.body.innerHTML = "<p>A passage in the middle of a long thread.</p>"
  vi.spyOn(
    document.querySelector("p")!,
    "getBoundingClientRect"
  ).mockImplementation(() => {
    const top = document.documentElement.style.zoom === "1.25" ? 308 : 8
    return { top, bottom: top + 40, left: 0 } as DOMRect
  })
  const scroll = vi
    .spyOn(document.defaultView!, "scrollBy")
    .mockImplementation(() => {})
  fireEvent.load(frame)
  scroll.mockClear()
  rerender(<MessageFrame html="<p>Message</p>" title="Message" size={20} />)
  expect(document.documentElement.style.zoom).toBe("1.25")
  expect(scroll).toHaveBeenCalledWith(0, 300)
  expect(frame.getAttribute("srcdoc")).toBe("<p>Message</p>")
  expect(frame.getAttribute("sandbox")).not.toContain("allow-top-navigation")
  const remove = vi.spyOn(document, "removeEventListener")
  fireEvent.keyDown(document, { key: "ArrowDown" })
  fireEvent.keyDown(document, { key: "Escape" })
  unmount()
  expect(remove).toHaveBeenCalledWith("keydown", expect.any(Function))
})

test("Escape requests closing the containing focus dialog", () => {
  render(
    <dialog open>
      <MessageFrame html="<p>Message</p>" title="Message" size={16} />
    </dialog>
  )
  const frame = screen.getByTitle("Message") as HTMLIFrameElement
  const document = frame.contentDocument!
  const dialog = frame.closest("dialog")!
  vi.spyOn(dialog, "matches").mockReturnValue(true)
  const close = vi.fn()
  Object.defineProperty(dialog, "requestClose", { value: close })
  Object.defineProperty(document.defaultView!, "frameElement", { value: frame })
  fireEvent.load(frame)
  fireEvent.keyDown(document, { key: "Escape" })
  expect(close).toHaveBeenCalledOnce()
})
