// @vitest-environment jsdom
import { afterEach, expect, test, vi } from "vitest"
import { readingPosition } from "./reading-position"

function bounds(top: number, left = 20) {
  return {
    top,
    bottom: top + 20,
    left,
    right: left + 10,
    width: 10,
    height: 20,
  } as DOMRect
}
const original = Object.getOwnPropertyDescriptor(
  Range.prototype,
  "getBoundingClientRect"
)
afterEach(() => {
  vi.restoreAllMocks()
  delete (document as Partial<Document>).caretPositionFromPoint
  delete (document as Partial<Document>).caretRangeFromPoint
  if (original)
    Object.defineProperty(Range.prototype, "getBoundingClientRect", original)
  else delete (Range.prototype as Partial<Range>).getBoundingClientRect
  document.body.innerHTML = ""
})
function sample() {
  document.body.innerHTML =
    "<h1>Chapter</h1><p>Beginning <em>a long passage</em> to read.</p>"
  const paragraph = document.querySelector("p")!
  const text = paragraph.querySelector("em")!.firstChild!
  vi.spyOn(document.body, "getBoundingClientRect").mockReturnValue({
    ...bounds(0),
    width: 600,
  } as DOMRect)
  vi.spyOn(
    document.querySelector("h1")!,
    "getBoundingClientRect"
  ).mockReturnValue(bounds(-100))
  vi.spyOn(paragraph, "getBoundingClientRect").mockReturnValue({
    ...bounds(-300),
    bottom: 2000,
  } as DOMRect)
  Object.defineProperty(Range.prototype, "getBoundingClientRect", {
    configurable: true,
    value: () => bounds(4, 40),
  })
  return { paragraph, text }
}

test("anchors the character visible within a multi-screen paragraph instead of its start", () => {
  const { text } = sample()
  document.caretPositionFromPoint = vi
    .fn()
    .mockReturnValue({ offsetNode: text, offset: 7 })
  const position = readingPosition(document)!
  expect(position.target).toBeInstanceOf(Range)
  const range = position.target as Range
  expect(range.startContainer).toBe(text)
  expect(range.startOffset).toBe(7)
  expect(range.toString()).toBe("p")
  expect(position).toMatchObject({ top: 4, left: 40 })
  expect(document.caretPositionFromPoint).toHaveBeenCalledWith(320, 16)
})

test("supports the range-based caret API used by WebKit", () => {
  const { text } = sample()
  const range = document.createRange()
  range.setStart(text, 2)
  range.collapse(true)
  document.caretRangeFromPoint = vi.fn().mockReturnValue(range)
  expect((readingPosition(document)!.target as Range).toString()).toBe("l")
})

test("captures the final character when the caret is at the end of a text node", () => {
  const { text } = sample()
  document.caretPositionFromPoint = vi
    .fn()
    .mockReturnValue({ offsetNode: text, offset: text.textContent!.length })
  expect((readingPosition(document)!.target as Range).toString()).toBe("e")
})

test.each(["no API", "element caret", "above viewport", "below viewport"])(
  "falls back to a visible element for %s",
  (mode) => {
    const { paragraph, text } = sample()
    if (mode !== "no API") {
      document.caretPositionFromPoint = vi.fn().mockReturnValue({
        offsetNode: mode === "element caret" ? paragraph : text,
        offset: 0,
      })
      if (mode !== "element caret")
        Object.defineProperty(Range.prototype, "getBoundingClientRect", {
          configurable: true,
          value: () => bounds(mode === "above viewport" ? -100 : 5000),
        })
    }
    expect(readingPosition(document)).toEqual({
      target: paragraph,
      left: 20,
      top: -300,
    })
  }
)

test("handles documents with no available text or visible fallback element", () => {
  document.body.innerHTML = "<div></div>"
  expect(readingPosition(document)).toBeNull()
})

test.each(["pre", "code"])(
  "falls back to visible %s text when caret APIs are absent",
  (tag) => {
    document.body.innerHTML = `<${tag}>A plain-text message</${tag}>`
    const target = document.querySelector(tag)!
    vi.spyOn(target, "getBoundingClientRect").mockReturnValue(bounds(8))
    expect(readingPosition(document)).toEqual({ target, left: 20, top: 8 })
  }
)

test("keeps an empty text caret valid without requesting an out-of-range offset", () => {
  const { paragraph } = sample()
  const empty = document.createTextNode("")
  paragraph.append(empty)
  document.caretPositionFromPoint = vi
    .fn()
    .mockReturnValue({ offsetNode: empty, offset: 0 })
  expect((readingPosition(document)!.target as Range).toString()).toBe("")
})
