import { afterEach, expect, test, vi } from "vitest"
import { scrollReadingTarget } from "./scroll-reading-target"

afterEach(() => {
  vi.restoreAllMocks()
  document.body.innerHTML = ""
})

test("scrolls only the target document, retaining its horizontal position", () => {
  const frame = document.createElement("iframe")
  document.body.append(frame)
  const doc = frame.contentDocument!
  const scroll = vi.spyOn(doc.defaultView!, "scrollBy")
  const outerScroll = vi.spyOn(window, "scrollBy")
  const target = doc.createElement("p")
  doc.body.append(target)
  vi.spyOn(target, "getBoundingClientRect").mockReturnValue({
    top: 420.5,
    left: -120,
  } as DOMRect)
  const into = vi.fn()
  target.scrollIntoView = into

  scrollReadingTarget(doc, target)

  expect(scroll).toHaveBeenCalledExactlyOnceWith(0, 420.5)
  expect(outerScroll).not.toHaveBeenCalled()
  expect(into).not.toHaveBeenCalled()
})

test("accepts text ranges and ignores missing targets or detached documents", () => {
  const scroll = vi.spyOn(window, "scrollBy")
  const range = document.createRange()
  range.getBoundingClientRect = () => ({ top: -32.5 }) as DOMRect
  scrollReadingTarget(document, range)
  expect(scroll).toHaveBeenCalledExactlyOnceWith(0, -32.5)
  scrollReadingTarget(document, null)
  scrollReadingTarget(document, undefined)
  scrollReadingTarget(document.implementation.createHTMLDocument(), range)
  expect(scroll).toHaveBeenCalledOnce()
})
