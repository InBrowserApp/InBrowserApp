import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import { DocumentFrame } from "./document-frame"
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

test("keeps the visible passage stable under zoom and scrolls outline targets", () => {
  const props = {
    html: "<p>Document</p>",
    title: "Document",
    zoom: 100,
    target: null,
    onMissing: vi.fn(),
    onPosition: vi.fn(),
  }
  const { rerender } = render(<DocumentFrame {...props} />)
  const frame = screen.getByTitle("Document") as HTMLIFrameElement
  const doc = frame.contentDocument!
  Object.defineProperty(frame, "clientWidth", { value: 800 })
  Object.defineProperty(doc.defaultView!, "frameElement", { value: frame })
  const focus = vi.spyOn(frame, "focus")
  doc.body.innerHTML = '<p id="chapter">Visible passage.</p>'
  const p = doc.querySelector("p")!
  vi.spyOn(p, "getBoundingClientRect").mockImplementation(() => {
    const top = doc.documentElement.style.zoom === "1.25" ? 308 : 8
    return { top, bottom: top + 40, left: 0 } as DOMRect
  })
  const scroll = vi
    .spyOn(doc.defaultView!, "scrollBy")
    .mockImplementation(() => {})
  const into = vi.fn()
  p.scrollIntoView = into
  fireEvent.load(frame)
  scroll.mockClear()
  rerender(<DocumentFrame {...props} zoom={125} target={{ id: "chapter" }} />)
  expect(scroll).toHaveBeenCalledWith(0, 300)
  expect(into).not.toHaveBeenCalled()
  expect(scroll).toHaveBeenCalledWith(0, 308)
  expect(focus).toHaveBeenCalledWith({ preventScroll: true })
  expect(frame.getAttribute("srcdoc")).toBe(props.html)
})

test("handles inert internal links, missing fragments and Escape in focus mode", () => {
  const missing = vi.fn()
  const { unmount } = render(
    <dialog open>
      <DocumentFrame
        html=""
        title="Document"
        zoom={100}
        target={null}
        onMissing={missing}
        onPosition={vi.fn()}
      />
    </dialog>
  )
  const frame = screen.getByTitle("Document") as HTMLIFrameElement
  const doc = frame.contentDocument!
  Object.defineProperty(frame, "clientWidth", { value: 800 })
  doc.body.innerHTML =
    '<a data-latex-link="note%20one">Note</a><a data-latex-link="bad%">Bad</a><details><p id="note one">Footnote</p></details>'
  const scroll = vi.spyOn(doc.defaultView!, "scrollBy")
  const target = doc.getElementById("note one")!
  vi.spyOn(target, "getBoundingClientRect").mockReturnValue({
    top: 250,
  } as DOMRect)
  target.scrollIntoView = vi.fn()
  const dialog = frame.closest("dialog")!
  vi.spyOn(dialog, "matches").mockReturnValue(true)
  const close = vi.fn()
  Object.defineProperty(dialog, "requestClose", { value: close })
  Object.defineProperty(doc.defaultView!, "frameElement", { value: frame })
  fireEvent.load(frame)
  const links = doc.querySelectorAll("a")
  fireEvent.click(links[0]!)
  expect(scroll).toHaveBeenCalledWith(0, 250)
  expect(target.scrollIntoView).not.toHaveBeenCalled()
  expect(doc.querySelector("details")?.open).toBe(true)
  fireEvent.keyDown(links[1]!, { key: "Enter" })
  expect(missing).toHaveBeenCalledOnce()
  fireEvent.click(doc.body)
  fireEvent.keyDown(doc, { key: "ArrowDown" })
  fireEvent.keyDown(doc, { key: "Escape" })
  expect(close).toHaveBeenCalledOnce()
  const remove = vi.spyOn(doc, "removeEventListener")
  unmount()
  expect(remove).toHaveBeenCalledWith("click", expect.any(Function))
  expect(remove).toHaveBeenCalledWith("keydown", expect.any(Function))
})
