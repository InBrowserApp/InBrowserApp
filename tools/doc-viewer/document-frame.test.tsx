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
  Object.defineProperty(doc.defaultView!, "frameElement", { value: frame })
  Object.defineProperty(frame, "clientWidth", {
    configurable: true,
    value: 900,
  })
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
  expect(into).toHaveBeenCalledOnce()
  expect(focus).toHaveBeenCalledOnce()
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
  doc.body.innerHTML =
    '<a data-doc-reference="note%20one">Note</a><a data-doc-reference="bad%">Bad</a><details><p id="note one">Footnote</p></details>'
  const scroll = vi.fn()
  doc.getElementById("note one")!.scrollIntoView = scroll
  const dialog = frame.closest("dialog")!
  vi.spyOn(dialog, "matches").mockReturnValue(true)
  const close = vi.fn()
  Object.defineProperty(dialog, "requestClose", { value: close })
  Object.defineProperty(doc.defaultView!, "frameElement", { value: frame })
  Object.defineProperty(frame, "clientWidth", {
    configurable: true,
    value: 900,
  })
  fireEvent.load(frame)
  const links = doc.querySelectorAll("a")
  fireEvent.click(links[0]!)
  expect(scroll).toHaveBeenCalledOnce()
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

test("keeps the current passage through responsive reflow and reports scroll position", () => {
  const position = vi.fn()
  render(
    <DocumentFrame
      html=""
      title="Resize document"
      zoom={100}
      target={null}
      onMissing={vi.fn()}
      onPosition={position}
    />
  )
  const frame = screen.getByTitle("Resize document") as HTMLIFrameElement
  const doc = frame.contentDocument!,
    view = doc.defaultView!
  Object.defineProperty(view, "frameElement", { value: frame })
  Object.defineProperty(frame, "clientWidth", {
    configurable: true,
    value: 900,
  })
  doc.body.innerHTML = "<p>Current visible passage.</p>"
  let top = 12
  vi.spyOn(doc.querySelector("p")!, "getBoundingClientRect").mockImplementation(
    () => ({ top, bottom: top + 40, left: 0 }) as DOMRect
  )
  Object.defineProperty(doc.documentElement, "scrollHeight", {
    configurable: true,
    value: 2000,
  })
  Object.defineProperty(view, "innerHeight", { configurable: true, value: 500 })
  Object.defineProperty(view, "scrollY", { configurable: true, value: 750 })
  Object.defineProperty(view, "innerWidth", { configurable: true, value: 900 })
  const scroll = vi.spyOn(view, "scrollBy").mockImplementation(() => {})
  fireEvent.load(frame)
  expect(position).toHaveBeenLastCalledWith(50)
  scroll.mockClear()
  top = 340
  fireEvent.resize(view)
  expect(scroll).toHaveBeenLastCalledWith(0, 328)
  // An explicitly scrolled passage becomes the next resize anchor.
  top = 20
  fireEvent.scroll(view)
  top = 45
  fireEvent.resize(view)
  expect(scroll).toHaveBeenLastCalledWith(0, 25)
  scroll.mockClear()
  Object.defineProperty(view, "innerWidth", { configurable: true, value: 0 })
  fireEvent.resize(view)
  fireEvent.scroll(view)
  expect(scroll).not.toHaveBeenCalled()
  // Chromium/WebKit keep a nonzero innerWidth while the iframe is hidden.
  Object.defineProperty(view, "innerWidth", { configurable: true, value: 900 })
  Object.defineProperty(frame, "clientWidth", { configurable: true, value: 0 })
  top = 0
  fireEvent.scroll(view)
  fireEvent.resize(view)
  expect(scroll).not.toHaveBeenCalled()
  Object.defineProperty(frame, "clientWidth", {
    configurable: true,
    value: 900,
  })
  top = 145
  fireEvent.resize(view)
  expect(scroll).toHaveBeenLastCalledWith(0, 100)
})
