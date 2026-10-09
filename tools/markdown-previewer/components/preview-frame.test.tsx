// @vitest-environment jsdom
import { act, cleanup, fireEvent, render } from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { PreviewFrame } from "./preview-frame"

beforeEach(() =>
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    }
  )
)
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

test("applies reader controls without replacing the document and handles deliberate links and targets", () => {
  const missing = vi.fn()
  const props = {
    html: "",
    title: "Document",
    zoom: 100,
    wide: false,
    theme: "clean" as const,
    target: null,
    onMissing: missing,
  }
  const view = render(<PreviewFrame {...props} />)
  const iframe = view.getByTitle("Document") as HTMLIFrameElement
  const doc = iframe.contentDocument!
  doc.body.innerHTML = `<main><h1 id="title">Title</h1><details><summary>More</summary><details><summary>Nested</summary><p id="part">Target</p></details></details>
    <a data-markdown-link="#part" tabindex="0">Jump</a><a data-markdown-link="#%zz">Malformed</a>
    <a data-markdown-link="#absent">Missing</a><a data-markdown-link="#">Top</a>
    <a data-markdown-link="https://example.com">External</a></main>`
  const anchors = Array.from(doc.querySelectorAll<HTMLElement>("[id]"))
  for (const anchor of [...anchors, doc.body]) anchor.scrollIntoView = vi.fn()
  const scroll = vi
    .spyOn(doc.defaultView!, "scrollBy")
    .mockImplementation(() => {})
  fireEvent.load(iframe)
  expect(doc.documentElement.style.fontSize).toBe("16px")
  view.rerender(<PreviewFrame {...props} zoom={150} wide theme="slate" />)
  expect(doc.documentElement.style.fontSize).toBe("24px")
  expect(doc.querySelector("main")!.style.maxWidth).toBe("none")
  expect(doc.head.querySelector("style")!.textContent).toContain(
    "color-scheme: dark"
  )
  view.rerender(<PreviewFrame {...props} target={{ id: "part" }} />)
  expect(scroll).toHaveBeenCalled()
  fireEvent.click(doc.querySelector("a")!)
  expect(doc.querySelectorAll("details[open]")).toHaveLength(2)
  expect(doc.activeElement).toBe(anchors[1])
  const links = doc.querySelectorAll("a")
  fireEvent.keyDown(links[1]!, { key: "Enter" })
  fireEvent.click(links[2]!)
  expect(missing).toHaveBeenCalledTimes(2)
  fireEvent.click(links[3]!)
  expect(scroll).toHaveBeenCalled()
  const open = vi.spyOn(window, "open").mockReturnValue(null)
  fireEvent.click(links[4]!)
  expect(open).toHaveBeenCalledWith(
    "https://example.com",
    "_blank",
    "noopener,noreferrer"
  )
  view.rerender(<PreviewFrame {...props} target={{ id: "no-heading" }} />)
  expect(missing).toHaveBeenCalledTimes(3)
  expect(view.getByTitle("Document")).toBe(iframe)
  fireEvent.keyDown(doc, { key: "x" })
  fireEvent.click(doc.body)
})

test("forwards Escape to a focused workspace without enabling document scripts", () => {
  const props = {
    html: "",
    title: "Document",
    zoom: 100,
    wide: false,
    theme: "clean" as const,
    target: null,
    onMissing: vi.fn(),
  }
  const view = render(
    <dialog open>
      <PreviewFrame {...props} />
    </dialog>
  )
  const iframe = view.getByTitle("Document") as HTMLIFrameElement
  const doc = iframe.contentDocument!
  doc.body.innerHTML = "<main><p>Text</p></main>"
  const dialog = view.container.querySelector("dialog")!
  vi.spyOn(dialog, "matches").mockReturnValue(true)
  const close = vi.fn()
  Object.defineProperty(dialog, "requestClose", { value: close })
  act(() => fireEvent.load(iframe))
  fireEvent.keyDown(doc, { key: "Escape" })
  expect(close).toHaveBeenCalled()
  vi.spyOn(dialog, "matches").mockReturnValue(false)
  fireEvent.keyDown(doc, { key: "Escape" })
  expect(close).toHaveBeenCalledTimes(1)
})
