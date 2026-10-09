// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import {
  captureReadingLocation,
  restoreReadingLocation,
} from "./reading-location"

const mock = vi.hoisted(() => ({ position: vi.fn() }))
vi.mock("./reading-position", () => ({ readingPosition: mock.position }))
beforeEach(() => {
  document.body.innerHTML = "<section><p>A visible line of text.</p></section>"
  vi.spyOn(window, "scrollBy").mockImplementation(() => {})
  vi.spyOn(window, "scrollTo").mockImplementation(() => {})
})
afterEach(() => vi.restoreAllMocks())

test("restores the visible character after its chapter document is recreated", () => {
  const target = document.createRange()
  target.setStart(document.querySelector("p")!.firstChild!, 4)
  target.setEnd(target.startContainer, 5)
  mock.position.mockReturnValue({ target, top: 12, left: 40 })
  const location = captureReadingLocation(document)
  expect(location.path).toEqual([0, 0, 0])
  expect(location.offset).toBe(4)
  document.body.innerHTML = "<section><p>A visible line of text.</p></section>"
  vi.spyOn(document, "createRange").mockReturnValue(
    Object.assign(document.createRange(), {
      getBoundingClientRect: () => ({ top: 250, left: 44 }),
    })
  )
  restoreReadingLocation(document, location)
  expect(window.scrollBy).toHaveBeenCalledWith(4, 238)
})
test("restores an element fallback or stored scroll when a target disappears", () => {
  mock.position.mockReturnValue({
    target: document.querySelector("p"),
    top: 20,
    left: 0,
  })
  const location = captureReadingLocation(document)
  vi.spyOn(
    document.querySelector("p")!,
    "getBoundingClientRect"
  ).mockReturnValue({ top: 150, left: 0 } as DOMRect)
  restoreReadingLocation(document, location)
  expect(window.scrollBy).toHaveBeenCalledWith(0, 130)
  document.body.innerHTML = ""
  restoreReadingLocation(document, location)
  expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
})
test("captures the top of an empty reading surface without a target", () => {
  mock.position.mockReturnValue(null)
  expect(captureReadingLocation(document)).toMatchObject({
    path: [],
    top: 0,
    left: 0,
  })
})
