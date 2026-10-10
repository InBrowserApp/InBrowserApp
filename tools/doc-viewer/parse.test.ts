// @vitest-environment jsdom
import { readFileSync } from "node:fs"
import { find, read, utils, write } from "cfb"
import { expect, test } from "vitest"
import { parseDocument } from "./parse"
import { inspectDocument } from "@workspace/legacy-doc"
import { failure } from "./failure"
import { preparePreview } from "./preview"
import m from "./messages/en.json"

function fixture(name = "reading.doc") {
  return Uint8Array.from(readFileSync(`tools/doc-viewer/fixtures/${name}`))
    .buffer
}
function container(streams: Record<string, Uint8Array>) {
  const cfb = utils.cfb_new()
  for (const [name, content] of Object.entries(streams))
    utils.cfb_add(cfb, name, content)
  return Uint8Array.from(write(cfb, { type: "array" }) as Uint8Array).buffer
}
function mutateWord(change: (word: Uint8Array) => void) {
  const cfb = read(new Uint8Array(fixture()), { type: "array" })
  const word = find(cfb, "/WordDocument")!
  const content = Uint8Array.from(word.content)
  change(content)
  word.content = content
  return Uint8Array.from(write(cfb, { type: "array" }) as Uint8Array).buffer
}

test("reads real LibreOffice DOC text, tables, lists, embedded images and accepted revisions", () => {
  const source = parseDocument(fixture(), "reading.doc")
  const preview = preparePreview(source, m)
  const doc = new DOMParser().parseFromString(preview.html, "text/html")
  const text = doc.body.textContent
  expect(text).toContain("中文测试：山水与城市")
  expect(text).toContain("Русский текст")
  expect(text).toContain("ADDED TEXT")
  expect(text).not.toContain("REMOVED TEXT")
  expect(text).not.toContain("Original running header")
  expect(text).not.toContain("Original running footer")
  expect(doc.querySelectorAll("table")).toHaveLength(1)
  expect(doc.querySelector("table")?.textContent).toContain("2.50 m")
  expect(doc.querySelector("ol")?.textContent).toContain("Measure the water")
  expect(doc.querySelector("ul")?.textContent).toContain("Pebbles")
  expect(doc.querySelector("img")?.getAttribute("src")).toMatch(
    /^data:image\/png;base64,/
  )
  expect(doc.querySelector(".msdoc-page-break")).toBeTruthy()
  expect(preview.outline).toHaveLength(18)
  expect(preview.outline.at(-1)?.label).toBe("Field note 15")
  expect(preview.limited).toBe(true)
  expect(source.template).toBe(false)
})

test("reports omitted footnotes and preserves readable main text", () => {
  const source = parseDocument(fixture("river-survey.doc"), "river.doc")
  expect(source.limited).toBe(true)
  const text = new DOMParser().parseFromString(source.html, "text/html").body
    .textContent
  expect(text).toContain("A footnote reference")
  expect(text).not.toContain("This is the original note text")
})

test("accepts the WPS-compatible FIB variant and saved templates", () => {
  const bytes = mutateWord((word) => {
    new DataView(word.buffer).setUint16(2, 0xbf, true)
    word[10]! |= 1
  })
  expect(parseDocument(bytes, "source.wps").template).toBe(true)
  expect(parseDocument(fixture(), "source.WPT").template).toBe(true)
})

test("handles HTML-in-OLE with more than 1,000 paragraphs without truncating", () => {
  const body = Array.from(
    { length: 1101 },
    (_, index) => `<p>Observation ${index + 1}</p>`
  ).join("")
  const bytes = container({
    WordDocument: new TextEncoder().encode(`<html><body>${body}</body></html>`),
  })
  const source = parseDocument(bytes, "notes.wps")
  expect(source.html).toContain("Observation 1101")
  expect(source.limited).toBe(true)
  expect(source.template).toBe(false)
})

test.each([0x0100, 0x8100])(
  "detects password encryption or obfuscation (flag %s) before content parsing",
  (flag) => {
    const bytes = mutateWord((word) => {
      const view = new DataView(word.buffer)
      view.setUint16(10, view.getUint16(10, true) | flag, true)
    })
    expect(() => parseDocument(bytes, "protected.doc")).toThrow("protected")
  }
)

test("distinguishes encrypted containers, unrelated formats, damaged metadata and older binary variants", () => {
  expect(() =>
    inspectDocument(
      container({ EncryptedPackage: new Uint8Array([1]) }),
      "protected.doc"
    )
  ).toThrow("protected")
  expect(() =>
    inspectDocument(container({ Workbook: new Uint8Array([1]) }), "book.wps")
  ).toThrow("unsupported")
  expect(() =>
    inspectDocument(
      new TextEncoder().encode("Microsoft Works data").buffer,
      "old.wps"
    )
  ).toThrow("unsupported")
  const short = fixture().slice(0, 128)
  expect(() => inspectDocument(short, "broken.doc")).toThrow("invalid")
  const invalid = fixture()
  new DataView(invalid).setUint16(32, 5, true)
  expect(() => inspectDocument(invalid, "broken.doc")).toThrow("invalid")
  const old = mutateWord((word) =>
    new DataView(word.buffer).setUint16(2, 0x65, true)
  )
  expect(() => inspectDocument(old, "old.doc")).toThrow("unsupported")
  const badMagic = mutateWord((word) =>
    new DataView(word.buffer).setUint16(0, 0, true)
  )
  expect(() => inspectDocument(badMagic, "other.wps")).toThrow("unsupported")
  expect(() =>
    inspectDocument(
      container({ WordDocument: new Uint8Array(12) }),
      "short.doc"
    )
  ).toThrow("invalid")
  for (const offset of [32, 62]) {
    const malformed = mutateWord((word) =>
      new DataView(word.buffer).setUint16(offset, 65535, true)
    )
    expect(() => inspectDocument(malformed, "bad.doc")).toThrow("invalid")
  }
  const v4 = fixture()
  const h = new DataView(v4)
  h.setUint16(26, 4, true)
  h.setUint16(30, 12, true)
  expect(() => inspectDocument(v4, "v4.doc")).toThrow("unsupported")
})

test.each(["emptyFile", "protected", "unsupported", "resourceLimit"])(
  "preserves expected failure %s",
  (message) => expect(failure(new Error(message))).toBe(message)
)
test.each([
  new RangeError("Invalid array length"),
  new Error("allocation failed"),
  new Error("Array buffer allocation failed"),
])("reports browser allocation failure", (error) =>
  expect(failure(error)).toBe("resourceLimit")
)
test("does not expose internal parser errors", () => {
  expect(failure(new Error("parser detail"))).toBe("invalid")
  expect(failure(null)).toBe("invalid")
})

test("ignores the obfuscation bit when encryption is absent, as required by FibBase", () => {
  const bytes = mutateWord((word) => (word[11]! |= 0x80))
  expect(() => parseDocument(bytes, "readable.doc")).not.toThrow()
})
