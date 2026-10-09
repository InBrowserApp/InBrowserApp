// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { ChapterFrame } from "./chapter-frame"
import type { Destination } from "@workspace/ui/lib/book-reader"

beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    }
  )
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

test.each(["element", "range"])(
  "keeps %s chapter navigation inside the book viewport",
  (kind) => {
    const destination: Destination = {
      index: 0,
      anchor: (doc) => {
        const target = doc.getElementById("chapter")!
        if (kind === "element") return target
        const range = doc.createRange()
        range.selectNodeContents(target)
        range.getBoundingClientRect = () => ({ top: 480 }) as DOMRect
        return range
      },
    }
    render(
      <ChapterFrame
        html=""
        title="Book"
        size={18}
        wide={false}
        destination={destination}
        onLink={vi.fn()}
        onResourceError={vi.fn()}
      />
    )
    const frame = screen.getByTitle("Book") as HTMLIFrameElement
    const doc = frame.contentDocument!
    doc.body.innerHTML = '<h2 id="chapter">Chapter</h2>'
    const heading = doc.getElementById("chapter")!
    vi.spyOn(heading, "getBoundingClientRect").mockReturnValue({
      top: 480,
    } as DOMRect)
    const into = vi.fn()
    heading.scrollIntoView = into
    const scroll = vi
      .spyOn(doc.defaultView!, "scrollBy")
      .mockImplementation(() => {})
    const outerScroll = vi
      .spyOn(window, "scrollBy")
      .mockImplementation(() => {})

    fireEvent.load(frame)

    expect(scroll).toHaveBeenLastCalledWith(0, 480)
    expect(outerScroll).not.toHaveBeenCalled()
    expect(into).not.toHaveBeenCalled()
  }
)

test("restores focus after returning to the text without scrolling ancestors", () => {
  render(
    <ChapterFrame
      html=""
      title="Book"
      size={18}
      wide={false}
      destination={{
        index: 0,
        position: { path: [99], top: 0, left: 0, scrollX: 0, scrollY: 120 },
      }}
      onLink={vi.fn()}
      onResourceError={vi.fn()}
    />
  )
  const frame = screen.getByTitle("Book") as HTMLIFrameElement
  const view = frame.contentWindow!
  Object.defineProperty(view, "frameElement", { value: frame })
  const focus = vi.spyOn(frame, "focus")
  const scroll = vi.spyOn(view, "scrollTo").mockImplementation(() => {})

  fireEvent.load(frame)

  expect(scroll).toHaveBeenCalledWith(0, 120)
  expect(focus).toHaveBeenCalledWith({ preventScroll: true })
})
