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
  }
  const { rerender } = render(<DocumentFrame {...props} />)
  const frame = screen.getByTitle("Document") as HTMLIFrameElement
  Object.defineProperty(frame, "clientWidth", { value: 800 })
  const doc = frame.contentDocument!
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
  expect(scroll).toHaveBeenLastCalledWith(0, 308)
  expect(into).not.toHaveBeenCalled()
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
      />
    </dialog>
  )
  const frame = screen.getByTitle("Document") as HTMLIFrameElement
  Object.defineProperty(frame, "clientWidth", { value: 800 })
  const doc = frame.contentDocument!
  doc.body.innerHTML =
    '<a data-odt-reference="note%20one">Note</a><a data-odt-reference="bad%">Bad</a><details><p id="note one">Footnote</p></details>'
  vi.spyOn(
    doc.getElementById("note one")!,
    "getBoundingClientRect"
  ).mockReturnValue({ top: 680 } as DOMRect)
  const scroll = vi.spyOn(doc.defaultView!, "scrollBy")
  const dialog = frame.closest("dialog")!
  vi.spyOn(dialog, "matches").mockReturnValue(true)
  const close = vi.fn()
  Object.defineProperty(dialog, "requestClose", { value: close })
  Object.defineProperty(doc.defaultView!, "frameElement", { value: frame })
  fireEvent.load(frame)
  scroll.mockClear()
  const links = doc.querySelectorAll("a")
  fireEvent.click(links[0]!)
  expect(scroll).toHaveBeenCalledExactlyOnceWith(0, 680)
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
